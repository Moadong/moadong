package moadong.analytics.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 하루치 Mixpanel 수집이 끝났다는 표시. 이벤트가 0건인 날과 수집이 실패한 날을 구분하기 위해
 * 이벤트 레코드와 별도로 남긴다. _id가 날짜라 같은 날을 다시 백필해도 한 건만 남는다.
 */
@Document("mixpanel_collection_status")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MixpanelCollectionStatus {

    @Id
    private String eventDate;

    private LocalDateTime collectedAt;

    public static String idOf(LocalDate eventDate) {
        return eventDate.toString();
    }
}
