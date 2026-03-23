// 武器替换者 - 游戏内容扩展系统
// 该文件添加额外的游戏内容，以延长游戏时长并提升可玩性

// 新增敌人类型 - 高级敌人
const ADVANCED_ENEMY_TYPES = {
    TANK: { name: '重型坦克', speed: 0.4, hp: 8.0, damage: 2.5, size: 2.8, behavior: 'melee' },
    SPECTER: { name: '幽灵', speed: 1.6, hp: 1.0, damage: 4.0, size: 1.2, behavior: 'ranged' },
    DRONE_SWARM: { name: '无人机群', speed: 1.2, hp: 0.8, damage: 1.5, size: 0.8, behavior: 'swarm' },
    WITCH: { name: '女巫', speed: 0.9, hp: 2.0, damage: 3.0, size: 1.5, behavior: 'summoner' },
    BEHOLDER: { name: '眼魔', speed: 0.7, hp: 4.0, damage: 2.2, size: 2.0, behavior: 'controller' },
    SHADOW_ASSASSIN: { name: '暗影刺客', speed: 2.0, hp: 1.5, damage: 5.0, size: 1.3, behavior: 'stealth' },
    IRON_GOLEM: { name: '钢铁魔像', speed: 0.6, hp: 10.0, damage: 3.5, size: 3.0, behavior: 'tank' },
    PHASE_SPIDER: { name: '相位蜘蛛', speed: 1.5, hp: 2.5, damage: 2.8, size: 1.6, behavior: 'phase' },
    NECROMANCER: { name: '死灵法师', speed: 0.8, hp: 3.0, damage: 2.0, size: 1.8, behavior: 'necromancy' },
    STORM_ELEMENTAL: { name: '风暴元素', speed: 1.8, hp: 2.0, damage: 3.5, size: 2.0, behavior: 'storm' },
    TIME_KEEPER: { name: '时间守护者', speed: 0.5, hp: 15.0, damage: 5.0, size: 3.5, behavior: 'time' },
    REALITY_BENDER: { name: '现实扭曲者', speed: 1.0, hp: 7.0, damage: 4.0, size: 2.5, behavior: 'reality' }
};

// 扩展敌人配置，加入高级敌人
const ENHANCED_ENEMY_CONFIG = {
    ...ENEMY_TYPES,
    ...ADVANCED_ENEMY_TYPES
};

// 新增武器类型
const ADDITIONAL_WEAPONS = [
    // 科技系武器
    { name: '等离子剑', damage: 22, rarity: 'epic', element: 'lightning', color: '#00BFFF', elementDamage: 8 },
    { name: '激光枪', damage: 18, rarity: 'rare', element: 'fire', color: '#FF1493', elementDamage: 6, range: 150 },
    { name: '量子锤', damage: 25, rarity: 'legendary', element: 'energy', color: '#9370DB', elementDamage: 10 },
    { name: '纳米刀', damage: 20, rarity: 'rare', color: '#20B2AA', attackSpeed: 1.5 },
    { name: '反物质炮', damage: 40, rarity: 'mythic', element: 'energy', color: '#FF00FF', elementDamage: 15 },

    // 魔法系武器
    { name: '雷神之锤', damage: 30, rarity: 'legendary', element: 'lightning', color: '#DAA520', elementDamage: 12, chainEffect: 3 },
    { name: '冰霜之心', damage: 24, rarity: 'epic', element: 'ice', color: '#87CEFA', elementDamage: 7, slowEffect: 0.3, aoeRadius: 50 },
    { name: '暗影收割者', damage: 28, rarity: 'legendary', element: 'shadow', color: '#000000', elementDamage: 9, critChance: 0.35, critMultiplier: 2.5 },
    { name: '圣光裁决', damage: 26, rarity: 'legendary', element: 'holy', color: '#FFD700', elementDamage: 8, healOnHit: 5, auraRadius: 100 },
    { name: '元素和谐', damage: 22, rarity: 'epic', element: 'mixed', color: '#9400D3', elementDamage: 6, randomElement: true },

    // 特殊效果武器
    { name: '吸血鬼之刃', damage: 19, rarity: 'rare', element: 'dark', color: '#8B0000', lifeSteal: 0.2, elementDamage: 5 },
    { name: '时空匕首', damage: 17, rarity: 'epic', element: 'time', color: '#4169E1', attackSpeed: 2.0, teleports: 3 },
    { name: '彩虹之剑', damage: 15, rarity: 'rare', color: '#FF69B4', randomColor: true, randomDamage: [10, 30] },
    { name: '真实伤害', damage: 35, rarity: 'legendary', color: '#FF4500', ignoreArmor: true, armorPenetration: 1.0 },
    { name: '无限之刃', damage: 20, rarity: 'mythic', color: '#F0E68C', damageStacks: true, stackLimit: 10 },
];

