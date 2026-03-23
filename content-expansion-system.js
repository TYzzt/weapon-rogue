// ==================== 游戏内容扩展系统 ====================
//
// 本文件实现游戏内容扩展，目标是增加游戏时长到1-2小时
// 1. 增加更多关卡类型和场景
// 2. 添加特殊游戏模式
// 3. 扩展道具和遗物系统
// 4. 增加挑战模式

class GameContentExpansion {
    constructor() {
        this.init();
    }

    init() {
        // 扩展场景/关卡主题
        this.expandScenes();

        // 扩展遗物系统
        this.expandRelics();

        // 扩展药水系统
        this.expandPotions();

        // 添加新模式
        this.addNewModes();

        // 添加更多挑战
        this.addChallenges();

        console.log("🎯 游戏内容扩展系统已初始化");
    }

    // 扩展场景/关卡主题
    expandScenes() {
        this.scenes = {
            // 原始场景
            1: { name: '青草平原', theme: 'grassland', enemies: ['slime', 'goblin'], description: '绿色的草地和平静的氛围' },
            2: { name: '石质洞穴', theme: 'cave', enemies: ['bat', 'spider'], description: '黑暗的洞穴和回声' },
            3: { name: '古老地城', theme: 'dungeon', enemies: ['skeleton', 'zombie'], description: '古老的地下城，充满危险' },
            4: { name: '恶魔领域', theme: 'demon', enemies: ['imp', 'lesser_demon'], description: '恶魔栖息的危险之地' },

            // 扩展场景
            5: { name: '冰雪王国', theme: 'ice', enemies: ['ice_wolf', 'snow_golem', 'frost_spirit'], description: '冰天雪地的寒冷之地' },
            6: { name: '烈焰山脉', theme: 'fire', enemies: ['fire_elemental', 'lava_beast', 'ash_walker'], description: '炽热的火山地带' },
            7: { name: '雷电天空城', theme: 'lightning', enemies: ['sky_guardian', 'storm_eagle', 'lightning_wisp'], description: '浮在云层上的神秘城市' },
            8: { name: '暗影迷宫', theme: 'shadow', enemies: ['shadow_beast', 'phantom', 'void_crawler'], description: '被黑暗笼罩的迷宫' },
            9: { name: '自然圣地', theme: 'nature', enemies: ['ancient_tree', 'forest_spirit', 'wooden_golem'], description: '自然力量汇聚的神圣之地' },
            10: { name: '机械要塞', theme: 'mechanical', enemies: ['automaton', 'mechanical_beast', 'iron_guardian'], description: '精密机械构成的堡垒' },
            11: { name: '虚空裂隙', theme: 'void', enemies: ['void_spawn', 'dimensional_horror', 'nothingness_embodiment'], description: '现实破碎的空间' },
            12: { name: '时光回廊', theme: 'time', enemies: ['time_wraith', 'temporal_anomaly', 'age_construct'], description: '时间流动异常的神秘空间' },
            13: { name: '元素熔炉', theme: 'elemental', enemies: ['fire_lord', 'water_queen', 'earth_king', 'air_prince'], description: '四大元素交汇之地' },
            14: { name: '星辰神殿', theme: 'astral', enemies: ['star_entity', 'cosmic_horror', 'galaxy_guardian'], description: '星空中的神殿' },
            15: { name: '混沌之源', theme: 'chaos', enemies: ['chaos_beast', 'entropy_incarnate', 'order_destroyer'], description: '混沌力量的起源之地' }
        };

        // 添加场景视觉效果
        this.sceneEffects = {
            ice: { effect: 'frost_particles', bg_color: '#e6f7ff' },
            fire: { effect: 'flame_particles', bg_color: '#ffe6e6' },
            lightning: { effect: 'electric_sparks', bg_color: '#e6f0ff' },
            shadow: { effect: 'dark_veil', bg_color: '#1a1a1a' },
            nature: { effect: 'leaf_swirl', bg_color: '#e6ffe6' },
            mechanical: { effect: 'gear_animation', bg_color: '#f0f0f0' },
            void: { effect: 'distortion_field', bg_color: '#000000' },
            time: { effect: 'temporal_echo', bg_color: '#f0e6ff' },
            elemental: { effect: 'elemental_swirl', bg_color: '#ffffe6' },
            astral: { effect: 'stellar_field', bg_color: '#0a0a2a' },
            chaos: { effect: 'reality_fracture', bg_color: '#330033' }
        };
    }

