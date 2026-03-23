// ==================== 核心玩法增强系统 ====================
//
// 本文件专注于增强游戏的核心玩法机制，包括：
// 1. 改进武器替换机制
// 2. 优化战斗系统
// 3. 增强敌人AI
// 4. 优化关卡推进逻辑
// 5. 改进玩家成长系统

class CoreGameplayEnhancement {
    constructor() {
        // 初始化核心增强功能
        this.init();

        // 武器特效映射
        this.weaponEffects = {
            // 火系武器
            'fire': { damage: 3, duration: 2000, procChance: 0.2, type: 'burn' },
            'flame': { damage: 3, duration: 2000, procChance: 0.2, type: 'burn' },
            'lava': { damage: 4, duration: 2500, procChance: 0.18, type: 'burn' },

            // 冰系武器
            'ice': { damage: 1, duration: 3000, procChance: 0.15, slowFactor: 0.5, type: 'freeze' },
            'frost': { damage: 2, duration: 3500, procChance: 0.12, slowFactor: 0.4, type: 'freeze' },
            'cold': { damage: 1, duration: 2800, procChance: 0.16, slowFactor: 0.55, type: 'freeze' },

            // 雷系武器
            'lightning': { damage: 4, duration: 1000, procChance: 0.1, type: 'stun' },
            'thunder': { damage: 5, duration: 1200, procChance: 0.08, type: 'stun' },
            'electric': { damage: 3, duration: 800, procChance: 0.12, type: 'stun' },

            // 毒系武器
            'poison': { damage: 2, duration: 4000, procChance: 0.18, type: 'poison' },
            'venom': { damage: 3, duration: 4500, procChance: 0.15, type: 'poison' },
            'toxic': { damage: 2, duration: 5000, procChance: 0.16, type: 'poison' },

            // 治疗武器
            'heal': { heal: 5, procChance: 0.25, type: 'heal' },
            'restore': { heal: 8, procChance: 0.2, type: 'heal' },
            'blessed': { heal: 12, procChance: 0.15, type: 'heal' },

            // 爆炸武器
            'explosive': { damage: 6, radius: 40, procChance: 0.1, type: 'aoe' },
            'bomb': { damage: 8, radius: 50, procChance: 0.08, type: 'aoe' },
            'blast': { damage: 7, radius: 45, procChance: 0.09, type: 'aoe' },

            // 吸血武器
            'vampire': { damage: 3, lifesteal: 0.3, procChance: 0.3, type: 'lifesteal' },
            'blood': { damage: 4, lifesteal: 0.25, procChance: 0.25, type: 'lifesteal' },
            'drain': { damage: 2, lifesteal: 0.4, procChance: 0.2, type: 'lifesteal' }
        };

        // 敌人状态效果管理
        this.enemyStatusEffects = new Map();

        console.log("⚔️ 核心玩法增强系统已初始化");
    }

    // 初始化核心功能
    init() {
        // 重写武器替换逻辑
        this.overrideWeaponPickup();

        // 增强战斗系统
        this.enhanceCombatSystem();

        // 优化敌人AI
        this.enhanceEnemyAI();

        // 增强玩家成长机制
        this.enhancePlayerProgression();

        // 添加新的游戏事件处理器
        this.addGameEventHandlers();
    }

    // 重写武器拾取逻辑
    overrideWeaponPickup() {
        // 如果全局函数存在，覆盖它以增强功能
        if (typeof pickupWeapon !== 'undefined') {
            const originalPickup = window.pickupWeapon;
            window.pickupWeapon = (weapon) => {
                // 保留原有功能
                originalPickup(weapon);

                // 增强功能：根据武器特性给予特殊效果
                this.applyWeaponSpecialEffects(weapon);

                // 增强功能：更新UI显示
                this.updateWeaponUI(weapon);

                // 增强功能：触发成就检查
                if (window.enhancedAchievementSystem) {
                    window.enhancedAchievementSystem.onWeaponAcquired(weapon);
                }

                console.log(`装备武器: ${weapon.name} (伤害: ${weapon.damage})`);
            };
        } else {
            // 如果不存在原函数，创建新的
            window.pickupWeapon = (weapon) => {
                if (gameState && gameState.player) {
                    gameState.player.weapon = weapon;

                    // 应用武器特殊效果
                    this.applyWeaponSpecialEffects(weapon);

                    // 更新UI
                    this.updateWeaponUI(weapon);

                    console.log(`装备武器: ${weapon.name} (伤害: ${weapon.damage})`);
                }
            };
        }
    }

