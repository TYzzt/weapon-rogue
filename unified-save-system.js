// ==================== 统一存档系统 ====================
//
// 合并以下系统的功能：
// 1. 基础存档系统 (save-system.js)
// 2. 增强存档系统 (enhanced-save-system.js)
// 3. Steam增强系统 (steam-enhancement.js 存档相关部分)
//
// 特性：
// - 保持所有现有功能
// - 解决命名冲突
// - 使用单一的 saveManager 实例
// - 保持与 game.js 的兼容性
// - 包含备份、导入导出、Steam云存档等功能

class UnifiedSaveManager {
    constructor() {
        this.saveKey = 'weaponRogueSave_Unified';           // 统一存档键名
        this.backupKey = 'weaponRogueSave_Unified_backup';  // 备份存档键名
        this.version = '3.0';                              // 统一版本号
        this.autoSaveInterval = null;                      // 自动保存定时器

        console.log("💾 统一存档系统已初始化");
    }

    // 获取完整的存档数据，整合所有系统功能
    getFullSaveData() {
        // 保证基础数据结构存在
        if (typeof gameState === 'undefined') {
            window.gameState = {
                level: 1,
                kills: 0,
                score: 0,
                highestLevel: 1,
                totalKills: 0,
                totalGames: 0,
                winCount: 0,
                isPlaying: false,
                sessionPlayTime: 0,
                totalPlayTime: 0,
                weaponsCollected: 0,
                relicsCollected: 0,
                potionsUsed: 0,
                bossesDefeated: 0,
                gamesWonWithDifferentWeapons: new Set(),

                player: {
                    hp: 150,
                    maxHp: 150,
                    weapon: null,
                    score: 0,
                    maxCombo: 0,
                    speed: 2.0
                },

                relics: [],
                enemies: [],
                weapons: [],
                potions: []
            };
        }

        if (!gameState.player) {
            gameState.player = {
                hp: 150,
                maxHp: 150,
                weapon: null,
                score: 0,
                maxCombo: 0,
                speed: 2.0
            };
        }

        if (!gameState.relics) gameState.relics = [];
        if (!gameState.enemies) gameState.enemies = [];
        if (!gameState.weapons) gameState.weapons = [];
        if (!gameState.potions) gameState.potions = [];

        // 确保成就系统存在
        if (typeof AchievementSystem === 'undefined') {
            window.AchievementSystem = {
                achievements: {},
                tempStats: {
                    uniqueWeaponsUsed: new Set(),
                    luckyKillCount: 0,
                    lowHpReviveCount: 0,
                    relicsCollected: 0,
                    skillsUsed: 0
                }
            };
        }

        // 构建完整的存档数据结构
        return {
            version: this.version,
            timestamp: Date.now(),
            saveId: this.generateSaveId(),

            // 游戏进度
            progress: {
                level: gameState.level || 1,
                kills: gameState.kills || 0,
                score: gameState.score || 0,
                highestLevel: gameState.highestLevel || 1,
                totalKills: gameState.totalKills || 0,
                totalGames: gameState.totalGames || 0,
                winCount: gameState.winCount || 0,
                gamesWonWithDifferentWeapons: Array.from(gameState.gamesWonWithDifferentWeapons || []),
                currentSession: {
                    level: gameState.level || 1,
                    kills: gameState.kills || 0,
                    score: gameState.player?.score || 0,
                    hp: gameState.player?.hp || 120,
                    maxHp: gameState.player?.maxHp || 120,
                    weapon: gameState.player?.weapon || null,
                    maxCombo: gameState.player?.maxCombo || 0,
                    relics: gameState.relics || [],
                    playTime: gameState.sessionPlayTime || 0
                }
            },

            // 玩家状态
            player: {
                hp: gameState.player?.hp || 150,
                maxHp: gameState.player?.maxHp || 150,
                weapon: gameState.player?.weapon || null,
                score: gameState.player?.score || 0,
                maxCombo: gameState.player?.maxCombo || 0,
                speed: gameState.player?.speed || 2.0
            },

            // 物品和收集品
            items: {
                relics: gameState.relics || [],
                weapons: gameState.weapons || [],
                potions: gameState.potions || []
            },

            // 统计数据
            stats: {
                sessionPlayTime: gameState.sessionPlayTime || 0,
                totalPlayTime: gameState.totalPlayTime || 0,
                weaponsCollected: gameState.weaponsCollected || 0,
                relicsCollected: gameState.relicsCollected || 0,
                potionsUsed: gameState.potionsUsed || 0,
                bossesDefeated: gameState.bossesDefeated || 0
            },

            // 扩展武器统计数据（增强版功能）
            extendedWeaponStats: {
                specialWeaponsUsed: (typeof gameState.extendedWeaponStats && gameState.extendedWeaponStats.specialWeaponsUsed)
                    ? gameState.extendedWeaponStats.specialWeaponsUsed
                    : {},

                elementalEffects: (typeof gameState.extendedWeaponStats && gameState.extendedWeaponStats.elementalEffects)
                    ? gameState.extendedWeaponStats.elementalEffects
                    : {
                        burn: 0,
                        freeze: 0,
                        stun: 0,
                        poison: 0,
                        lifeSteal: 0
                    },

                legendaryWeaponsObtained: (typeof gameState.extendedWeaponStats && gameState.extendedWeaponStats.legendaryWeaponsObtained)
                    ? gameState.extendedWeaponStats.legendaryWeaponsObtained
                    : {},

                maxSingleDamage: (typeof gameState.extendedWeaponStats && gameState.extendedWeaponStats.maxSingleDamage)
                    ? gameState.extendedWeaponStats.maxSingleDamage
                    : 0
            },

            // 敌人交互统计数据（增强版功能）
            enemyInteractionStats: {
                enemiesAffectedByElemental: (typeof gameState.enemyInteractionStats && gameState.enemyInteractionStats.enemiesAffectedByElemental)
                    ? gameState.enemyInteractionStats.enemiesAffectedByElemental
                    : {
                        burn: 0,
                        freeze: 0,
                        stun: 0,
                        poison: 0
                    },

                enemiesEscaped: (typeof gameState.enemyInteractionStats && gameState.enemyInteractionStats.enemiesEscaped)
                    ? gameState.enemyInteractionStats.enemiesEscaped
                    : 0,

                playerAffectedByEnemies: (typeof gameState.enemyInteractionStats && gameState.enemyInteractionStats.playerAffectedByEnemies)
                    ? gameState.enemyInteractionStats.playerAffectedByEnemies
                    : {
                        stunned: 0,
                        slowed: 0,
                        damaged: 0
                    }
            },

            // 扩展游戏统计数据（增强版功能）
            extendedGameStats: {
                maxComboInSession: (typeof gameState.extendedGameStats && gameState.extendedGameStats.maxComboInSession)
                    ? gameState.extendedGameStats.maxComboInSession
                    : 0,

                maxLevelInSession: (typeof gameState.extendedGameStats && gameState.extendedGameStats.maxLevelInSession)
                    ? gameState.extendedGameStats.maxLevelInSession
                    : 1,

                specialAbilitiesUsed: (typeof gameState.extendedGameStats && gameState.extendedGameStats.specialAbilitiesUsed)
                    ? gameState.extendedGameStats.specialAbilitiesUsed
                    : {
                        teleportStrike: 0,
                        chainLightning: 0,
                        damageReflect: 0,
                        luckBoost: 0
                    },

                totalNaturalHealing: (typeof gameState.extendedGameStats && gameState.extendedGameStats.totalNaturalHealing)
                    ? gameState.extendedGameStats.totalNaturalHealing
                    : 0,

                specialEffectKills: (typeof gameState.extendedGameStats && gameState.extendedGameStats.specialEffectKills)
                    ? gameState.extendedGameStats.specialEffectKills
                    : 0
            },

            // 游戏体验统计数据（增强版功能）
            gameplayStats: {
                longestSurvivalTime: (typeof gameState.gameplayStats && gameState.gameplayStats.longestSurvivalTime)
                    ? gameState.gameplayStats.longestSurvivalTime
                    : 0,

                totalSessions: (typeof gameState.gameplayStats && gameState.gameplayStats.totalSessions)
                    ? gameState.gameplayStats.totalSessions
                    : 1,

                currentSessionStart: (typeof gameState.gameplayStats && gameState.gameplayStats.currentSessionStart)
                    ? gameState.gameplayStats.currentSessionStart
                    : Date.now(),

                difficultySelections: (typeof gameState.gameplayStats && gameState.gameplayStats.difficultySelections)
                    ? gameState.gameplayStats.difficultySelections
                    : {
                        easy: 0,
                        normal: 0,
                        hard: 0
                    }
            },

            // 成就系统
            achievements: {
                unlocked: AchievementSystem.achievements || {},
                tempStats: this.serializeAchievementProgress(AchievementSystem.tempStats || {})
            },

            // 高分榜
            highScores: gameState.highScores || [
                { score: 0, level: 0, date: '', playerName: 'Anonymous' }
            ],

            // 游戏设置
            settings: {
                soundEnabled: typeof soundEnabled !== 'undefined' ? soundEnabled : true,
                musicEnabled: typeof musicEnabled !== 'undefined' ? musicEnabled : true,
                difficulty: typeof selectedDifficulty !== 'undefined' ? selectedDifficulty : 'normal',
                language: typeof currentLanguage !== 'undefined' ? currentLanguage : 'zh',
                controllerEnabled: typeof controllerEnabled !== 'undefined' ? controllerEnabled : false,
                effectsVolume: typeof effectsVolume !== 'undefined' ? effectsVolume : 0.7,
                musicVolume: typeof musicVolume !== 'undefined' ? musicVolume : 0.5
            },

            // Steam特定数据
            steamData: {
                steamAchievementsUnlocked: gameState.steamAchievementsUnlocked || [],
                cloudSyncEnabled: gameState.cloudSyncEnabled || false,
                lastCloudSync: gameState.lastCloudSync || null
            },

            // Steam增强功能（来自steam-enhancement.js）
            steamEnhancements: {
                exportEnabled: true,
                importEnabled: true,
                cloudSyncSupported: true
            }
        };
    }

