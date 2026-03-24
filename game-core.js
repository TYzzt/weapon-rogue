/**
 * Rogue游戏核心文件 - 整合版
 * 统一管理游戏的核心功能，避免模块冲突
 */

// 首先确保统一模块系统已经加载
if (typeof window.GameSystem === 'undefined') {
    console.error('❌ 统一游戏系统未加载，请确保 unified-module-system.js 在此文件之前加载');
}

// 游戏核心模块类
class GameCore {
    constructor() {
        this.name = 'GameCore';
        this.isInitialized = false;

        // 游戏元素引用
        this.canvas = null;
        this.ctx = null;
        this.keys = {};
        this.lastFrameTime = 0;
    }

    init(system) {
        this.system = system;
        this.isInitialized = true;
        console.log('🔧 游戏核心模块已初始化');

        // 初始化Canvas
        this.setupCanvas();

        // 绑定事件
        this.bindEvents();

        // 初始化游戏状态
        this.initializeGameState();

        // 启动游戏循环
        this.startGameLoop();
    }

    setupCanvas() {
        // 尝试获取canvas元素，如果不存在则创建
        this.canvas = document.getElementById('gameCanvas') || document.querySelector('canvas');
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'gameCanvas';
            this.canvas.width = 800;
            this.canvas.height = 600;
            document.body.appendChild(this.canvas);
        }

        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) {
            throw new Error('无法获取Canvas上下文');
        }
    }

    bindEvents() {
        // 键盘事件
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;

            // 触发游戏动作
            if (e.key === ' ') {
                e.preventDefault();
                this.handleAction('space');
            }
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });

        // 鼠标事件
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const gameState = this.system.getState();
            gameState.mouseX = e.clientX - rect.left;
            gameState.mouseY = e.clientY - rect.top;
        });

        this.canvas.addEventListener('click', (e) => {
            this.handleAction('click');
        });
    }

    initializeGameState() {
        const gameState = this.system.getState();

        // 重置玩家状态
        Object.assign(gameState.player, {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
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
        });

        // 重置游戏状态
        gameState.level = 1;
        gameState.kills = 0;
        gameState.enemies = [];
        gameState.items = [];
        gameState.enemySpawnTimer = 0;
        gameState.enemySpawnRate = 2000;
        gameState.combatLog = [];
        gameState.startTime = null;
        gameState.sessionTime = 0;
    }

    handleAction(action) {
        const gameState = this.system.getState();

        if (!gameState.player.isPlaying || gameState.player.isGameOver) return;

        switch (action) {
            case 'space':
                // 特殊动作处理
                this.performSpecialAction();
                break;
            case 'click':
                // 攻击处理
                this.performAttack();
                break;
        }
    }

    performSpecialAction() {
        // 实现特殊动作逻辑
        const gameState = this.system.getState();
        console.log('🏃‍♂️ 执行特殊动作');

        // 触发事件
        this.system.eventBus.emit('specialAction', { player: gameState.player });
    }

    performAttack() {
        // 实现攻击逻辑
        const gameState = this.system.getState();
        console.log('⚔️ 执行攻击');

        // 触发事件
        this.system.eventBus.emit('attackPerformed', { player: gameState.player });
    }

    startGame() {
        const gameState = this.system.getState();
        gameState.player.isPlaying = true;
        gameState.player.isGameOver = false;
        gameState.startTime = Date.now();
        gameState.enemies = []; // 清空敌人列表
        gameState.items = []; // 清空物品列表

        console.log('▶️ 游戏开始');

        // 通知其他模块游戏已开始
        this.system.eventBus.emit('gameStarted', { gameState });
    }

    update(deltaTime) {
        const gameState = this.system.getState();
        if (!gameState.player.isPlaying || gameState.player.isGameOver) return;

        // 更新玩家位置
        this.updatePlayer(deltaTime);

        // 更新敌人
        this.updateEnemies(deltaTime);

        // 更新物品
        this.updateItems();

        // 更新游戏计时器
        gameState.sessionTime += deltaTime;

        // 检查碰撞
        this.checkCollisions();

        // 生成敌人
        gameState.enemySpawnTimer += deltaTime;
        if (gameState.enemySpawnTimer >= gameState.enemySpawnRate) {
            this.spawnEnemy();
            gameState.enemySpawnTimer = 0;

            // 随着等级提升，增加敌人的生成速度
            gameState.enemySpawnRate = Math.max(200, 2000 - gameState.kills * 2);
        }

        // 检查游戏结束条件
        if (gameState.player.hp <= 0) {
            gameState.player.isGameOver = true;
            gameState.player.isPlaying = false;
            this.system.eventBus.emit('gameOver', {
                score: gameState.player.score,
                kills: gameState.kills,
                playTime: gameState.sessionTime
            });
        }
    }

    updatePlayer(deltaTime) {
        const gameState = this.system.getState();
        const playerSpeed = gameState.player.speed;

        // 处理键盘输入
        if (this.keys['w'] || this.keys['arrowup']) {
            gameState.player.y = Math.max(gameState.player.size/2, gameState.player.y - playerSpeed);
        }
        if (this.keys['s'] || this.keys['arrowdown']) {
            gameState.player.y = Math.min(this.canvas.height - gameState.player.size/2, gameState.player.y + playerSpeed);
        }
        if (this.keys['a'] || this.keys['arrowleft']) {
            gameState.player.x = Math.max(gameState.player.size/2, gameState.player.x - playerSpeed);
        }
        if (this.keys['d'] || this.keys['arrowright']) {
            gameState.player.x = Math.min(this.canvas.width - gameState.player.size/2, gameState.player.x + playerSpeed);
        }

        // 面向鼠标方向
        const angle = Math.atan2(
            gameState.mouseY - gameState.player.y,
            gameState.mouseX - gameState.player.x
        );
    }

    updateEnemies(deltaTime) {
        const gameState = this.system.getState();

        // 移动敌人 toward 玩家
        for (let i = gameState.enemies.length - 1; i >= 0; i--) {
            const enemy = gameState.enemies[i];

            // 计算朝向玩家的方向
            const dx = gameState.player.x - enemy.x;
            const dy = gameState.player.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 0) {
                enemy.x += (dx / distance) * enemy.speed;
                enemy.y += (dy / distance) * enemy.speed;
            }

            // 检查是否与玩家碰撞
            const collisionDistance = (gameState.player.size + enemy.size) / 2;
            if (distance < collisionDistance) {
                // 对玩家造成伤害
                gameState.player.hp -= 10;

                // 推开敌人
                enemy.x = gameState.player.x + (dx / distance) * (collisionDistance + 5);
                enemy.y = gameState.player.y + (dy / distance) * (collisionDistance + 5);
            }
        }
    }

    updateItems() {
        // 更新物品状态（如有需要）
    }

    checkCollisions() {
        const gameState = this.system.getState();

        // 检查玩家与敌人的碰撞已经在updateEnemies中处理

        // 检查敌人之间的碰撞
        for (let i = 0; i < gameState.enemies.length; i++) {
            for (let j = i + 1; j < gameState.enemies.length; j++) {
                const enemy1 = gameState.enemies[i];
                const enemy2 = gameState.enemies[j];

                const dx = enemy1.x - enemy2.x;
                const dy = enemy1.y - enemy2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const minDistance = (enemy1.size + enemy2.size) / 2;

                if (distance < minDistance) {
                    // 简单的推开效果
                    const angle = Math.atan2(dy, dx);
                    const overlap = minDistance - distance;

                    enemy1.x += Math.cos(angle) * overlap / 2;
                    enemy1.y += Math.sin(angle) * overlap / 2;
                    enemy2.x -= Math.cos(angle) * overlap / 2;
                    enemy2.y -= Math.sin(angle) * overlap / 2;
                }
            }
        }
    }

    spawnEnemy() {
        const gameState = this.system.getState();
        const newEnemy = {
            x: Math.random() < 0.5 ?
                (Math.random() > 0.5 ? 0 : this.canvas.width) :
                Math.random() * this.canvas.width,
            y: Math.random() < 0.5 ?
                (Math.random() > 0.5 ? 0 : this.canvas.height) :
                Math.random() * this.canvas.height,
            size: 20,
            speed: 1 + Math.random() * 2,
            hp: 10 + Math.floor(gameState.level * 0.5)
        };

        // 如果从边缘生成，确保不会直接在角落
        if (newEnemy.x <= 0) newEnemy.x = 30;
        if (newEnemy.x >= this.canvas.width) newEnemy.x = this.canvas.width - 30;
        if (newEnemy.y <= 0) newEnemy.y = 30;
        if (newEnemy.y >= this.canvas.height) newEnemy.y = this.canvas.height - 30;

        // 确保敌人不会直接出现在玩家附近
        const distanceToPlayer = Math.sqrt(
            Math.pow(newEnemy.x - gameState.player.x, 2) +
            Math.pow(newEnemy.y - gameState.player.y, 2)
        );

        if (distanceToPlayer < 100) {
            // 重新定位敌人
            const angle = Math.random() * Math.PI * 2;
            newEnemy.x = gameState.player.x + Math.cos(angle) * 150;
            newEnemy.y = gameState.player.y + Math.sin(angle) * 150;

            // 确保不超出边界
            newEnemy.x = Math.max(newEnemy.size/2, Math.min(this.canvas.width - newEnemy.size/2, newEnemy.x));
            newEnemy.y = Math.max(newEnemy.size/2, Math.min(this.canvas.height - newEnemy.size/2, newEnemy.y));
        }

        gameState.enemies.push(newEnemy);
    }

    draw() {
        const gameState = this.system.getState();
        const ctx = this.ctx;

        // 清除画布
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制背景
        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制网格（可选）
        ctx.strokeStyle = '#222';
        ctx.lineWidth = 1;
        const gridSize = 50;
        for (let x = 0; x < this.canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.canvas.height);
            ctx.stroke();
        }
        for (let y = 0; y < this.canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.canvas.width, y);
            ctx.stroke();
        }

        // 绘制玩家
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(
            gameState.player.x - gameState.player.size/2,
            gameState.player.y - gameState.player.size/2,
            gameState.player.size,
            gameState.player.size
        );

        // 绘制玩家方向指示器
        const angle = Math.atan2(
            gameState.mouseY - gameState.player.y,
            gameState.mouseX - gameState.player.x
        );
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(gameState.player.x, gameState.player.y);
        ctx.lineTo(
            gameState.player.x + Math.cos(angle) * gameState.player.size,
            gameState.player.y + Math.sin(angle) * gameState.player.size
        );
        ctx.stroke();

        // 绘制敌人
        gameState.enemies.forEach(enemy => {
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(
                enemy.x - enemy.size/2,
                enemy.y - enemy.size/2,
                enemy.size,
                enemy.size
            );
        });

        // 绘制UI
        this.drawUI();
    }

    drawUI() {
        const gameState = this.system.getState();
        const ctx = this.ctx;

        // 绘制生命值条
        const barWidth = 200;
        const barHeight = 20;
        const barX = 20;
        const barY = 20;

        // 生命值背景
        ctx.fillStyle = '#333';
        ctx.fillRect(barX, barY, barWidth, barHeight);

        // 生命值
        const healthPercent = gameState.player.hp / gameState.player.maxHp;
        ctx.fillStyle = healthPercent > 0.5 ? '#00ff00' : (healthPercent > 0.25 ? '#ffff00' : '#ff0000');
        ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);

        // 生命值文字
        ctx.fillStyle = '#fff';
        ctx.font = '14px Arial';
        ctx.fillText(`生命值: ${Math.round(gameState.player.hp)}/${gameState.player.maxHp}`, barX, barY - 5);

        // 分数
        ctx.fillText(`分数: ${gameState.player.score}`, barX, barY + 35);

        // 击杀数
        ctx.fillText(`击杀: ${gameState.kills}`, barX, barY + 55);

        // 游戏结束画面
        if (gameState.player.isGameOver) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            ctx.fillStyle = '#fff';
            ctx.font = 'bold 48px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('游戏结束', this.canvas.width/2, this.canvas.height/2 - 50);

            ctx.font = '24px Arial';
            ctx.fillText(`最终分数: ${gameState.player.score}`, this.canvas.width/2, this.canvas.height/2);
            ctx.fillText(`击杀数: ${gameState.kills}`, this.canvas.width/2, this.canvas.height/2 + 40);

            ctx.font = '18px Arial';
            ctx.fillText('按R键重新开始', this.canvas.width/2, this.canvas.height/2 + 80);

            ctx.textAlign = 'left';
        }
    }

    startGameLoop() {
        const gameLoop = (currentTime) => {
            if (!this.lastFrameTime) this.lastFrameTime = currentTime;
            const deltaTime = currentTime - this.lastFrameTime;
            this.lastFrameTime = currentTime;

            this.update(deltaTime);
            this.draw();

            // 检查是否需要继续游戏循环
            const gameState = this.system.getState();
            if (gameState.player.isPlaying || !gameState.player.isGameOver) {
                requestAnimationFrame(gameLoop);
            }
        };

        requestAnimationFrame(gameLoop);
    }

    onGameStart() {
        console.log('🎬 游戏核心启动');
        this.startGame();
    }

    // 公共API方法
    restartGame() {
        this.initializeGameState();
        this.startGame();
    }

    pauseGame() {
        const gameState = this.system.getState();
        gameState.player.isPlaying = false;
        console.log('⏸️ 游戏暂停');
    }

    resumeGame() {
        const gameState = this.system.getState();
        if (gameState.player.isGameOver) {
            this.restartGame();
        } else {
            gameState.player.isPlaying = true;
            console.log('⏯️ 游戏继续');
        }
    }
}

// 导出GameCore类供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameCore;
}