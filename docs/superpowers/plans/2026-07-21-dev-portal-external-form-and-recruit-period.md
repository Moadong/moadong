# 개발자 포털 외부폼 연결 + 지원기간 설정 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 개발자 포털에서 임의 동아리의 외부 지원폼(구글/네이버) 연결·활성화/미게시 토글·삭제와 지원기간 설정을 할 수 있게 한다.

**Architecture:** `/api/admin/**`(이미 `hasRole("DEVELOPER")` 보호) 아래에 clubId를 파라미터로 받는 지원폼 관리 엔드포인트를 새 컨트롤러로 추가하고, `ClubApplyAdminService`에 clubId를 명시적으로 받는 메서드를 추가한다(기존 본인-동아리 메서드는 건드리지 않음). 개발자 포털 정적 페이지 `dev/edit.html`에 UI 섹션을 추가한다. 지원기간은 기존 `PUT /api/admin/club/{clubId}/description`를 그대로 사용한다(신규 백엔드 없음).

**Tech Stack:** Spring Boot 3.3.8 / Java 17 / MongoDB, 정적 HTML+바닐라 JS(dev portal).

## Global Constraints

- 백엔드 응답은 `moadong.global.payload.Response`(record) 래퍼 사용: `Response.ok(data)`.
- DTO는 `payload/request`·`payload/response`에 Java `record`로 정의.
- 서비스는 `@Service @AllArgsConstructor`, 필드 주입 방식(기존 `ClubApplyAdminService` 패턴).
- 외부 URL 허용 도메인 검증은 엔티티 `ClubApplicationForm.updateExternalApplicationUrl`가 담당(위반 시 `ErrorCode.NOT_ALLOWED_EXTERNAL_URL`). 허용: `https://forms.gle`, `https://docs.google.com/forms`, `https://form.naver.com`, `https://naver.me`, `https://everytime.kr`.
- 학기 검증은 기존 `ClubApplyAdminService.validateSemester(Integer, SemesterTerm)`(private, 같은 클래스에서 호출) — 현재+향후 2개 학기만 허용, 위반 시 `ErrorCode.APPLICATION_SEMESTER_INVALID`.
- 폼 생성만 하면 status가 `UNPUBLISHED`라 지원 목록에 안 뜬다. 연결 시 반드시 `updateFormStatus(true)`로 `ACTIVE` 설정.
- 통합 테스트는 `@moadong.util.annotations.IntegrationTest`(SpringBootTest, 실제 Mongo 필요) 사용. 로컬 실행 전 `./gradlew setupDev`로 시크릿 세팅 필요.
- 커밋 메시지 마지막 줄: `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`

---

## File Structure

- Create `backend/.../club/payload/request/AdminExternalFormConnectRequest.java` — 외부폼 연결 요청 DTO
- Create `backend/.../club/payload/response/AdminClubApplicationFormResponse.java` — 목록/응답 항목 DTO
- Modify `backend/.../club/service/ClubApplyAdminService.java` — clubId 기반 메서드 4개 추가
- Create `backend/.../club/controller/ClubApplicationAdminController.java` — `/api/admin` 엔드포인트 4개
- Create `backend/.../test/java/moadong/club/service/ClubApplicationAdminServiceTest.java` — 서비스 통합 테스트
- Modify `backend/src/main/resources/static/dev/edit.html` — "지원폼 연결(외부)" 섹션 + JS

패키지 prefix: `backend/src/main/java/moadong`, 테스트 prefix: `backend/src/test/java/moadong`.

---

## Task 1: 백엔드 DTO + 서비스 메서드 (+ 통합 테스트)

**Files:**
- Create: `backend/src/main/java/moadong/club/payload/request/AdminExternalFormConnectRequest.java`
- Create: `backend/src/main/java/moadong/club/payload/response/AdminClubApplicationFormResponse.java`
- Modify: `backend/src/main/java/moadong/club/service/ClubApplyAdminService.java`
- Test: `backend/src/test/java/moadong/club/service/ClubApplicationAdminServiceTest.java`

