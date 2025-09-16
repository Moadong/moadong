package moadong.club.repository;

import moadong.club.entity.ClubApplicationForm;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClubApplicationFormsRepository extends MongoRepository<ClubApplicationForm, String> {

    Optional<ClubApplicationForm> findByClubId(String clubId);
    Optional<ClubApplicationForm> findByClubIdAndId(String clubId, String id);

    @Query(
            value = "{'clubId':  ?0}",
            fields = "{'_id':  1, 'title':  1, 'editedAt': 1, 'semesterYear':  1, 'semesterTerm':  1}"
    ) //필드 5개만 가져옴
    List<ClubQuestionSlim> findClubQuestionsByClubId(String clubId, Sort sort);

}
