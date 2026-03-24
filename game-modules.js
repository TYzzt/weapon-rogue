/**
 * Rogue游戏模块整合系统
 * 统一管理所有游戏模块，解决命名冲突和重复功能
 */

// 确保统一模块系统已加载
if (typeof window.GameSystem === 'undefined') {
    console.error('❌ 统一游戏系统未加载');
}

// 游戏音频模块
class AudioModule {
    constructor() {
        this.name = 'AudioModule';
        this.sounds = new Map();
        this.enabled = true;
        this.masterVolume = 1.0;
    }

    init(system) {
        this.system = system;
        console.log('🎵 音频模块已初始化');

        // 初始化音频上下文（如果浏览器支持）
        if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
            this.audioContext = new (AudioContext || webkitAudioContext)();
            console.log('🔊 Web Audio API 已启用');
        } else {
            console.log('⚠️ 浏览器不支持 Web Audio API，将使用简单音频模拟');
        }
    }

    playSound(soundName, volume = 1.0) {
        if (!this.enabled) return;

        // 这里可以添加实际的音频播放逻辑
        console.log(`🔊 播放音效: ${soundName}`);

        // 模拟音频播放
        if (this.audioContext) {
            // 创建简单的声音反馈
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.type = 'sine';
            oscillator.frequency.value = soundName.includes('hit') ? 440 :
                                        soundName.includes('powerup') ? 660 : 880;
            gainNode.gain.value = volume * this.masterVolume * 0.1;

            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + 0.1);
        }
    }

    toggle(enabled) {
        this.enabled = !!enabled;
        console.log(`🔊 音频模块: ${this.enabled ? '开启' : '关闭'}`);
    }

    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        console.log(`🔊 主音量: ${this.masterVolume * 100}%`);
    }

    onGameStart() {
        console.log('🎬 音频模块启动');
    }
}

// 游戏存档模块
class SaveModule {
    constructor() {
        this.name = 'SaveModule';
        this.saveKey = 'rogue_game_save_v2'; // 使用新的保存键避免冲突
        this.autoSaveInterval = null;
        this.lastSaveTime = 0;
    }

    init(system) {
        this.system = system;
        console.log('💾 存档模块已初始化');
    }

    saveGame(customData = {}) {
        const gameState = this.system.getState();
        const saveData = {
            version: '2.0', // 新版本标识
            timestamp: Date.now(),
            gameState: {
                ...gameState,
                // 排除一些不适合保存的动态数据
                enemies: [],  // 不保存实时敌人位置
                items: [],    // 不保存实时物品位置
                startTime: gameState.startTime, // 保留开始时间
                sessionTime: gameState.sessionTime // 保留游戏时间
            },
            customData
        };

        try {
            localStorage.setItem(this.saveKey, JSON.stringify(saveData));
            this.lastSaveTime = Date.now();
            console.log('💾 游戏已保存');

            // 触发保存事件
            this.system.eventBus.emit('gameSaved', {
                timestamp: this.lastSaveTime,
                gameState: saveData.gameState
            });

            return true;
        } catch (error) {
            console.error('❌ 保存游戏失败:', error);
            this.system.eventBus.emit('saveError', { error });
            return false;
        }
    }

    loadGame() {
        try {
            const saveDataStr = localStorage.getItem(this.saveKey);
            if (saveDataStr) {
                const saveData = JSON.parse(saveDataStr);

                if (saveData.version) {
                    // 保留某些当前状态值
                    const currentGameState = this.system.getState();
                    const preservedValues = {
                        enemies: currentGameState.enemies, // 保持当前敌人列表
                        items: currentGameState.items,     // 保持当前物品列表
                        startTime: currentGameState.startTime, // 保持当前开始时间
                        sessionTime: currentGameState.sessionTime // 保持当前游戏时间
                    };

                    // 恢复游戏状态
                    Object.assign(currentGameState, saveData.gameState);

                    // 恢复保留的值
                    Object.assign(currentGameState, preservedValues);

                    console.log('📥 游戏已加载');

                    // 触发加载事件
                    this.system.eventBus.emit('gameLoaded', {
                        timestamp: saveData.timestamp,
                        version: saveData.version
                    });

                    return true;
                }
            }
        } catch (error) {
            console.error('❌ 加载游戏失败:', error);
            this.system.eventBus.emit('loadError', { error });
        }

        return false;
    }

