package moadong.global.config;

import org.javers.core.Javers;
import org.javers.core.JaversBuilder;
import org.javers.repository.mongo.MongoRepository;
import org.javers.spring.auditable.AuthorProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.PlatformTransactionManager;

@Configuration
public class JaversConfig {
    @Bean
    public AuthorProvider authorProvider() {
        return () -> {
            return SecurityContextHolder.getContext().getAuthentication().getName();
        };
    }

    @Bean
    public MongoRepository javersMongoRepository(MongoDatabaseFactory dbFactory) {
        // MongoDatabaseFactory에서 database 객체를 꺼내서 Javers에 넘김
        return new MongoRepository(dbFactory.getMongoDatabase());
    }
}
