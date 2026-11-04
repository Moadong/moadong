import carer from '@/assets/images/peace/symbols/carer.svg';
import daily from '@/assets/images/peace/symbols/daily.svg';
import embracer from '@/assets/images/peace/symbols/embracer.svg';
import energizer from '@/assets/images/peace/symbols/energizer.svg';
import explorer from '@/assets/images/peace/symbols/explorer.svg';
import expresser from '@/assets/images/peace/symbols/expresser.svg';
import { PeaceTypeId } from '../../data/peaceTypes';

/**
 * 카드 중앙 심볼. Twemoji SVG(CC-BY 4.0, assets/images/peace/symbols/LICENSE.md).
 * 이모지 글꼴은 OS마다 다르고 크게 그리면 흐려져서 벡터 파일로 그린다.
 */
export const SYMBOL_IMAGES: Record<PeaceTypeId, string> = {
  carer,
  embracer,
  daily,
  explorer,
  energizer,
  expresser,
};
