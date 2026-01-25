package moadong.club.repository;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import lombok.AllArgsConstructor;
import moadong.club.enums.ClubRecruitmentStatus;
import moadong.club.enums.ClubState;
import moadong.club.payload.dto.ClubSearchResult;
import moadong.club.service.WordDictionaryService;

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
	private final WordDictionaryService wordDictionaryService;

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
			// 단어사전으로 키워드 확장
			String trimmedKeyword = keyword.trim();
			List<String> expandedKeywords = wordDictionaryService.expandKeywords(trimmedKeyword);
			if (expandedKeywords == null || expandedKeywords.isEmpty()) {
				expandedKeywords = List.of(trimmedKeyword);
			}

			// 확장된 키워드들을 OR 조건으로 regex 생성
			String regexPattern = expandedKeywords.stream()
				.map(Pattern::quote)  // 특수문자 이스케이프
				.collect(Collectors.joining("|"));

			operations.add(Aggregation.match(new Criteria().orOperator(
				Criteria.where("name").regex(regexPattern, "i"),
				Criteria.where("category").regex(regexPattern, "i"),
				Criteria.where("recruitmentInformation.tags").regex(regexPattern, "i")
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
