import { CSSProperties } from 'react';

/**
 * Stream status types
 */
export type StreamStatus = 'idle' | 'connecting' | 'connected' | 'error';

/**
 * Stream configuration interface
 */
export interface StreamConfig {
  source: 'local';
  local: {
    server: string;
    signalingPort: number;
    mediaPort: number | null;
  };
}

/**
 * Stream callback props
 */
export interface StreamCallbacks {
  onStreamStarted: () => void;
  onStreamFailed: (error?: any) => void;
  onLoggedIn?: (userId: string) => void;
  handleCustomEvent?: (event: any) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

/**
 * AppStream component props
 */
export interface AppStreamProps extends StreamCallbacks {
  sessionId?: string;
  backendUrl?: string;
  signalingserver: string;
  signalingport: number;
  mediaserver: string;
  mediaport: number | null;
  accessToken?: string;
  style?: CSSProperties;
}

/**
 * StreamOnlyWindow component props
 */
export interface StreamOnlyWindowProps {
  signalingserver: string;
  signalingport: number;
  mediaserver: string;
  mediaport: number | null;
  onStreamStarted: () => void;
  onStreamFailed: (error?: any) => void;
}

