import BurningGauge from '../BurningGauge/BurningGauge';
import ClickButton from '../ClickButton/ClickButton';
import {
  BURNING_MULTIPLIER,
  useBurningGauge,
} from '../../hooks/useBurningGauge';
import * as S from './GamePlaySection.styles';

interface GamePlaySectionProps {
  clubName: string;
  myCount: number;
  gainCount: (amount: number, source?: 'button' | 'bubble') => void;
  onChangeClub: () => void;
  isDark?: boolean;
}

/**
 * 버닝 게이지 + 클릭 버튼을 묶은 게임 플레이 영역.
 * 게이지 감소(20fps)·버닝 카운트다운(10fps) 같은 고주기 상태를 이 컴포넌트 안으로
 * 격리해, 매 틱마다 GamePage 전체가 리렌더되지 않도록 한다.
 */
const GamePlaySection = ({
  clubName,
  myCount,
  gainCount,
  onChangeClub,
  isDark = false,
}: GamePlaySectionProps) => {
  const { gaugeRatio, isBurning, burningRemainingSec, registerClick } =
    useBurningGauge();

  // 버튼 클릭은 버닝 게이지를 채우고, 버닝 중에는 클릭당 +2씩 적립된다.
  const handleButtonClick = () => {
    registerClick();
    gainCount(isBurning ? BURNING_MULTIPLIER : 1, 'button');
  };

  return (
    <S.PlayArea>
      <BurningGauge
        ratio={gaugeRatio}
        isBurning={isBurning}
        remainingSec={burningRemainingSec}
        isDark={isDark}
      />
      <ClickButton
        clubName={clubName}
        count={myCount}
        onClickGame={handleButtonClick}
        onChangeClub={onChangeClub}
        isDark={isDark}
      />
    </S.PlayArea>
  );
};

export default GamePlaySection;
