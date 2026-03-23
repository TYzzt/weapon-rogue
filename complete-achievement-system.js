// ==================== 完整成就系统 ====================
//
// 实现超过20个成就的成就系统，包括：
// 1. 游戏进度相关成就
// 2. 战斗相关成就
// 3. 武器相关成就
// 4. 特殊挑战成就

class CompleteAchievementSystem {
    constructor() {
        // 成就定义列表（超过25个成就）
        this.achievementDefinitions = [
            // 游戏进度相关
            {
                id: 'first_blood',
                name: '初出茅庐',
                description: '获得你的第一滴血',
                category: 'progress',
                condition: (stats) => stats.kills >= 1
            },
            {
                id: 'blood_thirsty',
                name: '嗜血狂魔',
                description: '击杀10个敌人',
                category: 'progress',
                condition: (stats) => stats.kills >= 10
            },
            {
                id: 'killing_spree',
                name: '杀戮 spree',
                description: '击杀50个敌人',
                category: 'progress',
                condition: (stats) => stats.kills >= 50
            },
            {
                id: 'monster_hunter',
                name: '怪物猎人',
                description: '击杀100个敌人',
                category: 'progress',
                condition: (stats) => stats.kills >= 100
            },
            {
                id: 'first_level',
                name: '勇往直前',
                description: '达到第5关',
                category: 'progress',
                condition: (stats) => stats.level >= 5
            },
            {
                id: 'explorer',
                name: '探索者',
                description: '达到第10关',
                category: 'progress',
                condition: (stats) => stats.level >= 10
            },
            {
                id: 'conqueror',
                name: '征服者',
                description: '达到第20关',
                category: 'progress',
                condition: (stats) => stats.level >= 20
            },
            {
                id: 'master',
                name: '大师',
                description: '达到第30关',
                category: 'progress',
                condition: (stats) => stats.level >= 30
            },
            {
                id: 'legend',
                name: '传说',
                description: '达到第50关',
                category: 'progress',
                condition: (stats) => stats.level >= 50
            },

            // 战斗相关
            {
                id: 'combo_king',
                name: '连击之王',
                description: '达成10连击',
                category: 'combat',
                condition: (stats) => stats.maxCombo >= 10
            },
            {
                id: 'combo_master',
                name: '连击大师',
                description: '达成20连击',
                category: 'combat',
                condition: (stats) => stats.maxCombo >= 20
            },
            {
                id: 'combo_legend',
                name: '连击传说',
                description: '达成50连击',
                category: 'combat',
                condition: (stats) => stats.maxCombo >= 50
            },
            {
                id: 'high_scoring',
                name: '高分达人',
                description: '单局得分1000',
                category: 'combat',
                condition: (stats) => stats.score >= 1000
            },
            {
                id: 'higher_scoring',
                name: '更高分王',
                description: '单局得分5000',
                category: 'combat',
                condition: (stats) => stats.score >= 5000
            },
            {
                id: 'top_scoring',
                name: '顶级得分',
                description: '单局得分10000',
                category: 'combat',
                condition: (stats) => stats.score >= 10000
            },
            {
                id: 'survivor',
                name: '生存专家',
                description: '达到第10关且生命值超过50',
                category: 'combat',
                condition: (stats) => stats.level >= 10 && stats.playerHp > 50
            },
            {
                id: 'tough_skin',
                name: '钢铁之肤',
                description: '达到第20关且生命值超过30',
                category: 'combat',
                condition: (stats) => stats.level >= 20 && stats.playerHp > 30
            },
            {
                id: 'survival_expert',
                name: '生存专家',
                description: '在第40关时生命值仍然大于70',
                category: 'combat',
                condition: (stats) => stats.level >= 40 && stats.playerHp > 70
            },

            // 武器相关
            {
                id: 'weapon_collector',
                name: '武器收藏家',
                description: '使用过10种不同的武器',
                category: 'weapon',
                condition: (stats) => stats.uniqueWeaponsUsed >= 10
            },
            {
                id: 'weapon_master',
                name: '武器大师',
                description: '使用过20种不同的武器',
                category: 'weapon',
                condition: (stats) => stats.uniqueWeaponsUsed >= 20
            },
            {
                id: 'weapon_mastery',
                name: '武器精通',
                description: '使用过30种不同的武器',
                category: 'weapon',
                condition: (stats) => stats.uniqueWeaponsUsed >= 30
            },
            {
                id: 'weapon_connoisseur',
                name: '武器鉴赏家',
                description: '使用过50种不同的武器',
                category: 'weapon',
                condition: (stats) => stats.uniqueWeaponsUsed >= 50
            },
            {
                id: 'rare_finder',
                name: '稀有发现者',
                description: '获得史诗级武器',
                category: 'weapon',
                condition: (stats) => stats.hasEpicWeapon
            },
            {
                id: 'legendary_hunter',
                name: '传说猎人',
                description: '获得传说级武器',
                category: 'weapon',
                condition: (stats) => stats.hasLegendaryWeapon
            },
            {
                id: 'mythic_power',
                name: '神话之力',
                description: '获得神话级武器',
                category: 'weapon',
                condition: (stats) => stats.hasMythicWeapon
            },
            {
                id: 'elemental_master',
                name: '元素大师',
                description: '使用过5种不同元素效果的武器',
                category: 'weapon',
                condition: (stats) => stats.usedElementalWeapons >= 5
            },
            {
                id: 'legendary_victory',
                name: '传奇胜利',
                description: '使用传说级武器获胜',
                category: 'weapon',
                condition: (stats) => stats.wonWithLegendary
            },

            // 特殊挑战
            {
                id: 'lucky_charm',
                name: '幸运护符',
                description: '使用幸运药水并击杀5个敌人',
                category: 'challenge',
                condition: (stats) => stats.luckyKills >= 5
            },
            {
                id: 'phoenix_rise',
                name: '凤凰涅槃',
                description: '在濒死状态下使用生命药水',
                category: 'challenge',
                condition: (stats) => stats.reviveFromLowHp
            },
            {
                id: 'guardian',
                name: '守护者',
                description: '获得3件不同的遗物',
                category: 'challenge',
                condition: (stats) => stats.relicsCollected >= 3
            },
            {
                id: 'treasure_hoarder',
                name: '宝藏囤积者',
                description: '获得5件不同的遗物',
                category: 'challenge',
                condition: (stats) => stats.relicsCollected >= 5
            },
            {
                id: 'relic_collector',
                name: '遗物收藏家',
                description: '收集全部7种遗物',
                category: 'challenge',
                condition: (stats) => stats.collectAllRelics
            },
            {
                id: 'first_win',
                name: '首胜',
                description: '获得游戏首次胜利',
                category: 'challenge',
                condition: (stats) => stats.firstWin
            },
            {
                id: 'damage_specialist',
                name: '伤害专家',
                description: '单次攻击造成超过100点伤害',
                category: 'challenge',
                condition: (stats) => stats.highDamageHit
            },
            {
                id: 'elemental_wizard',
                name: '元素巫师',
                description: '使用元素效果击杀50个敌人',
                category: 'challenge',
                condition: (stats) => stats.elementalKills >= 50
            },
            {
                id: 'team_work',
                name: '团队合作',
                description: '使用支援型武器击杀10个敌人',
                category: 'challenge',
                condition: (stats) => stats.supportWeaponKills >= 10
            },
            {
                id: 'combo_destroyer',
                name: '连击终结者',
                description: '单次打断敌人连击5次',
                category: 'challenge',
                condition: (stats) => stats.comboBreaks >= 5
            },
            {
                id: 'immortal',
                name: '不朽',
                description: '达到第30关且从未死亡',
                category: 'challenge',
                condition: (stats) => stats.noDeath30
            },
            {
                id: 'pacifist',
                name: '和平主义者',
                description: '达到第25关但不攻击任何敌人',
                category: 'challenge',
                condition: (stats) => stats.reachLevelWithoutAttacking
            }
        ];

        // 初始化已解锁成就（从localStorage加载或创建新对象）
        const savedAchievements = localStorage.getItem('weaponRogueAchievements');
        this.unlockedAchievements = savedAchievements ? JSON.parse(savedAchievements) : {};

        // 临时统计对象，用于追踪当前游戏会话的进度
        this.tempStats = {
            kills: 0,
            level: 1,
            score: 0,
            maxCombo: 0,
            playerHp: 100,
            uniqueWeaponsUsed: 0,
            hasEpicWeapon: false,
            hasLegendaryWeapon: false,
            hasMythicWeapon: false,
            usedElementalWeapons: 0,
            wonWithLegendary: false,
            luckyKills: 0,
            reviveFromLowHp: false,
            relicsCollected: 0,
            firstWin: false,
            highDamageHit: false,
            elementalKills: 0,
            supportWeaponKills: 0,
            comboBreaks: 0,
            noDeath30: false,
            reachLevelWithoutAttacking: false,
            collectAllRelics: false,
            lastAttackedTime: Date.now()
        };

        // 记录已使用的武器集合（持久化）
        const savedUniqueWeapons = localStorage.getItem('weaponRogueUniqueWeapons');
        this.uniqueWeaponsUsed = savedUniqueWeapons ? new Set(JSON.parse(savedUniqueWeapons)) : new Set();

        // 记录已使用的元素武器类型（持久化）
        const savedElementalWeapons = localStorage.getItem('weaponRogueElementalWeapons');
        this.usedElementalWeapons = savedElementalWeapons ? new Set(JSON.parse(savedElementalWeapons)) : new Set();
    }

