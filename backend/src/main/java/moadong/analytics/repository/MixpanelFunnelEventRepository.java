package moadong.analytics.repository;

import moadong.analytics.entity.MixpanelFunnelEvent;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.List;

public interface MixpanelFunnelEventRepository extends MongoRepository<MixpanelFunnelEvent, String> {

    List<MixpanelFunnelEvent> findByEventDateBetween(LocalDate from, LocalDate to);
}
