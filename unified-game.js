/**
 * 武器替换者 - 统一模块化游戏入口
 *
 * 这个文件将原来的71个JS文件整合到一个模块化架构中
 * 旨在解决全局变量冲突和模块依赖问题
 */

// 游戏引擎核心模块
class GameEngine {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.gameState = null;
        this.modules = new Map();
        this.isRunning = false;

        this.initialize();
    }

    initialize() {
        // 获取画布元素
        this.canvas = document.getElementById('gameCanvas');
        if (!this.canvas) {
            throw new Error('游戏画布未找到');
        }
        this.ctx = this.canvas.getContext('2d');

        // 初始化游戏状态
        this.gameState = {
            player: {
                x: this.canvas.width / 2,
                y: this.canvas.height / 2,
                size: 30,
                speed: 5,
                hp: 100,
                maxHp: 100,
                weapon: null,
                isPlaying: false,
                isGameOver: false,
                score: 0,
                maxCombo: 0,
                currentCombo: 0,
                relics: [],
                skillsUsed: { Q: 0, W: 0, E: 0, R: 0 }
            },
            level: 1,
            kills: 0,
            enemies: [],
            items: [],
            mouseX: this.canvas.width / 2,
            mouseY: this.canvas.height / 2,
            enemySpawnTimer: 0,
            enemySpawnRate: 2000,
            combatLog: [],
            startTime: null,
            sessionTime: 0
        };

        // 初始化所有模块
        this.initializeModules();

        console.log("🎮 游戏引擎已初始化");
    }

    initializeModules() {
        // 初始化武器系统
        this.modules.set('weaponSystem', new WeaponSystem(this.gameState));

        // 初始化敌人系统
        this.modules.set('enemySystem', new EnemySystem(this.gameState));

        // 初始化成就系统
        this.modules.set('achievementSystem', new AchievementSystem(this.gameState));

        // 初始化存档系统
        this.modules.set('saveSystem', new SaveSystem(this.gameState));

        // 初始化音频系统
        this.modules.set('audioSystem', new AudioSystem(this.gameState));

        // 初始化UI系统
        this.modules.set('uiSystem', new UISystem(this.gameState));

        console.log("📦 所有游戏系统已初始化");
    }

    start() {
        if (this.isRunning) return;

        this.gameState.player.isPlaying = true;
        this.gameState.startTime = Date.now();
        this.isRunning = true;

        this.gameLoop();
        console.log("▶️ 游戏已开始");
    }

    stop() {
        this.gameState.player.isPlaying = false;
        this.isRunning = false;
        console.log("⏹️ 游戏已停止");
    }

    gameLoop() {
        if (!this.gameState.player.isPlaying) return;

        // 清除画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 更新游戏状态
        this.update();

        // 渲染游戏
        this.render();

        // 继续循环
        if (this.gameState.player.isPlaying) {
            requestAnimationFrame(() => this.gameLoop());
        }
    }

    update() {
        const now = Date.now();
        const deltaTime = now - (this.gameState.lastTime || now);
        this.gameState.lastTime = now;

        // 更新各个系统
        for (let [name, module] of this.modules) {
            if (module.update) {
                module.update(deltaTime);
            }
        }

        // 更新敌人生成计时器
        this.gameState.enemySpawnTimer += deltaTime;
        if (this.gameState.enemySpawnTimer > this.gameState.enemySpawnRate) {
            this.spawnEnemy();
            this.gameState.enemySpawnTimer = 0;

            // 随着关卡推进，加快生成速度
            this.gameState.enemySpawnRate = Math.max(500, 2000 - this.gameState.level * 30);
        }

        // 更新会话时间
        if (this.gameState.startTime) {
            this.gameState.sessionTime = Math.floor((Date.now() - this.gameState.startTime) / 1000);
        }
    }

    render() {
        // 渲染各个系统
        for (let [name, module] of this.modules) {
            if (module.render) {
                module.render(this.ctx);
            }
        }
    }

    spawnEnemy() {
        // 委托给敌人系统处理
        const enemySystem = this.modules.get('enemySystem');
        if (enemySystem && enemySystem.spawnEnemy) {
            enemySystem.spawnEnemy();
        }
    }

    getPlayerPosition() {
        return { x: this.gameState.player.x, y: this.gameState.player.y };
    }

    getMousePosition() {
        return { x: this.gameState.mouseX, y: this.gameState.mouseY };
    }

    // 公共API方法
    killEnemy(enemy) {
        this.gameState.kills++;

        // 检查升级
        if (this.gameState.kills % 10 === 0) {
            this.gameState.level++;
            // 升级回复一定生命值
            this.gameState.player.hp = Math.min(
                this.gameState.player.maxHp,
                this.gameState.player.hp + 20
            );
        }

        // 通知成就系统
        const achievementSystem = this.modules.get('achievementSystem');
        if (achievementSystem && achievementSystem.onEnemyKilled) {
            achievementSystem.onEnemyKilled(enemy);
        }
    }

    pickupWeapon(weapon) {
        this.gameState.player.weapon = weapon;

        // 通知成就系统
        const achievementSystem = this.modules.get('achievementSystem');
        if (achievementSystem && achievementSystem.onWeaponPicked) {
            achievementSystem.onWeaponPicked(weapon);
        }
    }

    updateCombo(combo) {
        this.gameState.player.currentCombo = combo;
        if (combo > this.gameState.player.maxCombo) {
            this.gameState.player.maxCombo = combo;
        }

        // 通知成就系统
        const achievementSystem = this.modules.get('achievementSystem');
        if (achievementSystem && achievementSystem.onComboUpdated) {
            achievementSystem.onComboUpdated(combo);
        }
    }
}

