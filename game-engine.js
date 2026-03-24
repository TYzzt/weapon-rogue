/**
 * 统一游戏引擎 - 解决全局命名空间污染和模块冲突
 * 整合所有游戏模块到单一管理器
 */

class GameEngine {
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
            // 添加更多通用状态...
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

        console.log("🎮 统一游戏引擎已初始化");
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
     * 检查模块是否已加载
     */
    isModuleLoaded(name) {
        return this.loadedModules.has(name);
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

// 创建全局游戏引擎实例（只创建一次）
if (typeof window !== 'undefined' && !window.GameEngine) {
    window.GameEngine = new GameEngine();
    window.gameState = window.GameEngine.getState();

    // 兼容旧的命名，但推荐使用新的GameEngine
    if (!window.GameSystem) {
        window.GameSystem = window.GameEngine;
    }
    if (!window.GameManager) {
        window.GameManager = window.GameEngine;
    }

    console.log("🔄 统一游戏引擎已准备就绪");
} else if (typeof window !== 'undefined') {
    console.warn("⚠️ GameEngine已被定义，使用现有实例");
}

// 如果在Node.js环境中，导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        GameEngine,
        EventBus
    };
}