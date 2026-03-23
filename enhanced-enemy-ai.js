// ==================== 增强版敌人AI系统 ====================
//
// 为Steam发布准备的高级敌人AI系统，包括：
// 1. 更智能的移动和战斗行为
// 2. 团队协作AI
// 3. 动态策略选择
// 4. 环境感知能力

class EnhancedEnemyAI {
    constructor() {
        this.enemyBehaviors = {
            'MELEE': new MeleeBehavior(),
            'RANGED': new RangedBehavior(),
            'ELITE': new EliteBehavior(),
            'BOSS': new BossBehavior(),
            'SUPPORT': new SupportBehavior(),
            'ASSASSIN': new AssassinBehavior()
        };

        this.threatLevels = new Map(); // 记录每个敌人的威胁等级
        this.groupBehaviors = new GroupBehaviorManager(); // 群体行为管理器
    }

    // 更新所有敌人的AI
    update(enemies, player, gameState) {
        // 计算全局环境因素
        const environmentFactors = this.calculateEnvironmentFactors(player, enemies);

        // 更新每个敌人的AI
        for (let i = 0; i < enemies.length; i++) {
            const enemy = enemies[i];

            // 确保敌人有AI组件
            if (!enemy.aiComponent) {
                enemy.aiComponent = {
                    lastDecisionTime: 0,
                    decisionCooldown: 100, // 100ms决策冷却
                    currentStrategy: 'default',
                    targetPriority: 'player',
                    behaviorHistory: []
                };
            }

            const aiComp = enemy.aiComponent;
            const now = Date.now();

            // 检查是否需要做新决策
            if (now - aiComp.lastDecisionTime > aiComp.decisionCooldown) {
                this.makeDecision(enemy, player, enemies, gameState, environmentFactors);
                aiComp.lastDecisionTime = now;
            }

            // 执行当前策略
            this.executeStrategy(enemy, player, gameState);
        }

        // 更新群体行为
        this.groupBehaviors.update(enemies, player, gameState);
    }

    // 做出AI决策
    makeDecision(enemy, player, allEnemies, gameState, envFactors) {
        const aiComp = enemy.aiComponent;

        // 根据敌人类型选择行为
        const behavior = this.enemyBehaviors[enemy.type] || this.enemyBehaviors.MELEE;

        // 更新威胁等级
        this.updateThreatLevel(enemy, player, allEnemies);

        // 计算策略权重
        const strategyWeights = behavior.evaluateStrategies(enemy, player, allEnemies, gameState, envFactors);

        // 选择最佳策略
        let bestStrategy = 'default';
        let bestWeight = -Infinity;
        for (const [strategy, weight] of Object.entries(strategyWeights)) {
            if (weight > bestWeight) {
                bestWeight = weight;
                bestStrategy = strategy;
            }
        }

        aiComp.currentStrategy = bestStrategy;

        // 记录行为历史
        aiComp.behaviorHistory.push({
            strategy: bestStrategy,
            time: Date.now(),
            health: enemy.hp / enemy.maxHp,
            distance: this.getDistance(enemy, player)
        });

        // 限制历史记录长度
        if (aiComp.behaviorHistory.length > 10) {
            aiComp.behaviorHistory.shift();
        }
    }

    // 执行策略
    executeStrategy(enemy, player, gameState) {
        const aiComp = enemy.aiComponent;
        const behavior = this.enemyBehaviors[enemy.type] || this.enemyBehaviors.MELEE;

        switch (aiComp.currentStrategy) {
            case 'attack':
                behavior.attack(enemy, player, gameState);
                break;
            case 'defend':
                behavior.defend(enemy, player, gameState);
                break;
            case 'retreat':
                behavior.retreat(enemy, player, gameState);
                break;
            case 'flank':
                behavior.flank(enemy, player, gameState);
                break;
            case 'support':
                behavior.support(enemy, player, gameState);
                break;
            case 'ambush':
                behavior.ambush(enemy, player, gameState);
                break;
            default:
                behavior.defaultAction(enemy, player, gameState);
                break;
        }
    }

