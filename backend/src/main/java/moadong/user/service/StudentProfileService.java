package moadong.user.service;

import lombok.RequiredArgsConstructor;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.user.entity.StudentUser;
import moadong.user.repository.StudentUserRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StudentProfileService {

    private final StudentUserRepository studentUserRepository;

    public void updateNickname(String studentId, String nickname) {
        StudentUser student = studentUserRepository.findById(studentId)
                .orElseThrow(() -> new RestApiException(ErrorCode.STUDENT_USER_NOT_FOUND));
        student.updateNickname(nickname);
        studentUserRepository.save(student);
    }
}
