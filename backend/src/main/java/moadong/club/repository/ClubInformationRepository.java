package moadong.club.repository;

import jakarta.validation.constraints.NotNull;
import java.util.Optional;
import moadong.club.entity.ClubInformation;
import moadong.club.payload.dto.ClubLogoProjection;
import org.checkerframework.common.aliasing.qual.Unique;
import moadong.club.payload.dto.ClubInformationSearchProjection;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ClubInformationRepository extends MongoRepository<ClubInformation, String> {

    Optional<ClubInformation> findByClubId(String clubId);
    Optional<ClubLogoProjection> findLogoByClubId(@NotNull String clubId);
    Optional<ClubInformation> findByLogo(@Unique String logo);
    Optional<ClubInformationSearchProjection> findInformationByClubId(String clubId);
}
