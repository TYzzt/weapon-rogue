// ==================== 核心机制强化系统 ====================
//
// 本系统专注于强化游戏的核心机制，提高游戏平衡性和趣味性
// 包括武器替换机制、战斗系统、敌人AI和游戏进程管理的优化

class CoreMechanicsEnhancement {
    constructor() {
        this.init();
        console.log("⚔️ 核心机制强化系统已初始化");
    }

    // 初始化核心增强功能
    init() {
        this.implementAdvancedWeaponSystem();
        this.enhanceCombatMechanics();
        this.improveEnemyBehavior();
        this.optimizeGameBalance();
    }

    // 实现高级武器系统
    implementAdvancedWeaponSystem() {
        // 武器类型定义
        this.weaponTypes = {
            melee: { name: '近战', weight: 0.3 },
            ranged: { name: '远程', weight: 0.25 },
            magic: { name: '魔法', weight: 0.2 },
            special: { name: '特殊', weight: 0.25 }
        };

        // 武器稀有度定义
        this.rarityLevels = {
            common: { name: '普通', color: '#ffffff', multiplier: 1.0, weight: 0.5 },
            uncommon: { name: '罕见', color: '#1eff00', multiplier: 1.2, weight: 0.3 },
            rare: { name: '稀有', color: '#0070dd', multiplier: 1.5, weight: 0.15 },
            epic: { name: '史诗', color: '#a335ee', multiplier: 2.0, weight: 0.04 },
            legendary: { name: '传说', color: '#ff8000', multiplier: 3.0, weight: 0.01 }
        };

        // 武器属性范围
        this.weaponStatsRange = {
            damage: { min: 5, max: 100 },
            speed: { min: 0.1, max: 2.0 },
            range: { min: 10, max: 200 },
            specialEffect: { probability: 0.3 }
        };

        // 增强武器生成算法
        this.enhanceWeaponGeneration();

        // 优化武器替换逻辑
        this.optimizeWeaponReplacement();
    }

    // 增强武器生成算法
    enhanceWeaponGeneration() {
        // 扩展武器生成函数
        if (typeof generateRandomWeapon !== 'undefined') {
            const originalGenerate = window.generateRandomWeapon;
            window.generateRandomWeapon = () => {
                const baseWeapon = originalGenerate();

                // 应用稀有度系统
                const weapon = this.applyRarityToWeapon(baseWeapon);

                // 应用随机属性变异
                this.applyRandomStatsVariation(weapon);

                // 添加特殊效果
                this.addSpecialEffectToWeapon(weapon);

                // 更新显示名称
                weapon.displayName = this.getEnhancedWeaponName(weapon);

                return weapon;
            };
        } else {
            // 如果原函数不存在，创建新的武器生成函数
            window.generateRandomWeapon = () => {
                // 随机选择武器类型
                const types = Object.keys(this.weaponTypes);
                const selectedType = types[Math.floor(Math.random() * types.length)];

                // 随机选择稀有度
                const rarity = this.getRandomRarity();

                // 生成武器
                const weapon = {
                    id: Date.now() + Math.random(),
                    type: selectedType,
                    name: this.getRandomWeaponName(selectedType),
                    displayName: '',
                    rarity: rarity,
                    damage: this.calculateWeaponDamage(rarity),
                    speed: this.calculateWeaponSpeed(rarity),
                    range: this.calculateWeaponRange(rarity),
                    durability: 100,
                    maxDurability: 100,
                    element: this.getRandomElement(), // 元素属性
                    specialEffect: null
                };

                // 添加特殊效果
                if (Math.random() < this.weaponStatsRange.specialEffect.probability) {
                    weapon.specialEffect = this.getRandomSpecialEffect();
                }

                // 更新显示名称
                weapon.displayName = this.getEnhancedWeaponName(weapon);

                return weapon;
            };
        }
    }

