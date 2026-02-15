package moadong.club.repository;

import java.util.List;
import java.util.Optional;
import moadong.club.entity.Club;
import org.bson.types.ObjectId;
import org.javers.spring.annotation.JaversSpringDataAuditable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClubRepository extends MongoRepository<Club, String> {

    Optional<Club> findClubById(ObjectId id);

    Optional<Club> findClubByUserId(String userId);
    List<Club> findAllByName(List<String> clubs);

    Long countByIdIn(List<String> id);

    List<Club> findByClubRecruitmentInformation_LogoOrClubRecruitmentInformation_CoverOrClubRecruitmentInformation_FeedImagesContaining(
            String logo, String cover, String feedImageUrl);
}
