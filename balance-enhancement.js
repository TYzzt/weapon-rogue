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
    console.log(`--- 关卡 ${currentLevel} 平衡性数据 ---`);
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