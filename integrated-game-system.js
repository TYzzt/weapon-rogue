/**
 * Rogue游戏集成系统
 * 统一管理所有游戏功能，确保各模块协调工作
 */

// 游戏主类
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

// 注册集成游戏系统
setTimeout(() => {
    if (window.GameSystem) {
        const integratedSystem = new IntegratedGameSystem();
        window.GameSystem.registerModule('integrated', integratedSystem);
        console.log('🔗 集成游戏系统已注册');
    } else {
        console.error('❌ 统一游戏系统未找到，无法注册集成系统');
    }
}, 0);

// 设置全局接口以保证向后兼容
window.RogueGame = {
    startGame: () => {
        const integratedSystem = window.GameSystem.getModule('integrated');
        if (integratedSystem && typeof integratedSystem.startGame === 'function') {
            return integratedSystem.startGame();
        }
        // Fallback to core module
        const coreModule = window.GameSystem.getModule('core');
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
        const integratedSystem = window.GameSystem.getModule('integrated');
        if (integratedSystem && typeof integratedSystem.restartGame === 'function') {
            return integratedSystem.restartGame();
        }
        // Fallback to core module
        const coreModule = window.GameSystem.getModule('core');
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
        const integratedSystem = window.GameSystem.getModule('integrated');
        if (integratedSystem && typeof integratedSystem.pauseGame === 'function') {
            return integratedSystem.pauseGame();
        }
        return false;
    },

    resumeGame: () => {
        const integratedSystem = window.GameSystem.getModule('integrated');
        if (integratedSystem && typeof integratedSystem.resumeGame === 'function') {
            return integratedSystem.resumeGame();
        }
        return false;
    },

    saveGame: () => {
        const integratedSystem = window.GameSystem.getModule('integrated');
        if (integratedSystem && typeof integratedSystem.saveGame === 'function') {
            return integratedSystem.saveGame();
        }
        // Fallback to save module
        const saveModule = window.GameSystem.getModule('save');
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
        const integratedSystem = window.GameSystem.getModule('integrated');
        if (integratedSystem && typeof integratedSystem.loadGame === 'function') {
            return integratedSystem.loadGame();
        }
        // Fallback to save module
        const saveModule = window.GameSystem.getModule('save');
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
        const integratedSystem = window.GameSystem.getModule('integrated');
        if (integratedSystem && typeof integratedSystem.getStatistics === 'function') {
            return integratedSystem.getStatistics();
        }
        return null;
    },

    getState: () => {
        if (window.GameSystem) {
            return window.GameSystem.getState();
        }
        return null;
    },

    getModule: (name) => {
        if (window.GameSystem) {
            return window.GameSystem.getModule(name);
        }
        return null;
    }
};

console.log('🔄 集成游戏系统已准备就绪');