**Interfaces:**
- Produces (컨트롤러가 소비):
  - `List<AdminClubApplicationFormResponse> ClubApplyAdminService.getApplicationFormsForClub(String clubId)`
  - `void ClubApplyAdminService.connectExternalApplicationFormForClub(String clubId, AdminExternalFormConnectRequest request)`
  - `void ClubApplyAdminService.setApplicationFormStatusForClub(String clubId, String formId, boolean active)`
  - `void ClubApplyAdminService.deleteApplicationFormForClub(String clubId, String formId)`
  - `record AdminExternalFormConnectRequest(String title, String externalApplicationUrl, Integer semesterYear, SemesterTerm semesterTerm)`
  - `record AdminClubApplicationFormResponse(String id, String title, ApplicationFormMode formMode, ApplicationFormStatus status, String externalApplicationUrl, Integer semesterYear, SemesterTerm semesterTerm)`

- [ ] **Step 1: 요청 DTO 생성**

Create `AdminExternalFormConnectRequest.java`:

```java
package moadong.club.payload.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import moadong.club.enums.SemesterTerm;

public record AdminExternalFormConnectRequest(
        @Size(max = 50)
        String title,

        @NotBlank
        String externalApplicationUrl,

        @NotNull
        @Min(2000)
        @Max(2999)
        Integer semesterYear,

        @NotNull
        SemesterTerm semesterTerm
) {
    public String titleOrDefault() {
        return (title == null || title.isBlank()) ? "외부 지원폼" : title;
    }
}
```

- [ ] **Step 2: 응답 DTO 생성**

Create `AdminClubApplicationFormResponse.java`:

```java
package moadong.club.payload.response;

import lombok.Builder;
import moadong.club.entity.ClubApplicationForm;
import moadong.club.enums.ApplicationFormMode;
import moadong.club.enums.ApplicationFormStatus;
import moadong.club.enums.SemesterTerm;

@Builder
public record AdminClubApplicationFormResponse(
        String id,
        String title,
        ApplicationFormMode formMode,
        ApplicationFormStatus status,
        String externalApplicationUrl,
        Integer semesterYear,
        SemesterTerm semesterTerm
) {
    public static AdminClubApplicationFormResponse from(ClubApplicationForm form) {
        return AdminClubApplicationFormResponse.builder()
                .id(form.getId())
                .title(form.getTitle())
                .formMode(form.getFormMode())
                .status(form.getStatus())
                .externalApplicationUrl(form.getExternalApplicationUrl())
                .semesterYear(form.getSemesterYear())
                .semesterTerm(form.getSemesterTerm())
                .build();
    }
}
```

- [ ] **Step 3: 실패하는 테스트 작성**

Create `ClubApplicationAdminServiceTest.java` (기존 `ClubApplyAdminServiceTest`의 setUp 패턴 복제):

