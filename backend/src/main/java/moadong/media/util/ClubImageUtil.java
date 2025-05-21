package moadong.media.util;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.Normalizer;
import java.util.Set;
import java.util.regex.Pattern;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

public class ClubImageUtil {

    private static final Set<String> ALLOWED_IMAGE_EXTENSIONS = Set.of("jpg", "jpeg", "png", "gif", "bmp", "webp");

    public static boolean containsInvalidChars(String text) {
        text = Normalizer.normalize(text, Normalizer.Form.NFC);
        return Pattern.matches(".*(%[0-9A-Fa-f]{2}|[ㄱ-ㅎㅏ-ㅣ가-힣]|\\s).*", text);
    }

    public static boolean isImageExtension(String originalFilename) {
        if (originalFilename == null || !originalFilename.contains(".")) {
            return false;
        }
        String extension = originalFilename.substring(originalFilename.lastIndexOf(".") + 1).toLowerCase();
        return ALLOWED_IMAGE_EXTENSIONS.contains(extension);
    }

    public static MultipartFile resizeImage(MultipartFile file, long maxSizeBytes) throws IOException {
        double quality = 0.9;
        int maxDim = 2000;
        byte[] result;

        while (true) {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            Thumbnails.of(file.getInputStream())
                    .size(maxDim, maxDim)
                    .outputQuality(quality)
                    .outputFormat("jpg") // 용량 줄이기 좋음
                    .toOutputStream(baos);

            result = baos.toByteArray();

            if (result.length <= maxSizeBytes || (quality <= 0.3 && maxDim <= 800)) {
                break;
            }
            quality -= 0.1;
            maxDim -= 200;
            file = new MockMultipartFile(file.getName(), file.getOriginalFilename(),
                    file.getContentType(), new ByteArrayInputStream(file.getBytes()));
        }

        return new MockMultipartFile(
                file.getName(),
                file.getOriginalFilename(),
                "image/jpeg",
                new ByteArrayInputStream(result)
        );
    }

}
