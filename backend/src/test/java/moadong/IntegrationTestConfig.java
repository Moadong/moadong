package moadong;

import moadong.config.FirebaseTestConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.context.annotation.Import;
import org.springframework.retry.annotation.EnableRetry;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@ConfigurationPropertiesScan
@EnableScheduling
@EnableRetry
@EnableAsync
@Import(FirebaseTestConfiguration.class) // Import the test configuration for Firebase
public class IntegrationTestConfig {
    // This class is used for integration tests to provide a separate Spring Boot context
    // that enables DataSourceAutoConfiguration by default, unlike MoadongApplication.
}
