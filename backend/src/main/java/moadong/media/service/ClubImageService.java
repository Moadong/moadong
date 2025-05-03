package moadong.media.service;

import java.util.List;
import moadong.club.entity.Club;
import org.springframework.web.multipart.MultipartFile;

public interface ClubImageService {

    String uploadLogo(String clubId, MultipartFile file);

    void deleteLogo(String clubId);

    String uploadFeed(String clubId, MultipartFile file);

    void updateFeeds(String clubId, List<String> newFeedImageList);

    void deleteFile(Club club, String filePath);

}
