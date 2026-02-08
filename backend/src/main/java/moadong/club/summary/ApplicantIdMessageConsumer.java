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
        final String system = "### Role\n" +
                "너는 지원서 데이터를 분석하여 **개인정보를 철저히 배제**하고 핵심만 요약하는 AI 면접관이다.\n" +
                "\n" +
                "### Task\n" +
                "먼저 [Application]의 답변들이 **정상적인 한국어/영어 문장**인지 판단하라. \n" +
                "정상적인 지원서라면 개인정보를 제외하고 핵심 내용을 요약하라.\n" +
                "\n" +
                "### Rules (판단 순서대로 적용할 것)\n" +
                "0. **⛔ 스팸 및 불성실 지원서 필터링 (최우선)**:\n" +
                "   - 답변의 대부분이 **무의미한 문자열**(예: 'asd', 'qwer', 'ㅁㄴㅇㄹ', 'ㅋㅋㅋ')이거나,\n" +
                "   - 문맥 없는 **단일 숫자/기호**(예: '1', '.', '?')의 반복인 경우,\n" +
                "   - **절대 요약하지 말고** 바로 아래 JSON을 출력하고 종료할 것.\n" +
                "   -> Output: {\"response\": \"내용 없음(불성실 지원)\"}\n" +
                "\n" +
                "1. **개인정보 완전 삭제**: 이름(예: 정민준), 학번(예: 2025...), 전화번호는 요약문에 **절대** 넣지 말 것.\n" +
                "2. **학년 처리**: 학년 정보가 있다면 문장의 주어로 시작 (예: '1학년으로...').\n" +
                "3. **자연스러운 요약**: [학년] + [관심분야] + [포부]를 연결하여 80자 내외의 자연스러운 문장으로 작성.\n" +
                "4. **요약 스타일**: '누가 지원했다'는 사실보다 '무엇을 하고 싶은지(관심/역량)'를 문장의 주성분으로 작성할 것." +
                "\n" +
                "### Output Format:\n" +
                "   Format: {\"response\": \"[결과 텍스트]\"}\n";

        StringBuilder prompt = new StringBuilder(
            "### Application\n"
        );
        ClubApplicant clubApplicant = clubApplicantsRepository.findById(message.applicantId()).orElseThrow(() -> new RestApiException(ErrorCode.APPLICANT_NOT_FOUND));
        ClubApplicationForm clubApplicationForm = clubApplicationFormsRepository.findById(message.applicationFormId()).orElseThrow(() -> new RestApiException(ErrorCode.APPLICATION_NOT_FOUND));
        Map<Long, ClubApplicationFormQuestion> questionMap = clubApplicationForm.getQuestions().stream()
                .collect(Collectors.toMap(ClubApplicationFormQuestion::getId, Function.identity()));

        try {
            for (ClubQuestionAnswer answer : clubApplicant.getAnswers()) {
                String decryptedValue = cipher.decrypt(answer.getValue());
                prompt.append("- 질문: ")
                        .append(questionMap.get(answer.getId()).getTitle())
                        .append("\n- 답변: ")
                        .append(decryptedValue);
                prompt.append("\n");
            }
        } catch (Exception e) {
            log.error("AES_CIPHER_ERROR", e);
            throw new RestApiException(ErrorCode.AES_CIPHER_ERROR);
        }
        log.info(prompt.toString());
        AIResponse summarizeContent = gemmaService.getSummarizeContent(system, prompt.toString());

        if (clubApplicant.getAiSummary() == null || clubApplicant.getAiSummary().isEmpty()) {
            log.info(summarizeContent.response());
            clubApplicant.updateAiSummary(summarizeContent.response());
        }

        clubApplicantsRepository.save(clubApplicant);
    }
}