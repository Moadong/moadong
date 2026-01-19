package moadong.club.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import moadong.club.entity.Club;
import moadong.club.entity.ClubDescription;
import moadong.club.entity.ClubRecruitmentInformation;
import moadong.club.repository.ClubRepository;
import org.springframework.ai.document.Document;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClubEmbeddingService {
    private final ClubRepository clubRepository;
    private final VectorStore vectorStore;

    @Async // 이 메서드는 별도 스레드에서 돕니다! (사용자 응답 대기 X)
    public void updateVector(Club club) {
        processVectorSync(club);
    }

    @Async // 이것도 오래 걸리니까 비동기로!
    public void syncAllClubsAsync() {
        log.info("=== 전체 동아리 벡터 마이그레이션 시작 ===");

        int page = 0;
        int size = 100; // 한 번에 100개씩 처리
        long totalCount = 0;

        while (true) {
            // 1. 페이징 조회
            Page<Club> clubPage = clubRepository.findAll(PageRequest.of(page, size));

            if (clubPage.isEmpty()) {
                break; // 데이터 없으면 종료
            }

            // 2. 루프 돌면서 벡터 생성 (기존 updateVector 재활용!)
            for (Club club : clubPage.getContent()) {
                try {
                    // 주의: updateVector가 @Async면 내부 호출 시 비동기 안 됨.
                    // 그래서 여기서는 로직을 분리하거나, this.updateVector 말고
                    // 내부 로직을 직접 수행하는 private 메서드를 호출해야 함.
                    processVectorSync(club);
                    totalCount++;
                } catch (Exception e) {
                    log.error("동아리(ID={}) 마이그레이션 실패: {}", club.getId(), e.getMessage());
                }
            }

            log.info("현재 {}개 처리 완료...", totalCount);
            page++; // 다음 페이지
        }

        log.info("=== 마이그레이션 종료. 총 {}개 처리됨 ===", totalCount);
    }

    private void processVectorSync(Club club){
        log.info("백그라운드 벡터 작업 시작: {}", club.getName());

        try {
            ClubRecruitmentInformation info = club.getClubRecruitmentInformation();

            if (info == null) {
                log.warn("동아리(ID={})의 모집 정보가 없어 벡터 생성을 건너뜁니다.", club.getId());
                return; // 또는 info = new ClubRecruitmentInformation() 처럼 빈 객체로 초기화
            }

            // 텍스트 조합 로직 (그대로 가져옴)
            Optional<ClubRecruitmentInformation> infoOpt = Optional.ofNullable(club.getClubRecruitmentInformation());

            String tags = infoOpt
                    .map(ClubRecruitmentInformation::getTags) // 태그 리스트 꺼냄
                    .map(t -> String.join(", ", t))           // 리스트를 문자열로 조인
                    .orElse("");
            String intro = infoOpt
                    .map(ClubRecruitmentInformation::getIntroduction)
                    .orElse("");
            String desc = Optional.ofNullable(club.getClubDescription())
                    .map(ClubDescription::getIntroDescription)
                    .orElse("");

            String category = Optional.ofNullable(club.getCategory()).orElse("");
            String name = Optional.ofNullable(club.getName()).orElse("이름 없음");

            String content = String.format("""
                동아리 이름: %s
                카테고리: %s
                태그: %s
                한줄 소개: %s
                상세 내용: %s
                """,
                name,
                category,
                tags,
                intro,
                desc
            );

            Document document = new Document(
                    club.getId().toString(),
                    content,
                    Map.of("clubId", club.getId().toString())
            );

            try {
                vectorStore.delete(List.of(club.getId().toString()));
            } catch (Exception e) {
                // 없어서 에러난 거면 괜찮음. 굳이 error 로그 찍어서 알림 띄울 필요 없음.
                log.debug("기존 벡터 삭제 중 예외 발생 (최초 생성 시 무시 가능): {}", e.getMessage());
            }

            vectorStore.add(List.of(document));

            log.info("백그라운드 벡터 작업 완료: {}", club.getName());

        } catch (Exception e) {
            // 비동기라 예외 터져도 사용자한텐 모름 -> 로그 꼭 남겨야 함
            log.error("벡터 생성 중 오류 발생: {}", e.getMessage(), e);
        }
    }
}
