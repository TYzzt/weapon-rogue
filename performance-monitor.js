/**
 * 性能监控模块
 * 用于监控和优化游戏性能
 */

class PerformanceMonitor {
    constructor() {
        this.metrics = {
            frameRate: 0,
            frameCount: 0,
            lastTimestamp: performance.now(),
            lastFpsUpdate: performance.now(),
            frameTimes: [],
            slowFrameThreshold: 100, // 慢帧阈值(毫秒)
            longestFrameTime: 0
        };

        this.modulesPerformance = new Map(); // 各模块性能数据

        console.log('📊 性能监控器已初始化');
    }

    /**
     * 开始新的一帧
     */
    startFrame() {
        const now = performance.now();
        this.metrics.frameCount++;

        // 计算帧时间
        const frameTime = now - this.metrics.lastTimestamp;
        this.metrics.lastTimestamp = now;

        // 记录最长帧时间
        if (frameTime > this.metrics.longestFrameTime) {
            this.metrics.longestFrameTime = frameTime;
        }

        // 保存最近的帧时间用于平均计算
        this.metrics.frameTimes.push(frameTime);
        if (this.metrics.frameTimes.length > 60) {
            this.metrics.frameTimes.shift();
        }

        // 更新FPS（每秒更新一次）
        if (now - this.metrics.lastFpsUpdate >= 1000) {
            const recentFrames = this.metrics.frameTimes.slice(-30);
            const avgFrameTime = recentFrames.reduce((a, b) => a + b, 0) / recentFrames.length;
            this.metrics.frameRate = avgFrameTime ? Math.round(1000 / avgFrameTime) : 0;
            this.metrics.lastFpsUpdate = now;
        }

        return now;
    }

    /**
     * 开始测量模块性能
     */
    startModuleMeasurement(moduleName) {
        if (!this.modulesPerformance.has(moduleName)) {
            this.modulesPerformance.set(moduleName, {
                totalTime: 0,
                callCount: 0,
                avgTime: 0,
                maxTime: 0
            });
        }

        return performance.now();
    }

    /**
     * 结束测量模块性能
     */
    endModuleMeasurement(moduleName, startTime) {
        const now = performance.now();
        const duration = now - startTime;
        const moduleMetrics = this.modulesPerformance.get(moduleName);

        if (moduleMetrics) {
            moduleMetrics.totalTime += duration;
            moduleMetrics.callCount++;
            moduleMetrics.avgTime = moduleMetrics.totalTime / moduleMetrics.callCount;

            if (duration > moduleMetrics.maxTime) {
                moduleMetrics.maxTime = duration;
            }
        }

        return duration;
    }

    /**
     * 获取性能报告
     */
    getReport() {
        const moduleReports = {};
        for (let [moduleName, metrics] of this.modulesPerformance) {
            moduleReports[moduleName] = {
                avgTime: parseFloat(metrics.avgTime.toFixed(3)),
                maxTime: parseFloat(metrics.maxTime.toFixed(3)),
                callCount: metrics.callCount
            };
        }

        return {
            frameRate: this.metrics.frameRate,
            avgFrameTime: this.metrics.frameTimes.length ?
                parseFloat((this.metrics.frameTimes.reduce((a, b) => a + b, 0) / this.metrics.frameTimes.length).toFixed(2)) : 0,
            longestFrameTime: parseFloat(this.metrics.longestFrameTime.toFixed(2)),
            frameCount: this.metrics.frameCount,
            modules: moduleReports
        };
    }

    /**
     * 重置性能数据
     */
    reset() {
        this.metrics.frameRate = 0;
        this.metrics.frameCount = 0;
        this.metrics.lastTimestamp = performance.now();
        this.metrics.lastFpsUpdate = performance.now();
        this.metrics.frameTimes = [];
        this.metrics.longestFrameTime = 0;
        this.modulesPerformance.clear();
    }
}

// 集成到统一游戏系统中
if (window.RogueGame) {
    // 添加性能监控到游戏系统
    window.RogueGame.performanceMonitor = new PerformanceMonitor();

    // 修改游戏循环以包含性能监控
    const originalGameLoop = window.RogueGame.gameLoop;
    window.RogueGame.gameLoop = function() {
        if (!this.state.player.isPlaying || this.state.player.isGameOver) return;

        const frameStartTime = this.performanceMonitor.startFrame();

        const currentTime = Date.now();
        const deltaTime = currentTime - (this.lastFrameTime || currentTime);
        this.lastFrameTime = currentTime;

        // 更新所有模块
        for (let moduleName in this.modules) {
            const module = this.modules[moduleName];
            if (module.update) {
                const moduleStartTime = this.performanceMonitor.startModuleMeasurement(moduleName);
                module.update(deltaTime, this.state);
                this.performanceMonitor.endModuleMeasurement(moduleName, moduleStartTime);
            }
        }

        // 绘制游戏画面
        this.render();

        // 继续下一帧
        requestAnimationFrame(() => this.gameLoop());
    };

    // 性能报告函数
    window.RogueGame.reportPerformance = function() {
        const report = this.performanceMonitor.getReport();
        console.table(report.modules);
        console.log(`📊 当前FPS: ${report.frameRate}, 平均帧时间: ${report.avgFrameTime}ms`);
        return report;
    };
}

console.log('🔄 性能监控系统已集成');