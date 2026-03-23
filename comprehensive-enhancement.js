// ==================== 游戏内容与平衡性综合增强 ====================

// 导入平衡性增强模块
// 由于我们使用的是JavaScript模块，直接执行平衡性增强代码
eval(`
// ==================== 游戏平衡性增强补丁 ====================

// 武器稀有度权重调整函数
function getAdjustedRarityWeights(level) {
    // 使用更平滑的曲线来调整武器稀有度权重
    const adjustedLevel = Math.max(1, level);

    // 计算关卡对权重的影响因子（使用对数函数来减缓后期增长）
    const levelInfluence = Math.log(adjustedLevel) / Math.log(10); // 基础对数增长

    // 计算动态权重
    const commonWeight = Math.max(20, 80 - (levelInfluence * 15));  // 从80逐渐减少
    const uncommonWeight = Math.max(15, 40 - (levelInfluence * 5));  // 从40逐渐减少
    const rareWeight = 15 + (levelInfluence * 4);  // 逐渐增加
    const epicWeight = 5 + (levelInfluence * 1.5);   // 逐渐增加
    const legendaryWeight = 1 + (levelInfluence * 0.8); // 缓慢增加
    const mythicWeight = 0.2 + (levelInfluence * 0.2);  // 很缓慢地增加

    return {
        common: commonWeight,
        uncommon: uncommonWeight,
        rare: rareWeight,
        epic: epicWeight,
        legendary: legendaryWeight,
        mythic: mythicWeight
    };
}

// 获取调整后的随机稀有度
function getAdjustedRandomRarity(level) {
    const weights = getAdjustedRarityWeights(level);
    const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;

    for (const [rarity, weight] of Object.entries(weights)) {
        random -= weight;
        if (random <= 0) {
            return rarity;
        }
    }

    // 如果随机值超出预期范围，默认返回common
    return 'common';
}

// 生成调整后的随机武器
function generateAdjustedWeapon(level) {
    const rarity = getAdjustedRandomRarity(level || gameState.level || 1);
    const weaponsOfRarity = WEAPONS.filter(w => w.rarity === rarity);

    if (weaponsOfRarity.length === 0) {
        // 如果没有对应稀有度的武器，降级到下一个可用稀有度
        if (rarity === 'mythic') return generateAdjustedWeapon(level, 'legendary');
        if (rarity === 'legendary') return generateAdjustedWeapon(level, 'epic');
        if (rarity === 'epic') return generateAdjustedWeapon(level, 'rare');
        if (rarity === 'rare') return generateAdjustedWeapon(level, 'uncommon');
        return WEAPONS[0]; // 最终回退到第一个武器
    }

    const weapon = weaponsOfRarity[randomInt(0, weaponsOfRarity.length - 1)];
    return { ...weapon, id: Date.now() + Math.random() };
}

// 优化敌人生成权重
function getAdjustedEnemyWeights(level) {
    const baseWeights = {
        'MELEE': Math.max(0.3, 0.7 - (level * 0.01)),  // 随着关卡增加逐渐减少
        'RANGED': 0.2 + (level * 0.005),  // 随着关卡增加逐渐增加
        'ELITE': 0.05 + (level * 0.008),  // 随着关卡增加逐渐增加
        'SUPPORT': 0.02 + (level * 0.003),
        'TANK': 0.01 + (level * 0.002),
        'ARCHER': 0.03 + (level * 0.004),
        'MAGE': 0.02 + (level * 0.005),
        'BOSS': 0.005 + (level * 0.0015)  // Boss权重适度增长
    };

    // 添加更多敌人类型，并确保在高关卡有更多样性的敌人
    if (level > 5) {
        baseWeights['ASSASSIN'] = 0.01 + (level * 0.002);
        baseWeights['NECROMANCER'] = 0.005 + (level * 0.0015);
    }
    if (level > 10) {
        baseWeights['GOLEM'] = 0.003 + (level * 0.001);
        baseWeights['DRAGON'] = 0.002 + (level * 0.001);
    }
    if (level > 20) {
        baseWeights['ELEMENTAL'] = 0.004 + (level * 0.0012);
        baseWeights['DEMON'] = 0.003 + (level * 0.0008);
    }
    if (level > 30) {
        baseWeights['PEGASUS'] = 0.001 + (level * 0.0005);
        baseWeights['CHIMERA'] = 0.001 + (level * 0.0004);
    }

    return baseWeights;
}

// 优化玩家升级曲线
function getPlayerUpgradeCurve(level) {
    // 优化玩家升级所需的击杀数和生命值增长
    const baseHpGain = 5;  // 每级基础生命值增长
    const levelMultiplier = 1 + (level * 0.1);  // 级别越高，生命值增长越多
    const hpIncrease = Math.floor(baseHpGain * levelMultiplier);

    // 计算下一级所需击杀数（使用对数增长来放缓后期增长速度）
    const killsForNextLevel = Math.max(3, Math.floor(5 + (level * 0.8) + Math.pow(level * 0.2, 1.5)));

    return {
        hpIncrease: hpIncrease,
        killsForNextLevel: killsForNextLevel
    };
}

// 优化敌人属性增长曲线
function getEnemyStatGrowth(enemyType, level) {
    const config = ENEMY_TYPES[enemyType];
    if (!config) return ENEMY_TYPES.MELEE; // 默认配置

    // 使用更平衡的增长曲线，避免后期敌人变得过强
    const statMultiplier = 1 + (Math.log(level + 1) * 0.3); // 对数增长，减缓后期增速

    return {
        ...config,
        hp: Math.floor((10 + level * 1.5) * config.hp * Math.min(1.5, statMultiplier)),
        damage: Math.floor((2.0 + level * 0.4) * config.damage * Math.min(1.3, statMultiplier)),
        speed: Math.min(config.speed + Math.log(level + 1) * 0.1, config.speed * 2.0) // 限制速度增长上限
    };
}

// 调整技能冷却时间
function getAdjustedSkillCooldowns() {
    return {
        AOE: Math.max(60, 90 - Math.min(25, gameState.level * 0.8)), // 冷却时间随关卡减少，但有下限
        HEAL: Math.max(90, 120 - Math.min(25, gameState.level * 0.6)),
        TELEPORT: Math.max(45, 70 - Math.min(20, gameState.level * 0.5)),
        BERSERK: Math.max(120, 180 - Math.min(40, gameState.level * 1.2))
    };
}

// 确保这些函数被正确应用到游戏系统中
function applyBalanceEnhancements() {
    // 替换原有的武器生成函数
    window.generateAdjustedWeapon = generateAdjustedWeapon;

    // 为了向后兼容，可以创建一个代理函数
    window.generateWeapon = function() {
        return generateAdjustedWeapon(gameState.level || 1);
    };

    // 提供获取调整后敌人权重的方法
    window.getAdjustedEnemyWeights = getAdjustedEnemyWeights;

    // 提供玩家升级曲线计算方法
    window.getPlayerUpgradeCurve = getPlayerUpgradeCurve;

    // 提供敌人属性增长计算方法
    window.getEnemyStatGrowth = getEnemyStatGrowth;

    // 提供技能冷却时间调整
    window.getAdjustedSkillCooldowns = getAdjustedSkillCooldowns;

    console.log("游戏平衡性增强补丁已应用");
}

// 应用平衡性增强
applyBalanceEnhancements();

// 用于调试的函数
function debugBalanceValues(level = null) {
    const currentLevel = level || gameState.level || 1;
    console.log(\`--- 关卡 \${currentLevel} 平衡性数据 ---\`);
    console.log('武器稀有度权重:', getAdjustedRarityWeights(currentLevel));
    console.log('敌人生成权重:', getAdjustedEnemyWeights(currentLevel));
    console.log('玩家升级曲线:', getPlayerUpgradeCurve(currentLevel));
    console.log('随机稀有度示例:', getAdjustedRandomRarity(currentLevel));
}

// 可选：覆盖原始的getRandomRarity函数
if (typeof getRandomRarity !== 'undefined') {
    const originalGetRandomRarity = getRandomRarity;
    window.getRandomRarity = function() {
        return getAdjustedRandomRarity(gameState.level || 1);
    };
}

console.log("游戏平衡性增强模块已加载");
`);

