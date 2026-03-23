// ==================== 游戏内容综合扩展系统 ====================
//
// 该系统整合所有扩展内容，包括被动技能、新武器、新敌人、新游戏模式等
// 目标是为游戏提供1-2小时的可玩内容，增加深度和可重玩性
//

class ComprehensiveGameExpansion {
    constructor() {
        this.initializePassiveSkillSystem();
        this.expandWeaponCollection();
        this.expandEnemyRoster();
        this.addGameModesAndChallenges();
        this.integrateSystems();

        console.log("🎮 游戏内容综合扩展系统已完全加载！");
    }

    // 初始化被动技能系统（如果尚未初始化）
    initializePassiveSkillSystem() {
        if (typeof window.passiveSkillSystem === 'undefined') {
            // 这里只是确保被动技能系统存在
            console.log("🔍 检测到被动技能系统未加载，依赖已创建的系统");
        } else {
            console.log("✅ 被动技能系统已集成");
        }
    }

    // 扩展武器收藏
    expandWeaponCollection() {
        // 家居生活系列武器
        const HOME_LIFE_WEAPONS = [
            { name: '平底锅', damage: 12, rarity: 'common', color: '#C0C0C0', description: '厨房必备，也能防身' },
            { name: '拖把', damage: 8, rarity: 'common', color: '#D2B48C', description: '长柄武器，可以远距离攻击' },
            { name: '衣撑', damage: 6, rarity: 'common', color: '#F5F5DC', description: '尖锐的挂钩可以造成伤害' },
            { name: '橡皮鸭', damage: 2, rarity: 'common', color: '#FFFF00', description: '软萌但意外有效的武器' },
            { name: '卷尺', damage: 7, rarity: 'common', color: '#C0C0C0', description: '可伸缩的攻击距离' },

            { name: '电熨斗', damage: 15, rarity: 'uncommon', color: '#A9A9A9', description: '加热后可以烫伤敌人' },
            { name: '螺丝刀', damage: 14, rarity: 'uncommon', color: '#FFD700', description: '尖锐的工具尖端' },
            { name: '扳手', damage: 18, rarity: 'uncommon', color: '#808080', description: '沉重的工具，破坏力强' },
            { name: '剪刀', damage: 16, rarity: 'uncommon', color: '#C0C0C0', description: '可以造成割伤效果' },
            { name: '水果刀', damage: 13, rarity: 'uncommon', color: '#D3D3D3', description: '锋利的小刀' },

            { name: '微波炉', damage: 25, rarity: 'rare', color: '#A52A2A', description: '发射高热微波' },
            { name: '吹风机', damage: 22, rarity: 'rare', color: '#ADD8E6', description: '热风攻击' },
            { name: '榨汁机', damage: 24, rarity: 'rare', color: '#228B22', description: '酸性果汁喷射' },
            { name: '吸尘器', damage: 20, rarity: 'rare', color: '#2F4F4F', description: '真空吸取攻击' },
            { name: '咖啡机', damage: 26, rarity: 'rare', color: '#8B4513', description: '高压蒸汽喷射' },

            { name: '冰箱', damage: 35, rarity: 'epic', color: '#E0F6FF', description: '冰冷攻击，减缓敌人' },
            { name: '洗衣机', damage: 30, rarity: 'epic', color: '#87CEEB', description: '高速旋转攻击' },
            { name: '烤箱', damage: 32, rarity: 'epic', color: '#8B4513', description: '高温炙烤' },
            { name: '洗碗机', damage: 28, rarity: 'epic', color: '#708090', description: '高压水流冲击' },
            { name: '电磁炉', damage: 33, rarity: 'epic', color: '#2F4F4F', description: '电磁脉冲' },

            { name: '智能家居中枢', damage: 50, rarity: 'legendary', color: '#4169E1', description: '控制家中所有电器攻击敌人' },
            { name: '扫地机器人军团', damage: 45, rarity: 'legendary', color: '#7CFC00', description: '召唤机器人小兵' },
            { name: '音响系统', damage: 48, rarity: 'legendary', color: '#000000', description: '超重低音震碎敌人' },
            { name: '全息投影仪', damage: 42, rarity: 'legendary', color: '#FF00FF', description: '迷惑敌人，造成幻觉' },
            { name: '家庭能源核心', damage: 55, rarity: 'legendary', color: '#FFD700', description: '抽取家中所有电力攻击' }
        ];

        // 专业工具系列武器
        const PROFESSIONAL_TOOLS_WEAPONS = [
            { name: '游标卡尺', damage: 11, rarity: 'common', color: '#708090', description: '精密测量，精确打击' },
            { name: '记号笔', damage: 5, rarity: 'common', color: '#FF0000', description: '标记敌人弱点' },
            { name: '计算器', damage: 9, rarity: 'common', color: '#A9A9A9', description: '计算最优攻击路径' },
            { name: '订书机', damage: 10, rarity: 'common', color: '#C0C0C0', description: '射出订书钉攻击' },
            { name: '打孔器', damage: 7, rarity: 'common', color: '#808080', description: '尖锐穿刺' },

            { name: '电钻', damage: 22, rarity: 'uncommon', color: '#696969', description: '高速旋转钻头' },
            { name: '电锯', damage: 24, rarity: 'uncommon', color: '#808080', description: '链锯切割' },
            { name: '焊枪', damage: 20, rarity: 'uncommon', color: '#FF4500', description: '高温焊接攻击' },
            { name: '砂轮机', damage: 18, rarity: 'uncommon', color: '#A9A9A9', description: '磨削伤害' },
            { name: '千斤顶', damage: 16, rarity: 'uncommon', color: '#778899', description: '重压攻击' },

            { name: '激光测距仪', damage: 28, rarity: 'rare', color: '#FF0000', description: '精准激光打击' },
            { name: '频谱分析仪', damage: 26, rarity: 'rare', color: '#4169E1', description: '干扰敌人频率' },
            { name: '示波器', damage: 27, rarity: 'rare', color: '#00FF00', description: '波形攻击' },
            { name: '3D打印机', damage: 30, rarity: 'rare', color: '#4682B4', description: '打印武器攻击' },
            { name: '数控机床', damage: 32, rarity: 'rare', color: '#2F4F4F', description: '精密加工攻击' },

            { name: '工业机器人臂', damage: 40, rarity: 'epic', color: '#708090', description: '高精度机械臂攻击' },
            { name: 'CNC雕刻机', damage: 38, rarity: 'epic', color: '#778899', description: '数控精密切割' },
            { name: '3D扫描仪', damage: 35, rarity: 'epic', color: '#4169E1', description: '扫描弱点进行攻击' },
            { name: '光谱仪', damage: 36, rarity: 'epic', color: '#8A2BE2', description: '分解敌人分子结构' },
            { name: '精密天平', damage: 34, rarity: 'epic', color: '#C0C0C0', description: '平衡攻击，精确伤害' },

            { name: '量子计算核心', damage: 80, rarity: 'legendary', color: '#9370DB', description: '量子态攻击，无视防御' },
            { name: '纳米制造工厂', damage: 75, rarity: 'legendary', color: '#32CD32', description: '纳米机器人集群攻击' },
            { name: '粒子加速器', damage: 85, rarity: 'legendary', color: '#4169E1', description: '高能粒子轰击' },
            { name: '反物质反应堆', damage: 90, rarity: 'legendary', color: '#FF00FF', description: '反物质湮灭攻击' },
            { name: '维度干涉仪', damage: 95, rarity: 'legendary', color: '#000000', description: '跨维度攻击' }
        ];

        // 合并所有新武器到游戏武器库
        if (typeof window.WEAPONS !== 'undefined') {
            window.WEAPONS.push(...HOME_LIFE_WEAPONS);
            window.WEAPONS.push(...PROFESSIONAL_TOOLS_WEAPONS);
        }

        console.log(`apons + ${PROFESSIONAL_TOOLS_WEAPONS.length} 专业工具系列武器`);
    }

