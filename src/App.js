import React, { useState, useEffect } from 'react';
import './App.css';

// 导入组件
import Header from './components/Header/Header';
import AlertSystem from './components/AlertSystem/AlertSystem';
import VideoStreams from './components/VideoStreams/VideoStreams';
import ControlPanel from './components/ControlPanel/ControlPanel';
import MapView from './components/MapView/MapView';
import DataDashboard from './components/DataDashboard/DataDashboard';
import Sidebar from './components/Sidebar/Sidebar';

function App() {
  const [activeView, setActiveView] = useState('dashboard'); // dashboard, map, control
  const [alertLevel, setAlertLevel] = useState('normal'); // normal, warning, danger, emergency
  const [uavStatus, setUavStatus] = useState('connected'); // connected, disconnected, flying, landing
  const [fireDetected, setFireDetected] = useState(false);
  const [uavData, setUavData] = useState({
    battery: 85,
    altitude: 120,
    speed: 15,
    temperature: 25,
    humidity: 60,
    gpsSignal: 95,
    cameraStatus: 'active',
    thermalStatus: 'active',
    coordinates: { lat: 39.9042, lng: 116.4074 }
  });

  // 模拟实时数据更新
  useEffect(() => {
    const interval = setInterval(() => {
      // 模拟数据变化
      setUavData(prev => ({
        ...prev,
        battery: Math.max(10, prev.battery - 0.1),
        altitude: prev.altitude + (Math.random() - 0.5) * 5,
        temperature: 25 + (Math.random() - 0.5) * 10,
        humidity: 60 + (Math.random() - 0.5) * 20,
        gpsSignal: 90 + Math.random() * 10
      }));

      // 模拟火灾检测
      if (Math.random() < 0.001) { // 0.1% 概率
        setFireDetected(true);
        setAlertLevel('emergency');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 处理火灾警报确认
  const handleAlertAcknowledge = () => {
    setFireDetected(false);
    setAlertLevel('normal');
  };

  // 处理无人机控制
  const handleUAVControl = (action) => {
    console.log('UAV Control:', action);
    switch (action) {
      case 'takeoff':
        setUavStatus('flying');
        break;
      case 'land':
        setUavStatus('landing');
        setTimeout(() => setUavStatus('connected'), 3000);
        break;
      case 'return':
        setUavStatus('flying');
        break;
      default:
        break;
    }
  };

  return (
    <div className="app">
      {/* 火灾预警系统 - 全屏覆盖 */}
      {fireDetected && (
        <AlertSystem 
          level={alertLevel}
          onAcknowledge={handleAlertAcknowledge}
          fireLocation="北京市昌平区森林公园"
        />
      )}
      
      {/* 主要布局 */}
      <div className="app-layout">
        <Header 
          projectName="林瞰智守——无人机森林火灾智能监测领航者"
          uavStatus={uavStatus}
          alertLevel={alertLevel}
        />
        
        <div className="app-main">
          <Sidebar 
            activeView={activeView}
            onViewChange={setActiveView}
            uavData={uavData}
          />
          
          <main className="app-content">
            {activeView === 'dashboard' && (
              <div className="dashboard-view">
                <div className="dashboard-grid">
                  {/* 视频流区域 */}
                  <div className="video-section">
                    <VideoStreams uavStatus={uavStatus} />
                  </div>
                  
                  {/* 数据仪表盘 */}
                  <div className="data-section">
                    <DataDashboard uavData={uavData} />
                  </div>
                  
                  {/* 控制面板 */}
                  <div className="control-section">
                    <ControlPanel 
                      uavStatus={uavStatus}
                      onControl={handleUAVControl}
                      uavData={uavData}
                    />
                  </div>
                </div>
              </div>
            )}
            
            {activeView === 'map' && (
              <div className="map-view">
                <MapView 
                  uavData={uavData}
                  onPathPlan={(path) => console.log('Path planned:', path)}
                />
              </div>
            )}
            
            {activeView === 'control' && (
              <div className="control-view">
                <ControlPanel 
                  uavStatus={uavStatus}
                  onControl={handleUAVControl}
                  uavData={uavData}
                  fullscreen={true}
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;