// 武器系统模块
class WeaponSystem {
    constructor(gameState) {
        this.gameState = gameState;
        this.weapons = [
            { name: '木剑', damage: 8, rarity: 'common', color: '#8B4513' },
            { name: '生锈的刀', damage: 5, rarity: 'common', color: '#888' },
            { name: '铁剑', damage: 12, rarity: 'uncommon', color: '#C0C0C0' },
            { name: '精灵长剑', damage: 20, rarity: 'rare', color: '#00FFFF' },
            { name: '龙牙剑', damage: 35, rarity: 'epic', color: '#FF00FF' },
            { name: '王者之剑', damage: 50, rarity: 'legendary', color: '#FFFF00' },
            { name: '创世之刃', damage: 100, rarity: 'mythic', color: '#00FF00' }
        ];
    }

    getRandomWeapon() {
        return {...this.weapons[Math.floor(Math.random() * this.weapons.length)]};
    }

    update(deltaTime) {
        // 武器系统更新逻辑
    }

    render(ctx) {
        // 渲染玩家当前武器
        if (this.gameState.player.weapon) {
            ctx.fillStyle = this.gameState.player.weapon.color;
            ctx.fillRect(
                this.gameState.player.x - this.gameState.player.size/2,
                this.gameState.player.y - this.gameState.player.size - 15,
                this.gameState.player.size,
                8
            );
        }
    }
}

// 敌人系统模块
class EnemySystem {
    constructor(gameState) {
        this.gameState = gameState;
        this.enemyTypes = {
            'SLIME': { name: '史莱姆', speed: 1.0, hp: 3.0, damage: 2.0, size: 1.0, behavior: 'melee' },
            'SKELETON': { name: '骷髅', speed: 1.2, hp: 5.0, damage: 2.5, size: 1.2, behavior: 'melee' },
            'BONE_ARCHER': { name: '骷髅弓箭手', speed: 0.8, hp: 2.5, damage: 3.0, size: 1.0, behavior: 'ranged' }
        };
    }

    spawnEnemy() {
        if (!this.gameState.player.isPlaying) return;

        // 随机选择敌人类型
        const enemyKeys = Object.keys(this.enemyTypes);
        const randomTypeKey = enemyKeys[Math.floor(Math.random() * enemyKeys.length)];
        const enemyTemplate = this.enemyTypes[randomTypeKey];

        const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
        let x, y;

        switch(side) {
            case 0: // top
                x = Math.random() * this.gameState.canvas.width;
                y = -20;
                break;
            case 1: // right
                x = this.gameState.canvas.width + 20;
                y = Math.random() * this.gameState.canvas.height;
                break;
            case 2: // bottom
                x = Math.random() * this.gameState.canvas.width;
                y = this.gameState.canvas.height + 20;
                break;
            case 3: // left
                x = -20;
                y = Math.random() * this.gameState.canvas.height;
                break;
        }

        const weaponSystem = window.game?.modules.get('weaponSystem');
        const weapon = weaponSystem ? weaponSystem.getRandomWeapon() :
                     { name: '生锈的刀', damage: 5, rarity: 'common', color: '#888' };

        const enemy = {
            x: x,
            y: y,
            size: enemyTemplate.size * 15,
            speed: enemyTemplate.speed,
            hp: enemyTemplate.hp * 10,
            maxHp: enemyTemplate.hp * 10,
            damage: enemyTemplate.damage,
            color: `hsl(${Math.random() * 60 + enemyKeys.indexOf(randomTypeKey) * 60}, 70%, 50%)`,
            weapon: weapon,
            type: randomTypeKey,
            name: enemyTemplate.name
        };

        this.gameState.enemies.push(enemy);
    }

