// ==================== 统一成就系统 ====================
//
// 合并以下系统的功能：
// 1. achievement-system.js - 基础成就系统
// 2. enhanced-achievements.js - 增强成就系统
// 3. steam-achievement-system.js - Steam成就系统
// 4. enhanced-achievement-system.js - 增强成就定义
// 5. complete-achievement-system.js - 完整成就系统
// 6. enhanced-achievement-logic.js - 成就解锁逻辑增强
//
// 特性：
// - 保持所有现有成就功能
// - 解决命名冲突
// - 使用单一的 AchievementManager 实例
// - 保持与 game.js 的兼容性
// - 包含成就追踪、UI、持久化等功能

(function() {
    console.log('正在加载统一成就系统...');

    // 防止重复加载
    if (typeof UNIFIED_ACHIEVEMENT_SYSTEM_LOADED !== 'undefined') {
        console.log('统一成就系统已存在，跳过重复加载');
        return;
    }

    window.UNIFIED_ACHIEVEMENT_SYSTEM_LOADED = true;

    // 统一成就定义（包含所有系统中的成就）
    const UNIFIED_ACHIEVEMENT_DEFINITIONS = [
        // 初学者系列 (来自achievement-system.js)
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

        // 武器相关成就 (来自achievement-system.js)
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

        // 关卡相关成就 (来自achievement-system.js)
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

        // 生存相关成就 (来自achievement-system.js)
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

        // 技巧相关成就 (来自achievement-system.js)
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

        // 探索相关成就 (来自achievement-system.js)
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
                return gameState.unlockedAchievements >= Object.keys(UNIFIED_ACHIEVEMENT_DEFINITIONS).length - 1; // -1 because this achievement doesn't count itself
            },
            progress: function(gameState) {
                return Math.min(100, (gameState.unlockedAchievements / (Object.keys(UNIFIED_ACHIEVEMENT_DEFINITIONS).length - 1)) * 100);
            }
        },

        // 隐藏成就 (来自achievement-system.js)
        {
            id: 'secret_found',
            name: '秘密发现者',
            description: '发现游戏的秘密',
            category: 'secret',
            hidden: true,
            condition: function(gameState) {
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
        },

        // 增强版成就 (来自enhanced-achievements.js 和 enhanced-achievement-system.js)
        {
            id: 'blood_thirsty',
            name: '嗜血狂魔',
            description: '击杀10个敌人',
            category: 'progress',
            condition: function(gameState) {
                return gameState.kills >= 10;
            },
            rarity: 'uncommon',
            icon: '🔥'
        },
        {
            id: 'monster_hunter',
            name: '怪物猎人',
            description: '击杀100个敌人',
            category: 'progress',
            condition: function(gameState) {
                return gameState.kills >= 100;
            },
            rarity: 'rare',
            icon: '👹'
        },
        {
            id: 'first_level',
            name: '勇往直前',
            description: '达到第5关',
            category: 'progress',
            condition: function(gameState) {
                return gameState.level >= 5;
            },
            rarity: 'common',
            icon: '🏁'
        },
        {
            id: 'explorer',
            name: '探索者',
            description: '达到第10关',
            category: 'progress',
            condition: function(gameState) {
                return gameState.level >= 10;
            },
            rarity: 'uncommon',
            icon: '🗺️'
        },
        {
            id: 'conqueror',
            name: '征服者',
            description: '达到第20关',
            category: 'progress',
            condition: function(gameState) {
                return gameState.level >= 20;
            },
            rarity: 'rare',
            icon: '🏰'
        },
        {
            id: 'master',
            name: '大师',
            description: '达到第30关',
            category: 'progress',
            condition: function(gameState) {
                return gameState.level >= 30;
            },
            rarity: 'epic',
            icon: '👑'
        },
        {
            id: 'legend',
            name: '传说',
            description: '达到第50关',
            category: 'progress',
            condition: function(gameState) {
                return gameState.level >= 50;
            },
            rarity: 'legendary',
            icon: '🌟'
        },
        {
            id: 'combo_king',
            name: '连击之王',
            description: '达成10连击',
            category: 'combat',
            condition: function(gameState) {
                return gameState.player?.maxCombo >= 10;
            },
            rarity: 'uncommon',
            icon: '⚡'
        },
        {
            id: 'combo_master',
            name: '连击大师',
            description: '达成20连击',
            category: 'combat',
            condition: function(gameState) {
                return gameState.player?.maxCombo >= 20;
            },
            rarity: 'rare',
            icon: '⚡⚡'
        },
        {
            id: 'high_scoring',
            name: '高分达人',
            description: '单局得分1000',
            category: 'combat',
            condition: function(gameState) {
                return gameState.player?.score >= 1000;
            },
            rarity: 'common',
            icon: '💯'
        },
        {
            id: 'higher_scoring',
            name: '更高分王',
            description: '单局得分5000',
            category: 'combat',
            condition: function(gameState) {
                return gameState.player?.score >= 5000;
            },
            rarity: 'rare',
            icon: '🎯'
        },
        {
            id: 'top_scoring',
            name: '顶级得分',
            description: '单局得分10000',
            category: 'combat',
            condition: function(gameState) {
                return gameState.player?.score >= 10000;
            },
            rarity: 'epic',
            icon: '🏆'
        },
        {
            id: 'tough_skin',
            name: '钢铁之肤',
            description: '达到第20关且生命值超过30',
            category: 'combat',
            condition: function(gameState) {
                return gameState.level >= 20 && gameState.player?.hp > 30;
            },
            rarity: 'rare',
            icon: '🛡️'
        },
        {
            id: 'weapon_collector',
            name: '武器收藏家',
            description: '使用过10种不同的武器',
            category: 'weapon',
            condition: function(gameState) {
                return gameState.uniqueWeaponsUsed >= 10;
            },
            rarity: 'common',
            icon: '🗡️'
        },
        {
            id: 'weapon_master',
            name: '武器大师',
            description: '使用过20种不同的武器',
            category: 'weapon',
            condition: function(gameState) {
                return gameState.uniqueWeaponsUsed >= 20;
            },
            rarity: 'rare',
            icon: '⚔️'
        },
        {
            id: 'rare_finder',
            name: '稀有发现者',
            description: '获得史诗级武器',
            category: 'weapon',
            condition: function(gameState) {
                return gameState.player?.weapon?.rarity === 'epic';
            },
            rarity: 'epic',
            icon: '💎'
        },
        {
            id: 'legendary_hunter',
            name: '传说猎人',
            description: '获得传说级武器',
            category: 'weapon',
            condition: function(gameState) {
                return gameState.player?.weapon?.rarity === 'legendary';
            },
            rarity: 'legendary',
            icon: '⭐'
        },
        {
            id: 'mythic_power',
            name: '神话之力',
            description: '获得神话级武器',
            category: 'weapon',
            condition: function(gameState) {
                return gameState.player?.weapon?.rarity === 'mythic';
            },
            rarity: 'mythic',
            icon: '✨'
        },
        {
            id: 'lucky_charm',
            name: '幸运护符',
            description: '使用幸运药水并击杀5个敌人',
            category: 'challenge',
            condition: function(gameState) {
                return gameState.luckyKills >= 5;
            },
            rarity: 'epic',
            icon: '🍀'
        },
        {
            id: 'phoenix_rise',
            name: '凤凰涅槃',
            description: '在濒死状态下使用生命药水',
            category: 'challenge',
            condition: function(gameState) {
                return gameState.reviveFromLowHp;
            },
            rarity: 'legendary',
            icon: '🕊️'
        },
        {
            id: 'guardian',
            name: '守护者',
            description: '获得3件不同的遗物',
            category: 'challenge',
            condition: function(gameState) {
                return gameState.relics.length >= 3;
            },
            rarity: 'rare',
            icon: '🔮'
        },
        {
            id: 'treasure_hoarder',
            name: '宝藏囤积者',
            description: '获得5件不同的遗物',
            category: 'challenge',
            condition: function(gameState) {
                return gameState.relics.length >= 5;
            },
            rarity: 'epic',
            icon: '💰'
        },
        {
            id: 'survival_expert',
            name: '生存专家',
            description: '在第40关时生命值仍然大于70',
            category: 'challenge',
            condition: function(gameState) {
                return gameState.level >= 40 && gameState.player?.hp > 70;
            },
            rarity: 'epic',
            icon: '🪖'
        },
        {
            id: 'combo_legend',
            name: '连击传说',
            description: '达成50连击',
            category: 'combat',
            condition: function(gameState) {
                return gameState.player?.maxCombo >= 50;
            },
            rarity: 'legendary',
            icon: '⚡⚡⚡'
        },
        {
            id: 'weapon_connoisseur',
            name: '武器鉴赏家',
            description: '使用过50种不同的武器',
            category: 'weapon',
            condition: function(gameState) {
                return gameState.uniqueWeaponsUsed >= 50;
            },
            rarity: 'legendary',
            icon: '🎭'
        },
        {
            id: 'relic_collector',
            name: '遗物收藏家',
            description: '收集全部7种遗物',
            category: 'challenge',
            condition: function(gameState) {
                return gameState.relics.length >= 7;
            },
            rarity: 'mythic',
            icon: '💎💎'
        },
        {
            id: 'first_win',
            name: '首胜',
            description: '获得游戏首次胜利',
            category: 'challenge',
            condition: function(gameState) {
                return gameState.firstWin;
            },
            rarity: 'epic',
            icon: '🥇'
        },
        {
            id: 'damage_specialist',
            name: '伤害专家',
            description: '单次攻击造成超过100点伤害',
            category: 'combat',
            condition: function(gameState) {
                return gameState.maxSingleHitDamage >= 100;
            },
            rarity: 'rare',
            icon: '💥'
        },
        {
            id: 'elemental_wizard',
            name: '元素巫师',
            description: '使用元素效果击杀50个敌人',
            category: 'challenge',
            condition: function(gameState) {
                return gameState.elementalKills >= 50;
            },
            rarity: 'epic',
            icon: '🔮⚡'
        },
        {
            id: 'team_work',
            name: '团队合作',
            description: '使用支援型武器击杀10个敌人',
            category: 'challenge',
            condition: function(gameState) {
                return gameState.supportWeaponKills >= 10;
            },
            rarity: 'rare',
            icon: '🤝'
        },
        {
            id: 'combo_destroyer',
            name: '连击终结者',
            description: '单次打断敌人连击5次',
            category: 'challenge',
            condition: function(gameState) {
                return gameState.comboBreaks >= 5;
            },
            rarity: 'epic',
            icon: '🚫'
        },
        {
            id: 'immortal',
            name: '不朽',
            description: '达到第30关且从未死亡',
            category: 'challenge',
            condition: function(gameState) {
                return gameState.level >= 30 && gameState.deaths === 0;
            },
            rarity: 'mythic',
            icon: '💀➡️✨'
        },
        {
            id: 'pacifist',
            name: '和平主义者',
            description: '达到第25关但不攻击任何敌人',
            category: 'challenge',
            condition: function(gameState) {
                return gameState.level >= 25 && gameState.attacks === 0;
            },
            rarity: 'legendary',
            icon: '☮️'
        },
        {
            id: 'balanced_warrior',
            name: '平衡战士',
            description: '在第30关仍然存活',
            category: 'challenge',
            condition: function(gameState) {
                return gameState.level >= 30;
            },
            rarity: 'epic',
            icon: '⚖️'
        },
        {
            id: 'elemental_mastery',
            name: '元素 mastery',
            description: '使用每种元素类型的武器至少一次',
            category: 'challenge',
            condition: function(gameState) {
                return gameState.elementalWeaponsUsed >= 5; // 假设有5种元素
            },
            rarity: 'epic',
            icon: '🔮'
        },
        {
            id: 'progressive_veteran',
            name: '进步老手',
            description: '累计游戏时间达到2小时',
            category: 'progress',
            condition: function(gameState) {
                return gameState.sessionTime >= 7200; // 2小时 = 7200秒
            },
            rarity: 'legendary',
            icon: '⏱️'
        },
        {
            id: 'boss_destroyer',
            name: 'Boss破坏者',
            description: '连续击败3个Boss',
            category: 'challenge',
            condition: function(gameState) {
                return gameState.consecutiveBossKills >= 3;
            },
            rarity: 'legendary',
            icon: '👹💥'
        }
    ];

    // 成就管理系统 - 主要系统实例
    class UnifiedAchievementManager {
        constructor() {
            this.achievements = {};
            this.tempStats = {
                uniqueWeaponsUsed: new Set(),
                luckyKillCount: 0,
                lowHpReviveCount: 0,
                relicsCollected: 0,
                skillsUsed: 0,
                usedPotionTypes: new Set(),
                berserkStreak: 0,
                lastBerserkTime: 0,
                consecutiveLuckyKills: 0,
                lastLuckyKillTime: 0,
                bossKillStreak: 0,
                lastBossKillTime: 0,
                legendaryWeaponKills: 0,
                lastWeaponChangeTime: 0,
                skillsUsedByType: { Q: 0, W: 0, E: 0, R: 0 },
                lastPotionTypes: [],
                speedRunStartTime: 0,
                firstWinCompleted: false,

                // 扩展追踪项
                usedElementalWeapons: new Set(),
                elementalKills: 0,
                damageHits: [],
                avoidedElites: 0,
                supportWeaponKills: 0,
                comboBreaks: 0,
                luckyDropStreak: 0,
                maxLuckyDropStreak: 0,
                lastAttackedTime: Date.now(),
                totalTime: 0,
                deaths: 0,
                reachedLevelWithoutAttacking: false,
                noDamageTime: 0,
                currentAvoidTime: 0,
                consecutiveBossKills: 0
            };

            this.initAchievements();
            this.listeners = [];

            console.log(`统一成就系统已加载，包含 ${UNIFIED_ACHIEVEMENT_DEFINITIONS.length} 个成就`);
        }

        initAchievements() {
            // 初始化成就状态
            UNIFIED_ACHIEVEMENT_DEFINITIONS.forEach(ach => {
                this.achievements[ach.id] = {
                    id: ach.id,
                    name: ach.name,
                    description: ach.description,
                    category: ach.category || 'general',
                    hidden: ach.hidden || false,
                    unlocked: false,
                    unlockTime: null,
                    progress: 0,
                    rarity: ach.rarity || 'common',
                    icon: ach.icon || '⭐'
                };
            });
        }

        // 检查成就条件
        checkAchievements(gameState) {
            let unlocked = [];

            UNIFIED_ACHIEVEMENT_DEFINITIONS.forEach(ach => {
                if (!this.achievements[ach.id].unlocked) {
                    // 计算进度
                    const progress = ach.progress ? ach.progress(gameState) : 0;
                    this.achievements[ach.id].progress = progress;

                    // 检查条件是否满足
                    if (ach.condition && ach.condition(gameState)) {
                        if (this.unlockAchievement(ach.id)) {
                            unlocked.push(ach);
                        }
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

                // 更新计数
                if (!window.gameState.achievementCount) {
                    window.gameState.achievementCount = 0;
                }
                window.gameState.achievementCount++;

                console.log(`🏆 成就解锁: ${this.achievements[id].name}`);

                // 保存成就状态
                this.saveToLocalStorage();

                return true;
            }
            return false;
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
                localStorage.setItem('unified_game_achievements', JSON.stringify(saveData));

                // 保存临时统计数据
                const tempData = {
                    uniqueWeaponsUsed: Array.from(this.tempStats.uniqueWeaponsUsed),
                    usedElementalWeapons: Array.from(this.tempStats.usedElementalWeapons)
                };
                localStorage.setItem('unified_game_temp_stats', JSON.stringify(tempData));
            } catch (e) {
                console.warn('无法保存成就到本地存储:', e);
            }
        }

        // 从本地存储加载成就
        loadFromLocalStorage() {
            try {
                const savedData = localStorage.getItem('unified_game_achievements');
                if (savedData) {
                    const parsedData = JSON.parse(savedData);
                    for (const [id, savedAchievement] of Object.entries(parsedData)) {
                        if (this.achievements[id]) {
                            this.achievements[id].unlocked = savedAchievement.unlocked;
                            this.achievements[id].unlockTime = savedAchievement.unlockTime;
                            this.achievements[id].progress = savedAchievement.progress;

                            if (savedAchievement.unlocked) {
                                // 更新计数
                                if (!window.gameState.achievementCount) {
                                    window.gameState.achievementCount = 0;
                                }
                                window.gameState.achievementCount++;
                            }
                        }
                    }
                }

                // 加载临时统计数据
                const tempData = localStorage.getItem('unified_game_temp_stats');
                if (tempData) {
                    const parsedTempData = JSON.parse(tempData);
                    if (parsedTempData.uniqueWeaponsUsed) {
                        this.tempStats.uniqueWeaponsUsed = new Set(parsedTempData.uniqueWeaponsUsed);
                    }
                    if (parsedTempData.usedElementalWeapons) {
                        this.tempStats.usedElementalWeapons = new Set(parsedTempData.usedElementalWeapons);
                    }
                }
            } catch (e) {
                console.warn('无法从本地存储加载成就:', e);
            }
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

                // 更新UI
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
            // 避免在没有DOM环境时创建元素
            if (typeof document === 'undefined') return;

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

            // 添加CSS动画（如果不存在）
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
                if (notification && notification.parentNode) {
                    notification.style.animation = 'fadeOut 1s ease-out';
                    setTimeout(() => {
                        if (notification.parentNode) {
                            notification.parentNode.removeChild(notification);
                        }
                    }, 1000);
                }
            }, 5000);
        }

        // 重置所有成就（调试用）
        resetAllAchievements() {
            for (const [id, achievement] of Object.entries(this.achievements)) {
                achievement.unlocked = false;
                achievement.unlockTime = null;
                achievement.progress = 0;
            }
            window.gameState.achievementCount = 0;
            this.saveToLocalStorage();
        }

        // ==================== 通用追踪方法 ====================

        // 当玩家获得新武器时调用
        onWeaponAcquired(weapon) {
            if (weapon && weapon.name) {
                // 记录使用的不同武器（避免重复）
                this.tempStats.uniqueWeaponsUsed.add(weapon.name);

                // 检查元素武器
                if (weapon.effect) {
                    this.tempStats.usedElementalWeapons.add(weapon.effect);
                }

                // 检查武器相关成就
                this.checkAchievements(window.gameState || {});
            }
        }

        // 当玩家使用幸运药水并击杀敌人时调用
        onLuckyKill() {
            this.tempStats.luckyKillCount++;
            this.checkAchievements(window.gameState || {});
        }

        // 追踪连续幸运击杀
        onLuckyKillStreak() {
            const now = Date.now();
            if (now - this.tempStats.lastLuckyKillTime < 5000) { // 5秒内再次幸运击杀
                this.tempStats.consecutiveLuckyKills++;
            } else {
                this.tempStats.consecutiveLuckyKills = 1;
            }
            this.tempStats.lastLuckyKillTime = now;
        }

        // 当玩家使用生命药水脱离危险状态时调用
        onPhoenixRise() {
            this.tempStats.lowHpReviveCount++;
            this.checkAchievements(window.gameState || {});
        }

        // 当玩家获得遗物时调用
        onRelicAcquired() {
            this.tempStats.relicsCollected++;
            this.checkAchievements(window.gameState || {});
        }

        // 当玩家使用技能时调用
        onSkillUsed() {
            this.tempStats.skillsUsed++;
            this.checkAchievements(window.gameState || {});
        }

        // 当玩家使用不同类型技能时调用
        onSpecificSkillUsed(skillKey) {
            if (this.tempStats.skillsUsedByType[skillKey] !== undefined) {
                this.tempStats.skillsUsedByType[skillKey]++;
                this.tempStats.skillsUsed++; // 同时增加总技能使用数
            }
            this.checkAchievements(window.gameState || {});
        }

        // 当玩家使用药水时调用
        onPotionUsed(potion) {
            // 记录使用的不同药水类型（避免重复）
            if (potion.name) {
                this.tempStats.usedPotionTypes.add(potion.name);
            }
            this.checkAchievements(window.gameState || {});
        }

        // 当使用元素武器击杀敌人时调用
        onElementalKill() {
            this.tempStats.elementalKills++;
            this.checkAchievements(window.gameState || {});
        }

        // 当使用支援型武器击杀敌人时调用
        onSupportWeaponKill() {
            this.tempStats.supportWeaponKills++;
            this.checkAchievements(window.gameState || {});
        }

        // 当打断敌人连击时调用
        onComboBreak() {
            this.tempStats.comboBreaks++;
            this.checkAchievements(window.gameState || {});
        }

        // 记录高伤害攻击
        onHighDamageHit(damage) {
            this.tempStats.damageHits.push(damage);
            // 保持最近100次伤害记录
            if (this.tempStats.damageHits.length > 100) {
                this.tempStats.damageHits.shift();
            }
            this.checkAchievements(window.gameState || {});
        }

        // 规避精英敌人
        onEliteAvoid() {
            this.tempStats.avoidedElites++;
            this.checkAchievements(window.gameState || {});
        }

        // 追踪幸运掉落连击
        onLuckyDrop() {
            this.tempStats.luckyDropStreak++;
            this.tempStats.maxLuckyDropStreak = Math.max(
                this.tempStats.maxLuckyDropStreak,
                this.tempStats.luckyDropStreak
            );
        }

        // 重置幸运掉落计数
        onNormalDrop() {
            this.tempStats.luckyDropStreak = 0;
        }

        // 追踪关卡进展（用于无攻击成就）
        onLevelProgress() {
            // 检查是否达到某个关卡且长时间未攻击
            if (window.gameState && window.gameState.level >= 25 &&
                (Date.now() - this.tempStats.lastAttackedTime) > 300000) { // 5分钟
                this.tempStats.reachedLevelWithoutAttacking = true;
            }
        }

        // 玩家死亡时调用
        onPlayerDeath() {
            this.tempStats.deaths++;
            this.tempStats.luckyDropStreak = 0; // 死亡重置幸运连击
        }

        // 当游戏开始时调用（用于追踪速通成就）
        onGameStart() {
            this.tempStats.speedRunStartTime = Date.now();
            this.tempStats.deaths = 0; // 重置死亡计数
            this.tempStats.damageHits = []; // 重置伤害记录

            // 保留跨游戏的统计数据
            this.tempStats.uniqueWeaponsUsed = new Set(); // 在新游戏中可能需要重置此数据
            this.tempStats.usedElementalWeapons = new Set();

            this.checkAchievements(window.gameState || {});
        }

        // 当游戏通关时调用
        onGameWin() {
            this.tempStats.firstWinCompleted = true;
            // 检查速通成就
            const timeElapsed = (Date.now() - this.tempStats.speedRunStartTime) / 60000; // 转换为分钟
            if (timeElapsed <= 15) {
                // 15分钟内通关的速度恶魔成就
                // 这里可以设置相关标志
            }
            this.checkAchievements(window.gameState || {});
        }

        // 追踪Boss击败
        onBossDefeat() {
            // 更新Boss相关成就追踪
            const now = Date.now();
            if (now - this.tempStats.lastBossKillTime < 10000) { // 10秒内击败另一个Boss
                this.tempStats.bossKillStreak++;
                this.tempStats.consecutiveBossKills++;
            } else {
                this.tempStats.bossKillStreak = 1;
                this.tempStats.consecutiveBossKills = 1;
            }
            this.tempStats.lastBossKillTime = now;
        }

        // 追踪传说武器击杀
        onLegendaryWeaponKill() {
            this.tempStats.legendaryWeaponKills++;
        }

        // 追踪攻击行为（用于和平主义等成就）
        onAttack() {
            this.tempStats.lastAttackedTime = Date.now();
            this.tempStats.reachedLevelWithoutAttacking = false; // 一旦攻击就重置无攻击标记
        }

        // 重置临时统计数据（通常在游戏重启时）
        resetTempStats() {
            this.tempStats = {
                uniqueWeaponsUsed: new Set(),  // 使用Set，以便于去重
                luckyKillCount: 0,
                lowHpReviveCount: 0,
                relicsCollected: 0,
                skillsUsed: 0,
                usedPotionTypes: new Set(),  // 使用Set，以便于去重
                berserkStreak: 0,
                lastBerserkTime: 0,
                luckyBossKill: false,
                oneHitBossKill: false,
                triplePhoenix: 0,
                neverTookFullDamage: false,
                berserkLegend: 0,

                // 新增Steam版追踪项
                usedElementalWeapons: new Set(), // 使用过的元素武器类型
                elementalKills: 0, // 元素效果击杀数
                damageHits: [], // 伤害记录
                avoidedElites: 0, // 规避精英敌人数
                supportWeaponKills: 0, // 支援武器击杀数
                comboBreaks: 0, // 打断连击数
                luckyDropStreak: 0, // 幸运掉落连击
                maxLuckyDropStreak: 0, // 最大幸运掉落连击
                lastAttackedTime: Date.now(), // 上次攻击时间
                totalTime: 0, // 总游戏时间
                deaths: 0, // 死亡次数
                reachedLevelWithoutAttacking: false, // 是否达到无攻击等级
                noDamageTime: 0, // 未受伤害时间
                currentAvoidTime: 0, // 当前规避时间

                // 原有追踪项
                consecutiveLuckyKills: 0,
                lastLuckyKillTime: 0,
                bossKillStreak: 0,
                lastBossKillTime: 0,
                legendaryWeaponKills: 0,
                lastWeaponChangeTime: 0,
                skillsUsedByType: { Q: 0, W: 0, E: 0, R: 0 },
                lastPotionTypes: [],
                speedRunStartTime: Date.now(),
                firstWinCompleted: false,
                speedRunComplete: false,
                elementalAdept: false,
                consecutiveBossKills: 0 // 添加连续Boss击杀追踪
            };
        }
    }

    // 创建全局成就管理器实例
    window.AchievementManager = new UnifiedAchievementManager();

    // 初始化时从本地存储加载
    window.AchievementManager.loadFromLocalStorage();

    // ==================== 事件监听增强 ====================

    // 成就解锁逻辑增强
    class AchievementEventEnhancer {
        constructor() {
            this.setupEventListeners();
        }

        // 设置事件监听器
        setupEventListeners() {
            // 监听游戏开始事件
            this.setupGameStartListener();

            // 监听敌人死亡事件
            this.setupEnemyDeathListener();

            // 监听武器获取事件
            this.setupWeaponPickupListener();

            // 监听药水使用事件
            this.setupPotionUseListener();

            // 监听遗物获取事件
            this.setupRelicPickupListener();

            // 监听技能使用事件
            this.setupSkillUseListener();

            // 监听升级事件
            this.setupLevelUpListener();

            // 监听连击变化事件
            this.setupComboChangeListener();
        }

        // 设置游戏开始监听器
        setupGameStartListener() {
            if (typeof window.startGame !== 'undefined') {
                const originalStartGame = window.startGame;
                window.startGame = function(forceNew = false) {
                    if (window.AchievementManager) {
                        window.AchievementManager.onGameStart();
                        window.AchievementManager.resetTempStats();
                    }

                    // 调用原始函数
                    return originalStartGame.call(this, forceNew);
                };
            }
        }

        // 设置敌人死亡监听器
        setupEnemyDeathListener() {
            if (typeof window.killEnemy !== 'undefined') {
                const originalKillEnemy = window.killEnemy;
                window.killEnemy = function(enemy) {
                    // 调用原始函数
                    const result = originalKillEnemy.call(this, enemy);

                    // 检查并处理击杀相关的成就
                    if (window.AchievementManager) {
                        if (enemy.type === 'BOSS') {
                            window.AchievementManager.onBossDefeat();
                        }

                        // 如果使用了传说武器击杀，记录成就
                        if (window.gameState && window.gameState.player && window.gameState.player.weapon) {
                            if (['legendary', 'mythic'].includes(window.gameState.player.weapon.rarity)) {
                                window.AchievementManager.onLegendaryWeaponKill();
                            }
                        }
                    }

                    return result;
                };
            }
        }

        // 设置武器获取监听器
        setupWeaponPickupListener() {
            if (typeof window.pickupWeapon !== 'undefined') {
                const originalPickupWeapon = window.pickupWeapon;
                window.pickupWeapon = function(weapon) {
                    // 调用原始函数
                    const result = originalPickupWeapon.call(this, weapon);

                    // 通知成就系统获取了新武器
                    if (window.AchievementManager) {
                        window.AchievementManager.onWeaponAcquired(weapon);
                    }

                    return result;
                };
            }
        }

        // 设置药水使用监听器
        setupPotionUseListener() {
            if (typeof window.usePotion !== 'undefined') {
                const originalUsePotion = window.usePotion;
                window.usePotion = function(potion) {
                    // 调用原始函数前记录状态
                    const previousHp = window.gameState.player?.hp || 100;

                    // 调用原始函数
                    const result = originalUsePotion.call(this, potion);

                    // 通知成就系统使用了药水
                    if (window.AchievementManager) {
                        window.AchievementManager.onPotionUsed(potion);

                        // 检查凤凰涅槃成就
                        if (previousHp < window.gameState.player?.maxHp * 0.2 && potion.effect === 'heal') {
                            window.AchievementManager.onPhoenixRise();
                        }
                    }

                    return result;
                };
            }
        }

        // 设置遗物获取监听器
        setupRelicPickupListener() {
            if (typeof window.collectRelic !== 'undefined') {
                const originalCollectRelic = window.collectRelic;
                window.collectRelic = function(relic) {
                    // 调用原始函数
                    const result = originalCollectRelic.call(this, relic);

                    // 通知成就系统获取了遗物
                    if (window.AchievementManager) {
                        window.AchievementManager.onRelicAcquired();
                    }

                    return result;
                };
            }
        }

        // 设置技能使用监听器
        setupSkillUseListener() {
            if (typeof window.useSkill !== 'undefined') {
                const originalUseSkill = window.useSkill;
                window.useSkill = function(skillKey, skill) {
                    // 调用原始函数
                    const result = originalUseSkill.call(this, skillKey, skill);

                    // 通知成就系统使用了技能
                    if (window.AchievementManager) {
                        window.AchievementManager.onSkillUsed();
                        window.AchievementManager.onSpecificSkillUsed(skillKey);
                    }

                    return result;
                };
            }
        }

        // 设置升级监听器
        setupLevelUpListener() {
            if (typeof window.levelUp !== 'undefined') {
                const originalLevelUp = window.levelUp;
                window.levelUp = function() {
                    // 调用原始函数
                    const result = originalLevelUp.call(this);

                    // 检查升级相关的成就
                    if (window.AchievementManager) {
                        window.AchievementManager.checkAchievements(window.gameState || {});
                    }

                    return result;
                };
            }
        }

        // 设置连击变化监听器
        setupComboChangeListener() {
            if (typeof window.updateCombo !== 'undefined') {
                const originalUpdateCombo = window.updateCombo;
                window.updateCombo = function(newCombo) {
                    // 记录之前的连击数
                    const prevCombo = window.gameState.player?.currentCombo || 0;

                    // 调用原始函数
                    const result = originalUpdateCombo.call(this, newCombo);

                    // 如果连击中断（非因为敌人死亡导致），可能涉及连击相关成就
                    if (prevCombo > 0 && newCombo === 0 && window.AchievementManager) {
                        window.AchievementManager.checkAchievements(window.gameState || {});
                    }

                    return result;
                };
            }
        }
    }

    // 创建成就事件增强实例
    window.AchievementEventEnhancer = new AchievementEventEnhancer();

    // 全局函数，供游戏其他部分调用
    window.notifyLuckyKill = function() {
        if (window.AchievementManager) {
            window.AchievementManager.onLuckyKill();
            window.AchievementManager.onLuckyKillStreak();
        }
    };

    window.notifyGameWin = function() {
        if (window.AchievementManager) {
            window.AchievementManager.onGameWin();
        }
    };

    window.notifyGameOver = function() {
        if (window.AchievementManager) {
            // 在游戏结束时检查所有成就
            window.AchievementManager.checkAchievements(window.gameState || {});
        }
    };

    window.notifyPlayerDeath = function() {
        if (window.AchievementManager) {
            window.AchievementManager.onPlayerDeath();
        }
    };

    window.notifyAttack = function() {
        if (window.AchievementManager) {
            window.AchievementManager.onAttack();
        }
    };

    // 定期检查成就（每5秒）
    setInterval(() => {
        if (typeof window.gameState !== 'undefined' && window.gameState.isPlaying && window.AchievementManager) {
            window.AchievementManager.checkAchievements(window.gameState);
        }
    }, 5000);

    // 页面卸载前保存成就
    if (typeof window !== 'undefined') {
        window.addEventListener('beforeunload', () => {
            if (window.AchievementManager) {
                window.AchievementManager.saveToLocalStorage();
            }
        });

        // 在游戏运行期间持续检查成就
        if (typeof window.requestAnimationFrame !== 'undefined') {
            function achievementCheckLoop() {
                if (typeof window.gameState !== 'undefined' &&
                    window.gameState.isPlaying &&
                    window.AchievementManager) {
                    window.AchievementManager.checkAchievements(window.gameState);
                }
                requestAnimationFrame(achievementCheckLoop);
            }
            requestAnimationFrame(achievementCheckLoop);
        }
    }

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
            if (!window.gameState.luckyKills) window.gameState.luckyKills = 0;
            if (!window.gameState.reviveFromLowHp) window.gameState.reviveFromLowHp = false;
            if (!window.gameState.relics) window.gameState.relics = [];
            if (!window.gameState.firstWin) window.gameState.firstWin = false;
            if (!window.gameState.elementalKills) window.gameState.elementalKills = 0;
            if (!window.gameState.supportWeaponKills) window.gameState.supportWeaponKills = 0;
            if (!window.gameState.comboBreaks) window.gameState.comboBreaks = 0;
            if (!window.gameState.deaths) window.gameState.deaths = 0;
            if (!window.gameState.attacks) window.gameState.attacks = 0;
            if (!window.gameState.uniqueWeaponsUsed) window.gameState.uniqueWeaponsUsed = 0;
            if (!window.gameState.elementalWeaponsUsed) window.gameState.elementalWeaponsUsed = 0;
            if (!window.gameState.consecutiveBossKills) window.gameState.consecutiveBossKills = 0;
        }
    }

    // 延迟执行以确保gameState存在
    setTimeout(extendGameStateForAchievements, 1000);

    // 添加成就UI显示功能
    function addAchievementUI() {
        if (typeof document === 'undefined') return; // 避免在非DOM环境中执行

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
            if (!window.AchievementManager) return;

            const statsDiv = document.getElementById('achievements-stats');
            const listDiv = document.getElementById('achievements-list');
            const stats = window.AchievementManager.getStatistics();

            statsDiv.innerHTML = `
                <div style="font-size: 1.2em; font-weight: bold; color: #4ade80;">
                    总成就: ${stats.total} | 已解锁: ${stats.unlocked} | 完成度: ${stats.percentage}%
                </div>
            `;

            listDiv.innerHTML = '';

            // 按类别组织成就
            const categories = {};
            Object.values(window.AchievementManager.getAllAchievements()).forEach(ach => {
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
                    const rarityColor = ach.rarity === 'legendary' ? '#ff8c00' :
                                       ach.rarity === 'epic' ? '#9400d3' :
                                       ach.rarity === 'rare' ? '#1e90ff' : '#aaa';

                    achElement.innerHTML = `
                        <div style="font-weight: bold; color: ${ach.unlocked ? '#4ade80' : rarityColor};">
                            ${ach.icon} ${status} ${ach.name}
                            <span style="font-size: 0.7em; margin-left: 5px;">[${ach.rarity}]</span>
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
    }

    // 初始化成就UI
    setTimeout(addAchievementUI, 3000);

    console.log("统一成就系统已完全加载，共包含 " + UNIFIED_ACHIEVEMENT_DEFINITIONS.length + " 个成就");
})();