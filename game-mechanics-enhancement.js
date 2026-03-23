// ==================== 游戏机制增强系统 ====================
//
// 本文件实现游戏机制增强，专注于核心玩法完善和内容扩展
// 1. 增加更多武器类型和敌人类型
// 2. 添加特殊游戏事件
// 3. 优化游戏平衡性
// 4. 增加更多内容以支持1-2小时游戏时长

class GameMechanicsEnhancement {
    constructor() {
        this.init();
    }

    init() {
        // 扩展武器库
        this.extendWeaponTypes();

        // 扩展敌人类型
        this.extendEnemyTypes();

        // 扩展关卡事件
        this.extendLevelEvents();

        // 优化游戏平衡性
        this.optimizeBalance();

        console.log("🎯 游戏机制增强系统已初始化");
    }

    // 扩展武器类型，增加更多种类以支持1-2小时游戏
    extendWeaponTypes() {
        // 扩展稀有度定义
        if (typeof BALANCED_WEAPON_RARITIES !== 'undefined') {
            // 添加新的稀有度等级
            BALANCED_WEAPON_RARITIES.epic.weight = 6; // 调整权重
            BALANCED_WEAPON_RARITIES.legendary.weight = 3; // 调整权重

            // 添加新的终极稀有度
            BALANCED_WEAPON_RARITIES.prime = {
                weight: 0.5, // 很少出现
                multiplier: 10.0,
                description: '终极'
            };
        }

        // 扩展武器数据库
        const additionalWeapons = [
            // 普通武器扩展
            { name: '木制长棍', damage: 5, rarity: 'common', color: '#D2B48C' },
            { name: '生锈的刀片', damage: 6, rarity: 'common', color: '#696969' },
            { name: '破损的斧头', damage: 8, rarity: 'common', color: '#A9A9A9' },
            { name: '钝剑', damage: 7, rarity: 'common', color: '#C0C0C0' },
            { name: '破旧的钉锤', damage: 9, rarity: 'common', color: '#8B4513' },
            { name: '锋利的石头', damage: 4, rarity: 'common', color: '#708090' },
            { name: '生锈的长矛', damage: 7, rarity: 'common', color: '#696969' },
            { name: '简易弓', damage: 6, rarity: 'common', color: '#8B4513' },

            // 不常见武器扩展
            { name: '锋利短剑', damage: 12, rarity: 'uncommon', color: '#ADD8E6', effect: 'quick_strike' },
            { name: '铁质战锤', damage: 18, rarity: 'uncommon', color: '#C0C0C0', effect: 'stun' },
            { name: '双刃匕首', damage: 15, rarity: 'uncommon', color: '#98FB98', effect: 'double_hit' },
            { name: '钢制长剑', damage: 16, rarity: 'uncommon', color: '#C0C0C0', effect: 'bleed' },
            { name: '燃烧之刃', damage: 17, rarity: 'uncommon', color: '#FF4500', effect: 'burn' },
            { name: '冰霜战斧', damage: 19, rarity: 'uncommon', color: '#87CEEB', effect: 'freeze' },
            { name: '附魔法杖', damage: 14, rarity: 'uncommon', color: '#DDA0DD', effect: 'magic_missile' },
            { name: '毒刺短匕', damage: 13, rarity: 'uncommon', color: '#32CD32', effect: 'poison' },

            // 稀有武器扩展
            { name: '龙鳞剑', damage: 28, rarity: 'rare', color: '#FFA500', effect: 'dragon_fire' },
            { name: '圣光十字弓', damage: 26, rarity: 'rare', color: '#FFFF00', effect: 'holy_arrow' },
            { name: '暗影之刃', damage: 30, rarity: 'rare', color: '#4B0082', effect: 'shadow_step' },
            { name: '雷鸣战锤', damage: 32, rarity: 'rare', color: '#4682B4', effect: 'lightning_strike' },
            { name: '寒冰之心', damage: 27, rarity: 'rare', color: '#B0E0E6', effect: 'frost_nova' },
            { name: '生命汲取者', damage: 25, rarity: 'rare', color: '#8B0000', effect: 'life_drain' },
            { name: '风暴使者', damage: 29, rarity: 'rare', color: '#7CFC00', effect: 'tornado' },
            { name: '时空之刃', damage: 31, rarity: 'rare', color: '#9370DB', effect: 'time_slow' },

            // 史诗武器扩展
            { name: '破晓之剑', damage: 45, rarity: 'epic', color: '#FFD700', effect: 'sunburst' },
            { name: '末日审判', damage: 48, rarity: 'epic', color: '#8A2BE2', effect: 'doom_blast' },
            { name: '永恒之怒', damage: 50, rarity: 'epic', color: '#DC143C', effect: 'rage_unleashed' },
            { name: '星辰碎片', damage: 47, rarity: 'epic', color: '#4169E1', effect: 'starfall' },
            { name: '虚无之刃', damage: 52, rarity: 'epic', color: '#2F4F4F', effect: 'void_beam' },
            { name: '元素支配者', damage: 49, rarity: 'epic', color: '#3CB371', effect: 'elemental_mastery' },
            { name: '时空扭曲器', damage: 51, rarity: 'epic', color: '#DA70D6', effect: 'reality_warp' },
            { name: '幻影之舞', damage: 46, rarity: 'epic', color: '#FF6347', effect: 'phantom_assault' },

            // 传说武器扩展
            { name: '创世纪', damage: 75, rarity: 'legendary', color: '#FF1493', effect: 'creation_force' },
            { name: '毁灭之王', damage: 80, rarity: 'legendary', color: '#000000', effect: 'annihilation' },
            { name: '时间主宰', damage: 78, rarity: 'legendary', color: '#1E90FF', effect: 'time_lord' },
            { name: '元素之神', damage: 82, rarity: 'legendary', color: '#00FF7F', effect: 'elemental_deity' },
            { name: '宇宙真理', damage: 85, rarity: 'legendary', color: '#FF00FF', effect: 'cosmic_truth' },
            { name: '命运编织者', damage: 77, rarity: 'legendary', color: '#663399', effect: 'destiny_weaver' },

            // 终极武器
            { name: '原初之力', damage: 120, rarity: 'prime', color: '#FFFFFF', effect: 'primordial_force' },
            { name: '虚无造物主', damage: 150, rarity: 'prime', color: '#000000', effect: 'nothingness_creator' },
            { name: '绝对真理', damage: 200, rarity: 'prime', color: '#FF0000', effect: 'absolute_truth' }
        ];

        // 将新武器添加到全局武器数组
        if (typeof WEAPONS === 'undefined') {
            window.WEAPONS = [];
        }
        window.WEAPONS.push(...additionalWeapons);

        // 扩展武器特殊效果
        this.extendWeaponEffects();
    }

