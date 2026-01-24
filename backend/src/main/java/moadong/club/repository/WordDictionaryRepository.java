package moadong.club.repository;

import moadong.club.entity.WordDictionary;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WordDictionaryRepository extends MongoRepository<WordDictionary, String> {
    Optional<WordDictionary> findByStandardWord(String standardWord);
}
