package moadong.global.util;

import java.util.Random;

public class RandomStringUtil {

    // 영어 알파벳 대소문자 배열
    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    // 주어진 길이만큼 랜덤 문자열 생성
    public static String generateRandomString(int length) {
        Random random = new Random();
        StringBuilder randomString = new StringBuilder(length);

        for (int i = 0; i < length; i++) {
            int index = random.nextInt(CHARACTERS.length());
            randomString.append(CHARACTERS.charAt(index));
        }

        return randomString.toString();
    }
}

