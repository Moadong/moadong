package moadong.global.util;

import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Arrays;
import java.util.Base64;
import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import lombok.RequiredArgsConstructor;
import moadong.global.config.properties.AppProperties;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AESCipher {

    private static final int GCM_IV_LENGTH = 12;
    private static final int GCM_TAG_BITS = 128;
    private static final String V2_PREFIX = "v2:";

    private final AppProperties appProperties;

    /**
     * AES-256-GCM으로 암호화합니다.
     * 매 호출마다 랜덤 IV를 생성하고, "v2:<Base64(iv || ciphertext)>" 형태로 반환합니다.
     */
    public String encrypt(String text) throws Exception {
        byte[] iv = new byte[GCM_IV_LENGTH];
        new SecureRandom().nextBytes(iv);

        byte[] cipherBytes = gcmEncrypt(text.getBytes(StandardCharsets.UTF_8), iv);

        byte[] combined = new byte[GCM_IV_LENGTH + cipherBytes.length];
        System.arraycopy(iv, 0, combined, 0, GCM_IV_LENGTH);
        System.arraycopy(cipherBytes, 0, combined, GCM_IV_LENGTH, cipherBytes.length);

        return V2_PREFIX + Base64.getEncoder().encodeToString(combined);
    }

    /**
     * 암호화된 문자열을 복호화합니다.
     * "v2:" 접두사가 있으면 내장 IV를 추출해 복호화하고,
     * 없으면 설정 파일의 고정 IV를 사용하는 레거시 경로로 폴백합니다.
     */
    public String decrypt(String cipherText) throws Exception {
        if (cipherText.startsWith(V2_PREFIX)) {
            return decryptV2(cipherText.substring(V2_PREFIX.length()));
        }
        return decryptLegacy(cipherText);
    }

    private String decryptV2(String base64) throws Exception {
        byte[] decoded = Base64.getDecoder().decode(base64);
        byte[] iv = Arrays.copyOfRange(decoded, 0, GCM_IV_LENGTH);
        byte[] cipherBytes = Arrays.copyOfRange(decoded, GCM_IV_LENGTH, decoded.length);

        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
        SecretKeySpec keySpec = buildKeySpec();
        cipher.init(Cipher.DECRYPT_MODE, keySpec, new GCMParameterSpec(GCM_TAG_BITS, iv));

        return new String(cipher.doFinal(cipherBytes), StandardCharsets.UTF_8);
    }

    private String decryptLegacy(String cipherText) throws Exception {
        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
        SecretKeySpec keySpec = buildKeySpec();
        GCMParameterSpec gcmSpec = new GCMParameterSpec(
                GCM_TAG_BITS,
                appProperties.encryption().iv().getBytes(StandardCharsets.UTF_8)
        );
        cipher.init(Cipher.DECRYPT_MODE, keySpec, gcmSpec);

        byte[] decrypted = cipher.doFinal(Base64.getDecoder().decode(cipherText));
        return new String(decrypted, StandardCharsets.UTF_8);
    }

    private byte[] gcmEncrypt(byte[] plaintext, byte[] iv) throws Exception {
        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
        cipher.init(Cipher.ENCRYPT_MODE, buildKeySpec(), new GCMParameterSpec(GCM_TAG_BITS, iv));
        return cipher.doFinal(plaintext);
    }

    private SecretKeySpec buildKeySpec() {
        return new SecretKeySpec(
                appProperties.encryption().key().getBytes(StandardCharsets.UTF_8),
                "AES"
        );
    }
}
