import { useState } from 'react';
import { 
  LayoutDashboard, 
  Bot, 
  Film, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  Home,
  User,
  Sparkles,
  Play,
  Pause,
  Square,
  RotateCw,
  Video,
  Loader2
} from 'lucide-react';
import './WorkspacePage.css';
import StreamOnlyWindow from './stream/StreamOnlyWindow';
import StreamConfig from '../../stream.config.json';
import type { StreamStatus } from '../types/stream.types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface TraceLog {
  timestamp: Date;
  level: 'info' | 'warning' | 'error';
  message: string;
  data?: any;
}

interface WorkspacePageProps {
  onBackToHome?: () => void;
}

function WorkspacePage({ onBackToHome }: WorkspacePageProps) {
  const [isChatCollapsed, setIsChatCollapsed] = useState(false);
  const [isTraceCollapsed, setIsTraceCollapsed] = useState(false);
  
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I\'m ready to assist you with embodied AI testing.', timestamp: new Date() }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  
  const [traceLogs, setTraceLogs] = useState<TraceLog[]>([
    { timestamp: new Date(), level: 'info', message: 'System initialized' },
    { timestamp: new Date(), level: 'info', message: 'Waiting for video stream...' }
  ]);

  // Video stream states
  const [streamStatus, setStreamStatus] = useState<StreamStatus>('idle');
  const [showStream, setShowStream] = useState(false);
  const [streamError, setStreamError] = useState<string>('');
  const [streamFps] = useState<number>(60);
  const [streamResolution] = useState<string>('1920x1080');

  // Helper function to add trace logs
  const addTraceLog = (level: 'info' | 'warning' | 'error', message: string, data?: any) => {
    setTraceLogs(prev => [...prev, {
      timestamp: new Date(),
      level,
      message,
      data
    }]);
  };

  // Handle stream started successfully
  const handleStreamStarted = () => {
    setStreamStatus('connected');
    addTraceLog('info', `Video stream connected successfully (${streamResolution} @ ${streamFps} FPS)`);
  };

  // Handle stream connection failed
  const handleStreamFailed = (error?: any) => {
    setStreamStatus('error');
    const errorMsg = error?.message || error?.info || 'Unknown error';
    setStreamError(errorMsg);
    addTraceLog('error', `Stream connection failed: ${errorMsg}`, error);
  };

  // Handle stream retry
  const handleStreamRetry = () => {
    setStreamStatus('connecting');
    setStreamError('');
    setShowStream(false);
    addTraceLog('info', 'Retrying stream connection...');
    
    // Trigger re-render with a small delay
    setTimeout(() => {
      setShowStream(true);
    }, 100);
  };

  // Handle stop stream
  const handleStopStream = () => {
    setShowStream(false);
    setStreamStatus('idle');
    addTraceLog('info', 'Stream stopped by user');
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const userMsg = inputMessage;
      setMessages([...messages, { 
        role: 'user', 
        content: userMsg, 
        timestamp: new Date() 
      }]);
      setInputMessage('');
      
      addTraceLog('info', `User message sent: "${userMsg}"`);
      
      // Trigger video stream on first message (if not already started)
      if (streamStatus === 'idle') {
        setStreamStatus('connecting');
        setShowStream(true);
        addTraceLog('info', 'Initiating video stream connection...');
      }
      
      // 模拟AI回复
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'I received your message. Processing...', 
          timestamp: new Date() 
        }]);
        addTraceLog('info', 'AI response received');
      }, 1000);
    }
  };

  return (
    <div className="workspace-page">
      {/* 侧边栏 */}
      <aside className="sidebar">
        <div className="sidebar-content">
          <div className="sidebar-header">
            <button 
              className="sidebar-logo" 
              onClick={onBackToHome}
              data-tooltip="Back to Home"
            >
              <Home size={18} />
            </button>
          </div>
          
          <nav className="sidebar-nav">
            <button className="nav-item active" data-tooltip="Dashboard">
              <LayoutDashboard size={20} />
            </button>
            <button className="nav-item" data-tooltip="Agents">
              <Bot size={20} />
            </button>
            <button className="nav-item" data-tooltip="Sessions">
              <Film size={20} />
            </button>
            <button className="nav-item" data-tooltip="Analytics">
              <BarChart3 size={20} />
            </button>
            <button className="nav-item" data-tooltip="Settings">
              <Settings size={20} />
            </button>
          </nav>
          
          <div className="sidebar-footer">
            <button className="nav-item" data-tooltip="Help">
              <HelpCircle size={20} />
            </button>
          </div>
        </div>
      </aside>

      {/* 对话框区域 */}
      <section className={`chat-panel ${isChatCollapsed ? 'collapsed' : ''}`}>
        <div className="panel-header">
          <h3>AI Assistant</h3>
          <button 
            className="collapse-btn"
            onClick={() => setIsChatCollapsed(!isChatCollapsed)}
          >
            {isChatCollapsed ? '→' : '←'}
          </button>
        </div>
        
        {!isChatCollapsed && (
          <>
            <div className="messages-container">
              {messages.map((msg, idx) => (
                <div key={idx} className={`message ${msg.role}`}>
                  <div className="message-avatar">
                    {msg.role === 'user' ? (
                      <User size={16} />
                    ) : (
                      <Sparkles size={16} />
                    )}
                  </div>
                  <div className="message-content">
                    <div className="message-text">{msg.content}</div>
                    <div className="message-time">
                      {msg.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="chat-input-container">
              <input
                type="text"
                className="chat-input"
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button className="send-btn" onClick={handleSendMessage}>
                Send
              </button>
            </div>
          </>
        )}
      </section>

      {/* 视频流区域 */}
      <main className="video-panel">
        <div className="panel-header">
          <h3>Video Stream</h3>
          <div className="video-controls">
            <button 
              className="control-btn" 
              title="Play" 
              disabled={streamStatus === 'connected'}
              style={{ opacity: streamStatus === 'connected' ? 0.5 : 1 }}
            >
              <Play size={16} />
            </button>
            <button 
              className="control-btn" 
              title="Pause" 
              disabled
              style={{ opacity: 0.5 }}
            >
              <Pause size={16} />
            </button>
            <button 
              className="control-btn" 
              title="Stop" 
              onClick={handleStopStream}
              disabled={streamStatus === 'idle'}
              style={{ opacity: streamStatus === 'idle' ? 0.5 : 1 }}
            >
              <Square size={16} />
            </button>
            <button 
              className="control-btn" 
              title="Refresh" 
              onClick={handleStreamRetry}
              disabled={streamStatus === 'idle' || streamStatus === 'connecting'}
              style={{ opacity: (streamStatus === 'idle' || streamStatus === 'connecting') ? 0.5 : 1 }}
            >
              <RotateCw size={16} />
            </button>
          </div>
        </div>
        
        <div className="video-container">
          {/* Show placeholder when stream is not active or connecting */}
          {(!showStream || streamStatus === 'connecting') && (
            <div className="video-placeholder">
              <div className="placeholder-icon">
                {streamStatus === 'connecting' ? (
                  <Loader2 size={64} strokeWidth={1.5} className="animate-spin" />
                ) : (
                  <Video size={64} strokeWidth={1.5} />
                )}
              </div>
              <p>
                {streamStatus === 'idle' && 'Video stream will appear here'}
                {streamStatus === 'connecting' && 'Connecting to stream...'}
                {streamStatus === 'error' && 'Connection failed'}
              </p>
              <p className="placeholder-subtext">
                {streamStatus === 'idle' && 'Send a message to start streaming'}
                {streamStatus === 'connecting' && 'Please wait...'}
                {streamStatus === 'error' && streamError}
              </p>
              {streamStatus === 'error' && (
                <button 
                  onClick={handleStreamRetry}
                  style={{
                    marginTop: '1rem',
                    padding: '0.5rem 1rem',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Retry Connection
                </button>
              )}
            </div>
          )}

          {/* Show video stream when connected */}
          {showStream && streamStatus !== 'connecting' && (
            <StreamOnlyWindow
              signalingserver={StreamConfig.local.server}
              signalingport={StreamConfig.local.signalingPort}
              mediaserver={StreamConfig.local.server}
              mediaport={StreamConfig.local.mediaPort}
              onStreamStarted={handleStreamStarted}
              onStreamFailed={handleStreamFailed}
            />
          )}
        </div>
        
        <div className="video-info">
          <div className="info-item">
            <span className="info-label">Status:</span>
            <span className={`info-value ${
              streamStatus === 'idle' ? 'status-waiting' :
              streamStatus === 'connecting' ? 'status-connecting' :
              streamStatus === 'connected' ? 'status-connected' :
              'status-error'
            }`}>
              {streamStatus === 'idle' && 'Waiting'}
              {streamStatus === 'connecting' && 'Connecting...'}
              {streamStatus === 'connected' && 'Connected'}
              {streamStatus === 'error' && 'Error'}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">FPS:</span>
            <span className="info-value">
              {streamStatus === 'connected' ? streamFps : '--'}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Resolution:</span>
            <span className="info-value">
              {streamStatus === 'connected' ? streamResolution : '--'}
            </span>
          </div>
        </div>
      </main>

      {/* Trace日志区域 */}
      <aside className={`trace-panel ${isTraceCollapsed ? 'collapsed' : ''}`}>
        <div className="panel-header">
          <button 
            className="collapse-btn"
            onClick={() => setIsTraceCollapsed(!isTraceCollapsed)}
          >
            {isTraceCollapsed ? '←' : '→'}
          </button>
          <h3>Trace & Logs</h3>
        </div>
        
        {!isTraceCollapsed && (
          <>
            <div className="trace-tabs">
              <button className="trace-tab active">Logs</button>
              <button className="trace-tab">Metrics</button>
              <button className="trace-tab">Events</button>
            </div>
            
            <div className="trace-container">
              {traceLogs.map((log, idx) => (
                <div key={idx} className={`trace-log ${log.level}`}>
                  <span className="trace-time">
                    {log.timestamp.toLocaleTimeString()}
                  </span>
                  <span className={`trace-level ${log.level}`}>
                    {log.level.toUpperCase()}
                  </span>
                  <span className="trace-message">{log.message}</span>
                </div>
              ))}
            </div>
            
            <div className="trace-footer">
              <button className="trace-action">Clear Logs</button>
              <button className="trace-action">Export</button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

export default WorkspacePage;

