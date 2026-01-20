package moadong.fcm.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class FcmTopicResolver {

    @Value("${spring.profiles.active:prod}")
    private String activeProfile;

    public String resolveTopic(String clubId) {
        if ("prod".equals(activeProfile)) {
            return clubId;
        }
        return activeProfile + "_" + clubId;
    }
}
