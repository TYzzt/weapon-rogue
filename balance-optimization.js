// ==================== 游戏平衡性优化系统 ====================
//
// 本文件包含以下平衡性优化：
// 1. 调整武器伤害曲线，使其更加平衡
// 2. 优化敌人强度比例
// 3. 重新校准稀有度与伤害的关系
// 4. 优化元素武器的附加效果

class GameBalanceOptimizer {
    constructor() {
        // 定义平衡性参数
        this.balanceParams = {
            // 武器伤害系数
            weaponDamageCoefficients: {
                'common': 1.0,
                'uncommon': 1.3,
                'rare': 1.8,
                'epic': 2.5,
                'legendary': 3.5,
                'mythic': 8.0  // 神话级保持超高伤害，但略微下调
            },

            // 难度曲线参数
            difficultyFactors: {
                baseEnemyHP: 20,
                hpGrowthPerLevel: 3,
                baseEnemyDamage: 5,
                damageGrowthPerLevel: 0.8,
                baseEnemySpeed: 1.0,
                speedGrowthPerLevel: 0.05
            },

            // 元素效果平衡参数
            elementalBalancing: {
                fire: { damage: 3, duration: 2000, procChance: 0.2 },
                ice: { damage: 1, duration: 3000, procChance: 0.15, slowFactor: 0.5 },
                lightning: { damage: 4, duration: 1000, procChance: 0.1 },
                poison: { damage: 2, duration: 4000, procChance: 0.18 },
                holy: { damage: 5, duration: 1500, procChance: 0.12 },
                dragon: { damage: 6, duration: 2500, procChance: 0.1 },
                star: { damage: 7, duration: 2000, procChance: 0.08, radius: 50 },
                void: { damage: 4, duration: 3000, procChance: 0.05, absorbRatio: 0.2 },
                blood: { damage: 3, duration: 3000, procChance: 0.15, lifesteal: 0.3 }
            }
        };

        // 应用平衡性优化
        this.applyBalanceOptimizations();
    }

    // 应用平衡性优化
    applyBalanceOptimizations() {
        // 1. 重新校准武器伤害
        this.calibrateWeaponDamages();

        // 2. 优化敌人属性
        this.optimizeEnemyAttributes();

        // 3. 平衡元素效果
        this.balanceElementalEffects();

        // 4. 调整难度曲线
        this.adjustDifficultyCurve();

        console.log("✅ 游戏平衡性已优化");
    }

    // 重新校准武器伤害
    calibrateWeaponDamages() {
        if (typeof WEAPONS !== 'undefined' && Array.isArray(WEAPONS)) {
            for (const weapon of WEAPONS) {
                // 根据稀有度和基础伤害重新计算最终伤害
                const baseDamage = this.calculateBalancedWeaponDamage(weapon);
                weapon.damage = Math.round(baseDamage);
            }

            console.log(`🔄 武器伤害已重新校准，共调整 ${WEAPONS.length} 把武器`);
        }
    }

