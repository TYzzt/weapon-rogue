// 武器替换者 - 增强版成就系统
// 扩展原有成就系统，加入新的挑战和统计

(function() {
    console.log('正在加载增强版成就系统...');

    // 扩展成就定义
    const ENHANCED_ACHIEVEMENTS = [
        // 原有成就（来自现有系统）
        {
            id: 'first_blood',
            name: '第一滴血',
            description: '获得你的第一杀',
            condition: 'firstBlood',
            rarity: 'common',
            icon: '⚔️'
        },
        {
            id: 'killing_spree',
            name: '杀戮 spree',
            description: '连续击杀5个敌人',
            condition: 'killingSpree',
            rarity: 'uncommon',
            icon: '🔥'
        },
        {
            id: 'weapon_master',
            name: '武器大师',
            description: '使用50种不同的武器',
            condition: 'weaponMaster',
            rarity: 'rare',
            icon: '👑'
        },
        {
            id: 'survivor',
            name: '生存者',
            description: '存活到第20关',
            condition: 'survivor',
            rarity: 'rare',
            icon: '🛡️'
        },

        // 新增成就 - 平衡性相关
        {
            id: 'balanced_warrior',
            name: '平衡战士',
            description: '在第30关仍然存活',
            condition: 'balancedWarrior',
            rarity: 'epic',
            icon: '⚖️'
        },
        {
            id: 'rare_hunter',
            name: '稀有猎人',
            description: '获得10件稀有度为史诗或以上的武器',
            condition: 'rareHunter',
            rarity: 'epic',
            icon: '💎'
        },
        {
            id: 'efficiency_expert',
            name: '效率专家',
            description: '在一关内击杀超过30个敌人',
            condition: 'efficiencyExpert',
            rarity: 'rare',
            icon: '⚡'
        },
        {
            id: 'comeback_kid',
            name: '逆袭小子',
            description: '在生命值低于10%的情况下存活并击败Boss',
            condition: 'comebackKid',
            rarity: 'legendary',
            icon: '❤️'
        },
        {
            id: 'elemental_mastery',
            name: '元素 mastery',
            description: '使用每种元素类型的武器至少一次',
            condition: 'elementalMastery',
            rarity: 'epic',
            icon: '🔮'
        },
        {
            id: 'progressive_veteran',
            name: '进步老手',
            description: '累计游戏时间达到2小时',
            condition: 'progressiveVeteran',
            rarity: 'legendary',
            icon: '⏳'
        },
        {
            id: 'tactical_genius',
            name: '战术天才',
            description: '连续10次更换武器都比之前更强',
            condition: 'tacticalGenius',
            rarity: 'epic',
            icon: '🧠'
        },
        {
            id: 'boss_destroyer',
            name: 'Boss破坏者',
            description: '连续击败3个Boss',
            condition: 'bossDestroy',
            rarity: 'legendary',
            icon: '👹'
        }
    ];

    // 成就管理系统
    const AchievementManager = {
        // 玩家成就数据
        playerAchievements: {},

        // 临时统计（不会保存）
        tempStats: {
            kills: 0,
            currentKillStreak: 0,
            differentWeaponsUsed: new Set(),
            levelsSurvived: 0,
            rareWeaponsCollected: 0,
            lowHealthSaves: 0,
            elementalWeaponsUsed: new Set(),
            playTime: 0,
            strongWeaponSwaps: 0,
            bossKills: 0,
            consecutiveBossKills: 0
        },

        // 初始化成就系统
        init: function(savedData) {
            if (savedData && savedData.playerAchievements) {
                this.playerAchievements = savedData.playerAchievements;
            } else {
                // 初始化所有成就状态
                for (const achievement of ENHANCED_ACHIEVEMENTS) {
                    if (!this.playerAchievements[achievement.id]) {
                        this.playerAchievements[achievement.id] = {
                            unlocked: false,
                            unlockDate: null,
                            progress: 0
                        };
                    }
                }
            }

            // 重新初始化临时统计
            this.tempStats = {
                kills: 0,
                currentKillStreak: 0,
                differentWeaponsUsed: new Set(),
                levelsSurvived: 0,
                rareWeaponsCollected: 0,
                lowHealthSaves: 0,
                elementalWeaponsUsed: new Set(),
                playTime: 0,
                strongWeaponSwaps: 0,
                bossKills: 0,
                consecutiveBossKills: 0
            };

            console.log('增强版成就系统初始化完成');
            console.log(`共加载 ${ENHANCED_ACHIEVEMENTS.length} 个成就`);
        },

        // 检查并解锁成就
        checkAndUnlock: function(condition, value, maxValue) {
            let unlockedIds = [];

            for (const achievement of ENHANCED_ACHIEVEMENTS) {
                if (this.playerAchievements[achievement.id].unlocked) continue;

                let shouldUnlock = false;

                switch(achievement.condition) {
                    case 'firstBlood':
                        shouldUnlock = this.tempStats.kills >= 1;
                        break;
                    case 'killingSpree':
                        shouldUnlock = this.tempStats.currentKillStreak >= 5;
                        break;
                    case 'weaponMaster':
                        shouldUnlock = this.tempStats.differentWeaponsUsed.size >= 50;
                        break;
                    case 'survivor':
                        shouldUnlock = this.tempStats.levelsSurvived >= 20;
                        break;
                    case 'balancedWarrior':
                        shouldUnlock = this.tempStats.levelsSurvived >= 30;
                        break;
                    case 'rareHunter':
                        shouldUnlock = this.tempStats.rareWeaponsCollected >= 10;
                        break;
                    case 'efficiencyExpert':
                        // 需要在单局游戏中击杀30个敌人
                        shouldUnlock = value >= 30;
                        break;
                    case 'comebackKid':
                        shouldUnlock = this.tempStats.lowHealthSaves >= 1;
                        break;
                    case 'elementalMastery':
                        shouldUnlock = this.tempStats.elementalWeaponsUsed.size >= 5; // 假设有5种元素
                        break;
                    case 'progressiveVeteran':
                        shouldUnlock = this.tempStats.playTime >= 7200; // 2小时 = 7200秒
                        break;
                    case 'tacticalGenius':
                        shouldUnlock = this.tempStats.strongWeaponSwaps >= 10;
                        break;
                    case 'bossDestroy':
                        shouldUnlock = this.tempStats.consecutiveBossKills >= 3;
                        break;
                    default:
                        console.log(`未知的成就条件: ${achievement.condition}`);
                }

                if (shouldUnlock) {
                    this.unlockAchievement(achievement.id);
                    unlockedIds.push(achievement.id);
                }
            }

            return unlockedIds;
        },

        // 解锁特定成就
        unlockAchievement: function(id) {
            const achievement = ENHANCED_ACHIEVEMENTS.find(a => a.id === id);
            if (!achievement) {
                console.error(`未找到成就: ${id}`);
                return false;
            }

            if (this.playerAchievements[id].unlocked) {
                return false; // 已经解锁过了
            }

            // 标记成就已解锁
            this.playerAchievements[id] = {
                unlocked: true,
                unlockDate: new Date(),
                progress: 100
            };

            console.log(`🎉 解锁成就: ${achievement.name} - ${achievement.description}`);

            // 如果有UI，则显示解锁提示
            if (typeof showAchievementNotification === 'function') {
                showAchievementNotification(achievement);
            } else {
                // 显示浏览器通知或控制台消息
                if ('Notification' in window && Notification.permission === 'granted') {
                    new Notification(`成就解锁: ${achievement.name}`, {
                        body: achievement.description,
                        icon: 'favicon.ico' // 如果有图标的话
                    });
                } else {
                    console.log(`成就解锁: ${achievement.name} - ${achievement.description}`);
                }
            }

            return true;
        },

        // 更新统计
        updateStats: function(statName, value, maxValue) {
            // 根据统计名称更新临时统计
            switch(statName) {
                case 'kills':
                    this.tempStats.kills = value;
                    break;
                case 'killStreak':
                    this.tempStats.currentKillStreak = value;
                    break;
                case 'differentWeapons':
                    if (Array.isArray(value)) {
                        this.tempStats.differentWeaponsUsed = new Set(value);
                    }
                    break;
                case 'level':
                    if (value > this.tempStats.levelsSurvived) {
                        this.tempStats.levelsSurvived = value;
                    }
                    break;
                case 'rareWeapon':
                    this.tempStats.rareWeaponsCollected += value;
                    break;
                case 'lowHealthSave':
                    this.tempStats.lowHealthSaves += value;
                    break;
                case 'elementalWeapon':
                    if (value) {
                        this.tempStats.elementalWeaponsUsed.add(value);
                    }
                    break;
                case 'playTime':
                    this.tempStats.playTime = value;
                    break;
                case 'strongSwap':
                    this.tempStats.strongWeaponSwaps += value;
                    break;
                case 'bossKill':
                    this.tempStats.bossKills += value;
                    this.tempStats.consecutiveBossKills += value;
                    break;
                case 'resetBossStreak':
                    this.tempStats.consecutiveBossKills = 0;
                    break;
            }

            // 检查是否解锁成就
            return this.checkAndUnlock(statName, value, maxValue);
        },

        // 获取已解锁成就数量
        getUnlockedCount: function() {
            return Object.values(this.playerAchievements).filter(a => a.unlocked).length;
        },

        // 获取总成就数量
        getTotalCount: function() {
            return ENHANCED_ACHIEVEMENTS.length;
        },

        // 获取成就数据用于保存
        getSaveData: function() {
            return {
                playerAchievements: this.playerAchievements,
                achievementVersion: '2.0'
            };
        },

        // 显示成就面板
        showAchievementPanel: function() {
            console.log('=== 成就面板 ===');
            for (const achievement of ENHANCED_ACHIEVEMENTS) {
                const status = this.playerAchievements[achievement.id].unlocked ? '✓' : '○';
                console.log(`${status} ${achievement.icon} ${achievement.name} (${achievement.rarity})`);
                console.log(`   ${achievement.description}`);
            }
            console.log(`总计: ${this.getUnlockedCount()}/${this.getTotalCount()} 个成就已解锁`);
        }
    };

    // 如果已有成就系统，扩展它
    if (window.AchievementSystem) {
        // 保存原有功能
        const originalInit = window.AchievementSystem.init;
        const originalUpdate = window.AchievementSystem.updateStats;

        // 扩展初始化
        window.AchievementSystem.init = function(savedData) {
            if (originalInit) originalInit(savedData);
            AchievementManager.init(savedData);
        };

        // 扩展统计更新
        window.AchievementSystem.updateStats = function(statName, value, maxValue) {
            if (originalUpdate) originalUpdate(statName, value, maxValue);
            return AchievementManager.updateStats(statName, value, maxValue);
        };

        // 添加新功能
        window.AchievementSystem.getEnhancedAchievements = () => ENHANCED_ACHIEVEMENTS;
        window.AchievementSystem.showEnhancedPanel = () => AchievementManager.showAchievementPanel();
    } else {
        // 否则创建新的成就系统
        window.AchievementSystem = AchievementManager;
    }

    // 导出成就定义
    window.ENHANCED_ACHIEVEMENTS = ENHANCED_ACHIEVEMENTS;

    console.log('增强版成就系统加载完成!');
    console.log(`- 新增 ${ENHANCED_ACHIEVEMENTS.length - 4} 个新成就`); // 假设原来有4个成就
    console.log('- 包含平衡性相关挑战');
    console.log('- 扩展了统计追踪功能');
})();