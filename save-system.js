// ==================== 高级存档系统 ====================

class SaveManager {
    constructor() {
        this.saveKey = 'weaponRogueSave';
        this.version = '1.2'; // 存档版本，用于后续更新
    }

    // 完整的存档数据结构
    getSaveData() {
        return {
            version: this.version,
            timestamp: Date.now(),
            // 游戏进度
            progress: {
                highestLevel: gameState.highestLevel || gameState.level || 1,
                totalKills: gameState.totalKills || gameState.kills || 0,
                totalGames: gameState.totalGames || 1,
                winCount: gameState.winCount || 0,
                currentSession: {
                    level: gameState.level || 1,
                    kills: gameState.kills || 0,
                    score: gameState.player?.score || 0,
                    hp: gameState.player?.hp || 120,
                    maxHp: gameState.player?.maxHp || 120,
                    weapon: gameState.player?.weapon || null,
                    maxCombo: gameState.player?.maxCombo || 0,
                    relics: gameState.relics || []
                }
            },
            // 成就状态
            achievements: {
                unlocked: AchievementSystem.achievements || {},
                // 将Set转换为Array以便存储
                progress: this.serializeTempStats(AchievementSystem.tempStats || {})
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
                controllerEnabled: typeof controllerEnabled !== 'undefined' ? controllerEnabled : false
            },
            // 武器统计
            weaponStats: gameState.weaponStats || {},
            // 游戏统计
            stats: {
                totalPlayTime: gameState.totalPlayTime || 0,
                gamesPlayed: gameState.gamesPlayed || 0,
                totalDamageDealt: gameState.totalDamageDealt || 0,
                totalDamageTaken: gameState.totalDamageTaken || 0,
                skillsUsed: gameState.skillsUsed || { Q: 0, W: 0, E: 0, R: 0 }
            }
        };
    }

    // 将临时统计信息序列化（将Set转换为数组）
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

    // 反序列化临时统计信息（将数组转换回Set）
    deserializeTempStats(serializedTempStats) {
        if (!serializedTempStats) return {};

        const deserialized = {};
        for (const [key, value] of Object.entries(serializedTempStats)) {
            if (Array.isArray(value)) {
                // 检测是否应该是Set（通过名称判断常见的Set字段）
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

    // 保存游戏
    save() {
        try {
            const saveData = this.getSaveData();
            localStorage.setItem(this.saveKey, JSON.stringify(saveData));
            console.log('游戏进度已保存', saveData);

            // 显示保存成功的提示
            if (typeof showCombatLog !== 'undefined') {
                showCombatLog('💾 进度已自动保存', 'weapon-get');
            }

            return true;
        } catch (error) {
            console.error('保存失败:', error);
            if (typeof showCombatLog !== 'undefined') {
                showCombatLog('⚠️ 保存失败', 'weapon-lose');
            }
            return false;
        }
    }

    // 加载游戏
    load() {
        try {
            const saveDataStr = localStorage.getItem(this.saveKey);
            if (!saveDataStr) {
                console.log('没有找到存档');
                return false;
            }

            let saveData;
            try {
                saveData = JSON.parse(saveDataStr);
            } catch (parseError) {
                console.error('存档解析失败:', parseError);
                return false;
            }

            // 检查存档版本
            if (saveData.version !== this.version) {
                console.log(`存档版本不匹配，当前版本: ${this.version}, 存档版本: ${saveData.version}`);
                // 可以在这里添加版本转换逻辑
            }

            // 恢复游戏进度
            if (saveData.progress) {
                gameState.highestLevel = saveData.progress.highestLevel || 1;
                gameState.totalKills = saveData.progress.totalKills || 0;
                gameState.totalGames = saveData.progress.totalGames || 1;
                gameState.winCount = saveData.progress.winCount || 0;

                // 恢复当前会话数据
                if (saveData.progress.currentSession) {
                    gameState.level = saveData.progress.currentSession.level || 1;
                    gameState.kills = saveData.progress.currentSession.kills || 0;

                    // 如果游戏正在进行中，可以选择是否恢复当前进度
                    // 或者只是记录历史数据而不影响当前游戏
                }
            }

            // 恢复成就状态
            if (saveData.achievements) {
                AchievementSystem.achievements = saveData.achievements.unlocked || {};

                // 恢复成就进度（反序列化Set对象）
                if (saveData.achievements.progress) {
                    AchievementSystem.tempStats = this.deserializeTempStats(saveData.achievements.progress);

                    // 确保tempStats是一个对象，而不是undefined
                    if (!AchievementSystem.tempStats) {
                        AchievementSystem.tempStats = {};
                    }

                    // 确保必要的Set对象存在
                    if (!AchievementSystem.tempStats.uniqueWeaponsUsed) {
                        AchievementSystem.tempStats.uniqueWeaponsUsed = new Set();
                    }
                    if (!AchievementSystem.tempStats.usedPotionTypes) {
                        AchievementSystem.tempStats.usedPotionTypes = new Set();
                    }
                }
            }

            // 恢复高分榜
            if (saveData.highScores) {
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
            if (saveData.weaponStats) {
                gameState.weaponStats = saveData.weaponStats;
            }

            // 恢复游戏统计
            if (saveData.stats) {
                gameState.totalPlayTime = saveData.stats.totalPlayTime || 0;
                gameState.gamesPlayed = saveData.stats.gamesPlayed || 0;
                gameState.totalDamageDealt = saveData.stats.totalDamageDealt || 0;
                gameState.totalDamageTaken = saveData.stats.totalDamageTaken || 0;
                gameState.skillsUsed = saveData.stats.skillsUsed || { Q: 0, W: 0, E: 0, R: 0 };
            }

            console.log('游戏进度已加载');
            if (typeof showCombatLog !== 'undefined') {
                showCombatLog('📂 进度已加载', 'weapon-get');
            }

            return true;
        } catch (error) {
            console.error('加载失败:', error);
            if (typeof showCombatLog !== 'undefined') {
                showCombatLog('⚠️ 读取存档失败', 'weapon-lose');
            }
            return false;
        }
    }

    // 清除存档
    clear() {
        try {
            localStorage.removeItem(this.saveKey);
            console.log('存档已删除');
            if (typeof showCombatLog !== 'undefined') {
                showCombatLog('🗑️ 存档已清除', 'weapon-get');
            }
            return true;
        } catch (error) {
            console.error('清除失败:', error);
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
                lastPlayed: new Date(saveData.timestamp).toLocaleString()
            };
        } catch (error) {
            console.error('获取存档信息失败:', error);
            return null;
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
}

// 创建全局存档管理器实例
const saveManager = new SaveManager();

// 自动保存功能
function autoSave() {
    if (typeof gameState !== 'undefined' && gameState.isPlaying) {
        saveManager.save();
    }
}

// 设置自动保存（每2分钟自动保存一次）
setInterval(() => {
    autoSave();
}, 120000); // 每2分钟