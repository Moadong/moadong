import { useCallback, useEffect, useRef, useState } from 'react';
import { reorderItems } from '../photoEditUtils';
import { FeedItem } from '../PhotoEditTab';

export type DropPosition = { index: number; side: 'before' | 'after' } | null;

const DRAG_THRESHOLD = 5;

interface UseDragSortOptions {
  disabled?: boolean;
  onReorder: (items: FeedItem[]) => void;
  feedItemsRef: React.RefObject<FeedItem[]>;
}

export const useDragSort = ({ disabled, onReorder, feedItemsRef }: UseDragSortOptions) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ index: number; x: number; y: number } | null>(null);
  const isDraggingRef = useRef(false);

  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropPosition, setDropPosition] = useState<DropPosition>(null);

  const getDropPositionFromPoint = useCallback((clientX: number, clientY: number): DropPosition => {
    if (!gridRef.current) return null;
    const cards = Array.from(gridRef.current.querySelectorAll<HTMLElement>('[data-card-index]'));
    if (cards.length === 0) return null;

    // 카드 위에 정확히 있는 경우: 카드 중앙 기준으로 before/after
    for (const card of cards) {
      const rect = card.getBoundingClientRect();
      if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) continue;
      const index = Number(card.dataset.cardIndex);
      return { index, side: clientX < rect.left + rect.width / 2 ? 'before' : 'after' };
    }

    // 카드 밖 — 같은 행(Y 범위 겹침) 카드 중 X 거리 가장 가까운 끝으로
    let closest: { index: number; side: 'before' | 'after'; dist: number } | null = null;
    for (const card of cards) {
      const rect = card.getBoundingClientRect();
      if (clientY < rect.top || clientY > rect.bottom) continue;
      const index = Number(card.dataset.cardIndex);
      const distLeft = Math.abs(clientX - rect.left);
      const distRight = Math.abs(clientX - rect.right);
      if (distLeft < distRight) {
        if (!closest || distLeft < closest.dist) closest = { index, side: 'before', dist: distLeft };
      } else {
        if (!closest || distRight < closest.dist) closest = { index, side: 'after', dist: distRight };
      }
    }
    if (closest) return { index: closest.index, side: closest.side };

    // 행 간 gap — Y 거리 기준 가장 가까운 카드로
    for (const card of cards) {
      const rect = card.getBoundingClientRect();
      const index = Number(card.dataset.cardIndex);
      const distY = Math.min(Math.abs(clientY - rect.top), Math.abs(clientY - rect.bottom));
      const side: 'before' | 'after' = clientX < rect.left + rect.width / 2 ? 'before' : 'after';
      if (!closest || distY < closest.dist) closest = { index, side, dist: distY };
    }

    return closest ? { index: closest.index, side: closest.side } : null;
  }, []);

  const handleMouseDown = (e: React.MouseEvent, index: number) => {
    if (disabled || e.button !== 0) return;
    dragStartRef.current = { index, x: e.clientX, y: e.clientY };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStartRef.current) return;
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;

      if (!isDraggingRef.current && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
        isDraggingRef.current = true;
        setDragIndex(dragStartRef.current.index);
      }

      if (!isDraggingRef.current) return;
      setDropPosition(getDropPositionFromPoint(e.clientX, e.clientY));
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!dragStartRef.current) return;

      if (isDraggingRef.current) {
        const pos = getDropPositionFromPoint(e.clientX, e.clientY);
        if (pos !== null) {
          const fromIndex = dragStartRef.current.index;
          const targetIndex = pos.side === 'after' ? pos.index + 1 : pos.index;
          const current = feedItemsRef.current;
          if (fromIndex !== targetIndex && fromIndex < current.length) {
            onReorder(reorderItems(current, fromIndex, targetIndex));
          }
        }
      }

      dragStartRef.current = null;
      isDraggingRef.current = false;
      setDragIndex(null);
      setDropPosition(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [getDropPositionFromPoint, onReorder, feedItemsRef]);

  return { gridRef, dragIndex, dropPosition, handleMouseDown };
};
