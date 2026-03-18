package moadong.global.config;

import java.util.List;
import lombok.RequiredArgsConstructor;
import moadong.global.config.properties.AppProperties;
import moadong.global.util.OctetStreamReadMsgConverter;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.web.servlet.config.annotation.AsyncSupportConfigurer;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {

    private final OctetStreamReadMsgConverter octetStreamReadMsgConverter;
    private final AppProperties appProperties;

    private final long MAX_AGE_SECS = 3600;

    @Override
    public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
        converters.add(octetStreamReadMsgConverter);
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        String[] allowedOrigins = appProperties.cors().allowedOrigins().toArray(new String[0]);
        registry.addMapping("/**")
            .allowedOriginPatterns(allowedOrigins)
            .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true)
            .maxAge(MAX_AGE_SECS);
    }
    
    @Override
    public void configureAsyncSupport(AsyncSupportConfigurer configurer) {
        // SSE를 위한 비동기 지원 설정
        configurer.setDefaultTimeout(30000L); // 30초 타임아웃
    }
}