    // 应用武器特殊效果
    applyWeaponSpecialEffects(weapon) {
        if (!weapon || !weapon.name) return;

        // 根据武器名称中的关键词检测特殊效果
        const weaponName = weapon.name.toLowerCase();

        // 检查是否有元素效果
        for (const [effectName, effectData] of Object.entries(this.weaponEffects)) {
            if (weaponName.includes(effectName)) {
                // 武器具有特殊效果，可以给玩家一些提示
                if (typeof showCombatLog !== 'undefined') {
                    showCombatLog(`✨ ${weapon.name} 具有${this.getEffectTypeName(effectData.type)}效果`, 'weapon-special');
                }
                break; // 只显示第一个特殊效果
            }
        }
    }

    // 获取效果类型名称
    getEffectTypeName(type) {
        const names = {
            'burn': '燃烧',
            'freeze': '冰冻',
            'stun': '眩晕',
            'poison': '中毒',
            'heal': '治疗',
            'aoe': '范围',
            'lifesteal': '吸血'
        };
        return names[type] || '特殊';
    }

    // 更新武器UI
    updateWeaponUI(weapon) {
        // 如果存在更新武器UI的函数，调用它
        if (typeof updateWeaponDisplay !== 'undefined') {
            updateWeaponDisplay(weapon);
        }
    }

    // 增强战斗系统
    enhanceCombatSystem() {
        // 如果存在基础战斗系统，对其进行增强
        if (typeof attack !== 'undefined') {
            const originalAttack = window.attack;
            window.attack = (target) => {
                let result = originalAttack(target);

                // 增加暴击检查
                if (gameState?.player?.criticalChance && Math.random() < gameState.player.criticalChance) {
                    if (typeof showCombatLog !== 'undefined') {
                        showCombatLog('💥 暴击!', 'critical-hit');
                    }
                }

                // 增加连击计数
                if (gameState?.player) {
                    if (!gameState.player.comboCount) {
                        gameState.player.comboCount = 0;
                    }

                    gameState.player.comboCount++;

                    // 更新最大连击数
                    if (!gameState.player.maxCombo || gameState.player.comboCount > gameState.player.maxCombo) {
                        gameState.player.maxCombo = gameState.player.comboCount;

                        // 检查连击成就
                        if (window.enhancedAchievementSystem) {
                            window.enhancedAchievementSystem.checkAchievements();
                        }
                    }

                    // 应用连击伤害加成
                    if (gameState.player.comboCount % 10 === 0) {
                        if (typeof showCombatLog !== 'undefined') {
                            showCombatLog(`🔥 ${gameState.player.comboCount} 连击!`, 'combo');
                        }
                    }
                }

                return result;
            };
        } else {
            // 创建新的攻击函数
            window.attack = (target) => {
                if (!gameState || !gameState.player || !gameState.player.weapon) return false;

                // 基础伤害计算
                let damage = gameState.player.weapon.damage || 10;

                // 应用伤害加成
                if (gameState.player.damageMultiplier) {
                    damage *= gameState.player.damageMultiplier;
                }

                // 应用连击加成（每10连击增加10%伤害）
                if (gameState.player.comboCount && gameState.player.comboCount >= 10) {
                    damage *= (1 + Math.floor(gameState.player.comboCount / 10) * 0.1);
                }

                // 应用武器特效
                const weaponEffect = this.getWeaponEffect(gameState.player.weapon);
                if (weaponEffect && Math.random() < weaponEffect.procChance) {
                    this.applyWeaponEffect(target, weaponEffect);
                }

                // 对目标造成伤害
                if (target && typeof target.takeDamage === 'function') {
                    target.takeDamage(Math.floor(damage));
                } else if (target && typeof target.hp !== 'undefined') {
                    target.hp -= Math.floor(damage);
                }

                // 更新分数
                if (gameState.player && typeof gameState.player.score !== 'undefined') {
                    gameState.player.score += Math.floor(damage);
                }

                // 更新击杀数
                if (target && target.hp <= 0) {
                    gameState.kills = (gameState.kills || 0) + 1;

                    // 检查击杀相关成就
                    if (window.enhancedAchievementSystem) {
                        window.enhancedAchievementSystem.checkAchievements();
                    }
                }

                return true;
            };
        }
    }

    // 获取武器效果
    getWeaponEffect(weapon) {
        if (!weapon || !weapon.name) return null;

        const weaponName = weapon.name.toLowerCase();

        for (const [effectName, effectData] of Object.entries(this.weaponEffects)) {
            if (weaponName.includes(effectName)) {
                return effectData;
            }
        }

        return null;
    }

