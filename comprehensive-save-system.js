// ==================== 完整存档系统 ====================
//
// 为游戏提供完整的存档功能，包括：
// 1. 游戏进度保存
// 2. 成就系统保存
// 3. 设置保存
// 4. 统计数据保存

class ComprehensiveSaveSystem {
    constructor() {
        this.saveKey = 'weaponRogueCompleteSave';
        this.backupKey = 'weaponRogueCompleteSave_backup';
        this.version = '2.0';
        this.autoSaveInterval = null;

        // 初始化游戏状态（如果不存在）
        this.initializeGameState();
    }

    // 初始化游戏状态
    initializeGameState() {
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

        // 确保必要对象存在
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
    }

    // 获取完整的存档数据
    getCompleteSaveData() {
        // 确保AchievementSystem存在
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

        return {
            version: this.version,
            timestamp: Date.now(),

            // 游戏进度
            progress: {
                level: gameState.level || 1,
                kills: gameState.kills || 0,
                score: gameState.score || 0,
                highestLevel: gameState.highestLevel || 1,
                totalKills: gameState.totalKills || 0,
                totalGames: gameState.totalGames || 0,
                winCount: gameState.winCount || 0,
                gamesWonWithDifferentWeapons: Array.from(gameState.gamesWonWithDifferentWeapons || [])
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

            // 成就系统
            achievements: {
                unlocked: AchievementSystem.achievements || {},
                tempStats: {
                    uniqueWeaponsUsed: Array.from(AchievementSystem.tempStats?.uniqueWeaponsUsed || []),
                    luckyKillCount: AchievementSystem.tempStats?.luckyKillCount || 0,
                    lowHpReviveCount: AchievementSystem.tempStats?.lowHpReviveCount || 0,
                    relicsCollected: AchievementSystem.tempStats?.relicsCollected || 0,
                    skillsUsed: AchievementSystem.tempStats?.skillsUsed || 0
                }
            },

            // 游戏设置
            settings: {
                soundEnabled: typeof soundEnabled !== 'undefined' ? soundEnabled : true,
                musicEnabled: typeof musicEnabled !== 'undefined' ? musicEnabled : true,
                difficulty: typeof selectedDifficulty !== 'undefined' ? selectedDifficulty : 'normal',
                language: typeof currentLanguage !== 'undefined' ? currentLanguage : 'zh'
            }
        };
    }

    // 保存游戏
    save() {
        try {
            const saveData = this.getCompleteSaveData();
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

            const saveData = JSON.parse(jsonString);

            // 版本检查
            if (saveData.version !== this.version) {
                console.warn(`存档版本不匹配: 存档版本 ${saveData.version}, 当前版本 ${this.version}`);
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

            // 恢复成就系统
            if (typeof AchievementSystem !== 'undefined') {
                AchievementSystem.achievements = saveData.achievements.unlocked || {};
                AchievementSystem.tempStats = {
                    uniqueWeaponsUsed: new Set(saveData.achievements.tempStats.uniqueWeaponsUsed || []),
                    luckyKillCount: saveData.achievements.tempStats.luckyKillCount || 0,
                    lowHpReviveCount: saveData.achievements.tempStats.lowHpReviveCount || 0,
                    relicsCollected: saveData.achievements.tempStats.relicsCollected || 0,
                    skillsUsed: saveData.achievements.tempStats.skillsUsed || 0
                };
            }

            // 恢复设置
            if (typeof saveData.settings !== 'undefined') {
                window.soundEnabled = saveData.settings.soundEnabled;
                window.musicEnabled = saveData.settings.musicEnabled;
                window.selectedDifficulty = saveData.settings.difficulty;
                window.currentLanguage = saveData.settings.language;

                // 更新UI语言（如果函数存在）
                if (typeof updateUIText !== 'undefined') {
                    updateUIText();
                }
            }

            if (typeof showCombatLog !== 'undefined') {
                showCombatLog('📂 存档已加载', 'load-success');
            }

            console.log('游戏进度已加载');
            return true;
        } catch (error) {
            console.error('加载失败:', error);
            if (typeof showCombatLog !== 'undefined') {
                showCombatLog('❌ 加载失败!', 'load-error');
            }
            return false;
        }
    }

    // 检查是否有存档
    hasSave() {
        const saveData = localStorage.getItem(this.saveKey);
        return !!saveData;
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
                playTime: saveData.stats.totalPlayTime
            };
        } catch (error) {
            console.error('获取存档信息失败:', error);
            return null;
        }
    }

    // 删除存档
    deleteSave() {
        try {
            localStorage.removeItem(this.saveKey);
            localStorage.removeItem(this.backupKey);

            if (typeof showCombatLog !== 'undefined') {
                showCombatLog('🗑️ 存档已删除', 'save-info');
            }

            // 重置到初始状态
            this.initializeGameState();

            return true;
        } catch (error) {
            console.error('删除存档失败:', error);
            return false;
        }
    }

    // 启动自动存档
    startAutoSave(intervalMs = 180000) { // 默认每3分钟自动保存
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

    // 导出存档数据
    exportSave() {
        try {
            const jsonString = localStorage.getItem(this.saveKey);
            if (!jsonString) {
                console.log('没有可导出的存档');
                return false;
            }

            // 创建下载
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `weapon-rogue-save-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
            document.body.appendChild(a);
            a.click();

            // 清理
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);

            return true;
        } catch (error) {
            console.error('导出存档失败:', error);
            return false;
        }
    }

    // 导入存档数据
    importSave(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const saveData = event.target.result;

                    // 验证JSON格式
                    JSON.parse(saveData);

                    // 保存到localStorage
                    localStorage.setItem(this.saveKey, saveData);

                    // 立即加载
                    this.load();

                    console.log('存档导入成功');
                    resolve(true);
                } catch (error) {
                    console.error('导入存档失败:', error);
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

    // 重置游戏到初始状态
    resetGame() {
        this.deleteSave();

        // 重置内存中的游戏状态
        this.initializeGameState();

        console.log('游戏已重置到初始状态');
    }
}

// 创建全局存档系统实例
window.comprehensiveSaveSystem = new ComprehensiveSaveSystem();

// 在游戏开始时尝试加载存档
window.addEventListener('load', () => {
    setTimeout(() => {
        if (typeof gameState !== 'undefined' && !gameState.isPlaying) {
            // 只有当游戏未在进行中时才加载存档
            window.comprehensiveSaveSystem.load();
        }
    }, 1500); // 延迟加载，确保其他系统已初始化
});

// 启动自动存档（在游戏真正开始后再启动）
function startAutoSaveWhenGameStarts() {
    if (typeof gameState !== 'undefined' && gameState.isPlaying) {
        window.comprehensiveSaveSystem.startAutoSave();
    } else {
        setTimeout(startAutoSaveWhenGameStarts, 1000);
    }
}

// 监听游戏开始事件以启动自动存档
if (typeof startGame !== 'undefined') {
    const originalStartGame = startGame;
    window.startGame = function() {
        originalStartGame.call(this);
        window.comprehensiveSaveSystem.startAutoSave();
    };
}

console.log("完整存档系统已初始化");