```java
package moadong.club.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import moadong.club.entity.Club;
import moadong.club.entity.ClubApplicationForm;
import moadong.club.enums.ApplicationFormMode;
import moadong.club.enums.ApplicationFormStatus;
import moadong.club.enums.SemesterTerm;
import moadong.club.payload.request.AdminExternalFormConnectRequest;
import moadong.club.payload.response.AdminClubApplicationFormResponse;
import moadong.club.repository.ClubApplicationFormsRepository;
import moadong.club.repository.ClubRepository;
import moadong.global.exception.RestApiException;
import moadong.util.annotations.IntegrationTest;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

@IntegrationTest
public class ClubApplicationAdminServiceTest {

    @Autowired
    private ClubApplyAdminService clubApplyAdminService;
    @Autowired
    private ClubRepository clubRepository;
    @Autowired
    private ClubApplicationFormsRepository clubApplicationFormsRepository;

    private String clubId;

    private int currentSemesterYear() {
        return java.time.ZonedDateTime.now(java.time.ZoneId.of("Asia/Seoul")).toLocalDate().getYear();
    }

    private SemesterTerm currentSemesterTerm() {
        int month = java.time.ZonedDateTime.now(java.time.ZoneId.of("Asia/Seoul")).toLocalDate().getMonthValue();
        return month < 7 ? SemesterTerm.FIRST : SemesterTerm.SECOND;
    }

    @BeforeEach
    void setUp() {
        Club club = new Club("dev-portal-test-user");
        clubRepository.save(club);
        this.clubId = club.getId();
    }

    @AfterEach
    void tearDown() {
        clubApplicationFormsRepository.findByClubId(clubId)
                .forEach(clubApplicationFormsRepository::delete);
        clubRepository.deleteById(clubId);
    }

    @Test
    @DisplayName("외부폼 연결 시 EXTERNAL + ACTIVE 상태로 생성된다")
    void connectExternalForm_createsActiveExternalForm() {
        AdminExternalFormConnectRequest request = new AdminExternalFormConnectRequest(
                "구글폼", "https://forms.gle/abcd", currentSemesterYear(), currentSemesterTerm());

        clubApplyAdminService.connectExternalApplicationFormForClub(clubId, request);

        List<ClubApplicationForm> forms = clubApplicationFormsRepository.findByClubId(clubId);
        assertEquals(1, forms.size());
        assertEquals(ApplicationFormMode.EXTERNAL, forms.get(0).getFormMode());
        assertEquals(ApplicationFormStatus.ACTIVE, forms.get(0).getStatus());
        assertEquals("https://forms.gle/abcd", forms.get(0).getExternalApplicationUrl());
    }

    @Test
    @DisplayName("허용되지 않은 외부 URL이면 예외가 발생한다")
    void connectExternalForm_rejectsNotAllowedUrl() {
        AdminExternalFormConnectRequest request = new AdminExternalFormConnectRequest(
                "잘못된폼", "https://evil.example.com/form", currentSemesterYear(), currentSemesterTerm());

        assertThrows(RestApiException.class,
                () -> clubApplyAdminService.connectExternalApplicationFormForClub(clubId, request));
    }

    @Test
    @DisplayName("상태 토글: active=false면 ACTIVE에서 PUBLISHED로 내려가 지원 목록에서 빠진다")
    void setStatus_deactivatesActiveForm() {
        AdminExternalFormConnectRequest request = new AdminExternalFormConnectRequest(
                "구글폼", "https://forms.gle/abcd", currentSemesterYear(), currentSemesterTerm());
        clubApplyAdminService.connectExternalApplicationFormForClub(clubId, request);
        String formId = clubApplicationFormsRepository.findByClubId(clubId).get(0).getId();

        clubApplyAdminService.setApplicationFormStatusForClub(clubId, formId, false);

        ClubApplicationForm form = clubApplicationFormsRepository.findByClubIdAndId(clubId, formId).orElseThrow();
        assertEquals(ApplicationFormStatus.PUBLISHED, form.getStatus());
    }

    @Test
    @DisplayName("목록 조회는 해당 동아리 폼을 반환한다")
    void getForms_returnsClubForms() {
        AdminExternalFormConnectRequest request = new AdminExternalFormConnectRequest(
                "구글폼", "https://forms.gle/abcd", currentSemesterYear(), currentSemesterTerm());
        clubApplyAdminService.connectExternalApplicationFormForClub(clubId, request);

        List<AdminClubApplicationFormResponse> forms = clubApplyAdminService.getApplicationFormsForClub(clubId);
        assertEquals(1, forms.size());
        assertEquals("구글폼", forms.get(0).title());
    }

    @Test
    @DisplayName("삭제하면 폼이 사라진다")
    void deleteForm_removesForm() {
        AdminExternalFormConnectRequest request = new AdminExternalFormConnectRequest(
                "구글폼", "https://forms.gle/abcd", currentSemesterYear(), currentSemesterTerm());
        clubApplyAdminService.connectExternalApplicationFormForClub(clubId, request);
        String formId = clubApplicationFormsRepository.findByClubId(clubId).get(0).getId();

        clubApplyAdminService.deleteApplicationFormForClub(clubId, formId);

        assertTrue(clubApplicationFormsRepository.findByClubId(clubId).isEmpty());
    }
}
```

- [ ] **Step 4: 테스트가 컴파일 실패/실패하는지 확인**

Run: `cd backend && ./gradlew integrationTest --tests "moadong.club.service.ClubApplicationAdminServiceTest"`
Expected: 컴파일 실패 (메서드 `connectExternalApplicationFormForClub` 등 미정의).