    // 应用武器效果
    applyWeaponEffect(target, effect) {
        if (!target) return;

        switch (effect.type) {
            case 'burn':
                // 燃烧效果：持续伤害
                this.applyBurnEffect(target, effect);
                break;
            case 'freeze':
                // 冰冻效果：减缓敌人速度
                this.applyFreezeEffect(target, effect);
                break;
            case 'stun':
                // 眩晕效果：短暂停止敌人行动
                this.applyStunEffect(target, effect);
                break;
            case 'poison':
                // 中毒效果：持续伤害
                this.applyPoisonEffect(target, effect);
                break;
            case 'heal':
                // 治疗效果：恢复玩家生命
                this.applyHealEffect(effect);
                break;
            case 'aoe':
                // 范围效果：伤害周围敌人
                this.applyAOEEffect(target, effect);
                break;
            case 'lifesteal':
                // 吸血效果：按比例恢复生命
                this.applyLifestealEffect(effect);
                break;
        }
    }

    // 燃烧效果
    applyBurnEffect(target, effect) {
        const effectId = `${target.id || 'enemy'}_burn`;

        if (!this.enemyStatusEffects.has(effectId)) {
            // 开始燃烧
            this.enemyStatusEffects.set(effectId, {
                type: 'burn',
                damage: effect.damage,
                remainingDuration: effect.duration,
                interval: setInterval(() => {
                    if (target && target.hp > 0) {
                        target.hp -= effect.damage;
                        if (target.hp <= 0) {
                            this.removeStatusEffect(effectId);
                        }
                    }
                }, 500) // 每0.5秒造成一次伤害
            });

            if (typeof showCombatLog !== 'undefined') {
                showCombatLog('🔥 目标被点燃!', 'elemental');
            }
        }
    }

    // 冰冻效果
    applyFreezeEffect(target, effect) {
        // 暂时降低敌人速度
        if (target && typeof target.originalSpeed === 'undefined') {
            target.originalSpeed = target.speed || 1;
            target.speed = target.originalSpeed * effect.slowFactor;

            // 在一段时间后恢复速度
            setTimeout(() => {
                if (target && typeof target.originalSpeed !== 'undefined') {
                    target.speed = target.originalSpeed;
                    delete target.originalSpeed;
                }
            }, effect.duration);

            if (typeof showCombatLog !== 'undefined') {
                showCombatLog('❄️ 目标被冰冻!', 'elemental');
            }
        }
    }

    // 眩晕效果
    applyStunEffect(target, effect) {
        // 暂时停止敌人的行动
        if (target && typeof target.originalUpdate === 'undefined' && typeof target.update === 'function') {
            target.originalUpdate = target.update;
            target.update = () => {}; // 空函数，停止更新

            // 在一段时间后恢复
            setTimeout(() => {
                if (target && typeof target.originalUpdate !== 'undefined') {
                    target.update = target.originalUpdate;
                    delete target.originalUpdate;
                }
            }, effect.duration);

            if (typeof showCombatLog !== 'undefined') {
                showCombatLog('⚡ 目标被眩晕!', 'elemental');
            }
        }
    }

    // 中毒效果
    applyPoisonEffect(target, effect) {
        const effectId = `${target.id || 'enemy'}_poison`;

        if (!this.enemyStatusEffects.has(effectId)) {
            // 开始中毒
            this.enemyStatusEffects.set(effectId, {
                type: 'poison',
                damage: effect.damage,
                remainingDuration: effect.duration,
                interval: setInterval(() => {
                    if (target && target.hp > 0) {
                        target.hp -= effect.damage;
                        if (target.hp <= 0) {
                            this.removeStatusEffect(effectId);
                        }
                    }
                }, 1000) // 每秒造成一次伤害
            });

            if (typeof showCombatLog !== 'undefined') {
                showCombatLog('☠️ 目标中毒!', 'elemental');
            }
        }
    }

    // 治疗效果
    applyHealEffect(effect) {
        if (gameState && gameState.player) {
            const healAmount = effect.heal;
            gameState.player.hp = Math.min(gameState.player.maxHp, gameState.player.hp + healAmount);

            if (typeof showCombatLog !== 'undefined') {
                showCombatLog(`💚 治疗 +${healAmount} HP`, 'heal');
            }
        }
    }