    // 扩展敌人阵容
    expandEnemyRoster() {
        const NEW_ENEMY_TYPES = {
            // 家居敌人
            SMART_DEVICE: { name: '智能设备', speed: 1.2, hp: 3.0, damage: 2.5, size: 1.2, behavior: 'tech', description: '被黑客感染的智能家居设备' },
            HOME_ROBOT: { name: '家用机器人', speed: 1.5, hp: 4.0, damage: 3.0, size: 1.4, behavior: 'mechanical', description: '失控的家务机器人' },
            KITCHEN_APPLIANCE: { name: '厨房电器', speed: 0.8, hp: 6.0, damage: 4.0, size: 1.8, behavior: 'electrical', description: '通电的厨房设备' },
            VACUUM_CLEANER: { name: '吸尘器怪', speed: 1.0, hp: 5.0, damage: 2.0, size: 1.5, behavior: 'suction', description: '试图吸入一切的清洁设备' },
            MICROWAVE_MONSTER: { name: '微波炉怪', speed: 0.7, hp: 7.0, damage: 5.0, size: 2.0, behavior: 'microwave', description: '发出有害辐射的电器' },

            // 办公室敌人
            PAPERWORK_SPECTER: { name: '文书幽灵', speed: 0.5, hp: 2.0, damage: 1.0, size: 1.0, behavior: 'obstruction', description: '成堆的文书变成的幽灵' },
            OFFICE_DESK: { name: '办公桌怪', speed: 0.3, hp: 10.0, damage: 3.0, size: 2.5, behavior: 'obstacle', description: '巨大的办公家具怪物' },
            PRINTER_PHANTOM: { name: '打印机幻影', speed: 1.3, hp: 2.5, damage: 2.0, size: 1.2, behavior: 'jamming', description: '不停卡纸的办公设备' },
            COFFEE_MACHINE: { name: '咖啡机魔', speed: 0.9, hp: 6.0, damage: 4.5, size: 1.7, behavior: 'caffeine', description: '过量咖啡因的化身' },
            PROJECTOR_PHANTOM: { name: '投影仪魅影', speed: 1.1, hp: 3.5, damage: 3.5, size: 1.3, behavior: 'blinding', description: '发出刺眼光线的设备' },

            // 高级敌人
            AI_OVERLORD: { name: 'AI霸主', speed: 1.0, hp: 15.0, damage: 8.0, size: 3.0, behavior: 'command', description: '控制所有智能设备的中央AI' },
            QUANTUM_ERROR: { name: '量子错误', speed: 2.0, hp: 12.0, damage: 10.0, size: 2.2, behavior: 'uncertainty', description: '存在于多个状态的错误实体' },
            REALITY_GLITCH: { name: '现实漏洞', speed: 1.8, hp: 8.0, damage: 6.0, size: 1.9, behavior: 'distortion', description: '扭曲现实的程序漏洞' },
            DIGITAL_PHANTOM: { name: '数字幻影', speed: 2.5, hp: 5.0, damage: 7.0, size: 1.6, behavior: 'data', description: '纯粹数据构成的实体' },
            SYSTEM_DAEMON: { name: '系统守护进程', speed: 1.4, hp: 11.0, damage: 9.0, size: 2.4, behavior: 'maintenance', description: '维护系统秩序的守护者' }
        };

        // 扩展现有敌人类型
        if (typeof window.ENEMY_TYPES !== 'undefined') {
            Object.assign(window.ENEMY_TYPES, NEW_ENEMY_TYPES);
        }

        console.log(`👾 新增了 ${Object.keys(NEW_ENEMY_TYPES).length} 种新敌人类型`);
    }

