package moadong.fcm.service;

import lombok.RequiredArgsConstructor;
import moadong.fcm.entity.FcmToken;
import moadong.fcm.entity.StudentFcmToken;
import moadong.fcm.payload.response.StudentFcmTokenRotateResponse;
import moadong.fcm.repository.FcmTokenRepository;
import moadong.fcm.repository.StudentFcmTokenRepository;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import moadong.user.entity.StudentUser;
import moadong.user.repository.StudentUserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StudentFcmTokenService {

    private final StudentFcmTokenRepository studentFcmTokenRepository;
    private final StudentUserRepository studentUserRepository;
    private final FcmTokenRepository fcmTokenRepository;

    @Transactional
    public StudentFcmTokenRotateResponse rotateFcmToken(String studentId, String newFcmToken) {
        if (studentId == null || studentId.isBlank()) {
            throw new RestApiException(ErrorCode.TOKEN_INVALID);
        }

        StudentUser studentUser = upsertStudentUser(studentId);

        StudentFcmToken byStudent = studentFcmTokenRepository.findByStudentId(studentId).orElse(null);
        boolean replaced = false;
        StudentFcmToken saved;

        if (byStudent == null) {
            saved = createOrClaimToken(studentId, newFcmToken);
        } else if (newFcmToken.equals(byStudent.getToken())) {
            byStudent.updateTimestamp();
            saved = studentFcmTokenRepository.save(byStudent);
        } else {
            replaced = true;
            saved = replaceStudentToken(byStudent, newFcmToken);
        }

        studentUser.updateCurrentFcmToken(saved.getToken());
        studentUserRepository.save(studentUser);

        return new StudentFcmTokenRotateResponse(saved.getToken(), replaced, saved.getTimestamp());
    }

    private StudentUser upsertStudentUser(String studentId) {
        Optional<StudentUser> existing = studentUserRepository.findByStudentId(studentId);
        if (existing.isPresent()) {
            StudentUser studentUser = existing.get();
            studentUser.updateLastSeen();
            return studentUserRepository.save(studentUser);
        }

        return studentUserRepository.save(StudentUser.builder()
                .studentId(studentId)
                .build());
    }

    private StudentFcmToken createOrClaimToken(String studentId, String newFcmToken) {
        Optional<StudentFcmToken> byToken = studentFcmTokenRepository.findByToken(newFcmToken);
        if (byToken.isPresent()) {
            StudentFcmToken studentFcmToken = byToken.get();
            studentFcmToken.updateStudentId(studentId);
            studentFcmToken.updateTimestamp();
            return studentFcmTokenRepository.save(studentFcmToken);
        }

        Optional<FcmToken> legacyToken = fcmTokenRepository.findFcmTokenByToken(newFcmToken);
        if (legacyToken.isPresent()) {
            FcmToken legacy = legacyToken.get();
            return studentFcmTokenRepository.save(StudentFcmToken.builder()
                    .studentId(studentId)
                    .token(newFcmToken)
                    .clubIds(new ArrayList<>(legacy.getClubIds()))
                    .timestamp(legacy.getTimestamp())
                    .build());
        }

        return studentFcmTokenRepository.save(StudentFcmToken.builder()
                .studentId(studentId)
                .token(newFcmToken)
                .build());
    }

    private StudentFcmToken replaceStudentToken(StudentFcmToken byStudent, String newFcmToken) {
        Optional<StudentFcmToken> byToken = studentFcmTokenRepository.findByToken(newFcmToken);
        if (byToken.isPresent() && !byToken.get().getId().equals(byStudent.getId())) {
            studentFcmTokenRepository.delete(byToken.get());
        }

        byStudent.replaceToken(newFcmToken);

        if (byStudent.getClubIds().isEmpty()) {
            fcmTokenRepository.findFcmTokenByToken(newFcmToken)
                    .ifPresent(legacy -> byStudent.updateClubIds(new ArrayList<>(legacy.getClubIds())));
        }

        return studentFcmTokenRepository.save(byStudent);
    }
}
