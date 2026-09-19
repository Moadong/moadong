package moadong.club.repository;

import moadong.club.entity.PromotionArticle;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Update;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PromotionArticleRepository extends MongoRepository<PromotionArticle, String> {

    @Query(value = "{ 'deleted': { $ne: true } }", sort = "{ 'createdAt': -1 }")
    List<PromotionArticle> findAllActiveOrderByCreatedAtDesc();

    @Query(value = "{ 'clubId': ?0, 'deleted': { $ne: true } }", sort = "{ 'createdAt': -1 }")
    List<PromotionArticle> findActiveByClubIdOrderByCreatedAtDesc(String clubId);

    @Query("{ '_id': ?0, 'deleted': { $ne: true } }")
    Optional<PromotionArticle> findActiveById(String id);

    /**
     * 이미지 수가 상한 미만인 게시글에만 추가한다. 동시 업로드가 상한을 넘기지 못하도록 조건을 Mongo에 맡긴다.
     * 상한에 걸리면 갱신 건수가 0으로 돌아온다.
     */
    @Query("{ '_id': ?0, 'deleted': { $ne: true }, $expr: { $lt: [ { $size: { $ifNull: [ '$images', [] ] } }, "
        + PromotionArticle.MAX_IMAGE_COUNT + " ] } }")
    @Update("{ '$addToSet': { 'images': ?1 } }")
    long addImageToActiveArticle(String id, String imageUrl);
}
