// 武器替换者 - 核心机制重构与平衡优化
// 该文件实现关键的游戏平衡性改进，以提升玩家体验和游戏可玩性

// 添加新的武器类型和元素系统
const ELEMENTAL_WEAPONS = [
    // 火系武器
    { name: '火焰剑', damage: 15, rarity: 'uncommon', element: 'fire', color: '#FF4500', elementDamage: 3 },
    { name: '烈焰法杖', damage: 12, rarity: 'rare', element: 'fire', color: '#FF6347', elementDamage: 5 },
    { name: '熔岩锤', damage: 18, rarity: 'rare', element: 'fire', color: '#B22222', elementDamage: 4 },

    // 冰系武器
    { name: '寒冰剑', damage: 14, rarity: 'uncommon', element: 'ice', color: '#87CEEB', elementDamage: 2, slowEffect: 0.5 },
    { name: '霜冻法杖', damage: 11, rarity: 'rare', element: 'ice', color: '#E0F6FF', elementDamage: 4, slowEffect: 0.7 },
    { name: '冰晶匕首', damage: 13, rarity: 'uncommon', element: 'ice', color: '#AFEEEE', elementDamage: 3, slowEffect: 0.6 },

    // 雷系武器
    { name: '雷电鞭', damage: 16, rarity: 'rare', element: 'lightning', color: '#FFD700', elementDamage: 4, chainEffect: 2 },
    { name: '闪电剑', damage: 17, rarity: 'epic', element: 'lightning', color: '#9370DB', elementDamage: 5, chainEffect: 1 },

    // 毒系武器
    { name: '毒刺鞭', damage: 12, rarity: 'uncommon', element: 'poison', color: '#32CD32', elementDamage: 2, poisonDuration: 3000 },
    { name: '剧毒匕首', damage: 10, rarity: 'rare', element: 'poison', color: '#228B22', elementDamage: 3, poisonDuration: 5000 },

    // 圣光武器
    { name: '圣光剑', damage: 13, rarity: 'rare', element: 'holy', color: '#FFFAF0', elementDamage: 2, healOnHit: 2 },
    { name: '神圣权杖', damage: 15, rarity: 'epic', element: 'holy', color: '#FFFACD', elementDamage: 4, healOnHit: 3 },

    // 暗影武器
    { name: '暗影匕首', damage: 18, rarity: 'epic', element: 'shadow', color: '#4B0082', elementDamage: 5, critChance: 0.2, critMultiplier: 2.0 },
    { name: '诅咒法杖', damage: 14, rarity: 'rare', element: 'shadow', color: '#2F4F4F', elementDamage: 6, dotDamage: 2 },
];

// 新增武器获取记录，用于成就系统
if (!window.WeaponCollection) {
    window.WeaponCollection = {
        collected: new Set(),
        getUniqueCount: function() {
            return this.collected.size;
        },
        add: function(weapon) {
            this.collected.add(weapon.name);
        }
    };
}

// 增强武器系统 - 添加元素效果
function applyElementalEffects(attacker, target, weapon) {
    if (!weapon.element) return 0;

    switch (weapon.element) {
        case 'fire':
            // 火系武器：造成燃烧伤害
            if (target.burnEndtime) return 0; // 已经燃烧的目标不再重复点燃

            if (Math.random() < 0.3) { // 30% 概率触发燃烧
                target.burnEndtime = Date.now() + 5000; // 燃烧持续5秒
                createParticleEffect(target.x, target.y, PARTICLE_EFFECTS.FIRE);
                return weapon.elementDamage;
            }
            break;

        case 'ice':
            // 冰系武器：减速效果
            if (Math.random() < 0.4) { // 40% 概率触发减速
                target.freezeEndtime = Date.now() + 2000; // 冰冻持续2秒
                target.speed *= weapon.slowEffect || 0.5; // 降低移动速度
                createParticleEffect(target.x, target.y, PARTICLE_EFFECTS.ICE);
            }
            break;

        case 'lightning':
            // 雷系武器：连锁攻击
            if (Math.random() < 0.25) { // 25% 概率触发连锁
                // 寻找附近其他敌人进行连锁攻击
                const chainTargets = gameState.enemies.filter(e =>
                    e !== target && getDistance(target, e) < 80
                ).slice(0, weapon.chainEffect || 1);

                chainTargets.forEach(chainTarget => {
                    chainTarget.hp -= Math.floor(weapon.damage * 0.5);
                    createParticleEffect(chainTarget.x, chainTarget.y, PARTICLE_EFFECTS.LIGHTNING);
                });
            }
            return weapon.elementDamage;

        case 'poison':
            // 毒系武器：中毒效果
            if (Math.random() < 0.5) { // 50% 概率触发中毒
                target.poisonEndtime = Date.now() + (weapon.poisonDuration || 3000);
                target.poisonDamage = weapon.elementDamage;
                createParticleEffect(target.x, target.y, PARTICLE_EFFECTS.POISON);
            }
            break;

        case 'holy':
            // 圣光武器：治疗效果
            if (Math.random() < 0.6) { // 60% 概率治疗
                const healAmount = weapon.healOnHit || 1;
                gameState.player.hp = Math.min(gameState.player.maxHp, gameState.player.hp + healAmount);
                createParticleEffect(attacker.x, attacker.y, PARTICLE_EFFECTS.HEAL);
            }
            return weapon.elementDamage;

        case 'shadow':
            // 暗影武器：暴击效果
            if (Math.random() < (weapon.critChance || 0.15)) { // 15% 概率暴击
                return weapon.damage * (weapon.critMultiplier || 1.5);
            }
            break;
    }

    return weapon.elementDamage || 0;
}

