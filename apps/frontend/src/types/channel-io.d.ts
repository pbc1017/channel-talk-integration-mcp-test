declare global {
  interface Window {
    ChannelIO?: (command: string, ...args: any[]) => void;
    ChannelIOInitialized?: boolean;
  }
}

export interface ChannelIOBootOption {
  pluginKey: string;
  memberId?: string;
  profile?: {
    name?: string;
    email?: string;
    mobileNumber?: string;
    [key: string]: any;
  };
  language?: string;
  zIndex?: number;
  customLauncherSelector?: string;
  hideChannelButtonOnBoot?: boolean;
  [key: string]: any;
}

export {};