    // 计算环境因素
    calculateEnvironmentFactors(player, enemies) {
        const obstacles = this.detectObstacles(); // 假设有障碍物检测
        const coverPositions = this.findCoverPositions(obstacles); // 寻找掩护位置
        const escapeRoutes = this.findEscapeRoutes(player, enemies); // 寻找逃生路线

        return {
            obstacles,
            coverPositions,
            escapeRoutes,
            playerProximity: this.calculatePlayerProximity(player, enemies),
            enemyDensity: this.calculateEnemyDensity(enemies),
            resourceAvailability: this.calculateResourceAvailability()
        };
    }

    // 检测障碍物
    detectObstacles() {
        // 在实际游戏中，这将根据地图数据返回障碍物位置
        // 暂时返回空数组
        return [];
    }

    // 寻找掩护位置
    findCoverPositions(obstacles) {
        // 根据障碍物计算掩护位置
        // 暂时返回空数组
        return [];
    }

    // 寻找逃生路线
    findEscapeRoutes(player, enemies) {
        // 计算最佳逃生路线
        // 暂时返回空数组
        return [];
    }

    // 计算玩家接近度
    calculatePlayerProximity(player, enemies) {
        let closestDistance = Infinity;
        let averageDistance = 0;

        for (const enemy of enemies) {
            const dist = this.getDistance(enemy, player);
            if (dist < closestDistance) closestDistance = dist;
            averageDistance += dist;
        }

        averageDistance /= enemies.length || 1;

        return {
            closest: closestDistance,
            average: averageDistance,
            isSurrounded: closestDistance < 100 // 假设100像素内为被包围
        };
    }

    // 计算敌人密度
    calculateEnemyDensity(enemies) {
        let density = 0;
        const samplePoints = enemies.slice(0, 5); // 采样前5个敌人

        for (let i = 0; i < samplePoints.length; i++) {
            for (let j = i + 1; j < samplePoints.length; j++) {
                const dist = this.getDistance(samplePoints[i], samplePoints[j]);
                if (dist < 150) { // 150像素内的敌人为密集
                    density += 1;
                }
            }
        }

        return density / (samplePoints.length || 1);
    }

    // 计算资源可用性
    calculateResourceAvailability() {
        // 模拟资源可用性计算
        return {
            healthPotions: Math.random() > 0.5,
            powerUps: Math.random() > 0.7,
            cover: Math.random() > 0.3
        };
    }

    // 更新威胁等级
    updateThreatLevel(enemy, player, allEnemies) {
        let threat = 0;

        // 基础威胁：距离越近威胁越高
        threat += (1 / (this.getDistance(enemy, player) + 1)) * 50;

        // 基于血量的威胁：血量越少越激进
        threat += (1 - enemy.hp / enemy.maxHp) * 30;

        // 基于玩家实力的威胁
        threat += (player.level || 1) * 5;

        // 基于周围敌人数量的威胁
        const nearbyEnemies = allEnemies.filter(e =>
            e !== enemy && this.getDistance(e, enemy) < 200
        ).length;
        threat += nearbyEnemies * 10;

        this.threatLevels.set(enemy.id, threat);
        enemy.currentThreatLevel = threat;
    }

    // 计算两点间距离
    getDistance(obj1, obj2) {
        return Math.sqrt((obj1.x - obj2.x) ** 2 + (obj1.y - obj2.y) ** 2);
    }
}

