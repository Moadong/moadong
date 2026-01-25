package moadong.club.util;

import lombok.extern.slf4j.Slf4j;
import moadong.club.payload.request.WordDictionaryCreateRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.*;

/**
 * CSV 파일을 파싱하여 WordDictionaryCreateRequest 리스트로 변환하는 유틸리티
 */
@Component
@Slf4j
public class CsvParser {

    /**
     * CSV 파일을 파싱하여 WordDictionaryCreateRequest 리스트로 변환
     * CSV 형식: 표준단어,입력단어,입력단어_정규화,표준단어_정규화
     */
    public List<WordDictionaryCreateRequest> parseWordDictionaryCsv(MultipartFile file) {
        List<WordDictionaryCreateRequest> result = new ArrayList<>();
        
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            
            String line;
            int lineNumber = 0;
            boolean isFirstLine = true;
            
            // 표준단어별로 입력단어들을 그룹화
            Map<String, Set<String>> standardToInputs = new HashMap<>();
            
            while ((line = reader.readLine()) != null) {
                lineNumber++;
                line = line.trim();
                
                // 빈 줄 또는 주석 라인 무시
                if (line.isEmpty() || line.startsWith("#")) {
                    continue;
                }
                
                // 헤더 라인 스킵
                if (isFirstLine) {
                    isFirstLine = false;
                    if (line.startsWith("표준단어") || line.startsWith("standard")) {
                        continue;
                    }
                }
                
                // CSV 파싱 (쉼표로 분리)
                String[] columns = line.split(",");
                if (columns.length < 2) {
                    log.warn("CSV 파일 {}번째 줄이 형식에 맞지 않습니다: {}", lineNumber, line);
                    continue;
                }
                
                // 컬럼 추출
                String standardWord = columns[0].trim();  // 표준단어
                String inputWord = columns[1].trim();      // 입력단어
                
                if (standardWord.isEmpty() || inputWord.isEmpty()) {
                    continue;
                }
                
                // 표준단어별로 입력단어들을 그룹화
                standardToInputs.computeIfAbsent(standardWord, k -> new HashSet<>()).add(inputWord);
            }
            
            // WordDictionaryCreateRequest 리스트로 변환
            for (Map.Entry<String, Set<String>> entry : standardToInputs.entrySet()) {
                WordDictionaryCreateRequest request = new WordDictionaryCreateRequest(
                    entry.getKey(),
                    new ArrayList<>(entry.getValue())
                );
                result.add(request);
            }
            
            log.info("CSV 파일 파싱 완료: {}개 표준단어 그룹", result.size());
            
        } catch (Exception e) {
            log.error("CSV 파일 파싱 실패: {}", e.getMessage(), e);
            throw new RuntimeException("CSV 파일 파싱 중 오류가 발생했습니다: " + e.getMessage(), e);
        }
        
        return result;
    }
}
