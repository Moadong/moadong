package moadong.feedback.repository;

import moadong.feedback.entity.LetterDraft;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LetterDraftRepository extends MongoRepository<LetterDraft, String> {

    List<LetterDraft> findAllByOrderByUpdatedAtDesc();
}
