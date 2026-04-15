package moadong.util.annotations;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.junit.jupiter.api.Tag;
import org.springframework.boot.test.context.SpringBootTest;

import moadong.global.config.TestFirebaseConfig; // Import the new test config
import moadong.MoadongApplication; // Import the main application class

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@SpringBootTest(classes = {MoadongApplication.class, TestFirebaseConfig.class}) // Add TestFirebaseConfig
public @interface IntegrationTest {

}