    // 生成唯一的存档ID
    generateSaveId() {
        return 'save_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // 序列化成就进度（处理Set和复杂对象）
    serializeAchievementProgress(tempStats) {
        if (!tempStats) return {};

        const serialized = {};
        for (const [key, value] of Object.entries(tempStats)) {
            if (value instanceof Set) {
                serialized[key] = { type: 'Set', value: Array.from(value) };
            } else if (value instanceof Map) {
                serialized[key] = { type: 'Map', value: Array.from(value.entries()) };
            } else if (typeof value === 'object' && value !== null) {
                serialized[key] = { type: 'Object', value: value };
            } else {
                serialized[key] = { type: 'Primitive', value: value };
            }
        }
        return serialized;
    }

    // 反序列化成就进度
    deserializeAchievementProgress(serializedStats) {
        if (!serializedStats) return {};

        const deserialized = {};
        for (const [key, item] of Object.entries(serializedStats)) {
            if (item.type === 'Set') {
                deserialized[key] = new Set(item.value);
            } else if (item.type === 'Map') {
                deserialized[key] = new Map(item.value);
            } else if (item.type === 'Object') {
                deserialized[key] = item.value;
            } else {
                deserialized[key] = item.value;
            }
        }
        return deserialized;
    }

    // 保存游戏
    save() {
        try {
            const saveData = this.getFullSaveData();
            const jsonString = JSON.stringify(saveData);

            // 创建备份
            const existingSave = localStorage.getItem(this.saveKey);
            if (existingSave) {
                localStorage.setItem(this.backupKey, existingSave);
            }

            // 保存当前数据
            localStorage.setItem(this.saveKey, jsonString);

            // 显示保存提示
            if (typeof showCombatLog !== 'undefined') {
                showCombatLog('💾 游戏进度已保存', 'save-success');
            }

            // 同步Steam统计数据（如果可用）
            this.syncWithSteamStats(saveData);

            console.log('游戏进度已保存');
            return true;
        } catch (error) {
            console.error('保存失败:', error);
            if (typeof showCombatLog !== 'undefined') {
                showCombatLog('❌ 保存失败!', 'save-error');
            }
            return false;
        }
    }

    // 加载游戏
    load() {
        try {
            // 尝试从主存档加载
            let jsonString = localStorage.getItem(this.saveKey);

            // 如果主存档不存在，尝试从备份加载
            if (!jsonString) {
                jsonString = localStorage.getItem(this.backupKey);
                if (jsonString) {
                    if (typeof showCombatLog !== 'undefined') {
                        showCombatLog('🔄 从备份恢复存档', 'save-info');
                    }
                    console.log('从备份恢复存档');
                } else {
                    console.log('没有找到存档数据');
                    return false; // 没有存档不是错误，只是没有数据可加载
                }
            }

            let saveData;
            try {
                saveData = JSON.parse(jsonString);
            } catch (parseError) {
                console.error('存档解析失败:', parseError);
                return false;
            }

            // 版本兼容性检查
            if (saveData.version) {
                if (parseFloat(saveData.version) > parseFloat(this.version)) {
                    console.warn('存档版本较新，可能存在兼容性问题');
                } else if (parseFloat(saveData.version) < 3.0) {
                    // 执行版本升级
                    saveData = this.upgradeSaveData(saveData);
                }
            }

            // 恢复游戏进度
            gameState.level = saveData.progress.level || 1;
            gameState.kills = saveData.progress.kills || 0;
            gameState.score = saveData.progress.score || 0;
            gameState.highestLevel = Math.max(gameState.highestLevel || 1, saveData.progress.highestLevel || 1);
            gameState.totalKills = saveData.progress.totalKills || 0;
            gameState.totalGames = saveData.progress.totalGames || 0;
            gameState.winCount = saveData.progress.winCount || 0;
            gameState.gamesWonWithDifferentWeapons = new Set(saveData.progress.gamesWonWithDifferentWeapons || []);

            // 恢复玩家状态
            gameState.player = {
                hp: saveData.player.hp || 150,
                maxHp: saveData.player.maxHp || 150,
                weapon: saveData.player.weapon || null,
                score: saveData.player.score || 0,
                maxCombo: saveData.player.maxCombo || 0,
                speed: saveData.player.speed || 2.0
            };

            // 恢复物品
            gameState.relics = saveData.items.relics || [];
            gameState.weapons = saveData.items.weapons || [];
            gameState.potions = saveData.items.potions || [];

            // 恢复统计数据
            gameState.sessionPlayTime = saveData.stats.sessionPlayTime || 0;
            gameState.totalPlayTime = saveData.stats.totalPlayTime || 0;
            gameState.weaponsCollected = saveData.stats.weaponsCollected || 0;
            gameState.relicsCollected = saveData.stats.relicsCollected || 0;
            gameState.potionsUsed = saveData.stats.potionsUsed || 0;
            gameState.bossesDefeated = saveData.stats.bossesDefeated || 0;

            // 恢复扩展武器统计数据
            if (saveData.extendedWeaponStats) {
                gameState.extendedWeaponStats = gameState.extendedWeaponStats || {};
                gameState.extendedWeaponStats.specialWeaponsUsed = saveData.extendedWeaponStats.specialWeaponsUsed || {};
                gameState.extendedWeaponStats.elementalEffects = saveData.extendedWeaponStats.elementalEffects || {
                    burn: 0,
                    freeze: 0,
                    stun: 0,
                    poison: 0,
                    lifeSteal: 0
                };
                gameState.extendedWeaponStats.legendaryWeaponsObtained = saveData.extendedWeaponStats.legendaryWeaponsObtained || {};
                gameState.extendedWeaponStats.maxSingleDamage = saveData.extendedWeaponStats.maxSingleDamage || 0;
            }

            // 恢复敌人交互统计数据
            if (saveData.enemyInteractionStats) {
                gameState.enemyInteractionStats = gameState.enemyInteractionStats || {};
                gameState.enemyInteractionStats.enemiesAffectedByElemental = saveData.enemyInteractionStats.enemiesAffectedByElemental || {
                    burn: 0,
                    freeze: 0,
                    stun: 0,
                    poison: 0
                };
                gameState.enemyInteractionStats.enemiesEscaped = saveData.enemyInteractionStats.enemiesEscaped || 0;
                gameState.enemyInteractionStats.playerAffectedByEnemies = saveData.enemyInteractionStats.playerAffectedByEnemies || {
                    stunned: 0,
                    slowed: 0,
                    damaged: 0
                };
            }

            // 恢复扩展游戏统计数据
            if (saveData.extendedGameStats) {
                gameState.extendedGameStats = gameState.extendedGameStats || {};
                gameState.extendedGameStats.maxComboInSession = saveData.extendedGameStats.maxComboInSession || 0;
                gameState.extendedGameStats.maxLevelInSession = saveData.extendedGameStats.maxLevelInSession || 1;
                gameState.extendedGameStats.specialAbilitiesUsed = saveData.extendedGameStats.specialAbilitiesUsed || {
                    teleportStrike: 0,
                    chainLightning: 0,
                    damageReflect: 0,
                    luckBoost: 0
                };
                gameState.extendedGameStats.totalNaturalHealing = saveData.extendedGameStats.totalNaturalHealing || 0;
                gameState.extendedGameStats.specialEffectKills = saveData.extendedGameStats.specialEffectKills || 0;
            }

            // 恢复游戏体验统计数据
            if (saveData.gameplayStats) {
                gameState.gameplayStats = gameState.gameplayStats || {};
                gameState.gameplayStats.longestSurvivalTime = saveData.gameplayStats.longestSurvivalTime || 0;
                gameState.gameplayStats.totalSessions = saveData.gameplayStats.totalSessions || 1;
                gameState.gameplayStats.currentSessionStart = saveData.gameplayStats.currentSessionStart || Date.now();
                gameState.gameplayStats.difficultySelections = saveData.gameplayStats.difficultySelections || {
                    easy: 0,
                    normal: 0,
                    hard: 0
                };
            }

            // 恢复成就系统
            if (typeof AchievementSystem !== 'undefined') {
                AchievementSystem.achievements = saveData.achievements.unlocked || {};

                if (saveData.achievements.progress) {
                    AchievementSystem.tempStats = this.deserializeAchievementProgress(saveData.achievements.progress);

                    // 确保必要的Set对象存在
                    if (!AchievementSystem.tempStats.uniqueWeaponsUsed) {
                        AchievementSystem.tempStats.uniqueWeaponsUsed = new Set();
                    }
                    if (!AchievementSystem.tempStats.usedPotionTypes) {
                        AchievementSystem.tempStats.usedPotionTypes = new Set();
                    }
                    if (!AchievementSystem.tempStats.gamesWonWithDifferentWeapons) {
                        AchievementSystem.tempStats.gamesWonWithDifferentWeapons = new Set();
                    }
                }
            }

            // 恢复高分榜
            if (saveData.highScores) {
                gameState.highScores = saveData.highScores;
            }

            // 恢复设置
            if (saveData.settings) {
                window.soundEnabled = saveData.settings.soundEnabled;
                window.musicEnabled = saveData.settings.musicEnabled;
                window.selectedDifficulty = saveData.settings.difficulty;
                window.currentLanguage = saveData.settings.language;
                window.controllerEnabled = saveData.settings.controllerEnabled;
                window.effectsVolume = saveData.settings.effectsVolume;
                window.musicVolume = saveData.settings.musicVolume;

                // 更新UI语言（如果函数存在）
                if (typeof updateUIText !== 'undefined') {
                    updateUIText();
                }
            }

            // 恢复Steam特定数据
            if (saveData.steamData) {
                gameState.steamAchievementsUnlocked = saveData.steamData.steamAchievementsUnlocked || [];
                gameState.cloudSyncEnabled = saveData.steamData.cloudSyncEnabled;
                gameState.lastCloudSync = saveData.steamData.lastCloudSync;
            }

            if (typeof showCombatLog !== 'undefined') {
                showCombatLog('📂 存档已加载', 'load-success');
            }

            console.log('游戏进度已加载');
            return true;
        } catch (error) {
            console.error('加载失败:', error);

            // 尝试从备份恢复
            if (this.restoreFromBackup()) {
                console.log('从备份恢复成功');
                return true;
            }

            if (typeof showCombatLog !== 'undefined') {
                showCombatLog('❌ 加载失败!', 'load-error');
            }
            return false;
        }
    }

    // 升级旧版本存档数据
    upgradeSaveData(oldSaveData) {
        console.log(`升级存档从版本 ${oldSaveData.version} 到 ${this.version}`);

        // 如果是1.x或2.x版本升级到3.0版本，添加缺失的字段
        if (oldSaveData.version < '3.0') {
            // 确保所有必需的顶级属性都存在
            if (!oldSaveData.extendedWeaponStats) {
                oldSaveData.extendedWeaponStats = {
                    specialWeaponsUsed: {},
                    elementalEffects: {
                        burn: 0,
                        freeze: 0,
                        stun: 0,
                        poison: 0,
                        lifeSteal: 0
                    },
                    legendaryWeaponsObtained: {},
                    maxSingleDamage: 0
                };
            }

            if (!oldSaveData.enemyInteractionStats) {
                oldSaveData.enemyInteractionStats = {
                    enemiesAffectedByElemental: {
                        burn: 0,
                        freeze: 0,
                        stun: 0,
                        poison: 0
                    },
                    enemiesEscaped: 0,
                    playerAffectedByEnemies: {
                        stunned: 0,
                        slowed: 0,
                        damaged: 0
                    }
                };
            }

            if (!oldSaveData.extendedGameStats) {
                oldSaveData.extendedGameStats = {
                    maxComboInSession: 0,
                    maxLevelInSession: 1,
                    specialAbilitiesUsed: {
                        teleportStrike: 0,
                        chainLightning: 0,
                        damageReflect: 0,
                        luckBoost: 0
                    },
                    totalNaturalHealing: 0,
                    specialEffectKills: 0
                };
            }

            if (!oldSaveData.gameplayStats) {
                oldSaveData.gameplayStats = {
                    longestSurvivalTime: 0,
                    totalSessions: 1,
                    currentSessionStart: Date.now(),
                    difficultySelections: {
                        easy: 0,
                        normal: 0,
                        hard: 0
                    }
                };
            }

            if (!oldSaveData.steamData) {
                oldSaveData.steamData = {
                    steamAchievementsUnlocked: [],
                    cloudSyncEnabled: false,
                    lastCloudSync: null
                };
            }

            if (!oldSaveData.steamEnhancements) {
                oldSaveData.steamEnhancements = {
                    exportEnabled: true,
                    importEnabled: true,
                    cloudSyncSupported: true
                };
            }

            // 更新版本号
            oldSaveData.version = '3.0';
        }

        return oldSaveData;
    }

    // 从备份恢复
    restoreFromBackup() {
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

                if (typeof showCombatLog !== 'undefined') {
                    showCombatLog('🔄 从备份恢复成功', 'save-info');
                }

                return true;
            }
        } catch (error) {
            console.error('从备份恢复失败:', error);
        }

