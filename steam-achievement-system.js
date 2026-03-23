// ==================== Steam版增强成就系统 ====================
//
// 为Steam发布目标扩展成就系统
// 添加超过20个成就以满足Steam发布要求
// 包含与新增功能相关的成就

class SteamEnhancedAchievementSystem {
    constructor() {
        // 初始化成就状态
        this.achievements = {}; // 动态存储成就解锁状态

        // 定义完整成就列表（超过20个成就）
        this.achievementList = [
            // 游戏进度相关
            { id: 'first_blood', name: '初出茅庐', description: '获得你的第一滴血', condition: 'kills >= 1' },
            { id: 'blood_thirsty', name: '嗜血狂魔', description: '击杀10个敌人', condition: 'kills >= 10' },
            { id: 'killing_spree', name: '杀戮 spree', description: '击杀50个敌人', condition: 'kills >= 50' },
            { id: 'monster_hunter', name: '怪物猎人', description: '击杀100个敌人', condition: 'kills >= 100' },
            { id: 'first_level', name: '勇往直前', description: '达到第5关', condition: 'level >= 5' },
            { id: 'explorer', name: '探索者', description: '达到第10关', condition: 'level >= 10' },
            { id: 'conqueror', name: '征服者', description: '达到第20关', condition: 'level >= 20' },
            { id: 'master', name: '大师', description: '达到第30关', condition: 'level >= 30' },
            { id: 'legend', name: '传说', description: '达到第50关', condition: 'level >= 50' },

            // 战斗相关
            { id: 'combo_king', name: '连击之王', description: '达成10连击', condition: 'maxCombo >= 10' },
            { id: 'combo_master', name: '连击大师', description: '达成20连击', condition: 'maxCombo >= 20' },
            { id: 'high_scoring', name: '高分达人', description: '单局得分1000', condition: 'score >= 1000' },
            { id: 'higher_scoring', name: '更高分王', description: '单局得分5000', condition: 'score >= 5000' },
            { id: 'top_scoring', name: '顶级得分', description: '单局得分10000', condition: 'score >= 10000' },
            { id: 'survivor', name: '生存专家', description: '达到第10关且生命值超过50', condition: 'level >= 10 && hp > 50' },
            { id: 'tough_skin', name: '钢铁之肤', description: '达到第20关且生命值超过30', condition: 'level >= 20 && hp > 30' },

            // 武器相关
            { id: 'weapon_collector', name: '武器收藏家', description: '使用过10种不同的武器', condition: 'uniqueWeapons >= 10' },
            { id: 'weapon_master', name: '武器大师', description: '使用过20种不同的武器', condition: 'uniqueWeapons >= 20' },
            { id: 'rare_finder', name: '稀有发现者', description: '获得史诗级武器', condition: 'hasEpicWeapon' },
            { id: 'legendary_hunter', name: '传说猎人', description: '获得传说级武器', condition: 'hasLegendaryWeapon' },
            { id: 'mythic_power', name: '神话之力', description: '获得神话级武器', condition: 'hasMythicWeapon' },
            { id: 'elemental_master', name: '元素大师', description: '使用过5种不同元素效果的武器', condition: 'usedElementalWeapons >= 5' },
            { id: 'weapon_mastery', name: '武器精通', description: '使用过30种不同的武器', condition: 'uniqueWeapons >= 30' },
            { id: 'legendary_victory', name: '传奇胜利', description: '使用传说级武器获胜', condition: 'wonWithLegendary' },

            // 特殊挑战
            { id: 'lucky_charm', name: '幸运护符', description: '使用幸运药水并击杀5个敌人', condition: 'luckyKills >= 5' },
            { id: 'phoenix_rise', name: '凤凰涅槃', description: '在濒死状态下使用生命药水', condition: 'reviveFromLowHp' },
            { id: 'guardian', name: '守护者', description: '获得3件不同的遗物', condition: 'relicsCollected >= 3' },
            { id: 'treasure_hoarder', name: '宝藏囤积者', description: '获得5件不同的遗物', condition: 'relicsCollected >= 5' },
            { id: 'speed_demon', name: '速度恶魔', description: '在15关内通关（使用加速药水）', condition: 'finishFast' },
            { id: 'berserker', name: '狂战士', description: '连续使用狂暴技能3次', condition: 'berserkStreak' },
            { id: 'skill_master', name: '技能大师', description: '成功使用所有4个技能各10次', condition: 'skillsUsed >= 40' },
            { id: 'elemental_wizard', name: '元素巫师', description: '使用元素效果击杀50个敌人', condition: 'elementalKills >= 50' },
            { id: 'survival_expert', name: '生存专家', description: '在第40关时生命值仍然大于70', condition: 'level >= 40 && hp > 70' },
            { id: 'combo_legend', name: '连击传说', description: '达成50连击', condition: 'maxCombo >= 50' },
            { id: 'weapon_connoisseur', name: '武器鉴赏家', description: '使用过50种不同的武器', condition: 'uniqueWeapons >= 50' },
            { id: 'relic_collector', name: '遗物收藏家', description: '收集全部7种遗物', condition: 'collectAllRelics' },

            // 新增Steam版特有成就
            { id: 'first_win', name: '首胜', description: '获得游戏首次胜利', condition: 'firstWin' },
            { id: 'double_trouble', name: '双重麻烦', description: '连续击杀两个精英敌人', condition: 'doubleEliteKill' },
            { id: 'damage_specialist', name: '伤害专家', description: '单次攻击造成超过100点伤害', condition: 'highDamageHit' },
            { id: 'smart_player', name: '聪明玩家', description: '连续3次避开精英敌人', condition: 'avoidElite' },
            { id: 'team_work', name: '团队合作', description: '使用支援型武器击杀10个敌人', condition: 'supportWeaponKills >= 10' },
            { id: 'combo_destroyer', name: '连击终结者', description: '单次打断敌人连击5次', condition: 'breakCombo >= 5' },
            { id: 'lucky_seven', name: '幸运7', description: '连续7次掉落稀有武器', condition: 'luckyDropStreak' },
            { id: 'pacifist', name: '和平主义者', description: '达到第25关但不攻击任何敌人', condition: 'reachLevelWithoutAttacking' },
            { id: 'time_traveler', name: '时光旅行者', description: '在5分钟内达到第10关', condition: 'fastLevel10' },
            { id: 'immortal', name: '不朽', description: '达到第30关且从未死亡', condition: 'noDeath30' },
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
            lastPotionTypes: [], // 最近使用的药水类型
            speedRunStartTime: 0, // 速通开始时间
            firstWinCompleted: false, // 是否完成首次胜利

            // 新增Steam版追踪项
            usedElementalWeapons: new Set(), // 使用过的元素武器类型
            elementalKills: 0, // 元素效果击杀数
            damageHits: [], // 伤害记录
            avoidedElites: 0, // 规避精英敌人数
            supportWeaponKills: 0, // 支援武器击杀数
            comboBreaks: 0, // 打断连击数
            luckyDropStreak: 0, // 幸运掉落连击
            maxLuckyDropStreak: 0, // 最大幸运掉落连击
            lastAttackedTime: 0, // 上次攻击时间
            totalTime: 0, // 总游戏时间
            deaths: 0, // 死亡次数
            reachedLevelWithoutAttacking: false, // 是否达到无攻击等级
            noDamageTime: 0, // 未受伤害时间
            currentAvoidTime: 0, // 当前规避时间
        };

        // 保存上次攻击时间用于某些成就追踪
        this.lastAttackedTime = Date.now();
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
            if (condition === 'uniqueWeapons >= 30') {
                return this.tempStats.uniqueWeaponsUsed.size >= 30;
            }
            if (condition === 'uniqueWeapons >= 50') {
                return this.tempStats.uniqueWeaponsUsed.size >= 50;
            }
            if (condition === 'luckyKills >= 5') {
                return this.tempStats.luckyKillCount >= 5;
            }
            if (condition === 'usedElementalWeapons >= 5') {
                return this.tempStats.usedElementalWeapons.size >= 5;
            }
            if (condition === 'elementalKills >= 50') {
                return this.tempStats.elementalKills >= 50;
            }
            if (condition === 'supportWeaponKills >= 10') {
                return this.tempStats.supportWeaponKills >= 10;
            }
            if (condition === 'breakCombo >= 5') {
                return this.tempStats.comboBreaks >= 5;
            }
            if (condition === 'luckyDropStreak') {
                return this.tempStats.maxLuckyDropStreak >= 7;
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
            if (condition === 'firstWin') {
                return this.tempStats.firstWinCompleted;
            }
            if (condition === 'doubleEliteKill') {
                // 这个需要特别处理，看lastEliteKillTime等变量
                // 暂时返回false，需要游戏系统支持
                return false;
            }
            if (condition === 'highDamageHit') {
                return this.tempStats.damageHits.some(hit => hit > 100);
            }
            if (condition === 'avoidElite') {
                return this.tempStats.avoidedElites >= 3;
            }
            if (condition === 'reachLevelWithoutAttacking') {
                return this.tempStats.reachedLevelWithoutAttacking;
            }
            if (condition === 'fastLevel10') {
                // 这个需要记录时间，暂时返回false
                return false;
            }
            if (condition === 'noDeath30') {
                return context.level >= 30 && this.tempStats.deaths === 0;
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
            name: achievement.name,
            description: achievement.description
        };

        console.log(`🏆 成就解锁: ${achievement.name}`);
        if (typeof showCombatLog !== 'undefined') {
            showCombatLog(`🏆 成就解锁: ${achievement.name}`, 'achievement-unlock');
        }

        // 通知音效系统播放成就解锁音效
        if (typeof enhancedAudioManager !== 'undefined') {
            enhancedAudioManager.playSound('achievement_unlock', 0.8);
        }

        // 保存成就状态
        if (typeof enhancedSaveManager !== 'undefined') {
            enhancedSaveManager.save();
        } else if (typeof saveManager !== 'undefined') {
            saveManager.save();
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

                // 检查元素武器
                if (weapon.effect) {
                    this.tempStats.usedElementalWeapons.add(weapon.effect);
                }
            }
            this.checkAchievements();
        }
    }

