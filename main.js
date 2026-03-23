/**
 * 主游戏入口文件
 * 使用统一模块系统重新组织游戏功能
 */

// 在引入其他模块之前先设置统一系统
import './unified-module-system.js';

// 定义游戏核心模块类
class CoreGameMechanics {
    constructor() {
        this.name = 'CoreGameMechanics';
    }

    init(system) {
        this.system = system;
        console.log('🔧 核心游戏机制模块已初始化');

        // 定义核心游戏函数，但不再污染全局窗口
        this.defineGameFunctions();
    }

    defineGameFunctions() {
        // 将函数绑定到模块实例而不是全局窗口
        this.startGame = this.startGame.bind(this);
        this.update = this.update.bind(this);
        this.draw = this.draw.bind(this);
        this.gameLoop = this.gameLoop.bind(this);
    }

    startGame() {
        const gameState = this.system.getState();
        gameState.player.isPlaying = true;
        gameState.player.isGameOver = false;
        gameState.startTime = Date.now();
        console.log('▶️ 游戏开始');
    }

    update(deltaTime) {
        const gameState = this.system.getState();
        if (!gameState.player.isPlaying || gameState.player.isGameOver) return;

        // 更新敌人生成计时器
        gameState.enemySpawnTimer += deltaTime;

        // 生成敌人逻辑
        if (gameState.enemySpawnTimer >= gameState.enemySpawnRate) {
            this.spawnEnemy();
            gameState.enemySpawnTimer = 0;

            // 随着等级提升，增加敌人的生成速度
            gameState.enemySpawnRate = Math.max(200, 2000 - gameState.kills * 2);
        }
    }

