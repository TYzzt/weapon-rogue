/**
 * 增强型性能优化器
 * 统一所有性能优化策略，解决性能瓶颈
 */

class EnhancedPerformanceOptimizer {
    constructor() {
        this.metrics = {
            lastFrameTime: 0,
            frameCount: 0,
            fps: 0,
            lastFpsUpdate: 0,
            lastCleanup: 0,
            renderCalls: 0,
            updateCalls: 0
        };

        // 对象池 - 重用游戏对象以减少垃圾回收
        this.objectPools = {
            enemies: [],
            items: [],
            projectiles: [],
            particles: []
        };

        // 渲染缓存
        this.renderCache = new Map();

        // 游戏对象索引，用于快速访问
        this.gameObjectIndex = {
            enemies: new Set(),
            items: new Set(),
            projectiles: new Set()
        };

        // 优化标志
        this.optimizationFlags = {
            batchRendering: true,
            objectPooling: true,
            spatialIndexing: true,
            frameSkipping: false
        };

        console.log("⚡ 增强型性能优化器已初始化");
    }

    /**
     * 更新性能指标
     */
    updateMetrics(currentTime) {
        this.metrics.updateCalls++;

        this.metrics.frameCount++;

        // 每秒更新一次FPS
        if (currentTime - this.metrics.lastFpsUpdate > 1000) {
            this.metrics.fps = Math.round(
                this.metrics.frameCount * 1000 /
                (currentTime - this.metrics.lastFpsUpdate)
            );
            this.metrics.frameCount = 0;
            this.metrics.lastFpsUpdate = currentTime;

            // 每5秒进行一次内存清理
            if (currentTime - this.metrics.lastCleanup > 5000) {
                this.cleanup();
                this.metrics.lastCleanup = currentTime;
            }

            // 根据FPS调整优化策略
            this.adjustOptimizationStrategies();
        }

        this.metrics.lastFrameTime = currentTime;
    }

    /**
     * 根据性能指标动态调整优化策略
     */
    adjustOptimizationStrategies() {
        if (this.metrics.fps < 30) {
            // 性能较差，启用更多优化
            this.optimizationFlags.frameSkipping = true;
            console.warn(`⚠️ 性能较低 (${this.metrics.fps} FPS)，启用帧跳过优化`);
        } else if (this.metrics.fps > 55) {
            // 性能较好，可适当降低优化强度以获得更好体验
            this.optimizationFlags.frameSkipping = false;
        }
    }

    /**
     * 对象池管理
     */
    acquireFromPool(type) {
        if (this.objectPools[type] && this.objectPools[type].length > 0) {
            const obj = this.objectPools[type].pop();
            this.gameObjectIndex[type].add(obj.id || Date.now()); // 添加到索引
            return obj;
        }

        // 创建新对象
        let newObj;
        switch(type) {
            case 'enemy':
                newObj = {
                    id: Date.now() + Math.random(),
                    x: 0, y: 0, size: 20, speed: 0, hp: 10, maxHp: 10,
                    reset: function(x, y, size, speed, hp) {
                        this.x = x || 0;
                        this.y = y || 0;
                        this.size = size || 20;
                        this.speed = speed || 1;
                        this.hp = hp || 10;
                        this.maxHp = hp || 10;
                        this.alive = true;
                        return this;
                    }
                };
                break;
            case 'item':
                newObj = {
                    id: Date.now() + Math.random(),
                    x: 0, y: 0, size: 10, type: 'health',
                    reset: function(x, y, size, type) {
                        this.x = x || 0;
                        this.y = y || 0;
                        this.size = size || 10;
                        this.type = type || 'health';
                        return this;
                    }
                };
                break;
            case 'projectile':
                newObj = {
                    id: Date.now() + Math.random(),
                    x: 0, y: 0, size: 5, speed: 5, damage: 10,
                    reset: function(x, y, size, speed, damage) {
                        this.x = x || 0;
                        this.y = y || 0;
                        this.size = size || 5;
                        this.speed = speed || 5;
                        this.damage = damage || 10;
                        return this;
                    }
                };
                break;
            default:
                newObj = { id: Date.now() + Math.random() };
        }

        this.gameObjectIndex[type].add(newObj.id);
        return newObj;
    }

