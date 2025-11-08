import { useState } from 'react'
import { Brain, Shield, Zap, Microscope, BarChart2, GitBranch } from 'lucide-react'
import './App.css'
import WorkspacePage from './components/WorkspacePage'

function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'workspace'>('home')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showTransitionOverlay, setShowTransitionOverlay] = useState(false)

  const handleGetStarted = () => {
    setIsTransitioning(true)
    setShowTransitionOverlay(true)
    
    // 等待过渡动画完成后切换页面
    setTimeout(() => {
      setCurrentPage('workspace')
    }, 1000)
    
    // 过渡完成后隐藏遮罩，但保持 isTransitioning 为 true
    setTimeout(() => {
      setShowTransitionOverlay(false)
    }, 1400)
  }

  const handleBackToHome = () => {
    setShowTransitionOverlay(true)
    
    setTimeout(() => {
      setCurrentPage('home')
      setIsTransitioning(false)
    }, 1000)
    
    setTimeout(() => {
      setShowTransitionOverlay(false)
    }, 1400)
  }

  return (
    <>
      {/* 过渡遮罩层 */}
      {showTransitionOverlay && (
        <div className="transition-overlay">
          <div className="transition-glow"></div>
        </div>
      )}

      {currentPage === 'workspace' ? (
        <div className="workspace-wrapper">
          <WorkspacePage onBackToHome={handleBackToHome} />
        </div>
      ) : (
        <div className={`app ${isTransitioning ? 'transitioning-out' : ''}`}>
          {/* 渐变背景 */}
          <div className="gradient-bg"></div>

          {/* 导航栏 */}
          <nav className="navbar">
            <div className="navbar-logo">NESA Lab</div>
            <ul className="navbar-links">
              <li><a href="#home" className="navbar-link">Home</a></li>
              <li><a href="#feature" className="navbar-link">Feature</a></li>
              <li><a href="#about" className="navbar-link">About</a></li>
              <li><a href="#research" className="navbar-link">Research</a></li>
              <li><a href="#contact" className="navbar-link">Contact</a></li>
            </ul>
          </nav>

          {/* 主内容 - 首页 */}
          <main id="home" className="main-content">
            <div className="hero">
              <h1 className="hero-title">NESA Lab</h1>
              <p className="hero-subtitle">
                Embodied AI Platform
              </p>
              <p className="hero-description">
                Building the future of intelligent robotics and embodied artificial intelligence
              </p>

              {/* CTA按钮 */}
              <div className="cta-section">
                <button className="cta-button primary" onClick={handleGetStarted}>
                  Get Started
                </button>
                <button className="cta-button secondary" onClick={() => {
                  document.getElementById('feature')?.scrollIntoView({ behavior: 'smooth' });
                }}>
                  Learn More
                </button>
              </div>
            </div>
          </main>

      {/* Feature Section - 具身智能安全评测平台功能 */}
      <section id="feature" className="feature-section">
        <div className="feature-container">
          <div className="feature-header">
            <h2 className="feature-title">具身智能安全评测平台</h2>
            <p className="feature-subtitle">
              全方位评估具身智能系统的安全性、可靠性与性能，为AI机器人提供专业的测试与验证服务
            </p>
          </div>

          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Brain size={32} strokeWidth={1.5} />
              </div>
              <h3 className="feature-card-title">智能行为分析</h3>
              <p className="feature-card-description">
                实时监控和分析机器人的决策过程，评估行为的合理性与安全性，确保符合预期目标
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Shield size={32} strokeWidth={1.5} />
              </div>
              <h3 className="feature-card-title">安全性测试</h3>
              <p className="feature-card-description">
                多维度安全评估，包括物理安全、数据安全、对抗攻击防御等全方位测试场景
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Zap size={32} strokeWidth={1.5} />
              </div>
              <h3 className="feature-card-title">性能基准测试</h3>
              <p className="feature-card-description">
                标准化的性能评测体系，覆盖感知、规划、执行等关键环节，提供量化指标
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Microscope size={32} strokeWidth={1.5} />
              </div>
              <h3 className="feature-card-title">场景模拟</h3>
              <p className="feature-card-description">
                高保真的虚拟环境模拟，支持多种复杂场景配置，降低真实测试成本
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <BarChart2 size={32} strokeWidth={1.5} />
              </div>
              <h3 className="feature-card-title">数据可视化</h3>
              <p className="feature-card-description">
                直观的数据展示和分析工具，帮助快速定位问题，优化系统性能
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <GitBranch size={32} strokeWidth={1.5} />
              </div>
              <h3 className="feature-card-title">持续集成</h3>
              <p className="feature-card-description">
                自动化测试流程，支持CI/CD集成，实现开发测试一体化
              </p>
            </div>
          </div>
        </div>
      </section>
        </div>
      )}
    </>
  )
}

export default App