// 近战敌人行为
class MeleeBehavior {
    evaluateStrategies(enemy, player, allEnemies, gameState, envFactors) {
        const weights = {
            'attack': 0,
            'defend': 0,
            'retreat': 0,
            'flank': 0
        };

        const distanceToPlayer = Math.sqrt((enemy.x - player.x) ** 2 + (enemy.y - player.y) ** 2);

        // 当血量较低时，考虑撤退
        if (enemy.hp / enemy.maxHp < 0.3) {
            weights.retreat += 40;
        }

        // 当靠近玩家时，倾向于进攻
        if (distanceToPlayer < 80) {
            weights.attack += 50;
        } else if (distanceToPlayer > 150) {
            weights.flank += 30;
        }

        // 考虑玩家攻击状态
        if (player.isAttacking) {
            weights.defend += 25;
        }

        // 考虑环境因素
        if (envFactors.playerProximity.closest < 50) {
            weights.attack += 15;
        }

        return weights;
    }

    attack(enemy, player, gameState) {
        // 朝玩家移动并攻击
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            enemy.x += (dx / distance) * enemy.speed * 0.8; // 0.8倍速避免过度追击
            enemy.y += (dy / distance) * enemy.speed * 0.8;
        }
    }

    defend(enemy, player, gameState) {
        // 小幅度后退或寻找掩护
        const dx = enemy.x - player.x;
        const dy = enemy.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            enemy.x += (dx / distance) * enemy.speed * 0.3;
            enemy.y += (dy / distance) * enemy.speed * 0.3;
        }
    }

    retreat(enemy, player, gameState) {
        // 快速远离玩家
        const dx = enemy.x - player.x;
        const dy = enemy.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            enemy.x += (dx / distance) * enemy.speed;
            enemy.y += (dy / distance) * enemy.speed;
        }
    }

    flank(enemy, player, gameState) {
        // 尝试绕到玩家侧面
        const angleOffset = Math.PI / 4; // 45度偏移
        const baseAngle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
        const flankingAngle = baseAngle + angleOffset;

        enemy.x += Math.cos(flankingAngle) * enemy.speed * 0.6;
        enemy.y += Math.sin(flankingAngle) * enemy.speed * 0.6;
    }

    defaultAction(enemy, player, gameState) {
        // 默认慢慢靠近玩家
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            enemy.x += (dx / distance) * enemy.speed * 0.5;
            enemy.y += (dy / distance) * enemy.speed * 0.5;
        }
    }
}

// 远程敌人行为
class RangedBehavior {
    evaluateStrategies(enemy, player, allEnemies, gameState, envFactors) {
        const weights = {
            'attack': 0,
            'defend': 0,
            'retreat': 0,
            'flank': 0
        };

        const distanceToPlayer = Math.sqrt((enemy.x - player.x) ** 2 + (enemy.y - player.y) ** 2);
        const optimalRange = enemy.attackRange || 120;
        const rangeTolerance = 30;

        // 保持最优射程
        if (Math.abs(distanceToPlayer - optimalRange) < rangeTolerance) {
            weights.attack += 60;
        } else if (distanceToPlayer > optimalRange + rangeTolerance) {
            // 太远了，靠近一点
            weights.flank += 35;
        } else if (distanceToPlayer < optimalRange - rangeTolerance) {
            // 太近了，后退
            weights.retreat += 40;
        }

        // 血量低时更倾向于撤退
        if (enemy.hp / enemy.maxHp < 0.4) {
            weights.retreat += 20;
        }

        // 玩家攻击时可能需要躲避
        if (player.isAttacking && distanceToPlayer < 100) {
            weights.retreat += 15;
        }

        return weights;
    }

    attack(enemy, player, gameState) {
        // 保持安全距离
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const optimalRange = enemy.attackRange || 120;

        if (distance > 0) {
            if (distance < optimalRange - 10) {
                // 太近了，稍微后退
                enemy.x -= (dx / distance) * enemy.speed * 0.4;
                enemy.y -= (dy / distance) * enemy.speed * 0.4;
            } else if (distance > optimalRange + 10) {
                // 太远了，稍微前进
                enemy.x += (dx / distance) * enemy.speed * 0.4;
                enemy.y += (dy / distance) * enemy.speed * 0.4;
            }
            // 如果在理想范围内，原地不动等待攻击机会
        }
    }

