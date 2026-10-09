package moadong.analytics.repository;

import moadong.analytics.entity.MixpanelBackfilledEvent;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.Collection;

public interface MixpanelBackfilledEventRepository extends MongoRepository<MixpanelBackfilledEvent, String> {

    boolean existsByEventDateAndEventNameIn(LocalDate eventDate, Collection<String> eventNames);
}
