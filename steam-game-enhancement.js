// ==================== Steam版游戏综合增强 ====================
//
// 为游戏添加综合增强功能，包括：
// 1. 更好的平衡性
// 2. 更多游戏内容
// 3. 更丰富的游戏机制
//

class SteamGameEnhancement {
    constructor() {
        this.init();
    }

    init() {
        // 增强游戏平衡性
        this.enhanceBalance();

        // 增加游戏内容
        this.addContent();

        // 改进游戏机制
        this.improveGameMechanics();

        console.log("Steam版游戏综合增强已应用");
    }

    // 增强游戏平衡性
    enhanceBalance() {
        // 改进关卡难度曲线
        this.improveLevelProgression();

        // 调整武器平衡
        this.adjustWeaponBalance();

        // 优化敌人生成机制
        this.optimizeEnemySpawning();

        console.log("✅ 游戏平衡性已增强");
    }

    // 改进关卡进度
    improveLevelProgression() {
        // 修改关卡奖励机制，让玩家更有成就感
        if (typeof gameState !== 'undefined') {
            // 添加一个函数来处理关卡奖励
            window.grantLevelReward = (level) => {
                if (!gameState.player) return;

                // 每5级给予特殊奖励
                if (level % 5 === 0) {
                    // 每5级增加最大生命值
                    gameState.player.maxHp += 10;
                    gameState.player.hp = Math.min(gameState.player.hp + 10, gameState.player.maxHp);

                    // 显示奖励提示
                    if (typeof showCombatLog !== 'undefined') {
                        showCombatLog(`💚 第${level}关奖励！最大生命值+10`, 'level-up');
                    }
                }

                // 每10级给予更强的奖励
                if (level % 10 === 0) {
                    // 一次性大量生命恢复
                    const healAmount = Math.floor(gameState.player.maxHp * 0.3);
                    gameState.player.hp = Math.min(gameState.player.hp + healAmount, gameState.player.maxHp);

                    if (typeof showCombatLog !== 'undefined') {
                        showCombatLog(`🌟 第${level}关里程碑！生命值+${healAmount}，最大生命值+20`, 'level-up');
                    }
                    gameState.player.maxHp += 20;
                    gameState.player.hp = Math.min(gameState.player.hp, gameState.player.maxHp);
                }
            };
        }

        // 修改关卡提升触发方式，使其与现有代码兼容
        if (typeof upgradeLevel !== 'undefined') {
            const originalUpgradeLevel = window.upgradeLevel;
            window.upgradeLevel = function() {
                originalUpgradeLevel();

                // 在关卡提升后给予奖励
                if (typeof grantLevelReward !== 'undefined') {
                    grantLevelReward(gameState.level);
                }

                // 根据关卡解锁新内容
                unlockNewContentByLevel(gameState.level);
            };
        }
    }

    // 调整武器平衡
    adjustWeaponBalance() {
        // 扩展武器属性，添加更多元化的效果
        if (typeof WEAPONS !== 'undefined') {
            // 添加武器类型的独特属性
            WEAPONS.forEach(weapon => {
                // 为不同类型武器添加特殊效果标识
                if (!weapon.effects) {
                    weapon.effects = [];
                }

                // 根据武器名称推断效果
                if (weapon.name.includes('火焰') || weapon.name.includes('火')) {
                    weapon.effects.push('fire');
                } else if (weapon.name.includes('冰') || weapon.name.includes('霜')) {
                    weapon.effects.push('ice');
                } else if (weapon.name.includes('雷') || weapon.name.includes('电')) {
                    weapon.effects.push('lightning');
                } else if (weapon.name.includes('毒')) {
                    weapon.effects.push('poison');
                } else if (weapon.name.includes('神圣') || weapon.name.includes('圣')) {
                    weapon.effects.push('holy');
                } else if (weapon.name.includes('暗影') || weapon.name.includes('暗')) {
                    weapon.effects.push('shadow');
                }
            });

            console.log(`🔧 已为 ${WEAPONS.length} 个武器添加了效果属性`);
        }
    }

