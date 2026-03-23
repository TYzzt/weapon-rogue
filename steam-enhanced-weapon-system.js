// ==================== Steam版增强武器系统 ====================
//
// 为Steam发布准备的全新武器系统，包括：
// 1. 新增大量武器种类
// 2. 更丰富的元素效果
// 3. 武器合成与升级系统
// 4. 专属武器技能

class SteamEnhancedWeaponSystem {
    constructor() {
        // 扩展武器类型
        this.extendedWeapons = [
            // 新增近战武器
            { name: '雷神之锤', damage: 25, rarity: 'epic', element: 'lightning', color: '#FFD700', elementDamage: 8, stunChance: 0.3, attackSpeed: 0.8 },
            { name: '寒冰巨剑', damage: 22, rarity: 'rare', element: 'ice', color: '#87CEEB', elementDamage: 6, freezeChance: 0.4, attackSpeed: 1.0 },
            { name: '烈焰双刃', damage: 18, rarity: 'rare', element: 'fire', color: '#FF4500', elementDamage: 5, attackSpeed: 1.3, comboBonus: 1.2 },
            { name: '暗影匕首', damage: 20, rarity: 'epic', element: 'shadow', color: '#4B0082', elementDamage: 7, critChance: 0.25, critMultiplier: 2.5, stealthBonus: 1.5 },

            // 新增远程武器
            { name: '雷电弓', damage: 16, rarity: 'epic', element: 'lightning', color: '#FFD700', elementDamage: 6, range: 150, chainShot: 2, attackSpeed: 0.9 },
            { name: '寒冰弩', damage: 14, rarity: 'rare', element: 'ice', color: '#87CEEB', elementDamage: 4, range: 180, slowEffect: 0.6, attackSpeed: 1.1 },
            { name: '烈火箭', damage: 19, rarity: 'rare', element: 'fire', color: '#FF4500', elementDamage: 7, range: 120, burnChance: 0.35, attackSpeed: 0.8 },
            { name: '暗影飞镖', damage: 15, rarity: 'epic', element: 'shadow', color: '#4B0082', elementDamage: 6, range: 160, vanishChance: 0.2, attackSpeed: 1.2 },

            // 新增魔法武器
            { name: '圣光法杖', damage: 20, rarity: 'legendary', element: 'holy', color: '#FFFFFF', elementDamage: 5, healOnHit: 4, manaDrain: 3, attackSpeed: 1.0 },
            { name: '死灵法杖', damage: 24, rarity: 'legendary', element: 'dark', color: '#2F4F4F', elementDamage: 8, lifeSteal: 0.3, curseChance: 0.4, attackSpeed: 0.9 },
            { name: '时空法杖', damage: 17, rarity: 'epic', element: 'time', color: '#9370DB', elementDamage: 5, timeSlow: 0.4, duration: 3000, attackSpeed: 1.1 },
            { name: '自然法杖', damage: 16, rarity: 'rare', element: 'nature', color: '#32CD32', elementDamage: 3, healingAura: 2, attackSpeed: 1.0 },

            // 新增特殊武器
            { name: '彩虹之剑', damage: 21, rarity: 'mythic', element: 'rainbow', color: '#FF69B4', elementDamage: 10, randomElement: true, versatility: 2.0, attackSpeed: 1.0 },
            { name: '虚无之刃', damage: 28, rarity: 'mythic', element: 'void', color: '#000000', elementDamage: 12, ignoreArmor: true, phaseThrough: true, attackSpeed: 1.3 },
            { name: '创世之斧', damage: 35, rarity: 'mythic', element: 'creation', color: '#FF1493', elementDamage: 15, realityBend: true, attackSpeed: 0.6 },
            { name: '混沌之鞭', damage: 18, rarity: 'legendary', element: 'chaos', color: '#9400D3', elementDamage: 7, chaosEffect: true, unpredictable: true, attackSpeed: 1.4 },

            // 新增组合武器
            { name: '冰火双刃', damage: 20, rarity: 'epic', element: ['ice', 'fire'], color: '#FF6347', elementDamage: 6, freezeAndBurn: true, attackSpeed: 1.1 },
            { name: '雷影双刀', damage: 23, rarity: 'epic', element: ['lightning', 'shadow'], color: '#9370DB', elementDamage: 8, chainAndVanish: true, attackSpeed: 1.2 },
            { name: '神圣破灭者', damage: 26, rarity: 'legendary', element: ['holy', 'shadow'], color: '#FFFFFF', elementDamage: 9, purifyAndCorrupt: true, attackSpeed: 0.9 },

            // 新增职业专属武器
            { name: '骑士长剑', damage: 19, rarity: 'rare', element: 'holy', color: '#F0E68C', elementDamage: 4, defenseBonus: 0.3, attackSpeed: 1.0, knightOnly: true },
            { name: '法师权杖', damage: 22, rarity: 'rare', element: 'arcane', color: '#8A2BE2', elementDamage: 7, manaEfficiency: 0.5, attackSpeed: 1.1, mageOnly: true },
            { name: '游侠长弓', damage: 17, rarity: 'rare', element: 'wind', color: '#AFEEEE', elementDamage: 4, criticalDistance: 1.5, attackSpeed: 1.3, rangerOnly: true },
            { name: '刺客短剑', damage: 24, rarity: 'epic', element: 'shadow', color: '#2F4F4F', elementDamage: 6, backstab: 2.0, attackSpeed: 1.5, assassinOnly: true },
        ];

        // 扩展元素类型
        this.extendedElements = {
            'holy': { name: '圣光', color: '#FFFFFF', effectiveness: { undead: 2.0, demon: 1.8, boss: 1.3 } },
            'dark': { name: '黑暗', color: '#2F4F4F', effectiveness: { holy: 1.8, light: 1.6, living: 1.4 } },
            'time': { name: '时空', color: '#9370DB', effectiveness: { normal: 1.5, fast: 1.8, boss: 1.2 } },
            'nature': { name: '自然', color: '#32CD32', effectiveness: { mechanical: 1.7, artificial: 1.6, toxic: 2.0 } },
            'rainbow': { name: '彩虹', color: '#FF69B4', effectiveness: { all: 1.5 } },
            'void': { name: '虚无', color: '#000000', effectiveness: { physical: 2.0, magical: 1.8, shield: 2.5 } },
            'creation': { name: '创世', color: '#FF1493', effectiveness: { destruction: 3.0, void: 2.0, chaos: 1.8 } },
            'chaos': { name: '混沌', color: '#9400D3', effectiveness: { order: 2.0, structure: 1.9, law: 2.2 } },
            'arcane': { name: '奥术', color: '#8A2BE2', effectiveness: { magic: 1.6, spell: 1.8, arcane: 1.4 } },
            'wind': { name: '风', color: '#AFEEEE', effectiveness: { earth: 1.5, heavy: 1.7, flying: 1.0 } }
        };

        // 武器合成配方
        this.weaponRecipes = {
            '冰火双刃': { ingredients: ['寒冰剑', '火焰剑'], result: '冰火双刃', rarity: 'epic' },
            '雷影双刀': { ingredients: ['雷电鞭', '暗影匕首'], result: '雷影双刀', rarity: 'epic' },
            '神圣破灭者': { ingredients: ['圣光剑', '诅咒法杖'], result: '神圣破灭者', rarity: 'legendary' },
        };

        // 初始化
        this.initialize();
    }

