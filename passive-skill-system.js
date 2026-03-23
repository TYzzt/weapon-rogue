// ==================== 被动技能系统 ====================
//
// 本文件实现被动技能系统，为玩家提供额外的能力和游戏机制
// 1. 提供多种被动技能供玩家选择
// 2. 允许玩家组合不同的被动技能
// 3. 与现有游戏机制无缝集成

class PassiveSkillSystem {
    constructor() {
        // 定义被动技能列表
        this.passiveSkills = {
            // 生存类技能
            'health_regeneration': {
                id: 'health_regeneration',
                name: '生命再生',
                description: '每10秒恢复5%最大生命值',
                category: 'survival',
                effect: 'health_regen',
                tier: 1
            },
            'damage_reduction': {
                id: 'damage_reduction',
                name: '伤害减免',
                description: '受到的伤害减少15%',
                category: 'survival',
                effect: 'damage_reduce_15',
                tier: 2
            },
            'critical_chance': {
                id: 'critical_chance',
                name: '致命一击',
                description: '增加10%暴击率，暴击伤害+50%',
                category: 'combat',
                effect: 'crit_chance_10',
                tier: 2
            },
            'life_steal': {
                id: 'life_steal',
                name: '生命偷取',
                description: '造成伤害的8%转化为生命值',
                category: 'survival',
                effect: 'lifesteal_8',
                tier: 2
            },
            'max_health_boost': {
                id: 'max_health_boost',
                name: '生命强化',
                description: '最大生命值增加30%',
                category: 'survival',
                effect: 'max_hp_30',
                tier: 1
            },

            // 战斗类技能
            'damage_boost': {
                id: 'damage_boost',
                name: '伤害增幅',
                description: '武器伤害增加20%',
                category: 'combat',
                effect: 'damage_20',
                tier: 1
            },
            'attack_speed': {
                id: 'attack_speed',
                name: '攻击加速',
                description: '攻击频率增加25%',
                category: 'combat',
                effect: 'attack_speed_25',
                tier: 2
            },
            'elemental_mastery': {
                id: 'elemental_mastery',
                name: '元素掌握',
                description: '元素效果持续时间延长50%',
                category: 'combat',
                effect: 'element_duration_50',
                tier: 2
            },
            'combo_extender': {
                id: 'combo_extender',
                name: '连击延长',
                description: '连击计数衰减速度减慢50%',
                category: 'combat',
                effect: 'combo_decay_50',
                tier: 2
            },
            'weapon_mastery': {
                id: 'weapon_mastery',
                name: '武器精通',
                description: '当前武器伤害增加35%',
                category: 'combat',
                effect: 'current_weapon_damage_35',
                tier: 3
            },

            // 探索类技能
            'xp_bonus': {
                id: 'xp_bonus',
                name: '经验加成',
                description: '获得的经验值增加25%',
                category: 'exploration',
                effect: 'xp_bonus_25',
                tier: 1
            },
            'loot_rarity': {
                id: 'loot_rarity',
                name: '稀有度提升',
                description: '敌人掉落物品的稀有度提升一级',
                category: 'exploration',
                effect: 'loot_rarity_up',
                tier: 3
            },
            'movement_speed': {
                id: 'movement_speed',
                name: '疾步如飞',
                description: '移动速度增加20%',
                category: 'exploration',
                effect: 'move_speed_20',
                tier: 1
            },
            'enemy_weakness': {
                id: 'enemy_weakness',
                name: '弱点感知',
                description: '对敌人造成的伤害增加15%',
                category: 'exploration',
                effect: 'enemy_damage_15',
                tier: 1
            },
            'resource_efficiency': {
                id: 'resource_efficiency',
                name: '资源效率',
                description: '消耗品效果提升30%',
                category: 'exploration',
                effect: 'consumable_effect_30',
                tier: 2
            }
        };

        // 玩家当前激活的被动技能
        this.activePassiveSkills = new Set();

        // 技能冷却和状态跟踪
        this.skillTimers = {};

        // 初始化被动技能系统
        this.initializePassiveSkillSystem();
    }

