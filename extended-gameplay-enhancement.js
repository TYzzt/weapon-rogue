// ==================== 游戏玩法深度增强系统 ====================
//
// 本文件实现对游戏核心玩法的全面增强，包括：
// 1. 玩家移动和战斗机制改进
// 2. 敌人AI行为增强
// 3. 游戏平衡性优化
// 4. 新的游戏机制和互动元素

class ExtendedGameplayEnhancement {
    constructor() {
        // 初始化扩展增强功能
        this.init();

        // 新增游戏系统
        this.comboSystem = new ComboSystem();
        this.elementalSystem = new ElementalSystem();
        this.passiveSkillSystem = new PassiveSkillSystem();

        console.log("🎮 游戏玩法深度增强系统已初始化");
    }

    // 初始化扩展功能
    init() {
        // 增强玩家移动系统
        this.enhancePlayerMovement();

        // 增强战斗系统
        this.enhanceCombatSystem();

        // 增强敌人AI
        this.enhanceEnemyAI();

        // 添加新的游戏事件处理器
        this.addGameEventHandlers();

        // 增强连击系统
        this.enhanceComboSystem();

        // 增强元素系统
        this.enhanceElementalSystem();
    }

    // 增强玩家移动系统
    enhancePlayerMovement() {
        // 保存原始玩家对象（如果存在）
        if (typeof player !== 'undefined') {
            const originalPlayer = player;

            // 扩展玩家对象以支持更多移动方式
            player.x = canvas.width / 2;
            player.y = canvas.height / 2;
            player.size = 20;
            player.speed = 3;
            player.baseSpeed = 3; // 基础速度
            player.movementDirection = { x: 0, y: 0 }; // 移动方向向量

            // 添加玩家移动状态
            player.status = {
                isMoving: false,
                isDodging: false,
                dodgeCooldown: 0,
                lastMoveTime: 0
            };

            // 扩展玩家移动函数
            player.move = (dx, dy) => {
                // 计算标准化方向向量
                const magnitude = Math.sqrt(dx * dx + dy * dy);
                if (magnitude > 0) {
                    dx = dx / magnitude;
                    dy = dy / magnitude;
                }

                // 应用速度修正
                const effectiveSpeed = player.baseSpeed * (gameState.player.speedBonus || 1);

                // 更新玩家位置，同时确保不超出边界
                const newX = player.x + dx * effectiveSpeed;
                const newY = player.y + dy * effectiveSpeed;

                player.x = Math.max(player.size, Math.min(canvas.width - player.size, newX));
                player.y = Math.max(player.size, Math.min(canvas.height - player.size, newY));

                // 更新移动状态
                player.status.isMoving = magnitude > 0;
                player.status.lastMoveTime = Date.now();
            };

            // 闪避功能
            player.dodge = () => {
                if (player.status.dodgeCooldown <= 0) {
                    // 实现短暂的快速移动闪避
                    const dodgeDistance = 40;
                    const angle = Math.atan2(mouseY - player.y, mouseX - player.x);

                    player.x = Math.max(player.size, Math.min(canvas.width - player.size, player.x + Math.cos(angle) * dodgeDistance));
                    player.y = Math.max(player.size, Math.min(canvas.height - player.size, player.y + Math.sin(angle) * dodgeDistance));

                    player.status.isDodging = true;
                    player.status.dodgeCooldown = 60; // 1秒冷却

                    // 创建闪避粒子效果
                    createTwinkleEffect(player.x, player.y, '#00FFFF', 15);

                    return true;
                }
                return false;
            };
        } else {
            // 如果没有原始玩家对象，创建一个新的
            window.player = {
                x: canvas.width / 2,
                y: canvas.height / 2,
                y: canvas.height / 2,
                size: 20,
                speed: 3,
                baseSpeed: 3,
                status: {
                    isMoving: false,
                    isDodging: false,
                    dodgeCooldown: 0,
                    lastMoveTime: 0
                },
                move: (dx, dy) => {
                    const magnitude = Math.sqrt(dx * dx + dy * dy);
                    if (magnitude > 0) {
                        dx = dx / magnitude;
                        dy = dy / magnitude;
                    }

                    const effectiveSpeed = window.player.baseSpeed * (gameState.player.speedBonus || 1);

                    const newX = window.player.x + dx * effectiveSpeed;
                    const newY = window.player.y + dy * effectiveSpeed;

                    window.player.x = Math.max(window.player.size, Math.min(canvas.width - window.player.size, newX));
                    window.player.y = Math.max(window.player.size, Math.min(canvas.height - window.player.size, newY));

                    window.player.status.isMoving = magnitude > 0;
                    window.player.status.lastMoveTime = Date.now();
                },
                dodge: () => {
                    if (window.player.status.dodgeCooldown <= 0) {
                        const dodgeDistance = 40;
                        const angle = Math.atan2(mouseY - window.player.y, mouseX - window.player.x);

                        window.player.x = Math.max(window.player.size, Math.min(canvas.width - window.player.size, window.player.x + Math.cos(angle) * dodgeDistance));
                        window.player.y = Math.max(window.player.size, Math.min(canvas.height - window.player.size, window.player.y + Math.sin(angle) * dodgeDistance));

                        window.player.status.isDodging = true;
                        window.player.status.dodgeCooldown = 60;

                        createTwinkleEffect(window.player.x, window.player.y, '#00FFFF', 15);

                        return true;
                    }
                    return false;
                }
            };
        }
    }

