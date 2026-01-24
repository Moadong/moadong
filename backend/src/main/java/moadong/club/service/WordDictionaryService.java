package moadong.club.service;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import moadong.club.entity.WordDictionary;
import moadong.club.repository.WordDictionaryRepository;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 단어사전 서비스
 * MongoDB에서 동의어/유사어 매핑을 로드하여 키워드 확장 기능 제공
 * MongoDB에 데이터가 없으면 CSV 파일에서 초기화
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class WordDictionaryService {

    private static final String CSV_FILE_PATH = "club_keyword_dictionary_long_expanded_cleaned.csv";
    // 입력단어(정규화) → 확장된 키워드 리스트 (표준단어 + 같은 표준단어를 가진 모든 입력단어들)
    private Map<String, List<String>> dictionary = new HashMap<>();
    
    private final WordDictionaryRepository wordDictionaryRepository;

    @PostConstruct
    public void init() {
        // MongoDB에 데이터가 없으면 CSV에서 초기화
        if (wordDictionaryRepository.count() == 0) {
            log.info("MongoDB에 단어사전 데이터가 없습니다. CSV 파일에서 초기화합니다.");
            loadFromCsvAndSaveToMongo();
        }
        
        // MongoDB에서 데이터 로드
        loadDictionaryFromMongo();
    }

    /**
     * CSV 파일을 읽어서 MongoDB에 저장 (초기화용)
     * 새로운 형식: 표준단어,입력단어,입력단어_정규화,표준단어_정규화
     */
    private void loadFromCsvAndSaveToMongo() {
        try {
            ClassPathResource resource = new ClassPathResource(CSV_FILE_PATH);
            
            if (!resource.exists()) {
                log.warn("단어사전 CSV 파일을 찾을 수 없습니다: {}", CSV_FILE_PATH);
                return;
            }

            // 1단계: 표준단어별로 그룹화
            // 표준단어 → 해당 표준단어를 가진 모든 입력단어 리스트
            Map<String, Set<String>> standardToInputs = new HashMap<>();
            
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {
                
                String line;
                int lineNumber = 0;
                boolean isFirstLine = true;
                
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
            }
            
            // 2단계: 각 입력단어를 키로 하여 해당 표준단어 그룹의 모든 입력단어들을 값으로 매핑
            for (Map.Entry<String, Set<String>> entry : standardToInputs.entrySet()) {
                String standardWord = entry.getKey();
                Set<String> inputWords = entry.getValue();
                
                // 표준단어와 모든 입력단어를 포함한 확장 리스트 생성
                List<String> expandedList = new ArrayList<>(inputWords);
                // 표준단어가 inputWords에 없으면 추가
                if (!expandedList.contains(standardWord)) {
                    expandedList.add(standardWord);
                }
                
                // 표준단어를 키로 하여 해당 그룹의 모든 단어들을 값으로 매핑
                String normalizedStandard = standardWord.toLowerCase();
                dictionary.computeIfAbsent(normalizedStandard, k -> new ArrayList<>())
                        .addAll(expandedList);
                
                // 각 입력단어를 키로 하여 해당 그룹의 모든 단어들을 값으로 매핑
                for (String inputWord : inputWords) {
                    // 입력단어의 정규화 버전을 키로 사용
                    String normalizedInput = inputWord.toLowerCase();
                    
                    // 이미 존재하는 경우 기존 리스트에 병합 (중복 제거)
                    dictionary.computeIfAbsent(normalizedInput, k -> new ArrayList<>())
                            .addAll(expandedList);
                }
            }
            
            // MongoDB에 저장 (표준단어는 inputWords에 포함하지 않음 - 기존 구조 유지)
            List<WordDictionary> wordDictionaries = new ArrayList<>();
            for (Map.Entry<String, Set<String>> entry : standardToInputs.entrySet()) {
                WordDictionary wordDict = WordDictionary.builder()
                        .standardWord(entry.getKey())
                        .inputWords(new ArrayList<>(entry.getValue()))
                        .build();
                wordDictionaries.add(wordDict);
            }
            
            wordDictionaryRepository.saveAll(wordDictionaries);
            log.info("CSV 파일에서 MongoDB로 {}개 표준단어 그룹 저장 완료", wordDictionaries.size());
                
        } catch (Exception e) {
            log.error("CSV 파일 로드 및 MongoDB 저장 실패: {}", e.getMessage(), e);
        }
    }

    /**
     * MongoDB에서 단어사전 로드
     */
    private void loadDictionaryFromMongo() {
        try {
            List<WordDictionary> allDictionaries = wordDictionaryRepository.findAll();
            
            // 입력단어 → 확장된 키워드 리스트 매핑 생성
            for (WordDictionary wordDict : allDictionaries) {
                String standardWord = wordDict.getStandardWord();
                List<String> inputWords = wordDict.getInputWords();
                
                // 표준단어와 모든 입력단어를 포함한 확장 리스트 생성
                List<String> expandedList = new ArrayList<>(inputWords);
                // 표준단어가 inputWords에 없으면 추가
                if (!expandedList.contains(standardWord)) {
                    expandedList.add(standardWord);
                }
                
                // 표준단어를 키로 하여 해당 그룹의 모든 단어들을 값으로 매핑
                String normalizedStandard = standardWord.toLowerCase();
                dictionary.computeIfAbsent(normalizedStandard, k -> new ArrayList<>())
                        .addAll(expandedList);
                
                // 각 입력단어를 키로 하여 해당 그룹의 모든 단어들을 값으로 매핑
                for (String inputWord : inputWords) {
                    String normalizedInput = inputWord.toLowerCase();
                    
                    dictionary.computeIfAbsent(normalizedInput, k -> new ArrayList<>())
                            .addAll(expandedList);
                }
            }
            
            // 중복 제거
            for (Map.Entry<String, List<String>> entry : dictionary.entrySet()) {
                List<String> uniqueList = entry.getValue().stream()
                        .distinct()
                        .collect(Collectors.toList());
                entry.setValue(uniqueList);
            }
            
            log.info("MongoDB에서 단어사전 로드 완료: {}개 입력단어, {}개 표준단어 그룹", 
                    dictionary.size(), allDictionaries.size());
                
        } catch (Exception e) {
            log.error("MongoDB에서 단어사전 로드 실패: {}", e.getMessage(), e);
        }
    }
    
    /**
     * 단어사전 새로고침 (MongoDB 데이터 변경 시 호출)
     */
    public void refreshDictionary() {
        dictionary.clear();
        loadDictionaryFromMongo();
        log.info("단어사전 새로고침 완료");
    }

    /**
     * 키워드를 동의어/유사어로 확장
     * @param keyword 검색 키워드
     * @return 확장된 키워드 리스트 (원본 키워드 포함)
     */
    public List<String> expandKeywords(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return List.of();
        }
        
        String normalizedKeyword = keyword.trim().toLowerCase();
        
        // 단어사전에서 찾기
        List<String> expanded = dictionary.get(normalizedKeyword);
        
        if (expanded != null && !expanded.isEmpty()) {
            return expanded;
        }
        
        // 매칭되는 키워드가 없으면 원본 키워드만 반환
        return List.of(keyword.trim());
    }
}