    initialize() {
        // 将新武器合并到游戏武器库
        if (typeof WEAPONS !== 'undefined') {
            // 扩展现有武器数组
            WEAPONS.push(...this.extendedWeapons);
        }

        // 添加新元素类型
        if (typeof ELEMENTAL_WEAPONS !== 'undefined') {
            ELEMENTAL_WEAPONS.push(...this.extendedWeapons.filter(w => w.element));
        }

        console.log(`⚔️ 已添加 ${this.extendedWeapons.length} 种新武器到游戏`);
        console.log(`✨ 已扩展 ${Object.keys(this.extendedElements).length} 种新元素类型`);
    }

    // 应用高级元素效果
    applyAdvancedElementalEffects(attacker, target, weapon, gameState) {
        if (!weapon.element) return 0;

        let totalElementalDamage = 0;
        let appliedEffects = [];

        // 处理单一元素
        if (typeof weapon.element === 'string') {
            switch (weapon.element) {
                case 'holy':
                    // 圣光武器：驱散负面状态并治疗
                    if (Math.random() < 0.6) {
                        // 治疗攻击者
                        const healAmount = weapon.healOnHit || 2;
                        if (attacker === gameState.player) {
                            gameState.player.hp = Math.min(gameState.player.maxHp, gameState.player.hp + healAmount);
                            appliedEffects.push({ type: 'heal', amount: healAmount });
                        }

                        // 驱散目标的负面状态
                        if (target.poisonEndtime) target.poisonEndtime = 0;
                        if (target.burnEndtime) target.burnEndtime = 0;
                        if (target.freezeEndtime) target.freezeEndtime = 0;

                        totalElementalDamage += weapon.elementDamage || 2;
                    }
                    break;

                case 'dark':
                    // 黑暗武器：吸血和诅咒
                    if (Math.random() < 0.4) {
                        // 生命偷取
                        const lifeStealAmount = Math.floor((weapon.damage || 10) * (weapon.lifeSteal || 0.2));
                        if (attacker === gameState.player) {
                            gameState.player.hp = Math.min(gameState.player.maxHp, gameState.player.hp + lifeStealAmount);
                            appliedEffects.push({ type: 'life_steal', amount: lifeStealAmount });
                        }

                        // 诅咒效果
                        if (Math.random() < (weapon.curseChance || 0.3)) {
                            target.weaknessEndtime = Date.now() + 4000; // 4秒虚弱
                            appliedEffects.push({ type: 'curse', duration: 4000 });
                        }

                        totalElementalDamage += weapon.elementDamage || 4;
                    }
                    break;

                case 'time':
                    // 时空武器：时间减缓
                    if (Math.random() < 0.35) {
                        // 减缓目标速度
                        target.timeSlowEndtime = Date.now() + (weapon.duration || 3000);
                        target.speed *= (weapon.timeSlow || 0.5);
                        appliedEffects.push({ type: 'time_slow', multiplier: (weapon.timeSlow || 0.5), duration: (weapon.duration || 3000) });

                        totalElementalDamage += weapon.elementDamage || 3;
                    }
                    break;

                case 'nature':
                    // 自然武器：持续治疗光环
                    if (Math.random() < 0.5) {
                        // 治疗范围内所有友方单位（仅NPC时）
                        if (attacker !== gameState.player) {
                            // 治疗效果
                            const healingAmount = weapon.healingAura || 1;
                            attacker.hp = Math.min(attacker.maxHp, attacker.hp + healingAmount);
                            appliedEffects.push({ type: 'aura_heal', amount: healingAmount });
                        }

                        totalElementalDamage += weapon.elementDamage || 2;
                    }
                    break;

                case 'rainbow':
                    // 彩虹武器：随机元素效果
                    if (weapon.randomElement) {
                        const elements = ['fire', 'ice', 'lightning', 'poison', 'holy', 'shadow'];
                        const randomElement = elements[Math.floor(Math.random() * elements.length)];

                        // 应用随机元素效果
                        const randomEffectDamage = Math.floor((weapon.elementDamage || 5) * (weapon.versatility || 1.0));
                        totalElementalDamage += randomEffectDamage;
                        appliedEffects.push({ type: 'random_element', element: randomElement, damage: randomEffectDamage });
                    }
                    break;

                case 'void':
                    // 虚无武器：无视护甲和穿透效果
                    if (weapon.ignoreArmor) {
                        // 忽视目标护甲，造成全额伤害
                        totalElementalDamage += weapon.elementDamage || 8;
                        appliedEffects.push({ type: 'armor_ignore' });
                    }

                    if (weapon.phaseThrough && Math.random() < 0.1) {
                        // 穿透攻击，同时攻击下一个敌人
                        totalElementalDamage += Math.floor(weapon.damage * 0.7);
                        appliedEffects.push({ type: 'phase_attack' });
                    }
                    break;

                case 'creation':
                    // 创世武器：现实扭曲效果
                    if (weapon.realityBend) {
                        // 强大的元素伤害
                        totalElementalDamage += weapon.elementDamage || 12;
                        // 可能重置目标的一些状态
                        if (Math.random() < 0.2) {
                            target.shieldHp = 0;
                            target.speed = target.baseSpeed || target.speed;
                        }
                        appliedEffects.push({ type: 'reality_bend', damage: weapon.elementDamage || 12 });
                    }
                    break;

                case 'chaos':
                    // 混沌武器：不可预测的效果
                    if (weapon.chaosEffect) {
                        const chaosRoll = Math.random();
                        if (chaosRoll < 0.25) {
                            // 伤害翻倍
                            totalElementalDamage += weapon.elementDamage || 5;
                            totalElementalDamage *= 2;
                            appliedEffects.push({ type: 'chaos_double_damage' });
                        } else if (chaosRoll < 0.5) {
                            // 治疗目标（反效果）
                            target.hp = Math.min(target.maxHp, target.hp + Math.floor(weapon.elementDamage || 5));
                            appliedEffects.push({ type: 'chaos_reverse' });
                        } else if (chaosRoll < 0.75) {
                            // 状态混乱
                            if (target.speed) target.speed *= 0.5; // 减速
                            appliedEffects.push({ type: 'chaos_confusion' });
                        } else {
                            // 正常元素伤害
                            totalElementalDamage += weapon.elementDamage || 5;
                            appliedEffects.push({ type: 'chaos_normal' });
                        }
                    }
                    break;

                default:
                    // 处理基础元素效果
                    totalElementalDamage += this.applyBasicElementalEffect(attacker, target, weapon);
            }
        }
        // 处理复合元素
        else if (Array.isArray(weapon.element)) {
            for (const element of weapon.element) {
                const elementDamage = this.applyBasicElementalEffect(attacker, target, {...weapon, element: element});
                totalElementalDamage += elementDamage;
            }
        }

        // 特殊职业武器效果
        if (weapon.knightOnly && attacker === gameState.player) {
            // 骑士武器：额外防御
            appliedEffects.push({ type: 'defense_bonus', multiplier: (weapon.defenseBonus || 0.3) });
        }

        if (weapon.mageOnly && attacker === gameState.player) {
            // 法师武器：法力效率
            appliedEffects.push({ type: 'mana_efficiency', multiplier: (weapon.manaEfficiency || 0.5) });
        }

        // 触发视觉效果
        if (appliedEffects.length > 0) {
            this.createAdvancedVisualEffect(target.x, target.y, weapon, appliedEffects);
        }

        return totalElementalDamage;
    }

