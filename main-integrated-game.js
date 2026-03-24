/**
 * 主集成游戏文件 - 使用集成游戏系统
 * 统一游戏的主要逻辑、渲染和控制功能
 */

// 游戏主类
class MainIntegrativeGame {
    constructor() {
        // 使用全局集成系统
        this.engine = window.IntegratedGameSystem;
        
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

        // 特效和粒子系统
        this.particles = [];

        console.log("🎮 主集成游戏实例已创建");
    }

    // 初始化游戏
    init() {
        // 获取或创建canvas元素
        this.canvas = document.getElementById('gameCanvas') || this.createCanvas();
        
        if (!document.body.contains(this.canvas)) {
            document.body.appendChild(this.canvas);
        }

        this.ctx = this.canvas.getContext('2d');

        // 设置canvas大小
        this.resizeCanvas();

        // 绑定事件监听器
        this.setupEventListeners();

        console.log("✅ 主游戏初始化完成");
    }

    // 创建canvas元素
    createCanvas() {
        const canvas = document.createElement('canvas');
        canvas.id = 'gameCanvas';
        canvas.style.display = 'block';
        canvas.style.margin = '0 auto';
        canvas.style.border = '1px solid #333';
        canvas.style.backgroundColor = '#000';
        return canvas;
    }

    // 调整canvas大小
    resizeCanvas() {
        this.canvas.width = Math.min(window.innerWidth - 20, 800);
        this.canvas.height = Math.min(window.innerHeight - 20, 600);
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
            
            // 处理技能键
            if (['q', 'w', 'e', 'r'].includes(e.key.toLowerCase())) {
                this.handleSkillKey(e.key.toLowerCase());
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
            this.handleMouseClick(e);
        });

        this.canvas.addEventListener('mouseup', (e) => {
            this.mouse.pressed = false;
        });

        // 触摸事件（移动端支持）
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.touches[0].clientX - rect.left;
            this.mouse.y = e.touches[0].clientY - rect.top;

