package moadong.analytics.repository;

import moadong.analytics.entity.MixpanelBackfilledEvent;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MixpanelBackfilledEventRepository extends MongoRepository<MixpanelBackfilledEvent, String> {
}
