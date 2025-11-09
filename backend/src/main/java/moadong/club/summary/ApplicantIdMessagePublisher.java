package moadong.club.summary;

import lombok.RequiredArgsConstructor;
import moadong.club.payload.dto.ApplicantSummaryMessage;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ApplicantIdMessagePublisher {

    private final RabbitTemplate applicantIdTemplate;

    public void addApplicantIdToQueue(String applicationFormId, String applicantId) {
        ApplicantSummaryMessage message = new ApplicantSummaryMessage(applicationFormId, applicantId);

        applicantIdTemplate.convertAndSend(message);
    }
}