            this.engine.updateState({
                mouseX: this.mouse.x,
                mouseY: this.mouse.y
            });
        }, { passive: false });

        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.mouse.pressed = true;
            this.handleMouseClick(e);
        }, { passive: false });

        // 窗口大小调整
        window.addEventListener('resize', () => {
            this.resizeCanvas();
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

    // 处理技能键
    handleSkillKey(key) {
        const gameState = this.engine.getState();
        if (!gameState.player.isPlaying || gameState.player.isGameOver) return;

        // 更新技能使用统计
        const updatedSkills = { ...gameState.player.skillsUsed };
        updatedSkills[key.toUpperCase()] = updatedSkills[key.toUpperCase()] + 1;

        this.engine.updateState({
            player: {
                ...gameState.player,
                skillsUsed: updatedSkills
            }
        });

        // 技能效果处理（简单示例）
        switch(key) {
            case 'q':
                console.log("Q技能激活");
                break;
            case 'w':
                console.log("W技能激活");
                break;
            case 'e':
                console.log("E技能激活");
                break;
            case 'r':
                console.log("R技能激活");
                break;
        }
    }

    // 处理鼠标点击
    handleMouseClick(e) {
        const gameState = this.engine.getState();
        if (!gameState.player.isPlaying || gameState.player.isGameOver) return;

        // 攻击效果（简单示例）
        this.createParticles(this.mouse.x, this.mouse.y, '#ffff00', 5);
    }

    // 开始游戏
    startGame() {
        this.engine.updateState({
            player: {
                ...this.engine.getState().player,
                isPlaying: true,
                isGameOver: false,
                x: this.canvas.width / 2,
                y: this.canvas.height / 2
            },
            level: 1,
            kills: 0,
            enemies: [],
            items: [],
            startTime: Date.now(),
            enemySpawnTimer: 0,
            enemySpawnRate: 2000
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
                x: this.canvas.width / 2,
                y: this.canvas.height / 2,
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

        // 更新粒子系统
        this.updateParticles();

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

        // 限制移动范围，不能超出canvas边界
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

        // 从画布边缘生成敌人
        let spawnX, spawnY;
        const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
        
        switch(side) {
            case 0: // top
                spawnX = Math.random() * this.canvas.width;
                spawnY = -20;
                break;
            case 1: // right
                spawnX = this.canvas.width + 20;
                spawnY = Math.random() * this.canvas.height;
                break;
            case 2: // bottom
                spawnX = Math.random() * this.canvas.width;
                spawnY = this.canvas.height + 20;
                break;
            case 3: // left
                spawnX = -20;
                spawnY = Math.random() * this.canvas.height;
                break;
        }

        const newEnemy = {
            x: spawnX,
            y: spawnY,
            size: 20,
            speed: 1 + Math.random() * 2,
            hp: 10 + Math.floor(gameState.level * 0.5),
            maxHp: 10 + Math.floor(gameState.level * 0.5),
            damage: 5 + Math.floor(gameState.level * 0.2),
            color: `hsl(${Math.random() * 60}, 70%, 50%)`
        };

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
        const remainingEnemies = [];
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
                    hp: Math.max(0, player.hp - enemy.damage)
                };

                // 检查玩家是否死亡
                if (updatedPlayer.hp <= 0) {
                    updatedPlayer.hp = 0;
                    updatedPlayer.isGameOver = true;
                    this.gameRunning = false;
                    
                    // 更新统计数据
                    this.engine.updateState({
                        player: updatedPlayer,
                        totalGames: gameState.totalGames + 1,
                        totalDamageTaken: gameState.totalDamageTaken + enemy.damage
                    });
                    
                    this.showGameOverScreen();
                    return; // 提前退出，因为游戏结束了
                }

                this.engine.updateState({
                    player: updatedPlayer,
                    totalDamageTaken: gameState.totalDamageTaken + enemy.damage
                });
                
                // 添加撞击特效
                this.createParticles(enemy.x, enemy.y, '#ff5555', 8);
            } else {
                // 敌人没有碰撞，保留它
                remainingEnemies.push(enemy);
            }
        }

        // 如果敌人列表有变化，更新状态
        if (remainingEnemies.length !== gameState.enemies.length) {
            this.engine.updateState({
                enemies: remainingEnemies
            });
        }

        // 检查是否有敌人被击败
        if (remainingEnemies.length < gameState.enemies.length) {
            const defeatedCount = gameState.enemies.length - remainingEnemies.length;
            const updatedKills = gameState.kills + defeatedCount;
            
            // 更新击杀数和分数
            this.engine.updateState({
                kills: updatedKills,
                player: {
                    ...player,
                    score: player.score + defeatedCount * 10,
                    currentCombo: player.currentCombo + defeatedCount
                }
            });
            
            // 检查连击奖励
            if (player.currentCombo > player.maxCombo) {
                this.engine.updateState({
                    player: {
                        ...player,
                        maxCombo: player.currentCombo
                    }
                });
            }
            
            // 检查升级条件
            if (updatedKills > 0 && updatedKills % 10 === 0) {
                this.levelUp();
            }
        }
    }

    // 玩家升级
    levelUp() {
        const gameState = this.engine.getState();
        const newLevel = gameState.level + 1;
        
        this.engine.updateState({
            level: newLevel,
            player: {
                ...gameState.player,
                hp: Math.min(gameState.player.maxHp, gameState.player.hp + 20), // 恢复一些生命值
                speed: gameState.player.speed + 0.2 // 略微增加速度
            }
        });
        
        // 添加升级特效
        this.createParticles(
            gameState.player.x, 
            gameState.player.y, 
            '#00ff00', 
            15
        );
        
        console.log(`🎉 玩家升级到第 ${newLevel} 级!`);
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
                },
                totalGames: gameState.totalGames + 1
            });
            this.gameRunning = false;
            console.log("💀 游戏结束");
        }
    }

    // 更新UI
    updateUI() {
        // 更新分数显示
        this.updateOrCreateUIElement('score', `Score: ${this.engine.getState().player.score}`, 'top-left');
        
        // 更新生命值显示
        const healthPercent = (this.engine.getState().player.hp / this.engine.getState().player.maxHp) * 100;
        this.updateOrCreateUIElement('health', `HP: ${this.engine.getState().player.hp}/${this.engine.getState().player.maxHp} (${Math.round(healthPercent)}%)`, 'top-left');
        
        // 更新击杀数显示
        this.updateOrCreateUIElement('kills', `Kills: ${this.engine.getState().player.kills || this.engine.getState().kills}`, 'top-left');
        
        // 更新等级显示
        this.updateOrCreateUIElement('level', `Level: ${this.engine.getState().level}`, 'top-left');
        
        // 更新FPS显示（如果性能监控可用）
        if (this.engine.performanceMonitor) {
            const fps = this.engine.performanceMonitor.getFPS();
            this.updateOrCreateUIElement('fps', `FPS: ${fps}`, 'top-right');
        }
    }

    // 更新或创建UI元素
    updateOrCreateUIElement(id, text, position) {
        let element = document.getElementById(id);
        if (!element) {
            element = document.createElement('div');
            element.id = id;
            element.style.position = 'absolute';
            element.style.color = 'white';
            element.style.fontFamily = 'Arial, sans-serif';
            element.style.fontSize = '14px';
            element.style.padding = '5px 10px';
            element.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
            element.style.borderRadius = '4px';
            element.style.zIndex = '100';
            element.style.userSelect = 'none';

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
                case 'bottom-left':
                    element.style.bottom = '10px';
                    element.style.left = '10px';
                    break;
                case 'bottom-right':
                    element.style.bottom = '10px';
                    element.style.right = '10px';
                    break;
                default:
                    element.style.top = '10px';
                    element.style.left = '10px';
            }

            document.body.appendChild(element);
        }
        
        element.textContent = text;
        return element;
    }

    // 显示游戏结束屏幕
    showGameOverScreen() {
        // 移除旧的游戏结束屏幕（如果存在）
        const oldGameOver = document.getElementById('gameOver');
        if (oldGameOver) {
            oldGameOver.remove();
        }

        const gameOverElement = document.createElement('div');
        gameOverElement.id = 'gameOver';
        gameOverElement.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                        background: rgba(0, 0, 0, 0.8); display: flex; justify-content: center; 
                        align-items: center; z-index: 1000; color: white; 
                        font-family: Arial, sans-serif;">
                <div style="text-align: center; background: rgba(30, 30, 46, 0.9); 
                            padding: 30px; border-radius: 10px; box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);">
                    <h2 style="color: #ef4444; margin-top: 0;">Game Over!</h2>
                    <p style="font-size: 18px;">Final Score: <strong>${this.engine.getState().player.score}</strong></p>
                    <p>Kills: ${this.engine.getState().kills}</p>
                    <p>Level Reached: ${this.engine.getState().level}</p>
                    <p>Play Time: ${(this.engine.getState().sessionTime / 1000).toFixed(1)}s</p>
                    <p style="margin: 20px 0;">Press SPACE or click anywhere to restart</p>
                    <button id="restartButton" style="padding: 10px 20px; font-size: 16px; 
                             background: #4ade80; color: black; border: none; 
                             border-radius: 5px; cursor: pointer;">Restart Game</button>
                </div>
            </div>
        `;
        document.body.appendChild(gameOverElement);

        // 添加重新开始按钮事件
        document.getElementById('restartButton').onclick = () => {
            this.restartGame();
            gameOverElement.remove();
        };

        // 点击任意位置重新开始
        gameOverElement.onclick = (e) => {
            if (e.target === gameOverElement) {
                this.restartGame();
                gameOverElement.remove();
            }
        };
    }

    // 创建粒子效果
    createParticles(x, y, color, count) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 2 + 1;
            const life = Math.random() * 30 + 20; // 生命周期
            
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                radius: Math.random() * 3 + 1,
                color: color,
                life: life,
                maxLife: life
            });
        }
    }

    // 更新粒子系统
    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            
            // 更新位置
            p.x += p.vx;
            p.y += p.vy;
            
            // 减少生命周期
            p.life--;
            
            // 如果生命周期结束，移除粒子
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    // 渲染游戏画面
    render() {
        const gameState = this.engine.getState();

        // 清除画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 绘制背景
        this.drawBackground();

        // 绘制粒子效果
        this.drawParticles();

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
        
        // 添加网格效果
        this.ctx.strokeStyle = 'rgba(100, 100, 150, 0.1)';
        this.ctx.lineWidth = 1;
        
        const gridSize = 40;
        for (let x = 0; x < this.canvas.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        for (let y = 0; y < this.canvas.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    // 绘制粒子
    drawParticles() {
        this.particles.forEach(p => {
            const alpha = p.life / p.maxLife; // 根据剩余生命计算透明度
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.globalAlpha = 1; // 重置透明度
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

    // 销毁游戏实例
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.gameRunning = false;

        // 清理事件监听器
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);

        console.log("🎮 主游戏实例已销毁");
    }
}

// 初始化游戏
function initializeIntegrativeGame() {
    // 确保集成系统已加载
    if (!window.IntegratedGameSystem) {
        console.error("❌ 集成游戏系统未加载！");
        return;
    }

    // 创建游戏实例
    const game = new MainIntegrativeGame();

    // 初始化游戏
    game.init();

    // 将游戏实例存储到全局，方便外部访问
    window.MainIntegrativeGame = game;

    console.log("🎯 主集成游戏已准备就绪");

    // 添加开始游戏的按钮（如果没有的话）
    if (!document.getElementById('startButton')) {
        const startButton = document.createElement('button');
        startButton.id = 'startButton';
        startButton.textContent = '开始游戏';
        startButton.style.position = 'absolute';
        startButton.style.top = '10px';
        startButton.style.left = '50%';
        startButton.style.transform = 'translateX(-50%)';
        startButton.style.padding = '10px 20px';
        startButton.style.fontSize = '16px';
        startButton.style.background = '#4ade80';
        startButton.style.color = 'black';
        startButton.style.border = 'none';
        startButton.style.borderRadius = '5px';
        startButton.style.cursor = 'pointer';
        startButton.style.zIndex = '100';
        startButton.onclick = () => {
            if (window.MainIntegrativeGame) {
                window.MainIntegrativeGame.startGame();
                startButton.style.display = 'none';
            }
        };
        document.body.appendChild(startButton);
    }
    
    return game;
}

// 页面加载完成后初始化游戏
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeIntegrativeGame);
} else {
    initializeIntegrativeGame();
}

console.log("🚀 主集成游戏文件加载完成");