    // 扩展武器特殊效果
    extendWeaponEffects() {
        // 扩展特殊效果处理函数（如果在游戏中可用）
        if (typeof window.CoreGameplayEnhancements !== 'undefined') {
            const originalProcessEffect = window.CoreGameplayEnhancements.prototype.processWeaponEffect;

            window.CoreGameplayEnhancements.prototype.processWeaponEffect = function(effectType, player, enemy) {
                if (originalProcessEffect) {
                    // 先执行原有效果
                    originalProcessEffect.call(this, effectType, player, enemy);
                }

                // 添加新的特殊效果处理
                switch(effectType) {
                    case 'quick_strike':
                        // 快速攻击，短时间内额外攻击一次
                        setTimeout(() => {
                            if (enemy && enemy.hp > 0) {
                                const quickDamage = Math.floor(player.weapon.damage * 0.5);
                                enemy.hp -= quickDamage;
                                if (typeof showCombatLog !== 'undefined') {
                                    showCombatLog(`⚡ 快速打击! 造成 ${quickDamage} 伤害`, 'effect');
                                }
                            }
                        }, 300);
                        break;
                    case 'stun':
                        // 击晕效果
                        if (enemy && !enemy.stunned) {
                            enemy.stunned = true;
                            if (typeof showCombatLog !== 'undefined') {
                                showCombatLog(`🔨 敌人被击晕!`, 'effect');
                            }
                            setTimeout(() => {
                                enemy.stunned = false;
                                if (typeof showCombatLog !== 'undefined') {
                                    showCombatLog(`清醒了`, 'effect');
                                }
                            }, 1500);
                        }
                        break;
                    case 'double_hit':
                        // 双重攻击
                        if (enemy && enemy.hp > 0) {
                            const bonusDamage = Math.floor(player.weapon.damage * 0.7);
                            enemy.hp -= bonusDamage;
                            if (typeof showCombatLog !== 'undefined') {
                                showCombatLog(`💥 双重打击! 额外造成 ${bonusDamage} 伤害`, 'effect');
                            }
                        }
                        break;
                    case 'bleed':
                        // 流血效果
                        if (enemy && !enemy.bleeding) {
                            enemy.bleeding = true;
                            if (typeof showCombatLog !== 'undefined') {
                                showCombatLog(`🩸 敌人开始流血!`, 'effect');
                            }
                            let bleedTicks = 0;
                            const bleedInterval = setInterval(() => {
                                if (enemy && enemy.hp > 0 && bleedTicks < 5) {
                                    enemy.hp -= Math.floor(player.weapon.damage * 0.3);
                                    bleedTicks++;
                                    if (enemy.hp <= 0) {
                                        clearInterval(bleedInterval);
                                    }
                                } else if (bleedTicks >= 5) {
                                    clearInterval(bleedInterval);
                                    enemy.bleeding = false;
                                }
                            }, 800);
                        }
                        break;
                    case 'dragon_fire':
                        // 龙火效果
                        if (typeof showCombatLog !== 'undefined') {
                            showCombatLog(`🐉 龙火爆发!`, 'effect');
                        }
                        // 这里可以实现范围伤害逻辑
                        break;
                    case 'holy_arrow':
                        // 圣光箭矢
                        if (player) {
                            player.hp = Math.min(player.maxHp, player.hp + 10);
                            if (typeof showCombatLog !== 'undefined') {
                                showCombatLog(`✨ 圣光治愈! +10 HP`, 'effect');
                            }
                        }
                        break;
                    case 'shadow_step':
                        // 暗影步，短暂隐身
                        if (player) {
                            player.shadowStepActive = true;
                            if (typeof showCombatLog !== 'undefined') {
                                showCombatLog(`👻 进入暗影步状态`, 'effect');
                            }
                            setTimeout(() => {
                                player.shadowStepActive = false;
                                if (typeof showCombatLog !== 'undefined') {
                                    showCombatLog(`恢复正常`, 'effect');
                                }
                            }, 3000);
                        }
                        break;
                    default:
                        // 处理其他效果
                        break;
                }
            };
        }
    }

