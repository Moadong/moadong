import convertGoogleDriveUrl from './convertGoogleDriveUrl';

describe('convertGoogleDriveUrl', () => {
  it('Google Drive URL에서 파일 ID를 추출하여 썸네일 URL로 변환한다', () => {
    const dummyFileId = '1_THIS_IS_A_DUMMY_GOOGLE_DRIVE_FILE_ID_0';
    const url = `https://drive.google.com/file/d/${dummyFileId}/view?usp=sharing`;
    const expected = `https://drive.google.com/thumbnail?id=${dummyFileId}&sz=w2048`;
    expect(convertGoogleDriveUrl(url)).toBe(expected);
  });

  it('다른 Google Drive URL 형식에서도 파일 ID를 추출하여 썸네일 URL로 변환한다', () => {
    const dummyFileId = '1_THIS_IS_A_DUMMY_GOOGLE_DRIVE_FILE_ID_0';
    const url = `https://docs.google.com/document/d/${dummyFileId}/edit`;
    const expected = `https://drive.google.com/thumbnail?id=${dummyFileId}&sz=w2048`;
    expect(convertGoogleDriveUrl(url)).toBe(expected);
  });

  it('id= 쿼리 파라미터가 있는 Google Drive URL에서도 파일 ID를 추출하여 썸네일 URL로 변환한다', () => {
    const dummyFileId = '1_THIS_IS_A_DUMMY_GOOGLE_DRIVE_FILE_ID_0';
    const url = `https://drive.google.com/open?id=${dummyFileId}`;
    const expected = `https://drive.google.com/thumbnail?id=${dummyFileId}&sz=w2048`;
    expect(convertGoogleDriveUrl(url)).toBe(expected);
  });

  it('유효하지 않은 Google Drive URL은 원본 URL을 반환한다', () => {
    const url = 'https://www.google.com';
    expect(convertGoogleDriveUrl(url)).toBe(url);
  });

  it('파일 ID가 없는 Google Drive URL은 원본 URL을 반환한다', () => {
    const url = 'https://drive.google.com/drive/folders/FOLDER_ID';
    expect(convertGoogleDriveUrl(url)).toBe(url);
  });

  it('null 또는 undefined 입력 시에도 오류 없이 원본을 반환한다', () => {
    // @ts-ignore
    expect(convertGoogleDriveUrl(null)).toBe(null);
    // @ts-ignore
    expect(convertGoogleDriveUrl(undefined)).toBe(undefined);
  });

  it('예외 발생 시 원본 URL을 반환한다', () => {
    const originalMatch = String.prototype.match;
    // @ts-ignore
    String.prototype.match = () => {
      throw new Error('Test error');
    };
    const url = 'https://drive.google.com/file/d/FILE_ID/view';
    expect(convertGoogleDriveUrl(url)).toBe(url);
    String.prototype.match = originalMatch; // restore original method
  });
});