// 更新敌人受伤处理，加入元素抗性
function calculateElementalResistance(enemy, weapon) {
    // 根据敌人类型给予不同元素抗性
    const resistances = {
        'MELEE': { fire: 0.1, ice: -0.1, lightning: 0.2 },
        'RANGED': { fire: 0.05, ice: 0.15, lightning: -0.1 },
        'ELITE': { fire: 0.1, ice: 0.1, lightning: 0.1, poison: -0.2 }, // 精英敌人对毒有抗性
        'BOSS': { fire: 0.3, ice: 0.3, lightning: 0.3, poison: 0.2, shadow: 0.2, holy: 0.2 }, // Boss有全抗性
        'DRAGON': { fire: 0.8, ice: -0.5 }, // 火龙对火免疫但怕冰
        'GOLEM': { poison: 0.8 }, // 石像鬼对毒完全抗性
        'UNDEAD': { holy: -0.4, shadow: 0.4 } // 亡灵怕圣光但暗影伤害翻倍
    };

    const typeResist = resistances[enemy.type] || {};
    return 1 - (typeResist[weapon.element] || 0);
}

// 增强攻击效果函数
function enhancedAttackWithElements(enemy, damage, weapon) {
    if (!weapon) {
        enhancedAttackEffect(enemy.x, enemy.y, damage, null);
        return;
    }

    // 应用元素效果
    const elementalDamage = applyElementalEffects(gameState.player, enemy, weapon);
    const resistance = calculateElementalResistance(enemy, weapon);
    const totalDamage = damage + Math.floor(elementalDamage * resistance);

    enemy.hp -= totalDamage;

    // 不同元素类型的视觉效果
    let effectColor = weapon.color;
    switch (weapon.element) {
        case 'fire': effectColor = '#FF4500'; break;
        case 'ice': effectColor = '#87CEEB'; break;
        case 'lightning': effectColor = '#FFD700'; break;
        case 'poison': effectColor = '#32CD32'; break;
        case 'holy': effectColor = '#FFFFFF'; break;
        case 'shadow': effectColor = '#4B0082'; break;
    }

    enhancedAttackEffect(enemy.x, enemy.y, totalDamage, { ...weapon, color: effectColor });

    // 元素特定的声效
    if (weapon.element) {
        AudioManager.playSound(weapon.element);
    }
}

