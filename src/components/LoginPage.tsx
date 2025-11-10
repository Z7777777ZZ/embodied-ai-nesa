import { useState } from 'react';
import { Key, LogIn, Loader2 } from 'lucide-react';
import './LoginPage.css';

interface LoginPageProps {
  onLoginSuccess: () => void;
  onBackToHome: () => void;
}

function LoginPage({ onLoginSuccess, onBackToHome }: LoginPageProps) {
  const [inviteCode, setInviteCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!inviteCode.trim()) {
      setError('请输入邀请码');
      return;
    }

    setIsLoading(true);
    setError('');

    // 模拟登录API调用
    try {
      // TODO: 替换为实际的API调用
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 验证邀请码 (这里只是示例,实际应该调用后端API)
      if (inviteCode.trim().length >= 6) {
        // 保存登录状态
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('inviteCode', inviteCode.trim());
        
        // 登录成功,跳转到工作台
        onLoginSuccess();
      } else {
        setError('邀请码无效,请检查后重试');
      }
    } catch (err) {
      setError('登录失败,请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleLogin();
    }
  };

  return (
    <div className="login-page">
      {/* 渐变背景 - 与首页一致 */}
      <div className="gradient-bg"></div>

      {/* 导航栏 */}
      <nav className="navbar">
        <div className="navbar-logo">NESA Lab</div>
        <ul className="navbar-links">
          <li><a href="#home" className="navbar-link" onClick={(e) => { e.preventDefault(); onBackToHome(); }}>Home</a></li>
          <li><a href="#feature" className="navbar-link">Feature</a></li>
          <li><a href="#about" className="navbar-link">About</a></li>
          <li><a href="#research" className="navbar-link">Research</a></li>
          <li><a href="#contact" className="navbar-link">Contact</a></li>
        </ul>
      </nav>

      {/* 登录表单 */}
      <main className="login-content">
        <div className="login-container">
          <div className="login-header">
            <div className="login-icon">
              <Key size={48} strokeWidth={1.5} />
            </div>
            <h1 className="login-title">欢迎回来</h1>
            <p className="login-subtitle">
              使用邀请码登录以访问 NESA Lab 工作台
            </p>
          </div>

          <div className="login-form">
            <div className="form-group">
              <label htmlFor="inviteCode" className="form-label">
                邀请码
              </label>
              <div className="input-wrapper">
                <Key size={18} className="input-icon" />
                <input
                  id="inviteCode"
                  type="text"
                  className="form-input"
                  placeholder="请输入您的邀请码"
                  value={inviteCode}
                  onChange={(e) => {
                    setInviteCode(e.target.value);
                    setError('');
                  }}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  autoFocus
                />
              </div>
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}
            </div>

            <button
              className="login-button"
              onClick={handleLogin}
              disabled={isLoading || !inviteCode.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="button-loader" />
                  登录中...
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  登录
                </>
              )}
            </button>

            <div className="login-footer">
              <p className="login-hint">
                如果您还没有邀请码,请联系管理员获取
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LoginPage;

