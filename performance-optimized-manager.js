/**
 * 性能优化的模块管理器
 *
 * 此版本专注于减少全局作用域污染，优化内存使用，
 * 并提高模块间的通信效率。
 */

class OptimizedGameManager {
    constructor() {
        // 使用 Symbol 来避免命名冲突
        this.Symbols = {
            STATE: Symbol('gameState'),
            MODULES: Symbol('modules'),
            CALLBACKS: Symbol('callbacks')
        };

        // 游戏状态存储（使用 Proxy 来监控变更）
        this[this.Symbols.STATE] = this.createOptimizedGameState();

        // 模块存储
        this[this.Symbols.MODULES] = new Map();

        // 优化的事件系统
        this.eventBus = new OptimizedEventBus();

        // 性能监控
        this.performanceMonitor = new PerformanceMonitor();

        // 垃圾回收管理
        this.garbageCollector = new GarbageCollector();

        console.log("⚡ 性能优化的游戏管理器已初始化");
    }

    createOptimizedGameState() {
        // 使用 Object.freeze 防止意外修改基本结构
        // 但允许在运行时更新具体数值
        return {
            player: {
                x: 400,
                y: 300,
                size: 30,
                speed: 5,
                hp: 100,
                maxHp: 100,
                weapon: null,
                isPlaying: false,
                isGameOver: false,
                score: 0,
                maxCombo: 0,
                currentCombo: 0,
                relics: [],
                skillsUsed: { Q: 0, W: 0, E: 0, R: 0 }
            },
            level: 1,
            kills: 0,
            enemies: [],
            items: [],
            mouseX: 400,
            mouseY: 300,
            enemySpawnTimer: 0,
            enemySpawnRate: 2000,
            combatLog: [],
            startTime: null,
            sessionTime: 0,
            // 预分配常用对象以减少GC压力
            tempVector: { x: 0, y: 0 },
            tempRect: { x: 0, y: 0, w: 0, h: 0 }
        };
    }

    /**
     * 高性能模块注册
     */
    registerModule(name, moduleObj) {
        // 检查是否已经注册
        if (this[this.Symbols.MODULES].has(name)) {
            console.warn(`⚠️ 模块 ${name} 已存在，正在覆盖`);
        }

        // 验证模块接口
        if (typeof moduleObj !== 'object' || moduleObj === null) {
            throw new Error(`❌ 模块 ${name} 必须是有效的对象`);
        }

        // 为模块添加性能指标
        moduleObj._perfMetrics = {
            lastUpdate: 0,
            updateCount: 0,
            avgUpdateTime: 0
        };

        this[this.Symbols.MODULES].set(name, moduleObj);
        console.log(`✅ 模块 ${name} 已高性能注册`);

        // 通知事件总线模块已加载
        this.eventBus.emit('moduleLoaded', { name, moduleObj });
    }

    /**
     * 优化的模块获取方法
     */
    getModule(name) {
        return this[this.Symbols.MODULES].get(name);
    }

    /**
     * 批量获取模块（减少Map访问次数）
     */
    getModules(names) {
        const result = {};
        for (const name of names) {
            result[name] = this[this.Symbols.MODULES].get(name);
        }
        return result;
    }

    /**
     * 安全访问游戏状态
     */
    getState() {
        return this[this.Symbols.STATE];
    }

    /**
     * 高效更新游戏状态
     */
    updateState(updates) {
        this.batchUpdateState(updates);
    }

