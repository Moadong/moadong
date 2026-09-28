import { PeaceTypeId } from '../../data/peaceTypes';

/**
 * Blender 렌더 카드 이미지. 유형이 빠져 있으면 ResultCard가 분과 단색 카드로 그린다.
 * 이미지가 오면 `frontend/src/assets/images/peace/<id>.webp`에 두고 아래에 한 줄 추가한다.
 *   import carer from '@/assets/images/peace/carer.webp';
 *   export const CARD_IMAGES = { carer, ... };
 * 이 파일이 data/peaceTypes.ts와 분리된 이유: jest transform이 .webp를 stub하지 않아
 * 데이터 모듈에 이미지를 두면 채점 테스트가 깨진다.
 */
export const CARD_IMAGES: Partial<Record<PeaceTypeId, string>> = {};
