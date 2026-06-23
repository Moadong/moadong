package moadong.global.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "rabbitmq")
public record RabbitMqProperties(Summary summary) {
    public record Summary(String queue, String exchange, String routingKey) {}
}
