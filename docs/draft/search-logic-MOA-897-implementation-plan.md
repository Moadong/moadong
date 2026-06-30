# MOA-897 동아리 검색 로직 구현계획

## 목표

기존 `GET /api/club/search/` API 계약은 유지하고, 검색어가 있을 때만 이름 매칭 품질 중심으로 결과를 정렬한다.

검색어가 없을 때는 기존 탐색 정렬을 유지한다.

## 최종 검색 흐름

```text
요청: keyword, recruitmentStatus, division, category
  |
  v
1. DB에서 기본 후보 조회
   - state == AVAILABLE
   - recruitmentStatus / division / category 필터 적용
   - keyword 조건은 DB 조회에 사용하지 않음
  |
  v
2. keyword 분기
   - blank: 기존 탐색 정렬
   - non-blank: 검색 매칭 계산
  |
  v
3. 검색어가 있으면 후보별 Match 계산
   - EXACT
   - PREFIX
   - SUBSTRING
   - CHOSEONG
   - FUZZY
   - SEMANTIC
  |
  v
4. 매칭된 후보만 남김
  |
  v
5. 검색 랭킹 정렬
   - match type
   - match detail score
   - recruitment status
   - name
```

## 구현 범위

### 유지

- `ClubSearchController`
- `/api/club/search/` 요청 파라미터
- `ClubSearchResponse`
- `ClubSearchResult`
- `WordDictionaryService`
- `OPEN` 필터가 `ALWAYS`, `OPEN`, `UPCOMING`을 포함하는 정책

### 변경

- `ClubSearchRepository`
  - 검색어 regex match를 제거한다.
  - 기본 필터가 적용된 동아리 후보를 반환하는 역할로 축소한다.
- `ClubSearchService`
  - 검색어가 없으면 기존 정렬.
  - 검색어가 있으면 검색 파이프라인과 랭커를 사용한다.

### 추가

패키지:

```text
backend/src/main/java/moadong/club/util/search
```

클래스:

```text
ClubSearchMatchType.java
ClubSearchCandidate.java
ClubSearchMatcher.java
ClubSearchRanker.java
ClubSearchTextNormalizer.java
KoreanInitialExtractor.java
EditDistanceCalculator.java
```

## 클래스 설계

### ClubSearchMatchType

```java
public enum ClubSearchMatchType {
    EXACT(0),
    PREFIX(1),
    SUBSTRING(2),
    CHOSEONG(3),
    FUZZY(4),
    SEMANTIC(5);

    private final int priority;
}
```

숫자가 작을수록 높은 우선순위다.

### ClubSearchCandidate

```java
public record ClubSearchCandidate(
    ClubSearchResult club,
    ClubSearchMatchType matchType,
    int detailScore
) {
}
```

`detailScore`는 같은 `matchType` 안에서의 보조 점수다. 낮을수록 우선이다.

사용 기준:

- `EXACT`: `0`
- `PREFIX`: 이름 길이 차이
- `SUBSTRING`: 검색어가 등장한 index
- `CHOSEONG`: 이름 길이 차이
- `FUZZY`: 편집거리
- `SEMANTIC`: `0`

### ClubSearchTextNormalizer

책임:

- null-safe 처리
- trim
- lowercase
- 모든 공백 제거

```java
public String normalize(String value)
```

예:

```text
"  Play Club " -> "playclub"
"야 구" -> "야구"
```

### KoreanInitialExtractor

책임:

- 한글 음절에서 초성을 추출한다.
- 한글이 아닌 문자는 그대로 둔다.

```java
public String extractInitials(String value)
```

예:

```text
"플레이어스" -> "ㅍㄹㅇㅇㅅ"
"PKNU야구" -> "PKNUㅇㄱ"
```

초성 배열:

```text
ㄱ ㄲ ㄴ ㄷ ㄸ ㄹ ㅁ ㅂ ㅃ ㅅ ㅆ ㅇ ㅈ ㅉ ㅊ ㅋ ㅌ ㅍ ㅎ
```

### EditDistanceCalculator

책임:

- Levenshtein distance 계산
- 검색어와 후보 이름의 prefix window도 비교한다.

```java
public int distance(String source, String target)
public int minDistanceAgainstName(String keyword, String normalizedName)
```

`minDistanceAgainstName()` 정책:

- 전체 이름과 비교한다.
- 이름이 검색어보다 길면 `normalizedName.substring(0, keyword.length())`와도 비교한다.
- 두 값 중 작은 거리를 반환한다.

예:

```text
keyword: "야규"
name: "야구부"
전체 비교 거리: 2
prefix window "야구" 비교 거리: 1
최종 거리: 1
```

### ClubSearchMatcher

