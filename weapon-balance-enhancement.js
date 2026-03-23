// ==================== 武器平衡性增强 ====================
//
// 该模块专注于进一步改进武器掉落系统，确保游戏平衡性和玩家体验
//

if (typeof WEAPON_BALANCE_ENHANCEMENT_LOADED === 'undefined') {
    window.WEAPON_BALANCE_ENHANCEMENT_LOADED = true;

    console.log("武器平衡性增强模块已加载");

    // 改进武器掉落概率的动态平衡系统
    class DynamicWeaponBalancer {
        constructor() {
            this.weaponDropHistory = []; // 记录最近掉落的武器
            this.maxHistory = 20; // 记录最近20次掉落
            this.balanceFactors = {
                'common': 1.0,
                'uncommon': 1.0,
                'rare': 1.0,
                'epic': 1.0,
                'legendary': 1.0,
                'mythic': 1.0
            };
        }

        // 记录武器掉落
        recordWeaponDrop(weapon) {
            this.weaponDropHistory.push({
                rarity: weapon.rarity,
                timestamp: Date.now(),
                level: gameState.level
            });

            // 保持历史记录在最大长度内
            if (this.weaponDropHistory.length > this.maxHistory) {
                this.weaponDropHistory.shift();
            }

            // 动态调整平衡因子
            this.updateBalanceFactors();
        }

        // 根据历史掉落更新平衡因子
        updateBalanceFactors() {
            // 重置平衡因子
            for (let rarity in this.balanceFactors) {
                this.balanceFactors[rarity] = 1.0;
            }

            // 计算各稀有度的掉落频率
            const rarityCount = {
                'common': 0,
                'uncommon': 0,
                'rare': 0,
                'epic': 0,
                'legendary': 0,
                'mythic': 0
            };

            for (const drop of this.weaponDropHistory) {
                rarityCount[drop.rarity]++;
            }

            // 基于频率调整平衡因子（掉得越多，后续掉落概率越低）
            for (let rarity in rarityCount) {
                const count = rarityCount[rarity];
                if (count > 0) {
                    // 使用对数缩放，避免过度惩罚
                    this.balanceFactors[rarity] = Math.max(0.5, 1.0 - (count / this.maxHistory) * 0.7);
                }
            }
        }

        // 获取调整后的稀有度权重
        getAdjustedRarityWeights(baseWeights) {
            const adjustedWeights = {};

            for (const [rarity, weight] of Object.entries(baseWeights)) {
                adjustedWeights[rarity] = weight * this.balanceFactors[rarity];
            }

            return adjustedWeights;
        }
    }

    // 创建全局平衡器实例
    window.dynamicWeaponBalancer = new DynamicWeaponBalancer();

    // 改进的武器生成函数，整合动态平衡
    function generateBalancedWeapon(level, playerStatus = {}) {
        // 使用原有的平衡性计算作为基础
        const levelFactor = Math.min(level / 50, 1.0);
        const desperateFactor = playerStatus.hp && playerStatus.maxHp
            ? Math.max(0, (1 - (playerStatus.hp / playerStatus.maxHp)) * 0.3)
            : 0;

        // 基础稀有度权重
        const baseRarities = {
            common: { weight: 50, multiplier: 1.0, description: '普通' },
            uncommon: { weight: 25, multiplier: 1.5, description: '罕见' },
            rare: { weight: 12, multiplier: 2.2, description: '稀有' },
            epic: { weight: 8, multiplier: 3.5, description: '史诗' },
            legendary: { weight: 4, multiplier: 5.0, description: '传说' },
            mythic: { weight: 1, multiplier: 8.0, description: '神话' }
        };

        // 应用关卡和紧急调整
        let totalWeight = 0;
        const preBalanceAdjustedRarities = {};

        for (const [rarity, data] of Object.entries(baseRarities)) {
            let weight = data.weight;

            if (rarity === 'common') {
                weight *= (1 - levelFactor * 0.7) * (1 - desperateFactor * 0.5);
            } else if (rarity === 'mythic') {
                weight *= (1 + levelFactor * 0.3) * (1 + desperateFactor * 0.2);
            } else {
                weight *= (1 + levelFactor * data.multiplier * 0.1) * (1 + desperateFactor * 0.1);
            }

            preBalanceAdjustedRarities[rarity] = { ...data, weight };
            totalWeight += weight;
        }

        // 应用动态平衡调整
        const fullyAdjustedRarities = dynamicWeaponBalancer.getAdjustedRarityWeights(preBalanceAdjustedRarities);
        let finalTotalWeight = 0;

        // 重新计算总权重
        for (const [rarity, data] of Object.entries(fullyAdjustedRarities)) {
            finalTotalWeight += data.weight;
        }

        // 随机选择一个稀有度
        let random = Math.random() * finalTotalWeight;
        for (const [rarity, data] of Object.entries(fullyAdjustedRarities)) {
            random -= data.weight;
            if (random <= 0) {
                // 找到对应稀有度的所有武器
                const weaponsOfRarity = WEAPONS.filter(w => w.rarity === rarity);

                if (weaponsOfRarity.length === 0) {
                    // 如果没有对应稀有度的武器，降级到下一个可用稀有度
                    if (rarity === 'mythic') return generateBalancedWeapon(level, playerStatus);
                    if (rarity === 'legendary') return generateBalancedWeapon(level, playerStatus);
                    if (rarity === 'epic') return generateBalancedWeapon(level, playerStatus);
                    if (rarity === 'rare') return generateBalancedWeapon(level, playerStatus);
                    if (rarity === 'uncommon') return generateBalancedWeapon(level, playerStatus);
                    return WEAPONS[0] || { name: '拳头', damage: 1, rarity: 'common', color: '#ffffff' };
                }

                // 随机选择武器
                const weapon = weaponsOfRarity[Math.floor(Math.random() * weaponsOfRarity.length)];
                const finalWeapon = { ...weapon, id: Date.now() + Math.random() };

                // 记录这次武器掉落
                dynamicWeaponBalancer.recordWeaponDrop(finalWeapon);

                return finalWeapon;
            }
        }

        // 默认返回普通稀有度
        const commonWeapons = WEAPONS.filter(w => w.rarity === 'common');
        const weapon = commonWeapons.length > 0 ? commonWeapons[0] : { name: '拳头', damage: 1, rarity: 'common', color: '#ffffff' };
        const finalWeapon = { ...weapon, id: Date.now() + Math.random() };
        dynamicWeaponBalancer.recordWeaponDrop(finalWeapon);
        return finalWeapon;
    }

    // 增强的敌人生成系统，考虑玩家状态
    function generateBalancedEnemy(level, playerStatus = {}) {
        // 根据玩家当前状况调整敌人类型
        const playerPerformance = playerStatus.kills && playerStatus.time ?
            playerStatus.kills / (playerStatus.time / 1000) : 0; // 杀敌密度

        // 计算敌人的基本属性
        let baseHp = 10 + (level * 1.5);
        let baseDamage = 2 + (level * 0.3);
        let baseSpeed = 0.5 + (Math.min(level, 50) * 0.05);

        // 根据玩家表现调整（表现太好则增强敌人，表现不好则稍微减弱）
        const performanceFactor = playerPerformance > 0.2 ?
            Math.min(1.5, 1 + (playerPerformance - 0.2) * 2) : // 高效玩家面对更强敌人
            Math.max(0.8, 0.9 - (0.2 - playerPerformance) * 0.5); // 困难玩家得到些许缓冲

        const hp = Math.max(5, Math.round(baseHp * performanceFactor));
        const damage = Math.max(1, Math.round(baseDamage * performanceFactor));
        const speed = Math.max(0.3, baseSpeed * performanceFactor);

        // 选择敌人类型
        const enemyTypes = Object.keys(ENEMY_TYPES || {});
        if (enemyTypes.length > 0) {
            // 更倾向选择较高级别的敌人，但保留随机性
            const weightedTypes = [];
            enemyTypes.forEach(type => {
                // 根据关卡和敌人强度添加多次到选择池
                const strength = ENEMY_TYPES[type].hp * ENEMY_TYPES[type].damage * ENEMY_TYPES[type].speed;
                const weight = Math.max(1, Math.round(strength));
                for (let i = 0; i < weight; i++) {
                    weightedTypes.push(type);
                }
            });

            const selectedTypeKey = weightedTypes[Math.floor(Math.random() * weightedTypes.length)];
            const selectedType = ENEMY_TYPES[selectedTypeKey];

            return {
                ...JSON.parse(JSON.stringify(selectedType)), // 深拷贝
                actualHp: hp,
                actualDamage: damage,
                actualSpeed: speed,
                id: Date.now() + Math.random()
            };
        } else {
            // 默认敌人
            return {
                name: '史莱姆',
                speed: speed,
                hp: hp,
                damage: damage,
                size: 1.0,
                behavior: 'melee',
                color: `hsl(${Math.random() * 60}, 70%, 50%)`,
                id: Date.now() + Math.random()
            };
        }
    }

    // 添加武器预览系统，在游戏界面显示下一次可能掉落的武器
    function addWeaponPreviewSystem() {
        // 添加一个全局对象来管理武器预览
        window.WeaponPreview = {
            nextPossibleWeapons: [],

            // 更新可能的下一次武器掉落
            updateNextPossibleWeapons() {
                // 生成5种可能掉落的武器（基于当前关卡和平衡性）
                this.nextPossibleWeapons = [];
                for (let i = 0; i < 5; i++) {
                    const weapon = generateBalancedWeapon(
                        gameState.level || 1,
                        gameState.player || {}
                    );
                    this.nextPossibleWeapons.push(weapon);
                }

                // 显示预览信息（如果UI存在）
                this.displayPreview();
            },

            // 显示预览
            displayPreview() {
                if (window.showCombatLog) {
                    const topWeapon = this.nextPossibleWeapons[0];
                    showCombatLog(`🔮 下次掉落预览: ${topWeapon.name} (${topWeapon.rarity})`, 'system');
                }
            },

            // 获取最佳可能掉落
            getNextBestWeapon() {
                return this.nextPossibleWeapons
                    .slice()
                    .sort((a, b) => getRarityValue(b.rarity) - getRarityValue(a.rarity))[0];
            }
        };

        // 帮助函数：获取稀有度数值
        function getRarityValue(rarity) {
            const values = {
                'common': 1,
                'uncommon': 2,
                'rare': 3,
                'epic': 4,
                'legendary': 5,
                'mythic': 6
            };
            return values[rarity] || 0;
        }

        // 定期更新预览（每10秒）
        setInterval(() => {
            if (WeaponPreview && gameState && gameState.player && gameState.player.isPlaying) {
                WeaponPreview.updateNextPossibleWeapons();
            }
        }, 10000);

        console.log("武器预览系统已添加");
    }

    // 增强的武器评价系统
    function evaluateWeaponQuality(weapon, playerStatus = {}) {
        // 计算武器相对于玩家当前状态的价值
        const currentPlayerWeapon = gameState.player?.weapon;

        // 基础评价
        let value = weapon.damage;

        // 如果有特殊效果，增加价值
        if (weapon.effect) {
            switch(weapon.effect) {
                case 'life_steal':
                case 'lightning':
                case 'fire':
                case 'poison':
                    value *= 1.3;
                    break;
                case 'slow_time':
                case 'chain_lightning':
                    value *= 1.5;
                    break;
                case 'creation':
                case 'destruction':
                case 'reality_warp':
                    value *= 2.0;
                    break;
            }
        }

        // 考虑稀有度加成
        const rarityMultipliers = {
            'common': 1.0,
            'uncommon': 1.2,
            'rare': 1.5,
            'epic': 2.0,
            'legendary': 2.5,
            'mythic': 3.0
        };

        value *= rarityMultipliers[weapon.rarity] || 1.0;

        // 相对于当前武器的价值
        if (currentPlayerWeapon) {
            const currentValue = currentPlayerWeapon.damage *
                (rarityMultipliers[currentPlayerWeapon.rarity] || 1.0);

            return {
                absoluteValue: value,
                relativeValue: value - currentValue,
                isUpgrade: value > currentValue,
                percentageChange: ((value - currentValue) / currentValue) * 100
            };
        }

        return {
            absoluteValue: value,
            relativeValue: value,
            isUpgrade: true,
            percentageChange: 100
        };
    }

    // 重新定义生成武器函数
    if (typeof generateWeapon !== 'undefined') {
        window.originalGenerateWeapon = generateWeapon;
    }

    window.generateWeapon = generateBalancedWeapon;
    window.generateBalancedEnemy = generateBalancedEnemy;
    window.evaluateWeaponQuality = evaluateWeaponQuality;

    // 初始化武器预览系统
    setTimeout(addWeaponPreviewSystem, 1000);

    console.log("武器平衡性增强模块已完全加载");
} else {
    console.log("武器平衡性增强模块已存在，跳过重复加载");
}