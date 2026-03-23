// ==================== 游戏内容扩展 ====================
//
// 该扩展包含：
// 1. 新增大量武器类型
// 2. 新增更多敌人类型
// 3. 新增高级成就
// 4. 新增特殊道具和效果

// 新增武器（史诗级别）
const ADDITIONAL_EPIC_WEAPONS = [
    { name: '时光倒流剑', damage: 53, rarity: 'epic', color: '#7B68EE', effect: 'time_reverse', desc: '有时能使敌人倒退一秒' },
    { name: '虚无之刃', damage: 54, rarity: 'epic', color: '#4B0082', effect: 'phase_through', desc: '偶尔穿透敌人' },
    { name: '雷神之锤', damage: 55, rarity: 'epic', color: '#B0C4DE', effect: 'chain_lightning', desc: '攻击可能引发连锁闪电' },
    { name: '海神三叉戟', damage: 56, rarity: 'epic', color: '#20B2AA', effect: 'tidal_wave', desc: '攻击产生冲击波' },
    { name: '风暴使者', damage: 57, rarity: 'epic', color: '#87CEEB', effect: 'wind_boost', desc: '增加移动速度' },
    { name: '冰霜女王', damage: 58, rarity: 'epic', color: '#B0E0E6', effect: 'freeze', desc: '有几率冻结敌人' },
    { name: '烈焰君主', damage: 59, rarity: 'epic', color: '#FF4500', effect: 'burn', desc: '造成持续燃烧伤害' },
    { name: '自然之怒', damage: 60, rarity: 'epic', color: '#228B22', effect: 'poison', desc: '造成毒素伤害' },
    { name: '暗物质匕首', damage: 61, rarity: 'epic', color: '#000000', effect: 'gravity_well', desc: '吸引附近敌人' },
    { name: '光明制裁者', damage: 62, rarity: 'epic', color: '#FFFFFF', effect: 'holy_blast', desc: '对黑暗敌人造成额外伤害' },
];

// 新增武器（传说级别）
const ADDITIONAL_LEGENDARY_WEAPONS = [
    { name: '创世之柱', damage: 75, rarity: 'legendary', color: '#FFD700', effect: 'creation_field', desc: '周围持续生成有益能量' },
    { name: '混沌之核', damage: 76, rarity: 'legendary', color: '#FF00FF', effect: 'chaos_orb', desc: '发射混乱球体' },
    { name: '审判日', damage: 77, rarity: 'legendary', color: '#FFFFFF', effect: 'judgment_day', desc: '周期性审判范围内敌人' },
    { name: '世界之树', damage: 78, rarity: 'legendary', color: '#32CD32', effect: 'life_bloom', desc: '持续恢复生命值' },
    { name: '虚无缥缈', damage: 79, rarity: 'legendary', color: '#F8F8FF', effect: 'intangibility', desc: '短暂无敌效果' },
    { name: '造物之主', damage: 80, rarity: 'legendary', color: '#FFD700', effect: 'creation', desc: '能创造临时盟友' },
    { name: '末日使者', damage: 81, rarity: 'legendary', color: '#8B0000', effect: 'apocalypse', desc: '蓄力后毁灭一片区域' },
    { name: '永恒大帝', damage: 82, rarity: 'legendary', color: '#4169E1', effect: 'eternity', desc: '大幅延长所有增益效果' },
    { name: '宇宙之心', damage: 83, rarity: 'legendary', color: '#0000FF', effect: 'cosmic_resonance', desc: '与宇宙共鸣，增强所有属性' },
    { name: '多元掌控', damage: 84, rarity: 'legendary', color: '#9370DB', effect: 'dimensional_control', desc: '能够操控维度力量' },
];

// 新增武器（神话级别）
const ADDITIONAL_MYTHIC_WEAPONS = [
    { name: '概念抹除者', damage: 1400, rarity: 'mythic', color: '#9400D3', effect: 'conceptual_erasure', desc: '从概念层面抹除敌人' },
    { name: '维度支配者', damage: 1350, rarity: 'mythic', color: '#4682B4', effect: 'dimensional_dominion', desc: '掌控多个维度的力量' },
    { name: '现实扭曲器', damage: 1200, rarity: 'mythic', color: '#FF69B4', effect: 'reality_distortion', desc: '扭曲现实规则' },
    { name: '宇宙起源', damage: 1500, rarity: 'mythic', color: '#000000', effect: 'origin_of_universe', desc: '重现宇宙诞生的力量' },
    { name: '存在意义', damage: 1300, rarity: 'mythic', color: '#0000FF', effect: 'meaning_of_existence', desc: '揭示存在的真谛并摧毁非存在' },
    { name: '绝对零度', damage: 1100, rarity: 'mythic', color: '#87CEEB', effect: 'absolute_zero', desc: '将一切降至绝对零度' },
    { name: '时间之主', damage: 1600, rarity: 'mythic', color: '#9370DB', effect: 'lord_of_time', desc: '掌控时间的流动' },
    { name: '空间之王', damage: 1550, rarity: 'mythic', color: '#4169E1', effect: 'king_of_space', desc: '掌控空间的形态' },
    { name: '虚无之神', damage: 1700, rarity: 'mythic', color: '#2F4F4F', effect: 'god_of_void', desc: '化身虚无，超越存在' },
    { name: '无限手套', damage: 2000, rarity: 'mythic', color: '#8A2BE2', effect: 'infinity_gauntlet', desc: '拥有无限的力量' },
];

