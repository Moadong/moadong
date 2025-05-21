package moadong.club.repository;

import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
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
                Criteria.where("recruitmentInformation.introduction").regex(keyword, "i"),
                Criteria.where("recruitmentInformation.description").regex(keyword, "i"),
                Criteria.where("recruitmentInformation.tags").regex(keyword, "i")
            )));
        }
        operations.add(Aggregation.unwind("club_tags", true));

        operations.add(
            Aggregation.project("name", "state", "category", "division")
                .and("recruitmentInformation.introduction").as("introduction")
                .and("recruitmentInformation.recruitmentStatus").as("recruitmentStatus")
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

    private Criteria getMatchedCriteria(String recruitmentStatus, String division,
        String category) {
        List<Criteria> criteriaList = new ArrayList<>();

        if (recruitmentStatus != null && !"all".equalsIgnoreCase(recruitmentStatus)) {
            criteriaList.add(
                Criteria.where("recruitmentInformation.recruitmentStatus").is(recruitmentStatus));
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