    // 扩展遗物系统
    expandRelics() {
        this.relics = {
            // 原始遗物
            'ring_of_protection': {
                name: '保护戒指',
                description: '减少10%受到的伤害',
                effect: 'damage_reduction',
                value: 0.1,
                rarity: 'common'
            },
            'amulet_of_strength': {
                name: '力量护符',
                description: '增加15%武器伤害',
                effect: 'damage_boost',
                value: 1.15,
                rarity: 'common'
            },

            // 扩展遗物
            'crystal_of_vigor': {
                name: '活力水晶',
                description: '增加20%最大生命值',
                effect: 'max_health_boost',
                value: 1.2,
                rarity: 'uncommon'
            },
            'tome_of_knowledge': {
                name: '知识典籍',
                description: '经验获取增加25%',
                effect: 'xp_bonus',
                value: 1.25,
                rarity: 'uncommon'
            },
            'boots_of_swiftness': {
                name: '迅捷靴子',
                description: '移动速度增加30%',
                effect: 'movement_speed',
                value: 1.3,
                rarity: 'uncommon'
            },
            'cloak_of_stealth': {
                name: '隐匿斗篷',
                description: '减少敌人察觉范围',
                effect: 'stealth',
                value: 0.5,
                rarity: 'uncommon'
            },
            'orb_of_recovery': {
                name: '恢复宝珠',
                description: '每30秒恢复5%生命值',
                effect: 'periodic_heal',
                value: 0.05,
                rarity: 'rare'
            },
            'gauntlets_of_might': {
                name: '力量护腕',
                description: '暴击率增加15%',
                effect: 'critical_chance',
                value: 0.15,
                rarity: 'rare'
            },
            'pendant_of_wisdom': {
                name: '智慧挂坠',
                description: '技能冷却时间减少20%',
                effect: 'cooldown_reduction',
                value: 0.2,
                rarity: 'rare'
            },
            'crown_of_majesty': {
                name: '威严王冠',
                description: '所有属性增加10%',
                effect: 'all_stats_boost',
                value: 1.1,
                rarity: 'rare'
            },
            'eye_of_omniscience': {
                name: '全知之眼',
                description: '提前预知敌人攻击',
                effect: 'attack_prediction',
                value: 1.0,
                rarity: 'epic'
            },
            'heart_of_undying': {
                name: '不死之心',
                description: '生命值为0时不死亡，保留1点生命值',
                effect: 'death_defy',
                value: 1,
                rarity: 'epic'
            },
            'blade_of_demonsbane': {
                name: '恶魔克星之刃',
                description: '对恶魔类敌人造成双倍伤害',
                effect: 'demon_damage',
                value: 2.0,
                rarity: 'epic'
            },
            'shield_of_ancients': {
                name: '古代盾牌',
                description: '每场战斗获得一次伤害免疫',
                effect: 'damage_immunity',
                value: 1,
                rarity: 'epic'
            },
            'grimoire_of_elements': {
                name: '元素法典',
                description: '武器元素效果增强50%',
                effect: 'element_amplification',
                value: 1.5,
                rarity: 'legendary'
            },
            'infinity_stone': {
                name: '无限宝石',
                description: '随机增强所有游戏属性',
                effect: 'random_enhancement',
                value: 1.25,
                rarity: 'legendary'
            },
            'genesis_core': {
                name: '创世核心',
                description: '完全重置并增强当前武器',
                effect: 'weapon_resynthesis',
                value: 1,
                rarity: 'legendary'
            },
            'eternity_sphere': {
                name: '永恒之球',
                description: '获得一个永久性特殊能力',
                effect: 'permanent_ability',
                value: 1,
                rarity: 'legendary'
            }
        };
    }