// 新增药水类型
const ADDITIONAL_POTIONS = [
    { name: '时间药水', type: 'time_slow', desc: '减慢所有敌人速度50%，持续8秒', duration: 8000, effect: 'slow_time', value: 0.5 },
    { name: '隐身药水', type: 'invisibility', desc: '隐身5秒，期间不会受到攻击', duration: 5000, effect: 'invisibility', value: 1 },
    { name: '狂暴药水', type: 'berserk', desc: '攻击力提升100%，防御力降低50%', duration: 10000, effect: 'berserk', damageBoost: 1.0, defenseReduce: 0.5 },
    { name: '传送药水', type: 'teleport', desc: '立即传送到随机位置', effect: 'teleport', value: 1 },
    { name: '召唤药水', type: 'summon', desc: '召唤一个友方单位协助战斗5秒', duration: 5000, effect: 'summon_ally', value: 1 },
    { name: '元素药水', type: 'elemental', desc: '随机一种元素效果（火/冰/雷/毒）', effect: 'random_element', value: 1 },
    { name: '时间停止', type: 'time_stop', desc: '暂停所有敌人动作3秒', duration: 3000, effect: 'freeze_time', value: 1 },
    { name: '护盾药水', type: 'shield', desc: '获得一层可吸收伤害的护盾', effect: 'shield', value: 50 },
    { name: '反弹药水', type: 'reflect', desc: '下一次受到的伤害会反弹给攻击者', duration: 15000, effect: 'damage_reflect', value: 0.5 },
    { name: '复制药水', type: 'duplicate', desc: '复制当前武器', effect: 'duplicate_weapon', value: 1 }
];

// 新增遗物类型
const ADDITIONAL_RELICS = [
    { name: '古老护符', desc: '受到致命伤害时有20%几率存活并恢复50%生命值', effect: 'lifesaver', chance: 0.2 },
    { name: '龙鳞甲', desc: '减少25%受到的伤害', effect: 'damage_reduction', reduction: 0.25 },
    { name: '时光沙漏', desc: '每隔30秒自动获得一个时间药水', effect: 'time_giver', cooldown: 30000 },
    { name: '元素核心', desc: '武器元素伤害增加50%', effect: 'elemental_amplifier', amplifier: 0.5 },
    { name: '战斗之魂', desc: '连击数增加时，攻击力小幅提升', effect: 'combo_power', powerPerCombo: 0.05 },
    { name: '神秘卷轴', desc: '偶尔会显示隐藏物品的位置', effect: 'item_reveal', revealChance: 0.1 },
    { name: '能量之心', desc: '生命值低于30%时，攻击速度提升50%', effect: 'desperation', speedBoost: 0.5, threshold: 0.3 },
    { name: '命运之石', desc: '增加5%暴击率', effect: 'luck_stone', critChance: 0.05 },
    { name: '空间袋', desc: '可携带额外的药水', effect: 'extra_potion_slot', slots: 2 },
    { name: '智慧之冠', desc: '解锁新的敌人弱点信息', effect: 'enemy_insight', insight: true }
];

