import React, { useEffect, useState } from 'react';
import './AlertSystem.css';

const AlertSystem = ({ level, onAcknowledge, fireLocation }) => {
  const [alertTime, setAlertTime] = useState(new Date());
  const [isBlinking, setIsBlinking] = useState(true);
  const [audioPlayed, setAudioPlayed] = useState(false);

  useEffect(() => {
    // 播放警报声音
    if (!audioPlayed && level === 'emergency') {
      // 这里可以添加实际的音频播放代码
      console.log('🚨 播放紧急警报声');
      setAudioPlayed(true);
    }

    // 闪烁效果
    const blinkInterval = setInterval(() => {
      setIsBlinking(prev => !prev);
    }, 500);

    return () => clearInterval(blinkInterval);
  }, [level, audioPlayed]);

  const getAlertIcon = () => {
    switch (level) {
      case 'emergency': return '🔥';
      case 'warning': return '⚠️';
      case 'danger': return '🚨';
      default: return '❗';
    }
  };

  const getAlertTitle = () => {
    switch (level) {
      case 'emergency': return '🔥 森林火灾紧急警报 🔥';
      case 'warning': return '⚠️ 高温异常警告';
      case 'danger': return '🚨 危险区域警报';
      default: return '❗ 系统警报';
    }
  };

  const getAlertMessage = () => {
    switch (level) {
      case 'emergency': 
        return `检测到森林火灾！立即启动应急响应程序。火灾位置：${fireLocation}`;
      case 'warning': 
        return '监测区域温度异常升高，请加强巡逻监控';
      case 'danger': 
        return '发现可疑热源，建议派遣无人机进行详细侦察';
      default: 
        return '系统检测到异常情况，请及时处理';
    }
  };

  const getEmergencyActions = () => [
    { 
      id: 'dispatch_fire_dept',
      label: '🚒 通知消防部门',
      type: 'danger',
      action: () => {
        console.log('通知消防部门');
        alert('已通知消防部门！');
      }
    },
    { 
      id: 'evacuate_area',
      label: '🏃‍♂️ 启动疏散程序',
      type: 'warning',
      action: () => {
        console.log('启动疏散程序');
        alert('疏散程序已启动！');
      }
    },
    { 
      id: 'deploy_drones',
      label: '🚁 部署增援无人机',
      type: 'primary',
      action: () => {
        console.log('部署增援无人机');
        alert('增援无人机正在部署！');
      }
    },
    { 
      id: 'contact_authorities',
      label: '📞 联系相关部门',
      type: 'secondary',
      action: () => {
        console.log('联系相关部门');
        alert('正在联系相关部门！');
      }
    }
  ];

  return (
    <div className={`alert-overlay ${level} ${isBlinking ? 'blink' : ''}`}>
      <div className="alert-container">
        {/* 警报头部 */}
        <div className="alert-header">
          <div className="alert-icon">
            {getAlertIcon()}
          </div>
          <div className="alert-title-section">
            <h1 className="alert-title">{getAlertTitle()}</h1>
            <div className="alert-timestamp">
              {alertTime.toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </div>
          </div>
          <button 
            className="alert-close"
            onClick={onAcknowledge}
            title="确认并关闭警报"
          >
            ✕
          </button>
        </div>

        {/* 警报内容 */}
        <div className="alert-content">
          <div className="alert-message">
            <p>{getAlertMessage()}</p>
          </div>

          {/* 火灾位置信息 */}
          {level === 'emergency' && fireLocation && (
            <div className="fire-location">
              <h3>🗺️ 火灾位置信息</h3>
              <div className="location-details">
                <div className="location-item">
                  <span className="location-label">发现位置：</span>
                  <span className="location-value">{fireLocation}</span>
                </div>
                <div className="location-item">
                  <span className="location-label">威胁等级：</span>
                  <span className="location-value threat-high">极高</span>
                </div>
                <div className="location-item">
                  <span className="location-label">蔓延风险：</span>
                  <span className="location-value threat-high">快速扩散</span>
                </div>
              </div>
            </div>
          )}

          {/* 应急处理按钮 */}
          {level === 'emergency' && (
            <div className="emergency-actions">
              <h3>🚨 紧急处理措施</h3>
              <div className="action-buttons">
                {getEmergencyActions().map((action) => (
                  <button
                    key={action.id}
                    className={`action-btn ${action.type}`}
                    onClick={action.action}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 确认按钮 */}
          <div className="alert-footer">
            <button 
              className="acknowledge-btn"
              onClick={onAcknowledge}
            >
              ✓ 确认警报并关闭
            </button>
          </div>
        </div>
      </div>

      {/* 背景动画效果 */}
      <div className="alert-background-effects">
        <div className="fire-particle"></div>
        <div className="fire-particle"></div>
        <div className="fire-particle"></div>
        <div className="fire-particle"></div>
        <div className="fire-particle"></div>
      </div>
    </div>
  );
};

export default AlertSystem;