    // 检查所有成就是否满足条件
    checkAchievements() {
        const newAchievements = [];

        for (const achievement of this.achievementDefinitions) {
            if (!this.unlockedAchievements[achievement.id]) {
                // 创建包含所有统计数据的对象
                const stats = {
                    ...this.tempStats,
                    uniqueWeaponsUsed: this.uniqueWeaponsUsed.size,
                    usedElementalWeapons: this.usedElementalWeapons.size
                };

                if (achievement.condition(stats)) {
                    this.unlockAchievement(achievement);
                    newAchievements.push(achievement);
                }
            }
        }

        return newAchievements;
    }

    // 解锁成就
    unlockAchievement(achievement) {
        // 记录成就解锁时间和状态
        this.unlockedAchievements[achievement.id] = {
            unlocked: true,
            timestamp: Date.now(),
            name: achievement.name,
            description: achievement.description,
            category: achievement.category
        };

        // 保存到localStorage
        localStorage.setItem('weaponRogueAchievements', JSON.stringify(this.unlockedAchievements));

        console.log(`🏆 解锁成就: ${achievement.name} - ${achievement.description}`);

        // 显示成就解锁提示
        if (typeof showCombatLog !== 'undefined') {
            showCombatLog(`🏆 成就解锁: ${achievement.name}`, 'achievement-unlock');
        }

        // 如果存在音频管理器，播放成就音效
        if (typeof enhancedAudioManager !== 'undefined') {
            enhancedAudioManager.playSound('achievement_unlock', 0.8);
        }

        // 如果存在存档系统，保存成就状态
        if (typeof comprehensiveSaveSystem !== 'undefined') {
            // 更新gameState中的成就数据以供保存
            if (typeof AchievementSystem !== 'undefined') {
                AchievementSystem.achievements = this.unlockedAchievements;
            }
        }
    }

