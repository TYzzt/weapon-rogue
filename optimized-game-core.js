/**
 * 优化后的游戏主文件
 * 整合核心功能以减少HTTP请求数量
 */

// 将所有必需的模块整合在一起以减少加载时间

class OptimizedGameSystem {
    constructor() {
        // 统一的状态管理
        this.state = this.createInitialState();

        // 模块容器
        this.modules = new Map();

        // 事件系统
        this.events = new OptimizedEventSystem();

        console.log("🚀 优化的游戏系统已初始化");
    }

    createInitialState() {
        return {
            player: {
                x: 400,
                y: 300,
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
            mouseX: 400,
            mouseY: 300,
            enemySpawnTimer: 0,
            enemySpawnRate: 2000,
            combatLog: [],
            startTime: null,
            sessionTime: 0,
        };
    }

    getState() {
        return this.state;
    }

    updateState(newState) {
        Object.assign(this.state, newState);
    }

    registerModule(name, module) {
        this.modules.set(name, module);
        if (module.init) {
            module.init(this);
        }
        console.log(`✅ 模块 ${name} 已注册`);
    }

    getModule(name) {
        return this.modules.get(name);
    }
}

class OptimizedEventSystem {
    constructor() {
        this.handlers = new Map();
    }

    on(event, handler) {
        if (!this.handlers.has(event)) {
            this.handlers.set(event, []);
        }
        this.handlers.get(event).push(handler);
    }

    emit(event, data) {
        const handlers = this.handlers.get(event);
        if (handlers) {
            handlers.forEach(handler => {
                try {
                    handler(data);
                } catch (e) {
                    console.error('Event handler error:', e);
                }
            });
        }
    }
}

// 核心游戏模块
class CoreGameLogic {
    constructor() {
        this.name = 'core';
        this.lastFrameTime = 0;
    }

    init(system) {
        this.system = system;
        console.log('🎮 核心游戏逻辑已初始化');
    }

    startGame() {
        const state = this.system.getState();
        state.player.isPlaying = true;
        state.player.isGameOver = false;
        state.startTime = Date.now();
        console.log('▶️ 游戏开始');
    }

    update(deltaTime) {
        const state = this.system.getState();
        if (!state.player.isPlaying || state.player.isGameOver) return;

        // 更新敌人生成计时器
        state.enemySpawnTimer += deltaTime;

        // 生成敌人逻辑
        if (state.enemySpawnTimer >= state.enemySpawnRate) {
            this.spawnEnemy();
            state.enemySpawnTimer = 0;

            // 随着等级提升，增加敌人的生成速度
            state.enemySpawnRate = Math.max(200, 2000 - state.kills * 2);
        }
    }

    draw(ctx) {
        const state = this.system.getState();

        // 清除画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 绘制玩家
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(state.player.x - state.player.size/2,
                     state.player.y - state.player.size/2,
                     state.player.size,
                     state.player.size);

        // 绘制敌人
        ctx.fillStyle = '#ff0000';
        state.enemies.forEach(enemy => {
            ctx.fillRect(enemy.x - enemy.size/2,
                         enemy.y - enemy.size/2,
                         enemy.size,
                         enemy.size);
        });

        // 绘制物品
        ctx.fillStyle = '#ffff00';
        state.items.forEach(item => {
            ctx.beginPath();
            ctx.arc(item.x, item.y, item.size, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    spawnEnemy() {
        const state = this.system.getState();
        const newEnemy = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: 20,
            speed: 1 + Math.random() * 2,
            hp: 10 + Math.floor(state.level * 0.5)
        };

        // 确保敌人不会直接出现在玩家附近
        const distanceToPlayer = Math.sqrt(
            Math.pow(newEnemy.x - state.player.x, 2) +
            Math.pow(newEnemy.y - state.player.y, 2)
        );

        if (distanceToPlayer < 100) {
            // 重新定位敌人
            const angle = Math.random() * Math.PI * 2;
            newEnemy.x = state.player.x + Math.cos(angle) * 150;
            newEnemy.y = state.player.y + Math.sin(angle) * 150;

            // 确保不超出边界
            newEnemy.x = Math.max(newEnemy.size/2, Math.min(canvas.width - newEnemy.size/2, newEnemy.x));
            newEnemy.y = Math.max(newEnemy.size/2, Math.min(canvas.height - newEnemy.size/2, newEnemy.y));
        }

        state.enemies.push(newEnemy);
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

    startGameLoop() {
        this.gameLoop();
    }
}

// 存档模块
class SaveGameModule {
    constructor() {
        this.name = 'save';
        this.saveKey = 'rogue_game_save';
    }

    init(system) {
        this.system = system;
        console.log('💾 存档模块已初始化');
    }

    saveGame() {
        const state = this.system.getState();
        const saveData = {
            version: '1.0',
            timestamp: Date.now(),
            gameState: {
                ...state,
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
}

// 成就模块
class AchievementModule {
    constructor() {
        this.name = 'achievements';
    }

    init(system) {
        this.system = system;
        console.log('🏆 成就模块已初始化');
        this.achievements = [
            { id: 'first_blood', name: '首杀', description: '击杀第一个敌人', achieved: false },
            { id: 'survivor', name: '幸存者', description: '存活超过5分钟', achieved: false },
            { id: 'slayer', name: '屠夫', description: '击杀50个敌人', achieved: false },
            { id: 'collector', name: '收藏家', description: '收集10件物品', achieved: false }
        ];
    }

    checkAchievements() {
        const state = this.system.getState();

        this.achievements.forEach(achievement => {
            if (!achievement.achieved) {
                switch(achievement.id) {
                    case 'first_blood':
                        if (state.kills >= 1) {
                            this.unlockAchievement(achievement.id);
                        }
                        break;
                    case 'slayer':
                        if (state.kills >= 50) {
                            this.unlockAchievement(achievement.id);
                        }
                        break;
                }
            }
        });
    }

    unlockAchievement(id) {
        const achievement = this.achievements.find(a => a.id === id);
        if (achievement && !achievement.achieved) {
            achievement.achieved = true;
            console.log(`🎉 解锁成就: ${achievement.name}`);
        }
    }
}

// 创建优化的游戏系统实例
const optimizedGameSystem = new OptimizedGameSystem();

// 注册核心模块
const coreLogic = new CoreGameLogic();
const saveModule = new SaveGameModule();
const achievementModule = new AchievementModule();

optimizedGameSystem.registerModule('core', coreLogic);
optimizedGameSystem.registerModule('save', saveModule);
optimizedGameSystem.registerModule('achievements', achievementModule);

// 为了让其他脚本也能访问，挂载到window对象上
window.OptimizedGameSystem = optimizedGameSystem;
window.gameState = optimizedGameSystem.getState;

console.log('🚀 优化的游戏系统已准备就绪');