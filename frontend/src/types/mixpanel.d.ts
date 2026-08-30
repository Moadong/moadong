/**
 * 런타임 mixpanel-browser는 2.73.0인데 @types/mixpanel-browser는 2.60.0에 멈춰 있어
 * feature flags API가 타입에 없다. 여기서 실제 런타임 시그니처만 좁게 보충한다.
 * @types가 flags를 포함하는 버전으로 올라가면 이 파일은 지운다.
 */
declare module 'mixpanel-browser' {
  interface MixpanelFlags {
    are_flags_ready(): boolean;
    get_variant_value(flagKey: string, fallback: string): Promise<string>;
    is_enabled(flagKey: string, fallback: boolean): Promise<boolean>;
  }

  interface Config {
    flags: boolean | { context?: Record<string, unknown> };
  }

  interface Mixpanel {
    flags: MixpanelFlags;
  }
}

export {};