    // 获取已解锁成就数量
    getUnlockedCount() {
        return Object.keys(this.unlockedAchievements).filter(id =>
            this.unlockedAchievements[id].unlocked
        ).length;
    }

    // 获取总成就数量
    getTotalCount() {
        return this.achievementDefinitions.length;
    }

    // 获取按类别分组的成就统计
    getCategoryStats() {
        const categories = {};

        // 初始化类别计数
        for (const achievement of this.achievementDefinitions) {
            if (!categories[achievement.category]) {
                categories[achievement.category] = { total: 0, unlocked: 0 };
            }
            categories[achievement.category].total++;
        }

        // 计算每个类别中已解锁的数量
        for (const [id, achievement] of Object.entries(this.unlockedAchievements)) {
            if (achievement.unlocked) {
                const def = this.achievementDefinitions.find(a => a.id === id);
                if (def && categories[def.category]) {
                    categories[def.category].unlocked++;
                }
            }
        }

        return categories;
    }

    // 更新临时统计数据
    updateStats(statName, value) {
        this.tempStats[statName] = value;
        // 检查成就条件
        this.checkAchievements();
    }

    // 增量更新统计数据
    incrementStat(statName, increment = 1) {
        if (typeof this.tempStats[statName] === 'number') {
            this.tempStats[statName] += increment;
        } else {
            this.tempStats[statName] = increment;
        }
        this.checkAchievements();
    }

    // 记录使用了新武器
    recordWeaponUse(weapon) {
        if (weapon && weapon.name) {
            this.uniqueWeaponsUsed.add(weapon.name);
            // 保存到localStorage
            localStorage.setItem('weaponRogueUniqueWeapons', JSON.stringify(Array.from(this.uniqueWeaponsUsed)));

            // 检查武器类型（是否为元素武器）
            if (weapon.effect) {
                this.usedElementalWeapons.add(weapon.effect);
                // 保存到localStorage
                localStorage.setItem('weaponRogueElementalWeapons', JSON.stringify(Array.from(this.usedElementalWeapons)));
            }

            // 更新临时状态以追踪史诗、传说、神话武器
            if (weapon.rarity === 'epic') this.tempStats.hasEpicWeapon = true;
            if (weapon.rarity === 'legendary') this.tempStats.hasLegendaryWeapon = true;
            if (weapon.rarity === 'mythic') this.tempStats.hasMythicWeapon = true;

            this.checkAchievements();
        }
    }

    // 记录使用元素武器击杀
    recordElementalKill() {
        this.incrementStat('elementalKills', 1);
    }

    // 记录支援武器击杀
    recordSupportWeaponKill() {
        this.incrementStat('supportWeaponKills', 1);
    }

    // 记录连击打断
    recordComboBreak() {
        this.incrementStat('comboBreaks', 1);
    }

    // 记录高伤害攻击
    recordHighDamageHit(damage) {
        if (damage > 100) {
            this.tempStats.highDamageHit = true;
            this.checkAchievements();
        }
    }