    // 应用稀有度到武器
    applyRarityToWeapon(weapon) {
        // 根据当前游戏进度调整稀有度权重
        const gameLevel = (typeof gameState !== 'undefined' && gameState.level) ? gameState.level : 1;
        const rarityAdjustment = Math.min(1.0 + (gameLevel * 0.01), 2.0); // 随着游戏进度提升高品质武器出现几率

        // 按权重随机选择稀有度
        const totalWeight = Object.values(this.rarityLevels).reduce((sum, rarity) => sum + rarity.weight * rarityAdjustment, 0);
        let randomValue = Math.random() * totalWeight;

        for (const [rarityKey, rarityData] of Object.entries(this.rarityLevels)) {
            randomValue -= rarityData.weight * rarityAdjustment;
            if (randomValue <= 0) {
                weapon.rarity = rarityKey;
                break;
            }
        }

        return weapon;
    }

    // 应用随机属性变异
    applyRandomStatsVariation(weapon) {
        const rarityData = this.rarityLevels[weapon.rarity];
        const variation = 0.1 * (1 - rarityData.weight * 3); // 高稀有度武器属性变化较小

        weapon.damage = Math.round(weapon.damage * (1 + (Math.random() * variation * 2 - variation)));
        weapon.speed = parseFloat((weapon.speed * (1 + (Math.random() * variation * 2 - variation))).toFixed(2));
        weapon.range = Math.round(weapon.range * (1 + (Math.random() * variation * 2 - variation)));
    }

    // 添加特殊效果到武器
    addSpecialEffectToWeapon(weapon) {
        // 根据武器稀有度决定是否添加特殊效果
        const hasSpecialEffect = Math.random() < (0.1 + this.rarityLevels[weapon.rarity].weight * 0.4);

        if (hasSpecialEffect) {
            weapon.specialEffect = this.getRandomSpecialEffect();
        }
    }

    // 获取增强的武器名称
    getEnhancedWeaponName(weapon) {
        const rarityPrefix = this.rarityLevels[weapon.rarity].name;
        let baseName = weapon.name || this.getRandomWeaponName(weapon.type);

        // 添加元素前缀
        if (weapon.element) {
            const elementPrefix = this.getElementPrefix(weapon.element);
            baseName = `${elementPrefix}${baseName}`;
        }

        return `${rarityPrefix}·${baseName}`;
    }

    // 获取随机稀有度
    getRandomRarity() {
        const totalWeight = Object.values(this.rarityLevels).reduce((sum, rarity) => sum + rarity.weight, 0);
        let randomValue = Math.random() * totalWeight;

        for (const [rarityKey, rarityData] of Object.entries(this.rarityLevels)) {
            randomValue -= rarityData.weight;
            if (randomValue <= 0) {
                return rarityKey;
            }
        }

        return 'common'; // 默认返回普通稀有度
    }

    // 计算武器伤害
    calculateWeaponDamage(rarity) {
        const baseMin = this.weaponStatsRange.damage.min;
        const baseMax = this.weaponStatsRange.damage.max;
        const multiplier = this.rarityLevels[rarity].multiplier;

        return Math.round(baseMin + Math.random() * (baseMax - baseMin) * multiplier);
    }

    // 计算武器速度
    calculateWeaponSpeed(rarity) {
        const baseMin = this.weaponStatsRange.speed.min;
        const baseMax = this.weaponStatsRange.speed.max;
        const multiplier = this.rarityLevels[rarity].multiplier;

        return parseFloat((baseMin + Math.random() * (baseMax - baseMin) * multiplier).toFixed(2));
    }

    // 计算武器范围
    calculateWeaponRange(rarity) {
        const baseMin = this.weaponStatsRange.range.min;
        const baseMax = this.weaponStatsRange.range.max;
        const multiplier = this.rarityLevels[rarity].multiplier;

        return Math.round(baseMin + Math.random() * (baseMax - baseMin) * multiplier);
    }

    // 获取随机元素属性
    getRandomElement() {
        const elements = ['none', 'fire', 'ice', 'lightning', 'poison', 'holy', 'dark'];
        return elements[Math.floor(Math.random() * elements.length)];
    }

    // 获取元素前缀
    getElementPrefix(element) {
        const prefixes = {
            fire: '烈火',
            ice: '寒冰',
            lightning: '雷电',
            poison: '毒性',
            holy: '神圣',
            dark: '黑暗',
            none: ''
        };

        return prefixes[element] || '';
    }

