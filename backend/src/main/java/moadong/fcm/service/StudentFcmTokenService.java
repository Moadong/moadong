package moadong.fcm.service;

import lombok.RequiredArgsConstructor;
import moadong.club.repository.ClubRepository;
import moadong.fcm.entity.FcmToken;
import moadong.fcm.entity.StudentFcmToken;
import moadong.fcm.payload.response.ClubSubscribeListResponse;
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
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class StudentFcmTokenService {

    private final StudentFcmTokenRepository studentFcmTokenRepository;
    private final StudentUserRepository studentUserRepository;
    private final FcmTokenRepository fcmTokenRepository;
    private final StudentFcmSubscriptionService studentFcmSubscriptionService;
    private final FcmAsyncService fcmAsyncService;
    private final ClubRepository clubRepository;

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
            saved = replaceStudentToken(studentId, byStudent, newFcmToken);
        }

        studentUser.updateCurrentFcmToken(saved.getToken());
        studentUserRepository.save(studentUser);

        return new StudentFcmTokenRotateResponse(saved.getToken(), replaced, saved.getTimestamp());
    }

    @Transactional(readOnly = true)
    public ClubSubscribeListResponse getSubscribedClubs(String studentId) {
        if (studentId == null || studentId.isBlank()) {
            throw new RestApiException(ErrorCode.TOKEN_INVALID);
        }

        StudentFcmToken token = studentFcmTokenRepository.findByStudentId(studentId)
                .orElseThrow(() -> new RestApiException(ErrorCode.FCMTOKEN_NOT_FOUND));
        return new ClubSubscribeListResponse(token.getClubIds());
    }

    @Transactional
    public void subscribeClubs(String studentId, ArrayList<String> newClubIds) {
        if (studentId == null || studentId.isBlank()) {
            throw new RestApiException(ErrorCode.TOKEN_INVALID);
        }

        StudentFcmToken studentFcmToken = studentFcmTokenRepository.findByStudentId(studentId)
                .orElseThrow(() -> new RestApiException(ErrorCode.FCMTOKEN_NOT_FOUND));

        Set<String> newClubIdSet = Set.copyOf(newClubIds);
        Set<String> oldClubIdSet = Set.copyOf(studentFcmToken.getClubIds());

        Set<String> clubsToSubscribe = new HashSet<>(newClubIdSet);
        clubsToSubscribe.removeAll(oldClubIdSet);

        Set<String> clubsToUnsubscribe = new HashSet<>(oldClubIdSet);
        clubsToUnsubscribe.removeAll(newClubIdSet);

        if (!clubsToSubscribe.isEmpty()) {
            Long countClub = clubRepository.countByIdIn(clubsToSubscribe.stream().toList());

            if (countClub != clubsToSubscribe.size()) {
                throw new RestApiException(ErrorCode.CLUB_NOT_FOUND);
            }
        }

        fcmAsyncService.updateStudentSubscriptions(
                        studentFcmToken.getToken(),
                        newClubIdSet,
                        clubsToSubscribe,
                        clubsToUnsubscribe
                )
                .exceptionally(ex -> null);
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

    private StudentFcmToken replaceStudentToken(String studentId, StudentFcmToken byStudent, String newFcmToken) {
        Optional<StudentFcmToken> byToken = studentFcmTokenRepository.findByToken(newFcmToken);
        if (byToken.isPresent() && !byToken.get().getId().equals(byStudent.getId())) {
            studentFcmTokenRepository.delete(byToken.get());
        }

        String oldFcmToken = byStudent.getToken();
        List<String> finalClubIds = resolveFinalClubIds(byStudent, newFcmToken);
        if (!finalClubIds.isEmpty()) {
            studentFcmSubscriptionService.transferSubscriptions(studentId, oldFcmToken, newFcmToken, finalClubIds);
        }

        byStudent.replaceToken(newFcmToken);
        byStudent.updateClubIds(finalClubIds);
        return studentFcmTokenRepository.save(byStudent);
    }

    private List<String> resolveFinalClubIds(StudentFcmToken byStudent, String newFcmToken) {
        if (!byStudent.getClubIds().isEmpty()) {
            return new ArrayList<>(byStudent.getClubIds());
        }

        return fcmTokenRepository.findFcmTokenByToken(newFcmToken)
                .map(legacy -> new ArrayList<>(legacy.getClubIds()))
                .orElseGet(ArrayList::new);
    }
}
