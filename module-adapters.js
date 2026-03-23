/**
 * 适配器模块 - 用于集成原有功能到新的模块系统
 * 解决模块间的命名冲突和依赖问题
 */

// 敌人AI适配器
class EnemyAIAdapter {
    constructor() {
        this.name = 'EnemyAI';
    }

    init(gameSystem) {
        this.gameSystem = gameSystem;
        console.log('🤖 敌人AI模块已初始化');
    }

    update(deltaTime, gameState) {
        // 更新敌人AI逻辑
        this.updateEnemies(deltaTime, gameState);
    }

    render(ctx, gameState) {
        // 绘制敌人
        ctx.fillStyle = '#ff0000';
        gameState.enemies.forEach(enemy => {
            ctx.fillRect(enemy.x - enemy.size/2,
                         enemy.y - enemy.size/2,
                         enemy.size,
                         enemy.size);
        });
    }

    updateEnemies(deltaTime, gameState) {
        // 移动敌人向玩家靠近
        gameState.enemies.forEach(enemy => {
            // 计算到玩家的距离和方向
            const dx = gameState.player.x - enemy.x;
            const dy = gameState.player.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 0) {
                // 归一化方向向量
                const dirX = dx / distance;
                const dirY = dy / distance;

                // 移动敌人
                enemy.x += dirX * enemy.speed;
                enemy.y += dirY * enemy.speed;
            }
        });

        // 检查敌人与玩家碰撞
        gameState.enemies.forEach((enemy, index) => {
            const dx = gameState.player.x - enemy.x;
            const dy = gameState.player.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < (gameState.player.size/2 + enemy.size/2)) {
                // 玩家受到伤害
                gameState.player.hp -= 10;

                if (gameState.player.hp <= 0) {
                    gameState.player.hp = 0;
                    // 游戏结束逻辑
                    if (window.RogueGame) {
                        window.RogueGame.endGame();
                    }
                }

                // 移除敌人
                gameState.enemies.splice(index, 1);
            }
        });
    }

    onStart(gameState) {
        console.log('🤖 敌人AI启动');
    }
}

// 武器系统适配器
class WeaponAdapter {
    constructor() {
        this.name = 'WeaponSystem';
    }

    init(gameSystem) {
        this.gameSystem = gameSystem;
        console.log('⚔️ 武器系统已初始化');
    }

    update(deltaTime, gameState) {
        // 武器系统更新逻辑
    }

    render(ctx, gameState) {
        // 绘制武器效果（如果有）
    }

    onStart(gameState) {
        console.log('⚔️ 武器系统启动');
    }
}

// 音频系统适配器
class AudioAdapter {
    constructor() {
        this.name = 'AudioSystem';
        this.sounds = new Map();
        this.enabled = true;
    }

    init(gameSystem) {
        this.gameSystem = gameSystem;
        console.log('🎵 音频系统已初始化');
    }

    update(deltaTime, gameState) {
        // 音频系统更新逻辑
    }

    playSound(soundName) {
        if (!this.enabled) return;
        console.log(`🔊 播放音效: ${soundName}`);
    }

    toggle(enabled) {
        this.enabled = !!enabled;
        console.log(`🔊 音频系统: ${this.enabled ? '开启' : '关闭'}`);
    }

    onStart(gameState) {
        console.log('🎵 音频系统启动');
    }
}

// 成就系统适配器
class AchievementAdapter {
    constructor() {
        this.name = 'AchievementSystem';
        this.achievements = [];
        this.defaultAchievements = [
            { id: 'first_blood', name: '首杀', description: '击杀第一个敌人', achieved: false },
            { id: 'survivor', name: '幸存者', description: '存活超过5分钟', achieved: false },
            { id: 'slayer', name: '屠夫', description: '击杀50个敌人', achieved: false },
            { id: 'collector', name: '收藏家', description: '收集10件物品', achieved: false }
        ];
    }

    init(gameSystem) {
        this.gameSystem = gameSystem;
        console.log('🏆 成就系统已初始化');
    }

    update(deltaTime, gameState) {
        this.checkAchievements(gameState);
    }

    checkAchievements(gameState) {
        this.defaultAchievements.forEach(achievement => {
            if (!achievement.achieved) {
                switch(achievement.id) {
                    case 'first_blood':
                        if (gameState.kills >= 1) {
                            this.unlockAchievement(achievement.id, gameState);
                        }
                        break;
                    case 'slayer':
                        if (gameState.kills >= 50) {
                            this.unlockAchievement(achievement.id, gameState);
                        }
                        break;
                    case 'survivor':
                        if (gameState.sessionTime >= 300000) { // 5分钟
                            this.unlockAchievement(achievement.id, gameState);
                        }
                        break;
                }
            }
        });
    }

    unlockAchievement(id, gameState) {
        const achievement = this.defaultAchievements.find(a => a.id === id);
        if (achievement && !achievement.achieved) {
            achievement.achieved = true;
            console.log(`🎉 解锁成就: ${achievement.name}`);

            // 更新全局成就计数
            gameState.achievementCount = (gameState.achievementCount || 0) + 1;
        }
    }

    onStart(gameState) {
        console.log('🏆 成就系统启动');
    }
}

// 保存系统适配器
class SaveAdapter {
    constructor() {
        this.name = 'SaveSystem';
        this.saveKey = 'rogue_game_save';
    }

    init(gameSystem) {
        this.gameSystem = gameSystem;
        console.log('💾 保存系统已初始化');
    }

    saveGame(gameState) {
        const saveData = {
            version: '2.0',
            timestamp: Date.now(),
            gameState: {
                ...gameState,
                // 排除一些不适合保存的数据
                enemies: [],  // 不保存实时敌人位置
                items: [],    // 不保存实时物品位置
                combatLog: [] // 不保存战斗日志
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
                    // 返回保存的游戏状态
                    return parsedData.gameState;
                }
            }
        } catch (error) {
            console.error('❌ 加载游戏失败:', error);
        }

        return null;
    }

    onStart(gameState) {
        // 尝试自动加载游戏
        const savedState = this.loadGame();
        if (savedState) {
            Object.assign(gameState, savedState);
            console.log('📥 游戏进度已加载');
        }

        console.log('💾 保存系统启动');
    }
}

// 在系统初始化完成后注册这些适配器
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (window.RogueGame) {
            // 注册适配器模块
            window.RogueGame.registerModule('enemyAI', new EnemyAIAdapter());
            window.RogueGame.registerModule('weapons', new WeaponAdapter());
            window.RogueGame.registerModule('audio', new AudioAdapter());
            window.RogueGame.registerModule('achievements', new AchievementAdapter());
            window.RogueGame.registerModule('save', new SaveAdapter());

            console.log('🔌 所有适配器模块已注册');
        }
    }, 100);
});

console.log('🔄 模块适配器系统已加载');