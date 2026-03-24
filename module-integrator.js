/**
 * 游戏模块整合器
 * 将分散的功能整合到统一的模块系统中
 */

// 游戏核心模块
class CoreGameModule {
    constructor() {
        this.name = 'core';
        this.dependencies = [];
    }

    init(engine) {
        this.engine = engine;
        console.log('🎮 核心游戏模块已初始化');

        // 定义核心游戏函数
        this.defineCoreFunctions();
    }

    defineCoreFunctions() {
        // 游戏循环相关函数
        this.startGame = this.startGame.bind(this);
        this.update = this.update.bind(this);
        this.draw = this.draw.bind(this);
        this.gameLoop = this.gameLoop.bind(this);
    }

    startGame() {
        const gameState = this.engine.getState();
        gameState.player.isPlaying = true;
        gameState.player.isGameOver = false;
        gameState.startTime = Date.now();
        console.log('▶️ 游戏开始');
    }

    update(deltaTime) {
        const gameState = this.engine.getState();
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
        const gameState = this.engine.getState();

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
        const gameState = this.engine.getState();
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

        if (this.engine.getState().player.isPlaying && !this.engine.getState().player.isGameOver) {
            requestAnimationFrame(() => this.gameLoop());
        }
    }

    onGameStart() {
        console.log('🎬 核心游戏模块启动');
        this.gameLoop();
    }
}

// 音频模块
class AudioModule {
    constructor() {
        this.name = 'audio';
        this.sounds = new Map();
        this.enabled = true;
        this.dependencies = [];
    }

    init(engine) {
        this.engine = engine;
        console.log('🎵 音频模块已初始化');
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
        console.log('🎬 音频模块启动');
    }
}

// 成就模块
class AchievementModule {
    constructor() {
        this.name = 'achievements';
        this.achievements = [];
        this.dependencies = [];
    }

    init(engine) {
        this.engine = engine;
        console.log('🏆 成就模块已初始化');

        // 定义默认成就
        this.defaultAchievements = [
            { id: 'first_blood', name: '首杀', description: '击杀第一个敌人', achieved: false },
            { id: 'survivor', name: '幸存者', description: '存活超过5分钟', achieved: false },
            { id: 'slayer', name: '屠夫', description: '击杀50个敌人', achieved: false },
            { id: 'collector', name: '收藏家', description: '收集10件物品', achieved: false }
        ];
    }

    checkAchievements() {
        const gameState = this.engine.getState();

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
            this.engine.eventBus.emit('achievementUnlocked', achievement);
        }
    }

    onGameStart() {
        console.log('🎬 成就模块启动');
    }
}

// 存档模块
class SaveModule {
    constructor() {
        this.name = 'save';
        this.saveKey = 'rogue_game_save';
        this.dependencies = [];
    }

    init(engine) {
        this.engine = engine;
        console.log('💾 存档模块已初始化');
    }

    saveGame() {
        const gameState = this.engine.getState();
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
                    const currentState = this.engine.getState();
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
        console.log('🎬 存档模块启动');
    }
}

// 将模块注册到全局函数，便于其他脚本调用
if (typeof window !== 'undefined' && window.GameEngine) {
    // 等待GameEngine完全初始化后注册模块
    setTimeout(() => {
        // 注册核心模块
        const coreModule = new CoreGameModule();
        const audioModule = new AudioModule();
        const achievementModule = new AchievementModule();
        const saveModule = new SaveModule();

        // 注册模块到统一系统
        window.GameEngine.registerModule('core', coreModule);
        window.GameEngine.registerModule('audio', audioModule);
        window.GameEngine.registerModule('achievements', achievementModule);
        window.GameEngine.registerModule('save', saveModule);

        // 启动所有模块
        window.GameEngine.initializeAllModules();

        console.log('📦 所有基础模块已注册并初始化');
    }, 0);

    // 保留对旧函数名的兼容性包装（但推荐使用新模块系统）
    window.startGame = () => {
        const coreModule = window.GameEngine.getModule('core');
        if (coreModule && typeof coreModule.startGame === 'function') {
            coreModule.startGame();
        }
    };
} else {
    // 如果GameEngine还没准备好，等到它准备好后再注册
    const checkAndRegister = () => {
        if (window.GameEngine) {
            // 注册核心模块
            const coreModule = new CoreGameModule();
            const audioModule = new AudioModule();
            const achievementModule = new AchievementModule();
            const saveModule = new SaveModule();

            // 注册模块到统一系统
            window.GameEngine.registerModule('core', coreModule);
            window.GameEngine.registerModule('audio', audioModule);
            window.GameEngine.registerModule('achievements', achievementModule);
            window.GameEngine.registerModule('save', saveModule);

            // 启动所有模块
            window.GameEngine.initializeAllModules();

            console.log('📦 所有基础模块已注册并初始化');
        } else {
            setTimeout(checkAndRegister, 100);
        }
    };

    checkAndRegister();
}

console.log('🔄 游戏模块整合器已加载');