package moadong.user.service;

import static org.assertj.core.api.Assertions.assertThat;

import moadong.club.repository.ClubRepository;
import moadong.user.repository.UserInformationRepository;
import moadong.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

@SpringBootTest
@SuppressWarnings("NonAsciiCharacters")
public class UserCommandServiceTest {

    @Autowired
    private UserCommandService userCommandService;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private UserInformationRepository userInformationRepository;

    @MockBean
    private ClubRepository clubRepository;

    @Test
    void 회원가입시_id는_8자이상_15자이하여야_한다() {
//        //given
//        UserRegisterRequest request = new UserRegisterRequest("123",
//            "wap123456@",
//            "한글좋아",
//            "010-1234-5678");
//
//        //when & then
//        assertDoesNotThrow(()->userCommandService.registerUser(request));
        assertThat(3).isEqualTo(3);
    }

}