// ==================== 内容扩展：新增武器 ====================

// 新增高级武器
const additionalWeapons = [
    // 新增普通武器
    { name: '强化木棒', damage: 8, rarity: 'common', color: '#8B4513' },
    { name: '生锈大剑', damage: 9, rarity: 'common', color: '#696969' },
    { name: '破损战斧', damage: 10, rarity: 'common', color: '#2F4F4F' },

    // 新增不常见武器
    { name: '钢制长剑', damage: 22, rarity: 'uncommon', color: '#C0C0C0' },
    { name: '精准猎弓', damage: 20, rarity: 'uncommon', color: '#8B4513' },
    { name: '双刃战斧', damage: 24, rarity: 'uncommon', color: '#A9A9A9' },

    // 新增稀有武器
    { name: '雷电之刃', damage: 50, rarity: 'rare', color: '#00BFFF' },
    { name: '冰霜之锤', damage: 48, rarity: 'rare', color: '#87CEEB' },
    { name: '烈焰长鞭', damage: 52, rarity: 'rare', color: '#FF4500' },

    // 新增史诗武器
    { name: '暗影刺客', damage: 72, rarity: 'epic', color: '#4B0082' },
    { name: '光明守护', damage: 68, rarity: 'epic', color: '#FFD700' },
    { name: '自然和谐', damage: 75, rarity: 'epic', color: '#32CD32' },

    // 新增传说武器
    { name: '宇宙秩序', damage: 105, rarity: 'legendary', color: '#9370DB' },
    { name: '永恒真理', damage: 98, rarity: 'legendary', color: '#4169E1' },
    { name: '时空统治', damage: 110, rarity: 'legendary', color: '#8A2BE2' },

    // 新增神话武器
    { name: '概念原点', damage: 1500, rarity: 'mythic', color: '#FF1493' },
    { name: '现实构造者', damage: 1400, rarity: 'mythic', color: '#00BFFF' }
];

