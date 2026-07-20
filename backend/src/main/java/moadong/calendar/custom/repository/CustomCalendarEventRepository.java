package moadong.calendar.custom.repository;

import java.util.List;
import java.util.Optional;
import moadong.calendar.custom.entity.CustomCalendarEvent;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CustomCalendarEventRepository extends MongoRepository<CustomCalendarEvent, String> {

    List<CustomCalendarEvent> findByClubId(String clubId);

    Optional<CustomCalendarEvent> findByIdAndClubId(String id, String clubId);

    long deleteByIdAndClubId(String id, String clubId);

    boolean existsByClubId(String clubId);
}