// 改进武器掉落算法，增加稀有度和元素武器的掉落逻辑
function getEnhancedWeaponDrop(level) {
    // 根据关卡计算各种武器的掉落权重
    const commonWeight = Math.max(20, 60 - (level * 0.8));
    const uncommonWeight = 15 + Math.min(25, level * 0.4);
    const rareWeight = 5 + Math.min(15, level * 0.3);
    const epicWeight = 1 + Math.min(8, level * 0.15);
    const legendaryWeight = 0.5 + Math.min(4, level * 0.08);
    const mythicWeight = 0.2 + Math.min(2, level * 0.03);

    // 计算总权重
    const totalWeight = commonWeight + uncommonWeight + rareWeight + epicWeight + legendaryWeight + mythicWeight;
    const rand = Math.random() * totalWeight;

    let cumulativeWeight = 0;

    // 普通武器池
    cumulativeWeight += commonWeight;
    if (rand < cumulativeWeight) {
        // 普通武器中混入基础元素武器
        if (Math.random() < 0.1 && level > 5) { // 10% 概率掉落基础元素武器，需要等级 > 5
            const elementWeapons = ELEMENTAL_WEAPONS.filter(w => w.rarity === 'common' || w.rarity === 'uncommon');
            return elementWeapons[Math.floor(Math.random() * elementWeapons.length)];
        }

        const commonWeapons = WEAPONS.filter(w => w.rarity === 'common');
        return { ...commonWeapons[Math.floor(Math.random() * commonWeapons.length)] };
    }

    // 不常见武器池
    cumulativeWeight += uncommonWeight;
    if (rand < cumulativeWeight) {
        // 不常见武器中混入元素武器
        if (Math.random() < 0.2 && level > 8) { // 20% 概率掉落元素武器，需要等级 > 8
            const elementWeapons = ELEMENTAL_WEAPONS.filter(w => w.rarity === 'uncommon');
            if (elementWeapons.length > 0) {
                return elementWeapons[Math.floor(Math.random() * elementWeapons.length)];
            }
        }

        const uncommonWeapons = WEAPONS.filter(w => w.rarity === 'uncommon');
        return { ...uncommonWeapons[Math.floor(Math.random() * uncommonWeapons.length)] };
    }

    // 稀有武器池
    cumulativeWeight += rareWeight;
    if (rand < cumulativeWeight) {
        // 稀有武器中混入高级元素武器
        if (Math.random() < 0.3 && level > 12) { // 30% 概率掉落高级元素武器
            const elementWeapons = ELEMENTAL_WEAPONS.filter(w => w.rarity === 'rare');
            if (elementWeapons.length > 0) {
                return elementWeapons[Math.floor(Math.random() * elementWeapons.length)];
            }
        }

        const rareWeapons = WEAPONS.filter(w => w.rarity === 'rare');
        return { ...rareWeapons[Math.floor(Math.random() * rareWeapons.length)] };
    }

    // 史诗武器池
    cumulativeWeight += epicWeight;
    if (rand < cumulativeWeight) {
        // 史诗武器中混入史诗元素武器
        if (Math.random() < 0.4 && level > 15) { // 40% 概率掉落史诗元素武器
            const elementWeapons = ELEMENTAL_WEAPONS.filter(w => w.rarity === 'epic');
            if (elementWeapons.length > 0) {
                return elementWeapons[Math.floor(Math.random() * elementWeapons.length)];
            }
        }

        const epicWeapons = WEAPONS.filter(w => w.rarity === 'epic');
        return { ...epicWeapons[Math.floor(Math.random() * epicWeapons.length)] };
    }

    // 传说武器池
    cumulativeWeight += legendaryWeight;
    if (rand < cumulativeWeight) {
        // 传说武器中混入传说元素武器
        if (Math.random() < 0.5 && level > 20) { // 50% 概率掉落传说元素武器
            const elementWeapons = ELEMENTAL_WEAPONS.filter(w => w.rarity === 'legendary');
            if (elementWeapons.length > 0) {
                return elementWeapons[Math.floor(Math.random() * elementWeapons.length)];
            }
        }

        const legendaryWeapons = WEAPONS.filter(w => w.rarity === 'legendary');
        return { ...legendaryWeapons[Math.floor(Math.random() * legendaryWeapons.length)] };
    }

    // 神话武器池
    // 100% 返回神话武器（如果到达这里）
    const mythicWeapons = WEAPONS.filter(w => w.rarity === 'mythic');
    if (mythicWeapons.length > 0) {
        return { ...mythicWeapons[Math.floor(Math.random() * mythicWeapons.length)] };
    }

    // 如果没有神话武器，则返回最高稀有度的非神话武器
    const allWeapons = [...WEAPONS, ...ELEMENTAL_WEAPONS];
    const mythicOrLegendary = allWeapons.filter(w => w.rarity === 'legendary' || w.rarity === 'mythic');
    if (mythicOrLegendary.length > 0) {
        return { ...mythicOrLegendary[Math.floor(Math.random() * mythicOrLegendary.length)] };
    }

    // 作为备选，返回任意武器
    return { ...allWeapons[Math.floor(Math.random() * allWeapons.length)] };
}

// 更新敌人生命值增长曲线，使其更平衡
function getBalancedEnemyHP(level, enemyConfig) {
    // 优化的生命值增长公式：前期缓慢增长，中期加速，后期平稳
    // 这使得游戏初期更容易上手，中期有挑战性，后期不至于过于困难

    let baseHp;
    if (level <= 10) {
        // 前10级，增长较慢，让玩家熟悉游戏
        baseHp = 10 + level * 1.8;
    } else if (level <= 30) {
        // 11-30级，增长加速
        baseHp = 28 + (level - 10) * 2.5 + Math.pow(level - 10, 1.2) * 0.5;
    } else {
        // 30级以上，增长放缓，但仍有挑战性
        baseHp = 78 + (level - 30) * 1.8 + Math.log(level - 29) * 10;
    }

    return Math.floor(baseHp * enemyConfig.hp);
}

