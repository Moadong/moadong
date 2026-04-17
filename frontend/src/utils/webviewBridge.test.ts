import {
  requestNavigateBack,
  requestNotificationSubscribe,
  requestNotificationUnsubscribe,
  requestShare,
} from './webviewBridge';
import isInAppWebView from './isInAppWebView';

jest.mock('./isInAppWebView');

describe('webviewBridge', () => {
  const mockPostMessage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    window.ReactNativeWebView = {
      postMessage: mockPostMessage,
    };
    // Reset mockPostMessage to its default successful behavior for each test
    mockPostMessage.mockImplementation((_message: string) => {
      // Simulate successful postMessage
    });
  });

  afterEach(() => {
    delete window.ReactNativeWebView;
  });

  describe('requestNavigateBack', () => {
    it('웹뷰가 아닐 경우 false를 반환하고 postMessage를 호출하지 않는다.', () => {
      (isInAppWebView as jest.Mock).mockReturnValue(false);

      const result = requestNavigateBack();

      expect(result).toBe(false);
      expect(mockPostMessage).not.toHaveBeenCalled();
    });

    it('postMessage 호출 중 에러 발생 시 false를 반환한다.', () => {
      (isInAppWebView as jest.Mock).mockReturnValue(true);
      mockPostMessage.mockImplementation(() => {
        throw new Error('Test Error');
      });

      const result = requestNavigateBack();

      expect(result).toBe(false);
      expect(mockPostMessage).toHaveBeenCalled();
    });
  });

  describe('requestNotificationSubscribe', () => {
    it('올바른 clubId와 clubName으로 메시지를 전달한다.', () => {
      (isInAppWebView as jest.Mock).mockReturnValue(true);

      const result = requestNotificationSubscribe('test-id', 'test-club');

      expect(result).toBe(true);
      expect(mockPostMessage).toHaveBeenCalledWith(
        JSON.stringify({
          type: 'NOTIFICATION_SUBSCRIBE',
          payload: { clubId: 'test-id', clubName: 'test-club' },
        }),
      );
    });
  });

  describe('requestNotificationUnsubscribe', () => {
    it('올바른 clubId로 메시지를 전달한다.', () => {
      (isInAppWebView as jest.Mock).mockReturnValue(true);

      const result = requestNotificationUnsubscribe('test-id');

      expect(result).toBe(true);
      expect(mockPostMessage).toHaveBeenCalledWith(
        JSON.stringify({
          type: 'NOTIFICATION_UNSUBSCRIBE',
          payload: { clubId: 'test-id' },
        }),
      );
    });
  });

  describe('requestShare', () => {
    it('올바른 payload로 메시지를 전달한다.', () => {
      (isInAppWebView as jest.Mock).mockReturnValue(true);
      const payload = {
        title: 'Title',
        text: 'Text',
        url: 'https://example.com',
      };

      const result = requestShare(payload);

      expect(result).toBe(true);
      expect(mockPostMessage).toHaveBeenCalledWith(
        JSON.stringify({
          type: 'SHARE',
          payload,
        }),
      );
    });
  });
});
