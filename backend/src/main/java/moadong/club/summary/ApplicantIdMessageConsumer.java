package moadong.club.summary;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import moadong.club.entity.ClubApplicant;
import moadong.club.entity.ClubApplicationForm;
import moadong.club.entity.ClubApplicationFormQuestion;
import moadong.club.entity.ClubQuestionAnswer;
import moadong.club.payload.dto.ApplicantSummaryMessage;
import moadong.club.repository.ClubApplicantsRepository;
import moadong.club.repository.ClubApplicationFormsRepository;
import moadong.gemma.dto.AIResponse;
import moadong.gemma.service.GemmaService;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.global.util.AESCipher;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
@Slf4j
@RequiredArgsConstructor
public class ApplicantIdMessageConsumer {

    private final ClubApplicantsRepository clubApplicantsRepository;
    private final ClubApplicationFormsRepository clubApplicationFormsRepository;
    private final AESCipher cipher;
    private final GemmaService gemmaService;
    private final ApplicantIdMessagePublisher publisher;

    @RabbitListener(queues = "${rabbitmq.summary.queue}", concurrency = "1")
    public void receiveMessage(ApplicantSummaryMessage message) {
        StringBuilder prompt = new StringBuilder("너는 전문 면접관이다. 다음은 동아리 application의 질문과 지원자의 답변이다. 질문은 무시하고, 지원자의 '답변'에서 핵심만 뽑아라. summarize max length 100 response format: '{response: summarize}'. application: ");
        ClubApplicant clubApplicant = clubApplicantsRepository.findById(message.applicantId()).orElseThrow(() -> new RestApiException(ErrorCode.APPLICANT_NOT_FOUND));
        ClubApplicationForm clubApplicationForm = clubApplicationFormsRepository.findById(message.applicationFormId()).orElseThrow(() -> new RestApiException(ErrorCode.APPLICATION_NOT_FOUND));
        Map<Long, ClubApplicationFormQuestion> questionMap = clubApplicationForm.getQuestions().stream()
                .collect(Collectors.toMap(ClubApplicationFormQuestion::getId, Function.identity()));

        try {
            for (ClubQuestionAnswer answer : clubApplicant.getAnswers()) {
                String decryptedValue = cipher.decrypt(answer.getValue());
                prompt.append(answer.getId()).append(". ").append(questionMap.get(answer.getId()).getTitle());
                prompt.append(decryptedValue);
                prompt.append(",");
            }
        } catch (Exception e) {
            log.error("AES_CIPHER_ERROR", e);
            throw new RestApiException(ErrorCode.AES_CIPHER_ERROR);
        }

        AIResponse summarizeContent = gemmaService.getSummarizeContent(prompt.toString());

        if (summarizeContent == null || summarizeContent.response() == null) {
            /*
              추후 dlx, dlq 학습 후 공부해보죠...
              현재 재시도 기준이없어 무한 리트라이됨
              **/
            publisher.addApplicantIdToQueue(message.applicationFormId(), message.applicantId());
            return;
        }
        clubApplicant.updateMemo(summarizeContent.response());

        clubApplicantsRepository.save(clubApplicant);
    }
}