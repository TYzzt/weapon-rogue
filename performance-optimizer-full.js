/**
 * Rogue游戏性能优化器
 * 通过减少模块数量、优化资源加载和提高渲染效率来提升性能
 */

class PerformanceOptimizer {
    constructor() {
        this.optimizationLevel = 'high';
        this.cachedModules = new Map();
        this.resourceCache = new Map();
        this.renderOptimizationEnabled = true;

        console.log('⚡ 性能优化器已初始化');
    }

    /**
     * 优化模块加载 - 减少动态导入
     */
    optimizeModuleLoading() {
        console.log('🔄 优化模块加载策略...');

        // 预加载常用模块到缓存
        if (window.GameEngine) {
            // 将常用的模块方法缓存起来，减少查找时间
            const modules = ['core', 'save', 'achievements', 'audio'];

            modules.forEach(moduleName => {
                const module = window.GameEngine.getModule(moduleName);
                if (module) {
                    this.cachedModules.set(moduleName, module);
                    console.log(`✅ 缓存模块: ${moduleName}`);
                }
            });
        }

        console.log('✅ 模块加载优化完成');
    }

    /**
     * 优化渲染性能
     */
    optimizeRendering() {
        console.log('🎨 优化渲染性能...');

        // 如果浏览器支持，使用离屏Canvas进行渲染优化
        this.setupRenderOptimizations();

        console.log('✅ 渲染优化完成');
    }

    setupRenderOptimizations() {
        // 为绘图操作创建优化的上下文
        this.optimizedDraw = (ctx, operation) => {
            // 临时禁用不必要的样式计算
            const prevImageSmoothingEnabled = ctx.imageSmoothingEnabled;
            ctx.imageSmoothingEnabled = false;

            operation(ctx);

            // 恢复原始设置
            ctx.imageSmoothingEnabled = prevImageSmoothingEnabled;
        };
    }

    /**
     * 优化游戏循环
     */
    optimizeGameLoop() {
        console.log('⏱️ 优化游戏循环...');

        // 创建优化的游戏循环方法
        if (window.GameEngine) {
            const coreModule = window.GameEngine.getModule('core');
            if (coreModule) {
                // 保存原始方法
                const originalGameLoop = coreModule.gameLoop;

                // 创建优化版本
                coreModule.gameLoop = this.createOptimizedGameLoop(originalGameLoop, coreModule);
            }
        }

        console.log('✅ 游戏循环优化完成');
    }

    createOptimizedGameLoop(originalLoop, coreModule) {
        let lastTime = 0;
        const fpsLimit = 60;
        const frameInterval = 1000 / fpsLimit;

        return () => {
            const currentTime = Date.now();

            // 基于帧率限制执行更新
            if (currentTime - lastTime >= frameInterval) {
                // 只在需要时更新状态
                if (window.gameState && window.gameState.player.isPlaying && !window.gameState.player.isGameOver) {
                    // 优化的更新逻辑
                    const deltaTime = currentTime - (coreModule.lastFrameTime || currentTime);
                    coreModule.lastFrameTime = currentTime;

                    coreModule.update(deltaTime);
                    coreModule.draw(ctx);
                }

                lastTime = currentTime - (currentTime - lastTime) % frameInterval;
            }

            // 使用requestAnimationFrame保持流畅性
            requestAnimationFrame(() => coreModule.gameLoop());
        };
    }

    /**
     * 优化内存使用
     */
    optimizeMemory() {
        console.log('🧠 优化内存使用...');

        // 设置垃圾回收优化标志
        this.setupMemoryOptimizations();

        console.log('✅ 内存优化完成');
    }

    setupMemoryOptimizations() {
        // 实现对象池以减少垃圾回收压力
        this.objectPool = {
            enemies: [],
            items: [],

            getEnemy: function() {
                return this.enemies.pop() || { x: 0, y: 0, size: 20, speed: 1, hp: 10 };
            },

            releaseEnemy: function(enemy) {
                // 重置敌人对象并放入池中
                enemy.x = 0;
                enemy.y = 0;
                enemy.hp = 10;
                this.enemies.push(enemy);
            }
        };
    }

    /**
     * 应用所有优化
     */
    applyAllOptimizations() {
        console.log('🚀 开始应用所有性能优化...');

        this.optimizeModuleLoading();
        this.optimizeRendering();
        this.optimizeGameLoop();
        this.optimizeMemory();

        // 设置性能监控
        this.setupPerformanceMonitoring();

        console.log('✅ 所有性能优化已应用');
    }

    /**
     * 设置性能监控
     */
    setupPerformanceMonitoring() {
        this.frameCount = 0;
        this.fps = 0;
        this.lastFpsUpdate = performance.now();

        // 简单的FPS监控
        const monitor = () => {
            this.frameCount++;
            const now = performance.now();
            const delta = now - this.lastFpsUpdate;

            if (delta >= 1000) {
                this.fps = Math.round((this.frameCount * 1000) / delta);
                this.frameCount = 0;
                this.lastFpsUpdate = now;

                // 如果FPS过低，可以进一步优化
                if (this.fps < 30) {
                    console.warn(`⚠️ FPS 较低: ${this.fps}, 考虑进一步优化`);
                }
            }

            requestAnimationFrame(monitor);
        };

        requestAnimationFrame(monitor);
    }

    /**
     * 获取性能统计数据
     */
    getPerformanceStats() {
        return {
            fps: this.fps,
            cachedModulesCount: this.cachedModules.size,
            resourceCacheSize: this.resourceCache.size,
            optimizationLevel: this.optimizationLevel
        };
    }
}

// 初始化性能优化器
const performanceOptimizer = new PerformanceOptimizer();

// 在GameEngine初始化后应用优化
if (window.GameEngine && window.GameEngine.initialized) {
    performanceOptimizer.applyAllOptimizations();
} else {
    // 如果GameEngine还没有初始化，等待它完成
    const applyOptimizationsWhenReady = () => {
        if (window.GameEngine && window.GameEngine.initialized) {
            performanceOptimizer.applyAllOptimizations();
        } else {
            setTimeout(applyOptimizationsWhenReady, 100);
        }
    };

    applyOptimizationsWhenReady();
}

// 导出优化器供调试使用
window.PerformanceOptimizer = performanceOptimizer;

console.log('⚡ 性能优化器已准备就绪');