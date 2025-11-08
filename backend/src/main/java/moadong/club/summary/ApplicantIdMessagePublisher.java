package moadong.club.summary;

import lombok.RequiredArgsConstructor;
import moadong.club.payload.dto.ApplicantSummaryMessage;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ApplicantIdMessagePublisher {
    @Value("${rabbitmq.summary.routingKey}")
    private String routingKey;

    @Value("${rabbitmq.summary.exchange}")
    private String exchange;

    private final RabbitTemplate rabbitTemplate;

    public void addApplicantIdToQueue(String applicationFormId, String applicantId) {
        ApplicantSummaryMessage message = new ApplicantSummaryMessage(applicationFormId, applicantId);

        rabbitTemplate.convertAndSend(exchange, routingKey, message);
    }
}
