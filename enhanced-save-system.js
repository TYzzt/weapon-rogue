// ==================== 增强版存档系统 ====================
//
// 扩展原始存档系统以支持更多功能
// 1. 保存特殊武器使用统计数据
// 2. 保存敌人AI交互数据
// 3. 保存新增的游戏统计数据
// 4. 保持向后兼容性

class EnhancedSaveManager {
    constructor() {
        this.saveKey = 'weaponRogueSave';
        this.version = '1.3'; // 更新版本号
        this.backupSaveKey = 'weaponRogueSave_backup';
    }

    // 获取完整的存档数据，包含新增功能的统计数据
    getSaveData() {
        // 首先获取原始存档数据
        let baseData = {};

        // 如果原版SaveManager存在，使用它的数据作为基础
        if (typeof SaveManager !== 'undefined' && typeof saveManager !== 'undefined') {
            // 创建一个临时的baseSaveData，以避免直接引用
            const tempSaveManager = new SaveManager();
            baseData = tempSaveManager.getSaveData();
        } else {
            // 否则构建基础数据结构
            baseData = {
                version: this.version,
                timestamp: Date.now(),
                progress: {
                    highestLevel: (typeof gameState !== 'undefined' && gameState.highestLevel) ? gameState.highestLevel : 1,
                    totalKills: (typeof gameState !== 'undefined' && gameState.totalKills) ? gameState.totalKills : 0,
                    totalGames: (typeof gameState !== 'undefined' && gameState.totalGames) ? gameState.totalGames : 1,
                    winCount: (typeof gameState !== 'undefined' && gameState.winCount) ? gameState.winCount : 0,
                    currentSession: {
                        level: (typeof gameState !== 'undefined' && gameState.level) ? gameState.level : 1,
                        kills: (typeof gameState !== 'undefined' && gameState.kills) ? gameState.kills : 0,
                        score: (typeof gameState !== 'undefined' && gameState.player && gameState.player.score) ? gameState.player.score : 0,
                        hp: (typeof gameState !== 'undefined' && gameState.player && gameState.player.hp) ? gameState.player.hp : 120,
                        maxHp: (typeof gameState !== 'undefined' && gameState.player && gameState.player.maxHp) ? gameState.player.maxHp : 120,
                        weapon: (typeof gameState !== 'undefined' && gameState.player && gameState.player.weapon) ? gameState.player.weapon : null,
                        maxCombo: (typeof gameState !== 'undefined' && gameState.player && gameState.player.maxCombo) ? gameState.player.maxCombo : 0,
                        relics: (typeof gameState !== 'undefined' && gameState.relics) ? gameState.relics : []
                    }
                },
                achievements: {
                    unlocked: (typeof AchievementSystem !== 'undefined' && AchievementSystem.achievements) ? AchievementSystem.achievements : {},
                    progress: {}
                },
                highScores: (typeof gameState !== 'undefined' && gameState.highScores) ? gameState.highScores : [
                    { score: 0, level: 0, date: '', playerName: 'Anonymous' }
                ],
                settings: {
                    soundEnabled: (typeof soundEnabled !== 'undefined') ? soundEnabled : true,
                    musicEnabled: (typeof musicEnabled !== 'undefined') ? musicEnabled : true,
                    difficulty: (typeof selectedDifficulty !== 'undefined') ? selectedDifficulty : 'normal',
                    language: (typeof currentLanguage !== 'undefined') ? currentLanguage : 'zh',
                    controllerEnabled: (typeof controllerEnabled !== 'undefined') ? controllerEnabled : false
                },
                weaponStats: (typeof gameState !== 'undefined' && gameState.weaponStats) ? gameState.weaponStats : {},
                stats: {
                    totalPlayTime: (typeof gameState !== 'undefined' && gameState.totalPlayTime) ? gameState.totalPlayTime : 0,
                    gamesPlayed: (typeof gameState !== 'undefined' && gameState.gamesPlayed) ? gameState.gamesPlayed : 0,
                    totalDamageDealt: (typeof gameState !== 'undefined' && gameState.totalDamageDealt) ? gameState.totalDamageDealt : 0,
                    totalDamageTaken: (typeof gameState !== 'undefined' && gameState.totalDamageTaken) ? gameState.totalDamageTaken : 0,
                    skillsUsed: (typeof gameState !== 'undefined' && gameState.skillsUsed) ? gameState.skillsUsed : { Q: 0, W: 0, E: 0, R: 0 }
                }
            };
        }

        // 扩展存档数据，添加新的统计信息
        const extendedData = {
            ...baseData,
            version: this.version, // 使用新版本号

            // 扩展的武器统计数据
            extendedWeaponStats: {
                // 特殊效果武器使用统计
                specialWeaponsUsed: (typeof gameState !== 'undefined' && gameState.extendedWeaponStats && gameState.extendedWeaponStats.specialWeaponsUsed)
                    ? gameState.extendedWeaponStats.specialWeaponsUsed
                    : {},

                // 各种元素效果触发次数
                elementalEffects: (typeof gameState !== 'undefined' && gameState.extendedWeaponStats && gameState.extendedWeaponStats.elementalEffects)
                    ? gameState.extendedWeaponStats.elementalEffects
                    : {
                        burn: 0,
                        freeze: 0,
                        stun: 0,
                        poison: 0,
                        lifeSteal: 0
                    },

                // 传奇/神话武器获得次数
                legendaryWeaponsObtained: (typeof gameState !== 'undefined' && gameState.extendedWeaponStats && gameState.extendedWeaponStats.legendaryWeaponsObtained)
                    ? gameState.extendedWeaponStats.legendaryWeaponsObtained
                    : {},

                // 最高单次伤害记录
                maxSingleDamage: (typeof gameState !== 'undefined' && gameState.extendedWeaponStats && gameState.extendedWeaponStats.maxSingleDamage)
                    ? gameState.extendedWeaponStats.maxSingleDamage
                    : 0
            },

            // 敌人AI交互统计数据
            enemyInteractionStats: {
                // 被各种元素效果影响的敌人数量
                enemiesAffectedByElemental: (typeof gameState !== 'undefined' && gameState.enemyInteractionStats && gameState.enemyInteractionStats.enemiesAffectedByElemental)
                    ? gameState.enemyInteractionStats.enemiesAffectedByElemental
                    : {
                        burn: 0,
                        freeze: 0,
                        stun: 0,
                        poison: 0
                    },

                // 逃跑的敌人数量（智能敌人AI特性）
                enemiesEscaped: (typeof gameState !== 'undefined' && gameState.enemyInteractionStats && gameState.enemyInteractionStats.enemiesEscaped)
                    ? gameState.enemyInteractionStats.enemiesEscaped
                    : 0,

                // 玩家被敌人击退/冻结/眩晕的次数
                playerAffectedByEnemies: (typeof gameState !== 'undefined' && gameState.enemyInteractionStats && gameState.enemyInteractionStats.playerAffectedByEnemies)
                    ? gameState.enemyInteractionStats.playerAffectedByEnemies
                    : {
                        stunned: 0,
                        slowed: 0,
                        damaged: 0
                    }
            },

            // 扩展游戏统计数据
            extendedGameStats: {
                // 最高连击数（在当前存档中）
                maxComboInSession: (typeof gameState !== 'undefined' && gameState.extendedGameStats && gameState.extendedGameStats.maxComboInSession)
                    ? gameState.extendedGameStats.maxComboInSession
                    : 0,

                // 通过的最高关卡（在当前存档中）
                maxLevelInSession: (typeof gameState !== 'undefined' && gameState.extendedGameStats && gameState.extendedGameStats.maxLevelInSession)
                    ? gameState.extendedGameStats.maxLevelInSession
                    : 1,

                // 使用特殊能力的次数
                specialAbilitiesUsed: (typeof gameState !== 'undefined' && gameState.extendedGameStats && gameState.extendedGameStats.specialAbilitiesUsed)
                    ? gameState.extendedGameStats.specialAbilitiesUsed
                    : {
                        teleportStrike: 0,
                        chainLightning: 0,
                        damageReflect: 0,
                        luckBoost: 0
                    },

                // 生命自然恢复总量
                totalNaturalHealing: (typeof gameState !== 'undefined' && gameState.extendedGameStats && gameState.extendedGameStats.totalNaturalHealing)
                    ? gameState.extendedGameStats.totalNaturalHealing
                    : 0,

                // 通过特殊效果击杀的敌人数量
                specialEffectKills: (typeof gameState !== 'undefined' && gameState.extendedGameStats && gameState.extendedGameStats.specialEffectKills)
                    ? gameState.extendedGameStats.specialEffectKills
                    : 0
            },

            // 游戏体验统计数据
            gameplayStats: {
                // 玩家存活最长时间（秒）
                longestSurvivalTime: (typeof gameState !== 'undefined' && gameState.gameplayStats && gameState.gameplayStats.longestSurvivalTime)
                    ? gameState.gameplayStats.longestSurvivalTime
                    : 0,

                // 总游戏会话数
                totalSessions: (typeof gameState !== 'undefined' && gameState.gameplayStats && gameState.gameplayStats.totalSessions)
                    ? gameState.gameplayStats.totalSessions
                    : 1,

                // 当前会话开始时间
                currentSessionStart: (typeof gameState !== 'undefined' && gameState.gameplayStats && gameState.gameplayStats.currentSessionStart)
                    ? gameState.gameplayStats.currentSessionStart
                    : Date.now(),

                // 选择难度分布
                difficultySelections: (typeof gameState !== 'undefined' && gameState.gameplayStats && gameState.gameplayStats.difficultySelections)
                    ? gameState.gameplayStats.difficultySelections
                    : {
                        easy: 0,
                        normal: 0,
                        hard: 0
                    }
            }
        };

        return extendedData;
    }