    // 当玩家使用幸运药水并击杀敌人时调用
    onLuckyKill() {
        this.tempStats.luckyKillCount++;
        this.checkAchievements();
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

    // 当玩家使用不同类型技能时调用
    onSpecificSkillUsed(skillKey) {
        if (this.tempStats.skillsUsedByType[skillKey] !== undefined) {
            this.tempStats.skillsUsedByType[skillKey]++;
            this.tempStats.skillsUsed++; // 同时增加总技能使用数
        }
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

    // 当使用元素武器击杀敌人时调用
    onElementalKill() {
        this.tempStats.elementalKills++;
        this.checkAchievements();
    }

    // 当使用支援型武器击杀敌人时调用
    onSupportWeaponKill() {
        this.tempStats.supportWeaponKills++;
        this.checkAchievements();
    }

    // 当打断敌人连击时调用
    onComboBreak() {
        this.tempStats.comboBreaks++;
        this.checkAchievements();
    }

    // 记录高伤害攻击
    onHighDamageHit(damage) {
        this.tempStats.damageHits.push(damage);
        // 保持最近100次伤害记录
        if (this.tempStats.damageHits.length > 100) {
            this.tempStats.damageHits.shift();
        }
        this.checkAchievements();
    }

    // 规避精英敌人
    onEliteAvoid() {
        this.tempStats.avoidedElites++;
        this.checkAchievements();
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

    // 追踪无攻击时间
    onAttack() {
        this.tempStats.reachedLevelWithoutAttacking = false; // 一旦攻击就重置无攻击标记
        this.lastAttackedTime = Date.now();
    }

    // 追踪关卡进展（用于无攻击成就）
    onLevelProgress() {
        // 检查是否达到某个关卡且长时间未攻击
        if (gameState.level >= 25 && (Date.now() - this.lastAttackedTime) > 300000) { // 5分钟
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
        this.checkAchievements();
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
        };
    }

    // 追踪Boss击败
    onBossDefeat() {
        // 更新Boss相关成就追踪
        const now = Date.now();
        if (now - this.tempStats.lastBossKillTime < 10000) { // 10秒内击败另一个Boss
            this.tempStats.bossKillStreak++;
        } else {
            this.tempStats.bossKillStreak = 1;
        }
        this.tempStats.lastBossKillTime = now;
    }

    // 追踪传说武器击杀
    onLegendaryWeaponKill() {
        this.tempStats.legendaryWeaponKills++;
    }
}

// 导出Steam版增强成就系统实例
const steamEnhancedAchievementSystem = new SteamEnhancedAchievementSystem();

// 如果之前有成就系统，将其替换为新的系统
if (typeof enhancedAchievementSystem !== 'undefined') {
    // 尝试迁移旧的成就数据
    if (enhancedAchievementSystem.achievements) {
        steamEnhancedAchievementSystem.achievements = enhancedAchievementSystem.achievements;
    }
}