    defend(enemy, player, gameState) {
        // 迅速增加与玩家的距离
        const dx = enemy.x - player.x;
        const dy = enemy.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            enemy.x += (dx / distance) * enemy.speed;
            enemy.y += (dy / distance) * enemy.speed;
        }
    }

    retreat(enemy, player, gameState) {
        // 快速远离玩家
        this.defend(enemy, player, gameState);
    }

    flank(enemy, player, gameState) {
        // 尝试侧翼射击位置
        const optimalRange = enemy.attackRange || 120;
        const angleOffset = Math.PI / 3; // 60度偏移
        const baseAngle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
        const flankingAngle = baseAngle + angleOffset;

        const targetX = player.x + Math.cos(flankingAngle) * optimalRange;
        const targetY = player.y + Math.sin(flankingAngle) * optimalRange;

        const dx = targetX - enemy.x;
        const dy = targetY - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            enemy.x += (dx / distance) * enemy.speed * 0.7;
            enemy.y += (dy / distance) * enemy.speed * 0.7;
        }
    }

    defaultAction(enemy, player, gameState) {
        // 移动到最佳射程
        this.attack(enemy, player, gameState);
    }
}

// 精英敌人行为
class EliteBehavior {
    constructor() {
        this.aggresiveModeThreshold = 0.6; // 血量低于此值时启用激进模式
    }

    evaluateStrategies(enemy, player, allEnemies, gameState, envFactors) {
        const weights = {
            'attack': 0,
            'defend': 0,
            'retreat': 0,
            'flank': 0,
            'special': 0
        };

        const distanceToPlayer = Math.sqrt((enemy.x - player.x) ** 2 + (enemy.y - player.y) ** 2);
        const healthPercentage = enemy.hp / enemy.maxHp;

        // 血量充足时更激进
        if (healthPercentage > this.aggresiveModeThreshold) {
            weights.attack += 45;
            weights.special += 20;
        } else {
            // 血量不足时可能采用不同策略
            if (distanceToPlayer > 100) {
                weights.flank += 35;
            } else {
                weights.defend += 25;
            }
        }

        // 考虑玩家当前状态
        if (player.isUsingPowerfulWeapon) {
            weights.defend += 15;
        }

        // 精英敌人会尝试使用特殊能力
        if (enemy.hasSpecialAbility) {
            weights.special += 30;
        }

        return weights;
    }

    attack(enemy, player, gameState) {
        // 激进的攻击方式
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            // 精英敌人移动更快
            enemy.x += (dx / distance) * enemy.speed * 1.2;
            enemy.y += (dy / distance) * enemy.speed * 1.2;
        }
    }

    defend(enemy, player, gameState) {
        // 策略性撤退，准备反攻
        const dx = enemy.x - player.x;
        const dy = enemy.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            enemy.x += (dx / distance) * enemy.speed * 0.6;
            enemy.y += (dy / distance) * enemy.speed * 0.6;
        }
    }

    retreat(enemy, player, gameState) {
        // 战术性撤退，而非慌乱逃跑
        this.defend(enemy, player, gameState);
    }

    flank(enemy, player, gameState) {
        // 更智能的包抄策略
        const angleVariation = (Math.random() - 0.5) * Math.PI / 2; // ±90度随机
        const baseAngle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
        const flankingAngle = baseAngle + Math.PI / 2 + angleVariation;

        enemy.x += Math.cos(flankingAngle) * enemy.speed * 0.8;
        enemy.y += Math.sin(flankingAngle) * enemy.speed * 0.8;
    }

    special(enemy, player, gameState) {
        // 使用特殊能力
        if (enemy.specialAbilityCooldown <= 0) {
            // 执行特殊行动（由游戏逻辑定义）
            if (typeof enemy.useSpecialAbility === 'function') {
                enemy.useSpecialAbility(player, gameState);
            }
            enemy.specialAbilityCooldown = enemy.specialAbilityMaxCooldown || 3000; // 3秒冷却
        } else {
            // 冷却期间执行默认行为
            this.defaultAction(enemy, player, gameState);
        }
    }

    defaultAction(enemy, player, gameState) {
        // 根据血量百分比选择行为
        const healthPercentage = enemy.hp / enemy.maxHp;

        if (healthPercentage > this.aggresiveModeThreshold) {
            this.attack(enemy, player, gameState);
        } else {
            // 血量较低时更谨慎
            const distanceToPlayer = Math.sqrt((enemy.x - player.x) ** 2 + (enemy.y - player.y) ** 2);
            if (distanceToPlayer < 100) {
                this.defend(enemy, player, gameState);
            } else {
                this.attack(enemy, player, gameState);
            }
        }
    }
}

