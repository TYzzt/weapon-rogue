/**
 * 全局变量冲突解决器
 * 删除多余的全局实例，确保只有一个游戏引擎运行
 */

// 清理函数 - 在所有模块加载前运行
function resolveGlobalConflicts() {
    console.log("🔧 开始解决全局变量冲突...");

    // 保留GameEngine作为主要引擎，移除可能导致冲突的重复定义
    const conflictingVars = [
        'GameManager',
        'GameSystem',
        'WeaponComboSystem',
        'SteamEnhancedWeaponSystem',
        'specialGameEvents',
        'difficultyManager',
        'regionSystem',
        'gameModeSystem',
        'progressTracker',
        'achievementSystem',
        'steamControllerSupport'
    ];

    conflictingVars.forEach(varName => {
        if (window[varName] && window[varName] !== window.GameEngine) {
            console.warn(`🗑️ 移除冲突的全局变量: ${varName}`);

            // 对于某些特定的系统，尝试将其功能集成到GameEngine中
            if (window[varName] && typeof window[varName].registerModule === 'function') {
                console.info(`🔄 尝试将 ${varName} 的模块迁移到 GameEngine`);
                // 这里可以实现模块迁移逻辑，如果源对象支持模块注册的话
            }

            // 删除冲突的全局变量，保留GameEngine
            delete window[varName];
        }
    });

    // 确保gameState指向正确的状态
    if (window.GameEngine) {
        window.gameState = window.GameEngine.getState();
    }

    console.log("✅ 全局变量冲突解决完成");
}

// 运行冲突解决器
resolveGlobalConflicts();

// 提供工具函数来安全地添加模块到引擎
function safeRegisterModule(name, moduleObj, dependencies = []) {
    if (window.GameEngine) {
        return window.GameEngine.registerModule(name, moduleObj, dependencies);
    } else {
        console.error("❌ GameEngine未初始化，请先加载game-engine.js");
        return false;
    }
}

// 提供向后兼容的函数
function getModule(name) {
    if (window.GameEngine) {
        return window.GameEngine.getModule(name);
    }
    return null;
}

function updateGameState(updates) {
    if (window.GameEngine) {
        window.GameEngine.updateState(updates);
    }
}