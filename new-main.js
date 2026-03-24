/**
 * Rogue游戏 - 简化主入口
 * 使用优化的游戏引擎，避免模块冲突和性能问题
 */

// 引入优化的游戏引擎
import './optimized-game-engine.js';

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', () => {
    // 获取画布和上下文
    const canvas = document.getElementById('gameCanvas') || (() => {
        // 如果没有找到画布，创建一个
        const newCanvas = document.createElement('canvas');
        newCanvas.id = 'gameCanvas';
        newCanvas.width = 800;
        newCanvas.height = 600;
        document.body.appendChild(newCanvas);
        return newCanvas;
    })();

    const ctx = canvas.getContext('2d');

    // 设置画布尺寸
    canvas.width = 800;
    canvas.height = 600;

    // 等待游戏引擎初始化完成
    const startGameWhenReady = () => {
        if (window.OptimizedGameEngine) {
            // 获取核心模块
            const coreModule = window.OptimizedGameEngine.getModule('core');

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
                gameState.player.isGameOver = true;
                console.log('🔄 游戏重置');
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

    console.log('🎯 游戏系统已准备就绪');
});

// 兼容旧的游戏函数接口
window.startGame = () => {
    if (window.OptimizedGameEngine) {
        const coreModule = window.OptimizedGameEngine.getModule('core');
        if (coreModule && typeof coreModule.startGame === 'function') {
            coreModule.startGame();
        }
    }
};

window.saveGame = () => {
    if (window.OptimizedGameEngine) {
        const saveModule = window.OptimizedGameEngine.getModule('save');
        if (saveModule && typeof saveModule.saveGame === 'function') {
            return saveModule.saveGame();
        }
    }
    return false;
};

window.loadGame = () => {
    if (window.OptimizedGameEngine) {
        const saveModule = window.OptimizedGameEngine.getModule('save');
        if (saveModule && typeof saveModule.loadGame === 'function') {
            return saveModule.loadGame();
        }
    }
    return false;
};

console.log('🚀 Rogue游戏主入口已加载');