// 모아동이 어떻게 달라져 왔는지 날짜별 변경 내용과 실제 화면으로 보여 주는 업데이트 기록 페이지
import { PAGE_VIEW } from '@/constants/eventName';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import { UPDATE_ENTRIES } from '../../constants/updates';
import SubpageLayout from '../SubpageLayout/SubpageLayout';
import * as Styled from './UpdatesPage.styles';

/** 2026-08-15 → 2026. 8. 15. */
const formatDate = (date: string) => {
  const [year, month, day] = date.split('-').map(Number);
  return `${year}. ${month}. ${day}.`;
};

const UpdatesPage = () => {
  useTrackPageView(PAGE_VIEW.INTRODUCE_UPDATES_PAGE);

  return (
    <SubpageLayout>
      <Styled.Hero>
        <Styled.Title>모아동 업데이트 기록</Styled.Title>
        <Styled.Subtitle>
          모아동이 어떻게 달라지고 있는지, 새 기능과 개선 사항을 확인할 수
          있어요.
        </Styled.Subtitle>
      </Styled.Hero>

      <Styled.List>
        {UPDATE_ENTRIES.map(({ date, title, description, image }, index) => (
          <Styled.Entry key={`${date}-${title}`}>
            <Styled.Date dateTime={date}>{formatDate(date)}</Styled.Date>
            <Styled.Body>
              <Styled.EntryTitle>{title}</Styled.EntryTitle>
              <Styled.Frame $tone={index}>
                <Styled.Shot
                  $kind={image.kind}
                  src={image.src}
                  alt={image.alt}
                  loading='lazy'
                  decoding='async'
                />
              </Styled.Frame>
              <Styled.Description>{description}</Styled.Description>
            </Styled.Body>
          </Styled.Entry>
        ))}
      </Styled.List>
    </SubpageLayout>
  );
};

export default UpdatesPage;
