package moadong.feedback.repository;

import moadong.feedback.entity.Letter;
import moadong.feedback.enums.LetterCategory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Update;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LetterRepository extends MongoRepository<Letter, String> {

    /**
     * 받은 편지함 = 나에게 온 REPLY + 전체 발행 편지(recipientStudentId 없음).
     */
    @Query(value = "{ $or: [ { 'recipientStudentId': ?0 }, { 'recipientStudentId': null } ] }",
            sort = "{ 'createdAt': -1 }")
    List<Letter> findInboxByStudentId(String studentId);

    @Query(value = "{ 'category': ?1, $or: [ { 'recipientStudentId': ?0 }, { 'recipientStudentId': null } ] }",
            sort = "{ 'createdAt': -1 }")
    List<Letter> findInboxByStudentIdAndCategory(String studentId, LetterCategory category);

    /**
     * 개발자 포털의 보낸 편지함 = 답장과 전체 발행 편지를 모두 합친 목록.
     */
    List<Letter> findAllByOrderByCreatedAtDesc();

    @Query("{ '_id': ?0 }")
    @Update("{ '$addToSet': { 'readStudentIds': ?1 } }")
    long markRead(String letterId, String studentId);

    Optional<Letter> findByIdempotencyKey(String idempotencyKey);
}
