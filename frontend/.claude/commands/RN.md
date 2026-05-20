---
description: React Native 프로젝트 분석 및 수정을 RN 에이전트에게 위임
allowed-tools: Agent
---

RN(React Native) 프로젝트 작업을 RN에이전트 서브에이전트에게 위임합니다.

## 작업 내용

$ARGUMENTS

## 지시사항

`$ARGUMENTS`가 비어 있으면, 사용자에게 어떤 RN 관련 작업이 필요한지 물어본 뒤 RN에이전트를 호출하세요.

Agent 툴로 `RN에이전트` 서브에이전트를 호출하여 위 작업을 처리하세요.

다음 컨텍스트를 에이전트에게 전달하세요:

- RN 프로젝트 경로: `/Users/seokyoung-won/Desktop/moadong-react-native/`
- 현재 프론트엔드 프로젝트 경로: `/Users/seokyoung-won/Desktop/moadong/frontend/`
- 두 프로젝트가 WebView로 연동되어 있음 (프론트엔드 웹 → RN WebView)
