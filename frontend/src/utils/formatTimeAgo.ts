import { formatDistanceToNowStrict } from 'date-fns';
import { ko } from 'date-fns/locale';

/** ISO 문자열을 '5일 전' 형태로 변환한다 */
const formatTimeAgo = (dateTimeString: string): string =>
  formatDistanceToNowStrict(new Date(dateTimeString), {
    addSuffix: true,
    locale: ko,
  });

export default formatTimeAgo;
