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

    public AIResponse getSummarizeContent(String prompt) {
        try {
            String gemmaServerUrl = "http://" + gemmaServerHost + ":" + gemmaServerPort + "/api/generate";
            AIRequest request = new AIRequest("gemma3:4b", prompt, "json", false, -1);
            AIResponse response = restTemplate.postForObject(gemmaServerUrl, request, AIResponse.class);
            if (response != null) {
                return objectMapper.readValue(response.response(), AIResponse.class);
            }
        } catch (Exception e) {
            log.error("Json Serialize Error: ", e);
            return null;
        }
        return null;
    }
}
