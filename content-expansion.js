// ==================== 游戏内容扩展 ====================
//
// 该模块用于扩展游戏内容，包括：
// 1. 添加新武器类型
// 2. 添加新敌人类型
// 3. 扩展关卡里程碑系统

// 检查是否已加载，防止重复加载
if (typeof CONTENT_EXPANSION_LOADED === 'undefined') {
    window.CONTENT_EXPANSION_LOADED = true;

    console.log("游戏内容扩展模块已加载");

    // 1. 扩展武器库
    // 添加更多种类的武器，丰富游戏体验
    const NEW_WEAPONS = [
        // 新增普通武器
        { name: '生锈的链锯', damage: 8, rarity: 'common', color: '#696969' },
        { name: '破损的鱼叉', damage: 9, rarity: 'common', color: '#4682B4' },
        { name: '木制标枪', damage: 7, rarity: 'common', color: '#8B4513' },
        { name: '废弃的撬棍', damage: 6, rarity: 'common', color: '#A9A9A9' },
        { name: '破旧的警棍', damage: 5, rarity: 'common', color: '#2F4F4F' },

        // 新增不常见武器
        { name: '镀金匕首', damage: 18, rarity: 'uncommon', color: '#FFD700' },
        { name: '附魔长剑', damage: 20, rarity: 'uncommon', color: '#9370DB' },
        { name: '精灵战斧', damage: 22, rarity: 'uncommon', color: '#32CD32' },
        { name: '矮人战锤', damage: 21, rarity: 'uncommon', color: '#CD853F' },
        { name: '猎鹰爪', damage: 19, rarity: 'uncommon', color: '#696969' },
        { name: '月光刃', damage: 23, rarity: 'uncommon', color: '#F0F8FF' },
        { name: '火焰鞭', damage: 24, rarity: 'uncommon', color: '#FF4500' },
        { name: '冰霜钉锤', damage: 22, rarity: 'uncommon', color: '#87CEFA' },

        // 新增稀有武器
        { name: '雷神之锤', damage: 38, rarity: 'rare', color: '#F0E68C' },
        { name: '地狱烈焰剑', damage: 40, rarity: 'rare', color: '#B22222' },
        { name: '极地冰晶弓', damage: 42, rarity: 'rare', color: '#AFEEEE' },
        { name: '暗影猎手刃', damage: 44, rarity: 'rare', color: '#2F4F4F' },
        { name: '神圣裁决剑', damage: 46, rarity: 'rare', color: '#FFD700' },
        { name: '龙骨战戟', damage: 48, rarity: 'rare', color: '#8FBC8F' },
        { name: '星辰破晓刃', damage: 50, rarity: 'rare', color: '#9370DB' },
        { name: '海洋之心叉', damage: 45, rarity: 'rare', color: '#4169E1' },
        { name: '风之祝福刃', damage: 43, rarity: 'rare', color: '#98FB98' },
        { name: '大地守护锤', damage: 47, rarity: 'rare', color: '#8B4513' },

        // 新增史诗武器
        { name: '虚无吞噬者', damage: 55, rarity: 'epic', color: '#4B0082' },
        { name: '时空扭曲刃', damage: 58, rarity: 'epic', color: '#9932CC' },
        { name: '元素支配者', damage: 60, rarity: 'epic', color: '#3CB371' },
        { name: '灵魂收割镰', damage: 62, rarity: 'epic', color: '#2F4F4F' },
        { name: '创世之钥', damage: 65, rarity: 'epic', color: '#FFD700' },
        { name: '天罚降临锤', damage: 68, rarity: 'epic', color: '#FFE4E1' },
        { name: '万雷之怒', damage: 70, rarity: 'epic', color: '#DDA0DD' },
        { name: '星辰毁灭炮', damage: 72, rarity: 'epic', color: '#483D8B' },
        { name: '宇宙法则印', damage: 75, rarity: 'epic', color: '#BA55D3' },
        { name: '命运编织针', damage: 78, rarity: 'epic', color: '#FF69B4' },

        // 新增传说武器
        { name: '万物归一剑', damage: 90, rarity: 'legendary', color: '#F0F8FF' },
        { name: '宇宙起源刃', damage: 95, rarity: 'legendary', color: '#7B68EE' },
        { name: '神王之怒', damage: 100, rarity: 'legendary', color: '#FFB6C1' },
        { name: '终焉审判刃', damage: 105, rarity: 'legendary', color: '#000000' },
        { name: '虚无之主', damage: 110, rarity: 'legendary', color: '#663399' },
        { name: '创世纪元枪', damage: 115, rarity: 'legendary', color: '#FFD700' },
        { name: '混沌之眼', damage: 120, rarity: 'legendary', color: '#191970' },
        { name: '天道轮回盘', damage: 125, rarity: 'legendary', color: '#8A2BE2' },

        // 新增神话武器
        { name: '概念本源', damage: 200, rarity: 'mythic', color: '#FF00FF' },
        { name: '现实重构器', damage: 300, rarity: 'mythic', color: '#00FFFF' },
        { name: '维度统治者', damage: 400, rarity: 'mythic', color: '#FF1493' },
        { name: '超验真理', damage: 500, rarity: 'mythic', color: '#9370DB' },
        { name: '万物之理', damage: 600, rarity: 'mythic', color: '#32CD32' },
        { name: '道法自然', damage: 700, rarity: 'mythic', color: '#228B22' },
        { name: '太极两仪剑', damage: 800, rarity: 'mythic', color: '#000000' },
        { name: '无极至尊刃', damage: 900, rarity: 'mythic', color: '#FFFFFF' }
    ];

    // 将新武器合并到原武器库中
    if (typeof WEAPONS !== 'undefined') {
        WEAPONS.push(...NEW_WEAPONS);
        console.log(`新增了 ${NEW_WEAPONS.length} 种武器`);
    }

    // 2. 扩展敌人类型
    const NEW_ENEMY_TYPES = {
        // 陆地系列敌人
        'TITAN': { name: '泰坦巨人', speed: 0.5, hp: 10.0, damage: 5.0, size: 5.0, behavior: 'melee' }, // 超大型近战敌人
        'GARGANTUA': { name: '加根亚图阿', speed: 0.3, hp: 12.0, damage: 6.0, size: 6.0, behavior: 'ranged' }, // 最大型远程敌人

        // 空中系列敌人
        'ROC': { name: '大鹏金翅鸟', speed: 2.5, hp: 2.0, damage: 3.0, size: 1.8, behavior: 'ranged' }, // 高速空中单位
        'THUNDER_BIRD': { name: '雷鸟', speed: 3.0, hp: 1.5, damage: 3.5, size: 1.5, behavior: 'ranged' }, // 极速雷电攻击

        // 神话系列敌人
        'ENT': { name: '树人', speed: 0.8, hp: 7.0, damage: 2.5, size: 2.8, behavior: 'melee' }, // 自然守护者
        'IFRIT': { name: '火灵', speed: 1.8, hp: 1.5, damage: 4.0, size: 1.4, behavior: 'ranged' }, // 火元素精灵
        'AQUA_SPIRIT': { name: '水灵', speed: 1.2, hp: 2.0, damage: 2.0, size: 1.2, behavior: 'ranged' }, // 水元素精灵
        'GUST_SERPENT': { name: '风蛇', speed: 2.8, hp: 1.2, damage: 2.8, size: 1.1, behavior: 'ranged' }, // 风元素生物
        'STONE_GUARDIAN': { name: '土灵守护者', speed: 0.4, hp: 8.0, damage: 3.5, size: 2.6, behavior: 'melee' }, // 土元素守卫

        // 新增特殊敌人
        'SPECTRAL_WARRIOR': { name: '幽灵战士', speed: 2.0, hp: 0.8, damage: 4.5, size: 0.9, behavior: 'melee' }, // 穿透伤害的幽灵单位
        'PSYCHIC_BEAST': { name: '心灵兽', speed: 1.6, hp: 1.8, damage: 3.2, size: 1.6, behavior: 'ranged' }, // 精神攻击生物
        'MAGMA_WORM': { name: '岩浆蠕虫', speed: 0.9, hp: 5.0, damage: 2.5, size: 2.3, behavior: 'melee' }, // 地下穿行生物
        'CLOCKWORK_SOLDIER': { name: '发条士兵', speed: 1.2, hp: 2.5, damage: 2.0, size: 1.3, behavior: 'ranged' }, // 机械单位
        'VINE_ENTANGLEMENT': { name: '藤蔓纠缠', speed: 0.2, hp: 4.0, damage: 1.5, size: 1.8, behavior: 'support' }, // 控制型植物敌人
    };

    // 将新敌人类型合并到原敌人类型中
    if (typeof ENEMY_TYPES !== 'undefined') {
        Object.assign(ENEMY_TYPES, NEW_ENEMY_TYPES);
        console.log(`新增了 ${Object.keys(NEW_ENEMY_TYPES).length} 种敌人类型`);
    }

    // 3. 扩展里程碑系统
    // 扩展里程碑列表，增加更多特殊关卡事件
    if (typeof MilestoneSystem !== 'undefined' && typeof MilestoneSystem.milestones !== 'undefined') {
        const NEW_MILESTONES = [
            // 奇数关里程碑
            { level: 25, name: '古代遗迹', description: '古代遗迹关卡，敌人属性大幅提升', condition: 'level >= 25', reward: { hpBonus: 20 } },
            { level: 35, name: '龙族巢穴', description: '遭遇龙族的强大挑战', condition: 'level >= 35', reward: { damageBonus: 0.5 } },
            { level: 45, name: '元素领域', description: '四大元素的力量在此汇聚', condition: 'level >= 45', reward: { speedBonus: 0.5 } },

            // 特殊里程碑事件
            { level: 28, name: '时空裂缝', description: '时空出现裂缝，随机出现强力敌人', condition: 'level >= 28', reward: { damageBonus: 0.3 } },
            { level: 33, name: '亡灵觉醒', description: '夜晚降临，亡灵开始复苏', condition: 'level >= 33', reward: { hpBonus: 15 } },
            { level: 38, name: '神域入口', description: '传说中的神域入口打开，危险而充满机遇', condition: 'level >= 38', reward: { damageBonus: 0.4 } },
            { level: 42, name: '混乱之巅', description: '秩序与混乱的较量，敌人变得难以预测', condition: 'level >= 42', reward: { speedBonus: 0.3 } },
            { level: 48, name: '终焉之路', description: '接近游戏的终点，敌人是最强大的挑战', condition: 'level >= 48', reward: { hpBonus: 25, damageBonus: 0.5 } },
        ];

        // 将新里程碑添加到现有里程碑中
        MilestoneSystem.milestones.push(...NEW_MILESTONES);
        console.log(`新增了 ${NEW_MILESTONES.length} 个里程碑事件`);

        // 按等级排序里程碑
        MilestoneSystem.milestones.sort((a, b) => a.level - b.level);
    }

    // 4. 添加关卡特殊事件系统
    class SpecialEventSystem {
        constructor() {
            this.events = {};
            this.registerSpecialEvents();
        }

        registerSpecialEvents() {
            // 注册特定关卡的特殊事件
            this.events[15] = () => this.level15Event();
            this.events[25] = () => this.level25Event();
            this.events[35] = () => this.level35Event();
            this.events[45] = () => this.level45Event();
        }

        // 15关特殊事件：敌人爆发
        level15Event() {
            showCombatLog("⚠️ 第15关！敌人力量爆发！", "enemy-spawn");
            // 临时增加敌人生成速率
            gameState.enemySpawnRate *= 1.5;
            setTimeout(() => {
                gameState.enemySpawnRate /= 1.5;
            }, 15000); // 15秒后恢复正常
        }

        // 25关特殊事件：精英部队
        level25Event() {
            showCombatLog("⚔️ 第25关！精英部队来袭！", "enemy-spawn");
            // 暂时提高精英敌人生成概率
            gameState.eliteSpawnBoost = true;
            setTimeout(() => {
                gameState.eliteSpawnBoost = false;
            }, 20000); // 20秒后恢复正常
        }

        // 35关特殊事件：元素风暴
        level35Event() {
            showCombatLog("🌪️ 第35关！元素风暴肆虐！", "enemy-spawn");
            // 暂时提高元素类敌人生成概率
            gameState.elementalSpawnBoost = true;
            setTimeout(() => {
                gameState.elementalSpawnBoost = false;
            }, 25000); // 25秒后恢复正常
        }

        // 45关特殊事件：最终试炼
        level45Event() {
            showCombatLog("🔥 第45关！最终试炼开始！", "enemy-spawn");
            // 提高所有敌人的属性
            gameState.finalTrial = true;
            setTimeout(() => {
                gameState.finalTrial = false;
            }, 30000); // 30秒后恢复正常
        }

        // 检查是否应该触发特殊事件
        checkEvent(level) {
            if (this.events[level]) {
                this.events[level]();
            }
        }
    }

    // 创建特殊事件系统实例
    window.specialEventSystem = new SpecialEventSystem();

    // 修改关卡升级函数以包含特殊事件检查
    if (typeof handleLevelUp !== 'undefined') {
        const originalHandleLevelUp = handleLevelUp;

        window.handleLevelUp = function() {
            originalHandleLevelUp(); // 执行原有逻辑

            // 检查特殊事件
            if (specialEventSystem) {
                specialEventSystem.checkEvent(gameState.level);
            }
        };
    }

    // 5. 添加新的药水类型
    if (typeof POTIONS !== 'undefined') {
        const NEW_POTIONS = [
            { name: '速度药水', effect: 'speed', value: 1.5, duration: 10000, color: '#87CEEB', rarity: 'rare' },
            { name: '力量药水+', effect: 'damage', value: 2.0, duration: 8000, color: '#FF6347', rarity: 'epic' },
            { name: '再生药水', effect: 'regen', value: 2, duration: 15000, color: '#32CD32', rarity: 'epic' },
            { name: '反击药水', effect: 'counter', value: 0.5, duration: 10000, color: '#4169E1', rarity: 'rare' },
            { name: '护盾药水', effect: 'shield', value: 50, duration: 12000, color: '#FFD700', rarity: 'legendary' },
            { name: '真实伤害药水', effect: 'true_damage', value: 10, duration: 5000, color: '#FF00FF', rarity: 'mythic' }
        ];

        POTIONS.push(...NEW_POTIONS);
        console.log(`新增了 ${NEW_POTIONS.length} 种药水`);
    }

    console.log("游戏内容扩展模块已完全加载");
} else {
    console.log("游戏内容扩展模块已存在，跳过重复加载");
}