    // 记录濒死复活
    recordReviveFromLowHp() {
        this.tempStats.reviveFromLowHp = true;
        this.checkAchievements();
    }

    // 记录获得遗物
    recordRelicAcquired() {
        this.incrementStat('relicsCollected', 1);
    }

    // 记录首次胜利
    recordFirstWin() {
        this.tempStats.firstWin = true;
        this.checkAchievements();
    }

    // 记录使用幸运药水击杀
    recordLuckyKill() {
        this.incrementStat('luckyKills', 1);
    }

    // 重置临时统计数据（新游戏时调用）
    resetTempStats() {
        this.tempStats = {
            kills: 0,
            level: 1,
            score: 0,
            maxCombo: 0,
            playerHp: 100,
            uniqueWeaponsUsed: this.uniqueWeaponsUsed.size, // 保留跨游戏的统计数据
            hasEpicWeapon: false,
            hasLegendaryWeapon: false,
            hasMythicWeapon: false,
            usedElementalWeapons: this.usedElementalWeapons.size, // 保留跨游戏的统计数据
            wonWithLegendary: false,
            luckyKills: 0,
            reviveFromLowHp: false,
            relicsCollected: 0,
            firstWin: false,
            highDamageHit: false,
            elementalKills: 0,
            supportWeaponKills: 0,
            comboBreaks: 0,
            noDeath30: false,
            reachLevelWithoutAttacking: false,
            collectAllRelics: false,
            lastAttackedTime: Date.now()
        };
    }

    // 标记使用传说武器获胜
    markWonWithLegendary() {
        this.tempStats.wonWithLegendary = true;
        this.checkAchievements();
    }

    // 标记达到30关且未死亡
    markNoDeath30() {
        this.tempStats.noDeath30 = true;
        this.checkAchievements();
    }

    // 标记达到25关且未攻击
    markReachLevelWithoutAttacking() {
        this.tempStats.reachLevelWithoutAttacking = true;
        this.checkAchievements();
    }

    // 标记收集全部遗物
    markCollectAllRelics() {
        this.tempStats.collectAllRelics = true;
        this.checkAchievements();
    }

    // 更新玩家生命值（用于相关成就检查）
    updatePlayerHp(hp, maxHp) {
        this.tempStats.playerHp = hp;
        this.checkAchievements();
    }

    // 获取所有成就定义
    getAllAchievementDefinitions() {
        return this.achievementDefinitions;
    }

    // 获取已解锁的成就
    getUnlockedAchievements() {
        return Object.keys(this.unlockedAchievements).filter(id =>
            this.unlockedAchievements[id].unlocked
        ).map(id => ({
            id,
            ...this.unlockedAchievements[id]
        }));
    }

    // 获取未解锁的成就
    getLockedAchievements() {
        const unlockedIds = new Set(Object.keys(this.unlockedAchievements));
        return this.achievementDefinitions.filter(achievement =>
            !unlockedIds.has(achievement.id)
        );
    }

    // 保存所有成就相关数据到localStorage
    saveAllData() {
        localStorage.setItem('weaponRogueAchievements', JSON.stringify(this.unlockedAchievements));
        localStorage.setItem('weaponRogueUniqueWeapons', JSON.stringify(Array.from(this.uniqueWeaponsUsed)));
        localStorage.setItem('weaponRogueElementalWeapons', JSON.stringify(Array.from(this.usedElementalWeapons)));
    }

    // 从localStorage加载所有成就相关数据
    loadAllData() {
        const savedAchievements = localStorage.getItem('weaponRogueAchievements');
        if (savedAchievements) {
            this.unlockedAchievements = JSON.parse(savedAchievements);
        }

        const savedUniqueWeapons = localStorage.getItem('weaponRogueUniqueWeapons');
        if (savedUniqueWeapons) {
            this.uniqueWeaponsUsed = new Set(JSON.parse(savedUniqueWeapons));
        }

        const savedElementalWeapons = localStorage.getItem('weaponRogueElementalWeapons');
        if (savedElementalWeapons) {
            this.usedElementalWeapons = new Set(JSON.parse(savedElementalWeapons));
        }
    }
}

// 创建全局成就系统实例
window.CompleteAchievementSystem = new CompleteAchievementSystem();

// 在游戏开始时加载成就数据
window.addEventListener('load', () => {
    setTimeout(() => {
        window.CompleteAchievementSystem.loadAllData();
    }, 1000);
});

// 在窗口关闭前保存成就数据
window.addEventListener('beforeunload', () => {
    if (typeof window.CompleteAchievementSystem !== 'undefined') {
        window.CompleteAchievementSystem.saveAllData();
    }
});

console.log("完整成就系统已初始化，包含 " +
    window.CompleteAchievementSystem.achievementDefinitions.length +
    " 个成就");