- [ ] **Step 5: 서비스 메서드 구현**

Modify `ClubApplyAdminService.java`. 필요한 import 추가:

```java
import moadong.club.enums.ApplicationFormStatus;
import moadong.club.payload.request.AdminExternalFormConnectRequest;
import moadong.club.payload.response.AdminClubApplicationFormResponse;
```

클래스 안(기존 메서드들 옆)에 아래 4개 메서드 추가:

```java
public List<AdminClubApplicationFormResponse> getApplicationFormsForClub(String clubId) {
    return clubApplicationFormsRepository.findByClubId(clubId).stream()
            .map(AdminClubApplicationFormResponse::from)
            .toList();
}

public void connectExternalApplicationFormForClub(String clubId, AdminExternalFormConnectRequest request) {
    validateSemester(request.semesterYear(), request.semesterTerm());

    ClubApplicationForm form = ClubApplicationForm.builder().clubId(clubId).build();
    form.updateFormTitle(request.titleOrDefault());
    form.updateFormMode(ApplicationFormMode.EXTERNAL);
    form.updateExternalApplicationUrl(request.externalApplicationUrl());
    form.updateSemesterYear(request.semesterYear());
    form.updateSemesterTerm(request.semesterTerm());
    form.updateFormStatus(true); // ACTIVE (게시)
    clubApplicationFormsRepository.save(form);
}

@Transactional
public void setApplicationFormStatusForClub(String clubId, String formId, boolean active) {
    ClubApplicationForm form = clubApplicationFormsRepository.findByClubIdAndId(clubId, formId)
            .orElseThrow(() -> new RestApiException(ErrorCode.APPLICATION_NOT_FOUND));
    form.updateFormStatus(active);
    form.updateEditedAt();
    clubApplicationFormsRepository.save(form);
}

@Transactional
public void deleteApplicationFormForClub(String clubId, String formId) {
    ClubApplicationForm form = clubApplicationFormsRepository.findByClubIdAndId(clubId, formId)
            .orElseThrow(() -> new RestApiException(ErrorCode.APPLICATION_NOT_FOUND));
    clubApplicantsRepository.deleteAllByFormId(form.getId());
    clubApplicationFormsRepository.delete(form);
}
```

- [ ] **Step 6: 테스트 통과 확인**

Run: `cd backend && ./gradlew integrationTest --tests "moadong.club.service.ClubApplicationAdminServiceTest"`
Expected: 5개 테스트 PASS.

- [ ] **Step 7: 커밋**

```bash
cd backend && git add src/main/java/moadong/club/payload/request/AdminExternalFormConnectRequest.java \
  src/main/java/moadong/club/payload/response/AdminClubApplicationFormResponse.java \
  src/main/java/moadong/club/service/ClubApplyAdminService.java \
  src/test/java/moadong/club/service/ClubApplicationAdminServiceTest.java
git commit -m "feat(admin): 개발자용 clubId 기반 외부폼 연결/토글/삭제 서비스 추가

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: 백엔드 컨트롤러 (`/api/admin` 엔드포인트 4개)

**Files:**
- Create: `backend/src/main/java/moadong/club/controller/ClubApplicationAdminController.java`

**Interfaces:**
- Consumes: Task 1의 `ClubApplyAdminService` 메서드 4개, DTO 2개.
- Produces (프론트가 소비하는 HTTP 계약):
  - `GET /api/admin/club/{clubId}/application` → `Response.ok(List<AdminClubApplicationFormResponse>)`
  - `POST /api/admin/club/{clubId}/application` (body `AdminExternalFormConnectRequest`) → `Response.ok("success connect external application form")`
  - `PATCH /api/admin/club/{clubId}/application/{formId}/status` (body `{ "active": boolean }`) → `Response.ok("success update application status")`
  - `DELETE /api/admin/club/{clubId}/application/{formId}` → `Response.ok("success delete application")`

- [ ] **Step 1: 컨트롤러 생성**

Create `ClubApplicationAdminController.java`:

```java
package moadong.club.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import moadong.club.payload.request.AdminExternalFormConnectRequest;
import moadong.club.service.ClubApplyAdminService;
import moadong.global.payload.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@AllArgsConstructor
@Tag(name = "Club Application Admin", description = "동아리 지원폼 관리자 API (개발자 전용)")
public class ClubApplicationAdminController {

