package moadong.analytics.service;

import lombok.RequiredArgsConstructor;
import moadong.analytics.entity.MixpanelFunnelEvent;
import moadong.analytics.payload.response.FunnelDashboardResponse;
import moadong.analytics.payload.response.FunnelDashboardResponse.ConversionResult;
import moadong.analytics.payload.response.FunnelDashboardResponse.DepthResult;
import moadong.analytics.payload.response.FunnelDashboardResponse.FunnelResult;
import moadong.analytics.payload.response.FunnelDashboardResponse.ScrollDepthResult;
import moadong.analytics.payload.response.FunnelDashboardResponse.StepResult;
import moadong.analytics.repository.MixpanelBackfilledEventRepository;
import moadong.analytics.repository.MixpanelFunnelEventRepository;
import moadong.analytics.support.AnalyticsDateRangeValidator;
import moadong.analytics.support.FunnelDefinitions;
import moadong.analytics.support.FunnelDefinitions.Funnel;
import moadong.analytics.support.FunnelDefinitions.Step;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;
import java.util.stream.Collectors;

/**
 * 전환 계산은 조회 시점에 기간 내 이벤트를 distinctId로 묶어 메모리에서 수행한다.
 * 현재 트래픽 규모(하루 수천~수만 건) 가정이다.
 * 하루 수십만 건을 넘기면 Mongo 집계 파이프라인으로 옮겨야 한다.
 */
@Service
@RequiredArgsConstructor
public class FunnelDashboardService {

    private final MixpanelFunnelEventRepository mixpanelFunnelEventRepository;
    private final MixpanelBackfilledEventRepository mixpanelBackfilledEventRepository;

    public FunnelDashboardResponse getDashboard(LocalDate from, LocalDate to) {
        AnalyticsDateRangeValidator.validateQueryRange(from, to);

        List<MixpanelFunnelEvent> events = mixpanelFunnelEventRepository.findByEventDateBetween(from, to);
        Map<String, List<MixpanelFunnelEvent>> eventsByUser = events.stream()
                .filter(event -> event.getDistinctId() != null && event.getEventTime() != null)
                .sorted(Comparator.comparing(MixpanelFunnelEvent::getEventTime))
                .collect(Collectors.groupingBy(MixpanelFunnelEvent::getDistinctId));

        List<FunnelResult> funnels = FunnelDefinitions.FUNNELS.stream()
                .map(funnel -> computeFunnel(funnel, eventsByUser))
                .toList();
        List<ScrollDepthResult> scrollDepths = computeScrollDepths(events);

        List<LocalDate> missingDates = findMissingDates(from, to);
        int requestedDays = (int) ChronoUnit.DAYS.between(from, to) + 1;

        return new FunnelDashboardResponse(
                from,
                to,
                requestedDays,
                requestedDays - missingDates.size(),
                missingDates,
                funnels,
                scrollDepths
        );
    }

