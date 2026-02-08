package moadong.club.service;

import java.util.List;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import moadong.club.entity.Club;
import moadong.club.entity.ClubRecruitmentInformation;
import moadong.club.repository.ClubRepository;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * Resolve된 표시용 이미지 URL(logo/cover/feedImages)이 DB 값과 다를 때만 Club을 갱신한다.
 * webp URL을 DB에 반영해 두어 이후 조회 시 S3 HEAD 없이 사용할 수 있게 한다.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ClubImageUrlPersistenceService {

    private final ClubRepository clubRepository;

    /**
     * Resolve된 URL을 DB에 비동기로 반영한다. 인자 중 null이 아닌 것만 비교·반영한다.
     * (검색 경로는 logo만, 상세는 logo/cover/feeds 모두 전달 가능)
     */
    @Async("imageUrlAsync")
    public void schedulePersistResolvedUrls(
            String clubId,
            String resolvedLogo,
            String resolvedCover,
            List<String> resolvedFeedImages) {
        try {
            Club club = clubRepository.findById(clubId).orElse(null);
            if (club == null) {
                log.debug("Club not found for image URL persist, clubId={}", clubId);
                return;
            }
            ClubRecruitmentInformation info = club.getClubRecruitmentInformation();
            if (info == null) {
                return;
            }
            boolean changed = false;
            if (resolvedLogo != null && !Objects.equals(info.getLogo(), resolvedLogo)) {
                club.updateLogo(resolvedLogo);
                changed = true;
            }
            if (resolvedCover != null && !Objects.equals(info.getCover(), resolvedCover)) {
                club.updateCover(resolvedCover);
                changed = true;
            }
            if (resolvedFeedImages != null && !Objects.equals(info.getFeedImages(), resolvedFeedImages)) {
                club.updateFeedImages(resolvedFeedImages);
                changed = true;
            }
            if (changed) {
                clubRepository.save(club);
            }
        } catch (Exception e) {
            log.warn("Failed to persist resolved image URLs for clubId={}", clubId, e);
        }
    }
}
