import convertGoogleDriveUrl from './convertGoogleDriveUrl';

describe('convertGoogleDriveUrl', () => {
  it('should convert /d/ format URL to thumbnail URL', () => {
    const url = 'https://drive.google.com/file/d/1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q/view';
    const expected = 'https://drive.google.com/thumbnail?id=1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q&sz=w2048';
    expect(convertGoogleDriveUrl(url)).toBe(expected);
  });

  it('should convert id= format URL to thumbnail URL', () => {
    const url = 'https://drive.google.com/open?id=1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q';
    const expected = 'https://drive.google.com/thumbnail?id=1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q&sz=w2048';
    expect(convertGoogleDriveUrl(url)).toBe(expected);
  });

  it('should return the original URL if no file ID is found', () => {
    const url = 'https://example.com';
    expect(convertGoogleDriveUrl(url)).toBe(url);
  });

  it('should handle invalid URLs gracefully', () => {
    const url = 'invalid-url';
    expect(convertGoogleDriveUrl(url)).toBe(url);
  });
});
