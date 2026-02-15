package moadong.media.repository;

import moadong.media.entity.BannerImages;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BannerImagesRepository extends MongoRepository<BannerImages, String> {
}
