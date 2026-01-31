package moadong.club.repository;

import moadong.club.entity.PromotionArticle;
import moadong.club.payload.dto.PromotionArticleDto;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PromotionArticleRepository extends MongoRepository<PromotionArticle, String> {

    @Query(value = "{}", sort = "{ 'createdAt': -1 }")
    List<PromotionArticleDto> findAllProjectedBy();

    List<PromotionArticle> findByClubIdOrderByCreatedAtDesc(String clubId);
}
