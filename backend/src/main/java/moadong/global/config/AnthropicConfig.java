package moadong.global.config;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import java.time.Duration;
import moadong.global.config.properties.AnthropicProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AnthropicConfig {

    @Bean
    public AnthropicClient anthropicClient(AnthropicProperties anthropicProperties) {
        return AnthropicOkHttpClient.builder()
                .apiKey(anthropicProperties.apiKey())
                .timeout(Duration.ofSeconds(30))
                .build();
    }
}
