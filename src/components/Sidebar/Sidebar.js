import React from 'react';
import './Sidebar.css';

const Sidebar = ({ activeView, onViewChange, uavData }) => {
  const menuItems = [
    { id: 'dashboard', label: '总控制台', icon: '📊', description: '综合监控面板' },
    { id: 'map', label: '地图路径', icon: '🗺️', description: '路径规划与地图' },
    { id: 'control', label: '飞行控制', icon: '🎮', description: '无人机控制面板' }
  ];

  const quickStats = [
    { label: '电池电量', value: `${Math.round(uavData.battery)}%`, color: uavData.battery > 50 ? 'success' : uavData.battery > 20 ? 'warning' : 'danger' },
    { label: '飞行高度', value: `${Math.round(uavData.altitude)}m`, color: 'primary' },
    { label: '飞行速度', value: `${Math.round(uavData.speed)}km/h`, color: 'primary' },
    { label: 'GPS信号', value: `${Math.round(uavData.gpsSignal)}%`, color: uavData.gpsSignal > 80 ? 'success' : 'warning' }
  ];

  const getStatColor = (color) => {
    switch (color) {
      case 'success': return 'var(--success-color)';
      case 'warning': return 'var(--warning-color)';
      case 'danger': return 'var(--danger-color)';
      case 'primary': return 'var(--primary-color)';
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        {/* 导航菜单 */}
        <nav className="sidebar-nav">
          <h3 className="nav-title">导航菜单</h3>
          <ul className="nav-list">
            {menuItems.map((item) => (
              <li key={item.id} className="nav-item">
                <button
                  className={`nav-link ${activeView === item.id ? 'active' : ''}`}
                  onClick={() => onViewChange(item.id)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <div className="nav-text">
                    <span className="nav-label">{item.label}</span>
                    <span className="nav-description">{item.description}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* 快速状态 */}
        <div className="quick-stats">
          <h3 className="stats-title">实时状态</h3>
          <div className="stats-grid">
            {quickStats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-label">{stat.label}</div>
                <div 
                  className="stat-value"
                  style={{ color: getStatColor(stat.color) }}
                >
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 设备状态 */}
        <div className="device-status">
          <h3 className="status-title">设备状态</h3>
          <div className="device-list">
            <div className="device-item">
              <div className="device-info">
                <span className="device-name">📹 可见光相机</span>
                <span className={`device-status-badge ${uavData.cameraStatus === 'active' ? 'active' : 'inactive'}`}>
                  {uavData.cameraStatus === 'active' ? '运行中' : '离线'}
                </span>
              </div>
            </div>
            <div className="device-item">
              <div className="device-info">
                <span className="device-name">🌡️ 红外相机</span>
                <span className={`device-status-badge ${uavData.thermalStatus === 'active' ? 'active' : 'inactive'}`}>
                  {uavData.thermalStatus === 'active' ? '运行中' : '离线'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 环境信息 */}
        <div className="environment-info">
          <h3 className="env-title">环境信息</h3>
          <div className="env-grid">
            <div className="env-item">
              <span className="env-label">🌡️ 温度</span>
              <span className="env-value">{Math.round(uavData.temperature)}°C</span>
            </div>
            <div className="env-item">
              <span className="env-label">💧 湿度</span>
              <span className="env-value">{Math.round(uavData.humidity)}%</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;