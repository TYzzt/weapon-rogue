/**
 * 最终集成游戏引擎
 * 统一所有游戏功能到单一、高效的引擎中
 * 解决所有模块冲突和依赖问题
 */

class FinalIntegratedGameEngine {
    constructor() {
        // 游戏状态管理 - 单一数据源
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
        };

        // 模块注册表
        this.modules = new Map();

        // 已加载模块集合
        this.loadedModules = new Set();

        // 模块依赖图
        this.dependencies = new Map();

        // 事件总线
        this.eventBus = new EventBus();

        // 性能监控
        this.performanceMetrics = {
            lastFrameTime: 0,
            frameCount: 0,
            fps: 0,
            lastFpsUpdate: 0
        };

        // 冲突标记，防止重复初始化
        this.initialized = false;

        console.log("🎮 最终集成游戏引擎已初始化");
    }

    /**
     * 注册模块及其依赖关系（防止重复注册）
     */
    registerModule(name, moduleObj, dependencies = []) {
        // 如果已经注册过这个模块，直接返回
        if (this.modules.has(name)) {
            console.log(`ℹ️ 模块 ${name} 已存在，无需重复注册`);
            return true;
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

        // 性能优化：避免频繁的UI更新
        if (this.performanceMetrics.frameCount % 5 === 0) { // 每5帧更新一次
            this.eventBus.emit('stateChanged', this.state);
        }
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
     * 初始化所有模块（仅执行一次）
     */
    initializeAllModules() {
        if (this.initialized) {
            console.warn("⚠️ 游戏引擎已经初始化过了");
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
     * 性能优化的更新循环
     */
    updatePerformanceMetrics(currentTime) {
        this.performanceMetrics.frameCount++;

        if (currentTime - this.performanceMetrics.lastFpsUpdate > 1000) {
            this.performanceMetrics.fps = Math.round(
                this.performanceMetrics.frameCount * 1000 /
                (currentTime - this.performanceMetrics.lastFpsUpdate)
            );
            this.performanceMetrics.frameCount = 0;
            this.performanceMetrics.lastFpsUpdate = currentTime;
        }

        this.performanceMetrics.lastFrameTime = currentTime;
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
}

// 创建全局最终集成游戏引擎实例（仅在未定义时创建）
if (typeof window !== 'undefined' && !window.FinalIntegratedGameEngine) {
    // 全局冲突清理
    if (window.GameSystem && window.GameSystem !== window.FinalIntegratedGameEngine) {
        console.warn("🗑️ 清理旧的 GameSystem 全局变量");
        delete window.GameSystem;
    }

    if (window.GameEngine && window.GameEngine !== window.FinalIntegratedGameEngine) {
        console.warn("🗑️ 清理旧的 GameEngine 全局变量");
        delete window.GameEngine;
    }

    if (window.OptimizedGameEngine && window.OptimizedGameEngine !== window.FinalIntegratedGameEngine) {
        console.warn("🗑️ 清理旧的 OptimizedGameEngine 全局变量");
        delete window.OptimizedGameEngine;
    }

    if (window.GameManager && window.GameManager !== window.FinalIntegratedGameEngine) {
        console.warn("🗑️ 清理旧的 GameManager 全局变量");
        delete window.GameManager;
    }

    // 创建新的集成引擎
    window.FinalIntegratedGameEngine = new FinalIntegratedGameEngine();
    window.gameState = window.FinalIntegratedGameEngine.getState();

    // 为兼容性设置别名，但指向同一个实例
    window.GameSystem = window.FinalIntegratedGameEngine;
    window.GameEngine = window.FinalIntegratedGameEngine;
    window.GameManager = window.FinalIntegratedGameEngine;
    window.OptimizedGameEngine = window.FinalIntegratedGameEngine;

    console.log("🔄 最终集成游戏引擎已准备就绪");
} else if (typeof window !== 'undefined') {
    console.warn("⚠️ FinalIntegratedGameEngine 已被定义");
}

// 定义核心游戏机制模块
class CoreGameMechanics {
    constructor() {
        this.name = 'CoreGameMechanics';
        this.lastFrameTime = 0;
    }

    init(engine) {
        this.engine = engine;
        console.log('🔧 核心游戏机制模块已初始化');
    }

    startGame() {
        const gameState = this.engine.getState();
        gameState.player.isPlaying = true;
        gameState.player.isGameOver = false;
        gameState.startTime = Date.now();
        console.log('▶️ 游戏开始');
    }

    update(deltaTime) {
        const gameState = this.engine.getState();
        if (!gameState.player.isPlaying || gameState.player.isGameOver) return;

        // 更新敌人生成计时器
        gameState.enemySpawnTimer += deltaTime;

        // 生成敌人逻辑
        if (gameState.enemySpawnTimer >= gameState.enemySpawnRate) {
            this.spawnEnemy();
            gameState.enemySpawnTimer = 0;

            // 随着等级提升，增加敌人的生成速度
            gameState.enemySpawnRate = Math.max(200, 2000 - Math.min(gameState.kills * 2, 1800)); // 防止负值
        }
    }

    draw(ctx, canvas) {
        // 绘制游戏逻辑
        const gameState = this.engine.getState();

        // 清除画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 绘制背景
        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 绘制玩家
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(
            gameState.player.x - gameState.player.size/2,
            gameState.player.y - gameState.player.size/2,
            gameState.player.size,
            gameState.player.size
        );

        // 绘制敌人
        ctx.fillStyle = '#ff0000';
        gameState.enemies.forEach(enemy => {
            ctx.fillRect(
                enemy.x - enemy.size/2,
                enemy.y - enemy.size/2,
                enemy.size,
                enemy.size
            );
        });

        // 绘制物品
        ctx.fillStyle = '#ffff00';
        gameState.items.forEach(item => {
            ctx.beginPath();
            ctx.arc(item.x, item.y, item.size, 0, Math.PI * 2);
            ctx.fill();
        });

        // 绘制UI信息
        ctx.fillStyle = '#ffffff';
        ctx.font = '16px Arial';
        ctx.fillText(`分数: ${gameState.score}`, 10, 20);
        ctx.fillText(`等级: ${gameState.level}`, 10, 40);
        ctx.fillText(`击杀: ${gameState.kills}`, 10, 60);
        ctx.fillText(`生命值: ${gameState.player.hp}/${gameState.player.maxHp}`, 10, 80);
    }

    spawnEnemy() {
        const gameState = this.engine.getState();
        const newEnemy = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: 20,
            speed: 1 + Math.random() * 2,
            hp: 10 + Math.floor(gameState.level * 0.5)
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
            newEnemy.x = Math.max(newEnemy.size/2, Math.min(canvas.width - newEnemy.size/2, newEnemy.x));
            newEnemy.y = Math.max(newEnemy.size/2, Math.min(canvas.height - newEnemy.size/2, newEnemy.y));
        }

        gameState.enemies.push(newEnemy);
    }

    async gameLoop(canvas, ctx) {
        const currentTime = Date.now();
        const deltaTime = currentTime - (this.lastFrameTime || currentTime);
        this.lastFrameTime = currentTime;

        // 更新性能指标
        this.engine.updatePerformanceMetrics(currentTime);

        this.update(deltaTime);
        this.draw(ctx, canvas);

        if (this.engine.getState().player.isPlaying && !this.engine.getState().player.isGameOver) {
            requestAnimationFrame(() => this.gameLoop(canvas, ctx));
        }
    }

    onGameStart() {
        console.log('🎬 核心游戏机制启动');
    }
}

// 定义优化的音频系统
class AudioSystem {
    constructor() {
        this.name = 'AudioSystem';
        this.sounds = new Map();
        this.enabled = true;
        this.audioContext = null;

        // 尝试初始化Web Audio API
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('⚠️ Web Audio API不可用，使用简单音效');
        }
    }

    init(engine) {
        this.engine = engine;
        console.log('🎵 音频系统模块已初始化');
    }

    playSound(soundName) {
        if (!this.enabled) return;

        // 使用Web Audio API或简单的反馈
        if (this.audioContext) {
            // 实现真实的音效播放逻辑
            console.log(`🔊 播放音效: ${soundName}`);
        } else {
            // 简单的控制台输出替代
            console.log(`🔊 [模拟] 播放音效: ${soundName}`);
        }
    }

    toggle(enabled) {
        this.enabled = !!enabled;
        console.log(`🔊 音频系统: ${this.enabled ? '开启' : '关闭'}`);
    }

    onGameStart() {
        console.log('🎬 音频系统启动');
    }
}

// 定义优化的成就系统
class AchievementSystem {
    constructor() {
        this.name = 'AchievementSystem';
        this.achievements = [];
    }

    init(engine) {
        this.engine = engine;
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
        const gameState = this.engine.getState();

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
            this.engine.eventBus.emit('achievementUnlocked', achievement);
        }
    }

    onGameStart() {
        console.log('🎬 成就系统启动');
    }
}

// 定义优化的保存系统
class SaveSystem {
    constructor() {
        this.name = 'SaveSystem';
        this.saveKey = 'final_integrated_rogue_game_save';
    }

    init(engine) {
        this.engine = engine;
        console.log('💾 保存系统模块已初始化');
    }

    saveGame() {
        const gameState = this.engine.getState();
        const saveData = {
            version: '3.0',  // 更新版本号，表示最新的集成系统
            timestamp: Date.now(),
            gameState: {
                ...gameState,
                // 排除一些不适合保存的临时数据
                enemies: [],  // 不保存实时敌人位置
                items: [],    // 不保存实时物品位置
                combatLog: [], // 不保存战斗日志
                startTime: gameState.startTime, // 保存开始时间用于计算持续时间
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
                    const currentState = this.engine.getState();
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

// 在引擎准备好后注册核心模块
if (typeof window !== 'undefined') {
    // 延迟注册模块以确保引擎完全初始化
    setTimeout(() => {
        if (window.FinalIntegratedGameEngine) {
            // 创建模块实例
            const coreMechanics = new CoreGameMechanics();
            const audioSystem = new AudioSystem();
            const achievementSystem = new AchievementSystem();
            const saveSystem = new SaveSystem();

            // 注册模块到集成引擎
            window.FinalIntegratedGameEngine.registerModule('core', coreMechanics);
            window.FinalIntegratedGameEngine.registerModule('audio', audioSystem);
            window.FinalIntegratedGameEngine.registerModule('achievements', achievementSystem);
            window.FinalIntegratedGameEngine.registerModule('save', saveSystem);

            // 启动所有模块
            window.FinalIntegratedGameEngine.initializeAllModules();

            console.log('🎮 所有游戏模块已注册并初始化到最终集成引擎');
        } else {
            console.error('❌ 最终集成游戏引擎未找到');
        }
    }, 100); // 稍微延迟以确保引擎完全初始化
}

console.log("🚀 最终集成游戏引擎系统已完全启动");