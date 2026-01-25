package moadong.club.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import moadong.club.payload.request.WordDictionaryBulkCreateRequest;
import moadong.club.payload.request.WordDictionaryCreateRequest;
import moadong.club.payload.request.WordDictionaryUpdateRequest;
import moadong.club.payload.response.WordDictionaryListResponse;
import moadong.club.payload.response.WordDictionaryResponse;
import moadong.club.service.WordDictionaryAdminService;
import moadong.global.payload.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin/word-dictionary")
@AllArgsConstructor
@Tag(name = "Word_Dictionary_Admin", description = "단어사전 관리자 API")
public class WordDictionaryAdminController {

    private final WordDictionaryAdminService wordDictionaryAdminService;

    @PostMapping
    @Operation(
        summary = "단어사전 단일 생성",
        description = "JSON 형식으로 단일 단어사전을 생성합니다."
    )
    public ResponseEntity<?> createWordDictionary(
            @RequestBody @Validated WordDictionaryCreateRequest request) {
        WordDictionaryResponse response = wordDictionaryAdminService.createWordDictionary(request);
        return Response.ok("단어사전이 생성되었습니다", response);
    }

    @PostMapping("/bulk")
    @Operation(
        summary = "단어사전 일괄 생성",
        description = "JSON 형식으로 여러 단어사전을 일괄 생성합니다."
    )
    public ResponseEntity<?> createWordDictionariesBulk(
            @RequestBody @Validated WordDictionaryBulkCreateRequest request) {
        List<WordDictionaryResponse> responses = wordDictionaryAdminService.createWordDictionariesBulk(request);
        return Response.ok("단어사전이 일괄 생성되었습니다", responses);
    }

    @PostMapping("/csv")
    @Operation(
        summary = "CSV 파일로 단어사전 일괄 생성",
        description = "CSV 파일을 업로드하여 단어사전을 일괄 생성합니다. CSV 형식: 표준단어,입력단어,입력단어_정규화,표준단어_정규화"
    )
    public ResponseEntity<?> createWordDictionariesFromCsv(
            @RequestParam("file") MultipartFile file) {
        List<WordDictionaryResponse> responses = wordDictionaryAdminService.createWordDictionariesFromCsv(file);
        return Response.ok("CSV 파일에서 단어사전이 일괄 생성되었습니다", responses);
    }

    @GetMapping
    @Operation(
        summary = "전체 단어사전 조회",
        description = "모든 단어사전을 조회합니다."
    )
    public ResponseEntity<?> getAllWordDictionaries() {
        WordDictionaryListResponse response = wordDictionaryAdminService.getAllWordDictionaries();
        return Response.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(
        summary = "단어사전 단일 조회",
        description = "ID로 단어사전을 조회합니다."
    )
    public ResponseEntity<?> getWordDictionary(@PathVariable String id) {
        WordDictionaryResponse response = wordDictionaryAdminService.getWordDictionary(id);
        return Response.ok(response);
    }

    @GetMapping("/standard/{standardWord}")
    @Operation(
        summary = "표준단어로 단어사전 조회",
        description = "표준단어로 단어사전을 조회합니다."
    )
    public ResponseEntity<?> getWordDictionaryByStandardWord(@PathVariable String standardWord) {
        WordDictionaryResponse response = wordDictionaryAdminService.getWordDictionaryByStandardWord(standardWord);
        return Response.ok(response);
    }

    @PutMapping("/{id}")
    @Operation(
        summary = "단어사전 수정",
        description = "단어사전의 입력단어 목록을 수정합니다."
    )
    public ResponseEntity<?> updateWordDictionary(
            @PathVariable String id,
            @RequestBody @Validated WordDictionaryUpdateRequest request) {
        WordDictionaryResponse response = wordDictionaryAdminService.updateWordDictionary(id, request);
        return Response.ok("단어사전이 수정되었습니다", response);
    }

    @DeleteMapping("/{id}")
    @Operation(
        summary = "단어사전 삭제",
        description = "단어사전을 삭제합니다."
    )
    public ResponseEntity<?> deleteWordDictionary(@PathVariable String id) {
        wordDictionaryAdminService.deleteWordDictionary(id);
        return Response.ok("단어사전이 삭제되었습니다");
    }

    @PostMapping("/refresh")
    @Operation(
        summary = "단어사전 새로고침",
        description = "MongoDB의 데이터를 메모리 캐시에 다시 로드합니다."
    )
    public ResponseEntity<?> refreshDictionary() {
        wordDictionaryAdminService.refreshDictionary();
        return Response.ok("단어사전이 새로고침되었습니다");
    }
}
