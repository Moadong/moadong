// 소개 페이지의 대상(학생/운영진)을 URL 쿼리(?for=club)와 동기화하는 훅
import { useSearchParams } from 'react-router-dom';
import {
  Audience,
  AUDIENCE_QUERY_KEY,
  DEFAULT_AUDIENCE,
} from '@/pages/IntroducePage/constants/audience';

const isAudience = (value: string | null): value is Audience =>
  value === 'student' || value === 'club';

const useAudience = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const raw = searchParams.get(AUDIENCE_QUERY_KEY);
  const audience: Audience = isAudience(raw) ? raw : DEFAULT_AUDIENCE;

  const changeAudience = (next: Audience) => {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        if (next === DEFAULT_AUDIENCE) params.delete(AUDIENCE_QUERY_KEY);
        else params.set(AUDIENCE_QUERY_KEY, next);
        return params;
      },
      { replace: true },
    );
  };

  return { audience, changeAudience };
};

export default useAudience;