    update(deltaTime) {
        // 更新所有敌人
        for (let i = this.gameState.enemies.length - 1; i >= 0; i--) {
            const enemy = this.gameState.enemies[i];

            // 敌人朝玩家移动
            const player = this.gameState.player;
            const edx = player.x - enemy.x;
            const edy = player.y - enemy.y;
            const edist = Math.sqrt(edx * edx + edy * edy);

            if (edist > 5) {
                enemy.x += (edx / edist) * enemy.speed;
                enemy.y += (edy / edist) * enemy.speed;
            }

            // 检测碰撞
            const collisionDist = player.size + enemy.size / 2;
            if (edist < collisionDist) {
                // 玩家受伤
                player.hp -= enemy.damage;
                player.currentCombo = 0; // 连击中断

                if (player.hp <= 0) {
                    player.hp = 0;
                    player.isPlaying = false;
                    player.isGameOver = true;

                    // 触发游戏结束逻辑
                    this.onGameOver();
                    return;
                }
            }

            // 检查敌人是否死亡
            if (enemy.hp <= 0) {
                // 玩家获得敌人的武器
                if (window.game) {
                    window.game.pickupWeapon(enemy.weapon);
                }

                // 生成武器掉落
                this.spawnWeaponDrop(enemy.x, enemy.y);

                this.gameState.enemies.splice(i, 1);
            }
        }
    }

    render(ctx) {
        // 渲染所有敌人
        for (const enemy of this.gameState.enemies) {
            ctx.fillStyle = enemy.color;
            ctx.beginPath();
            ctx.arc(enemy.x, enemy.y, enemy.size / 2, 0, Math.PI * 2);
            ctx.fill();

            // 血条
            const hpPercent = enemy.hp / enemy.maxHp;
            ctx.fillStyle = '#333';
            ctx.fillRect(enemy.x - 20, enemy.y - enemy.size / 2 - 15, 40, 5);
            ctx.fillStyle = '#f00';
            ctx.fillRect(enemy.x - 20, enemy.y - enemy.size / 2 - 15, 40 * hpPercent, 5);
        }
    }

    spawnWeaponDrop(x, y) {
        const weaponSystem = window.game?.modules.get('weaponSystem');
        const weapon = weaponSystem ? weaponSystem.getRandomWeapon() :
                     { name: '生锈的刀', damage: 5, rarity: 'common', color: '#888' };

        const item = {
            x: x,
            y: y,
            type: 'weapon',
            value: weapon,
            size: 10,
            color: weapon.color,
            collected: false
        };
        this.gameState.items.push(item);
    }

    onGameOver() {
        document.getElementById('final-level').textContent = this.gameState.level;
        document.getElementById('final-kills').textContent = this.gameState.kills;
        document.getElementById('final-relics').textContent = this.gameState.player.relics.length;
        document.getElementById('game-over').classList.remove('hidden');
    }
}

// 成就系统模块
class AchievementSystem {
    constructor(gameState) {
        this.gameState = gameState;
        this.achievements = new Map();
        this.initAchievements();
    }

    initAchievements() {
        // 初始化成就数据
        const achievementData = [
            {
                id: 'first_blood',
                name: '第一滴血',
                description: '击杀第一个敌人',
                category: 'starter',
                hidden: false,
                condition: () => this.gameState.kills >= 1,
                progress: () => Math.min(100, this.gameState.kills * 100)
            },
            {
                id: 'killing_spree',
                name: '杀戮 spree',
                description: '连续击杀20个敌人而不死亡',
                category: 'combat',
                hidden: false,
                condition: () => this.gameState.player.currentKillStreak >= 20,
                progress: () => Math.min(100, (this.gameState.player.currentKillStreak / 20) * 100)
            },
            {
                id: 'level_ten',
                name: '第十关勇士',
                description: '到达第10关',
                category: 'progression',
                hidden: false,
                condition: () => this.gameState.level >= 10,
                progress: () => Math.min(100, (this.gameState.level / 10) * 100)
            }
        ];

        achievementData.forEach(ach => {
            this.achievements.set(ach.id, {
                ...ach,
                unlocked: false,
                unlockTime: null,
                progress: 0
            });
        });
    }