    // 优化敌人生成机制
    optimizeEnemySpawning() {
        // 添加精英敌人机制
        if (typeof Enemy !== 'undefined') {
            // 保存原始构造函数
            const originalEnemyConstructor = Enemy.prototype.constructor;

            // 扩展Enemy类以支持精英敌人
            Enemy.prototype.constructor = function(level, type = null) {
                // 调用原始构造函数
                originalEnemyConstructor.call(this, level, type);

                // 根据关卡和随机性决定是否为精英敌人
                const eliteChance = Math.min(0.15, 0.02 + (level * 0.002)); // 随关卡提高精英概率

                if (Math.random() < eliteChance) {
                    this.isElite = true;
                    this.health *= 1.8; // 精英敌人血量增加
                    this.maxHealth = this.health;
                    this.damage *= 1.5; // 精英敌人伤害增加
                    this.speed *= 1.2; // 精英敌人速度增加
                    this.color = '#ff00ff'; // 精英敌人特殊颜色
                    this.size = this.radius * 1.3; // 精英敌人更大

                    // 添加精英敌人标签
                    this.name = '精英 ' + (this.name || '敌人');
                } else {
                    this.isElite = false;
                }

                // 随着关卡增加，敌人基础属性增强
                const scalingFactor = 1 + (level * 0.08); // 随关卡线性增强
                if (!this.isElite) { // 如果不是精英，则单独增强普通敌人
                    this.health *= Math.pow(scalingFactor, 0.8);
                    this.damage *= Math.pow(scalingFactor, 0.7);
                    this.speed *= Math.pow(scalingFactor, 0.1); // 速度增长较慢
                    this.maxHealth = this.health;
                }
            };

            // 扩展绘制方法以显示精英状态
            if (Enemy.prototype.draw) {
                const originalDraw = Enemy.prototype.draw;
                Enemy.prototype.draw = function(ctx) {
                    // 如果是精英敌人，先画一个光环
                    if (this.isElite) {
                        ctx.beginPath();
                        ctx.arc(this.x, this.y, this.size + 5, 0, Math.PI * 2);
                        ctx.fillStyle = 'rgba(255, 0, 255, 0.3)';
                        ctx.fill();
                    }

                    // 然后调用原始绘制方法
                    originalDraw.call(this, ctx);
                };
            }
        }
    }

    // 添加更多游戏内容
    addContent() {
        // 添加新的武器类型
        this.addNewWeapons();

        // 添加新的敌人类型
        this.addNewEnemyTypes();

        // 添加新的游戏事件
        this.addNewEvents();

        console.log("📦 游戏内容已增加");
    }

    // 添加新武器
    addNewWeapons() {
        if (typeof WEAPONS !== 'undefined') {
            const newWeapons = [
                // 新增常见武器
                { name: '生锈的管钳', damage: 8, rarity: 'common', color: '#A9A9A9', effects: ['utility'], description: '水管工的好帮手，也能用来打架' },
                { name: '厨房菜刀', damage: 7, rarity: 'common', color: '#C0C0C0', effects: [], description: '新鲜出炉（或出炉很久）的武器' },
                { name: '硬质雨伞', damage: 6, rarity: 'common', color: '#00008B', effects: [], description: '防雨防敌两相宜' },

                // 新增不常见武器
                { name: '健身哑铃', damage: 18, rarity: 'uncommon', color: '#708090', effects: [], description: '锻炼身体，保卫自己' },
                { name: '吉他拨片', damage: 14, rarity: 'uncommon', color: '#FFD700', effects: [], description: '让敌人听到死亡的旋律' },
                { name: '螺丝刀套装', damage: 16, rarity: 'uncommon', color: '#2F4F4F', effects: [], description: '精密工程，精确打击' },

                // 新增稀有武器
                { name: '量子波动炮', damage: 48, rarity: 'rare', color: '#00FFFF', effects: ['quantum'], description: '利用量子力学原理的高科技武器' },
                { name: '等离子剑', damage: 45, rarity: 'rare', color: '#FF00FF', effects: ['fire', 'lightning'], description: '高温等离子体构成的能量剑' },
                { name: '重力锤', damage: 52, rarity: 'rare', color: '#8A2BE2', effects: ['gravity'], description: '操控局部重力场的奇械' },

                // 新增史诗武器
                { name: '时间之刃', damage: 85, rarity: 'epic', color: '#9370DB', effects: ['temporal'], description: '切割时间本身的神器' },
                { name: '维度撕裂者', damage: 88, rarity: 'epic', color: '#4B0082', effects: ['dimension'], description: '能够撕裂空间维度的恐怖武器' },
                { name: '现实编辑器', damage: 92, rarity: 'epic', color: '#FF69B4', effects: ['reality'], description: '改写现实基本规则的工具' },

                // 新增传说武器
                { name: '宇宙起源', damage: 115, rarity: 'legendary', color: '#000000', effects: ['cosmic'], description: '宇宙大爆炸时的产物' },
                { name: '虚无之握', damage: 110, rarity: 'legendary', color: '#2F4F4F', effects: ['void'], description: '掌握虚无力量的终极武器' },
                { name: '万能钥匙', damage: 120, rarity: 'legendary', color: '#FFD700', effects: ['omni'], description: '能够解锁一切可能性的神器' },

                // 新增神话武器
                { name: '概念武器', damage: 1800, rarity: 'mythic', color: '#FF00FF', effects: ['conceptual'], description: '超越物理存在的纯粹概念' },
                { name: '观察者之眼', damage: 2000, rarity: 'mythic', color: '#00FFFF', effects: ['observational'], description: '观察即改变现实的终极能力' },
                { name: '元逻辑引擎', damage: 2200, rarity: 'mythic', color: '#9400D3', effects: ['meta'], description: '能够操作逻辑本身的超验实体' }
            ];

            WEAPONS.push(...newWeapons);
            console.log(`🆕 新增了 ${newWeapons.length} 种武器`);
        }
    }

