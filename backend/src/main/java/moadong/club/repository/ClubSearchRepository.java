package moadong.club.repository;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import lombok.AllArgsConstructor;
import moadong.club.enums.ClubRecruitmentStatus;
import moadong.club.enums.ClubState;
import moadong.club.payload.dto.ClubSearchResult;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.ConditionalOperators;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Repository;


@Repository
@AllArgsConstructor
public class ClubSearchRepository {

    private final MongoTemplate mongoTemplate;

    public List<ClubSearchResult> searchClubsByKeyword(String keyword, String recruitmentStatus,
        String division, String category) {
        List<AggregationOperation> operations = new ArrayList<>();

        operations.add(Aggregation.match(
            new Criteria().andOperator(
                Criteria.where("state").is(ClubState.AVAILABLE.getName()))
        ));

        Criteria criteria = getMatchedCriteria(recruitmentStatus, division, category);

        if (!criteria.getCriteriaObject().isEmpty()) {
            operations.add(Aggregation.match(criteria));
        }

        if (keyword != null && !keyword.trim().isEmpty()) {
            operations.add(Aggregation.match(new Criteria().orOperator(
                Criteria.where("name").regex(keyword, "i"),
                Criteria.where("category").regex(keyword, "i"),
                Criteria.where("recruitmentInformation.tags").regex(keyword, "i")
            )));
        }
        operations.add(Aggregation.unwind("club_tags", true));

        operations.add(
            Aggregation.project("name", "state", "category", "division")
                .and("recruitmentInformation.introduction").as("introduction")
                .and("recruitmentInformation.clubRecruitmentStatus").as("recruitmentStatus")
                    .and(ConditionalOperators.ifNull("$recruitmentInformation.logo").then(""))
                    .as("logo")
                    .and(ConditionalOperators.ifNull("$recruitmentInformation.tags").then(""))
                    .as("tags"));

        operations.add(
            Aggregation.sort(Sort.by(Sort.Order.asc("division"), Sort.Order.asc("category"))));

        Aggregation aggregation = Aggregation.newAggregation(operations);
        AggregationResults<ClubSearchResult> results = mongoTemplate.aggregate(aggregation, "clubs",
            ClubSearchResult.class);
        return results.getMappedResults();
    }

    public List<ClubSearchResult> searchRecommendClubs(String category, String excludeClubId) {
        Set<String> excludeIds = new HashSet<>();
        if (excludeClubId != null) {
            excludeIds.add(excludeClubId);
        }

        List<ClubSearchResult> result = new ArrayList<>();

        // 1. 같은 카테고리 모집중 + (모집마감 포함) 동아리 최대 4개 추출 (모집상태 우선)
        int maxCategoryCount = 4;
        List<ClubSearchResult> categoryClubs = findClubsByCategoryAndState(category, excludeIds, true, maxCategoryCount);
        addClubs(result, excludeIds, categoryClubs);

        int remainCount = maxCategoryCount - categoryClubs.size();

        // 2. 부족하면 마감 동아리로 채우기
        if (remainCount > 0) {
            List<ClubSearchResult> categoryClosedClubs = findClubsByCategoryAndState(category, excludeIds, false, remainCount);
            addClubs(result, excludeIds, categoryClosedClubs);
        }

        // 3. 나머지 전체 랜덤 2개(모집상태 우선)로 채우기
        int totalNeeded = 6;
        int randomNeeded = totalNeeded - result.size();

        if (randomNeeded > 0) {
            List<ClubSearchResult> randomPool = findRandomClubs(excludeIds, 10);

            List<ClubSearchResult> selectedRandomClubs = selectClubsByStatePriority(randomPool, randomNeeded);
            addClubs(result, excludeIds, selectedRandomClubs);
        }

        return result.isEmpty() ? Collections.emptyList() : result;
    }

    // 같은 카테고리 & 주어진 모집 상태별 랜덤 n개 동아리 조회
    private List<ClubSearchResult> findClubsByCategoryAndState(String category, Set<String> excludeIds,
                                                               boolean onlyRecruitAvailable, int limit) {
        List<AggregationOperation> ops = new ArrayList<>();

        Criteria criteria = Criteria.where("category").is(category)
                .and("_id").nin(excludeIds);

        if (onlyRecruitAvailable) {
            criteria = criteria.and("recruitmentInformation.clubRecruitmentStatus")
                    .in(
                            ClubRecruitmentStatus.ALWAYS.toString(),
                            ClubRecruitmentStatus.OPEN.toString()
                    );
        }

        ops.add(Aggregation.match(criteria));
        ops.add(Aggregation.sample((long) limit));

        // searchClubsByKeyword 와 동일한 project 단계 적용
        ops.add(
                Aggregation.project("name", "state", "category", "division")
                        .and("recruitmentInformation.introduction").as("introduction")
                        .and("recruitmentInformation.clubRecruitmentStatus").as("recruitmentStatus")
                        .and(ConditionalOperators.ifNull("$recruitmentInformation.logo").then(""))
                        .as("logo")
                        .and(ConditionalOperators.ifNull("$recruitmentInformation.tags").then(Collections.emptyList()))
                        .as("tags")
        );

        return mongoTemplate.aggregate(Aggregation.newAggregation(ops), "clubs", ClubSearchResult.class)
                .getMappedResults();
    }

