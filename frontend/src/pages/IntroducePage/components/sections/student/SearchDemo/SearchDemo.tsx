// 실제 검색창에 검색어가 입력되면 결과 동아리 카드가 내려오고, 다음 검색어로 넘어가기를 반복하는 검색 데모
import { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from 'framer-motion';
import { inactiveCategoryIcons } from '@/assets/images/icons/category_button';
import ClubStateBox from '@/components/ClubStateBox/ClubStateBox';
import ClubTag from '@/components/ClubTag/ClubTag';
import SearchField from '@/components/common/SearchField/SearchField';
import { SEARCH_SCENARIOS } from '@/pages/IntroducePage/constants/showcaseMocks';
import CategoryButtonList from '@/pages/MainPage/components/CategoryButtonList/CategoryButtonList';
import ClubLogo from '@/pages/MainPage/components/ClubLogo/ClubLogo';
import * as Styled from './SearchDemo.styles';

const TYPE_MS = 140;
const ERASE_MS = 50;
const RESULT_HOLD_MS = 2600;

const noop = () => {};

type Phase = 'typing' | 'results' | 'erasing';

/** 검색어 입력 → 결과 표시 → 지우기를 검색어마다 반복한다 */
const useSearchLoop = (active: boolean) => {
  const reduceMotion = useReducedMotion();
  const [scenario, setScenario] = useState(0);
  const [length, setLength] = useState(0);
  const [phase, setPhase] = useState<Phase>('typing');
  const keyword = SEARCH_SCENARIOS[scenario].keyword;

  useEffect(() => {
    if (!active || reduceMotion) return;
    let delay = TYPE_MS;
    let next: () => void;

    if (phase === 'typing') {
      if (length < keyword.length) {
        next = () => setLength((prev) => prev + 1);
      } else {
        delay = 250;
        next = () => setPhase('results');
      }
    } else if (phase === 'results') {
      delay = RESULT_HOLD_MS;
      next = () => setPhase('erasing');
    } else if (length > 0) {
      delay = ERASE_MS;
      next = () => setLength((prev) => prev - 1);
    } else {
      delay = 300;
      next = () => {
        setScenario((prev) => (prev + 1) % SEARCH_SCENARIOS.length);
        setPhase('typing');
      };
    }

    const timer = window.setTimeout(next, delay);
    return () => window.clearTimeout(timer);
  }, [active, reduceMotion, phase, length, keyword.length]);

  if (reduceMotion) {
    return {
      typed: SEARCH_SCENARIOS[0].keyword,
      scenario: 0,
      showResults: true,
    };
  }
  return {
    typed: keyword.slice(0, length),
    scenario,
    showResults: phase === 'results',
  };
};

const SearchDemo = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const { typed, scenario, showResults } = useSearchLoop(inView);
  const results = SEARCH_SCENARIOS[scenario].results;

  return (
    <Styled.Root ref={ref}>
      <SearchField
        value={typed}
        onChange={noop}
        placeholder='어떤 동아리를 찾으세요?'
      />
      <CategoryButtonList sticky={false} />

      <Styled.Results>
        <AnimatePresence mode='popLayout'>
          {showResults &&
            results.map((club, index) => (
              <motion.div
                key={`${scenario}-${club.name}`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                  delay: index * 0.12,
                }}
              >
                {/* 실제 동아리 카드와 같은 부품(로고·모집 상태·태그)으로 조립한다.
                    ClubCard는 보이기만 해도 노출 이벤트를 보내 목업이 분석에 섞인다 */}
                <Styled.Card>
                  <Styled.CardHeader>
                    <ClubLogo $imageSrc={inactiveCategoryIcons[club.icon]} />
                    <Styled.CardText>
                      <Styled.CardName>{club.name}</Styled.CardName>
                      <Styled.CardIntro>{club.introduction}</Styled.CardIntro>
                    </Styled.CardText>
                  </Styled.CardHeader>
                  <Styled.CardFooter>
                    <ClubStateBox state={club.recruitmentStatus} />
                    <ClubTag type={club.category} />
                    {club.tags.map((tag) => (
                      <ClubTag key={tag} type='자유'>
                        #{tag}
                      </ClubTag>
                    ))}
                  </Styled.CardFooter>
                </Styled.Card>
              </motion.div>
            ))}
        </AnimatePresence>
      </Styled.Results>
    </Styled.Root>
  );
};

export default SearchDemo;
