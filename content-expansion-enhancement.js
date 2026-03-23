// ==================== 游戏内容扩展增强 ====================
//
// 该模块用于显著扩展游戏内容，增加至少1-2小时的游戏时间
//

if (typeof CONTENT_EXPANSION_ENHANCEMENT_LOADED === 'undefined') {
    window.CONTENT_EXPANSION_ENHANCEMENT_LOADED = true;

    console.log("游戏内容扩展增强模块已加载");

    // 1. 扩展敌人类型 - 新增大量敌人变种
    const ADDITIONAL_ENEMY_TYPES = {
        // 机器人系列
        'SENTINEL_DROID': { name: '哨兵机器人', speed: 1.2, hp: 4.0, damage: 3.0, size: 1.5, behavior: 'ranged', special: 'laser_shot' },
        'ASSAULT_BOT': { name: '突击机器人', speed: 1.5, hp: 2.5, damage: 4.0, size: 1.4, behavior: 'melee', special: 'energy_shield' },
        'TANK_MECH': { name: '重型机甲', speed: 0.6, hp: 12.0, damage: 5.5, size: 3.5, behavior: 'ranged', special: 'rocket_barrage' },
        'STEALTH_DRONE': { name: '隐形无人机', speed: 3.0, hp: 0.8, damage: 2.0, size: 0.7, behavior: 'ranged', special: 'cloak' },

        // 魔法生物系列
        'ARCANE_GOLEM': { name: '奥术傀儡', speed: 0.7, hp: 8.0, damage: 3.5, size: 2.2, behavior: 'ranged', special: 'magic_missile' },
        'FROST_TITAN': { name: '寒冰泰坦', speed: 0.4, hp: 15.0, damage: 6.0, size: 5.0, behavior: 'melee', special: 'freezing_aura' },
        'FLAME_SPIRIT': { name: '火焰精灵', speed: 2.2, hp: 1.2, damage: 4.5, size: 1.0, behavior: 'melee', special: 'burning_touch' },
        'SHADOW_LURKER': { name: '暗影潜伏者', speed: 1.8, hp: 1.5, damage: 5.0, size: 1.1, behavior: 'melee', special: 'shadow_step' },

        // 外星生物系列
        'ACID_SPITTER': { name: '酸液喷射者', speed: 1.0, hp: 3.0, damage: 2.5, size: 1.3, behavior: 'ranged', special: 'acid_spit' },
        'PLASMA_WRAITH': { name: '等离子幽魂', speed: 2.0, hp: 0.5, damage: 6.0, size: 0.9, behavior: 'melee', special: 'phase_shift' },
        'CRYSTAL_HORROR': { name: '水晶恐怖', speed: 0.9, hp: 10.0, damage: 2.0, size: 2.8, behavior: 'ranged', special: 'crystal_shards' },
        'VOID_ANOMALY': { name: '虚空异常体', speed: 1.1, hp: 5.0, damage: 4.0, size: 2.0, behavior: 'support', special: 'reality_distortion' },

        // 传奇 Boss 系列
        'DRAGON_LORD': { name: '龙王', speed: 1.3, hp: 25.0, damage: 8.0, size: 4.0, behavior: 'mixed', special: 'dragon_roar' },
        'ANCIENT_WARDEN': { name: '上古守护者', speed: 0.5, hp: 40.0, damage: 5.0, size: 6.0, behavior: 'melee', special: 'earthquake' },
        'DEMON_LORD': { name: '恶魔领主', speed: 1.7, hp: 20.0, damage: 10.0, size: 3.8, behavior: 'mixed', special: 'hellfire' },
        'GOD_OF_WAR': { name: '战争之神', speed: 2.0, hp: 35.0, damage: 12.0, size: 5.5, behavior: 'melee', special: 'divine_wrath' }
    };

    // 2. 扩展武器类型 - 新增大量独特武器
    const ADDITIONAL_WEAPONS = [
        // 魔法系武器
        { name: '奥术法杖', damage: 52, rarity: 'rare', color: '#9370DB', effect: 'arcane_blast' },
        { name: '死灵法典', damage: 55, rarity: 'epic', color: '#663399', effect: 'summon_skeleton' },
        { name: '时间沙漏', damage: 58, rarity: 'epic', color: '#FFD700', effect: 'time_dilation' },
        { name: '空间扭曲器', damage: 62, rarity: 'epic', color: '#4B0082', effect: 'dimensional_rift' },
        { name: '永恒之心', damage: 70, rarity: 'legendary', color: '#FF69B4', effect: 'life_drain' },
        { name: '宇宙真理', damage: 80, rarity: 'legendary', color: '#000000', effect: 'reality_manipulation' },
        { name: '创世纪元', damage: 120, rarity: 'mythic', color: '#FF00FF', effect: 'creation_ex_nihilo' },
        { name: '虚无本源', damage: 150, rarity: 'mythic', color: '#36454F', effect: 'void_empowerment' },

        // 近战系武器
        { name: '血饮巨剑', damage: 54, rarity: 'rare', color: '#8B0000', effect: 'blood_lust' },
        { name: '雷鸣战锤', damage: 56, rarity: 'rare', color: '#FFD700', effect: 'thunder_strike' },
        { name: '寒冰之牙', damage: 53, rarity: 'rare', color: '#87CEEB', effect: 'frost_nova' },
        { name: '烈焰长鞭', damage: 58, rarity: 'epic', color: '#FF4500', effect: 'fire_whip' },
        { name: '暗影双刃', damage: 62, rarity: 'epic', color: '#2F4F4F', effect: 'shadow_clone' },
        { name: '风暴使者', damage: 65, rarity: 'epic', color: '#87CEEB', effect: 'hurricane' },
        { name: '破晓之光', damage: 72, rarity: 'legendary', color: '#FFFF00', effect: 'divine_light' },
        { name: '暮光之剑', damage: 68, rarity: 'legendary', color: '#8A2BE2', effect: 'twilight_edge' },
        { name: '万物终结者', damage: 90, rarity: 'legendary', color: '#000000', effect: 'absolute_zero' },
        { name: '太极阴阳剑', damage: 110, rarity: 'mythic', color: '#000000', effect: 'yin_yang_power' },
        { name: '混元无极刃', damage: 140, rarity: 'mythic', color: '#FFFFFF', effect: 'chaos_emperor' },

        // 远程系武器
        { name: '雷霆神弓', damage: 55, rarity: 'rare', color: '#00BFFF', effect: 'chain_lightning_arrow' },
        { name: '狙击之王', damage: 65, rarity: 'epic', color: '#696969', effect: 'headshot' },
        { name: '导弹发射器', damage: 70, rarity: 'epic', color: '#2F4F4F', effect: 'explosive_rounds' },
        { name: '激光步枪', damage: 60, rarity: 'rare', color: '#FF0000', effect: 'laser_precision' },
        { name: '等离子炮', damage: 75, rarity: 'legendary', color: '#00FFFF', effect: 'plasma_blast' },
        { name: '反物质射线枪', damage: 100, rarity: 'legendary', color: '#FF00FF', effect: 'annihilation_beam' },
        { name: '维度破坏者', damage: 160, rarity: 'mythic', color: '#9400D3', effect: 'dimensional_annihilation' },

        // 特殊功能性武器
        { name: '治疗之杖', damage: 20, rarity: 'rare', color: '#32CD32', effect: 'heal_on_hit' },
        { name: '护盾发生器', damage: 25, rarity: 'epic', color: '#4169E1', effect: 'shield_boost' },
        { name: '传送戒指', damage: 30, rarity: 'epic', color: '#9370DB', effect: 'teleport_strike' },
        { name: '召唤法器', damage: 40, rarity: 'legendary', color: '#FFD700', effect: 'ally_summon' },
        { name: '时空控制器', damage: 50, rarity: 'legendary', color: '#8A2BE2', effect: 'time_control' },
        { name: '命运之轮', damage: 80, rarity: 'mythic', color: '#FF69B4', effect: 'destiny_manipulation' }
    ];

    // 将新内容合并到现有数组中
    if (typeof WEAPONS !== 'undefined') {
        WEAPONS.push(...ADDITIONAL_WEAPONS);
        console.log(`新增了 ${ADDITIONAL_WEAPONS.length} 种扩展武器`);
    }

    if (typeof ENEMY_TYPES !== 'undefined') {
        Object.assign(ENEMY_TYPES, ADDITIONAL_ENEMY_TYPES);
        console.log(`新增了 ${Object.keys(ADDITIONAL_ENEMY_TYPES).length} 种扩展敌人类型`);
    }

    // 3. 新增关卡系统 - 引入区域概念
    class RegionSystem {
        constructor() {
            this.regions = [
                {
                    id: 'forest',
                    name: '幽暗森林',
                    levels: [1, 20],
                    enemies: ['SLIME', 'GOBLIN', 'SPIDER', 'WOLF', 'BEAR'],
                    themeColor: '#228B22',
                    boss: 'FOREST_GUARDIAN',
                    description: '初始区域，充满危险野生动物和小型魔物'
                },
                {
                    id: 'mountain',
                    name: '险峻山脉',
                    levels: [21, 40],
                    enemies: ['GOBLIN', 'ORC', 'YETI', 'CONDOR', 'STONE_ELEMENTAL'],
                    themeColor: '#8B4513',
                    boss: 'MOUNTAIN_KING',
                    description: '岩石嶙峋的山峰，居住着强大蛮族'
                },
                {
                    id: 'desert',
                    name: '无尽沙漠',
                    levels: [41, 60],
                    enemies: ['SCORPION', 'MUMMY', 'SAND_WORM', 'PHARAOH_GUARD'],
                    themeColor: '#F4A460',
                    boss: 'DESERT_EMPEROR',
                    description: '炎热干旱的沙漠，隐藏着古老诅咒'
                },
                {
                    id: 'abyss',
                    name: '深渊领域',
                    levels: [61, 80],
                    enemies: ['IMP', 'DEMON', 'ABYSS_WATCHER', 'VOID_TENTACLE'],
                    themeColor: '#4B0082',
                    boss: 'LORD_OF_ABYSS',
                    description: '黑暗恐怖的深渊，恶魔的领地'
                },
                {
                    id: 'heaven',
                    name: '天堂领域',
                    levels: [81, 100],
                    enemies: ['ANGEL', 'ARCHON', 'SERAPH', 'PRIME_ARCHON'],
                    themeColor: '#FFFFFF',
                    boss: 'GOD_OF_CREATION',
                    description: '光辉的天堂，最后的挑战之地'
                }
            ];

            this.currentRegion = this.regions[0]; // 从森林开始
        }

        // 根据关卡获取当前区域
        getCurrentRegion(level) {
            for (const region of this.regions) {
                if (level >= region.levels[0] && level <= region.levels[1]) {
                    this.currentRegion = region;
                    return region;
                }
            }
            return this.regions[this.regions.length - 1]; // 如果超出范围，返回最后一个区域
        }

        // 获取区域内的敌人类型
        getRegionalEnemies(level) {
            const region = this.getCurrentRegion(level);
            return region.enemies;
        }

        // 显示区域变化通知
        notifyRegionChange(newRegion, oldRegion, level) {
            if (newRegion.id !== oldRegion.id) {
                if (typeof showCombatLog !== 'undefined') {
                    showCombatLog(`🌍 进入新区域: ${newRegion.name} (Lv.${newRegion.levels[0]}-${newRegion.levels[1]})`, 'region-change');
                    showCombatLog(`📖 区域描述: ${newRegion.description}`, 'region-info');
                } else {
                    console.log(`进入新区域: ${newRegion.name} (Lv.${newRegion.levels[0]}-${newRegion.levels[1]})`);
                }
            }
        }
    }

    // 4. 新增游戏模式
    class GameModeSystem {
        constructor() {
            this.modes = {
                'classic': {
                    name: '经典模式',
                    description: '标准游戏体验',
                    modifier: { enemyHP: 1.0, enemyDamage: 1.0, spawnRate: 1.0, rewards: 1.0 }
                },
                'survival': {
                    name: '生存模式',
                    description: '无限敌人波次，挑战极限',
                    modifier: { enemyHP: 1.2, enemyDamage: 1.3, spawnRate: 1.5, rewards: 1.1 }
                },
                'speedrun': {
                    name: '速通模式',
                    description: '快速通关挑战，敌人更强但奖励更高',
                    modifier: { enemyHP: 0.8, enemyDamage: 1.5, spawnRate: 2.0, rewards: 1.8 }
                },
                'pacifist': {
                    name: '和平模式',
                    description: '尽量避免战斗，专注探索和解谜',
                    modifier: { enemyHP: 0.5, enemyDamage: 0.7, spawnRate: 0.7, rewards: 0.9 }
                },
                'nightmare': {
                    name: '噩梦模式',
                    description: '极度困难挑战，只有真正勇者才能完成',
                    modifier: { enemyHP: 2.0, enemyDamage: 2.0, spawnRate: 1.8, rewards: 2.5 }
                }
            };

            this.currentMode = 'classic';
        }

        // 设置游戏模式
        setMode(modeId) {
            if (this.modes[modeId]) {
                this.currentMode = modeId;
                const mode = this.modes[modeId];

                if (typeof showCombatLog !== 'undefined') {
                    showCombatLog(`🎮 游戏模式变更: ${mode.name}`, 'system');
                    showCombatLog(`📖 模式描述: ${mode.description}`, 'system');
                }

                return true;
            }
            return false;
        }

        // 获取当前模式的修饰符
        getCurrentModifiers() {
            return this.modes[this.currentMode]?.modifier || this.modes['classic'].modifier;
        }
    }

    // 5. 新增进度追踪系统
    class ProgressTracker {
        constructor() {
            this.stats = {
                totalLevels: 0,
                totalKills: 0,
                totalPlayTime: 0,
                gamesPlayed: 0,
                weaponsCollected: new Set(),
                regionsExplored: new Set(),
                modesCompleted: new Set(),
                achievementsEarned: new Set()
            };

            this.startTime = Date.now();
            this.startLevel = 1;
        }

        // 更新统计数据
        updateStats(kills, level) {
            this.stats.totalKills = kills;
            this.stats.totalLevels = level;
            this.stats.totalPlayTime = (Date.now() - this.startTime) / 1000; // 秒
        }

        // 记录武器收集
        recordWeaponCollection(weapon) {
            this.stats.weaponsCollected.add(weapon.name);
        }

        // 记录区域探索
        recordRegionExploration(region) {
            this.stats.regionsExplored.add(region.id);
        }

        // 获取进度摘要
        getProgressSummary() {
            return {
                completionPercentage: Math.min(100, (this.stats.totalLevels / 100) * 100),
                playTimeString: this.formatTime(this.stats.totalPlayTime),
                weaponsCollected: this.stats.weaponsCollected.size,
                regionsExplored: this.stats.regionsExplored.size,
                killsPerMinute: this.stats.totalPlayTime > 0 ?
                    Math.round((this.stats.totalKills / this.stats.totalPlayTime) * 60) : 0
            };
        }

        // 格式化时间
        formatTime(seconds) {
            const h = Math.floor(seconds / 3600);
            const m = Math.floor((seconds % 3600) / 60);
            const s = Math.floor(seconds % 60);

            if (h > 0) {
                return `${h}h ${m}m ${s}s`;
            } else if (m > 0) {
                return `${m}m ${s}s`;
            } else {
                return `${s}s`;
            }
        }
    }

    // 6. 创建全局系统实例
    window.regionSystem = new RegionSystem();
    window.gameModeSystem = new GameModeSystem();
    window.progressTracker = new ProgressTracker();

    // 7. 扩展关卡升级处理
    if (typeof handleLevelUp !== 'undefined') {
        const originalHandleLevelUp = handleLevelUp;

        window.handleLevelUp = function() {
            originalHandleLevelUp(); // 执行原有逻辑

            // 获取新模式下的修正值
            const modifiers = gameModeSystem.getCurrentModifiers();

            // 根据游戏模式调整玩家属性
            if (gameState.player) {
                gameState.player.hp *= modifiers.rewards;
                gameState.player.maxHp *= modifiers.rewards;
            }

            // 检查区域变化
            const oldRegion = regionSystem.currentRegion;
            const newRegion = regionSystem.getCurrentRegion(gameState.level);

            if (newRegion.id !== oldRegion.id) {
                regionSystem.notifyRegionChange(newRegion, oldRegion, gameState.level);
                progressTracker.recordRegionExploration(newRegion);
            }
        };
    }

    // 8. 扩展敌人生成系统以使用区域系统
    if (typeof generateEnemy !== 'undefined') {
        const originalGenerateEnemy = generateEnemy;

        window.generateEnemy = function() {
            // 获取当前区域和模式修正
            const currentRegion = regionSystem.getCurrentRegion(gameState.level);
            const modifiers = gameModeSystem.getCurrentModifiers();

            // 使用原有函数生成基础敌人
            let enemy = originalGenerateEnemy();

            // 根据游戏模式应用修正
            if (modifiers) {
                if (enemy.actualHp) {
                    enemy.actualHp *= modifiers.enemyHP;
                } else {
                    enemy.hp *= modifiers.enemyHP;
                }

                if (enemy.actualDamage) {
                    enemy.actualDamage *= modifiers.enemyDamage;
                } else {
                    enemy.damage *= modifiers.enemyDamage;
                }
            }

            // 确保最小值
            if (enemy.actualHp) {
                enemy.actualHp = Math.max(1, Math.round(enemy.actualHp));
            } else {
                enemy.hp = Math.max(1, Math.round(enemy.hp * modifiers.enemyHP));
            }

            if (enemy.actualDamage) {
                enemy.actualDamage = Math.max(1, Math.round(enemy.actualDamage));
            } else {
                enemy.damage = Math.max(1, Math.round(enemy.damage * modifiers.enemyDamage));
            }

            return enemy;
        };
    }

    // 9. 添加游戏内统计面板
    function addGameStatsPanel() {
        // 如果游戏UI支持，则添加统计面板
        const statsPanel = document.createElement('div');
        statsPanel.id = 'extended-stats';
        statsPanel.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.7);
            color: #fff;
            padding: 10px;
            border-radius: 8px;
            border: 2px solid #4a4a6a;
            font-size: 12px;
            min-width: 150px;
            z-index: 100;
            display: none; /* 默认隐藏 */
        `;

        statsPanel.innerHTML = `
            <div>🗺️ 区域: <span id="current-region">未知</span></div>
            <div>⏱️ 模式: <span id="current-mode">经典</span></div>
            <div>🕐 游戏时间: <span id="play-time">0s</span></div>
            <div>🏆 进度: <span id="completion-percent">0%</span></div>
        `;

        // 添加到游戏容器中
        const gameContainer = document.getElementById('game-container') || document.body;
        gameContainer.appendChild(statsPanel);

        // 更新统计面板的函数
        window.updateExtendedStats = function() {
            if (!progressTracker) return;

            const summary = progressTracker.getProgressSummary();
            const currentRegion = regionSystem.getCurrentRegion(gameState.level);

            document.getElementById('current-region').textContent = currentRegion.name;
            document.getElementById('current-mode').textContent = gameModeSystem.modes[gameModeSystem.currentMode]?.name || '未知';
            document.getElementById('play-time').textContent = summary.playTimeString;
            document.getElementById('completion-percent').textContent = `${summary.completionPercentage.toFixed(1)}%`;
        };

        // 定期更新统计面板
        setInterval(() => {
            if (gameState.player && gameState.player.isPlaying) {
                updateExtendedStats();
            }
        }, 1000);

        console.log("游戏统计面板已添加");
    }

    // 初始化统计面板
    setTimeout(addGameStatsPanel, 1000);

    // 10. 添加模式选择功能
    window.setGameMode = function(modeId) {
        return gameModeSystem.setMode(modeId);
    };

    // 11. 扩展游戏开始函数，允许选择模式
    if (typeof startGame !== 'undefined') {
        const originalStartGame = startGame;

        window.startGameWithMode = function(modeId = 'classic') {
            gameModeSystem.setMode(modeId);
            progressTracker.startTime = Date.now();
            progressTracker.startLevel = 1;
            progressTracker.stats.gamesPlayed++;

            // 开始原始游戏
            if (originalStartGame) {
                originalStartGame();
            }
        };
    }

    console.log("游戏内容扩展增强模块已完全加载");
} else {
    console.log("游戏内容扩展增强模块已存在，跳过重复加载");
}