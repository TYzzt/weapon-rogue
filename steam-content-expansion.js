// ==================== Steam版内容扩展包 ====================
//
// 为游戏添加更多内容以增加游戏时长至1-2小时，包括：
// 1. 更多关卡里程碑奖励
// 2. 更丰富的敌人类型
// 3. 更多武器和道具
// 4. 特殊事件系统
//

class SteamContentExpansion {
    constructor() {
        this.milestones = [];
        this.eventSystem = null;
        this.init();
    }

    init() {
        // 初始化里程碑系统
        this.initializeMilestones();

        // 初始化特殊事件系统
        this.initializeEventSystem();

        // 扩展敌人类型
        this.extendEnemyTypes();

        // 增加武器种类
        this.increaseWeaponVariety();

        console.log("Steam版内容扩展已初始化");
    }

    // 初始化里程碑系统
    initializeMilestones() {
        this.milestones = [
            // 早期里程碑 (1-10关)
            { level: 1, name: '初来乍到', description: '开始冒险', action: () => this.rewardBasic() },
            { level: 2, name: '渐入佳境', description: '适应游戏节奏', action: () => this.rewardBasic() },
            { level: 3, name: '第三关挑战', description: '克服初期困难', action: () => this.rewardHp() },
            { level: 5, name: '突破瓶颈', description: '掌握基本技巧', action: () => this.rewardWeaponChoice() },
            { level: 8, name: '稳步前进', description: '技能逐步提升', action: () => this.rewardBasic() },

            // 中期里程碑 (11-20关)
            { level: 10, name: '强者之路', description: '进入中级阶段', action: () => this.rewardHpAndShield() },
            { level: 12, name: '技巧提升', description: '应对更强敌人', action: () => this.rewardBasic() },
            { level: 15, name: '精英挑战', description: '对抗精英敌人', action: () => this.rewardWeaponChoice() },
            { level: 18, name: '高手风范', description: '游刃有余', action: () => this.rewardBasic() },

            // 后期里程碑 (21-35关)
            { level: 20, name: '传说入门', description: '踏入传说领域', action: () => this.rewardMajor() },
            { level: 25, name: '大师境界', description: '技巧炉火纯青', action: () => this.rewardHpAndWeapon() },
            { level: 30, name: '传奇之路', description: '成为传奇英雄', action: () => this.rewardMajor() },
            { level: 35, name: '半神领域', description: '接近神之境界', action: () => this.rewardUltimate() },

            // 终极里程碑 (36-50关)
            { level: 40, name: '宇宙意志', description: '与宇宙同在', action: () => this.rewardCosmic() },
            { level: 45, name: '超越极限', description: '突破一切束缚', action: () => this.rewardHpAndChoice() },
            { level: 50, name: '游戏之神', description: '登峰造极', action: () => this.rewardDivine() }
        ];

        // 扩展里程碑奖励函数
        this.setupMilestoneRewards();

        console.log(`🎯 已设置 ${this.milestones.length} 个里程碑`);
    }