// 新增场景主题
const SCENE_THEMES = [
    { name: '冰雪世界', id: 'ice_world', bgGradient: 'linear-gradient(135deg, #e0f7fa 0%, #b3e5fc 100%)', enemyBias: ['ICE', 'FROST'] },
    { name: '火山地带', id: 'volcano_zone', bgGradient: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)', enemyBias: ['FIRE', 'LAVA'] },
    { name: '雷云领域', id: 'storm_realm', bgGradient: 'linear-gradient(135deg, #37474f 0%, #455a64 100%)', enemyBias: ['ELECTRIC', 'STORM'] },
    { name: '毒雾森林', id: 'toxic_forest', bgGradient: 'linear-gradient(135deg, #81c784 0%, #a5d6a7 100%)', enemyBias: ['POISON', 'PLANT'] },
    { name: '星辰维度', id: 'star_dimension', bgGradient: 'linear-gradient(135deg, #1a237e 0%, #311b92 100%)', enemyBias: ['SPACE', 'STAR'] },
    { name: '混沌领域', id: 'chaos_realm', bgGradient: 'linear-gradient(135deg, #7b1fa2 0%, #c2185b 100%)', enemyBias: ['CHAOS', 'RANDOM'] },
    { name: '时光裂隙', id: 'time_fissure', bgGradient: 'linear-gradient(135deg, #f5f5f5 0%, #eeeeee 100%)', enemyBias: ['TIME', 'ANCIENT'] },
    { name: '虚无之地', id: 'void_land', bgGradient: 'linear-gradient(135deg, #000000 0%, #1a237e 100%)', enemyBias: ['VOID', 'ABYSS'] }
];

// 新增成就
const ADDITIONAL_ACHIEVEMENTS = [
    { id: 'elemental_master', name: '元素大师', description: '使用每种元素武器各击杀10个敌人', condition: 'elementalMaster', progress: 0, target: 60 },
    { id: 'combo_king', name: '连击之王', description: '达成50连击', condition: 'maxCombo >= 50', progress: 0, target: 50 },
    { id: 'weapon_collector', name: '武器收藏家', description: '收集50种不同武器', condition: 'uniqueWeapons >= 50', progress: 0, target: 50 },
    { id: 'survivalist', name: '生存专家', description: '在第40关时生命值仍大于100', condition: 'level >= 40 && hp > 100', progress: 0, target: 1 },
    { id: 'elemental_combo', name: '元素连击', description: '使用元素武器达成20连击', condition: 'elementalCombo', progress: 0, target: 20 },
    { id: 'scene_explorer', name: '场景探索者', description: '在所有8个场景中都到达第10关', condition: 'sceneExplorer', progress: 0, target: 8 },
    { id: 'relic_hunter', name: '遗物猎人', description: '收集30个不同的遗物', condition: 'relicsCollected >= 30', progress: 0, target: 30 },
    { id: 'potion_mixer', name: '药水调配师', description: '使用每种药水各10次', condition: 'potionMixer', progress: 0, target: 100 },
    { id: 'boss_destroyer', name: 'Boss毁灭者', description: '击败100个Boss敌人', condition: 'bossKills >= 100', progress: 0, target: 100 },
    { id: 'legendary_slayer', name: '传奇杀手', description: '使用传奇或神话武器击杀500个敌人', condition: 'legendaryKills >= 500', progress: 0, target: 500 }
];

// 新增游戏模式
const GAME_MODES = {
    SURVIVAL: {
        name: '生存模式',
        description: '尽可能存活更长时间，敌人数量随时间增加',
        modifiers: {
            infiniteEnemies: true,
            enemySpawnRate: 1.5,
            playerMaxHpMultiplier: 1.5
        }
    },
    TIMETRIAL: {
        name: '计时挑战',
        description: '在限定时间内击杀尽可能多的敌人',
        modifiers: {
            timeLimit: 300000, // 5分钟
            timerActive: true,
            scoreMultiplier: 1.5
        }
    },
    WEAPON_MASTER: {
        name: '武器大师',
        description: '只能使用随机生成的有限武器进行挑战',
        modifiers: {
            limitedWeapons: 5,
            weaponRefreshCost: 10,
            bonusPerUnique: 5
        }
    },
    CHAOS_MODE: {
        name: '混沌模式',
        description: '随机变化的游戏规则，考验玩家应变能力',
        modifiers: {
            randomRules: true,
            ruleChangeInterval: 30000, // 30秒切换规则
            scoreMultiplier: 2.0
        }
    }
};