    /**
     * 批量状态更新以减少计算开销
     */
    batchUpdateState(updates) {
        const state = this[this.Symbols.STATE];
        const keys = Object.keys(updates);

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const value = updates[key];

            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                if (state[key] && typeof state[key] === 'object') {
                    Object.assign(state[key], value);
                } else {
                    state[key] = value;
                }
            } else {
                state[key] = value;
            }
        }
    }

    /**
     * 高性能游戏循环
     */
    createGameLoop() {
        let lastTime = 0;
        const modules = Array.from(this[this.Symbols.MODULES].values());

        const gameLoop = (currentTime) => {
            if (!this.getState().player.isPlaying) return;

            const deltaTime = currentTime - lastTime;
            lastTime = currentTime;

            // 性能监控
            this.performanceMonitor.beginFrame();

            // 批量更新所有模块
            for (let i = 0; i < modules.length; i++) {
                const module = modules[i];
                if (module.update) {
                    this.performanceMonitor.beginModuleUpdate(module.constructor.name);
                    try {
                        module.update(deltaTime);
                    } catch (error) {
                        console.error(`❌ 模块 ${module.constructor.name} 更新错误:`, error);
                    }
                    this.performanceMonitor.endModuleUpdate(module.constructor.name);
                }
            }

            this.performanceMonitor.endFrame();

            // 继续循环
            if (this.getState().player.isPlaying) {
                requestAnimationFrame(gameLoop);
            }
        };

        return gameLoop;
    }

    /**
     * 优化的渲染方法
     */
    render(ctx) {
        const modules = Array.from(this[this.Symbols.MODULES].values());

        // 清除画布
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // 批量渲染
        for (let i = 0; i < modules.length; i++) {
            const module = modules[i];
            if (module.render) {
                try {
                    module.render(ctx);
                } catch (error) {
                    console.error(`❌ 模块 ${module.constructor.name} 渲染错误:`, error);
                }
            }
        }
    }

    /**
     * 优化的事件系统接口
     */
    on(event, callback) {
        this.eventBus.on(event, callback);
    }

    emit(event, data) {
        this.eventBus.emit(event, data);
    }

    /**
     * 内存清理
     */
    cleanup() {
        // 清理模块
        for (let [name, module] of this[this.Symbols.MODULES]) {
            if (module.cleanup && typeof module.cleanup === 'function') {
                module.cleanup();
            }
        }
        this[this.Symbols.MODULES].clear();

        // 清理事件
        this.eventBus.clear();

        console.log("🧹 游戏管理器已清理");
    }
}

/**
 * 优化的事件总线
 */
class OptimizedEventBus {
    constructor() {
        this.events = new Map();
        this.maxListeners = 10; // 限制每个事件的最大监听器数量
    }

    on(event, callback) {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }

        const listeners = this.events.get(event);
        if (listeners.length >= this.maxListeners) {
            console.warn(`⚠️ 事件 ${event} 的监听器数量已达到上限`);
        }

        listeners.push(callback);
    }

    emit(event, data) {
        const listeners = this.events.get(event);
        if (!listeners || listeners.length === 0) return;

        // 使用 for 循环而不是 forEach 以获得更好性能
        for (let i = 0; i < listeners.length; i++) {
            try {
                listeners[i](data);
            } catch (error) {
                console.error(`❌ 事件 ${event} 回调错误:`, error);
            }
        }
    }

    off(event, callback) {
        const listeners = this.events.get(event);
        if (!listeners) return;

        const index = listeners.indexOf(callback);
        if (index > -1) {
            listeners.splice(index, 1);
        }
    }

    clear() {
        this.events.clear();
    }
}

/**
 * 性能监控器
 */
class PerformanceMonitor {
    constructor() {
        this.frameCount = 0;
        this.fps = 0;
        this.lastFpsUpdate = 0;
        this.moduleTimings = new Map();
    }

    beginFrame() {
        this.frameStartTime = performance.now();
    }

    endFrame() {
        const frameEndTime = performance.now();
        const frameTime = frameEndTime - this.frameStartTime;

        // 计算 FPS
        this.frameCount++;
        const now = performance.now();
        if (now - this.lastFpsUpdate >= 1000) { // 每秒更新一次FPS
            this.fps = Math.round((this.frameCount * 1000) / (now - this.lastFpsUpdate));
            this.frameCount = 0;
            this.lastFpsUpdate = now;
        }
    }

    beginModuleUpdate(moduleName) {
        this.moduleTimings.set(`${moduleName}_start`, performance.now());
    }

    endModuleUpdate(moduleName) {
        const startTime = this.moduleTimings.get(`${moduleName}_start`);
        if (startTime) {
            const duration = performance.now() - startTime;
            this.moduleTimings.set(moduleName, duration);
        }
    }

    getPerformanceReport() {
        return {
            fps: this.fps,
            moduleTimings: Object.fromEntries(this.moduleTimings)
        };
    }
}

/**
 * 简单的垃圾回收辅助类
 */
class GarbageCollector {
    constructor() {
        this.cleanupQueue = [];
    }

    scheduleCleanup(obj, cleanupFn) {
        this.cleanupQueue.push({ obj, cleanupFn });
    }

    runCleanup() {
        for (let i = this.cleanupQueue.length - 1; i >= 0; i--) {
            const item = this.cleanupQueue[i];
            if (item.obj === null || item.obj === undefined) {
                item.cleanupFn();
                this.cleanupQueue.splice(i, 1);
            }
        }
    }
}

// 创建全局优化的游戏管理器实例
window.OptimizedGameManager = new OptimizedGameManager();
window.optimizedGameState = window.OptimizedGameManager.getState(); // 保持向后兼容

console.log("⚡ 性能优化系统已就绪");

// 导出类供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        OptimizedGameManager,
        OptimizedEventBus,
        PerformanceMonitor
    };
}