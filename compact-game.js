/**
 * 武器替换者 - 精简高性能版本
 *
 * 这个版本整合了所有优化措施，解决原始71个文件带来的性能问题
 */

// 主游戏类 - 实现所有功能的统一管理
class CompactGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        if (!this.canvas) {
            throw new Error('游戏画布未找到');
        }
        this.ctx = this.canvas.getContext('2d');

        // 游戏状态 - 单一数据源
        this.state = {
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
            sessionTime: 0,
            // 缓存对象减少GC压力
            vectorCache: { x: 0, y: 0 },
            rectCache: { x: 0, y: 0, w: 0, h: 0 }
        };

        // 配置
        this.config = {
            maxEnemies: 50,  // 限制敌人数量以优化性能
            maxItems: 20,    // 限制物品数量
            frameRate: 60,
            lastTime: 0
        };

        // 系统模块
        this.systems = {
            weapon: new WeaponSystem(this.state),
            enemy: new EnemySystem(this.state, this.config),
            audio: new AudioSystem(this.state),
            ui: new UISystem(this.state)
        };

        this.isRunning = false;
        this.animationFrameId = null;

        console.log("🎮 精简高性能游戏系统已初始化");
    }

    start() {
        if (this.isRunning) return;

        this.state.player.isPlaying = true;
        this.state.startTime = Date.now();
        this.isRunning = true;

        // 开始游戏循环
        this.gameLoop();

        // 开始敌人生成
        this.startEnemySpawning();

        console.log("▶️ 游戏已开始");
    }

    stop() {
        if (!this.isRunning) return;

        this.state.player.isPlaying = false;
        this.isRunning = false;

        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }

        console.log("⏹️ 游戏已停止");
    }

    gameLoop = () => {
        if (!this.state.player.isPlaying) return;

        const now = Date.now();
        const deltaTime = now - (this.config.lastTime || now);
        this.config.lastTime = now;

        // 更新系统
        this.updateSystems(deltaTime);

        // 渲染
        this.render();

        // 继续循环
        if (this.state.player.isPlaying) {
            this.animationFrameId = requestAnimationFrame(this.gameLoop);
        }
    }

    updateSystems(deltaTime) {
        // 更新玩家位置（跟随鼠标）
        this.updatePlayerPosition();

        // 更新各系统
        for (const [name, system] of Object.entries(this.systems)) {
            if (system.update) {
                system.update(deltaTime);
            }
        }

        // 更新游戏计时
        if (this.state.startTime) {
            this.state.sessionTime = Math.floor((Date.now() - this.state.startTime) / 1000);
        }
    }

    updatePlayerPosition() {
        const player = this.state.player;
        const dx = this.state.mouseX - player.x;
        const dy = this.state.mouseY - player.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 5) {
            const moveDist = Math.min(dist, player.speed);
            player.x += (dx / dist) * moveDist;
        }

        // 边界限制
        player.x = Math.max(player.size, Math.min(this.canvas.width - player.size, player.x));
        player.y = Math.max(player.size, Math.min(this.canvas.height - player.size, player.y));
    }

    render() {
        // 清除画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 渲染各系统
        for (const [name, system] of Object.entries(this.systems)) {
            if (system.render) {
                system.render(this.ctx);
            }
        }

        // 渲染玩家
        this.renderPlayer();

        // 更新UI
        this.systems.ui.updateElements();
    }

    renderPlayer() {
        const player = this.state.player;

        // 绘制玩家
        this.ctx.fillStyle = '#4ade80';
        this.ctx.beginPath();
        this.ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
        this.ctx.fill();
    }

    startEnemySpawning() {
        // 持续生成敌人
        if (this.state.player.isPlaying) {
            this.systems.enemy.spawnEnemy();

            // 根据当前关卡调整生成频率
            const adjustedRate = Math.max(500, this.config.enemySpawnRate - this.state.level * 30);

            setTimeout(() => this.startEnemySpawning(), adjustedRate);
        }
    }

    // 公共API
    killEnemy(enemy) {
        this.state.kills++;

        // 检查升级
        if (this.state.kills % 10 === 0) {
            this.state.level++;
            this.state.player.hp = Math.min(
                this.state.player.maxHp,
                this.state.player.hp + 20
            );
        }
    }

    pickupWeapon(weapon) {
        this.state.player.weapon = weapon;
    }

    updateCombo(combo) {
        this.state.player.currentCombo = combo;
        if (combo > this.state.player.maxCombo) {
            this.state.player.maxCombo = combo;
        }
    }
}

// 武器系统
class WeaponSystem {
    constructor(gameState) {
        this.state = gameState;
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
        const player = this.state.player;

        // 渲染当前武器
        if (player.weapon) {
            ctx.fillStyle = player.weapon.color;
            ctx.fillRect(
                player.x - player.size/2,
                player.y - player.size - 15,
                player.size,
                8
            );
        }
    }
}

// 敌人系统
class EnemySystem {
    constructor(gameState, config) {
        this.state = gameState;
        this.config = config;

        this.enemyTypes = {
            'SLIME': { name: '史莱姆', speed: 1.0, hp: 3.0, damage: 2.0, size: 1.0, behavior: 'melee' },
            'SKELETON': { name: '骷髅', speed: 1.2, hp: 5.0, damage: 2.5, size: 1.2, behavior: 'melee' },
            'BONE_ARCHER': { name: '骷髅弓箭手', speed: 0.8, hp: 2.5, damage: 3.0, size: 1.0, behavior: 'ranged' }
        };
    }