// 新增敌人类型
const ADDITIONAL_ENEMY_TYPES = {
    // 机械系敌人
    ROBOT: { name: '机器人', speed: 0.9, hp: 2.0, damage: 1.8, size: 1.6, behavior: 'mechanical', element: 'metal' },
    CYBORG: { name: '半机械人', speed: 1.4, hp: 2.5, damage: 2.2, size: 1.8, behavior: 'hybrid', element: 'metal' },
    DRONE: { name: '无人机', speed: 2.0, hp: 0.8, damage: 1.2, size: 0.8, behavior: 'flying', element: 'metal' },
    TURRET: { name: '炮塔', speed: 0.0, hp: 1.5, damage: 2.5, size: 1.2, behavior: 'stationary', element: 'metal' },

    // 神话系敌人
    ANGEL: { name: '天使', speed: 1.2, hp: 3.0, damage: 2.8, size: 2.0, behavior: 'divine', element: 'holy' },
    DEMIGOD: { name: '半神', speed: 0.8, hp: 6.0, damage: 3.5, size: 2.5, behavior: 'divine', element: 'divine' },
    DRAGON_KING: { name: '龙王', speed: 0.7, hp: 7.0, damage: 4.0, size: 3.0, behavior: 'dragon', element: 'dragon' },

    // 稀有变种敌人
    ZOMBIE: { name: '僵尸', speed: 0.4, hp: 2.2, damage: 1.4, size: 1.3, behavior: 'undead', element: 'undead' },
    ORGE: { name: '食人魔', speed: 0.6, hp: 4.0, damage: 2.8, size: 2.2, behavior: 'brute', element: 'earth' },

    // 飞行敌人
    PHOENIX: { name: '凤凰', speed: 1.5, hp: 2.5, damage: 3.0, size: 1.8, behavior: 'flying', element: 'fire' },
    GRIFFIN: { name: '狮鹫', speed: 1.6, hp: 3.2, damage: 2.6, size: 2.0, behavior: 'flying', element: 'air' },
    BASILISK: { name: '蛇怪', speed: 0.9, hp: 4.5, damage: 3.2, size: 1.9, behavior: 'gaze', element: 'poison' },
    KRAKEN: { name: '北海巨妖', speed: 0.3, hp: 8.0, damage: 4.5, size: 3.5, behavior: 'tentacles', element: 'water' },

    // 稀有精英变种
    UNICORN: { name: '独角兽', speed: 1.8, hp: 3.5, damage: 2.5, size: 1.7, behavior: 'divine', element: 'holy' },
};

// 新增药水类型
const ADDITIONAL_POTIONS = [
    { name: '传送药水', effect: 'teleport', value: 1, color: '#9370DB', desc: '瞬间传送到随机位置' },
    { name: '时间减缓', effect: 'slow_time', duration: 5, color: '#4169E1', desc: '减缓周围敌人时间' },
    { name: '护盾超载', effect: 'shield_overflow', value: 50, color: '#00BFFF', desc: '获得超大护盾' },
    { name: '元素精通', effect: 'elemental_mastery', duration: 10, value: 2, color: '#32CD32', desc: '元素伤害翻倍' },
    { name: '暴击专精', effect: 'crit_mastery', duration: 8, value: 0.3, color: '#FF4500', desc: '暴击率大幅提升' },
    { name: '反伤护盾', effect: 'thorns_shield', duration: 6, value: 0.2, color: '#8A2BE2', desc: '反弹部分伤害给攻击者' },
    { name: '吸血光环', effect: 'vampire_aura', duration: 7, value: 0.15, color: '#8B0000', desc: '攻击时恢复部分生命' },
    { name: '元素转换', effect: 'element_convert', value: 1, color: '#FFD700', desc: '临时改变武器元素属性' },
    { name: '抗性提升', effect: 'resistance_up', duration: 10, value: 0.5, color: '#20B2AA', desc: '减少受到的伤害' },
    { name: '敏捷提升', effect: 'agility_boost', duration: 8, value: 1.5, color: '#98FB98', desc: '大幅提升移动速度和闪避' },
];

