// ==================== 游戏内容扩展系统 ====================
//
// 本文件扩展游戏内容，增加以下功能：
// 1. 新的敌人类型（20+种）
// 2. 新的武器类型（50+种）
// 3. 新的场景主题（15个）
// 4. 新的遗物系统（18个新遗物）
// 5. 新的药水类型（10种）
// 6. 新的游戏模式（生存、竞速、武器大师）
// 7. 新的挑战系统（8个独特挑战）
// 8. 新的事件系统（固定和随机事件）

class GameContentExpansion {
    constructor() {
        // 初始化内容扩展
        this.init();

        // 添加新的游戏内容
        this.addNewEnemies();
        this.addNewWeapons();
        this.addNewScenes();
        this.addNewRelics();
        this.addNewPotions();
        this.addNewGameModes();
        this.addNewChallenges();
        this.addNewEvents();

        console.log("🌍 游戏内容扩展系统已初始化");
    }

    // 初始化内容扩展
    init() {
        // 扩展游戏状态以支持新内容
        if (typeof gameState !== 'undefined') {
            gameState.newContent = {
                unlockedEnemies: new Set(),
                unlockedWeapons: new Set(),
                unlockedScenes: new Set(),
                unlockedRelics: new Set(),
                unlockedPotions: new Set(),
                completedChallenges: new Set(),
                activeEvents: [],

                // 新增游戏模式
                gameModes: {
                    survival: { active: false, wave: 1, enemiesDefeated: 0 },
                    timeTrial: { active: false, startTime: 0, endTime: 0 },
                    weaponMaster: { active: false, weaponsUsed: new Set(), target: 50 }
                },

                // 挑战追踪
                challenges: {
                    active: new Set(),
                    completed: new Set(),
                    progress: {}
                },

                // 事件系统
                events: {
                    schedule: [],  // 预定事件
                    active: [],    // 活跃事件
                    completed: []  // 完成事件
                }
            };
        }
    }

