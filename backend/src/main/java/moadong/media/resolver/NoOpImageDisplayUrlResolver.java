package moadong.media.resolver;

import org.springframework.stereotype.Component;

/**
 * 표시용 URL 해석을 수행하지 않고 저장된 URL을 그대로 반환한다.
 * 테스트 또는 webp 우선 기능 비활성화 시 사용.
 */
@Component("noOpImageDisplayUrlResolver")
public class NoOpImageDisplayUrlResolver implements ImageDisplayUrlResolver {

    @Override
    public String resolveDisplayUrl(String storedUrl) {
        return storedUrl;
    }
}
