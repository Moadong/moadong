import { addHours, startOfHour } from 'date-fns';
import {
  PROMOTION_DESCRIPTION_MAX,
  PROMOTION_LOCATION_MAX,
  PROMOTION_TITLE_MAX,
} from '@/constants/adminFieldLimits';
import { clubLocations } from '@/constants/clubLocation';
import { ImageItem } from '@/pages/AdminPage/components/ImageSortGrid/types';
import {
  CreatePromotionArticleRequest,
  PromotionArticle,
} from '@/types/promotion';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface PromotionFormValues {
  title: string;
  location: string;
  coordinates: Coordinates | null;
  eventStart: Date | null;
  eventEnd: Date | null;
  description: string;
  /**
   * 화면에 보이는 순서 그대로의 이미지 목록. 이미 올라간 것과 아직 안 올린 것이
   * 한 배열에 섞여 있어야 드래그로 순서를 바꿀 수 있다.
   * local 항목의 previewUrl은 createObjectURL 결과라 버릴 때 revoke해야 한다.
   */
  images: ImageItem[];
}

export interface BuildingOption {
  label: string;
  value: string;
  coordinates: Coordinates;
}

/** 동아리방 표기 맨 앞의 동 (예: 'A동 208호' → 'A동') */
const DONG_PREFIX = /^[A-Za-z]동/;

/**
 * 자주 쓰는 건물로 지도를 빠르게 옮기기 위한 목록. 최종 좌표는 지도에서 정한다.
 * 건물명이 아니라 좌표 기준으로 묶는다. 한솔관(E16)처럼 한 건물에 좌표가 둘인 곳이
 * 있어서 건물명으로 묶으면 뒤쪽 좌표가 통째로 사라진다.
 * 건물명이 겹치는 좌표끼리는 동아리방 표기의 동으로 구분한다.
 */
export const BUILDING_OPTIONS: BuildingOption[] = (() => {
  const byCoordinates = new Map<string, (typeof clubLocations)[number]>();
  clubLocations.forEach((location) => {
    const key = `${location.lat},${location.lng}`;
    if (!byCoordinates.has(key)) byCoordinates.set(key, location);
  });

  const locations = [...byCoordinates.values()];
  const buildingCount = locations.reduce<Record<string, number>>(
    (counts, { building }) => ({
      ...counts,
      [building]: (counts[building] ?? 0) + 1,
    }),
    {},
  );

  return locations.map(({ building, detailLocation, lat, lng }) => {
    const dong = detailLocation.match(DONG_PREFIX)?.[0];
    const label =
      buildingCount[building] > 1 && dong ? `${building} ${dong}` : building;
    return { label, value: label, coordinates: { lat, lng } };
  });
})();

export const findBuildingByCoordinates = (
  coordinates: Coordinates | null,
  options: BuildingOption[] = BUILDING_OPTIONS,
): BuildingOption | undefined => {
  if (!coordinates) return undefined;
  return options.find(
    ({ coordinates: c }) =>
      c.lat === coordinates.lat && c.lng === coordinates.lng,
  );
};

/**
 * 이 동아리가 전에 쓴 장소. 지도로 찍은 좌표는 BUILDING_OPTIONS에 없어서
 * 다시 쓰려면 매번 지도를 새로 맞춰야 한다. 이미 받아 둔 글 목록에서 뽑아 쓴다.
 * 값은 좌표로 만들어 정적 목록과 이름이 겹쳐도 select 값이 부딪히지 않는다.
 * 이름이 겹치면 행사 시작이 가장 늦은 글의 좌표만 남긴다.
 */
