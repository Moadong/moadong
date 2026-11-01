import { buildFinalUrls } from './buildFinalUrls';
import { ImageItem, LocalItem } from './types';

const makeUploaded = (url: string): ImageItem => ({ type: 'uploaded', url });
const makeLocal = (name: string): LocalItem => ({
  type: 'local',
  file: new File([''], name, { type: 'image/jpeg' }),
  previewUrl: `blob:${name}`,
  status: 'pending',
});

describe('buildFinalUrls', () => {
  it('새로 올린 사진이 앞에 있어도 화면 순서를 그대로 유지한다', () => {
    const local = makeLocal('new.jpg');
    const items: ImageItem[] = [local, makeUploaded('b'), makeUploaded('c')];
    const urlByFile = new Map([[local.file, 'a']]);
    expect(buildFinalUrls(items, urlByFile)).toEqual(['a', 'b', 'c']);
  });

  it('새로 올린 사진이 중간에 있어도 화면 순서를 그대로 유지한다', () => {
    const local = makeLocal('new.jpg');
    const items: ImageItem[] = [makeUploaded('a'), local, makeUploaded('c')];
    const urlByFile = new Map([[local.file, 'b']]);
    expect(buildFinalUrls(items, urlByFile)).toEqual(['a', 'b', 'c']);
  });

  it('업로드에 실패해 URL이 없는 local 아이템은 제외한다', () => {
    const uploaded = makeLocal('ok.jpg');
    const failed = makeLocal('fail.jpg');
    const items: ImageItem[] = [uploaded, makeUploaded('b'), failed];
    const urlByFile = new Map([[uploaded.file, 'a']]);
    expect(buildFinalUrls(items, urlByFile)).toEqual(['a', 'b']);
  });

  it('local 아이템이 없으면 uploaded URL을 순서대로 반환한다', () => {
    const items: ImageItem[] = [makeUploaded('b'), makeUploaded('a')];
    expect(buildFinalUrls(items, new Map<File, string>())).toEqual(['b', 'a']);
  });
});