    // 扩展敌人类型，增加更多种类
    extendEnemyTypes() {
        const additionalEnemyTypes = {
            // 新增敌人类型
            'SPIKE_SLIME': {
                name: '尖刺史莱姆',
                speed: 0.8,
                hp: 4.0,
                damage: 2.0,
                size: 1.1,
                behavior: 'melee',
                special: 'spike_damage' // 攻击时反弹部分伤害
            },
            'FLAME_BAT': {
                name: '烈焰蝙蝠',
                speed: 2.0,
                hp: 1.0,
                damage: 1.5,
                size: 0.7,
                behavior: 'melee',
                special: 'burn_on_contact' // 接触时燃烧
            },
            'ICE_WOLF': {
                name: '冰霜狼',
                speed: 1.8,
                hp: 3.5,
                damage: 2.8,
                size: 1.3,
                behavior: 'melee',
                special: 'freeze_bite' // 咬击有冰冻效果
            },
            'ARCANE_GOBLIN': {
                name: '奥术哥布林',
                speed: 1.2,
                hp: 2.5,
                damage: 2.0,
                size: 0.9,
                behavior: 'ranged',
                special: 'magic_bolt' // 发射魔法弹
            },
            'BERSERKER_ORC': {
                name: '狂战士兽人',
                speed: 1.0,
                hp: 8.0,
                damage: 4.0,
                size: 2.0,
                behavior: 'melee',
                special: 'rage_mode' // 血量低时进入狂暴状态
            },
            'VAMPIRIC_BLOOD_FLY': {
                name: '吸血血蝇',
                speed: 1.7,
                hp: 1.5,
                damage: 1.2,
                size: 0.6,
                behavior: 'melee',
                special: 'life_drain' // 吸血
            },
            'THUNDER_GOLEM': {
                name: '雷电巨人',
                speed: 0.6,
                hp: 12.0,
                damage: 5.0,
                size: 3.0,
                behavior: 'melee',
                special: 'lightning_shock' // 攻击时有几率释放闪电
            },
            'SHADOW_PHANTOM': {
                name: '暗影幻影',
                speed: 1.5,
                hp: 2.0,
                damage: 2.2,
                size: 1.0,
                behavior: 'melee',
                special: 'phase_shift' // 偶尔进入无形状态
            },
            'CRYSTAL_SPIDER': {
                name: '水晶蜘蛛',
                speed: 1.3,
                hp: 3.0,
                damage: 2.5,
                size: 0.9,
                behavior: 'ranged',
                special: 'web_trap' // 设置陷阱
            },
            'ANCIENT_SORCERER': {
                name: '远古法师',
                speed: 0.7,
                hp: 5.0,
                damage: 3.0,
                size: 1.5,
                behavior: 'ranged',
                special: 'elemental_combo' // 多元素攻击
            },
            // 精英敌人
            'ELITE_SPIKE_SLIME_KING': {
                name: '尖刺史莱姆王',
                speed: 1.0,
                hp: 10.0,
                damage: 3.5,
                size: 1.8,
                behavior: 'melee',
                special: 'massive_spike_wave', // 释放尖刺波
                elite: true
            },
            'ELITE_FLAME_DRAGON': {
                name: '烈焰巨龙',
                speed: 1.5,
                hp: 15.0,
                damage: 6.0,
                size: 4.0,
                behavior: 'ranged',
                special: 'devastating_flame_breath', // 毁灭性火焰吐息
                elite: true
            },
            // Boss级别敌人
            'BOSS_DEMON_LORD': {
                name: '恶魔领主',
                speed: 1.2,
                hp: 30.0,
                damage: 8.0,
                size: 5.0,
                behavior: 'mixed',
                special: 'hell_gate_summon', // 召唤地狱之门
                boss: true
            },
            'BOSS_CHAOS_GOD': {
                name: '混沌之神',
                speed: 2.0,
                hp: 50.0,
                damage: 12.0,
                size: 6.0,
                behavior: 'mixed',
                special: 'reality_crack', // 破碎现实
                boss: true
            }
        };

        // 将新敌人类型合并到全局敌人类型中
        if (typeof ENEMY_TYPES === 'undefined') {
            window.ENEMY_TYPES = {};
        }
        Object.assign(window.ENEMY_TYPES, additionalEnemyTypes);
    }