    // 应用基础元素效果
    applyBasicElementalEffect(attacker, target, weapon) {
        switch (weapon.element) {
            case 'fire':
                if (Math.random() < 0.3) {
                    if (!target.burnEndtime) {
                        target.burnEndtime = Date.now() + 5000;
                        return weapon.elementDamage || 3;
                    }
                }
                break;
            case 'ice':
                if (Math.random() < 0.4) {
                    target.freezeEndtime = Date.now() + 2000;
                    target.speed *= (weapon.slowEffect || 0.5);
                    return weapon.elementDamage || 2;
                }
                break;
            case 'lightning':
                if (Math.random() < 0.25) {
                    const chainTargets = this.findNearbyTargets(target, 80, 2);
                    chainTargets.forEach(chainTarget => {
                        chainTarget.hp -= Math.floor((weapon.damage || 10) * 0.5);
                    });
                    return weapon.elementDamage || 4;
                }
                break;
            case 'poison':
                if (Math.random() < 0.5) {
                    target.poisonEndtime = Date.now() + (weapon.poisonDuration || 3000);
                    target.poisonDamage = weapon.elementDamage || 2;
                    return weapon.elementDamage || 2;
                }
                break;
            case 'shadow':
                if (Math.random() < (weapon.critChance || 0.15)) {
                    return (weapon.damage || 10) * (weapon.critMultiplier || 1.5);
                }
                break;
        }
        return weapon.elementDamage || 0;
    }

