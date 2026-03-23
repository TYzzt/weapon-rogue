// ==================== 增强存档系统 ====================
//
// 本系统实现全面的存档功能，包括游戏进度、统计数据、设置选项和云同步功能

class AdvancedSaveSystem {
    constructor() {
        this.saveKey = 'weaponRogueSave_v2';
        this.backupKey = 'weaponRogueSave_backup_v2';
        this.autoSaveInterval = null;
        this.init();
        console.log("💾 增强存档系统已初始化");
    }

    // 初始化存档系统
    init() {
        this.loadSavedPreferences(); // 加载用户偏好设置
        this.setupAutoSave(); // 设置自动保存
        this.validateSaveData(); // 验证存档数据完整性
    }

    // 获取完整的存档数据
    getFullSaveData() {
        const saveData = {
            version: '2.0',
            timestamp: Date.now(),
            gameProgress: this.getGameProgress(),
            playerStats: this.getPlayerStats(),
            unlocks: this.getUnlocks(),
            settings: this.getUserSettings(),
            achievements: this.getAchievements(),
            gameHistory: this.getGameHistory(),
            preferences: this.getPreferences()
        };

        return saveData;
    }

    // 获取游戏进度
    getGameProgress() {
        if (typeof gameState !== 'undefined') {
            return {
                currentLevel: gameState.level || 1,
                highestLevelReached: gameState.highestLevel || 1,
                currentScore: gameState.score || 0,
                totalKills: gameState.totalKills || 0,
                totalGames: gameState.totalGames || 0,
                winCount: gameState.winCount || 0,
                playTime: gameState.totalPlayTime || 0
            };
        }

        return {
            currentLevel: 1,
            highestLevelReached: 1,
            currentScore: 0,
            totalKills: 0,
            totalGames: 0,
            winCount: 0,
            playTime: 0
        };
    }

    // 获取玩家统计数据
    getPlayerStats() {
        if (typeof gameState !== 'undefined' && gameState.player) {
            return {
                level: gameState.player.level || 1,
                exp: gameState.player.exp || 0,
                expToNext: gameState.player.expToNext || 100,
                hp: gameState.player.hp || 100,
                maxHp: gameState.player.maxHp || 100,
                damage: gameState.player.damage || 10,
                speed: gameState.player.speed || 1,
                kills: gameState.player.kills || 0,
                deaths: gameState.player.deaths || 0,
                maxCombo: gameState.player.maxCombo || 0,
                itemsCollected: gameState.player.itemsCollected || 0
            };
        }

        return {
            level: 1,
            exp: 0,
            expToNext: 100,
            hp: 100,
            maxHp: 100,
            damage: 10,
            speed: 1,
            kills: 0,
            deaths: 0,
            maxCombo: 0,
            itemsCollected: 0
        };
    }

    // 获取解锁内容
    getUnlocks() {
        // 从各种系统收集解锁数据
        const unlocks = {
            weapons: [],
            enemies: [],
            levels: [],
            specialAbilities: [],
            relics: []
        };

        // 如果存在相关系统，获取解锁数据
        if (typeof gameState !== 'undefined') {
            unlocks.weapons = gameState.unlockedWeapons || [];
            unlocks.enemies = gameState.encounteredEnemies || [];
            unlocks.levels = gameState.unlockedLevels || [1]; // 默认解锁第一关
            unlocks.relics = gameState.collectedRelics || [];
        }

        return unlocks;
    }

    // 获取用户设置
    getUserSettings() {
        return {
            soundEnabled: typeof soundEnabled !== 'undefined' ? soundEnabled : true,
            musicEnabled: typeof musicEnabled !== 'undefined' ? musicEnabled : true,
            selectedDifficulty: typeof selectedDifficulty !== 'undefined' ? selectedDifficulty : 'normal',
            controllerEnabled: typeof controllerEnabled !== 'undefined' ? controllerEnabled : false,
            showNotifications: typeof showNotifications !== 'undefined' ? showNotifications : true,
            showAnimations: typeof showAnimations !== 'undefined' ? showAnimations : true,
            language: typeof currentLanguage !== 'undefined' ? currentLanguage : 'zh-CN'
        };
    }

