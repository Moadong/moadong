package moadong.club.service;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import moadong.club.entity.Club;
import moadong.club.repository.ClubRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
class ClubImageUrlPersistenceServiceTest {

    @Mock
    private ClubRepository clubRepository;

    @InjectMocks
    private ClubImageUrlPersistenceService clubImageUrlPersistenceService;

    @Test
    void schedulePersistResolvedUrls_호출_시_resolved_값이_다르면_club을_갱신하고_save_한다() {
        String clubId = "club1";
        String resolvedLogo = "https://cdn.example.com/path/logo.webp";
        Club club = new Club(clubId, "user1");
        club.getClubRecruitmentInformation().updateLogo("https://cdn.example.com/path/logo.jpg");

        when(clubRepository.findById(clubId)).thenReturn(Optional.of(club));

        clubImageUrlPersistenceService.schedulePersistResolvedUrls(clubId, resolvedLogo, null, null);

        ArgumentCaptor<Club> captor = ArgumentCaptor.forClass(Club.class);
        verify(clubRepository).save(captor.capture());
        Club saved = captor.getValue();
        assertEquals(resolvedLogo, saved.getClubRecruitmentInformation().getLogo());
    }

    @Test
    void schedulePersistResolvedUrls_호출_시_resolved_값이_같으면_save_하지_않는다() {
        String clubId = "club1";
        String sameLogo = "https://cdn.example.com/path/logo.webp";
        Club club = new Club(clubId, "user1");
        club.getClubRecruitmentInformation().updateLogo(sameLogo);

        when(clubRepository.findById(clubId)).thenReturn(Optional.of(club));

        clubImageUrlPersistenceService.schedulePersistResolvedUrls(clubId, sameLogo, null, null);

        verify(clubRepository, org.mockito.Mockito.never()).save(any(Club.class));
    }

    @Test
    void schedulePersistResolvedUrls_club이_없으면_save_하지_않는다() {
        when(clubRepository.findById("nonexistent")).thenReturn(Optional.empty());

        clubImageUrlPersistenceService.schedulePersistResolvedUrls("nonexistent", "https://cdn.example.com/logo.webp", null, null);

        verify(clubRepository, org.mockito.Mockito.never()).save(any(Club.class));
    }
}
