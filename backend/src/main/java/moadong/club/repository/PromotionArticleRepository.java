package moadong.club.repository;

import moadong.club.entity.PromotionArticle;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PromotionArticleRepository extends MongoRepository<PromotionArticle, String> {

    List<PromotionArticle> findAllByOrderByCreatedAtDesc();

    List<PromotionArticle> findByClubIdOrderByCreatedAtDesc(String clubId);
}