    // 初始化被动技能系统
    initializePassiveSkillSystem() {
        // 初始化玩家技能状态
        if (typeof gameState !== 'undefined') {
            if (!gameState.player.passiveSkills) {
                gameState.player.passiveSkills = new Set();
            }
            if (!gameState.player.availableSkillPoints) {
                gameState.player.availableSkillPoints = 0;
            }
        }

        // 应用被动技能效果
        this.applyActiveSkills();

        console.log("🎯 被动技能系统已初始化");
    }

    // 获取所有被动技能
    getAllPassiveSkills() {
        return {...this.passiveSkills};
    }

    // 获取玩家当前激活的被动技能
    getActiveSkills() {
        return Array.from(this.activePassiveSkills);
    }

    // 激活一个被动技能
    activateSkill(skillId) {
        if (!this.passiveSkills[skillId]) {
            console.error(`无效的技能ID: ${skillId}`);
            return false;
        }

        if (this.activePassiveSkills.has(skillId)) {
            console.log(`技能已激活: ${this.passiveSkills[skillId].name}`);
            return true;
        }

        // 检查是否已有同类型高级技能
        if (this.hasHigherTierSkill(skillId)) {
            console.log(`已拥有更高级技能，无法激活: ${this.passiveSkills[skillId].name}`);
            return false;
        }

        this.activePassiveSkills.add(skillId);

        // 应用技能效果
        this.applySkillEffect(skillId);

        console.log(`✅ 激活被动技能: ${this.passiveSkills[skillId].name}`);

        // 通知UI更新
        if (typeof updateSkillUI !== 'undefined') {
            updateSkillUI();
        }

        return true;
    }

    // 检查是否已有同类型高级技能
    hasHigherTierSkill(skillId) {
        const skill = this.passiveSkills[skillId];
        if (!skill) return false;

        // 检查同分类下是否有更高级的技能
        for (const [id, s] of Object.entries(this.passiveSkills)) {
            if (s.category === skill.category && s.tier > skill.tier && this.activePassiveSkills.has(id)) {
                return true;
            }
        }
        return false;
    }

    // 停用一个被动技能
    deactivateSkill(skillId) {
        if (this.activePassiveSkills.has(skillId)) {
            this.activePassiveSkills.delete(skillId);

            // 移除技能效果
            this.removeSkillEffect(skillId);

            console.log(`🚫 停用被动技能: ${this.passiveSkills[skillId].name}`);
            return true;
        }
        return false;
    }

    // 应用单个技能效果
    applySkillEffect(skillId) {
        if (!this.passiveSkills[skillId]) return;

        const skill = this.passiveSkills[skillId];

        // 根据技能效果类型应用不同的修改
        switch (skill.effect) {
            case 'health_regen':
                this.enableHealthRegeneration();
                break;
            case 'damage_reduce_15':
                this.modifyDamageReduction(0.15);
                break;
            case 'crit_chance_10':
                this.modifyCriticalChance(0.10, 1.5);
                break;
            case 'lifesteal_8':
                this.enableLifeSteal(0.08);
                break;
            case 'max_hp_30':
                this.modifyMaxHealth(1.3);
                break;
            case 'damage_20':
                this.modifyDamageMultiplier(1.2);
                break;
            case 'attack_speed_25':
                this.modifyAttackSpeed(1.25);
                break;
            case 'element_duration_50':
                this.modifyElementDuration(1.5);
                break;
            case 'combo_decay_50':
                this.modifyComboDecay(0.5);
                break;
            case 'current_weapon_damage_35':
                this.modifyCurrentWeaponDamage(1.35);
                break;
            case 'xp_bonus_25':
                this.modifyXPBonus(1.25);
                break;
            case 'loot_rarity_up':
                this.enableLootRarityBoost();
                break;
            case 'move_speed_20':
                this.modifyMoveSpeed(1.2);
                break;
            case 'enemy_damage_15':
                this.modifyEnemyDamage(1.15);
                break;
            case 'consumable_effect_30':
                this.modifyConsumableEffect(1.3);
                break;
        }
    }

