// ==================== Steam版游戏增强系统 ====================
//
// 该系统包含：
// 1. 更丰富的敌人AI行为
// 2. 更多特殊事件
// 3. 更好的视觉特效
// 4. 更深入的游戏机制

// 扩展敌人AI行为
const ENHANCED_AI_BEHAVIORS = {
    // 机械系AI
    mechanical: {
        name: '机械智能',
        description: '精确计算的攻击和移动',
        movementPattern: 'precise',
        attackStrategy: 'calculated',
        weakness: 'electricity',
        resistance: 'poison'
    },
    // 神话系AI
    divine: {
        name: '神圣智慧',
        description: '使用神圣力量进行战斗',
        movementPattern: 'graceful',
        attackStrategy: 'blessed',
        weakness: 'darkness',
        resistance: 'light'
    },
    // 混合型AI
    hybrid: {
        name: '混合智能',
        description: '结合生物与机械特征',
        movementPattern: 'adaptive',
        attackStrategy: 'combined',
        weakness: 'disruption',
        resistance: 'adaptation'
    },
    // 飞行AI
    flying: {
        name: '飞行优势',
        description: '从空中发起攻击',
        movementPattern: 'aerial',
        attackStrategy: 'aerial_strike',
        weakness: 'ground_attacks',
        resistance: 'melee_defense'
    },
    // 凝视攻击AI
    gaze: {
        name: '凝视攻击',
        description: '使用凝视造成效果',
        movementPattern: 'stationary',
        attackStrategy: 'gaze_attack',
        weakness: 'blindness',
        resistance: 'eye_protection'
    },
    // 触手AI
    tentacles: {
        name: '多触手攻击',
        description: '使用多触手进行全方位攻击',
        movementPattern: 'flexible',
        attackStrategy: 'multi_tentacle',
        weakness: 'cutting',
        resistance: 'distributed_damage'
    }
};

// 新增特殊关卡事件
const SPECIAL_EVENTS = [
    {
        id: 'elemental_storm',
        name: '元素风暴',
        trigger: (level) => level % 10 === 0 && level > 5,
        effect: function() {
            gameState.currentElementalStorm = {
                type: ['fire', 'ice', 'lightning', 'earth'][Math.floor(Math.random() * 4)],
                duration: 30000, // 30秒
                multiplier: 1.5
            };
            showCombatLog('🌀 元素风暴即将来临！', 'special-event');
        },
        description: '元素风暴增强特定元素伤害'
    },
    {
        id: 'weapon_blessing',
        name: '武器祝福',
        trigger: (level) => level % 15 === 0 && level > 10,
        effect: function() {
            gameState.currentWeaponBlessing = {
                duration: 60000, // 60秒
                damageBoost: 1.3,
                specialEffect: true
            };
            showCombatLog('✨ 武器祝福！攻击力提升30%', 'special-event');
        },
        description: '临时提升武器威力'
    },
    {
        id: 'time_warp',
        name: '时间扭曲',
        trigger: (level) => level % 20 === 0 && level > 15,
        effect: function() {
            gameState.currentTimeWarp = {
                duration: 45000, // 45秒
                slowEnemies: true,
                boostPlayer: true
            };
            showCombatLog('⏰ 时间扭曲！敌人变慢，你变快！', 'special-event');
        },
        description: '改变时间流速'
    },
    {
        id: 'treasure_horde',
        name: '宝藏洪流',
        trigger: (level) => level % 25 === 0 && level > 20,
        effect: function() {
            // 在本关生成额外的宝箱和稀有掉落
            gameState.extraTreasureSpawn = true;
            showCombatLog('💰 宝藏洪流！掉落翻倍！', 'special-event');
        },
        description: '增加稀有掉落率'
    }
];

