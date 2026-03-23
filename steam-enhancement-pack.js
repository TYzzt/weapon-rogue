// ==================== Steam版增强包 ====================
//
// 本文件包含为Steam发布专门优化的功能：
// 1. 完善的存档系统增强
// 2. 丰富的音效系统
// 3. 优化的成就系统
// 4. 游戏平衡性微调

class SteamEnhancementPack {
    constructor() {
        this.version = '1.0';
        console.log("🚀 Steam版增强包已加载");

        // 应用各项增强功能
        this.enhanceSaveSystem();
        this.enhanceAudioSystem();
        this.enhanceAchievementSystem();
        this.balanceGameplay();
    }

    // 1. 完善存档系统
    enhanceSaveSystem() {
        // 扩展SaveManager功能
        if (typeof SaveManager !== 'undefined') {
            // 添加备份机制
            SaveManager.prototype.backupSave = function() {
                try {
                    const currentSave = localStorage.getItem(this.saveKey);
                    if (currentSave) {
                        localStorage.setItem(`${this.saveKey}_backup`, currentSave);
                        console.log("💾 存档备份已创建");
                    }
                } catch (error) {
                    console.error("备份存档时出错:", error);
                }
            };

            // 添加导入导出功能
            SaveManager.prototype.exportSave = function() {
                try {
                    const saveData = this.getSaveData();
                    const saveString = JSON.stringify(saveData);
                    const blob = new Blob([saveString], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);

                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'weapon-rogue-save.json';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);

                    console.log("💾 存档已导出");
                    return true;
                } catch (error) {
                    console.error("导出存档时出错:", error);
                    return false;
                }
            };

            SaveManager.prototype.importSave = function(file) {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        try {
                            const saveData = JSON.parse(event.target.result);
                            localStorage.setItem(this.saveKey, JSON.stringify(saveData));
                            console.log("💾 存档已导入");
                            resolve(saveData);
                        } catch (error) {
                            console.error("导入存档时出错:", error);
                            reject(error);
                        }
                    };
                    reader.onerror = (error) => reject(error);
                    reader.readAsText(file);
                });
            };

            // 添加云同步占位符（实际Steam云存档需通过Steamworks API实现）
            SaveManager.prototype.syncToCloud = function() {
                console.log("☁️ 云存档同步（Steam版本）");
                // 此处为Steamworks API集成预留
            };
        }
    }

    // 2. 丰富音效系统
    enhanceAudioSystem() {
        if (typeof AudioManager !== 'undefined') {
            // 扩展AudioManager功能
            AudioManager.prototype.sounds = {
                // 原有音效
                hit: { frequency: 800, duration: 0.1, type: 'sine' },
                pickup: { frequency: 523.25, duration: 0.3, type: 'triangle' },
                levelup: { frequency: [523.25, 659.25, 783.99], duration: 0.5, type: 'sine' },
                death: { frequency: 200, duration: 0.8, type: 'sawtooth' },
                skill: { frequency: 1000, duration: 0.2, type: 'square' },

                // 新增音效
                weapon_rare: { frequency: [659.25, 783.99, 1046.50], duration: 0.6, type: 'sine', volume: 0.4 },
                weapon_epic: { frequency: [523.25, 659.25, 783.99, 1046.50], duration: 0.8, type: 'sine', volume: 0.5 },
                weapon_legendary: { frequency: [392.00, 523.25, 659.25, 783.99, 1046.50], duration: 1.2, type: 'sine', volume: 0.6 },
                weapon_mythic: { frequency: [349.23, 440.00, 523.25, 659.25, 783.99, 1046.50], duration: 1.5, type: 'sine', volume: 0.7 },
                menu_click: { frequency: 400, duration: 0.05, type: 'sine', volume: 0.2 },
                achievement_unlock: { frequency: [523.25, 659.25, 783.99, 1046.50, 1244.51], duration: 1.0, type: 'sine', volume: 0.5 },
                combo_increase: { frequency: 700, duration: 0.1, type: 'sine', volume: 0.3 },
                item_drop: { frequency: 300, duration: 0.1, type: 'sawtooth', volume: 0.2 },
                enemy_spawn: { frequency: 150, duration: 0.3, type: 'square', volume: 0.3 },
                boss_appear: { frequency: [100, 150, 200], duration: 1.0, type: 'sawtooth', volume: 0.6 }
            };

            // 扩展播放方法
            AudioManager.prototype.playSoundExtended = function(type) {
                if (!this.enabled || !this.audioContext) return;

                const soundConfig = this.sounds[type];
                if (!soundConfig) {
                    // 如果找不到特定音效，则播放基础音效
                    this.playSound(type);
                    return;
                }

                try {
                    const gainNode = this.audioContext.createGain();
                    gainNode.gain.value = soundConfig.volume || 0.3;
                    gainNode.connect(this.audioContext.destination);

                    if (Array.isArray(soundConfig.frequency)) {
                        // 播放和弦音效
                        soundConfig.frequency.forEach((freq, index) => {
                            setTimeout(() => {
                                const oscillator = this.audioContext.createOscillator();
                                oscillator.type = soundConfig.type || 'sine';
                                oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                                oscillator.connect(gainNode);
                                oscillator.start(this.audioContext.currentTime);
                                oscillator.stop(this.audioContext.currentTime + soundConfig.duration);
                            }, index * 50); // 稍微错开播放时间以产生和弦效果
                        });
                    } else {
                        // 播放单音音效
                        const oscillator = this.audioContext.createOscillator();
                        oscillator.type = soundConfig.type || 'sine';
                        oscillator.frequency.setValueAtTime(soundConfig.frequency, this.audioContext.currentTime);
                        oscillator.connect(gainNode);
                        oscillator.start(this.audioContext.currentTime);
                        oscillator.stop(this.audioContext.currentTime + soundConfig.duration);
                    }
                } catch (error) {
                    console.warn('播放音效时出错:', error);
                }
            };

            // 为不同稀有度武器添加特殊音效
            AudioManager.prototype.playWeaponPickupSound = function(weapon) {
                let soundType = 'pickup'; // 默认音效

                switch(weapon.rarity) {
                    case 'rare':
                        soundType = 'weapon_rare';
                        break;
                    case 'epic':
                        soundType = 'weapon_epic';
                        break;
                    case 'legendary':
                        soundType = 'weapon_legendary';
                        break;
                    case 'mythic':
                        soundType = 'weapon_mythic';
                        break;
                }

                this.playSoundExtended(soundType);
            };

            // 添加背景音乐管理
            AudioManager.prototype.musicTracks = [];
            AudioManager.prototype.currentTrack = null;
            AudioManager.prototype.musicEnabled = true;

            AudioManager.prototype.setMusicEnabled = function(enabled) {
                this.musicEnabled = enabled;
                localStorage.setItem('musicEnabled', enabled);
            };

            AudioManager.prototype.playMusic = function(trackName) {
                if (!this.musicEnabled) return;

                // 此处为实际音乐播放预留接口
                console.log(`🎵 播放背景音乐: ${trackName}`);
            };

            AudioManager.prototype.stopMusic = function() {
                if (this.currentTrack) {
                    // 停止当前音乐轨道
                    console.log("🔇 背景音乐已停止");
                }
            };
        }
    }

    // 3. 增强成就系统
    enhanceAchievementSystem() {
        if (typeof AchievementSystem !== 'undefined') {
            // 添加新的成就定义
            const newAchievements = [
                // 挑战成就
                {
                    id: 'survivor',
                    name: '生存专家',
                    description: '在一局游戏中存活超过30分钟',
                    category: 'challenge',
                    hidden: false,
                    condition: function(gameState) {
                        return gameState.sessionPlayTime >= 1800000; // 30分钟
                    },
                    progress: function(gameState) {
                        return Math.min(100, (gameState.sessionPlayTime / 1800000) * 100);
                    }
                },
                {
                    id: 'weapon_collector',
                    name: '武器收藏家',
                    description: '使用过50种不同的武器',
                    category: 'collection',
                    hidden: false,
                    condition: function(gameState) {
                        return gameState.uniqueWeaponsUsed >= 50;
                    },
                    progress: function(gameState) {
                        return Math.min(100, (gameState.uniqueWeaponsUsed / 50) * 100);
                    }
                },
                {
                    id: 'combo_master',
                    name: '连击大师',
                    description: '达到50连击',
                    category: 'combat',
                    hidden: false,
                    condition: function(gameState) {
                        return gameState.maxCombo >= 50;
                    },
                    progress: function(gameState) {
                        return Math.min(100, (gameState.maxCombo / 50) * 100);
                    }
                },
                {
                    id: 'elemental_expert',
                    name: '元素专家',
                    description: '使用带有元素效果的武器造成10000点总伤害',
                    category: 'combat',
                    hidden: false,
                    condition: function(gameState) {
                        return gameState.elementalDamageDealt >= 10000;
                    },
                    progress: function(gameState) {
                        return Math.min(100, (gameState.elementalDamageDealt / 10000) * 100);
                    }
                },
                {
                    id: 'pacifist',
                    name: '和平主义者',
                    description: '通关第50关而未杀死任何敌人',
                    category: 'challenge',
                    hidden: true,
                    condition: function(gameState) {
                        return gameState.level >= 50 && gameState.kills === 0;
                    },
                    progress: function(gameState) {
                        return Math.min(100, (gameState.level / 50) * 100);
                    }
                },
                {
                    id: 'speed_runner',
                    name: '速通达人',
                    description: '在10分钟内到达第30关',
                    category: 'challenge',
                    hidden: false,
                    condition: function(gameState) {
                        return gameState.level >= 30 && gameState.sessionPlayTime <= 600000; // 10分钟
                    },
                    progress: function(gameState) {
                        const timeProgress = Math.max(0, 100 - (gameState.sessionPlayTime / 600000) * 100);
                        const levelProgress = Math.min(100, (gameState.level / 30) * 100);
                        return Math.min(timeProgress, levelProgress);
                    }
                }
            ];

            // 添加新成就到现有成就列表
            newAchievements.forEach(newAchievement => {
                // 检查是否已存在相同的ID
                const existingIndex = AchievementSystem.achievements.findIndex(a => a.id === newAchievement.id);
                if (existingIndex === -1) {
                    AchievementSystem.achievements.push(newAchievement);
                }
            });

            // 添加成就追踪数据
            if (!window.gameState) window.gameState = {};
            if (!window.gameState.achievementTracked) {
                window.gameState.achievementTracked = {
                    sessionPlayTime: 0,
                    uniqueWeaponsUsed: new Set(),
                    maxCombo: 0,
                    elementalDamageDealt: 0,
                    // 添加定时器追踪游戏时间
                    startTime: Date.now()
                };
            }
        }
    }

    // 4. 游戏平衡性微调
    balanceGameplay() {
        // 添加更精细的难度曲线
        if (typeof gameState !== 'undefined' || typeof window.gameState !== 'undefined') {
            const state = window.gameState || gameState;

            // 改进敌人生命周期计算
            state.calculateEnemyStats = function(level) {
                // 使用更平滑的指数函数，减少高关卡时的增长速度
                const baseMultiplier = 1 + (level * 0.15); // 从0.2降低到0.15，减缓增长
                const exponentialFactor = Math.pow(baseMultiplier, 1.1); // 添加轻微指数修正

                return {
                    hp: Math.max(1, Math.floor(2 * exponentialFactor)),
                    damage: Math.max(1, Math.floor(1.5 * exponentialFactor)),
                    speed: Math.min(3, 0.8 + (level * 0.02)), // 限制最高速度
                    reward: Math.max(1, Math.floor(1 + (level * 0.1)))
                };
            };

            // 改进武器掉落率
            state.calculateWeaponDropChance = function(level) {
                // 在高关卡时略微提高好武器的掉落率，但整体控制
                const baseRareChance = 0.15;
                const bonusFromLevel = Math.min(0.15, level * 0.002); // 最多增加15%

                return {
                    rare: Math.min(0.3, baseRareChance + bonusFromLevel * 0.4),
                    epic: Math.min(0.15, baseRareChance * 0.3 + bonusFromLevel * 0.3),
                    legendary: Math.min(0.05, baseRareChance * 0.1 + bonusFromLevel * 0.2),
                    mythic: Math.min(0.01, baseRareChance * 0.02 + bonusFromLevel * 0.05)
                };
            };
        }
    }
}

// 初始化Steam增强包
const steamEnhancementPack = new SteamEnhancementPack();
console.log("✅ Steam版增强包已完全初始化");

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SteamEnhancementPack;
}