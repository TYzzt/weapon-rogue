/**
 * GameEngine 适配器
 * 为了让现有的模块系统能够使用新的 GameEngine
 */

// 检查 GameEngine 是否已存在
if (typeof window !== 'undefined' && window.GameEngine) {
    // 创建适配器，让旧的 GameSystem 接口映射到新的 GameEngine
    window.UnifiedGameSystem = window.GameEngine.constructor;

    // 确保 GameSystem 指向 GameEngine (用于向后兼容)
    if (!window.GameSystem) {
        window.GameSystem = window.GameEngine;
    }

    // 确保 GameManager 也指向 GameEngine (用于向后兼容)
    if (!window.GameManager) {
        window.GameManager = window.GameEngine;
    }

    console.log("🔄 GameEngine 适配器已激活，向后兼容模式启用");
} else {
    console.error("❌ GameEngine 未找到，请确保先加载 game-engine.js");
}

// 提供额外的兼容性函数
if (typeof window !== 'undefined' && window.GameEngine) {
    // 为了兼容老代码中可能使用的函数
    window.registerModule = function(name, moduleObj, dependencies = []) {
        return window.GameEngine.registerModule(name, moduleObj, dependencies);
    };

    window.getModule = function(name) {
        return window.GameEngine.getModule(name);
    };

    window.updateState = function(updates) {
        return window.GameEngine.updateState(updates);
    };

    window.getState = function() {
        return window.GameEngine.getState();
    };
}