// 新增玩家能力
const PLAYER_ABILITIES = {
    // 终极技能
    ULTIMATE_BARRIER: {
        name: '终极屏障',
        description: '短时间内无敌并反弹伤害',
        cooldown: 120000, // 2分钟
        duration: 5000, // 5秒
        effect: function() {
            gameState.player.barrierActive = true;
            gameState.player.barrierEndTime = Date.now() + 5000;
            showCombatLog('🛡️ 终极屏障激活！', 'ability-used');
        }
    },
    // 生命汲取
    LIFE_DRAIN: {
        name: '生命汲取',
        description: '吸收敌人生命力',
        cooldown: 90000, // 1.5分钟
        duration: 10000, // 10秒
        effect: function() {
            gameState.player.lifeDrainActive = true;
            gameState.player.lifeDrainEndTime = Date.now() + 10000;
            showCombatLog('💉 生命汲取激活！', 'ability-used');
        }
    },
    // 元素掌控
    ELEMENT_MASTERY: {
        name: '元素掌控',
        description: '元素伤害翻倍，持续一定时间',
        cooldown: 150000, // 2.5分钟
        duration: 15000, // 15秒
        effect: function() {
            gameState.player.elementMasteryActive = true;
            gameState.player.elementMasteryEndTime = Date.now() + 15000;
            showCombatLog('🔥❄️⚡ 元素掌控激活！', 'ability-used');
        }
    }
};

// 扩展粒子系统效果
const PARTICLE_EFFECTS = {
    TIME_REVERSE: {
        name: '时间逆转',
        color: '#7B68EE',
        size: 3,
        life: 800,
        speed: 0.5,
        variation: 0.3,
        effect: 'reverse_motion'
    },
    CHAIN_LIGHTNING: {
        name: '连锁闪电',
        color: '#B0C4DE',
        size: 2,
        life: 400,
        speed: 3,
        variation: 0.5,
        effect: 'electrical_arc'
    },
    TIDAL_WAVE: {
        name: '潮汐冲击',
        color: '#20B2AA',
        size: 4,
        life: 1000,
        speed: 1.5,
        variation: 0.2,
        effect: 'wave_propagation'
    },
    FREEZE: {
        name: '冰冻',
        color: '#B0E0E6',
        size: 2,
        life: 1200,
        speed: 0.2,
        variation: 0.1,
        effect: 'freezing_crystal'
    },
    BURN: {
        name: '燃烧',
        color: '#FF4500',
        size: 3,
        life: 600,
        speed: 1,
        variation: 0.4,
        effect: 'flame_spread'
    },
    POISON_CLOUD: {
        name: '毒云',
        color: '#32CD32',
        size: 2.5,
        life: 1500,
        speed: 0.3,
        variation: 0.2,
        effect: 'poison_spread'
    }
};