    // 保存游戏进度
    save() {
        try {
            const saveData = this.getSaveData();

            // 在保存前创建备份
            const currentSave = localStorage.getItem(this.saveKey);
            if (currentSave) {
                localStorage.setItem(this.backupSaveKey, currentSave);
            }

            localStorage.setItem(this.saveKey, JSON.stringify(saveData));
            console.log('增强版游戏进度已保存', saveData);

            // 显示保存成功的提示
            if (typeof showCombatLog !== 'undefined') {
                showCombatLog('💾 进度已自动保存（增强版）', 'weapon-get');
            }

            return true;
        } catch (error) {
            console.error('增强版保存失败:', error);
            // 尝试恢复备份
            this.restoreFromBackup();
            if (typeof showCombatLog !== 'undefined') {
                showCombatLog('⚠️ 增强版保存失败，已尝试恢复备份', 'weapon-lose');
            }
            return false;
        }
    }

    // 加载游戏进度
    load() {
        try {
            const saveDataStr = localStorage.getItem(this.saveKey);
            if (!saveDataStr) {
                console.log('没有找到增强版存档，尝试加载基础存档');

                // 尝试从基础存档加载
                if (typeof saveManager !== 'undefined') {
                    return saveManager.load();
                }

                return false;
            }

            let saveData;
            try {
                saveData = JSON.parse(saveDataStr);
            } catch (parseError) {
                console.error('增强版存档解析失败:', parseError);

                // 尝试解析基础存档
                if (typeof saveManager !== 'undefined') {
                    return saveManager.load();
                }

                return false;
            }

            // 检查存档版本，如果是旧版本，执行升级
            if (saveData.version && saveData.version < this.version) {
                saveData = this.upgradeSaveData(saveData);
            }

            // 恢复基础游戏数据（兼容旧系统）
            this.loadBaseData(saveData);

            // 恢复扩展数据
            this.loadExtendedData(saveData);

            console.log('增强版游戏进度已加载');
            if (typeof showCombatLog !== 'undefined') {
                showCombatLog('📂 增强版进度已加载', 'weapon-get');
            }

            return true;
        } catch (error) {
            console.error('增强版加载失败:', error);
            if (typeof showCombatLog !== 'undefined') {
                showCombatLog('⚠️ 增强版读取存档失败', 'weapon-lose');
            }
            return false;
        }
    }

