package moadong.media.resolver;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.HeadObjectRequest;

@ExtendWith(MockitoExtension.class)
class PreferWebpImageDisplayUrlResolverTest {

    @Mock
    private S3Client s3Client;

    private PreferWebpImageDisplayUrlResolver resolver;

    private static final String VIEW_ENDPOINT = "https://cdn.example.com";

    @BeforeEach
    void setUp() {
        resolver = new PreferWebpImageDisplayUrlResolver(s3Client);
        ReflectionTestUtils.setField(resolver, "viewEndpoint", VIEW_ENDPOINT + "/");
        ReflectionTestUtils.setField(resolver, "bucketName", "test-bucket");
        ReflectionTestUtils.invokeMethod(resolver, "init");
    }

    @Test
    void key가_이미_webp로_끝나면_HEAD_호출_없이_storedUrl_그대로_반환한다() {
        String storedUrl = VIEW_ENDPOINT + "/path/to/logo.webp";

        String result = resolver.resolveDisplayUrl(storedUrl);

        assertEquals(storedUrl, result);
        verify(s3Client, never()).headObject(any(HeadObjectRequest.class));
    }

    @Test
    void key가_webp로_끝나는_URL_대소문자_상관없이_HEAD_호출_없이_반환한다() {
        String storedUrl = VIEW_ENDPOINT + "/path/IMAGE.WEBP";

        String result = resolver.resolveDisplayUrl(storedUrl);

        assertEquals(storedUrl, result);
        verify(s3Client, never()).headObject(any(HeadObjectRequest.class));
    }
}
