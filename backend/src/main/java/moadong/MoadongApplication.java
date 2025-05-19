package moadong;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
@RequiredArgsConstructor
@EnableScheduling
public class MoadongApplication {

    public static void main(String[] args) {
        SpringApplication.run(MoadongApplication.class, args);

    }

}
