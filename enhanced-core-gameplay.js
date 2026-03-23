// ==================== 增强核心玩法系统 ====================
//
// 该模块专注于进一步完善游戏的核心玩法机制，包括：
// 1. 高级武器系统 - 引入特殊效果和套装系统
// 2. 多样化敌人AI - 不同的行为模式和战术
// 3. 游戏进度曲线优化
// 4. 玩家成长系统增强

// 检查是否已加载，防止重复加载
if (typeof ENHANCED_CORE_GAMEPLAY_LOADED === 'undefined') {
    window.ENHANCED_CORE_GAMEPLAY_LOADED = true;

    console.log("增强核心玩法系统模块已加载");

    // 1. 高级武器系统 - 包含特殊效果和属性加成
    const ADVANCED_WEAPONS = [
        // 元素系武器
        {
            name: '烈焰之刃',
            damage: 22,
            rarity: 'rare',
            color: '#FF4500',
            effect: 'burn',
            description: '攻击时有30%几率点燃敌人，在4秒内造成额外伤害'
        },
        {
            name: '冰霜战锤',
            damage: 24,
            rarity: 'rare',
            color: '#87CEFA',
            effect: 'freeze',
            description: '攻击时有25%几率冰冻敌人，使其暂时无法行动'
        },
        {
            name: '雷鸣法杖',
            damage: 20,
            rarity: 'rare',
            color: '#FFD700',
            effect: 'shock',
            description: '攻击时可连锁打击附近其他敌人'
        },
        {
            name: '毒刺匕首',
            damage: 18,
            rarity: 'rare',
            color: '#32CD32',
            effect: 'poison',
            description: '攻击时使敌人中毒，在一段时间内持续掉血'
        },

        // 特殊机制武器
        {
            name: '吸血鬼之牙',
            damage: 26,
            rarity: 'epic',
            color: '#8B0000',
            effect: 'life_steal',
            description: '每次攻击回复自身一定生命值'
        },
        {
            name: '风暴使者',
            damage: 30,
            rarity: 'epic',
            color: '#9370DB',
            effect: 'chain_lightning',
            description: '攻击时可能释放连锁闪电，打击多个敌人'
        },
        {
            name: '时空撕裂者',
            damage: 35,
            rarity: 'epic',
            color: '#9932CC',
            effect: 'slow_time',
            description: '使用此武器时，周围时间流速减缓'
        },
        {
            name: '灵魂收割者',
            damage: 40,
            rarity: 'epic',
            color: '#2F4F4F',
            effect: 'soul_reaper',
            description: '每击败一个敌人永久增加少量攻击力'
        },

        // 神话级武器
        {
            name: '现实控制器',
            damage: 80,
            rarity: 'mythic',
            color: '#FF00FF',
            effect: 'reality_warp',
            description: '可以暂时改变物理定律，免疫部分伤害'
        },
        {
            name: '无限手套',
            damage: 120,
            rarity: 'mythic',
            color: '#363636',
            effect: 'snap_of_fate',
            description: '随机改变战场局势，可能消灭部分敌人或治疗自己'
        },
        {
            name: '知识之树果实',
            damage: 60,
            rarity: 'mythic',
            color: '#228B22',
            effect: 'omniscience',
            description: '获得预知能力，可看到敌人的行动轨迹'
        },
        {
            name: '永恒之心',
            damage: 100,
            rarity: 'mythic',
            color: '#FFB6C1',
            effect: 'immortal',
            description: '在濒死时获得一次不死机会'
        }
    ];

    // 套装系统 - 当装备特定组合武器时触发套装效果
    const WEAPON_SETS = {
        'ELEMENTAL_MASTERY': {
            name: '元素掌控者',
            weapons: ['烈焰之刃', '冰霜战锤', '雷鸣法杖'],
            bonus: { damageMultiplier: 1.3, effectChance: 0.2 },
            description: '同时装备所有三件元素武器时，大幅提升元素效果'
        },
        'DARK_ARTS': {
            name: '黑暗艺术',
            weapons: ['毒刺匕首', '吸血鬼之牙'],
            bonus: { lifeSteal: 0.3, poisonDuration: 2 },
            description: '同时装备毒系和血系武器时，强化生命汲取和毒性效果'
        }
    };

    // 2. 多样化敌人AI系统
    const ENHANCED_ENEMY_TYPES = {
        // 追踪型敌人
        'TRACKER_BUG': {
            name: '追踪虫',
            speed: 1.8,
            hp: 1.5,
            damage: 1.8,
            size: 0.7,
            behavior: 'tracking',
            aiPattern: 'persistent',
            description: '坚持不懈地追踪玩家，直到被消灭'
        },

        // 游走型敌人
        'PATROL_GUARD': {
            name: '巡逻守卫',
            speed: 1.2,
            hp: 3.0,
            damage: 2.5,
            size: 1.4,
            behavior: 'patrol',
            aiPattern: 'territorial',
            description: '在特定区域巡逻，发现玩家后发起攻击'
        },

        // 突袭型敌人
        'AMBUSH_PREDATOR': {
            name: '伏击掠食者',
            speed: 2.5,
            hp: 2.0,
            damage: 4.0,
            size: 1.2,
            behavior: 'ambush',
            aiPattern: 'hit_and_run',
            description: '隐藏在暗处突然袭击，然后快速撤退'
        },

        // 集群型敌人
        'SWARM_INFESTOR': {
            name: '集群感染体',
            speed: 1.0,
            hp: 1.0,
            damage: 1.0,
            size: 0.6,
            behavior: 'swarm',
            aiPattern: 'group_tactic',
            description: '群体行动，数量越多威胁越大'
        },

        // 法师型敌人
        'ARCANE_CULTIST': {
            name: '奥术教徒',
            speed: 0.9,
            hp: 2.5,
            damage: 3.5,
            size: 1.3,
            behavior: 'magic_ranged',
            aiPattern: 'spell_caster',
            description: '远距离施放魔法攻击，血量越低法术越强'
        },

        // 守护型敌人
        'GUARDIAN_IDOL': {
            name: '守护石像',
            speed: 0.3,
            hp: 12.0,
            damage: 4.5,
            size: 3.0,
            behavior: 'guardian',
            aiPattern: 'defensive',
            description: '高血量防御型敌人，靠近时造成范围伤害'
        },

        // 精英型敌人
        'ELITE_WARLORD': {
            name: '精英军阀',
            speed: 1.5,
            hp: 8.0,
            damage: 5.0,
            size: 2.0,
            behavior: 'hybrid',
            aiPattern: 'adaptive',
            description: '具备多种战斗技能，会根据情况改变战术'
        },

        // 变异型敌人
        'MUTATION_HORROR': {
            name: '变异恐惧',
            speed: 1.7,
            hp: 6.0,
            damage: 4.2,
            size: 2.2,
            behavior: 'chaos',
            aiPattern: 'unpredictable',
            description: '行为模式不可预测，可能突然改变攻击方式'
        }
    };

    // 3. 动态难度调整系统
    class DynamicDifficultySystem {
        constructor() {
            this.baseValues = {
                spawnRate: 2000,  // 初始生成间隔（毫秒）
                enemyHP: 20,      // 敌人基础血量
                enemyDamage: 5,   // 敌人基础伤害
                enemySpeed: 1     // 敌人基础速度
            };

            this.scalingFactors = {
                level: {  // 随关卡提升
                    spawnRate: -10,  // 每关减少10ms生成间隔
                    enemyHP: 0.8,    // 每关提升80%血量
                    enemyDamage: 0.6, // 每关提升60%伤害
                    enemySpeed: 0.1  // 每关提升10%速度
                },
                survivalTime: {  // 随生存时间提升
                    spawnRate: -5,   // 生存时间越长，生成越快
                    enemyDamage: 0.05 // 生存时间越长，敌人越强
                },
                playerPerformance: { // 根据玩家表现调整
                    killRate: 0.1,   // 击杀率高则增强敌人
                    weaponQuality: -0.02 // 武器品质高则稍微削弱
                }
            };

            this.gameStartTime = Date.now();
            this.lastAdjustment = Date.now();
        }

        getDifficultyModifiers(level, playerStats = {}) {
            const currentTime = Date.now();
            const survivalTime = (currentTime - this.gameStartTime) / (1000 * 60); // 分钟
            const timeModifier = Math.min(2.0, 1.0 + (survivalTime * 0.1)); // 最多2倍

            // 基础调整
            const levelMultiplier = Math.max(1.0, 1.0 + (level * 0.1));

            // 根据玩家表现调整
            const playerKillRate = playerStats.kills / Math.max(1, level);
            const killRateModifier = Math.max(0.8, Math.min(1.5, 1.0 + (playerKillRate - 2.0) * 0.1));

            // 武器强度调整
            const weaponPower = playerStats.currentWeapon ? playerStats.currentWeapon.damage : 5;
            const weaponModifier = Math.max(0.8, 1.5 - (weaponPower / 50)); // 武器越强，敌人稍微变弱

            return {
                spawnRate: this.baseValues.spawnRate + (level * this.scalingFactors.level.spawnRate),
                enemyHP: this.baseValues.enemyHP * levelMultiplier * timeModifier,
                enemyDamage: this.baseValues.enemyDamage * levelMultiplier * timeModifier * killRateModifier * weaponModifier,
                enemySpeed: this.baseValues.enemySpeed * (1 + level * this.scalingFactors.level.enemySpeed) * timeModifier
            };
        }
    }

    // 4. 玩家成长系统增强
    class PlayerProgressionSystem {
        constructor() {
            this.upgradeTree = {
                health: { level: 0, cost: [10, 20, 35, 55, 80], effect: [10, 15, 20, 25, 30] }, // 每级增加的生命值
                damage: { level: 0, cost: [15, 25, 40, 60, 85], effect: [0.1, 0.15, 0.2, 0.25, 0.3] }, // 伤害加成比例
                speed: { level: 0, cost: [12, 22, 38, 58, 78], effect: [0.2, 0.3, 0.4, 0.5, 0.6] }, // 速度加成
                luck: { level: 0, cost: [20, 35, 55, 80, 110], effect: [0.05, 0.1, 0.15, 0.2, 0.25] } // 掉落率加成
            };

            this.availablePoints = 0; // 通过击杀敌人获得的升级点数
            this.skillPoints = {}; // 已分配的技能点
        }

        earnExperience(killCount) {
            // 每击杀10个敌人获得1点升级点数
            const earnedPoints = Math.floor(killCount / 10) - this.usedPoints();
            this.availablePoints += earnedPoints;
            return earnedPoints;
        }

        usedPoints() {
            let used = 0;
            for (const [skill, data] of Object.entries(this.upgradeTree)) {
                used += data.level;
            }
            return used;
        }

        upgradeSkill(skill, points = 1) {
            if (!this.upgradeTree[skill] || this.availablePoints < points) {
                return false; // 无法升级
            }

            const skillData = this.upgradeTree[skill];
            const maxLevels = skillData.cost.length;

            if (skillData.level + points > maxLevels) {
                return false; // 超过最大等级
            }

            // 计算升级花费
            let totalCost = 0;
            for (let i = 0; i < points; i++) {
                const levelIndex = skillData.level + i;
                if (levelIndex < skillData.cost.length) {
                    totalCost += skillData.cost[levelIndex];
                }
            }

            if (totalCost > this.availablePoints) {
                return false; // 点数不够
            }

            // 扣除花费并升级
            this.availablePoints -= totalCost;
            skillData.level += points;

            return true;
        }

        getSkillEffect(skill) {
            const skillData = this.upgradeTree[skill];
            if (skillData.level === 0) return 0;

            // 计算总效果
            let totalEffect = 0;
            for (let i = 0; i < skillData.level; i++) {
                if (i < skillData.effect.length) {
                    totalEffect += skillData.effect[i];
                }
            }

            return totalEffect;
        }
    }

    // 5. 特殊关卡事件系统
    class SpecialLevelEvents {
        constructor() {
            this.eventRegistry = new Map();
            this.registerEvents();
        }

        registerEvents() {
            // 每10级的特殊事件
            this.eventRegistry.set(10, {
                name: '试炼之门',
                description: '第10关开启试炼之门，敌人数量暴增！',
                effect: () => this.tenfoldEnemies()
            });

            this.eventRegistry.set(20, {
                name: '精英集结',
                description: '第20关精英敌人大量出现！',
                effect: () => this.eliteRise()
            });

            this.eventRegistry.set(30, {
                name: '元素风暴',
                description: '第30关元素力量失控！',
                effect: () => this.elementalStorm()
            });

            this.eventRegistry.set(40, {
                name: '维度裂隙',
                description: '第40关维度裂隙开启，未知力量涌入！',
                effect: () => this.dimensionRift()
            });

            // 隐藏关卡事件
            this.eventRegistry.set(66, {
                name: '深渊凝视',
                description: '第66关...？',
                effect: () => this.abysmalGaze()
            });
        }

        tenfoldEnemies() {
            showCombatLog("⚠️ 试炼之门开启！敌人数量暴增10倍！", "special-event");
            // 暂时提高敌人生成率
            if (gameState) {
                gameState.temporarySpawnMultiplier = 10;
                setTimeout(() => {
                    if (gameState) gameState.temporarySpawnMultiplier = 1;
                }, 30000); // 30秒后恢复
            }
        }

        eliteRise() {
            showCombatLog("⚔️ 精英崛起！高阶敌人大量出现！", "special-event");
            if (gameState) {
                gameState.eliteSpawnChance = 0.8; // 精英敌人生成概率提高到80%
                setTimeout(() => {
                    if (gameState) gameState.eliteSpawnChance = 0.1;
                }, 45000); // 45秒后恢复
            }
        }

        elementalStorm() {
            showCombatLog("🌪️ 元素风暴！各种元素系敌人涌现！", "special-event");
            if (gameState) {
                gameState.elementalEnemiesOnly = true; // 只生成元素系敌人
                setTimeout(() => {
                    gameState.elementalEnemiesOnly = false;
                }, 60000); // 60秒后恢复
            }
        }

        dimensionRift() {
            showCombatLog("🌀 维度裂隙！异常敌人出现！", "special-event");
            if (gameState) {
                gameState.anomalyMode = true; // 异常模式，敌人随机获得特殊能力
                setTimeout(() => {
                    gameState.anomalyMode = false;
                }, 120000); // 120秒后恢复
            }
        }

        abysmalGaze() {
            showCombatLog("👁️ 深渊正在凝视你...", "special-event");
            if (gameState) {
                gameState.abyssalVision = true; // 启用深渊视觉，游戏体验改变
                // 这里可以实现特殊的视觉效果或游戏规则变化
            }
        }

        triggerEvent(level) {
            const event = this.eventRegistry.get(level);
            if (event) {
                event.effect();
                return event;
            }
            return null;
        }
    }

    // 6. 游戏UI反馈增强系统
    function showEnhancedCombatLog(message, type = 'general', duration = 4000) {
        // 如果游戏支持combat log，则显示消息
        if (typeof showCombatLog !== 'undefined') {
            showCombatLog(message, type, duration);
        } else {
            // 如果没有现成的函数，输出到控制台或创建一个简单的提示
            console.log(`[${type}] ${message}`);

            // 创建一个简单的视觉提示（如果DOM存在）
            if (typeof document !== 'undefined') {
                const notification = document.createElement('div');
                notification.style.position = 'fixed';
                notification.style.top = '20px';
                notification.style.left = '50%';
                notification.style.transform = 'translateX(-50%)';
                notification.style.background = '#333';
                notification.style.color = '#fff';
                notification.style.padding = '10px 20px';
                notification.style.borderRadius = '5px';
                notification.style.zIndex = '10000';
                notification.style.opacity = '0';
                notification.textContent = message;

                document.body.appendChild(notification);

                // 渐入效果
                setTimeout(() => {
                    notification.style.transition = 'opacity 0.3s ease-in-out';
                    notification.style.opacity = '1';
                }, 10);

                // 渐出效果
                setTimeout(() => {
                    notification.style.opacity = '0';
                    setTimeout(() => {
                        document.body.removeChild(notification);
                    }, 300);
                }, duration);
            }
        }
    }

    // 7. 扩展游戏状态对象
    if (typeof gameState !== 'undefined') {
        // 初始化动态难度系统
        gameState.dynamicDifficulty = new DynamicDifficultySystem();

        // 初始化玩家成长系统
        gameState.playerProgression = new PlayerProgressionSystem();

        // 初始化特殊事件系统
        gameState.specialLevelEvents = new SpecialLevelEvents();

        // 添加新的游戏状态变量
        gameState.temporarySpawnMultiplier = 1;
        gameState.eliteSpawnChance = 0.1;
        gameState.elementalEnemiesOnly = false;
        gameState.anomalyMode = false;
        gameState.abyssalVision = false;
    }

    // 8. 增强的武器生成算法
    function generateAdvancedWeapon(level, playerStatus = {}) {
        // 根据玩家状态和关卡调整武器生成
        const baseProbability = Math.min(0.3, level / 100); // 基础高级武器生成概率

        // 考虑玩家当前武器质量
        const currentWeaponQuality = playerStatus.currentWeapon ?
            (playerStatus.currentWeapon.damage || 5) : 5;
        const qualityRatio = currentWeaponQuality / 20; // 假设20是平衡点

        // 如果当前武器较差，提高获取好武器的概率
        const desperationFactor = Math.max(0, (1 - qualityRatio) * 0.4);

        // 计算最终生成高级武器的概率
        const enhancedProbability = baseProbability + desperationFactor;

        // 按概率决定是否生成高级武器
        if (Math.random() < enhancedProbability) {
            // 从高级武器中选择
            const advancedWeapons = ADVANCED_WEAPONS.filter(weapon =>
                weapon.rarity === 'rare' || weapon.rarity === 'epic' || weapon.rarity === 'mythic'
            );

            if (advancedWeapons.length > 0) {
                const weapon = advancedWeapons[Math.floor(Math.random() * advancedWeapons.length)];
                return { ...weapon, id: Date.now() + Math.random(), acquiredAt: level };
            }
        }

        // 否则按照普通流程生成武器
        if (typeof generateImprovedWeapon !== 'undefined') {
            return generateImprovedWeapon(level, playerStatus);
        } else if (typeof generateWeapon !== 'undefined') {
            return generateWeapon(level, playerStatus);
        } else {
            // 默认武器生成
            const defaultWeapons = [
                { name: '拳头', damage: 1, rarity: 'common', color: '#ffffff' },
                { name: '木棒', damage: 3, rarity: 'common', color: '#8B4513' },
                { name: '铁剑', damage: 8, rarity: 'uncommon', color: '#C0C0C0' }
            ];
            return { ...defaultWeapons[0], id: Date.now() + Math.random() };
        }
    }

    // 9. 增强的敌人生成算法
    function generateEnhancedEnemy(level) {
        // 根据关卡和特殊状态决定敌人类型
        let possibleEnemies = Object.values(ENEMY_TYPES || {});

        // 如果在元素风暴模式下，只选择元素系敌人
        if (gameState?.elementalEnemiesOnly) {
            possibleEnemies = possibleEnemies.filter(enemy =>
                enemy.name.includes('元素') ||
                enemy.name.includes('灵') ||
                enemy.name.includes('Elemental')
            );
        }

        // 如果在异常模式下，可能给敌人附加特殊能力
        if (gameState?.anomalyMode && Math.random() < 0.3) {
            // 创建一个具有异常能力的敌人
            const normalEnemy = {...possibleEnemies[Math.floor(Math.random() * possibleEnemies.length)]};
            normalEnemy.anomaly = true;
            normalEnemy.anomalyPower = 1 + Math.random() * 2; // 1-3倍增强
            return normalEnemy;
        }

        // 如果是精英上升模式，提高精英敌人概率
        const eliteChance = gameState?.eliteSpawnChance || 0.1;
        if (Math.random() < eliteChance) {
            // 选择更强的敌人
            const strongEnemies = possibleEnemies.filter(enemy =>
                (enemy.hp || 2) > 3 || (enemy.damage || 1) > 3
            );

            if (strongEnemies.length > 0) {
                return {...strongEnemies[Math.floor(Math.random() * strongEnemies.length)]};
            }
        }

        // 普通生成逻辑
        return {...possibleEnemies[Math.floor(Math.random() * possibleEnemies.length)]};
    }

    // 10. 导出增强功能供外部使用
    window.AdvancedWeapons = ADVANCED_WEAPONS;
    window.EnhancedEnemyTypes = ENHANCED_ENEMY_TYPES;
    window.WeaponSets = WEAPON_SETS;
    window.DynamicDifficultySystem = DynamicDifficultySystem;
    window.PlayerProgressionSystem = PlayerProgressionSystem;
    window.SpecialLevelEvents = SpecialLevelEvents;

    // 替换或增强现有函数
    if (typeof generateWeapon !== 'undefined') {
        window.originalGenerateWeapon = generateWeapon;
        window.generateWeapon = generateAdvancedWeapon;
    }

    console.log("增强核心玩法系统模块已完全加载");
} else {
    console.log("增强核心玩法系统模块已存在，跳过重复加载");
}