package moadong.calendar.hidden.repository;

import java.util.List;
import moadong.calendar.hidden.entity.HiddenCalendarEvent;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface HiddenCalendarEventRepository extends MongoRepository<HiddenCalendarEvent, String> {

    List<HiddenCalendarEvent> findByClubId(String clubId);

    boolean existsByClubIdAndSourceAndEventId(String clubId, String source, String eventId);

    long deleteByClubIdAndSourceAndEventId(String clubId, String source, String eventId);
}
