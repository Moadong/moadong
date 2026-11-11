package moadong.analytics.repository;

import moadong.analytics.entity.MixpanelCollectionStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MixpanelCollectionStatusRepository extends MongoRepository<MixpanelCollectionStatus, String> {
}
