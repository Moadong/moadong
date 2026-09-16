package moadong.media.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import moadong.club.entity.Club;
import moadong.club.entity.ClubRecruitmentInformation;
import moadong.club.repository.ClubRepository;
import moadong.global.config.properties.AwsProperties;
import moadong.global.config.properties.ServerProperties;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.media.dto.PresignedUploadResponse;
import moadong.media.dto.UploadUrlRequest;
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
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

@ExtendWith(MockitoExtension.class)
@UnitTest
class CloudflareImageServiceFeedUploadUrlsTest {

	private static final int MAX_FEED_COUNT = 15;

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
	private AwsProperties.S3 awsS3;

	@Mock
	private ServerProperties serverProperties;

	@Mock
	private ServerProperties.Feed feedProperties;

	@Mock
	private ServerProperties.FileUrl fileUrlProperties;

	private String clubId;

	@BeforeEach
	void setUp() {
		lenient().when(awsProperties.s3()).thenReturn(awsS3);
		lenient().when(awsS3.viewEndpoint()).thenReturn("https://cdn.example.com/");
		lenient().when(awsS3.bucket()).thenReturn("test-bucket");

		lenient().when(serverProperties.feed()).thenReturn(feedProperties);
		lenient().when(feedProperties.maxCount()).thenReturn(MAX_FEED_COUNT);
		lenient().when(serverProperties.fileUrl()).thenReturn(fileUrlProperties);
		lenient().when(fileUrlProperties.expirationTime()).thenReturn(10);

		lenient().when(s3Presigner.presignPutObject(any(PutObjectPresignRequest.class))).thenAnswer(invocation -> {
			PresignedPutObjectRequest presigned = mock(PresignedPutObjectRequest.class);
			when(presigned.url()).thenReturn(new java.net.URL("https://r2.example.com/upload?sig=abc"));
			return presigned;
		});

		ReflectionTestUtils.invokeMethod(cloudflareImageService, "init");

		clubId = new ObjectId().toHexString();
	}

	private void givenSavedFeedImages(int savedCount) {
		List<String> feedImages = IntStream.range(0, savedCount)
			.mapToObj(i -> "https://cdn.example.com/" + clubId + "/feed/saved" + i + ".png")
			.toList();
		ClubRecruitmentInformation info = ClubRecruitmentInformation.builder()
			.feedImages(feedImages)
			.build();
		Club club = Club.builder().userId("").clubRecruitmentInformation(info).build();
		when(clubRepository.findClubById(any())).thenReturn(Optional.of(club));
	}

	private List<UploadUrlRequest> imageRequests(int count) {
		List<UploadUrlRequest> requests = new ArrayList<>(count);
		for (int i = 0; i < count; i++) {
			requests.add(new UploadUrlRequest("photo" + i + ".png", "image/png"));
		}
		return requests;
	}

	@Test
	void 저장된_사진이_많아도_요청한_개수만큼_발급한다() {
		givenSavedFeedImages(14);
		List<UploadUrlRequest> requests = imageRequests(5);

		List<PresignedUploadResponse> responses =
			cloudflareImageService.generateFeedUploadUrls(clubId, "", requests);

		assertEquals(requests.size(), responses.size());
		assertTrue(responses.stream().allMatch(PresignedUploadResponse::success));
	}

	@Test
	void 저장된_사진이_상한만큼_있어도_요청이_상한_이내면_정상_발급한다() {
		givenSavedFeedImages(MAX_FEED_COUNT);
		List<UploadUrlRequest> requests = imageRequests(MAX_FEED_COUNT);

		List<PresignedUploadResponse> responses =
			cloudflareImageService.generateFeedUploadUrls(clubId, "", requests);

		assertEquals(MAX_FEED_COUNT, responses.size());
		assertTrue(responses.stream().allMatch(PresignedUploadResponse::success));
	}

	@Test
	void 요청_개수가_상한을_넘으면_TOO_MANY_FILES를_던지고_부분_응답을_만들지_않는다() {
		givenSavedFeedImages(0);
		List<UploadUrlRequest> requests = imageRequests(MAX_FEED_COUNT + 1);

		RestApiException exception = assertThrows(RestApiException.class,
			() -> cloudflareImageService.generateFeedUploadUrls(clubId, "", requests));

		assertEquals(ErrorCode.TOO_MANY_FILES, exception.getErrorCode());
		verify(s3Presigner, never()).presignPutObject(any(PutObjectPresignRequest.class));
	}

	@Test
	void 확장자가_잘못된_항목이_섞여도_길이는_유지되고_해당_자리만_실패한다() {
		givenSavedFeedImages(0);
		List<UploadUrlRequest> requests = List.of(
			new UploadUrlRequest("ok.png", "image/png"),
			new UploadUrlRequest("bad", "image/png"),
			new UploadUrlRequest("also-ok.jpg", "image/jpeg"));

		List<PresignedUploadResponse> responses =
			cloudflareImageService.generateFeedUploadUrls(clubId, "", requests);

		assertEquals(requests.size(), responses.size());
		assertTrue(responses.get(0).success());
		assertFalse(responses.get(1).success());
		assertEquals(ErrorCode.UNSUPPORTED_FILE_TYPE.getMessage(), responses.get(1).failureReason());
		assertTrue(responses.get(2).success());
	}
}
