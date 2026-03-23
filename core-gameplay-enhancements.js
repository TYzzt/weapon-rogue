// ==================== 核心玩法增强系统 ====================
//
// 本文件包含以下增强功能：
// 1. 改进的武器平衡性系统
// 2. 增强的敌人AI行为
// 3. 武器元素效果系统
// 4. 改进的难度曲线

class CoreGameplayEnhancements {
    constructor() {
        // 武器元素效果映射
        this.weaponElements = {
            '火焰之刃': { type: 'fire', damage: 5, duration: 3000 },      // 火：燃烧效果
            '冰霜之刺': { type: 'ice', damage: 3, duration: 2000 },       // 冰：减速效果
            '雷鸣法杖': { type: 'lightning', damage: 7, duration: 1500 }, // 雷：连锁伤害
            '毒蛇匕首': { type: 'poison', damage: 4, duration: 4000 },    // 毒：持续伤害
            '暗影之爪': { type: 'shadow', damage: 6, duration: 2500 },    // 暗影：无视部分防御
            '神圣十字弓': { type: 'holy', damage: 8, duration: 1800 },    // 神圣：额外伤害
            '龙鳞剑': { type: 'dragon', damage: 9, duration: 3500 },      // 龙：真实伤害
            '星辰法杖': { type: 'star', damage: 10, duration: 3000 },     // 星辰：范围伤害
            '风暴战锤': { type: 'storm', damage: 8, duration: 2000 },     // 风暴：击退效果
            '血月镰刀': { type: 'blood', damage: 12, duration: 5000 },    // 血：吸血效果
            '星尘法杖': { type: 'stardust', damage: 15, duration: 4000 }, // 星尘：多段伤害
            '凤凰之羽扇': { type: 'phoenix', damage: 20, duration: 6000 }, // 凤凰：重生效果
            '雷电鞭': { type: 'thunder', damage: 18, duration: 2500 },    // 雷电：麻痹效果
            '暗夜匕首': { type: 'darknight', damage: 22, duration: 3000 }, // 暗夜：暴击效果
            '圣洁之锤': { type: 'holylight', damage: 16, duration: 2500 }, // 圣光：净化效果
            '月光短剑': { type: 'moonlight', damage: 14, duration: 2000 }, // 月光：回复效果
            '虚空之刃': { type: 'void', damage: 25, duration: 4000 },     // 虚空：吸收伤害
            '混沌之刃': { type: 'chaos', damage: 30, duration: 5000 },    // 混沌：随机效果
            '创世之斧': { type: 'creation', damage: 28, duration: 4500 },  // 创世：创造护盾
            '龙息巨剑': { type: 'dragonbreath', damage: 20, duration: 3000 }, // 龙息：范围燃烧
            '神之刃': { type: 'divine', damage: 50, duration: 8000 },     // 神：真实全屏伤害
            '开发者之剑': { type: 'dev', damage: 100, duration: 10000 },   // 开发者：无敌效果
        };

        // 敌人AI行为增强配置
        this.enemyBehaviorEnhancements = {
            'MELEE': {
                behavior: 'aggressive',
                attackPattern: 'melee',
                specialAbility: 'charge',
                chance: 0.3
            },
            'RANGED': {
                behavior: 'strategic',
                attackPattern: 'projectile',
                specialAbility: 'snipe',
                chance: 0.25
            },
            'ELITE': {
                behavior: 'adaptive',
                attackPattern: 'hybrid',
                specialAbility: 'buffSelf',
                chance: 0.4
            },
            'BOSS': {
                behavior: 'dynamic',
                attackPattern: 'variable',
                specialAbility: 'summonMinions',
                chance: 1.0
            }
        };

        // 伤害计算增强
        this.damageCalculation = this.calculateEnhancedDamage.bind(this);

        // 应用增强
        this.applyWeaponSystemEnhancements();
        this.applyEnemyAIEnhancements();
        this.applyDifficultyCurveImprovements();
    }

    // 改进的武器系统
    applyWeaponSystemEnhancements() {
        // 扩展原版武器库，增加更多稀有度平衡的武器
        this.extendWeaponsDatabase();

        // 添加元素效果系统
        this.addElementalEffectsSystem();

        console.log("✅ 武器系统增强已应用");
    }

