package moadong.global;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.core.task.SyncTaskExecutor;
import org.springframework.core.task.TaskExecutor;

@TestConfiguration
public class AsyncTest {
    @Bean(name = "taskExecutor")
    public TaskExecutor taskExecutor() {
        //동기 실행기
        return new SyncTaskExecutor();
    }
}
