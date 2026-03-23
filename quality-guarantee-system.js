// ==================== 武器掉落品质保底机制 ====================
//
// 该机制确保玩家在连续获得低品质武器后，高品质武器的掉落概率会逐渐提升
// 解决玩家长时间得不到好武器的问题，提升游戏体验

if (typeof QUALITY_GUARANTEE_SYSTEM === 'undefined') {
    window.QUALITY_GUARANTEE_SYSTEM = true;

    console.log("武器品质保底机制已加载");

    // 初始化保底系统参数
    if (!window.gameState) {
        window.gameState = {
            consecutiveCommonDrops: 0,    // 连续获得普通品质武器次数
            consecutiveUncommonDrops: 0,  // 连续获得非普通品质武器次数
            qualityBoostLevel: 0,         // 品质提升等级
            lastQualityBoostTime: 0       // 上次品质提升时间戳
        };
    }

    // 保存原有的getRandomWeapon函数
    if (typeof getRandomWeaponOriginal === 'undefined') {
        window.getRandomWeaponOriginal = typeof getRandomWeapon !== 'undefined' ? getRandomWeapon : function() {
            // 默认武器生成逻辑（如果找不到原函数）
            const defaultWeapons = [
                { name: '木棍', damage: 3, rarity: 'common', color: '#8B4513' },
                { name: '生锈的刀', damage: 5, rarity: 'common', color: '#888' },
                { name: '铁剑', damage: 10, rarity: 'uncommon', color: '#silver' }
            ];
            return {...defaultWeapons[Math.floor(Math.random() * defaultWeapons.length)]};
        };
    }

    // 重写getRandomWeapon函数，加入品质保底机制
    window.getQualityGuaranteedWeapon = function(enemyLevel) {
        // 计算当前品质提升倍数
        const qualityBoostMultiplier = 1 + (gameState.qualityBoostLevel * 0.15);

        // 根据关卡和保底机制调整稀有度概率
        let commonChance, uncommonChance, rareChance, epicChance, legendaryChance;

        // 初始概率分配（基于关卡调整）
        if (enemyLevel < 5) {
            // 早期关卡，更偏向普通武器
            commonChance = 75;
            uncommonChance = 20;
            rareChance = 4;
            epicChance = 0.8;
            legendaryChance = 0.2;
        } else if (enemyLevel < 15) {
            // 中期关卡，稍微提高高品质武器概率
            commonChance = 60;
            uncommonChance = 30;
            rareChance = 8;
            epicChance = 1.5;
            legendaryChance = 0.5;
        } else {
            // 后期关卡，提高高品质武器概率
            commonChance = 45;
            uncommonChance = 35;
            rareChance = 15;
            epicChance = 4;
            legendaryChance = 1;
        }

        // 应用品质保底机制
        // 当连续获得普通品质武器时，高品质武器概率提升
        const consecutiveCommonBoost = Math.min(gameState.consecutiveCommonDrops * 3, 30); // 最多提升30%
        uncommonChance += consecutiveCommonBoost * 0.6;
        rareChance += consecutiveCommonBoost * 0.3;
        epicChance += consecutiveCommonBoost * 0.08;
        legendaryChance += consecutiveCommonBoost * 0.02;
        commonChance -= consecutiveCommonBoost; // 减少普通武器概率

        // 确保概率在有效范围内
        commonChance = Math.max(10, commonChance); // 至少保留10%普通武器
        uncommonChance = Math.max(0, uncommonChance);
        rareChance = Math.max(0, rareChance);
        epicChance = Math.max(0, epicChance);
        legendaryChance = Math.max(0, legendaryChance);

        // 重新标准化概率，确保总和为100%
        const totalChance = commonChance + uncommonChance + rareChance + epicChance + legendaryChance;
        commonChance = (commonChance / totalChance) * 100;
        uncommonChance = (uncommonChance / totalChance) * 100;
        rareChance = (rareChance / totalChance) * 100;
        epicChance = (epicChance / totalChance) * 100;
        legendaryChance = (legendaryChance / totalChance) * 100;

        // 生成随机数决定武器稀有度
        const rand = Math.random() * 100;
        let selectedRarity;

        if (rand < commonChance) {
            selectedRarity = 'common';
        } else if (rand < commonChance + uncommonChance) {
            selectedRarity = 'uncommon';
        } else if (rand < commonChance + uncommonChance + rareChance) {
            selectedRarity = 'rare';
        } else if (rand < commonChance + uncommonChance + rareChance + epicChance) {
            selectedRarity = 'epic';
        } else {
            selectedRarity = 'legendary';
        }

        // 获取对应稀有度的武器
        const weaponPool = window.WEAPONS.filter(w => w.rarity === selectedRarity);

        if (weaponPool.length === 0) {
            // 如果没有指定稀有度的武器，则返回一个默认武器
            console.warn(`未找到稀有度为 ${selectedRarity} 的武器，使用默认武器`);
            return { name: '临时武器', damage: 10, rarity: selectedRarity, color: '#fff' };
        }

        // 从匹配稀有度的武器池中随机选择
        const selectedWeapon = {...weaponPool[Math.floor(Math.random() * weaponPool.length)]};

        // 根据敌人等级调整武器属性
        const levelAdjustment = 1 + (enemyLevel * 0.15); // 随关卡递增
        selectedWeapon.damage = Math.floor(selectedWeapon.damage * levelAdjustment);

        // 更新保底计数器
        if (selectedRarity === 'common') {
            gameState.consecutiveCommonDrops++;
            gameState.consecutiveUncommonDrops = 0;
        } else {
            // 获得非普通品质武器时，重置普通武器计数，增加非普通计数
            gameState.consecutiveCommonDrops = 0;
            gameState.consecutiveUncommonDrops++;

            // 根据连续获得非普通品质武器的次数减少品质提升等级
            if (gameState.consecutiveUncommonDrops >= 5 && gameState.qualityBoostLevel > 0) {
                gameState.qualityBoostLevel = Math.max(0, gameState.qualityBoostLevel - 1);
            }
        }

        // 如果连续获得普通品质武器超过8次，增加品质提升等级
        if (gameState.consecutiveCommonDrops >= 8) {
            gameState.qualityBoostLevel = Math.min(10, gameState.qualityBoostLevel + 1); // 限制最大等级为10
            gameState.consecutiveCommonDrops = 0; // 重置计数器
        }

        // 记录获得武器事件（用于调试）
        console.log(`武器掉落: ${selectedWeapon.name} (${selectedRarity}), 连续普通武器: ${gameState.consecutiveCommonDrops}, 品质提升等级: ${gameState.qualityBoostLevel}`);

        return selectedWeapon;
    };

    // 替换全局的getRandomWeapon函数
    window.getRandomWeapon = window.getQualityGuaranteedWeapon;

    // 添加函数来重置保底系统（例如新游戏时）
    window.resetQualityGuaranteeSystem = function() {
        gameState.consecutiveCommonDrops = 0;
        gameState.consecutiveUncommonDrops = 0;
        gameState.qualityBoostLevel = 0;
        gameState.lastQualityBoostTime = Date.now();
    };

    // 创建函数用于显示保底系统状态（用于UI显示）
    window.getQualityGuaranteeStatus = function() {
        return {
            consecutiveCommonDrops: gameState.consecutiveCommonDrops,
            qualityBoostLevel: gameState.qualityBoostLevel,
            boostPercentage: Math.min(gameState.consecutiveCommonDrops * 3, 30),
            nextBoostLevel: gameState.consecutiveCommonDrops >= 8
        };
    };
}