    deleteSave() {
        try {
            localStorage.removeItem(this.saveKey);
            console.log('🗑️ 存档已删除');
            this.system.eventBus.emit('saveDeleted');
            return true;
        } catch (error) {
            console.error('❌ 删除存档失败:', error);
            return false;
        }
    }

    enableAutoSave(intervalMs = 300000) { // 默认每5分钟自动保存
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }

        this.autoSaveInterval = setInterval(() => {
            if (this.system.getState().player.isPlaying) {
                this.saveGame({ autoSave: true });
            }
        }, intervalMs);

        console.log(`⏰ 自动保存已启用 (${intervalMs/1000}秒间隔)`);
    }

    disableAutoSave() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
            this.autoSaveInterval = null;
            console.log('⏰ 自动保存已禁用');
        }
    }

    onGameStart() {
        console.log('🎬 存档模块启动');
    }
}

// 游戏成就模块
class AchievementModule {
    constructor() {
        this.name = 'AchievementModule';
        this.achievements = new Map();
        this.unlockedAchievements = new Set();
        this.initializeDefaultAchievements();
    }

    initializeDefaultAchievements() {
        // 定义默认成就
        const defaultAchievements = [
            {
                id: 'first_blood',
                name: '首杀',
                description: '击杀第一个敌人',
                condition: (state) => state.kills >= 1,
                secret: false
            },
            {
                id: 'survivor',
                name: '幸存者',
                description: '存活超过5分钟',
                condition: (state) => state.sessionTime >= 300000, // 5分钟 = 300000毫秒
                secret: false
            },
            {
                id: 'slayer',
                name: '屠夫',
                description: '击杀50个敌人',
                condition: (state) => state.kills >= 50,
                secret: false
            },
            {
                id: 'collector',
                name: '收藏家',
                description: '收集10件物品',
                condition: (state) => state.player.relics.length >= 10,
                secret: false
            },
            {
                id: 'pacifist',
                name: '和平主义者',
                description: '存活10分钟且未击杀任何敌人',
                condition: (state) => state.sessionTime >= 600000 && state.kills === 0, // 10分钟
                secret: false
            },
            {
                id: 'speed_runner',
                name: '速通专家',
                description: '在一分钟内击杀10个敌人',
                condition: (state) => state.kills >= 10 && state.sessionTime <= 60000, // 1分钟
                secret: false
            }
        ];

        defaultAchievements.forEach(achievement => {
            this.achievements.set(achievement.id, {
                ...achievement,
                achieved: false,
                unlockedAt: null
            });
        });
    }

    init(system) {
        this.system = system;
        console.log('🏆 成就模块已初始化');
    }

    checkAchievements() {
        const gameState = this.system.getState();

        for (const [id, achievement] of this.achievements.entries()) {
            if (!achievement.achieved && achievement.condition(gameState)) {
                this.unlockAchievement(id);
            }
        }
    }

    unlockAchievement(id) {
        const achievement = this.achievements.get(id);
        if (achievement && !achievement.achieved) {
            achievement.achieved = true;
            achievement.unlockedAt = Date.now();
            this.unlockedAchievements.add(id);

            console.log(`🎉 解锁成就: ${achievement.name} - ${achievement.description}`);

            // 发送事件通知其他模块
            this.system.eventBus.emit('achievementUnlocked', {
                id: achievement.id,
                name: achievement.name,
                description: achievement.description
            });

            return true;
        }
        return false;
    }