    // 添加新敌人类型（20+种）
    addNewEnemies() {
        // 扩展现有的敌人类型
        const newEnemyTypes = {
            // 机械系敌人
            MECH_WARRIOR: { name: '机械战士', speed: 1.2, hp: 3.0, damage: 2.5, size: 1.8, behavior: 'mechanical', element: 'metal', desc: '精准的机械构造体' },
            ROBOT_DRONE: { name: '战斗无人机', speed: 2.5, hp: 1.0, damage: 1.5, size: 0.8, behavior: 'flying', element: 'metal', desc: '高速飞行单位' },
            TITAN_MECH: { name: '泰坦机甲', speed: 0.5, hp: 10.0, damage: 5.0, size: 4.0, behavior: 'tank', element: 'metal', desc: '重型装甲单位' },

            // 神话系敌人
            MINOTAUR: { name: '牛头怪', speed: 0.8, hp: 6.0, damage: 4.0, size: 2.5, behavior: 'charge', element: 'earth', desc: '会冲锋的巨怪' },
            HYDRA: { name: '九头蛇', speed: 1.0, hp: 8.0, damage: 3.0, size: 2.8, behavior: 'multi_head', element: 'poison', desc: '能再生头部的怪物' },
            PHOENIX: { name: '不死鸟', speed: 1.8, hp: 4.0, damage: 3.5, size: 2.0, behavior: 'flying_regen', element: 'fire', desc: '可重生的火焰生物' },

            // 元素系敌人
            FIRE_ELEMENTAL: { name: '火焰精灵', speed: 1.5, hp: 2.5, damage: 3.0, size: 1.5, behavior: 'aoe_attack', element: 'fire', desc: '会释放火球的元素生物' },
            ICE_GOLEM: { name: '冰霜巨人', speed: 0.6, hp: 7.0, damage: 3.5, size: 3.0, behavior: 'slow_freeze', element: 'ice', desc: '可冻结敌人的巨大冰块' },
            STORM_SERPENT: { name: '风暴巨蟒', speed: 1.2, hp: 5.0, damage: 2.8, size: 2.2, behavior: 'lightning', element: 'lightning', desc: '会释放闪电的巨蛇' },

            // 异常系敌人
            SHADOW_STALKER: { name: '暗影追踪者', speed: 2.0, hp: 1.5, damage: 4.5, size: 1.2, behavior: 'stealth', element: 'dark', desc: '隐身并背刺的敌人' },
            TIME_WITCH: { name: '时光女巫', speed: 0.9, hp: 3.5, damage: 2.0, size: 1.6, behavior: 'time_manipulate', element: 'time', desc: '可操控时间的神秘生物' },
            VOID_SPAWN: { name: '虚空之子', speed: 1.3, hp: 4.5, damage: 3.8, size: 1.8, behavior: 'phase', element: 'void', desc: '可在现实中穿梭的生物' },

            // 稀有精英敌人
            CHAOS_BEAST: { name: '混沌兽', speed: 1.1, hp: 9.0, damage: 4.8, size: 3.2, behavior: 'random_element', element: 'chaos', desc: '带有随机元素效果的混沌生物' },
            ANCIENT_GUARDIAN: { name: '远古守卫', speed: 0.7, hp: 12.0, damage: 6.0, size: 3.5, behavior: 'defensive', element: 'holy', desc: '防御极高的古代守护者' },
            DEATH_KNIGHT: { name: '死亡骑士', speed: 1.0, hp: 8.0, damage: 5.5, size: 2.6, behavior: 'melee_charge', element: 'death', desc: '骑着骷髅马的亡灵骑士' },

            // 史诗级敌人
            DRAGON_LORD: { name: '龙族领主', speed: 1.0, hp: 15.0, damage: 7.0, size: 4.0, behavior: 'breath_weapon', element: 'dragon', desc: '喷吐元素龙息的龙族王者' },
            DEMON_LORD: { name: '恶魔领主', speed: 1.4, hp: 12.0, damage: 8.0, size: 3.8, behavior: 'summon', element: 'fire', desc: '可召唤小恶魔的地狱君主' },
            GOD_KILLER: { name: '弑神者', speed: 1.8, hp: 20.0, damage: 10.0, size: 5.0, behavior: 'almighty', element: 'divine', desc: '据说能杀死神明的强大存在' },

            // 新增的特殊敌人
            NINJA_ASSASSIN: { name: '忍者刺客', speed: 2.8, hp: 2.0, damage: 6.0, size: 1.3, behavior: 'teleport_strike', element: 'shadow', desc: '可以瞬移并背刺的神秘杀手' },
            MAGMA_TITAN: { name: '岩浆巨人', speed: 0.4, hp: 18.0, damage: 7.5, size: 4.5, behavior: 'aoe_burn', element: 'fire', desc: '每步都会点燃地面的巨大巨人' },
            FROST_ARCHER: { name: '冰霜弓手', speed: 0.9, hp: 3.0, damage: 4.0, size: 1.7, behavior: 'ranged_freeze', element: 'ice', desc: '射出冰箭的远程敌人' },
            NECROMANCER: { name: '死灵法师', speed: 0.7, hp: 5.0, damage: 1.0, size: 1.8, behavior: 'summon_undead', element: 'death', desc: '可召唤亡灵的邪恶法师' },
            LIGHTNING_BEAVER: { name: '闪电海狸', speed: 3.0, hp: 1.5, damage: 2.0, size: 1.0, behavior: 'electric_dash', element: 'lightning', desc: '能发出电击的可爱又致命的动物' },
            IRON_MAIDEN: { name: '铁处女', speed: 0.2, hp: 15.0, damage: 15.0, size: 2.0, behavior: 'trap_damage', element: 'metal', desc: '既是陷阱也是武器的恐怖装置' }
        };

        // 合并到现有敌人类型
        if (typeof ENEMY_TYPES !== 'undefined') {
            Object.assign(ENEMY_TYPES, newEnemyTypes);
        } else {
            // 如果没有定义，则创建新的敌人类型对象
            window.ENEMY_TYPES = newEnemyTypes;
        }

        // 记录解锁的新敌人
        for (const [key, value] of Object.entries(newEnemyTypes)) {
            if (typeof gameState !== 'undefined' && gameState.newContent) {
                gameState.newContent.unlockedEnemies.add(key);
            }
        }
    }

