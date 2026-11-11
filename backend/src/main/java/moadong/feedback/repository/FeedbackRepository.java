package moadong.feedback.repository;

import moadong.feedback.entity.Feedback;
import moadong.feedback.enums.FeedbackStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends MongoRepository<Feedback, String> {

    List<Feedback> findByStudentIdOrderByCreatedAtDesc(String studentId);

    List<Feedback> findAllByOrderByCreatedAtDesc();

    long countByStatusNot(FeedbackStatus status);
}
