import { PromotionArticle } from '@/types/promotion';
import {
  articleToFormValues,
  BUILDING_OPTIONS,
  buildPromotionPayload,
  createEmptyPromotionForm,
  findBuildingByCoordinates,
  fromDateTimeLocalValue,
  PromotionFormValues,
  toDateTimeLocalValue,
  validatePromotionForm,
} from './promotionForm';

const validValues: PromotionFormValues = {
  title: '봄 정기공연',
  location: '한울관(E31) 302호',
  coordinates: { lat: 35.132367, lng: 129.106974 },
  eventStart: new Date('2026-04-01T10:00:00+09:00'),
  eventEnd: new Date('2026-04-01T12:00:00+09:00'),
  description: '연극 정기공연입니다.',
  existingImages: [],
  localFiles: [],
};

const makeLocalImage = (name: string) => ({
  file: new File(['x'], name, { type: 'image/png' }),
  previewUrl: `blob:${name}`,
});

describe('BUILDING_OPTIONS', () => {
  it('건물명 기준으로 중복 없이 좌표를 갖는다', () => {
    const names = BUILDING_OPTIONS.map((o) => o.value);
    expect(new Set(names).size).toBe(names.length);
    expect(BUILDING_OPTIONS.length).toBeGreaterThan(0);
    BUILDING_OPTIONS.forEach((o) => {
      expect(typeof o.coordinates.lat).toBe('number');
      expect(typeof o.coordinates.lng).toBe('number');
    });
  });

  it('좌표로 건물을 되찾을 수 있고 없는 좌표면 undefined', () => {
    const first = BUILDING_OPTIONS[0];
    expect(findBuildingByCoordinates(first.coordinates)?.value).toBe(
      first.value,
    );
    expect(findBuildingByCoordinates({ lat: 0, lng: 0 })).toBeUndefined();
    expect(findBuildingByCoordinates(null)).toBeUndefined();
  });
});

describe('validatePromotionForm', () => {
  it('모든 필수값이 있으면 null', () => {
    expect(validatePromotionForm(validValues, 'create')).toBeNull();
  });

  it.each<[keyof PromotionFormValues, unknown, string]>([
    ['title', '   ', '제목을 입력해주세요.'],
    ['location', '', '행사 장소를 입력해주세요.'],
    ['coordinates', null, '지도에 표시할 건물을 선택해주세요.'],
    ['eventStart', null, '행사 기간을 선택해주세요.'],
    ['eventEnd', null, '행사 기간을 선택해주세요.'],
    ['description', '', '행사 설명을 입력해주세요.'],
  ])('%s 가 비면 안내 문구를 돌려준다', (key, value, message) => {
    expect(
      validatePromotionForm({ ...validValues, [key]: value }, 'create'),
    ).toBe(message);
  });

  it('종료가 시작보다 빠르면 막는다', () => {
    expect(
      validatePromotionForm(
        {
          ...validValues,
          eventEnd: new Date('2026-03-31T10:00:00+09:00'),
        },
        'create',
      ),
    ).toBe('행사 종료 일시는 시작 일시보다 빠를 수 없습니다.');
  });

  it('생성은 이미지가 없어도 되지만 수정은 1장 이상이어야 한다', () => {
    expect(validatePromotionForm(validValues, 'create')).toBeNull();
    expect(validatePromotionForm(validValues, 'edit')).toBe(
      '이미지를 1장 이상 등록해주세요.',
    );
    expect(
      validatePromotionForm(
        { ...validValues, existingImages: ['https://cdn/a.png'] },
        'edit',
      ),
    ).toBeNull();
    expect(
      validatePromotionForm(
        { ...validValues, localFiles: [makeLocalImage('a.png')] },
        'edit',
      ),
    ).toBeNull();
  });
});

describe('buildPromotionPayload', () => {
  it('트림한 값과 ISO Instant 날짜, 넘겨받은 images로 바디를 만든다', () => {
    const payload = buildPromotionPayload(
      { ...validValues, title: '  봄 정기공연  ' },
      'club-1',
      ['https://cdn/a.png'],
    );
    expect(payload).toEqual({
      clubId: 'club-1',
      title: '봄 정기공연',
      location: '한울관(E31) 302호',
      latitude: 35.132367,
      longitude: 129.106974,
      eventStartDate: '2026-04-01T01:00:00.000Z',
      eventEndDate: '2026-04-01T03:00:00.000Z',
      description: '연극 정기공연입니다.',
      images: ['https://cdn/a.png'],
    });
  });

  it('검증 전 값으로 호출하면 던진다', () => {
    expect(() =>
      buildPromotionPayload(createEmptyPromotionForm(), 'club-1', []),
    ).toThrow();
  });
});

describe('createEmptyPromotionForm', () => {
  it('행사 기간은 오늘로 채워 두고 나머지는 비어 있다', () => {
    const values = createEmptyPromotionForm();
    const today = new Date().toDateString();
    expect(values.eventStart?.toDateString()).toBe(today);
    expect(values.eventEnd?.toDateString()).toBe(today);
    expect(values.title).toBe('');
    expect(values.coordinates).toBeNull();
  });
});

describe('articleToFormValues', () => {
  const article: PromotionArticle = {
    id: 'a1',
    clubId: 'club-1',
    clubName: '극예술연구회',
    title: '봄 정기공연',
    location: '한울관(E31) 302호',
    latitude: 35.132367,
    longitude: 129.106974,
    eventStartDate: '2026-04-01T01:00:00Z',
    eventEndDate: '2026-04-01T03:00:00Z',
    description: '설명',
    images: ['https://cdn/a.png'],
  };

  it('서버 글을 폼 값으로 바꾼다', () => {
    const values = articleToFormValues(article);
    expect(values.coordinates).toEqual({ lat: 35.132367, lng: 129.106974 });
    expect(values.eventStart?.toISOString()).toBe('2026-04-01T01:00:00.000Z');
    expect(values.existingImages).toEqual(['https://cdn/a.png']);
    expect(values.localFiles).toEqual([]);
  });

  it('좌표가 없으면 coordinates는 null', () => {
    const values = articleToFormValues({
      ...article,
      latitude: undefined,
      longitude: undefined,
    });
    expect(values.coordinates).toBeNull();
  });
});

describe('datetime-local 변환', () => {
  it('로컬 시간 문자열과 Date를 왕복한다', () => {
    const date = new Date(2026, 3, 1, 9, 5);
    const value = toDateTimeLocalValue(date);
    expect(value).toBe('2026-04-01T09:05');
    expect(fromDateTimeLocalValue(value)?.getTime()).toBe(date.getTime());
    expect(toDateTimeLocalValue(null)).toBe('');
    expect(fromDateTimeLocalValue('')).toBeNull();
  });
});
