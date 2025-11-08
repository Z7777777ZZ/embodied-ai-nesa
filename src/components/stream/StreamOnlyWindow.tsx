import { Component } from 'react';
import AppStream from './AppStream';

// Props interface defined locally
interface StreamOnlyWindowProps {
  signalingserver: string;
  signalingport: number;
  mediaserver: string;
  mediaport: number | null;
  onStreamStarted: () => void;
  onStreamFailed: (error?: any) => void;
}

/**
 * StreamOnlyWindow component - renders only the video stream without additional UI
 * Perfect for embedding into existing applications
 */
export default class StreamOnlyWindow extends Component<StreamOnlyWindowProps> {
  constructor(props: StreamOnlyWindowProps) {
    super(props);
  }

  /**
   * Handle for post-stream start
   */
  private _onStreamStarted(): void {
    console.log('The streaming session has started!');
    this.props.onStreamStarted();
  }

  /**
   * Handle for stream failure
   */
  private _onStreamFailed(error?: any): void {
    console.error('Stream failed:', error);
    this.props.onStreamFailed(error);
  }

  /**
   * Handle message from stream
   */
  private _handleCustomEvent(event: any): void {
    console.log('Custom event received:', event);
  }

  /**
   * Triggered when user is interacting with the viewport
   */
  private _handleAppStreamFocus(): void {
    console.log('User is interacting in streamed viewer');
  }

  /**
   * Triggered when user is no longer interacting with the viewport
   */
  private _handleAppStreamBlur(): void {
    console.log('User is not interacting in streamed viewer');
  }

  render() {
    return (
      <div
        className="stream-only-container"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          padding: 0,
          margin: 0
        }}
      >
        <AppStream
          signalingserver={this.props.signalingserver}
          signalingport={this.props.signalingport}
          mediaserver={this.props.mediaserver}
          mediaport={this.props.mediaport}
          onStreamStarted={() => this._onStreamStarted()}
          onFocus={() => this._handleAppStreamFocus()}
          onBlur={() => this._handleAppStreamBlur()}
          onStreamFailed={(error) => this._onStreamFailed(error)}
          onLoggedIn={(userId) => console.log(`User logged in: ${userId}`)}
          handleCustomEvent={(event) => this._handleCustomEvent(event)}
          style={{
            width: '100%',
            height: '100%',
            padding: 0,
            margin: 0
          }}
        />
      </div>
    );
  }
}