    // 扩展关卡事件，增加随机事件以增加游戏趣味性
    extendLevelEvents() {
        // 定义关卡特殊事件
        this.levelEvents = {
            5: { type: 'treasure_chest', description: '神秘宝箱出现！' },
            10: { type: 'weapon_festival', description: '武器庆典！敌人必掉武器' },
            15: { type: 'mini_boss', description: '遭遇强大敌人！' },
            20: { type: 'double_damage', description: '双倍伤害模式！' },
            25: { type: 'health_boost', description: '生命值恢复！' },
            30: { type: 'boss_battle', description: '终极BOSS战！' },
            35: { type: 'elemental_storm', description: '元素风暴！' },
            40: { type: 'time_trial', description: '时间试炼！' },
            45: { type: 'survival_round', description: '生存挑战！' },
            50: { type: 'final_battle', description: '最终决战！' }
        };

        // 随机关卡事件（每隔几关可能触发）
        this.randomEvents = [
            { type: 'lucky_day', probability: 0.1, description: '幸运日！' },
            { type: 'weapon_exchange', probability: 0.15, description: '武器交换！' },
            { type: 'health_potion_rain', probability: 0.12, description: '药水雨！' },
            { type: 'enemy_buff', probability: 0.08, description: '敌人增强！' },
            { type: 'speed_round', probability: 0.1, description: '加速模式！' },
            { type: 'freeze_time', probability: 0.05, description: '时间冻结！' }
        ];
    }

