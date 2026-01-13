import { formatRelativeDateTime } from './formatRelativeDateTime';

describe('formatRelativeDateTime', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('오늘 날짜인 경우', () => {
    it('오늘 오후 2시 30분을 시간 형식으로 반환해야 한다', () => {
      jest.setSystemTime(new Date('2024-01-15T15:00:00'));

      const result = formatRelativeDateTime('2024-01-15T14:30:00');

      expect(result).toMatch(/오후.*2.*30/);
    });

    it('오늘 오전 9시를 시간 형식으로 반환해야 한다', () => {
      jest.setSystemTime(new Date('2024-01-15T10:00:00'));

      const result = formatRelativeDateTime('2024-01-15T09:00:00');

      expect(result).toMatch(/오전.*9/);
    });

    it('오늘 자정을 시간 형식으로 반환해야 한다', () => {
      jest.setSystemTime(new Date('2024-01-15T12:00:00'));

      const result = formatRelativeDateTime('2024-01-15T00:00:00');

      expect(result).toMatch(/오전.*12.*00/);
    });
  });

  describe('과거 날짜인 경우', () => {
    it('어제 날짜를 날짜 형식으로 반환해야 한다', () => {
      jest.setSystemTime(new Date('2024-01-15T10:00:00'));

      const result = formatRelativeDateTime('2024-01-14T14:30:00');

      expect(result).toMatch(/2024.*01.*14/);
    });

    it('1주일 전 날짜를 날짜 형식으로 반환해야 한다', () => {
      jest.setSystemTime(new Date('2024-01-15T10:00:00'));

      const result = formatRelativeDateTime('2024-01-08T14:30:00');

      expect(result).toMatch(/2024.*01.*08/);
    });

    it('작년 날짜를 날짜 형식으로 반환해야 한다', () => {
      jest.setSystemTime(new Date('2024-01-15T10:00:00'));

      const result = formatRelativeDateTime('2023-12-25T14:30:00');

      expect(result).toMatch(/2023.*12.*25/);
    });
  });

  describe('미래 날짜인 경우', () => {
    it('내일 날짜를 날짜 형식으로 반환해야 한다', () => {
      jest.setSystemTime(new Date('2024-01-15T10:00:00'));

      const result = formatRelativeDateTime('2024-01-16T14:30:00');

      expect(result).toMatch(/2024.*01.*16/);
    });
  });

  describe('엣지 케이스', () => {
    it('오늘 23시 59분을 시간 형식으로 반환해야 한다', () => {
      jest.setSystemTime(new Date('2024-01-15T12:00:00'));

      const result = formatRelativeDateTime('2024-01-15T23:59:00');

      expect(result).toMatch(/오후.*11.*59/);
    });

    it('월이 바뀌는 경우 날짜 형식으로 반환해야 한다', () => {
      jest.setSystemTime(new Date('2024-02-01T10:00:00'));

      const result = formatRelativeDateTime('2024-01-31T14:30:00');

      expect(result).toMatch(/2024.*01.*31/);
    });

    it('연도가 바뀌는 경우 날짜 형식으로 반환해야 한다', () => {
      jest.setSystemTime(new Date('2024-01-01T10:00:00'));

      const result = formatRelativeDateTime('2023-12-31T14:30:00');

      expect(result).toMatch(/2023.*12.*31/);
    });
  });
});