// 将新武器添加到主武器库
for (const weapon of additionalWeapons) {
    if (!WEAPONS.some(w => w.name === weapon.name)) {
        WEAPONS.push(weapon);
    }
}

// ==================== 内容扩展：新增敌人类型 ====================

// 为现有的ENEMY_TYPES添加新敌人
Object.assign(ENEMY_TYPES, {
    // 新增的高级敌人类型
    DRAGON_LORD: {
        name: '龙王',
        speed: 0.7,
        hp: 4.0,
        damage: 2.5,
        size: 2.5,
        behavior: 'ranged'
    }, // 高血高伤害飞行单位
    SHADOW_ASSASSIN: {
        name: '暗影刺客',
        speed: 2.5,
        hp: 1.2,
        damage: 3.0,
        size: 1.0,
        behavior: 'melee'
    }, // 高速高伤害单位
    ANCIENT_GOLEM: {
        name: '远古石像鬼',
        speed: 0.2,
        hp: 5.0,
        damage: 2.0,
        size: 2.8,
        behavior: 'melee'
    }, // 极高血量的坦克单位
    SOUL_REAPER: {
        name: '灵魂收割者',
        speed: 1.0,
        hp: 2.5,
        damage: 2.8,
        size: 1.8,
        behavior: 'mixed'
    }  // 综合攻击单位
});

