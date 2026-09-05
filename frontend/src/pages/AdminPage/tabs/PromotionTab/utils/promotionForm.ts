import {
  PROMOTION_DESCRIPTION_MAX,
  PROMOTION_LOCATION_MAX,
  PROMOTION_TITLE_MAX,
} from '@/constants/adminFieldLimits';
import { clubLocations } from '@/constants/clubLocation';
import {
  CreatePromotionArticleRequest,
  PromotionArticle,
} from '@/types/promotion';

export interface Coordinates {
  lat: number;
  lng: number;
}

/** 아직 올리지 않은 로컬 파일. previewUrl은 createObjectURL 결과라 버릴 때 revoke해야 한다 */
export interface LocalImage {
  file: File;
  previewUrl: string;
}

export interface PromotionFormValues {
  title: string;
  location: string;
  coordinates: Coordinates | null;
  eventStart: Date | null;
  eventEnd: Date | null;
  description: string;
  /** 서버에 이미 올라간 이미지 URL (수정 시 삭제 가능) */
  existingImages: string[];
  localFiles: LocalImage[];
}

export interface BuildingOption {
  label: string;
  value: string;
  coordinates: Coordinates;
}

/**
 * 관리자가 위도·경도를 직접 입력하지 않도록 캠퍼스 건물 목록에서 고른다.
 * 같은 건물이 여러 동아리에 걸쳐 있으니 건물명 기준으로 한 번만 남긴다.
 */
export const BUILDING_OPTIONS: BuildingOption[] = clubLocations.reduce<
  BuildingOption[]
>((options, { building, lat, lng }) => {
  if (options.some((option) => option.value === building)) return options;
  options.push({ label: building, value: building, coordinates: { lat, lng } });
  return options;
}, []);

export const findBuildingByCoordinates = (
  coordinates: Coordinates | null,
): BuildingOption | undefined => {
  if (!coordinates) return undefined;
  return BUILDING_OPTIONS.find(
    ({ coordinates: c }) =>
      c.lat === coordinates.lat && c.lng === coordinates.lng,
  );
};

export const EMPTY_PROMOTION_FORM: PromotionFormValues = {
  title: '',
  location: '',
  coordinates: null,
  eventStart: null,
  eventEnd: null,
  description: '',
  existingImages: [],
  localFiles: [],
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
  existingImages: article.images ?? [],
  localFiles: [],
});

/**
 * 저장 전 검증. 문제가 있으면 사용자에게 보여줄 문구를, 없으면 null을 돌려준다.
 * 수정은 서버가 images를 1개 이상 요구하므로 mode로 구분한다.
 */
export const validatePromotionForm = (
  values: PromotionFormValues,
  mode: 'create' | 'edit',
): string | null => {
  if (!values.title.trim()) return '제목을 입력해주세요.';
  if (values.title.trim().length > PROMOTION_TITLE_MAX)
    return `제목은 ${PROMOTION_TITLE_MAX}자 이내로 입력해주세요.`;
  if (!values.location.trim()) return '행사 장소를 입력해주세요.';
  if (values.location.trim().length > PROMOTION_LOCATION_MAX)
    return `행사 장소는 ${PROMOTION_LOCATION_MAX}자 이내로 입력해주세요.`;
  if (!values.coordinates) return '지도에 표시할 건물을 선택해주세요.';
  if (!values.eventStart || !values.eventEnd)
    return '행사 기간을 선택해주세요.';
  if (values.eventEnd < values.eventStart)
    return '행사 종료 일시는 시작 일시보다 빠를 수 없습니다.';
  if (!values.description.trim()) return '행사 설명을 입력해주세요.';
  if (values.description.trim().length > PROMOTION_DESCRIPTION_MAX)
    return `행사 설명은 ${PROMOTION_DESCRIPTION_MAX}자 이내로 입력해주세요.`;
  if (
    mode === 'edit' &&
    values.existingImages.length + values.localFiles.length === 0
  )
    return '이미지를 1장 이상 등록해주세요.';
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
