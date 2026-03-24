/**
 * 集成游戏系统 - 统一所有游戏功能，解决模块冲突
 * 整合了之前的多个系统，形成单一、高效的游戏引擎
 */

class IntegratedGameSystem {
    constructor() {
        // 单一游戏状态源
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
            // 额外统计信息
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

        // 模块系统
        this.modules = new Map();
        this.loadedModules = new Set();
        this.dependencies = new Map();

        // 事件系统
        this.eventBus = new EventBus();

        // 性能监控
        this.performanceMonitor = new PerformanceMonitor();

        // 物理和游戏逻辑组件
        this.physics = new PhysicsEngine();
        this.spawner = new EnemySpawner();
        this.renderer = new RenderEngine();
        this.collisionSystem = new CollisionSystem();

        console.log("🎮 集成游戏系统已初始化");
    }

    /**
     * 注册模块
     */
    registerModule(name, moduleObj, dependencies = []) {
        if (this.modules.has(name)) {
            console.warn(`⚠️ 模块 ${name} 已存在，正在覆盖`);
        }

        // 检查循环依赖
        if (this.wouldCreateCycle(name, dependencies)) {
            console.warn(`⚠️ 检测到循环依赖: ${name} 依赖于 ${dependencies.join(', ')}`);
            return false;
        }

        this.dependencies.set(name, [...dependencies]);

        if (moduleObj && typeof moduleObj.init === 'function') {
            moduleObj.init(this);
        }

        this.modules.set(name, moduleObj);
        this.loadedModules.add(name);

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
     * 检查循环依赖
     */
    wouldCreateCycle(newModule, newDependencies) {
        for (const dep of newDependencies) {
            const transitiveDeps = this.getAllDependencies(dep);
            if (transitiveDeps.has(newModule)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 获取所有依赖
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
     * 更新游戏状态
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
     * 深度合并
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
     * 初始化所有模块
     */
    initializeAllModules() {
        const moduleNames = Array.from(this.loadedModules);
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
        console.log("🎮 所有模块已初始化完成");
    }

    /**
     * 获取模块名称列表
     */
    getLoadedModuleNames() {
        return Array.from(this.loadedModules);
    }

    /**
     * 检查模块是否已加载
     */
    isModuleLoaded(name) {
        return this.loadedModules.has(name);
    }
}

/**
 * 事件总线
 */
class EventBus {
    constructor() {
        this.listeners = new Map();
    }

    subscribe(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

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

    unsubscribe(event, callback) {
        if (this.listeners.has(event)) {
            const index = this.listeners.get(event).indexOf(callback);
            if (index > -1) {
                this.listeners.get(event).splice(index, 1);
            }
        }
    }
}

/**
 * 性能监控器
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

/**
 * 物理引擎
 */
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

/**
 * 敌人生成器
 */
class EnemySpawner {
    constructor() {
        this.spawnRate = 2000;
        this.lastSpawnTime = 0;
        this.difficultyMultiplier = 1.0;
    }

    update(currentTime, gameState) {
        if (currentTime - this.lastSpawnTime >= this.spawnRate) {
            this.spawnEnemy(gameState);
            this.lastSpawnTime = currentTime;

            this.spawnRate = Math.max(200, 2000 - gameState.kills * 2);
        }
    }

    spawnEnemy(gameState) {
        const canvas = document.getElementById('gameCanvas');
        if (!canvas) return;

        const newEnemy = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: 20,
            speed: 1 + Math.random() * 2,
            hp: 10 + Math.floor(gameState.level * 0.5),
            maxHp: 10 + Math.floor(gameState.level * 0.5),
            damage: 5 + Math.floor(gameState.level * 0.2),
            color: `hsl(${Math.random() * 60}, 70%, 50%)`
        };

        const distanceToPlayer = PhysicsEngine.distance(
            newEnemy,
            { x: gameState.player.x, y: gameState.player.y }
        );

        if (distanceToPlayer < 100) {
            const angle = Math.random() * Math.PI * 2;
            newEnemy.x = gameState.player.x + Math.cos(angle) * 150;
            newEnemy.y = gameState.player.y + Math.sin(angle) * 150;

            newEnemy.x = Math.max(newEnemy.size/2, Math.min(canvas.width - newEnemy.size/2, newEnemy.x));
            newEnemy.y = Math.max(newEnemy.size/2, Math.min(canvas.height - newEnemy.size/2, newEnemy.y));
        }

        gameState.enemies.push(newEnemy);
    }
}

/**
 * 渲染引擎
 */
class RenderEngine {
    constructor() {
        this.lastRenderTime = 0;
        this.renderInterval = 1000 / 60;
    }

    render(ctx, gameState) {
        const now = performance.now();

        if (now - this.lastRenderTime < this.renderInterval) {
            return false;
        }

        this.lastRenderTime = now;

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        this.drawBackground(ctx);

        // 绘制玩家
        this.drawPlayer(ctx, gameState.player);

        // 绘制敌人
        gameState.enemies.forEach(enemy => {
            this.drawEnemy(ctx, enemy);
        });

        // 绘制UI
        this.drawUI(ctx, gameState);

        return true;
    }

    drawBackground(ctx) {
        const gradient = ctx.createRadialGradient(
            ctx.canvas.width/2, ctx.canvas.height/2, 0,
            ctx.canvas.width/2, ctx.canvas.height/2, Math.max(ctx.canvas.width, ctx.canvas.height)/2
        );
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(1, '#0f0f1a');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    drawPlayer(ctx, player) {
        ctx.fillStyle = '#4ade80';
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.size/2, 0, Math.PI * 2);
        ctx.fill();

        const gameState = window.IntegratedGameSystem?.getState() || player;
        const angle = Math.atan2(gameState.mouseY - player.y, gameState.mouseX - player.x);

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(player.x, player.y);
        ctx.lineTo(
            player.x + Math.cos(angle) * (player.size/2 + 5),
            player.y + Math.sin(angle) * (player.size/2 + 5)
        );
        ctx.stroke();

        const healthPercent = player.hp / player.maxHp;
        ctx.fillStyle = '#333';
        ctx.fillRect(player.x - 20, player.y - player.size/2 - 15, 40, 6);
        ctx.fillStyle = healthPercent > 0.5 ? '#4ade80' : healthPercent > 0.25 ? '#fbbf24' : '#ef4444';
        ctx.fillRect(player.x - 20, player.y - player.size/2 - 15, 40 * healthPercent, 6);
    }

    drawEnemy(ctx, enemy) {
        ctx.fillStyle = enemy.color;
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.size/2, 0, Math.PI * 2);
        ctx.fill();

        const hpPercent = enemy.hp / enemy.maxHp;
        ctx.fillStyle = '#333';
        ctx.fillRect(enemy.x - 20, enemy.y - enemy.size/2 - 10, 40, 6);
        ctx.fillStyle = '#f00';
        ctx.fillRect(enemy.x - 20, enemy.y - enemy.size/2 - 10, 40 * hpPercent, 6);
    }

    drawUI(ctx, gameState) {
        // UI元素由DOM处理
    }
}

/**
 * 碰撞系统
 */
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

// 创建全局集成游戏系统实例
if (typeof window !== 'undefined') {
    // 首先清理可能的冲突变量
    const conflictingVars = [
        'GameManager', 'GameSystem', 'GameEngine', 'FinalGameSystem',
        'WeaponComboSystem', 'SteamEnhancedWeaponSystem', 'specialGameEvents',
        'difficultyManager', 'regionSystem', 'gameModeSystem', 'progressTracker',
        'achievementSystem', 'steamControllerSupport', 'RogueGame'
    ];

    conflictingVars.forEach(varName => {
        if (window[varName] && varName !== 'IntegratedGameSystem') {
            console.warn(`🗑️ 清理冲突的全局变量: ${varName}`);
            try {
                delete window[varName];
            } catch(e) {
                // 如果无法删除，设置为null
                window[varName] = null;
            }
        }
    });

    // 创建集成系统实例
    if (!window.IntegratedGameSystem) {
        window.IntegratedGameSystem = new IntegratedGameSystem();
        window.gameState = window.IntegratedGameSystem.getState();

        console.log("🔄 集成游戏系统已准备就绪，所有冲突已解决");
    } else {
        console.warn("⚠️ 集成游戏系统已被初始化");
    }
}

// Node.js环境导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        IntegratedGameSystem,
        EventBus,
        PerformanceMonitor,
        PhysicsEngine,
        EnemySpawner,
        RenderEngine,
        CollisionSystem
    };
}

console.log("✅ 集成游戏系统加载完成");
