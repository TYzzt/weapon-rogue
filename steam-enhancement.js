// ==================== Steam发布增强脚本 ====================
//
// 此脚本包含针对Steam发布目标的关键增强功能
// 1. 进一步优化游戏平衡性
// 2. 扩展游戏内容，增加可玩时长
// 3. 增强玩家体验

if (typeof STEAM_ENHANCEMENT_LOADED === 'undefined') {
    window.STEAM_ENHANCEMENT_LOADED = true;

    console.log("Steam发布增强模块已加载");

    // 1. 进一步优化游戏平衡性
    // 修改玩家生命值恢复机制，使游戏体验更好
    if (typeof Player !== 'undefined') {
        // 扩展Player类，添加生命恢复机制
        const originalPlayerConstructor = Player;

        class BalancedPlayer extends originalPlayerConstructor {
            constructor() {
                super();

                // 添加生命值自然恢复机制（只在安全时生效）
                this.lastHealTime = Date.now();
                this.healInterval = 5000; // 每5秒恢复一点生命值
                this.healAmount = 0.2; // 恢复少量生命值

                // 重新定义一些属性以确保平衡
                this.baseHpRegen = 0.2; // 基础生命回复
            }

            // 自然恢复生命值
            naturalHeal() {
                if (gameState.isPlaying && !gameState.isGameOver) {
                    const now = Date.now();

                    // 检查是否可以恢复生命值（周围没有敌人或敌人很少）
                    const nearbyEnemies = this.getNearbyEnemies(150); // 检查150像素范围内的敌人
                    if (now - this.lastHealTime >= this.healInterval && nearbyEnemies.length === 0) {
                        // 如果不是满血，进行恢复
                        if (this.hp < this.maxHp) {
                            this.hp = Math.min(this.maxHp, this.hp + this.healAmount);

                            // 可选：显示恢复视觉效果
                            if (typeof showHealEffect !== 'undefined') {
                                showHealEffect(this.x, this.y, this.healAmount);
                            }
                        }

                        this.lastHealTime = now;
                    }
                }
            }

            // 获取附近的敌人数量
            getNearbyEnemies(range) {
                if (!gameState.enemies) return [];

                return gameState.enemies.filter(enemy => {
                    const dx = enemy.x - this.x;
                    const dy = enemy.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    return distance <= range;
                });
            }
        }

        // 替换Player类
        window.Player = BalancedPlayer;
    }

    // 2. 优化敌人AI，增加游戏策略性
    if (typeof Enemy !== 'undefined') {
        // 扩展Enemy类，优化AI行为
        const originalEnemyConstructor = Enemy;

        class SmartEnemy extends originalEnemyConstructor {
            constructor(level, type = null) {
                super(level, type);

                // 添加智能行为参数
                this.thinkInterval = 2000; // 每2秒重新评估策略
                this.lastThinkTime = Date.now();
                this.chaseRange = this.size * 3; // 追击范围
                this.attackRange = this.size * 1.5; // 攻击范围
                this.retreatThreshold = 0.3; // 生命值低于30%时考虑撤退
            }

            // 智能行为决策
            smartBehavior(player, deltaTime) {
                if (!player) return;

                const dx = player.x - this.x;
                const dy = player.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // 更新行为逻辑
                if (this.hp / this.maxHp < this.retreatThreshold) {
                    // 生命值低时撤退
                    this.behavior = 'retreat';
                    // 设置逃跑方向（远离玩家）
                    this.targetX = this.x - dx;
                    this.targetY = this.y - dy;
                } else if (distance <= this.chaseRange && distance > this.attackRange) {
                    // 在追击范围内且不在攻击范围内，追击玩家
                    this.behavior = 'chase';
                    this.targetX = player.x;
                    this.targetY = player.y;
                } else if (distance <= this.attackRange) {
                    // 在攻击范围内，攻击玩家
                    this.behavior = 'attack';
                } else {
                    // 不在追击范围内，保持原有行为
                    this.behavior = super.behavior || 'melee';
                }
            }

            // 重写更新方法，集成智能行为
            update(player, deltaTime) {
                // 调用父类的更新方法
                if (super.update) {
                    super.update(player, deltaTime);
                }

                // 每隔一段时间执行智能决策
                const now = Date.now();
                if (now - this.lastThinkTime >= this.thinkInterval) {
                    this.smartBehavior(player, deltaTime);
                    this.lastThinkTime = now;
                }

                // 根据行为类型执行相应动作
                switch (this.behavior) {
                    case 'chase':
                        // 追击玩家
                        const angle = Math.atan2(player.y - this.y, player.x - this.x);
                        this.x += Math.cos(angle) * this.speed * deltaTime;
                        this.y += Math.sin(angle) * this.speed * deltaTime;
                        break;
                    case 'retreat':
                        // 逃离玩家
                        if (this.targetX !== undefined && this.targetY !== undefined) {
                            const retreatAngle = Math.atan2(this.targetY - this.y, this.targetX - this.x);
                            this.x += Math.cos(retreatAngle) * this.speed * deltaTime;
                            this.y += Math.sin(retreatAngle) * this.speed * deltaTime;
                        }
                        break;
                    case 'attack':
                        // 如果是近战敌人，尝试攻击玩家
                        if (this.attackCooldown <= 0) {
                            // 攻击逻辑（如果敌人是近战类型）
                            if (Math.abs(player.x - this.x) < this.size && Math.abs(player.y - this.y) < this.size) {
                                player.takeDamage(this.damage);
                                this.attackCooldown = this.attackSpeed || 1000;

                                // 触发受击效果
                                if (typeof showHitEffect !== 'undefined') {
                                    showHitEffect(player.x, player.y);
                                }
                            }
                        } else {
                            this.attackCooldown -= deltaTime;
                        }
                        break;
                }
            }
        }

        // 替换Enemy类
        window.Enemy = SmartEnemy;
    }

    // 3. 扩展武器系统，增加特殊效果
    if (typeof WEAPONS !== 'undefined') {
        // 添加更多具有特殊效果的武器
        const SPECIAL_EFFECT_WEAPONS = [
            // 元素系武器
            { name: '火焰之刃', damage: 25, rarity: 'rare', color: '#FF4500', effect: 'burn', effectChance: 0.3, effectDuration: 3000 },
            { name: '寒冰法杖', damage: 22, rarity: 'rare', color: '#87CEFA', effect: 'freeze', effectChance: 0.2, effectDuration: 1500 },
            { name: '雷电之锤', damage: 28, rarity: 'rare', color: '#FFD700', effect: 'stun', effectChance: 0.15, effectDuration: 1000 },
            { name: '毒刺匕首', damage: 18, rarity: 'uncommon', color: '#32CD32', effect: 'poison', effectChance: 0.4, effectDuration: 5000 },

            // 附魔系武器
            { name: '吸血獠牙', damage: 20, rarity: 'uncommon', color: '#8B0000', effect: 'life_steal', effectChance: 0.3, lifeStealPercent: 0.15 },
            { name: '回春之剑', damage: 15, rarity: 'uncommon', color: '#32CD32', effect: 'heal_on_kill', healAmount: 5 },
            { name: '疾风刃', damage: 17, rarity: 'uncommon', color: '#F0F8FF', effect: 'speed_boost', boostAmount: 0.3, boostDuration: 2000 },

            // 传奇武器
            { name: '时空裂隙刃', damage: 85, rarity: 'legendary', color: '#9932CC', effect: 'teleport_strike', effectChance: 0.1 },
            { name: '元素掌控者', damage: 75, rarity: 'legendary', color: '#483D8B', effect: 'chain_lightning', effectChance: 0.2, maxTargets: 3 },

            // 神话武器
            { name: '平衡之剑', damage: 400, rarity: 'mythic', color: '#FFFF00', effect: 'damage_reflect', reflectPercent: 0.5 },
            { name: '命运之轮', damage: 600, rarity: 'mythic', color: '#FF69B4', effect: 'luck_boost', luckMultiplier: 2.0 }
        ];

        // 添加特殊效果武器到武器库
        WEAPONS.push(...SPECIAL_EFFECT_WEAPONS);
        console.log(`添加了 ${SPECIAL_EFFECT_WEAPONS.length} 种特殊效果武器`);
    }

    // 4. 扩展特殊效果处理系统
    class SpecialEffectsSystem {
        constructor() {
            this.activeEffects = new Map(); // 存储活动的特殊效果
            this.effectHandlers = {
                'burn': this.handleBurnEffect,
                'freeze': this.handleFreezeEffect,
                'stun': this.handleStunEffect,
                'poison': this.handlePoisonEffect,
                'life_steal': this.handleLifeSteal,
                'heal_on_kill': this.handleHealOnKill,
                'speed_boost': this.handleSpeedBoost,
                'teleport_strike': this.handleTeleportStrike,
                'chain_lightning': this.handleChainLightning,
                'damage_reflect': this.handleDamageReflect,
                'luck_boost': this.handleLuckBoost
            };
        }

        // 处理燃烧效果
        handleBurnEffect(target, attacker, weapon) {
            // 每秒造成伤害，持续3秒
            if (target && typeof target.takeDamage === 'function') {
                const burnInterval = setInterval(() => {
                    if (target.hp > 0) {
                        target.takeDamage(Math.floor(weapon.damage * 0.3));
                        if (typeof showBurnEffect !== 'undefined') {
                            showBurnEffect(target.x, target.y);
                        }
                    } else {
                        clearInterval(burnInterval);
                    }
                }, 1000);

                // 3秒后停止燃烧
                setTimeout(() => {
                    clearInterval(burnInterval);
                }, 3000);
            }
        }

        // 处理冰冻效果
        handleFreezeEffect(target) {
            if (target) {
                const originalSpeed = target.speed || 1;
                target.speed = originalSpeed * 0.1; // 减速90%

                // 1.5秒后恢复速度
                setTimeout(() => {
                    if (target) target.speed = originalSpeed;
                }, 1500);
            }
        }

        // 处理眩晕效果
        handleStunEffect(target) {
            if (target) {
                target.stunned = true;

                // 1秒后解除眩晕
                setTimeout(() => {
                    if (target) target.stunned = false;
                }, 1000);
            }
        }

        // 处理中毒效果
        handlePoisonEffect(target) {
            if (target && typeof target.takeDamage === 'function') {
                const poisonInterval = setInterval(() => {
                    if (target.hp > 0) {
                        target.takeDamage(1);
                        if (typeof showPoisonEffect !== 'undefined') {
                            showPoisonEffect(target.x, target.y);
                        }
                    } else {
                        clearInterval(poisonInterval);
                    }
                }, 1000);

                // 5秒后停止中毒
                setTimeout(() => {
                    clearInterval(poisonInterval);
                }, 5000);
            }
        }

        // 处理吸血效果
        handleLifeSteal(attacker, damage) {
            if (attacker && typeof attacker.gainHp === 'function') {
                const healAmount = Math.floor(damage * 0.15);
                attacker.gainHp(healAmount);
            }
        }

        // 处理击杀回血效果
        handleHealOnKill(attacker, weapon) {
            if (attacker && typeof attacker.gainHp === 'function') {
                attacker.gainHp(weapon.healAmount || 5);
            }
        }

        // 处理速度提升效果
        handleSpeedBoost(player, weapon) {
            if (player) {
                const originalSpeed = player.speed || 1;
                player.speed = originalSpeed * (1 + weapon.boostAmount);

                // 效果结束后恢复原速度
                setTimeout(() => {
                    if (player) player.speed = originalSpeed;
                }, weapon.boostDuration);
            }
        }

        // 触发特殊效果
        triggerEffect(effectName, target, attacker, weapon) {
            if (this.effectHandlers[effectName]) {
                this.effectHandlers[effectName].call(this, target, attacker, weapon);
            }
        }
    }

    // 创建特殊效果系统实例
    window.specialEffectsSystem = new SpecialEffectsSystem();

    // 5. 扩展连击系统，增加更多奖励
    if (typeof updateCombo !== 'undefined') {
        const originalUpdateCombo = updateCombo;

        window.updateCombo = function(kill) {
            if (originalUpdateCombo) {
                originalUpdateCombo(kill);
            }

            // 扩展连击奖励
            if (gameState.player && gameState.currentCombo) {
                // 每10连击给予特殊奖励
                if (gameState.currentCombo > 0 && gameState.currentCombo % 10 === 0) {
                    // 给予临时伤害加成
                    gameState.player.tempDamageBoost = gameState.player.tempDamageBoost || 0;
                    gameState.player.tempDamageBoost += 0.1; // 10%伤害加成

                    // 10秒后移除加成
                    setTimeout(() => {
                        if (gameState.player) {
                            gameState.player.tempDamageBoost = Math.max(0,
                                (gameState.player.tempDamageBoost || 0) - 0.1);
                        }
                    }, 10000);

                    if (typeof showCombatLog !== 'undefined') {
                        showCombatLog(`🔥 ${gameState.currentCombo} 连击! 伤害+10%`, 'combo');
                    }
                }

                // 每50连击给予生命恢复
                if (gameState.currentCombo > 0 && gameState.currentCombo % 50 === 0) {
                    if (typeof gameState.player.gainHp !== 'undefined') {
                        gameState.player.gainHp(20); // 恢复20点生命值
                        if (typeof showCombatLog !== 'undefined') {
                            showCombatLog(`💚 ${gameState.currentCombo} 连击! 生命+20`, 'heal');
                        }
                    }
                }
            }
        };
    }

    // 6. 优化关卡过渡体验
    if (typeof handleLevelUp !== 'undefined') {
        const originalHandleLevelUp = handleLevelUp;

        window.handleLevelUp = function() {
            // 原有逻辑
            originalHandleLevelUp();

            // 额外的关卡奖励
            if (gameState.level % 5 === 0) {
                // 每5关给予生命值奖励
                if (gameState.player) {
                    const hpBonus = Math.floor(gameState.player.maxHp * 0.1); // 增加10%最大生命值
                    gameState.player.maxHp += hpBonus;
                    gameState.player.hp += hpBonus; // 同时恢复相应生命值
                    if (typeof showCombatLog !== 'undefined') {
                        showCombatLog(`❤️ 第${gameState.level}关! 生命值上限+${hpBonus}`, 'level-up');
                    }
                }
            }

            // 特殊关卡事件
            if ([10, 20, 30, 40, 50].includes(gameState.level)) {
                // 每10关给予大量生命值奖励
                if (gameState.player) {
                    const bigHpBonus = Math.floor(gameState.player.maxHp * 0.3); // 增加30%最大生命值
                    gameState.player.maxHp += bigHpBonus;
                    gameState.player.hp += bigHpBonus;
                    if (typeof showCombatLog !== 'undefined') {
                        showCombatLog(`🌟 里程碑! 生命值上限+${bigHpBonus}`, 'milestone');
                    }
                }
            }
        };
    }

    console.log("Steam发布增强模块已完全加载");
} else {
    console.log("Steam发布增强模块已存在，跳过重复加载");
}