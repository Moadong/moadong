import { ImageItem } from './types';

export const reorderItems = (
  items: ImageItem[],
  dragIndex: number,
  targetIndex: number,
): ImageItem[] => {
  const next = [...items];
  const [moved] = next.splice(dragIndex, 1);
  const insertAt = dragIndex < targetIndex ? targetIndex - 1 : targetIndex;
  next.splice(insertAt, 0, moved);
  return next;
};