    // 扩展武器数据库
    extendWeaponsDatabase() {
        // 获取原版WEAPONS数组（假定在全局范围内）
        if (typeof WEAPONS !== 'undefined') {
            // 添加更多平衡的武器类型，填补各个稀有度间的差距

            // 扩展普通武器库
            const additionalCommonWeapons = [
                { name: '生锈的餐刀', damage: 4, rarity: 'common', color: '#808080', description: '日常餐具也能当武器用' },
                { name: '木制棒球棍', damage: 6, rarity: 'common', color: '#8B4513', description: '运动器材，打击力不错' },
                { name: '破损的雨伞', damage: 5, rarity: 'common', color: '#800000', description: '可以格挡，也能戳人' },
                { name: '橡皮鸭子', damage: 1, rarity: 'common', color: '#FFFF00', description: '这真的能当武器？' },
                { name: '晾衣杆', damage: 3, rarity: 'common', color: '#C0C0C0', description: '又长又直，还挺结实' },
                { name: '擀面杖', damage: 5, rarity: 'common', color: '#D2B48C', description: '厨房必备，敲击有力' },
                { name: '塑料花盆', damage: 4, rarity: 'common', color: '#A0522D', description: '虽是塑料，但仍能伤人' },
                { name: '不锈钢汤勺', damage: 2, rarity: 'common', color: '#C0C0C0', description: '日常厨具' },
                { name: '坏掉的耳机', damage: 1, rarity: 'common', color: '#000000', description: '线材可以缠绕敌人' },
                { name: '纸质笔记本', damage: 1, rarity: 'common', color: '#FFFFFF', description: '虽然薄，但可以遮挡视线' },
            ];

            // 扩展不常见武器库
            const additionalUncommonWeapons = [
                { name: '加固撬棍', damage: 15, rarity: 'uncommon', color: '#696969', description: '坚固耐用，开锁好帮手' },
                { name: '电工胶带卷', damage: 12, rarity: 'uncommon', color: '#000000', description: '可以捆绑敌人' },
                { name: '园艺剪刀', damage: 14, rarity: 'uncommon', color: '#708090', description: '修剪花草的利器' },
                { name: '登山镐', damage: 16, rarity: 'uncommon', color: '#A9A9A9', description: '攀登工具，同样致命' },
                { name: '防身喷雾', damage: 11, rarity: 'uncommon', color: '#FFD700', description: '致盲效果，争取逃脱时间' },
                { name: '战术笔', damage: 13, rarity: 'uncommon', color: '#000080', description: '小巧隐蔽，突袭利器' },
                { name: '多功能军刀', damage: 17, rarity: 'uncommon', color: '#666666', description: '多种用途的战斗工具' },
                { name: '金属探照灯', damage: 15, rarity: 'uncommon', color: '#DAA520', description: '照明也能当锤子用' },
                { name: '折叠自行车锁', damage: 14, rarity: 'uncommon', color: '#2F4F4F', description: '防盗工具，亦可防身' },
                { name: '工业强力胶', damage: 10, rarity: 'uncommon', color: '#A52A2A', description: '粘住敌人行动' },
            ];

            // 扩展稀有武器库
            const additionalRareWeapons = [
                { name: '古代战戟', damage: 34, rarity: 'rare', color: '#4169E1', description: '古代步兵专用长兵器' },
                { name: '风雷扇', damage: 36, rarity: 'rare', color: '#7CFC00', description: '扇动风云，掌控风雷' },
                { name: '玄铁重剑', damage: 38, rarity: 'rare', color: '#2F4F4F', description: '重量惊人，威力巨大' },
                { name: '青莲剑', damage: 33, rarity: 'rare', color: '#00CED1', description: '剑气如莲，飘逸灵动' },
                { name: '墨玉法杖', damage: 40, rarity: 'rare', color: '#191970', description: '蕴含神秘的黑暗力量' },
                { name: '黄金权杖', damage: 37, rarity: 'rare', color: '#FFD700', description: '皇室权杖，威严非凡' },
                { name: '白虎爪', damage: 41, rarity: 'rare', color: '#F5FFFA', description: '模仿白虎利爪打造' },
                { name: '朱雀羽扇', damage: 42, rarity: 'rare', color: '#FF4500', description: '羽毛虽轻，威力无穷' },
                { name: '玄武盾剑', damage: 35, rarity: 'rare', color: '#2F4F2F', description: '攻守兼备的独特武器' },
                { name: '麒麟角', damage: 44, rarity: 'rare', color: '#FF8C00', description: '传说神兽的角，神圣无比' },
            ];

            // 扩展史诗武器库
            const additionalEpicWeapons = [
                { name: '泰坦之锤', damage: 68, rarity: 'epic', color: '#CD5C5C', description: '神界锻造，震撼天地' },
                { name: '永恒冰晶', damage: 72, rarity: 'epic', color: '#E0F6FF', description: '永不融化的绝对零度' },
                { name: '太阳真火', damage: 75, rarity: 'epic', color: '#FF4500', description: '来自太阳核心的永恒之火' },
                { name: '月亮精华', damage: 69, rarity: 'epic', color: '#F0F8FF', description: '凝聚月光精华的力量' },
                { name: '雷电权杖', damage: 71, rarity: 'epic', color: '#7CFC00', description: '掌控雷霆的神之权杖' },
                { name: '大地之心', damage: 73, rarity: 'epic', color: '#8FBC8F', description: '蕴含大地生命力的武器' },
                { name: '海洋三叉戟', damage: 74, rarity: 'epic', color: '#00CED1', description: '统治七海的神器' },
                { name: '星辰毁灭者', damage: 76, rarity: 'epic', color: '#4169E1', description: '能够毁灭星辰的终极武器' },
                { name: '次元斩', damage: 77, rarity: 'epic', color: '#9370DB', description: '切割空间的次元武器' },
                { name: '时间之钥', damage: 70, rarity: 'epic', color: '#DAA520', description: '操控时间的神秘钥匙' },
            ];

            // 扩展传说武器库
            const additionalLegendaryWeapons = [
                { name: '创世神杖', damage: 100, rarity: 'legendary', color: '#FF1493', description: '开创宇宙的神器' },
                { name: '终焉之剑', damage: 98, rarity: 'legendary', color: '#000000', description: '结束一切的终焉之力' },
                { name: '永恒之轮', damage: 95, rarity: 'legendary', color: '#1E90FF', description: '轮回转生的奥秘' },
                { name: '因果律之剑', damage: 105, rarity: 'legendary', color: '#4169E1', description: '违背物理定律的神剑' },
                { name: '命运之弦', damage: 92, rarity: 'legendary', color: '#BA55D3', description: '拨动命运之弦' },
                { name: '无限手套', damage: 97, rarity: 'legendary', color: '#2F4F4F', description: '蕴含无限力量的手套' },
                { name: '概念之刃', damage: 102, rarity: 'legendary', color: '#FF00FF', description: '超越物质的存在之刃' },
                { name: '宇宙之心', damage: 99, rarity: 'legendary', color: '#00FFFF', description: '宇宙诞生的核心' },
                { name: '现实编辑器', damage: 108, rarity: 'legendary', color: '#FF69B4', description: '改写现实的强大工具' },
                { name: '存在证明', damage: 96, rarity: 'legendary', color: '#7B68EE', description: '确认存在本身的神器' },
            ];

            // 扩展神话武器库
            const additionalMythicWeapons = [
                { name: '概念重塑', damage: 1500, rarity: 'mythic', color: '#FF00FF', description: '重新定义概念本身' },
                { name: '现实覆盖', damage: 1600, rarity: 'mythic', color: '#0000FF', description: '完全覆盖当前现实' },
                { name: '虚无具现', damage: 1400, rarity: 'mythic', color: '#000000', description: '将虚无转化为实在' },
                { name: '无限递归', damage: 1700, rarity: 'mythic', color: '#9400D3', description: '自我循环的无限力量' },
                { name: '悖论之刃', damage: 1800, rarity: 'mythic', color: '#FF4500', description: '违背逻辑的武器' },
                { name: '真理之眼', damage: 1550, rarity: 'mythic', color: '#32CD32', description: '看穿万物本质的眼睛' },
                { name: '存在阈值', damage: 1650, rarity: 'mythic', color: '#4169E1', description: '决定存在的阈值' },
                { name: '元叙事', damage: 1750, rarity: 'mythic', color: '#9370DB', description: '高于故事本身的叙述' },
                { name: '观察者效应', damage: 1450, rarity: 'mythic', color: '#00BFFF', description: '观察改变被观察者' },
                { name: '终极答案', damage: 1900, rarity: 'mythic', color: '#FFFF00', description: '解决一切问题的答案' },
            ];

            // 合并到原版武器库
            WEAPONS.push(...additionalCommonWeapons);
            WEAPONS.push(...additionalUncommonWeapons);
            WEAPONS.push(...additionalRareWeapons);
            WEAPONS.push(...additionalEpicWeapons);
            WEAPONS.push(...additionalLegendaryWeapons);
            WEAPONS.push(...additionalMythicWeapons);

            console.log(`🔄 武器库已扩展，新增 ${additionalCommonWeapons.length + additionalUncommonWeapons.length + additionalRareWeapons.length + additionalEpicWeapons.length + additionalLegendaryWeapons.length + additionalMythicWeapons.length} 种武器`);
        }
    }