    // 移除技能效果
    removeSkillEffect(skillId) {
        if (!this.passiveSkills[skillId]) return;

        const skill = this.passiveSkills[skillId];

        // 这里我们可以添加移除技能效果的逻辑
        // 对于某些持续性效果，我们需要反向应用更改
        switch (skill.effect) {
            case 'max_hp_30':
                // 这里需要恢复原来的生命值
                if (gameState && gameState.player) {
                    gameState.player.maxHp = Math.floor(gameState.player.maxHp / 1.3);
                    gameState.player.hp = Math.min(gameState.player.hp, gameState.player.maxHp);
                }
                break;
            // 可以根据需要添加其他效果的移除逻辑
        }
    }

    // 启用生命再生
    enableHealthRegeneration() {
        if (!this.skillTimers.healthRegen) {
            this.skillTimers.healthRegen = setInterval(() => {
                if (gameState && gameState.player && gameState.player.hp > 0) {
                    const healAmount = Math.floor(gameState.player.maxHp * 0.05); // 恢复5%最大生命
                    gameState.player.hp = Math.min(gameState.player.maxHp, gameState.player.hp + healAmount);

                    if (typeof showCombatLog !== 'undefined') {
                        showCombatLog(`💚 生命再生: +${healAmount} HP`, 'heal');
                    }
                }
            }, 10000); // 每10秒触发一次
        }
    }

    // 修改伤害减免
    modifyDamageReduction(reduction) {
        if (gameState && gameState.player) {
            if (!gameState.player.damageReduction) {
                gameState.player.damageReduction = 0;
            }
            gameState.player.damageReduction += reduction;
        }
    }

    // 修改暴击率和暴击伤害
    modifyCriticalChance(critChance, critDamage) {
        if (gameState && gameState.player) {
            if (!gameState.player.criticalChance) {
                gameState.player.criticalChance = 0;
            }
            if (!gameState.player.criticalDamage) {
                gameState.player.criticalDamage = 2.0; // 默认2倍
            }
            gameState.player.criticalChance += critChance;
            gameState.player.criticalDamage = Math.max(gameState.player.criticalDamage, critDamage);
        }
    }

    // 启用生命偷取
    enableLifeSteal(lifestealRatio) {
        if (gameState && gameState.player) {
            gameState.player.lifeStealRatio = lifestealRatio;
        }
    }

    // 修改最大生命值
    modifyMaxHealth(multiplier) {
        if (gameState && gameState.player) {
            gameState.player.maxHp = Math.floor(gameState.player.maxHp * multiplier);
            // 如果当前生命值低于最大生命值，补满
            gameState.player.hp = Math.min(gameState.player.hp, gameState.player.maxHp);
        }
    }

    // 修改伤害乘数
    modifyDamageMultiplier(multiplier) {
        if (gameState && gameState.player) {
            if (!gameState.player.damageMultiplier) {
                gameState.player.damageMultiplier = 1.0;
            }
            gameState.player.damageMultiplier *= multiplier;
        }
    }

    // 修改攻击速度
    modifyAttackSpeed(multiplier) {
        // 这个可能需要修改现有的攻击逻辑，这里只是设置标记
        if (gameState && gameState.player) {
            if (!gameState.player.attackSpeedMultiplier) {
                gameState.player.attackSpeedMultiplier = 1.0;
            }
            gameState.player.attackSpeedMultiplier *= multiplier;
        }
    }

    // 修改元素效果持续时间
    modifyElementDuration(multiplier) {
        if (window.coreGameplayEnhancements) {
            // 遍历所有元素效果，增加持续时间
            for (const [key, effect] of Object.entries(window.coreGameplayEnhancements.weaponElements)) {
                effect.duration = Math.floor(effect.duration * multiplier);
            }
        }
    }

    // 修改连击衰减速度
    modifyComboDecay(rate) {
        if (gameState && gameState.player) {
            if (!gameState.player.comboDecayRate) {
                gameState.player.comboDecayRate = 1.0;
            }
            gameState.player.comboDecayRate *= rate; // rate < 1 表示衰减减慢
        }
    }