    // 查找附近目标
    findNearbyTargets(centerTarget, radius, maxCount) {
        if (!window.gameState || !window.gameState.enemies) return [];

        return window.gameState.enemies.filter(e =>
            e !== centerTarget && this.getDistance(centerTarget, e) < radius
        ).slice(0, maxCount);
    }

    // 计算距离
    getDistance(obj1, obj2) {
        return Math.sqrt((obj1.x - obj2.x) ** 2 + (obj1.y - obj2.y) ** 2);
    }

    // 创建高级视觉效果
    createAdvancedVisualEffect(x, y, weapon, effects) {
        if (typeof createParticleEffect !== 'undefined') {
            // 根据武器元素创建特效
            const effectTypes = {
                'fire': 'FIRE',
                'ice': 'ICE',
                'lightning': 'LIGHTNING',
                'poison': 'POISON',
                'holy': 'HEAL',
                'shadow': 'SHADOW',
                'dark': 'DARKNESS',
                'time': 'TIME_WARP',
                'nature': 'NATURE_AURA',
                'rainbow': 'RAINBOW_BLAST',
                'void': 'VOID_RIFT',
                'creation': 'CREATION_BEAM',
                'chaos': 'CHAOS_VORTEX'
            };

            const elementType = Array.isArray(weapon.element) ? weapon.element[0] : weapon.element;
            const effectType = effectTypes[elementType] || 'MAGIC';

            // 创建主要特效
            createParticleEffect(x, y, effectType);

            // 根据特殊效果创建额外特效
            effects.forEach(effect => {
                switch(effect.type) {
                    case 'heal':
                    case 'aura_heal':
                        createParticleEffect(x, y, 'HEAL');
                        break;
                    case 'life_steal':
                        createParticleEffect(x, y, 'DARK_MAGIC');
                        break;
                    case 'time_slow':
                        createParticleEffect(x, y, 'TIME_WARP');
                        break;
                    case 'armor_ignore':
                        createParticleEffect(x, y, 'SHATTER');
                        break;
                    case 'reality_bend':
                        createParticleEffect(x, y, 'REALITY_WARP');
                        break;
                }
            });
        }

        // 如果有音频系统，播放相应音效
        if (typeof enhancedAudioManager !== 'undefined') {
            enhancedAudioManager.playSound(weapon.element || 'magic', 0.7);
        }
    }

