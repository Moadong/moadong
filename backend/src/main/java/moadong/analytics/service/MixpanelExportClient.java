package moadong.analytics.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import moadong.analytics.config.MixpanelProperties;
import moadong.analytics.payload.dto.MixpanelRawEvent;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class MixpanelExportClient {

    private static final List<String> BACKFILL_EVENTS = List.of(
            "ClubDetailPage Visited",
            "ClubDetailPage Duration",
            "Search Executed"
    );

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final MixpanelProperties mixpanelProperties;

    public List<MixpanelRawEvent> fetchEvents(LocalDate date) {
        try {
            String events = objectMapper.writeValueAsString(BACKFILL_EVENTS);
            String url = UriComponentsBuilder.newInstance()
                    .scheme("https")
                    .host(mixpanelProperties.effectiveServer())
                    .path("/api/2.0/export")
                    .queryParam("project_id", mixpanelProperties.projectId())
                    .queryParam("from_date", date)
                    .queryParam("to_date", date)
                    .queryParam("limit", requestLimit())
                    .queryParam("event", events)
                    .build()
                    .encode()
                    .toUriString();

            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    new HttpEntity<>(headers()),
                    String.class
            );
            return parseJsonLines(response.getBody());
        } catch (RestClientException e) {
            log.error("Mixpanel Export API 호출 실패. date={}", date, e);
            throw new RestApiException(ErrorCode.MIXPANEL_EXPORT_FAILED);
        } catch (Exception e) {
            log.error("Mixpanel Export API 처리 실패. date={}", date, e);
            throw new RestApiException(ErrorCode.MIXPANEL_EXPORT_FAILED);
        }
    }

    private int requestLimit() {
        return mixpanelProperties.backfill() == null
                ? 100000
                : mixpanelProperties.backfill().effectiveRequestLimit();
    }

    private HttpHeaders headers() {
        MixpanelProperties.ServiceAccount serviceAccount = mixpanelProperties.serviceAccount();
        if (serviceAccount == null
                || serviceAccount.username() == null
                || serviceAccount.secret() == null) {
            throw new RestApiException(ErrorCode.MIXPANEL_EXPORT_FAILED);
        }
        String credentials = serviceAccount.username() + ":" + serviceAccount.secret();
        String basic = Base64.getEncoder().encodeToString(credentials.getBytes(StandardCharsets.UTF_8));
        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.AUTHORIZATION, "Basic " + basic);
        return headers;
    }

    private List<MixpanelRawEvent> parseJsonLines(String body) {
        List<MixpanelRawEvent> events = new ArrayList<>();
        if (body == null || body.isBlank()) {
            return events;
        }
        for (String line : body.split("\\R")) {
            if (line == null || line.isBlank()) {
                continue;
            }
            try {
                events.add(objectMapper.readValue(line, MixpanelRawEvent.class));
            } catch (Exception e) {
                log.warn("Mixpanel JSONL 파싱 실패. lineLength={}", line.length(), e);
            }
        }
        return events;
    }
}