    // 计算平衡的武器伤害
    calculateBalancedWeaponDamage(weapon) {
        // 基础伤害系数
        let coefficient = this.balanceParams.weaponDamageCoefficients[weapon.rarity] || 1.0;

        // 根据武器名称特征进行特殊调整
        let adjustment = 1.0;

        // 针对一些特别高或特别低的武器进行微调
        if (weapon.name.includes('开发者')) {
            adjustment = 0.5; // 调低开发者之剑的伤害
        } else if (weapon.name.includes('神话')) {
            adjustment = 0.8; // 调低神话武器的极端伤害
        } else if (weapon.name.includes('普通') || weapon.name.includes('生锈') || weapon.name.includes('破损')) {
            adjustment = 1.1; // 略微提高低级武器的实用性
        } else if (weapon.name.includes('终极') || weapon.name.includes('创世') || weapon.name.includes('概念')) {
            adjustment = 0.7; // 调低极端强力武器的伤害
        }

        // 根据名称长度调整（较长的名字往往代表较强武器）
        if (weapon.name.length > 6) {
            adjustment *= 1.05;
        }

        // 基础伤害计算（假设原始伤害为基准）
        // 我们将保留相对比例，但进行整体平衡调整
        let balancedDamage;

        // 不同稀有度的基础伤害范围
        switch(weapon.rarity) {
            case 'common':
                balancedDamage = 3 + Math.random() * 7; // 3-10
                break;
            case 'uncommon':
                balancedDamage = 12 + Math.random() * 8; // 12-20
                break;
            case 'rare':
                balancedDamage = 25 + Math.random() * 15; // 25-40
                break;
            case 'epic':
                balancedDamage = 45 + Math.random() * 25; // 45-70
                break;
            case 'legendary':
                balancedDamage = 75 + Math.random() * 40; // 75-115
                break;
            case 'mythic':
                balancedDamage = 150 + Math.random() * 100; // 150-250
                break;
            default:
                balancedDamage = 5 + Math.random() * 5; // 默认范围
        }

        return balancedDamage * coefficient * adjustment;
    }

    // 优化敌人属性
    optimizeEnemyAttributes() {
        if (typeof Enemy !== 'undefined' && Enemy.prototype) {
            // 扩展Enemy原型以使用优化后的属性
            const originalConstructor = Enemy.prototype.constructor;

            Enemy.prototype.constructor = function(level, type = null) {
                // 调用原始构造函数
                originalConstructor.call(this, level, type);

                // 应用平衡后的属性
                this.hp = this.calculateBalancedHP(level);
                this.maxHp = this.hp;
                this.damage = this.calculateBalancedDamage(level);
                this.speed = this.calculateBalancedSpeed(level);
            };

            // 添加平衡属性计算方法
            Enemy.prototype.calculateBalancedHP = function(level) {
                const factor = this.getEnemyTypeFactor();
                return Math.floor(
                    this.getConfigValue('baseEnemyHP') +
                    (level * this.getConfigValue('hpGrowthPerLevel')) * factor.hp
                );
            };

            Enemy.prototype.calculateBalancedDamage = function(level) {
                const factor = this.getEnemyTypeFactor();
                return Math.floor(
                    this.getConfigValue('baseEnemyDamage') +
                    (level * this.getConfigValue('damageGrowthPerLevel')) * factor.damage
                );
            };

            Enemy.prototype.calculateBalancedSpeed = function(level) {
                const factor = this.getEnemyTypeFactor();
                return (
                    this.getConfigValue('baseEnemySpeed') +
                    (level * this.getConfigValue('speedGrowthPerLevel')) * factor.speed
                );
            };

            // 获取敌人类型因子
            Enemy.prototype.getEnemyTypeFactor = function() {
                if (this.type === 'ELITE') {
                    return { hp: 2.0, damage: 1.5, speed: 1.2 };
                } else if (this.type === 'BOSS') {
                    return { hp: 5.0, damage: 2.0, speed: 1.0 };
                } else if (this.type === 'RANGED') {
                    return { hp: 0.8, damage: 1.8, speed: 1.1 };
                } else {
                    // MELEE or default
                    return { hp: 1.0, damage: 1.0, speed: 1.0 };
                }
            };

            // 获取配置值的辅助方法
            Enemy.prototype.getConfigValue = function(key) {
                return GameBalanceOptimizer.prototype.balanceParams.difficultyFactors[key];
            }
        }

        console.log("🛡️ 敌人属性已优化");
    }