    // 优化游戏平衡性
    optimizeBalance() {
        // 优化武器生成平衡性
        if (typeof getImprovedWeaponGeneration !== 'undefined') {
            // 确保高关卡也会有普通武器以维持游戏节奏
            const originalFunc = window.getImprovedWeaponGeneration;
            window.getImprovedWeaponGeneration = function(level, playerStatus = {}) {
                // 调用原函数
                const result = originalFunc(level, playerStatus);

                // 在极高关卡添加一些平衡性调整
                if (level > 40) {
                    // 在40关以上，增加获得合理武器的机会
                    if (Math.random() < 0.05) { // 5% 概率获得适合当前关卡的武器
                        if (Math.random() < 0.7) {
                            return 'epic'; // 偏向史诗武器
                        } else {
                            return 'legendary'; // 或传说武器
                        }
                    }
                }

                return result;
            };
        }

        // 优化敌人生成平衡性
        if (typeof getEnhancedEnemySpawnRate !== 'undefined') {
            const originalSpawnRate = window.getEnhancedEnemySpawnRate;
            window.getEnhancedEnemySpawnRate = function(level) {
                const baseRate = originalSpawnRate(level);

                // 根据玩家状态调整生成率
                if (gameState?.player?.hp < gameState.player.maxHp * 0.3) {
                    // 玩家血量低时，略微降低敌人生成率
                    return baseRate + 400;
                }

                // 随关卡增加，但增长率逐渐放缓
                const levelFactor = Math.min(level * 10, level * Math.log(level + 1) * 8);
                const adjustedRate = Math.max(400, 2000 - levelFactor);

                return adjustedRate;
            };
        }

        // 优化玩家成长曲线
        if (typeof getBalancedPlayerUpgrade !== 'undefined') {
            const originalUpgrade = window.getBalancedPlayerUpgrade;
            window.getBalancedPlayerUpgrade = function(level) {
                const baseUpgrade = originalUpgrade(level);

                // 在中后期提供更多生命值奖励以应对更强敌人
                if (level > 25) {
                    baseUpgrade.hpIncrease = Math.floor(baseUpgrade.hpIncrease * 1.2);
                }

                // 调整升级所需击杀数，使其更平滑
                if (level > 20) {
                    baseUpgrade.killsForNextLevel = Math.max(3, Math.floor(6 + (level * 0.6) - Math.pow(level * 0.1, 1.1)));
                }

                return baseUpgrade;
            };
        }
    }

    // 检查并触发关卡事件
    checkLevelEvents(level) {
        // 检查固定事件
        if (this.levelEvents[level]) {
            this.triggerLevelEvent(level, this.levelEvents[level]);
        }

        // 检查随机事件（除了固定事件的关卡）
        if (!this.levelEvents[level] && level > 3 && Math.random() < 0.3) {
            // 30% 概率触发随机事件
            const randomEvent = this.randomEvents.find(event => Math.random() < event.probability);
            if (randomEvent) {
                this.triggerRandomEvent(randomEvent);
            }
        }
    }

    // 触发关卡事件
    triggerLevelEvent(level, event) {
        if (typeof showCombatLog !== 'undefined') {
            showCombatLog(`⭐ 特殊事件: ${event.description}`, 'event');
        }

        // 根据事件类型执行相应逻辑
        switch(event.type) {
            case 'treasure_chest':
                // 给予玩家奖励
                if (gameState?.player) {
                    // 增加生命值
                    gameState.player.hp = Math.min(gameState.player.maxHp, gameState.player.hp + 30);
                    showCombatLog(`🎁 宝箱奖励: +30 HP`, 'heal');
                }
                break;
            case 'weapon_festival':
                // 启动武器庆典状态
                if (gameState) {
                    gameState.weaponFestival = true;
                    showCombatLog(`🎪 武器庆典开始！敌人必定掉落武器！`, 'event');
                    setTimeout(() => {
                        gameState.weaponFestival = false;
                        showCombatLog(`🎪 武器庆典结束`, 'event');
                    }, 60000); // 持续1分钟
                }
                break;
            case 'mini_boss':
                // 在当前关卡增加一个精英敌人
                if (gameState) {
                    gameState.extraEliteEnemy = true;
                }
                break;
            case 'double_damage':
                // 启动双倍伤害状态
                if (gameState) {
                    gameState.doubleDamageMode = true;
                    showCombatLog(`💪 双倍伤害模式激活！`, 'event');
                    setTimeout(() => {
                        gameState.doubleDamageMode = false;
                        showCombatLog(`💪 双倍伤害模式结束`, 'event');
                    }, 45000); // 持续45秒
                }
                break;
            case 'health_boost':
                // 大幅恢复生命值
                if (gameState?.player) {
                    gameState.player.hp = gameState.player.maxHp;
                    showCombatLog(`💖 生命值完全恢复！`, 'heal');
                }
                break;
            case 'boss_battle':
                // 特殊BOSS战处理将在其他地方处理
                showCombatLog(`👹 准备迎接BOSS战！`, 'event');
                break;
        }
    }