// 新增遗物类型
const ADDITIONAL_RELICS = [
    { name: '时空沙漏', effect: 'time_dilation', desc: '偶尔减缓游戏时间' },
    { name: '元素核心', effect: 'elemental_synergy', desc: '元素攻击产生额外效果' },
    { name: '生命之种', effect: 'life_regeneration', desc: '持续缓慢恢复生命值' },
    { name: '量子护盾', effect: 'quantum_shield', desc: '有机会完全抵消一次攻击' },
    { name: '命运之骰', effect: 'dice_fate', desc: '随机获得正面效果' },
    { name: '灵魂链接', effect: 'soul_link', desc: '将部分伤害转移到附近的敌人' },
    { name: '无限循环', effect: 'infinite_loop', desc: '有时技能效果会被复制' },
    { name: '虚无之盒', effect: 'void_box', desc: '可以储存一个物品供以后使用' },
];

// 新增成就
const ADDITIONAL_ACHIEVEMENTS = [
    { id: 'quantum_mechanic', name: '量子机械师', description: '使用量子护盾完全抵消10次攻击', condition: 'quantumShieldBlocks >= 10' },
    { id: 'time_lord', name: '时间领主', description: '使用时空沙漏减缓时间累计60秒', condition: 'timeDilatedSeconds >= 60' },
    { id: 'elemental_adept', name: '元素专家', description: '使用元素精通药水并击杀20个敌人', condition: 'elementalMasteryKills >= 20' },
    { id: 'mythic_treasure', name: '神话宝藏', description: '同时拥有3件神话武器', condition: 'mythicTreasure' },
    { id: 'boss_annihilator', name: 'Boss歼灭者', description: '连续击败5个Boss', condition: 'bossAnnihilation' },
    { id: 'combo_destroyer', name: '连击破坏者', description: '单次攻击击败5个以上敌人', condition: 'massDestruction' },
    { id: 'invincible_run', name: '无敌之旅', description: '达到第30关且从未生命值归零', condition: 'invincibleRun' },
    { id: 'elemental_mastery', name: '元素掌握', description: '使用所有元素类型的武器各击杀10个敌人', condition: 'elementalMasteryComplete' },
];

// 将新增内容合并到主游戏中
function mergeAdditionalContent() {
    console.log('正在合并额外游戏内容...');

    // 合并武器
    if (typeof WEAPONS !== 'undefined') {
        WEAPONS.push(...ADDITIONAL_EPIC_WEAPONS, ...ADDITIONAL_LEGENDARY_WEAPONS, ...ADDITIONAL_MYTHIC_WEAPONS);
        console.log('✓ 添加了新的武器类型');
    } else {
        console.warn('警告: WEAPONS 数组未找到，无法添加新武器');
    }

    // 合并敌人类型
    if (typeof ENEMY_TYPES !== 'undefined') {
        Object.assign(ENEMY_TYPES, ADDITIONAL_ENEMY_TYPES);
        console.log('✓ 添加了新的敌人类型');
    } else {
        console.warn('警告: ENEMY_TYPES 对象未找到，无法添加新敌人');
    }

    // 合并药水
    if (typeof POTIONS !== 'undefined') {
        POTIONS.push(...ADDITIONAL_POTIONS);
        console.log('✓ 添加了新的药水类型');
    } else {
        console.warn('警告: POTIONS 数组未找到，无法添加新药水');
    }

    // 合并遗物
    if (typeof RELICS !== 'undefined') {
        RELICS.push(...ADDITIONAL_RELICS);
        console.log('✓ 添加了新的遗物类型');
    } else {
        console.warn('警告: RELICS 数组未找到，无法添加新遗物');
    }

    // 合并成就
    if (typeof enhancedAchievementSystem !== 'undefined') {
        enhancedAchievementSystem.achievementList.push(...ADDITIONAL_ACHIEVEMENTS);
        console.log('✓ 添加了新的成就');
    } else {
        console.warn('警告: 增强版成就系统未找到，无法添加新成就');
    }

    console.log('额外游戏内容合并完成！');
}

// 如果游戏系统已加载，则立即合并
if (typeof window !== 'undefined' && window.gameLoaded) {
    mergeAdditionalContent();
} else {
    // 否则等待游戏加载完成后再合并
    window.addEventListener('load', () => {
        setTimeout(mergeAdditionalContent, 1000);
    });
}

// 导出合并函数，以便在其他地方调用
window.mergeAdditionalContent = mergeAdditionalContent;