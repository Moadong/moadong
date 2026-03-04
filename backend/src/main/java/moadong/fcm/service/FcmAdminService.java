package moadong.fcm.service;

import lombok.extern.slf4j.Slf4j;
import lombok.RequiredArgsConstructor;
import moadong.fcm.entity.FcmToken;
import moadong.fcm.entity.StudentFcmToken;
import moadong.fcm.model.MulticastPushPayload;
import moadong.fcm.model.MulticastPushResult;
import moadong.fcm.model.TokenPushPayload;
import moadong.fcm.model.TokenPushResult;
import moadong.fcm.payload.request.FcmAdminBatchSendRequest;
import moadong.fcm.payload.request.FcmAdminSingleSendRequest;
import moadong.fcm.payload.response.FcmAdminBatchSendResponse;
import moadong.fcm.payload.response.FcmAdminSingleSendResponse;
import moadong.fcm.payload.response.TokenListResponse;
import moadong.fcm.port.PushNotificationPort;
import moadong.fcm.repository.FcmTokenRepository;
import moadong.fcm.repository.StudentFcmTokenRepository;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Slf4j
@Service
@RequiredArgsConstructor
public class FcmAdminService {

    private final StudentFcmTokenRepository studentFcmTokenRepository;
    private final FcmTokenRepository fcmTokenRepository;
    private final PushNotificationPort pushNotificationPort;

    public TokenListResponse getAllAvailableToken() {
        List<String> tokens = Stream.concat(
                        studentFcmTokenRepository.findAll().stream().map(StudentFcmToken::getToken),
                        fcmTokenRepository.findAll().stream().map(FcmToken::getToken)
                )
                .filter(StringUtils::hasText)
                .collect(Collectors.collectingAndThen(
                        Collectors.toCollection(LinkedHashSet::new),
                        List::copyOf
                ));

        return new TokenListResponse(tokens);
    }

    public FcmAdminSingleSendResponse sendToToken(FcmAdminSingleSendRequest request) {
        TokenPushResult result = pushNotificationPort.sendToToken(
                new TokenPushPayload(request.token(), request.title(), request.body(), request.data())
        );

        if (!result.success()) {
            log.error("Admin FCM send failed. token={}", mask(request.token()));
            throw new RestApiException(ErrorCode.FCMMESSAGE_SEND_ERROR);
        }

        return new FcmAdminSingleSendResponse(request.token(), result.messageId());
    }

    public FcmAdminBatchSendResponse sendToAll(FcmAdminBatchSendRequest request) {
        List<String> tokens = getAllAvailableToken().tokens();
        if (tokens.isEmpty()) {
            return new FcmAdminBatchSendResponse(0, 0, 0, 0, List.of());
        }

        MulticastPushResult result = pushNotificationPort.sendToTokens(
                new MulticastPushPayload(tokens, request.title(), request.body(), request.data())
        );

        return new FcmAdminBatchSendResponse(
                tokens.size(),
                result.batchCount(),
                result.successCount(),
                result.failureCount(),
                result.failedTokens()
        );
    }

    private String mask(String token) {
        if (!StringUtils.hasText(token) || token.length() < 10) {
            return "***";
        }
        return token.substring(0, 6) + "..." + token.substring(token.length() - 4);
    }
}
