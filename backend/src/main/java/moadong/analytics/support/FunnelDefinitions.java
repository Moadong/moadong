package moadong.analytics.support;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

/**
 * 운영진 대시보드 퍼널 정의. 코드에 고정하며 DB/설정으로 빼지 않는다.
 * 이벤트 이름은 프론트에서 보내는 문자열과 정확히 일치해야 한다.
 */
public final class FunnelDefinitions {

    /** 단계 N-1 이후 이 시간 안에 단계 N을 해야 전환으로 본다. */
    public static final long CONVERSION_WINDOW_SECONDS = 24 * 60 * 60;

    public static final String SCROLL_DEPTH_EVENT = "Scroll Depth Reached";
    public static final List<Integer> SCROLL_DEPTH_PERCENTS = List.of(25, 50, 75, 100);
    public static final int SCROLL_DEPTH_BASE_PERCENT = 25;

    public record Step(String name, Set<String> eventNames) {
        public static Step of(String... eventNames) {
            return new Step(String.join(" / ", eventNames), Set.of(eventNames));
        }

        public boolean matches(String eventName) {
            return eventNames.contains(eventName);
        }
    }

    public record Funnel(String key, String name, List<Step> steps) {
    }

    public static final List<Funnel> FUNNELS = List.of(
            new Funnel("home_to_card", "홈 → 카드 클릭", List.of(
                    Step.of("MainPage Visited", "WebviewMainPage Visited"),
                    Step.of("ClubCard Clicked")
            )),
            new Funnel("detail_to_apply", "상세 → 지원 버튼", List.of(
                    Step.of("ClubDetailPage Visited"),
                    Step.of("Club Apply Button Clicked")
            )),
            new Funnel("apply_to_submit", "지원 버튼 → 제출", List.of(
                    Step.of("Club Apply Button Clicked"),
                    Step.of("ApplicationFormPage Visited"),
                    Step.of("Application Form Submitted")
            )),
            new Funnel("feedback", "우체통", List.of(
                    Step.of("우체통 진입 클릭"),
                    Step.of("우체통 피드백 유형 선택"),
                    Step.of("우체통 피드백 전송")
            )),
            new Funnel("promotion", "홍보", List.of(
                    Step.of("홍보 목록 페이지 Visited"),
                    Step.of("Promotion Card Clicked"),
                    Step.of("Promotion Club CTA Clicked")
            )),
            new Funnel("satisfaction", "만족도 모달", List.of(
                    Step.of("만족도 모달 노출"),
                    Step.of("만족도 응답")
            )),
            new Funnel("ai_draft", "관리자 AI 초안", List.of(
                    Step.of("AI 지원서 초안 버튼노출"),
                    Step.of("AI 지원서 초안 생성 버튼클릭"),
                    Step.of("AI 지원서 초안 생성 완료")
            ))
    );

    /** 수집(Export 필터)과 저장 분기에 쓰는 전체 이벤트 이름. 순서는 정의 순서를 따른다. */
    public static final List<String> ALL_EVENT_NAMES = allEventNames();
    private static final Set<String> EVENT_NAME_SET = Set.copyOf(ALL_EVENT_NAMES);

    private FunnelDefinitions() {
    }

    public static boolean isFunnelEvent(String eventName) {
        return eventName != null && EVENT_NAME_SET.contains(eventName);
    }

    private static List<String> allEventNames() {
        Set<String> names = new LinkedHashSet<>();
        for (Funnel funnel : FUNNELS) {
            for (Step step : funnel.steps()) {
                names.addAll(step.eventNames());
            }
        }
        names.add(SCROLL_DEPTH_EVENT);
        return List.copyOf(names);
    }
}
