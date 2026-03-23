// ==================== 增强版成就系统 ====================

class EnhancedAchievementSystem {
    constructor() {
        // 初始化成就状态
        this.achievements = {}; // 动态存储成就解锁状态

        // 定义成就列表
        this.achievementList = [
            // 游戏进度相关
            { id: 'first_blood', name: () => t('achFirstBlood'), description: () => t('achFirstBloodDesc'), condition: 'kills >= 1' },
            { id: 'blood_thirsty', name: () => t('achBloodThirsty'), description: () => t('achBloodThirstyDesc'), condition: 'kills >= 10' },
            { id: 'killing_spree', name: () => t('achKillingSpree'), description: () => t('achKillingSpreeDesc'), condition: 'kills >= 50' },
            { id: 'monster_hunter', name: () => t('achMonsterHunter'), description: () => t('achMonsterHunterDesc'), condition: 'kills >= 100' },
            { id: 'first_level', name: () => t('achFirstLevel'), description: () => t('achFirstLevelDesc'), condition: 'level >= 5' },
            { id: 'explorer', name: () => t('achExplorer'), description: () => t('achExplorerDesc'), condition: 'level >= 10' },
            { id: 'conqueror', name: () => t('achConqueror'), description: () => t('achConquerorDesc'), condition: 'level >= 20' },
            { id: 'master', name: () => t('achMaster'), description: () => t('achMasterDesc'), condition: 'level >= 30' },
            { id: 'legend', name: () => t('achLegend'), description: () => t('achLegendDesc'), condition: 'level >= 50' },

            // 战斗相关
            { id: 'combo_king', name: () => t('achComboKing'), description: () => t('achComboKingDesc'), condition: 'maxCombo >= 10' },
            { id: 'combo_master', name: () => t('achComboMaster'), description: () => t('achComboMasterDesc'), condition: 'maxCombo >= 20' },
            { id: 'high_scoring', name: () => t('achHighScoring'), description: () => t('achHighScoringDesc'), condition: 'score >= 1000' },
            { id: 'higher_scoring', name: () => t('achHigherScoring'), description: () => t('achHigherScoringDesc'), condition: 'score >= 5000' },
            { id: 'top_scoring', name: () => t('achTopScoring'), description: () => t('achTopScoringDesc'), condition: 'score >= 10000' },
            { id: 'survivor', name: () => t('achSurvivor'), description: () => t('achSurvivorDesc'), condition: 'level >= 10 && hp > 50' },
            { id: 'tough_skin', name: () => t('achToughSkin'), description: () => t('achToughSkinDesc'), condition: 'level >= 20 && hp > 30' },

            // 武器相关
            { id: 'weapon_collector', name: '武器收藏家', description: '使用过10种不同的武器', condition: 'uniqueWeapons >= 10' },
            { id: 'weapon_master', name: '武器大师', description: '使用过20种不同的武器', condition: 'uniqueWeapons >= 20' },
            { id: 'rare_finder', name: '稀有发现者', description: '获得史诗级武器', condition: 'hasEpicWeapon' },
            { id: 'legendary_hunter', name: '传说猎人', description: '获得传说级武器', condition: 'hasLegendaryWeapon' },
            { id: 'mythic_power', name: '神话之力', description: '获得神话级武器', condition: 'hasMythicWeapon' },

            // 特殊挑战
            { id: 'lucky_charm', name: '幸运护符', description: '使用幸运药水并击杀5个敌人', condition: 'luckyKills >= 5' },
            { id: 'phoenix_rise', name: '凤凰涅槃', description: '在濒死状态下使用生命药水', condition: 'reviveFromLowHp' },
            { id: 'guardian', name: '守护者', description: '获得3件不同的遗物', condition: 'relicsCollected >= 3' },
            { id: 'treasure_hoarder', name: '宝藏囤积者', description: '获得5件不同的遗物', condition: 'relicsCollected >= 5' },
            { id: 'speed_demon', name: '速度恶魔', description: '在15关内通关（使用加速药水）', condition: 'finishFast' },
            { id: 'berserker', name: '狂战士', description: '连续使用狂暴技能3次', condition: 'berserkStreak' },
            { id: 'skill_master', name: '技能大师', description: '成功使用所有4个技能各10次', condition: 'skillsUsed >= 40' },

            // 新增成就 (扩展)
            { id: 'survival_expert', name: '生存专家', description: '在第40关时生命值仍然大于70', condition: 'level >= 40 && hp > 70' },
            { id: 'combo_legend', name: '连击传说', description: '达成50连击', condition: 'maxCombo >= 50' },
            { id: 'weapon_connoisseur', name: '武器鉴赏家', description: '使用过50种不同的武器', condition: 'uniqueWeapons >= 50' },
            { id: 'relic_collector', name: '遗物收藏家', description: '收集全部7种遗物', condition: 'collectAllRelics' },
        ];

        // 临时状态变量，用于跟踪复杂的成就条件
        this.tempStats = {
            uniqueWeaponsUsed: new Set(), // 追踪使用的不同武器
            luckyKillCount: 0, // 幸运转杀计数
            lowHpReviveCount: 0, // 濒死复活计数
            relicsCollected: 0, // 收集的遗物数量
            skillsUsed: 0, // 使用技能的总数
            usedPotionTypes: new Set(), // 使用过的药水类型
            berserkStreak: 0, // 狂暴连击数
            lastBerserkTime: 0, // 上次使用狂暴的时间
            consecutiveLuckyKills: 0, // 连续幸运击杀
            lastLuckyKillTime: 0, // 上次幸运击杀时间
            bossKillStreak: 0, // Boss击杀连击
            lastBossKillTime: 0, // 上次击杀Boss的时间
            legendaryWeaponKills: 0, // 传说武器击杀数
            lastWeaponChangeTime: 0, // 上次更换武器的时间
            skillsUsedByType: { Q: 0, W: 0, E: 0, R: 0 }, // 各类型技能使用次数
            lastPotionTypes: [], // 最近使用的药水类型（用于追踪连续使用）
            speedRunStartTime: 0, // 速通开始时间
            firstWinCompleted: false, // 是否完成首次胜利
        };
    }