책임:

- `ClubSearchResult` 하나가 keyword에 매칭되는지 판단한다.
- 매칭되면 가장 강한 `ClubSearchCandidate`를 반환한다.

```java
public Optional<ClubSearchCandidate> match(
    ClubSearchResult club,
    String keyword,
    List<String> expandedKeywords
)
```

매칭 순서:

1. `EXACT`
2. `PREFIX`
3. `SUBSTRING`
4. `CHOSEONG`
5. `FUZZY`
6. `SEMANTIC`

앞에서 매칭되면 즉시 반환한다. 같은 동아리는 가장 강한 매칭 타입 하나만 가진다.

## 매칭 정책

### 공통 정규화

검색어와 비교 대상은 모두 `ClubSearchTextNormalizer.normalize()` 결과로 비교한다.

비교 대상:

- 이름: `club.name()`
- 분야: `club.category()`
- 태그: `club.tags()`

### EXACT

```text
normalizedName.equals(normalizedKeyword)
```

### PREFIX

```text
normalizedName.startsWith(normalizedKeyword)
```

### SUBSTRING

```text
normalizedName.contains(normalizedKeyword)
```

`detailScore`는 `normalizedName.indexOf(normalizedKeyword)`다.

### CHOSEONG

검색어가 초성 문자로만 구성된 경우에만 적용한다.

초성 문자 범위:

```text
ㄱ ㄲ ㄴ ㄷ ㄸ ㄹ ㅁ ㅂ ㅃ ㅅ ㅆ ㅇ ㅈ ㅉ ㅊ ㅋ ㅌ ㅍ ㅎ
```

조건:

```text
extractInitials(normalizedName).startsWith(normalizedKeyword)
```

예:

```text
keyword: "ㅍㄹ"
name: "플레이어스"
initials: "ㅍㄹㅇㅇㅅ"
match: true
```

### FUZZY

동아리 이름에만 적용한다. 분야와 태그에는 적용하지 않는다.

적용 조건:

```text
normalizedKeyword.length() >= 2
```

허용 거리:

```text
2~3글자: distance <= 1
4글자 이상: distance <= 2
```

노이즈 제거 조건:

```text
첫 글자 또는 첫 초성이 같아야 한다.
```

예:

```text
keyword: "야규"
name: "야구부"
minDistanceAgainstName("야규", "야구부") == 1
첫 글자 "야" == "야"
=> FUZZY 매칭
```

반례:

```text
keyword: "야규"
name: "축구"
distance == 1
첫 글자 다름
첫 초성 다름
=> 제외
```

첫 초성 비교는 한글이면 초성을 비교하고, 한글이 아니면 첫 문자를 비교한다.

### SEMANTIC

기존 `WordDictionaryService.expandKeywords(keyword)` 결과를 사용한다.

적용 대상:

- `club.category()`
- `club.tags()`

적용 조건:

```text
expandedKeyword가 category 또는 tag와 완전 일치하거나 포함된다.
```

이름에는 적용하지 않는다. 이름 검색은 `EXACT`, `PREFIX`, `SUBSTRING`, `CHOSEONG`, `FUZZY`가 담당한다.

## 정렬 정책

### 검색어 없음

기존 정렬 유지:

```text
recruitmentStatus priority
category random priority
name asc
```

### 검색어 있음

```text
matchType.priority asc
detailScore asc
recruitmentStatus priority asc
name asc
```

모집상태 priority는 기존 `ClubRecruitmentStatus.getPriorityFromString()`을 그대로 사용한다.

```text
OPEN: 1
ALWAYS: 2
UPCOMING: 3
CLOSED: 4
unknown: Integer.MAX_VALUE
```

## Repository 변경

현재 `ClubSearchRepository.searchClubsByKeyword(keyword, recruitmentStatus, division, category)`는 keyword regex까지 수행한다.

변경 후:

```java
public List<ClubSearchResult> searchClubsByFilter(
    String recruitmentStatus,
    String division,
    String category
)
```

또는 기존 메서드명을 유지하되 keyword 조건만 제거한다.

권장:

```java
public List<ClubSearchResult> findSearchCandidates(
    String recruitmentStatus,
    String division,
    String category
)
```

Aggregation 단계:

```text
match state == AVAILABLE
match recruitmentStatus / division / category
project response fields
sort division asc, category asc
```

keyword 기반 `name/category/tags regex` match는 제거한다.

## Service 변경

`ClubSearchService.searchClubsByKeyword()` 흐름:

