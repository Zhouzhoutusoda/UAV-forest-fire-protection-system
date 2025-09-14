import React, { useState, useEffect, useRef } from 'react';
import './MapView.css';

const MapView = ({ uavData, onPathPlan }) => {
  const [mapMode, setMapMode] = useState('satellite'); // satellite, terrain, hybrid
  const [isDrawingPath, setIsDrawingPath] = useState(false);
  const [pathPoints, setPathPoints] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [showFireRisk, setShowFireRisk] = useState(true);
  const [showPatrolRoute, setShowPatrolRoute] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(15);
  const [centerPosition, setCenterPosition] = useState({
    lat: uavData.coordinates.lat,
    lng: uavData.coordinates.lng
  });

  const mapRef = useRef(null);

  // 模拟火险区域数据
  const fireRiskAreas = [
    {
      id: 1,
      center: { lat: 39.905, lng: 116.408 },
      radius: 500,
      risk: 'high',
      description: '干燥林区，火险等级：高'
    },
    {
      id: 2,
      center: { lat: 39.902, lng: 116.412 },
      radius: 300,
      risk: 'medium',
      description: '混合林区，火险等级：中'
    },
    {
      id: 3,
      center: { lat: 39.908, lng: 116.405 },
      radius: 200,
      risk: 'low',
      description: '湿润林区，火险等级：低'
    }
  ];

  // 预设巡逻路线
  const patrolRoutes = [
    {
      id: 1,
      name: '北区巡逻路线',
      points: [
        { lat: 39.906, lng: 116.404 },
        { lat: 39.908, lng: 116.406 },
        { lat: 39.907, lng: 116.409 },
        { lat: 39.905, lng: 116.407 }
      ],
      status: 'active'
    },
    {
      id: 2,
      name: '南区巡逻路线',
      points: [
        { lat: 39.901, lng: 116.405 },
        { lat: 39.899, lng: 116.407 },
        { lat: 39.900, lng: 116.410 },
        { lat: 39.902, lng: 116.408 }
      ],
      status: 'planned'
    }
  ];

  const handleMapClick = (event) => {
    if (!isDrawingPath) return;
    
    const rect = mapRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // 转换为地理坐标（简化计算）
    const lat = centerPosition.lat - ((y - rect.height / 2) / rect.height) * 0.01;
    const lng = centerPosition.lng + ((x - rect.width / 2) / rect.width) * 0.01;
    
    const newPoint = { lat, lng, id: Date.now() };
    setPathPoints(prev => [...prev, newPoint]);
  };

  const handleStartDrawing = () => {
    setIsDrawingPath(true);
    setPathPoints([]);
    console.log('开始绘制飞行路径');
  };

  const handleFinishDrawing = () => {
    if (pathPoints.length < 2) {
      alert('至少需要两个点才能形成路径！');
      return;
    }
    
    setIsDrawingPath(false);
    onPathPlan(pathPoints);
    console.log('路径规划完成:', pathPoints);
    alert(`路径规划完成！共包含 ${pathPoints.length} 个路径点。`);
  };

  const handleClearPath = () => {
    setPathPoints([]);
    setIsDrawingPath(false);
  };

  const handlePresetRoute = (route) => {
    setPathPoints(route.points.map((point, index) => ({ ...point, id: index })));
    onPathPlan(route.points);
    console.log(`应用预设路线: ${route.name}`);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 1, 20));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 1, 1));
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#22c55e';
      default: return '#6b7280';
    }
  };

  const getRouteColor = (status) => {
    switch (status) {
      case 'active': return '#3b82f6';
      case 'planned': return '#8b5cf6';
      case 'completed': return '#10b981';
      default: return '#6b7280';
    }
  };

  // 模拟地图瓦片
  const renderMapTiles = () => {
    const tiles = [];
    const tileSize = 100; // px
    const tilesX = Math.ceil(800 / tileSize);
    const tilesY = Math.ceil(600 / tileSize);

    for (let x = 0; x < tilesX; x++) {
      for (let y = 0; y < tilesY; y++) {
        tiles.push(
          <div
            key={`tile-${x}-${y}`}
            className={`map-tile ${mapMode}`}
            style={{
              left: x * tileSize,
              top: y * tileSize,
              width: tileSize,
              height: tileSize
            }}
          />
        );
      }
    }
    return tiles;
  };

  return (
    <div className="map-view">
      {/* 地图控制工具栏 */}
      <div className="map-toolbar">
        <div className="map-tools-left">
          <div className="map-mode-selector">
            <button
              className={`mode-btn ${mapMode === 'satellite' ? 'active' : ''}`}
              onClick={() => setMapMode('satellite')}
            >
              🛰️ 卫星
            </button>
            <button
              className={`mode-btn ${mapMode === 'terrain' ? 'active' : ''}`}
              onClick={() => setMapMode('terrain')}
            >
              🏔️ 地形
            </button>
            <button
              className={`mode-btn ${mapMode === 'hybrid' ? 'active' : ''}`}
              onClick={() => setMapMode('hybrid')}
            >
              🗺️ 混合
            </button>
          </div>

          <div className="path-tools">
            {!isDrawingPath ? (
              <button className="tool-btn primary" onClick={handleStartDrawing}>
                ✏️ 绘制路径
              </button>
            ) : (
              <div className="drawing-tools">
                <button className="tool-btn success" onClick={handleFinishDrawing}>
                  ✅ 完成
                </button>
                <button className="tool-btn secondary" onClick={handleClearPath}>
                  🗑️ 清除
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="map-tools-right">
          <div className="layer-controls">
            <label className="layer-toggle">
              <input
                type="checkbox"
                checked={showFireRisk}
                onChange={(e) => setShowFireRisk(e.target.checked)}
              />
              <span>火险区域</span>
            </label>
            <label className="layer-toggle">
              <input
                type="checkbox"
                checked={showPatrolRoute}
                onChange={(e) => setShowPatrolRoute(e.target.checked)}
              />
              <span>巡逻路线</span>
            </label>
          </div>

          <div className="zoom-controls">
            <button className="zoom-btn" onClick={handleZoomIn}>+</button>
            <span className="zoom-level">{zoomLevel}</span>
            <button className="zoom-btn" onClick={handleZoomOut}>-</button>
          </div>
        </div>
      </div>

      {/* 主地图区域 */}
      <div 
        className="map-container"
        ref={mapRef}
        onClick={handleMapClick}
        style={{ cursor: isDrawingPath ? 'crosshair' : 'grab' }}
      >
        {/* 地图瓦片背景 */}
        <div className="map-tiles">
          {renderMapTiles()}
        </div>

        {/* 无人机位置标记 */}
        <div
          className="uav-marker"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="uav-icon">🚁</div>
          <div className="uav-info">
            <div className="uav-label">无人机位置</div>
            <div className="uav-coords">
              {uavData.coordinates.lat.toFixed(4)}, {uavData.coordinates.lng.toFixed(4)}
            </div>
          </div>
        </div>

        {/* 火险区域叠加 */}
        {showFireRisk && fireRiskAreas.map((area) => (
          <div
            key={area.id}
            className={`risk-area risk-${area.risk}`}
            style={{
              left: `${45 + area.id * 15}%`,
              top: `${30 + area.id * 20}%`,
              width: `${area.radius / 20}px`,
              height: `${area.radius / 20}px`,
              backgroundColor: getRiskColor(area.risk),
              opacity: 0.3,
              border: `2px solid ${getRiskColor(area.risk)}`,
              borderRadius: '50%',
              position: 'absolute',
              transform: 'translate(-50%, -50%)'
            }}
            title={area.description}
          >
            <div className="risk-label">
              {area.risk === 'high' ? '高' : area.risk === 'medium' ? '中' : '低'}
            </div>
          </div>
        ))}

        {/* 预设巡逻路线 */}
        {showPatrolRoute && patrolRoutes.map((route) => (
          <div key={route.id} className="patrol-route">
            {route.points.map((point, index) => (
              <div key={index}>
                <div
                  className="route-point"
                  style={{
                    left: `${20 + route.id * 40 + index * 5}%`,
                    top: `${60 + index * 8}%`,
                    backgroundColor: getRouteColor(route.status),
                    position: 'absolute',
                    transform: 'translate(-50%, -50%)'
                  }}
                />
                {index < route.points.length - 1 && (
                  <div
                    className="route-line"
                    style={{
                      left: `${20 + route.id * 40 + index * 5}%`,
                      top: `${60 + index * 8}%`,
                      width: `${Math.sqrt(25 + 64)}px`,
                      backgroundColor: getRouteColor(route.status),
                      position: 'absolute',
                      transform: 'translate(-50%, -50%) rotate(68deg)',
                      transformOrigin: '0 50%'
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        ))}

        {/* 用户绘制的路径 */}
        {pathPoints.length > 0 && (
          <div className="user-path">
            {pathPoints.map((point, index) => (
              <div key={point.id}>
                <div
                  className="path-point user-point"
                  style={{
                    left: `${50 + (point.lng - centerPosition.lng) * 1000}%`,
                    top: `${50 - (point.lat - centerPosition.lat) * 1000}%`,
                    position: 'absolute',
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <span className="point-number">{index + 1}</span>
                </div>
                {index > 0 && (
                  <div
                    className="path-line user-line"
                    style={{
                      left: `${50 + (pathPoints[index - 1].lng - centerPosition.lng) * 1000}%`,
                      top: `${50 - (pathPoints[index - 1].lat - centerPosition.lat) * 1000}%`,
                      width: `${Math.sqrt(
                        Math.pow((point.lng - pathPoints[index - 1].lng) * 1000, 2) +
                        Math.pow((point.lat - pathPoints[index - 1].lat) * 1000, 2)
                      ) * 10}px`,
                      position: 'absolute',
                      transform: `translate(-50%, -50%) rotate(${
                        Math.atan2(
                          -(point.lat - pathPoints[index - 1].lat) * 1000,
                          (point.lng - pathPoints[index - 1].lng) * 1000
                        ) * 180 / Math.PI
                      }deg)`,
                      transformOrigin: '0 50%'
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* 绘制提示 */}
        {isDrawingPath && (
          <div className="drawing-hint">
            <div className="hint-content">
              🖱️ 点击地图添加路径点 ({pathPoints.length} 个点)
            </div>
          </div>
        )}
      </div>

      {/* 地图信息面板 */}
      <div className="map-info-panel">
        <div className="info-section">
          <h3>预设路线</h3>
          <div className="route-list">
            {patrolRoutes.map((route) => (
              <div key={route.id} className="route-item">
                <div className="route-info">
                  <span className="route-name">{route.name}</span>
                  <span className={`route-status ${route.status}`}>
                    {route.status === 'active' ? '进行中' : '计划中'}
                  </span>
                </div>
                <button
                  className="apply-route-btn"
                  onClick={() => handlePresetRoute(route)}
                >
                  应用
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="info-section">
          <h3>飞行信息</h3>
          <div className="flight-stats">
            <div className="stat-item">
              <span className="stat-label">当前高度:</span>
              <span className="stat-value">{Math.round(uavData.altitude)}m</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">飞行速度:</span>
              <span className="stat-value">{Math.round(uavData.speed)}km/h</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">电池电量:</span>
              <span className="stat-value">{Math.round(uavData.battery)}%</span>
            </div>
            {pathPoints.length > 0 && (
              <div className="stat-item">
                <span className="stat-label">路径点数:</span>
                <span className="stat-value">{pathPoints.length}</span>
              </div>
            )}
          </div>
        </div>

        <div className="info-section">
          <h3>图例</h3>
          <div className="legend">
            <div className="legend-item">
              <div className="legend-icon uav-legend">🚁</div>
              <span>无人机位置</span>
            </div>
            <div className="legend-item">
              <div className="legend-icon" style={{backgroundColor: '#ef4444'}}></div>
              <span>高火险区</span>
            </div>
            <div className="legend-item">
              <div className="legend-icon" style={{backgroundColor: '#f59e0b'}}></div>
              <span>中火险区</span>
            </div>
            <div className="legend-item">
              <div className="legend-icon" style={{backgroundColor: '#22c55e'}}></div>
              <span>低火险区</span>
            </div>
            <div className="legend-item">
              <div className="legend-icon" style={{backgroundColor: '#3b82f6'}}></div>
              <span>巡逻路线</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;