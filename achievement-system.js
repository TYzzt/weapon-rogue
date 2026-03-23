// ==================== 成就系统 ====================
//
// 该模块实现全面的成就系统，包含20+个不同类型的成就
//

if (typeof ACHIEVEMENT_SYSTEM_LOADED === 'undefined') {
    window.ACHIEVEMENT_SYSTEM_LOADED = true;

    console.log("成就系统已加载");

    // 成就数据库
    const ACHIEVEMENTS = [
        // 初学者系列
        {
            id: 'first_blood',
            name: '第一滴血',
            description: '首次击杀敌人',
            category: 'starter',
            hidden: false,
            condition: function(gameState) {
                return gameState.kills >= 1;
            },
            progress: function(gameState) {
                return Math.min(100, gameState.kills * 100);
            }
        },
        {
            id: 'warmup',
            name: '热身运动',
            description: '击杀10个敌人',
            category: 'starter',
            hidden: false,
            condition: function(gameState) {
                return gameState.kills >= 10;
            },
            progress: function(gameState) {
                return Math.min(100, (gameState.kills / 10) * 100);
            }
        },
        {
            id: 'killing_spree',
            name: '杀戮 spree',
            description: '连续击杀20个敌人而不死亡',
            category: 'combat',
            hidden: false,
            condition: function(gameState) {
                return gameState.currentKillStreak >= 20;
            },
            progress: function(gameState) {
                return Math.min(100, (gameState.currentKillStreak / 20) * 100);
            }
        },

        // 武器相关成就
        {
            id: 'collector_common',
            name: '平凡收藏家',
            description: '收集10种不同的普通武器',
            category: 'collection',
            hidden: false,
            condition: function(gameState) {
                return gameState.collectedCommonWeapons >= 10;
            },
            progress: function(gameState) {
                return Math.min(100, (gameState.collectedCommonWeapons / 10) * 100);
            }
        },
        {
            id: 'rare_hunter',
            name: '稀有猎人',
            description: '获得第一件稀有武器',
            category: 'collection',
            hidden: false,
            condition: function(gameState) {
                return gameState.rarestWeaponObtained && gameState.rarestWeaponObtained.rarity >= 3; // rare及以上
            },
            progress: function(gameState) {
                return gameState.rarestWeaponObtained ? (gameState.rarestWeaponObtained.rarity >= 3 ? 100 : 0) : 0;
            }
        },
        {
            id: 'legendary_treasure',
            name: '传说宝藏',
            description: '获得第一件传说武器',
            category: 'collection',
            hidden: false,
            condition: function(gameState) {
                return gameState.legendaryWeaponsObtained >= 1;
            },
            progress: function(gameState) {
                return Math.min(100, gameState.legendaryWeaponsObtained * 100);
            }
        },
        {
            id: 'mythic_power',
            name: '神话之力',
            description: '获得第一件神话武器',
            category: 'collection',
            hidden: false,
            condition: function(gameState) {
                return gameState.mythicWeaponsObtained >= 1;
            },
            progress: function(gameState) {
                return Math.min(100, gameState.mythicWeaponsObtained * 100);
            }
        },

        // 关卡相关成就
        {
            id: 'level_ten',
            name: '第十关勇士',
            description: '到达第10关',
            category: 'progression',
            hidden: false,
            condition: function(gameState) {
                return gameState.level >= 10;
            },
            progress: function(gameState) {
                return Math.min(100, (gameState.level / 10) * 100);
            }
        },
        {
            id: 'quarter_century',
            name: '四分之一世纪',
            description: '到达第25关',
            category: 'progression',
            hidden: false,
            condition: function(gameState) {
                return gameState.level >= 25;
            },
            progress: function(gameState) {
                return Math.min(100, (gameState.level / 25) * 100);
            }
        },
        {
            id: 'half_way_there',
            name: '半程英雄',
            description: '到达第50关',
            category: 'progression',
            hidden: false,
            condition: function(gameState) {
                return gameState.level >= 50;
            },
            progress: function(gameState) {
                return Math.min(100, (gameState.level / 50) * 100);
            }
        },
        {
            id: 'century_club',
            name: '百人俱乐部',
            description: '到达第100关',
            category: 'progression',
            hidden: false,
            condition: function(gameState) {
                return gameState.level >= 100;
            },
            progress: function(gameState) {
                return Math.min(100, (gameState.level / 100) * 100);
            }
        },

        // 生存相关成就
        {
            id: 'survivor',
            name: '幸存者',
            description: '存活超过5分钟',
            category: 'survival',
            hidden: false,
            condition: function(gameState) {
                return gameState.sessionTime >= 300; // 5分钟
            },
            progress: function(gameState) {
                return Math.min(100, (gameState.sessionTime / 300) * 100);
            }
        },
        {
            id: 'marathon_player',
            name: '马拉松玩家',
            description: '游戏时间超过30分钟',
            category: 'survival',
            hidden: false,
            condition: function(gameState) {
                return gameState.sessionTime >= 1800; // 30分钟
            },
            progress: function(gameState) {
                return Math.min(100, (gameState.sessionTime / 1800) * 100);
            }
        },
        {
            id: 'invincible',
            name: '无敌之人',
            description: '在拥有传说武器的情况下存活到50关',
            category: 'challenge',
            hidden: false,
            condition: function(gameState) {
                return gameState.level >= 50 &&
                       gameState.player?.weapon?.rarity === 'legendary';
            },
            progress: function(gameState) {
                if (gameState.player?.weapon?.rarity === 'legendary') {
                    return Math.min(100, (gameState.level / 50) * 100);
                }
                return 0;
            }
        },

        // 技巧相关成就
        {
            id: 'damage_over_9000',
            name: '伤害爆表',
            description: '单次攻击造成超过9000点伤害',
            category: 'combat',
            hidden: false,
            condition: function(gameState) {
                return gameState.maxSingleHitDamage >= 9000;
            },
            progress: function(gameState) {
                return Math.min(100, (gameState.maxSingleHitDamage / 9000) * 100);
            }
        },
        {
            id: 'speed_demon',
            name: '速度恶魔',
            description: '在一分钟内达到20关',
            category: 'speedrun',
            hidden: false,
            condition: function(gameState) {
                return gameState.level >= 20 && gameState.sessionTime <= 60;
            },
            progress: function(gameState) {
                if (gameState.sessionTime <= 60) {
                    return Math.min(100, (gameState.level / 20) * 100);
                }
                return Math.min(100, (gameState.level / 20) * (gameState.sessionTime <= 60 ? 100 : 50));
            }
        },
        {
            id: 'efficient_killer',
            name: '高效杀手',
            description: '达到每分钟击杀50个敌人的速度',
            category: 'efficiency',
            hidden: false,
            condition: function(gameState) {
                const timeInMinutes = gameState.sessionTime / 60;
                return timeInMinutes > 0 && (gameState.kills / timeInMinutes) >= 50;
            },
            progress: function(gameState) {
                const timeInMinutes = gameState.sessionTime / 60;
                if (timeInMinutes > 0) {
                    const rate = gameState.kills / timeInMinutes;
                    return Math.min(100, (rate / 50) * 100);
                }
                return 0;
            }
        },

        // 探索相关成就
        {
            id: 'region_explorer',
            name: '区域探索者',
            description: '探索所有5个游戏区域',
            category: 'exploration',
            hidden: false,
            condition: function(gameState) {
                return gameState.regionsDiscovered >= 5;
            },
            progress: function(gameState) {
                return Math.min(100, (gameState.regionsDiscovered / 5) * 100);
            }
        },
        {
            id: 'mode_master',
            name: '模式大师',
            description: '尝试所有5种游戏模式',
            category: 'exploration',
            hidden: false,
            condition: function(gameState) {
                return gameState.modesAttempted >= 5;
            },
            progress: function(gameState) {
                return Math.min(100, (gameState.modesAttempted / 5) * 100);
            }
        },
        {
            id: 'completionist',
            name: '完美主义者',
            description: '解锁所有成就',
            category: 'master',
            hidden: false,
            condition: function(gameState) {
                return gameState.unlockedAchievements >= Object.keys(ACHIEVEMENTS).length - 1; // -1 because this achievement doesn't count itself
            },
            progress: function(gameState) {
                return Math.min(100, (gameState.unlockedAchievements / (Object.keys(ACHIEVEMENTS).length - 1)) * 100);
            }
        },

        // 隐藏成就
        {
            id: 'secret_found',
            name: '秘密发现者',
            description: '发现游戏的秘密',
            category: 'secret',
            hidden: true,
            condition: function(gameState) {
                // 可以是某些特殊操作的组合
                return gameState.secretFound === true;
            },
            progress: function(gameState) {
                return gameState.secretFound ? 100 : 0;
            }
        },
        {
            id: 'easter_egg_hunter',
            name: '彩蛋猎人',
            description: '找到所有彩蛋',
            category: 'secret',
            hidden: true,
            condition: function(gameState) {
                return gameState.easterEggsFound >= 5;
            },
            progress: function(gameState) {
                return Math.min(100, (gameState.easterEggsFound / 5) * 100);
            }
        }
    ];

    // 成就系统类
    class AchievementSystem {
        constructor() {
            this.achievements = {};
            this.initAchievements();
            this.listeners = [];
        }

        initAchievements() {
            // 初始化成就状态
            ACHIEVEMENTS.forEach(ach => {
                this.achievements[ach.id] = {
                    id: ach.id,
                    name: ach.name,
                    description: ach.description,
                    category: ach.category,
                    hidden: ach.hidden,
                    unlocked: false,
                    unlockTime: null,
                    progress: 0
                };
            });
        }

        // 检查成就条件
        checkAchievements(gameState) {
            let unlocked = [];

            ACHIEVEMENTS.forEach(ach => {
                if (!this.achievements[ach.id].unlocked) {
                    // 计算进度
                    const progress = ach.progress ? ach.progress(gameState) : 0;
                    this.achievements[ach.id].progress = progress;

                    // 检查条件是否满足
                    if (ach.condition && ach.condition(gameState)) {
                        this.unlockAchievement(ach.id);
                        unlocked.push(ach);
                    }
                }
            });

            // 触发成就解锁事件
            if (unlocked.length > 0) {
                this.onAchievementUnlocked(unlocked);
            }

            return unlocked;
        }

        // 解锁成就
        unlockAchievement(id) {
            if (this.achievements[id] && !this.achievements[id].unlocked) {
                this.achievements[id].unlocked = true;
                this.achievements[id].unlockTime = Date.now();

                // 增加计数
                if (!window.gameState.achievementCount) {
                    window.gameState.achievementCount = 0;
                }
                window.gameState.achievementCount++;

                console.log(`成就解锁: ${this.achievements[id].name}`);
                return true;
            }
            return false;
        }

        // 获取特定成就
        getAchievement(id) {
            return this.achievements[id] || null;
        }

        // 获取所有成就
        getAllAchievements() {
            return this.achievements;
        }

        // 获取已解锁的成就
        getUnlockedAchievements() {
            return Object.values(this.achievements).filter(ach => ach.unlocked);
        }

        // 获取锁定的成就
        getLockedAchievements() {
            return Object.values(this.achievements).filter(ach => !ach.unlocked);
        }

        // 获取特定类别的成就
        getAchievementsByCategory(category) {
            return Object.values(this.achievements).filter(ach => ach.category === category);
        }

        // 监听成就解锁事件
        onAchievementUnlocked(achievements) {
            // 触发所有监听器
            this.listeners.forEach(callback => callback(achievements));

            // 显示解锁通知
            achievements.forEach(achievement => {
                if (typeof showCombatLog !== 'undefined') {
                    showCombatLog(`🏆 成就解锁: ${achievement.name}`, 'achievement-unlock');
                } else {
                    console.log(`🏆 成就解锁: ${achievement.name}`);
                }

                // 如果有UI元素，也可以在这里更新
                this.updateAchievementUI(achievement);
            });
        }

        // 添加监听器
        addListener(callback) {
            this.listeners.push(callback);
        }

        // 更新成就UI
        updateAchievementUI(achievement) {
            // 创建成就弹出窗口
            if (typeof createAchievementNotification !== 'undefined') {
                createAchievementNotification(achievement);
            } else {
                // 创建简单的DOM元素显示通知
                this.createSimpleAchievementNotification(achievement);
            }
        }

        // 创建简单的成就通知
        createSimpleAchievementNotification(achievement) {
            const notification = document.createElement('div');
            notification.className = 'achievement-notification';
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                border: 2px solid gold;
                box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                z-index: 10000;
                font-weight: bold;
                animation: slideInRight 0.5s ease-out;
                min-width: 250px;
                text-align: center;
            `;
            notification.innerHTML = `
                <div style="font-size: 1.2em; margin-bottom: 5px;">🏆 成就解锁!</div>
                <div style="font-size: 1.1em;">${achievement.name}</div>
                <div style="font-size: 0.9em; opacity: 0.8; margin-top: 5px;">${achievement.description}</div>
            `;

            // 添加CSS动画
            if (!document.getElementById('achievement-animation-style')) {
                const style = document.createElement('style');
                style.id = 'achievement-animation-style';
                style.textContent = `
                    @keyframes slideInRight {
                        from {
                            transform: translateX(100%);
                            opacity: 0;
                        }
                        to {
                            transform: translateX(0);
                            opacity: 1;
                        }
                    }
                    @keyframes fadeOut {
                        from {
                            opacity: 1;
                        }
                        to {
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
            }

            document.body.appendChild(notification);

            // 5秒后淡出并移除
            setTimeout(() => {
                notification.style.animation = 'fadeOut 1s ease-out';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 1000);
            }, 5000);
        }

        // 保存成就到本地存储
        saveToLocalStorage() {
            try {
                const saveData = {};
                for (const [id, achievement] of Object.entries(this.achievements)) {
                    saveData[id] = {
                        unlocked: achievement.unlocked,
                        unlockTime: achievement.unlockTime,
                        progress: achievement.progress
                    };
                }
                localStorage.setItem('game_achievements', JSON.stringify(saveData));
            } catch (e) {
                console.warn('无法保存成就到本地存储:', e);
            }
        }

        // 从本地存储加载成就
        loadFromLocalStorage() {
            try {
                const savedData = localStorage.getItem('game_achievements');
                if (savedData) {
                    const parsedData = JSON.parse(savedData);
                    for (const [id, savedAchievement] of Object.entries(parsedData)) {
                        if (this.achievements[id]) {
                            this.achievements[id].unlocked = savedAchievement.unlocked;
                            this.achievements[id].unlockTime = savedAchievement.unlockTime;
                            this.achievements[id].progress = savedAchievement.progress;

                            if (savedAchievement.unlocked) {
                                // 增加计数
                                if (!window.gameState.achievementCount) {
                                    window.gameState.achievementCount = 0;
                                }
                                window.gameState.achievementCount++;
                            }
                        }
                    }
                }
            } catch (e) {
                console.warn('无法从本地存储加载成就:', e);
            }
        }

        // 重置所有成就（调试用）
        resetAllAchievements() {
            for (const [id, achievement] of Object.entries(this.achievements)) {
                achievement.unlocked = false;
                achievement.unlockTime = null;
                achievement.progress = 0;
            }
            window.gameState.achievementCount = 0;
        }

        // 获取成就统计
        getStatistics() {
            const allCount = Object.keys(this.achievements).length;
            const unlockedCount = this.getUnlockedAchievements().length;
            const lockedCount = allCount - unlockedCount;

            return {
                total: allCount,
                unlocked: unlockedCount,
                locked: lockedCount,
                percentage: allCount > 0 ? Math.round((unlockedCount / allCount) * 100) : 0
            };
        }
    }

    // 创建全局成就系统实例
    window.achievementSystem = new AchievementSystem();

    // 初始化时从本地存储加载
    window.achievementSystem.loadFromLocalStorage();

    // 添加定时检查成就的函数
    function setupAchievementChecker() {
        setInterval(() => {
            if (window.gameState && window.gameState.player && window.gameState.player.isPlaying) {
                window.achievementSystem.checkAchievements(window.gameState);
            }
        }, 1000); // 每秒检查一次

        // 页面卸载前保存成就
        window.addEventListener('beforeunload', () => {
            if (window.achievementSystem) {
                window.achievementSystem.saveToLocalStorage();
            }
        });

        console.log("成就检查器已设置");
    }

    // 启动成就检查器
    setTimeout(setupAchievementChecker, 2000);

    // 扩展gameState以跟踪成就相关的数据
    function extendGameStateForAchievements() {
        if (window.gameState) {
            // 初始化成就相关计数器
            if (!window.gameState.collectedCommonWeapons) window.gameState.collectedCommonWeapons = 0;
            if (!window.gameState.legendaryWeaponsObtained) window.gameState.legendaryWeaponsObtained = 0;
            if (!window.gameState.mythicWeaponsObtained) window.gameState.mythicWeaponsObtained = 0;
            if (!window.gameState.rarestWeaponObtained) window.gameState.rarestWeaponObtained = { rarity: 0 };
            if (!window.gameState.currentKillStreak) window.gameState.currentKillStreak = 0;
            if (!window.gameState.maxSingleHitDamage) window.gameState.maxSingleHitDamage = 0;
            if (!window.gameState.sessionTime) window.gameState.sessionTime = 0;
            if (!window.gameState.regionsDiscovered) window.gameState.regionsDiscovered = 0;
            if (!window.gameState.modesAttempted) window.gameState.modesAttempted = 0;
            if (!window.gameState.secretFound) window.gameState.secretFound = false;
            if (!window.gameState.easterEggsFound) window.gameState.easterEggsFound = 0;
            if (!window.gameState.achievementCount) window.gameState.achievementCount = 0;

            // 重新开始游戏时重置部分计数器
            const originalRestartGame = window.restartGame || function() {};
            window.restartGame = function() {
                // 除了成就计数，重置其他游戏状态
                window.gameState.collectedCommonWeapons = 0;
                window.gameState.legendaryWeaponsObtained = 0;
                window.gameState.mythicWeaponsObtained = 0;
                window.gameState.currentKillStreak = 0;
                window.gameState.maxSingleHitDamage = 0;
                window.gameState.sessionTime = 0;
                // 不重置 achievementCount，因为它应该累计

                originalRestartGame();
            };
        }
    }

    // 延迟执行以确保gameState存在
    setTimeout(extendGameStateForAchievements, 1000);

    // 添加成就UI显示功能
    function addAchievementUI() {
        // 创建成就面板
        const achievementsPanel = document.createElement('div');
        achievementsPanel.id = 'achievements-panel';
        achievementsPanel.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 9999;
            display: none;
            justify-content: center;
            align-items: center;
            overflow: auto;
        `;

        achievementsPanel.innerHTML = `
            <div style="
                background: #1a1a2e;
                color: #eee;
                padding: 30px;
                border-radius: 10px;
                width: 90%;
                max-width: 900px;
                max-height: 90vh;
                overflow-y: auto;
                border: 2px solid #4a4a6a;
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="color: #4ade80;">🏆 游戏成就</h2>
                    <button id="close-achievements" style="
                        background: #4a4a6a;
                        color: white;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 4px;
                        cursor: pointer;
                    ">关闭</button>
                </div>
                <div id="achievements-stats" style="margin-bottom: 20px; padding: 10px; background: rgba(0,0,0,0.5); border-radius: 5px;">
                    <!-- Stats will be inserted here -->
                </div>
                <div id="achievements-list" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 15px;">
                    <!-- Achievements will be inserted here -->
                </div>
            </div>
        `;

        document.body.appendChild(achievementsPanel);

        // 添加显示成就的函数
        window.showAchievements = function() {
            updateAchievementsDisplay();
            achievementsPanel.style.display = 'flex';
        };

        // 添加隐藏成就的函数
        document.getElementById('close-achievements').onclick = function() {
            achievementsPanel.style.display = 'none';
        };

        // 点击外部区域关闭
        achievementsPanel.onclick = function(e) {
            if (e.target === achievementsPanel) {
                achievementsPanel.style.display = 'none';
            }
        };

        // 更新成就显示的函数
        function updateAchievementsDisplay() {
            const statsDiv = document.getElementById('achievements-stats');
            const listDiv = document.getElementById('achievements-list');
            const stats = window.achievementSystem.getStatistics();

            statsDiv.innerHTML = `
                <div style="font-size: 1.2em; font-weight: bold; color: #4ade80;">
                    总成就: ${stats.total} | 已解锁: ${stats.unlocked} | 完成度: ${stats.percentage}%
                </div>
            `;

            listDiv.innerHTML = '';

            // 按类别组织成就
            const categories = {};
            Object.values(window.achievementSystem.getAllAchievements()).forEach(ach => {
                if (!categories[ach.category]) {
                    categories[ach.category] = [];
                }
                categories[ach.category].push(ach);
            });

            for (const [category, achievements] of Object.entries(categories)) {
                const categoryHeader = document.createElement('div');
                categoryHeader.style.cssText = `
                    grid-column: 1 / -1;
                    text-align: center;
                    font-size: 1.3em;
                    font-weight: bold;
                    margin: 20px 0 10px 0;
                    color: #4ade80;
                    border-bottom: 1px solid #4a4a6a;
                    padding-bottom: 5px;
                    text-transform: capitalize;
                `;
                categoryHeader.textContent = category;
                listDiv.appendChild(categoryHeader);

                achievements.forEach(ach => {
                    const achElement = document.createElement('div');
                    achElement.style.cssText = `
                        padding: 12px;
                        border-radius: 6px;
                        border: 1px solid ${ach.unlocked ? '#4ade80' : '#4a4a6a'};
                        background: ${ach.unlocked ? 'rgba(74, 222, 128, 0.1)' : 'rgba(74, 74, 106, 0.1)'};
                        transition: transform 0.2s;
                    `;
                    achElement.onmouseover = function() {
                        this.style.transform = 'scale(1.02)';
                    };
                    achElement.onmouseout = function() {
                        this.style.transform = 'scale(1)';
                    };

                    const status = ach.unlocked ? '✅' : '🔒';
                    const progressStr = ach.unlocked ? '' : `(进度: ${Math.round(ach.progress)}%)`;
                    const unlockTime = ach.unlocked ? ` - 解锁时间: ${new Date(ach.unlockTime).toLocaleString()}` : '';

                    achElement.innerHTML = `
                        <div style="font-weight: bold; color: ${ach.unlocked ? '#4ade80' : '#aaa'};">
                            ${status} ${ach.name}
                        </div>
                        <div style="font-size: 0.9em; margin-top: 5px;">${ach.description} ${progressStr}${unlockTime}</div>
                    `;

                    listDiv.appendChild(achElement);
                });
            }
        }

        // 添加键盘快捷键来显示成就
        document.addEventListener('keydown', function(e) {
            if (e.key === 'F1' && e.ctrlKey) { // Ctrl+F1
                window.showAchievements();
            }
        });

        console.log("成就UI已添加");
    }

    // 初始化成就UI
    setTimeout(addAchievementUI, 3000);

    console.log("成就系统已完全加载，共包含 " + ACHIEVEMENTS.length + " 个成就");
} else {
    console.log("成就系统已存在，跳过重复加载");
}