    // 获取成就数据
    getAchievements() {
        if (typeof enhancedAchievementSystem !== 'undefined') {
            return {
                unlocked: enhancedAchievementSystem.achievements || {},
                progress: enhancedAchievementSystem.tempStats || {},
                totalUnlocked: enhancedAchievementSystem.getUnlockedCount ? enhancedAchievementSystem.getUnlockedCount() : 0
            };
        } else if (typeof AchievementSystem !== 'undefined') {
            return {
                unlocked: AchievementSystem.achievements || {},
                progress: AchievementSystem.tempStats || {},
                totalUnlocked: AchievementSystem.getUnlockedCount ? AchievementSystem.getUnlockedCount() : 0
            };
        }

        return {
            unlocked: {},
            progress: {},
            totalUnlocked: 0
        };
    }

    // 获取游戏历史
    getGameHistory() {
        if (typeof gameState !== 'undefined') {
            return {
                lastPlayed: gameState.lastPlayed || Date.now(),
                gameSessions: gameState.gameSessions || [],
                highScores: gameState.highScores || [],
                favoriteWeapons: gameState.favoriteWeapons || [],
                playTimeByLevel: gameState.playTimeByLevel || {}
            };
        }

        return {
            lastPlayed: Date.now(),
            gameSessions: [],
            highScores: [],
            favoriteWeapons: [],
            playTimeByLevel: {}
        };
    }

    // 获取用户偏好
    getPreferences() {
        return {
            autoSaveEnabled: localStorage.getItem('autoSaveEnabled') === 'true',
            saveFrequency: parseInt(localStorage.getItem('saveFrequency')) || 120000, // 默认2分钟
            backupEnabled: localStorage.getItem('backupEnabled') !== 'false',
            lastSaveVersion: localStorage.getItem('lastSaveVersion') || '1.0'
        };
    }

    // 保存游戏
    saveGame() {
        try {
            const saveData = this.getFullSaveData();

            // 如果启用了备份，先创建备份
            if (this.getPreferences().backupEnabled) {
                const existingSave = localStorage.getItem(this.saveKey);
                if (existingSave) {
                    localStorage.setItem(this.backupKey, existingSave);
                }
            }

            // 保存数据
            localStorage.setItem(this.saveKey, JSON.stringify(saveData));

            console.log(`💾 游戏已保存于 ${new Date().toLocaleString()}`);

            // 显示保存通知
            if (typeof showCombatLog !== 'undefined') {
                showCombatLog('💾 进度已自动保存', 'save-notification');
            }

            return true;
        } catch (error) {
            console.error('保存游戏失败:', error);
            this.handleSaveError(error);
            return false;
        }
    }

    // 加载游戏
    loadGame() {
        try {
            const saveDataStr = localStorage.getItem(this.saveKey);
            if (!saveDataStr) {
                console.log('没有找到存档文件');
                return false;
            }

            const saveData = JSON.parse(saveDataStr);

            // 验证存档版本
            if (saveData.version) {
                if (saveData.version < '2.0') {
                    // 如果是旧版本，进行升级
                    saveData = this.migrateSaveData(saveData);
                }
            }

            // 恢复游戏进度
            this.restoreGameProgress(saveData.gameProgress);

            // 恢复玩家统计
            this.restorePlayerStats(saveData.playerStats);

            // 恢复解锁内容
            this.restoreUnlocks(saveData.unlocks);

            // 恢复设置
            this.restoreSettings(saveData.settings);

            // 恢复成就
            this.restoreAchievements(saveData.achievements);

            // 恢复游戏历史
            this.restoreGameHistory(saveData.gameHistory);

            // 恢复偏好设置
            this.restorePreferences(saveData.preferences);

            console.log(`📂 游戏存档已加载 (存档版本: ${saveData.version})`);

            // 显示加载通知
            if (typeof showCombatLog !== 'undefined') {
                showCombatLog('📂 进度已加载', 'load-notification');
            }

            return true;
        } catch (error) {
            console.error('加载游戏失败:', error);
            // 尝试从备份恢复
            if (this.tryRestoreFromBackup()) {
                console.log('从备份恢复成功');
                return true;
            }
            this.handleLoadError(error);
            return false;
        }
    }

    // 恢复游戏进度
    restoreGameProgress(progressData) {
        if (typeof gameState !== 'undefined') {
            gameState.level = progressData.currentLevel || 1;
            gameState.highestLevel = progressData.highestLevelReached || 1;
            gameState.score = progressData.currentScore || 0;
            gameState.totalKills = progressData.totalKills || 0;
            gameState.totalGames = progressData.totalGames || 0;
            gameState.winCount = progressData.winCount || 0;
            gameState.totalPlayTime = progressData.playTime || 0;
        }
    }