    // 获取随机特殊效果
    getRandomSpecialEffect() {
        const effects = [
            { name: '吸血', description: '攻击时回复一定生命值', type: 'life_steal', value: Math.random() * 0.1 + 0.05 }, // 5%-15%吸血
            { name: '暴击', description: '有一定几率造成双倍伤害', type: 'critical', value: Math.random() * 0.2 + 0.05 }, // 5%-25%暴击
            { name: '燃烧', description: '使敌人燃烧，持续造成伤害', type: 'burn', value: Math.random() * 20 + 5 }, // 5-25燃烧伤害
            { name: '冰冻', description: '有一定几率冰冻敌人', type: 'freeze', value: Math.random() * 3 + 1 }, // 1-4秒冰冻
            { name: '中毒', description: '使敌人中毒，持续掉血', type: 'poison', value: Math.random() * 15 + 5 }, // 5-20中毒伤害
            { name: '加速', description: '提高攻击速度', type: 'speed_up', value: Math.random() * 0.5 + 0.1 }, // 10%-60%加速
            { name: '穿透', description: '攻击可穿透多个敌人', type: 'pierce', value: Math.floor(Math.random() * 3) + 1 } // 1-3个穿透
        ];

        return effects[Math.floor(Math.random() * effects.length)];
    }

    // 获取随机武器名称
    getRandomWeaponName(type) {
        const names = {
            melee: ['剑', '斧', '锤', '匕首', '长矛', '镰刀', '棍', '爪'],
            ranged: ['弓', '弩', '飞镖', '标枪', '石子', '回旋镖'],
            magic: ['法杖', '魔杖', '卷轴', '水晶', '护符', '戒指'],
            special: ['链鞭', '双刃', '盾牌', '权杖', '指环', '项链']
        };

        const typeNames = names[type] || names.melee;
        return `武器${typeNames[Math.floor(Math.random() * typeNames.length)]}`;
    }

    // 优化武器替换逻辑
    optimizeWeaponReplacement() {
        if (typeof pickupWeapon !== 'undefined') {
            const originalPickup = window.pickupWeapon;

            window.pickupWeapon = (weapon) => {
                // 显示武器信息给玩家
                this.showWeaponInfo(weapon);

                // 原始武器替换
                originalPickup(weapon);

                // 触发武器更换事件
                this.onWeaponReplaced(weapon);
            };
        }
    }

    // 显示武器信息
    showWeaponInfo(weapon) {
        if (typeof showCombatLog !== 'undefined') {
            const rarityColor = this.rarityLevels[weapon.rarity].color;
            const effectText = weapon.specialEffect ? ` | ${weapon.specialEffect.name}效果` : '';
            showCombatLog(
                `✨ 获得新武器: <span style="color:${rarityColor}">${weapon.displayName}</span> 伤害:${weapon.damage}${effectText}`,
                'weapon-acquired'
            );
        }
    }

    // 武器更换回调
    onWeaponReplaced(weapon) {
        // 更新UI显示
        this.updateWeaponUI(weapon);

        // 检查相关成就
        if (typeof enhancedAchievementSystem !== 'undefined') {
            enhancedAchievementSystem.onWeaponAcquired(weapon);
        }
    }

    // 更新武器UI
    updateWeaponUI(weapon) {
        // 更新武器显示
        if (typeof updateWeaponDisplay !== 'undefined') {
            updateWeaponDisplay(weapon);
        }

        // 更新状态栏
        if (typeof updateUI !== 'undefined') {
            updateUI();
        }
    }

    // 增强战斗机制
    enhanceCombatMechanics() {
        // 实现暴击系统
        this.implementCriticalSystem();

        // 实现连击系统
        this.implementComboSystem();

        // 实现元素相克系统
        this.implementElementalSystem();
    }