    // 添加新敌人类型
    addNewEnemyTypes() {
        // 在Enemy类的权重系统中已经包含了多种敌人类型
        // 我们可以添加一个函数来处理特定关卡解锁的新敌人
        window.unlockNewContentByLevel = (level) => {
            // 这里可以添加随关卡解锁的内容
            if (level === 5) {
                if (typeof showCombatLog !== 'undefined') {
                    showCombatLog('🏹 新敌人类型解锁：弓箭手！', 'enemy-spawn');
                }
            } else if (level === 10) {
                if (typeof showCombatLog !== 'undefined') {
                    showCombatLog('法师职业现已出现！小心魔法攻击！', 'enemy-spawn');
                }
            } else if (level === 15) {
                if (typeof showCombatLog !== 'undefined') {
                    showCombatLog('👻 新敌人类型解锁：刺客！他们会隐身偷袭！', 'enemy-spawn');
                }
            } else if (level === 20) {
                if (typeof showCombatLog !== 'undefined') {
                    showCombatLog('🐉 新敌人类型解锁：龙类！血厚攻高，非常危险！', 'enemy-spawn');
                }
            } else if (level === 25) {
                if (typeof showCombatLog !== 'undefined') {
                    showCombatLog('👻💀 新敌人类型解锁：巫妖王！能够召唤骷髅兵！', 'enemy-spawn');
                }
            } else if (level === 30) {
                if (typeof showCombatLog !== 'undefined') {
                    showCombatLog('🌌 进入传奇领域！所有敌人都变得更加强大！', 'enemy-spawn');
                }
            } else if (level === 40) {
                if (typeof showCombatLog !== 'undefined') {
                    showCombatLog('⭐ 宇宙级挑战者！面对终极考验！', 'enemy-spawn');
                }
            }

            // 在特定关卡添加特殊的事件提示
            if (level > 0 && level % 10 === 0) {
                if (typeof showCombatLog !== 'undefined') {
                    showCombatLog(`🎉 达到第 ${level} 关！你是真正的英雄！`, 'level-milestone');
                }
            }
        };
    }

