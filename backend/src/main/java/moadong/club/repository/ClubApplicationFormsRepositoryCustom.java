package moadong.club.repository;

import com.mongodb.BasicDBObject;
import lombok.AllArgsConstructor;
import moadong.club.payload.dto.ClubApplicationFormsResult;
import org.bson.Document;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.aggregation.ConditionalOperators;
import org.springframework.data.mongodb.core.aggregation.GroupOperation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Repository
@AllArgsConstructor
public class ClubApplicationFormsRepositoryCustom {

    private final MongoTemplate mongoTemplate;

    public List<ClubApplicationFormsResult> findClubApplicationFormsByClubId(String clubId) {
        List<AggregationOperation> operations = new ArrayList<>();

        operations.add(Aggregation.match(Criteria.where("clubId").is(clubId)));
        operations.add(Aggregation.project()
                .and("_id").as("id")
                .and("title").as("title")
                .and("editedAt").as("editedAt")
                .and("semesterYear").as("semesterYear")
                .and("semesterTerm").as("semesterTerm"));

        //1차 정렬 -> 그룹 내에서 최종수정날짜 순으로 정렬됨
        operations.add(Aggregation.sort(Sort.by(
                Sort.Order.desc("editedAt"),
                Sort.Order.desc("id")
        )));

        //그룹화
        GroupOperation groupOperation = Aggregation.group("semesterYear","semesterTerm")
                .push(new Document("id", "$id")
                        .append("title", "$title")
                        .append("editedAt", "$editedAt"))
                .as("forms");
        operations.add(groupOperation);

        //그룹들 학기순 정렬
        operations.add(Aggregation.addFields()
                .addFieldWithValue("termOrder", new Document("$indexOfArray",
                        Arrays.asList(Arrays.asList("FIRST", "SECOND"), "$_id.semesterTerm")))
                .build());
        operations.add(Aggregation.sort(Sort.by(
                Sort.Order.desc("_id.semesterYear"),
                Sort.Order.desc("termOrder"))));

        operations.add(Aggregation.project("forms")
                .and("_id.semesterYear").as("semesterYear")
                .and("_id.semesterTerm").as("semesterTerm"));

        Aggregation aggregation = Aggregation.newAggregation(operations);
        return mongoTemplate
                .aggregate(aggregation, "club_application_forms", ClubApplicationFormsResult.class)
                .getMappedResults();

    }

}