    // 范围效果
    applyAOEEffect(center, effect) {
        // 查找附近的敌人
        if (gameState && gameState.enemies) {
            let enemiesAffected = 0;
            for (const enemy of gameState.enemies) {
                if (enemy && enemy.x && enemy.y) {
                    const distance = Math.sqrt(
                        Math.pow(enemy.x - center.x, 2) +
                        Math.pow(enemy.y - center.y, 2)
                    );

                    if (distance <= effect.radius) {
                        enemy.hp -= effect.damage;
                        enemiesAffected++;
                    }
                }
            }

            if (enemiesAffected > 0 && typeof showCombatLog !== 'undefined') {
                showCombatLog(`💥 范围攻击! 影响 ${enemiesAffected} 个敌人`, 'aoe');
            }
        }
    }

    // 吸血效果
    applyLifestealEffect(effect) {
        if (gameState && gameState.player && typeof this.lastDamageDealt !== 'undefined') {
            const healAmount = Math.floor(this.lastDamageDealt * effect.lifesteal);
            gameState.player.hp = Math.min(gameState.player.maxHp, gameState.player.hp + healAmount);

            if (typeof showCombatLog !== 'undefined') {
                showCombatLog(`吸取生命 +${healAmount} HP`, 'lifesteal');
            }
        }
    }

