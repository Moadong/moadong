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
     * 이 게시글 말고 다른 활성 게시글이 같은 이미지를 쓰고 있는지 본다.
     * 키가 동아리 기준이라 접두사만으로는 게시글을 구분할 수 없어, 삭제 전에 참조를 확인한다.
     */
    @Query(value = "{ 'images': ?0, '_id': { $ne: ?1 }, 'deleted': { $ne: true } }", exists = true)
    boolean existsOtherActiveArticleWithImage(String imageUrl, String articleId);

    /**
     * 이미지 수가 상한 미만인 게시글에만 추가한다. 동시 업로드가 상한을 넘기지 못하도록 조건을 Mongo에 맡긴다.
     * 상한에 걸리면 갱신 건수가 0으로 돌아온다.
     */
    @Query("{ '_id': ?0, 'deleted': { $ne: true }, $expr: { $lt: [ { $size: { $ifNull: [ '$images', [] ] } }, "
        + PromotionArticle.MAX_IMAGE_COUNT + " ] } }")
    @Update("{ '$addToSet': { 'images': ?1 } }")
    long addImageToActiveArticle(String id, String imageUrl);
}
