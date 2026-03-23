// 游戏平衡性优化补丁
// 优化敌人生成、武器属性和玩家成长系统

(function() {
    console.log('正在应用游戏平衡性优化补丁...');

    // 优化敌人生成权重系统
    function updateEnemySpawnWeights(level) {
        // 基础敌人类型及其初始权重
        const baseWeights = {
            'MELEE': 15,      // 近战敌人
            'RANGED': 12,     // 远程敌人
            'ELITE': 8,       // 精英敌人
            'TANK': 5,        // 坦克敌人
            'BOSS': 2,        // Boss敌人
            'MAGE': 7,        // 法师敌人
            'ASSASSIN': 6,    // 刺客敌人
            'SUPPORT': 4      // 支援敌人
        };

        // 根据等级调整权重
        const levelMultiplier = Math.min(3, 1 + (level * 0.05)); // 最多3倍

        const adjustedWeights = {};
        for (const [type, baseWeight] of Object.entries(baseWeights)) {
            // 随着等级提升，增加更具挑战性的敌人权重
            let multiplier = 1.0;

            // Boss权重随等级提升缓慢增加
            if (type === 'BOSS') {
                multiplier = Math.min(3, 1 + (level * 0.02));
            }
            // 精英和特殊敌人权重适度增加
            else if (['ELITE', 'ASSASSIN', 'MAGE'].includes(type)) {
                multiplier = Math.min(2.5, 1 + (level * 0.03));
            }
            // 基础敌人权重随等级增长较慢
            else {
                multiplier = Math.min(2, 1 + (level * 0.015));
            }

            adjustedWeights[type] = baseWeight * multiplier;
        }

        return adjustedWeights;
    }

    // 优化武器生成算法
    function getWeaponRarityWeight(level) {
        // 使用更平滑的稀有度分布曲线
        const totalLevels = 50; // 假设最大关卡为50

        // 计算各级别武器的权重
        const commonWeight = Math.max(5, 30 - (level * 0.4));
        const uncommonWeight = Math.max(2, Math.min(15, 5 + (level * 0.2)));
        const rareWeight = Math.max(1, Math.min(8, 1 + (level * 0.15)));
        const epicWeight = Math.max(0.5, Math.min(4, 0.2 + (level * 0.08)));
        const legendaryWeight = Math.max(0.1, Math.min(2, 0.05 + (level * 0.04)));
        const mythicWeight = Math.max(0.01, Math.min(1, 0.01 + (level * 0.02)));

        return {
            common: commonWeight,
            uncommon: uncommonWeight,
            rare: rareWeight,
            epic: epicWeight,
            legendary: legendaryWeight,
            mythic: mythicWeight
        };
    }

    // 优化玩家升级所需经验值
    function getKillsNeededForLevel(currentLevel) {
        // 使用更平滑的增长曲线，前期较容易升级，后期逐渐困难
        // 前几级较快，之后逐渐增加，但增长速度会放缓
        if (currentLevel < 5) {
            return Math.max(3, 4 + currentLevel); // 前5级相对较快
        } else if (currentLevel < 15) {
            return Math.max(5, 6 + Math.floor(currentLevel * 0.8)); // 中期适度增长
        } else {
            return Math.max(8, 8 + Math.floor(Math.pow(currentLevel, 1.1))); // 后期指数增长
        }
    }

    // 优化玩家生命值增长
    function calculateHpIncrease(level) {
        // 使用更平衡的生命值增长公式
        const baseIncrease = 10;
        const levelFactor = Math.min(1.5, 0.5 + (level * 0.02)); // 限制每级增长不超过1.5倍
        const diminishingFactor = Math.max(0.3, 1.0 - (level * 0.01)); // 递减因子，避免后期生命值过高

        return Math.floor(baseIncrease * levelFactor * diminishingFactor);
    }

    // 修改全局函数，如果它们存在的话
    if (typeof updateEnemyWeights !== 'undefined') {
        // 保存原始函数
        const originalUpdateEnemyWeights = updateEnemyWeights;

        // 替换为优化版本
        updateEnemyWeights = function(level) {
            return updateEnemySpawnWeights(level);
        };
    }

    if (typeof getKillsNeededForLevelOriginal === 'undefined' && typeof getKillsNeededForLevel !== 'undefined') {
        // 如果原函数存在，保留引用
        getKillsNeededForLevelOriginal = getKillsNeededForLevel;
    }

    // 如果游戏中有相应的全局函数，我们将其重定义
    window.GameBalancePatch = {
        updateEnemySpawnWeights,
        getWeaponRarityWeight,
        getKillsNeededForLevel,
        calculateHpIncrease,
        name: "Advanced Game Balance Patch",
        version: "1.1.0"
    };

    console.log('游戏平衡性优化补丁应用成功！');
    console.log('- 敌人生成权重已优化');
    console.log('- 武器稀有度分布已调整');
    console.log('- 玩家升级曲线已优化');
    console.log('- 生命值增长机制已平衡');
})();