// Boss敌人行为
class BossBehavior {
    constructor() {
        this.phaseThresholds = [0.75, 0.5, 0.25]; // Boss阶段阈值
        this.lastPhaseChange = 0;
    }

    evaluateStrategies(enemy, player, allEnemies, gameState, envFactors) {
        const weights = {
            'attack': 0,
            'defend': 0,
            'retreat': 0,
            'special': 0,
            'summon': 0,
            'environment': 0
        };

        const healthPercentage = enemy.hp / enemy.maxHp;
        const currentPhase = this.getCurrentPhase(healthPercentage);

        // 根据阶段调整策略
        switch (currentPhase) {
            case 0: // 第一阶段 (100%-75%)
                weights.attack += 40;
                weights.special += 20;
                break;
            case 1: // 第二阶段 (75%-50%)
                weights.attack += 30;
                weights.special += 30;
                weights.summon += 15;
                break;
            case 2: // 第三阶段 (50%-25%)
                weights.attack += 20;
                weights.special += 40;
                weights.summon += 25;
                weights.environment += 10;
                break;
            case 3: // 第四阶段 (25%-0%)
                weights.attack += 15;
                weights.special += 50;
                weights.summon += 30;
                weights.environment += 20;
                break;
        }

        // 如果有召唤能力，根据场上小怪数量调整召唤倾向
        if (enemy.canSummon && allEnemies.length < enemy.maxMinions) {
            weights.summon += 20;
        }

        return weights;
    }

    getCurrentPhase(healthPercentage) {
        for (let i = 0; i < this.phaseThresholds.length; i++) {
            if (healthPercentage > this.phaseThresholds[i]) {
                return i;
            }
        }
        return this.phaseThresholds.length; // 最后阶段
    }

    attack(enemy, player, gameState) {
        // Boss级的强力攻击
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            // Boss移动较慢但更具威胁性
            enemy.x += (dx / distance) * enemy.speed * 0.7;
            enemy.y += (dy / distance) * enemy.speed * 0.7;
        }
    }

    defend(enemy, player, gameState) {
        // Boss很少防御，更多是改变战术
        this.attack(enemy, player, gameState);
    }

    retreat(enemy, player, gameState) {
        // Boss一般不会撤退，除非有特殊机制
        // 这里可以实现Boss的阶段转换机制
        this.attack(enemy, player, gameState);
    }

    special(enemy, player, gameState) {
        // Boss特殊能力
        if (enemy.specialAbilityCooldown <= 0) {
            // Boss可能会有不同的特殊能力
            if (typeof enemy.useUltimateAbility === 'function') {
                enemy.useUltimateAbility(player, gameState);
            }
            enemy.specialAbilityCooldown = enemy.ultimateAbilityMaxCooldown || 5000; // 5秒冷却
        }
    }

    summon(enemy, player, gameState) {
        // 召唤小怪
        if (enemy.summonCooldown <= 0 && enemy.summonCount < enemy.maxSummons) {
            // 实现召唤逻辑
            if (typeof enemy.summonMinion === 'function') {
                enemy.summonMinion(gameState);
            }
            enemy.summonCooldown = enemy.summonMaxCooldown || 8000; // 8秒冷却
            enemy.summonCount++;
        }
    }

    environment(enemy, player, gameState) {
        // 改变环境或场地机制
        if (typeof enemy.activateArenaMechanic === 'function') {
            enemy.activateArenaMechanic(gameState);
        }
    }

    defaultAction(enemy, player, gameState) {
        // Boss的默认行为随阶段变化
        this.attack(enemy, player, gameState);
    }
}

