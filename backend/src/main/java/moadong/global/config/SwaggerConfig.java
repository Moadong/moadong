package moadong.global.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import java.util.List;
import lombok.RequiredArgsConstructor;
import moadong.global.config.properties.ServerDomainProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class SwaggerConfig {

    private final ServerDomainProperties serverDomainProperties;

    @Bean
    public OpenAPI openAPI() {
        Info info = new Info()
            .version("1.0")
            .title("moadong API")
            .description("moadong API specification");

        Server server = new Server();
        server.setUrl(serverDomainProperties.domain()); // https://에 접근 가능하게 설정

        return new OpenAPI()
            .info(info)
            .servers(List.of(server));
    }

}
