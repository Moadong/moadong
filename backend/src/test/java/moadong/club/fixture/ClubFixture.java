package moadong.club.fixture;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import moadong.club.entity.Club;

public class ClubFixture {

    public static Club createClub(String clubId, String name) {
        Club club = mock(Club.class);
        when(club.getId()).thenReturn(clubId);
        when(club.getName()).thenReturn(name);
        return club;
    }

}