// 支援型敌人行为
class SupportBehavior {
    evaluateStrategies(enemy, player, allEnemies, gameState, envFactors) {
        const weights = {
            'attack': 0,
            'defend': 0,
            'retreat': 0,
            'support': 0,
            'buff': 0
        };

        // 找到需要支援的友军
        const allyNeedingSupport = this.findAllyNeedingSupport(enemy, allEnemies);

        if (allyNeedingSupport) {
            weights.support += 50;
        }

        const distanceToPlayer = Math.sqrt((enemy.x - player.x) ** 2 + (enemy.y - player.y) ** 2);

        // 如果玩家太近，可能需要防御或撤退
        if (distanceToPlayer < 100) {
            weights.defend += 20;
        }

        // 如果自身血量低，优先自保
        if (enemy.hp / enemy.maxHp < 0.4) {
            weights.retreat += 30;
        }

        return weights;
    }

    findAllyNeedingSupport(enemy, allEnemies) {
        // 寻找血量较低的友军
        for (const ally of allEnemies) {
            if (ally !== enemy && ally.hp / ally.maxHp < 0.5) {
                return ally;
            }
        }
        return null;
    }

    attack(enemy, player, gameState) {
        // 支援型敌人较少直接攻击
        // 但必要时也会攻击
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0 && distance < 120) {
            // 在一定范围内才攻击
            enemy.x += (dx / distance) * enemy.speed * 0.3;
            enemy.y += (dy / distance) * enemy.speed * 0.3;
        }
    }

    defend(enemy, player, gameState) {
        // 支援型敌人会寻找掩护位置
        const allyNeedingSupport = this.findAllyNeedingSupport(enemy, allEnemies);
        if (allyNeedingSupport) {
            // 移向需要支援的友军
            const dx = allyNeedingSupport.x - enemy.x;
            const dy = allyNeedingSupport.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 0) {
                enemy.x += (dx / distance) * enemy.speed * 0.5;
                enemy.y += (dy / distance) * enemy.speed * 0.5;
            }
        }
    }

    retreat(enemy, player, gameState) {
        // 安全撤退，保持支援能力
        const dx = enemy.x - player.x;
        const dy = enemy.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            enemy.x += (dx / distance) * enemy.speed * 0.7;
            enemy.y += (dy / distance) * enemy.speed * 0.7;
        }
    }

    support(enemy, player, gameState) {
        // 执行支援行动
        const allyNeedingSupport = this.findAllyNeedingSupport(enemy, allEnemies);

        if (allyNeedingSupport) {
            // 为友军提供治疗或增益
            if (typeof enemy.healAlly === 'function') {
                if (this.getDistance(enemy, allyNeedingSupport) < 80) {
                    enemy.healAlly(allyNeedingSupport);
                }
            }

            // 移向友军以提供更好的支援
            const dx = allyNeedingSupport.x - enemy.x;
            const dy = allyNeedingSupport.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 80) { // 不在支援范围内时靠近
                enemy.x += (dx / distance) * enemy.speed * 0.6;
                enemy.y += (dy / distance) * enemy.speed * 0.6;
            }
        }
    }

    buff(enemy, player, gameState) {
        // 为附近的友军提供增益
        if (typeof enemy.buffNearbyAllies === 'function') {
            enemy.buffNearbyAllies(allEnemies);
        }
    }

    defaultAction(enemy, player, gameState) {
        // 默认行为是寻找需要支援的友军
        this.support(enemy, player, gameState);
    }
}

// 刺客型敌人行为
class AssassinBehavior {
    constructor() {
        this.stalkingMode = true;
    }