    // 增强战斗系统
    enhanceCombatSystem() {
        // 扩展攻击函数，支持多种攻击模式
        if (typeof attackEnemies !== 'undefined') {
            const originalAttack = window.attackEnemies;
            window.attackEnemies = (target) => {
                // 调用原始攻击逻辑
                const result = originalAttack(target);

                // 增强战斗效果
                this.processEnhancedCombat();

                return result;
            };
        } else {
            // 创建新的增强攻击函数
            window.attackEnemies = () => {
                if (!gameState || !gameState.player || !gameState.player.weapon) return false;

                // 计算攻击范围（考虑连击奖励）
                const attackRange = gameState.player.attackRange * (gameState.player.comboAttackSpeed || 1);

                // 攻击范围内的所有敌人
                let enemiesHit = 0;
                const weaponDamage = gameState.player.weapon.damage || 10;

                // 应用武器伤害加成
                let finalDamage = weaponDamage * (gameState.player.comboDamageMultiplier || 1);

                // 应用被动技能加成
                if (typeof this.passiveSkillSystem !== 'undefined') {
                    finalDamage *= this.passiveSkillSystem.getDamageMultiplier();
                }

                // 扫描敌人并攻击
                for (let i = gameState.enemies.length - 1; i >= 0; i--) {
                    const enemy = gameState.enemies[i];
                    const distance = getDistance(player, enemy);

                    if (distance <= attackRange) {
                        // 对敌人造成伤害
                        const actualDamage = Math.floor(finalDamage);
                        enemy.hp -= actualDamage;

                        // 创建攻击效果
                        enhancedAttackEffect(enemy.x, enemy.y, actualDamage, gameState.player.weapon);

                        // 增加连击
                        this.comboSystem.increment();

                        // 检查暴击
                        if (Math.random() < (gameState.player.criticalChance || 0.05)) {
                            // 暴击效果
                            enemy.hp -= actualDamage; // 额外伤害
                            createTwinkleEffect(enemy.x, enemy.y, '#FFD700', 10);

                            if (typeof showCombatLog !== 'undefined') {
                                showCombatLog('💥 暴击!', 'critical-hit');
                            }
                        }

                        enemiesHit++;

                        // 如果敌人死亡
                        if (enemy.hp <= 0) {
                            // 增加击杀计数
                            gameState.kills = (gameState.kills || 0) + 1;
                            gameState.totalKills = (gameState.totalKills || 0) + 1;

                            // 增加得分
                            const baseScore = enemy.baseHp || 10;
                            gameState.player.score += baseScore * 10;

                            // 移除敌人
                            gameState.enemies.splice(i, 1);

                            // 创建死亡效果
                            enhancedDeathEffect(enemy.x, enemy.y, enemy.type || 'basic');

                            // 检查成就
                            if (typeof AchievementSystem !== 'undefined') {
                                AchievementSystem.checkAchievements();
                                AchievementSystem.onBossDefeat(); // 如果是Boss
                            }
                        }
                    }
                }

                // 更新攻击冷却
                gameState.player.attackCooldown = 10; // 可配置的冷却时间

                // 记录总伤害
                gameState.totalDamageDealt = (gameState.totalDamageDealt || 0) + (finalDamage * enemiesHit);

                return enemiesHit > 0;
            };
        }
    }