    // 添加游戏模式和挑战
    addGameModesAndChallenges() {
        // 新游戏模式
        const NEW_GAME_MODES = {
            HOME_INVASION: {
                name: '家居入侵',
                description: '敌人全部来自家居设备，体验在家中的生存挑战',
                modifiers: {
                    homeEnemyOnly: true,
                    familiarEnvironment: true,
                    householdItemWeapons: true
                }
            },
            OFFICE_NIGHTMARE: {
                name: '办公室噩梦',
                description: '在深夜的办公楼中对抗被唤醒的办公设备',
                modifiers: {
                    officeEnemiesOnly: true,
                    fluorescentLighting: true,
                    caffeinePowerUps: true
                }
            },
            TECH_UPRISING: {
                name: '科技起义',
                description: '智能设备反抗人类，只有使用古老工具才能生存',
                modifiers: {
                    primitiveWeaponsOnly: true,
                    techEnemiesDominant: true,
                    analogAdvantage: true
                }
            },
            QUANTUM_REALITY: {
                name: '量子现实',
                description: '现实规则不再稳定，挑战你的认知极限',
                modifiers: {
                    quantumMechanics: true,
                    uncertaintyPrinciple: true,
                    probabilityBasedOutcomes: true
                }
            }
        };

        // 新挑战
        const NEW_CHALLENGES = [
            {
                id: 'household_hero',
                name: '家居英雄',
                description: '仅使用家居用品武器到达第30关',
                conditions: { weaponType: 'household', targetLevel: 30 },
                rewards: { homeExpertBadge: true, furnitureMaster: true }
            },
            {
                id: 'office_survivor',
                name: '办公室幸存者',
                description: '在办公室环境中生存15分钟',
                conditions: { environment: 'office', timeTarget: 900000 },
                rewards: { deskJockeyMedal: true, overtimeSurvivor: true }
            },
            {
                id: 'analog_champion',
                name: '模拟冠军',
                description: '使用非电子工具武器击败100个敌人',
                conditions: { weaponCategory: 'non_electronic', enemyTarget: 100 },
                rewards: { ludditeVictory: true, oldSchoolMastery: true }
            },
            {
                id: 'quantum_mechanic',
                name: '量子机械师',
                description: '在量子现实模式下完成特殊任务',
                conditions: { gameMode: 'quantum_reality', objectives: ['observe_quantum_state', 'collapse_probability', 'resolve_superposition'] },
                rewards: { quantumPhysicist: true, realityEngineer: true }
            }
        ];

        // 将新模式和挑战存储到全局变量
        window.NEW_GAME_MODES = NEW_GAME_MODES;
        window.NEW_CHALLENGES = NEW_CHALLENGES;

        console.log(`🎮 新增了 ${Object.keys(NEW_GAME_MODES).length} 种游戏模式`);
        console.log(`🏆 新增了 ${NEW_CHALLENGES.length} 个挑战`);
    }