    /**
     * 将对象返回到池中
     */
    returnToPool(type, obj) {
        if (obj && this.objectPools[type]) {
            // 重置对象属性
            if (obj.reset) {
                obj.reset(); // 重置到初始状态
            } else {
                // 基本重置
                obj.x = 0;
                obj.y = 0;
                obj.alive = false;
            }

            this.gameObjectIndex[type].delete(obj.id); // 从索引中移除
            this.objectPools[type].push(obj);
        }
    }

    /**
     * 清理不必要的对象和缓存
     */
    cleanup() {
        // 清理对象池，限制大小以避免内存泄漏
        for (const poolType in this.objectPools) {
            if (this.objectPools[poolType].length > 200) { // 限制每个池最多200个对象
                const excess = this.objectPools[poolType].length - 100; // 只保留100个
                this.objectPools[poolType] = this.objectPools[poolType].slice(0, 100);
                console.log(`🧹 清理了 ${excess} 个 ${poolType} 对象`);
            }
        }

        // 清理过期的渲染缓存
        const now = Date.now();
        for (const [key, value] of this.renderCache.entries()) {
            if (now - value.timestamp > 30000) { // 超过30秒的缓存
                this.renderCache.delete(key);
            }
        }

        console.log(`📊 性能清理完成，当前FPS: ${this.metrics.fps}, 对象池总数: ${this.getTotalPooledObjects()}`);
    }

    /**
     * 获取池中对象总数
     */
    getTotalPooledObjects() {
        return Object.values(this.objectPools).reduce((sum, pool) => sum + pool.length, 0);
    }

