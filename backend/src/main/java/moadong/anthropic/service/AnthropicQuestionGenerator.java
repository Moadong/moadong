package moadong.anthropic.service;

import com.anthropic.client.AnthropicClient;
import com.anthropic.core.JsonSchemaLocalValidation;
import com.anthropic.models.messages.MessageCreateParams;
import com.anthropic.models.messages.StructuredMessageCreateParams;
import java.util.List;
import lombok.RequiredArgsConstructor;
import moadong.anthropic.dto.DraftQuestion;
import moadong.anthropic.dto.DraftQuestions;
import moadong.global.config.properties.AnthropicProperties;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AnthropicQuestionGenerator {

    private final AnthropicClient anthropicClient;
    private final AnthropicProperties anthropicProperties;

    /**
     * structured output으로 스키마가 강제된 질문 목록을 생성한다.
     * API 오류·빈 응답 시 unchecked 예외를 던진다(폴백은 호출부 책임).
     */
    public List<DraftQuestion> generate(String system, String userPrompt) {
        StructuredMessageCreateParams<DraftQuestions> params = MessageCreateParams.builder()
                .model(anthropicProperties.model())
                .maxTokens(2048L)
                .system(system)
                .outputConfig(DraftQuestions.class, JsonSchemaLocalValidation.YES)
                .addUserMessage(userPrompt)
                .build();

        return anthropicClient.messages().create(params).content().stream()
                .flatMap(block -> block.text().stream())
                .findFirst()
                .map(typed -> typed.text().questions())
                .orElseThrow(() -> new IllegalStateException("AI 응답에 질문이 없습니다."));
    }
}
