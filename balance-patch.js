// ==================== 游戏平衡性补丁 ====================
//
// 该补丁旨在优化游戏平衡性，包括：
// 1. 调整敌人生成速度
// 2. 优化属性成长曲线
// 3. 平衡武器掉落机制
// 4. 调整敌人属性成长

// 记录补丁是否已应用
if (typeof BALANCE_PATCH_APPLIED === 'undefined') {
    window.BALANCE_PATCH_APPLIED = true;

    console.log("游戏平衡性补丁已加载");

    // 1. 调整敌人生成速度曲线
    // 修改spawnEnemy函数中的生成速率计算
    if (typeof spawnEnemyOriginal === 'undefined') {
        // 保存原始函数
        window.spawnEnemyOriginal = spawnEnemy;

        // 重写敌人生成函数
        window.spawnEnemy = function() {
            // 根据关卡调整基础生成间隔（更平缓的增长曲线）
            let baseSpawnRate;
            if (gameState.level <= 10) {
                // 前10关增长较慢，让玩家适应
                baseSpawnRate = Math.max(4000 - (gameState.level * 200), 2000);
            } else if (gameState.level <= 20) {
                // 10-20关适度增长
                baseSpawnRate = Math.max(2000 - ((gameState.level - 10) * 80), 1200);
            } else {
                // 20关之后，增长更平缓但仍具挑战性
                baseSpawnRate = Math.max(1200 - ((gameState.level - 20) * 10), 800);
            }

            const minSpawnRate = 600; // 设置最低间隔，避免敌人过多
            const spawnRate = Math.max(minSpawnRate, baseSpawnRate);

            // 根据难度调整生成速率
            const adjustedSpawnRate = spawnRate / gameState.enemySpawnRate;

            setTimeout(spawnEnemyOriginal, adjustedSpawnRate);
        };
    }

    // 2. 优化玩家升级时的生命值增长曲线
    // 修改handleLevelUp函数中的生命值增长
    if (typeof handleLevelUpOriginal === 'undefined') {
        window.handleLevelUpOriginal = handleLevelUp;

        window.handleLevelUp = function() {
            // 原有升级逻辑
            gameState.level++;

            // 更平滑的生命值增长
            const baseHpIncrease = 6; // 稍微降低基础增长
            let levelMultiplier;

            if (gameState.level <= 15) {
                // 前15关增长正常
                levelMultiplier = 1.0;
            } else if (gameState.level <= 30) {
                // 15-30关增长放缓
                levelMultiplier = Math.max(0.6, 1.0 - ((gameState.level - 15) * 0.02));
            } else {
                // 30关后增长更慢，保持可玩性
                levelMultiplier = Math.max(0.3, 0.7 - ((gameState.level - 30) * 0.01));
            }

            const hpIncrease = Math.floor(baseHpIncrease * levelMultiplier);

            gameState.player.maxHp += hpIncrease;
            gameState.player.hp += hpIncrease; // 同时恢复相应生命值

            // 限制最大生命值，避免过度膨胀
            const maxHpLimit = 400; // 降低上限，使游戏更有挑战性
            gameState.player.maxHp = Math.min(gameState.player.maxHp, maxHpLimit);
            gameState.player.hp = Math.min(gameState.player.hp, gameState.player.maxHp);

            // 检查并处理特殊关卡里程碑事件
            handleMilestoneEvents();

            // 显示升级提示
            showCombatLog(t('levelUp').replace('%d', gameState.level), 'level-up');
        };
    }

    // 3. 调整升级所需击杀数
    // 修改updateUI函数中的击杀目标计算
    if (typeof updateUIOriginal === 'undefined') {
        window.updateUIOriginal = updateUI;

        window.updateUI = function() {
            // 调用原函数
            updateUIOriginal();

            // 重新计算并更新击杀目标（使用更平衡的公式）
            let killGoal;
            if (gameState.level <= 5) {
                // 前5关较容易
                killGoal = 5 + Math.floor(gameState.level * 1.0);
            } else if (gameState.level <= 15) {
                // 5-15关平稳增长
                killGoal = 10 + Math.floor((gameState.level - 5) * 1.2) + Math.floor(gameState.level * 0.3);
            } else {
                // 15关后更陡峭但可控的增长
                killGoal = 22 + Math.floor((gameState.level - 15) * 1.5) + Math.floor(gameState.level * 0.2);
            }

            // 限制最大击杀数，避免过于困难
            killGoal = Math.min(killGoal, 50);

            document.getElementById('goal').textContent = `击杀${killGoal}敌升级`;
        };
    }

    // 4. 优化敌人属性成长曲线
    // 修改Enemy构造函数中的属性调整
    if (typeof EnemyOriginal === 'undefined') {
        window.EnemyOriginal = Enemy;

        // 重新定义Enemy类，修改其构造函数
        class BalancedEnemy extends EnemyOriginal {
            constructor(level, type = null) {
                super(level, type); // 调用原始构造函数

                // 调整敌人属性成长曲线，使其更加平衡
                const levelFactor = Math.pow(level, 0.8); // 使用0.8次方而非线性增长

                // 调整血量成长，降低后期增长率
                this.maxHp *= (0.7 + levelFactor * 0.15); // 基础成长降低
                this.hp = this.maxHp;

                // 调整伤害成长，保持挑战性但不过于困难
                this.damage *= (0.8 + Math.min(levelFactor * 0.08, 0.01 * level)); // 后期成长放缓

                // 调整敌人大小，避免过大
                this.size = Math.min(this.size, 40 + level * 0.3);
            }
        }

        // 替换Enemy类
        window.Enemy = BalancedEnemy;
    }

    // 5. 优化武器掉落机制
    // 修改getRandomWeapon函数中的稀有度分布
    if (typeof getRandomWeaponOriginal === 'undefined') {
        window.getRandomWeaponOriginal = getRandomWeapon;

        window.getRandomWeapon = function() {
            // 根据关卡调整武器稀有度分布
            const level = gameState.level;
            let commonChance, uncommonChance, rareChance, epicChance, legendaryChance, mythicChance;

            if (level <= 3) {
                // 前几关主要是普通和不常见武器
                commonChance = 0.70;
                uncommonChance = 0.25;
                rareChance = 0.05;
                epicChance = 0;
                legendaryChance = 0;
                mythicChance = 0;
            } else if (level <= 8) {
                // 中前期加入更多稀有武器
                commonChance = 0.50;
                uncommonChance = 0.30;
                rareChance = 0.15;
                epicChance = 0.04;
                legendaryChance = 0.01;
                mythicChance = 0;
            } else if (level <= 15) {
                // 中后期平衡分布
                commonChance = 0.35;
                uncommonChance = 0.25;
                rareChance = 0.20;
                epicChance = 0.15;
                legendaryChance = 0.04;
                mythicChance = 0.01;
            } else {
                // 后期仍有各种稀有度的武器
                commonChance = 0.20;
                uncommonChance = 0.20;
                rareChance = 0.25;
                epicChance = 0.25;
                legendaryChance = 0.08;
                mythicChance = 0.02;
            }

            const rand = Math.random();
            if (rand < commonChance) {
                return getRandomWeaponByRarity('common');
            } else if (rand < commonChance + uncommonChance) {
                return getRandomWeaponByRarity('uncommon');
            } else if (rand < commonChance + uncommonChance + rareChance) {
                return getRandomWeaponByRarity('rare');
            } else if (rand < commonChance + uncommonChance + rareChance + epicChance) {
                return getRandomWeaponByRarity('epic');
            } else if (rand < commonChance + uncommonChance + rareChance + epicChance + legendaryChance) {
                return getRandomWeaponByRarity('legendary');
            } else {
                return getRandomWeaponByRarity('mythic');
            }
        };
    }

    // 6. 添加游戏难度自适应机制
    // 根据玩家表现动态调整游戏参数
    setInterval(() => {
        if (gameState.isPlaying && !gameState.isGameOver) {
            // 每隔一段时间检查玩家状态，调整难度
            const timeSinceLastKill = Date.now() - (gameState.lastKillTime || Date.now());
            const currentHpPercent = gameState.player.hp / gameState.player.maxHp;

            // 如果长时间未击杀敌人且生命值较低，略微降低难度
            if (timeSinceLastKill > 15000 && currentHpPercent < 0.3) {
                // 暂时降低敌人生成速率
                gameState.temporaryDifficultyModifier = 1.3;
                setTimeout(() => {
                    gameState.temporaryDifficultyModifier = 1.0;
                }, 10000); // 10秒后恢复正常
            } else {
                gameState.temporaryDifficultyModifier = 1.0;
            }
        }
    }, 5000); // 每5秒检查一次

    // 7. 优化敌人生成权重
    // 修改enemyWeights以平衡不同类型的敌人
    if (typeof adjustEnemyGeneration !== 'undefined') {
        // 重新定义敌人生成权重，使其更平衡
        window.adjustedEnemyWeights = function(level) {
            const baseWeights = {
                'MELEE': Math.min(0.35, 0.4 - (level * 0.004)), // 降低近战敌人初始比例
                'RANGED': Math.min(0.25, 0.2 + (level * 0.006)), // 平衡远程敌人比例
                'ELITE': Math.min(0.12, 0.03 + (level * 0.006)), // 控制精英敌人数量
                'SUPPORT': Math.min(0.08, 0.01 + (level * 0.004)), // 控制支援型敌人数量
                'ARCHER': Math.min(0.08, 0.01 + (level * 0.004)), // 控制弓箭手数量
                'MAGE': Math.min(0.06, 0.008 + (level * 0.003)), // 控制法师数量
                'ASSASSIN': Math.min(0.04, 0.004 + (level * 0.003)), // 控制刺客数量
                'UNDEAD': Math.min(0.04, 0.004 + (level * 0.002)), // 控制亡灵数量
                'BEAST': Math.min(0.04, 0.004 + (level * 0.002)), // 控制野兽数量
                'SKELETON': Math.min(0.03, 0.003 + (level * 0.002)), // 控制骷髅数量
                'GOBLIN': Math.min(0.03, 0.003 + (level * 0.002)), // 控制哥布林数量
                'DRAGON': Math.min(0.02, 0.001 + (level * 0.0015)), // 控制龙类数量
                'GOLEM': Math.min(0.02, 0.001 + (level * 0.0015)), // 控制石像鬼数量
                'SPIDER': Math.min(0.02, 0.001 + (level * 0.0015)), // 控制蜘蛛数量
                'BERSERKER': Math.min(0.015, 0.0008 + (level * 0.001)), // 控制狂战士数量
                'WIZARD': Math.min(0.015, 0.0008 + (level * 0.001)), // 控制巫师数量
                'PHANTOM': Math.min(0.015, 0.0008 + (level * 0.001)), // 控制幻影数量
                'TROLL': Math.min(0.01, 0.0005 + (level * 0.0008)), // 控制巨魔数量
                'LICH': Math.min(0.008, 0.0003 + (level * 0.0006)), // 控制巫妖王数量
                'BOSS': Math.min(0.005, 0.0002 + (level * 0.0005)), // 控制Boss数量
                'DEMIGOD': Math.min(0.002, 0.00005 + (level * 0.0002)), // 控制半神数量
                'DEMON': Math.min(0.003, 0.0001 + (level * 0.0003)), // 控制小恶魔数量
                'ELEMENTAL': Math.min(0.005, 0.0001 + (level * 0.0003)) // 控制元素生物数量
            };

            // 高级敌人仅在特定关卡出现
            if (level > 8) {
                baseWeights['ANGEL'] = Math.min(0.003, 0.00005 + (level * 0.0001));
                baseWeights['NINJA'] = Math.min(0.003, 0.00005 + (level * 0.00015));
                baseWeights['CYBORG'] = Math.min(0.002, 0.00003 + (level * 0.0001));
                baseWeights['ELF'] = Math.min(0.002, 0.00003 + (level * 0.0001));
            }

            if (level > 15) {
                baseWeights['ZOMBIE'] = Math.min(0.002, 0.00002 + (level * 0.00008));
                baseWeights['ORGE'] = Math.min(0.0015, 0.00001 + (level * 0.00006));
            }

            if (level > 25) {
                baseWeights['PHOENIX'] = Math.min(0.001, 0.00001 + (level * 0.00005));
                baseWeights['KRAKEN'] = Math.min(0.0008, 0.000005 + (level * 0.00003));
            }

            if (level > 35) {
                baseWeights['DRAGON_KING'] = Math.min(0.0005, 0.000002 + (level * 0.00002));
                baseWeights['UNICORN'] = Math.min(0.0005, 0.000002 + (level * 0.00002));
            }

            if (level > 40) {
                baseWeights['BASILISK'] = Math.min(0.0003, 0.000001 + (level * 0.000015));
                baseWeights['GRIFFIN'] = Math.min(0.0003, 0.000001 + (level * 0.000015));
            }

            return baseWeights;
        };
    }

    console.log("游戏平衡性补丁已完全应用");
} else {
    console.log("游戏平衡性补丁已存在，跳过重复加载");
}