    // 修改当前武器伤害
    modifyCurrentWeaponDamage(multiplier) {
        if (gameState && gameState.player && gameState.player.weapon) {
            if (!gameState.player.currentWeaponDamageBuff) {
                gameState.player.currentWeaponDamageBuff = 1.0;
            }
            gameState.player.currentWeaponDamageBuff *= multiplier;
        }
    }

    // 修改经验值奖励
    modifyXPBonus(multiplier) {
        if (gameState) {
            if (!gameState.xpMultiplier) {
                gameState.xpMultiplier = 1.0;
            }
            gameState.xpMultiplier *= multiplier;
        }
    }

    // 启用稀有度提升
    enableLootRarityBoost() {
        if (gameState) {
            gameState.lootRarityBoost = true;
        }
    }

    // 修改移动速度
    modifyMoveSpeed(multiplier) {
        if (gameState && gameState.player) {
            gameState.player.speed = gameState.player.speed * multiplier;
        }
    }

    // 修改对敌人伤害
    modifyEnemyDamage(multiplier) {
        if (gameState && gameState.player) {
            if (!gameState.player.enemyDamageMultiplier) {
                gameState.player.enemyDamageMultiplier = 1.0;
            }
            gameState.player.enemyDamageMultiplier *= multiplier;
        }
    }

    // 修改消耗品效果
    modifyConsumableEffect(multiplier) {
        if (gameState) {
            if (!gameState.consumableEffectMultiplier) {
                gameState.consumableEffectMultiplier = 1.0;
            }
            gameState.consumableEffectMultiplier *= multiplier;
        }
    }

    // 应用所有激活的技能效果
    applyActiveSkills() {
        for (const skillId of this.activePassiveSkills) {
            this.applySkillEffect(skillId);
        }
    }

    // 获取指定分类的技能
    getSkillsByCategory(category) {
        const skills = [];
        for (const [id, skill] of Object.entries(this.passiveSkills)) {
            if (skill.category === category) {
                skills.push({...skill, id});
            }
        }
        return skills;
    }

    // 获取技能树推荐
    getSkillRecommendations(currentLevel) {
        // 根据当前游戏进度推荐合适的技能
        const recommendations = [];

        if (currentLevel < 10) {
            // 早期推荐生存类技能
            recommendations.push('max_health_boost');
            recommendations.push('health_regeneration');
            recommendations.push('damage_reduction');
        } else if (currentLevel < 25) {
            // 中期推荐平衡的战斗和生存技能
            recommendations.push('damage_boost');
            recommendations.push('life_steal');
            recommendations.push('critical_chance');
        } else {
            // 后期推荐高级技能
            recommendations.push('weapon_mastery');
            recommendations.push('elemental_mastery');
            recommendations.push('combo_extender');
        }

        return recommendations.map(id => this.passiveSkills[id]);
    }

    // 重置所有技能（通常在游戏重新开始时）
    resetSkills() {
        // 清除定时器
        for (const timerId in this.skillTimers) {
            clearInterval(this.skillTimers[timerId]);
            clearTimeout(this.skillTimers[timerId]);
        }

        this.skillTimers = {};
        this.activePassiveSkills.clear();

        // 重置玩家属性到基础状态
        if (gameState && gameState.player) {
            gameState.player.passiveSkills = new Set();
            gameState.player.availableSkillPoints = 0;

            // 恢复基础属性
            gameState.player.damageReduction = 0;
            gameState.player.criticalChance = 0;
            gameState.player.criticalDamage = 2.0;
            gameState.player.lifeStealRatio = 0;
            gameState.player.damageMultiplier = 1.0;
            gameState.player.attackSpeedMultiplier = 1.0;
            gameState.player.comboDecayRate = 1.0;
            gameState.player.currentWeaponDamageBuff = 1.0;
            gameState.player.enemyDamageMultiplier = 1.0;
        }

        if (gameState) {
            gameState.xpMultiplier = 1.0;
            gameState.lootRarityBoost = false;
            gameState.consumableEffectMultiplier = 1.0;
        }

        console.log("🔄 被动技能已重置");
    }

    // 保存技能状态
    saveSkills() {
        const saveData = {
            activeSkills: Array.from(this.activePassiveSkills),
            availableSkillPoints: gameState?.player?.availableSkillPoints || 0
        };

        return saveData;
    }

