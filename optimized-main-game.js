/**
 * 优化的主游戏文件 - 整合核心功能，提升性能
 * 包含游戏的主要逻辑、渲染和控制功能
 */

// 游戏主类
class OptimizedRogueGame {
    constructor() {
        // 使用全局统一系统
        this.engine = window.FinalGameSystem;

        // 游戏元素引用
        this.canvas = null;
        this.ctx = null;

        // 游戏循环控制
        this.animationId = null;
        this.lastFrameTime = 0;
        this.gameRunning = false;

        // 输入状态
        this.keys = {};
        this.mouse = { x: 0, y: 0, pressed: false };

        // 性能监控
        this.performanceMonitor = this.engine.performanceMonitor;

        console.log("🎮 优化的Rogue游戏实例已创建");
    }

    // 初始化游戏
    init() {
        // 获取canvas元素
        this.canvas = document.getElementById('gameCanvas') || document.createElement('canvas');
        if (!document.body.contains(this.canvas)) {
            this.canvas.id = 'gameCanvas';
            this.canvas.width = 800;
            this.canvas.height = 600;
            document.body.appendChild(this.canvas);
        }

        this.ctx = this.canvas.getContext('2d');

        // 设置canvas大小
        this.canvas.width = window.innerWidth - 20;
        this.canvas.height = window.innerHeight - 20;

        // 绑定事件监听器
        this.setupEventListeners();

        console.log("✅ 游戏初始化完成");
    }

    // 设置事件监听器
    setupEventListeners() {
        // 键盘事件
        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;

            // 处理特殊按键
            if (e.key === ' ') {
                e.preventDefault();
                this.handleSpacebar();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });

        // 鼠标事件
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;