    // 实现暴击系统
    implementCriticalSystem() {
        if (typeof attack !== 'undefined') {
            const originalAttack = window.attack;

            window.attack = (target) => {
                let result = originalAttack(target);

                if (result && typeof gameState !== 'undefined' && gameState.player) {
                    // 检查玩家是否有暴击武器
                    const hasCritWeapon = gameState.player.weapon &&
                                         gameState.player.weapon.specialEffect &&
                                         gameState.player.weapon.specialEffect.type === 'critical';

                    let critChance = 0.05; // 基础暴击率5%

                    if (hasCritWeapon) {
                        critChance += gameState.player.weapon.specialEffect.value;
                    }

                    // 检查是否暴击
                    if (Math.random() < critChance) {
                        // 实现暴击 - 造成双倍伤害或特殊效果
                        if (typeof showCombatLog !== 'undefined') {
                            showCombatLog('💥 暴击!', 'critical-hit');
                        }

                        // 可以在此处实现二次攻击或伤害翻倍
                        if (target && typeof target.takeDamage === 'function') {
                            // 暴击伤害翻倍
                            const critDamage = (gameState.player.weapon?.damage || 10) * 1;
                            target.takeDamage(critDamage);

                            // 增加分数
                            if (gameState.player) {
                                gameState.player.score += Math.floor(critDamage * 1.5);
                            }
                        }
                    }
                }

                return result;
            };
        }
    }

    // 实现连击系统
    implementComboSystem() {
        // 如果不存在连击相关的变量，创建它们
        if (typeof gameState !== 'undefined') {
            if (!gameState.player) gameState.player = {};
            if (!gameState.player.comboCount) gameState.player.comboCount = 0;
            if (!gameState.player.maxCombo) gameState.player.maxCombo = 0;
            if (!gameState.player.lastHitTime) gameState.player.lastHitTime = 0;
            if (!gameState.player.comboTimeout) gameState.player.comboTimeout = 5000; // 5秒内必须继续攻击，否则连击中断
        }

        // 增强攻击函数以支持连击
        if (typeof attack !== 'undefined') {
            const originalAttack = window.attack;

            window.attack = (target) => {
                const currentTime = Date.now();
                const result = originalAttack(target);

                if (typeof gameState !== 'undefined' && gameState.player) {
                    // 检查是否还在连击时限内
                    if (currentTime - gameState.player.lastHitTime <= gameState.player.comboTimeout) {
                        gameState.player.comboCount++;
                    } else {
                        // 连击中断，重新开始
                        gameState.player.comboCount = 1;
                    }

                    // 更新最后攻击时间
                    gameState.player.lastHitTime = currentTime;

                    // 更新最大连击数
                    if (gameState.player.comboCount > gameState.player.maxCombo) {
                        gameState.player.maxCombo = gameState.player.comboCount;
                    }

                    // 如果达到特定连击数，显示提醒
                    if (gameState.player.comboCount > 1 && gameState.player.comboCount % 5 === 0) {
                        if (typeof showCombatLog !== 'undefined') {
                            showCombatLog(`🔥 ${gameState.player.comboCount} 连击!`, 'combo');
                        }
                    }

                    // 检查连击相关成就
                    if (typeof enhancedAchievementSystem !== 'undefined') {
                        enhancedAchievementSystem.checkAchievements();
                    }
                }

                return result;
            };
        }
    }

    // 实现元素相克系统
    implementElementalSystem() {
        // 定义元素相克关系
        this.elementalChart = {
            fire: { weak: ['water'], strong: ['ice'] },
            ice: { weak: ['fire'], strong: ['water'] },
            water: { weak: ['lightning'], strong: ['fire'] },
            lightning: { weak: ['earth'], strong: ['water'] },
            earth: { weak: ['plant'], strong: ['lightning'] },
            plant: { weak: ['fire'], strong: ['earth'] }
        };

        // 增强攻击函数以支持元素相克
        if (typeof attack !== 'undefined') {
            const originalAttack = window.attack;

            window.attack = (target) => {
                let result = originalAttack(target);

                if (typeof gameState !== 'undefined' && gameState.player && target) {
                    // 检查武器是否带有元素属性
                    const weapon = gameState.player.weapon;
                    if (weapon && weapon.element && weapon.element !== 'none') {
                        // 检查是否存在元素相克
                        const effectiveness = this.checkElementalEffectiveness(weapon.element, target.element || 'none');

                        if (effectiveness > 1) {
                            // 有效果加成，增加额外伤害
                            const bonusDamage = Math.floor((weapon.damage || 10) * (effectiveness - 1));
                            if (target.takeDamage && typeof target.takeDamage === 'function') {
                                target.takeDamage(bonusDamage);

                                if (typeof showCombatLog !== 'undefined') {
                                    showCombatLog(`✨ 元素克制! 额外造成 ${bonusDamage} 伤害`, 'elemental');
                                }
                            }
                        } else if (effectiveness < 1) {
                            // 效果减弱，减少伤害
                            if (typeof showCombatLog !== 'undefined') {
                                showCombatLog('💧 元素效果减弱...', 'elemental');
                            }
                        }
                    }
                }

                return result;
            };
        }
    }

