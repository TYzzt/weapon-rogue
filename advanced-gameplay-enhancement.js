// ==================== 高级游戏玩法增强 ====================
//
// 该模块包含进一步的游戏玩法增强功能，包括：
// 1. 更多的武器类型和稀有度平衡
// 2. 新的敌人类型和行为
// 3. 特殊游戏事件和机制
// 4. 高级游戏平衡性调整

// 检查是否已加载，防止重复加载
if (typeof ADVANCED_GAMEPLAY_ENHANCEMENT_LOADED === 'undefined') {
    window.ADVANCED_GAMEPLAY_ENHANCEMENT_LOADED = true;

    console.log("高级游戏玩法增强模块已加载");

    // 1. 新增武器类型（继续扩展武器库）
    const ADDITIONAL_WEAPONS = [
        // 新增普通武器
        { name: '铁铲', damage: 6, rarity: 'common', color: '#A0522D' },
        { name: '扫帚', damage: 4, rarity: 'common', color: '#8B4513' },
        { name: '晾衣杆', damage: 3, rarity: 'common', color: '#D2B48C' },
        { name: '塑料拖鞋', damage: 2, rarity: 'common', color: '#696969' },
        { name: '橡皮鸭', damage: 1, rarity: 'common', color: '#FFFF00' },
        { name: '键盘', damage: 3, rarity: 'common', color: '#2F4F4F' },
        { name: '鼠标', damage: 2, rarity: 'common', color: '#000000' },
        { name: '显示器', damage: 5, rarity: 'common', color: '#4682B4' },
        { name: 'U盘', damage: 1, rarity: 'common', color: '#FF0000' },
        { name: '充电线', damage: 2, rarity: 'common', color: '#32CD32' },

        // 新增不常见武器
        { name: '园艺剪刀', damage: 12, rarity: 'uncommon', color: '#228B22' },
        { name: '雨伞', damage: 14, rarity: 'uncommon', color: '#800080' },
        { name: '手电筒', damage: 13, rarity: 'uncommon', color: '#FFD700' },
        { name: '工具箱', damage: 15, rarity: 'uncommon', color: '#696969' },
        { name: '消防斧', damage: 18, rarity: 'uncommon', color: '#8B0000' },
        { name: '钓鱼竿', damage: 16, rarity: 'uncommon', color: '#4682B4' },
        { name: '网球拍', damage: 17, rarity: 'uncommon', color: '#EEDFCC' },
        { name: '滑雪杖', damage: 11, rarity: 'uncommon', color: '#F5F5DC' },
        { name: '登山镐', damage: 14, rarity: 'uncommon', color: '#C0C0C0' },
        { name: '扳手', damage: 13, rarity: 'uncommon', color: '#A9A9A9' },

        // 新增稀有武器
        { name: '武士刀', damage: 32, rarity: 'rare', color: '#C0C0C0' },
        { name: '魔法书', damage: 34, rarity: 'rare', color: '#4B0082' },
        { name: '十字弓', damage: 36, rarity: 'rare', color: '#8B4513' },
        { name: '战戟', damage: 38, rarity: 'rare', color: '#2F4F4F' },
        { name: '双节棍', damage: 35, rarity: 'rare', color: '#8B4513' },
        { name: '链锤', damage: 37, rarity: 'rare', color: '#696969' },
        { name: '风铃', damage: 33, rarity: 'rare', color: '#FFD700' },
        { name: '指南针', damage: 31, rarity: 'rare', color: '#FFA500' },
        { name: '望远镜', damage: 34, rarity: 'rare', color: '#2F4F4F' },
        { name: '鲁班锁', damage: 36, rarity: 'rare', color: '#8B4513' },

        // 新增史诗武器
        { name: '青龙偃月刀', damage: 50, rarity: 'epic', color: '#006400', effect: 'bleeding' },
        { name: '方天画戟', damage: 53, rarity: 'epic', color: '#FF0000', effect: 'piercing' },
        { name: '干将莫邪', damage: 55, rarity: 'epic', color: '#3333FF', effect: 'dual_strike' },
        { name: '倚天剑', damage: 58, rarity: 'epic', color: '#8A2BE2', effect: 'critical' },
        { name: '屠龙刀', damage: 62, rarity: 'epic', color: '#2F4F4F', effect: 'armor_break' },
        { name: '伏羲琴', damage: 57, rarity: 'epic', color: '#FFD700', effect: 'stun' },
        { name: '女娲石', damage: 52, rarity: 'epic', color: '#F0E68C', effect: 'healing' },
        { name: '盘古斧', damage: 65, rarity: 'epic', color: '#8B4513', effect: 'area_damage' },
        { name: '夸父杖', damage: 59, rarity: 'epic', color: '#DAA520', effect: 'speed_boost' },
        { name: '祝融剑', damage: 61, rarity: 'epic', color: '#FF4500', effect: 'fire_trail' },

        // 新增传说武器
        { name: '开天斧', damage: 75, rarity: 'legendary', color: '#9370DB', effect: 'reality_break' },
        { name: '造化鼎', damage: 80, rarity: 'legendary', color: '#228B22', effect: 'transformation' },
        { name: '混沌钟', damage: 78, rarity: 'legendary', color: '#000000', effect: 'time_slow' },
        { name: '山河社稷图', damage: 72, rarity: 'legendary', color: '#20B2AA', effect: 'trap_master' },
        { name: '弑神枪', damage: 85, rarity: 'legendary', color: '#8B0000', effect: 'god_slayer' },
        { name: '太极图', damage: 76, rarity: 'legendary', color: '#000000', effect: 'balance_force' },
        { name: '玲珑宝塔', damage: 70, rarity: 'legendary', color: '#FF6347', effect: 'summon_guardian' },
        { name: '玄黄功德池', damage: 74, rarity: 'legendary', color: '#9ACD32', effect: 'purification' },
        { name: '混沌珠', damage: 82, rarity: 'legendary', color: '#4169E1', effect: 'dimension_shift' },
        { name: '天道剑', damage: 88, rarity: 'legendary', color: '#FFFFFF', effect: 'enlightenment' },

        // 新增神话武器
        { name: '创世之笔', damage: 200, rarity: 'mythic', color: '#FF69B4', effect: 'creation' },
        { name: '毁灭之眼', damage: 180, rarity: 'mythic', color: '#4B0082', effect: 'annihilation' },
        { name: '时间之沙', damage: 150, rarity: 'mythic', color: '#DAA520', effect: 'temporal_flux' },
        { name: '维度之核', damage: 220, rarity: 'mythic', color: '#00BFFF', effect: 'realm_shifter' },
        { name: '虚无之瞳', damage: 190, rarity: 'mythic', color: '#000000', effect: 'void_embrace' },
        { name: '因果之线', damage: 170, rarity: 'mythic', color: '#FF00FF', effect: 'destiny_weaver' },
        { name: '规则之书', damage: 210, rarity: 'mythic', color: '#483D8B', effect: 'law_inscriber' },
        { name: '起源之心', damage: 250, rarity: 'mythic', color: '#32CD32', effect: 'origin_pulse' },
        { name: '终焉之钟', damage: 185, rarity: 'mythic', color: '#2F4F4F', effect: 'doomsday' },
        { name: '永生之戒', damage: 160, rarity: 'mythic', color: '#FFD700', effect: 'eternal_flame' }
    ];

    // 2. 新增敌人类型（继续扩展敌人库）
    const ADDITIONAL_ENEMY_TYPES = {
        'SPEEDY_SLIME': {
            name: '疾风史莱姆',
            speed: 2.5,
            hp: 2.0,
            damage: 1.0,
            size: 0.7,
            behavior: 'melee',
            special: 'dash_attack' // 冲撞攻击
        },
        'TANK_SLIME': {
            name: '坦克史莱姆',
            speed: 0.5,
            hp: 12.0,
            damage: 3.0,
            size: 2.0,
            behavior: 'melee',
            special: 'taunt' // 嘲讽玩家
        },
        'POISON_GOO': {
            name: '毒液史莱姆',
            speed: 1.0,
            hp: 4.0,
            damage: 2.0,
            size: 1.2,
            behavior: 'melee',
            special: 'poison_pool' // 留下毒池
        },
        'BOMB_GOBLIN': {
            name: '炸弹哥布林',
            speed: 1.8,
            hp: 3.0,
            damage: 5.0,
            size: 1.0,
            behavior: 'suicide',
            special: 'explode_on_death' // 死亡时爆炸
        },
        'ARCHER_GOBLIN': {
            name: '弓箭哥布林',
            speed: 1.2,
            hp: 2.5,
            damage: 1.5,
            size: 1.0,
            behavior: 'ranged',
            special: 'multishot' // 多重射击
        },
        'WIZARD_GOBLIN': {
            name: '法师哥布林',
            speed: 0.8,
            hp: 2.0,
            damage: 3.0,
            size: 1.0,
            behavior: 'magic_ranged',
            special: 'fireball_barrage' // 火球齐射
        },
        'SKELETON_WARRIOR': {
            name: '骷髅战士',
            speed: 1.0,
            hp: 6.0,
            damage: 3.5,
            size: 1.1,
            behavior: 'melee',
            special: 'shield_block' // 可格挡
        },
        'SKELETON_ARCHER': {
            name: '骷髅弓手',
            speed: 0.9,
            hp: 3.0,
            damage: 2.0,
            size: 1.0,
            behavior: 'ranged',
            special: 'pierce_shot' // 穿透射击
        },
        'SKELETON_MAGE': {
            name: '骷髅法师',
            speed: 0.7,
            hp: 2.5,
            damage: 4.0,
            size: 1.0,
            behavior: 'magic_ranged',
            special: 'curse_debuff' // 施加诅咒
        },
        'ZOMBIE_BULK': {
            name: '僵尸巨汉',
            speed: 0.6,
            hp: 10.0,
            damage: 4.0,
            size: 1.8,
            behavior: 'melee',
            special: 'stomp' // 践踏
        },
        'ZOMBIE_SPEEDY': {
            name: '僵尸敏捷者',
            speed: 2.2,
            hp: 1.5,
            damage: 2.0,
            size: 0.8,
            behavior: 'melee',
            special: 'leap_attack' // 跳跃攻击
        },
        'GHOST_VISITOR': {
            name: '访客幽灵',
            speed: 1.5,
            hp: 1.0,
            damage: 3.0,
            size: 0.9,
            behavior: 'melee',
            special: 'phase_through_wall' // 穿墙
        },
        'GHOST_WAILER': {
            name: '哀嚎幽灵',
            speed: 1.0,
            hp: 2.0,
            damage: 4.0,
            size: 1.0,
            behavior: 'ranged',
            special: 'scream_debuff' // 尖叫减速
        },
        'MUMMY_GUARDIAN': {
            name: '守护木乃伊',
            speed: 0.8,
            hp: 8.0,
            damage: 3.0,
            size: 1.3,
            behavior: 'melee',
            special: 'bandage_heal' // 自愈
        },
        'MUMMY_CURSED': {
            name: '诅咒木乃伊',
            speed: 1.0,
            hp: 4.0,
            damage: 5.0,
            size: 1.1,
            behavior: 'melee',
            special: 'curse_others' // 诅咒其他敌人
        },
        'IMP_MINION': {
            name: '小恶魔',
            speed: 2.0,
            hp: 1.5,
            damage: 2.5,
            size: 0.7,
            behavior: 'melee',
            special: 'flame_touch' // 火焰接触
        },
        'IMP_CASTER': {
            name: '施法小恶魔',
            speed: 1.2,
            hp: 2.0,
            damage: 4.0,
            size: 0.8,
            behavior: 'magic_ranged',
            special: 'summon_imp' // 召唤小恶魔
        },
        'ORC_WARRIOR': {
            name: '兽人战士',
            speed: 1.3,
            hp: 7.0,
            damage: 4.5,
            size: 1.5,
            behavior: 'melee',
            special: 'battle_cry' // 战吼提升
        },
        'ORC_SHAMAN': {
            name: '兽人萨满',
            speed: 0.9,
            hp: 3.5,
            damage: 5.0,
            size: 1.2,
            behavior: 'magic_ranged',
            special: 'heal_ally' // 治疗盟友
        },
        'SPIDER_WEBBER': {
            name: '织网蜘蛛',
            speed: 1.2,
            hp: 3.0,
            damage: 2.0,
            size: 1.0,
            behavior: 'ranged',
            special: 'web_trap' // 设置蛛网陷阱
        },
        'SPIDER_POISONOUS': {
            name: '毒性蜘蛛',
            speed: 1.8,
            hp: 2.5,
            damage: 3.0,
            size: 0.9,
            behavior: 'melee',
            special: 'venom_strike' // 毒性打击
        },
        'SPIDER_MOTHER': {
            name: '蜘蛛母后',
            speed: 1.0,
            hp: 12.0,
            damage: 4.0,
            size: 2.5,
            behavior: 'melee',
            special: 'lay_eggs' // 产卵
        },
        'CYCLOPS_STRONG': {
            name: '独眼巨人',
            speed: 0.9,
            hp: 15.0,
            damage: 6.0,
            size: 2.8,
            behavior: 'melee',
            special: 'throw_rock' // 投掷岩石
        },
        'CYCLOPS_WISE': {
            name: '智者独眼巨人',
            speed: 0.7,
            hp: 8.0,
            damage: 7.0,
            size: 2.2,
            behavior: 'magic_ranged',
            special: 'magic_beam' // 魔法光束
        }
    };

    // 将新增武器合并到原武器库中
    if (typeof WEAPONS !== 'undefined') {
        // 避免重复添加相同名称的武器
        const existingWeaponNames = new Set(WEAPONS.map(w => w.name));
        const newWeapons = ADDITIONAL_WEAPONS.filter(w => !existingWeaponNames.has(w.name));

        WEAPONS.push(...newWeapons);
        console.log(`新增了 ${newWeapons.length} 种高级武器到游戏库中`);
    }

    // 将新增敌人类型合并到原敌人类型中
    if (typeof ENEMY_TYPES !== 'undefined') {
        // 避免重复添加相同类型的敌人
        const newEnemyTypes = {};
        for (const [key, value] of Object.entries(ADDITIONAL_ENEMY_TYPES)) {
            if (!ENEMY_TYPES[key]) {
                newEnemyTypes[key] = value;
            }
        }

        Object.assign(ENEMY_TYPES, newEnemyTypes);
        console.log(`新增了 ${Object.keys(newEnemyTypes).length} 种高级敌人类型到游戏中`);
    }

    // 3. 新增特殊游戏机制
    class AdvancedGameMechanics {
        constructor() {
            this.specialEvents = new Set(); // 活跃的特殊事件
            this.playerStats = { // 玩家统计信息
                weaponSwitches: 0,
                killsWithCurrentWeapon: 0,
                consecutiveKills: 0,
                maxConsecutiveKills: 0,
                damageDealt: 0,
                damageTaken: 0
            };
            this.environmentEffects = []; // 环境效果
            this.weaponAffinity = new Map(); // 武器亲和力系统
        }

        // 武器亲和力系统 - 玩家使用某类武器时间越长，效果越好
        updateWeaponAffinity(weapon) {
            if (!weapon || !weapon.name) return;

            const affinity = this.weaponAffinity.get(weapon.name) || 0;
            const newAffinity = Math.min(affinity + 0.1, 2.0); // 最大2倍效果
            this.weaponAffinity.set(weapon.name, newAffinity);
        }

        // 获取武器亲和力修正值
        getWeaponAffinityModifier(weapon) {
            if (!weapon || !weapon.name) return 1.0;
            return this.weaponAffinity.get(weapon.name) || 1.0;
        }

        // 检查是否激活特殊关卡事件
        checkSpecialLevelEvents(level) {
            // 每10关激活一种特殊事件
            if (level % 10 === 0 && level > 0) {
                const eventTypes = ['lucky_day', 'weapon_festival', 'berserker_moon', 'god_mode'];
                const eventType = eventTypes[(level / 10 - 1) % eventTypes.length];

                if (!this.specialEvents.has(eventType)) {
                    this.activateSpecialEvent(eventType);
                }
            }

            // 在特定关卡激活额外事件
            if (level === 7 && !this.specialEvents.has('elemental_storm')) {
                this.activateSpecialEvent('elemental_storm');
            } else if (level === 14 && !this.specialEvents.has('weapon_evolution')) {
                this.activateSpecialEvent('weapon_evolution');
            } else if (level === 21 && !this.specialEvents.has('relic_blessing')) {
                this.activateSpecialEvent('relic_blessing');
            }
        }

        // 激活特殊事件
        activateSpecialEvent(eventType) {
            this.specialEvents.add(eventType);

            switch (eventType) {
                case 'elemental_storm':
                    showCombatLog("🌀 元素风暴事件！武器元素效果增强！", "event-start");
                    gameState.elementalStorm = true;
                    setTimeout(() => {
                        gameState.elementalStorm = false;
                        this.specialEvents.delete('elemental_storm');
                        showCombatLog("🌀 元素风暴事件结束", "event-end");
                    }, 300000); // 5分钟
                    break;

                case 'weapon_evolution':
                    showCombatLog("🧪 武器进化事件！所有武器威力增强！", "event-start");
                    gameState.weaponEvolution = true;
                    setTimeout(() => {
                        gameState.weaponEvolution = false;
                        this.specialEvents.delete('weapon_evolution');
                        showCombatLog("🧪 武器进化事件结束", "event-end");
                    }, 240000); // 4分钟
                    break;

                case 'relic_blessing':
                    showCombatLog("⛪ 遗物祝福事件！遗物效果提升！", "event-start");
                    gameState.relicBlessing = true;
                    setTimeout(() => {
                        gameState.relicBlessing = false;
                        this.specialEvents.delete('relic_blessing');
                        showCombatLog("⛪ 遗物祝福事件结束", "event-end");
                    }, 360000); // 6分钟
                    break;
            }
        }

        // 更新玩家统计
        updatePlayerStats(action, value) {
            switch (action) {
                case 'weapon_switch':
                    this.playerStats.weaponSwitches++;
                    this.playerStats.killsWithCurrentWeapon = 0; // 重置当前武器击杀数
                    break;
                case 'kill_with_weapon':
                    this.playerStats.killsWithCurrentWeapon++;
                    this.playerStats.consecutiveKills++;
                    this.playerStats.maxConsecutiveKills = Math.max(
                        this.playerStats.maxConsecutiveKills,
                        this.playerStats.consecutiveKills
                    );
                    break;
                case 'reset_combo':
                    this.playerStats.consecutiveKills = 0;
                    break;
                case 'damage_dealt':
                    this.playerStats.damageDealt += value;
                    break;
                case 'damage_taken':
                    this.playerStats.damageTaken += value;
                    this.playerStats.consecutiveKills = 0; // 受伤重置连击
                    break;
            }
        }

        // 检查统计相关成就
        checkStatsAchievements() {
            // 检查使用当前武器击杀数相关成就
            if (this.playerStats.killsWithCurrentWeapon >= 10) {
                showCombatLog("⚔️ 当前武器击杀数达到10！", "achievement-unlock");
            }

            if (this.playerStats.maxConsecutiveKills >= 25) {
                showCombatLog("🔥 最大连击数达到25！", "achievement-unlock");
            }
        }

        // 清理统计数据（新游戏时）
        resetStats() {
            this.playerStats = {
                weaponSwitches: 0,
                killsWithCurrentWeapon: 0,
                consecutiveKills: 0,
                maxConsecutiveKills: 0,
                damageDealt: 0,
                damageTaken: 0
            };
            this.weaponAffinity.clear();
        }
    }

    // 创建全局高级游戏机制实例
    window.advancedGameMechanics = new AdvancedGameMechanics();

    // 4. 改进的敌人生成算法
    function getAdvancedEnemySpawnRate(level) {
        // 基础生成率，随关卡变化的更平滑曲线
        let baseRate = 2000; // 初始2秒一个敌人

        // 使用对数函数创建更平滑的增长曲线
        const logFactor = Math.log(level + 1) * 200;
        const linearFactor = level * 15;
        const adjustment = Math.min(logFactor + linearFactor, 1500); // 限制最大调整幅度

        baseRate = Math.max(400, baseRate - adjustment); // 最快0.4秒一个敌人，避免过快

        // 根据玩家状态调整
        if (gameState.player && gameState.player.hp < gameState.player.maxHp * 0.25) {
            // 玩家生命值很低时，稍微降低敌人生成率
            baseRate += 400;
        } else if (gameState.player && gameState.player.hp > gameState.player.maxHp * 0.75) {
            // 玩家状态良好时，稍微增加敌人生成率
            baseRate = Math.max(300, baseRate - 100);
        }

        return baseRate;
    }

    // 5. 更好的敌人多样性算法
    function getAdvancedEnemyType(level) {
        const weights = getAdjustedEnemyWeights(level);
        const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
        let random = Math.random() * totalWeight;

        for (const [type, weight] of Object.entries(weights)) {
            random -= weight;
            if (random <= 0) {
                // 如果指定的敌人类型不存在，返回默认类型
                if (!ENEMY_TYPES[type]) {
                    // 随机选择一个存在的敌人类型
                    const existingTypes = Object.keys(ENEMY_TYPES);
                    return existingTypes[Math.floor(Math.random() * existingTypes.length)];
                }
                return type;
            }
        }

        // 默认返回一个存在的敌人类型
        const existingTypes = Object.keys(ENEMY_TYPES);
        return existingTypes[0] || 'MELEE';
    }

    // 6. 武器效果处理增强
    function applyWeaponEffect(weapon, target, player) {
        if (!weapon || !weapon.effect) {
            // 普通攻击
            const damage = weapon.damage || 0;
            const affinityMod = window.advancedGameMechanics ?
                window.advancedGameMechanics.getWeaponAffinityModifier(weapon) : 1.0;
            const effectiveDamage = Math.floor(damage * affinityMod);

            // 应用当前关卡的武器进化效果
            const evolutionMod = gameState.weaponEvolution ? 1.2 : 1.0;
            const finalDamage = Math.floor(effectiveDamage * evolutionMod);

            return finalDamage;
        }

        // 根据武器效果进行特殊处理
        let damage = weapon.damage || 0;
        const affinityMod = window.advancedGameMechanics ?
            window.advancedGameMechanics.getWeaponAffinityModifier(weapon) : 1.0;
        let effectiveDamage = Math.floor(damage * affinityMod);

        switch (weapon.effect) {
            case 'poison':
                // 毒性效果，持续伤害
                target.poisoned = true;
                target.poisonDuration = 180; // 3秒
                showCombatLog(`☠️ ${target.name} 中毒了！`, "special-effect");
                break;
            case 'fire':
                // 火焰效果，可能点燃敌人
                if (Math.random() < 0.3) { // 30%几率点燃
                    target.onFire = true;
                    target.fireDuration = 120; // 2秒
                    showCombatLog(`🔥 ${target.name} 被点燃了！`, "special-effect");
                }
                break;
            case 'freeze':
                // 冰冻效果，减缓敌人速度
                target.frozen = true;
                target.freezeDuration = 90; // 1.5秒
                showCombatLog(`❄️ ${target.name} 被冰冻了！`, "special-effect");
                break;
            case 'lightning':
                // 闪电效果，可能连锁攻击
                if (Math.random() < 0.4) { // 40%几率连锁
                    // 连锁到附近另一个敌人
                    effectiveDamage = Math.floor(effectiveDamage * 1.5); // 1.5倍伤害
                    showCombatLog(`⚡ ${target.name} 被连锁闪电击中！`, "special-effect");
                }
                break;
            case 'life_steal':
                // 吸血效果，恢复生命值
                const healAmount = Math.floor(effectiveDamage * 0.2); // 吸收20%伤害作为治疗
                player.hp = Math.min(player.maxHp, player.hp + healAmount);
                showCombatLog(`💉 吸血 ${healAmount} 点生命值！`, "special-effect");
                break;
            case 'bleeding':
                // 流血效果，持续伤害
                target.bleeding = true;
                target.bleedDuration = 240; // 4秒
                showCombatLog(`🩸 ${target.name} 开始流血！`, "special-effect");
                break;
            case 'piercing':
                // 穿透效果，无视部分防御
                effectiveDamage = Math.floor(effectiveDamage * 1.3); // 1.3倍伤害
                break;
            case 'dual_strike':
                // 双击效果，额外攻击
                effectiveDamage = Math.floor(effectiveDamage * 1.8); // 1.8倍伤害
                break;
            case 'critical':
                // 暴击效果，偶尔造成极高伤害
                if (Math.random() < 0.15) { // 15%暴击率
                    effectiveDamage = Math.floor(effectiveDamage * 2.5); // 2.5倍暴击伤害
                    showCombatLog(`💥 暴击！`, "special-effect");
                }
                break;
        }

        // 应用当前关卡的武器进化效果
        const evolutionMod = gameState.weaponEvolution ? 1.2 : 1.0;
        return Math.floor(effectiveDamage * evolutionMod);
    }

    // 7. 替换或增强现有函数
    if (typeof getEnemySpawnRate !== 'undefined') {
        window.originalGetEnemySpawnRate = getEnemySpawnRate;
        window.getEnemySpawnRate = getAdvancedEnemySpawnRate;
    } else {
        window.getEnemySpawnRate = getAdvancedEnemySpawnRate;
    }

    if (typeof getEnemyType !== 'undefined') {
        window.originalGetEnemyType = getEnemyType;
        window.getEnemyType = getAdvancedEnemyType;
    } else {
        window.getEnemyType = getAdvancedEnemyType;
    }

    if (typeof applyWeaponEffect !== 'undefined') {
        window.originalApplyWeaponEffect = applyWeaponEffect;
        window.applyWeaponEffect = applyWeaponEffect;
    } else {
        window.applyWeaponEffect = applyWeaponEffect;
    }

    // 8. 添加高级升级系统
    class AdvancedUpgradeSystem {
        constructor() {
            this.upgrades = {
                weapon_affinity: { level: 0, cost: 10, effect: 0.1 },
                health_bonus: { level: 0, cost: 15, effect: 10 },
                movement_speed: { level: 0, cost: 20, effect: 0.2 },
                enemy_spawn_delay: { level: 0, cost: 25, effect: 100 } // 延迟毫秒
            };
        }

        // 获取升级选项（基于当前关卡）
        getUpgradeOptions(level) {
            const availableUpgrades = [];

            // 根据关卡解锁不同升级
            if (level >= 5) {
                availableUpgrades.push({
                    id: 'weapon_affinity',
                    name: '武器亲和力',
                    description: '增加当前武器伤害',
                    cost: this.upgrades.weapon_affinity.cost + this.upgrades.weapon_affinity.level * 5,
                    effect: `+${(this.upgrades.weapon_affinity.effect * 100).toFixed(0)}% 武器伤害`
                });
            }

            if (level >= 8) {
                availableUpgrades.push({
                    id: 'health_bonus',
                    name: '生命上限',
                    description: '增加最大生命值',
                    cost: this.upgrades.health_bonus.cost + this.upgrades.health_bonus.level * 5,
                    effect: `+${this.upgrades.health_bonus.effect} 最大生命值`
                });
            }

            if (level >= 12) {
                availableUpgrades.push({
                    id: 'movement_speed',
                    name: '移动速度',
                    description: '增加移动速度',
                    cost: this.upgrades.movement_speed.cost + this.upgrades.movement_speed.level * 5,
                    effect: `+${this.upgrades.movement_speed.effect.toFixed(1)} 移动速度`
                });
            }

            return availableUpgrades;
        }

        // 应用升级
        applyUpgrade(upgradeId, player) {
            const upgrade = this.upgrades[upgradeId];
            if (!upgrade) return false;

            switch (upgradeId) {
                case 'weapon_affinity':
                    upgrade.level++;
                    showCombatLog("⚔️ 武器亲和力提升！", "upgrade");
                    break;
                case 'health_bonus':
                    upgrade.level++;
                    player.maxHp += upgrade.effect;
                    player.hp += upgrade.effect; // 恢复增加的生命值
                    showCombatLog(`❤️ 最大生命值提升！(${player.maxHp})`, "upgrade");
                    break;
                case 'movement_speed':
                    upgrade.level++;
                    player.speed += upgrade.effect;
                    showCombatLog("🏃 移动速度提升！", "upgrade");
                    break;
            }

            return true;
        }
    }

    // 创建全局升级系统实例
    window.advancedUpgradeSystem = new AdvancedUpgradeSystem();

    // 9. 保存/加载扩展数据的函数
    function saveAdvancedGameplayData() {
        const advancedData = {
            specialEvents: Array.from(window.advancedGameMechanics.specialEvents),
            playerStats: window.advancedGameMechanics.playerStats,
            weaponAffinity: Object.fromEntries(window.advancedGameMechanics.weaponAffinity),
            upgrades: window.advancedUpgradeSystem.upgrades
        };

        return advancedData;
    }

    function loadAdvancedGameplayData(savedData) {
        if (!savedData) return;

        if (savedData.specialEvents) {
            window.advancedGameMechanics.specialEvents = new Set(savedData.specialEvents);
        }

        if (savedData.playerStats) {
            window.advancedGameMechanics.playerStats = savedData.playerStats;
        }

        if (savedData.weaponAffinity) {
            window.advancedGameMechanics.weaponAffinity = new Map(
                Object.entries(savedData.weaponAffinity)
            );
        }

        if (savedData.upgrades) {
            window.advancedUpgradeSystem.upgrades = savedData.upgrades;
        }
    }

    // 添加到全局函数
    window.saveAdvancedGameplayData = saveAdvancedGameplayData;
    window.loadAdvancedGameplayData = loadAdvancedGameplayData;

    console.log("高级游戏玩法增强模块已完全加载");
} else {
    console.log("高级游戏玩法增强模块已存在，跳过重复加载");
}