# game-rogue 重构计划

## 概述
当前项目存在 68 个 JS 模块，导致依赖冲突和性能问题。本计划旨在通过系统性重构解决这些问题。

## 重构目标
1. 解决模块间的依赖冲突
2. 减少 JS 文件数量（目标：15-20个核心模块）
3. 保持核心玩法功能不变
4. 提升性能和稳定性
5. 为 Steam 发布做准备

## 重构策略：渐进式重构

### 阶段 1：模块分析和清理 (1-2天)
- [x] 分析所有 68 个 JS 文件
- [x] 识别依赖关系和冲突点
- [x] 制定合并计划

### 阶段 2：核心系统合并 (3-5天)
- [ ] 合并存档系统（save-system.js, enhanced-save-system.js 等）
- [ ] 合并成就系统（achievement-system.js, enhanced-achievements.js 等）
- [ ] 合并音频系统（audio-system.js, enhanced-audio.js 等）
- [ ] 合并菜单系统相关模块

### 阶段 3：功能验证 (1-2天)
- [ ] 确保核心玩法正常
- [ ] 测试各项系统功能
- [ ] 性能基准测试

## 具体合并计划

### 1. 存档系统合并
- **源文件**: save-system.js, enhanced-save-system.js, steam-enhancement.js
- **目标文件**: unified-save-system.js
- **功能**:
  - 基础存档功能
  - 扩展统计功能
  - Steam 云存档接口

### 2. 成就系统合并
- **源文件**: achievement-system.js, enhanced-achievements.js, steam-achievement-system.js
- **目标文件**: unified-achievement-system.js
- **功能**:
  - 成就定义和追踪
  - Steam 成就接口
  - 成就 UI 管理

### 3. 音频系统合并
- **源文件**: audio-system.js, enhanced-audio.js, steam-audio-system.js
- **目标文件**: unified-audio-system.js
- **功能**:
  - 音效播放
  - 背景音乐管理
  - 音量控制

### 4. 菜单系统合并
- **源文件**: menu-system.js, enhanced-menu.js, tutorial-system.js
- **目标文件**: unified-menu-system.js
- **功能**:
  - 主菜单
  - 暂停菜单
  - 设置菜单
  - 教程系统

## 实施步骤

### 第1步：创建合并系统
1. 创建 unified-save-system.js
2. 迁移所有存档相关功能
3. 确保向后兼容
4. 测试存档功能

### 第2步：更新 index.html
1. 替换旧的 JS 引用
2. 添加新的统一系统引用
3. 确保加载顺序正确

### 第3步：重复步骤1-2
依次处理其他系统（成就、音频、菜单等）

## 风险控制
- 每次合并后都要测试核心玩法
- 保持向后兼容性
- 保留备份版本
- 逐步部署，避免一次性大改动

## 预期结果
- JS 文件数量：68 → 15-20
- 性能提升：减少 HTTP 请求和内存占用
- 稳定性提升：消除模块冲突
- 可维护性提升：清晰的模块结构