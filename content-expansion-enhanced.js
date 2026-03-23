// ==================== 游戏内容扩展 ====================
//
// 该模块专注于增加游戏内容量，确保提供1-2小时的可玩内容
// 包括：更多武器、更多敌人、更丰富的关卡事件、更多系统等

// 检查是否已加载，防止重复加载
if (typeof GAME_CONTENT_EXPANSION_LOADED === 'undefined') {
    window.GAME_CONTENT_EXPANSION_LOADED = true;

    console.log("游戏内容扩展模块已加载");

    // 1. 大幅扩展武器库
    const EXPANDED_WEAPONS = [
        // 普通武器扩展
        { name: '生锈的剪刀', damage: 5, rarity: 'common', color: '#696969' },
        { name: '破损的铲子', damage: 6, rarity: 'common', color: '#8B4513' },
        { name: '折断的筷子', damage: 3, rarity: 'common', color: '#DEB887' },
        { name: '塑料叉子', damage: 2, rarity: 'common', color: '#A9A9A9' },
        { name: '坏掉的手电筒', damage: 7, rarity: 'common', color: '#2F4F4F' },
        { name: '橡皮鸭', damage: 1, rarity: 'common', color: '#FFD700', effect: 'comical' },
        { name: '拖鞋', damage: 4, rarity: 'common', color: '#800080' },
        { name: '雨伞', damage: 8, rarity: 'common', color: '#DC143C' },
        { name: '平底锅', damage: 9, rarity: 'common', color: '#C0C0C0' },
        { name: '擀面杖', damage: 7, rarity: 'common', color: '#D2B48C' },

        // 不常见武器扩展
        { name: '锋利水果刀', damage: 15, rarity: 'uncommon', color: '# silver', effect: 'bleed' },
        { name: '工匠短剑', damage: 16, rarity: 'uncommon', color: '#C0C0C0' },
        { name: '狩猎弓', damage: 17, rarity: 'uncommon', color: '#8B4513', effect: 'pierce' },
        { name: '战锤', damage: 18, rarity: 'uncommon', color: '#A9A9A9', effect: 'stun' },
        { name: '双刃匕首', damage: 16, rarity: 'uncommon', color: '#708090', effect: 'critical' },
        { name: '法师短杖', damage: 19, rarity: 'uncommon', color: '#9370DB', effect: 'magic' },
        { name: '游侠长弓', damage: 20, rarity: 'uncommon', color: '#228B22', effect: 'multi_shot' },
        { name: '野蛮战斧', damage: 21, rarity: 'uncommon', color: '#CD5C5C', effect: 'cleave' },
        { name: '骑士长剑', damage: 22, rarity: 'uncommon', color: '#FFD700', effect: 'reflect' },
        { name: '忍者星镖', damage: 14, rarity: 'uncommon', color: '#2F4F4F', effect: 'throwing' },

        // 稀有武器扩展
        { name: '龙鳞剑', damage: 30, rarity: 'rare', color: '#FF8C00', effect: 'fire' },
        { name: '海神三叉戟', damage: 32, rarity: 'rare', color: '#4169E1', effect: 'water' },
        { name: '雷神之锤', damage: 35, rarity: 'rare', color: '#F0E68C', effect: 'lightning' },
        { name: '暗夜匕首', damage: 33, rarity: 'rare', color: '#000000', effect: 'stealth' },
        { name: '圣光十字弓', damage: 34, rarity: 'rare', color: '#FFFFFF', effect: 'holy' },
        { name: '死亡使者', damage: 36, rarity: 'rare', color: '#2F4F4F', effect: 'death' },
        { name: '翡翠法杖', damage: 37, rarity: 'rare', color: '#50C878', effect: 'nature' },
        { name: '寒冰之心', damage: 38, rarity: 'rare', color: '#87CEFA', effect: 'ice' },
        { name: '凤凰羽翼剑', damage: 40, rarity: 'rare', color: '#FF4500', effect: 'rebirth' },
        { name: '银河之刃', damage: 42, rarity: 'rare', color: '#4B0082', effect: 'cosmic' },

        // 史诗武器扩展
        { name: '时间掌控者', damage: 48, rarity: 'epic', color: '#9932CC', effect: 'time_control' },
        { name: '虚无之刃', damage: 52, rarity: 'epic', color: '#000000', effect: 'void' },
        { name: '创世纪元', damage: 55, rarity: 'epic', color: '#00FF00', effect: 'creation' },
        { name: '灭世之锤', damage: 58, rarity: 'epic', color: '#8B0000', effect: 'destruction' },
        { name: '彩虹桥使者', damage: 60, rarity: 'epic', color: '#FF69B4', effect: 'rainbow' },
        { name: '多元宇宙刃', damage: 62, rarity: 'epic', color: '#4B0082', effect: 'multiverse' },
        { name: '永恒之火', damage: 64, rarity: 'epic', color: '#FF4500', effect: 'eternal_flame' },
        { name: '深渊凝视者', damage: 66, rarity: 'epic', color: '#191970', effect: 'abyss' },
        { name: '星辰召唤者', damage: 68, rarity: 'epic', color: '#0000FF', effect: 'star_call' },
        { name: '因果律武器', damage: 70, rarity: 'epic', color: '#FF00FF', effect: 'causality' },

        // 传说武器扩展
        { name: '概念实体化', damage: 80, rarity: 'legendary', color: '#FFD700', effect: 'conceptual' },
        { name: '规则破坏者', damage: 85, rarity: 'legendary', color: '#FF0000', effect: 'rule_breaker' },
        { name: '现实编辑器', damage: 90, rarity: 'legendary', color: '#00FFFF', effect: 'reality_edit' },
        { name: '维度穿越者', damage: 95, rarity: 'legendary', color: '#FF00FF', effect: 'dimension_travel' },
        { name: '宇宙意识', damage: 100, rarity: 'legendary', color: '#000000', effect: 'cosmic_consciousness' },
        { name: '万物理论', damage: 105, rarity: 'legendary', color: '#0000FF', effect: 'theory_of_everything' },
        { name: '超越之剑', damage: 110, rarity: 'legendary', color: '#FFD700', effect: 'transcendence' },
        { name: '本体论武器', damage: 115, rarity: 'legendary', color: '#8A2BE2', effect: 'ontological' },

        // 神话武器扩展
        { name: '存在本身', damage: 200, rarity: 'mythic', color: '#FFFFFF', effect: 'existence' },
        { name: '虚无概念', damage: 300, rarity: 'mythic', color: '#000000', effect: 'nothingness' },
        { name: '无限之环', damage: 400, rarity: 'mythic', color: '#00FF00', effect: 'infinity' },
        { name: '逻辑悖论', damage: 500, rarity: 'mythic', color: '#FF0000', effect: 'paradox' },
        { name: '终极真理', damage: 600, rarity: 'mythic', color: '#9370DB', effect: 'absolute_truth' },
        { name: '源初代码', damage: 700, rarity: 'mythic', color: '#0000FF', effect: 'origin_code' },
        { name: '绝对领域', damage: 800, rarity: 'mythic', color: '#FFD700', effect: 'absolute_domain' },
        { name: '创世之卵', damage: 900, rarity: 'mythic', color: '#FFA500', effect: 'genesis' },
        { name: '终结之门', damage: 1000, rarity: 'mythic', color: '#800080', effect: 'terminus' },
        { name: '无名之物', damage: 1200, rarity: 'mythic', color: '#000000', effect: 'nameless' }
    ];

    // 将扩展武器添加到主武器库
    if (typeof WEAPONS !== 'undefined') {
        WEAPONS.push(...EXPANDED_WEAPONS);
        console.log(`扩展了 ${EXPANDED_WEAPONS.length} 种新武器`);
    }

    // 2. 大幅扩展敌人类型
    const EXPANDED_ENEMY_TYPES = {
        // 普通敌人扩展
        'ZOMBIE': { name: '僵尸', speed: 0.8, hp: 4.0, damage: 2.0, size: 1.2, behavior: 'melee' },
        'SKELETON': { name: '骷髅', speed: 1.0, hp: 2.5, damage: 2.2, size: 1.0, behavior: 'ranged' },
        'SPIDER': { name: '蜘蛛', speed: 1.8, hp: 1.5, damage: 1.8, size: 0.7, behavior: 'melee' },
        'BAT': { name: '蝙蝠', speed: 2.2, hp: 1.0, damage: 1.5, size: 0.5, behavior: 'melee' },
        'WOLF': { name: '狼', speed: 1.5, hp: 3.0, damage: 2.8, size: 1.2, behavior: 'melee' },
        'ORC': { name: '兽人', speed: 1.2, hp: 5.0, damage: 3.0, size: 1.8, behavior: 'melee' },
        'GOBLIN': { name: '哥布林', speed: 1.3, hp: 2.0, damage: 2.0, size: 0.9, behavior: 'ranged' },
        'SNAKE': { name: '蛇', speed: 1.1, hp: 2.2, damage: 2.5, size: 0.8, behavior: 'melee' },

        // 精英敌人扩展
        'ZOMBIE_KING': { name: '僵尸王', speed: 0.6, hp: 10.0, damage: 4.0, size: 2.0, behavior: 'melee', elite: true },
        'SKELETON_WARRIOR': { name: '骷髅战士', speed: 1.1, hp: 5.0, damage: 3.5, size: 1.2, behavior: 'melee', elite: true },
        'GIANT_SPIDER': { name: '巨型蜘蛛', speed: 1.5, hp: 6.0, damage: 4.2, size: 1.8, behavior: 'ranged', elite: true },
        'DIRE_WOLF': { name: '恐狼', speed: 1.8, hp: 7.0, damage: 4.5, size: 2.2, behavior: 'melee', elite: true },
        'ORC_CHIEF': { name: '兽人酋长', speed: 1.0, hp: 12.0, damage: 5.0, size: 2.8, behavior: 'melee', elite: true },
        'WITCH_DOCTOR': { name: '巫医', speed: 0.9, hp: 3.5, damage: 3.0, size: 1.1, behavior: 'ranged', elite: true },

        // Boss敌人
        'SLIME_BOSS': { name: '史莱姆王', speed: 0.7, hp: 20.0, damage: 5.0, size: 3.0, behavior: 'melee', boss: true, special: 'split' },
        'DRAGON': { name: '幼龙', speed: 1.0, hp: 25.0, damage: 6.0, size: 3.5, behavior: 'ranged', boss: true, special: 'fire_breath' },
        'DEMON_LORD': { name: '恶魔领主', speed: 1.2, hp: 30.0, damage: 7.0, size: 4.0, behavior: 'mixed', boss: true, special: 'summon' },
        'ANCIENT_GOLEM': { name: '远古石像鬼', speed: 0.4, hp: 50.0, damage: 8.0, size: 5.0, behavior: 'melee', boss: true, special: 'earthquake' },

        // 特殊环境敌人
        'ICE_TROLL': { name: '冰霜巨魔', speed: 0.9, hp: 15.0, damage: 6.0, size: 3.2, behavior: 'melee', special: 'freeze' },
        'FIRE_ELEMENTAL': { name: '火焰元素', speed: 1.6, hp: 8.0, damage: 5.0, size: 2.0, behavior: 'ranged', special: 'burn' },
        'SHADOW_BEAST': { name: '暗影兽', speed: 2.0, hp: 5.0, damage: 4.0, size: 1.5, behavior: 'melee', special: 'phase' },
        'VOLCANIC_BLAZE': { name: '火山烈焰', speed: 1.3, hp: 12.0, damage: 5.5, size: 2.5, behavior: 'ranged', special: 'inferno' },
        'CRYSTAL_SPIDER': { name: '水晶蜘蛛', speed: 1.7, hp: 7.0, damage: 4.8, size: 1.6, behavior: 'ranged', special: 'web' },
        'WIND_SERPENT': { name: '疾风蛇', speed: 2.5, hp: 4.0, damage: 3.8, size: 1.2, behavior: 'ranged', special: 'cyclone' },
        'ETHEREAL_WISP': { name: '以太精灵', speed: 2.8, hp: 2.0, damage: 5.2, size: 0.8, behavior: 'ranged', special: 'drain' },
        'LAVA_MONSTER': { name: '熔岩怪兽', speed: 0.5, hp: 30.0, damage: 6.5, size: 4.0, behavior: 'melee', special: 'lava_pool' },
    };

    // 将扩展敌人添加到主敌人库
    if (typeof ENEMY_TYPES !== 'undefined') {
        Object.assign(ENEMY_TYPES, EXPANDED_ENEMY_TYPES);
        console.log(`扩展了 ${Object.keys(EXPANDED_ENEMY_TYPES).length} 种新敌人类型`);
    }

    // 3. 扩展关卡里程碑系统
    if (typeof MilestoneSystem !== 'undefined' && typeof MilestoneSystem.milestones !== 'undefined') {
        const EXPANDED_MILESTONES = [
            // 早期里程碑 (1-10)
            { level: 2, name: '初次挑战', description: '适应游戏机制', condition: 'level >= 2', reward: { hpBonus: 5 } },
            { level: 3, name: '第三把武器', description: '获得第三把武器的经验', condition: 'level >= 3', reward: { weaponBonus: 1 } },
            { level: 4, name: '第四扇门', description: '连续突破四关', condition: 'level >= 4', reward: { speedBonus: 0.2 } },

            // 中期里程碑 (11-25)
            { level: 11, name: '勇士之路', description: '抵达第11关', condition: 'level >= 11', reward: { hpBonus: 10 } },
            { level: 13, name: '幸运13', description: '挑战第13关的黑暗力量', condition: 'level >= 13', reward: { luckBonus: 0.2 } },
            { level: 17, name: '山顶之巅', description: '到达第17关的高峰', condition: 'level >= 17', reward: { damageBonus: 0.3 } },
            { level: 19, name: '神秘数字', description: '揭开19关的秘密', condition: 'level >= 19', reward: { critBonus: 0.1 } },

            // 后期里程碑 (26-50)
            { level: 26, name: '黄金之路', description: '进入第26关的黄金领域', condition: 'level >= 26', reward: { goldBonus: 1.5 } },
            { level: 30, name: '三十而立', description: '达到第30关，真正的挑战开始', condition: 'level >= 30', reward: { allBonus: 0.2 } },
            { level: 35, name: '传奇之路', description: '第35关，传奇装备的机会', condition: 'level >= 35', reward: { rareBonus: 0.3 } },
            { level: 40, name: '四十不惑', description: '第40关，智慧与力量的结合', condition: 'level >= 40', reward: { skillBonus: 0.3 } },
            { level: 45, name: '终极考验', description: '接近极限的第45关', condition: 'level >= 45', reward: { masterBonus: 0.4 } },
            { level: 50, name: '传说成就', description: '征服第50关，成为传说', condition: 'level >= 50', reward: { legendBonus: 0.5 } },
        ];

        // 将新里程碑添加到现有里程碑中
        MilestoneSystem.milestones.push(...EXPANDED_MILESTONES);
        console.log(`扩展了 ${EXPANDED_MILESTONES.length} 个新里程碑事件`);

        // 按等级排序里程碑
        MilestoneSystem.milestones.sort((a, b) => a.level - b.level);
    }

    // 4. 添加新药水类型
    if (typeof POTIONS !== 'undefined') {
        const EXPANDED_POTIONS = [
            { name: '幸运药水', effect: 'luck', value: 0.5, duration: 15000, color: '#FFD700', rarity: 'rare' },
            { name: '暴击药水', effect: 'critical', value: 0.3, duration: 10000, color: '#FF0000', rarity: 'epic' },
            { name: '抗性药水', effect: 'resistance', value: 0.5, duration: 20000, color: '#4169E1', rarity: 'rare' },
            { name: '隐身药水', effect: 'invisibility', value: 1.0, duration: 8000, color: '#8A2BE2', rarity: 'epic' },
            { name: '时间药水', effect: 'time_slow', value: 0.5, duration: 12000, color: '#9370DB', rarity: 'legendary' },
            { name: '净化药水', effect: 'purify', value: 1.0, duration: 5000, color: '#00FF7F', rarity: 'uncommon' },
            { name: '反弹药水', effect: 'reflect', value: 0.3, duration: 10000, color: '#00BFFF', rarity: 'epic' },
            { name: '磁性药水', effect: 'magnet', value: 1.5, duration: 30000, color: '#B0C4DE', rarity: 'rare' },
            { name: '狂怒药水', effect: 'rage', value: 2.0, duration: 8000, color: '#B22222', rarity: 'legendary' },
            { name: '治愈药水', effect: 'heal_over_time', value: 5, duration: 15000, color: '#32CD32', rarity: 'epic' }
        ];

        POTIONS.push(...EXPANDED_POTIONS);
        console.log(`扩展了 ${EXPANDED_POTIONS.length} 种新药水`);
    }

    // 5. 添加遗物系统扩展
    if (typeof RELICS !== 'undefined') {
        const EXPANDED_RELICS = [
            { name: '古老护符', effect: 'hp_regen', value: 1, description: '每秒恢复1点生命值', rarity: 'uncommon' },
            { name: '能量核心', effect: 'energy_boost', value: 0.5, description: '技能冷却时间缩短50%', rarity: 'rare' },
            { name: '守护天使', effect: 'shield_on_low_hp', value: 20, description: '生命值低于25%时获得20点护盾', rarity: 'epic' },
            { name: '猎手之眼', effect: 'enemy_weakness', value: 0.2, description: '敌人受到20%额外伤害', rarity: 'rare' },
            { name: '时间沙漏+', effect: 'time_manipulation', value: 0.3, description: '整体速度提升30%', rarity: 'legendary' },
            { name: '元素之心', effect: 'elemental_affinity', value: 0.25, description: '元素武器伤害增加25%', rarity: 'epic' },
            { name: '幸运硬币+', effect: 'increased_luck', value: 0.4, description: '稀有物品掉落率提升40%', rarity: 'rare' },
            { name: '勇者之证', effect: 'combo_extension', value: 5, description: '连击奖励延长5秒', rarity: 'epic' },
            { name: '钢铁意志', effect: 'damage_reduction', value: 0.15, description: '受到伤害减少15%', rarity: 'legendary' },
            { name: '永动机', effect: 'auto_action', value: 0.1, description: '自动攻击敌人（伤害的10%）', rarity: 'mythic' }
        ];

        RELICS.push(...EXPANDED_RELICS);
        console.log(`扩展了 ${EXPANDED_RELICS.length} 种新遗物`);
    }

    // 6. 添加更多成就
    if (typeof enhancedAchievementSystem !== 'undefined') {
        const ADDITIONAL_ACHIEVEMENTS = [
            { id: 'quick_draw', name: '快手拔枪手', description: '在一秒钟内击败3个敌人', condition: 'quickKills' },
            { id: 'defender', name: '防御者', description: '在拥有至少3个遗物的情况下到达第25关', condition: 'defendedLevel25' },
            { id: 'elemental_master', name: '元素大师', description: '使用5种不同元素属性的武器各击败10个敌人', condition: 'elementalMastery' },
            { id: 'combo_artist', name: '连击艺术家', description: '达成一次100连击', condition: 'comboArtist' },
            { id: 'survivalist', name: '生存专家', description: '在生命值低于10的情况下到达第30关', condition: 'survivalist' },
            { id: 'weapon_specialist', name: '武器专家', description: '使用每种稀有度的武器各击败1个Boss', condition: 'weaponSpecialist' },
            { id: 'lucky_seven', name: '幸运7', description: '在第7关使用幸运药水并通关', condition: 'luckySeven' },
            { id: 'dragon_slayer', name: '屠龙者', description: '击败龙类敌人10次', condition: 'dragonSlayer' },
            { id: 'potion_master', name: '药水大师', description: '使用10种不同的药水', condition: 'potionMaster' },
            { id: 'boss_destroyer', name: 'Boss毁灭者', description: '击败20个Boss级敌人', condition: 'bossDestroyer' }
        ];

        // 添加到成就系统
        for (const achievement of ADDITIONAL_ACHIEVEMENTS) {
            enhancedAchievementSystem.achievementList.push(achievement);
        }

        console.log(`添加了 ${ADDITIONAL_ACHIEVEMENTS.length} 个新成就`);
    }

    // 7. 添加关卡主题系统
    class LevelThemeSystem {
        constructor() {
            this.themes = {
                1: { name: '起始森林', background: '#228B22', enemies: ['SLIME', 'BAT', 'SPIDER'] },
                2: { name: '古旧洞穴', background: '#8B4513', enemies: ['SKELETON', 'ZOMBIE', 'SPIDER'] },
                3: { name: '地下墓穴', background: '#2F4F4F', enemies: ['SKELETON_WARRIOR', 'ZOMBIE_KING', 'BONE_ARCHER'] },
                4: { name: '黑暗森林', background: '#006400', enemies: ['WOLF', 'GIANT_SPIDER', 'CORRUPTED_TREE'] },
                5: { name: '恶魔领域', background: '#8B0000', enemies: ['IMP', 'ORC', 'WITCH_DOCTOR'] },
                6: { name: '熔岩之地', background: '#FF4500', enemies: ['LAVA_MONSTER', 'FIRE_ELEMENTAL', 'VOLCANIC_BLAZE'] },
                7: { name: '冰雪王国', background: '#87CEFA', enemies: ['ICE_TROLL', 'FROST_WOLF', 'ICE_ELEMENTAL'] },
                8: { name: '天空之城', background: '#87CEEB', enemies: ['WIND_SERPENT', 'ETHEREAL_WISP', 'SKY_RAIDER'] },
                9: { name: '远古遗迹', background: '#CD853F', enemies: ['ANCIENT_GUARDIAN', 'RELIC_BEAST', 'STONE_SENTINEL'] },
                10: { name: '龙族巢穴', background: '#4B0082', enemies: ['DRAGON', 'DRAGON_WHELP', 'DRACONIC_GUARD'] },
                // 11-20 关卡主题
                11: { name: '时空裂隙', background: '#9932CC', enemies: ['SHADOW_BEAST', 'ETHEREAL_WISP', 'TIME_WALKER'] },
                15: { name: '元素交汇', background: '#3CB371', enemies: ['FIRE_ELEMENTAL', 'ICE_ELEMENTAL', 'EARTH_ELEMENTAL', 'WIND_SERPENT'] },
                20: { name: '虚空边境', background: '#000000', enemies: ['VOID_ANOMALY', 'DARK_MATTER', 'REALITY_WEAVER'] },
                // 21+ 为随机或特殊主题
            };
        }

        getTheme(level) {
            // 对于超过定义范围的关卡，返回基于关卡数的随机主题
            if (this.themes[level]) {
                return this.themes[level];
            } else if (level > 20) {
                // 基于关卡数生成伪随机主题
                const themes = [
                    { name: '混沌领域', background: '#696969', enemies: [] },
                    { name: '星辰大海', background: '#191970', enemies: [] },
                    { name: '量子迷宫', background: '#4B0082', enemies: [] },
                    { name: '维度裂痕', background: '#8A2BE2', enemies: [] },
                    { name: '终极挑战', background: '#000000', enemies: [] }
                ];
                const index = (level - 21) % themes.length;
                return themes[index];
            }
            return this.themes[1]; // 默认主题
        }
    }

    // 创建全局主题系统实例
    window.levelThemeSystem = new LevelThemeSystem();

    // 8. 扩展游戏统计数据
    function initializeExpandedStats() {
        if (typeof gameState !== 'undefined') {
            if (!gameState.extendedStats) {
                gameState.extendedStats = {
                    // 武器相关统计
                    weaponsAcquired: 0,
                    weaponsUsed: {},
                    rareWeaponsAcquired: 0,
                    epicWeaponsAcquired: 0,
                    legendaryWeaponsAcquired: 0,
                    mythicWeaponsAcquired: 0,

                    // 敌人相关统计
                    enemiesDefeatedByType: {},
                    bossesDefeated: 0,
                    elitesDefeated: 0,

                    // 特殊行动统计
                    potionsUsed: 0,
                    relicsCollected: 0,
                    skillsUsed: { Q: 0, W: 0, E: 0, R: 0 },
                    maxSingleHitDamage: 0,
                    fastestLevelTime: {},

                    // 连击统计
                    longestCombo: 0,
                    totalComboDamage: 0,

                    // 存活相关统计
                    timesRevived: 0,
                    lowestHpSurvived: 100,

                    // 总体游戏统计
                    gamesPlayed: 0,
                    gamesWon: 0,
                    totalPlayTime: 0,
                    currentSessionStartTime: Date.now()
                };
            }
        }
    }

    // 初始化扩展统计
    initializeExpandedStats();

    // 9. 添加新游戏模式
    class GameModeManager {
        constructor() {
            this.modes = {
                'classic': { name: '经典模式', description: '标准游戏体验' },
                'survival': { name: '生存模式', description: '无限波次挑战' },
                'speedrun': { name: '速通模式', description: '尽快到达指定关卡' },
                'weapon_master': { name: '武器大师', description: '必须使用指定武器完成挑战' },
                'ironman': { name: '铁人模式', description: '一次机会，失败即结束' }
            };
            this.currentMode = 'classic';
        }

        setMode(mode) {
            if (this.modes[mode]) {
                this.currentMode = mode;
                console.log(`游戏模式已切换至: ${this.modes[mode].name}`);
                showEnhancedCombatLog(`🎮 游戏模式: ${this.modes[mode].name}`, 'system');
                return true;
            }
            return false;
        }

        getCurrentMode() {
            return this.modes[this.currentMode];
        }
    }

    // 创建游戏模式管理器实例
    window.gameModeManager = new GameModeManager();

    // 10. 最后输出统计信息
    console.log("游戏内容扩展模块已完全加载");
    console.log(`总计武器数量: ${typeof WEAPONS !== 'undefined' ? WEAPONS.length : 'N/A'}`);
    console.log(`总计敌人类型: ${typeof ENEMY_TYPES !== 'undefined' ? Object.keys(ENEMY_TYPES).length : 'N/A'}`);

} else {
    console.log("游戏内容扩展模块已存在，跳过重复加载");
}