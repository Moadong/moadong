// 프론트의 새 Mixpanel 이벤트명·속성을 백엔드 내부 이름(옛 이벤트명)으로 번역해 통계 수집이 이름 변경에 흔들리지 않게 한다
package moadong.analytics.support;

import moadong.analytics.payload.dto.MixpanelRawEvent;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

/**
 * 프론트가 Mixpanel 네이밍 컨벤션(frontend/docs/features/analytics/mixpanel-naming-convention.md)으로
 * 이벤트명·속성 키를 바꿨다. 퍼널 정의와 이미 저장된 mixpanel_funnel_events는 옛 이름을 쓰므로,
 * 수집 시점에 새 이름을 옛 이름으로 번역해 저장·집계 로직과 과거 데이터를 그대로 둔다.
 * 옛 이름으로 들어온 이벤트(배포 전 데이터 백필)는 그대로 통과한다.
 */
public final class MixpanelEventNormalizer {

    public static final String PAGE_VIEWED = "Page Viewed";
    public static final String PAGE_LEFT = "Page Left";

    /** 이름만 바뀐 이벤트: 새 이름 → 내부 이름 */
    private static final Map<String, String> RENAMED_EVENTS = Map.of(
            "Club Card Clicked", "ClubCard Clicked",
            "Feedback Entry Clicked", "우체통 진입 클릭",
            "Feedback Type Selected", "우체통 피드백 유형 선택",
            "Feedback Submitted", "우체통 피드백 전송",
            "Satisfaction Modal Viewed", "만족도 모달 노출",
            "Satisfaction Answered", "만족도 응답",
            "AI Draft Button Viewed", "AI 지원서 초안 버튼노출",
            "AI Draft Button Clicked", "AI 지원서 초안 생성 버튼클릭",
            "AI Draft Generated", "AI 지원서 초안 생성 완료"
    );

    /**
     * Page Viewed의 page_name → 내부 페이지 방문 이벤트.
     * 메인은 웹·앱 웹뷰가 같은 page_name(main)이고 is_webview 슈퍼 속성으로 구분한다.
     */
    private static final String MAIN_PAGE_NAME = "main";
    private static final String WEBVIEW_MAIN_PAGE_VISITED = "WebviewMainPage Visited";
    private static final Map<String, String> PAGE_VIEWED_EVENTS = Map.of(
            MAIN_PAGE_NAME, "MainPage Visited",
            "club_detail", "ClubDetailPage Visited",
            "application_form", "ApplicationFormPage Visited",
            "promotion_list", "홍보 목록 페이지 Visited"
    );

    /** Page Left의 page_name → 내부 체류시간 이벤트 */
    private static final Map<String, String> PAGE_LEFT_EVENTS = Map.of(
            "club_detail", "ClubDetailPage Duration"
    );

    /** 새 속성 키 → 내부 속성 키 */
    private static final Map<String, String> RENAMED_PROPERTIES = Map.of(
            "club_name", "clubName",
            "input_value", "inputValue"
    );


    /** Export API에 추가로 요청해야 하는 새 이벤트명 */
    public static final List<String> NEW_EVENT_NAMES = Stream.concat(
            RENAMED_EVENTS.keySet().stream().sorted(),
            Stream.of(PAGE_VIEWED, PAGE_LEFT)
    ).toList();

    private MixpanelEventNormalizer() {
    }

    public static MixpanelRawEvent normalize(MixpanelRawEvent event) {
        if (event == null || event.event() == null) {
            return event;
        }
        Map<String, Object> properties = event.properties() == null
                ? new HashMap<>()
                : new HashMap<>(event.properties());
        boolean webview = Boolean.TRUE.equals(properties.get("is_webview"));
        String eventName = internalEventName(event.event(), properties.get("page_name"), webview);

        RENAMED_PROPERTIES.forEach((newKey, internalKey) -> {
            if (properties.containsKey(newKey) && !properties.containsKey(internalKey)) {
                properties.put(internalKey, properties.get(newKey));
            }
        });
        return new MixpanelRawEvent(eventName, properties);
    }

    private static String internalEventName(String eventName, Object pageName, boolean webview) {
        // Map.of는 null 키 조회에 NPE를 던진다. page_name이 없는 페이지 이벤트 한 건이 백필 전체를 멈추지 않게 먼저 거른다.
        if (pageName == null && (PAGE_VIEWED.equals(eventName) || PAGE_LEFT.equals(eventName))) {
            return eventName;
        }
        if (PAGE_VIEWED.equals(eventName)) {
            if (webview && MAIN_PAGE_NAME.equals(pageName)) {
                return WEBVIEW_MAIN_PAGE_VISITED;
            }
            return PAGE_VIEWED_EVENTS.getOrDefault(pageName, eventName);
        }
        if (PAGE_LEFT.equals(eventName)) {
            return PAGE_LEFT_EVENTS.getOrDefault(pageName, eventName);
        }
        return RENAMED_EVENTS.getOrDefault(eventName, eventName);
    }
}
