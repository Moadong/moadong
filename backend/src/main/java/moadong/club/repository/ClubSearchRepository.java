package moadong.club.repository;

import lombok.AllArgsConstructor;
import moadong.club.enums.ClubState;
import moadong.club.payload.dto.ClubSearchResult;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;


@Repository
@AllArgsConstructor
public class ClubSearchRepository {
    private final MongoTemplate mongoTemplate;

    public List<ClubSearchResult> searchResult(String keyword, String recruitmentStatus, String division, String category) {
        List<AggregationOperation> operations = new ArrayList<>();

        operations.add(Aggregation.lookup("club_informations", "_id", "clubId", "club_info"));
        operations.add(Aggregation.lookup("club_tags", "_id", "clubId", "club_tags"));
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
                    Criteria.where("club_info.description").regex(keyword, "i"),
                    Criteria.where("club_tags.tag").regex(keyword, "i")
            )));
        }
        operations.add(Aggregation.unwind("club_tags", true));

        operations.add(Aggregation.group("_id")
                .first("name").as("name")
                .first("state").as("state")
                .first("category").as("category")
                .first("division").as("division")
                .first("club_info").as("club_info")
                .push("club_tags.tag").as("tags"));

        operations.add(
                Aggregation.project("name", "state", "category", "division")
                        .and("club_info.introduction").as("introduction")
                        .and("club_info.recruitmentStatus").as("recruitmentStatus")
                        .and("club_info.logo").as("logo")
                        .and("tags").as("tags"));

        Aggregation aggregation = Aggregation.newAggregation(operations);
        AggregationResults<ClubSearchResult> results = mongoTemplate.aggregate(aggregation, "clubs", ClubSearchResult.class);
        return results.getMappedResults();
    }

    private Criteria getMatchedCriteria(String recruitmentStatus, String division, String category) {
        List<Criteria> criteriaList = new ArrayList<>();

        if (recruitmentStatus != null && !"all".equalsIgnoreCase(recruitmentStatus)) {
            criteriaList.add(Criteria.where("club_info.recruitmentStatus").is(recruitmentStatus));
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
