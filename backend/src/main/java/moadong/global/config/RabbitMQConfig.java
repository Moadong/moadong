package moadong.global.config;

import lombok.RequiredArgsConstructor;
import moadong.global.config.properties.RabbitMqProperties;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.amqp.rabbit.connection.CachingConnectionFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.boot.autoconfigure.amqp.RabbitProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

@Configuration
@EnableRabbit
@RequiredArgsConstructor
public class RabbitMQConfig {

    private final RabbitMqProperties rabbitMqProperties;
    private final RabbitProperties springRabbitProperties;

    private static final String DEAD_LETTER_EXCHANGE_NAME = "dead.letter.exchange";
    private static final String DEAD_LETTER_QUEUE_NAME = "dead.letter.queue";
    private static final String DEAD_LETTER_ROUTING_KEY = "dead.letter.routing.key";

    @Bean
    public Queue applicantIdQueue() {
        return new Queue(rabbitMqProperties.summary().queue(), true, false, false,
            Map.of(
                "x-dead-letter-exchange", DEAD_LETTER_EXCHANGE_NAME,
                "x-dead-letter-routing-key", DEAD_LETTER_ROUTING_KEY
            )
        );
    }

    @Bean
    public DirectExchange applicantIdExchange() {
        return new DirectExchange(rabbitMqProperties.summary().exchange());
    }

    @Bean
    public Binding applicantIdBinding(Queue applicantIdQueue, DirectExchange applicantIdExchange) {
        return BindingBuilder.bind(applicantIdQueue).to(applicantIdExchange).with(rabbitMqProperties.summary().routingKey());
    }

    @Bean
    public Queue deadLetterQueue() {
        return new Queue(DEAD_LETTER_QUEUE_NAME, true);
    }

    @Bean
    public DirectExchange deadLetterExchange() {
        return new DirectExchange(DEAD_LETTER_EXCHANGE_NAME);
    }

    @Bean
    public Binding deadLetterBinding(Queue deadLetterQueue, DirectExchange deadLetterExchange) {
        return BindingBuilder.bind(deadLetterQueue).to(deadLetterExchange).with(DEAD_LETTER_ROUTING_KEY);
    }

    @Bean
    public RabbitTemplate applicantIdTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(Jackson2JsonMessageConverter());
        template.setExchange(rabbitMqProperties.summary().exchange());
        template.setRoutingKey(rabbitMqProperties.summary().routingKey());

        return template;
    }

    @Bean
    public MessageConverter Jackson2JsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public ConnectionFactory connectionFactory() {
        CachingConnectionFactory cf = new CachingConnectionFactory(springRabbitProperties.getHost(), springRabbitProperties.getPort());
        cf.setUsername(springRabbitProperties.getUsername());
        cf.setPassword(springRabbitProperties.getPassword());
        return cf;
    }
}
