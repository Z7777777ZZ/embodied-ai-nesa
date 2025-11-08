import './App.css'

function App() {
  return (
    <div className="app">
      {/* 渐变背景 */}
      <div className="gradient-bg"></div>

      {/* 导航栏 */}
      <nav className="navbar">
        <div className="navbar-logo">NESA Lab</div>
        <ul className="navbar-links">
          <li><a href="#home" className="navbar-link">Home</a></li>
          <li><a href="#about" className="navbar-link">About</a></li>
          <li><a href="#research" className="navbar-link">Research</a></li>
          <li><a href="#team" className="navbar-link">Team</a></li>
          <li><a href="#contact" className="navbar-link">Contact</a></li>
        </ul>
      </nav>

      {/* 主内容 */}
      <main className="main-content">
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
            <button className="cta-button primary">Get Started</button>
            <button className="cta-button secondary">Learn More</button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
