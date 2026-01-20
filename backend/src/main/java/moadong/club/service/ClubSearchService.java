package moadong.club.service;

import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import moadong.club.entity.Club;
import moadong.club.enums.ClubCategory;
import moadong.club.enums.ClubRecruitmentStatus;
import moadong.club.payload.dto.ClubSearchResult;
import moadong.club.payload.response.ClubSearchResponse;
import moadong.club.repository.ClubRepository;
import moadong.club.repository.ClubSearchRepository;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import static java.util.Arrays.*;

@Service
@AllArgsConstructor
@Slf4j
public class ClubSearchService {

    private final ClubSearchRepository clubSearchRepository;
    private final ClubRepository clubRepository;
    private final VectorStore vectorStore;

    public ClubSearchResponse searchClubsByKeyword(String keyword,
                                                   String recruitmentStatus,
                                                   String division,
                                                   String category
    ) {
        // 1. 키워드가 없으면 -> 그냥 DB 검색만 수행 (기존 로직)
        if (!StringUtils.hasText(keyword)) {
            List<ClubSearchResult> dbResult = fallbackToDbSearch(keyword, recruitmentStatus, division, category);
            return sortAndBuildResponse(dbResult);
        }

        // 2. 키워드가 있으면 -> [하이브리드] 벡터 + DB 동시 수행

        // A. DB 검색 결과 (Text Search)
        List<ClubSearchResult> dbResults = fallbackToDbSearch(keyword, recruitmentStatus, division, category);

        // B. 벡터 검색 결과 (Semantic Search)
        List<ClubSearchResult> vectorResults = new ArrayList<>();
        try {
            List<Document> documents = vectorStore.similaritySearch(
                    SearchRequest.builder()
                            .query(keyword)
                            .topK(50)
                            .similarityThreshold(0.5)
                            .build()
            );

            if (documents != null && !documents.isEmpty()) {
                List<String> clubIds = documents.stream()
                        .map(doc -> doc.getMetadata().get("clubId").toString())
                        .collect(Collectors.toList());

                List<Club> clubs = clubRepository.findAllById(clubIds);

                vectorResults = clubs.stream()
                        .filter(c -> isMatch(c, recruitmentStatus, division, category))
                        .map(ClubSearchResult::of)
                        .collect(Collectors.toList());
            }
        } catch (Exception e) {
            log.error("벡터 검색 실패 (DB 검색 결과만 반환): {}", e.getMessage());
            // 벡터 실패해도 DB 결과가 있으니 에러 던지지 않고 진행 (Graceful Degradation)
        }

        // 3. 결과 병합 (Merge & Deduplication)
        // LinkedHashMap을 써서 삽입 순서(DB 결과 우선 or 벡터 결과 우선)를 유지하거나
        // 단순히 ID 중복만 제거
        Map<String, ClubSearchResult> mergedMap = new HashMap<>();

        // 전략: 벡터 검색 결과를 먼저 넣고, DB 검색 결과를 덮어쓸지 결정
        // 여기서는 "합집합"이 목적이므로 둘 다 넣습니다.
        for (ClubSearchResult r : vectorResults) {
            mergedMap.put(r.id(), r);
        }
        for (ClubSearchResult r : dbResults) {
            // 이미 벡터에서 찾은 거면 DB 결과로 덮어쓰기 (상관없음, 데이터는 같으니까)
            // 만약 '유사도 점수' 같은 게 있다면 그걸 고려해야겠지만 지금은 없음.
            mergedMap.put(r.id(), r);
        }

        List<ClubSearchResult> finalResult = new ArrayList<>(mergedMap.values());

        // 4. 정렬 및 반환
        return sortAndBuildResponse(finalResult);
    }

    private List<ClubSearchResult> fallbackToDbSearch(String keyword, String status, String division, String cat) {
        return clubSearchRepository.searchClubsByKeyword(quotedKeyword(keyword), status, division, cat);
    }


    private boolean isMatch(Club club, String status, String division, String category) {
        boolean statusMatch = "all".equalsIgnoreCase(status) ||
                (club.getClubRecruitmentInformation().getClubRecruitmentStatus() != null &&
                        club.getClubRecruitmentInformation().getClubRecruitmentStatus().name().equalsIgnoreCase(status));

        boolean divisionMatch = "all".equalsIgnoreCase(division) ||
                (club.getDivision() != null && club.getDivision().equalsIgnoreCase(division)); // Division 타입 확인 필요 (String 가정)

        // 카테고리 비교 (Enum인 경우 .name() 사용, String이면 equals)
        // ClubSearchResult가 String으로 카테고리를 쓴다면 여기서도 맞춰줘야 함
        boolean categoryMatch = "all".equalsIgnoreCase(category) ||
                (club.getCategory() != null && club.getCategory().equalsIgnoreCase(category));

        return statusMatch && divisionMatch && categoryMatch;
    }

    // 정렬 및 응답 생성
    private ClubSearchResponse sortAndBuildResponse(List<ClubSearchResult> result) {
        List<ClubCategory> categories = new ArrayList<>(asList(ClubCategory.values()));
        Collections.shuffle(categories);

        Map<String, Integer> randomCategoryPriorities = new HashMap<>();
        for (int i = 0; i < categories.size(); i++) {
            randomCategoryPriorities.put(categories.get(i).name(), i);
        }

        List<ClubSearchResult> sortedResult = result.stream()
                .sorted(
                        Comparator
                                .comparingInt((ClubSearchResult club) -> ClubRecruitmentStatus.getPriorityFromString(club.recruitmentStatus()))
                                .thenComparingInt((ClubSearchResult club) ->
                                        randomCategoryPriorities.getOrDefault(
                                                club.category() != null ? club.category().toUpperCase() : null,
                                                Integer.MAX_VALUE))
                                .thenComparing(ClubSearchResult::name)
                )
                .collect(Collectors.toList());

        return ClubSearchResponse.builder()
                .clubs(sortedResult)
                .totalCount(sortedResult.size())
                .build();
    }

    private String quotedKeyword(String keyword) {
        return (keyword == null || keyword.trim().isEmpty()) ? keyword : Pattern.quote(keyword.trim());
    }
}