    // 增强敌人AI
    enhanceEnemyAI() {
        // 如果存在Enemy类，增强其AI逻辑
        if (typeof Enemy !== 'undefined' && Enemy.prototype) {
            const originalUpdate = Enemy.prototype.update;

            Enemy.prototype.update = function(deltaTime) {
                // 调用原始更新逻辑
                if (originalUpdate) {
                    originalUpdate.call(this, deltaTime);
                }

                // 增强AI逻辑
                this.enhancedAIUpdate(deltaTime);
            };

            // 添加增强的AI更新方法
            Enemy.prototype.enhancedAIUpdate = function(deltaTime) {
                if (!gameState || !gameState.player) return;

                const player = gameState.player;
                const dx = player.x - this.x;
                const dy = player.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // 根据敌人类型应用不同的AI行为
                switch (this.type) {
                    case 'FAST':
                        // 快速敌人：更高的追踪速度，但较低的生命值
                        this.speed = (this.baseSpeed || 1.5) * 1.3;
                        this.x += (dx / distance) * this.speed;
                        this.y += (dy / distance) * this.speed;
                        break;

                    case 'TANK':
                        // 坦克型敌人：较慢但高生命值，造成更高伤害
                        this.speed = (this.baseSpeed || 0.8) * 0.8;
                        this.x += (dx / distance) * this.speed;
                        this.y += (dy / distance) * this.speed;

                        // 坦克型敌人偶尔会冲撞玩家
                        if (Math.random() < 0.01 && distance < 100) {
                            // 冲撞效果
                            this.chargeTarget();
                        }
                        break;

                    case 'RANGED':
                        // 远程敌人：保持距离，远程攻击
                        if (distance < 120) {
                            // 远离玩家
                            this.x -= (dx / distance) * this.speed * 0.7;
                            this.y -= (dy / distance) * this.speed * 0.7;
                        } else if (distance > 180) {
                            // 靠近玩家
                            this.x += (dx / distance) * this.speed * 0.5;
                            this.y += (dy / distance) * this.speed * 0.5;
                        }
                        // 远程攻击逻辑（简化版）
                        if (distance > 80 && distance < 150 && Math.random() < 0.02) {
                            this.rangedAttack();
                        }
                        break;

                    default:
                        // 标准敌人行为
                        this.x += (dx / distance) * this.speed;
                        this.y += (dy / distance) * this.speed;
                }

                // 应用元素效果（如果存在）
                if (this.activeEffects) {
                    for (const effect of this.activeEffects) {
                        this.applyEffect(effect);
                    }
                }
            };

            // 为坦克型敌人添加冲撞方法
            Enemy.prototype.chargeTarget = function() {
                if (!gameState || !gameState.player) return;

                const player = gameState.player;
                const chargeSpeed = this.speed * 3;
                const dx = player.x - this.x;
                const dy = player.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance > 0) {
                    this.x += (dx / distance) * chargeSpeed;
                    this.y += (dy / distance) * chargeSpeed;

                    // 创建冲撞视觉效果
                    createTwinkleEffect(this.x, this.y, '#FF6347', 5);
                }
            };

            // 为远程敌人添加远程攻击方法
            Enemy.prototype.rangedAttack = function() {
                if (!gameState || !gameState.player) return;

                // 创建投射物（简化版）
                const projectile = {
                    x: this.x,
                    y: this.y,
                    targetX: gameState.player.x,
                    targetY: gameState.player.y,
                    speed: 4,
                    damage: this.damage || 5,
                    update: function() {
                        const dx = this.targetX - this.x;
                        const dy = this.targetY - this.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        if (distance > 5) {
                            this.x += (dx / distance) * this.speed;
                            this.y += (dy / distance) * this.speed;
                        } else {
                            // 命中玩家
                            if (gameState.player) {
                                gameState.player.hp -= this.damage;
                                gameState.totalDamageTaken = (gameState.totalDamageTaken || 0) + this.damage;

                                // 创建命中效果
                                createTwinkleEffect(this.x, this.y, '#FF0000', 8);

                                // 从游戏中移除此投射物
                                const index = gameState.projectiles.indexOf(this);
                                if (index !== -1) gameState.projectiles.splice(index, 1);

                                // 检查游戏结束
                                if (gameState.player.hp <= 0) {
                                    gameOver();
                                }
                            }
                        }
                    }
                };

                gameState.projectiles.push(projectile);
            };

            // 为敌人添加效果应用方法
            Enemy.prototype.applyEffect = function(effect) {
                switch (effect.type) {
                    case 'burn':
                        // 燃烧效果：持续伤害
                        if (Date.now() - (this.lastBurnTick || 0) > 500) { // 每0.5秒
                            this.hp -= effect.damage || 1;
                            this.lastBurnTick = Date.now();

                            // 创建燃烧视觉效果
                            createTwinkleEffect(this.x, this.y, '#FF4500', 3);
                        }
                        break;

                    case 'slow':
                        // 减速效果
                        this.speed = this.baseSpeed * (effect.factor || 0.5);
                        if (Date.now() > effect.endTime) {
                            this.speed = this.baseSpeed; // 恢复速度
                            // 从效果列表中移除
                            if (this.activeEffects) {
                                const index = this.activeEffects.indexOf(effect);
                                if (index !== -1) this.activeEffects.splice(index, 1);
                            }
                        }
                        break;
                }
            };
        }
    }

    // 添加游戏事件处理器
    addGameEventHandlers() {
        // 添加键盘事件监听器以支持闪避等动作
        document.addEventListener('keydown', (e) => {
            if (typeof player !== 'undefined' && e.code === 'ShiftLeft') {
                // 左Shift键用于闪避
                if (player.dodge) {
                    player.dodge();
                }
            }
        });

        // 更新游戏循环以处理新的游戏元素
        const originalGameLoop = typeof gameLoop !== 'undefined' ? gameLoop : null;

        window.extendedGameLoop = () => {
            // 调用原始游戏循环
            if (originalGameLoop) {
                originalGameLoop();
            }

            // 处理新的游戏元素
            this.processExtendedGameplay();
        };

        // 替换或扩展游戏循环
        if (typeof gameLoop !== 'undefined') {
            window.gameLoop = window.extendedGameLoop;
        } else {
            window.gameLoop = window.extendedGameLoop;
        }
    }

    // 处理扩展游戏玩法
    processExtendedGameplay() {
        // 更新玩家状态
        if (typeof player !== 'undefined') {
            // 更新闪避冷却
            if (player.status.dodgeCooldown > 0) {
                player.status.dodgeCooldown--;
            }

            // 更新闪避状态
            if (player.status.isDodging) {
                // 闪避状态持续一小段时间
                setTimeout(() => {
                    player.status.isDodging = false;
                }, 200); // 200毫秒后结束闪避状态
            }
        }

        // 更新连击系统
        if (this.comboSystem) {
            this.comboSystem.update();
        }

        // 更新元素系统
        if (this.elementalSystem) {
            this.elementalSystem.update();
        }

        // 更新被动技能系统
        if (this.passiveSkillSystem) {
            this.passiveSkillSystem.update();
        }
    }

    // 增强连击系统
    enhanceComboSystem() {
        // 连击系统的具体实现已在ComboSystem类中
        // 这里只是整合到游戏流程中
    }

    // 增强元素系统
    enhanceElementalSystem() {
        // 元素系统的具体实现已在ElementalSystem类中
        // 这里只是整合到游戏流程中
    }

    // 处理增强战斗效果
    processEnhancedCombat() {
        // 处理特殊战斗事件，如暴击、连击奖励等
        if (gameState && gameState.player) {
            // 如果有特殊战斗效果，则在此处处理
        }
    }

    // 检查游戏状态
    checkGameState() {
        // 定期检查游戏状态，执行必要的更新
        if (gameState && gameState.isPlaying) {
            // 更新各种游戏系统
            if (this.comboSystem) {
                this.comboSystem.checkTimeout();
            }

            // 检查里程碑
            if (typeof MilestoneSystem !== 'undefined') {
                MilestoneSystem.checkMilestones();
            }
        }
    }
}

