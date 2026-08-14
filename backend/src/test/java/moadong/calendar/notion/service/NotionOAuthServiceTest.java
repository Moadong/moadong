package moadong.calendar.notion.service;

import static org.mockito.Mockito.inOrder;
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
import org.mockito.InOrder;
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
    @DisplayName("연결 해제 시 레거시 문서를 먼저 삭제한 뒤 clubId 문서를 삭제한다")
    void deleteConnection_deletesLegacyDocumentBeforeClubDocument() {
        CustomUserDetails user = UserFixture.createUserDetails(USER_ID);
        Club club = Club.builder().userId(USER_ID).build();
        ReflectionTestUtils.setField(club, "id", CLUB_ID);
        when(clubRepository.findClubByUserId(USER_ID)).thenReturn(Optional.of(club));

        notionOAuthService.deleteConnection(user);

        // clubId 문서를 먼저 지우면 그 사이 조회가 레거시 문서를 다시 마이그레이션하므로 순서를 고정한다.
        InOrder inOrder = inOrder(notionConnectionRepository);
        inOrder.verify(notionConnectionRepository).deleteById(USER_ID);
        inOrder.verify(notionConnectionRepository).deleteById(CLUB_ID);
    }
}