    // 检查成就条件并解锁成就
    checkAchievements() {
        const newAchievements = [];

        for (const achievement of this.achievementList) {
            if (!this.achievements[achievement.id]) {
                // 检查成就条件是否满足
                if (this.evaluateCondition(achievement.condition)) {
                    this.unlock(achievement);
                    newAchievements.push(achievement);
                }
            }
        }

        return newAchievements;
    }

    // 评估成就条件
    evaluateCondition(condition) {
        try {
            // 创建一个上下文对象，用于评估条件
            const context = {
                kills: gameState.kills || 0,
                level: gameState.level || 1,
                hp: gameState.player?.hp || 100,
                maxCombo: gameState.player?.maxCombo || 0,
                score: gameState.player?.score || 0,
                weapon: gameState.player?.weapon || null,
                relics: gameState.relics || []
            };

            // 简单替换实现，支持基本比较
            if (condition === 'kills >= 1') return context.kills >= 1;
            if (condition === 'kills >= 10') return context.kills >= 10;
            if (condition === 'kills >= 50') return context.kills >= 50;
            if (condition === 'kills >= 100') return context.kills >= 100;
            if (condition === 'level >= 5') return context.level >= 5;
            if (condition === 'level >= 10') return context.level >= 10;
            if (condition === 'level >= 20') return context.level >= 20;
            if (condition === 'level >= 30') return context.level >= 30;
            if (condition === 'level >= 50') return context.level >= 50;
            if (condition === 'maxCombo >= 10') return context.maxCombo >= 10;
            if (condition === 'maxCombo >= 20') return context.maxCombo >= 20;
            if (condition === 'score >= 1000') return context.score >= 1000;
            if (condition === 'score >= 5000') return context.score >= 5000;
            if (condition === 'score >= 10000') return context.score >= 10000;
            if (condition === 'level >= 10 && hp > 50') return context.level >= 10 && context.hp > 50;
            if (condition === 'level >= 20 && hp > 30') return context.level >= 20 && context.hp > 30;

            // 检查是否有史诗武器
            if (condition === 'hasEpicWeapon' && context.weapon) {
                return context.weapon.rarity === 'epic';
            }

            // 检查是否有传说武器
            if (condition === 'hasLegendaryWeapon' && context.weapon) {
                return context.weapon.rarity === 'legendary';
            }

            // 检查是否有神话武器
            if (condition === 'hasMythicWeapon' && context.weapon) {
                return context.weapon.rarity === 'mythic';
            }

            // 检查拥有的遗物数量
            if (condition === 'relicsCollected >= 3') {
                return context.relics && context.relics.length >= 3;
            }
            if (condition === 'relicsCollected >= 5') {
                return context.relics && context.relics.length >= 5;
            }

            // 检查复杂条件
            if (condition === 'uniqueWeapons >= 10') {
                return this.tempStats.uniqueWeaponsUsed.size >= 10;
            }
            if (condition === 'uniqueWeapons >= 20') {
                return this.tempStats.uniqueWeaponsUsed.size >= 20;
            }
            if (condition === 'uniqueWeapons >= 50') {
                return this.tempStats.uniqueWeaponsUsed.size >= 50;
            }
            if (condition === 'luckyKills >= 5') {
                return this.tempStats.luckyKillCount >= 5;
            }

            // 新增成就条件
            if (condition === 'level >= 40 && hp > 70') {
                return context.level >= 40 && context.hp > 70;
            }
            if (condition === 'maxCombo >= 50') {
                return context.maxCombo >= 50;
            }
            if (condition === 'collectAllRelics') {
                return context.relics && context.relics.length >= 7; // 假设有7种不同的遗物
            }

            return false;
        } catch (e) {
            console.error('评估成就条件时出错:', e);
            return false;
        }
    }

