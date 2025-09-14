# 林瞰智守——无人机森林火灾智能监测领航者

一个基于React的无人机森林火灾监测系统前端应用，提供实时监控、路径规划、火灾预警等功能。

## 🚀 主要功能

### 🔥 火灾预警系统
- **实时火灾检测**: 基于AI算法的实时火灾识别
- **紧急预警界面**: 全屏火灾警报，支持多级预警
- **应急响应**: 一键联系消防部门、启动疏散程序

### 📹 双视频流监控
- **可见光相机**: 高清实时视频流，支持目标检测
- **红外热成像**: 温度可视化，火点识别
- **录制功能**: 支持视频录制和快照保存
- **多屏显示**: 可见光/红外/双屏模式

### 🎮 智能飞行控制
- **一键操作**: 起飞、降落、返航、紧急停止
- **飞行模式**: 悬停、跟踪、巡逻、返航模式
- **参数设置**: 实时调节飞行速度和高度
- **状态监控**: 电池、GPS、通信状态实时显示

### 🗺️ 智能路径规划
- **交互式地图**: 支持卫星、地形、混合视图
- **路径绘制**: 鼠标点击绘制飞行轨迹
- **预设路线**: 多条预设巡逻路线
- **火险区域**: 高、中、低火险区域标注

### 📊 数据分析仪表盘
- **实时监控**: 电池、GPS、高度、温度等关键指标
- **历史数据**: 趋势图表，数据可视化
- **系统健康**: 各模块健康状态监控
- **智能警报**: 异常情况自动提醒

## 🛠️ 技术栈

- **前端框架**: React 18
- **样式**: CSS3 + 自定义设计系统
- **图标**: 原生Emoji + Lucide React
- **地图**: Leaflet + React Leaflet
- **图表**: Recharts
- **构建工具**: Create React App

## 📦 安装和运行

### 环境要求
- Node.js >= 14.0.0
- npm >= 6.0.0

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm start
```

应用将在 [http://localhost:3000](http://localhost:3000) 开启

### 构建生产版本
```bash
npm run build
```

## 📂 项目结构

```
src/
├── components/              # 组件目录
│   ├── AlertSystem/        # 火灾预警系统
│   ├── VideoStreams/       # 视频流组件
│   ├── ControlPanel/       # 控制面板
│   ├── MapView/           # 地图视图
│   ├── DataDashboard/     # 数据仪表盘
│   ├── Header/            # 头部组件
│   └── Sidebar/           # 侧边栏
├── App.js                 # 主应用组件
├── App.css               # 主应用样式
├── index.js              # 入口文件
└── index.css             # 全局样式
```

## 🎨 界面特性

### 🌈 现代化设计
- **渐变背景**: 蓝紫色渐变，科技感十足
- **毛玻璃效果**: backdrop-filter模糊效果
- **响应式布局**: 适配桌面、平板、手机
- **动画效果**: 丰富的交互动画

### 🎯 用户体验
- **直观操作**: 清晰的图标和按钮设计
- **实时反馈**: 操作状态即时显示
- **多级导航**: 侧边栏+主内容区布局
- **快捷键**: 支持键盘快捷操作

### 🚨 预警系统
- **全屏警报**: 检测到火灾时全屏显示
- **视觉冲击**: 红色闪烁、粒子效果
- **音频警报**: 紧急情况下播放警报声
- **应急按钮**: 快速处置按钮

## 🔧 自定义配置

### 修改无人机连接地址
在 `src/App.js` 中修改WebSocket连接地址：

```javascript
// 连接无人机
const connectToUAV = () => {
  const socket = new WebSocket('ws://your-uav-ip:port');
  // ... 连接逻辑
};
```

### 自定义地图图层
在 `src/components/MapView/MapView.js` 中添加地图图层：

```javascript
const customTileLayer = {
  url: 'https://your-tile-server/{z}/{x}/{y}.png',
  attribution: 'Your Attribution'
};
```

### 添加传感器数据
在 `src/components/DataDashboard/DataDashboard.js` 中添加新的传感器：

```javascript
const sensorData = {
  // 添加新传感器
  windSpeed: uavData.windSpeed,
  airQuality: uavData.airQuality
};
```

## 🌟 核心亮点

1. **专业的森林防火场景**: 针对森林火灾监测优化的UI/UX设计
2. **完整的监控体系**: 从数据采集到预警响应的全流程覆盖
3. **智能化操作**: AI辅助的目标检测和路径规划
4. **可扩展架构**: 模块化设计，易于添加新功能
5. **移动端适配**: 响应式设计，支持平板和手机操作

## 📱 兼容性

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ 移动端浏览器

## 🚀 部署建议

### 生产环境优化
1. 启用gzip压缩
2. 使用CDN加速静态资源
3. 配置HTTPS证书
4. 设置适当的缓存策略

### 性能监控
建议集成以下工具：
- Google Analytics
- Sentry错误监控
- Performance监控

## 🔒 安全考虑

1. **数据加密**: 敏感数据传输加密
2. **访问控制**: 用户权限管理
3. **输入验证**: 防止XSS和注入攻击
4. **HTTPS**: 强制使用安全连接

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

## 📞 联系方式

- 项目维护者: 林瞰智守团队
- 邮箱: contact@forest-guard.com
- 官网: https://forest-guard.com

---

🌲 **林瞰智守** - 用科技守护绿色家园 🌲