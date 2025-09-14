import React, { useState, useEffect } from 'react';
import './ControlPanel.css';

const ControlPanel = ({ uavStatus, onControl, uavData, fullscreen = false }) => {
  const [selectedMode, setSelectedMode] = useState('manual'); // manual, auto, waypoint
  const [flightMode, setFlightMode] = useState('hover'); // hover, follow, patrol, return
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [speedSetting, setSpeedSetting] = useState(15); // km/h
  const [altitudeSetting, setAltitudeSetting] = useState(120); // meters
  const [lastCommand, setLastCommand] = useState(null);

  const controlButtons = [
    { 
      id: 'takeoff', 
      label: '🚁 起飞', 
      type: 'success', 
      disabled: uavStatus === 'flying' || uavStatus === 'landing',
      description: '启动无人机并开始飞行任务'
    },
    { 
      id: 'land', 
      label: '🛬 降落', 
      type: 'warning', 
      disabled: uavStatus !== 'flying',
      description: '命令无人机安全降落'
    },
    { 
      id: 'return', 
      label: '🏠 返航', 
      type: 'primary', 
      disabled: uavStatus !== 'flying',
      description: '返回起飞点并自动降落'
    },
    { 
      id: 'emergency_stop', 
      label: '🚨 紧急停止', 
      type: 'danger', 
      disabled: uavStatus === 'disconnected',
      description: '立即停止所有操作'
    }
  ];

  const flightModes = [
    { id: 'hover', label: '悬停模式', icon: '⏸️', description: '保持当前位置悬停' },
    { id: 'follow', label: '跟踪模式', icon: '🎯', description: '跟踪指定目标' },
    { id: 'patrol', label: '巡逻模式', icon: '🔄', description: '按预设路线巡逻' },
    { id: 'return', label: '返航模式', icon: '🏠', description: '返回起飞点' }
  ];

  const handleControlClick = (action) => {
    if (action === 'emergency_stop') {
      setEmergencyMode(true);
      setTimeout(() => setEmergencyMode(false), 3000);
    }
    
    setLastCommand({
      action,
      timestamp: new Date(),
      status: 'executing'
    });

    onControl(action);

    // 模拟命令执行完成
    setTimeout(() => {
      setLastCommand(prev => prev ? { ...prev, status: 'completed' } : null);
    }, 2000);
  };

  const handleSpeedChange = (newSpeed) => {
    setSpeedSetting(newSpeed);
    console.log(`设置飞行速度: ${newSpeed} km/h`);
  };

  const handleAltitudeChange = (newAltitude) => {
    setAltitudeSetting(newAltitude);
    console.log(`设置飞行高度: ${newAltitude} m`);
  };

  const getBatteryStatus = (level) => {
    if (level > 60) return { color: 'success', status: '充足' };
    if (level > 30) return { color: 'warning', status: '中等' };
    if (level > 15) return { color: 'danger', status: '低电量' };
    return { color: 'danger', status: '紧急' };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'success';
      case 'flying': return 'primary';
      case 'landing': return 'warning';
      case 'disconnected': return 'danger';
      default: return 'secondary';
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

  return (
    <div className={`control-panel ${fullscreen ? 'fullscreen' : ''}`}>
      <div className="control-header">
        <h2 className="control-title">
          🎮 无人机控制面板
        </h2>
        
        <div className="status-display">
          <div className={`status-indicator ${getStatusColor(uavStatus)}`}>
            <span className="status-dot"></span>
            <span className="status-text">{getStatusText(uavStatus)}</span>
          </div>
          
          {emergencyMode && (
            <div className="emergency-indicator">
              🚨 紧急模式激活
            </div>
          )}
        </div>
      </div>

      <div className="control-content">
        {/* 主要控制按钮 */}
        <div className="main-controls">
          <h3 className="section-title">主要操作</h3>
          <div className="control-buttons">
            {controlButtons.map((button) => (
              <div key={button.id} className="control-button-wrapper">
                <button
                  className={`control-button ${button.type} ${button.disabled ? 'disabled' : ''}`}
                  onClick={() => !button.disabled && handleControlClick(button.id)}
                  disabled={button.disabled}
                  title={button.description}
                >
                  {button.label}
                </button>
                <p className="button-description">{button.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 飞行参数设置 */}
        <div className="flight-parameters">
          <h3 className="section-title">飞行参数</h3>
          
          <div className="parameter-grid">
            <div className="parameter-item">
              <label className="parameter-label">飞行速度 (km/h)</label>
              <div className="parameter-control">
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={speedSetting}
                  onChange={(e) => handleSpeedChange(parseInt(e.target.value))}
                  className="parameter-slider"
                />
                <span className="parameter-value">{speedSetting}</span>
              </div>
            </div>

            <div className="parameter-item">
              <label className="parameter-label">飞行高度 (m)</label>
              <div className="parameter-control">
                <input
                  type="range"
                  min="50"
                  max="300"
                  value={altitudeSetting}
                  onChange={(e) => handleAltitudeChange(parseInt(e.target.value))}
                  className="parameter-slider"
                />
                <span className="parameter-value">{altitudeSetting}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 飞行模式选择 */}
        <div className="flight-modes">
          <h3 className="section-title">飞行模式</h3>
          <div className="mode-selector">
            {flightModes.map((mode) => (
              <button
                key={mode.id}
                className={`mode-button ${flightMode === mode.id ? 'active' : ''}`}
                onClick={() => setFlightMode(mode.id)}
                title={mode.description}
              >
                <span className="mode-icon">{mode.icon}</span>
                <span className="mode-label">{mode.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 实时状态信息 */}
        <div className="status-info">
          <h3 className="section-title">实时状态</h3>
          
          <div className="status-grid">
            <div className="status-item">
              <div className="status-item-header">
                <span className="status-icon">🔋</span>
                <span className="status-label">电池电量</span>
              </div>
              <div className="battery-indicator">
                <div className="battery-bar">
                  <div 
                    className={`battery-fill ${getBatteryStatus(uavData.battery).color}`}
                    style={{ width: `${uavData.battery}%` }}
                  ></div>
                </div>
                <span className="battery-text">
                  {Math.round(uavData.battery)}% ({getBatteryStatus(uavData.battery).status})
                </span>
              </div>
            </div>

            <div className="status-item">
              <div className="status-item-header">
                <span className="status-icon">📡</span>
                <span className="status-label">GPS信号</span>
              </div>
              <div className="signal-indicator">
                <div className="signal-bars">
                  {[1, 2, 3, 4, 5].map((bar) => (
                    <div
                      key={bar}
                      className={`signal-bar ${uavData.gpsSignal > bar * 20 ? 'active' : ''}`}
                    ></div>
                  ))}
                </div>
                <span className="signal-text">{Math.round(uavData.gpsSignal)}%</span>
              </div>
            </div>

            <div className="status-item">
              <div className="status-item-header">
                <span className="status-icon">📍</span>
                <span className="status-label">当前位置</span>
              </div>
              <div className="coordinate-display">
                <div className="coordinate-item">
                  <span className="coord-label">纬度:</span>
                  <span className="coord-value">{uavData.coordinates.lat.toFixed(6)}°</span>
                </div>
                <div className="coordinate-item">
                  <span className="coord-label">经度:</span>
                  <span className="coord-value">{uavData.coordinates.lng.toFixed(6)}°</span>
                </div>
              </div>
            </div>

            <div className="status-item">
              <div className="status-item-header">
                <span className="status-icon">🌡️</span>
                <span className="status-label">环境监测</span>
              </div>
              <div className="environment-data">
                <div className="env-item">
                  <span>温度: {Math.round(uavData.temperature)}°C</span>
                </div>
                <div className="env-item">
                  <span>湿度: {Math.round(uavData.humidity)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 最近命令 */}
        {lastCommand && (
          <div className="last-command">
            <h3 className="section-title">最近命令</h3>
            <div className={`command-status ${lastCommand.status}`}>
              <div className="command-info">
                <span className="command-action">{lastCommand.action}</span>
                <span className="command-time">
                  {lastCommand.timestamp.toLocaleTimeString('zh-CN')}
                </span>
              </div>
              <div className={`command-indicator ${lastCommand.status}`}>
                {lastCommand.status === 'executing' ? '⏳ 执行中' : '✅ 已完成'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ControlPanel;