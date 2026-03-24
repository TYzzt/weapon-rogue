/**
 * Rogue游戏性能优化器
 * 将多个模块整合到一个文件中，减少HTTP请求，提升加载速度
 */

// 首先定义基础模块系统
class UnifiedGameSystem {
    constructor() {
        // 统一的游戏状态管理 - 单一数据源
        this.state = {
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
            // 额外的状态属性
            highestLevel: 1,
            totalKills: 0,
            totalGames: 1,
            winCount: 0,
            highScores: [],
            weaponStats: {},
            totalPlayTime: 0,
            gamesPlayed: 0,
            totalDamageDealt: 0,
            totalDamageTaken: 0,
            achievementCount: 0,
            regionsDiscovered: 0,
            modesAttempted: 0,
            secretFound: false,
            easterEggsFound: 0,
            collectedCommonWeapons: 0,
            legendaryWeaponsObtained: 0,
            mythicWeaponsObtained: 0,
            rarestWeaponObtained: { rarity: 0 },
            currentKillStreak: 0,
            maxSingleHitDamage: 0,
            // 特殊事件状态
            homeEnemySurge: false,
            officeEnemySurge: false,
            quantumReality: false,
            toolEmpowerment: 1.0
        };

        // 模块注册表
        this.modules = new Map();

        // 已加载模块集合
        this.loadedModules = new Set();

        // 模块依赖图
        this.dependencies = new Map();

        // 事件总线
        this.eventBus = new EventBus();

        // 标记是否已初始化
        this.initialized = false;

        // 性能监控
        this.performanceMonitor = new PerformanceMonitor();

        console.log("🎮 统一游戏系统已初始化");
    }

    /**
     * 注册模块及其依赖关系
     */
    registerModule(name, moduleObj, dependencies = []) {
        // 检查模块是否已经注册
        if (this.modules.has(name)) {
            console.warn(`⚠️ 模块 ${name} 已存在，正在覆盖`);
        }

        // 检查循环依赖
        if (this.wouldCreateCycle(name, dependencies)) {
            console.warn(`⚠️ 检测到循环依赖: ${name} 依赖于 ${dependencies.join(', ')}`);
            return false;
        }

        // 设置依赖关系
        this.dependencies.set(name, [...dependencies]);

        // 如果模块对象有初始化方法，则调用它
        if (moduleObj && typeof moduleObj.init === 'function') {
            moduleObj.init(this);
        }

        this.modules.set(name, moduleObj);
        this.loadedModules.add(name);

        // 发布模块加载事件
        this.eventBus.emit('moduleRegistered', { name, moduleObj });

        console.log(`✅ 模块 ${name} 已注册`);

        return true;
    }

    /**
     * 获取模块
     */
    getModule(name) {
        return this.modules.get(name);
    }

    /**
     * 获取多个模块
     */
    getModules(names) {
        const result = {};
        for (const name of names) {
            result[name] = this.modules.get(name);
        }
        return result;
    }