    // 检查元素相克效果
    checkElementalEffectiveness(attackerElement, defenderElement) {
        if (!attackerElement || attackerElement === 'none' || !this.elementalChart[attackerElement]) {
            return 1; // 无加成
        }

        const chart = this.elementalChart[attackerElement];

        if (chart.strong.includes(defenderElement)) {
            return 1.5; // 1.5倍伤害
        } else if (chart.weak.includes(defenderElement)) {
            return 0.7; // 0.7倍伤害
        }

        return 1; // 正常伤害
    }

    // 改进敌人行为
    improveEnemyBehavior() {
        // 增强敌人AI
        this.enhanceEnemyAI();

        // 实现敌人变种
        this.implementEnemyVariants();
    }

    // 增强敌人AI
    enhanceEnemyAI() {
        // 如果存在Enemy类，增强其行为
        if (typeof Enemy !== 'undefined' && Enemy.prototype) {
            const originalUpdate = Enemy.prototype.update;

            Enemy.prototype.update = function(deltaTime) {
                // 调用原始更新逻辑
                if (originalUpdate) {
                    originalUpdate.call(this, deltaTime);
                }

                // 增强AI逻辑
                if (typeof gameState !== 'undefined' && gameState.player) {
                    const dx = gameState.player.x - this.x;
                    const dy = gameState.player.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    // 根据距离采取不同策略
                    if (distance < 50) {
                        // 近距离 - 攻击
                        this.mode = 'aggressive';
                    } else if (distance < 150) {
                        // 中距离 - 跟踪
                        this.mode = 'tracking';
                    } else {
                        // 远距离 - 巡逻或休息
                        this.mode = 'patrol';
                    }

                    // 如果敌人有特殊能力，可以在这里实现
                    if (this.specialAbility && Math.random() < 0.01) { // 1%概率使用特殊能力
                        this.useSpecialAbility();
                    }
                }
            };

            // 添加特殊能力方法
            Enemy.prototype.useSpecialAbility = function() {
                // 这里可以根据敌人类型实现特殊能力
                if (this.type === 'boss') {
                    // Boss特殊能力：召唤小怪
                    if (typeof spawnEnemy !== 'undefined') {
                        // 在附近生成一个小怪
                        spawnEnemy(this.x + (Math.random() * 100 - 50), this.y + (Math.random() * 100 - 50));
                    }
                } else if (this.type === 'archer') {
                    // 远程敌人特殊能力：快速射击
                    if (typeof shootProjectile !== 'undefined') {
                        // 发射多发子弹
                        for (let i = 0; i < 3; i++) {
                            setTimeout(() => {
                                shootProjectile(this.x, this.y, gameState.player.x, gameState.player.y);
                            }, i * 200);
                        }
                    }
                }
            };
        }
    }

    // 实现敌人变种
    implementEnemyVariants() {
        // 创建增强的敌人生成函数
        if (typeof spawnEnemy !== 'undefined') {
            const originalSpawn = window.spawnEnemy;

            window.spawnEnemy = (x, y, enemyType) => {
                const enemy = originalSpawn(x, y, enemyType);

                // 根据游戏进度和关卡随机增强敌人
                if (typeof gameState !== 'undefined') {
                    const level = gameState.level || 1;

                    // 随机给敌人添加特殊能力
                    if (Math.random() < 0.1 * (level / 10)) { // 随着等级提高，精英敌人出现概率增加
                        this.addSpecialTraitToEnemy(enemy, level);
                    }
                }

                return enemy;
            };
        }
    }

