#!/usr/bin/env bash
# Sentry production에 새로 생긴 이슈를 GitHub 이슈로 옮긴다.
# 수정 PR은 여기서 만들지 않는다. 사람이 `sentry-fix` 라벨을 붙이면 sentry-fix.yml이 처리한다.
#
# 필요한 환경변수: SENTRY_READ_TOKEN(event:read, project:read), GH_TOKEN, REPO(owner/name)
# DRY_RUN=1이면 GitHub 이슈를 만들지 않고 만들 내용만 출력한다.
#
# Sentry 조회가 실패하면 curl -f가 0이 아닌 코드로 끝나고, set -e로 job 전체가 실패한다.
# 조용히 넘어가면 "새 에러 없음"과 "조회 실패"가 구분되지 않는다.
set -euo pipefail

: "${SENTRY_READ_TOKEN:?}" "${GH_TOKEN:?}" "${REPO:?}"

SENTRY_API=https://sentry.io/api/0
SENTRY_ORG=moadong
SENTRY_PROJECT=moadong
# 하루 한 번 돌지만 cron이 밀리거나 한 번 실패해도 놓치지 않게 7일을 본다. 이미 옮긴 이슈는 제목으로 걸러진다.
# NetworkError는 사용자 네트워크 문제라 코드로 고칠 대상이 아니다(Sentry fingerprint로 한 이슈에 묶여 있다).
QUERY='is:unresolved firstSeen:-7d environment:production !error.type:NetworkError'
# DSN은 공개라 이벤트를 위조해 이슈를 쏟아낼 수 있다. 한 번에 만드는 수를 제한하고 나머지는 다음 실행으로 넘긴다.
MAX_CREATE=10

sentry_get() {
  curl -sSf --retry 2 -H "Authorization: Bearer $SENTRY_READ_TOKEN" "$SENTRY_API$1"
}

project_id=$(sentry_get "/projects/$SENTRY_ORG/$SENTRY_PROJECT/" | jq -r '.id')
issues=$(sentry_get "/organizations/$SENTRY_ORG/issues/?project=$project_id&statsPeriod=14d&sort=new&limit=100&query=$(jq -rn --arg q "$QUERY" '$q|@uri')")

echo "Sentry 신규 이슈 $(jq length <<<"$issues")건"

if [[ "${DRY_RUN:-}" != "1" ]]; then
  gh label create sentry --repo "$REPO" --force --color FB4226 --description "Sentry에서 옮긴 에러"
  gh label create sentry-fix --repo "$REPO" --force --color 5319E7 --description "붙이면 에이전트가 Sentry 에러 수정 PR을 시도한다"
fi

# 이미 옮긴 이슈는 제목 앞의 `[Sentry <shortId>]`로 알아본다. 닫힌 이슈도 포함해야 재생성되지 않는다.
existing_titles=$(gh issue list --repo "$REPO" --state all --label sentry --limit 500 --json title --jq '.[].title')

# 공개 레포라 이슈는 누구나 본다. 에러 제목·메시지·URL에 섞일 수 있는 식별자를 가린다.
# 사용자 입력이 섞이기 쉬운 브레드크럼(콘솔·요청 URL·클릭 문구)은 아예 옮기지 않는다.
# 전체 이벤트는 Sentry 링크(조직 멤버만 열람)에서 본다.
JQ_MASK='def mask: gsub("[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}"; "<email>")
  | gsub("eyJ[A-Za-z0-9_-]+\\.[A-Za-z0-9_-]+(\\.[A-Za-z0-9_-]+)?"; "<jwt>")
  | gsub("\\b[0-9a-fA-F]{24}\\b"; "<id>")
  | gsub("0[0-9]{1,2}-?[0-9]{3,4}-?[0-9]{4}"; "<phone>")
  | gsub("[0-9]{6,}"; "<num>");'

