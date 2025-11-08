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
  Video
} from 'lucide-react';
import './WorkspacePage.css';

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
  
  const [traceLogs] = useState<TraceLog[]>([
    { timestamp: new Date(), level: 'info', message: 'System initialized' },
    { timestamp: new Date(), level: 'info', message: 'Waiting for video stream...' }
  ]);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setMessages([...messages, { 
        role: 'user', 
        content: inputMessage, 
        timestamp: new Date() 
      }]);
      setInputMessage('');
      
      // 模拟AI回复
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'I received your message. Processing...', 
          timestamp: new Date() 
        }]);
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
            <button className="control-btn" title="Play">
              <Play size={16} />
            </button>
            <button className="control-btn" title="Pause">
              <Pause size={16} />
            </button>
            <button className="control-btn" title="Stop">
              <Square size={16} />
            </button>
            <button className="control-btn" title="Refresh">
              <RotateCw size={16} />
            </button>
          </div>
        </div>
        
        <div className="video-container">
          <div className="video-placeholder">
            <div className="placeholder-icon">
              <Video size={64} strokeWidth={1.5} />
            </div>
            <p>Video stream will appear here</p>
            <p className="placeholder-subtext">Waiting for connection...</p>
          </div>
        </div>
        
        <div className="video-info">
          <div className="info-item">
            <span className="info-label">Status:</span>
            <span className="info-value status-waiting">Waiting</span>
          </div>
          <div className="info-item">
            <span className="info-label">FPS:</span>
            <span className="info-value">--</span>
          </div>
          <div className="info-item">
            <span className="info-label">Resolution:</span>
            <span className="info-value">--</span>
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