    spawnEnemy() {
        if (!this.state.player.isPlaying || this.state.enemies.length >= this.config.maxEnemies) {
            return;
        }

        // 随机选择敌人类型
        const enemyKeys = Object.keys(this.enemyTypes);
        const randomTypeKey = enemyKeys[Math.floor(Math.random() * enemyKeys.length)];
        const enemyTemplate = this.enemyTypes[randomTypeKey];

        // 从屏幕边缘生成敌人
        const side = Math.floor(Math.random() * 4);
        let x, y;

        switch(side) {
            case 0: // top
                x = Math.random() * this.state.canvas.width;
                y = -20;
                break;
            case 1: // right
                x = this.state.canvas.width + 20;
                y = Math.random() * this.state.canvas.height;
                break;
            case 2: // bottom
                x = Math.random() * this.state.canvas.width;
                y = this.state.canvas.height + 20;
                break;
            case 3: // left
                x = -20;
                y = Math.random() * this.state.canvas.height;
                break;
        }

        const weapon = window.game ?
                      window.game.systems.weapon.getRandomWeapon() :
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

        this.state.enemies.push(enemy);
    }

    update(deltaTime) {
        const player = this.state.player;

        // 处理所有敌人
        for (let i = this.state.enemies.length - 1; i >= 0; i--) {
            const enemy = this.state.enemies[i];

            // 敌人朝玩家移动
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

                    // 触发游戏结束
                    this.onGameOver();
                    return;
                }
            }

            // 检查敌人是否死亡
            if (enemy.hp <= 0) {
                // 玩家获得武器
                if (window.game) {
                    window.game.pickupWeapon(enemy.weapon);
                }

                // 从数组中移除敌人
                this.state.enemies.splice(i, 1);
            }
        }
    }

    render(ctx) {
        // 渲染所有敌人
        for (const enemy of this.state.enemies) {
            // 绘制敌人
            ctx.fillStyle = enemy.color;
            ctx.beginPath();
            ctx.arc(enemy.x, enemy.y, enemy.size / 2, 0, Math.PI * 2);
            ctx.fill();

            // 绘制血条
            const hpPercent = enemy.hp / enemy.maxHp;
            ctx.fillStyle = '#333';
            ctx.fillRect(enemy.x - 20, enemy.y - enemy.size / 2 - 15, 40, 5);
            ctx.fillStyle = '#f00';
            ctx.fillRect(enemy.x - 20, enemy.y - enemy.size / 2 - 15, 40 * hpPercent, 5);
        }
    }

    onGameOver() {
        document.getElementById('final-level').textContent = this.state.level;
        document.getElementById('final-kills').textContent = this.state.kills;
        document.getElementById('final-relics').textContent = this.state.player.relics.length;
        document.getElementById('game-over').classList.remove('hidden');
    }
}

// 音频系统（简化版）
class AudioSystem {
    constructor(gameState) {
        this.state = gameState;
        this.enabled = true;

        // 音效定义（简化版）
        this.sounds = {
            'weapon_pickup': 'weapon_pickup',
            'hit': 'hit',
            'level_up': 'level_up'
        };
    }

    play(soundId) {
        if (!this.enabled) return;

        // 这里可以集成实际的音频播放逻辑
        console.log(`🔊 播放音效: ${soundId}`);
    }

    update(deltaTime) {
        // 音频系统更新逻辑
    }

    render(ctx) {
        // 音频系统不需要渲染
    }
}

// UI系统
class UISystem {
    constructor(gameState) {
        this.state = gameState;
    }

    updateElements() {
        // 更新UI元素
        if (document.getElementById('hp')) {
            document.getElementById('hp').textContent = Math.max(0, Math.floor(this.state.player.hp));
        }
        if (document.getElementById('weapon')) {
            document.getElementById('weapon').textContent = this.state.player.weapon ? this.state.player.weapon.name : '无';
        }
        if (document.getElementById('level')) {
            document.getElementById('level').textContent = this.state.level;
        }
        if (document.getElementById('kills')) {
            document.getElementById('kills').textContent = this.state.kills;
        }
        if (document.getElementById('relics')) {
            document.getElementById('relics').textContent = this.state.player.relics.length;
        }
    }

    update(deltaTime) {
        // UI更新逻辑
    }

    render(ctx) {
        // UI渲染逻辑（大部分在HTML层面处理）
    }
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    // 创建游戏实例
    window.game = new CompactGame();

    // 设置鼠标移动监听
    const canvas = document.getElementById('gameCanvas');
    if (canvas) {
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            window.game.state.mouseX = e.clientX - rect.left;
            window.game.state.mouseY = e.clientY - rect.top;
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
            const canvas = document.getElementById('gameCanvas');
            window.game.state = {
                player: {
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
                },
                level: 1,
                kills: 0,
                enemies: [],
                items: [],
                mouseX: canvas.width / 2,
                mouseY: canvas.height / 2,
                enemySpawnTimer: 0,
                enemySpawnRate: 2000,
                combatLog: [],
                startTime: Date.now(),
                sessionTime: 0,
                vectorCache: { x: 0, y: 0 },
                rectCache: { x: 0, y: 0, w: 0, h: 0 }
            };

            document.getElementById('game-over').classList.add('hidden');
            window.game.start();
        });
    }

    console.log("🎨 精简版游戏界面已准备就绪");
});

// 工具函数
window.distance = function(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
};

// 战斗日志功能
window.showCombatLog = function(message, type = 'general') {
    console.log(`[${type}] ${message}`);
};

console.log("⚡ 武器替换者 - 精简高性能版本已加载");