    // 加载基础数据（兼容原版系统）
    loadBaseData(saveData) {
        // 恢复游戏进度
        if (saveData.progress) {
            if (typeof gameState !== 'undefined') {
                gameState.highestLevel = saveData.progress.highestLevel || gameState.highestLevel || 1;
                gameState.totalKills = saveData.progress.totalKills || gameState.totalKills || 0;
                gameState.totalGames = saveData.progress.totalGames || gameState.totalGames || 1;
                gameState.winCount = saveData.progress.winCount || gameState.winCount || 0;

                // 恢复当前会话数据（可选）
                if (saveData.progress.currentSession) {
                    // 注意：我们通常不会在中间加载会话数据，因为这会破坏当前游戏
                    // 这里只用于完整加载
                }
            }
        }

        // 恢复成就状态
        if (saveData.achievements && typeof AchievementSystem !== 'undefined') {
            AchievementSystem.achievements = saveData.achievements.unlocked || AchievementSystem.achievements || {};

            // 恢复成就进度
            if (saveData.achievements.progress) {
                if (typeof AchievementSystem.deserializeTempStats === 'function') {
                    AchievementSystem.tempStats = AchievementSystem.deserializeTempStats(saveData.achievements.progress);
                } else {
                    // 兼容性处理
                    AchievementSystem.tempStats = this.deserializeTempStats(saveData.achievements.progress);
                }
            }
        }

        // 恢复高分榜
        if (saveData.highScores && typeof gameState !== 'undefined') {
            gameState.highScores = saveData.highScores;
        }

        // 恢复设置
        if (saveData.settings) {
            if (typeof soundEnabled !== 'undefined') {
                soundEnabled = saveData.settings.soundEnabled;
            }
            if (typeof musicEnabled !== 'undefined') {
                musicEnabled = saveData.settings.musicEnabled;
            }
            if (typeof selectedDifficulty !== 'undefined') {
                selectedDifficulty = saveData.settings.difficulty;
            }
            if (typeof currentLanguage !== 'undefined') {
                currentLanguage = saveData.settings.language;

                // 更新UI语言
                if (typeof updateUIText !== 'undefined') {
                    updateUIText();
                }
            }
            if (typeof controllerEnabled !== 'undefined') {
                controllerEnabled = saveData.settings.controllerEnabled;
            }
        }

        // 恢复武器统计
        if (saveData.weaponStats && typeof gameState !== 'undefined') {
            gameState.weaponStats = saveData.weaponStats;
        }

        // 恢复游戏统计
        if (saveData.stats && typeof gameState !== 'undefined') {
            gameState.totalPlayTime = saveData.stats.totalPlayTime || 0;
            gameState.gamesPlayed = saveData.stats.gamesPlayed || 0;
            gameState.totalDamageDealt = saveData.stats.totalDamageDealt || 0;
            gameState.totalDamageTaken = saveData.stats.totalDamageTaken || 0;
            gameState.skillsUsed = saveData.stats.skillsUsed || { Q: 0, W: 0, E: 0, R: 0 };
        }
    }

