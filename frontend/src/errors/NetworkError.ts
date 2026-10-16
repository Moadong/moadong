export class NetworkError extends Error {
  constructor(message?: string) {
    super(
      message ?? '네트워크 연결에 실패했습니다. 인터넷 연결을 확인해주세요.',
    );
    this.name = 'NetworkError';
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}