    // 扩展药水系统
    expandPotions() {
        this.potions = {
            // 基础药水
            'minor_health': {
                name: '小型生命药水',
                description: '恢复20%最大生命值',
                effect: 'heal',
                value: 0.2,
                rarity: 'common'
            },
            'health': {
                name: '生命药水',
                description: '恢复40%最大生命值',
                effect: 'heal',
                value: 0.4,
                rarity: 'common'
            },
            'greater_health': {
                name: '大型生命药水',
                description: '恢复60%最大生命值',
                effect: 'heal',
                value: 0.6,
                rarity: 'uncommon'
            },

            // 扩展药水
            'super_health': {
                name: '超级生命药水',
                description: '恢复80%最大生命值',
                effect: 'heal',
                value: 0.8,
                rarity: 'uncommon'
            },
            'full_restore': {
                name: '完全恢复药水',
                description: '完全恢复生命值',
                effect: 'full_heal',
                value: 1.0,
                rarity: 'rare'
            },
            'strength_potion': {
                name: '力量药水',
                description: '临时增加50%武器伤害(60秒)',
                effect: 'temporary_damage_boost',
                value: 1.5,
                duration: 60000,
                rarity: 'uncommon'
            },
            'speed_potion': {
                name: '速度药水',
                description: '临时增加40%移动速度(45秒)',
                effect: 'temporary_speed_boost',
                value: 1.4,
                duration: 45000,
                rarity: 'uncommon'
            },
            'resistance_potion': {
                name: '抗性药水',
                description: '临时减少30%伤害(45秒)',
                effect: 'temporary_damage_reduction',
                value: 0.3,
                duration: 45000,
                rarity: 'rare'
            },
            'critical_potion': {
                name: '暴击药水',
                description: '临时增加25%暴击率(30秒)',
                effect: 'temporary_critical_boost',
                value: 0.25,
                duration: 30000,
                rarity: 'rare'
            },
            'luck_potion': {
                name: '幸运药水',
                description: '临时增加稀有物品获取率(90秒)',
                effect: 'temporary_luck_boost',
                value: 2.0,
                duration: 90000,
                rarity: 'rare'
            },
            'regeneration_potion': {
                name: '再生药水',
                description: '每5秒恢复10%最大生命值(30秒)',
                effect: 'regeneration',
                value: 0.1,
                interval: 5000,
                duration: 30000,
                rarity: 'epic'
            },
            'elemental_potion': {
                name: '元素药水',
                description: '当前武器获得随机元素效果(60秒)',
                effect: 'temporary_elemental',
                value: 1,
                duration: 60000,
                rarity: 'epic'
            },
            'invincibility_potion': {
                name: '无敌药水',
                description: '短时间无敌(10秒)',
                effect: 'temporary_invincibility',
                value: 1,
                duration: 10000,
                rarity: 'legendary'
            },
            'growth_elixir': {
                name: '成长灵药',
                description: '永久增加10%最大生命值',
                effect: 'permanent_health_boost',
                value: 1.1,
                rarity: 'legendary'
            },
            'wisdom_elixir': {
                name: '智慧灵药',
                description: '永久增加1级关卡(下次升级时获得双倍生命值)',
                effect: 'permanent_level_boost',
                value: 1,
                rarity: 'legendary'
            }
        };
    }

    // 添加新模式
    addNewModes() {
        this.gameModes = {
            'classic': {
                name: '经典模式',
                description: '标准游戏体验',
                settings: { normal_enemy_rate: 1.0, elite_rate: 0.1, boss_rate: 0.05 }
            },
            'survival': {
                name: '生存模式',
                description: '无限波次敌人，比拼生存能力',
                settings: { enemy_spawn_rate: 1.5, health_regene: true, time_limit: null }
            },
            'time_trial': {
                name: '计时挑战',
                description: '在限定时间内达到最高关卡',
                settings: { time_limit: 600000, scoring_mult: 1.5 }  // 10分钟
            },
            'weapon_master': {
                name: '武器大师',
                description: '只能使用敌人掉落的武器',
                settings: { forced_weapon_swap: true, weapon_limit: null }
            },
            'elemental_challenge': {
                name: '元素挑战',
                description: '仅使用元素武器战斗',
                settings: { element_only: true, elemental_boost: 1.3 }
            },
            'zen_mode': {
                name: '禅意模式',
                description: '缓慢节奏，注重策略',
                settings: { slow_paced: true, bonus_potions: true, reduced_damage: 0.5 }
            },
            'insane': {
                name: '疯狂模式',
                description: '高风险高回报，极高难度',
                settings: { high_difficulty: true, increased_rewards: 2.0, penalty_for_death: true }
            }
        };
    }

