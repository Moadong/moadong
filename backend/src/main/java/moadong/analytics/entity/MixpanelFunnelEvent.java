package moadong.analytics.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 퍼널 계산에 필요한 최소 속성만 남긴 Mixpanel 이벤트.
 * 원본 이벤트 전체를 저장하지 않고 distinctId/시각/페이지/스크롤 깊이만 보관한다.
 */
@Document("mixpanel_funnel_events")
@CompoundIndex(name = "event_name_date_idx", def = "{'eventName': 1, 'eventDate': 1}")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MixpanelFunnelEvent {

    @Id
    private String insertId;

    private String distinctId;

    private String eventName;

    /** KST 기준 이벤트 시각 */
    private LocalDateTime eventTime;

    /** KST 기준 이벤트 날짜. 기간 조회 키 */
    private LocalDate eventDate;

    /** Scroll Depth Reached 전용 */
    private String page;

    /** Scroll Depth Reached 전용 (25/50/75/100) */
    private Integer depthPercent;
}