    /**
     * 空间分区 - 用于优化碰撞检测
     */
    createSpatialPartition(width, height, cellSize = 100) {
        const cols = Math.ceil(width / cellSize);
        const rows = Math.ceil(height / cellSize);

        const grid = Array(rows).fill().map(() => Array(cols).fill().map(() => []));

        return {
            grid,
            cellSize,
            cols,
            rows,
            addObject: function(obj, x, y) {
                const col = Math.floor(x / this.cellSize);
                const row = Math.floor(y / this.cellSize);

                if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
                    this.grid[row][col].push(obj);
                }
            },
            removeObject: function(obj, x, y) {
                const col = Math.floor(x / this.cellSize);
                const row = Math.floor(y / this.cellSize);

                if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
                    const cell = this.grid[row][col];
                    const index = cell.indexOf(obj);
                    if (index !== -1) {
                        cell.splice(index, 1);
                    }
                }
            },
            getNearbyObjects: function(x, y) {
                const col = Math.floor(x / this.cellSize);
                const row = Math.floor(y / this.cellSize);

                const nearby = [];

                // 检查当前格子和周围的8个格子
                for (let r = Math.max(0, row - 1); r <= Math.min(this.rows - 1, row + 1); r++) {
                    for (let c = Math.max(0, col - 1); c <= Math.min(this.cols - 1, col + 1); c++) {
                        nearby.push(...this.grid[r][c]);
                    }
                }

                return nearby;
            },
            clear: function() {
                for (let r = 0; r < this.rows; r++) {
                    for (let c = 0; c < this.cols; c++) {
                        this.grid[r][c] = [];
                    }
                }
            }
        };
    }

    /**
     * 优化的批量绘制函数
     */
    optimizedBatchDraw(ctx, objects, drawFunction) {
        if (!objects || objects.length === 0) return;

        this.metrics.renderCalls++;

        // 保存上下文状态
        ctx.save();

        // 批量操作 - 设置一次绘图属性，应用于所有对象
        if (drawFunction.beforeBatch) {
            drawFunction.beforeBatch(ctx);
        }

        // 高效遍历
        for (let i = 0, len = objects.length; i < len; i++) {
            const obj = objects[i];
            if (obj && obj.alive !== false) { // 检查对象是否有效
                drawFunction(ctx, obj, i);
            }
        }

        // 恢复上下文状态
        ctx.restore();
    }

    /**
     * 条件帧渲染 - 在性能不佳时跳过某些帧的渲染
     */
    shouldRender(currentTime) {
        if (!this.optimizationFlags.frameSkipping) {
            return true; // 如果未启用帧跳过，总是渲染
        }

        // 当FPS低于阈值时，只渲染部分帧
        return this.metrics.fps > 25 || (currentTime % 2 === 0); // 在低性能时只渲染一半的帧
    }

    /**
     * 优化的游戏更新循环
     */
    optimizedUpdate(gameState, deltaTime) {
        // 执行优化的更新逻辑

        // 更新计时器
        gameState.enemySpawnTimer += deltaTime;

        // 优化敌人生成 - 使用更高效的随机数生成
        if (gameState.enemySpawnTimer >= gameState.enemySpawnRate) {
            this.spawnEnemyOptimized(gameState);
            gameState.enemySpawnTimer = 0;

            // 随着等级提升，增加敌人的生成速度（优化计算）
            const minSpawnRate = 200;
            const maxIncrease = 1800; // 防止负值的最大增加量
            gameState.enemySpawnRate = Math.max(minSpawnRate, 2000 - Math.min(gameState.kills * 2, maxIncrease));
        }

        // 优化敌人更新 - 批量处理
        this.updateEnemiesOptimized(gameState.enemies, gameState.player, deltaTime);

        // 优化物品更新
        this.updateItemsOptimized(gameState.items, gameState.player);

        // 优化玩家更新
        this.updatePlayerOptimized(gameState.player);
    }

    /**
     * 优化的敌人生成
     */
    spawnEnemyOptimized(gameState) {
        // 使用对象池获取敌人对象
        const enemy = this.acquireFromPool('enemy');

        // 设置初始属性
        enemy.reset(
            Math.random() * 800,  // canvas width
            Math.random() * 600,  // canvas height
            20,                   // size
            1 + Math.random() * 2, // speed
            10 + Math.floor(gameState.level * 0.5) // hp
        );

        // 确保敌人不会直接出现在玩家附近
        const distanceToPlayer = Math.hypot(
            enemy.x - gameState.player.x,
            enemy.y - gameState.player.y
        );

        if (distanceToPlayer < 100) {
            // 重新定位敌人
            const angle = Math.random() * Math.PI * 2;
            enemy.x = gameState.player.x + Math.cos(angle) * 150;
            enemy.y = gameState.player.y + Math.sin(angle) * 150;

            // 确保不超出边界
            enemy.x = Math.max(enemy.size/2, Math.min(800 - enemy.size/2, enemy.x)); // canvas width
            enemy.y = Math.max(enemy.size/2, Math.min(600 - enemy.size/2, enemy.y)); // canvas height
        }

        gameState.enemies.push(enemy);
    }

    /**
     * 优化的敌人更新
     */
    updateEnemiesOptimized(enemies, player, deltaTime) {
        // 使用倒序遍历，便于删除元素而不需要修改索引
        for (let i = enemies.length - 1; i >= 0; i--) {
            const enemy = enemies[i];

            if (!enemy || enemy.alive === false) {
                // 回收到对象池
                this.returnToPool('enemy', enemy);
                enemies.splice(i, 1);
                continue;
            }

            // 简单AI：朝向玩家移动
            const dx = player.x - enemy.x;
            const dy = player.y - enemy.y;
            const distance = Math.hypot(dx, dy);

            if (distance > 0) {
                enemy.x += (dx / distance) * enemy.speed * (deltaTime / 16); // 标准化到16ms的帧率
                enemy.y += (dy / distance) * enemy.speed * (deltaTime / 16);
            }
        }
    }

    /**
     * 优化的物品更新
     */
    updateItemsOptimized(items, player) {
        for (let i = items.length - 1; i >= 0; i--) {
            const item = items[i];

            if (!item) {
                items.splice(i, 1);
                continue;
            }

            // 检查玩家与物品的距离
            const dx = player.x - item.x;
            const dy = player.y - item.y;
            const distance = Math.hypot(dx, dy);

            if (distance < player.size/2 + item.size) {
                // 拾取物品
                this.applyItemEffect(player, item);

                // 回收物品对象
                this.returnToPool('item', item);
                items.splice(i, 1);
            }
        }
    }

    /**
     * 应用物品效果
     */
    applyItemEffect(player, item) {
        switch(item.type) {
            case 'health':
                player.hp = Math.min(player.maxHp, player.hp + 25);
                break;
            case 'score':
                player.score += 10;
                break;
            default:
                player.score += 5;
        }
    }

    /**
     * 优化的玩家更新
     */
    updatePlayerOptimized(player) {
        // 这里可以添加玩家状态更新逻辑
        // 确保玩家不会超出边界
        player.x = Math.max(player.size/2, Math.min(800 - player.size/2, player.x));
        player.y = Math.max(player.size/2, Math.min(600 - player.size/2, player.y));
    }

    /**
     * 获取性能指标
     */
    getMetrics() {
        return {
            ...this.metrics,
            objectPoolSizes: {
                enemies: this.objectPools.enemies.length,
                items: this.objectPools.items.length,
                projectiles: this.objectPools.projectiles.length,
                particles: this.objectPools.particles.length
            },
            totalPooledObjects: this.getTotalPooledObjects(),
            optimizationFlags: {...this.optimizationFlags},
            gameObjectCounts: {
                enemies: this.gameObjectIndex.enemies.size,
                items: this.gameObjectIndex.items.size,
                projectiles: this.gameObjectIndex.projectiles.size
            }
        };
    }

    /**
     * 重置性能优化器
     */
    reset() {
        this.metrics = {
            lastFrameTime: 0,
            frameCount: 0,
            fps: 0,
            lastFpsUpdate: 0,
            lastCleanup: 0,
            renderCalls: 0,
            updateCalls: 0
        };

        // 清空对象池
        for (const poolType in this.objectPools) {
            this.objectPools[poolType] = [];
        }

        // 清空游戏对象索引
        for (const indexType in this.gameObjectIndex) {
            this.gameObjectIndex[indexType].clear();
        }

        // 清空渲染缓存
        this.renderCache.clear();

        console.log("🔄 性能优化器已重置");
    }
}

