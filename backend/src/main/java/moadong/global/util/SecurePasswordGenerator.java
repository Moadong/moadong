package moadong.global.util;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;

@Component
public class SecurePasswordGenerator {

    // 알파벳 대소문자와 특수문자 배열
    private static final String ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    private static final String NUMBERS = "0123456789";
    private static final String SPECIAL = "!@#$%^&*?/";

    private static final String ALL = ALPHABET + NUMBERS + SPECIAL;

    private final SecureRandom secureRandom = new SecureRandom();

    //영어, 숫자, 특수문자 각각 최소 1개씩
    public String generate(int length) {
        StringBuilder password = new StringBuilder(length);

        password.append(ALPHABET.charAt(secureRandom.nextInt(ALPHABET.length())));
        password.append(NUMBERS.charAt(secureRandom.nextInt(NUMBERS.length())));
        password.append(SPECIAL.charAt(secureRandom.nextInt(SPECIAL.length())));

        for (int i = 0; i < length; i++) {
            int index = secureRandom.nextInt(ALL.length());
            password.append(ALL.charAt(index));
        }

        //뒤섞기
        return shuffleString(password.toString(), secureRandom);
    }

    private static String shuffleString(String password, SecureRandom secureRandom) {
        char[] characters = password.toCharArray();
        for (int i = characters.length - 1; i > 0; i--) {
            int j = secureRandom.nextInt(i + 1);
            char tmp = characters[i];
            characters[i] = characters[j];
            characters[j] = tmp;
        }
        return new String(characters);
    }
}
