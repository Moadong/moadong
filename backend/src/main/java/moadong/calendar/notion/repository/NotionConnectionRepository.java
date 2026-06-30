package moadong.calendar.notion.repository;

import moadong.calendar.notion.entity.NotionConnection;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface NotionConnectionRepository extends MongoRepository<NotionConnection, String> {
}