// 增强武器效果处理
function enhanceWeaponEffects(weapon, target) {
    if (!weapon.effect) return false;

    switch(weapon.effect) {
        case 'time_reverse':
            if (Math.random() < 0.15) { // 15% 概率触发
                target.x -= target.dx * 20; // 回退2秒的位置
                target.y -= target.dy * 20;
                createParticleEffect(target.x, target.y, PARTICLE_EFFECTS.TIME_REVERSE);
                showCombatLog(`⏱️ ${weapon.name} 触发时间逆转！`, 'weapon-effect');
                return true;
            }
            break;

        case 'chain_lightning':
            if (Math.random() < 0.2) { // 20% 概率触发
                // 找到附近的敌人并造成连锁伤害
                const nearbyEnemies = gameState.enemies.filter(e =>
                    getDistance(target, e) < 80 && e !== target
                );

                for (let i = 0; i < Math.min(3, nearbyEnemies.length); i++) {
                    const e = nearbyEnemies[i];
                    e.hp -= weapon.damage * 0.5; // 50% 伤害

                    // 创建闪电粒子效果
                    createLightningEffect(target.x, target.y, e.x, e.y);
                    createParticleEffect(e.x, e.y, PARTICLE_EFFECTS.CHAIN_LIGHTNING);

                    if (e.hp <= 0) {
                        handleEnemyDeath(e);
                    }
                }
                showCombatLog(`⚡ ${weapon.name} 触发连锁闪电！`, 'weapon-effect');
                return true;
            }
            break;

        case 'tidal_wave':
            // 在目标周围产生冲击波
            createWaveEffect(target.x, target.y, 100);
            gameState.enemies.forEach(enemy => {
                if (getDistance(target, enemy) < 100) {
                    enemy.x += (enemy.x - target.x) * 0.3;
                    enemy.y += (enemy.y - target.y) * 0.3;
                    enemy.hp -= weapon.damage * 0.3;
                    createParticleEffect(enemy.x, enemy.y, PARTICLE_EFFECTS.TIDAL_WAVE);

                    if (enemy.hp <= 0) {
                        handleEnemyDeath(enemy);
                    }
                }
            });
            showCombatLog(`🌊 ${weapon.name} 产生潮汐冲击！`, 'weapon-effect');
            return true;

        case 'freeze':
            if (Math.random() < 0.18) { // 18% 概率冻结
                target.frozen = Date.now() + 3000; // 冻结3秒
                createParticleEffect(target.x, target.y, PARTICLE_EFFECTS.FREEZE);
                showCombatLog(`❄️ ${weapon.name} 冻结了敌人！`, 'weapon-effect');
                return true;
            }
            break;

        case 'burn':
            if (Math.random() < 0.25) { // 25% 概率点燃
                target.burning = Date.now() + 5000; // 燃烧5秒
                target.burnDamage = weapon.damage * 0.1; // 每秒造成10%武器伤害
                createParticleEffect(target.x, target.y, PARTICLE_EFFECTS.BURN);
                showCombatLog(`🔥 ${weapon.name} 点燃了敌人！`, 'weapon-effect');
                return true;
            }
            break;

        case 'poison':
            if (Math.random() < 0.22) { // 22% 概率中毒
                target.poisoned = Date.now() + 6000; // 中毒6秒
                target.poisonDamage = weapon.damage * 0.08; // 每秒造成8%武器伤害
                createPoisonCloud(target.x, target.y);
                showCombatLog(`☠️ ${weapon.name} 毒害了敌人！`, 'weapon-effect');
                return true;
            }
            break;
    }

    return false;
}

// 创建闪电效果
function createLightningEffect(x1, y1, x2, y2) {
    // 在两点之间创建闪电效果
    const segments = 5;
    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const x = x1 + (x2 - x1) * t;
        const y = y1 + (y2 - y1) * t;

        // 添加一些随机偏移来模拟闪电的形状
        const offsetX = (Math.random() - 0.5) * 15;
        const offsetY = (Math.random() - 0.5) * 15;

        createParticleEffect(x + offsetX, y + offsetY, PARTICLE_EFFECTS.CHAIN_LIGHTNING);
    }
}

// 创建波浪效果
function createWaveEffect(centerX, centerY, radius) {
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        createParticleEffect(x, y, PARTICLE_EFFECTS.TIDAL_WAVE);
    }
}

// 创建毒云
function createPoisonCloud(x, y) {
    for (let i = 0; i < 8; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 30;
        const px = x + Math.cos(angle) * distance;
        const py = y + Math.sin(angle) * distance;
        createParticleEffect(px, py, PARTICLE_EFFECTS.POISON_CLOUD);
    }
}

// 处理燃烧效果
function processBurnEffects() {
    gameState.enemies.forEach(enemy => {
        if (enemy.burning && Date.now() < enemy.burning) {
            enemy.hp -= enemy.burnDamage;
            if (enemy.hp <= 0) {
                handleEnemyDeath(enemy);
            }
        } else if (enemy.burning && Date.now() >= enemy.burning) {
            enemy.burning = null;
        }
    });
}

// 处理中毒效果
function processPoisonEffects() {
    gameState.enemies.forEach(enemy => {
        if (enemy.poisoned && Date.now() < enemy.poisoned) {
            enemy.hp -= enemy.poisonDamage;
            if (enemy.hp <= 0) {
                handleEnemyDeath(enemy);
            }
        } else if (enemy.poisoned && Date.now() >= enemy.poisoned) {
            enemy.poisoned = null;
        }
    });
}

// 处理冻结效果
function processFreezeEffects() {
    gameState.enemies.forEach(enemy => {
        if (enemy.frozen && Date.now() < enemy.frozen) {
            // 冻结期间敌人不能移动或攻击
            enemy.dx = 0;
            enemy.dy = 0;
        } else if (enemy.frozen && Date.now() >= enemy.frozen) {
            enemy.frozen = null;
        }
    });
}

