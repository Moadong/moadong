package moadong.club.repository;

import java.util.List;
import java.util.Optional;

import moadong.club.entity.ClubApplicationForm;
import moadong.club.enums.ApplicationFormStatus;
import moadong.club.payload.dto.ClubActiveFormSlim;
import moadong.club.payload.dto.ClubApplicationFormSlim;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ClubApplicationFormsRepository extends MongoRepository<ClubApplicationForm, String> {

    Optional<ClubApplicationForm> findById(String formId);
    Optional<ClubApplicationForm> findByClubIdAndId(String clubId, String id);
    List<ClubApplicationForm> findByClubId(String clubId);

    @Query(
            value = "{'clubId':  ?0}",
            fields = "{'_id':  1, 'title':  1, 'editedAt': 1, 'semesterYear':  1, 'semesterTerm':  1, 'status':  1}"
    ) //필드 5개만 가져옴
    List<ClubApplicationFormSlim> findClubApplicationFormsByClubId(String clubId, Sort sort);

    @Query(
            value = "{'clubId':  ?0, 'status': 'ACTIVE'}",
            fields = "{'_id': 1, 'title':  1}"
    )
    List<ClubActiveFormSlim> findClubActiveFormsByClubId(String clubId);

    //clubApply api v1 종료 후 삭제 예정
    Optional<ClubApplicationForm> findTopByClubIdAndStatusOrderByEditedAtDesc(String clubId, ApplicationFormStatus status);
}