    /**
     * 检查是否会创建循环依赖
     */
    wouldCreateCycle(newModule, newDependencies) {
        // 简单的循环依赖检测
        for (const dep of newDependencies) {
            const transitiveDeps = this.getAllDependencies(dep);
            if (transitiveDeps.has(newModule)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 获取模块的所有传递依赖
     */
    getAllDependencies(moduleName) {
        const allDeps = new Set();
        const toCheck = [...(this.dependencies.get(moduleName) || [])];

        while (toCheck.length > 0) {
            const dep = toCheck.pop();
            if (!allDeps.has(dep)) {
                allDeps.add(dep);
                const childDeps = this.dependencies.get(dep) || [];
                childDeps.forEach(childDep => {
                    if (!allDeps.has(childDep)) {
                        toCheck.push(childDep);
                    }
                });
            }
        }

        return allDeps;
    }

    /**
     * 安全更新游戏状态
     */
    updateState(updates) {
        this.deepMerge(this.state, updates);
    }

    /**
     * 获取游戏状态
     */
    getState() {
        return this.state;
    }

    /**
     * 深度合并对象
     */
    deepMerge(target, source) {
        for (const key in source) {
            if (source.hasOwnProperty(key)) {
                if (
                    source[key] &&
                    typeof source[key] === 'object' &&
                    !Array.isArray(source[key]) &&
                    target[key] &&
                    typeof target[key] === 'object' &&
                    !Array.isArray(target[key])
                ) {
                    this.deepMerge(target[key], source[key]);
                } else {
                    target[key] = source[key];
                }
            }
        }
    }

    /**
     * 获取所有已加载的模块名称
     */
    getLoadedModuleNames() {
        return Array.from(this.loadedModules);
    }

    /**
     * 初始化所有模块
     */
    initializeAllModules() {
        if (this.initialized) {
            console.warn("⚠️ 游戏系统已经初始化过了");
            return;
        }

        const moduleNames = this.getLoadedModuleNames();
        for (const name of moduleNames) {
            const module = this.getModule(name);
            if (module && typeof module.onGameStart === 'function') {
                try {
                    module.onGameStart();
                } catch (error) {
                    console.error(`❌ 模块 ${name} 初始化失败:`, error);
                }
            }
        }

        this.initialized = true;
        console.log("🎮 所有模块已初始化完成");
    }

    /**
     * 检查模块是否已加载
     */
    isModuleLoaded(name) {
        return this.loadedModules.has(name);
    }

    /**
     * 安全清理所有模块，避免内存泄漏
     */
    cleanup() {
        this.modules.clear();
        this.loadedModules.clear();
        this.dependencies.clear();
        this.eventBus.clearAllListeners();
        this.initialized = false;
        console.log("🗑️ 游戏系统已清理");
    }
}

/**
 * 事件总线 - 用于模块间通信
 */
class EventBus {
    constructor() {
        this.listeners = new Map();
    }

    /**
     * 订阅事件
     */
    subscribe(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    /**
     * 发布事件
     */
    emit(event, data) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`❌ 事件 ${event} 的监听器出错:`, error);
                }
            });
        }
    }

    /**
     * 取消订阅
     */
    unsubscribe(event, callback) {
        if (this.listeners.has(event)) {
            const index = this.listeners.get(event).indexOf(callback);
            if (index > -1) {
                this.listeners.get(event).splice(index, 1);
            }
        }
    }

    /**
     * 清除所有监听器
     */
    clearAllListeners() {
        this.listeners.clear();
    }
}

/**
 * 性能监控器 - 用于追踪模块性能
 */
class PerformanceMonitor {
    constructor() {
        this.frameTimes = [];
        this.moduleTimings = new Map();
        this.lastFrameTime = 0;
    }

    startFrame() {
        this.lastFrameTime = performance.now();
        return this.lastFrameTime;
    }

