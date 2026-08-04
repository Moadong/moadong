package moadong.calendar.notion.service;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;
import moadong.calendar.notion.config.NotionProperties;
import moadong.calendar.notion.repository.NotionConnectionRepository;
import moadong.club.entity.Club;
import moadong.club.repository.ClubRepository;
import moadong.fixture.UserFixture;
import moadong.global.util.AESCipher;
import moadong.user.payload.CustomUserDetails;
import moadong.util.annotations.UnitTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;

@UnitTest
class NotionOAuthServiceTest {

    @Mock
    private RestTemplate restTemplate;

    @Mock
    private NotionConnectionRepository notionConnectionRepository;

    @Mock
    private ClubRepository clubRepository;

    @Mock
    private AESCipher cipher;

    @Mock
    private NotionProperties notionProperties;

    private NotionOAuthService notionOAuthService;

    private static final String USER_ID = "test-user-id";
    private static final String CLUB_ID = "test-club-id";

    @BeforeEach
    void setUp() {
        notionOAuthService = new NotionOAuthService(
                restTemplate, notionConnectionRepository, clubRepository, cipher, notionProperties);
    }

    @Test
    @DisplayName("연결 해제 시 clubId 문서와 userId 기반 레거시 문서를 모두 삭제한다")
    void deleteConnection_deletesClubAndLegacyDocuments() {
        CustomUserDetails user = UserFixture.createUserDetails(USER_ID);
        Club club = Club.builder().userId(USER_ID).build();
        ReflectionTestUtils.setField(club, "id", CLUB_ID);
        when(clubRepository.findClubByUserId(USER_ID)).thenReturn(Optional.of(club));

        notionOAuthService.deleteConnection(user);

        verify(notionConnectionRepository).deleteById(CLUB_ID);
        verify(notionConnectionRepository).deleteById(USER_ID);
    }
}