    // 添加挑战系统
    addChallenges() {
        this.challenges = [
            {
                id: 'no_potions',
                name: '禁药挑战',
                description: '不使用任何药水通关10关',
                reward: { relic: 'ring_of_temperance', description: '节制之戒: +15%生命值' },
                difficulty: 'intermediate'
            },
            {
                id: 'one_life',
                name: '一命通关',
                description: '只有一次生命机会，失败即结束',
                reward: { relic: 'medallion_of_valor', description: '勇气奖章: +20%伤害' },
                difficulty: 'expert'
            },
            {
                id: 'elemental_master',
                name: '元素宗师',
                description: '只使用一种元素类型的武器通关15关',
                reward: { relic: 'elemental_essence', description: '元素精华: 元素效果增强' },
                difficulty: 'advanced'
            },
            {
                id: 'speed_runner',
                name: '极限速通',
                description: '在15分钟内通关20关',
                reward: { relic: 'talisman_of_haste', description: '急速护符: +25%移动速度' },
                difficulty: 'advanced'
            },
            {
                id: 'weapon_collector',
                name: '武器收藏家',
                description: '使用10种不同稀有度的武器各击败1个敌人',
                reward: { relic: 'curators_glove', description: '策展手套: 物品稀有度提升' },
                difficulty: 'intermediate'
            },
            {
                id: 'combo_king',
                name: '连击之王',
                description: '达到50连击',
                reward: { relic: 'medallion_of_fury', description: '愤怒奖章: 连击奖励增强' },
                difficulty: 'advanced'
            },
            {
                id: 'pacifist',
                name: '和平主义者',
                description: '在前10关中不杀死任何敌人',
                reward: { relic: 'emblem_of_peace', description: '和平徽章: 受伤时获得治疗' },
                difficulty: 'expert'
            },
            {
                id: 'lone_wanderer',
                name: '独行侠',
                description: '不拾取任何遗物通关15关',
                reward: { relic: 'solitude_crystal', description: '孤独水晶: 自给自足能力' },
                difficulty: 'advanced'
            }
        ];
    }

    // 获取场景信息
    getScene(level) {
        const sceneIndex = ((level - 1) % Object.keys(this.scenes).length) + 1;
        return this.scenes[sceneIndex] || this.scenes[1];
    }

    // 获取随机遗物
    getRandomRelic(level) {
        const availableRelics = Object.values(this.relics);

        // 根据关卡数选择遗物稀有度
        let eligibleRelics = [];
        const rand = Math.random();

        if (level < 5) {
            eligibleRelics = availableRelics.filter(r => r.rarity === 'common');
        } else if (level < 10) {
            eligibleRelics = availableRelics.filter(r => r.rarity === 'common' || r.rarity === 'uncommon');
        } else if (level < 20) {
            eligibleRelics = availableRelics.filter(r => r.rarity !== 'legendary');
        } else {
            eligibleRelics = availableRelics; // 所有稀有度都可能出现
        }

        if (eligibleRelics.length === 0) {
            return availableRelics[0];
        }

        return eligibleRelics[Math.floor(Math.random() * eligibleRelics.length)];
    }

