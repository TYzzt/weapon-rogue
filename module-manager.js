/**
 * 游戏模块管理器 - 解决全局命名空间污染和依赖冲突问题
 */

class GameManager {
    constructor() {
        // 游戏状态管理 - 替代全局gameState
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

        // 模块加载状态
        this.loadedModules = new Set();

        // 回调队列 - 用于等待模块加载
        this.pendingCallbacks = [];

        console.log("🎮 游戏管理器已初始化");
    }

    /**
     * 注册模块
     */
    registerModule(name, moduleObj) {
        if (this.modules.has(name)) {
            console.warn(`⚠️ 模块 ${name} 已存在，正在覆盖`);
        }

        this.modules.set(name, moduleObj);
        this.loadedModules.add(name);
        console.log(`✅ 模块 ${name} 已注册`);

        // 执行等待该模块的回调
        this.executePendingCallbacks(name);
    }

    /**
     * 获取模块
     */
    getModule(name) {
        return this.modules.get(name);
    }

    /**
     * 等待模块加载
     */
    waitForModule(moduleName, callback) {
        if (this.loadedModules.has(moduleName)) {
            // 模块已加载，立即执行回调
            setTimeout(() => callback(this.getModule(moduleName)), 0);
        } else {
            // 模块未加载，加入等待队列
            this.pendingCallbacks.push({
                moduleName,
                callback,
                executed: false
            });
        }
    }

    /**
     * 执行等待的回调
     */
    executePendingCallbacks(moduleName) {
        this.pendingCallbacks.forEach(cb => {
            if (!cb.executed && cb.moduleName === moduleName) {
                cb.executed = true;
                cb.callback(this.getModule(moduleName));
            }
        });

        // 清理已执行的回调
        this.pendingCallbacks = this.pendingCallbacks.filter(cb => !cb.executed);
    }

    /**
     * 安全访问游戏状态
     */
    getState() {
        return this.state;
    }

    /**
     * 安全更新游戏状态
     */
    updateState(updates) {
        this.updateNestedObject(this.state, updates);
    }

    /**
     * 深度更新嵌套对象
     */
    updateNestedObject(target, updates) {
        for (const key in updates) {
            if (updates.hasOwnProperty(key)) {
                if (typeof updates[key] === 'object' && updates[key] !== null && !Array.isArray(updates[key])) {
                    if (!target[key]) target[key] = {};
                    this.updateNestedObject(target[key], updates[key]);
                } else {
                    target[key] = updates[key];
                }
            }
        }
    }

    /**
     * 重置游戏状态
     */
    resetState() {
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
            homeEnemySurge: false,
            officeEnemySurge: false,
            quantumReality: false,
            toolEmpowerment: 1.0
        };
    }

    /**
     * 模拟旧的全局变量访问方式（用于兼容性）
     */
    createLegacyAccessors() {
        // 为了向后兼容，提供全局访问接口，但建议使用新的模块系统
        if (typeof window !== 'undefined') {
            // 注意：这不是理想的长期解决方案，仅用于迁移期间
            // 在生产环境中应逐步替换这些访问方式
            window.GameManager = this;
            window.gameState = this.state; // 仍然暴露，但指向同一个对象

            // 为关键功能创建代理以避免冲突
            this.createProxyForCriticalFunctions();
        }
    }

    /**
     * 为关键函数创建代理，防止重复定义
     */
    createProxyForCriticalFunctions() {
        // 检查是否存在旧的函数，如果存在则保存引用并用代理替代
        const criticalFunctions = ['startGame', 'killEnemy', 'pickupWeapon', 'levelUp', 'updateCombo'];

        criticalFunctions.forEach(funcName => {
            if (typeof window[funcName] !== 'undefined') {
                const originalFunc = window[funcName];
                console.warn(`⚠️ 检测到已存在的 ${funcName} 函数，创建兼容层...`);

                // 创建代理函数，在原有功能基础上添加模块化支持
                window[`original_${funcName}`] = originalFunc;
            }

            // 定义新函数时确保不会覆盖已有的
            this.defineSafeFunction(funcName);
        });
    }

    /**
     * 安全定义函数（如果不存在）
     */
    defineSafeFunction(funcName) {
        if (typeof window[funcName] === 'undefined') {
            window[funcName] = (...args) => {
                // 根据函数名称触发相应的模块方法
                switch(funcName) {
                    case 'startGame':
                        this.triggerEvent('gameStart', args);
                        break;
                    case 'killEnemy':
                        this.triggerEvent('enemyKilled', args);
                        break;
                    case 'pickupWeapon':
                        this.triggerEvent('weaponPickedUp', args);
                        break;
                    case 'levelUp':
                        this.triggerEvent('playerLeveledUp', args);
                        break;
                    case 'updateCombo':
                        this.triggerEvent('comboUpdated', args);
                        break;
                    default:
                        this.triggerEvent(funcName, args);
                }
            };
        }
    }

    /**
     * 触发模块事件
     */
    triggerEvent(eventName, eventData) {
        // 通知所有注册的模块此事件发生
        for (let [moduleName, moduleObj] of this.modules) {
            if (moduleObj[eventName] && typeof moduleObj[eventName] === 'function') {
                try {
                    moduleObj[eventName].apply(moduleObj, eventData);
                } catch (error) {
                    console.error(`❌ 模块 ${moduleName} 事件处理出错:`, error);
                }
            } else if (moduleObj.handleEvent && typeof moduleObj.handleEvent === 'function') {
                try {
                    moduleObj.handleEvent(eventName, eventData);
                } catch (error) {
                    console.error(`❌ 模块 ${moduleName} 通用事件处理出错:`, error);
                }
            }
        }
    }
}

// 创建全局游戏管理器实例
window.GameManager = new GameManager();
window.gameState = window.GameManager.getState(); // 保持向后兼容性

console.log("🔄 模块管理器已初始化，全局命名空间冲突解决方案已部署");

// 导出GameManager类以便其他模块可以使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameManager;
}