    // 添加新游戏事件
    addNewEvents() {
        // 添加随机事件系统
        window.startRandomEventSystem = () => {
            // 每隔一段时间触发随机事件
            setInterval(() => {
                if (gameState && gameState.isPlaying && Math.random() < 0.3) { // 30% 概率触发事件
                    this.triggerRandomEvent();
                }
            }, 30000); // 每30秒检查一次
        };

        // 触发随机事件
        window.triggerRandomEvent = () => {
            const events = [
                this.blessingEvent,
                this.cursedEvent,
                this.treasureEvent,
                this.challengeEvent
            ];

            const event = events[Math.floor(Math.random() * events.length)];
            if (event && typeof event === 'function') {
                event.call(this);
            }
        };

        // 祝福事件
        this.blessingEvent = () => {
            if (!gameState || !gameState.player) return;

            const blessingType = Math.floor(Math.random() * 3);
            switch(blessingType) {
                case 0: // 攻击力提升
                    gameState.player.damageBoost = gameState.player.damageBoost || 0;
                    gameState.player.damageBoost += 0.5; // 50% 攻击力提升
                    if (typeof showCombatLog !== 'undefined') {
                        showCombatLog('✨ 神圣祝福！攻击力大幅提升！(+50%)', 'blessing');
                    }
                    // 5分钟后效果消失
                    setTimeout(() => {
                        if (gameState.player) {
                            gameState.player.damageBoost = Math.max(0, gameState.player.damageBoost - 0.5);
                            if (typeof showCombatLog !== 'undefined') {
                                showCombatLog('✨ 神圣祝福效果消退', 'debuff-end');
                            }
                        }
                    }, 300000);
                    break;
                case 1: // 生命恢复
                    const healAmount = Math.floor(gameState.player.maxHp * 0.3);
                    gameState.player.hp = Math.min(gameState.player.hp + healAmount, gameState.player.maxHp);
                    if (typeof showCombatLog !== 'undefined') {
                        showCombatLog(`💚 生命之泉！恢复 ${healAmount} 生命值！`, 'blessing');
                    }
                    break;
                case 2: // 伤害减免
                    gameState.player.defenseBoost = gameState.player.defenseBoost || 0;
                    gameState.player.defenseBoost += 0.3; // 30% 伤害减免
                    if (typeof showCombatLog !== 'undefined') {
                        showCombatLog('🛡️ 守护圣光！受到伤害减少30%！', 'blessing');
                    }
                    // 5分钟后效果消失
                    setTimeout(() => {
                        if (gameState.player) {
                            gameState.player.defenseBoost = Math.max(0, gameState.player.defenseBoost - 0.3);
                            if (typeof showCombatLog !== 'undefined') {
                                showCombatLog('🛡️ 守护圣光效果消退', 'debuff-end');
                            }
                        }
                    }, 300000);
                    break;
            }
        };

        // 诅咒事件
        this.cursedEvent = () => {
            if (!gameState || !gameState.player) return;

            const cursedType = Math.floor(Math.random() * 3);
            switch(cursedType) {
                case 0: // 攻击力下降
                    gameState.player.damageMalus = gameState.player.damageMalus || 0;
                    gameState.player.damageMalus += 0.3; // 30% 攻击力下降
                    if (typeof showCombatLog !== 'undefined') {
                        showCombatLog('😰 混沌诅咒！攻击力下降30%！', 'curse');
                    }
                    // 3分钟后效果消失
                    setTimeout(() => {
                        if (gameState.player) {
                            gameState.player.damageMalus = Math.max(0, gameState.player.damageMalus - 0.3);
                            if (typeof showCombatLog !== 'undefined') {
                                showCombatLog('😰 混沌诅咒效果消退', 'buff-end');
                            }
                        }
                    }, 180000);
                    break;
                case 1: // 移动速度下降
                    gameState.player.speedMalus = gameState.player.speedMalus || 0;
                    gameState.player.speedMalus += 0.2; // 20% 移动速度下降
                    if (typeof showCombatLog !== 'undefined') {
                        showCombatLog('🦵 重力诅咒！移动速度下降20%！', 'curse');
                    }
                    // 3分钟后效果消失
                    setTimeout(() => {
                        if (gameState.player) {
                            gameState.player.speedMalus = Math.max(0, gameState.player.speedMalus - 0.2);
                            if (typeof showCombatLog !== 'undefined') {
                                showCombatLog('🦵 重力诅咒效果消退', 'buff-end');
                            }
                        }
                    }, 180000);
                    break;
                case 2: // 生命上限下降
                    gameState.player.maxHp *= 0.9; // 最大生命值减少10%
                    gameState.player.hp = Math.min(gameState.player.hp, gameState.player.maxHp);
                    if (typeof showCombatLog !== 'undefined') {
                        showCombatLog('😵 生命诅咒！最大生命值减少10%！', 'curse');
                    }
                    // 5分钟后效果消失
                    setTimeout(() => {
                        if (gameState.player) {
                            gameState.player.maxHp /= 0.9; // 恢复最大生命值
                            if (typeof showCombatLog !== 'undefined') {
                                showCombatLog('😵 生命诅咒效果消退', 'buff-end');
                            }
                        }
                    }, 300000);
                    break;
            }
        };

        // 宝藏事件
        this.treasureEvent = () => {
            if (!gameState) return;

            // 随机生成一个高品质武器
            const rareWeapons = WEAPONS.filter(w => w.rarity === 'rare' || w.rarity === 'epic' || w.rarity === 'legendary');
            if (rareWeapons.length > 0) {
                const randomWeapon = rareWeapons[Math.floor(Math.random() * rareWeapons.length)];

                // 在玩家附近生成武器
                if (gameState.weapons) {
                    gameState.weapons.push({
                        ...randomWeapon,
                        x: gameState.player.x + (Math.random() - 0.5) * 200,
                        y: gameState.player.y + (Math.random() - 0.5) * 200,
                        pickupRadius: 25
                    });

                    if (typeof showCombatLog !== 'undefined') {
                        showCombatLog(` chests 🎁 神秘宝箱开启！获得了 ${randomWeapon.name}！`, 'treasure');
                    }
                }
            }
        };

        // 挑战事件
        this.challengeEvent = () => {
            // 生成一波特殊敌人挑战玩家
            if (gameState && gameState.enemies) {
                const waveSize = 3 + Math.floor(gameState.level / 10); // 随关卡增加敌人数量

                for (let i = 0; i < waveSize; i++) {
                    setTimeout(() => {
                        // 生成比当前等级稍高的敌人
                        const enemyLevel = Math.max(1, gameState.level + 2);

                        // 这里需要创建敌人实例，依赖Enemy类
                        if (typeof Enemy !== 'undefined') {
                            gameState.enemies.push(new Enemy(enemyLevel));
                        }
                    }, i * 1000); // 间隔生成敌人
                }

                if (typeof showCombatLog !== 'undefined') {
                    showCombatLog(`⚔️ 挑战波次！击败 ${waveSize} 个高等级敌人！`, 'challenge');
                }
            }
        };

        console.log("🎲 随机事件系统已准备");
    }

