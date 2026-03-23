/**
 * 模块聚合器 - 将相关功能整合到单一文件中
 * 优化加载性能，减少HTTP请求
 */

// 内联核心游戏功能，避免多次文件请求

// 核心物理引擎（简化版）
class PhysicsEngine {
    static distance(obj1, obj2) {
        const dx = obj1.x - obj2.x;
        const dy = obj1.y - obj2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    static moveTowards(start, target, speed) {
        const dx = target.x - start.x;
        const dy = target.y - start.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            const dirX = dx / distance;
            const dirY = dy / distance;
            start.x += dirX * speed;
            start.y += dirY * speed;
        }
    }

    static checkCollision(obj1, obj2, buffer = 0) {
        const distance = this.distance(obj1, obj2);
        return distance <= (obj1.size/2 + obj2.size/2 + buffer);
    }
}

// 敌人生成器
class EnemySpawner {
    constructor() {
        this.spawnRate = 2000; // 毫秒
        this.lastSpawnTime = 0;
        this.difficultyMultiplier = 1.0;
    }

    update(currentTime, gameState) {
        if (currentTime - this.lastSpawnTime >= this.spawnRate) {
            this.spawnEnemy(gameState);
            this.lastSpawnTime = currentTime;

            // 随着击杀数增加，提高敌人生成速度
            this.spawnRate = Math.max(200, 2000 - gameState.kills * 2);
        }
    }

    spawnEnemy(gameState) {
        const newEnemy = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: 20,
            speed: 1 + Math.random() * 2,
            hp: 10 + Math.floor(gameState.level * 0.5),
            damage: 5 + Math.floor(gameState.level * 0.2),
            color: `hsl(${Math.random() * 60}, 70%, 50%)`
        };

        // 确保敌人不会直接出现在玩家附近
        const distanceToPlayer = PhysicsEngine.distance(
            newEnemy,
            { x: gameState.player.x, y: gameState.player.y }
        );

        if (distanceToPlayer < 100) {
            // 重新定位敌人
            const angle = Math.random() * Math.PI * 2;
            newEnemy.x = gameState.player.x + Math.cos(angle) * 150;
            newEnemy.y = gameState.player.y + Math.sin(angle) * 150;

            // 确保不超出边界
            newEnemy.x = Math.max(newEnemy.size/2, Math.min(canvas.width - newEnemy.size/2, newEnemy.x));
            newEnemy.y = Math.max(newEnemy.size/2, Math.min(canvas.height - newEnemy.size/2, newEnemy.y));
        }

        gameState.enemies.push(newEnemy);
    }
}

// 优化的渲染引擎
class RenderEngine {
    constructor() {
        this.lastRenderTime = 0;
        this.renderInterval = 1000 / 60; // 60 FPS目标
    }

    render(ctx, gameState) {
        const now = performance.now();

        // 控制渲染频率
        if (now - this.lastRenderTime < this.renderInterval) {
            return false;
        }

        this.lastRenderTime = now;

        // 清除画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 绘制背景
        this.drawBackground(ctx);

        // 绘制玩家
        this.drawPlayer(ctx, gameState.player);

        // 绘制敌人
        this.drawEnemies(ctx, gameState.enemies);

        // 绘制UI元素
        this.drawUI(ctx, gameState);

        return true;
    }

    drawBackground(ctx) {
        // 创建渐变背景
        const gradient = ctx.createRadialGradient(
            canvas.width/2, canvas.height/2, 0,
            canvas.width/2, canvas.height/2, Math.max(canvas.width, canvas.height)/2
        );
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(1, '#0f0f1a');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    drawPlayer(ctx, player) {
        // 绘制玩家
        ctx.fillStyle = '#4ade80';
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
        ctx.fill();

        // 绘制玩家生命值
        const healthPercent = player.hp / player.maxHp;
        ctx.fillStyle = '#333';
        ctx.fillRect(player.x - 20, player.y - player.size - 10, 40, 6);
        ctx.fillStyle = healthPercent > 0.5 ? '#4ade80' : healthPercent > 0.25 ? '#fbbf24' : '#ef4444';
        ctx.fillRect(player.x - 20, player.y - player.size - 10, 40 * healthPercent, 6);
    }

    drawEnemies(ctx, enemies) {
        enemies.forEach(enemy => {
            // 绘制敌人
            ctx.fillStyle = enemy.color;
            ctx.beginPath();
            ctx.arc(enemy.x, enemy.y, enemy.size, 0, Math.PI * 2);
            ctx.fill();

            // 绘制敌人血条
            const hpPercent = enemy.hp / enemy.maxHp;
            ctx.fillStyle = '#333';
            ctx.fillRect(enemy.x - 20, enemy.y - enemy.size - 10, 40, 6);
            ctx.fillStyle = '#f00';
            ctx.fillRect(enemy.x - 20, enemy.y - enemy.size - 10, 40 * hpPercent, 6);
        });
    }

    drawUI(ctx, gameState) {
        // UI已经通过HTML DOM处理，这里可以绘制额外的游戏内UI
    }
}

// 优化的碰撞检测系统
class CollisionSystem {
    static checkPlayerEnemyCollisions(player, enemies) {
        const collisions = [];

        for (let i = enemies.length - 1; i >= 0; i--) {
            const enemy = enemies[i];
            if (PhysicsEngine.checkCollision(player, enemy, 5)) {
                collisions.push({ type: 'player-enemy', player, enemy, index: i });
            }
        }

        return collisions;
    }

    static checkAttackCollisions(player, enemies, attackRange) {
        const hitEnemies = [];

        for (let i = enemies.length - 1; i >= 0; i--) {
            const enemy = enemies[i];
            if (PhysicsEngine.distance(player, enemy) <= attackRange) {
                hitEnemies.push({ enemy, index: i });
            }
        }

        return hitEnemies;
    }
}

// 将这些优化组件集成到主游戏中
if (window.RogueGame) {
    // 添加性能优化组件到游戏系统
    window.RogueGame.physics = new PhysicsEngine();
    window.RogueGame.spawner = new EnemySpawner();
    window.RogueGame.renderer = new RenderEngine();
    window.RogueGame.collisions = new CollisionSystem();

    // 优化主游戏循环
    const originalGameLoop = window.RogueGame.gameLoop;
    window.RogueGame.gameLoop = function() {
        if (!this.state.player.isPlaying || this.state.player.isGameOver) return;

        const frameStartTime = this.performanceMonitor.startFrame();

        const currentTime = Date.now();
        const deltaTime = currentTime - (this.lastFrameTime || currentTime);
        this.lastFrameTime = currentTime;

        // 使用优化的敌人生成器
        this.spawner.update(currentTime, this.state);

        // 更新所有模块
        for (let moduleName in this.modules) {
            const module = this.modules[moduleName];
            if (module.update) {
                const moduleStartTime = this.performanceMonitor.startModuleMeasurement(moduleName);
                module.update(deltaTime, this.state);
                this.performanceMonitor.endModuleMeasurement(moduleName, moduleStartTime);
            }
        }

        // 使用优化的渲染引擎
        this.renderer.render(ctx, this.state);

        // 继续下一帧
        requestAnimationFrame(() => this.gameLoop());
    };
}

console.log('🚀 性能优化模块聚合器已加载');