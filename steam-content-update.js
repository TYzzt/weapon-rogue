// ==================== Steam发布内容更新 ====================
//
// 为Steam发布准备的额外内容更新，包括：
// 1. 新增敌人类型
// 2. 扩展武器库
// 3. 新增遗物系统
// 4. 增加关卡事件

// 检查是否已经加载过
if (typeof STEAM_CONTENT_UPDATE_LOADED === 'undefined') {
    window.STEAM_CONTENT_UPDATE_LOADED = true;

    console.log("Steam内容更新模块已加载");

    // 1. 扩展敌人类型
    const EXTRA_ENEMY_TYPES = {
        // 稀有精英敌人
        'RARE_MELEE': {
            name: '精英剑士',
            speed: 1.5,
            hp: 8.0,
            damage: 4.0,
            size: 2.0,
            behavior: 'melee',
            color: '#FFD700' // 金色表示稀有
        },
        'RARE_RANGED': {
            name: '狙击手',
            speed: 1.2,
            hp: 4.0,
            damage: 6.0,
            size: 1.5,
            behavior: 'ranged',
            color: '#FFD700'
        },
        'RARE_SUPPORT': {
            name: '治疗师',
            speed: 0.8,
            hp: 5.0,
            damage: 2.0,
            size: 1.4,
            behavior: 'support',
            color: '#FFD700'
        },

        // Boss敌人
        'MINI_BOSS': {
            name: '精英队长',
            speed: 1.0,
            hp: 15.0,
            damage: 5.0,
            size: 3.0,
            behavior: 'melee',
            color: '#FF4500', // 橙色表示小型Boss
            isBoss: true
        },
        'REGULAR_BOSS': {
            name: '领主',
            speed: 0.8,
            hp: 30.0,
            damage: 8.0,
            size: 4.0,
            behavior: 'mixed', // 混合攻击方式
            color: '#8B0000', // 深红色表示Boss
            isBoss: true
        },
        'EPIC_BOSS': {
            name: '领主之王',
            speed: 0.7,
            hp: 60.0,
            damage: 12.0,
            size: 5.0,
            behavior: 'mixed', // 多种攻击方式
            color: '#9932CC', // 紫色表示史诗Boss
            isBoss: true
        },

        // 特殊机制敌人
        'SPLITTER': {
            name: '分裂体',
            speed: 1.0,
            hp: 3.0,
            damage: 2.0,
            size: 1.0,
            behavior: 'melee',
            color: '#00CED1',
            splitsOnDeath: true, // 死亡时分裂成小敌人
            splitInto: 'SMALL_SPLITTER'
        },
        'SMALL_SPLITTER': {
            name: '分裂碎片',
            speed: 2.0,
            hp: 1.0,
            damage: 1.0,
            size: 0.5,
            behavior: 'melee',
            color: '#20B2AA'
        },

        // 环境敌人
        'SPIKE_TRAP': {
            name: '尖刺陷阱',
            speed: 0.0,
            hp: 10.0,
            damage: 3.0,
            size: 1.8,
            behavior: 'stationary',
            color: '#2F4F4F',
            isStationary: true
        },
        'POISON_CLOUD': {
            name: '毒雾',
            speed: 0.5,
            hp: 2.0,
            damage: 1.0,
            size: 2.5,
            behavior: 'area',
            color: '#32CD32',
            appliesPoison: true
        }
    };

    // 将新敌人类型合并到原敌人类型中
    if (typeof ENEMY_TYPES !== 'undefined') {
        Object.assign(ENEMY_TYPES, EXTRA_ENEMY_TYPES);
        console.log(`新增了 ${Object.keys(EXTRA_ENEMY_TYPES).length} 种敌人类型`);
    }

    // 2. 扩展武器库 - 增加更多武器类型
    const ADDITIONAL_WEAPONS = [
        // 新增普通武器
        { name: '废料短剑', damage: 8, rarity: 'common', color: '#696969' },
        { name: '生锈的战斧', damage: 10, rarity: 'common', color: '#808080' },
        { name: '破损的战锤', damage: 9, rarity: 'common', color: '#A9A9A9' },
        { name: '木制飞镖', damage: 6, rarity: 'common', color: '#8B4513' },
        { name: '破布长鞭', damage: 7, rarity: 'common', color: '#8FBC8F' },

        // 新增不常见武器
        { name: '钢制长刀', damage: 18, rarity: 'uncommon', color: '#C0C0C0' },
        { name: '精灵短弓', damage: 17, rarity: 'uncommon', color: '#228B22' },
        { name: '矮人战斧', damage: 20, rarity: 'uncommon', color: '#8B4513' },
        { name: '附魔匕首', damage: 19, rarity: 'uncommon', color: '#4169E1' },
        { name: '炼金短杖', damage: 16, rarity: 'uncommon', color: '#9370DB' },
        { name: '猎人格斗刀', damage: 21, rarity: 'uncommon', color: '#654321' },
        { name: '盗贼钩刃', damage: 18, rarity: 'uncommon', color: '#708090' },
        { name: '工匠锤', damage: 15, rarity: 'uncommon', color: '#696969' },
        { name: '游侠长鞭', damage: 19, rarity: 'uncommon', color: '#2E8B57' },
        { name: '学者法杖', damage: 17, rarity: 'uncommon', color: '#4682B4' },

        // 新增稀有武器
        { name: '雷鸣战锤', damage: 35, rarity: 'rare', color: '#FFFF00' },
        { name: '冰雪法杖', damage: 37, rarity: 'rare', color: '#87CEEB' },
        { name: '烈焰之剑', damage: 40, rarity: 'rare', color: '#FF4500' },
        { name: '暗影匕首', damage: 38, rarity: 'rare', color: '#4B0082' },
        { name: '圣光十字弓', damage: 42, rarity: 'rare', color: '#F0E68C' },
        { name: '龙鳞战斧', damage: 44, rarity: 'rare', color: '#FF6347' },
        { name: '星辰长杖', damage: 45, rarity: 'rare', color: '#8A2BE2' },
        { name: '风暴战锤', damage: 43, rarity: 'rare', color: '#7CFC00' },
        { name: '血月镰刀', damage: 46, rarity: 'rare', color: '#8B0000' },
        { name: '翡翠刃', damage: 41, rarity: 'rare', color: '#00FF7F' },
        { name: '紫金权杖', damage: 42, rarity: 'rare', color: '#DA70D6' },
        { name: '极地之矛', damage: 44, rarity: 'rare', color: '#E0FFFF' },
        { name: '熔岩巨剑', damage: 47, rarity: 'rare', color: '#FF4500' },
        { name: '星尘法杖', damage: 48, rarity: 'rare', color: '#FF69B4' },
        { name: '凤凰之羽扇', damage: 50, rarity: 'rare', color: '#FF6347' },
        { name: '雷电鞭', damage: 52, rarity: 'rare', color: '#00BFFF' },
        { name: '暗夜匕首', damage: 53, rarity: 'rare', color: '#000080' },
        { name: '圣洁之锤', damage: 51, rarity: 'rare', color: '#FFFFE0' },
        { name: '月光短剑', damage: 49, rarity: 'rare', color: '#ADD8E6' },
        { name: '荆棘长鞭', damage: 45, rarity: 'rare', color: '#228B22' },
        { name: '水晶战斧', damage: 54, rarity: 'rare', color: '#B0E0E6' },
        { name: '虚空之刃', damage: 55, rarity: 'rare', color: '#4B0082' },
        { name: '时光沙漏剑', damage: 56, rarity: 'rare', color: '#DAA520' },
        { name: '暴风之刃', damage: 49, rarity: 'rare', color: '#87CEEB' },
        { name: '海神三叉戟', damage: 52, rarity: 'rare', color: '#20B2AA' },
        { name: '龙血长矛', damage: 48, rarity: 'rare', color: '#FF6347' },
        { name: '雷神战斧', damage: 50, rarity: 'rare', color: '#B0C4DE' },
        { name: '精灵魔弓', damage: 46, rarity: 'rare', color: '#228B22' },
        { name: '恶魔权杖', damage: 53, rarity: 'rare', color: '#8B0000' },
        { name: '天使之翼', damage: 44, rarity: 'rare', color: '#F5FFFA' },
        { name: '冰霜之心', damage: 51, rarity: 'rare', color: '#E0F6FF' },

        // 新增史诗武器
        { name: '天罚之剑', damage: 62, rarity: 'epic', color: '#FFD700' },
        { name: '深渊之触', damage: 60, rarity: 'epic', color: '#483D8B' },
        { name: '永恒之火', damage: 64, rarity: 'epic', color: '#FF4500' },
        { name: '冰封王座', damage: 61, rarity: 'epic', color: '#87CEEB' },
        { name: '风暴之眼', damage: 66, rarity: 'epic', color: '#7CFC00' },
        { name: '灵魂收割者', damage: 69, rarity: 'epic', color: '#2F4F4F' },
        { name: '破晓之光', damage: 67, rarity: 'epic', color: '#FFFF00' },
        { name: '暮光之刃', damage: 65, rarity: 'epic', color: '#8A2BE2' },
        { name: '创世纪元', damage: 72, rarity: 'epic', color: '#FF1493' },
        { name: '宇宙法则', damage: 70, rarity: 'epic', color: '#9370DB' },
        { name: '龙王之怒', damage: 64, rarity: 'epic', color: '#FF4500' },
        { name: '风暴使者', damage: 69, rarity: 'epic', color: '#87CEEB' },
        { name: '时光守护者', damage: 74, rarity: 'epic', color: '#9370DB' },
        { name: '元素支配者', damage: 72, rarity: 'epic', color: '#3CB371' },
        { name: '灵魂收割镰', damage: 76, rarity: 'epic', color: '#2F4F4F' },
        { name: '创世之钥', damage: 79, rarity: 'epic', color: '#FFD700' },
        { name: '天罚降临锤', damage: 82, rarity: 'epic', color: '#FFE4E1' },
        { name: '万雷之怒', damage: 84, rarity: 'epic', color: '#DDA0DD' },
        { name: '星辰毁灭炮', damage: 86, rarity: 'epic', color: '#483D8B' },
        { name: '宇宙法则印', damage: 89, rarity: 'epic', color: '#BA55D3' },
        { name: '命运编织针', damage: 92, rarity: 'epic', color: '#FF69B4' },
        { name: '虚无吞噬者', damage: 95, rarity: 'epic', color: '#4B0082' },
        { name: '时空扭曲刃', damage: 98, rarity: 'epic', color: '#9932CC' },
        { name: '天道轮回盘', damage: 101, rarity: 'epic', color: '#8A2BE2' },
        { name: '混沌之眼', damage: 104, rarity: 'epic', color: '#191970' },
        { name: '创世纪元枪', damage: 107, rarity: 'epic', color: '#FFD700' },
        { name: '神王之怒', damage: 110, rarity: 'epic', color: '#FFB6C1' },
        { name: '终焉审判刃', damage: 113, rarity: 'epic', color: '#000000' },
        { name: '虚无之主', damage: 116, rarity: 'epic', color: '#663399' },
        { name: '万物归一剑', damage: 119, rarity: 'epic', color: '#F0F8FF' },

        // 新增传说武器
        { name: '宇宙起源刃', damage: 130, rarity: 'legendary', color: '#7B68EE' },
        { name: '混沌之刃', damage: 125, rarity: 'legendary', color: '#663399' },
        { name: '时光之刃', damage: 128, rarity: 'legendary', color: '#9370DB' },
        { name: '末日审判槌', damage: 122, rarity: 'legendary', color: '#BDB76B' },
        { name: '彩虹魔杖', damage: 132, rarity: 'legendary', color: '#FF69B4' },
        { name: '死神之镰', damage: 135, rarity: 'legendary', color: '#000000' },
        { name: '天使之翼剑', damage: 127, rarity: 'legendary', color: '#FFFFFF' },
        { name: '远古龙枪', damage: 133, rarity: 'legendary', color: '#4169E1' },
        { name: '圣光之剑', damage: 120, rarity: 'legendary', color: '#FFD700' },
        { name: '暗影匕首', damage: 118, rarity: 'legendary', color: '#8b00ff' },
        { name: '毁天灭地杖', damage: 140, rarity: 'legendary', color: '#FF00FF' },
        { name: '宇宙终结者', damage: 145, rarity: 'legendary', color: '#0000FF' },
        { name: '万物之主', damage: 138, rarity: 'legendary', color: '#228B22' },
        { name: '永恒守护', damage: 125, rarity: 'legendary', color: '#FFD700' },
        { name: '虚无之吻', damage: 142, rarity: 'legendary', color: '#36454F' },
        { name: '凤凰之剑', damage: 130, rarity: 'legendary', color: '#FF4500' },
        { name: '雷神之锤', damage: 138, rarity: 'legendary', color: '#F0E68C' },
        { name: '海神三叉戟', damage: 144, rarity: 'legendary', color: '#00CED1' },
        { name: '创世之柱', damage: 148, rarity: 'legendary', color: '#FFD700' },
        { name: '光明审判剑', damage: 152, rarity: 'legendary', color: '#FDFD96' },
        { name: '暗夜魔刃', damage: 146, rarity: 'legendary', color: '#663399' },
        { name: '自然之怒', damage: 143, rarity: 'legendary', color: '#32CD32' },
        { name: '地狱火镰', damage: 150, rarity: 'legendary', color: '#FF4500' },
        { name: '龙息巨剑', damage: 135, rarity: 'legendary', color: '#ff0000' },
        { name: '神之刃', damage: 200, rarity: 'legendary', color: '#ffffff' },

        // 新增神话武器
        { name: '开发者之剑', damage: 999, rarity: 'mythic', color: '#ff00ff' },
        { name: '元神之剑', damage: 500, rarity: 'mythic', color: '#FF1493' },
        { name: '平衡之锤', damage: 150, rarity: 'mythic', color: '#7B68EE' },
        { name: '创世神之刃', damage: 1200, rarity: 'mythic', color: '#9370DB' },
        { name: '宇宙之心', damage: 800, rarity: 'mythic', color: '#00FFFF' },
        { name: '创世之剑', damage: 1000, rarity: 'mythic', color: '#9370DB' },
        { name: '终焉之枪', damage: 950, rarity: 'mythic', color: '#000000' },
        { name: '概念本源', damage: 200, rarity: 'mythic', color: '#FF00FF' },
        { name: '现实重构器', damage: 300, rarity: 'mythic', color: '#00FFFF' },
        { name: '维度统治者', damage: 400, rarity: 'mythic', color: '#FF1493' },
        { name: '超验真理', damage: 500, rarity: 'mythic', color: '#9370DB' },
        { name: '万物之理', damage: 600, rarity: 'mythic', color: '#32CD32' },
        { name: '道法自然', damage: 700, rarity: 'mythic', color: '#228B22' },
        { name: '太极两仪剑', damage: 800, rarity: 'mythic', color: '#000000' },
        { name: '无极至尊刃', damage: 900, rarity: 'mythic', color: '#FFFFFF' },
        { name: '太极混元刃', damage: 950, rarity: 'mythic', color: '#8A2BE2' },
        { name: '鸿蒙初辟剑', damage: 1000, rarity: 'mythic', color: '#000080' },
        { name: '造化弄人刃', damage: 1050, rarity: 'mythic', color: '#2F4F4F' },
        { name: '万法归宗刃', damage: 1100, rarity: 'mythic', color: '#4B0082' },
        { name: '无中生有剑', damage: 1150, rarity: 'mythic', color: '#6A5ACD' }
    ];

    // 将新武器合并到原武器库中
    if (typeof WEAPONS !== 'undefined') {
        WEAPONS.push(...ADDITIONAL_WEAPONS);
        console.log(`新增了 ${ADDITIONAL_WEAPONS.length} 种武器`);
    }

    // 3. 扩展遗物系统
    if (typeof RELICS !== 'undefined') {
        const EXTRA_RELICS = [
            {
                name: '勇气勋章',
                description: '增加攻击力15%',
                effect: { damageMultiplier: 1.15 },
                icon: '⚔️',
                rarity: 'rare'
            },
            {
                name: '智慧之书',
                description: '增加生命上限20%',
                effect: { maxHpMultiplier: 1.2 },
                icon: '📚',
                rarity: 'rare'
            },
            {
                name: '疾风之靴',
                description: '增加移动速度25%',
                effect: { speedMultiplier: 1.25 },
                icon: '👟',
                rarity: 'rare'
            },
            {
                name: '护盾徽章',
                description: '受到致命伤害时保留1点生命值（冷却60秒）',
                effect: { lifeSaver: true },
                icon: '🛡️',
                rarity: 'epic'
            },
            {
                name: '复仇之魂',
                description: '每击杀一个敌人，攻击力增加5%（最多叠加5次）',
                effect: { revengeStack: 0.05, maxStack: 5 },
                icon: '👻',
                rarity: 'epic'
            },
            {
                name: '治愈之泉',
                description: '每隔30秒恢复10%生命值',
                effect: { passiveHeal: 0.1, healInterval: 30000 },
                icon: '💧',
                rarity: 'epic'
            },
            {
                name: '洞察之眼',
                description: '显示敌人血量和属性',
                effect: { showEnemyInfo: true },
                icon: '👁️',
                rarity: 'legendary'
            },
            {
                name: '时光沙漏',
                description: '减缓游戏速度10%',
                effect: { timeSlow: 0.9 },
                icon: '⏳',
                rarity: 'legendary'
            },
            {
                name: '龙之精华',
                description: '所有属性提升25%',
                effect: { allStatsMultiplier: 1.25 },
                icon: '🐉',
                rarity: 'legendary'
            },
            {
                name: '创世法典',
                description: '改变游戏规则，获得无敌状态5秒（冷却5分钟）',
                effect: { godMode: 5000, cooldown: 300000 },
                icon: '📖',
                rarity: 'mythic'
            }
        ];

        RELICS.push(...EXTRA_RELICS);
        console.log(`新增了 ${EXTRA_RELICS.length} 种遗物`);
    }

    // 4. 添加特殊关卡事件系统
    class LevelEventSystem {
        constructor() {
            this.events = new Map();
            this.registerEvents();
        }

        registerEvents() {
            // 特殊关卡事件注册
            this.events.set(7, () => this.level7Event());      // Boss关卡
            this.events.set(14, () => this.level14Event());    // 精英敌人关卡
            this.events.set(21, () => this.level21Event());    // 环境挑战关卡
            this.events.set(28, () => this.level28Event());    // 混合挑战关卡
            this.events.set(35, () => this.level35Event());    // Boss群关卡
            this.events.set(42, () => this.level42Event());    // 传说武器关卡
            this.events.set(49, () => this.level49Event());    // 终极挑战关卡
            this.events.set(50, () => this.level50Event());    // 终点关卡

            // 每10关的小Boss事件
            for (let i = 10; i <= 50; i += 10) {
                if (!this.events.has(i)) {
                    this.events.set(i, () => this.bossEvent());
                }
            }
        }

        // 第7关 - Boss挑战
        level7Event() {
            showCombatLog("👹 第7关：Boss来袭！", "enemy-spawn");
            // 增加Boss出现几率
            gameState.specialEvent = 'boss_wave';
            setTimeout(() => {
                gameState.specialEvent = null;
            }, 20000);
        }

        // 第14关 - 精英敌人关卡
        level14Event() {
            showCombatLog("👑 第14关：精英军队！", "enemy-spawn");
            // 增加精英敌人出现几率
            gameState.specialEvent = 'elite_wave';
            setTimeout(() => {
                gameState.specialEvent = null;
            }, 25000);
        }

        // 第21关 - 环境挑战关卡
        level21Event() {
            showCombatLog("☣️ 第21关：毒性环境！", "enemy-spawn");
            // 增加环境敌人出现几率
            gameState.specialEvent = 'environment_wave';
            setTimeout(() => {
                gameState.specialEvent = null;
            }, 30000);
        }

        // 第28关 - 混合挑战关卡
        level28Event() {
            showCombatLog("🌀 第28关：混乱战场！", "enemy-spawn");
            // 各种敌人混合出现
            gameState.specialEvent = 'chaos_wave';
            setTimeout(() => {
                gameState.specialEvent = null;
            }, 35000);
        }

        // 第35关 - Boss群关卡
        level35Event() {
            showCombatLog("👺 第35关：多重Boss战！", "enemy-spawn");
            // 增加多个Boss同时出现的几率
            gameState.specialEvent = 'multi_boss_wave';
            setTimeout(() => {
                gameState.specialEvent = null;
            }, 40000);
        }

        // 第42关 - 传说武器关卡
        level42Event() {
            showCombatLog("✨ 第42关：传说武器降临！", "weapon-get");
            // 临时提高传说武器掉落几率
            gameState.legendaryWeaponDropBonus = 3.0;
            setTimeout(() => {
                gameState.legendaryWeaponDropBonus = 1.0;
            }, 30000);
        }

        // 第49关 - 终极挑战关卡
        level49Event() {
            showCombatLog("🔥 第49关：终极试炼！", "enemy-spawn");
            // 大幅提升敌人强度
            gameState.extremeChallenge = true;
            setTimeout(() => {
                gameState.extremeChallenge = false;
            }, 45000);
        }

        // 第50关 - 终点关卡
        level50Event() {
            showCombatLog("🏆 第50关：最终决战！", "enemy-spawn");
            // 最强敌人，特殊奖励
            gameState.finalBattle = true;
            setTimeout(() => {
                gameState.finalBattle = false;
            }, 60000);
        }

        // Boss事件
        bossEvent() {
            showCombatLog("👹 Boss关卡！", "enemy-spawn");
            gameState.specialEvent = 'boss_wave';
            setTimeout(() => {
                gameState.specialEvent = null;
            }, 15000);
        }

        // 检查当前关卡是否有关卡事件
        checkLevelEvent(level) {
            if (this.events.has(level)) {
                this.events.get(level)();
                return true;
            }
            return false;
        }
    }

    // 创建关卡事件系统实例
    window.levelEventSystem = new LevelEventSystem();

    // 修改关卡升级函数以包含关卡事件检查
    if (typeof handleLevelUp !== 'undefined') {
        const originalHandleLevelUp = handleLevelUp;

        window.handleLevelUp = function() {
            originalHandleLevelUp(); // 执行原有逻辑

            // 检查关卡事件
            if (window.levelEventSystem) {
                window.levelEventSystem.checkLevelEvent(gameState.level);
            }
        };
    }

    // 5. 扩展敌人生成逻辑，支持特殊事件
    if (typeof adjustEnemyGeneration !== 'undefined') {
        const originalAdjustEnemyGeneration = adjustEnemyGeneration;

        window.adjustEnemyGeneration = function(level) {
            let weights = originalAdjustEnemyGeneration(level);

            // 根据特殊事件调整敌人生成权重
            if (gameState.specialEvent) {
                switch (gameState.specialEvent) {
                    case 'boss_wave':
                        // 增加Boss敌人权重
                        weights['MINI_BOSS'] = 0.15;
                        weights['REGULAR_BOSS'] = 0.08;
                        break;
                    case 'elite_wave':
                        // 增加精英敌人权重
                        weights['RARE_MELEE'] = 0.15;
                        weights['RARE_RANGED'] = 0.10;
                        weights['RARE_SUPPORT'] = 0.05;
                        break;
                    case 'environment_wave':
                        // 增加环境敌人权重
                        weights['SPIKE_TRAP'] = 0.10;
                        weights['POISON_CLOUD'] = 0.08;
                        break;
                    case 'chaos_wave':
                        // 混合增加各种敌人权重
                        weights['RARE_MELEE'] = 0.10;
                        weights['MINI_BOSS'] = 0.10;
                        weights['SPIKE_TRAP'] = 0.05;
                        break;
                    case 'multi_boss_wave':
                        // 大幅增加Boss权重
                        weights['MINI_BOSS'] = 0.20;
                        weights['REGULAR_BOSS'] = 0.15;
                        weights['EPIC_BOSS'] = 0.05;
                        break;
                }
            }

            return weights;
        };
    }

    // 6. 增加新的成就条件
    if (typeof AchievementSystem !== 'undefined') {
        // 添加新的成就条件到AchievementSystem
        AchievementSystem.achievementList.push(
            { id: 'boss_destroyer', name: 'Boss摧毁者', description: '击败10个Boss', condition: 'bossKills >= 10' },
            { id: 'legendary_weapon_master', name: '传说武器大师', description: '获得10件传说武器', condition: 'legendaryWeapons >= 10' },
            { id: 'completionist', name: '完美主义者', description: '收集全部遗物', condition: 'collectAllRelics' },
            { id: 'survival_master', name: '生存大师', description: '到达第50关', condition: 'level >= 50' },
            { id: 'weapon_explorer', name: '武器探索者', description: '使用过100种不同武器', condition: 'uniqueWeapons >= 100' },
            { id: 'elemental_mastery', name: '元素掌握', description: '使用所有元素系武器各击败一个敌人', condition: 'elementalMastery' },
            { id: 'boss_rush', name: 'Boss冲刺', description: '在1小时内击败10个Boss', condition: 'bossRush' }
        );

        // 添加Boss击杀追踪
        if (AchievementSystem.tempStats) {
            AchievementSystem.tempStats.bossKills = AchievementSystem.tempStats.bossKills || 0;
            AchievementSystem.tempStats.legendaryWeaponsObtained = AchievementSystem.tempStats.legendaryWeaponsObtained || 0;
        }
    }

    console.log("Steam内容更新模块已完全加载");
} else {
    console.log("Steam内容更新模块已存在，跳过重复加载");
}