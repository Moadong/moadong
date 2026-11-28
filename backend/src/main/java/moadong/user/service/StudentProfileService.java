package moadong.user.service;

import lombok.RequiredArgsConstructor;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.media.service.StudentProfileImageService;
import moadong.user.entity.StudentUser;
import moadong.user.payload.response.StudentProfileResponse;
import moadong.user.repository.StudentUserRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StudentProfileService {

    private final StudentUserRepository studentUserRepository;
    private final StudentProfileImageService studentProfileImageService;

    public StudentProfileResponse getProfile(String studentId) {
        StudentUser student = getStudent(studentId);
        return new StudentProfileResponse(student.getNickname(), student.getProfileImageUrl());
    }

    public void updateProfile(String studentId, String nickname) {
        StudentUser student = getStudent(studentId);
        student.updateNickname(nickname.strip());
        studentUserRepository.save(student);
    }

    public void completeImageUpload(String studentId, String imageUrl) {
        StudentUser student = getStudent(studentId);
        String oldImageUrl = student.getProfileImageUrl();

        studentProfileImageService.validateImageUrl(studentId, imageUrl);
        student.updateProfileImage(imageUrl);
        studentUserRepository.save(student);

        if (!imageUrl.equals(oldImageUrl)) {
            studentProfileImageService.deleteImageQuietly(oldImageUrl);
        }
    }

    private StudentUser getStudent(String studentId) {
        return studentUserRepository.findById(studentId)
                .orElseThrow(() -> new RestApiException(ErrorCode.STUDENT_USER_NOT_FOUND));
    }
}