// 创建全局增强性能优化器实例
window.EnhancedPerformanceOptimizer = new EnhancedPerformanceOptimizer();

// 性能监控工具
class PerformanceMonitor {
    constructor() {
        this.frameTimes = [];
        this.lastFrameTime = 0;
        this.samples = 60; // 保持60个样本用于平均计算
    }

    startFrame() {
        this.lastFrameTime = performance.now();
        return this.lastFrameTime;
    }

    endFrame() {
        const frameTime = performance.now() - this.lastFrameTime;

        this.frameTimes.push(frameTime);
        if (this.frameTimes.length > this.samples) {
            this.frameTimes.shift();
        }

        return frameTime;
    }

    getAverageFrameTime() {
        if (this.frameTimes.length === 0) return 0;
        const sum = this.frameTimes.reduce((a, b) => a + b, 0);
        return sum / this.frameTimes.length;
    }

    getFPS() {
        const avgFrameTime = this.getAverageFrameTime();
        return avgFrameTime > 0 ? Math.round(1000 / avgFrameTime) : 0;
    }

    getMinFrameTime() {
        if (this.frameTimes.length === 0) return 0;
        return Math.min(...this.frameTimes);
    }

    getMaxFrameTime() {
        if (this.frameTimes.length === 0) return 0;
        return Math.max(...this.frameTimes);
    }
}

// 全局性能监控实例
window.PerformanceMonitor = new PerformanceMonitor();

console.log("🚀 增强型性能优化系统已准备就绪");

// 如果在模块系统中可用，导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        EnhancedPerformanceOptimizer,
        PerformanceMonitor
    };
}