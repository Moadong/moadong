export const colors = {
  // Primary Color : 서비스 메인 브랜드 컬러
  primary: {
    900: '#FF5414',
    800: '#FF7543',
    700: '#FF9F7C',
    600: '#FFDED2',
    500: '#FFECE5',
  },

  // Secondary Color : 태그/상태/보조 강조 컬러
  secondary: {
    1: {
      main: '#FF7DA4',
      back: '#FFF0F4',
      tag: '#FFEBF1',
    },
    2: {
      main: '#FFD54A',
      back: '#FFF9E5',
      tag: '#FFF6D6',
    },
    3: {
      main: '#5FD8C0',
      back: '#EBFAF7',
      tag: '#E3FAF5',
    },
    4: {
      main: '#7094FF',
      back: '#EFF3FF',
      tag: '#E5ECFF',
    },
    5: {
      main: '#FFA04D',
      back: '#FFF5E5',
      tag: '#FFF2DB',
    },
    6: {
      main: '#C379F6',
      back: '#FAF2FF',
      tag: '#F7EBFF',
    },
  },

  // Accent Color : 상태/의미 전달용 강조 컬러
  accent: {
    1: {
      900: '#3DBBFF',
      800: '#73CEFF',
      700: '#D9F2FF',
      600: '#E5F6FF',
      500: '#F2FBFF',
    },
    2: {
      900: '#49D5AD',
      500: '#EBFAF1',
    },
    3: {
      500: '#FFE8E8',
    },
  },

  // Base Color : 기본 배경/텍스트
  base: {
    white: '#FFFFFF',
    black: '#111111',
  },

  // Neutral Color : 텍스트/라인/배경용 무채색
  gray: {
    100: '#F5F5F5',
    200: '#F2F2F2',
    300: '#EBEBEB',
    400: '#DCDCDC',
    500: '#C5C5C5',
    600: '#989898',
    700: '#787878',
    800: '#4B4B4B',
    900: '#3A3A3A',
  },
} as const;