    // 改进游戏机制
    improveGameMechanics() {
        // 添加连击系统改进
        this.improveComboSystem();

        // 添加技能系统扩展
        this.expandSkillSystem();

        // 添加道具系统增强
        this.enhanceItemSystem();

        console.log("⚙️ 游戏机制已改进");
    }

    // 改进连击系统
    improveComboSystem() {
        if (typeof gameState !== 'undefined' && gameState.player) {
            // 初始化连击相关属性
            gameState.player.comboStartTime = Date.now();
            gameState.player.comboTimeout = 5000; // 5秒内未击杀则重置连击

            // 添加连击检测函数
            window.checkAndIncreaseCombo = () => {
                if (!gameState.player) return;

                const now = Date.now();

                // 检查是否超过连击时限
                if (now - gameState.player.comboStartTime > gameState.player.comboTimeout) {
                    gameState.player.combo = 0; // 重置连击
                }

                // 增加连击数
                gameState.player.combo = (gameState.player.combo || 0) + 1;
                gameState.player.comboStartTime = now; // 更新最后击杀时间

                // 根据连击数给予奖励
                if (gameState.player.combo > 1 && gameState.player.combo % 5 === 0) {
                    // 每5连击给予特殊奖励
                    const rewardHealth = Math.floor(gameState.player.maxHp * 0.05); // 恢复5%最大生命
                    gameState.player.hp = Math.min(gameState.player.hp + rewardHealth, gameState.player.maxHp);

                    if (typeof showCombatLog !== 'undefined') {
                        showCombatLog(`🔥 ${gameState.player.combo} 连击！生命值+${rewardHealth}`, 'combo-reward');
                    }
                }

                // 更新最大连击记录
                if (gameState.player.combo > (gameState.player.maxCombo || 0)) {
                    gameState.player.maxCombo = gameState.player.combo;
                }
            };
        }
    }

