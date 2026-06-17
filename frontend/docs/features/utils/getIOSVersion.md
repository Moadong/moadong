# iOS OS 버전 Mixpanel 트래킹

Mixpanel 웹 SDK(`mixpanel-browser`)는 `$os_version`을 수집하지 않는다. 기본 자동 속성에는 OS 이름(`$os`)만 있고 OS 버전 항목 자체가 없으며, `$browser_version`은 브라우저 앱 버전이라 OS 버전 판별에 쓸 수 없다. 이 때문에 iOS 버전별(예: iOS 14 미만) 사용자 필터링이 불가능했다.

이를 보완하기 위해 `navigator.userAgent`에서 iOS OS 버전을 직접 파싱해 `major.minor` 형식 문자열로 추출하고, `mixpanel.init` 직후 `mixpanel.register`로 `$os_version` 슈퍼 프로퍼티에 등록한다. 등록 이후 모든 이벤트에 자동 부착되며, 네이티브 iOS Mixpanel SDK와 동일한 속성명·포맷("17.2")이라 웹/앱 데이터가 같은 속성으로 통합된다.

iOS가 아니거나 UA에서 버전을 못 찾으면 등록하지 않는다. macOS는 최근 브라우저의 UA freeze(`Mac OS X 10_15_7` 고정)로 버전 신뢰성이 없어 대상에서 제외했다.

## 주의

- 슈퍼 프로퍼티는 등록 시점 이후 이벤트에만 부착되고 과거 이벤트엔 소급되지 않는다.
- `$os_version`은 문자열이므로 "iOS 14 미만" 같은 필터는 숫자 비교(less than)로 걸어야 사전순 비교 오류(`"9" > "14"`)를 피할 수 있다.

## 관련 코드

- `src/utils/getIOSVersion.ts` — UA에서 iOS OS 버전을 `major.minor`로 추출 (iOS 아니면 `null`)
- `src/utils/initSDK.ts` — `initializeMixpanel`에서 `mixpanel.register({ $os_version })` 등록
- `src/utils/getIOSVersion.test.ts` — iPhone/iPad/patch/macOS/Android 파싱 테스트
