package moadong.media.resolver;

/**
 * DB에 저장된 이미지 URL을 "표시용" URL로 변환한다.
 * 예: webp 우선 정책 시 동일 경로의 .webp 객체가 있으면 그 URL을 반환.
 */
public interface ImageDisplayUrlResolver {

    /**
     * 저장된 URL을 표시용 URL로 해석한다.
     * null 또는 빈 문자열이면 그대로 반환한다.
     *
     * @param storedUrl DB에 저장된 이미지 URL (전체 URL 또는 null/empty)
     * @return 표시용 URL (해석 실패 시 storedUrl 그대로)
     */
    String resolveDisplayUrl(String storedUrl);
}
