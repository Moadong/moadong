import { ImageItem } from './types';

// 화면 순서(items)를 그대로 보존한 최종 URL 배열을 만든다.
// 업로드되지 않아 URL이 없는 local 아이템은 제외된다.
export const buildFinalUrls = (
  items: ImageItem[],
  urlByFile: Map<File, string>,
): string[] =>
  items.reduce<string[]>((acc, item) => {
    if (item.type === 'uploaded') {
      acc.push(item.url);
      return acc;
    }
    const url = urlByFile.get(item.file);
    if (url) acc.push(url);
    return acc;
  }, []);
