package moadong.club.enums;

public enum ApplicationStatus {
    DRAFT,                     // 작성 중
    SUBMITTED,                 // 제출 완료
    SCREENING,                 // 서류 심사 중
    SCREENING_PASSED,          // 서류 통과
    SCREENING_FAILED,          // 서류 탈락
    INTERVIEW_SCHEDULED,       // 면접 일정 확정
    INTERVIEW_IN_PROGRESS,     // 면접 진행 중
    INTERVIEW_PASSED,          // 면접 통과
    INTERVIEW_FAILED,          // 면접 탈락
    OFFERED,                   // 최종 합격 제안
    ACCEPTED,                  // 제안 수락
    DECLINED,                  // 제안 거절
    CANCELED_BY_APPLICANT      // 지원자 자진 철회
}