    // 解锁成就
    unlock(achievement) {
        this.achievements[achievement.id] = {
            unlocked: true,
            timestamp: Date.now(),
            name: typeof achievement.name === 'function' ? achievement.name() : achievement.name,
            description: typeof achievement.description === 'function' ? achievement.description() : achievement.description
        };

        console.log(`成就解锁: ${typeof achievement.name === 'function' ? achievement.name() : achievement.name}`);
        if (typeof showCombatLog !== 'undefined') {
            showCombatLog(`🏆 成就解锁: ${typeof achievement.name === 'function' ? achievement.name() : achievement.name}`, 'weapon-get');
        }

        // 保存成就状态
        if (typeof SaveSystem !== 'undefined') {
            SaveSystem.save();
        }
    }

    // 获取已解锁成就的数量
    getUnlockedCount() {
        return Object.keys(this.achievements).filter(id => this.achievements[id].unlocked).length;
    }

    // 获取总成就数量
    getTotalCount() {
        return this.achievementList.length;
    }

    // 当玩家获得新武器时调用
    onWeaponAcquired(weapon) {
        if (weapon) {
            // 记录使用的不同武器（避免重复）
            if (weapon.name) {
                this.tempStats.uniqueWeaponsUsed.add(weapon.name);
            }
            this.checkAchievements();
        }
    }

    // 当玩家使用幸运药水并击杀敌人时调用
    onLuckyKill() {
        this.tempStats.luckyKillCount++;
        this.checkAchievements();
    }

    // 当玩家使用生命药水脱离危险状态时调用
    onPhoenixRise() {
        this.tempStats.lowHpReviveCount++;
        this.checkAchievements();
    }

    // 当玩家获得遗物时调用
    onRelicAcquired() {
        this.tempStats.relicsCollected++;
        this.checkAchievements();
    }

    // 当玩家使用技能时调用
    onSkillUsed() {
        this.tempStats.skillsUsed++;
        this.checkAchievements();
    }

    // 当玩家使用药水时调用
    onPotionUsed(potion) {
        // 记录使用的不同药水类型（避免重复）
        if (potion.name) {
            this.tempStats.usedPotionTypes.add(potion.name);
        }
        this.checkAchievements();
    }

    // 当玩家使用不同类型技能时调用
    onSpecificSkillUsed(skillKey) {
        if (this.tempStats.skillsUsedByType[skillKey] !== undefined) {
            this.tempStats.skillsUsedByType[skillKey]++;
            this.tempStats.skillsUsed++; // 同时增加总技能使用数
        }
        this.checkAchievements();
    }

    // 当游戏开始时调用（用于追踪速通成就）
    onGameStart() {
        this.tempStats.speedRunStartTime = Date.now();
        this.checkAchievements();
    }

    // 当游戏通关时调用
    onGameWin() {
        this.tempStats.firstWinCompleted = true;
        // 检查速通成就
        const timeElapsed = (Date.now() - this.tempStats.speedRunStartTime) / 60000; // 转换为分钟
        if (timeElapsed <= 30) {
            // 这里可以设置速通相关的标志
        }
        this.checkAchievements();
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

            // 新增追踪项
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
            speedRunComplete: false,
            elementalAdept: false,
        };
    }
}

// 导出增强版成就系统实例
const enhancedAchievementSystem = new EnhancedAchievementSystem();