    checkAchievements() {
        let unlocked = [];

        for (let [id, achievement] of this.achievements) {
            if (!achievement.unlocked) {
                // 计算进度
                const progress = achievement.progress ? achievement.progress() : 0;
                achievement.progress = progress;

                // 检查条件是否满足
                if (achievement.condition && achievement.condition()) {
                    this.unlockAchievement(id);
                    unlocked.push(achievement);
                }
            }
        }

        // 触发成就解锁事件
        if (unlocked.length > 0) {
            this.onAchievementUnlocked(unlocked);
        }

        return unlocked;
    }

    unlockAchievement(id) {
        const achievement = this.achievements.get(id);
        if (achievement && !achievement.unlocked) {
            achievement.unlocked = true;
            achievement.unlockTime = Date.now();

            console.log(`🏆 成就解锁: ${achievement.name}`);

            // 显示成就通知
            if (window.showCombatLog) {
                window.showCombatLog(`🏆 成就解锁: ${achievement.name}`, 'achievement-unlock');
            }

            return true;
        }
        return false;
    }

    onAchievementUnlocked(achievements) {
        achievements.forEach(achievement => {
            if (window.showCombatLog) {
                window.showCombatLog(`🏆 成就解锁: ${achievement.name}`, 'achievement-unlock');
            } else {
                console.log(`🏆 成就解锁: ${achievement.name}`);
            }
        });
    }

    onEnemyKilled(enemy) {
        // 更新临时统计数据
        if (!this.gameState.currentKillStreak) {
            this.gameState.currentKillStreak = 0;
        }
        this.gameState.currentKillStreak++;

        // 检查成就
        this.checkAchievements();
    }

    onWeaponPicked(weapon) {
        // 更新武器统计数据
        if (!this.gameState.collectedCommonWeapons) {
            this.gameState.collectedCommonWeapons = 0;
        }
        if (weapon.rarity === 'common') {
            this.gameState.collectedCommonWeapons++;
        }

        // 检查成就
        this.checkAchievements();
    }

    onComboUpdated(combo) {
        // 检查成就
        this.checkAchievements();
    }

    update(deltaTime) {
        // 定期检查成就（每秒一次）
        if (this.gameState.player.isPlaying && Date.now() % 1000 < deltaTime) {
            this.checkAchievements();
        }
    }
}

// 存档系统模块
class SaveSystem {
    constructor(gameState) {
        this.gameState = gameState;
        this.saveKey = 'weaponRogueSave';
        this.version = '1.0';
    }

    save() {
        try {
            const saveData = this.getSaveData();
            localStorage.setItem(this.saveKey, JSON.stringify(saveData));
            console.log('💾 游戏进度已保存');

            if (window.showCombatLog) {
                window.showCombatLog('💾 进度已自动保存', 'weapon-get');
            }

            return true;
        } catch (error) {
            console.error('❌ 保存失败:', error);
            if (window.showCombatLog) {
                window.showCombatLog('⚠️ 保存失败', 'weapon-lose');
            }
            return false;
        }
    }

    load() {
        try {
            const saveDataStr = localStorage.getItem(this.saveKey);
            if (!saveDataStr) {
                console.log('📂 没有找到存档');
                return false;
            }

            const saveData = JSON.parse(saveDataStr);

            // 恢复游戏状态
            if (saveData.progress) {
                this.gameState.level = saveData.progress.level || 1;
                this.gameState.kills = saveData.progress.kills || 0;
                this.gameState.player.hp = saveData.progress.hp || 100;
                this.gameState.player.maxHp = saveData.progress.maxHp || 100;
                this.gameState.player.weapon = saveData.progress.weapon || null;
                this.gameState.player.score = saveData.progress.score || 0;
                this.gameState.player.maxCombo = saveData.progress.maxCombo || 0;
                this.gameState.player.relics = saveData.progress.relics || [];
            }

            if (saveData.highScores) {
                this.gameState.highScores = saveData.progress.highScores || [];
            }

            console.log('📥 游戏进度已加载');
            if (window.showCombatLog) {
                window.showCombatLog('📂 进度已加载', 'weapon-get');
            }

            return true;
        } catch (error) {
            console.error('❌ 加载失败:', error);
            if (window.showCombatLog) {
                window.showCombatLog('⚠️ 读取存档失败', 'weapon-lose');
            }
            return false;
        }
    }