    // 添加元素效果系统
    addElementalEffectsSystem() {
        // 创建一个包装函数来扩展原版的武器使用逻辑
        if (typeof applyWeapon !== 'undefined') {
            const originalApplyWeapon = applyWeapon;

            window.applyWeapon = function(weapon) {
                // 执行原版武器应用
                const result = originalApplyWeapon(weapon);

                // 检查是否具有元素效果
                const elementEffect = CoreGameplayEnhancements.prototype.weaponElements[weapon.name];
                if (elementEffect) {
                    // 应用元素效果
                    CoreGameplayEnhancements.prototype.applyElementalEffect(elementEffect);
                }

                return result;
            };
        }

        console.log("🔥 元素效果系统已添加");
    }

    // 应用元素效果
    applyElementalEffect(elementEffect) {
        // 为简单起见，在这里添加视觉和数值反馈
        switch(elementEffect.type) {
            case 'fire':
                // 燃烧效果 - 在一段时间内持续造成伤害
                showCombatLog(`🔥 ${elementEffect.type} 元素激活！`, 'weapon-effect');
                break;
            case 'ice':
                // 冰冻效果 - 降低敌人移动速度
                showCombatLog(`❄️ ${elementEffect.type} 元素激活！`, 'weapon-effect');
                break;
            case 'lightning':
                // 雷电效果 - 可能连锁攻击多个敌人
                showCombatLog(`⚡ ${elementEffect.type} 元素激活！`, 'weapon-effect');
                break;
            case 'poison':
                // 中毒效果 - 持续伤害
                showCombatLog(`☠️ ${elementEffect.type} 元素激活！`, 'weapon-effect');
                break;
            case 'holy':
                // 神圣效果 - 额外伤害
                showCombatLog(`✨ ${elementEffect.type} 元素激活！`, 'weapon-effect');
                break;
            case 'dragon':
                // 龙族效果 - 真实伤害
                showCombatLog(`🐉 ${elementEffect.type} 元素激活！`, 'weapon-effect');
                break;
            case 'star':
                // 星辰效果 - 范围伤害
                showCombatLog(`⭐ ${elementEffect.type} 元素激活！`, 'weapon-effect');
                break;
            case 'void':
                // 虚空效果 - 吸收伤害
                showCombatLog(`🌌 ${elementEffect.type} 元素激活！`, 'weapon-effect');
                break;
            default:
                showCombatLog(`💫 特殊元素激活！`, 'weapon-effect');
                break;
        }
    }