    getAchievementProgress(id) {
        const achievement = this.achievements.get(id);
        if (!achievement) return null;

        // 简单的进度计算（对于复杂条件可能需要更具体的逻辑）
        const gameState = this.system.getState();
        if (achievement.condition(gameState)) {
            return 100; // 已达成
        }

        // 根据不同成就类型估算进度
        switch(id) {
            case 'first_blood':
                return Math.min(100, gameState.kills * 100);
            case 'slayer':
                return Math.min(100, (gameState.kills / 50) * 100);
            case 'collector':
                return Math.min(100, (gameState.player.relics.length / 10) * 100);
            case 'survivor':
                return Math.min(100, (gameState.sessionTime / 300000) * 100);
            default:
                return 0;
        }
    }

    getUnlockedAchievements() {
        return Array.from(this.unlockedAchievements).map(id => this.achievements.get(id));
    }

    getTotalAchievementsCount() {
        return this.achievements.size;
    }

    getUnlockedAchievementsCount() {
        return this.unlockedAchievements.size;
    }

    onGameStart() {
        console.log('🎬 成就模块启动');

        // 游戏开始时检查已有成就
        setTimeout(() => {
            this.checkAchievements();
        }, 1000);
    }
}

// 注册所有模块到统一系统
setTimeout(() => {
    if (window.GameSystem) {
        // 创建模块实例
        const gameCore = new GameCore();
        const audioModule = new AudioModule();
        const saveModule = new SaveModule();
        const achievementModule = new AchievementModule();

        // 注册模块到统一系统
        window.GameSystem.registerModule('core', gameCore);
        window.GameSystem.registerModule('audio', audioModule);
        window.GameSystem.registerModule('save', saveModule);
        window.GameSystem.registerModule('achievements', achievementModule);

        // 设置模块间的依赖关系（如果需要）
        // window.GameSystem.setDependency('achievements', ['core']); // 成就模块依赖于核心模块

        // 初始化所有模块
        window.GameSystem.initializeAllModules();

        console.log('🎮 所有游戏模块已注册并初始化');

        // 为旧代码提供兼容性接口
        setupBackwardCompatibility();
    } else {
        console.error('❌ 统一游戏系统未找到');
    }
}, 0);

// 设置向后兼容性接口
function setupBackwardCompatibility() {
    // 保留对旧函数名的兼容性包装
    if (!window.startGame) {
        window.startGame = () => {
            const coreModule = window.GameSystem.getModule('core');
            if (coreModule && typeof coreModule.startGame === 'function') {
                coreModule.startGame();
            }
        };
    }

    if (!window.restartGame) {
        window.restartGame = () => {
            const coreModule = window.GameSystem.getModule('core');
            if (coreModule && typeof coreModule.restartGame === 'function') {
                coreModule.restartGame();
            }
        };
    }

    if (!window.pauseGame) {
        window.pauseGame = () => {
            const coreModule = window.GameSystem.getModule('core');
            if (coreModule && typeof coreModule.pauseGame === 'function') {
                coreModule.pauseGame();
            }
        };
    }

    if (!window.resumeGame) {
        window.resumeGame = () => {
            const coreModule = window.GameSystem.getModule('core');
            if (coreModule && typeof coreModule.resumeGame === 'function') {
                coreModule.resumeGame();
            }
        };
    }

    if (!window.saveGame) {
        window.saveGame = () => {
            const saveModule = window.GameSystem.getModule('save');
            if (saveModule && typeof saveModule.saveGame === 'function') {
                return saveModule.saveGame();
            }
            return false;
        };
    }

    if (!window.loadGame) {
        window.loadGame = () => {
            const saveModule = window.GameSystem.getModule('save');
            if (saveModule && typeof saveModule.loadGame === 'function') {
                return saveModule.loadGame();
            }
            return false;
        };
    }

    console.log('🔄 向后兼容性接口已设置');
}

console.log('🔄 模块整合系统已准备就绪');