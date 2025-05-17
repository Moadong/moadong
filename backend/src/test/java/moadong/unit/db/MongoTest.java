package moadong.unit.db;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.util.List;
import moadong.club.entity.Club;
import moadong.club.repository.ClubRepository;
import moadong.util.annotations.IntegrationTest;
import moadong.util.annotations.MongoTestContainerSupport;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

@IntegrationTest
public class MongoTest extends MongoTestContainerSupport {

    @Autowired
    private ClubRepository clubRepository;

    @Test
    public void testMongoDBConnection() {

        assertNotNull(clubRepository);

        Club club = new Club();
        clubRepository.save(club);
        List<Club> all = clubRepository.findAll();
        assertEquals( 1, all.size());
        assertEquals( club.getId(), all.get(0).getId());
    }
}
