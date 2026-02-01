package moadong.club.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import moadong.club.entity.WordDictionary;
import moadong.club.payload.request.WordDictionaryBulkCreateRequest;
import moadong.club.payload.request.WordDictionaryCreateRequest;
import moadong.club.payload.request.WordDictionaryUpdateRequest;
import moadong.club.payload.response.WordDictionaryListResponse;
import moadong.club.payload.response.WordDictionaryResponse;
import moadong.club.repository.WordDictionaryRepository;
import moadong.club.util.CsvParser;
import moadong.global.exception.ErrorCode;
import moadong.global.exception.RestApiException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 단어사전 관리자 서비스
 * CSV/JSON 형식으로 단어사전 데이터를 관리
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class WordDictionaryAdminService {

    private final WordDictionaryRepository wordDictionaryRepository;
    private final WordDictionaryService wordDictionaryService;
    private final CsvParser csvParser;

    /**
     * 단일 단어사전 생성
     */
    @Transactional
    public WordDictionaryResponse createWordDictionary(WordDictionaryCreateRequest request) {
        // 중복 체크
        if (wordDictionaryRepository.findByStandardWord(request.standardWord()).isPresent()) {
            throw new RestApiException(ErrorCode.USER_INVALID_FORMAT);
        }

        WordDictionary wordDictionary = WordDictionary.builder()
                .standardWord(request.standardWord())
                .inputWords(request.inputWords())
                .build();

        WordDictionary saved = wordDictionaryRepository.save(wordDictionary);
        
        // 캐시 새로고침
        wordDictionaryService.refreshDictionary();
        
        log.info("단어사전 생성 완료: {}", saved.getStandardWord());
        return toResponse(saved);
    }

    /**
     * JSON으로 일괄 생성
     */
    @Transactional
    public List<WordDictionaryResponse> createWordDictionariesBulk(WordDictionaryBulkCreateRequest request) {
        List<WordDictionary> wordDictionaries = request.wordDictionaries().stream()
                .map(req -> {
                    // 중복 체크
                    if (wordDictionaryRepository.findByStandardWord(req.standardWord()).isPresent()) {
                        log.warn("이미 존재하는 표준단어는 건너뜁니다: {}", req.standardWord());
                        return null;
                    }
                    return WordDictionary.builder()
                            .standardWord(req.standardWord())
                            .inputWords(req.inputWords())
                            .build();
                })
                .filter(dict -> dict != null)
                .collect(Collectors.toList());

        if (wordDictionaries.isEmpty()) {
            throw new RestApiException(ErrorCode.USER_INVALID_FORMAT);
        }

        List<WordDictionary> saved = wordDictionaryRepository.saveAll(wordDictionaries);
        
        // 캐시 새로고침
        wordDictionaryService.refreshDictionary();
        
        log.info("단어사전 일괄 생성 완료: {}개", saved.size());
        return saved.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * CSV 파일로 일괄 생성
     */
    @Transactional
    public List<WordDictionaryResponse> createWordDictionariesFromCsv(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new RestApiException(ErrorCode.FILE_NOT_FOUND);
        }

        // CSV 파싱
        List<WordDictionaryCreateRequest> requests = csvParser.parseWordDictionaryCsv(file);

        // 기존 데이터와 중복 체크하며 저장
        List<WordDictionary> wordDictionaries = requests.stream()
                .map(req -> {
                    // 중복 체크
                    if (wordDictionaryRepository.findByStandardWord(req.standardWord()).isPresent()) {
                        log.warn("이미 존재하는 표준단어는 건너뜁니다: {}", req.standardWord());
                        return null;
                    }
                    return WordDictionary.builder()
                            .standardWord(req.standardWord())
                            .inputWords(req.inputWords())
                            .build();
                })
                .filter(dict -> dict != null)
                .collect(Collectors.toList());

        if (wordDictionaries.isEmpty()) {
            throw new RestApiException(ErrorCode.USER_INVALID_FORMAT);
        }

        List<WordDictionary> saved = wordDictionaryRepository.saveAll(wordDictionaries);
        
        // 캐시 새로고침
        wordDictionaryService.refreshDictionary();
        
        log.info("CSV 파일에서 단어사전 일괄 생성 완료: {}개", saved.size());
        return saved.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * 단어사전 수정
     */
    @Transactional
    public WordDictionaryResponse updateWordDictionary(String id, WordDictionaryUpdateRequest request) {
        WordDictionary wordDictionary = wordDictionaryRepository.findById(id)
                .orElseThrow(() -> new RestApiException(ErrorCode.CLUB_NOT_FOUND));

        // 입력단어 목록 업데이트
        wordDictionary = WordDictionary.builder()
                .id(wordDictionary.getId())
                .standardWord(wordDictionary.getStandardWord())
                .inputWords(request.inputWords())
                .build();

        WordDictionary saved = wordDictionaryRepository.save(wordDictionary);
        
        // 캐시 새로고침
        wordDictionaryService.refreshDictionary();
        
        log.info("단어사전 수정 완료: {}", saved.getStandardWord());
        return toResponse(saved);
    }

    /**
     * 단어사전 삭제
     */
    @Transactional
    public void deleteWordDictionary(String id) {
        WordDictionary wordDictionary = wordDictionaryRepository.findById(id)
                .orElseThrow(() -> new RestApiException(ErrorCode.CLUB_NOT_FOUND));

        wordDictionaryRepository.delete(wordDictionary);
        
        // 캐시 새로고침
        wordDictionaryService.refreshDictionary();
        
        log.info("단어사전 삭제 완료: {}", wordDictionary.getStandardWord());
    }

    /**
     * 단일 단어사전 조회
     */
    public WordDictionaryResponse getWordDictionary(String id) {
        WordDictionary wordDictionary = wordDictionaryRepository.findById(id)
                .orElseThrow(() -> new RestApiException(ErrorCode.CLUB_NOT_FOUND));
        return toResponse(wordDictionary);
    }

    /**
     * 표준단어로 조회
     */
    public WordDictionaryResponse getWordDictionaryByStandardWord(String standardWord) {
        WordDictionary wordDictionary = wordDictionaryRepository.findByStandardWord(standardWord)
                .orElseThrow(() -> new RestApiException(ErrorCode.CLUB_NOT_FOUND));
        return toResponse(wordDictionary);
    }

    /**
     * 전체 단어사전 조회
     */
    public WordDictionaryListResponse getAllWordDictionaries() {
        List<WordDictionary> all = wordDictionaryRepository.findAll();
        List<WordDictionaryResponse> responses = all.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        
        return new WordDictionaryListResponse(all.size(), responses);
    }

    /**
     * 단어사전 새로고침
     */
    public void refreshDictionary() {
        wordDictionaryService.refreshDictionary();
    }

    /**
     * WordDictionary를 WordDictionaryResponse로 변환
     */
    private WordDictionaryResponse toResponse(WordDictionary wordDictionary) {
        return new WordDictionaryResponse(
                wordDictionary.getId(),
                wordDictionary.getStandardWord(),
                wordDictionary.getInputWords()
        );
    }
}