    // 添加新武器类型（50+种）
    addNewWeapons() {
        const newWeapons = [
            // 新增的普通武器
            { name: '破旧平底锅', damage: 8, rarity: 'common', color: '#DAA520', desc: '能挡子弹的神奇平底锅' },
            { name: '生锈的起钉器', damage: 7, rarity: 'common', color: '#808080', desc: '多用途工具，也能伤敌' },
            { name: '损坏的计算器', damage: 3, rarity: 'common', color: '#C0C0C0', desc: '偶尔能进行数学攻击' },
            { name: '橡皮鸭', damage: 1, rarity: 'common', color: '#FFFF00', desc: '可爱的武器，伤害很低但心情好' },
            { name: '坏掉的手电筒', damage: 4, rarity: 'common', color: '#708090', desc: '砸人的同时还很亮' },
            { name: '折断的伞', damage: 5, rarity: 'common', color: '#8B0000', desc: '雨天作战利器' },
            { name: '松动的扳手', damage: 9, rarity: 'common', color: '#A9A9A9', desc: '维修工的专业武器' },
            { name: '破洞的拖鞋', damage: 2, rarity: 'common', color: '#696969', desc: '居家必备，也可防身' },
            { name: '塑料叉子', damage: 2, rarity: 'common', color: '#C0C0C0', desc: '看起来很弱，但数量就是力量' },
            { name: '旧牙刷', damage: 1, rarity: 'common', color: '#FFFFFF', desc: '清洁敌人...从世界上' },

            // 新增的不常见武器
            { name: '工程锤', damage: 20, rarity: 'uncommon', color: '#2F4F4F', desc: '建筑工人的首选工具' },
            { name: '登山绳索', damage: 15, rarity: 'uncommon', color: '#8B4513', desc: '可以牵制敌人' },
            { name: '潜水刀', damage: 18, rarity: 'uncommon', color: '#4682B4', desc: '水下作战专用' },
            { name: '消防斧', damage: 22, rarity: 'uncommon', color: '#B22222', desc: '救火救人，顺便杀人' },
            { name: '园艺剪刀', damage: 16, rarity: 'uncommon', color: '#228B22', desc: '修剪花草，也可修敌人' },
            { name: '雕刻刀', damage: 17, rarity: 'uncommon', color: '#696969', desc: '精确切割的艺术品' },
            { name: '捕熊夹', damage: 25, rarity: 'uncommon', color: '#8B4513', desc: '让敌人尝尝夹子的滋味' },
            { name: '冰锥', damage: 19, rarity: 'uncommon', color: '#E0F6FF', desc: '寒冷的刺击武器' },
            { name: '矿工镐', damage: 21, rarity: 'uncommon', color: '#708090', desc: '挖掘矿物，也可以挖掘敌人' },
            { name: '渔网', damage: 14, rarity: 'uncommon', color: '#1E90FF', desc: '困住敌人的好工具' },

            // 新增的稀有武器
            { name: '符文匕首', damage: 35, rarity: 'rare', color: '#9370DB', desc: '刻有神秘符文的短刀' },
            { name: '龙鳞小刀', damage: 32, rarity: 'rare', color: '#FF6347', desc: '用龙鳞制作的小巧武器' },
            { name: '精灵长弓', damage: 38, rarity: 'rare', color: '#228B22', desc: '精灵工艺制造的完美弓箭' },
            { name: '矮人战锤', damage: 40, rarity: 'rare', color: '#A0522D', desc: '矮人工匠打造的强力战锤' },
            { name: '魔法法杖', damage: 36, rarity: 'rare', color: '#FFD700', desc: '蕴含强大魔力的法杖' },
            { name: '月牙弯刀', damage: 37, rarity: 'rare', color: '#C0C0C0', desc: '形状如新月的锋利弯刀' },
            { name: '雷神之锤', damage: 42, rarity: 'rare', color: '#B0C4DE', desc: '据说拥有雷电之力' },
            { name: '凤凰之羽', damage: 34, rarity: 'rare', color: '#FF4500', desc: '用凤凰羽毛制成的奇异武器' },
            { name: '海神三叉戟', damage: 41, rarity: 'rare', color: '#00CED1', desc: '来自深海的传说武器' },
            { name: '风暴之刃', damage: 39, rarity: 'rare', color: '#87CEEB', desc: '凝聚风暴之力的利刃' },

            // 新增的史诗武器
            { name: '时间之沙', damage: 55, rarity: 'epic', color: '#F0E68C', desc: '可以操控时间流逝' },
            { name: '空间裂缝', damage: 58, rarity: 'epic', color: '#4B0082', desc: '撕裂空间的可怕武器' },
            { name: '元素主宰', damage: 56, rarity: 'epic', color: '#32CD32', desc: '同时操控四大元素' },
            { name: '灵魂收割者', damage: 62, rarity: 'epic', color: '#2F4F4F', desc: '专门收割灵魂的恐怖武器' },
            { name: '混沌之眼', damage: 60, rarity: 'epic', color: '#FF00FF', desc: '看穿混沌本质的眼睛' },
            { name: '秩序之锚', damage: 57, rarity: 'epic', color: '#7CFC00', desc: '维持世界秩序的神器' },
            { name: '虚无之握', damage: 63, rarity: 'epic', color: '#000000', desc: '来自虚无的致命一击' },
            { name: '现实编辑器', damage: 65, rarity: 'epic', color: '#9370DB', desc: '可以改写现实的工具' },
            { name: '因果律之剑', damage: 64, rarity: 'epic', color: '#4169E1', desc: '无视物理法则的神剑' },
            { name: '观测者之眼', damage: 61, rarity: 'epic', color: '#3CB371', desc: '观察一切的全能之眼' },

            // 新增的传说武器
            { name: '创世之锤', damage: 85, rarity: 'legendary', color: '#FFD700', desc: '可以创造世界的神器' },
            { name: '毁灭之书', damage: 88, rarity: 'legendary', color: '#8B0000', desc: '记载毁灭咒语的禁忌典籍' },
            { name: '生命之树', damage: 82, rarity: 'legendary', color: '#32CD32', desc: '孕育生命的神圣之树' },
            { name: '死亡之镰', damage: 90, rarity: 'legendary', color: '#000000', desc: '收割生死的终极武器' },
            { name: '平衡之秤', damage: 86, rarity: 'legendary', color: '#C0C0C0', desc: '维持宇宙平衡的天平' },
            { name: '无限宝珠', damage: 92, rarity: 'legendary', color: '#9400D3', desc: '蕴含无限能量的神秘宝珠' },
            { name: '命运之线', damage: 84, rarity: 'legendary', color: '#FF69B4', desc: '可以编织命运的丝线' },
            { name: '真理之镜', damage: 87, rarity: 'legendary', color: '#B0E0E6', desc: '揭示世间一切真相的镜子' },
            { name: '永恒之环', damage: 89, rarity: 'legendary', color: '#1E90FF', desc: '代表永恒循环的神秘戒指' },
            { name: '宇宙之心', damage: 95, rarity: 'legendary', color: '#00BFFF', desc: '宇宙核心的能量结晶' },

            // 新增的神话武器
            { name: '概念之刃', damage: 1800, rarity: 'mythic', color: '#FF1493', desc: '连概念都能切断的终极武器' },
            { name: '现实粉碎者', damage: 1600, rarity: 'mythic', color: '#00FA9A', desc: '可以粉碎现实本身的工具' },
            { name: '维度支配者', damage: 1750, rarity: 'mythic', color: '#4682B4', desc: '支配所有维度的力量' },
            { name: '存在否定者', damage: 2000, rarity: 'mythic', color: '#000000', desc: '能让一切不复存在的恐怖' },
            { name: '无限手套', damage: 2500, rarity: 'mythic', color: '#8A2BE2', desc: '拥有无限力量的传奇手套' },
            { name: '虚无之神', damage: 2200, rarity: 'mythic', color: '#2F4F4F', desc: '化身虚无的存在' },
            { name: '宇宙起源', damage: 2400, rarity: 'mythic', color: '#0000FF', desc: '宇宙诞生时的原始力量' },
            { name: '时间主宰', damage: 2100, rarity: 'mythic', color: '#9370DB', desc: '掌控时间流动的存在' },
            { name: '空间之王', damage: 2300, rarity: 'mythic', color: '#4169E1', desc: '主宰空间形态的君主' },
            { name: '存在意义', damage: 1900, rarity: 'mythic', color: '#FF00FF', desc: '揭示存在本质的终极武器' },

            // 补充更多的新武器
            { name: '量子纠缠剑', damage: 70, rarity: 'epic', color: '#9932CC', desc: '利用量子纠缠的神秘剑刃' },
            { name: '反物质匕首', damage: 75, rarity: 'legendary', color: '#00BFFF', desc: '由反物质构成的危险武器' },
            { name: '黑洞发射器', damage: 100, rarity: 'mythic', color: '#000000', desc: '能创造微型黑洞的装置' },
            { name: '中子星碎片', damage: 98, rarity: 'legendary', color: '#7CFC00', desc: '密度极高的中子星碎片' },
            { name: '夸克组合器', damage: 72, rarity: 'epic', color: '#FF4500', desc: '可以重组夸克的科学仪器' },
            { name: '弦理论之刃', damage: 68, rarity: 'epic', color: '#8A2BE2', desc: '基于弦理论制造的武器' },
            { name: '平行宇宙之门', damage: 85, rarity: 'legendary', color: '#4682B4', desc: '可以召唤平行宇宙力量' },
            { name: '意识上传器', damage: 65, rarity: 'epic', color: '#32CD32', desc: '将意识传输到武器中' },
            { name: '信息熵减器', damage: 67, rarity: 'epic', color: '#DC143C', desc: '逆转熵增的神秘装置' },
            { name: '薛定谔之剑', damage: 73, rarity: 'epic', color: '#4169E1', desc: '同时处于多种状态的武器' }
        ];

        // 合并到现有武器库
        if (typeof WEAPONS !== 'undefined') {
            WEAPONS.push(...newWeapons);
        } else {
            // 如果没有定义，则创建新的武器数组
            window.WEAPONS = newWeapons;
        }

        // 记录解锁的新武器
        for (const weapon of newWeapons) {
            if (typeof gameState !== 'undefined' && gameState.newContent) {
                gameState.newContent.unlockedWeapons.add(weapon.name);
            }
        }
    }

