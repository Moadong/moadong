package moadong.global.config;

import com.mongodb.client.MongoClient;
import java.util.List;
import moadong.club.enums.ApplicationFormStatusReadingConverter;
import net.javacrumbs.shedlock.core.LockProvider;
import net.javacrumbs.shedlock.provider.mongo.MongoLockProvider;
import net.javacrumbs.shedlock.spring.annotation.EnableSchedulerLock;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.MongoTransactionManager;
import org.springframework.data.mongodb.core.convert.MongoCustomConversions;

@Configuration
@EnableSchedulerLock(defaultLockAtMostFor = "2m", defaultLockAtLeastFor = "30s")
public class MongoConfig {
    @Bean
    public MongoTransactionManager transactionManager(MongoDatabaseFactory dbFactory) {
        return new MongoTransactionManager(dbFactory);
    }

    @Bean
    public MongoCustomConversions mongoCustomConversions() {
        return new MongoCustomConversions(List.of(new ApplicationFormStatusReadingConverter()));
    }


    @Bean
    public LockProvider lockProvider(MongoClient mongoClient) {
        return new MongoLockProvider(mongoClient.getDatabase("shedLock"));
    }

}
