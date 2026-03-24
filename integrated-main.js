/**
 * Rogue游戏 - 最终集成主入口
 * 使用最终集成的游戏引擎，解决所有模块冲突和性能问题
 */

// 引入最终集成游戏引擎
import './final-integrated-engine.js';

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', () => {
    // 获取或创建画布元素
    let canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'gameCanvas';
        canvas.width = 800;
        canvas.height = 600;
        canvas.style.border = '1px solid #fff';
        canvas.style.backgroundColor = '#000';
        document.body.appendChild(canvas);

        // 添加样式以居中显示画布
        canvas.style.display = 'block';
        canvas.style.margin = '20px auto';
        canvas.style.position = 'relative';
    }

    const ctx = canvas.getContext('2d');

    // 确保画布尺寸正确
    canvas.width = 800;
    canvas.height = 600;

    // 等待游戏引擎初始化完成
    const startGameWhenReady = () => {
        if (window.FinalIntegratedGameEngine) {
            // 获取核心模块
            const coreModule = window.FinalIntegratedGameEngine.getModule('core');

            if (coreModule) {
                // 启动游戏循环
                coreModule.gameLoop(canvas, ctx);

                console.log('🎮 游戏主循环已启动');
            } else {
                console.error('❌ 核心模块未找到');
            }
        } else {
            // 如果引擎还没准备好，稍后再试
            setTimeout(startGameWhenReady, 100);
        }
    };

    // 开始游戏
    startGameWhenReady();

    // 设置键盘事件监听
    document.addEventListener('keydown', (e) => {
        const gameState = window.gameState;

        if (!gameState || !gameState.player.isPlaying) return;

        // 简单的按键处理
        switch(e.key.toLowerCase()) {
            case ' ':
                // 空格键 - 重置游戏
                if (gameState.player.isPlaying) {
                    gameState.player.isGameOver = true;
                    console.log('🔄 游戏结束');
                } else {
                    // 重启游戏
                    Object.assign(gameState, {
                        player: {
                            x: 400,
                            y: 300,
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
                        mouseX: 400,
                        mouseY: 300,
                        enemySpawnTimer: 0,
                        enemySpawnRate: 2000,
                        combatLog: [],
                        startTime: Date.now()
                    });

                    const coreModule = window.FinalIntegratedGameEngine.getModule('core');
                    if (coreModule) {
                        coreModule.gameLoop(canvas, ctx);
                    }
                    console.log('🎮 游戏重新开始');
                }
                break;
            case 's':
                // S键 - 保存游戏
                const saveSystem = window.FinalIntegratedGameEngine.getModule('save');
                if (saveSystem) {
                    saveSystem.saveGame();
                }
                break;
            case 'l':
                // L键 - 加载游戏
                const loadSystem = window.FinalIntegratedGameEngine.getModule('save');
                if (loadSystem) {
                    loadSystem.loadGame();
                }
                break;
            default:
                // 其他按键可以根据需要处理
                break;
        }
    });

    // 设置鼠标移动事件以跟踪玩家方向
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        window.gameState.mouseX = e.clientX - rect.left;
        window.gameState.mouseY = e.clientY - rect.top;
    });

    // 添加暂停/恢复功能
    let gamePaused = false;
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            gamePaused = !gamePaused;
            if (gamePaused) {
                gameState.player.isPlaying = false;
                console.log('⏸️ 游戏已暂停');
            } else {
                gameState.player.isPlaying = true;
                console.log('▶️ 游戏已恢复');
                // 重启游戏循环
                const coreModule = window.FinalIntegratedGameEngine.getModule('core');
                if (coreModule) {
                    coreModule.gameLoop(canvas, ctx);
                }
            }
        }
    });

    console.log('🎯 游戏系统已准备就绪');
});

// 兼容旧的游戏函数接口
window.startGame = () => {
    if (window.FinalIntegratedGameEngine) {
        const coreModule = window.FinalIntegratedGameEngine.getModule('core');
        if (coreModule && typeof coreModule.startGame === 'function') {
            coreModule.startGame();
        }
    }
};

window.saveGame = () => {
    if (window.FinalIntegratedGameEngine) {
        const saveModule = window.FinalIntegratedGameEngine.getModule('save');
        if (saveModule && typeof saveModule.saveGame === 'function') {
            return saveModule.saveGame();
        }
    }
    return false;
};

window.loadGame = () => {
    if (window.FinalIntegratedGameEngine) {
        const saveModule = window.FinalIntegratedGameEngine.getModule('save');
        if (saveModule && typeof saveModule.loadGame === 'function') {
            return saveModule.loadGame();
        }
    }
    return false;
};

console.log('🚀 Rogue游戏最终集成主入口已加载');