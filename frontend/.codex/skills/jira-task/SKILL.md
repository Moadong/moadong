---
name: "jira-task"
description: "기존 모아동 Jira 스토리 키를 기반으로 GitHub 이슈, Jira 하위 작업, 브랜치를 생성할 때 사용한다. /jira-task 또는 Jira 스토리에서 구현 태스크 생성을 요청할 때 사용한다."
---

# 모아동 Jira 태스크

## Codex 적용 규칙

- Claude slash command의 인자 참조는 사용자의 현재 요청으로 해석한다.
- Claude 전용 `allowed-tools` 메타데이터는 무시하고, 현재 Codex 세션에서 제공되는 도구를 사용한다.
- 원본이 Claude 서브에이전트 호출을 지시하면, Codex에서 명시적인 서브에이전트 도구가 있고 적절한 경우를 제외하고 해당 에이전트 지침을 직접 따라 작업한다.
- 모든 작업은 저장소의 `AGENTS.md` 지침을 우선해서 따른다.

## Source: `.claude/commands/jira-task.md`

Jira 스토리 키를 기반으로 GitHub 이슈(하위 작업 + 브랜치)를 자동 생성합니다.

## 흐름

1. **상위 스토리 키**: "상위 Jira 스토리 키를 입력해주세요. (예: MOA-874)"

2. **분기 브랜치**: "분기할 브랜치를 선택해주세요. (기본값: develop-fe)" — `develop-fe` 또는 `develop/be`

3. **마감일**: "마감일을 입력해주세요. (없으면 Enter → 오늘 날짜, 예: 2026-05-25)" — YYYY-MM-DD 형식, 미입력 시 오늘 날짜 자동 설정

4. 입력받은 키로 **Jira API를 호출**하여 스토리 정보를 자동 조회합니다:

```bash
source .env 2>/dev/null
jq -n '{"jql":"key=<스토리키>","fields":["summary","description"]}' > /tmp/jql.json
curl -s -X POST -u "${JIRA_EMAIL}:${JIRA_API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @/tmp/jql.json \
  "https://${JIRA_HOST}/rest/api/3/search/jql"
```

5. 조회된 정보를 기반으로 **자동 생성**합니다:
   - **제목**: Jira 스토리 제목과 동일하게 사용
   - **담당자**: git config user.name으로 자동 설정
   - **브랜치명**: 라벨에 맞는 접두사 + 제목의 핵심 키워드를 영문 kebab-case로 변환하여 `<접두사>/<설명>` 형식으로 생성. GitHub Actions가 이슈번호와 MOA 키를 자동으로 붙여줌
   - **태스크(체크리스트)**: 인수 조건(description에서 "✅ 인수 조건" 이후 텍스트)을 분석하여 `- [ ] 항목` 형식으로 자동 생성. 인수 조건이 없으면 `- [ ] Task1` 기본값 사용
   - **라벨**: 제목과 설명을 분석하여 가장 적절한 GitHub 라벨을 자동 선택

6. 자동 생성된 내용을 **사용자에게 보여주고 확인**받습니다:

```
📋 자동 생성 결과:
  제목: Jira 스토리 생성 스크립트 개선 (Windows 호환성, 자동 스프린트/담당자/에픽 지정)
  담당자: suhyun113
  상위 스토리: MOA-874
  브랜치명: refactor/jira-story-script-improve
  분기 브랜치: develop-fe
  라벨: 🔨 Refactor
  마감일: 2026-05-18
  태스크:
    - [ ] jq 미설치 시 OS별 안내 메시지 출력
    - [ ] Windows에서 JSON payload 정상 전달
    ...

이대로 생성할까요? (수정할 항목이 있으면 알려주세요)
```

6. 확인 후 실행합니다:

```bash
./scripts/jira-task.sh "제목" "담당자" "MOA-xxx" "브랜치명" "분기브랜치" "" "태스크" "라벨" "마감일"
```

## 규칙

- 제목은 항상 Jira 스토리 제목과 동일하게 사용합니다.
- 담당자는 `git config user.name`의 값을 사용합니다. 유효한 담당자 목록: seongwon030, oesnuj, Zepelown, PororoAndFriends, lepitaaar, suhyun113, alsdddk, yw6938, seongje973
- 브랜치명은 `<접두사>/<설명>` 형식으로 생성합니다. GitHub Actions가 이슈번호(#xxx)와 Jira 키(MOA-xxx)를 자동으로 붙여줍니다.
  - 접두사는 작업 성격 라벨에 따라 결정:
    - `✨ Feature` → `feature/`
    - `🛠Fix`, `🐞 Bug` → `fix/`
    - `🔨 Refactor` → `refactor/`
    - `🎨 Design` → `design/`
    - `⚙ Setting`, `📦 CI/CD` → `chore/`
    - `📃 Docs` → `docs/`
    - `✅ Test` → `test/`
    - `🚁AI` → `feature/`
  - 설명은 제목의 핵심 키워드를 영문 kebab-case로 변환합니다.
- 태스크는 인수 조건의 각 항목을 `- [ ]` 체크리스트로 변환합니다. 인수 조건이 여러 문장이면 각각 별도 항목으로 분리합니다.
- 라벨은 **작업 성격 라벨 + 영역 라벨** 조합으로 지정합니다. `--label` 플래그를 여러 번 사용하여 복수 라벨을 전달합니다.
  - **영역 라벨** (분기 브랜치에 따라 자동 결정):
    - `develop-fe` → `💻 FE`
    - `develop/be` → `💾 BE`
  - **작업 성격 라벨** (제목과 설명을 분석하여 선택, 기본값 `✨ Feature`):
    - `✨ Feature` — 새로운 기능 개발
    - `🐞 Bug` — 버그 수정
    - `🛠Fix` — 기능이 의도대로 동작하지 않는 수정
    - `🔨 Refactor` — 코드 리팩토링, 구조 개선
    - `🎨 Design` — 마크업, 스타일링
    - `📬 API` — 서버 API 통신 작업
    - `⚙ Setting` — 개발 환경 세팅
    - `📃 Docs` — 문서 작성 및 수정
    - `✅ Test` — 테스트 관련
    - `📦 CI/CD` — CI/CD 관련
    - `🚁AI` — Claude, Codex 활용
- 분기 브랜치는 사용자에게 직접 물어봅니다. 기본값은 `develop-fe`입니다.
- 실행 후 GitHub 이슈 URL을 출력합니다.
- GitHub Actions(common-jira-create.yml)이 자동으로 Jira 하위 작업과 브랜치를 생성합니다.