    // 获取随机药水
    getRandomPotion(level) {
        const availablePotions = Object.values(this.potions);

        // 根据关卡数选择药水稀有度
        let eligiblePotions = [];
        const rand = Math.random();

        if (level < 5) {
            eligiblePotions = availablePotions.filter(p => p.rarity === 'common');
        } else if (level < 10) {
            eligiblePotions = availablePotions.filter(p => p.rarity === 'common' || p.rarity === 'uncommon');
        } else if (level < 20) {
            eligiblePotions = availablePotions.filter(p => p.rarity !== 'legendary');
        } else {
            eligiblePotions = availablePotions; // 所有稀有度都可能出现
        }

        if (eligiblePotions.length === 0) {
            return availablePotions[0];
        }

        return eligiblePotions[Math.floor(Math.random() * eligiblePotions.length)];
    }

    // 激活遗物效果
    activateRelicEffect(relicId, player) {
        if (!this.relics[relicId]) return;

        const relic = this.relics[relicId];

        switch (relic.effect) {
            case 'damage_reduction':
                if (player) {
                    player.damageReduction = (player.damageReduction || 0) + relic.value;
                }
                break;
            case 'damage_boost':
                if (player) {
                    player.damageMultiplier = (player.damageMultiplier || 1.0) * relic.value;
                }
                break;
            case 'max_health_boost':
                if (player) {
                    player.maxHp = Math.floor(player.maxHp * relic.value);
                    player.hp = Math.min(player.hp, player.maxHp);
                }
                break;
            case 'xp_bonus':
                if (typeof gameState !== 'undefined') {
                    gameState.xpMultiplier = (gameState.xpMultiplier || 1.0) * relic.value;
                }
                break;
            case 'movement_speed':
                if (player) {
                    player.speed = player.speed * relic.value;
                }
                break;
            case 'periodic_heal':
                // 实现周期性治疗效果
                if (player) {
                    const healInterval = setInterval(() => {
                        if (player.hp > 0) {
                            player.hp = Math.min(player.maxHp, player.hp + Math.floor(player.maxHp * relic.value));
                        } else {
                            clearInterval(healInterval);
                        }
                    }, 30000); // 每30秒
                }
                break;
            case 'critical_chance':
                if (player) {
                    player.criticalChance = (player.criticalChance || 0) + relic.value;
                }
                break;
            case 'all_stats_boost':
                if (player) {
                    player.damageMultiplier = (player.damageMultiplier || 1.0) * relic.value;
                    player.maxHp = Math.floor(player.maxHp * relic.value);
                    player.speed = player.speed * relic.value;
                }
                if (typeof gameState !== 'undefined') {
                    gameState.xpMultiplier = (gameState.xpMultiplier || 1.0) * relic.value;
                }
                break;
            default:
                // 处理其他效果
                break;
        }

        if (typeof showCombatLog !== 'undefined') {
            showCombatLog(`🌟 获得遗物效果: ${relic.name}`, 'relic');
        }
    }