    // 添加新场景主题（15个）
    addNewScenes() {
        const newScenes = [
            { name: '冰雪洞穴', bg: '#E6F3FF', desc: '寒冷的冰雪世界，敌人移动缓慢但攻击力强' },
            { name: '火山地带', bg: '#FFCCCC', desc: '炙热的火山环境，地面会不定期喷发岩浆' },
            { name: '迷雾森林', bg: '#CCFFCC', desc: '神秘的迷雾笼罩的古老森林' },
            { name: '沙漠绿洲', bg: '#FFFFCC', desc: '炎热的沙漠，偶尔出现珍贵的水源' },
            { name: '地下矿井', bg: '#CCCCFF', desc: '昏暗的地下通道，资源丰富但危机四伏' },
            { name: '天空之城', bg: '#E6F0FF', desc: '漂浮在云端的城市，敌人飞行较多' },
            { name: '深海遗迹', bg: '#CCFFFF', desc: '沉没在海底的古代文明' },
            { name: '魔法学院', bg: '#FFCCFF', desc: '充满魔法力量的学术殿堂' },
            { name: '机械工厂', bg: '#CCCCCC', desc: '自动化生产的机械世界' },
            { name: '末日废土', bg: '#FFCC99', desc: '遭受核辐射的荒芜之地' },
            { name: '异次元空间', bg: '#FF99FF', desc: '违背物理定律的奇幻空间' },
            { name: '时间裂隙', bg: '#CC99FF', desc: '时间流速不稳定的空间' },
            { name: '元素位面', bg: '#FF9999', desc: '纯粹元素力量构成的世界' },
            { name: '混沌领域', bg: '#9999FF', desc: '秩序与混乱交织的危险领域' },
            { name: '虚无境界', bg: '#000000', desc: '接近真实虚无的终极领域' }
        ];

        // 存储新场景
        if (typeof gameState !== 'undefined') {
            gameState.scenes = gameState.scenes || [];
            gameState.scenes.push(...newScenes);
        }

        // 记录解锁的新场景
        for (const scene of newScenes) {
            if (typeof gameState !== 'undefined' && gameState.newContent) {
                gameState.newContent.unlockedScenes.add(scene.name);
            }
        }
    }

