package moadong.club.repository;

import java.util.List;
import moadong.club.entity.ClubFeedImage;
import moadong.club.payload.dto.ClubFeedImageProjection;
import org.checkerframework.common.aliasing.qual.Unique;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClubFeedImageRepository extends MongoRepository<ClubFeedImage, String> {

    List<ClubFeedImageProjection> findAllByClubId(String clubId);
    long countByClubId(String clubId);

    void deleteAllByImage(@Unique String image);
}