    // 集成所有系统
    integrateSystems() {
        // 集成被动技能系统
        if (typeof window.passiveSkillSystem !== 'undefined') {
            console.log("🔗 被动技能系统已集成");
        }

        // 集成成就系统
        if (typeof window.enhancedAchievementSystem !== 'undefined') {
            console.log("🔗 成就系统已集成");
        }

        // 添加特殊事件
        this.addSpecialEvents();

        // 扩展存档系统
        this.extendSaveSystem();
    }

    // 添加特殊事件
    addSpecialEvents() {
        const SPECIAL_EVENTS = [
            {
                id: 'smart_home_revolt',
                name: '智能家居起义',
                trigger: (level) => level > 5 && level % 7 === 0,
                duration: 20000,
                effect: () => {
                    if (typeof showCombatLog !== 'undefined') {
                        showCombatLog("🏠 智能家居起义！家电成为敌人！", "special-event");
                    }
                    // 临时提高家居类敌人生成概率
                    if (window.gameState) {
                        window.gameState.homeEnemySurge = true;
                        setTimeout(() => {
                            window.gameState.homeEnemySurge = false;
                        }, 20000);
                    }
                },
                description: '所有家居设备活了过来，对你发动攻击！'
            },
            {
                id: 'office_ghosts',
                name: '办公室幽灵',
                trigger: (level) => level > 10 && level % 9 === 0,
                duration: 15000,
                effect: () => {
                    if (typeof showCombatLog !== 'undefined') {
                        showCombatLog("🏢 办公室幽灵出现！文书成精了！", "special-event");
                    }
                    // 临时提高办公类敌人生成概率
                    if (window.gameState) {
                        window.gameState.officeEnemySurge = true;
                        setTimeout(() => {
                            window.gameState.officeEnemySurge = false;
                        }, 15000);
                    }
                },
                description: '深夜办公室中出现了文书幽灵！'
            },
            {
                id: 'quantum_fluctuation',
                name: '量子波动',
                trigger: (level) => level > 20 && level % 13 === 0,
                duration: 25000,
                effect: () => {
                    if (typeof showCombatLog !== 'undefined') {
                        showCombatLog("⚛️ 量子波动！现实规则不稳定！", "special-event");
                    }
                    // 临时改变游戏规则
                    if (window.gameState) {
                        window.gameState.quantumReality = true;
                        setTimeout(() => {
                            window.gameState.quantumReality = false;
                        }, 25000);
                    }
                },
                description: '量子层面的扰动影响了现实！'
            },
            {
                id: 'tool_empowerment',
                name: '工具赋能',
                trigger: (level) => level > 15 && Math.random() < 0.1, // 10%概率
                duration: 10000,
                effect: () => {
                    if (typeof showCombatLog !== 'undefined') {
                        showCombatLog("🔧 工具赋能！普通工具威力大增！", "special-event");
                    }
                    // 临时提高所有工具类武器的伤害
                    if (window.gameState) {
                        window.gameState.toolEmpowerment = 1.5; // 50%伤害加成
                        setTimeout(() => {
                            window.gameState.toolEmpowerment = 1.0;
                        }, 10000);
                    }
                },
                description: '所有工具类武器获得临时伤害加成！'
            }
        ];

        window.COMPREHENSIVE_SPECIAL_EVENTS = SPECIAL_EVENTS;
        console.log("🔮 新增了 4 个特殊事件");
    }

