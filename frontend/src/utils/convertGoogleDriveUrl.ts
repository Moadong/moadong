const convertGoogleDriveUrl = (url: string) => {
  try {
    const fileIdMatch = url.match(/(?:id=|\/d\/)([-\w]{25,})/);
    if (!fileIdMatch) return url;

    const fileId = fileIdMatch[1];

    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w2048`;
  } catch (error) {
    console.error('URL 변환 중 오류 발생:', error);
    return url;
  }
};

export default convertGoogleDriveUrl;