    // 设置里程碑奖励
    setupMilestoneRewards() {
        // 基础奖励
        this.rewardBasic = () => {
            if (gameState.player) {
                const heal = Math.floor(gameState.player.maxHp * 0.15);
                gameState.player.hp = Math.min(gameState.player.hp + heal, gameState.player.maxHp);

                if (typeof showCombatLog !== 'undefined') {
                    showCombatLog(`🎁 里程碑奖励：生命恢复 ${heal} 点！`, 'level-up');
                }
            }
        };

        // 生命奖励
        this.rewardHp = () => {
            if (gameState.player) {
                gameState.player.maxHp += 15;
                gameState.player.hp += 15;

                if (typeof showCombatLog !== 'undefined') {
                    showCombatLog(`💚 里程碑奖励：最大生命值+15！`, 'level-up');
                }
            }
        };

        // 护盾奖励
        this.rewardShield = () => {
            if (gameState.player) {
                // 如果有护盾系统，增加护盾值
                gameState.player.shield = (gameState.player.shield || 0) + 20;

                if (typeof showCombatLog !== 'undefined') {
                    showCombatLog(`🛡️ 里程碑奖励：获得20点护盾！`, 'level-up');
                }
            }
        };

        // 武器选择奖励
        this.rewardWeaponChoice = () => {
            if (gameState.weapons) {
                // 生成3把高品质武器供选择
                const rareWeapons = this.getRandomRareWeapons(3);

                for (let i = 0; i < rareWeapons.length; i++) {
                    const weapon = rareWeapons[i];
                    weapon.x = (gameState.player?.x || 400) + (i - 1) * 100;
                    weapon.y = (gameState.player?.y || 300) - 100;
                    weapon.pickupRadius = 30;

                    gameState.weapons.push(weapon);
                }

                if (typeof showCombatLog !== 'undefined') {
                    showCombatLog(`⚔️ 里程碑奖励：3把高品质武器已投放！`, 'weapon-get');
                }
            }
        };

        // 生命+护盾奖励
        this.rewardHpAndShield = () => {
            if (gameState.player) {
                gameState.player.maxHp += 20;
                gameState.player.hp += 25;
                gameState.player.shield = (gameState.player.shield || 0) + 25;

                if (typeof showCombatLog !== 'undefined') {
                    showCombatLog(`❤️🛡️ 里程碑奖励：最大生命值+20，恢复25生命，获得25护盾！`, 'level-up');
                }
            }
        };

        // 武器+生命奖励
        this.rewardHpAndWeapon = () => {
            this.rewardHp();
            this.rewardWeaponChoice();
        };

        // 主要奖励
        this.rewardMajor = () => {
            if (gameState.player) {
                gameState.player.maxHp += 25;
                gameState.player.hp = gameState.player.maxHp; // 完全恢复
                gameState.player.speed += 0.2;

                if (typeof showCombatLog !== 'undefined') {
                    showCombatLog(`🌟 重大里程碑：最大生命值+25，完全恢复，移速+0.2！`, 'level-up');
                }
            }
        };

        // 终极奖励
        this.rewardUltimate = () => {
            if (gameState.player) {
                gameState.player.maxHp += 30;
                gameState.player.hp = gameState.player.maxHp;
                gameState.player.speed += 0.3;

                // 临时无敌效果
                gameState.player.invulnerable = true;
                setTimeout(() => {
                    if (gameState.player) gameState.player.invulnerable = false;
                }, 5000); // 5秒无敌

                if (typeof showCombatLog !== 'undefined') {
                    showCombatLog(`💫 终极奖励：最大生命+30，完全恢复，移速+0.3，5秒无敌！`, 'level-up');
                }
            }
        };

        // 宇宙级奖励
        this.rewardCosmic = () => {
            if (gameState.player) {
                gameState.player.maxHp += 40;
                gameState.player.hp = gameState.player.maxHp;
                gameState.player.speed += 0.4;

                // 召唤盟友协助
                this.summonAllies();

                if (typeof showCombatLog !== 'undefined') {
                    showCombatLog(`🌌 宇宙之力：最大生命+40，完全恢复，移速+0.4，召唤盟友！`, 'level-up');
                }
            }
        };

        // 神级奖励
        this.rewardDivine = () => {
            if (gameState.player) {
                gameState.player.maxHp += 50;
                gameState.player.hp = gameState.player.maxHp;
                gameState.player.speed += 0.5;

                // 暂时提升武器伤害
                gameState.player.tempWeaponBoost = 2.0; // 2倍武器伤害
                setTimeout(() => {
                    if (gameState.player) gameState.player.tempWeaponBoost = 1.0;
                }, 30000); // 30秒后失效

                if (typeof showCombatLog !== 'undefined') {
                    showCombatLog(`👑 神之恩赐：最大生命+50，完全恢复，移速+0.5，30秒2倍武器伤害！`, 'level-up');
                }
            }
        };

        // 生命+选择奖励
        this.rewardHpAndChoice = () => {
            this.rewardHp();
            this.rewardWeaponChoice();
        };
    }

    // 获取随机高品质武器
    getRandomRareWeapons(count) {
        if (!window.WEAPONS) return [];

        const rareWeapons = window.WEAPONS.filter(weapon =>
            weapon.rarity === 'rare' ||
            weapon.rarity === 'epic' ||
            weapon.rarity === 'legendary'
        );

        const selected = [];
        for (let i = 0; i < count && rareWeapons.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * rareWeapons.length);
            selected.push({...rareWeapons[randomIndex]}); // 创建副本
        }

