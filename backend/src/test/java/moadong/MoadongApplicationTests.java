package moadong;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

@SpringBootTest
@Import(IntegrationTestConfig.class)
class MoadongApplicationTests {

	@Test
	void contextLoads() {
	}

}