// 连击系统类
class ComboSystem {
    constructor() {
        this.currentCombo = 0;
        this.maxCombo = 0;
        this.lastHitTime = Date.now();
        this.comboTimeout = 3000; // 3秒内无攻击则重置连击
        this.comboMultipliers = {
            5: 1.2,   // 5连击 20% 伤害加成
            10: 1.5,  // 10连击 50% 伤害加成
            15: 1.8,  // 15连击 80% 伤害加成
            20: 2.0,  // 20连击 100% 伤害加成
            30: 2.5,  // 30连击 150% 伤害加成
            50: 3.0   // 50连击 200% 伤害加成
        };
    }

    increment() {
        this.currentCombo++;
        this.lastHitTime = Date.now();

        // 更新最大连击数
        if (this.currentCombo > this.maxCombo) {
            this.maxCombo = this.currentCombo;

            // 更新游戏状态中的最大连击数
            if (gameState && gameState.player) {
                gameState.player.maxCombo = this.maxCombo;
            }
        }

        // 显示连击提升提示
        if (this.currentCombo > 1 && this.currentCombo % 5 === 0) {
            if (typeof showCombatLog !== 'undefined') {
                showCombatLog(`🔥 ${this.currentCombo} 连击!`, 'combo');
            }
        }

        // 检查成就
        if (typeof AchievementSystem !== 'undefined') {
            AchievementSystem.checkAchievements();
        }
    }

