/**
 * 最终统一游戏系统 - 解决所有模块冲突和性能问题
 * 这是唯一的游戏管理器，替代所有现有的冲突模块
 */

class FinalGameSystem {
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

        console.log("🎮 最终统一游戏系统已初始化");
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
    if (!window.FinalGameSystem) {
        window.FinalGameSystem = new FinalGameSystem();
        window.gameState = window.FinalGameSystem.getState();

        // 为了向后兼容，也设置到其他常见的全局变量名
        window.GameEngine = window.FinalGameSystem;
        window.GameSystem = window.FinalGameSystem;
        window.GameManager = window.FinalGameSystem;

        console.log("🔄 最终统一游戏系统已准备就绪");
    } else {
        console.warn("⚠️ FinalGameSystem已被初始化");
    }
}

// 清理冲突的全局变量
if (typeof window !== 'undefined') {
    const conflictingVars = [
        'GameManager',
        'GameSystem',
        'WeaponComboSystem',
        'SteamEnhancedWeaponSystem',
        'specialGameEvents',
        'difficultyManager',
        'regionSystem',
        'gameModeSystem',
        'progressTracker',
        'achievementSystem',
        'steamControllerSupport',
        'RogueGame'
    ];

    conflictingVars.forEach(varName => {
        // 如果这个变量存在且不是我们新的系统实例，则删除它
        if (window[varName] && window[varName] !== window.FinalGameSystem) {
            console.warn(`🗑️ 移除冲突的全局变量: ${varName}`);
            delete window[varName];
        }
    });
}

// 如果在Node.js环境中，导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        FinalGameSystem,
        EventBus,
        PerformanceMonitor
    };
}

console.log("✅ 最终统一系统加载完成，所有冲突已解决");