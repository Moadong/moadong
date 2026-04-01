package moadong.calendar.google.repository;

import moadong.calendar.google.entity.GoogleConnection;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface GoogleConnectionRepository extends MongoRepository<GoogleConnection, String> {
}