    getDamageMultiplier() {
        // 根据当前连击数返回伤害乘数
        let multiplier = 1.0;

        for (const [threshold, mult] of Object.entries(this.comboMultipliers)) {
            if (this.currentCombo >= parseInt(threshold)) {
                multiplier = mult;
            }
        }

        return multiplier;
    }

    reset() {
        this.currentCombo = 0;
    }

    checkTimeout() {
        // 检查是否需要重置连击
        if (Date.now() - this.lastHitTime > this.comboTimeout) {
            if (this.currentCombo > 0) {
                if (typeof showCombatLog !== 'undefined') {
                    showCombatLog(`💥 连击中断! 最终连击: ${this.currentCombo}`, 'combo-break');
                }
                this.reset();
            }
        }
    }

    update() {
        // 更新连击状态
        this.checkTimeout();
    }
}

// 元素系统类
class ElementalSystem {
    constructor() {
        this.elementalEffects = {
            fire: { damage: 3, duration: 2000, procChance: 0.2, type: 'burn' },
            ice: { damage: 1, duration: 3000, procChance: 0.15, slowFactor: 0.5, type: 'freeze' },
            lightning: { damage: 4, duration: 1000, procChance: 0.1, type: 'stun' },
            poison: { damage: 2, duration: 4000, procChance: 0.18, type: 'poison' },
            healing: { heal: 5, procChance: 0.25, type: 'heal' }
        };
    }

    checkWeaponElementalEffect(weapon) {
        if (!weapon || !weapon.name) return null;

        const weaponName = weapon.name.toLowerCase();

        // 检查武器名称中是否包含元素关键词
        for (const [element, effect] of Object.entries(this.elementalEffects)) {
            if (weaponName.includes(element) || weaponName.includes('火') || weaponName.includes('冰') ||
                weaponName.includes('雷') || weaponName.includes('毒') || weaponName.includes('愈')) {
                return { ...effect, element };
            }
        }

        return null;
    }

    applyEffectToTarget(target, effect) {
        // 应用元素效果到目标
        if (!target || !effect) return false;

        switch (effect.type) {
            case 'burn':
                // 添加燃烧效果到目标
                if (!target.activeEffects) target.activeEffects = [];
                target.activeEffects.push({
                    type: 'burn',
                    damage: effect.damage,
                    startTime: Date.now(),
                    interval: setInterval(() => {
                        if (target.hp > 0) {
                            target.hp -= effect.damage;
                            createTwinkleEffect(target.x, target.y, '#FF4500', 2);

                            if (target.hp <= 0) {
                                clearInterval(this);
                            }
                        }
                    }, 500)
                });
                break;

            case 'freeze':
                // 冰冻效果：暂时减慢敌人速度
                if (target.baseSpeed) {
                    target.originalSpeed = target.speed;
                    target.speed = target.baseSpeed * effect.slowFactor;

                    // 设置解冻定时器
                    setTimeout(() => {
                        if (target && target.originalSpeed !== undefined) {
                            target.speed = target.originalSpeed;
                            delete target.originalSpeed;
                        }
                    }, effect.duration);
                }
                break;

            case 'stun':
                // 眩晕效果：暂时停止敌人行动
                if (target.update && typeof target.update === 'function') {
                    target.originalUpdate = target.update;
                    target.update = () => {}; // 空函数，停止更新

                    setTimeout(() => {
                        if (target && target.originalUpdate) {
                            target.update = target.originalUpdate;
                            delete target.originalUpdate;
                        }
                    }, effect.duration);
                }
                break;

            case 'poison':
                // 中毒效果：持续伤害
                if (!target.activeEffects) target.activeEffects = [];
                target.activeEffects.push({
                    type: 'poison',
                    damage: effect.damage,
                    startTime: Date.now(),
                    interval: setInterval(() => {
                        if (target.hp > 0) {
                            target.hp -= effect.damage;
                            createTwinkleEffect(target.x, target.y, '#32CD32', 2);

                            if (target.hp <= 0) {
                                clearInterval(this);
                            }
                        }
                    }, 1000)
                });
                break;

            case 'heal':
                // 治疗效果：恢复玩家生命
                if (gameState && gameState.player) {
                    const healAmount = effect.heal;
                    gameState.player.hp = Math.min(gameState.player.maxHp, gameState.player.hp + healAmount);

                    createTwinkleEffect(gameState.player.x, gameState.player.y, '#00FF00', 8);
                }
                break;
        }

        return true;
    }