    // 添加新遗物系统（18个新遗物）
    addNewRelics() {
        const newRelics = [
            { name: '时间沙漏', effect: 'time_dilation', desc: '偶尔减缓周围敌人的时间流逝' },
            { name: '元素核心', effect: 'elemental_synergy', desc: '使武器元素效果增强' },
            { name: '生命之种', effect: 'life_regeneration', desc: '持续缓慢恢复生命值' },
            { name: '量子护盾', effect: 'quantum_shield', desc: '有概率完全抵消一次攻击' },
            { name: '命运之骰', effect: 'dice_fate', desc: '随机获得正面效果' },
            { name: '灵魂链接', effect: 'soul_link', desc: '将部分伤害转移给附近敌人' },
            { name: '无限循环', effect: 'infinite_loop', desc: '有时技能效果会被复制' },
            { name: '虚无之盒', effect: 'void_box', desc: '可以储存一个物品供以后使用' },
            { name: '重力控制器', effect: 'gravity_control', desc: '可以轻微操控重力' },
            { name: '维度口袋', effect: 'dimensional_pocket', desc: '扩大背包容量' },
            { name: '命运之笔', effect: 'fate_writer', desc: '偶尔改变事件结果' },
            { name: '洞察之眼', effect: 'insight_eye', desc: '可以看到敌人的弱点' },
            { name: '平衡之石', effect: 'balance_stone', desc: '保持所有属性平衡' },
            { name: '混沌印记', effect: 'chaos_mark', desc: '使敌人攻击变得不可预测' },
            { name: '秩序勋章', effect: 'order_medal', desc: '增强所有正面效果' },
            { name: '时空定位器', effect: 'spacetime_locator', desc: '可以追踪敌人位置' },
            { name: '现实稳定器', effect: 'reality_stabilizer', desc: '防止异常状态影响' },
            { name: '进化催化剂', effect: 'evolution_catalyst', desc: '加快被动技能升级' }
        ];

        // 合并到现有遗物
        if (typeof RELICS !== 'undefined') {
            RELICS.push(...newRelics);
        } else {
            window.RELICS = newRelics;
        }

        // 记录解锁的新遗物
        for (const relic of newRelics) {
            if (typeof gameState !== 'undefined' && gameState.newContent) {
                gameState.newContent.unlockedRelics.add(relic.name);
            }
        }
    }