// 新增挑战系统
const CHALLENGES = [
    {
        id: 'no_healing',
        name: '禁疗挑战',
        description: '不能使用任何治疗手段，包括自然恢复',
        conditions: { disableHealing: true },
        rewards: { scoreMultiplier: 2.0, extraRelic: true }
    },
    {
        id: 'one_hit_wonder',
        name: '一击必杀',
        description: '每个敌人必须一击击杀，否则扣除生命值',
        conditions: { oneHitRequired: true },
        rewards: { scoreMultiplier: 3.0, specialWeapon: true }
    },
    {
        id: 'elemental_forbid',
        name: '元素禁锢',
        description: '不能使用任何带有元素属性的武器',
        conditions: { noElementalWeapons: true },
        rewards: { rareRelic: true, achievementUnlock: true }
    },
    {
        id: 'small_target',
        name: '缩小靶子',
        description: '玩家大小减半，更容易被击中',
        conditions: { playerSizeReduction: 0.5 },
        rewards: { legendaryWeapon: true, hpBonus: 50 }
    },
    {
        id: 'gravity_well',
        name: '重力井',
        description: '玩家移动速度减半，敌人移动速度加倍',
        conditions: { playerSpeedReduction: 0.5, enemySpeedBoost: 2.0 },
        rewards: { uniqueAchievement: true, statBonus: 1.2 }
    },
    {
        id: 'reverse_controls',
        name: '反转控制',
        description: '移动方向完全反转',
        conditions: { reverseControls: true },
        rewards: { mythicRelic: true, permanentStatBoost: 0.2 }
    }
];

// 事件系统扩展
const SPECIAL_EVENTS = [
    {
        id: 'elemental_storm',
        name: '元素风暴',
        trigger: (level) => level % 7 === 0 && level > 5,
        duration: 15000,
        effect: {
            type: 'elemental_storm',
            frequency: 1000,
            damage: 2,
            element: ['fire', 'ice', 'lightning'][Math.floor(Math.random() * 3)]
        },
        description: '整个区域被元素风暴席卷，需要躲避随机元素攻击'
    },
    {
        id: 'time_twist',
        name: '时间扭曲',
        trigger: (level) => level % 12 === 0 && level > 10,
        duration: 10000,
        effect: {
            type: 'time_twist',
            playerSlow: 0.5,
            enemyFast: 2.0,
            reverse: false
        },
        description: '时间流速异常，敌人变得更快，玩家变得更慢'
    },
    {
        id: 'enemy_swarm',
        name: '虫群来袭',
        trigger: (level) => level % 9 === 0 && level > 8,
        duration: 20000,
        effect: {
            type: 'enemy_swarm',
            extraSpawnRate: 3.0,
            weakEnemies: true
        },
        description: '大量低级敌人涌现，数量众多但个体较弱'
    },
    {
        id: 'boss_rush',
        name: 'Boss突袭',
        trigger: (level) => level % 15 === 0 && level > 15,
        duration: 25000,
        effect: {
            type: 'boss_rush',
            bossSpawnRate: 5.0,
            miniBosses: true
        },
        description: 'Boss敌人出现频率大幅提升，面临连续挑战'
    }
];

// 扩展关卡里程碑
const EXTENDED_MILESTONES = [
    { id: 'milestone_elemental', name: '元素掌握', description: '使用元素武器击杀100个敌人', condition: 'elementalKills >= 100', reward: { elementDamageBonus: 0.3 } },
    { id: 'milestone_combo_artist', name: '连击艺术家', description: '达成30连击', condition: 'maxCombo >= 30', reward: { comboDuration: 1.5 } },
    { id: 'milestone_explorer_ii', name: '高级探索者', description: '到达第55关', condition: 'level >= 55', reward: { hpBonus: 50, damageBonus: 25 } },
    { id: 'milestone_weapon_master', name: '武器宗师', description: '获得并使用50种不同武器', condition: 'uniqueWeapons >= 50', reward: { weaponSwapBonus: 10 } },
    { id: 'milestone_survivor_ii', name: '高级幸存者', description: '到达第60关且生命值高于80', condition: 'level >= 60 && hp > 80', reward: { damageReduction: 0.2 } },
    { id: 'milestone_legendary', name: '真正传奇', description: '到达第75关', condition: 'level >= 75', reward: { allBonuses: 2 } },
    { id: 'milestone_mythic', name: '神话之路', description: '到达第100关', condition: 'level >= 100', reward: { ultimatePower: 1 } }
];