// 增强的敌人生成器，考虑特殊事件
function enhancedSpawnEnemy() {
    // 原始敌人生成逻辑
    const baseSpawnInterval = 2000; // 基础生成间隔

    // 如果有时间扭曲事件，调整生成速度
    if (gameState.currentTimeWarp && Date.now() < gameState.currentTimeWarp.endTime) {
        // 敌人生速减慢
        setTimeout(enhancedSpawnEnemy, baseSpawnInterval * 1.5);
    } else {
        // 标准生成间隔
        setTimeout(enhancedSpawnEnemy, baseSpawnInterval);
    }

    // 根据关卡和特殊事件决定生成的敌人类型
    let enemyType;
    const level = gameState.level;
    const rand = Math.random();

    // 根据关卡和事件调整敌人类型概率
    if (gameState.currentElementalStorm) {
        // 元素风暴期间更可能生成对应元素的敌人
        if (gameState.currentElementalStorm.type === 'fire' && rand < 0.3) {
            enemyType = 'DRAGON'; // 或其他火元素敌人
        } else if (gameState.currentElementalStorm.type === 'ice' && rand < 0.3) {
            enemyType = 'GOLEM'; // 或其他冰元素敌人
        }
    }

    // 创建敌人
    const newEnemy = new Enemy(level, enemyType);
    gameState.enemies.push(newEnemy);

    // 检查是否触发特殊事件
    SPECIAL_EVENTS.forEach(event => {
        if (event.trigger(level) && Math.random() < 0.3) { // 30% 概率触发
            event.effect();
        }
    });
}

// 扩展游戏状态更新函数
function extendedGameUpdate() {
    // 处理各种状态效果
    processBurnEffects();
    processPoisonEffects();
    processFreezeEffects();

    // 检查特殊事件持续时间
    if (gameState.currentElementalStorm &&
        Date.now() > gameState.currentElementalStorm.startTime + gameState.currentElementalStorm.duration) {
        delete gameState.currentElementalStorm;
        showCombatLog('🌀 元素风暴结束', 'special-event-end');
    }

    if (gameState.currentWeaponBlessing &&
        Date.now() > gameState.currentWeaponBlessing.startTime + gameState.currentWeaponBlessing.duration) {
        delete gameState.currentWeaponBlessing;
        showCombatLog('✨ 武器祝福结束', 'special-event-end');
    }

    if (gameState.currentTimeWarp &&
        Date.now() > gameState.currentTimeWarp.startTime + gameState.currentTimeWarp.duration) {
        delete gameState.currentTimeWarp;
        showCombatLog('⏰ 时间扭曲结束', 'special-event-end');
    }

    // 处理玩家能力持续时间
    if (gameState.player.barrierActive &&
        Date.now() > gameState.player.barrierEndTime) {
        gameState.player.barrierActive = false;
        showCombatLog('🛡️ 终极屏障失效', 'ability-end');
    }

    if (gameState.player.lifeDrainActive &&
        Date.now() > gameState.player.lifeDrainEndTime) {
        gameState.player.lifeDrainActive = false;
        showCombatLog('💉 生命汲取结束', 'ability-end');
    }

    if (gameState.player.elementMasteryActive &&
        Date.now() > gameState.player.elementMasteryEndTime) {
        gameState.player.elementMasteryActive = false;
        showCombatLog('🔥❄️⚡ 元素掌控结束', 'ability-end');
    }
}

console.log('Steam版游戏增强系统已加载');
console.log('✓ 新增特殊敌人AI行为');
console.log('✓ 新增特殊关卡事件');
console.log('✓ 新增玩家能力系统');
console.log('✓ 扩展武器特效系统');

// 导出增强函数供游戏系统调用
window.enhancedSpawnEnemy = enhancedSpawnEnemy;
window.extendedGameUpdate = extendedGameUpdate;
window.enhanceWeaponEffects = enhanceWeaponEffects;