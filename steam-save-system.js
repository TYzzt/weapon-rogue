// ==================== Steam增强存档系统 ====================
//
// 为Steam发布准备的高级存档系统，包括：
// 1. 自动存档功能
// 2. 云存档接口预留
// 3. 存档备份机制
// 4. Steam统计同步

class SteamSaveSystem {
    constructor() {
        this.saveKey = 'weaponRogueSteamSave';
        this.backupKey = 'weaponRogueSteamSave_backup';
        this.version = '2.0'; // 升级版本以配合Steam发布
        this.autoSaveInterval = null;
    }

    // 获取完整存档数据
    getFullSaveData() {
        return {
            version: this.version,
            timestamp: Date.now(),
            saveId: this.generateSaveId(),
            // 游戏进度
            progress: {
                highestLevel: gameState.highestLevel || gameState.level || 1,
                totalKills: gameState.totalKills || gameState.kills || 0,
                totalGames: gameState.totalGames || 1,
                winCount: gameState.winCount || 0,
                gamesWonWithDifferentWeapons: gameState.gamesWonWithDifferentWeapons || new Set(),
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
            // 成就状态
            achievements: {
                unlocked: AchievementSystem?.achievements || {},
                progress: this.serializeAchievementProgress(AchievementSystem?.tempStats || {})
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
            // 武器统计
            weaponStats: gameState.weaponStats || {},
            // 游戏统计
            stats: {
                totalPlayTime: gameState.totalPlayTime || 0,
                gamesPlayed: gameState.gamesPlayed || 0,
                totalDamageDealt: gameState.totalDamageDealt || 0,
                totalDamageTaken: gameState.totalDamageTaken || 0,
                skillsUsed: gameState.skillsUsed || { Q: 0, W: 0, E: 0, R: 0 },
                weaponsCollected: gameState.weaponsCollected || 0,
                relicsCollected: gameState.relicsCollected || 0,
                potionsUsed: gameState.potionsUsed || 0,
                bossesDefeated: gameState.bossesDefeated || 0
            },
            // Steam特定数据
            steamData: {
                steamAchievementsUnlocked: gameState.steamAchievementsUnlocked || [],
                cloudSyncEnabled: gameState.cloudSyncEnabled || false,
                lastCloudSync: gameState.lastCloudSync || null
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

    // 保存游戏（主存档）
    save() {
        try {
            const saveData = this.getFullSaveData();
            localStorage.setItem(this.saveKey, JSON.stringify(saveData));

            // 创建备份
            this.createBackup(saveData);

            console.log('游戏进度已保存', saveData);

            // 显示保存成功的提示
            if (typeof showCombatLog !== 'undefined') {
                showCombatLog('💾 进度已自动保存', 'weapon-get');
            }

            // 如果支持Steam API，同步统计数据
            this.syncWithSteamStats(saveData);

            return true;
        } catch (error) {
            console.error('保存失败:', error);
            if (typeof showCombatLog !== 'undefined') {
                showCombatLog('⚠️ 保存失败', 'weapon-lose');
            }
            return false;
        }
    }

    // 从备份恢复
    restoreFromBackup() {
        try {
            const backupDataStr = localStorage.getItem(this.backupKey);
            if (!backupDataStr) {
                console.log('没有找到备份存档');
                return false;
            }

            const saveData = JSON.parse(backupDataStr);
            localStorage.setItem(this.saveKey, JSON.stringify(saveData));
            console.log('从备份恢复存档成功');

            if (typeof showCombatLog !== 'undefined') {
                showCombatLog('🔄 从备份恢复成功', 'weapon-get');
            }

            return true;
        } catch (error) {
            console.error('从备份恢复失败:', error);
            return false;
        }
    }

    // 创建备份
    createBackup(saveData) {
        try {
            // 只保留最近的备份
            localStorage.setItem(this.backupKey, JSON.stringify(saveData));
        } catch (error) {
            console.error('创建备份失败:', error);
        }
    }

    // 加载游戏
    load() {
        try {
            let saveDataStr = localStorage.getItem(this.saveKey);

            // 如果主存档损坏，尝试从备份加载
            if (!saveDataStr) {
                console.log('主存档不存在，尝试从备份加载');
                saveDataStr = localStorage.getItem(this.backupKey);
                if (!saveDataStr) {
                    console.log('没有找到存档或备份');
                    return false;
                }
            }

            let saveData;
            try {
                saveData = JSON.parse(saveDataStr);
            } catch (parseError) {
                console.error('存档解析失败:', parseError);
                // 尝试从备份加载
                return this.restoreFromBackup();
            }

            // 检查存档版本兼容性
            if (saveData.version) {
                if (parseFloat(saveData.version) > parseFloat(this.version)) {
                    console.warn('存档版本较新，可能存在兼容性问题');
                } else if (parseFloat(saveData.version) < 2.0) {
                    // 进行版本升级处理
                    saveData = this.upgradeSaveData(saveData);
                }
            }

            // 恢复游戏进度
            if (saveData.progress) {
                gameState.highestLevel = saveData.progress.highestLevel || 1;
                gameState.totalKills = saveData.progress.totalKills || 0;
                gameState.totalGames = saveData.progress.totalGames || 1;
                gameState.winCount = saveData.progress.winCount || 0;

                if (saveData.progress.gamesWonWithDifferentWeapons) {
                    gameState.gamesWonWithDifferentWeapons =
                        saveData.progress.gamesWonWithDifferentWeapons instanceof Set
                            ? saveData.progress.gamesWonWithDifferentWeapons
                            : new Set(saveData.progress.gamesWonWithDifferentWeapons);
                }

                // 恢复当前会话数据（但不覆盖正在进行的游戏）
                if (!gameState.isPlaying && saveData.progress.currentSession) {
                    gameState.level = saveData.progress.currentSession.level || 1;
                    gameState.kills = saveData.progress.currentSession.kills || 0;
                    if (gameState.player) {
                        gameState.player.score = saveData.progress.currentSession.score || 0;
                        gameState.player.hp = saveData.progress.currentSession.hp || 120;
                        gameState.player.maxHp = saveData.progress.currentSession.maxHp || 120;
                        gameState.player.maxCombo = saveData.progress.currentSession.maxCombo || 0;
                        gameState.player.weapon = saveData.progress.currentSession.weapon || null;
                    }
                    gameState.relics = saveData.progress.currentSession.relics || [];
                    gameState.sessionPlayTime = saveData.progress.currentSession.playTime || 0;
                }
            }

            // 恢复成就状态
            if (saveData.achievements && typeof AchievementSystem !== 'undefined') {
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

                // 更新UI语言
                if (typeof updateUIText !== 'undefined') {
                    updateUIText();
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
                gameState.weaponsCollected = saveData.stats.weaponsCollected || 0;
                gameState.relicsCollected = saveData.stats.relicsCollected || 0;
                gameState.potionsUsed = saveData.stats.potionsUsed || 0;
                gameState.bossesDefeated = saveData.stats.bossesDefeated || 0;
            }

            // 恢复Steam特定数据
            if (saveData.steamData) {
                gameState.steamAchievementsUnlocked = saveData.steamData.steamAchievementsUnlocked || [];
                gameState.cloudSyncEnabled = saveData.steamData.cloudSyncEnabled;
                gameState.lastCloudSync = saveData.steamData.lastCloudSync;
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

    // 升级旧版本存档数据
    upgradeSaveData(oldSaveData) {
        console.log('升级存档数据到最新版本...');

        // 添加缺失的字段
        if (!oldSaveData.steamData) {
            oldSaveData.steamData = {
                steamAchievementsUnlocked: [],
                cloudSyncEnabled: false,
                lastCloudSync: null
            };
        }

        if (!oldSaveData.progress.gamesWonWithDifferentWeapons) {
            oldSaveData.progress.gamesWonWithDifferentWeapons = new Set();
        }

        // 更新版本号
        oldSaveData.version = this.version;

        console.log('存档数据升级完成');
        return oldSaveData;
    }

    // 清除存档
    clear() {
        try {
            localStorage.removeItem(this.saveKey);
            localStorage.removeItem(this.backupKey);
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
                kills: saveData.progress?.totalKills || 0,
                achievementsUnlocked: Object.keys(saveData.achievements?.unlocked || {}).length,
                lastPlayed: new Date(saveData.timestamp).toLocaleString(),
                saveId: saveData.saveId || 'unknown'
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
            return true;
        }

        if (gameState.highScores.length < 10) {
            return true;
        }

        const lowestScore = gameState.highScores[gameState.highScores.length - 1].score;
        return score > lowestScore;
    }

    // 启动自动存档
    startAutoSave(intervalMs = 60000) { // 默认每分钟自动保存
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }

        this.autoSaveInterval = setInterval(() => {
            if (typeof gameState !== 'undefined' && gameState.isPlaying) {
                this.save();
            }
        }, intervalMs);

        console.log(`自动存档已启动，间隔: ${intervalMs}ms`);
    }

    // 停止自动存档
    stopAutoSave() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
            this.autoSaveInterval = null;
            console.log('自动存档已停止');
        }
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

    // 导出存档数据（用于迁移或备份）
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

            console.log('存档数据导出成功');
            return true;
        } catch (error) {
            console.error('存档数据导出失败:', error);
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
                    localStorage.setItem(this.saveKey, JSON.stringify(importedData));
                    console.log('存档数据导入成功');
                    resolve(true);
                } catch (error) {
                    console.error('存档数据导入失败:', error);
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
}

// 创建全局Steam存档系统实例
window.steamSaveSystem = new SteamSaveSystem();

// 初始化自动存档功能
window.steamSaveSystem.startAutoSave(120000); // 每2分钟自动保存一次

console.log("Steam增强存档系统已初始化");