export const buildPastLocationOptions = (
  articles: PromotionArticle[],
  clubId: string,
): BuildingOption[] => {
  const latestByLabel = new Map<
    string,
    { option: BuildingOption; startedAt: number }
  >();

  articles.forEach((article) => {
    if (article.clubId !== clubId) return;
    const label = article.location.trim();
    if (!label || article.latitude == null || article.longitude == null) return;

    const coordinates = { lat: article.latitude, lng: article.longitude };
    // 정적 목록에 이미 있는 좌표는 두 그룹에 겹쳐 나오지 않게 뺀다
    if (findBuildingByCoordinates(coordinates)) return;

    const startedAt = Date.parse(article.eventStartDate) || 0;
    const previous = latestByLabel.get(label);
    if (previous && startedAt <= previous.startedAt) return;

    latestByLabel.set(label, {
      option: {
        label,
        value: `${coordinates.lat},${coordinates.lng}`,
        coordinates,
      },
      startedAt,
    });
  });

  return [...latestByLabel.values()].map(({ option }) => option);
};

/** 작성 폼 초기값. 행사 기간은 오늘의 다음 정시로 채워 둔다 (모듈 상수로 두면 날짜가 고정돼 함수로 만든다) */
export const createEmptyPromotionForm = (): PromotionFormValues => {
  const nextHour = startOfHour(addHours(new Date(), 1));
  return {
    title: '',
    location: '',
    coordinates: null,
    eventStart: nextHour,
    eventEnd: nextHour,
    description: '',
    images: [],
  };
};

const toDateOrNull = (value: string): Date | null => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const articleToFormValues = (
  article: PromotionArticle,
): PromotionFormValues => ({
  title: article.title,
  location: article.location,
  coordinates:
    article.latitude != null && article.longitude != null
      ? { lat: article.latitude, lng: article.longitude }
      : null,
  eventStart: toDateOrNull(article.eventStartDate),
  eventEnd: toDateOrNull(article.eventEndDate),
  description: article.description,
  images: (article.images ?? []).map((url) => ({ type: 'uploaded', url })),
});

/** 저장 전 검증. 문제가 있으면 사용자에게 보여줄 문구를, 없으면 null을 돌려준다 */
export const validatePromotionForm = (
  values: PromotionFormValues,
): string | null => {
  if (!values.title.trim()) return '제목을 입력해주세요.';
  if (values.title.trim().length > PROMOTION_TITLE_MAX)
    return `제목은 ${PROMOTION_TITLE_MAX}자 이내로 입력해주세요.`;
  if (!values.location.trim()) return '행사 장소를 입력해주세요.';
  if (values.location.trim().length > PROMOTION_LOCATION_MAX)
    return `행사 장소는 ${PROMOTION_LOCATION_MAX}자 이내로 입력해주세요.`;
  if (!values.coordinates) return '지도에서 행사 위치를 선택해주세요.';
  if (!values.eventStart || !values.eventEnd)
    return '행사 기간을 선택해주세요.';
  if (values.eventEnd < values.eventStart)
    return '행사 종료 일시는 시작 일시보다 빠를 수 없습니다.';
  if (!values.description.trim()) return '행사 설명을 입력해주세요.';
  if (values.description.trim().length > PROMOTION_DESCRIPTION_MAX)
    return `행사 설명은 ${PROMOTION_DESCRIPTION_MAX}자 이내로 입력해주세요.`;
  return null;
};

/**
 * 검증을 통과한 값으로 요청 바디를 만든다.
 * 날짜는 ISO Instant(UTC)로 보낸다. images는 호출부가 업로드 결과를 합쳐 넘긴다.
 */
export const buildPromotionPayload = (
  values: PromotionFormValues,
  clubId: string,
  images: string[],
): CreatePromotionArticleRequest => {
  if (!values.coordinates || !values.eventStart || !values.eventEnd) {
    throw new Error('validatePromotionForm을 먼저 통과해야 합니다.');
  }
  return {
    clubId,
    title: values.title.trim(),
    location: values.location.trim(),
    latitude: values.coordinates.lat,
    longitude: values.coordinates.lng,
    eventStartDate: values.eventStart.toISOString(),
    eventEndDate: values.eventEnd.toISOString(),
    description: values.description.trim(),
    images,
  };
};

/** `<input type="datetime-local">` 값(로컬 시간, 분 단위)으로 변환 */
export const toDateTimeLocalValue = (date: Date | null): string => {
  if (!date) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const fromDateTimeLocalValue = (value: string): Date | null =>
  toDateOrNull(value);