    // 改进的敌人AI系统
    applyEnemyAIEnhancements() {
        // 为敌人添加更复杂的行为模式
        if (typeof Enemy !== 'undefined' && Enemy.prototype) {
            // 保存原始构造函数
            const originalConstructor = Enemy.prototype.constructor;

            // 扩展Enemy类构造函数
            Enemy.prototype.constructor = function(level, type = null) {
                // 调用原始构造函数
                originalConstructor.call(this, level, type);

                // 添加AI增强属性
                this.behaviorState = 'idle';  // 当前行为状态
                this.lastActionTime = Date.now();  // 上次行动时间
                this.actionCooldown = 2000;  // 行动冷却时间
                this.targetX = null;  // AI设定的目标位置
                this.targetY = null;
                this.specialAbilityReady = false;  // 特殊能力是否可用

                // 根据敌人类型设定行为模式
                if (CoreGameplayEnhancements.prototype.enemyBehaviorEnhancements[this.type]) {
                    this.aiConfig = CoreGameplayEnhancements.prototype.enemyBehaviorEnhancements[this.type];

                    // 随机决定是否拥有特殊能力
                    this.hasSpecialAbility = Math.random() < this.aiConfig.chance;

                    if (this.hasSpecialAbility) {
                        this.specialAbility = this.aiConfig.specialAbility;
                    }
                }
            };

            // 添加AI更新方法
            Enemy.prototype.updateAI = function(player, enemies, projectiles) {
                const now = Date.now();

                // 检查行动冷却是否结束
                if (now - this.lastActionTime < this.actionCooldown) {
                    return;  // 还在冷却中
                }

                // 根据行为类型采取不同行动
                switch(this.type) {
                    case 'MELEE':
                        this.meleeBehavior(player);
                        break;
                    case 'RANGED':
                        this.rangedBehavior(player, projectiles);
                        break;
                    case 'ELITE':
                        this.eliteBehavior(player, enemies);
                        break;
                    case 'BOSS':
                        this.bossBehavior(player, enemies);
                        break;
                    default:
                        this.defaultBehavior(player);
                        break;
                }

                // 尝试使用特殊能力
                if (this.hasSpecialAbility && this.specialAbilityReady) {
                    this.useSpecialAbility(player, enemies);
                    this.specialAbilityReady = false;
                    this.actionCooldown = 5000;  // 特殊能力后较长冷却
                } else if (!this.specialAbilityReady) {
                    // 随机设定特殊能力就绪
                    if (Math.random() < 0.05) {  // 每次更新有5%概率准备就绪
                        this.specialAbilityReady = true;
                    }
                }

                this.lastActionTime = now;
            };

            // 近战敌人行为
            Enemy.prototype.meleeBehavior = function(player) {
                const dx = player.x - this.x;
                const dy = player.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                // 追逐玩家
                if (dist > 0) {
                    this.x += (dx / dist) * this.speed * 0.7; // 降低追击速度
                    this.y += (dy / dist) * this.speed * 0.7;
                }

                // 如果离得太远，向中心聚集
                if (dist > 400) {
                    const centerX = canvas.width / 2;
                    const centerY = canvas.height / 2;
                    const centerDx = centerX - this.x;
                    const centerDy = centerY - this.y;
                    const centerDist = Math.sqrt(centerDx * centerDx + centerDy * centerDy);

                    if (centerDist > 0) {
                        this.x += (centerDx / centerDist) * this.speed * 0.3;
                        this.y += (centerDy / centerDist) * this.speed * 0.3;
                    }
                }
            };

            // 远程敌人行为
            Enemy.prototype.rangedBehavior = function(player, projectiles) {
                const dx = player.x - this.x;
                const dy = player.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                // 保持距离，既不过近也不过远
                if (dist < 150) {
                    // 太近了，远离玩家
                    this.x -= (dx / dist) * this.speed * 0.5;
                    this.y -= (dy / dist) * this.speed * 0.5;
                } else if (dist > 250) {
                    // 太远了，靠近玩家
                    this.x += (dx / dist) * this.speed * 0.3;
                    this.y += (dy / dist) * this.speed * 0.3;
                }

                // 射击玩家
                if (dist < 300 && this.shootCooldown <= 0) {
                    projectiles.push({
                        x: this.x,
                        y: this.y,
                        dx: dx / dist,
                        dy: dy / dist,
                        speed: this.projectileSpeed,
                        damage: Math.floor(this.damage * 0.7),
                        color: '#FF5722',
                        size: 6
                    });
                    this.shootCooldown = 60; // 射击冷却
                }
            };

            // 精英敌人行为
            Enemy.prototype.eliteBehavior = function(player, enemies) {
                // 精英敌人更加智能，可能会协调攻击
                const dx = player.x - this.x;
                const dy = player.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                // 中等距离追击
                if (dist > 100 && dist < 300) {
                    this.x += (dx / dist) * this.speed * 0.6;
                    this.y += (dy / dist) * this.speed * 0.6;
                } else if (dist <= 100) {
                    // 太近了稍微后退
                    this.x -= (dx / dist) * this.speed * 0.3;
                    this.y -= (dy / dist) * this.speed * 0.3;
                }

                // 寻找附近的盟友进行协同
                for (const otherEnemy of enemies) {
                    if (otherEnemy !== this && otherEnemy.type === 'ELITE') {
                        const enemyDist = getDistance(this, otherEnemy);
                        if (enemyDist < 80) {
                            // 如果和其他精英太近，稍微分开
                            const repelX = this.x - otherEnemy.x;
                            const repelY = this.y - otherEnemy.y;
                            const repelDist = Math.sqrt(repelX * repelX + repelY * repelY);

                            if (repelDist > 0) {
                                this.x += (repelX / repelDist) * 0.5;
                                this.y += (repelY / repelDist) * 0.5;
                            }
                        }
                    }
                }
            };

            // Boss敌人行为
            Enemy.prototype.bossBehavior = function(player, enemies) {
                const dx = player.x - this.x;
                const dy = player.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                // Boss采用更加动态的策略
                const phase = Math.floor(gameState.level / 10); // 根据关卡确定阶段
                switch(phase % 3) {
                    case 0: // 追击模式
                        if (dist > 0) {
                            this.x += (dx / dist) * this.speed * 0.8;
                            this.y += (dy / dist) * this.speed * 0.8;
                        }
                        break;
                    case 1: // 环绕模式
                        if (dist > 150) {
                            this.x += (dx / dist) * this.speed * 0.4;
                            this.y += (dy / dist) * this.speed * 0.4;
                        } else {
                            // 环绕玩家移动
                            const angle = Math.atan2(dy, dx) + Math.PI/2;
                            this.x += Math.cos(angle) * this.speed * 0.6;
                            this.y += Math.sin(angle) * this.speed * 0.6;
                        }
                        break;
                    case 2: // 远程模式
                        if (dist < 200) {
                            this.x -= (dx / dist) * this.speed * 0.4;
                            this.y -= (dy / dist) * this.speed * 0.4;
                        } else if (dist > 300) {
                            this.x += (dx / dist) * this.speed * 0.4;
                            this.y += (dy / dist) * this.speed * 0.4;
                        }
                        break;
                }
            };

            // 默认行为
            Enemy.prototype.defaultBehavior = function(player) {
                const dx = player.x - this.x;
                const dy = player.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist > 0) {
                    this.x += (dx / dist) * this.speed * 0.5;
                    this.y += (dy / dist) * this.speed * 0.5;
                }
            };

            // 使用特殊能力
            Enemy.prototype.useSpecialAbility = function(player, enemies) {
                switch(this.specialAbility) {
                    case 'charge':
                        // 冲锋：瞬间大幅接近玩家
                        const dx = player.x - this.x;
                        const dy = player.y - this.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);

                        if (dist > 0) {
                            this.x += (dx / dist) * this.speed * 3; // 3倍速度冲锋
                            this.y += (dy / dist) * this.speed * 3;
                        }

                        showCombatLog(`💥 ${this.config.name} 发动冲锋！`, 'enemy-special');
                        break;

                    case 'snipe':
                        // 狙击：发射高伤害远程攻击
                        const sdx = player.x - this.x;
                        const sdy = player.y - this.y;
                        const sdist = Math.sqrt(sdx * sdx + sdy * sdy);

                        if (sdist > 0) {
                            window.gameState.projectiles.push({
                                x: this.x,
                                y: this.y,
                                dx: sdx / sdist,
                                dy: sdy / sdist,
                                speed: this.projectileSpeed * 1.5, // 更快的子弹
                                damage: this.damage * 1.8, // 更高的伤害
                                color: '#FF0000',
                                size: 10,
                                effect: 'pierce' // 穿透效果
                            });
                        }

                        showCombatLog(`🎯 ${this.config.name} 狙击！`, 'enemy-special');
                        break;

                    case 'buffSelf':
                        // 强化自身：临时提升属性
                        this.damage = Math.floor(this.damage * 1.5);
                        this.speed = this.speed * 1.3;

                        // 一段时间后恢复
                        setTimeout(() => {
                            this.damage = Math.floor(this.damage / 1.5);
                            this.speed = this.speed / 1.3;
                        }, 5000);

                        showCombatLog(`💪 ${this.config.name} 强化自身！`, 'enemy-special');
                        break;

                    case 'summonMinions':
                        // 召唤小怪
                        const numMinions = Math.min(3, Math.floor(gameState.level / 5));
                        for (let i = 0; i < numMinions; i++) {
                            setTimeout(() => {
                                enemies.push(new Enemy(Math.max(1, gameState.level - 5))); // 召喚較弱的敵人
                            }, i * 500);
                        }

                        showCombatLog(`👻 ${this.config.name} 召唤小怪！`, 'enemy-special');
                        break;
                }
            };
        }

        console.log("🤖 敌人AI系统已增强");
    }

    // 改进的难度曲线
    applyDifficultyCurveImprovements() {
        // 重新定义难度曲线，使游戏更具挑战性但不过于困难

        // 重写生成敌人函数以使用改进的难度曲线
        if (typeof spawnEnemy !== 'undefined') {
            const originalSpawnEnemy = window.spawnEnemy;

            window.spawnEnemy = function() {
                if (!gameState.isPlaying) return;

                // 根据关卡调整敌人生成策略
                let enemyLevel = gameState.level;

                // 在特定关卡引入更强的敌人
                if (gameState.level >= 10 && Math.random() < 0.3) {
                    // 30%概率生成+2等级的敌人
                    enemyLevel = gameState.level + 2;
                } else if (gameState.level >= 20 && Math.random() < 0.2) {
                    // 20%概率生成+3等级的敌人
                    enemyLevel = gameState.level + 3;
                }

                gameState.enemies.push(new Enemy(enemyLevel));

                // 改进的生成间隔计算
                // 在前期放缓增长，中期加速，后期趋于平缓
                let baseSpawnRate;
                if (gameState.level <= 10) {
                    // 前10关较慢增长
                    baseSpawnRate = 7000 - (gameState.level * 150);
                } else if (gameState.level <= 25) {
                    // 11-25关快速增长
                    baseSpawnRate = 5500 - ((gameState.level - 10) * 120);
                } else {
                    // 25关后放缓增长，但仍持续变快
                    baseSpawnRate = 3700 - ((gameState.level - 25) * 50);
                }

                // 设定边界值
                const minSpawnRate = 800; // 最小生成间隔
                const maxSpawnRate = 6000; // 最大生成间隔
                const spawnRate = Math.max(minSpawnRate, Math.min(maxSpawnRate, baseSpawnRate));

                // 根据难度设置调整
                const adjustedSpawnRate = spawnRate / gameState.enemySpawnRate;

                // 增加随机性，避免敌人生成过于规律
                const randomizedSpawnRate = adjustedSpawnRate * (0.8 + Math.random() * 0.4);

                setTimeout(window.spawnEnemy, randomizedSpawnRate);
            };
        }

        console.log("📈 难度曲线已改进");
    }

    // 增强的伤害计算系统
    calculateEnhancedDamage(weapon, target) {
        let baseDamage = weapon.damage;

        // 根据目标类型增加伤害修正
        if (target && target.config) {
            // 对某些类型敌人有额外伤害
            if (weapon.name.includes('神圣') && target.type === 'UNDEAD') {
                baseDamage *= 1.5; // 神圣武器对亡灵额外伤害
            } else if (weapon.name.includes('火焰') && target.type === 'GOLEM') {
                baseDamage *= 1.3; // 火焰对石像鬼有效
            } else if (weapon.name.includes('冰霜') && target.type === 'DRAGON') {
                baseDamage *= 1.2; // 冰霜对龙类有效
            }
        }

        // 添加武器元素效果伤害
        const elementEffect = this.weaponElements[weapon.name];
        if (elementEffect) {
            baseDamage += elementEffect.damage;
        }

        // 添加连击加成（如果适用）
        if (gameState.player && gameState.player.combo > 1) {
            const comboMultiplier = 1 + (gameState.player.combo * 0.05); // 每连击增加5%
            baseDamage *= comboMultiplier;
        }

        return Math.floor(baseDamage);
    }
}

// 初始化核心玩法增强系统
const coreGameplayEnhancements = new CoreGameplayEnhancements();

// 导出以便其他模块使用
window.CoreGameplayEnhancements = CoreGameplayEnhancements;