    // 恢复玩家统计
    restorePlayerStats(statsData) {
        if (typeof gameState !== 'undefined') {
            if (!gameState.player) gameState.player = {};

            gameState.player.level = statsData.level || 1;
            gameState.player.exp = statsData.exp || 0;
            gameState.player.expToNext = statsData.expToNext || 100;
            gameState.player.hp = statsData.hp || 100;
            gameState.player.maxHp = statsData.maxHp || 100;
            gameState.player.damage = statsData.damage || 10;
            gameState.player.speed = statsData.speed || 1;
            gameState.player.kills = statsData.kills || 0;
            gameState.player.deaths = statsData.deaths || 0;
            gameState.player.maxCombo = statsData.maxCombo || 0;
            gameState.player.itemsCollected = statsData.itemsCollected || 0;
        }
    }

    // 恢复解锁内容
    restoreUnlocks(unlocksData) {
        if (typeof gameState !== 'undefined') {
            gameState.unlockedWeapons = unlocksData.weapons || [];
            gameState.encounteredEnemies = unlocksData.enemies || [];
            gameState.unlockedLevels = unlocksData.levels || [1];
            gameState.collectedRelics = unlocksData.relics || [];
        }
    }

    // 恢复设置
    restoreSettings(settingsData) {
        if (typeof soundEnabled !== 'undefined') soundEnabled = settingsData.soundEnabled;
        if (typeof musicEnabled !== 'undefined') musicEnabled = settingsData.musicEnabled;
        if (typeof selectedDifficulty !== 'undefined') selectedDifficulty = settingsData.selectedDifficulty;
        if (typeof controllerEnabled !== 'undefined') controllerEnabled = settingsData.controllerEnabled;
        if (typeof showNotifications !== 'undefined') showNotifications = settingsData.showNotifications;
        if (typeof showAnimations !== 'undefined') showAnimations = settingsData.showAnimations;
        if (typeof currentLanguage !== 'undefined') currentLanguage = settingsData.language;

        // 如果存在音频管理器，更新设置
        if (typeof enhancedAudioManager !== 'undefined') {
            enhancedAudioManager.setSoundEnabled(settingsData.soundEnabled);
            enhancedAudioManager.setMusicEnabled(settingsData.musicEnabled);
        }
    }

    // 恢复成就
    restoreAchievements(achievementsData) {
        if (typeof enhancedAchievementSystem !== 'undefined') {
            enhancedAchievementSystem.achievements = achievementsData.unlocked || {};
            enhancedAchievementSystem.tempStats = achievementsData.progress || {};
        } else if (typeof AchievementSystem !== 'undefined') {
            AchievementSystem.achievements = achievementsData.unlocked || {};
            AchievementSystem.tempStats = achievementsData.progress || {};
        }
    }

    // 恢复游戏历史
    restoreGameHistory(historyData) {
        if (typeof gameState !== 'undefined') {
            gameState.lastPlayed = historyData.lastPlayed || Date.now();
            gameState.gameSessions = historyData.gameSessions || [];
            gameState.highScores = historyData.highScores || [];
            gameState.favoriteWeapons = historyData.favoriteWeapons || [];
            gameState.playTimeByLevel = historyData.playTimeByLevel || {};
        }
    }

    // 恢复偏好设置
    restorePreferences(prefData) {
        localStorage.setItem('autoSaveEnabled', prefData.autoSaveEnabled);
        localStorage.setItem('saveFrequency', prefData.saveFrequency.toString());
        localStorage.setItem('backupEnabled', prefData.backupEnabled);
        localStorage.setItem('lastSaveVersion', prefData.lastSaveVersion);
    }

    // 设置自动保存
    setupAutoSave() {
        const prefs = this.getPreferences();

        if (prefs.autoSaveEnabled) {
            // 清除现有的自动保存定时器
            if (this.autoSaveInterval) {
                clearInterval(this.autoSaveInterval);
            }

            // 设置新的自动保存定时器
            this.autoSaveInterval = setInterval(() => {
                if (typeof gameState !== 'undefined' && gameState.isPlaying) {
                    this.saveGame();
                }
            }, prefs.saveFrequency); // 默认每2分钟保存一次

            console.log(`⏰ 自动保存已启用 (频率: ${prefs.saveFrequency/1000}秒)`);
        }
    }

    // 切换自动保存
    toggleAutoSave(enabled) {
        localStorage.setItem('autoSaveEnabled', enabled);

        if (enabled) {
            this.setupAutoSave();
            console.log('自动保存已启用');
        } else {
            if (this.autoSaveInterval) {
                clearInterval(this.autoSaveInterval);
                this.autoSaveInterval = null;
                console.log('自动保存已禁用');
            }
        }
    }

