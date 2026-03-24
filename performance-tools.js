/**
 * 性能优化配置和工具
 * 用于监控和提升游戏性能
 */

class PerformanceOptimizer {
    constructor() {
        this.fps = 0;
        this.frameCount = 0;
        this.lastFpsUpdate = 0;
        this.enabled = true;

        // 游戏对象池，用于减少垃圾回收
        this.objectPool = {
            vectors: [],
            tempObjects: []
        };

        console.log("🚀 性能优化器已初始化");
    }

    // 开始性能监测
    startMonitoring() {
        if (!this.enabled) return;

        this.monitorPerformance();
        console.log("📊 性能监测已启动");
    }

    // 性能监测主循环
    monitorPerformance() {
        if (!this.enabled) return;

        this.frameCount++;
        const now = performance.now();

        // 每秒更新一次FPS
        if (now - this.lastFpsUpdate >= 1000) {
            this.fps = Math.round((this.frameCount * 1000) / (now - this.lastFpsUpdate));
            this.frameCount = 0;
            this.lastFpsUpdate = now;

            // 输出性能信息
            this.reportPerformance();
        }

        // 继续监测
        requestAnimationFrame(() => this.monitorPerformance());
    }

    // 报告性能信息
    reportPerformance() {
        if (!this.enabled) return;

        const gameState = window.gameState || (window.FinalGameSystem && window.FinalGameSystem.getState());
        if (gameState) {
            const stats = {
                fps: this.fps,
                enemyCount: gameState.enemies ? gameState.enemies.length : 0,
                itemCount: gameState.items ? gameState.items.length : 0,
                gameTime: gameState.sessionTime || 0
            };

            console.log(`📈 性能统计: FPS=${stats.fps}, 敌人=${stats.enemyCount}, 物品=${stats.itemCount}, 游戏时间=${Math.round(stats.gameTime)}ms`);

            // 如果性能过低，发出警告
            if (this.fps < 30) {
                console.warn(`⚠️ 性能警告: FPS 过低 (${this.fps})`);
            }
        }
    }

    // 获取对象池中的向量对象
    getVector(x = 0, y = 0) {
        if (this.objectPool.vectors.length > 0) {
            const vector = this.objectPool.vectors.pop();
            vector.x = x;
            vector.y = y;
            return vector;
        }
        return { x, y };
    }

    // 释放向量对象回池中
    releaseVector(vector) {
        if (this.objectPool.vectors.length < 100) { // 限制池大小
            vector.x = 0;
            vector.y = 0;
            this.objectPool.vectors.push(vector);
        }
    }

    // 优化数组操作
    clearArray(array) {
        array.length = 0;
        return array;
    }

    // 优化的碰撞检测
    optimizedCollisionCheck(obj1, obj2, buffer = 0) {
        const dx = obj1.x - obj2.x;
        const dy = obj1.y - obj2.y;
        const distanceSquared = dx * dx + dy * dy;
        const radiusSum = (obj1.size || 10) / 2 + (obj2.size || 10) / 2 + buffer;

        return distanceSquared <= radiusSum * radiusSum;
    }

    // 启用/禁用性能优化
    toggle(enabled) {
        this.enabled = !!enabled;
        console.log(`⚙️ 性能优化: ${this.enabled ? '启用' : '禁用'}`);
    }

    // 优化渲染循环
    optimizedRender(renderCallback, targetFps = 60) {
        const frameTime = 1000 / targetFps;
        let lastRenderTime = 0;

        const render = (timestamp) => {
            if (!this.enabled) return;

            if (timestamp - lastRenderTime >= frameTime) {
                renderCallback(timestamp);
                lastRenderTime = timestamp;
            }

            requestAnimationFrame(render);
        };

        requestAnimationFrame(render);
    }

    // 内存清理
    cleanup() {
        // 清理对象池
        this.clearArray(this.objectPool.vectors);
        this.clearArray(this.objectPool.tempObjects);

        console.log("🧹 性能优化器已清理");
    }
}

// 创建全局性能优化器实例
window.PerformanceOptimizer = new PerformanceOptimizer();

// 自动启动性能监测
window.PerformanceOptimizer.startMonitoring();

console.log("✅ 性能优化工具加载完成");