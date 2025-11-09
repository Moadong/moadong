package moadong.global.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.CachingConnectionFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

@Configuration
@EnableRabbit
public class RabbitMQConfig {

    @Value("${spring.rabbitmq.host}") private String host;
    @Value("${spring.rabbitmq.port}") private int port;
    @Value("${spring.rabbitmq.username}") private String username;
    @Value("${spring.rabbitmq.password}") private String password;

    @Value("${rabbitmq.summary.queue}")
    private String APPLICANT_ID_QUEUE_NAME;

    @Value("${rabbitmq.summary.exchange}")
    private String APPLICANT_ID_EXCHANGE_NAME;

    @Value("${rabbitmq.summary.routingKey}")
    private String APPLICANT_ID_ROUTING_KEY;

    private static final String DEAD_LETTER_EXCHANGE_NAME = "dead.letter.exchange";
    private static final String DEAD_LETTER_QUEUE_NAME = "dead.letter.queue";
    private static final String DEAD_LETTER_ROUTING_KEY = "dead.letter.routing.key";

    @Bean
    public Queue applicantIdQueue() {
        return new Queue(APPLICANT_ID_QUEUE_NAME, true, false, false,
            Map.of(
                "x-dead-letter-exchange", DEAD_LETTER_EXCHANGE_NAME,
                "x-dead-letter-routing-key", DEAD_LETTER_ROUTING_KEY
            )
        );
    }

    @Bean
    public DirectExchange applicantIdExchange() {
        return new DirectExchange(APPLICANT_ID_EXCHANGE_NAME);
    }

    @Bean
    public Binding applicantIdBinding(Queue applicantIdQueue, DirectExchange applicantIdExchange) {
        return BindingBuilder.bind(applicantIdQueue).to(applicantIdExchange).with(APPLICANT_ID_ROUTING_KEY);
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
    public SimpleRabbitListenerContainerFactory rabbitListenerContainerFactory(ConnectionFactory connectionFactory) {
        SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
        factory.setConnectionFactory(connectionFactory);
        factory.setMessageConverter(Jackson2JsonMessageConverter());
        return factory;
    }

    @Bean
    public RabbitTemplate applicantIdTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(Jackson2JsonMessageConverter());

        return template;
    }

    @Bean
    public MessageConverter Jackson2JsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public ConnectionFactory connectionFactory() {
        CachingConnectionFactory cf = new CachingConnectionFactory(host, port);
        cf.setUsername(username);
        cf.setPassword(password);
        return cf;
    }
}