// 更新敌人伤害增长曲线
function getBalancedEnemyDamage(level, enemyConfig) {
    // 优化的伤害增长公式，与生命值类似，但增长略快一些
    let baseDamage;
    if (level <= 10) {
        // 前10级，伤害增长较慢
        baseDamage = 2.0 + level * 0.4;
    } else if (level <= 30) {
        // 11-30级，伤害增长适中
        baseDamage = 6 + (level - 10) * 0.5 + Math.pow(level - 10, 1.1) * 0.2;
    } else {
        // 30级以上，增长放缓但仍保持挑战性
        baseDamage = 16 + (level - 30) * 0.35 + Math.log(level - 29) * 2;
    }

    return Math.floor(baseDamage * enemyConfig.damage);
}

// 改进的升级所需击杀数计算，使其更加平衡
function getKillGoalForLevel(level) {
    if (level <= 5) {
        // 前5级快速升级，帮助玩家建立信心
        return Math.min(30, 4 + Math.floor(level * 1.5));
    } else if (level <= 15) {
        // 5-15级，稳步增长
        return Math.min(30, 10 + Math.floor(level * 1.2) + Math.floor(level / 5) * 2);
    } else if (level <= 30) {
        // 15-30级，增长加速
        return Math.min(40, 15 + Math.floor(level * 1.3) + Math.floor(level / 4) * 3);
    } else {
        // 30级以上，增长更为显著
        return Math.min(50, 20 + Math.floor(level * 1.4) + Math.floor(level / 3) * 2);
    }
}

// 添加武器连击系统
class WeaponComboSystem {
    constructor() {
        this.currentCombo = 0;
        this.lastWeaponUsed = null;
        this.comboStartTime = 0;
        this.maxComboTime = 5000; // 5秒内必须击杀下一个敌人才能保持连击
    }

    // 检查是否为同一把武器的连续使用
    isSameWeapon(weapon) {
        if (!this.lastWeaponUsed) return false;
        return this.lastWeaponUsed.name === weapon.name;
    }

    // 更新连击状态
    updateCombo(weapon, enemyKilled) {
        const now = Date.now();

        // 检查是否超时
        if (now - this.comboStartTime > this.maxComboTime) {
            this.resetCombo();
        }

        if (enemyKilled) {
            if (this.isSameWeapon(weapon)) {
                // 使用相同武器击杀敌人，增加连击
                this.currentCombo++;
                this.comboStartTime = now;
            } else {
                // 使用不同武器击杀，重置连击但记录武器
                this.currentCombo = 1;
                this.comboStartTime = now;
            }
            this.lastWeaponUsed = weapon;
        } else if (weapon && !this.isSameWeapon(weapon)) {
            // 更换武器，重置连击
            this.resetCombo();
            this.lastWeaponUsed = weapon;
        }

        return this.currentCombo;
    }

    resetCombo() {
        this.currentCombo = 0;
        this.lastWeaponUsed = null;
        this.comboStartTime = Date.now();
    }

    getComboBonus() {
        // 连击奖励：每10连击增加10%伤害
        return 1 + Math.floor(this.currentCombo / 10) * 0.1;
    }
}

// 初始化连击系统
window.WeaponComboSystem = new WeaponComboSystem();

// 改进的敌人生成算法，使其更平衡
function generateBalancedEnemy(level) {
    const enemy = new Enemy(level);

    // 根据关卡调整敌人的属性，使其更加平衡
    if (level > 20) {
        // 20级以后开始出现更强的AI行为
        enemy.smartBehavior = true;

        if (Math.random() < 0.1) {  // 10% 概率出现特殊能力
            if (Math.random() < 0.5) {
                enemy.hasShield = true; // 护盾
                enemy.shieldHp = Math.floor(enemy.maxHp * 0.3);
            } else {
                enemy.hasRegen = true; // 回血能力
                enemy.regenRate = 0.1; // 每帧回复10%血量
            }
        }
    }

    if (level > 35) {
        // 35级以后出现团队协作AI
        enemy.teamWork = true;
    }

    return enemy;
}

// 添加全局游戏平衡配置
window.GameBalanceConfig = {
    // 玩家成长系数
    playerHpGrowthFactor: 1.0,        // 生命值成长系数
    playerDamageGrowthFactor: 1.0,    // 伤害成长系数
    enemyHpGrowthFactor: 1.0,         // 敌人生命值成长系数
    enemyDamageGrowthFactor: 1.0,     // 敌人伤害成长系数

    // 掉落率调整
    weaponDropRate: 0.7,              // 武器掉落率
    potionDropRate: 0.15,             // 药水掉落率
    relicDropRate: 0.05,              // 遗物掉落率

    // 游戏节奏调整
    enemySpawnRate: 1.0,              // 敌人生成速率
    specialEventFrequency: 0.3,       // 特殊事件频率

    // 平衡参数
    elementEffectiveness: 1.0,        // 元素效果强度
    comboEffectiveness: 1.0,          // 连击效果强度
};

console.log("核心机制重构模块已加载，包含元素武器、平衡优化、连击系统等功能");