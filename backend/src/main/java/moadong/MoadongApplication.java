package moadong;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.retry.annotation.EnableRetry;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
@RequiredArgsConstructor
@EnableScheduling
@EnableAsync
@EnableRetry
public class MoadongApplication {

    public static void main(String[] args) {
        SpringApplication.run(MoadongApplication.class, args);

    }

}