    private final ClubApplyAdminService clubApplyAdminService;

    @GetMapping("/club/{clubId}/application")
    @Operation(summary = "동아리 지원폼 목록 조회 (관리자)", description = "DEVELOPER 역할 필요.")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> getApplications(@PathVariable String clubId) {
        return Response.ok(clubApplyAdminService.getApplicationFormsForClub(clubId));
    }

    @PostMapping("/club/{clubId}/application")
    @Operation(summary = "동아리 외부 지원폼 연결 (관리자)",
            description = "구글폼/네이버폼 등 외부 URL을 지정 동아리에 연결하고 게시(ACTIVE)합니다. DEVELOPER 역할 필요.")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> connectExternal(@PathVariable String clubId,
                                             @RequestBody @Valid AdminExternalFormConnectRequest request) {
        clubApplyAdminService.connectExternalApplicationFormForClub(clubId, request);
        return Response.ok("success connect external application form");
    }

    @PatchMapping("/club/{clubId}/application/{formId}/status")
    @Operation(summary = "동아리 지원폼 활성화/미게시 토글 (관리자)",
            description = "active=true면 게시(ACTIVE), false면 미게시. DEVELOPER 역할 필요.")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> updateStatus(@PathVariable String clubId,
                                          @PathVariable String formId,
                                          @RequestBody StatusRequest request) {
        clubApplyAdminService.setApplicationFormStatusForClub(clubId, formId, request.active());
        return Response.ok("success update application status");
    }

    @DeleteMapping("/club/{clubId}/application/{formId}")
    @Operation(summary = "동아리 지원폼 삭제 (관리자)", description = "DEVELOPER 역할 필요.")
    @SecurityRequirement(name = "BearerAuth")
    public ResponseEntity<?> deleteApplication(@PathVariable String clubId,
                                               @PathVariable String formId) {
        clubApplyAdminService.deleteApplicationFormForClub(clubId, formId);
        return Response.ok("success delete application");
    }

    public record StatusRequest(boolean active) {
    }
}
```

- [ ] **Step 2: 컴파일 확인**

Run: `cd backend && ./gradlew compileJava`
Expected: BUILD SUCCESSFUL.

- [ ] **Step 3: 커밋**

```bash
cd backend && git add src/main/java/moadong/club/controller/ClubApplicationAdminController.java
git commit -m "feat(admin): 개발자 포털용 지원폼 관리 엔드포인트 추가

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: 개발자 포털 UI (`dev/edit.html` 확장)

**Files:**
- Modify: `backend/src/main/resources/static/dev/edit.html`

**Interfaces:**
- Consumes: Task 2의 4개 엔드포인트.
- 기존 `getToken()`, `headers()`, `showResult(elId, ok, message)`, `clubId`, `API_BASE` 재사용.

- [ ] **Step 1: HTML 섹션 추가**

`edit.html`에서 "모집정보 수정" 섹션의 닫는 부분(현재 `<div id="descResult" ...></div>` 뒤, `editForm` div 닫기 전) 에 아래 블록 삽입:

```html
    <h2 style="font-size:1rem; margin-top:24px;">지원폼 연결 (외부)</h2>
    <div id="formListState" class="loading">지원폼 불러오는 중...</div>
    <table id="formList" style="width:100%; border-collapse:collapse; margin-bottom:12px; font-size:0.9rem;">
      <thead>
        <tr style="text-align:left; border-bottom:1px solid #e5e7eb;">
          <th style="padding:6px 4px;">제목</th><th>모드</th><th>상태</th><th></th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
    <div class="form-row"><label for="newExternalUrl">외부 지원 URL (구글폼/네이버폼)</label>
      <input type="text" id="newExternalUrl" placeholder="https://forms.gle/..."></div>
    <div class="form-row"><label for="newFormTitle">제목 (선택)</label>
      <input type="text" id="newFormTitle" placeholder="외부 지원폼"></div>
    <button type="button" id="btnConnectExternal">외부폼 연결</button>
    <div id="connectResult" class="message-box hidden"></div>
```

