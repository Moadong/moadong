package moadong.club.repository;

import jakarta.validation.constraints.NotNull;
import java.util.Optional;
import moadong.club.entity.ClubRecruitmentInformation;
import org.checkerframework.common.aliasing.qual.Unique;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ClubInformationRepository extends MongoRepository<ClubRecruitmentInformation, String> {

    Optional<ClubRecruitmentInformation> findByClubId(String clubId);
    Optional<ClubLogoProjection> findLogoByClubId(@NotNull String clubId);
    Optional<ClubRecruitmentInformation> findByLogo(@Unique String logo);
    Optional<ClubInformationSearchProjection> findInformationByClubId(String clubId);
}