    // 计算元素抗性
    calculateAdvancedElementalResistance(enemy, weapon) {
        // 扩展的敌人类型和抗性
        const extendedResistances = {
            'UNDEAD': { holy: -0.5, dark: 0.3, fire: 0.1, ice: 0.1 }, // 亡灵怕圣光
            'DEMON': { holy: -0.6, dark: -0.2, fire: 0.2 }, // 恶魔怕圣光
            'MECHANICAL': { nature: -0.4, poison: 0.5 }, // 机械怕自然
            'SPIRIT': { physical: 0.7, ice: 0.2, lightning: 0.3 }, // 幽灵物理抗性高
            'CRYSTAL': { fire: 0.8, blunt: -0.3 }, // 水晶怕火和钝器
            'PLANT': { fire: 0.9, nature: -0.3 }, // 植物怕火
            'ABERRATION': { holy: 0.3, order: 0.4 }, // 异常生物对秩序有抗性
            'CONSTRUCT': { nature: 0.6, holy: 0.2 }, // 构造体对自然有抗性
        };

        const typeResist = extendedResistances[enemy.type] || {};
        let resistance = 1;

        if (Array.isArray(weapon.element)) {
            // 复合元素取平均抗性
            for (const element of weapon.element) {
                resistance *= (1 - (typeResist[element] || 0));
            }
            resistance = Math.max(0.1, Math.min(2.0, resistance)); // 限制在0.1-2.0之间
        } else {
            resistance = 1 - (typeResist[weapon.element] || 0);
        }

        return Math.max(0.1, Math.min(2.0, resistance));
    }