- [ ] **Step 2: JS 로직 추가**

`edit.html`의 `<script>` 끝(마지막 `};` 뒤, `</script>` 앞)에 추가:

```javascript
    function currentSemester() {
      const now = new Date();
      return {
        semesterYear: now.getFullYear(),
        semesterTerm: (now.getMonth() + 1) < 7 ? 'FIRST' : 'SECOND'
      };
    }

    async function loadFormList() {
      if (!clubId || !getToken()) return;
      const stateEl = document.getElementById('formListState');
      const tbody = document.getElementById('formList').querySelector('tbody');
      stateEl.classList.remove('hidden');
      try {
        const res = await fetch(API_BASE + '/api/admin/club/' + clubId + '/application', { headers: headers() });
        const data = await res.json();
        if (!res.ok) { stateEl.textContent = data.message || ('HTTP ' + res.status); return; }
        const forms = data.data || [];
        tbody.innerHTML = '';
        forms.forEach(function(f) {
          const tr = document.createElement('tr');
          tr.style.borderBottom = '1px solid #f3f4f6';
          const active = f.status === 'ACTIVE';
          tr.innerHTML =
            '<td style="padding:6px 4px;">' + (f.title || '') + '</td>' +
            '<td>' + (f.formMode || '') + '</td>' +
            '<td>' + (f.status || '') + '</td>' +
            '<td style="white-space:nowrap;"></td>';
          const actionCell = tr.querySelector('td:last-child');
          const toggleBtn = document.createElement('button');
          toggleBtn.type = 'button';
          toggleBtn.textContent = active ? '미게시로 변경' : '활성화';
          toggleBtn.onclick = function() { toggleStatus(f.id, !active); };
          const delBtn = document.createElement('button');
          delBtn.type = 'button';
          delBtn.textContent = '삭제';
          delBtn.onclick = function() { deleteForm(f.id); };
          actionCell.appendChild(toggleBtn);
          actionCell.appendChild(delBtn);
          tbody.appendChild(tr);
        });
        stateEl.textContent = forms.length ? '' : '연결된 지원폼이 없습니다.';
        if (forms.length) stateEl.classList.add('hidden');
      } catch (e) {
        stateEl.textContent = e.message || '요청 실패';
      }
    }

    async function toggleStatus(formId, active) {
      try {
        const res = await fetch(API_BASE + '/api/admin/club/' + clubId + '/application/' + formId + '/status',
          { method: 'PATCH', headers: headers(), body: JSON.stringify({ active: active }) });
        const data = await res.json();
        showResult('connectResult', res.ok, res.ok ? '상태 변경됨' : (data.message || '요청 실패'));
        if (res.ok) loadFormList();
      } catch (e) { showResult('connectResult', false, e.message || '요청 실패'); }
    }

    async function deleteForm(formId) {
      try {
        const res = await fetch(API_BASE + '/api/admin/club/' + clubId + '/application/' + formId,
          { method: 'DELETE', headers: headers() });
        const data = await res.json();
        showResult('connectResult', res.ok, res.ok ? '삭제됨' : (data.message || '요청 실패'));
        if (res.ok) loadFormList();
      } catch (e) { showResult('connectResult', false, e.message || '요청 실패'); }
    }

    document.getElementById('btnConnectExternal').onclick = async function() {
      const btn = this;
      const url = document.getElementById('newExternalUrl').value.trim();
      if (!url) { showResult('connectResult', false, '외부 URL을 입력하세요.'); return; }
      const sem = currentSemester();
      const body = {
        title: document.getElementById('newFormTitle').value.trim() || null,
        externalApplicationUrl: url,
        semesterYear: sem.semesterYear,
        semesterTerm: sem.semesterTerm
      };
      btn.disabled = true; btn.textContent = '연결 중...';
      try {
        const res = await fetch(API_BASE + '/api/admin/club/' + clubId + '/application',
          { method: 'POST', headers: headers(), body: JSON.stringify(body) });
        const data = await res.json();
        showResult('connectResult', res.ok, res.ok ? '연결됨' : (data.message || '요청 실패'));
        if (res.ok) {
          document.getElementById('newExternalUrl').value = '';
          document.getElementById('newFormTitle').value = '';
          loadFormList();
        }
      } catch (e) {
        showResult('connectResult', false, e.message || '요청 실패');
      } finally {
        btn.disabled = false; btn.textContent = '외부폼 연결';
      }
    };
```

