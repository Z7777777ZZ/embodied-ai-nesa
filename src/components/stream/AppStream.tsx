import { Component, type CSSProperties } from 'react';
import { AppStreamer, StreamType } from '@nvidia/omniverse-webrtc-streaming-library';
import type { StreamEvent, StreamProps, DirectConfig } from '@nvidia/omniverse-webrtc-streaming-library';
import StreamConfig from '../../../stream.config.json';

// Props interface defined locally to avoid module resolution issues
interface AppStreamProps {
  sessionId?: string;
  backendUrl?: string;
  signalingserver: string;
  signalingport: number;
  mediaserver: string;
  mediaport: number | null;
  accessToken?: string;
  style?: CSSProperties;
  onStreamStarted: () => void;
  onStreamFailed: (error?: any) => void;
  onLoggedIn?: (userId: string) => void;
  handleCustomEvent?: (event: any) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

interface AppStreamState {
  streamReady: boolean;
}

/**
 * AppStream component - handles WebRTC video streaming from Omniverse Kit application
 * Simplified version that only supports local streaming mode
 */
export default class AppStream extends Component<AppStreamProps, AppStreamState> {
  private _requested: boolean;

  constructor(props: AppStreamProps) {
    super(props);

    this._requested = false;
    this.state = {
      streamReady: false
    };
  }

  componentDidMount() {
    if (!this._requested) {
      this._requested = true;

      // Configure for local streaming only
      const streamSource = StreamType.DIRECT;
      const streamConfig: DirectConfig = {
        videoElementId: 'remote-video',
        audioElementId: 'remote-audio',
        authenticate: true,
        maxReconnects: 20,
        signalingServer: StreamConfig.local.server,
        signalingPort: StreamConfig.local.signalingPort,
        mediaServer: StreamConfig.local.server,
        ...(StreamConfig.local.mediaPort != null && { mediaPort: StreamConfig.local.mediaPort }),
        nativeTouchEvents: true,
        width: 1920,
        height: 1080,
        fps: 60,
        onUpdate: (message: StreamEvent) => this._onUpdate(message),
        onStart: (message: StreamEvent) => this._onStart(message),
        onCustomEvent: (message: any) => this._onCustomEvent(message),
        onStop: (message: StreamEvent) => { 
          console.log('Stream stopped:', message);
        },
        onTerminate: (message: StreamEvent) => { 
          console.log('Stream terminated:', message);
        }
      };

      const streamProps: StreamProps = { streamConfig, streamSource };

      try {
        AppStreamer.connect(streamProps)
          .then((result: StreamEvent) => {
            console.info('Stream connection successful:', result);
          })
          .catch((error: StreamEvent) => {
            console.error('Stream connection error:', error);
            this.props.onStreamFailed(error);
          });
      } catch (error) {
        console.error('Failed to initialize stream:', error);
        this.props.onStreamFailed(error);
      }
    }
  }

  componentWillUnmount() {
    // Clean up stream resources
    try {
      AppStreamer.stop();
    } catch (error) {
      console.warn('Error stopping stream:', error);
    }
  }

  static sendMessage(message: any) {
    AppStreamer.sendMessage(message);
  }

  static stop() {
    AppStreamer.stop();
  }

  static terminate() {
    AppStreamer.terminate();
  }

  private _onStart(message: any) {
    if (message.action === 'start' && message.status === 'success' && !this.state.streamReady) {
      console.info('Stream ready');
      this.setState({ streamReady: true });
      this.props.onStreamStarted();
    }

    if (message.status === 'error') {
      console.error('Stream start error:', message.info);
      this.props.onStreamFailed(message);
    }
  }

  private _onUpdate(message: any) {
    try {
      if (message.action === 'authUser' && message.status === 'success') {
        console.log('User authenticated:', message.info);
        this.props.onLoggedIn?.(message.info);
      }
    } catch (error) {
      console.error('Update error:', message);
    }
  }

  private _onCustomEvent(message: any) {
    this.props.handleCustomEvent?.(message);
  }

  render() {
    return (
      <div
        key="stream-canvas"
        id="main-div"
        className="stream-wrapper"
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: this.state.streamReady ? 'black' : '#1a1a1a',
          visibility: this.state.streamReady ? 'visible' : 'hidden',
          ...this.props.style
        }}
      >
        <video
          key="video-canvas"
          id="remote-video"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
          tabIndex={-1}
          playsInline
          muted
          autoPlay
        />
        <audio id="remote-audio" muted></audio>
      </div>
    );
  }
}

