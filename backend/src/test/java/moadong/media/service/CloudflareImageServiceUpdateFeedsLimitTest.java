package moadong.media.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import moadong.club.entity.Club;
import moadong.club.entity.ClubRecruitmentInformation;
import moadong.club.repository.ClubRepository;
import moadong.global.config.properties.AwsProperties;
import moadong.global.config.properties.ServerProperties;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.util.annotations.UnitTest;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;

@ExtendWith(MockitoExtension.class)
@UnitTest
class CloudflareImageServiceUpdateFeedsLimitTest {

	@Spy
	@InjectMocks
	private CloudflareImageService cloudflareImageService;

	@Mock
	private ClubRepository clubRepository;

	@Mock
	private S3Client s3Client;

	@Mock
	private S3Presigner s3Presigner;

	@Mock
	private AwsProperties awsProperties;

	@Mock
	private ServerProperties serverProperties;

	@Mock
	private AwsProperties.S3 awsS3;

	@Mock
	private ServerProperties.Feed feedProperties;

	private final int MAX_FEED_COUNT = 15;

	private Club club;
	private ObjectId objectId;

	@BeforeEach
	void setUp() {
		// Properties Mock 설정
		lenient().when(awsProperties.s3()).thenReturn(awsS3);
		lenient().when(awsS3.viewEndpoint()).thenReturn("https://cdn.example.com/");
		
		lenient().when(serverProperties.feed()).thenReturn(feedProperties);
		lenient().when(feedProperties.maxCount()).thenReturn(MAX_FEED_COUNT);

		// init 메서드 호출을 통해 normalizedViewEndpoint 초기화
		ReflectionTestUtils.invokeMethod(cloudflareImageService, "init");

		ClubRecruitmentInformation info = ClubRecruitmentInformation.builder()
			.feedImages(List.of())
			.build();
		club = Club.builder().userId("").clubRecruitmentInformation(info).build();
		objectId = new ObjectId();
	}

	@Test
	void MAX_FEED_COUNT_이상의_피드를_업로드하면_TOO_MANY_FILES를_반환한다() {
		// given
		List<String> tooMany = Arrays.asList(new String[MAX_FEED_COUNT + 1]);
		ClubRecruitmentInformation info = ClubRecruitmentInformation.builder()
				.feedImages(java.util.Collections.emptyList())
				.build();
		club = Club.builder().userId("").clubRecruitmentInformation(info).build();

		// when
		when(clubRepository.findClubById(any())).thenReturn(Optional.of(club));

		// then
		RestApiException exception = assertThrows(RestApiException.class,
				() -> cloudflareImageService.updateFeeds(objectId.toHexString(), "", tooMany));
		assertEquals(ErrorCode.TOO_MANY_FILES, exception.getErrorCode());
	}
}