    // 触发随机事件
    triggerRandomEvent(event) {
        if (typeof showCombatLog !== 'undefined') {
            showCombatLog(`🎲 随机事件: ${event.description}`, 'event');
        }

        // 根据随机事件类型执行相应逻辑
        switch(event.type) {
            case 'lucky_day':
                if (gameState) {
                    gameState.luckyDay = true;
                    showCombatLog(`🍀 幸运日开始！武器品质提升！`, 'event');
                    setTimeout(() => {
                        gameState.luckyDay = false;
                        showCombatLog(`🍀 幸运日结束`, 'event');
                    }, 90000); // 持续90秒
                }
                break;
            case 'health_potion_rain':
                // 给予玩家多个生命药水
                if (gameState?.player?.potions) {
                    gameState.player.potions.push({type: 'health', power: 'medium'}, {type: 'health', power: 'large'});
                    showCombatLog(`🧪 获得生命药水！`, 'potion');
                }
                break;
            case 'speed_round':
                // 暂时增加玩家速度
                if (gameState?.player) {
                    const originalSpeed = gameState.player.speed;
                    gameState.player.speed = originalSpeed * 1.5;
                    showCombatLog(`🏃 速度提升！`, 'event');
                    setTimeout(() => {
                        gameState.player.speed = originalSpeed;
                        showCombatLog(`恢复正常速度`, 'event');
                    }, 30000); // 持续30秒
                }
                break;
        }
    }

    // 为敌人添加额外的掉落物品
    addEnemyDropEnhancement() {
        // 扩展敌人掉落逻辑（如果在游戏中实现）
        if (typeof window.CoreGameplayEnhancements !== 'undefined') {
            const originalDrop = window.CoreGameplayEnhancements.prototype.enemyDeathDrop;

            window.CoreGameplayEnhancements.prototype.enemyDeathDrop = function(enemy) {
                if (originalDrop) {
                    originalDrop.call(this, enemy);
                }

                // 额外掉落逻辑
                const dropChance = Math.random();

                if (dropChance < 0.1) { // 10% 概率掉落药水
                    const potionTypes = ['health', 'strength', 'speed', 'regeneration'];
                    const randomPotion = {
                        type: potionTypes[Math.floor(Math.random() * potionTypes.length)],
                        power: ['minor', 'normal', 'major'][Math.floor(Math.random() * 3)]
                    };

                    if (gameState?.player?.potions) {
                        gameState.player.potions.push(randomPotion);
                        if (typeof showCombatLog !== 'undefined') {
                            showCombatLog(`🧪 敌人掉落了药水！`, 'potion');
                        }
                    }
                } else if (dropChance < 0.15 && enemy.elite) { // 5% 额外概率对于精英敌人掉落稀有物品
                    // 给予特殊奖励
                    if (gameState?.player) {
                        gameState.player.hp = Math.min(gameState.player.maxHp, gameState.player.hp + 10);
                        if (typeof showCombatLog !== 'undefined') {
                            showCombatLog(`💎 精英奖励: +10 HP`, 'heal');
                        }
                    }
                }
            };
        }
    }
}

// 创建游戏机制增强实例
const gameMechanicsEnhancement = new GameMechanicsEnhancement();

// 与游戏逻辑集成
function integrateGameMechanics() {
    // 与关卡系统集成
    if (typeof window.specialGameEvents !== 'undefined') {
        // 扩展特殊事件系统
        const originalCheck = window.specialGameEvents.checkForSpecialEvents;

        window.specialGameEvents.checkForSpecialEvents = function(level) {
            // 调用原函数
            if (originalCheck) {
                originalCheck.call(this, level);
            }

            // 添加新的事件检查
            gameMechanicsEnhancement.checkLevelEvents(level);
        };
    }

    // 添加敌人死亡奖励增强
    gameMechanicsEnhancement.addEnemyDropEnhancement();

    console.log("🔗 游戏机制增强系统已集成到游戏逻辑");
}

// 在页面加载完成后集成系统
document.addEventListener('DOMContentLoaded', integrateGameMechanics);

// 导出系统
window.GameMechanicsEnhancement = GameMechanicsEnhancement;
window.gameMechanicsEnhancement = gameMechanicsEnhancement;

console.log("🌟 游戏机制增强系统已加载并准备就绪");