            // 更新游戏状态中的鼠标位置
            this.engine.updateState({
                mouseX: this.mouse.x,
                mouseY: this.mouse.y
            });
        });

        this.canvas.addEventListener('mousedown', (e) => {
            this.mouse.pressed = true;
        });

        this.canvas.addEventListener('mouseup', (e) => {
            this.mouse.pressed = false;
        });

        // 窗口大小调整
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth - 20;
            this.canvas.height = window.innerHeight - 20;
        });

        console.log("✅ 事件监听器设置完成");
    }

    // 处理空格键
    handleSpacebar() {
        const gameState = this.engine.getState();
        if (!gameState.player.isPlaying) {
            this.startGame();
        } else if (gameState.player.isGameOver) {
            this.restartGame();
        }
    }

    // 开始游戏
    startGame() {
        this.engine.updateState({
            player: {
                ...this.engine.getState().player,
                isPlaying: true,
                isGameOver: false
            },
            startTime: Date.now()
        });

        console.log("▶️ 游戏开始");

        if (!this.gameRunning) {
            this.gameRunning = true;
            this.lastFrameTime = performance.now();
            this.gameLoop();
        }
    }

    // 重启游戏
    restartGame() {
        // 重置游戏状态
        this.engine.updateState({
            player: {
                x: 400,
                y: 300,
                size: 30,
                speed: 5,
                hp: 100,
                maxHp: 100,
                weapon: null,
                isPlaying: true,
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
            enemySpawnTimer: 0,
            enemySpawnRate: 2000,
            combatLog: [],
            startTime: Date.now(),
            homeEnemySurge: false,
            officeEnemySurge: false,
            quantumReality: false,
            toolEmpowerment: 1.0
        });

        this.gameRunning = true;
        this.lastFrameTime = performance.now();
        this.gameLoop();

        console.log("🔄 游戏已重启");
    }

    // 游戏主循环
    gameLoop() {
        if (!this.gameRunning) return;

        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastFrameTime;
        this.lastFrameTime = currentTime;

        // 更新游戏状态
        this.update(deltaTime);

        // 渲染游戏画面
        this.render();

        // 继续下一次循环
        this.animationId = requestAnimationFrame(() => this.gameLoop());
    }

    // 更新游戏逻辑
    update(deltaTime) {
        const gameState = this.engine.getState();

        if (!gameState.player.isPlaying || gameState.player.isGameOver) {
            return;
        }

        // 更新会话时间
        this.engine.updateState({
            sessionTime: gameState.sessionTime + deltaTime
        });

        // 处理玩家移动
        this.handlePlayerMovement(deltaTime);

        // 更新敌人
        this.updateEnemies(deltaTime);

        // 检测碰撞
        this.checkCollisions();

        // 更新UI
        this.updateUI();

        // 检查游戏结束条件
        this.checkGameEndConditions();
    }

    // 处理玩家移动
    handlePlayerMovement(deltaTime) {
        const gameState = this.engine.getState();
        const playerSpeed = gameState.player.speed;
        const moveDistance = playerSpeed * (deltaTime / 16); // 基于60fps标准化

        let newX = gameState.player.x;
        let newY = gameState.player.y;

        // 检查键盘输入
        if (this.keys['w'] || this.keys['arrowup']) newY -= moveDistance;
        if (this.keys['s'] || this.keys['arrowdown']) newY += moveDistance;
        if (this.keys['a'] || this.keys['arrowleft']) newX -= moveDistance;
        if (this.keys['d'] || this.keys['arrowright']) newX += moveDistance;

        // 边界检查
        newX = Math.max(gameState.player.size/2, Math.min(this.canvas.width - gameState.player.size/2, newX));
        newY = Math.max(gameState.player.size/2, Math.min(this.canvas.height - gameState.player.size/2, newY));

        // 更新玩家位置
        this.engine.updateState({
            player: {
                ...gameState.player,
                x: newX,
                y: newY
            }
        });
    }

    // 更新敌人
    updateEnemies(deltaTime) {
        const gameState = this.engine.getState();

        // 更新敌人生成计时器
        this.engine.updateState({
            enemySpawnTimer: gameState.enemySpawnTimer + deltaTime
        });

        // 检查是否需要生成新敌人
        if (gameState.enemySpawnTimer >= gameState.enemySpawnRate) {
            this.spawnEnemy();
            this.engine.updateState({
                enemySpawnTimer: 0,
                // 随着击杀数增加，提高敌人生成速度
                enemySpawnRate: Math.max(200, 2000 - gameState.kills * 2)
            });
        }

        // 移动敌人 toward 玩家
        const updatedEnemies = gameState.enemies.map(enemy => {
            // 计算朝向玩家的方向
            const dx = gameState.player.x - enemy.x;
            const dy = gameState.player.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 0) {
                const moveX = (dx / distance) * enemy.speed * (deltaTime / 16);
                const moveY = (dy / distance) * enemy.speed * (deltaTime / 16);

                return {
                    ...enemy,
                    x: enemy.x + moveX,
                    y: enemy.y + moveY
                };
            }

            return enemy;
        });

        this.engine.updateState({
            enemies: updatedEnemies
        });
    }

    // 生成敌人
    spawnEnemy() {
        const gameState = this.engine.getState();

        const newEnemy = {
            x: Math.random() < 0.5 ?
                (Math.random() > 0.5 ? 0 : this.canvas.width) :
                Math.random() * this.canvas.width,
            y: Math.random() < 0.5 ?
                (Math.random() > 0.5 ? 0 : this.canvas.height) :
                Math.random() * this.canvas.height,
            size: 20,
            speed: 1 + Math.random() * 2,
            hp: 10 + Math.floor(gameState.level * 0.5),
            maxHp: 10 + Math.floor(gameState.level * 0.5),
            damage: 5 + Math.floor(gameState.level * 0.2),
            color: `hsl(${Math.random() * 60}, 70%, 50%)`
        };

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

        // 添加敌人到游戏状态
        const currentState = this.engine.getState();
        this.engine.updateState({
            enemies: [...currentState.enemies, newEnemy]
        });
    }

    // 检测碰撞
    checkCollisions() {
        const gameState = this.engine.getState();

        // 检查玩家与敌人的碰撞
        const player = gameState.player;
        const updatedEnemies = [];
        let playerHit = false;

        for (const enemy of gameState.enemies) {
            // 计算距离
            const dx = player.x - enemy.x;
            const dy = player.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // 检查碰撞
            if (distance < (player.size/2 + enemy.size/2)) {
                // 玩家被击中
                playerHit = true;

                // 减少玩家生命值
                const updatedPlayer = {
                    ...player,
                    hp: player.hp - enemy.damage
                };

                // 检查玩家是否死亡
                if (updatedPlayer.hp <= 0) {
                    updatedPlayer.hp = 0;
                    updatedPlayer.isGameOver = true;
                    this.gameRunning = false;
                }

                this.engine.updateState({
                    player: updatedPlayer
                });
            } else {
                // 敌人没有碰撞，保留它
                updatedEnemies.push(enemy);
            }
        }

        // 如果敌人列表有变化，更新状态
        if (updatedEnemies.length !== gameState.enemies.length) {
            this.engine.updateState({
                enemies: updatedEnemies
            });
        }
    }

    // 检查游戏结束条件
    checkGameEndConditions() {
        const gameState = this.engine.getState();

        if (gameState.player.hp <= 0) {
            this.engine.updateState({
                player: {
                    ...gameState.player,
                    isGameOver: true,
                    isPlaying: false
                }
            });
            this.gameRunning = false;
            console.log("💀 游戏结束");
        }
    }

    // 更新UI
    updateUI() {
        // 更新分数显示
        const scoreElement = document.getElementById('score') || this.createUIElement('score', 'Score: 0', 'top-left');
        if (scoreElement) {
            scoreElement.textContent = `Score: ${this.engine.getState().player.score}`;
        }

        // 更新生命值显示
        const healthElement = document.getElementById('health') || this.createUIElement('health', 'HP: 100', 'top-left');
        if (healthElement) {
            healthElement.textContent = `HP: ${this.engine.getState().player.hp}`;
        }

        // 更新击杀数显示
        const killsElement = document.getElementById('kills') || this.createUIElement('kills', 'Kills: 0', 'top-left');
        if (killsElement) {
            killsElement.textContent = `Kills: ${this.engine.getState().kills}`;
        }

        // 更新等级显示
        const levelElement = document.getElementById('level') || this.createUIElement('level', 'Level: 1', 'top-left');
        if (levelElement) {
            levelElement.textContent = `Level: ${this.engine.getState().level}`;
        }

        // 如果游戏结束，显示结束界面
        if (this.engine.getState().player.isGameOver) {
            this.showGameOverScreen();
        }
    }

    // 创建UI元素
    createUIElement(id, text, position) {
        let element = document.getElementById(id);
        if (!element) {
            element = document.createElement('div');
            element.id = id;
            element.textContent = text;
            element.style.position = 'absolute';
            element.style.color = 'white';
            element.style.fontFamily = 'Arial, sans-serif';
            element.style.fontSize = '16px';
            element.style.padding = '5px';
            element.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            element.style.borderRadius = '3px';

            // 设置位置
            switch(position) {
                case 'top-left':
                    element.style.top = '10px';
                    element.style.left = '10px';
                    break;
                case 'top-right':
                    element.style.top = '10px';
                    element.style.right = '10px';
                    break;
                default:
                    element.style.top = '10px';
                    element.style.left = '10px';
            }

            document.body.appendChild(element);
        }
        return element;
    }

    // 显示游戏结束屏幕
    showGameOverScreen() {
        let gameOverElement = document.getElementById('gameOver');
        if (!gameOverElement) {
            gameOverElement = document.createElement('div');
            gameOverElement.id = 'gameOver';
            gameOverElement.innerHTML = `
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                            background: rgba(0, 0, 0, 0.8); color: white; padding: 30px;
                            border-radius: 10px; text-align: center; font-family: Arial, sans-serif;">
                    <h2 style="margin-top: 0;">Game Over!</h2>
                    <p>Final Score: ${this.engine.getState().player.score}</p>
                    <p>Kills: ${this.engine.getState().kills}</p>
                    <p>Press SPACE to restart</p>
                </div>
            `;
            document.body.appendChild(gameOverElement);
        }
    }

    // 渲染游戏画面
    render() {
        const gameState = this.engine.getState();

        // 清除画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制背景
        this.drawBackground();

        // 绘制玩家
        this.drawPlayer(gameState.player);

        // 绘制敌人
        gameState.enemies.forEach(enemy => {
            this.drawEnemy(enemy);
        });

        // 绘制物品（如果有的话）
        gameState.items.forEach(item => {
            this.drawItem(item);
        });

        // 如果游戏结束，添加视觉效果
        if (gameState.player.isGameOver) {
            this.drawGameOverEffect();
        }
    }

    // 绘制背景
    drawBackground() {
        // 创建渐变背景
        const gradient = this.ctx.createRadialGradient(
            this.canvas.width/2, this.canvas.height/2, 0,
            this.canvas.width/2, this.canvas.height/2, Math.max(this.canvas.width, this.canvas.height)/2
        );
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(1, '#0f0f1a');

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // 绘制玩家
    drawPlayer(player) {
        // 绘制玩家主体
        this.ctx.fillStyle = '#4ade80';
        this.ctx.beginPath();
        this.ctx.arc(player.x, player.y, player.size/2, 0, Math.PI * 2);
        this.ctx.fill();

        // 绘制玩家方向指示器（朝向鼠标）
        const gameState = this.engine.getState();
        const angle = Math.atan2(gameState.mouseY - player.y, gameState.mouseX - player.x);

        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(player.x, player.y);
        this.ctx.lineTo(
            player.x + Math.cos(angle) * (player.size/2 + 5),
            player.y + Math.sin(angle) * (player.size/2 + 5)
        );
        this.ctx.stroke();

        // 绘制玩家生命值条
        const healthPercent = player.hp / player.maxHp;
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(player.x - 20, player.y - player.size/2 - 15, 40, 6);
        this.ctx.fillStyle = healthPercent > 0.5 ? '#4ade80' : healthPercent > 0.25 ? '#fbbf24' : '#ef4444';
        this.ctx.fillRect(player.x - 20, player.y - player.size/2 - 15, 40 * healthPercent, 6);
    }

    // 绘制敌人
    drawEnemy(enemy) {
        // 绘制敌人主体
        this.ctx.fillStyle = enemy.color;
        this.ctx.beginPath();
        this.ctx.arc(enemy.x, enemy.y, enemy.size/2, 0, Math.PI * 2);
        this.ctx.fill();

        // 绘制敌人生命值条
        const hpPercent = enemy.hp / enemy.maxHp;
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(enemy.x - 20, enemy.y - enemy.size/2 - 10, 40, 6);
        this.ctx.fillStyle = '#f00';
        this.ctx.fillRect(enemy.x - 20, enemy.y - enemy.size/2 - 10, 40 * hpPercent, 6);
    }

    // 绘制物品
    drawItem(item) {
        this.ctx.fillStyle = '#ffff00';
        this.ctx.beginPath();
        this.ctx.arc(item.x, item.y, item.size, 0, Math.PI * 2);
        this.ctx.fill();
    }

    // 绘制游戏结束效果
    drawGameOverEffect() {
        // 半透明黑色覆盖层
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // 销毁游戏实例
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.gameRunning = false;

        // 清理事件监听器
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);

        console.log("🎮 游戏实例已销毁");
    }
}

// 初始化游戏
function initializeGame() {
    // 确保统一系统已加载
    if (!window.FinalGameSystem) {
        console.error("❌ 统一游戏系统未加载！");
        return;
    }

    // 创建游戏实例
    const game = new OptimizedRogueGame();

    // 初始化游戏
    game.init();

    // 将游戏实例存储到全局，方便外部访问
    window.OptimizedRogueGame = game;

    console.log("🎯 优化的Rogue游戏已准备就绪");

    // 添加开始游戏的按钮（如果没有的话）
    if (!document.getElementById('startButton')) {
        const startButton = document.createElement('button');
        startButton.id = 'startButton';
        startButton.textContent = '开始游戏';
        startButton.style.position = 'absolute';
        startButton.style.top = '10px';
        startButton.style.left = '50%';
        startButton.style.transform = 'translateX(-50%)';
        startButton.onclick = () => game.startGame();
        document.body.appendChild(startButton);
    }
}

// 页面加载完成后初始化游戏
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGame);
} else {
    initializeGame();
}

console.log("🚀 优化的主游戏文件加载完成");