- [ ] **Step 3: 최초 로드 시 목록 조회 연결**

`edit.html`의 초기 클럽 로드 성공 블록(현재 `document.getElementById('editForm').classList.remove('hidden');` 직후)에 한 줄 추가:

```javascript
          document.getElementById('editForm').classList.remove('hidden');
          loadFormList();
```

- [ ] **Step 4: 수동 검증 (지원폼 + 지원기간)**

Run: `cd backend && ./gradlew bootRun` (Infisical dev 세팅 필요) — 또는 배포 환경.
개발자 계정으로 `/dev` 로그인 → 동아리 관리 → 임의 동아리 클릭 → edit 팝업에서:
1. "외부 지원 URL"에 `https://forms.gle/xxxx` 입력 → "외부폼 연결" → 목록에 ACTIVE로 추가되는지 확인.
2. 해당 동아리 상세 페이지 "지원하기" 클릭 → 외부 URL로 이동하는지 확인.
3. 목록에서 "미게시로 변경" → 상태 PUBLISHED, 지원 버튼에서 사라지는지 확인. "활성화"로 되돌려 확인.
4. **지원기간:** "모집 시작/종료" 값 입력 → "모집정보 저장" → 팝업 새로고침 후 값이 유지되는지, 동아리 상세의 모집상태가 반영되는지 확인.

Expected: 위 4개 모두 정상.

- [ ] **Step 5: 커밋**

```bash
cd backend && git add src/main/resources/static/dev/edit.html
git commit -m "feat(dev): 개발자 포털 edit 페이지에 외부폼 연결/토글/삭제 UI 추가

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Self-Review

**Spec coverage:**
- 외부폼 연결(구글/네이버) → Task 1 `connectExternalApplicationFormForClub` + Task 2 POST + Task 3 UI. ✅
- 생성 즉시 ACTIVE → Task 1 Step 5 `updateFormStatus(true)` + 테스트. ✅
- 활성화/미게시 토글 → Task 1 `setApplicationFormStatusForClub` + Task 2 PATCH + Task 3 토글 버튼. ✅
- 삭제 → Task 1 `deleteApplicationFormForClub` + Task 2 DELETE + Task 3 삭제 버튼. ✅
- 목록 조회 → Task 1 `getApplicationFormsForClub` + Task 2 GET + Task 3 목록. ✅
- 지원기간 설정 → 기존 `/api/admin/club/{clubId}/description` 유지 + Task 3 Step 4 수동 검증. ✅
- DEVELOPER 권한 보호 → `/api/admin/**` 기존 SecurityConfig 규칙(신규 컨트롤러가 자동 상속). ✅
- 허용 도메인/학기 검증 → 엔티티/기존 validateSemester 재사용 + Task 1 테스트. ✅

**Placeholder scan:** 모든 코드 스텝에 실제 코드 포함. TODO/TBD 없음. ✅

**Type consistency:** `AdminExternalFormConnectRequest`(title, externalApplicationUrl, semesterYear, semesterTerm), `AdminClubApplicationFormResponse`(id, title, formMode, status, externalApplicationUrl, semesterYear, semesterTerm), 서비스 4개 메서드 시그니처가 Task 1↔2↔3에서 일치. `StatusRequest(active)` ↔ 프론트 `{active}` 일치. ✅

## 참고: 남은 미결(구현 중 판단)

- `Club` 생성자 시그니처: 테스트에서 `new Club(userId)` 사용(기존 `ClubApplyAdminServiceTest`가 `new Club(user.getId())` 사용함을 확인). 다른 시그니처면 기존 테스트 패턴을 따를 것.
- 여러 ACTIVE 폼 허용(자동 단일화 안 함) — 스펙의 의도된 동작. 지원 버튼은 ACTIVE가 2개 이상이면 선택 모달을 띄움(기존 동작).
