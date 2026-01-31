import { act, renderHook } from '@testing-library/react';
import { AnswerItem } from '@/types/application';
import { useAnswers } from './useAnswers';

describe('useAnswers', () => {
  describe('초기화', () => {
    it('초기 답변 없이 hook을 생성할 수 있다', () => {
      // When
      const { result } = renderHook(() => useAnswers());

      // Then
      expect(result.current.answers).toEqual([]);
    });

    it('초기 답변과 함께 hook을 생성할 수 있다', () => {
      // Given
      const initialAnswers: AnswerItem[] = [
        { id: 1, value: '답변1' },
        { id: 2, value: '답변2' },
      ];

      // When
      const { result } = renderHook(() => useAnswers(initialAnswers));

      // Then
      expect(result.current.answers).toEqual(initialAnswers);
    });
  });

  describe('단일 답변 업데이트 (onAnswerChange with string)', () => {
    it('새로운 질문에 답변을 추가할 수 있다', () => {
      // Given
      const { result } = renderHook(() => useAnswers());

      // When
      act(() => {
        result.current.onAnswerChange(1, '첫 번째 답변');
      });

      // Then
      expect(result.current.answers).toEqual([
        { id: 1, value: '첫 번째 답변' },
      ]);
    });

    it('기존 답변을 업데이트할 수 있다', () => {
      // Given
      const initialAnswers: AnswerItem[] = [{ id: 1, value: '기존 답변' }];
      const { result } = renderHook(() => useAnswers(initialAnswers));

      // When
      act(() => {
        result.current.onAnswerChange(1, '수정된 답변');
      });

      // Then
      expect(result.current.answers).toEqual([{ id: 1, value: '수정된 답변' }]);
    });

    it('여러 질문에 대한 답변을 독립적으로 관리할 수 있다', () => {
      // Given
      const { result } = renderHook(() => useAnswers());

      // When
      act(() => {
        result.current.onAnswerChange(1, '질문1 답변');
        result.current.onAnswerChange(2, '질문2 답변');
        result.current.onAnswerChange(3, '질문3 답변');
      });

      // Then
      expect(result.current.answers).toHaveLength(3);
      expect(result.current.answers).toContainEqual({
        id: 1,
        value: '질문1 답변',
      });
      expect(result.current.answers).toContainEqual({
        id: 2,
        value: '질문2 답변',
      });
      expect(result.current.answers).toContainEqual({
        id: 3,
        value: '질문3 답변',
      });
    });
  });

  describe('다중 답변 업데이트 테스트', () => {
    it('새로운 질문에 다중 답변을 추가할 수 있다', () => {
      // Given
      const { result } = renderHook(() => useAnswers());

      // When
      act(() => {
        result.current.onAnswerChange(1, ['선택1', '선택2', '선택3']);
      });

      // Then
      expect(result.current.answers).toEqual([
        { id: 1, value: '선택1' },
        { id: 1, value: '선택2' },
        { id: 1, value: '선택3' },
      ]);
    });

    it('기존 다중 답변을 업데이트할 수 있다', () => {
      // Given
      const initialAnswers: AnswerItem[] = [
        { id: 1, value: '기존1' },
        { id: 1, value: '기존2' },
      ];
      const { result } = renderHook(() => useAnswers(initialAnswers));

      // When
      act(() => {
        result.current.onAnswerChange(1, ['새로운1', '새로운2', '새로운3']);
      });

      // Then
      expect(result.current.answers).toEqual([
        { id: 1, value: '새로운1' },
        { id: 1, value: '새로운2' },
        { id: 1, value: '새로운3' },
      ]);
      expect(result.current.answers).not.toContainEqual({
        id: 1,
        value: '기존1',
      });
    });

    it('빈 배열로 다중 답변을 초기화할 수 있다', () => {
      // Given
      const initialAnswers: AnswerItem[] = [
        { id: 1, value: '답변1' },
        { id: 1, value: '답변2' },
      ];
      const { result } = renderHook(() => useAnswers(initialAnswers));

      // When
      act(() => {
        result.current.onAnswerChange(1, []);
      });

      // Then
      expect(result.current.answers).toEqual([]);
    });
  });

  describe('답변 조회 테스트', () => {
    it('특정 질문의 답변을 조회할 수 있다', () => {
      // Given
      const initialAnswers: AnswerItem[] = [
        { id: 1, value: '질문1 답변' },
        { id: 2, value: '질문2 답변' },
      ];
      const { result } = renderHook(() => useAnswers(initialAnswers));

      // When
      const answers = result.current.getAnswersById(1);

      // Then
      expect(answers).toEqual(['질문1 답변']);
    });

    it('다중 답변을 배열로 조회할 수 있다', () => {
      // Given
      const initialAnswers: AnswerItem[] = [
        { id: 1, value: '선택1' },
        { id: 1, value: '선택2' },
        { id: 1, value: '선택3' },
      ];
      const { result } = renderHook(() => useAnswers(initialAnswers));

      // When
      const answers = result.current.getAnswersById(1);

      // Then
      expect(answers).toEqual(['선택1', '선택2', '선택3']);
    });

    it('존재하지 않는 질문 ID로 조회하면 빈 배열을 반환한다', () => {
      // Given
      const { result } = renderHook(() => useAnswers());

      // When
      const answers = result.current.getAnswersById(999);

      // Then
      expect(answers).toEqual([]);
    });
  });

  describe('복합 시나리오 테스트', () => {
    it('단일 답변과 다중 답변을 혼합하여 관리할 수 있다', () => {
      // Given
      const { result } = renderHook(() => useAnswers());

      // When
      act(() => {
        result.current.onAnswerChange(1, '단일 답변'); // 단일 선택
        result.current.onAnswerChange(2, ['다중1', '다중2']); // 다중 선택
        result.current.onAnswerChange(3, '또 다른 단일 답변'); // 단일 선택
      });

      // Then
      expect(result.current.getAnswersById(1)).toEqual(['단일 답변']);
      expect(result.current.getAnswersById(2)).toEqual(['다중1', '다중2']);
      expect(result.current.getAnswersById(3)).toEqual(['또 다른 단일 답변']);
    });

    it('단일 답변을 다중 답변으로 변경할 수 있다', () => {
      // Given
      const { result } = renderHook(() => useAnswers());

      // When - 먼저 단일 답변 추가
      act(() => {
        result.current.onAnswerChange(1, '단일 답변');
      });

      // Then - 단일 답변 확인
      expect(result.current.getAnswersById(1)).toEqual(['단일 답변']);

      // When - 다중 답변으로 변경
      act(() => {
        result.current.onAnswerChange(1, ['다중1', '다중2']);
      });

      // Then - 기존 단일 답변은 사라지고 다중 답변만 존재
      expect(result.current.getAnswersById(1)).toEqual(['다중1', '다중2']);
    });

    it('다중 답변을 단일 답변으로 변경할 수 있다', () => {
      // Given
      const { result } = renderHook(() => useAnswers());

      // When - 먼저 다중 답변 추가
      act(() => {
        result.current.onAnswerChange(1, ['다중1', '다중2', '다중3']);
      });

      // Then - 다중 답변 확인
      expect(result.current.getAnswersById(1)).toEqual([
        '다중1',
        '다중2',
        '다중3',
      ]);

      // When - 단일 답변으로 변경
      act(() => {
        result.current.onAnswerChange(1, '단일 답변');
      });

      // Then - 기존 다중 답변은 사라지고 단일 답변만 존재
      expect(result.current.getAnswersById(1)).toEqual(['단일 답변']);
    });
  });

  describe('엣지 케이스 테스트', () => {
    it('빈 문자열 답변도 저장할 수 있다', () => {
      // Given
      const { result } = renderHook(() => useAnswers());

      // When
      act(() => {
        result.current.onAnswerChange(1, '');
      });

      // Then
      expect(result.current.answers).toEqual([{ id: 1, value: '' }]);
    });

    it('ID가 0인 질문도 처리할 수 있다', () => {
      // Given
      const { result } = renderHook(() => useAnswers());

      // When
      act(() => {
        result.current.onAnswerChange(0, '답변');
      });

      // Then
      expect(result.current.getAnswersById(0)).toEqual(['답변']);
    });

    it('음수 ID도 처리할 수 있다', () => {
      // Given
      const { result } = renderHook(() => useAnswers());

      // When
      act(() => {
        result.current.onAnswerChange(-1, '답변');
      });

      // Then
      expect(result.current.getAnswersById(-1)).toEqual(['답변']);
    });
  });
});