        return selected;
    }

    // 召喚盟友
    summonAllies() {
        // 生成玩家盟友
        if (gameState.allies) {
            for (let i = 0; i < 2; i++) {
                gameState.allies.push({
                    x: (gameState.player?.x || 400) + (Math.random() - 0.5) * 100,
                    y: (gameState.player?.y || 300) + (Math.random() - 0.5) * 100,
                    radius: 10,
                    color: '#00FF00',
                    speed: 2.0,
                    damage: 10,
                    target: null
                });
            }
        }
    }

    // 初始化特殊事件系统
    initializeEventSystem() {
        this.eventSystem = {
            activeEvents: [],
            eventQueue: [],
            eventCooldowns: {}
        };

        // 定义特殊事件类型
        this.eventTypes = {
            // 环境事件
            'weather_storm': {
                name: '元素风暴',
                description: '全屏敌人受到持续伤害',
                duration: 10000,
                effect: this.elementalStormEvent
            },
            'time_warp': {
                name: '时间扭曲',
                description: '减缓敌人速度，加快玩家速度',
                duration: 15000,
                effect: this.timeWarpEvent
            },
            'treasure_rain': {
                name: '宝物降临',
                description: '大量武器从天而降',
                duration: 8000,
                effect: this.treasureRainEvent
            },

            // 挑战事件
            'boss_wave': {
                name: '首领来袭',
                description: '一波强大的首领敌人',
                duration: 20000,
                effect: this.bossWaveEvent
            },
            'elite_surprise': {
                name: '精英突袭',
                description: '大量精英敌人出现',
                duration: 15000,
                effect: this.eliteSurpriseEvent
            },

            // 增益事件
            'blessing_field': {
                name: '祝福领域',
                description: '玩家在区域内获得持续增益',
                duration: 30000,
                effect: this.blessingFieldEvent
            },
            'weapon_fusion': {
                name: '武器融合',
                description: '武器能力暂时融合提升',
                duration: 25000,
                effect: this.weaponFusionEvent
            }
        };

        // 启动事件调度器
        this.startEventScheduler();

        console.log("🎲 特殊事件系统已初始化");
    }

    // 启动事件调度器
    startEventScheduler() {
        setInterval(() => {
            if (gameState && gameState.isPlaying && Math.random() < 0.15) { // 15% 概率触发事件
                this.scheduleRandomEvent();
            }
        }, 45000); // 每45秒检查一次
    }

    // 安排随机事件
    scheduleRandomEvent() {
        const eventKeys = Object.keys(this.eventTypes);
        if (eventKeys.length === 0) return;

        const randomEventKey = eventKeys[Math.floor(Math.random() * eventKeys.length)];
        const eventTemplate = this.eventTypes[randomEventKey];

        // 检查冷却时间
        const now = Date.now();
        const lastEventTime = this.eventSystem.eventCooldowns[randomEventKey] || 0;
        if (now - lastEventTime < 60000) { // 最少1分钟冷却
            return;
        }

        // 创建事件实例
        const eventInstance = {
            id: `${randomEventKey}_${Date.now()}`,
            type: randomEventKey,
            name: eventTemplate.name,
            description: eventTemplate.description,
            startTime: now,
            duration: eventTemplate.duration,
            active: true,
            effect: eventTemplate.effect
        };

        this.eventSystem.eventQueue.push(eventInstance);
        this.executeNextEvent();

        // 设置冷却时间
        this.eventSystem.eventCooldowns[randomEventKey] = now;
    }

    // 执行下一个事件
    executeNextEvent() {
        if (this.eventSystem.eventQueue.length === 0) return;

        const event = this.eventSystem.eventQueue.shift();
        this.eventSystem.activeEvents.push(event);

        if (typeof showCombatLog !== 'undefined') {
            showCombatLog(`🌟 特殊事件：${event.name} - ${event.description}`, 'special-event');
        }

        // 执行事件效果
        if (typeof event.effect === 'function') {
            event.effect.call(this);
        }

        // 设置事件结束定时器
        setTimeout(() => {
            this.endEvent(event);
        }, event.duration);
    }

    // 结束事件
    endEvent(event) {
        event.active = false;
        const index = this.eventSystem.activeEvents.indexOf(event);
        if (index !== -1) {
            this.eventSystem.activeEvents.splice(index, 1);
        }

        if (typeof showCombatLog !== 'undefined') {
            showCombatLog(`🔚 ${event.name} 事件结束`, 'special-event-end');
        }
    }

    // 元素风暴事件
    elementalStormEvent() {
        if (!gameState.enemies) return;

        // 每秒对所有敌人造成伤害
        const stormInterval = setInterval(() => {
            if (!gameState.enemies || gameState.enemies.length === 0) {
                clearInterval(stormInterval);
                return;
            }

            gameState.enemies.forEach(enemy => {
                if (enemy && enemy.health) {
                    enemy.health -= 3; // 每秒造成3点伤害
                    if (enemy.health <= 0) {
                        // 移除死亡的敌人并增加击杀数
                        if (gameState.kills !== undefined) {
                            gameState.kills++;
                        }
                    }
                }
            });
        }, 1000);

        // 事件结束后清理
        setTimeout(() => {
            clearInterval(stormInterval);
        }, this.eventTypes.weather_storm.duration);
    }

    // 时间扭曲事件
    timeWarpEvent() {
        if (!gameState.player) return;

        // 减缓敌人速度
        const originalEnemySpeeds = new Map();
        if (gameState.enemies) {
            gameState.enemies.forEach(enemy => {
                if (enemy && enemy.speed) {
                    originalEnemySpeeds.set(enemy, enemy.speed);
                    enemy.speed *= 0.5; // 减慢50%
                }
            });
        }

        // 加快玩家速度
        const originalSpeed = gameState.player.speed;
        gameState.player.speed *= 1.5; // 加快50%

        // 事件结束后恢复
        setTimeout(() => {
            if (gameState.enemies) {
                gameState.enemies.forEach(enemy => {
                    if (originalEnemySpeeds.has(enemy)) {
                        enemy.speed = originalEnemySpeeds.get(enemy);
                    }
                });
            }

            if (gameState.player) {
                gameState.player.speed = originalSpeed;
            }
        }, this.eventTypes.time_warp.duration);
    }

    // 宝物降临事件
    treasureRainEvent() {
        if (!gameState.weapons) return;

        // 每500毫秒生成一把武器
        const weaponRainInterval = setInterval(() => {
            if (!gameState.weapons) {
                clearInterval(weaponRainInterval);
                return;
            }

            // 随机生成一把武器
            const weaponTypes = window.WEAPONS || [
                { name: '随机武器', damage: 10, rarity: 'common', color: '#fff' }
            ];

            const randomWeapon = {...weaponTypes[Math.floor(Math.random() * weaponTypes.length)]};
            randomWeapon.x = Math.random() * 800; // 画布宽度
            randomWeapon.y = 0; // 从顶部下降
            randomWeapon.pickupRadius = 25;
            randomWeapon.dy = 2; // 下降速度

            gameState.weapons.push(randomWeapon);
        }, 500);

        // 事件结束后清理
        setTimeout(() => {
            clearInterval(weaponRainInterval);
        }, this.eventTypes.treasure_rain.duration);
    }

    // 首领来袭事件
    bossWaveEvent() {
        if (!gameState.enemies) return;

        // 生成波次首领敌人
        for (let wave = 0; wave < 3; wave++) {
            setTimeout(() => {
                // 生成一个强大敌人（比当前等级高）
                const levelOffset = Math.max(1, Math.floor(gameState.level * 0.5));
                const bossLevel = gameState.level + levelOffset;

                if (typeof Enemy !== 'undefined') {
                    const bossEnemy = new Enemy(bossLevel);
                    // 标记为Boss类型
                    bossEnemy.isBoss = true;
                    bossEnemy.health *= 3; // 3倍血量
                    bossEnemy.maxHealth = bossEnemy.health;
                    bossEnemy.damage *= 2; // 2倍伤害
                    bossEnemy.color = '#ff0000'; // 红色表示Boss
                    bossEnemy.radius *= 1.5; // 更大

                    gameState.enemies.push(bossEnemy);

                    if (typeof showCombatLog !== 'undefined') {
                        showCombatLog(`👹 Boss出现！强度大幅提升！`, 'enemy-spawn');
                    }
                }
            }, wave * 3000); // 每3秒一个Boss
        }
    }

    // 精英突袭事件
    eliteSurpriseEvent() {
        if (!gameState.enemies) return;

        // 生成多波精英敌人
        for (let wave = 0; wave < 5; wave++) {
            setTimeout(() => {
                for (let i = 0; i < 3; i++) {
                    setTimeout(() => {
                        if (typeof Enemy !== 'undefined') {
                            const eliteEnemy = new Enemy(gameState.level + 3);
                            // 标记为精英类型
                            eliteEnemy.isElite = true;
                            eliteEnemy.health *= 2; // 2倍血量
                            eliteEnemy.maxHealth = eliteEnemy.health;
                            eliteEnemy.damage *= 1.8; // 1.8倍伤害
                            eliteEnemy.color = '#ff00ff'; // 粉色表示精英
                            eliteEnemy.radius *= 1.3; // 稍微大一点

                            gameState.enemies.push(eliteEnemy);
                        }
                    }, i * 500);
                }
            }, wave * 2000); // 每2秒一波
        }
    }

    // 祝福领域事件
    blessingFieldEvent() {
        if (!gameState.player) return;

        // 每秒恢复玩家生命值
        const healingInterval = setInterval(() => {
            if (gameState.player) {
                const healAmount = Math.floor(gameState.player.maxHp * 0.02); // 每秒恢复2%最大生命
                gameState.player.hp = Math.min(gameState.player.hp + healAmount, gameState.player.maxHp);

                if (typeof showCombatLog !== 'undefined') {
                    showCombatLog(`💚 祝福领域：生命恢复 +${healAmount}`, 'level-up');
                }
            }
        }, 1000);

        // 事件结束后清理
        setTimeout(() => {
            clearInterval(healingInterval);
        }, this.eventTypes.blessing_field.duration);
    }

    // 武器融合事件
    weaponFusionEvent() {
        if (!gameState.player || !gameState.player.weapon) return;

        // 临时提升当前武器能力
        const originalDamage = gameState.player.weapon.damage;
        gameState.player.weapon.damage *= 1.8; // 80%伤害提升

        if (typeof showCombatLog !== 'undefined') {
            showCombatLog(`⚔️ 武器融合：当前武器伤害提升80%！`, 'weapon-get');
        }

        // 事件结束后恢复
        setTimeout(() => {
            if (gameState.player && gameState.player.weapon) {
                gameState.player.weapon.damage = originalDamage;
                if (typeof showCombatLog !== 'undefined') {
                    showCombatLog(`⚔️ 武器融合效果结束`, 'weapon-lose');
                }
            }
        }, this.eventTypes.weapon_fusion.duration);
    }

    // 扩展敌人类型
    extendEnemyTypes() {
        // 添加新的敌人类型到游戏系统中
        if (typeof Enemy !== 'undefined') {
            // 扩展现有的敌人类型权重系统
            this.extendedEnemyWeights = {
                'MELEE': 0.35,
                'RANGED': 0.25,
                'ELITE': 0.1,
                'SUPPORT': 0.08,
                'ARCHER': 0.05,
                'MAGE': 0.05,
                'ASSASSIN': 0.04,
                'UNDEAD': 0.03,
                'BEAST': 0.02,
                'SKELETON': 0.02,
                'GOBLIN': 0.02,
                'DRAGON': 0.015,
                'GOLEM': 0.015,
                'SPIDER': 0.015,
                'BERSERKER': 0.01,
                'WIZARD': 0.01,
                'PHANTOM': 0.01,
                'TROLL': 0.008,
                'LICH': 0.005,
                'ANGEL': 0.003,
                'PIRATE': 0.003,
                'NINJA': 0.003,
                'CYBORG': 0.003,
                'ELF': 0.003,
                'DRUID': 0.003,
                'SHADOW': 0.002,
                'BOSS': 0.002,
                'DEMIGOD': 0.001,
                'DEMON': 0.001,
                'PLANET': 0.0005,
                'COSMOS': 0.0001,
                'ELEMENTAL': 0.002,
                // 新增敌人类型
                'GARGOYLE': 0.008,  // 石像鬼
                'BANSHEE': 0.006,   // 女妖
                'MINOTAUR': 0.005,  // 牛头怪
                'GRIFFIN': 0.004,   // 狮鹫
                'CENTAUR': 0.004,   // 半人马
                'BASILISK': 0.003,  // 蛇怪
                'UNICORN': 0.002,   // 独角兽
                'PEGASUS': 0.002,   // 天马
                'CHIMERA': 0.002,   // 奇美拉
                'HYDRA': 0.001      // 九头蛇
            };

            // 为Enemy类添加新类型支持
            const originalConstructor = Enemy.prototype.constructor;
            Enemy.prototype.constructor = function(level, type = null) {
                originalConstructor.call(this, level, type);

                // 添加额外的敌人类型属性
                if (!this.type && type) {
                    this.type = type;
                }

                // 根据类型设置特定属性
                switch(this.type) {
                    case 'GARGOYLE':
                        this.name = '石像鬼';
                        this.health *= 2.5;
                        this.maxHealth = this.health;
                        this.damage *= 1.8;
                        this.color = '#808080';
                        this.radius *= 1.4;
                        break;
                    case 'BANSHEE':
                        this.name = '女妖';
                        this.health *= 1.2;
                        this.maxHealth = this.health;
                        this.damage *= 2.2;
                        this.color = '#FF69B4';
                        this.radius *= 1.1;
                        this.speed *= 1.3; // 更快
                        break;
                    case 'MINOTAUR':
                        this.name = '牛头怪';
                        this.health *= 3.0;
                        this.maxHealth = this.health;
                        this.damage *= 2.0;
                        this.color = '#8B4513';
                        this.radius *= 1.6;
                        break;
                    case 'GRIFFIN':
                        this.name = '狮鹫';
                        this.health *= 1.8;
                        this.maxHealth = this.health;
                        this.damage *= 2.0;
                        this.color = '#DAA520';
                        this.radius *= 1.3;
                        this.speed *= 1.4; // 飞行单位更快
                        break;
                    case 'CENTAUR':
                        this.name = '半人马';
                        this.health *= 2.0;
                        this.maxHealth = this.health;
                        this.damage *= 1.6;
                        this.color = '#A0522D';
                        this.radius *= 1.4;
                        this.speed *= 1.5; // 骑行单位更快
                        break;
                    case 'BASILISK':
                        this.name = '蛇怪';
                        this.health *= 2.2;
                        this.maxHealth = this.health;
                        this.damage *= 2.5;
                        this.color = '#006400';
                        this.radius *= 1.2;
                        // 有毒攻击效果
                        this.isPoisonous = true;
                        break;
                    case 'UNICORN':
                        this.name = '独角兽';
                        this.health *= 1.5;
                        this.maxHealth = this.health;
                        this.damage *= 1.5;
                        this.color = '#FF69B4';
                        this.radius *= 1.2;
                        this.isHoly = true; // 神圣属性
                        break;
                    case 'PEGASUS':
                        this.name = '天马';
                        this.health *= 1.3;
                        this.maxHealth = this.health;
                        this.damage *= 1.8;
                        this.color = '#F0F8FF';
                        this.radius *= 1.1;
                        this.speed *= 1.8; // 极快的飞行单位
                        break;
                    case 'CHIMERA':
                        this.name = '奇美拉';
                        this.health *= 2.8;
                        this.maxHealth = this.health;
                        this.damage *= 2.2;
                        this.color = '#FF4500';
                        this.radius *= 1.5;
                        // 多种攻击方式
                        this.multiAttack = true;
                        break;
                    case 'HYDRA':
                        this.name = '九头蛇';
                        this.health *= 4.0;
                        this.maxHealth = this.health;
                        this.damage *= 2.8;
                        this.color = '#32CD32';
                        this.radius *= 1.8;
                        this.multiHead = true; // 多头攻击
                        break;
                }
            };

            console.log("👽 已扩展敌人类型系统");
        }
    }

    // 增加武器种类
    increaseWeaponVariety() {
        if (window.WEAPONS) {
            // 添加更多武器到现有武器库
            const additionalWeapons = [
                // 奇幻主题武器
                { name: '龙牙匕首', damage: 42, rarity: 'rare', color: '#FF6347', effects: ['fire'], description: '由古代巨龙的牙齿制成' },
                { name: '凤凰涅槃剑', damage: 58, rarity: 'rare', color: '#FF4500', effects: ['fire', 'heal'], description: '能在战斗中恢复持有者的生命' },
                { name: '雷神之锤', damage: 61, rarity: 'epic', color: '#B0C4DE', effects: ['lightning'], description: '能够召唤雷电攻击多个敌人' },
                { name: '海神三叉戟', damage: 65, rarity: 'epic', color: '#00CED1', effects: ['water', 'aoe'], description: '可以激起巨浪攻击周围敌人' },
                { name: '死神镰刀', damage: 70, rarity: 'epic', color: '#000000', effects: ['death', 'soul'], description: '可以吸取敌人的灵魂来强化自身' },

                // 科幻主题武器
                { name: '等离子切割器', damage: 75, rarity: 'epic', color: '#9400D3', effects: ['energy', 'penetrate'], description: '高能等离子，无视部分护甲' },
                { name: '量子纠缠剑', damage: 80, rarity: 'legendary', color: '#4169E1', effects: ['quantum', 'duplicate'], description: '同时存在于多个位置进行攻击' },
                { name: '反物质炮', damage: 95, rarity: 'legendary', color: '#00FFFF', effects: ['annihilate', 'explosion'], description: '接触时引发小规模湮灭反应' },

                // 神话主题武器
                { name: '开天辟地斧', damage: 125, rarity: 'legendary', color: '#FFD700', effects: ['creation', 'destruction'], description: '能够创造或毁灭小规模现实' },
                { name: '永恒之枪', damage: 110, rarity: 'legendary', color: '#DCDCDC', effects: ['pierce', 'seeking'], description: '永远指向敌人要害的神枪' },
                { name: '虚无之刃', damage: 130, rarity: 'mythic', color: '#000000', effects: ['nothingness', 'reality'], description: '能够删除敌人从现实中' },

                // 日常幽默武器
                { name: '键盘战士', damage: 25, rarity: 'uncommon', color: '#000000', effects: ['spam'], description: '快速连击，但容易过热' },
                { name: '鼠标垫飞镖', damage: 18, rarity: 'common', color: '#C0C0C0', effects: ['trip'], description: '准确度取决于鼠标灵敏度设置' },
                { name: '咖啡因注射器', damage: 15, rarity: 'common', color: '#D2B48C', effects: ['speed'], description: '提高攻击速度，但可能引起焦虑' },
                { name: '加班狗哨子', damage: 12, rarity: 'common', color: '#2F4F4F', effects: ['summon'], description: '召唤同事帮忙对付敌人' },
                { name: '星期五下班钟', damage: 35, rarity: 'rare', color: '#FFD700', effects: ['time_stop'], description: '每周五下午特别有效' }
            ];

            window.WEAPONS.push(...additionalWeapons);
            console.log(`⚔️ 已添加 ${additionalWeapons.length} 种新武器`);

            // 重新平衡武器分布，让游戏前期更容易获得武器
            this.balanceWeaponDistribution();
        }
    }

    // 平衡武器分布
    balanceWeaponDistribution() {
        if (window.WEAPONS) {
            // 计算各级别武器数量
            const rarityCounts = {
                'common': 0,
                'uncommon': 0,
                'rare': 0,
                'epic': 0,
                'legendary': 0,
                'mythic': 0
            };

            window.WEAPONS.forEach(weapon => {
                if (rarityCounts.hasOwnProperty(weapon.rarity)) {
                    rarityCounts[weapon.rarity]++;
                }
            });

            console.log("📋 武器稀有度分布:");
            for (const [rarity, count] of Object.entries(rarityCounts)) {
                console.log(`   ${rarity}: ${count} 把`);
            }
        }
    }

    // 检查是否达到里程碑
    checkMilestone(level) {
        this.milestones.forEach(milestone => {
            if (milestone.level === level && typeof milestone.action === 'function') {
                milestone.action();

                if (typeof showCombatLog !== 'undefined') {
                    showCombatLog(`🏆 达成里程碑：${milestone.name} - ${milestone.description}!`, 'level-up');
                }
            }
        });
    }

    // 获取活动事件列表
    getActiveEvents() {
        return this.eventSystem?.activeEvents || [];
    }

    // 获取即将到来的事件
    getUpcomingEvents() {
        return this.eventSystem?.eventQueue || [];
    }
}

// 创建全局实例
window.steamContentExpansion = new SteamContentExpansion();

// 如果游戏状态已存在，挂钩里程碑检查
if (typeof gameState !== 'undefined') {
    // 保存原始的升级函数
    if (typeof upgradeLevel !== 'undefined') {
        const originalUpgradeLevel = window.upgradeLevel;
        window.upgradeLevel = function() {
            originalUpgradeLevel();

            // 检查里程碑
            if (window.steamContentExpansion) {
                window.steamContentExpansion.checkMilestone(gameState.level);
            }
        };
    }
}

// 如果游戏开始，初始化事件系统
if (typeof startGame !== 'undefined') {
    const originalStartGame = window.startGame;
    window.startGame = function() {
        originalStartGame();

        // 确保事件系统在游戏开始后运行
        if (window.steamContentExpansion && window.steamContentExpansion.eventSystem) {
            console.log("🎯 游戏内容扩展系统激活");
        }
    };
}

console.log("Steam版内容扩展模块已加载，准备提供1-2小时的丰富游戏体验");