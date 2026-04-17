package moadong;

import moadong.config.IntegrationTestConfig;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@Import(IntegrationTestConfig.class)
@ActiveProfiles("test")
class MoadongApplicationTests {

	@Test
	void contextLoads() {
	}

}
