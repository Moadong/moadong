import convertGoogleDriveUrl from './convertGoogleDriveUrl';

describe('convertGoogleDriveUrl', () => {
  it('ID 형식의 Google Drive URL을 썸네일 URL로 변환한다', () => {
    const url = 'https://drive.google.com/open?id=1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7';
    const expected = 'https://drive.google.com/thumbnail?id=1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7&sz=w2048';
    expect(convertGoogleDriveUrl(url)).toBe(expected);
  });

  it('/d/ 형식의 Google Drive URL을 썸네일 URL로 변환한다', () => {
    const url = 'https://drive.google.com/file/d/1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7/view';
    const expected = 'https://drive.google.com/thumbnail?id=1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7&sz=w2048';
    expect(convertGoogleDriveUrl(url)).toBe(expected);
  });

  it('유효하지 않은 URL은 그대로 반환한다', () => {
    const url = 'https://not-google-drive.com/somefile';
    expect(convertGoogleDriveUrl(url)).toBe(url);
  });

  it('빈 문자열은 빈 문자열을 반환한다', () => {
    expect(convertGoogleDriveUrl('')).toBe('');
  });

  it('Google Drive URL이지만 ID를 찾을 수 없는 경우 그대로 반환한다', () => {
    const url = 'https://drive.google.com/some/path/without/id';
    expect(convertGoogleDriveUrl(url)).toBe(url);
  });
});