    // 加载技能状态
    loadSkills(savedData) {
        if (savedData && savedData.activeSkills) {
            this.resetSkills();

            for (const skillId of savedData.activeSkills) {
                this.activateSkill(skillId);
            }

            if (gameState && gameState.player) {
                gameState.player.availableSkillPoints = savedData.availableSkillPoints || 0;
            }
        }
    }
}

// 创建被动技能系统实例
const passiveSkillSystem = new PassiveSkillSystem();

// 与游戏逻辑集成
function integratePassiveSkills() {
    // 集成到伤害计算中
    if (typeof window.CoreGameplayEnhancements !== 'undefined') {
        const originalDamageCalc = window.CoreGameplayEnhancements.prototype.calculateEnhancedDamage;

        window.CoreGameplayEnhancements.prototype.calculateEnhancedDamage = function(weapon, target) {
            let damage = originalDamageCalc.call(this, weapon, target);

            // 应用玩家的伤害乘数
            if (gameState?.player?.damageMultiplier) {
                damage *= gameState.player.damageMultiplier;
            }

            // 应用当前武器伤害加成
            if (gameState?.player?.currentWeaponDamageBuff &&
                gameState.player.weapon?.name === weapon.name) {
                damage *= gameState.player.currentWeaponDamageBuff;
            }

            // 应用对敌人伤害加成
            if (gameState?.player?.enemyDamageMultiplier) {
                damage *= gameState.player.enemyDamageMultiplier;
            }

            return Math.floor(damage);
        };
    }

    // 集成到受伤计算中
    function applyDamageReduction(originalDamage) {
        let damage = originalDamage;

        if (gameState?.player?.damageReduction) {
            damage = Math.floor(damage * (1 - gameState.player.damageReduction));
        }

        // 确保至少受到1点伤害
        return Math.max(1, damage);
    }

    // 集成暴击系统
    function calculateCriticalHit(baseDamage) {
        if (gameState?.player?.criticalChance && Math.random() < gameState.player.criticalChance) {
            const critDamage = Math.floor(baseDamage * gameState.player.criticalDamage);
            if (typeof showCombatLog !== 'undefined') {
                showCombatLog(`💥 暴击! ${critDamage} 伤害`, 'critical-hit');
            }
            return critDamage;
        }
        return baseDamage;
    }

    // 应用生命偷取
    function applyLifeSteal(damageDealt) {
        if (gameState?.player?.lifeStealRatio) {
            const lifeStealAmount = Math.floor(damageDealt * gameState.player.lifeStealRatio);
            if (lifeStealAmount > 0) {
                gameState.player.hp = Math.min(gameState.player.maxHp, gameState.player.hp + lifeStealAmount);
                if (typeof showCombatLog !== 'undefined') {
                    showCombatLog(`吸取生命: +${lifeStealAmount} HP`, 'lifesteal');
                }
            }
        }
    }

    // 保存和加载集成
    if (window.comprehensiveSaveSystem) {
        const originalGetSaveData = window.comprehensiveSaveSystem.getCompleteSaveData;
        const originalLoad = window.comprehensiveSaveSystem.load;

        window.comprehensiveSaveSystem.getCompleteSaveData = function() {
            const saveData = originalGetSaveData.call(this);
            saveData.passiveSkills = passiveSkillSystem.saveSkills();
            return saveData;
        };

        // 重写load方法以集成技能加载
        const tempLoad = window.comprehensiveSaveSystem.load;
        window.comprehensiveSaveSystem.load = function() {
            const result = tempLoad.call(this);
            if (arguments[0] && arguments[0].passiveSkills) {
                passiveSkillSystem.loadSkills(arguments[0].passiveSkills);
            }
            return result;
        };
    }

    console.log("🔗 被动技能系统已集成到游戏逻辑");
}

// 在页面加载完成后集成技能系统
document.addEventListener('DOMContentLoaded', integratePassiveSkills);

// 导出被动技能系统
window.PassiveSkillSystem = PassiveSkillSystem;
window.passiveSkillSystem = passiveSkillSystem;

console.log("🌟 被动技能系统已加载并准备就绪");