    evaluateStrategies(enemy, player, allEnemies, gameState, envFactors) {
        const weights = {
            'attack': 0,
            'defend': 0,
            'retreat': 0,
            'ambush': 0,
            'stealth': 0
        };

        const distanceToPlayer = Math.sqrt((enemy.x - player.x) ** 2 + (enemy.y - player.y) ** 2);
        const playerAlertness = this.estimatePlayerAlertness(player, gameState);

        // 刺客型敌人喜欢伏击
        if (playerAlertness < 0.3 && distanceToPlayer > 150) {
            weights.ambush += 60;
        } else if (playerAlertness < 0.5 && distanceToPlayer > 100) {
            weights.stealth += 40;
        } else if (playerAlertness >= 0.5 || distanceToPlayer <= 80) {
            // 被发现或太近时强行攻击
            weights.attack += 50;
        }

        // 血量过低时撤退
        if (enemy.hp / enemy.maxHp < 0.2) {
            weights.retreat += 70;
        }

        return weights;
    }

    estimatePlayerAlertness(player, gameState) {
        // 估算玩家警觉程度（简化版）
        // 基于玩家最近的行为
        if (player.lastCombatTime && Date.now() - player.lastCombatTime < 3000) {
            return 0.8; // 最近战斗过，高度警觉
        }
        if (player.lastDamagedTime && Date.now() - player.lastDamagedTime < 5000) {
            return 0.6; // 最近被攻击过，中等警觉
        }
        return 0.2; // 否则警觉度较低
    }

    attack(enemy, player, gameState) {
        // 高伤害的突然袭击
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            // 快速冲向玩家进行背刺
            enemy.x += (dx / distance) * enemy.speed * 1.5;
            enemy.y += (dy / distance) * enemy.speed * 1.5;
        }
    }

    ambush(enemy, player, gameState) {
        // 伏击：先隐藏再突然袭击
        // 找到一个好位置进行埋伏
        const ambushPoint = this.findAmbushPoint(enemy, player, gameState);
        if (ambushPoint) {
            const dx = ambushPoint.x - enemy.x;
            const dy = ambushPoint.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 10) {
                // 前往伏击点
                enemy.x += (dx / distance) * enemy.speed * 0.7;
                enemy.y += (dy / distance) * enemy.speed * 0.7;
            } else {
                // 到达伏击点，等待时机
                // 这里可以添加伏击等待逻辑
            }
        } else {
            // 没有合适的伏击点，直接前往玩家
            this.attack(enemy, player, gameState);
        }
    }

    stealth(enemy, player, gameState) {
        // 隐身/潜行接近
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            // 缓慢而隐蔽地接近
            enemy.x += (dx / distance) * enemy.speed * 0.4;
            enemy.y += (dy / distance) * enemy.speed * 0.4;
        }
    }

    findAmbushPoint(enemy, player, gameState) {
        // 寻找合适的伏击点
        // 简化实现：选择玩家路径上的一个点
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            // 在玩家前方找个地方埋伏
            const factor = 0.7; // 埋伏在玩家前方70%处
            return {
                x: player.x - dx * factor,
                y: player.y - dy * factor
            };
        }

        return null;
    }

    defaultAction(enemy, player, gameState) {
        // 默认保持潜行状态
        this.stealth(enemy, player, gameState);
    }
}

// 群体行为管理器
class GroupBehaviorManager {
    constructor() {
        this.coordinatedAttacks = [];
        this.defensiveFormations = [];
    }

    update(enemies, player, gameState) {
        // 实现群体AI行为
        this.coordinateGroupActions(enemies, player, gameState);
        this.maintainFormations(enemies, player, gameState);
    }

    coordinateGroupActions(enemies, player, gameState) {
        // 协调团队攻击
        const meleeEnemies = enemies.filter(e => e.type === 'MELEE');
        const rangedEnemies = enemies.filter(e => e.type === 'RANGED');
        const supportEnemies = enemies.filter(e => e.type === 'SUPPORT');

        // 实现团队战术
        if (meleeEnemies.length > 0 && rangedEnemies.length > 0) {
            // 近战在前，远程在后
            this.formTacticalFormation(meleeEnemies, rangedEnemies, player);
        }

        // 支援单位保护脆弱单位
        if (supportEnemies.length > 0) {
            this.assignProtection(supportEnemies, enemies.filter(e => e.type === 'RANGED'));
        }
    }