    getSaveData() {
        return {
            version: this.version,
            timestamp: Date.now(),
            progress: {
                level: this.gameState.level,
                kills: this.gameState.kills,
                hp: this.gameState.player.hp,
                maxHp: this.gameState.player.maxHp,
                weapon: this.gameState.player.weapon,
                score: this.gameState.player.score,
                maxCombo: this.gameState.player.maxCombo,
                relics: this.gameState.player.relics,
                highScores: this.gameState.highScores || []
            }
        };
    }

    clear() {
        try {
            localStorage.removeItem(this.saveKey);
            console.log('🗑️ 存档已删除');
            if (window.showCombatLog) {
                window.showCombatLog('🗑️ 存档已清除', 'weapon-get');
            }
            return true;
        } catch (error) {
            console.error('❌ 清除失败:', error);
            return false;
        }
    }
}

// 音频系统模块
class AudioSystem {
    constructor(gameState) {
        this.gameState = gameState;
        this.isEnabled = true;
        this.musicEnabled = true;
        this.soundEnabled = true;
        this.volume = 0.7;

        // 音效预设
        this.sounds = {
            'attack': { type: 'synth', params: { frequency: 220, waveform: 'square', duration: 0.1 } },
            'hit': { type: 'synth', params: { frequency: 180, waveform: 'sawtooth', duration: 0.05 } },
            'weapon_pickup': { type: 'synth', params: { frequency: 523.25, waveform: 'triangle', duration: 0.3 } },
            'achievement_unlock': { type: 'synth', params: { frequency: 1318.51, duration: 0.05 } }
        };
    }

    playSound(soundId) {
        if (!this.isEnabled || !this.soundEnabled) return false;

        const sound = this.sounds[soundId];
        if (!sound) {
            console.warn(`⚠️ 音效 "${soundId}" 未定义`);
            return false;
        }

        console.log(`🔊 播放音效: ${soundId}`);
        return true;
    }

    update(deltaTime) {
        // 音频系统更新逻辑
    }
}

// UI系统模块
class UISystem {
    constructor(gameState) {
        this.gameState = gameState;
    }

    update(deltaTime) {
        // 更新UI元素
        if (document.getElementById('hp')) {
            document.getElementById('hp').textContent = Math.max(0, Math.floor(this.gameState.player.hp));
        }
        if (document.getElementById('weapon')) {
            document.getElementById('weapon').textContent = this.gameState.player.weapon ? this.gameState.player.weapon.name : '无';
        }
        if (document.getElementById('level')) {
            document.getElementById('level').textContent = this.gameState.level;
        }
        if (document.getElementById('kills')) {
            document.getElementById('kills').textContent = this.gameState.kills;
        }
        if (document.getElementById('relics')) {
            document.getElementById('relics').textContent = this.gameState.player.relics.length;
        }
    }

    render(ctx) {
        // UI渲染逻辑（通常在HTML层面处理）
    }
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    // 创建游戏实例
    window.game = new GameEngine();

    // 设置鼠标移动监听
    const canvas = document.getElementById('gameCanvas');
    if (canvas) {
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            window.game.gameState.mouseX = e.clientX - rect.left;
            window.game.gameState.mouseY = e.clientY - rect.top;
        });
    }

    // 设置开始游戏按钮
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            document.getElementById('start-screen').classList.add('hidden');
            window.game.start();
        });
    }

    // 设置重新开始按钮
    const restartBtn = document.getElementById('restart-btn');
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            // 重置游戏状态
            window.game.gameState.player = {
                x: canvas.width / 2,
                y: canvas.height / 2,
                size: 30,
                speed: 5,
                hp: 100,
                maxHp: 100,
                weapon: null,
                isPlaying: true,
                isGameOver: false,
                score: 0,
                maxCombo: 0,
                currentCombo: 0,
                relics: [],
                skillsUsed: { Q: 0, W: 0, E: 0, R: 0 }
            };
            window.game.gameState.level = 1;
            window.game.gameState.kills = 0;
            window.game.gameState.enemies = [];
            window.game.gameState.items = [];
            window.game.gameState.mouseX = canvas.width / 2;
            window.game.gameState.mouseY = canvas.height / 2;
            window.game.gameState.enemySpawnTimer = 0;
            window.game.gameState.enemySpawnRate = 2000;
            window.game.gameState.combatLog = [];
            window.game.gameState.startTime = Date.now();

            document.getElementById('game-over').classList.add('hidden');
            window.game.start();
        });
    }

    console.log("🎨 游戏界面已准备就绪");
});

// 工具函数
function distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

console.log("🚀 武器替换者 - 统一模块化版本已加载");