    // 扩展技能系统
    expandSkillSystem() {
        // 如果游戏有技能系统，扩展它
        if (typeof gameState !== 'undefined') {
            // 添加技能冷却缩减机制
            gameState.skillCooldownReduction = 0;

            // 添加被动技能系统
            gameState.passiveSkills = gameState.passiveSkills || [];

            // 添加被动技能：生命汲取
            gameState.passiveSkills.push({
                name: '生命汲取',
                description: '每次攻击恢复1%的生命值',
                active: true,
                effect: function(damageDealt) {
                    if (gameState.player && damageDealt > 0) {
                        const healAmount = Math.min(damageDealt * 0.01, gameState.player.maxHp - gameState.player.hp);
                        gameState.player.hp += healAmount;
                        return healAmount;
                    }
                    return 0;
                }
            });

            // 添加被动技能：暴击
            gameState.passiveSkills.push({
                name: '致命一击',
                description: '每10次攻击必有一次暴击(150%伤害)',
                active: true,
                attackCounter: 0,
                effect: function() {
                    this.attackCounter = (this.attackCounter || 0) + 1;
                    if (this.attackCounter >= 10) {
                        this.attackCounter = 0;
                        return 1.5; // 150% 暴击伤害
                    }
                    return 1.0; // 普通伤害
                }
            });
        }

        console.log("⚔️ 技能系统已扩展");
    }

    // 增强道具系统
    enhanceItemSystem() {
        // 扩展武器效果应用机制
        if (typeof applyWeapon !== 'undefined') {
            const originalApplyWeapon = window.applyWeapon;

            window.applyWeapon = function(weapon) {
                // 应用原始武器
                const result = originalApplyWeapon(weapon);

                // 检查是否有特殊效果
                if (weapon.effects && Array.isArray(weapon.effects)) {
                    weapon.effects.forEach(effect => {
                        this.processWeaponEffect(effect, weapon);
                    });
                }

                return result;
            }.bind(this);
        }

        // 处理武器特殊效果
        window.processWeaponEffect = (effect, weapon) => {
            if (!gameState.player) return;

            switch(effect) {
                case 'fire':
                    // 火焰效果 - 可能点燃敌人
                    gameState.player.fireBonus = (gameState.player.fireBonus || 0) + 0.2; // 20% 额外伤害
                    setTimeout(() => {
                        if (gameState.player) {
                            gameState.player.fireBonus = Math.max(0, (gameState.player.fireBonus || 0) - 0.2);
                        }
                    }, 10000); // 10秒后效果消失
                    break;

                case 'ice':
                    // 冰霜效果 - 可能减缓敌人
                    gameState.player.iceBonus = (gameState.player.iceBonus || 0) + 0.15; // 15% 暴击率
                    setTimeout(() => {
                        if (gameState.player) {
                            gameState.player.iceBonus = Math.max(0, (gameState.player.iceBonus || 0) - 0.15);
                        }
                    }, 10000);
                    break;

                case 'lightning':
                    // 雷电效果 - 可能连锁攻击
                    gameState.player.lightningChain = (gameState.player.lightningChain || 0) + 1; // 增加1个连锁目标
                    setTimeout(() => {
                        if (gameState.player) {
                            gameState.player.lightningChain = Math.max(0, (gameState.player.lightningChain || 0) - 1);
                        }
                    }, 15000);
                    break;

                case 'poison':
                    // 毒素效果 - 持续伤害
                    gameState.player.poisonPower = (gameState.player.poisonPower || 0) + 2; // 每次攻击附加2点持续伤害
                    setTimeout(() => {
                        if (gameState.player) {
                            gameState.player.poisonPower = Math.max(0, (gameState.player.poisonPower || 0) - 2);
                        }
                    }, 20000);
                    break;
            }
        };
    }
}

// 初始化Steam版游戏增强
window.steamGameEnhancement = new SteamGameEnhancement();

// 如果游戏状态已存在，应用等级奖励
if (typeof gameState !== 'undefined' && typeof grantLevelReward !== 'undefined') {
    if (gameState.level > 1) {
        grantLevelReward(gameState.level);
    }
}

// 启动随机事件系统（如果游戏开始时）
if (typeof startGame !== 'undefined') {
    const originalStartGame = window.startGame;
    window.startGame = function() {
        originalStartGame.call(this);

        // 开始随机事件系统
        if (typeof startRandomEventSystem !== 'undefined') {
            setTimeout(startRandomEventSystem, 30000); // 30秒后开始
        }
    };
}

console.log("Steam版游戏综合增强模块已加载");