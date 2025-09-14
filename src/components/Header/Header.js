import React from 'react';
import './Header.css';

const Header = ({ projectName, uavStatus, alertLevel }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'var(--success-color)';
      case 'flying': return 'var(--primary-color)';
      case 'landing': return 'var(--warning-color)';
      case 'disconnected': return 'var(--danger-color)';
      default: return 'var(--text-secondary)';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'connected': return '已连接';
      case 'flying': return '飞行中';
      case 'landing': return '降落中';
      case 'disconnected': return '连接断开';
      default: return '未知状态';
    }
  };

  const getAlertLevelColor = (level) => {
    switch (level) {
      case 'emergency': return 'var(--danger-color)';
      case 'warning': return 'var(--warning-color)';
      case 'normal': return 'var(--success-color)';
      default: return 'var(--text-secondary)';
    }
  };

  const getAlertLevelText = (level) => {
    switch (level) {
      case 'emergency': return '紧急警报';
      case 'warning': return '警告';
      case 'normal': return '正常';
      default: return '未知';
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <div className="logo">
            <div className="logo-icon">🚁</div>
            <div className="logo-text">
              <h1 className="project-title">{projectName}</h1>
              <span className="project-subtitle">Forest Fire Monitoring System</span>
            </div>
          </div>
        </div>
        
        <div className="header-center">
          <div className="status-indicators">
            <div className="status-item">
              <span className="status-label">无人机状态</span>
              <div className="status-value">
                <div 
                  className="status-dot" 
                  style={{ backgroundColor: getStatusColor(uavStatus) }}
                ></div>
                <span>{getStatusText(uavStatus)}</span>
              </div>
            </div>
            
            <div className="status-item">
              <span className="status-label">系统状态</span>
              <div className="status-value">
                <div 
                  className="status-dot" 
                  style={{ backgroundColor: getAlertLevelColor(alertLevel) }}
                ></div>
                <span>{getAlertLevelText(alertLevel)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="header-right">
          <div className="current-time">
            <span className="time-label">当前时间</span>
            <span className="time-value">
              {new Date().toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;