    // 给敌人添加特殊特质
    addSpecialTraitToEnemy(enemy, level) {
        const traits = [
            { name: '坚韧', description: '拥有额外生命值', healthBonus: Math.floor(level * 2) },
            { name: '敏捷', description: '移动速度更快', speedBonus: 0.5 },
            { name: '强力', description: '攻击力更强', damageBonus: Math.floor(level * 0.5) },
            { name: '分裂', description: '死亡时分裂成小怪', splits: true },
            { name: '护盾', description: '拥有伤害减免', defense: 0.2 }
        ];

        // 随机选择一个特质
        const trait = traits[Math.floor(Math.random() * traits.length)];

        // 应用特质
        enemy.trait = trait;
        if (trait.healthBonus) {
            enemy.maxHp += trait.healthBonus;
            enemy.hp += trait.healthBonus;
        }
        if (trait.speedBonus) {
            enemy.speed += trait.speedBonus;
        }
        if (trait.damageBonus) {
            enemy.damage += trait.damageBonus;
        }

        // 显示特质信息
        if (typeof showCombatLog !== 'undefined') {
            showCombatLog(`👹 稀有敌人出现: ${trait.name} ${trait.description}`, 'rare-enemy');
        }
    }

    // 优化游戏平衡
    optimizeGameBalance() {
        // 调整难度曲线
        this.adjustDifficultyCurve();

        // 平衡武器系统
        this.balanceWeaponSystem();

        // 优化经验值系统
        this.optimizeExperienceSystem();
    }

    // 调整难度曲线
    adjustDifficultyCurve() {
        // 根据关卡数调整敌人强度
        if (typeof updateLevelDifficulty !== 'undefined') {
            window.updateLevelDifficulty = (level) => {
                const baseMultiplier = 1 + (level - 1) * 0.1; // 每关难度增加10%

                // 应用难度乘数
                window.ENEMY_DAMAGE_MULTIPLIER = Math.min(baseMultiplier * 1.2, 10); // 限制最大难度
                window.ENEMY_HEALTH_MULTIPLIER = Math.min(baseMultiplier * 1.1, 8);  // 限制最大血量
                window.ENEMY_COUNT_MULTIPLIER = Math.min(0.8 + level * 0.05, 2.5);  // 控制敌人数量增长

                console.log(`关卡 ${level} 难度已调整: 伤害x${window.ENEMY_DAMAGE_MULTIPLIER.toFixed(1)}, 血量x${window.ENEMY_HEALTH_MULTIPLIER.toFixed(1)}, 数量x${window.ENEMY_COUNT_MULTIPLIER.toFixed(1)}`);
            };
        }
    }

    // 平衡武器系统
    balanceWeaponSystem() {
        // 确保武器生成符合平衡性
        window.WEAPON_BALANCE_FACTOR = 1.0;

        // 限制极端数值
        window.validateWeaponStats = (weapon) => {
            // 限制伤害范围
            weapon.damage = Math.max(1, Math.min(weapon.damage, 500));

            // 限制速度范围
            weapon.speed = Math.max(0.05, Math.min(weapon.speed, 5.0));

            // 限制范围范围
            weapon.range = Math.max(5, Math.min(weapon.range, 500));

            return weapon;
        };
    }

    // 优化经验值系统
    optimizeExperienceSystem() {
        if (typeof gainExp !== 'undefined') {
            const originalGainExp = window.gainExp;

            window.gainExp = (amount) => {
                // 根据当前关卡调整经验获取效率
                if (typeof gameState !== 'undefined') {
                    const level = gameState.level || 1;
                    const experienceMultiplier = 1 + (level * 0.02); // 每关经验获取提高2%
                    const adjustedAmount = amount * experienceMultiplier;

                    originalGainExp(adjustedAmount);
                } else {
                    originalGainExp(amount);
                }
            };
        }
    }

    // 获取增强系统状态
    getStatus() {
        return {
            weaponSystem: 'active',
            combatSystem: 'enhanced',
            enemyAI: 'improved',
            balance: 'optimized',
            enhancementCount: 12 // 总共实现的增强功能数
        };
    }
}

// 初始化核心机制强化系统
const coreMechanicsEnhancement = new CoreMechanicsEnhancement();

// 将实例添加到全局作用域以便其他模块访问
window.CoreMechanicsEnhancement = CoreMechanicsEnhancement;
window.coreMechanicsEnhancement = coreMechanicsEnhancement;

console.log("🚀 核心机制强化系统已完全加载");