// ==================== 核心玩法改进 ====================
//
// 该模块专注于进一步完善游戏的核心玩法机制，包括：
// 1. 游戏平衡性微调
// 2. 新增武器类型
// 3. 新增敌人类型
// 4. 游戏体验优化

// 检查是否已加载，防止重复加载
if (typeof CORE_GAMEPLAY_IMPROVEMENTS_LOADED === 'undefined') {
    window.CORE_GAMEPLAY_IMPROVEMENTS_LOADED = true;

    console.log("核心玩法改进模块已加载");

    // 1. 改进武器稀有度分布平衡性
    const BALANCED_WEAPON_RARITIES = {
        common: { weight: 50, multiplier: 1.0, description: '普通' },
        uncommon: { weight: 25, multiplier: 1.5, description: '罕见' },
        rare: { weight: 12, multiplier: 2.2, description: '稀有' },
        epic: { weight: 8, multiplier: 3.5, description: '史诗' },
        legendary: { weight: 4, multiplier: 5.0, description: '传说' },
        mythic: { weight: 1, multiplier: 8.0, description: '神话' }
    };

    // 改进的武器生成函数，考虑当前关卡和玩家状况
    function getImprovedWeaponGeneration(level, playerStatus = {}) {
        // 根据关卡调整武器分布
        const levelFactor = Math.min(level / 50, 1.0); // 最大影响因子

        // 如果玩家生命值较低，略微增加获得更好武器的概率（给玩家翻盘机会）
        const desperateFactor = playerStatus.hp && playerStatus.maxHp
            ? Math.max(0, (1 - (playerStatus.hp / playerStatus.maxHp)) * 0.3)
            : 0;

        const adjustedRarities = {};
        let totalWeight = 0;

        for (const [rarity, data] of Object.entries(BALANCED_WEAPON_RARITIES)) {
            // 根据关卡和紧急程度调整权重
            let weight = data.weight;

            if (rarity === 'common') {
                weight *= (1 - levelFactor * 0.7) * (1 - desperateFactor * 0.5); // 关卡越高，普通武器越少；玩家越危险，普通武器越少
            } else if (rarity === 'mythic') {
                weight *= (1 + levelFactor * 0.3) * (1 + desperateFactor * 0.2); // 关卡越高或玩家越危险，神话武器稍微增加
            } else {
                weight *= (1 + levelFactor * data.multiplier * 0.1) * (1 + desperateFactor * 0.1);
            }

            adjustedRarities[rarity] = { ...data, weight };
            totalWeight += weight;
        }

        // 随机选择一个稀有度
        let random = Math.random() * totalWeight;
        for (const [rarity, data] of Object.entries(adjustedRarities)) {
            random -= data.weight;
            if (random <= 0) {
                return rarity;
            }
        }

        // 默认返回普通稀有度
        return 'common';
    }

    // 改进的武器生成函数
    function generateImprovedWeapon(level, playerStatus = {}) {
        const rarity = getImprovedWeaponGeneration(level || gameState.level || 1, playerStatus);
        const weaponsOfRarity = WEAPONS.filter(w => w.rarity === rarity);

        if (weaponsOfRarity.length === 0) {
            // 如果没有对应稀有度的武器，降级到下一个可用稀有度
            if (rarity === 'mythic') return generateImprovedWeapon(level, playerStatus, 'legendary');
            if (rarity === 'legendary') return generateImprovedWeapon(level, playerStatus, 'epic');
            if (rarity === 'epic') return generateImprovedWeapon(level, playerStatus, 'rare');
            if (rarity === 'rare') return generateImprovedWeapon(level, playerStatus, 'uncommon');
            if (rarity === 'uncommon') return generateImprovedWeapon(level, playerStatus, 'common');
            return WEAPONS[0] || { name: '拳头', damage: 1, rarity: 'common', color: '#ffffff' }; // 最终回退到默认武器
        }

        const weapon = weaponsOfRarity[Math.floor(Math.random() * weaponsOfRarity.length)];
        return { ...weapon, id: Date.now() + Math.random() };
    }

    // 2. 新增武器类型
    const IMPROVED_WEAPONS = [
        // 新增普通武器
        { name: '生锈的铁棒', damage: 6, rarity: 'common', color: '#696969' },
        { name: '破旧长矛', damage: 7, rarity: 'common', color: '#8B4513' },
        { name: '锋利石头', damage: 4, rarity: 'common', color: '#708090' },

        // 新增不常见武器
        { name: '淬毒短剑', damage: 17, rarity: 'uncommon', color: '#32CD32', effect: 'poison' },
        { name: '燃烧战斧', damage: 19, rarity: 'uncommon', color: '#FF4500', effect: 'fire' },
        { name: '冰霜短棍', damage: 18, rarity: 'uncommon', color: '#87CEFA', effect: 'freeze' },

        // 新增稀有武器
        { name: '雷电长鞭', damage: 35, rarity: 'rare', color: '#FFD700', effect: 'lightning' },
        { name: '吸血鬼牙刃', damage: 37, rarity: 'rare', color: '#8B0000', effect: 'life_steal' },
        { name: '风暴法杖', damage: 36, rarity: 'rare', color: '#9370DB', effect: 'chain_lightning' },

        // 新增史诗武器
        { name: '时光之刃', damage: 52, rarity: 'epic', color: '#9932CC', effect: 'slow_time' },
        { name: '灵魂收割者', damage: 56, rarity: 'epic', color: '#2F4F4F', effect: 'soul_reaper' },
        { name: '量子分解器', damage: 60, rarity: 'epic', color: '#00CED1', effect: 'quantum' },

        // 新增传说武器
        { name: '诸神黄昏', damage: 85, rarity: 'legendary', color: '#FF1493', effect: 'apocalypse' },
        { name: '现实扭曲者', damage: 90, rarity: 'legendary', color: '#000000', effect: 'reality_warp' },

        // 新增神话武器
        { name: '创世权杖', damage: 150, rarity: 'mythic', color: '#FF00FF', effect: 'creation' },
        { name: '万物终结者', damage: 250, rarity: 'mythic', color: '#363636', effect: 'destruction' }
    ];

    // 将改进的武器合并到原武器库中
    if (typeof WEAPONS !== 'undefined') {
        WEAPONS.push(...IMPROVED_WEAPONS);
        console.log(`新增了 ${IMPROVED_WEAPONS.length} 种改进武器`);
    }

    // 3. 新增敌人类型，增加游戏挑战多样性
    const IMPROVED_ENEMY_TYPES = {
        // 独特敌人类型
        'POISON_SPIDER': {
            name: '剧毒蜘蛛',
            speed: 1.5,
            hp: 3.0,
            damage: 2.5,
            size: 0.8,
            behavior: 'ranged',
            special: 'poison_attack' // 攻击带中毒效果
        },
        'ICE_ELEMENTAL': {
            name: '寒冰元素',
            speed: 0.8,
            hp: 6.0,
            damage: 2.0,
            size: 1.5,
            behavior: 'melee',
            special: 'freeze_attack' // 攻击带冰冻效果
        },
        'LIGHTNING_EEL': {
            name: '闪电鳗鱼',
            speed: 2.0,
            hp: 2.5,
            damage: 3.0,
            size: 1.0,
            behavior: 'ranged',
            special: 'chain_lightning' // 连锁闪电
        },
        'SHADOW_ASSASSIN': {
            name: '暗影刺客',
            speed: 2.5,
            hp: 1.5,
            damage: 4.5,
            size: 0.9,
            behavior: 'melee',
            special: 'teleport' // 可以瞬移
        },
        'PHOENIX': {
            name: '不死鸟',
            speed: 1.2,
            hp: 4.0,
            damage: 3.5,
            size: 2.0,
            behavior: 'ranged',
            special: 'regenerate' // 可重生
        },
        'GOLEM': {
            name: '岩石巨人',
            speed: 0.5,
            hp: 15.0,
            damage: 5.0,
            size: 4.0,
            behavior: 'melee',
            special: 'stomp' // 践踏攻击
        },
        'WITCH': {
            name: '女巫',
            speed: 0.9,
            hp: 2.0,
            damage: 2.0,
            size: 1.0,
            behavior: 'ranged',
            special: 'summon_minions' // 召唤小怪
        },
        'BERSERKER': {
            name: '狂战士',
            speed: 1.8,
            hp: 8.0,
            damage: 6.0,
            size: 2.2,
            behavior: 'melee',
            special: 'rage' // 血量越低攻击力越高
        }
    };

    // 将新敌人类型合并到原敌人类型中
    if (typeof ENEMY_TYPES !== 'undefined') {
        Object.assign(ENEMY_TYPES, IMPROVED_ENEMY_TYPES);
        console.log(`新增了 ${Object.keys(IMPROVED_ENEMY_TYPES).length} 种改进敌人类型`);
    }

    // 4. 改进敌人生成算法，确保更好多样性
    function getEnhancedEnemySpawnRate(level) {
        // 基础生成率
        let baseRate = 2000; // 初始2秒一个敌人

        // 随着关卡推进，生成率提高，但增长速度递减
        const levelAdjustment = Math.min(level * 15, level * Math.log(level + 1) * 10);
        baseRate = Math.max(500, baseRate - levelAdjustment); // 最快0.5秒一个敌人，但不会太快

        // 如果玩家生命值很低，稍微降低敌人生成率（给玩家喘息机会）
        if (gameState.player && gameState.player.hp < gameState.player.maxHp * 0.2) {
            baseRate += 300; // 增加300ms延迟
        }

        return baseRate;
    }

    // 5. 改进玩家升级系统
    function getBalancedPlayerUpgrade(level) {
        // 平衡的升级曲线，避免前期过于简单或后期过于困难
        const baseHpGain = 5;  // 基础生命值增长
        const growthFactor = Math.min(0.8, 0.2 + (level * 0.01)); // 增长因子，有上限
        const hpIncrease = Math.floor(baseHpGain + (level * growthFactor));

        // 升级所需击杀数，使用对数增长以平衡难度曲线
        const killsForNextLevel = Math.max(3, Math.floor(5 + (level * 0.8) - Math.pow(level * 0.1, 1.2)));

        return {
            hpIncrease: hpIncrease,
            killsForNextLevel: killsForNextLevel
        };
    }

    // 6. 添加特殊游戏事件系统，增加游戏趣味性
    class SpecialGameEvents {
        constructor() {
            this.activeEvents = new Set();
            this.eventTimers = [];
        }

        // 检查是否激活特殊事件
        checkForSpecialEvents(level) {
            // 在特定关卡触发特殊事件
            if (level === 7 && !this.activeEvents.has('lucky_day')) {
                this.triggerLuckyDayEvent();
            } else if (level === 14 && !this.activeEvents.has('weapon_festival')) {
                this.triggerWeaponFestivalEvent();
            } else if (level === 21 && !this.activeEvents.has('berserker_moon')) {
                this.triggerBerserkerMoonEvent();
            } else if (level === 30 && !this.activeEvents.has('god_mode')) {
                this.triggerGodModeEvent();
            }
        }

        // 幸运日事件：武器掉落率提高，药水更常见
        triggerLuckyDayEvent() {
            this.activeEvents.add('lucky_day');
            showCombatLog("🍀 幸运日事件激活！武器和药水掉落率提高！", "event-start");

            // 暂时提高武器和药水掉落率
            gameState.luckyDay = true;

            // 5分钟后结束事件
            setTimeout(() => {
                gameState.luckyDay = false;
                this.activeEvents.delete('lucky_day');
                showCombatLog("🍀 幸运日事件结束", "event-end");
            }, 300000); // 5分钟
        }

        // 武器节事件：所有敌人必定掉落武器
        triggerWeaponFestivalEvent() {
            this.activeEvents.add('weapon_festival');
            showCombatLog("🎉 武器节事件激活！所有敌人都掉落武器！", "event-start");

            gameState.weaponFestival = true;

            // 4分钟后结束事件
            setTimeout(() => {
                gameState.weaponFestival = false;
                this.activeEvents.delete('weapon_festival');
                showCombatLog("🎉 武器节事件结束", "event-end");
            }, 240000); // 4分钟
        }

        // 狂战士之月事件：连续战斗奖励
        triggerBerserkerMoonEvent() {
            this.activeEvents.add('berserker_moon');
            showCombatLog("🌙 狂战士之月事件激活！连击奖励大幅提升！", "event-start");

            gameState.berserkerMoon = true;

            // 6分钟后结束事件
            setTimeout(() => {
                gameState.berserkerMoon = false;
                this.activeEvents.delete('berserker_moon');
                showCombatLog("🌙 狂战士之月事件结束", "event-end");
            }, 360000); // 6分钟
        }

        // 神力事件：临时无敌+超高速
        triggerGodModeEvent() {
            this.activeEvents.add('god_mode');
            showCombatLog("✨ 神力事件激活！短暂无敌+超高速！", "event-start");

            gameState.godMode = true;
            const originalSpeed = gameState.player.speed;
            gameState.player.speed = originalSpeed * 2.0; // 双倍速度

            // 30秒后结束事件
            setTimeout(() => {
                gameState.godMode = false;
                gameState.player.speed = originalSpeed;
                this.activeEvents.delete('god_mode');
                showCombatLog("✨ 神力事件结束", "event-end");
            }, 30000); // 30秒
        }

        // 检查当前是否处于特殊事件中
        isActive(eventName) {
            return this.activeEvents.has(eventName);
        }

        // 清理事件（游戏结束时）
        cleanup() {
            this.activeEvents.clear();
            this.eventTimers.forEach(timer => clearTimeout(timer));
            this.eventTimers = [];
        }
    }

    // 创建全局事件系统实例
    window.specialGameEvents = new SpecialGameEvents();

    // 7. 改进游戏UI反馈系统
    function showEnhancedCombatLog(message, type = 'general') {
        // 如果游戏支持combat log，则显示消息
        if (typeof showCombatLog !== 'undefined') {
            showCombatLog(message, type);
        } else {
            // 如果没有现成的函数，使用console或其他方式
            console.log(`[${type}] ${message}`);
        }
    }

    // 8. 替换或增强现有函数
    if (typeof generateWeapon !== 'undefined') {
        // 保存原始函数作为备份
        window.originalGenerateWeapon = generateWeapon;
        // 使用改进的武器生成函数
        window.generateWeapon = generateImprovedWeapon;
    }

    if (typeof getEnemySpawnRate !== 'undefined') {
        window.originalGetEnemySpawnRate = getEnemySpawnRate;
        window.getEnemySpawnRate = getEnhancedEnemySpawnRate;
    }

    if (typeof getPlayerUpgradeCurve !== 'undefined') {
        window.originalGetPlayerUpgradeCurve = getPlayerUpgradeCurve;
        window.getPlayerUpgradeCurve = getBalancedPlayerUpgrade;
    }

    // 9. 添加游戏难度调节系统
    class DifficultyManager {
        constructor() {
            this.currentDifficulty = 'normal'; // 'easy', 'normal', 'hard', 'insane'
            this.difficultySettings = {
                easy: { enemyDamage: 0.7, enemyHealth: 0.8, spawnRate: 1.3, playerHealthGain: 1.2 },
                normal: { enemyDamage: 1.0, enemyHealth: 1.0, spawnRate: 1.0, playerHealthGain: 1.0 },
                hard: { enemyDamage: 1.3, enemyHealth: 1.4, spawnRate: 0.8, playerHealthGain: 0.9 },
                insane: { enemyDamage: 1.8, enemyHealth: 2.0, spawnRate: 0.6, playerHealthGain: 0.7 }
            };
        }

        setDifficulty(difficulty) {
            if (this.difficultySettings[difficulty]) {
                this.currentDifficulty = difficulty;
                showEnhancedCombatLog(`🎯 难度已设为: ${difficulty.toUpperCase()}`, 'system');
                return true;
            }
            return false;
        }

        getModifier(modifierName) {
            return this.difficultySettings[this.currentDifficulty]?.[modifierName] || 1.0;
        }
    }

    // 创建难度管理器实例
    window.difficultyManager = new DifficultyManager();

    console.log("核心玩法改进模块已完全加载");
} else {
    console.log("核心玩法改进模块已存在，跳过重复加载");
}