// 扩展敌人生成池，增加更多种类的敌人
const expandedEnemyPool = [
    'MELEE', 'RANGED', 'ELITE', 'SUPPORT', 'TANK', 'ARCHER', 'MAGE',
    'ASSASSIN', 'GOLEM', 'NECROMANCER', 'DRAGON', 'UNDEAD', 'BEAST',
    'ELEMENTAL', 'SKELETON', 'DEMON',
    // 添加新敌人到池中
    'DRAGON_LORD', 'SHADOW_ASSASSIN', 'ANCIENT_GOLEM', 'SOUL_REAPER'
];

console.log("游戏内容与平衡性综合增强已加载");

// 重新定义generateWeapon函数以确保它引用最新的武器库
if (typeof window.generateAdjustedWeapon === 'function') {
    window.generateWeapon = function() {
        return window.generateAdjustedWeapon(gameState.level || 1);
    };
}

// 修改敌人生成函数以使用新的敌人池
function spawnEnemy() {
    if (!gameState) return;

    const level = gameState.level;
    const weights = getAdjustedEnemyWeights(level);

    // 计算总权重
    let totalWeight = 0;
    for (const weight of Object.values(weights)) {
        totalWeight += weight;
    }

    // 随机选择敌人类型
    let randomValue = Math.random() * totalWeight;
    let cumulativeWeight = 0;
    let selectedType = 'MELEE'; // 默认类型

    for (const [type, weight] of Object.entries(weights)) {
        cumulativeWeight += weight;
        if (randomValue <= cumulativeWeight) {
            selectedType = type;
            break;
        }
    }

    // 创建新敌人
    const enemy = new Enemy(selectedType, level);
    gameState.enemies.push(enemy);
}

// 增强敌人AI行为
class EnhancedEnemy extends Enemy {
    constructor(type, level) {
        super(type, level);

        // 添加额外的AI参数
        this.aggression = 0.5; // 攻击性（0-1）
        this.caution = 0.3;    // 谨慎度（0-1）
        this.adaptability = 0.4; // 适应性（0-1）
    }

    // 增强的更新行为
    update(player, bullets) {
        // 调用父类的更新方法
        super.update(player, bullets);

        // 根据玩家行为调整AI参数
        if (player.combo > 10) {
            // 面对高连击玩家，敌人变得更加谨慎
            this.caution = Math.min(0.8, this.caution + 0.1);
        } else {
            // 正常情况下，敌人恢复正常的攻击性
            this.aggression = Math.max(0.3, this.aggression - 0.001);
        }

        // 根据敌人类型调整行为
        switch(this.type) {
            case 'ASSASSIN':
                // 刺客类型敌人更倾向于侧翼攻击
                this.aggression = 0.9;
                break;
            case 'SUPPORT':
                // 支援型敌人更倾向于远离战斗
                this.caution = 0.7;
                break;
            case 'TANK':
                // 坦克型敌人更加激进
                this.aggression = 0.8;
                break;
        }
    }

    // 实现智能躲避行为
    smartDodge(player, bullets) {
        // 如果附近有子弹，尝试躲避
        for (const bullet of bullets) {
            const distance = getDistance(this, bullet);
            if (distance < 50) { // 如果子弹距离小于50像素
                // 计算躲避方向
                const dx = this.x - bullet.x;
                const dy = this.y - bullet.y;
                const len = Math.sqrt(dx * dx + dy * dy);

                // 躲避子弹
                this.x += (dx / len) * this.speed * 0.5;
                this.y += (dy / len) * this.speed * 0.5;

                // 限制在画布范围内
                this.x = Math.max(this.size, Math.min(canvas.width - this.size, this.x));
                this.y = Math.max(this.size, Math.min(canvas.height - this.size, this.y));
            }
        }
    }
}

// 替换原始敌人创建函数
window.Enemy = EnhancedEnemy;

console.log("增强版敌人AI已激活");