    // 扩展存档系统
    extendSaveSystem() {
        // 如果存在基础存档系统，扩展其功能
        if (typeof window.enhancedSaveManager !== 'undefined') {
            // 扩展存档数据结构以包含新内容
            const originalGetSaveData = window.enhancedSaveManager.getSaveData;

            window.enhancedSaveManager.getSaveData = function() {
                const baseData = originalGetSaveData.call(this);

                // 添加扩展数据
                baseData.expandedContent = {
                    unlockedHomeWeapons: baseData.expandedContent?.unlockedHomeWeapons || [],
                    unlockedOfficeWeapons: baseData.expandedContent?.unlockedOfficeWeapons || [],
                    completedChallenges: baseData.expandedContent?.completedChallenges || [],
                    discoveredEnemyTypes: baseData.expandedContent?.discoveredEnemyTypes || [],
                    achievedGameModes: baseData.expandedContent?.achievedGameModes || [],
                    skillTreeProgress: baseData.expandedContent?.skillTreeProgress || {}
                };

                return baseData;
            };

            console.log("💾 存档系统已扩展");
        }
    }

    // 检查挑战完成情况
    checkChallengeCompletion(challengeId) {
        const challenge = window.NEW_CHALLENGES.find(c => c.id === challengeId);
        if (!challenge) return false;

        // 这里可以根据具体的挑战要求来检查完成情况
        // 实现会根据具体挑战类型有所不同
        return false; // 默认返回false，实际实现需根据具体情况
    }

    // 更新游戏状态（在游戏循环中调用）
    update() {
        // 在这里可以添加周期性的扩展功能更新
        if (window.gameState && window.passiveSkillSystem) {
            // 更新被动技能效果
            window.passiveSkillSystem.update();
        }
    }
}

// 初始化综合扩展系统
window.comprehensiveGameExpansion = new ComprehensiveGameExpansion();

// 扩展关卡升级处理函数，加入新内容
if (typeof window.handleLevelUp !== 'undefined') {
    const originalHandleLevelUp = window.handleLevelUp;

    window.handleLevelUp = function() {
        originalHandleLevelUp(); // 执行原版升级逻辑

        // 检查是否有特殊事件触发
        if (window.COMPREHENSIVE_SPECIAL_EVENTS && window.gameState) {
            window.COMPREHENSIVE_SPECIAL_EVENTS.forEach(event => {
                if (event.trigger && event.trigger(window.gameState.level)) {
                    setTimeout(() => {
                        event.effect();
                    }, 1000); // 延迟1秒执行，避免与原版升级效果冲突
                }
            });
        }

        // 每5级给玩家一个提示
        if (window.gameState && window.gameState.level % 5 === 0) {
            if (typeof showCombatLog !== 'undefined') {
                showCombatLog(`🎉 到达第 ${window.gameState.level} 关！新的挑战在等待着你`, "level-up");
            }
        }
    };
}

// 添加游戏循环更新钩子
if (typeof window.gameLoop !== 'undefined') {
    const originalGameLoop = window.gameLoop;

    window.gameLoop = function() {
        // 执行原版游戏循环
        originalGameLoop();

        // 更新扩展系统
        if (window.comprehensiveGameExpansion) {
            window.comprehensiveGameExpansion.update();
        }
    };
} else {
    // 如果没有现成的游戏循环，创建一个
    window.gameLoopExtension = function() {
        if (window.comprehensiveGameExpansion) {
            window.comprehensiveGameExpansion.update();
        }

        requestAnimationFrame(window.gameLoopExtension);
    };

    // 延迟启动，避免与其他系统冲突
    setTimeout(() => {
        if (window.gameState && window.gameState.isPlaying) {
            window.gameLoopExtension();
        }
    }, 1000);
}

console.log("✨ 游戏内容综合扩展系统已完全集成！");