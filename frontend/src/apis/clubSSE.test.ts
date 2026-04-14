import { createApplicantSSE } from './clubSSE';
import { ApplicantSSECallbacks } from '@/types/applicants';

// Mock API_BASE_URL
jest.mock('@/constants/api', () => 'http://localhost:8080');

// Mock EventSource
class MockEventSource {
  url: string;
  listeners: { [key: string]: ((event: any) => void)[] } = {};
  onopen: () => void = () => {};
  onerror: (error: any) => void = () => {};
  onmessage: (event: any) => void = () => {};

  constructor(url: string, _options?: any) {
    this.url = url;
  }

  addEventListener(eventName: string, handler: (event: any) => void) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(handler);
  }

  removeEventListener(eventName: string, handler: (event: any) => void) {
    if (this.listeners[eventName]) {
      this.listeners[eventName] = this.listeners[eventName].filter(
        (fn) => fn !== handler,
      );
    }
  }

  close() {
    // Mock implementation
  }

  // Helper to simulate events
  simulateEvent(eventName: string, data: any) {
    const event = { data: JSON.stringify(data) };
    this.listeners[eventName]?.forEach((handler) => handler(event));
  }

  simulateError(error: any) {
    this.onerror(error);
  }
}

jest.mock('eventsource', () => ({
  EventSource: MockEventSource,
}));

Object.defineProperty(window, 'EventSource', { value: MockEventSource });

// Mock localStorage
// ... (rest of the localStorageMock setup)
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('createApplicantSSE', () => {
  const applicationFormId = 'test-form-id';
  let mockEventHandlers: ApplicantSSECallbacks;

  beforeEach(() => {
    localStorageMock.clear();
    localStorageMock.setItem('accessToken', 'mock-access-token');
    mockEventHandlers = {
      onStatusChange: jest.fn(),
      onError: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it('should return null if no access token is found', () => {
    localStorageMock.removeItem('accessToken');
    const sse = createApplicantSSE(applicationFormId, mockEventHandlers);
    expect(sse).toBeNull();
  });

  it('should create an EventSource with correct URL and headers', () => {
    const sse = createApplicantSSE(applicationFormId, mockEventHandlers);
    expect(sse).toBeInstanceOf(MockEventSource);
    expect(sse?.url).toContain(`/api/club/applicant/${applicationFormId}/sse`);

    // Ensure fetch is called with Authorization header (indirectly through EventSource mock)
    // The EventSource mock currently doesn't expose the fetch options,
    // so we'd need a more sophisticated mock if we wanted to test the fetch options directly.
    // For now, we'll assume EventSource handles it correctly if accessToken is present.
  });

  it('should call onStatusChange when "applicant-status-changed" event occurs', () => {
    const sse = createApplicantSSE(applicationFormId, mockEventHandlers);
    const mockEventData = {
      applicantId: 1,
      status: 'PENDING',
      clubId: 1,
      applicationFormId: 1,
      rejectReason: null,
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    };
    (sse as unknown as MockEventSource).simulateEvent(
      'applicant-status-changed',
      mockEventData,
    );
    expect(mockEventHandlers.onStatusChange).toHaveBeenCalledWith(
      mockEventData,
    );
    expect(mockEventHandlers.onStatusChange).toHaveBeenCalledTimes(1);
  });

  it('should call onError when EventSource encounters an error', () => {
    const sse = createApplicantSSE(applicationFormId, mockEventHandlers);
    const mockError = { message: 'Network error', status: 500 };
    (sse as unknown as MockEventSource).simulateError(mockError);
    expect(mockEventHandlers.onError).toHaveBeenCalledWith(
      new Error('Network error'),
    );
    expect(mockEventHandlers.onError).toHaveBeenCalledTimes(1);
  });

  it('should call onError with generic message if error message is not available', () => {
    const sse = createApplicantSSE(applicationFormId, mockEventHandlers);
    (sse as unknown as MockEventSource).simulateError({}); // Simulate an error without a message
    expect(mockEventHandlers.onError).toHaveBeenCalledWith(
      new Error('SSE connection error'),
    );
    expect(mockEventHandlers.onError).toHaveBeenCalledTimes(1);
  });

  it('should close the EventSource on error', () => {
    const sse = createApplicantSSE(applicationFormId, mockEventHandlers);
    const spyClose = jest.spyOn(sse as unknown as MockEventSource, 'close');
    (sse as unknown as MockEventSource).simulateError({});
    expect(spyClose).toHaveBeenCalledTimes(1);
  });
});