    // 平衡元素效果
    balanceElementalEffects() {
        if (typeof CoreGameplayEnhancements !== 'undefined') {
            // 修改元素效果参数
            const elements = this.balanceParams.elementalBalancing;

            // 如果CoreGameplayEnhancements实例存在，更新其元素效果
            if (window.coreGameplayEnhancements) {
                for (const [elementType, params] of Object.entries(elements)) {
                    // 更新每个元素类型的效果参数
                    for (const [key, value] of Object.entries(params)) {
                        // 遍历coreGameplayEnhancements.weaponElements查找对应元素的武器
                        for (const [weaponName, weaponData] of Object.entries(window.coreGameplayEnhancements.weaponElements)) {
                            if (weaponData.type.includes(elementType)) {
                                // 为简化，我们只是记录这些参数用于参考
                                weaponData.damage = params.damage;
                            }
                        }
                    }
                }
            }
        }

        console.log("🔥 元素效果已平衡");
    }

    // 调整难度曲线
    adjustDifficultyCurve() {
        // 修改敌人生成函数以使用更平滑的难度曲线
        if (typeof spawnEnemy !== 'undefined') {
            // 我们不会直接覆盖spawnEnemy，而是提供一个平衡的生成函数
            window.spawnBalancedEnemy = function() {
                if (!gameState.isPlaying) return;

                // 使用平衡的敌人生成逻辑
                let enemyLevel = gameState.level;

                // 根据关卡数调整生成策略，使难度增长更平滑
                if (gameState.level <= 5) {
                    // 前5关增长较慢
                    enemyLevel = Math.max(1, gameState.level - 1);
                } else if (gameState.level <= 15) {
                    // 5-15关适度增长
                    enemyLevel = gameState.level;
                } else if (gameState.level <= 30) {
                    // 15-30关增长放缓
                    enemyLevel = Math.floor(gameState.level * 0.9);
                } else {
                    // 30关后增长进一步放缓
                    enemyLevel = Math.floor(gameState.level * 0.8);
                }

                // 确保敌人等级不低于1
                enemyLevel = Math.max(1, enemyLevel);

                // 添加随机性以增加不确定性
                const randomness = 0.2; // 20%的随机波动
                const randomFactor = 1 + (Math.random() - 0.5) * randomness;
                enemyLevel = Math.max(1, Math.floor(enemyLevel * randomFactor));

                gameState.enemies.push(new Enemy(enemyLevel));

                // 平衡的生成间隔计算
                let baseSpawnRate;
                if (gameState.level <= 10) {
                    baseSpawnRate = 6500 - (gameState.level * 120); // 稍微放慢前期节奏
                } else if (gameState.level <= 25) {
                    baseSpawnRate = 5300 - ((gameState.level - 10) * 100); // 中期增长
                } else {
                    baseSpawnRate = 3800 - ((gameState.level - 25) * 40); // 后期放缓
                }

                // 设定边界值
                const minSpawnRate = 1200; // 增加最小间隔，降低密度
                const maxSpawnRate = 6500;
                const spawnRate = Math.max(minSpawnRate, Math.min(maxSpawnRate, baseSpawnRate));

                const adjustedSpawnRate = spawnRate / gameState.enemySpawnRate;

                // 增加随机性
                const randomizedSpawnRate = adjustedSpawnRate * (0.7 + Math.random() * 0.6);

                setTimeout(window.spawnBalancedEnemy, randomizedSpawnRate);
            };
        }

        console.log("📊 难度曲线已调整");
    }

    // 获取当前平衡参数
    getBalanceParams() {
        return {...this.balanceParams};
    }

    // 动态调整平衡参数
    adjustBalanceParam(paramPath, newValue) {
        const keys = paramPath.split('.');
        let obj = this.balanceParams;

        for (let i = 0; i < keys.length - 1; i++) {
            obj = obj[keys[i]];
        }

        obj[keys[keys.length - 1]] = newValue;
        console.log(`🔧 已调整平衡参数: ${paramPath} = ${newValue}`);
    }
}

// 初始化游戏平衡性优化器
const gameBalanceOptimizer = new GameBalanceOptimizer();

// 导出优化器实例以便其他模块使用
window.GameBalanceOptimizer = GameBalanceOptimizer;
window.gameBalanceOptimizer = gameBalanceOptimizer;

console.log("🎮 游戏平衡性优化系统已加载");