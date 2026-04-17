import convertGoogleDriveUrl from './convertGoogleDriveUrl';

describe('convertGoogleDriveUrl', () => {
  it('Google Drive 공유 링크(id= 형태)를 썸네일 URL로 변환한다', () => {
    const input = 'https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7/view?usp=sharing';
    const expected = 'https://drive.google.com/thumbnail?id=1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7&sz=w2048';
    expect(convertGoogleDriveUrl(input)).toBe(expected);
  });

  it('Google Drive 공유 링크(/d/ 형태)를 썸네일 URL로 변환한다', () => {
    const input = 'https://drive.google.com/open?id=1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7';
    const expected = 'https://drive.google.com/thumbnail?id=1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7&sz=w2048';
    expect(convertGoogleDriveUrl(input)).toBe(expected);
  });

  it('Google Drive 링크가 아닌 경우 원본 URL을 반환한다', () => {
    const input = 'https://example.com/image.png';
    expect(convertGoogleDriveUrl(input)).toBe(input);
  });

  it('fileId를 추출할 수 없는 경우 원본 URL을 반환한다', () => {
    const input = 'https://drive.google.com/file/d/';
    expect(convertGoogleDriveUrl(input)).toBe(input);
  });

  it('빈 문자열인 경우 빈 문자열을 반환한다', () => {
    expect(convertGoogleDriveUrl('')).toBe('');
  });
});
