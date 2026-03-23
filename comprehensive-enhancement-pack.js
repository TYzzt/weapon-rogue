// 武器替换者 - 综合游戏增强包 v2.0
// 包含平衡性优化、性能改进和用户体验增强

(function() {
    console.log('正在加载武器替换者综合增强包 v2.0...');

    // ==================== 性能优化 ====================

    // 优化敌人AI计算 - 使用更高效的距离计算方法（无需开方）
    function fastDistance(x1, y1, x2, y2) {
        const dx = x1 - x2;
        const dy = y1 - y2;
        return dx * dx + dy * dy; // 返回距离的平方，避免开方运算
    }

    // 缓存常用计算结果
    const degreeToRadian = Math.PI / 180;
    const radianToDegree = 180 / Math.PI;

    // ==================== 游戏平衡性优化 ====================

    // 改进的敌人生成权重系统
    const EnemySpawnOptimizer = {
        baseWeights: {
            'MELEE': 15,    // 近战敌人
            'RANGED': 12,   // 远程敌人
            'ELITE': 8,     // 精英敌人
            'TANK': 5,      // 坦克敌人
            'BOSS': 2,      // Boss敌人
            'MAGE': 7,      // 法师敌人
            'ASSASSIN': 6,  // 刺客敌人
            'SUPPORT': 4    // 支援敌人
        },

        // 根据当前游戏状态动态调整权重
        getAdjustedWeights: function(level, playerStats) {
            const adjustedWeights = {};

            // 根据玩家当前状态调整敌人类型
            const playerLifeRatio = playerStats.hp / playerStats.maxHp;
            const aggressiveMode = playerLifeRatio < 0.3; // 低血量时生成更多攻击性强的敌人

            for (const [type, baseWeight] of Object.entries(this.baseWeights)) {
                let multiplier = 1.0;

                // 根据关卡调整
                if (level < 5) {
                    // 早期关卡降低高难度敌人比例
                    if (['ELITE', 'TANK', 'BOSS', 'MAGE', 'ASSASSIN'].includes(type)) {
                        multiplier *= 0.7;
                    }
                } else if (level > 20) {
                    // 后期关卡增加挑战性
                    if (['ELITE', 'MAGE', 'ASSASSIN'].includes(type)) {
                        multiplier *= 1.3;
                    }
                }

                // 根据玩家状态调整
                if (aggressiveMode) {
                    // 低血量时增加一些威胁较小的敌人以提供武器获取机会
                    if (['MELEE', 'RANGED'].includes(type)) {
                        multiplier *= 1.2;
                    } else if (['TANK', 'BOSS'].includes(type)) {
                        multiplier *= 0.8; // 降低坦克类敌人比例
                    }
                }

                // 随机波动，增加不确定性
                multiplier *= (0.9 + Math.random() * 0.2);

                adjustedWeights[type] = baseWeight * multiplier;
            }

            return adjustedWeights;
        }
    };

    // 优化武器生成系统
    const WeaponBalanceOptimizer = {
        // 更平衡的稀有度权重分配
        getRarityWeights: function(level) {
            // 使用对数曲线来平衡不同等级的稀有度分布
            const maxLevel = 50;
            const levelRatio = Math.min(1, level / maxLevel);

            // 计算各级别权重
            const commonWeight = Math.max(3, 30 - (level * 0.5));
            const uncommonWeight = Math.max(1, Math.min(12, 2 + (level * 0.25)));
            const rareWeight = Math.max(0.5, Math.min(6, 0.5 + (level * 0.15)));
            const epicWeight = Math.max(0.2, Math.min(3, 0.1 + (level * 0.08)));
            const legendaryWeight = Math.max(0.05, Math.min(1.5, 0.02 + (level * 0.04)));
            const mythicWeight = Math.max(0.01, Math.min(0.5, 0.005 + (level * 0.015)));

            return {
                common: commonWeight,
                uncommon: uncommonWeight,
                rare: rareWeight,
                epic: epicWeight,
                legendary: legendaryWeight,
                mythic: mythicWeight
            };
        },

        // 根据稀有度调整武器伤害的平衡性
        adjustDamageByRarity: function(baseDamage, rarity, level) {
            const rarityMultipliers = {
                'common': 0.8,
                'uncommon': 1.0,
                'rare': 1.3,
                'epic': 1.7,
                'legendary': 2.2,
                'mythic': 2.8
            };

            // 根据关卡调整，防止后期武器过强
            const levelAdjustment = Math.min(1.5, 0.7 + (level * 0.02));

            return Math.floor(baseDamage * rarityMultipliers[rarity] * levelAdjustment);
        }
    };

    // 改进的玩家成长系统
    const PlayerGrowthOptimizer = {
        // 平滑的升级需求曲线
        getKillsForLevel: function(currentLevel) {
            if (currentLevel < 3) return 4; // 前几级快速升级
            if (currentLevel < 10) return Math.floor(4 + currentLevel * 0.8); // 中前期平稳增长
            if (currentLevel < 20) return Math.floor(6 + currentLevel * 1.2); // 中期适度加速
            return Math.min(30, Math.floor(8 + currentLevel * 1.5)); // 后期增速放缓
        },

        // 优化的生命值增长
        getHpIncrease: function(level) {
            const baseIncrease = 8;
            // 使用非线性增长，早期收益更高，后期递减
            const levelFactor = Math.pow(level, 0.85);
            // 设置上限防止生命值过高
            const cap = 15;
            return Math.min(cap, Math.floor(baseIncrease * 0.3 + levelFactor * 0.4));
        }
    };

    // ==================== 用户体验增强 ====================

    // 改进的视觉反馈系统
    const VisualFeedbackEnhancer = {
        // 更丰富的战斗日志
        combatLogMessages: {
            'weapon_get': [
                '获得了新武器: %s!',
                '武器更新: %s!',
                '强力装备: %s!',
                '新的挑战: %s!'
            ],
            'weapon_lost': [
                '旧武器已替换',
                '装备变更',
                '武器升级完成',
                '战斗风格转换'
            ],
            'level_up': [
                '升级! 现在是第 %d 级!',
                '力量提升!',
                '经验增长!',
                '变得更强大了!'
            ],
            'critical_hit': [
                '暴击! %d 伤害!',
                '完美打击!',
                '致命一击!',
                '精准命中!'
            ]
        },

        // 获取随机消息
        getRandomMessage: function(type, ...params) {
            const messages = this.combatLogMessages[type] || [''];
            let msg = messages[Math.floor(Math.random() * messages.length)];

            // 简单的参数替换
            params.forEach(param => {
                msg = msg.replace('%s', param).replace('%d', param);
            });

            return msg;
        }
    };

    // 改进的声音反馈
    const AudioFeedbackEnhancer = {
        // 为不同类型的游戏事件添加声音反馈
        enhancedSounds: {
            'weapon_equip': { frequency: 523.25, duration: 0.15 }, // C5
            'critical_hit': { frequency: 659.25, duration: 0.2, type: 'square' }, // E5
            'level_up_high': { frequencies: [523.25, 659.25, 783.99], duration: 0.5 }, // C5-E5-G5 和弦
            'boss_approach': { frequency: 110, duration: 1.0, type: 'sawtooth' } // A2，用于Boss接近
        }
    };

    // ==================== 实用工具函数 ====================

    // 更精确的随机函数，带权重
    function weightedRandom(itemsWithWeights) {
        const totalWeight = Object.values(itemsWithWeights).reduce((sum, w) => sum + w, 0);
        let random = Math.random() * totalWeight;

        for (const [item, weight] of Object.entries(itemsWithWeights)) {
            if (random < weight) {
                return item;
            }
            random -= weight;
        }

        // 作为后备，返回第一个项目
        return Object.keys(itemsWithWeights)[0];
    }

    // 平滑插值函数，用于动画效果
    function lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    // 配置对象，用于导出功能
    const GameEnhancementPack = {
        name: 'Weapon Rogue Enhancement Pack',
        version: '2.0.0',
        author: 'Game Balance Optimizer',

        // 导出优化功能
        EnemySpawnOptimizer,
        WeaponBalanceOptimizer,
        PlayerGrowthOptimizer,
        VisualFeedbackEnhancer,
        AudioFeedbackEnhancer,

        // 工具函数
        fastDistance,
        weightedRandom,
        lerp,
        degreeToRadian,
        radianToDegree,

        // 通用游戏辅助函数
        getRandomMessage: VisualFeedbackEnhancer.getRandomMessage,

        // 初始化信息
        init: function() {
            console.log(`${this.name} v${this.version} 已加载`);
            console.log('功能:');
            console.log('- 敌人生成权重优化');
            console.log('- 武器平衡性调整');
            console.log('- 玩家成长曲线优化');
            console.log('- 视觉反馈增强');
            console.log('- 性能优化');
            return true;
        }
    };

    // 将增强包附加到全局作用域
    if (typeof window !== 'undefined') {
        window.GameEnhancementPack = GameEnhancementPack;
    } else if (typeof global !== 'undefined') {
        global.GameEnhancementPack = GameEnhancementPack;
    }

    // 初始化增强包
    GameEnhancementPack.init();

    // 如果原始游戏中有对应的函数，尝试整合优化
    if (typeof window.ENEMY_TYPES !== 'undefined') {
        console.log('检测到游戏环境，应用平衡性优化...');

        // 注意：这些只是示例，实际需要根据游戏具体结构来修改
        // 这里我们提供了一个框架，可以让游戏代码调用我们的优化函数
        if (typeof window.updateEnemyWeights === 'function') {
            const originalFn = window.updateEnemyWeights;
            window.updateEnemyWeights = function(level, playerStats) {
                return EnemySpawnOptimizer.getAdjustedWeights(level, playerStats || {hp: 100, maxHp: 100});
            };
        }
    }

    console.log('综合游戏增强包加载完成！');
})();