    endFrame() {
        const frameTime = performance.now() - this.lastFrameTime;
        this.frameTimes.push(frameTime);

        // 只保留最近100个帧时间
        if (this.frameTimes.length > 100) {
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

    startModuleMeasurement(moduleName) {
        const startTime = performance.now();
        if (!this.moduleTimings.has(moduleName)) {
            this.moduleTimings.set(moduleName, []);
        }
        return { moduleName, startTime };
    }

    endModuleMeasurement(measurement) {
        const endTime = performance.now();
        const duration = endTime - measurement.startTime;

        const timings = this.moduleTimings.get(measurement.moduleName) || [];
        timings.push(duration);

        // 只保留最近50次测量
        if (timings.length > 50) {
            timings.shift();
        }

        this.moduleTimings.set(measurement.moduleName, timings);
    }

    getAverageModuleTime(moduleName) {
        const timings = this.moduleTimings.get(moduleName) || [];
        if (timings.length === 0) return 0;
        const sum = timings.reduce((a, b) => a + b, 0);
        return sum / timings.length;
    }
}

// 创建全局统一游戏系统实例（只创建一次，避免重复）
if (typeof window !== 'undefined') {
    // 防止重复初始化
    if (!window.OptimizedGameSystem) {
        window.OptimizedGameSystem = new UnifiedGameSystem();
        window.gameState = window.OptimizedGameSystem.getState();

        // 为了向后兼容，也设置到其他常见的全局变量名
        window.GameEngine = window.OptimizedGameSystem;
        window.GameSystem = window.OptimizedGameSystem;
        window.GameManager = window.OptimizedGameSystem;

        console.log("🔄 性能优化游戏系统已准备就绪");
    } else {
        console.warn("⚠️ OptimizedGameSystem已被初始化");
    }
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

// 创建音频模块类
class AudioSystem {
    constructor() {
        this.name = 'AudioSystem';
        this.sounds = new Map();
        this.enabled = true;
    }

    init(system) {
        this.system = system;
        console.log('🎵 音频系统模块已初始化');
    }

    playSound(soundName) {
        if (!this.enabled) return;

        // 这里应该是实际的音频播放逻辑
        console.log(`🔊 播放音效: ${soundName}`);
    }

    toggle(enabled) {
        this.enabled = !!enabled;
        console.log(`🔊 音频系统: ${this.enabled ? '开启' : '关闭'}`);
    }

    onGameStart() {
        console.log('🎬 音频系统启动');
    }
}

// 创建成就系统模块类
class AchievementSystem {
    constructor() {
        this.name = 'AchievementSystem';
        this.achievements = [];
    }

    init(system) {
        this.system = system;
        console.log('🏆 成就系统模块已初始化');

        // 定义默认成就
        this.defaultAchievements = [
            { id: 'first_blood', name: '首杀', description: '击杀第一个敌人', achieved: false },
            { id: 'survivor', name: '幸存者', description: '存活超过5分钟', achieved: false },
            { id: 'slayer', name: '屠夫', description: '击杀50个敌人', achieved: false },
            { id: 'collector', name: '收藏家', description: '收集10件物品', achieved: false }
        ];
    }

    checkAchievements() {
        const gameState = this.system.getState();

        this.defaultAchievements.forEach(achievement => {
            if (!achievement.achieved) {
                switch(achievement.id) {
                    case 'first_blood':
                        if (gameState.kills >= 1) {
                            this.unlockAchievement(achievement.id);
                        }
                        break;
                    case 'slayer':
                        if (gameState.kills >= 50) {
                            this.unlockAchievement(achievement.id);
                        }
                        break;
                    case 'collector':
                        // 这里应该基于收集的物品数量判断
                        break;
                }
            }
        });
    }

    unlockAchievement(id) {
        const achievement = this.defaultAchievements.find(a => a.id === id);
        if (achievement && !achievement.achieved) {
            achievement.achieved = true;
            console.log(`🎉 解锁成就: ${achievement.name}`);

            // 发送事件通知其他模块
            this.system.eventBus.emit('achievementUnlocked', achievement);
        }
    }

    onGameStart() {
        console.log('🎬 成就系统启动');
    }
}

// 创建保存系统模块类
class SaveSystem {
    constructor() {
        this.name = 'SaveSystem';
        this.saveKey = 'rogue_game_save';
    }

    init(system) {
        this.system = system;
        console.log('💾 保存系统模块已初始化');
    }

    saveGame() {
        const gameState = this.system.getState();
        const saveData = {
            version: '1.0',
            timestamp: Date.now(),
            gameState: {
                ...gameState,
                // 排除一些不适合保存的数据
                enemies: [],  // 不保存实时敌人位置
                items: []     // 不保存实时物品位置
            }
        };

        try {
            localStorage.setItem(this.saveKey, JSON.stringify(saveData));
            console.log('💾 游戏已保存');
            return true;
        } catch (error) {
            console.error('❌ 保存游戏失败:', error);
            return false;
        }
    }

    loadGame() {
        try {
            const saveData = localStorage.getItem(this.saveKey);
            if (saveData) {
                const parsedData = JSON.parse(saveData);

                if (parsedData.version) {
                    // 恢复游戏状态（排除敌人和物品）
                    const currentState = this.system.getState();
                    Object.assign(currentState, parsedData.gameState);

                    console.log('📥 游戏已加载');
                    return true;
                }
            }
        } catch (error) {
            console.error('❌ 加载游戏失败:', error);
        }

        return false;
    }

    onGameStart() {
        console.log('🎬 保存系统启动');
    }
}

// 集成游戏系统
class IntegratedGameSystem {
    constructor() {
        this.name = 'IntegratedGameSystem';
        this.initialized = false;

        // 系统引用
        this.moduleSystem = null;
        this.coreModule = null;
        this.saveModule = null;
        this.achievementModule = null;
        this.audioModule = null;
        this.menuModule = null;

        console.log('🎮 集成游戏系统已创建');
    }

    /**
     * 初始化游戏系统
     */
    init(system) {
        this.moduleSystem = system;

        // 获取所有必要的模块
        this.coreModule = system.getModule('core');
        this.saveModule = system.getModule('save');
        this.achievementModule = system.getModule('achievements');
        this.audioModule = system.getModule('audio');
        this.menuModule = system.getModule('menu') || null; // 菜单模块可能不存在

        // 验证所有必要模块是否可用
        const modulesReady = this.validateModules();

        if (!modulesReady) {
            console.error('❌ 部分模块不可用，可能影响游戏功能');
            return false;
        }

        this.initialized = true;
        console.log('✅ 集成游戏系统已初始化');

        // 设置模块间通信
        this.setupInterModuleCommunication();

        return true;
    }

    /**
     * 验证所有模块是否正确加载
     */
    validateModules() {
        const requiredModules = [
            { name: 'core', module: this.coreModule, methods: ['startGame', 'update', 'draw'] },
            { name: 'save', module: this.saveModule, methods: ['saveGame', 'loadGame'] },
            { name: 'achievements', module: this.achievementModule, methods: ['checkAchievements', 'unlockAchievement'] },
            { name: 'audio', module: this.audioModule, methods: ['playSound', 'toggle'] }
        ];

        let allValid = true;

        for (const req of requiredModules) {
            if (!req.module) {
                console.error(`❌ ${req.name} 模块未找到`);
                allValid = false;
                continue;
            }

            // 检查必要方法是否存在
            for (const method of req.methods) {
                if (typeof req.module[method] !== 'function') {
                    console.warn(`⚠️ ${req.name} 模块缺少方法: ${method}`);
                }
            }
        }

        return allValid;
    }

    /**
     * 设置模块间通信
     */
    setupInterModuleCommunication() {
        const eventBus = this.moduleSystem.eventBus;

        // 监听游戏事件
        eventBus.subscribe('gameStarted', (data) => {
            console.log('🎮 游戏已开始');
            // 开始自动保存
            if (this.saveModule && typeof this.saveModule.enableAutoSave === 'function') {
                this.saveModule.enableAutoSave();
            }
        });

        eventBus.subscribe('gameOver', (data) => {
            console.log('💀 游戏结束');
            // 检查最终成就
            if (this.achievementModule) {
                this.achievementModule.checkAchievements();
            }
        });

        eventBus.subscribe('playerDamaged', (data) => {
            // 播放受伤音效
            if (this.audioModule) {
                this.audioModule.playSound('player_hit', 0.5);
            }
        });

        eventBus.subscribe('enemyDefeated', (data) => {
            // 播放击败敌人音效
            if (this.audioModule) {
                this.audioModule.playSound('enemy_defeat', 0.7);
            }
        });

        eventBus.subscribe('achievementUnlocked', (data) => {
            console.log(`🎉 成就解锁: ${data.name}`);
            // 播放成就解锁音效
            if (this.audioModule) {
                this.audioModule.playSound('achievement_unlocked', 0.8);
            }
        });

        eventBus.subscribe('itemCollected', (data) => {
            // 播放收集物品音效
            if (this.audioModule) {
                this.audioModule.playSound('item_collected', 0.6);
            }
        });

        console.log('📡 模块间通信已设置');
    }

    /**
     * 启动游戏
     */
    startGame() {
        if (!this.initialized) {
            console.error('❌ 游戏系统未初始化');
            return false;
        }

        // 通知所有相关模块游戏开始
        if (this.coreModule && typeof this.coreModule.startGame === 'function') {
            this.coreModule.startGame();
        }

        // 检查已有成就
        if (this.achievementModule) {
            this.achievementModule.checkAchievements();
        }

        console.log('🚀 游戏已启动');
        return true;
    }

    /**
     * 重启游戏
     */
    restartGame() {
        if (!this.initialized) {
            console.error('❌ 游戏系统未初始化');
            return false;
        }

        // 使用核心模块重启
        if (this.coreModule && typeof this.coreModule.restartGame === 'function') {
            this.coreModule.restartGame();
            return true;
        }

        // 如果核心模块没有重启功能，则手动重置
        const gameState = this.moduleSystem.getState();

        // 重置玩家状态
        Object.assign(gameState.player, {
            x: 400, // canvas width / 2
            y: 300, // canvas height / 2
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
        });

        // 重置游戏状态
        gameState.level = 1;
        gameState.kills = 0;
        gameState.enemies = [];
        gameState.items = [];
        gameState.enemySpawnTimer = 0;
        gameState.enemySpawnRate = 2000;
        gameState.combatLog = [];
        gameState.startTime = Date.now();
        gameState.sessionTime = 0;

        console.log('🔄 游戏已重启');
        return true;
    }

    /**
     * 暂停游戏
     */
    pauseGame() {
        if (!this.initialized) {
            console.error('❌ 游戏系统未初始化');
            return false;
        }

        if (this.coreModule && typeof this.coreModule.pauseGame === 'function') {
            this.coreModule.pauseGame();
            return true;
        }

        return false;
    }

    /**
     * 恢复游戏
     */
    resumeGame() {
        if (!this.initialized) {
            console.error('❌ 游戏系统未初始化');
            return false;
        }

        if (this.coreModule && typeof this.coreModule.resumeGame === 'function') {
            this.coreModule.resumeGame();
            return true;
        }

        return false;
    }

    /**
     * 保存游戏
     */
    saveGame() {
        if (!this.initialized || !this.saveModule) {
            console.error('❌ 无法保存游戏');
            return false;
        }

        if (typeof this.saveModule.saveGame === 'function') {
            return this.saveModule.saveGame();
        }

        return false;
    }

    /**
     * 加载游戏
     */
    loadGame() {
        if (!this.initialized || !this.saveModule) {
            console.error('❌ 无法加载游戏');
            return false;
        }

        if (typeof this.saveModule.loadGame === 'function') {
            return this.saveModule.loadGame();
        }

        return false;
    }

    /**
     * 获取游戏统计信息
     */
    getStatistics() {
        if (!this.initialized) {
            return null;
        }

        const gameState = this.moduleSystem.getState();

        return {
            level: gameState.level,
            kills: gameState.kills,
            score: gameState.player.score,
            hp: gameState.player.hp,
            maxCombo: gameState.player.maxCombo,
            playTime: gameState.sessionTime,
            achievements: {
                total: this.achievementModule ? this.achievementModule.getTotalAchievementsCount() : 0,
                unlocked: this.achievementModule ? this.achievementModule.getUnlockedAchievementsCount() : 0
            }
        };
    }

    /**
     * 游戏主循环
     */
    gameLoop() {
        if (!this.initialized) {
            return;
        }

        // 更新游戏状态
        if (this.coreModule && typeof this.coreModule.update === 'function') {
            const deltaTime = 16; // 约60fps
            this.coreModule.update(deltaTime);
        }

        // 绘制游戏画面
        if (this.coreModule && typeof this.coreModule.draw === 'function') {
            this.coreModule.draw();
        }

        // 检查成就
        if (this.achievementModule) {
            this.achievementModule.checkAchievements();
        }

        // 继续下一帧
        requestAnimationFrame(() => this.gameLoop());
    }

    /**
     * 当游戏开始时执行
     */
    onGameStart() {
        console.log('🎬 集成游戏系统启动');

        // 启动游戏循环
        this.gameLoop();
    }
}

// 注册核心游戏模块
setTimeout(() => {
    if (window.OptimizedGameSystem) {
        // 注册核心模块
        const coreMechanics = new GameCore();
        const audioSystem = new AudioSystem();
        const achievementSystem = new AchievementSystem();
        const saveSystem = new SaveSystem();
        const integratedSystem = new IntegratedGameSystem();

        // 注册模块到统一系统
        window.OptimizedGameSystem.registerModule('core', coreMechanics);
        window.OptimizedGameSystem.registerModule('audio', audioSystem);
        window.OptimizedGameSystem.registerModule('achievements', achievementSystem);
        window.OptimizedGameSystem.registerModule('save', saveSystem);
        window.OptimizedGameSystem.registerModule('integrated', integratedSystem);

        // 启动所有模块
        window.OptimizedGameSystem.initializeAllModules();

        console.log('🎮 所有游戏模块已注册并初始化');
    } else {
        console.error('❌ 统一游戏系统未找到');
    }
}, 0);

// 设置全局接口以保证向后兼容
window.RogueGame = {
    startGame: () => {
        const integratedSystem = window.OptimizedGameSystem.getModule('integrated');
        if (integratedSystem && typeof integratedSystem.startGame === 'function') {
            return integratedSystem.startGame();
        }
        // Fallback to core module
        const coreModule = window.OptimizedGameSystem.getModule('core');
        if (coreModule && typeof coreModule.startGame === 'function') {
            return coreModule.startGame();
        }
        // Fallback to global function
        if (window.startGame) {
            return window.startGame();
        }
        return false;
    },

    restartGame: () => {
        const integratedSystem = window.OptimizedGameSystem.getModule('integrated');
        if (integratedSystem && typeof integratedSystem.restartGame === 'function') {
            return integratedSystem.restartGame();
        }
        // Fallback to core module
        const coreModule = window.OptimizedGameSystem.getModule('core');
        if (coreModule && typeof coreModule.restartGame === 'function') {
            return coreModule.restartGame();
        }
        // Fallback to global function
        if (window.restartGame) {
            return window.restartGame();
        }
        return false;
    },

    pauseGame: () => {
        const integratedSystem = window.OptimizedGameSystem.getModule('integrated');
        if (integratedSystem && typeof integratedSystem.pauseGame === 'function') {
            return integratedSystem.pauseGame();
        }
        return false;
    },

    resumeGame: () => {
        const integratedSystem = window.OptimizedGameSystem.getModule('integrated');
        if (integratedSystem && typeof integratedSystem.resumeGame === 'function') {
            return integratedSystem.resumeGame();
        }
        return false;
    },

    saveGame: () => {
        const integratedSystem = window.OptimizedGameSystem.getModule('integrated');
        if (integratedSystem && typeof integratedSystem.saveGame === 'function') {
            return integratedSystem.saveGame();
        }
        // Fallback to save module
        const saveModule = window.OptimizedGameSystem.getModule('save');
        if (saveModule && typeof saveModule.saveGame === 'function') {
            return saveModule.saveGame();
        }
        // Fallback to global function
        if (window.saveGame) {
            return window.saveGame();
        }
        return false;
    },

    loadGame: () => {
        const integratedSystem = window.OptimizedGameSystem.getModule('integrated');
        if (integratedSystem && typeof integratedSystem.loadGame === 'function') {
            return integratedSystem.loadGame();
        }
        // Fallback to save module
        const saveModule = window.OptimizedGameSystem.getModule('save');
        if (saveModule && typeof saveModule.loadGame === 'function') {
            return saveModule.loadGame();
        }
        // Fallback to global function
        if (window.loadGame) {
            return window.loadGame();
        }
        return false;
    },

    getStatistics: () => {
        const integratedSystem = window.OptimizedGameSystem.getModule('integrated');
        if (integratedSystem && typeof integratedSystem.getStatistics === 'function') {
            return integratedSystem.getStatistics();
        }
        return null;
    },

    getState: () => {
        if (window.OptimizedGameSystem) {
            return window.OptimizedGameSystem.getState();
        }
        return null;
    },

    getModule: (name) => {
        if (window.OptimizedGameSystem) {
            return window.OptimizedGameSystem.getModule(name);
        }
        return null;
    }
};

console.log('🔄 性能优化版游戏系统已准备就绪');