    // 添加新药水类型（10种）
    addNewPotions() {
        const newPotions = [
            { name: '时间减缓药水', effect: 'slow_time', duration: 5, color: '#4169E1', desc: '减缓周围敌人时间' },
            { name: '护盾超载药水', effect: 'shield_overflow', value: 50, color: '#00BFFF', desc: '获得超大护盾' },
            { name: '元素精通药水', effect: 'elemental_mastery', duration: 10, value: 2, color: '#32CD32', desc: '元素伤害翻倍' },
            { name: '暴击专精药水', effect: 'crit_mastery', duration: 8, value: 0.3, color: '#FF4500', desc: '暴击率大幅提升' },
            { name: '反伤护盾药水', effect: 'thorns_shield', duration: 6, value: 0.2, color: '#8A2BE2', desc: '反弹部分伤害给攻击者' },
            { name: '吸血光环药水', effect: 'vampire_aura', duration: 7, value: 0.15, color: '#8B0000', desc: '攻击时恢复部分生命' },
            { name: '元素转换药水', effect: 'element_convert', value: 1, color: '#FFD700', desc: '临时改变武器元素属性' },
            { name: '抗性提升药水', effect: 'resistance_up', duration: 10, value: 0.5, color: '#20B2AA', desc: '减少受到的伤害' },
            { name: '敏捷提升药水', effect: 'agility_boost', duration: 8, value: 1.5, color: '#98FB98', desc: '大幅提升移动速度和闪避' },
            { name: '幸运加倍药水', effect: 'lucky_double', duration: 6, value: 2, color: '#FFD700', desc: '所有稀有度掉落翻倍' }
        ];

        // 合并到现有药水
        if (typeof POTIONS !== 'undefined') {
            POTIONS.push(...newPotions);
        } else {
            window.POTIONS = newPotions;
        }

        // 记录解锁的新药水
        for (const potion of newPotions) {
            if (typeof gameState !== 'undefined' && gameState.newContent) {
                gameState.newContent.unlockedPotions.add(potion.name);
            }
        }
    }

    // 添加新游戏模式
    addNewGameModes() {
        const newGameModes = {
            SURVIVAL: {
                name: '生存模式',
                desc: '在无限波次的敌人攻击中尽可能存活',
                rules: [
                    '敌人波次不断刷新',
                    '每波敌人逐渐增强',
                    '存活时间越长分数越高',
                    '可使用特殊生存道具'
                ],
                activation: () => {
                    if (typeof gameState !== 'undefined') {
                        gameState.newContent.gameModes.survival.active = true;
                        gameState.newContent.gameModes.survival.wave = 1;
                        gameState.newContent.gameModes.survival.enemiesDefeated = 0;

                        // 增加特殊生存道具
                        gameState.survivalItems = ['急救包', '防护罩', '时间炸弹'];
                    }
                }
            },
            TIME_TRIAL: {
                name: '竞速模式',
                desc: '在限定时间内获得最高分',
                rules: [
                    '30分钟时间限制',
                    '得分越高排名越前',
                    '击杀敌人获得时间奖励',
                    '完成挑战获得额外时间'
                ],
                activation: () => {
                    if (typeof gameState !== 'undefined') {
                        gameState.newContent.gameModes.timeTrial.active = true;
                        gameState.newContent.gameModes.timeTrial.startTime = Date.now();
                        gameState.newContent.gameModes.timeTrial.endTime = Date.now() + 30 * 60 * 1000; // 30分钟
                    }
                }
            },
            WEAPON_MASTER: {
                name: '武器大师',
                desc: '使用50种不同武器完成挑战',
                rules: [
                    '必须使用50种不同武器',
                    '每种武器只需使用一次',
                    '武器类型越多分数奖励越高',
                    '完成挑战获得特殊奖励'
                ],
                activation: () => {
                    if (typeof gameState !== 'undefined') {
                        gameState.newContent.gameModes.weaponMaster.active = true;
                        gameState.newContent.gameModes.weaponMaster.weaponsUsed = new Set();
                        gameState.newContent.gameModes.weaponMaster.target = 50;
                    }
                }
            }
        };

        // 添加新游戏模式
        if (typeof gameState !== 'undefined') {
            gameState.gameModes = gameState.gameModes || {};
            Object.assign(gameState.gameModes, newGameModes);
        }
    }

