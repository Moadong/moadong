package moadong.club.repository;

import moadong.club.entity.PromotionArticle;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
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

    @Query(value = "{ '_id': ?0, 'deleted': { $ne: true } }", exists = true)
    boolean existsActiveById(String id);
}