        return false;
    }

    // 清除存档
    clear() {
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

    // 获取存档信息
    getSaveInfo() {
        try {
            const jsonString = localStorage.getItem(this.saveKey);
            if (!jsonString) {
                return null;
            }

            const saveData = JSON.parse(jsonString);
            return {
                exists: true,
                level: saveData.progress.level,
                kills: saveData.progress.kills,
                score: saveData.progress.score,
                highestLevel: saveData.progress.highestLevel,
                achievementsUnlocked: Object.keys(saveData.achievements.unlocked).length,
                timestamp: new Date(saveData.timestamp).toLocaleString(),
                playTime: saveData.stats.totalPlayTime,
                version: saveData.version,
                saveId: saveData.saveId
            };
        } catch (error) {
            console.error('获取存档信息失败:', error);
            return null;
        }
    }

    // 检查是否有存档
    hasSave() {
        const saveData = localStorage.getItem(this.saveKey);
        return !!saveData;
    }

    // 启动自动存档
    startAutoSave(intervalMs = 120000) { // 默认每2分钟自动保存
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }

        this.autoSaveInterval = setInterval(() => {
            if (typeof gameState !== 'undefined' && gameState.isPlaying) {
                this.save();
            }
        }, intervalMs);

        console.log(`⏰ 自动存档已启动，间隔: ${intervalMs}ms`);
    }

    // 停止自动存档
    stopAutoSave() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
            this.autoSaveInterval = null;
            console.log('⏰ 自动存档已停止');
        }
    }

    // 导出存档数据
    exportSaveData() {
        try {
            const saveData = this.getFullSaveData();
            const dataStr = JSON.stringify(saveData, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

            // 创建下载链接
            const exportLink = document.createElement('a');
            exportLink.setAttribute('href', dataUri);
            exportLink.setAttribute('download', `weapon-rogue-save-${Date.now()}.json`);
            document.body.appendChild(exportLink);
            exportLink.click();
            document.body.removeChild(exportLink);

            console.log('💾 存档数据导出成功');
            if (typeof showCombatLog !== 'undefined') {
                showCombatLog('💾 存档已导出', 'save-success');
            }
            return true;
        } catch (error) {
            console.error('存档数据导出失败:', error);
            if (typeof showCombatLog !== 'undefined') {
                showCombatLog('❌ 存档导出失败!', 'save-error');
            }
            return false;
        }
    }

    // 导入存档数据
    importSaveData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const importedData = JSON.parse(event.target.result);

                    // 验证数据格式
                    if (!importedData.version) {
                        throw new Error('无效的存档文件格式');
                    }

                    localStorage.setItem(this.saveKey, JSON.stringify(importedData));

                    // 立即加载导入的数据
                    this.load();

                    console.log('💾 存档数据导入成功');
                    if (typeof showCombatLog !== 'undefined') {
                        showCombatLog('💾 存档已导入', 'save-success');
                    }

                    resolve(true);
                } catch (error) {
                    console.error('存档数据导入失败:', error);
                    if (typeof showCombatLog !== 'undefined') {
                        showCombatLog('❌ 存档导入失败!', 'save-error');
                    }
                    reject(error);
                }
            };
            reader.onerror = (error) => {
                console.error('读取存档文件失败:', error);
                reject(error);
            };
            reader.readAsText(file);
        });
    }

    // 同步Steam统计数据（预留接口）
    syncWithSteamStats(saveData) {
        // 这里是预留的Steam API同步接口
        // 在实际集成Steamworks SDK时实现具体功能

        if (window.steamInitialized && typeof steamSetStat !== 'undefined') {
            try {
                // 同步关键统计数据到Steam
                steamSetStat('HighestLevelReached', saveData.progress.highestLevel || 0);
                steamSetStat('TotalKills', saveData.progress.totalKills || 0);
                steamSetStat('GamesWon', saveData.progress.winCount || 0);
                steamSetStat('TotalPlayTime', saveData.stats.totalPlayTime || 0);
                steamSetStat('AchievementsUnlocked', Object.keys(saveData.achievements.unlocked || {}).length);

                // 记录同步时间
                gameState.lastCloudSync = Date.now();
            } catch (error) {
                console.error('Steam统计数据同步失败:', error);
            }
        }
    }

    // 添加分数到高分榜
    addHighScore(score, level, playerName = 'Anonymous') {
        const newEntry = {
            score: score,
            level: level,
            date: new Date().toISOString(),
            playerName: playerName
        };

        if (!gameState.highScores) {
            gameState.highScores = [];
        }

        // 添加新记录并排序（保留前10名）
        gameState.highScores.push(newEntry);
        gameState.highScores.sort((a, b) => b.score - a.score);

        // 只保留前10名
        gameState.highScores = gameState.highScores.slice(0, 10);

        // 保存更新后的高分榜
        this.save();

        return gameState.highScores;
    }

    // 检查是否是高分
    isHighScore(score) {
        if (!gameState.highScores) {
            return true; // 如果还没有高分榜，则任何分数都是高分
        }

        if (gameState.highScores.length < 10) {
            return true; // 如果还没满10个记录，则任何分数都是高分
        }

        // 检查是否比最低分高
        const lowestScore = gameState.highScores[gameState.highScores.length - 1].score;
        return score > lowestScore;
    }

    // 重置游戏到初始状态
    resetGame() {
        this.clear();

        // 重置内存中的游戏状态
        if (typeof gameState !== 'undefined') {
            gameState.level = 1;
            gameState.kills = 0;
            gameState.score = 0;
            gameState.highestLevel = 1;
            gameState.totalKills = 0;
            gameState.totalGames = 0;
            gameState.winCount = 0;
            gameState.isPlaying = false;
            gameState.sessionPlayTime = 0;
            gameState.totalPlayTime = 0;
            gameState.weaponsCollected = 0;
            gameState.relicsCollected = 0;
            gameState.potionsUsed = 0;
            gameState.bossesDefeated = 0;
            gameState.gamesWonWithDifferentWeapons = new Set();

            if (gameState.player) {
                gameState.player.hp = 150;
                gameState.player.maxHp = 150;
                gameState.player.weapon = null;
                gameState.player.score = 0;
                gameState.player.maxCombo = 0;
                gameState.player.speed = 2.0;
            }

            gameState.relics = [];
            gameState.enemies = [];
            gameState.weapons = [];
            gameState.potions = [];

            // 重置统计
            gameState.extendedWeaponStats = {};
            gameState.enemyInteractionStats = {};
            gameState.extendedGameStats = {};
            gameState.gameplayStats = {};
        }

        console.log('🎮 游戏已重置到初始状态');
    }
}

// 创建全局存档管理器实例
window.saveManager = new UnifiedSaveManager();
window.UnifiedSaveManager = UnifiedSaveManager;

// 替换旧有的 autoSave 函数以使用新的统一存档系统
function autoSave() {
    if (typeof gameState !== 'undefined' && gameState.isPlaying) {
        saveManager.save();
    }
}

// 设置自动保存（每2分钟自动保存一次）
if (typeof autoSaveTimer !== 'undefined') {
    clearInterval(autoSaveTimer);
}

// 设置自动保存定时器
const autoSaveTimer = setInterval(() => {
    autoSave();
}, 120000); // 每2分钟

// 与game.js的兼容性处理 - 保持原有的save/load/clear函数别名
if (typeof SaveSystem === 'undefined') {
    window.SaveSystem = {
        save: () => saveManager.save(),
        load: () => saveManager.load(),
        clear: () => saveManager.clear()
    };
}

console.log("✅ 统一存档系统已完全加载并准备好使用");