    // 添加新挑战系统（8个独特挑战）
    addNewChallenges() {
        const newChallenges = [
            {
                id: 'challenge_blind',
                name: '盲战挑战',
                desc: '屏幕变黑，只能凭感觉战斗',
                condition: 'complete_level_with_blind',
                rewards: { xp: 200, gold: 150, specialItem: '暗影之眼' },
                difficulty: 'hard'
            },
            {
                id: 'challenge_one_hit',
                name: '一击必杀挑战',
                desc: '每次攻击必须击杀敌人',
                condition: 'kill_all_enemies_in_one_hit',
                rewards: { xp: 150, gold: 100, specialItem: '锋利精华' },
                difficulty: 'expert'
            },
            {
                id: 'challenge_no_damage',
                name: '零伤害挑战',
                desc: '整个关卡不受到任何伤害',
                condition: 'complete_level_without_damage',
                rewards: { xp: 300, gold: 200, specialItem: '完美护符' },
                difficulty: 'expert'
            },
            {
                id: 'challenge_speed_run',
                name: '速通挑战',
                desc: '在规定时间内完成关卡',
                condition: 'complete_level_under_time',
                rewards: { xp: 100, gold: 80, specialItem: '疾风靴' },
                difficulty: 'medium'
            },
            {
                id: 'challenge_weapon_only',
                name: '武器精通挑战',
                desc: '只能使用武器攻击，禁止使用技能',
                condition: 'complete_level_no_skills',
                rewards: { xp: 120, gold: 90, specialItem: '武器大师勋章' },
                difficulty: 'hard'
            },
            {
                id: 'challenge_rare_weapon',
                name: '稀有武器挑战',
                desc: '只能使用史诗及以上稀有度武器',
                condition: 'use_only_high_rarity_weapons',
                rewards: { xp: 250, gold: 180, specialItem: '稀有度鉴定器' },
                difficulty: 'hard'
            },
            {
                id: 'challenge_combo_master',
                name: '连击大师挑战',
                desc: '保持连击不断，击杀指定数量敌人',
                condition: 'maintain_combo_and_kill',
                rewards: { xp: 180, gold: 120, specialItem: '连击奖杯' },
                difficulty: 'medium'
            },
            {
                id: 'challenge_elemental',
                name: '元素掌控挑战',
                desc: '只使用元素武器完成关卡',
                condition: 'only_elemental_weapons',
                rewards: { xp: 220, gold: 160, specialItem: '元素融合器' },
                difficulty: 'hard'
            }
        ];

        // 添加挑战到游戏状态
        if (typeof gameState !== 'undefined') {
            gameState.challenges = gameState.challenges || [];
            gameState.challenges.push(...newChallenges);
        }

        // 记录解锁的新挑战
        for (const challenge of newChallenges) {
            if (typeof gameState !== 'undefined' && gameState.newContent) {
                gameState.newContent.completedChallenges.add(challenge.id);
            }
        }
    }

