import convertGoogleDriveUrl from './convertGoogleDriveUrl';

describe('convertGoogleDriveUrl', () => {
  it('should convert /d/ format URL to thumbnail URL', () => {
    const url = 'https://drive.google.com/file/d/1234567890abcdefghijklmnopqrstuv/view';
    const expected = 'https://drive.google.com/thumbnail?id=1234567890abcdefghijklmnopqrstuv&sz=w2048';
    expect(convertGoogleDriveUrl(url)).toBe(expected);
  });

  it('should convert id= format URL to thumbnail URL', () => {
    const url = 'https://drive.google.com/open?id=1234567890abcdefghijklmnopqrstuv';
    const expected = 'https://drive.google.com/thumbnail?id=1234567890abcdefghijklmnopqrstuv&sz=w2048';
    expect(convertGoogleDriveUrl(url)).toBe(expected);
  });

  it('should return the same URL if no file ID is found', () => {
    const url = 'https://example.com';
    expect(convertGoogleDriveUrl(url)).toBe(url);
  });

  it('should return the same URL if it is not a Google Drive URL', () => {
    const url = 'invalid-url';
    expect(convertGoogleDriveUrl(url)).toBe(url);
  });
});