```java
List<ClubSearchResult> candidates =
    clubSearchRepository.findSearchCandidates(recruitmentStatus, division, category);

if (keyword == null || keyword.trim().isEmpty()) {
    return sortAndBuildBrowseResponse(candidates);
}

List<String> expandedKeywords = wordDictionaryService.expandKeywords(keyword);

List<ClubSearchCandidate> matched = candidates.stream()
    .map(candidate -> clubSearchMatcher.match(candidate, keyword, expandedKeywords))
    .flatMap(Optional::stream)
    .toList();

List<ClubSearchResult> sorted = clubSearchRanker.sort(matched);

return ClubSearchResponse.builder()
    .clubs(sorted)
    .totalCount(sorted.size())
    .build();
```

`WordDictionaryService` 의존성은 Repository에서 Service로 이동한다.

## 테스트 계획

### ClubSearchTextNormalizerTest

- null은 빈 문자열
- 앞뒤 공백 제거
- 중간 공백 제거
- 대소문자 통일

### KoreanInitialExtractorTest

- `"플레이어스"` -> `"ㅍㄹㅇㅇㅅ"`
- `"PKNU야구"` -> `"PKNUㅇㄱ"`
- 빈 문자열 처리

### EditDistanceCalculatorTest

- `"야규"`와 `"야구"` 거리 1
- `"야규"`와 `"야구부"`의 `minDistanceAgainstName`은 1
- 같은 문자열 거리 0

### ClubSearchMatcherTest

필수 케이스:

```text
EXACT:
keyword "야구", name "야구"

PREFIX:
keyword "야구", name "야구부"

SUBSTRING:
keyword "야구", name "PKNU야구회"

CHOSEONG:
keyword "ㅍㄹ", name "플레이어스"

FUZZY 허용:
keyword "야규", name "야구부"

FUZZY 제외:
keyword "야규", name "축구"

SEMANTIC:
keyword "야구", expanded ["야구", "구기", "운동"], tags ["구기"]

SEMANTIC보다 이름 매칭 우선:
keyword "야구", name "야구부", tags ["운동"] -> PREFIX
```

### ClubSearchRankerTest

입력:

```text
SEMANTIC 모집중
PREFIX 모집마감
SUBSTRING 모집중
EXACT 모집마감
FUZZY 모집중
```

기대:

```text
EXACT
PREFIX
SUBSTRING
FUZZY
SEMANTIC
```

매칭 타입이 같으면:

```text
recruitmentStatus priority -> name asc
```

### ClubSearchServiceTest

- 검색어 blank이면 기존 탐색 정렬을 사용한다.
- 검색어 non-blank이면 matcher/ranker 결과를 사용한다.
- `OPEN` 필터는 기존처럼 `ALWAYS`, `OPEN`, `UPCOMING` 후보를 포함한다.
- 검색어가 있는데 어떤 레이어에도 매칭되지 않으면 빈 리스트를 반환한다.

## 대표 동작

### `"야구"` 검색

```text
1. 이름이 "야구"인 동아리
2. 이름이 "야구"로 시작하는 동아리
3. 이름 중간에 "야구"가 포함된 동아리
4. 단어사전 확장어가 분야/태그에 매칭된 동아리
```

### `"야규"` 검색

```text
1. 이름 오타 보정으로 "야구", "야구부" 후보 포함
2. "축구"는 편집거리가 가까워도 첫 글자/초성이 달라 제외
```

### `"ㅍㄹ"` 검색

```text
1. 초성이 "ㅍㄹ"로 시작하는 동아리
2. 예: "플레이어스"
```

## 구현 순서

1. `ClubSearchRepository`에서 keyword regex 조건 제거 및 후보 조회 메서드 추가
2. `ClubSearchTextNormalizer` 추가 및 테스트
3. `KoreanInitialExtractor` 추가 및 테스트
4. `EditDistanceCalculator` 추가 및 테스트
5. `ClubSearchMatchType`, `ClubSearchCandidate` 추가
6. `ClubSearchMatcher` 추가 및 테스트
7. `ClubSearchRanker` 추가 및 테스트
8. `ClubSearchService`에 검색어 blank/non-blank 분기 적용
9. 기존 `ClubSearchServiceTest`를 새 정책에 맞게 보강
10. `./gradlew.bat test --tests "moadong.club.*"` 실행

## 완료 기준

- 기존 API 요청/응답 형식이 바뀌지 않는다.
- 검색어가 없으면 기존 탐색 정렬이 유지된다.
- 검색어가 있으면 `EXACT > PREFIX > SUBSTRING > CHOSEONG > FUZZY > SEMANTIC` 순으로 정렬된다.
- `야규 -> 야구부`는 잡고, `야규 -> 축구`는 제외한다.
- 단어사전 기반 결과는 이름 매칭 결과보다 아래에 배치된다.
- 주요 정책이 단위 테스트로 고정된다.