// 添加新的敌人AI行为
class EnhancedEnemy extends Enemy {
    constructor(level, type = null) {
        super(level, type);

        // 根据等级添加特殊能力
        this.addSpecialAbilities(level);
    }

    addSpecialAbilities(level) {
        // 25级以上敌人可能有特殊能力
        if (level > 25) {
            if (Math.random() < 0.15) { // 15% 概率
                this.teleportAbility = { cooldown: 8000, lastUse: 0 };
            }

            if (Math.random() < 0.1) { // 10% 概率
                this.summonMinion = { chance: 0.3, minionType: this.type };
            }
        }

        // 40级以上敌人有更高概率获得特殊能力
        if (level > 40) {
            if (Math.random() < 0.25) { // 25% 概率
                this.reflectDamage = 0.1; // 反弹10%伤害
            }

            if (Math.random() < 0.2) { // 20% 概率
                this.buffOnHit = true; // 击中玩家后强化自身
            }
        }
    }

    update() {
        super.update();

        // 处理特殊能力
        if (this.teleportAbility) {
            const now = Date.now();
            if (now - this.teleportAbility.lastUse > this.teleportAbility.cooldown) {
                if (Math.random() < 0.02) { // 每帧2%概率使用传送
                    this.x = Math.random() * (canvas.width - 100) + 50;
                    this.y = Math.random() * (canvas.height - 100) + 50;
                    this.teleportAbility.lastUse = now;

                    // 创建传送特效
                    createParticleEffect(this.x, this.y, PARTICLE_EFFECTS.TELEPORT);
                }
            }
        }

        // 检查生命值低于阈值时的特殊行为
        if (this.hp < this.maxHp * 0.3 && !this.lowHealthActivated) {
            this.lowHealthActivated = true;
            this.speed *= 1.5; // 生命值低于30%时加速
            this.damage *= 1.3; // 生命值低于30%时增加伤害
        }
    }
}

// 战斗系统扩展 - 连击组合技
class ComboSystem {
    constructor() {
        this.sequence = [];
        this.maxSequenceLength = 5;
        this.timeWindow = 3000; // 3秒内完成连击
        this.activeCombos = [];
    }

    registerAttack(weapon, enemyType) {
        const now = Date.now();

        // 清除过期的动作
        this.sequence = this.sequence.filter(action => now - action.time < this.timeWindow);

        // 添加新的攻击动作
        this.sequence.push({
            weapon: weapon,
            enemyType: enemyType,
            time: now
        });

        // 检查是否形成连击组合
        this.checkForCombos();
    }

    checkForCombos() {
        // 示例：连续使用3种不同元素武器击杀敌人，触发元素爆发
        const recentAttacks = this.sequence.slice(-3);
        if (recentAttacks.length >= 3) {
            const elements = [...new Set(recentAttacks.map(a => a.weapon.element || 'none'))];
            if (elements.length >= 3 && !elements.includes('none')) {
                // 触发元素爆发
                this.triggerElementalBurst();
            }
        }
    }

    triggerElementalBurst() {
        // 对所有敌人造成元素伤害
        gameState.enemies.forEach(enemy => {
            const damage = 10;
            enemy.hp -= damage;

            // 创建元素爆发特效
            createParticleEffect(enemy.x, enemy.y, PARTICLE_EFFECTS.ELEMENTAL_BLAST);
        });

        showCombatLog('🌀 元素爆发！对所有敌人造成伤害！', 'special-effect');
    }

    reset() {
        this.sequence = [];
    }
}

// 初始化扩展内容
window.EnhancedContent = {
    weapons: [...ADDITIONAL_WEAPONS],
    potions: [...ADDITIONAL_POTIONS],
    relics: [...ADDITIONAL_RELICS],
    achievements: [...ADDITIONAL_ACHIEVEMENTS],
    sceneThemes: [...SCENE_THEMES],
    gameModes: {...GAME_MODES},
    challenges: [...CHALLENGES],
    specialEvents: [...SPECIAL_EVENTS],
    extendedMilestones: [...EXTENDED_MILESTONES],
    comboSystem: new ComboSystem()
};

console.log("游戏内容扩展系统已加载，包含新敌人、武器、药水、遗物、成就等内容");