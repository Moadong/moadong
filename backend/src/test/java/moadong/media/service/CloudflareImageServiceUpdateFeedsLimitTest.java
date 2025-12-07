package moadong.media.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import moadong.club.entity.Club;
import moadong.club.entity.ClubRecruitmentInformation;
import moadong.club.repository.ClubRepository;
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

	private final int MAX_FEED_COUNT = 15;

	private Club club;
	private ObjectId objectId;

	@BeforeEach
	void setUp() {
		ClubRecruitmentInformation info = ClubRecruitmentInformation.builder()
			.feedImages(List.of())
			.build();
		club = Club.builder().clubRecruitmentInformation(info).build();
		objectId = new ObjectId();
	}

	@Test
	void MAX_FEED_COUNT_이상의_피드를_업로드하면_TOO_MANY_FILES를_반환한다() {
		// given
		List<String> tooMany = Arrays.asList(new String[MAX_FEED_COUNT]);
		ClubRecruitmentInformation info = ClubRecruitmentInformation.builder()
				.feedImages(tooMany)
				.build();
		club = Club.builder().clubRecruitmentInformation(info).build();
		when(clubRepository.findClubById(any())).thenReturn(Optional.of(club));

		// when
		RestApiException exception = assertThrows(RestApiException.class,
			() -> cloudflareImageService.updateFeeds(objectId.toHexString(), tooMany));

		// then
		assertEquals(ErrorCode.TOO_MANY_FILES, exception.getErrorCode());
	}
}


