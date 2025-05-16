import { validateSocialLink } from '@/utils/validateSocialLink';
import { SNS_CONFIG } from '@/constants/snsConfig';
import { SNSPlatform } from '@/types/club';

type LinkSet = Record<SNSPlatform, string>;

const validLinks: LinkSet = {
  instagram: 'https://www.instagram.com/valid_id',
  youtube: 'https://www.youtube.com/@validchannel',
  x: 'https://x.com/valid_user',
};

const invalidLinks: LinkSet = {
  instagram: 'https://instagram.com',
  youtube: 'youtube.com/123',
  x: 'https://x.com/',
};

const phishingLinks: LinkSet = {
  instagram: 'https://www.instagram.evil.com/id',
  youtube: 'https://www.y0utube.com/@channel',
  x: 'https://x.co/valid_user',
};

const platforms = Object.keys(SNS_CONFIG) as SNSPlatform[];

describe('validateSocialLink - SNS 링크 유효성 검사', () => {
  const expectNoError = (platform: SNSPlatform, link: string) => {
    expect(validateSocialLink(platform, link)).toBe('');
  };

  const expectError = (platform: SNSPlatform, link: string) => {
    expect(validateSocialLink(platform, link)).toBe(
      `${SNS_CONFIG[platform].label} 링크 형식이 조금 이상해요. 다시 한 번 확인해주세요!`,
    );
  };

  it('유효한 링크는 에러 메시지를 반환하지 않는다', () => {
    platforms.forEach((platform) =>
      expectNoError(platform, validLinks[platform]),
    );
  });

  it('잘못된 형식의 링크는 에러 메시지를 반환한다', () => {
    platforms.forEach((platform) =>
      expectError(platform, invalidLinks[platform]),
    );
  });

  it('입력값이 비어있으면 에러 메시지를 반환하지 않는다', () => {
    platforms.forEach((platform) => expectNoError(platform, ''));
  });

  it('피싱 가능성이 있는 링크는 에러 메시지를 반환한다', () => {
    platforms.forEach((platform) =>
      expectError(platform, phishingLinks[platform]),
    );
  });

  it('http 링크는 허용되지 않아야 한다', () => {
    expectError('x', 'http://x.com/valid_id');
  });

  it('유니코드 기반 도메인 위장은 허용되지 않아야 한다', () => {
    // 러시아어 소문자 о (U+043E)
    const spoofedUrl = 'https://www.yоutube.com/@fake';
    expectError('youtube', spoofedUrl);
  });

  it('redirect 파라미터로 외부 사이트 유도 시 에러 메시지를 반환해야 한다', () => {
    const redirectUrl =
      'https://www.instagram.com/redirect?to=https://attacker.com/steal?cookie=document.cookie';
    expectError('instagram', redirectUrl);
  });
});