created=0
jq -c '.[]' <<<"$issues" | while read -r issue; do
  short_id=$(jq -r '.shortId' <<<"$issue")
  prefix="[Sentry $short_id]"
  if grep -qF -- "$prefix" <<<"$existing_titles"; then
    echo "건너뜀 $short_id: 이미 있음"
    continue
  fi
  if (( created >= MAX_CREATE )); then
    echo "::warning::한 번에 만드는 이슈 수($MAX_CREATE)를 넘어 $short_id 이후는 다음 실행으로 넘긴다."
    break
  fi

  issue_id=$(jq -r '.id' <<<"$issue")
  # 목록 조회 실패는 job을 실패시키지만, 이슈 하나의 이벤트 조회·변환 실패는 그 이슈만 건너뛴다.
  # 막힌 이슈 하나 때문에 7일 동안 그 뒤 이슈가 전부 멈추지 않게 한다.
  if ! event=$(sentry_get "/organizations/$SENTRY_ORG/issues/$issue_id/events/latest/"); then
    echo "::warning::$short_id 최신 이벤트를 받지 못해 건너뛴다."
    continue
  fi

  title="$prefix $(jq -r "$JQ_MASK"' .title | mask | .[0:200]' <<<"$issue")"
  body=$(jq -rn --argjson issue "$issue" --argjson event "$event" "$JQ_MASK"'
    def tag($k): ([$event.tags[]? | select(.key == $k) | .value][0] // "-");
    def frame_line: "\(.filename // .absPath // "?"):\(.lineNo // "?"):\(.colNo // "?") (\(.function // "?"))";
    def fenced: tostring | gsub("```"; "'"'''"'");
    def span: tostring | mask | gsub("`"; "'"'"'");
    ([$event.entries[]? | select(.type == "exception") | .data.values[]?]) as $exceptions
    | [
        "<!-- sentry-issue-id: \($issue.id) -->",
        "## Sentry",
        "- 이슈: [\($issue.shortId)](\($issue.permalink))",
        "- 처음 발생: \($issue.firstSeen) / 이벤트 \($issue.count)건 / 사용자 \($issue.userCount)명",
        "- culprit: `\($issue.culprit // "-" | span)`",
        "- url: `\(tag("url") | split("?")[0] | split("#")[0] | span)`",
        "- 환경: `\(tag("browser") | span)` / `\(tag("os") | span)` / webview `\(tag("webview") | span)`",
        "",
        "## 예외 (최신 이벤트)",
        ($exceptions[]
          | [.stacktrace.frames[]? | select(.inApp)] as $app
          # 라이브러리 안에서 터지면 앱 프레임이 0개다. 그때는 가장 안쪽 프레임을 그대로 보여 준다.
          | (if ($app | length) > 0 then $app else [.stacktrace.frames[]?][-5:] end) as $frames
          | "#### `\(.type // "Error" | span)`",
          "```",
          (.value // "" | mask | fenced),
          "```",
          "",
          (if ($app | length) > 0 then "앱 코드 프레임 (안쪽이 아래, 최대 15개)"
           else "앱 코드 프레임 없음. 가장 안쪽 프레임 5개 (안쪽이 아래)" end),
          "```",
          ($frames[-15:][] | frame_line | mask | fenced),
          "```",
          "",
          "가장 안쪽 프레임 주변 코드",
          "```",
          ($frames[-1:][] | .context[]? | "\(.[0]) | \(.[1] // "" | fenced)"),
          "```",
          ""
        ),
        "## 다음 단계",
        "수정 PR이 필요하면 `sentry-fix` 라벨을 붙여 주세요. 자동화가 원인을 분석해 검증을 통과한 수정 브랜치와 PR 만들기 링크를 남기거나, 확정하지 못하면 분석만 댓글로 남깁니다.",
        "Sentry DSN은 공개라 이벤트를 위조할 수 있습니다. 라벨을 붙이기 전에 위 내용이 실제 코드와 맞는지 확인해 주세요."
      ]
    | join("\n")
    | .[0:60000]
  ') || { echo "::warning::$short_id 본문 변환에 실패해 건너뛴다."; continue; }

  created=$((created + 1))
  if [[ "${DRY_RUN:-}" == "1" ]]; then
    printf '=== %s\n%s\n\n' "$title" "$body"
    continue
  fi

  gh issue create --repo "$REPO" --title "$title" --label sentry --body-file - <<<"$body"
done
