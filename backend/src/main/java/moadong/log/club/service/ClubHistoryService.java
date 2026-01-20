package moadong.log.club.service;

import lombok.RequiredArgsConstructor;
import moadong.club.entity.Club;
import moadong.log.club.payload.response.ClubHistoryResponse;
import org.javers.core.Javers;
import org.javers.repository.jql.JqlQuery;
import org.javers.repository.jql.QueryBuilder;
import org.javers.shadow.Shadow;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClubHistoryService {

    private final Javers javers;

    public List<ClubHistoryResponse> getClubHistories(String clubId) {
        JqlQuery query = QueryBuilder.byInstanceId(clubId, Club.class)
                .withChildValueObjects()
                .limit(20)
                .build();

        List<Shadow<Club>> shadows = findClubShadows(query);

        return shadows.stream()
                .map(ClubHistoryResponse::from)
                .toList();
    }

    @SuppressWarnings({"unchecked", "rawtypes"})
    private List<Shadow<Club>> findClubShadows(JqlQuery query) {
        return (List) javers.findShadows(query);
    }

}