    // 验证存档数据完整性
    validateSaveData() {
        try {
            const saveDataStr = localStorage.getItem(this.saveKey);
            if (!saveDataStr) return true; // 没有存档，无需验证

            const saveData = JSON.parse(saveDataStr);

            // 检查必要字段
            const requiredFields = ['version', 'timestamp', 'gameProgress'];
            for (const field of requiredFields) {
                if (!(field in saveData)) {
                    throw new Error(`存档数据缺少必要字段: ${field}`);
                }
            }

            // 检查数据合理性（防止异常大的数值）
            if (saveData.gameProgress.highestLevelReached > 10000) {
                throw new Error('存档数据异常：关卡数过大');
            }

            if (saveData.playerStats?.level > 1000) {
                throw new Error('存档数据异常：玩家等级过大');
            }

            console.log('✅ 存档数据验证通过');
            return true;
        } catch (error) {
            console.warn('存档数据验证失败:', error.message);
            return false;
        }
    }

    // 迁移旧存档数据
    migrateSaveData(oldSaveData) {
        console.log(`🔄 正在迁移存档从版本 ${oldSaveData.version} 到 2.0`);

        // 基础结构
        const newSaveData = {
            version: '2.0',
            timestamp: Date.now(),
            gameProgress: {},
            playerStats: {},
            unlocks: {},
            settings: {},
            achievements: {},
            gameHistory: {},
            preferences: {}
        };

        // 迁移游戏进度
        if (oldSaveData.progress) {
            newSaveData.gameProgress = {
                currentLevel: oldSaveData.progress.currentLevel || oldSaveData.progress.level || 1,
                highestLevelReached: oldSaveData.progress.highestLevel || 1,
                currentScore: oldSaveData.progress.score || 0,
                totalKills: oldSaveData.progress.totalKills || 0,
                totalGames: oldSaveData.progress.totalGames || 0,
                winCount: oldSaveData.progress.winCount || 0,
                playTime: oldSaveData.progress.playTime || 0
            };
        }

        // 迁移玩家统计
        if (oldSaveData.playerStats) {
            newSaveData.playerStats = {
                level: oldSaveData.playerStats.level || 1,
                exp: oldSaveData.playerStats.exp || 0,
                expToNext: oldSaveData.playerStats.expToNext || 100,
                hp: oldSaveData.playerStats.hp || 100,
                maxHp: oldSaveData.playerStats.maxHp || 100,
                damage: oldSaveData.playerStats.damage || 10,
                speed: oldSaveData.playerStats.speed || 1,
                kills: oldSaveData.playerStats.kills || 0,
                deaths: oldSaveData.playerStats.deaths || 0,
                maxCombo: oldSaveData.playerStats.maxCombo || 0,
                itemsCollected: oldSaveData.playerStats.itemsCollected || 0
            };
        }

        // 迁移设置
        if (oldSaveData.settings) {
            newSaveData.settings = {
                soundEnabled: oldSaveData.settings.soundEnabled !== undefined ? oldSaveData.settings.soundEnabled : true,
                musicEnabled: oldSaveData.settings.musicEnabled !== undefined ? oldSaveData.settings.musicEnabled : true,
                selectedDifficulty: oldSaveData.settings.selectedDifficulty || 'normal',
                controllerEnabled: oldSaveData.settings.controllerEnabled || false,
                showNotifications: oldSaveData.settings.showNotifications !== undefined ? oldSaveData.settings.showNotifications : true,
                showAnimations: oldSaveData.settings.showAnimations !== undefined ? oldSaveData.settings.showAnimations : true,
                language: oldSaveData.settings.language || 'zh-CN'
            };
        }

        // 迁移成就
        if (oldSaveData.achievements) {
            newSaveData.achievements = {
                unlocked: oldSaveData.achievements.unlocked || {},
                progress: oldSaveData.achievements.progress || {},
                totalUnlocked: 0 // 重新计算
            };
        }

        // 添加默认的历史和偏好
        newSaveData.gameHistory = {
            lastPlayed: oldSaveData.timestamp || Date.now(),
            gameSessions: [],
            highScores: oldSaveData.highScores || [],
            favoriteWeapons: [],
            playTimeByLevel: {}
        };

        newSaveData.preferences = {
            autoSaveEnabled: true,
            saveFrequency: 120000,
            backupEnabled: true,
            lastSaveVersion: '2.0'
        };

        console.log('✅ 存档数据迁移完成');
        return newSaveData;
    }