    // 加载扩展数据（新功能相关）
    loadExtendedData(saveData) {
        if (typeof gameState !== 'undefined') {
            // 初始化扩展数据容器
            gameState.extendedWeaponStats = gameState.extendedWeaponStats || {};
            gameState.enemyInteractionStats = gameState.enemyInteractionStats || {};
            gameState.extendedGameStats = gameState.extendedGameStats || {};
            gameState.gameplayStats = gameState.gameplayStats || {};

            // 恢复扩展武器统计数据
            if (saveData.extendedWeaponStats) {
                gameState.extendedWeaponStats.specialWeaponsUsed =
                    saveData.extendedWeaponStats.specialWeaponsUsed ||
                    gameState.extendedWeaponStats.specialWeaponsUsed || {};

                gameState.extendedWeaponStats.elementalEffects =
                    saveData.extendedWeaponStats.elementalEffects ||
                    gameState.extendedWeaponStats.elementalEffects || {
                        burn: 0,
                        freeze: 0,
                        stun: 0,
                        poison: 0,
                        lifeSteal: 0
                    };

                gameState.extendedWeaponStats.legendaryWeaponsObtained =
                    saveData.extendedWeaponStats.legendaryWeaponsObtained ||
                    gameState.extendedWeaponStats.legendaryWeaponsObtained || {};

                gameState.extendedWeaponStats.maxSingleDamage =
                    saveData.extendedWeaponStats.maxSingleDamage ||
                    gameState.extendedWeaponStats.maxSingleDamage || 0;
            }

            // 恢复敌人交互统计数据
            if (saveData.enemyInteractionStats) {
                gameState.enemyInteractionStats.enemiesAffectedByElemental =
                    saveData.enemyInteractionStats.enemiesAffectedByElemental ||
                    gameState.enemyInteractionStats.enemiesAffectedByElemental || {
                        burn: 0,
                        freeze: 0,
                        stun: 0,
                        poison: 0
                    };

                gameState.enemyInteractionStats.enemiesEscaped =
                    saveData.enemyInteractionStats.enemiesEscaped ||
                    gameState.enemyInteractionStats.enemiesEscaped || 0;

                gameState.enemyInteractionStats.playerAffectedByEnemies =
                    saveData.enemyInteractionStats.playerAffectedByEnemies ||
                    gameState.enemyInteractionStats.playerAffectedByEnemies || {
                        stunned: 0,
                        slowed: 0,
                        damaged: 0
                    };
            }

            // 恢复扩展游戏统计数据
            if (saveData.extendedGameStats) {
                gameState.extendedGameStats.maxComboInSession =
                    saveData.extendedGameStats.maxComboInSession ||
                    gameState.extendedGameStats.maxComboInSession || 0;

                gameState.extendedGameStats.maxLevelInSession =
                    saveData.extendedGameStats.maxLevelInSession ||
                    gameState.extendedGameStats.maxLevelInSession || 1;

                gameState.extendedGameStats.specialAbilitiesUsed =
                    saveData.extendedGameStats.specialAbilitiesUsed ||
                    gameState.extendedGameStats.specialAbilitiesUsed || {
                        teleportStrike: 0,
                        chainLightning: 0,
                        damageReflect: 0,
                        luckBoost: 0
                    };

                gameState.extendedGameStats.totalNaturalHealing =
                    saveData.extendedGameStats.totalNaturalHealing ||
                    gameState.extendedGameStats.totalNaturalHealing || 0;

                gameState.extendedGameStats.specialEffectKills =
                    saveData.extendedGameStats.specialEffectKills ||
                    gameState.extendedGameStats.specialEffectKills || 0;
            }

            // 恢复游戏体验统计数据
            if (saveData.gameplayStats) {
                gameState.gameplayStats.longestSurvivalTime =
                    saveData.gameplayStats.longestSurvivalTime ||
                    gameState.gameplayStats.longestSurvivalTime || 0;

                gameState.gameplayStats.totalSessions =
                    saveData.gameplayStats.totalSessions ||
                    gameState.gameplayStats.totalSessions || 1;

                gameState.gameplayStats.currentSessionStart =
                    saveData.gameplayStats.currentSessionStart ||
                    gameState.gameplayStats.currentSessionStart || Date.now();

                gameState.gameplayStats.difficultySelections =
                    saveData.gameplayStats.difficultySelections ||
                    gameState.gameplayStats.difficultySelections || {
                        easy: 0,
                        normal: 0,
                        hard: 0
                    };
            }
        }
    }