    // 激活药水效果
    activatePotionEffect(potionType, player) {
        if (!this.potions[potionType]) return;

        const potion = this.potions[potionType];

        switch (potion.effect) {
            case 'heal':
                if (player) {
                    player.hp = Math.min(player.maxHp, player.hp + Math.floor(player.maxHp * potion.value));
                    if (typeof showCombatLog !== 'undefined') {
                        showCombatLog(`🧪 药水效果: 恢复 ${(potion.value * 100).toFixed(0)}% 生命值`, 'potion');
                    }
                }
                break;
            case 'full_heal':
                if (player) {
                    player.hp = player.maxHp;
                    if (typeof showCombatLog !== 'undefined') {
                        showCombatLog(`🧪 药水效果: 完全恢复生命值`, 'potion');
                    }
                }
                break;
            case 'temporary_damage_boost':
                if (player) {
                    const originalDamageMult = player.damageMultiplier || 1.0;
                    player.damageMultiplier = originalDamageMult * potion.value;

                    setTimeout(() => {
                        player.damageMultiplier = originalDamageMult;
                        if (typeof showCombatLog !== 'undefined') {
                            showCombatLog(`🧪 药水效果消失: 伤害增强失效`, 'potion');
                        }
                    }, potion.duration);

                    if (typeof showCombatLog !== 'undefined') {
                        showCombatLog(`🧪 药水效果: 伤害增强 ${(potion.value * 100 - 100).toFixed(0)}% (${potion.duration/1000}秒)`, 'potion');
                    }
                }
                break;
            case 'temporary_speed_boost':
                if (player) {
                    const originalSpeed = player.speed;
                    player.speed = originalSpeed * potion.value;

                    setTimeout(() => {
                        player.speed = originalSpeed;
                        if (typeof showCombatLog !== 'undefined') {
                            showCombatLog(`🧪 药水效果消失: 速度增强失效`, 'potion');
                        }
                    }, potion.duration);

                    if (typeof showCombatLog !== 'undefined') {
                        showCombatLog(`🧪 药水效果: 速度增强 ${(potion.value * 100 - 100).toFixed(0)}% (${potion.duration/1000}秒)`, 'potion');
                    }
                }
                break;
            case 'regeneration':
                if (player) {
                    const healInterval = setInterval(() => {
                        if (player.hp > 0) {
                            player.hp = Math.min(player.maxHp, player.hp + Math.floor(player.maxHp * potion.value));
                            if (typeof showCombatLog !== 'undefined') {
                                showCombatLog(`🧪 再生: +${Math.floor(player.maxHp * potion.value)} HP`, 'potion');
                            }
                        }
                    }, potion.interval);

                    setTimeout(() => {
                        clearInterval(healInterval);
                        if (typeof showCombatLog !== 'undefined') {
                            showCombatLog(`🧪 再生效果消失`, 'potion');
                        }
                    }, potion.duration);

                    if (typeof showCombatLog !== 'undefined') {
                        showCombatLog(`🧪 药水效果: 生命再生 (${potion.duration/1000}秒)`, 'potion');
                    }
                }
                break;
            default:
                if (typeof showCombatLog !== 'undefined') {
                    showCombatLog(`🧪 使用药水: ${potion.name}`, 'potion');
                }
                break;
        }
    }

    // 获取游戏模式
    getGameMode(modeId) {
        return this.gameModes[modeId] || this.gameModes['classic'];
    }

    // 获取挑战
    getChallenge(challengeId) {
        return this.challenges.find(c => c.id === challengeId);
    }
}

// 创建游戏内容扩展实例
const gameContentExpansion = new GameContentExpansion();

// 与游戏逻辑集成
function integrateContentExpansion() {
    // 扩展关卡场景信息
    if (typeof gameState !== 'undefined') {
        gameState.sceneInfo = gameContentExpansion.getScene(gameState.level || 1);
    }

    // 添加获取遗物函数到全局
    window.getRandomRelic = function(level) {
        return gameContentExpansion.getRandomRelic(level);
    };

    window.activateRelicEffect = function(relicId, player) {
        return gameContentExpansion.activateRelicEffect(relicId, player);
    };

    // 添加获取药水函数到全局
    window.getRandomPotion = function(level) {
        return gameContentExpansion.getRandomPotion(level);
    };

    window.activatePotionEffect = function(potionType, player) {
        return gameContentExpansion.activatePotionEffect(potionType, player);
    };

    // 添加新模式支持
    window.getGameMode = function(modeId) {
        return gameContentExpansion.getGameMode(modeId);
    };

    // 添加挑战系统
    window.getChallenge = function(challengeId) {
        return gameContentExpansion.getChallenge(challengeId);
    };

    console.log("🔗 游戏内容扩展系统已集成到游戏逻辑");
}

// 在适当的时候更新场景信息
function updateSceneInfo(level) {
    if (typeof gameState !== 'undefined') {
        gameState.sceneInfo = gameContentExpansion.getScene(level);
        if (typeof showCombatLog !== 'undefined') {
            const scene = gameContentExpansion.getScene(level);
            showCombatLog(`🌍 进入新的区域: ${scene.name}`, 'level-up');
        }
    }
}

// 在页面加载完成后集成系统
document.addEventListener('DOMContentLoaded', integrateContentExpansion);

// 导出系统
window.GameContentExpansion = GameContentExpansion;
window.gameContentExpansion = gameContentExpansion;

console.log("🌟 游戏内容扩展系统已加载并准备就绪");