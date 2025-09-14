import React, { useState, useEffect } from 'react';
import './DataDashboard.css';

const DataDashboard = ({ uavData }) => {
  const [historicalData, setHistoricalData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [systemHealth, setSystemHealth] = useState({
    overall: 95,
    camera: 98,
    thermal: 97,
    gps: 96,
    communication: 94,
    battery: 92
  });

  // 模拟历史数据和警报
  useEffect(() => {
    // 初始化历史数据
    const initialData = Array.from({ length: 20 }, (_, i) => ({
      time: new Date(Date.now() - (19 - i) * 60000).toLocaleTimeString('zh-CN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      battery: 100 - i * 0.5 + Math.random() * 2,
      altitude: 120 + Math.sin(i * 0.3) * 20 + Math.random() * 10,
      temperature: 25 + Math.sin(i * 0.2) * 5 + Math.random() * 3,
      humidity: 60 + Math.cos(i * 0.4) * 15 + Math.random() * 5
    }));
    setHistoricalData(initialData);

    // 初始化警报
    const initialAlerts = [
      {
        id: 1,
        time: new Date(Date.now() - 300000),
        type: 'warning',
        message: '电池电量低于20%，建议返航充电',
        resolved: false
      },
      {
        id: 2,
        time: new Date(Date.now() - 600000),
        type: 'info',
        message: '已完成北区巡逻任务',
        resolved: true
      },
      {
        id: 3,
        time: new Date(Date.now() - 900000),
        type: 'success',
        message: '无人机成功起飞，开始执行任务',
        resolved: true
      }
    ];
    setAlerts(initialAlerts);

    // 实时更新数据
    const interval = setInterval(() => {
      setHistoricalData(prev => {
        const newData = [...prev];
        newData.shift(); // 移除第一个
        newData.push({
          time: new Date().toLocaleTimeString('zh-CN', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          battery: uavData.battery + Math.random() * 2 - 1,
          altitude: uavData.altitude + Math.random() * 10 - 5,
          temperature: uavData.temperature + Math.random() * 2 - 1,
          humidity: uavData.humidity + Math.random() * 4 - 2
        });
        return newData;
      });

      // 随机生成新警报
      if (Math.random() < 0.1) { // 10% 概率
        const alertTypes = ['info', 'warning', 'error'];
        const messages = [
          '检测到疑似烟雾，正在进一步确认',
          '风力较强，注意飞行安全',
          'GPS信号轻微波动',
          '相机自动对焦完成',
          '已进入预设巡逻区域'
        ];
        
        const newAlert = {
          id: Date.now(),
          time: new Date(),
          type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
          message: messages[Math.floor(Math.random() * messages.length)],
          resolved: false
        };
        
        setAlerts(prev => [newAlert, ...prev.slice(0, 9)]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [uavData]);

  const getHealthColor = (value) => {
    if (value >= 95) return 'success';
    if (value >= 85) return 'warning';
    return 'danger';
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'success': return '✅';
      case 'info': return 'ℹ️';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return '📝';
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'success': return 'var(--success-color)';
      case 'info': return 'var(--primary-color)';
      case 'warning': return 'var(--warning-color)';
      case 'error': return 'var(--danger-color)';
      default: return 'var(--text-secondary)';
    }
  };

  const resolveAlert = (alertId) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
  };

  const clearResolvedAlerts = () => {
    setAlerts(prev => prev.filter(alert => !alert.resolved));
  };

  return (
    <div className="data-dashboard">
      {/* 实时数据卡片 */}
      <div className="dashboard-section">
        <h3 className="section-title">实时监控数据</h3>
        <div className="data-cards">
          <div className="data-card primary">
            <div className="card-icon">🔋</div>
            <div className="card-content">
              <div className="card-value">{Math.round(uavData.battery)}%</div>
              <div className="card-label">电池电量</div>
              <div className="card-trend">
                {uavData.battery > 50 ? '📈 正常' : uavData.battery > 20 ? '📉 中等' : '⚠️ 低电量'}
              </div>
            </div>
          </div>

          <div className="data-card success">
            <div className="card-icon">📡</div>
            <div className="card-content">
              <div className="card-value">{Math.round(uavData.gpsSignal)}%</div>
              <div className="card-label">GPS信号</div>
              <div className="card-trend">
                {uavData.gpsSignal > 80 ? '📶 强信号' : '📶 弱信号'}
              </div>
            </div>
          </div>

          <div className="data-card warning">
            <div className="card-icon">📏</div>
            <div className="card-content">
              <div className="card-value">{Math.round(uavData.altitude)}m</div>
              <div className="card-label">飞行高度</div>
              <div className="card-trend">
                {uavData.altitude > 100 ? '⬆️ 高空' : '⬇️ 低空'}
              </div>
            </div>
          </div>

          <div className="data-card info">
            <div className="card-icon">🌡️</div>
            <div className="card-content">
              <div className="card-value">{Math.round(uavData.temperature)}°C</div>
              <div className="card-label">环境温度</div>
              <div className="card-trend">
                {uavData.temperature > 30 ? '🔥 偏热' : uavData.temperature < 10 ? '❄️ 偏冷' : '🌡️ 正常'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 系统健康状态 */}
      <div className="dashboard-section">
        <h3 className="section-title">系统健康监控</h3>
        <div className="health-monitor">
          <div className="health-overall">
            <div className="overall-score">
              <div className={`score-circle ${getHealthColor(systemHealth.overall)}`}>
                <span className="score-value">{systemHealth.overall}%</span>
                <span className="score-label">系统健康</span>
              </div>
            </div>
          </div>
          
          <div className="health-details">
            {Object.entries(systemHealth).filter(([key]) => key !== 'overall').map(([key, value]) => (
              <div key={key} className="health-item">
                <div className="health-info">
                  <span className="health-name">
                    {key === 'camera' ? '📹 可见光相机' :
                     key === 'thermal' ? '🌡️ 红外相机' :
                     key === 'gps' ? '📍 GPS模块' :
                     key === 'communication' ? '📡 通信模块' :
                     key === 'battery' ? '🔋 电池系统' : key}
                  </span>
                  <span className="health-value">{value}%</span>
                </div>
                <div className="health-bar">
                  <div 
                    className={`health-fill ${getHealthColor(value)}`}
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 历史数据图表 */}
      <div className="dashboard-section">
        <h3 className="section-title">历史数据趋势</h3>
        <div className="chart-container">
          <div className="chart-header">
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-color battery"></div>
                <span>电池电量 (%)</span>
              </div>
              <div className="legend-item">
                <div className="legend-color altitude"></div>
                <span>飞行高度 (m)</span>
              </div>
              <div className="legend-item">
                <div className="legend-color temperature"></div>
                <span>温度 (°C)</span>
              </div>
            </div>
          </div>
          
          <div className="chart-area">
            <div className="chart-y-axis">
              <div className="y-label">100</div>
              <div className="y-label">75</div>
              <div className="y-label">50</div>
              <div className="y-label">25</div>
              <div className="y-label">0</div>
            </div>
            
            <div className="chart-content">
              <svg className="chart-svg" viewBox="0 0 400 200">
                {/* 网格线 */}
                <defs>
                  <pattern id="grid" width="20" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                {/* 电池数据线 */}
                <polyline
                  fill="none"
                  stroke="var(--primary-color)"
                  strokeWidth="2"
                  points={historicalData.map((data, i) => 
                    `${i * 20},${200 - (data.battery / 100) * 200}`
                  ).join(' ')}
                />
                
                {/* 高度数据线 */}
                <polyline
                  fill="none"
                  stroke="var(--success-color)"
                  strokeWidth="2"
                  points={historicalData.map((data, i) => 
                    `${i * 20},${200 - ((data.altitude - 80) / 80) * 200}`
                  ).join(' ')}
                />
                
                {/* 温度数据线 */}
                <polyline
                  fill="none"
                  stroke="var(--warning-color)"
                  strokeWidth="2"
                  points={historicalData.map((data, i) => 
                    `${i * 20},${200 - ((data.temperature) / 40) * 200}`
                  ).join(' ')}
                />
              </svg>
            </div>
          </div>
          
          <div className="chart-x-axis">
            {historicalData.filter((_, i) => i % 4 === 0).map((data, i) => (
              <div key={i} className="x-label">{data.time}</div>
            ))}
          </div>
        </div>
      </div>

      {/* 警报和通知 */}
      <div className="dashboard-section">
        <div className="alerts-header">
          <h3 className="section-title">系统警报通知</h3>
          <button className="clear-alerts-btn" onClick={clearResolvedAlerts}>
            清除已处理
          </button>
        </div>
        
        <div className="alerts-list">
          {alerts.length === 0 ? (
            <div className="no-alerts">
              <div className="no-alerts-icon">✨</div>
              <div className="no-alerts-text">暂无警报信息</div>
            </div>
          ) : (
            alerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`alert-item ${alert.type} ${alert.resolved ? 'resolved' : ''}`}
              >
                <div className="alert-icon">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="alert-content">
                  <div className="alert-message">{alert.message}</div>
                  <div className="alert-time">
                    {alert.time.toLocaleTimeString('zh-CN')}
                  </div>
                </div>
                {!alert.resolved && (
                  <button 
                    className="resolve-btn"
                    onClick={() => resolveAlert(alert.id)}
                  >
                    ✓
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DataDashboard;