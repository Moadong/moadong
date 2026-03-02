import { useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import Footer from '@/components/common/Footer/Footer';
import Header from '@/components/common/Header/Header';
import { PAGE_VIEW } from '@/constants/eventName';
import useTrackPageView from '@/hooks/Mixpanel/useTrackPageView';
import Filter from '@/pages/MainPage/components/Filter/Filter';
import isInAppWebView from '@/utils/isInAppWebView';
import * as Styled from './IntroductionPage.styles';

const MAP_FRAME_WIDTH = 375;
const MAP_FRAME_HEIGHT = 522;

type Booth = {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

type MapSlide = {
  nodeId: string;
  backgroundColor: string;
  sideColor: string;
  leftBar: { top: number; height: number };
  rightBar: { top: number; height: number };
  leftLabel: {
    text: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
  };
  rightLabel: {
    text: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
  };
  booths: Booth[];
};

const CLUB_MAP_SLIDES: MapSlide[] = [
  {
    nodeId: '8851:6378',
    backgroundColor: '#f2f8ff',
    sideColor: '#b9defd',
    leftBar: { top: 120, height: 277 },
    rightBar: { top: 198, height: 277 },
    leftLabel: {
      text: '가온관',
      x: 2.999998207829776,
      y: 237.99999921319522,
      width: 18.000001792170224,
      height: 41.000000786804776,
      rotation: 90,
    },
    rightLabel: {
      text: '대학본부 A11동',
      x: 355,
      y: 285,
      width: 18.000001228261681,
      height: 103.00000021464803,
      rotation: -90,
    },
    booths: [
      { name: '리얼겟', x: 41, y: 70, width: 143, height: 40.75 },
      { name: '포시즌', x: 192, y: 70, width: 143, height: 40.75 },
      { name: '울림', x: 41, y: 116.75, width: 143, height: 40.75 },
      { name: '그린드림', x: 192, y: 116.75, width: 143, height: 40.75 },
      { name: '어택', x: 41, y: 163.5, width: 143, height: 40.75 },
      { name: '거터', x: 192, y: 163.5, width: 143, height: 40.75 },
      { name: 'TIME', x: 41, y: 210.25, width: 143, height: 40.75 },
      { name: '청심회', x: 192, y: 210.25, width: 143, height: 40.75 },
      { name: '아카데미', x: 41, y: 257, width: 143, height: 40.75 },
      { name: 'SFC', x: 192, y: 257, width: 143, height: 40.75 },
      { name: '한판', x: 41, y: 303.75, width: 143, height: 40.75 },
      { name: '테크니칼', x: 192, y: 303.75, width: 143, height: 40.75 },
      { name: 'UCDC', x: 41, y: 350.5, width: 143, height: 40.75 },
      { name: '스타피쉬 (농구)', x: 192, y: 350.5, width: 143, height: 40.75 },
      { name: '동반', x: 41, y: 397.25, width: 143, height: 40.75 },
      { name: '백경유스호스텔', x: 192, y: 397.25, width: 143, height: 40.75 },
    ],
  },
  {
    nodeId: '8847:8495',
    backgroundColor: '#fff0f4',
    sideColor: '#ffd3d4',
    leftBar: { top: 120, height: 277 },
    rightBar: { top: 198, height: 277 },
    leftLabel: {
      text: '청운관',
      x: 2.999998207829776,
      y: 237.99999921319522,
      width: 18.000001792170224,
      height: 41.000000786804776,
      rotation: 90,
    },
    rightLabel: {
      text: '웅비관 A12동',
      x: 355,
      y: 292,
      width: 18.000001061314833,
      height: 89.00000021464803,
      rotation: -90,
    },
    booths: [
      { name: '한누리', x: 41, y: 70, width: 143, height: 40.75 },
      { name: '절영회', x: 192, y: 70, width: 143, height: 40.75 },
      { name: 'Cert-is', x: 41, y: 116.75, width: 143, height: 40.75 },
      { name: '플레이 아데스', x: 192, y: 116.75, width: 143, height: 40.75 },
      { name: 'PAS', x: 41, y: 163.5, width: 143, height: 40.75 },
      { name: '프라우드', x: 192, y: 163.5, width: 143, height: 40.75 },
      { name: '조나단', x: 41, y: 210.25, width: 143, height: 40.75 },
      { name: '소리빛깔', x: 192, y: 210.25, width: 143, height: 40.75 },
      { name: '보블리스', x: 41, y: 257, width: 143, height: 40.75 },
      { name: 'JDM', x: 192, y: 257, width: 143, height: 40.75 },
      { name: '부경 다이버', x: 41, y: 303.75, width: 143, height: 40.75 },
      { name: '씨사운드', x: 192, y: 303.75, width: 143, height: 40.75 },
      { name: '쇳물결', x: 41, y: 350.5, width: 143, height: 40.75 },
      { name: '민심사랑', x: 192, y: 350.5, width: 143, height: 40.75 },
      { name: '입자', x: 41, y: 397.25, width: 143, height: 40.75 },
      { name: '모아동', x: 192, y: 397.25, width: 143, height: 40.75 },
    ],
  },
  {
    nodeId: '8847:8577',
    backgroundColor: '#ffebe4',
    sideColor: '#ffc9b4',
    leftBar: { top: 90, height: 277 },
    rightBar: { top: 90, height: 277 },
    leftLabel: {
      text: '충무관 B13동',
      x: 2.9999960659770295,
      y: 182.99999921319522,
      width: 18.00000393402297,
      height: 90.00000078680478,
      rotation: 90,
    },
    rightLabel: {
      text: '누리관 A13동',
      x: 355,
      y: 184,
      width: 18.000001061314833,
      height: 89.00000021464803,
      rotation: -90,
    },
    booths: [
      { name: '총동아리 연합회', x: 41, y: 70, width: 143, height: 40.75 },
      { name: '공연자 대기장소', x: 41, y: 116.75, width: 143, height: 40.75 },
      { name: '버스킹존', x: 41, y: 163.5, width: 143, height: 87 },
      { name: '모비딕', x: 41, y: 256.5, width: 143, height: 40.75 },
      { name: '백경극 예술연구회', x: 192, y: 257, width: 143, height: 40.75 },
      { name: 'RCY', x: 41, y: 303.25, width: 143, height: 40.75 },
      { name: '돼지', x: 192, y: 303.75, width: 143, height: 40.75 },
      { name: '송웨이브', x: 41, y: 350, width: 143, height: 40.75 },
      { name: '바구니', x: 192, y: 350.5, width: 143, height: 40.75 },
      { name: '디그', x: 41, y: 396.75, width: 143, height: 40.75 },
      { name: '남천 로타랙트', x: 192, y: 397.25, width: 143, height: 40.75 },
    ],
  },
  {
    nodeId: '8852:8659',
    backgroundColor: '#f8efff',
    sideColor: '#e9ccff',
    leftBar: { top: 120, height: 277 },
    rightBar: { top: 225, height: 213 },
    leftLabel: {
      text: '카페 파라다이스',
      x: 2.9999957162872306,
      y: 208.99999921319522,
      width: 18.00000428371277,
      height: 98.00000078680478,
      rotation: 90,
    },
    rightLabel: {
      text: '향파관 A15동',
      x: 355,
      y: 287,
      width: 18.000001061314833,
      height: 89.00000021464803,
      rotation: -90,
    },
    booths: [
      { name: '산악부', x: 41, y: 70, width: 143, height: 40.75 },
      { name: '웨일즈', x: 192, y: 70, width: 143, height: 40.75 },
      { name: '미담 장학회', x: 41, y: 116.75, width: 143, height: 40.75 },
      { name: '모비딕스', x: 192, y: 116.75, width: 143, height: 40.75 },
      {
        name: '백경클래식기타연구회',
        x: 41,
        y: 163.5,
        width: 143,
        height: 40.75,
      },
      { name: 'IVF', x: 192, y: 163.5, width: 143, height: 40.75 },
      { name: '수석회', x: 41, y: 210.25, width: 143, height: 40.75 },
      { name: '홍백', x: 192, y: 210.25, width: 143, height: 40.75 },
      { name: '스타피쉬 (축구)', x: 41, y: 257, width: 143, height: 40.75 },
      { name: '피어드림', x: 192, y: 257, width: 143, height: 40.75 },
      { name: '매니아', x: 41, y: 303.75, width: 143, height: 40.75 },
      { name: '터', x: 192, y: 303.75, width: 143, height: 40.75 },
      { name: '300', x: 41, y: 350.5, width: 143, height: 40.75 },
      { name: '짚신', x: 192, y: 350.5, width: 143, height: 40.75 },
      { name: '후라', x: 41, y: 397.25, width: 143, height: 40.75 },
      { name: '집현전', x: 192, y: 397.25, width: 143, height: 40.75 },
    ],
  },
];

const toPercent = (value: number, base: number) => `${(value / base) * 100}%`;
const toCenterPercent = (start: number, size: number, base: number) =>
  `${((start + size / 2) / base) * 100}%`;

const IntroductionPage = () => {
  useTrackPageView(PAGE_VIEW.FESTIVAL_INTRODUCTION_PAGE);
  const [currentMapIndex, setCurrentMapIndex] = useState(0);
  const [mapSwiper, setMapSwiper] = useState<SwiperType | null>(null);

  return (
    <>
      <Header hideOn={['webview']} />
      <Styled.Container>
        {!isInAppWebView() && <Filter alwaysVisible />}
        <Styled.SliderWrapper>
          <Swiper
            onSwiper={setMapSwiper}
            onSlideChange={(swiper) => setCurrentMapIndex(swiper.realIndex)}
            loop
            slidesPerView={1}
            spaceBetween={12}
          >
            {CLUB_MAP_SLIDES.map((slide) => (
              <SwiperSlide key={slide.nodeId}>
                <Styled.MapFrame $backgroundColor={slide.backgroundColor}>
                  <Styled.SideBar
                    $side='left'
                    $top={toPercent(slide.leftBar.top, MAP_FRAME_HEIGHT)}
                    $height={toPercent(slide.leftBar.height, MAP_FRAME_HEIGHT)}
                    $color={slide.sideColor}
                  />
                  <Styled.SideBar
                    $side='right'
                    $top={toPercent(slide.rightBar.top, MAP_FRAME_HEIGHT)}
                    $height={toPercent(slide.rightBar.height, MAP_FRAME_HEIGHT)}
                    $color={slide.sideColor}
                  />
                  <Styled.SideLabel
                    $x={toCenterPercent(
                      slide.leftLabel.x,
                      slide.leftLabel.width,
                      MAP_FRAME_WIDTH,
                    )}
                    $y={toCenterPercent(
                      slide.leftLabel.y,
                      slide.leftLabel.height,
                      MAP_FRAME_HEIGHT,
                    )}
                    $rotation={slide.leftLabel.rotation}
                  >
                    {slide.leftLabel.text}
                  </Styled.SideLabel>
                  <Styled.SideLabel
                    $x={toCenterPercent(
                      slide.rightLabel.x,
                      slide.rightLabel.width,
                      MAP_FRAME_WIDTH,
                    )}
                    $y={toCenterPercent(
                      slide.rightLabel.y,
                      slide.rightLabel.height,
                      MAP_FRAME_HEIGHT,
                    )}
                    $rotation={slide.rightLabel.rotation}
                  >
                    {slide.rightLabel.text}
                  </Styled.SideLabel>
                  {slide.booths.map((booth, index) => (
                    <Styled.Booth
                      key={`${slide.nodeId}-${booth.name}-${index}`}
                      style={{
                        left: toPercent(booth.x, MAP_FRAME_WIDTH),
                        top: toPercent(booth.y, MAP_FRAME_HEIGHT),
                        width: toPercent(booth.width, MAP_FRAME_WIDTH),
                        height: toPercent(booth.height, MAP_FRAME_HEIGHT),
                      }}
                    >
                      {booth.name}
                    </Styled.Booth>
                  ))}
                </Styled.MapFrame>
              </SwiperSlide>
            ))}
          </Swiper>
        </Styled.SliderWrapper>
        <Styled.DotPagination>
          {CLUB_MAP_SLIDES.map((_, index) => (
            <Styled.Dot
              key={index}
              type='button'
              aria-label={`${index + 1}번 지도 보기`}
              $active={currentMapIndex === index}
              onClick={() => mapSwiper?.slideToLoop(index)}
            />
          ))}
        </Styled.DotPagination>
        <Styled.SlideCounter>{`${currentMapIndex + 1}/${CLUB_MAP_SLIDES.length}`}</Styled.SlideCounter>
        {/* 공연시간표 */}
      </Styled.Container>
      <Footer />
    </>
  );
};

export default IntroductionPage;