    // 중복 ID 추적하며 클럽 리스트에 추가
    private void addClubs(List<ClubSearchResult> result, Set<String> excludeIds, List<ClubSearchResult> clubs) {
        for (ClubSearchResult club : clubs) {
            if (!excludeIds.contains(club.id())) {
                result.add(club);
                excludeIds.add(club.id());
            }
        }
    }

    // 전체 랜덤 풀에서 모집중 우선으로 n개, 부족하면 마감 동아리로 채움
    private boolean isRecruiting(ClubSearchResult club) {
        String status = club.recruitmentStatus();
        return ClubRecruitmentStatus.ALWAYS.toString().equals(status) || ClubRecruitmentStatus.OPEN.toString().equals(status);
    }

    private List<ClubSearchResult> selectClubsByStatePriority(List<ClubSearchResult> pool, int maxCount) {
        List<ClubSearchResult> selected = new ArrayList<>();
        Set<String> ids = new HashSet<>();

        // 모집중 우선 선택
        for (ClubSearchResult club : pool) {
            if (selected.size() >= maxCount) break;
            if (isRecruiting(club) && !ids.contains(club.id())) {
                selected.add(club);
                ids.add(club.id());
            }
        }

        // 부족하면 모집 마감 동아리 추가
        if (selected.size() < maxCount) {
            for (ClubSearchResult club : pool) {
                if (selected.size() >= maxCount) break;
                if (!isRecruiting(club) && !ids.contains(club.id())) {
                    selected.add(club);
                    ids.add(club.id());
                }
            }
        }

        return selected;
    }

    // 전체 클럽에서 랜덤 n개 뽑기 (중복 제거용 excludeIds는 외부에서 처리)
    private List<ClubSearchResult> findRandomClubs(Set<String> excludeIds, int sampleSize) {
        List<AggregationOperation> ops = new ArrayList<>();
        ops.add(Aggregation.match(Criteria.where("_id").nin(excludeIds)));
        ops.add(Aggregation.sample((long) sampleSize));

        ops.add(
                Aggregation.project("name", "state", "category", "division")
                        .and("recruitmentInformation.introduction").as("introduction")
                        .and("recruitmentInformation.clubRecruitmentStatus").as("recruitmentStatus")
                        .and(ConditionalOperators.ifNull("$recruitmentInformation.logo").then(""))
                        .as("logo")
                        .and(ConditionalOperators.ifNull("$recruitmentInformation.tags").then(Collections.emptyList()))
                        .as("tags")
        );

        return mongoTemplate.aggregate(Aggregation.newAggregation(ops), "clubs", ClubSearchResult.class)
                .getMappedResults();
    }



    private Criteria getMatchedCriteria(String recruitmentStatus, String division,
        String category) {
        List<Criteria> criteriaList = new ArrayList<>();

        if (recruitmentStatus != null && !"all".equalsIgnoreCase(recruitmentStatus)) {
            List<String> targetStatuses = new ArrayList<>();

            if (recruitmentStatus.equalsIgnoreCase(ClubRecruitmentStatus.OPEN.toString())) {
                targetStatuses.add(ClubRecruitmentStatus.ALWAYS.toString());
                targetStatuses.add(ClubRecruitmentStatus.OPEN.toString());
                targetStatuses.add(ClubRecruitmentStatus.UPCOMING.toString());
            } else {
                targetStatuses.add(recruitmentStatus);
            }

            criteriaList.add(
                    Criteria.where("recruitmentInformation.clubRecruitmentStatus").in(targetStatuses)
            );
        }
        if (division != null && !"all".equalsIgnoreCase(division)) {
            criteriaList.add(Criteria.where("division").is(division));
        }
        if (category != null && !"all".equalsIgnoreCase(category)) {
            criteriaList.add(Criteria.where("category").is(category));
        }

        if (!criteriaList.isEmpty()) {
            return new Criteria().andOperator(criteriaList.toArray(new Criteria[0]));
        }
        return new Criteria();
    }
}