    // 存档版本升级
    upgradeSaveData(saveData) {
        console.log(`升级存档从版本 ${saveData.version} 到 ${this.version}`);

        // 如果是1.2版本升级到1.3版本，添加缺失的扩展数据
        if (saveData.version === '1.2') {
            saveData.version = '1.3';

            // 添加扩展数据结构
            if (!saveData.extendedWeaponStats) {
                saveData.extendedWeaponStats = {
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

            if (!saveData.enemyInteractionStats) {
                saveData.enemyInteractionStats = {
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

            if (!saveData.extendedGameStats) {
                saveData.extendedGameStats = {
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

            if (!saveData.gameplayStats) {
                saveData.gameplayStats = {
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
        }
        // 如果是从1.1或更早版本升级
        else if (saveData.version < '1.2') {
            // 先升级到1.2版本（基础扩展）
            saveData.version = '1.2';

            // 然后继续升级到1.3
            saveData = this.upgradeSaveData(saveData);
        }

        return saveData;
    }

    // 恢复备份存档
    restoreFromBackup() {
        try {
            const backupData = localStorage.getItem(this.backupSaveKey);
            if (backupData) {
                localStorage.setItem(this.saveKey, backupData);
                console.log('已从备份恢复存档');
                return true;
            }
            return false;
        } catch (error) {
            console.error('从备份恢复失败:', error);
            return false;
        }
    }

    // 获取存档信息
    getSaveInfo() {
        try {
            const saveDataStr = localStorage.getItem(this.saveKey);
            if (!saveDataStr) {
                return null;
            }
            const saveData = JSON.parse(saveDataStr);
            return {
                exists: true,
                timestamp: saveData.timestamp,
                version: saveData.version,
                level: saveData.progress?.currentSession?.level || saveData.progress?.highestLevel || 1,
                score: saveData.progress?.currentSession?.score || 0,
                lastPlayed: new Date(saveData.timestamp).toLocaleString(),
                extendedFeatures: !!saveData.extendedWeaponStats // 是否包含扩展功能数据
            };
        } catch (error) {
            console.error('获取增强版存档信息失败:', error);
            return null;
        }
    }

    // 清除存档
    clear() {
        try {
            localStorage.removeItem(this.saveKey);
            localStorage.removeItem(this.backupSaveKey);
            console.log('增强版存档已删除');
            if (typeof showCombatLog !== 'undefined') {
                showCombatLog('🗑️ 增强版存档已清除', 'weapon-get');
            }
            return true;
        } catch (error) {
            console.error('增强版清除失败:', error);
            return false;
        }
    }

    // 将临时统计信息序列化（兼容性方法）
    serializeTempStats(tempStats) {
        if (!tempStats) return {};

        const serialized = {};
        for (const [key, value] of Object.entries(tempStats)) {
            if (value instanceof Set) {
                serialized[key] = Array.from(value);
            } else {
                serialized[key] = value;
            }
        }
        return serialized;
    }

    // 反序列化临时统计信息（兼容性方法）
    deserializeTempStats(serializedTempStats) {
        if (!serializedTempStats) return {};

        const deserialized = {};
        for (const [key, value] of Object.entries(serializedTempStats)) {
            if (Array.isArray(value)) {
                if (key.includes('Set') || ['uniqueWeaponsUsed', 'usedPotionTypes'].includes(key)) {
                    deserialized[key] = new Set(value);
                } else {
                    deserialized[key] = value;
                }
            } else {
                deserialized[key] = value;
            }
        }
        return deserialized;
    }
}

// 创建增强版存档管理器实例
const enhancedSaveManager = new EnhancedSaveManager();

// 重写autoSave函数以使用增强版存档管理器
function autoSave() {
    if (typeof gameState !== 'undefined' && gameState.isPlaying) {
        // 如果增强版存档管理器存在则使用它，否则使用原版
        if (typeof enhancedSaveManager !== 'undefined') {
            enhancedSaveManager.save();
        } else if (typeof saveManager !== 'undefined') {
            saveManager.save();
        }
    }
}

// 替换原有的自动保存定时器
if (typeof autoSaveTimer !== 'undefined') {
    clearInterval(autoSaveTimer);
}
// 设置自动保存（每2分钟自动保存一次）
const autoSaveTimer = setInterval(() => {
    autoSave();
}, 120000); // 每2分钟

console.log("增强版存档系统已初始化");