package moadong.util.annotations;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class TestTypeConstants {
    public static final String UNIT_TEST = "UnitTest";
    public static final String INTEGRATION_TEST = "IntegrationTest";
}