    /**
     * 순서 퍼널. 사용자별로 시간순 이벤트를 훑으며 "단계 k에 도달한 가장 늦은 시각"을 유지한다.
     * 단계 k+1 이벤트가 단계 k 도달 시각으로부터 24시간 안이면 k+1 도달로 본다.
     * 가장 늦은 도달 시각만 유지해도 충분하다. 뒤 단계의 24시간 창은 앞 단계 시각이 늦을수록 넓어지기 때문이다.
     * 기간 경계(to 다음날)에 걸친 전환은 세지 않는다.
     */
    FunnelResult computeFunnel(Funnel funnel, Map<String, List<MixpanelFunnelEvent>> eventsByUser) {
        List<Step> steps = funnel.steps();
        long[] usersPerStep = new long[steps.size()];

        for (List<MixpanelFunnelEvent> userEvents : eventsByUser.values()) {
            LocalDateTime[] reachedAt = new LocalDateTime[steps.size()];
            for (MixpanelFunnelEvent event : userEvents) {
                // 뒤 단계부터 확인해 한 이벤트가 같은 순회에서 두 단계를 연달아 올리지 않게 한다.
                for (int k = steps.size() - 1; k >= 1; k--) {
                    if (steps.get(k).matches(event.getEventName())
                            && reachedAt[k - 1] != null
                            && withinWindow(reachedAt[k - 1], event.getEventTime())) {
                        reachedAt[k] = event.getEventTime();
                    }
                }
                if (steps.get(0).matches(event.getEventName())) {
                    reachedAt[0] = event.getEventTime();
                }
            }
            for (int k = 0; k < steps.size(); k++) {
                if (reachedAt[k] != null) {
                    usersPerStep[k]++;
                }
            }
        }

        List<StepResult> stepResults = new ArrayList<>();
        List<ConversionResult> conversions = new ArrayList<>();
        for (int k = 0; k < steps.size(); k++) {
            stepResults.add(new StepResult(steps.get(k).name(), usersPerStep[k]));
            if (k > 0) {
                conversions.add(new ConversionResult(
                        steps.get(k - 1).name(),
                        steps.get(k).name(),
                        rate(usersPerStep[k], usersPerStep[k - 1])
                ));
            }
        }
        Double overallRate = rate(usersPerStep[steps.size() - 1], usersPerStep[0]);
        return new FunnelResult(funnel.key(), funnel.name(), stepResults, conversions, overallRate);
    }

    /** page × depthPercent 고유 사용자 수. 25%를 분모로 나머지 비율을 낸다. */
    List<ScrollDepthResult> computeScrollDepths(List<MixpanelFunnelEvent> events) {
        Map<String, Map<Integer, Set<String>>> usersByPageAndDepth = new TreeMap<>();
        for (MixpanelFunnelEvent event : events) {
            if (!FunnelDefinitions.SCROLL_DEPTH_EVENT.equals(event.getEventName())
                    || event.getPage() == null
                    || event.getDepthPercent() == null
                    || event.getDistinctId() == null
                    || !FunnelDefinitions.SCROLL_DEPTH_PERCENTS.contains(event.getDepthPercent())) {
                continue;
            }
            usersByPageAndDepth
                    .computeIfAbsent(event.getPage(), page -> new HashMap<>())
                    .computeIfAbsent(event.getDepthPercent(), depth -> new HashSet<>())
                    .add(event.getDistinctId());
        }

        List<ScrollDepthResult> results = new ArrayList<>();
        usersByPageAndDepth.forEach((page, usersByDepth) -> {
            long baseUsers = usersByDepth.getOrDefault(FunnelDefinitions.SCROLL_DEPTH_BASE_PERCENT, Set.of()).size();
            List<DepthResult> depths = FunnelDefinitions.SCROLL_DEPTH_PERCENTS.stream()
                    .map(percent -> {
                        long users = usersByDepth.getOrDefault(percent, Set.of()).size();
                        return new DepthResult(percent, users, rate(users, baseUsers));
                    })
                    .toList();
            results.add(new ScrollDepthResult(page, depths));
        });
        return results;
    }

    /**
     * 수집 여부는 그날 퍼널 이벤트가 하나라도 dedup 컬렉션에 있는지로 판단한다.
     * Export 실패로 비어 있는 날과 트래픽이 0인 날은 구분하지 못한다.
     */
    private List<LocalDate> findMissingDates(LocalDate from, LocalDate to) {
        List<LocalDate> missing = new ArrayList<>();
        for (LocalDate date = from; !date.isAfter(to); date = date.plusDays(1)) {
            if (!mixpanelBackfilledEventRepository.existsByEventDateAndEventNameIn(
                    date, FunnelDefinitions.ALL_EVENT_NAMES)) {
                missing.add(date);
            }
        }
        return missing;
    }

    private static boolean withinWindow(LocalDateTime previous, LocalDateTime current) {
        Duration gap = Duration.between(previous, current);
        return !gap.isNegative() && gap.getSeconds() <= FunnelDefinitions.CONVERSION_WINDOW_SECONDS;
    }

    private static Double rate(long numerator, long denominator) {
        if (denominator == 0) {
            return null;
        }
        return (double) numerator / denominator;
    }
}