    formTacticalFormation(meleeEnemies, rangedEnemies, player) {
        // 形成战术阵型：近战包围玩家，远程在后方输出
        for (let i = 0; i < meleeEnemies.length; i++) {
            const enemy = meleeEnemies[i];
            // 计算围绕玩家的位置
            const angle = (i / meleeEnemies.length) * Math.PI * 2;
            const distance = 60; // 包围圈半径

            const targetX = player.x + Math.cos(angle) * distance;
            const targetY = player.y + Math.sin(angle) * distance;

            const dx = targetX - enemy.x;
            const dy = targetY - enemy.y;
            const distToTarget = Math.sqrt(dx * dx + dy * dy);

            if (distToTarget > 5) { // 如果不在目标位置附近
                enemy.x += (dx / distToTarget) * enemy.speed * 0.6;
                enemy.y += (dy / distToTarget) * enemy.speed * 0.6;
            }
        }

        // 远程敌人站位在近战后面
        for (let i = 0; i < rangedEnemies.length; i++) {
            const enemy = rangedEnemies[i];
            // 找到相对安全的位置，位于近战队友后面
            const nearestMelee = this.findNearestEnemy(enemy, meleeEnemies);
            if (nearestMelee) {
                // 站在近战和玩家连线的延长线上
                const directionX = nearestMelee.x - player.x;
                const directionY = nearestMelee.y - player.y;
                const length = Math.sqrt(directionX * directionX + directionY * directionY);

                if (length > 0) {
                    const safetyDistance = 80; // 安全距离
                    const targetX = nearestMelee.x + (directionX / length) * safetyDistance;
                    const targetY = nearestMelee.y + (directionY / length) * safetyDistance;

                    const dx = targetX - enemy.x;
                    const dy = targetY - enemy.y;
                    const distToTarget = Math.sqrt(dx * dx + dy * dy);

                    if (distToTarget > 5) {
                        enemy.x += (dx / distToTarget) * enemy.speed * 0.5;
                        enemy.y += (dy / distToTarget) * enemy.speed * 0.5;
                    }
                }
            }
        }
    }

    assignProtection(supportEnemies, protectees) {
        // 分配支援单位保护脆弱单位
        for (let i = 0; i < supportEnemies.length; i++) {
            if (i < protectees.length) {
                const protector = supportEnemies[i];
                const protectee = protectees[i];

                // 支援单位跟在被保护单位附近
                const dx = protectee.x - protector.x;
                const dy = protectee.y - protector.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist > 50) { // 跟随距离
                    protector.x += (dx / dist) * protector.speed * 0.8;
                    protector.y += (dy / dist) * protector.speed * 0.8;
                } else if (dist < 30) { // 太近了稍微远离
                    protector.x -= (dx / dist) * protector.speed * 0.3;
                    protector.y -= (dy / dist) * protector.speed * 0.3;
                }
            }
        }
    }

    findNearestEnemy(fromEnemy, enemyList) {
        let nearest = null;
        let minDist = Infinity;

        for (const enemy of enemyList) {
            if (enemy !== fromEnemy) {
                const dx = enemy.x - fromEnemy.x;
                const dy = enemy.y - fromEnemy.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < minDist) {
                    minDist = dist;
                    nearest = enemy;
                }
            }
        }

        return nearest;
    }

    maintainFormations(enemies, player, gameState) {
        // 维持编队（可选的高级功能）
    }
}

// 全局AI系统实例
window.EnhancedEnemyAI = new EnhancedEnemyAI();
console.log("🧪 增强版敌人AI系统已加载，包含多种智能行为模式");