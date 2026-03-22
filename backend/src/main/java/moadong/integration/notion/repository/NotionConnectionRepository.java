package moadong.integration.notion.repository;

import moadong.integration.notion.entity.NotionConnection;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface NotionConnectionRepository extends MongoRepository<NotionConnection, String> {
}
