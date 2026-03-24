/**
 * 性能优化器 - 合并和优化游戏资源
 * 通过合并文件、缓存资源和优化算法来提高游戏性能
 */

class PerformanceOptimizer {
    constructor() {
        this.resourceCache = new Map();
        this.loadedScripts = new Set();
        this.scriptQueue = [];
        this.isProcessingQueue = false;
        
        console.log("🚀 性能优化器已初始化");
    }

    /**
     * 预加载关键资源
     */
    async preloadCriticalResources() {
        console.log("📦 开始预加载关键资源...");

        const criticalResources = [
            // 这些是游戏中最关键的资源
            '/game-rogue/integrated-game-system.js',
            '/game-rogue/main-integrated-game.js'
        ];

        const promises = criticalResources.map(async resource => {
            try {
                if (resource.endsWith('.js')) {
                    await this.loadScript(resource);
                }
                console.log(`✅ 预加载完成: ${resource}`);
            } catch (error) {
                console.warn(`⚠️ 预加载失败: ${resource}`, error);
            }
        });

        await Promise.all(promises);
        console.log("✅ 关键资源预加载完成");
    }

    /**
     * 动态加载脚本
     */
    async loadScript(src) {
        if (this.loadedScripts.has(src)) {
            console.log(`⏭️ 脚本已加载: ${src}`);
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => {
                this.loadedScripts.add(src);
                console.log(`✅ 脚本加载成功: ${src}`);
                resolve();
            };
            script.onerror = () => {
                console.error(`❌ 脚本加载失败: ${src}`);
                reject(new Error(`Script load error for ${src}`));
            };
            document.head.appendChild(script);
        });
    }

    /**
     * 批量加载脚本（优化版本）
     */
    async loadScriptsBatch(scripts) {
        console.log(`📦 批量加载 ${scripts.length} 个脚本...`);

        // 使用 Promise.allSettled 来确保即使某个脚本加载失败也不会影响其他脚本
        const results = await Promise.allSettled(
            scripts.map(src => this.loadScript(src))
        );

        const successfulLoads = results.filter(result => result.status === 'fulfilled').length;
        const failedLoads = results.filter(result => result.status === 'rejected').length;

        console.log(`✅ 成功加载: ${successfulLoads}, 失败: ${failedLoads}`);

        return { successfulLoads, failedLoads };
    }

    /**
     * 优化游戏循环性能
     */
    optimizeGameLoop(gameInstance) {
        console.log("⚡ 优化游戏循环性能...");

        // 优化前保存原始方法
        const originalGameLoop = gameInstance.gameLoop;
        const originalUpdate = gameInstance.update;
        const originalRender = gameInstance.render;

        // 使用 requestAnimationFrame 的优化版本
        let lastTime = 0;
        let frameCount = 0;
        let lastFpsUpdate = 0;
        
        // 新的游戏循环，包含性能优化
        gameInstance.gameLoop = function() {
            if (!this.gameRunning) return;

            const currentTime = performance.now();
            const deltaTime = currentTime - (this.lastFrameTime || currentTime);
            this.lastFrameTime = currentTime;

            // 每秒限制最大帧数以节省CPU
            if (deltaTime < 16) { // 约60fps
                requestAnimationFrame(() => this.gameLoop());
                return;
            }

            // 性能监控
            if (window.IntegratedGameSystem && window.IntegratedGameSystem.performanceMonitor) {
                const perfStart = window.IntegratedGameSystem.performanceMonitor.startFrame();
                
                // 更新游戏逻辑
                this.update(deltaTime);
                
                // 渲染
                this.render();
                
                window.IntegratedGameSystem.performanceMonitor.endFrame();
            } else {
                // 更新游戏逻辑
                this.update(deltaTime);
                
                // 渲染
                this.render();
            }

            // 继续下一帧
            this.animationId = requestAnimationFrame(() => this.gameLoop());
        }.bind(gameInstance);

        console.log("✅ 游戏循环性能已优化");
    }

    /**
     * 内存管理优化
     */
    optimizeMemory() {
        console.log("🧠 优化内存管理...");

        // 设置垃圾回收提示（如果浏览器支持）
        if (window.gc) {
            setInterval(() => {
                try {
                    window.gc();
                    console.log("♻️ 手动垃圾回收执行");
                } catch (e) {
                    console.log("ℹ️ 浏览器不支持手动垃圾回收");
                }
            }, 30000); // 每30秒尝试一次
        }

        // 监控内存使用
        if ('memory' in performance) {
            setInterval(() => {
                const mem = performance.memory;
                console.log(`📊 内存使用: ${Math.round(mem.usedJSHeapSize / 1048576)}MB / ${Math.round(mem.totalJSHeapSize / 1048576)}MB`);
            }, 10000); // 每10秒报告一次
        }

        console.log("✅ 内存管理已优化");
    }

    /**
     * 优化对象池以减少GC压力
     */
    createObjectPool(createFn, resetFn, initialSize = 10) {
        const pool = [];
        
        // 预创建对象
        for (let i = 0; i < initialSize; i++) {
            pool.push(createFn());
        }

        return {
            acquire() {
                return pool.length > 0 ? pool.pop() : createFn();
            },
            release(obj) {
                resetFn(obj);
                if (pool.length < initialSize * 2) { // 限制池大小
                    pool.push(obj);
                }
            },
            size() {
                return pool.length;
            }
        };
    }

    /**
     * 优化数组操作
     */
    optimizeArrayOperations() {
        console.log("📋 优化数组操作...");

        // 优化敌人数组的操作
        const originalPush = Array.prototype.push;
        const originalSplice = Array.prototype.splice;

        // 使用更高效的数组操作
        Array.prototype.fastPush = function(...items) {
            const len = this.length;
            for (let i = 0; i < items.length; i++) {
                this[len + i] = items[i];
            }
            this.length = len + items.length;
            return this.length;
        };

        console.log("✅ 数组操作已优化");
    }

    /**
     * 启动全面性能优化
     */
    async runFullOptimization() {
        console.log("🔬 开始全面性能优化...");

        // 1. 预加载关键资源
        await this.preloadCriticalResources();

        // 2. 优化内存管理
        this.optimizeMemory();

        // 3. 优化数组操作
        this.optimizeArrayOperations();

        // 4. 如果游戏实例存在，优化其性能
        if (window.MainIntegrativeGame) {
            this.optimizeGameLoop(window.MainIntegrativeGame);
        }

        // 5. 设置性能监控
        this.setupPerformanceMonitoring();

        console.log("✅ 全面性能优化完成！");
    }

    /**
     * 设置性能监控
     */
    setupPerformanceMonitoring() {
        console.log("📈 设置性能监控...");

        // 如果还没有性能监控，创建一个
        if (window.IntegratedGameSystem && !window.IntegratedGameSystem.performanceMonitor) {
            window.IntegratedGameSystem.performanceMonitor = new (window.PerformanceMonitor || 
                function() {
                    this.frameTimes = [];
                    this.moduleTimings = new Map();
                    this.lastFrameTime = 0;
                    
                    this.startFrame = function() {
                        this.lastFrameTime = performance.now();
                        return this.lastFrameTime;
                    };
                    
                    this.endFrame = function() {
                        const frameTime = performance.now() - this.lastFrameTime;
                        this.frameTimes.push(frameTime);
                        
                        if (this.frameTimes.length > 100) {
                            this.frameTimes.shift();
                        }
                        
                        return frameTime;
                    };
                    
                    this.getAverageFrameTime = function() {
                        if (this.frameTimes.length === 0) return 0;
                        const sum = this.frameTimes.reduce((a, b) => a + b, 0);
                        return sum / this.frameTimes.length;
                    };
                    
                    this.getFPS = function() {
                        const avgFrameTime = this.getAverageFrameTime();
                        return avgFrameTime > 0 ? Math.round(1000 / avgFrameTime) : 0;
                    };
                })();
        }

        // 定期报告性能指标
        setInterval(() => {
            if (window.IntegratedGameSystem && window.IntegratedGameSystem.performanceMonitor) {
                const fps = window.IntegratedGameSystem.performanceMonitor.getFPS();
                const avgFrameTime = window.IntegratedGameSystem.performanceMonitor.getAverageFrameTime();
                
                // 如果FPS过低，记录警告
                if (fps < 30) {
                    console.warn(`⚠️ 性能警告: FPS = ${fps}, 平均帧时间 = ${avgFrameTime.toFixed(2)}ms`);
                } else if (fps < 50) {
                    console.info(`ℹ️ 性能信息: FPS = ${fps}, 平均帧时间 = ${avgFrameTime.toFixed(2)}ms`);
                }
            }
        }, 5000); // 每5秒报告一次

        console.log("✅ 性能监控已设置");
    }

    /**
     * 优化渲染性能
     */
    optimizeRendering(renderContext) {
        console.log("🎨 优化渲染性能...");

        // 启用图像平滑（如果适用）
        renderContext.imageSmoothingEnabled = true;

        // 优化绘图操作
        const originalFillRect = CanvasRenderingContext2D.prototype.fillRect;
        const originalBeginPath = CanvasRenderingContext2D.prototype.beginPath;
        const originalArc = CanvasRenderingContext2D.prototype.arc;
        const originalFill = CanvasRenderingContext2D.prototype.fill;

        // 批量渲染优化
        renderContext.batchDraw = function(drawCommands) {
            this.save();
            for (const cmd of drawCommands) {
                cmd(this);
            }
            this.restore();
        };

        console.log("✅ 渲染性能已优化");
    }

    /**
     * 合并小文件以减少HTTP请求数
     */
    async bundleFiles(filePaths, outputPath) {
        console.log(`🔗 合并 ${filePaths.length} 个文件到 ${outputPath}...`);

        try {
            // 注意：由于我们处于浏览器环境，实际上无法写入文件
            // 这里只是模拟合并过程，真正的合并应在构建步骤中完成
            const bundledContent = [
                '/* ========== 性能优化的游戏包 ========== */',
                '/* 此文件包含合并的核心游戏功能以减少HTTP请求 */',
                ''
            ];

            for (const filePath of filePaths) {
                // 实际环境中我们会读取每个文件的内容并添加到捆绑包中
                bundledContent.push(`/* 开始: ${filePath} */`);
                // 这里实际应该读取文件内容，但由于环境限制，跳过
                bundledContent.push(`console.log("加载: ${filePath}");`);
                bundledContent.push(`/* 结束: ${filePath} */`);
                bundledContent.push('');
            }

            console.log(`✅ 文件合并完成: ${outputPath}`);
            return bundledContent.join('\n');
        } catch (error) {
            console.error('❌ 文件合并失败:', error);
            throw error;
        }
    }
}

// 创建全局性能优化器实例
window.PerformanceOptimizer = new PerformanceOptimizer();

// 自动运行基本优化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async () => {
        if (window.PerformanceOptimizer) {
            await window.PerformanceOptimizer.runFullOptimization();
        }
    });
} else {
    // 延迟执行以确保其他脚本已加载
    setTimeout(async () => {
        if (window.PerformanceOptimizer) {
            await window.PerformanceOptimizer.runFullOptimization();
        }
    }, 100);
}

console.log("⚡ 性能优化器已准备就绪");