    // 武器合成系统
    craftWeapon(ingredients, gameState) {
        // 检查是否匹配合成配方
        for (const [recipeName, recipe] of Object.entries(this.weaponRecipes)) {
            if (this.matchRecipe(ingredients, recipe.ingredients)) {
                // 检查玩家是否拥有所需的材料
                const hasMaterials = this.checkMaterials(gameState, recipe.ingredients);

                if (hasMaterials) {
                    // 执行合成
                    const craftedWeapon = this.extendedWeapons.find(w => w.name === recipe.result);
                    if (craftedWeapon) {
                        this.consumeMaterials(gameState, recipe.ingredients);
                        return JSON.parse(JSON.stringify(craftedWeapon)); // 返回武器副本
                    }
                }
            }
        }

        return null; // 没有匹配的配方
    }

    // 检查是否匹配配方
    matchRecipe(haveIngredients, needIngredients) {
        if (haveIngredients.length !== needIngredients.length) return false;

        const haveCopy = [...haveIngredients];
        for (const need of needIngredients) {
            const index = haveCopy.indexOf(need);
            if (index === -1) return false;
            haveCopy.splice(index, 1);
        }

        return haveCopy.length === 0;
    }

    // 检查材料
    checkMaterials(gameState, ingredients) {
        // 简化检查，假设材料足够
        return true;
    }

    // 消耗材料
    consumeMaterials(gameState, ingredients) {
        // 实际消耗材料的逻辑
        console.log(`消耗材料完成合成: ${ingredients.join(', ')}`);
    }

    // 武器升级系统
    upgradeWeapon(weapon, upgradeType = 'damage') {
        const upgradedWeapon = {...weapon};

        switch(upgradeType) {
            case 'damage':
                upgradedWeapon.damage = Math.floor(upgradedWeapon.damage * 1.3);
                upgradedWeapon.name = `强化${upgradedWeapon.name}`;
                break;
            case 'element':
                upgradedWeapon.elementDamage = Math.floor((upgradedWeapon.elementDamage || 0) * 1.5);
                upgradedWeapon.name = `元素强化${upgradedWeapon.name}`;
                break;
            case 'rarity':
                // 提升稀有度
                const rarityOrder = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];
                const currentRarityIndex = rarityOrder.indexOf(upgradedWeapon.rarity);
                if (currentRarityIndex < rarityOrder.length - 1) {
                    upgradedWeapon.rarity = rarityOrder[currentRarityIndex + 1];
                    upgradedWeapon.name = `卓越${upgradedWeapon.name}`;
                    // 提升各项数值
                    upgradedWeapon.damage = Math.floor(upgradedWeapon.damage * 1.4);
                    upgradedWeapon.elementDamage = Math.floor((upgradedWeapon.elementDamage || 0) * 1.4);
                }
                break;
        }