    // 移除状态效果
    removeStatusEffect(effectId) {
        if (this.enemyStatusEffects.has(effectId)) {
            const effect = this.enemyStatusEffects.get(effectId);
            if (effect.interval) {
                clearInterval(effect.interval);
            }
            this.enemyStatusEffects.delete(effectId);
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

                // 增强AI：根据玩家位置调整行为
                if (gameState && gameState.player) {
                    const dx = gameState.player.x - this.x;
                    const dy = gameState.player.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    // 如果玩家距离很近，增加攻击倾向
                    if (distance < 60) {
                        // 这里可以增加敌人的攻击行为
                        this.aggressiveMode = true;
                    } else {
                        this.aggressiveMode = false;
                    }

                    // 如果敌人有特殊状态效果，考虑其影响
                    if (this.frozen || this.stunned) {
                        // 受到控制效果时，移动或攻击概率降低
                        return;
                    }
                }
            };
        }
    }

    // 增强玩家成长机制
    enhancePlayerProgression() {
        // 级别系统
        if (typeof gameState !== 'undefined') {
            if (!gameState.player.level) {
                gameState.player.level = 1;
            }
            if (!gameState.player.exp) {
                gameState.player.exp = 0;
            }
            if (!gameState.player.expToNext) {
                gameState.player.expToNext = 100;
            }
        }

        // 更新经验值获取逻辑
        if (typeof gainExp !== 'undefined') {
            const originalGainExp = window.gainExp;
            window.gainExp = (amount) => {
                if (originalGainExp) {
                    originalGainExp(amount);
                } else {
                    // 默认经验值获取逻辑
                    if (gameState && gameState.player) {
                        // 应用经验值加成
                        let expGain = amount;
                        if (gameState.xpMultiplier) {
                            expGain *= gameState.xpMultiplier;
                        }

                        gameState.player.exp += expGain;

                        // 检查是否升级
                        if (gameState.player.exp >= gameState.player.expToNext) {
                            this.levelUpPlayer();
                        }
                    }
                }
            };
        } else {
            // 创建经验值获取函数
            window.gainExp = (amount) => {
                if (gameState && gameState.player) {
                    // 应用经验值加成
                    let expGain = amount;
                    if (gameState.xpMultiplier) {
                        expGain *= gameState.xpMultiplier;
                    }

                    gameState.player.exp += expGain;

                    // 检查是否升级
                    if (gameState.player.exp >= gameState.player.expToNext) {
                        this.levelUpPlayer();
                    }
                }
            };
        }
    }

    // 玩家升级
    levelUpPlayer() {
        if (!gameState || !gameState.player) return;

        gameState.player.level++;

        // 增加属性
        gameState.player.maxHp += 5; // 每级增加5点最大生命
        gameState.player.hp = gameState.player.maxHp; // 回满生命

        // 增加技能点
        if (!gameState.player.skillPoints) {
            gameState.player.skillPoints = 0;
        }
        gameState.player.skillPoints += 1;

        // 计算下一级所需经验值
        gameState.player.exp -= gameState.player.expToNext;
        gameState.player.expToNext = Math.floor(gameState.player.expToNext * 1.5);

        // 显示升级提示
        if (typeof showCombatLog !== 'undefined') {
            showCombatLog(`⭐ 玩家升级到 ${gameState.player.level} 级!`, 'level-up');
        }

        // 给予升级奖励
        this.applyLevelUpRewards();
    }

    // 应用升级奖励
    applyLevelUpRewards() {
        // 这里可以添加升级时的特殊奖励或效果
        if (gameState.player.level % 5 === 0) {
            // 每5级给予额外奖励
            gameState.player.maxHp += 10;
            gameState.player.hp = gameState.player.maxHp;

            if (typeof showCombatLog !== 'undefined') {
                showCombatLog('💪 属性增强！最大生命值增加', 'level-up');
            }
        }
    }

    // 添加游戏事件处理器
    addGameEventHandlers() {
        // 关卡完成处理
        if (typeof completeLevel !== 'undefined') {
            const originalComplete = window.completeLevel;
            window.completeLevel = () => {
                if (originalComplete) {
                    originalComplete();
                }

                // 关卡完成后的处理
                if (gameState) {
                    gameState.level = (gameState.level || 1) + 1;

                    // 更新最高关卡记录
                    if (!gameState.highestLevel || gameState.level > gameState.highestLevel) {
                        gameState.highestLevel = gameState.level;
                    }

                    // 检查关卡相关成就
                    if (window.enhancedAchievementSystem) {
                        window.enhancedAchievementSystem.checkAchievements();
                    }

                    // 应用关卡完成奖励
                    this.applyLevelCompletionRewards();
                }
            };
        } else {
            // 创建关卡完成函数
            window.completeLevel = () => {
                if (gameState) {
                    gameState.level = (gameState.level || 1) + 1;

                    // 更新最高关卡记录
                    if (!gameState.highestLevel || gameState.level > gameState.highestLevel) {
                        gameState.highestLevel = gameState.level;
                    }

                    // 检查关卡相关成就
                    if (window.enhancedAchievementSystem) {
                        window.enhancedAchievementSystem.checkAchievements();
                    }

                    // 应用关卡完成奖励
                    this.applyLevelCompletionRewards();
                }
            };
        }
    }

    // 应用关卡完成奖励
    applyLevelCompletionRewards() {
        if (!gameState || !gameState.player) return;

        // 每隔一定关卡给予特殊奖励
        if (gameState.level % 10 === 0) {
            // 每10关给予大量治疗
            gameState.player.hp = gameState.player.maxHp;

            if (typeof showCombatLog !== 'undefined') {
                showCombatLog(`🎁 第 ${gameState.level} 关奖励: 生命值回满!`, 'level-up');
            }
        } else if (gameState.level % 5 === 0) {
            // 每5关给予少量治疗
            const healAmount = Math.floor(gameState.player.maxHp * 0.2);
            gameState.player.hp = Math.min(gameState.player.maxHp, gameState.player.hp + healAmount);

            if (typeof showCombatLog !== 'undefined') {
                showCombatLog(`💊 第 ${gameState.level} 关奖励: +${healAmount} HP`, 'heal');
            }
        }
    }

    // 获取当前武器伤害
    getCurrentWeaponDamage() {
        if (gameState && gameState.player && gameState.player.weapon) {
            return gameState.player.weapon.damage || 10;
        }
        return 10;
    }

    // 检查游戏状态
    checkGameState() {
        // 定期检查游戏状态，执行必要的更新
        if (gameState && gameState.isPlaying) {
            // 更新连击衰减
            if (gameState.player && gameState.player.comboCount > 0) {
                // 检查上次攻击时间，如果太久未攻击则减少连击数
                if (!this.lastAttackTime) {
                    this.lastAttackTime = Date.now();
                }

                const timeSinceLastAttack = Date.now() - this.lastAttackTime;

                // 如果超过3秒未攻击，则减少连击数
                if (timeSinceLastAttack > 3000) {
                    gameState.player.comboCount = Math.max(0, gameState.player.comboCount - 1);
                }
            }
        }
    }

    // 定期清理不再需要的效果
    cleanup() {
        // 清理过期的状态效果
        for (const [effectId, effect] of this.enemyStatusEffects.entries()) {
            if (effect.remainingDuration <= 0) {
                this.removeStatusEffect(effectId);
            }
        }
    }
}

// 初始化核心玩法增强系统
const coreGameplayEnhancements = new CoreGameplayEnhancement();

// 将实例添加到窗口对象以便其他脚本访问
window.CoreGameplayEnhancements = CoreGameplayEnhancements;
window.coreGameplayEnhancements = coreGameplayEnhancements;

// 添加定期执行的任务
setInterval(() => {
    if (window.coreGameplayEnhancements) {
        window.coreGameplayEnhancements.checkGameState();
        window.coreGameplayEnhancements.cleanup();
    }
}, 100);

console.log("🚀 核心玩法增强系统已完全加载");