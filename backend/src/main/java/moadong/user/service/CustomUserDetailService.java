package moadong.user.service;

import lombok.AllArgsConstructor;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.user.entity.User;
import moadong.user.payload.CustomUserDetails;
import moadong.user.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class CustomUserDetailService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public CustomUserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findUserByUserId(username)
            .orElseThrow(() -> new RestApiException(ErrorCode.USER_NOT_EXIST));
        return new CustomUserDetails(user);
    }
}