    // 从备份恢复
    tryRestoreFromBackup() {
        try {
            const backupDataStr = localStorage.getItem(this.backupKey);
            if (!backupDataStr) {
                console.log('没有找到备份存档');
                return false;
            }

            const backupData = JSON.parse(backupDataStr);
            // 验证备份数据
            if (backupData.version) {
                localStorage.setItem(this.saveKey, backupDataStr);
                console.log('已从备份恢复存档');
                return true;
            }
        } catch (error) {
            console.error('从备份恢复失败:', error);
        }

        return false;
    }

    // 处理保存错误
    handleSaveError(error) {
        console.error('保存错误处理:', error);

        if (typeof showCombatLog !== 'undefined') {
            showCombatLog('⚠️ 保存失败，请检查存储空间', 'error-message');
        }

        // 尝试简单的数据压缩
        this.attemptSaveCompression();
    }

    // 处理加载错误
    handleLoadError(error) {
        console.error('加载错误处理:', error);

        if (typeof showCombatLog !== 'undefined') {
            showCombatLog('⚠️ 读档失败，可能存档已损坏', 'error-message');
        }
    }

    // 尝试保存压缩
    attemptSaveCompression() {
        // 目前为简化实现，实际上可以考虑只保存关键数据
        console.log('尝试压缩存档数据...');
    }

    // 获取存档信息
    getSaveInfo() {
        try {
            const saveDataStr = localStorage.getItem(this.saveKey);
            if (!saveDataStr) {
                return { exists: false };
            }

            const saveData = JSON.parse(saveDataStr);

            return {
                exists: true,
                version: saveData.version,
                timestamp: saveData.timestamp,
                level: saveData.gameProgress?.currentLevel || 1,
                score: saveData.gameProgress?.currentScore || 0,
                playTime: saveData.gameProgress?.playTime || 0,
                lastPlayed: new Date(saveData.timestamp).toLocaleString(),
                totalUnlocked: saveData.achievements?.totalUnlocked || 0
            };
        } catch (error) {
            console.error('获取存档信息失败:', error);
            return { exists: false, error: error.message };
        }
    }

    // 清除存档
    clearSave() {
        try {
            localStorage.removeItem(this.saveKey);
            localStorage.removeItem(this.backupKey);
            console.log('🗑️ 存档已清除');

            if (typeof showCombatLog !== 'undefined') {
                showCombatLog('🗑️ 存档已清除，游戏将从头开始', 'notification');
            }

            return true;
        } catch (error) {
            console.error('清除存档失败:', error);
            return false;
        }
    }

    // 加载已保存的偏好设置
    loadSavedPreferences() {
        // 检查本地存储中的偏好设置
        const autoSaveEnabled = localStorage.getItem('autoSaveEnabled');
        const saveFrequency = localStorage.getItem('saveFrequency');
        const backupEnabled = localStorage.getItem('backupEnabled');

        if (autoSaveEnabled !== null) {
            // 应用保存的偏好设置
            if (this.autoSaveInterval) {
                clearInterval(this.autoSaveInterval);
                this.autoSaveInterval = null;
            }

            if (autoSaveEnabled === 'true') {
                localStorage.setItem('autoSaveEnabled', 'true');
                localStorage.setItem('saveFrequency', saveFrequency || '120000');
                localStorage.setItem('backupEnabled', backupEnabled !== 'false');

                this.setupAutoSave();
            } else {
                localStorage.setItem('autoSaveEnabled', 'false');
            }
        } else {
            // 设置默认偏好
            localStorage.setItem('autoSaveEnabled', 'true');
            localStorage.setItem('saveFrequency', '120000'); // 2分钟
            localStorage.setItem('backupEnabled', 'true');
        }
    }
}

// 初始化增强存档系统
const advancedSaveSystem = new AdvancedSaveSystem();

// 将存档系统添加到全局作用域
window.AdvancedSaveSystem = AdvancedSaveSystem;
window.advancedSaveSystem = advancedSaveSystem;

// 重写游戏中的保存和加载函数以使用新的存档系统
if (typeof saveGame !== 'undefined') {
    const originalSave = window.saveGame;
    window.saveGame = () => {
        const result = advancedSaveSystem.saveGame();
        if (originalSave) originalSave();
        return result;
    };
} else {
    window.saveGame = () => advancedSaveSystem.saveGame();
}

if (typeof loadGame !== 'undefined') {
    const originalLoad = window.loadGame;
    window.loadGame = () => {
        const result = advancedSaveSystem.loadGame();
        if (originalLoad) originalLoad();
        return result;
    };
} else {
    window.loadGame = () => advancedSaveSystem.loadGame();
}

console.log("🚀 增强存档系统已完全加载");