    update() {
        // 更新元素系统状态
        // 此方法会被定期调用
    }
}

// 被动技能系统类
class PassiveSkillSystem {
    constructor() {
        this.skills = {
            // 生命恢复：每10秒恢复5%最大生命值
            lifeRegen: { enabled: false, interval: 600, healPercent: 0.05 },

            // 暴击率提升：增加5%暴击率
            critBoost: { enabled: false, critBonus: 0.05 },

            // 伤害减免：减少10%受到的伤害
            damageReduction: { enabled: false, reductionPercent: 0.1 },

            // 移动速度：增加20%移动速度
            speedBoost: { enabled: false, speedBonus: 0.2 },

            // 经验加成：增加20%获得的经验值
            xpBoost: { enabled: false, xpMultiplier: 1.2 }
        };

        this.activeSkills = new Set();
        this.bonusStats = {
            damageMultiplier: 1.0,
            critChance: 0.05,
            speedBonus: 1.0,
            damageReduction: 0,
            xpMultiplier: 1.0
        };
    }

    activateSkill(skillName) {
        if (this.skills[skillName]) {
            this.skills[skillName].enabled = true;
            this.activeSkills.add(skillName);
            this.updateBonusStats();

            console.log(`🌟 被动技能激活: ${skillName}`);
        }
    }

    deactivateSkill(skillName) {
        if (this.skills[skillName]) {
            this.skills[skillName].enabled = false;
            this.activeSkills.delete(skillName);
            this.updateBonusStats();

            console.log(`❌ 被动技能停用: ${skillName}`);
        }
    }

    getDamageMultiplier() {
        return this.bonusStats.damageMultiplier;
    }

    getCritChance() {
        return this.bonusStats.critChance;
    }

    getSpeedBonus() {
        return this.bonusStats.speedBonus;
    }

    getDamageReduction() {
        return this.bonusStats.damageReduction;
    }

    getXpMultiplier() {
        return this.bonusStats.xpMultiplier;
    }

    updateBonusStats() {
        // 重置统计
        this.bonusStats = {
            damageMultiplier: 1.0,
            critChance: 0.05,
            speedBonus: 1.0,
            damageReduction: 0,
            xpMultiplier: 1.0
        };

        // 应用激活的技能效果
        for (const skillName of this.activeSkills) {
            const skill = this.skills[skillName];
            switch (skillName) {
                case 'critBoost':
                    this.bonusStats.critChance += skill.critBonus;
                    break;
                case 'damageReduction':
                    this.bonusStats.damageReduction += skill.reductionPercent;
                    break;
                case 'speedBoost':
                    this.bonusStats.speedBonus += skill.speedBonus;
                    break;
                case 'xpBoost':
                    this.bonusStats.xpMultiplier += skill.xpMultiplier - 1; // 因为默认是1.0
                    break;
            }
        }
    }

    update() {
        // 处理持续性的被动效果
        if (this.skills.lifeRegen.enabled && gameState && gameState.player) {
            // 实现生命恢复逻辑（简化版 - 每600帧恢复一次）
            if (gameState.frameCount % 600 === 0) {
                const healAmount = Math.floor(gameState.player.maxHp * this.skills.lifeRegen.healPercent);
                gameState.player.hp = Math.min(gameState.player.maxHp, gameState.player.hp + healAmount);

                if (healAmount > 0) {
                    createTwinkleEffect(gameState.player.x, gameState.player.y, '#00FF00', 3);
                }
            }
        }
    }
}

// 初始化扩展游戏玩法增强系统
const extendedGameplayEnhancements = new ExtendedGameplayEnhancement();

// 将实例添加到窗口对象以便其他脚本访问
window.ExtendedGameplayEnhancements = ExtendedGameplayEnhancements;
window.extendedGameplayEnhancements = extendedGameplayEnhancements;

// 添加定期执行的任务
setInterval(() => {
    if (window.extendedGameplayEnhancements) {
        window.extendedGameplayEnhancements.checkGameState();
    }
}, 1000);

console.log("🚀 游戏玩法扩展系统已完全加载");