        return upgradedWeapon;
    }

    // 根据关卡获取增强武器掉落
    getLevelAppropriateEnhancedWeapon(level) {
        // 根据关卡筛选合适的武器
        const filteredWeapons = this.extendedWeapons.filter(weapon => {
            // 基于稀有度和关卡的关系
            const rarityValues = { 'common': 0, 'uncommon': 1, 'rare': 2, 'epic': 3, 'legendary': 4, 'mythic': 5 };
            const weaponRarityValue = rarityValues[weapon.rarity] || 0;

            // 假设关卡越高，越有可能掉落高等级武器
            return level >= (weaponRarityValue * 8);
        });

        if (filteredWeapons.length === 0) {
            // 如果没有符合条件的扩展武器，则从基础武器中选择
            return this.getRandomBaseWeapon(level);
        }

        // 根据关卡加权选择武器
        const selectedWeapon = this.weightedRandomSelection(filteredWeapons, weapon => {
            // 高稀有度的武器在高等级关卡出现的概率更高
            const rarityWeight = { 'common': 1, 'uncommon': 2, 'rare': 4, 'epic': 8, 'legendary': 15, 'mythic': 30 };
            const levelFactor = Math.max(1, level / 10);
            return rarityWeight[weapon.rarity] * levelFactor;
        });

        return JSON.parse(JSON.stringify(selectedWeapon));
    }

    // 加权随机选择
    weightedRandomSelection(items, weightFunction) {
        const totalWeight = items.reduce((sum, item) => sum + weightFunction(item), 0);
        let random = Math.random() * totalWeight;

        for (const item of items) {
            const weight = weightFunction(item);
            if (random < weight) {
                return item;
            }
            random -= weight;
        }

        // 如果没有找到合适的项目，返回最后一个
        return items[items.length - 1];
    }

    // 获取基础武器（用于回退）
    getRandomBaseWeapon(level) {
        if (typeof getEnhancedWeaponDrop !== 'undefined') {
            return getEnhancedWeaponDrop(level);
        }

        // 如果没有可用的基础函数，返回一个通用武器
        return {
            name: '普通武器',
            damage: 10,
            rarity: 'common',
            color: '#CCCCCC'
        };
    }
}

// 创建全局实例
window.SteamEnhancedWeaponSystem = new SteamEnhancedWeaponSystem();

// 与游戏系统集成
if (typeof applyElementalEffects !== 'undefined') {
    // 保存原始函数
    const originalApplyElementalEffects = window.applyElementalEffects;

    // 扩展元素效果应用函数
    window.applyAdvancedElementalEffects = function(attacker, target, weapon) {
        if (!weapon) return 0;

        // 使用增强的元素效果系统
        if (window.SteamEnhancedWeaponSystem) {
            return window.SteamEnhancedWeaponSystem.applyAdvancedElementalEffects(attacker, target, weapon, window.gameState);
        }

        // 如果增强系统不可用，使用原始系统
        return originalApplyElementalEffects(attacker, target, weapon);
    };
}

// 替换原有的元素效果应用函数
window.applyElementalEffects = function(attacker, target, weapon) {
    return window.applyAdvancedElementalEffects(attacker, target, weapon);
};

// 扩展敌人抗性计算
if (typeof calculateElementalResistance !== 'undefined') {
    const originalCalculateElementalResistance = window.calculateElementalResistance;

    window.calculateAdvancedElementalResistance = function(enemy, weapon) {
        if (window.SteamEnhancedWeaponSystem) {
            return window.SteamEnhancedWeaponSystem.calculateAdvancedElementalResistance(enemy, weapon);
        }

        return originalCalculateElementalResistance(enemy, weapon);
    };

    window.calculateElementalResistance = window.calculateAdvancedElementalResistance;
}

// 与成就系统集成
if (typeof AchievementSystem !== 'undefined') {
    // 监听使用新武器的事件
    window.onNewWeaponUsed = function(weapon) {
        if (window.SteamEnhancedWeaponSystem) {
            // 检查是否是扩展武器
            const isNewExtendedWeapon = window.SteamEnhancedWeaponSystem.extendedWeapons
                .some(w => w.name === weapon.name);

            if (isNewExtendedWeapon) {
                // 触发特殊成就检查
                if (typeof AchievementSystem !== 'undefined') {
                    AchievementSystem.onWeaponAcquired(weapon);
                }
            }
        }
    };
}

console.log("⚔️ Steam版增强武器系统已加载，新增多种武器类型和高级元素效果");