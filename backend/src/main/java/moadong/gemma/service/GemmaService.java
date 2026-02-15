package moadong.gemma.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import moadong.gemma.dto.AIRequest;
import moadong.gemma.dto.AIResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
@Slf4j
public class GemmaService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${gemma.server.host}")
    private String gemmaServerHost;

    @Value("${gemma.server.port}")
    private String gemmaServerPort;

    public AIResponse getSummarizeContent(String system, String prompt) {
        String gemmaServerUrl = "http://" + gemmaServerHost + ":" + gemmaServerPort + "/api/generate";
        
        try {
            log.info("Starting content summarization request to Gemma server at {}", gemmaServerUrl);

            AIRequest.AIOptions strictOptions = new AIRequest.AIOptions(
                    4096,
                    0.0,
                    150,
                    0.9,
                    1.1
            );

            AIRequest request = new AIRequest(
                    "gemma3:4b",
                    system,
                    prompt,
                    "json",
                    false,
                    -1,
                    strictOptions
            );

            AIResponse response = restTemplate.postForObject(gemmaServerUrl, request, AIResponse.class);

            if (response != null) {
                log.info("Successfully received response from Gemma server.");
                log.debug("Gemma response raw content: {}", response.response());

                return objectMapper.readValue(response.response(), AIResponse.class);
            } else {
                log.warn("Received null response from Gemma server.");
            }
        } catch (Exception e) {
            log.error("Failed to process summarization request to Gemma server [{}]: ", gemmaServerUrl, e);
            return null;
        }
        return null;
    }
}