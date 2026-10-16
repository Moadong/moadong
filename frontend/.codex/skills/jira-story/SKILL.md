---
name: "jira-story"
description: "모아동 Jira 스토리를 대화형으로 생성하고 선택적으로 연결된 GitHub 이슈와 브랜치를 만들 때 사용한다. /jira-story 또는 기능 요청에서 Jira 스토리 생성을 요청할 때 사용한다."
---

# 모아동 Jira 스토리

## Codex 적용 규칙

- Claude slash command의 인자 참조는 사용자의 현재 요청으로 해석한다.
- Claude 전용 `allowed-tools` 메타데이터는 무시하고, 현재 Codex 세션에서 제공되는 도구를 사용한다.
- 원본이 Claude 서브에이전트 호출을 지시하면, Codex에서 명시적인 서브에이전트 도구가 있고 적절한 경우를 제외하고 해당 에이전트 지침을 직접 따라 작업한다.
- 모든 작업은 저장소의 `AGENTS.md` 지침을 우선해서 따른다.

## Source: `.claude/commands/jira-story.md`

Jira 스토리를 대화형으로 생성합니다.

다음 순서로 사용자에게 질문하세요:

1. **제목**: "스토리 제목을 입력해주세요. (예: 사용자는 동아리 카드를 클릭하여 상세 페이지로 이동할 수 있다)"
2. **설명**: "스토리 설명을 입력해주세요. (없으면 Enter)" — 선택사항
3. **인수 조건**: "인수 조건(Acceptance Criteria)을 입력해주세요. (없으면 Enter)" — 선택사항

모든 입력이 완료되면 아래 명령을 실행하세요:

```bash
./scripts/jira-story.sh "제목" "설명" "인수조건"
```

- 설명이나 인수 조건이 없으면 빈 문자열("")로 전달합니다.
- 실행 후 생성된 스토리 키와 링크를 그대로 출력합니다.
- `JIRA_EMAIL` 또는 `JIRA_API_TOKEN` 환경 변수가 없으면 설정 방법을 안내합니다.

---

## GitHub 이슈 (하위 작업 + 브랜치) 연동

스토리 생성 후 바로 이어서 물어보세요:

"GitHub 이슈(Jira 하위 작업 + 브랜치)도 함께 생성할까요?"

**Yes인 경우** 아래 순서로 추가 질문:

4. **담당자**: "담당자를 선택해주세요." — seongwon030 / oesnuj / Zepelown / PororoAndFriends / lepitaaar / suhyun113 / alsdddk / yw6938 / seongje973 중 선택
5. **브랜치명**: "브랜치명을 입력해주세요. (예: feature/add-login-page)"
6. **분기 브랜치**: "분기할 브랜치를 입력해주세요. (기본값: develop-fe)" — 선택사항
7. **태스크**: "체크리스트를 입력해주세요. (없으면 Enter)" — 선택사항, 기본값 `- [ ] Task1`

모든 입력이 완료되면:

```bash
./scripts/jira-task.sh "제목" "담당자" "MOA-xxx" "브랜치명" "분기브랜치" "" "태스크"
```

- `MOA-xxx`는 앞서 생성된 스토리 키를 그대로 사용합니다.
- 분기 브랜치 미입력 시 `develop-fe` 사용합니다.
- 태스크 미입력 시 `- [ ] Task1` 기본값 사용합니다.
- 실행 후 GitHub 이슈 URL을 출력합니다.
- GitHub Actions이 자동으로 Jira 하위 작업과 브랜치를 생성합니다.