    // 添加新事件系统（固定和随机事件）
    addNewEvents() {
        const newEvents = {
            FIXED_EVENTS: [
                {
                    id: 'event_treasure_chest',
                    name: '神秘宝箱',
                    desc: '开启宝箱获得随机奖励',
                    triggers: ['level_start', 'checkpoint'],
                    effects: ['random_weapon', 'extra_potion', 'temporary_buff'],
                    frequency: 'once_per_level'
                },
                {
                    id: 'event_weapon_fusion',
                    name: '武器融合站',
                    desc: '可以融合两把武器获得更强属性',
                    triggers: ['shop_encounter'],
                    effects: ['weapon_upgrade', 'element_addition', 'stat_boost'],
                    frequency: 'level_based'
                },
                {
                    id: 'event_npc_trader',
                    name: '神秘商人',
                    desc: '出售稀有物品和武器',
                    triggers: ['special_room'],
                    effects: ['rare_weapon_sales', 'discount_items', 'exclusive_goods'],
                    frequency: 'rare'
                },
                {
                    id: 'event_arena_challenge',
                    name: '竞技场挑战',
                    desc: '在竞技场中连续对抗多波敌人',
                    triggers: ['arena_discovered'],
                    effects: ['wave_combat', 'performance_rewards', 'rank_points'],
                    frequency: 'optional'
                }
            ],
            RANDOM_EVENTS: [
                {
                    id: 'event_lucky_day',
                    name: '幸运日',
                    desc: '当天掉落物品稀有度提升',
                    triggers: ['random_probability'],
                    effects: ['rarity_boost', 'extra_loot', 'positive_atmosphere'],
                    probability: 0.15
                },
                {
                    id: 'event_enemy_evolution',
                    name: '敌人进化',
                    desc: '敌人突然变强，但也掉落更好的奖励',
                    triggers: ['random_probability'],
                    effects: ['enemy_power_up', 'enhanced_loot', 'increased_difficulty'],
                    probability: 0.10
                },
                {
                    id: 'event_elemental_storm',
                    name: '元素风暴',
                    desc: '场上所有武器都附加随机元素效果',
                    triggers: ['random_probability'],
                    effects: ['element_addition', 'weapon_enhancement', 'environment_change'],
                    probability: 0.08
                },
                {
                    id: 'event_time_anomaly',
                    name: '时间异常',
                    desc: '时间流速变得不稳定',
                    triggers: ['random_probability'],
                    effects: ['speed_variations', 'time_effects', 'unpredictable_behavior'],
                    probability: 0.05
                },
                {
                    id: 'event_weapon_lottery',
                    name: '武器抽奖',
                    desc: '参与抽奖活动赢取稀有武器',
                    triggers: ['random_probability'],
                    effects: ['prize_draw', 'rare_weapon_chance', 'gambling_element'],
                    probability: 0.12
                },
                {
                    id: 'event_mini_boss',
                    name: '隐藏BOSS',
                    desc: '出现强大的隐藏BOSS',
                    triggers: ['secret_location', 'random_probability'],
                    effects: ['boss_encounter', 'high_reward', 'special_combat'],
                    probability: 0.07
                }
            ]
        };

        // 添加事件到游戏状态
        if (typeof gameState !== 'undefined') {
            gameState.events = gameState.events || {};
            gameState.events.fixed = gameState.events.fixed || [];
            gameState.events.random = gameState.events.random || [];

            gameState.events.fixed.push(...newEvents.FIXED_EVENTS);
            gameState.events.random.push(...newEvents.RANDOM_EVENTS);
        }

        // 初始化活跃事件
        if (typeof gameState !== 'undefined' && gameState.newContent) {
            gameState.newContent.activeEvents = [...newEvents.FIXED_EVENTS, ...newEvents.RANDOM_EVENTS.slice(0, 3)];
        }
    }

    // 检查内容扩展状态
    getStatus() {
        if (typeof gameState !== 'undefined' && gameState.newContent) {
            return {
                unlockedEnemies: gameState.newContent.unlockedEnemies.size,
                unlockedWeapons: gameState.newContent.unlockedWeapons.size,
                unlockedScenes: gameState.newContent.unlockedScenes.size,
                unlockedRelics: gameState.newContent.unlockedRelics.size,
                unlockedPotions: gameState.newContent.unlockedPotions.size,
                completedChallenges: gameState.newContent.completedChallenges.size,
                activeEvents: gameState.newContent.activeEvents.length,

                // 模式统计
                survivalWaves: gameState.newContent.gameModes.survival.wave,
                timeTrialActive: gameState.newContent.gameModes.timeTrial.active,
                weaponsUsedInChallenge: gameState.newContent.gameModes.weaponMaster.weaponsUsed.size
            };
        }
        return null;
    }

    // 应用内容扩展
    applyToGame() {
        // 通知成就系统添加新内容
        if (typeof AchievementSystem !== 'undefined') {
            // 添加与新内容相关的成就
            const newAchievements = [
                { id: 'survival_master', name: '生存大师', description: '在生存模式中存活10波', condition: 'survive_10_waves' },
                { id: 'time_trial_champion', name: '竞速冠军', description: '在竞速模式中获得10000分', condition: 'score_10000_in_time_trial' },
                { id: 'weapon_collector', name: '武器收藏家', description: '完成武器大师挑战', condition: 'complete_weapon_master' },
                { id: 'challenge_complete', name: '挑战完成者', description: '完成8个不同挑战', condition: 'complete_all_challenges' },
                { id: 'event_participant', name: '事件参与者', description: '参与50个随机事件', condition: 'participate_in_events' }
            ];

            // 将新成就添加到成就系统（如果支持动态添加）
            if (typeof window.ADDITIONAL_ACHIEVEMENTS === 'undefined') {
                window.ADDITIONAL_ACHIEVEMENTS = [];
            }
            window.ADDITIONAL_ACHIEVEMENTS.push(...newAchievements);
        }

        console.log("✅ 游戏内容扩展已应用到游戏系统");
    }
}

// 初始化内容扩展系统
const gameContentExpansion = new GameContentExpansion();

// 将实例添加到窗口对象以便其他脚本访问
window.GameContentExpansion = GameContentExpansion;
window.gameContentExpansion = gameContentExpansion;

// 应用内容扩展到游戏
gameContentExpansion.applyToGame();

console.log("📦 游戏内容扩展包已完全加载");