    draw(ctx) {
        // 绘制游戏逻辑
        const gameState = this.system.getState();

        // 清除画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 绘制玩家
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(gameState.player.x - gameState.player.size/2,
                     gameState.player.y - gameState.player.size/2,
                     gameState.player.size,
                     gameState.player.size);

        // 绘制敌人
        ctx.fillStyle = '#ff0000';
        gameState.enemies.forEach(enemy => {
            ctx.fillRect(enemy.x - enemy.size/2,
                         enemy.y - enemy.size/2,
                         enemy.size,
                         enemy.size);
        });

        // 绘制物品
        ctx.fillStyle = '#ffff00';
        gameState.items.forEach(item => {
            ctx.beginPath();
            ctx.arc(item.x, item.y, item.size, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    spawnEnemy() {
        const gameState = this.system.getState();
        const newEnemy = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: 20,
            speed: 1 + Math.random() * 2,
            hp: 10 + Math.floor(gameState.level * 0.5)
        };

        // 确保敌人不会直接出现在玩家附近
        const distanceToPlayer = Math.sqrt(
            Math.pow(newEnemy.x - gameState.player.x, 2) +
            Math.pow(newEnemy.y - gameState.player.y, 2)
        );

        if (distanceToPlayer < 100) {
            // 重新定位敌人
            const angle = Math.random() * Math.PI * 2;
            newEnemy.x = gameState.player.x + Math.cos(angle) * 150;
            newEnemy.y = gameState.player.y + Math.sin(angle) * 150;

            // 确保不超出边界
            newEnemy.x = Math.max(newEnemy.size/2, Math.min(canvas.width - newEnemy.size/2, newEnemy.x));
            newEnemy.y = Math.max(newEnemy.size/2, Math.min(canvas.height - newEnemy.size/2, newEnemy.y));
        }

        gameState.enemies.push(newEnemy);
    }

    gameLoop() {
        const currentTime = Date.now();
        const deltaTime = currentTime - (this.lastFrameTime || currentTime);
        this.lastFrameTime = currentTime;

        this.update(deltaTime);
        this.draw(ctx);

        if (this.system.getState().player.isPlaying && !this.system.getState().player.isGameOver) {
            requestAnimationFrame(() => this.gameLoop());
        }
    }

    onGameStart() {
        console.log('🎬 核心游戏机制启动');
        this.gameLoop();
    }
}

// 创建音频模块类
class AudioSystem {
    constructor() {
        this.name = 'AudioSystem';
        this.sounds = new Map();
        this.enabled = true;
    }

    init(system) {
        this.system = system;
        console.log('🎵 音频系统模块已初始化');
    }

    playSound(soundName) {
        if (!this.enabled) return;

        // 这里应该是实际的音频播放逻辑
        console.log(`🔊 播放音效: ${soundName}`);
    }

    toggle(enabled) {
        this.enabled = !!enabled;
        console.log(`🔊 音频系统: ${this.enabled ? '开启' : '关闭'}`);
    }

    onGameStart() {
        console.log('🎬 音频系统启动');
    }
}

// 创建成就系统模块类
class AchievementSystem {
    constructor() {
        this.name = 'AchievementSystem';
        this.achievements = [];
    }

    init(system) {
        this.system = system;
        console.log('🏆 成就系统模块已初始化');

        // 定义默认成就
        this.defaultAchievements = [
            { id: 'first_blood', name: '首杀', description: '击杀第一个敌人', achieved: false },
            { id: 'survivor', name: '幸存者', description: '存活超过5分钟', achieved: false },
            { id: 'slayer', name: '屠夫', description: '击杀50个敌人', achieved: false },
            { id: 'collector', name: '收藏家', description: '收集10件物品', achieved: false }
        ];
    }

    checkAchievements() {
        const gameState = this.system.getState();

        this.defaultAchievements.forEach(achievement => {
            if (!achievement.achieved) {
                switch(achievement.id) {
                    case 'first_blood':
                        if (gameState.kills >= 1) {
                            this.unlockAchievement(achievement.id);
                        }
                        break;
                    case 'slayer':
                        if (gameState.kills >= 50) {
                            this.unlockAchievement(achievement.id);
                        }
                        break;
                    case 'collector':
                        // 这里应该基于收集的物品数量判断
                        break;
                }
            }
        });
    }

    unlockAchievement(id) {
        const achievement = this.defaultAchievements.find(a => a.id === id);
        if (achievement && !achievement.achieved) {
            achievement.achieved = true;
            console.log(`🎉 解锁成就: ${achievement.name}`);

            // 发送事件通知其他模块
            this.system.eventBus.emit('achievementUnlocked', achievement);
        }
    }

    onGameStart() {
        console.log('🎬 成就系统启动');
    }
}

// 创建保存系统模块类
class SaveSystem {
    constructor() {
        this.name = 'SaveSystem';
        this.saveKey = 'rogue_game_save';
    }

    init(system) {
        this.system = system;
        console.log('💾 保存系统模块已初始化');
    }

    saveGame() {
        const gameState = this.system.getState();
        const saveData = {
            version: '1.0',
            timestamp: Date.now(),
            gameState: {
                ...gameState,
                // 排除一些不适合保存的数据
                enemies: [],  // 不保存实时敌人位置
                items: []     // 不保存实时物品位置
            }
        };

        try {
            localStorage.setItem(this.saveKey, JSON.stringify(saveData));
            console.log('💾 游戏已保存');
            return true;
        } catch (error) {
            console.error('❌ 保存游戏失败:', error);
            return false;
        }
    }

    loadGame() {
        try {
            const saveData = localStorage.getItem(this.saveKey);
            if (saveData) {
                const parsedData = JSON.parse(saveData);

                if (parsedData.version) {
                    // 恢复游戏状态（排除敌人和物品）
                    const currentState = this.system.getState();
                    Object.assign(currentState, parsedData.gameState);

                    console.log('📥 游戏已加载');
                    return true;
                }
            }
        } catch (error) {
            console.error('❌ 加载游戏失败:', error);
        }

        return false;
    }

    onGameStart() {
        console.log('🎬 保存系统启动');
    }
}

// 等待统一系统初始化完成，然后注册所有模块
setTimeout(() => {
    if (window.GameSystem) {
        // 注册核心模块
        const coreMechanics = new CoreGameMechanics();
        const audioSystem = new AudioSystem();
        const achievementSystem = new AchievementSystem();
        const saveSystem = new SaveSystem();

        // 注册模块到统一系统
        window.GameSystem.registerModule('core', coreMechanics);
        window.GameSystem.registerModule('audio', audioSystem);
        window.GameSystem.registerModule('achievements', achievementSystem);
        window.GameSystem.registerModule('save', saveSystem);

        // 启动所有模块
        window.GameSystem.initializeAllModules();

        console.log('🎮 所有游戏模块已注册并初始化');
    } else {
        console.error('❌ 统一游戏系统未找到');
    }
}, 0);

// 保留对旧函数名的兼容性包装（但推荐使用新模块系统）
window.startGame = () => {
    const coreModule = window.GameSystem.getModule('core');
    if (coreModule && typeof coreModule.startGame === 'function') {
        coreModule.startGame();
    }
};

console.log('🚀 Rogue游戏系统已启动');