import React, { useState, useEffect, useRef } from 'react';
import './VideoStreams.css';

const VideoStreams = ({ uavStatus }) => {
  const [activeStream, setActiveStream] = useState('visible'); // visible, thermal, split
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [streamQuality, setStreamQuality] = useState('high'); // high, medium, low
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [detectionMode, setDetectionMode] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState([]);

  const visibleVideoRef = useRef(null);
  const thermalVideoRef = useRef(null);

  // 模拟录制计时器
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // 模拟目标检测
  useEffect(() => {
    if (detectionMode) {
      const interval = setInterval(() => {
        // 随机生成检测到的目标
        const objects = [];
        if (Math.random() < 0.3) {
          objects.push({
            id: 1,
            type: 'smoke',
            confidence: 85 + Math.random() * 10,
            x: Math.random() * 80 + 10,
            y: Math.random() * 60 + 20
          });
        }
        if (Math.random() < 0.2) {
          objects.push({
            id: 2,
            type: 'fire',
            confidence: 75 + Math.random() * 20,
            x: Math.random() * 80 + 10,
            y: Math.random() * 60 + 20
          });
        }
        if (Math.random() < 0.4) {
          objects.push({
            id: 3,
            type: 'vehicle',
            confidence: 90 + Math.random() * 10,
            x: Math.random() * 80 + 10,
            y: Math.random() * 60 + 20
          });
        }
        setDetectedObjects(objects);
      }, 2000);

      return () => clearInterval(interval);
    } else {
      setDetectedObjects([]);
    }
  }, [detectionMode]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    console.log('开始录制视频');
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    console.log(`录制结束，时长: ${formatTime(recordingTime)}`);
    alert(`视频录制完成！时长: ${formatTime(recordingTime)}`);
  };

  const handleTakeSnapshot = () => {
    console.log('拍摄快照');
    alert('快照已保存！');
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const toggleDetection = () => {
    setDetectionMode(!detectionMode);
    console.log(`目标检测: ${!detectionMode ? '开启' : '关闭'}`);
  };

  const getObjectTypeLabel = (type) => {
    switch (type) {
      case 'smoke': return '烟雾';
      case 'fire': return '火焰';
      case 'vehicle': return '车辆';
      default: return '未知';
    }
  };

  const getObjectColor = (type) => {
    switch (type) {
      case 'smoke': return '#f59e0b';
      case 'fire': return '#ef4444';
      case 'vehicle': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <div className={`video-streams ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="video-header">
        <div className="stream-tabs">
          <button
            className={`stream-tab ${activeStream === 'visible' ? 'active' : ''}`}
            onClick={() => setActiveStream('visible')}
          >
            📹 可见光相机
          </button>
          <button
            className={`stream-tab ${activeStream === 'thermal' ? 'active' : ''}`}
            onClick={() => setActiveStream('thermal')}
          >
            🌡️ 红外相机
          </button>
          <button
            className={`stream-tab ${activeStream === 'split' ? 'active' : ''}`}
            onClick={() => setActiveStream('split')}
          >
            🔄 双屏模式
          </button>
        </div>

        <div className="stream-controls">
          <div className="quality-selector">
            <select 
              value={streamQuality} 
              onChange={(e) => setStreamQuality(e.target.value)}
              className="quality-select"
            >
              <option value="high">高清 (1080p)</option>
              <option value="medium">标清 (720p)</option>
              <option value="low">流畅 (480p)</option>
            </select>
          </div>
          
          <button
            className={`control-btn ${detectionMode ? 'active' : ''}`}
            onClick={toggleDetection}
            title="目标检测"
          >
            🎯
          </button>
          
          <button
            className="control-btn"
            onClick={toggleFullscreen}
            title="全屏"
          >
            🔳
          </button>
        </div>
      </div>

      <div className="video-content">
        {/* 可见光视频流 */}
        {(activeStream === 'visible' || activeStream === 'split') && (
          <div className={`video-panel ${activeStream === 'split' ? 'split-mode' : ''}`}>
            <div className="video-container">
              <div className="video-wrapper">
                {uavStatus === 'connected' || uavStatus === 'flying' ? (
                  <div className="video-placeholder visible-light">
                    <div className="video-overlay">
                      {/* 检测结果叠加 */}
                      {detectionMode && detectedObjects.map(obj => (
                        <div
                          key={obj.id}
                          className="detection-box"
                          style={{
                            left: `${obj.x}%`,
                            top: `${obj.y}%`,
                            borderColor: getObjectColor(obj.type)
                          }}
                        >
                          <span className="detection-label" style={{color: getObjectColor(obj.type)}}>
                            {getObjectTypeLabel(obj.type)} ({Math.round(obj.confidence)}%)
                          </span>
                        </div>
                      ))}
                      
                      {/* 十字瞄准线 */}
                      <div className="crosshair">
                        <div className="crosshair-line horizontal"></div>
                        <div className="crosshair-line vertical"></div>
                      </div>
                      
                      {/* 视频信息叠加 */}
                      <div className="video-info-overlay">
                        <div className="video-timestamp">
                          {new Date().toLocaleTimeString('zh-CN')}
                        </div>
                        <div className="video-status">
                          <span className="status-dot online"></span>
                          可见光 - {streamQuality.toUpperCase()}
                        </div>
                      </div>
                    </div>
                    
                    {/* 模拟视频内容 */}
                    <div className="simulated-video">
                      <div className="landscape">
                        <div className="trees"></div>
                        <div className="sky"></div>
                        {detectedObjects.some(obj => obj.type === 'fire') && (
                          <div className="fire-simulation"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="video-offline">
                    <div className="offline-icon">📵</div>
                    <p>可见光相机离线</p>
                  </div>
                )}
              </div>
              
              {activeStream === 'visible' && (
                <div className="video-title">
                  📹 可见光相机视频流
                </div>
              )}
            </div>
          </div>
        )}

        {/* 红外视频流 */}
        {(activeStream === 'thermal' || activeStream === 'split') && (
          <div className={`video-panel ${activeStream === 'split' ? 'split-mode' : ''}`}>
            <div className="video-container">
              <div className="video-wrapper">
                {uavStatus === 'connected' || uavStatus === 'flying' ? (
                  <div className="video-placeholder thermal">
                    <div className="video-overlay">
                      {/* 温度刻度条 */}
                      <div className="temperature-scale">
                        <div className="temp-gradient">
                          <div className="temp-label high">80°C</div>
                          <div className="temp-label medium">40°C</div>
                          <div className="temp-label low">0°C</div>
                        </div>
                      </div>
                      
                      {/* 十字瞄准线 */}
                      <div className="crosshair thermal">
                        <div className="crosshair-line horizontal"></div>
                        <div className="crosshair-line vertical"></div>
                        <div className="center-temp">25.6°C</div>
                      </div>
                      
                      {/* 视频信息叠加 */}
                      <div className="video-info-overlay">
                        <div className="video-timestamp">
                          {new Date().toLocaleTimeString('zh-CN')}
                        </div>
                        <div className="video-status">
                          <span className="status-dot online"></span>
                          红外 - {streamQuality.toUpperCase()}
                        </div>
                      </div>
                    </div>
                    
                    {/* 模拟红外视频内容 */}
                    <div className="thermal-video">
                      <div className="thermal-landscape">
                        <div className="thermal-background"></div>
                        {detectedObjects.some(obj => obj.type === 'fire') && (
                          <div className="thermal-hotspot"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="video-offline">
                    <div className="offline-icon">📵</div>
                    <p>红外相机离线</p>
                  </div>
                )}
              </div>
              
              {activeStream === 'thermal' && (
                <div className="video-title">
                  🌡️ 红外相机视频流
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 录制和控制按钮 */}
      <div className="video-controls">
        <div className="recording-controls">
          {!isRecording ? (
            <button className="control-btn record" onClick={handleStartRecording}>
              🔴 开始录制
            </button>
          ) : (
            <div className="recording-info">
              <button className="control-btn stop" onClick={handleStopRecording}>
                ⏹️ 停止录制
              </button>
              <span className="recording-time">
                🔴 {formatTime(recordingTime)}
              </span>
            </div>
          )}
          
          <button className="control-btn snapshot" onClick={handleTakeSnapshot}>
            📸 拍照
          </button>
        </div>

        {/* 检测统计 */}
        {detectionMode && detectedObjects.length > 0 && (
          <div className="detection-stats">
            <h4>检测结果:</h4>
            <div className="detection-list">
              {detectedObjects.map(obj => (
                <span key={obj.id} className="detection-item" style={{color: getObjectColor(obj.type)}}>
                  {getObjectTypeLabel(obj.type)} ({Math.round(obj.confidence)}%)
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoStreams;