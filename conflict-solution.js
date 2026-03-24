/**
 * 冲突解决方案
 * 解决多个游戏引擎实例的冲突
 * 统一所有游戏系统到单一实例
 */

// 防止重复初始化
if (window.GameSystemResolver) {
    console.log("⚠️ 冲突解决方案已经运行过");
    return;
}

// 标记已运行
window.GameSystemResolver = true;

console.log("🔧 开始解决游戏系统冲突...");

// 定义所有可能冲突的全局变量
const conflictingGlobals = [
    'GameSystem',           // 统一模块系统
    'GameEngine',          // 游戏引擎
    'OptimizedGameSystem', // 优化游戏系统
    'FinalGameSystem',     // 最终游戏系统
    'UnifiedGameSystem',   // 统一游戏系统
    'GameManager',         // 游戏管理器
    'RogueGame',          // Rogue游戏
    'FinalGameSystem',     // 最终游戏系统
    'OptimizedGameEngine', // 优化游戏引擎
    'WeaponSystem',       // 武器系统
    'AchievementSystem',   // 成就系统
    'SaveSystem',         // 保存系统
    'AudioSystem',        // 音频系统
    'EnemySystem',        // 敌人系统
    'GameState'          // 游戏状态
];

// 保存引用，以便正确处理依赖关系
const savedInstances = {};

// 首先保存所有实例的引用
conflictingGlobals.forEach(name => {
    if (window[name]) {
        savedInstances[name] = window[name];
        console.log(`📦 保存 ${name} 实例`);
    }
});

// 统一到单一游戏引擎实例
let unifiedGameEngine = null;

// 寻找最佳引擎实例（优先选择功能完整的）
if (window.OptimizedGameEngine) {
    unifiedGameEngine = window.OptimizedGameEngine;
    console.log("🎯 使用 OptimizeGameEngine 作为统一引擎");
} else if (window.FinalGameSystem) {
    unifiedGameEngine = window.FinalGameSystem;
    console.log("🎯 使用 FinalGameSystem 作为统一引擎");
} else if (window.OptimizedGameSystem) {
    unifiedGameEngine = window.OptimizedGameSystem;
    console.log("🎯 使用 OptimizedGameSystem 作为统一引擎");
} else if (window.GameSystem) {
    unifiedGameEngine = window.GameSystem;
    console.log("🎯 使用 GameSystem 作为统一引擎");
} else {
    // 如果没有找到任何引擎，创建一个新的
    console.log("🏗️ 创建新的统一游戏引擎实例");
    unifiedGameEngine = {
        modules: new Map(),
        state: {},
        registerModule: function(name, moduleObj) {
            this.modules.set(name, moduleObj);
            console.log(`✅ 模块 ${name} 已注册`);
        },
        getModule: function(name) {
            return this.modules.get(name);
        },
        getState: function() {
            return this.state;
        },
        updateState: function(newState) {
            Object.assign(this.state, newState);
        }
    };
}

// 将统一引擎分配给所有冲突的全局变量
conflictingGlobals.forEach(name => {
    window[name] = unifiedGameEngine;
});

// 设置全局游戏状态引用
window.gameState = unifiedGameEngine.getState ? unifiedGameEngine.getState() : {};

// 清理不需要的实例以减少内存占用
Object.keys(savedInstances).forEach(name => {
    if (savedInstances[name] !== unifiedGameEngine) {
        console.log(`🧹 清理冲突的 ${name} 实例`);
        savedInstances[name] = null;
    }
});

// 解决模块重复注册问题
if (unifiedGameEngine && unifiedGameEngine.modules) {
    // 创建一个去重的模块注册函数
    const originalRegisterModule = unifiedGameEngine.registerModule ||
                                  (unifiedGameEngine.modules.set ?
                                   function(name, moduleObj) {
                                       this.modules.set(name, moduleObj);
                                   } : null);

    if (originalRegisterModule) {
        unifiedGameEngine.registerModule = function(name, moduleObj, dependencies = []) {
            // 检查模块是否已经存在
            if (this.modules.has(name)) {
                console.warn(`⚠️ 模块 ${name} 已存在，跳过重复注册`);
                return false;
            }

            // 调用原始注册函数
            return originalRegisterModule.call(this, name, moduleObj, dependencies);
        };
    }
}

console.log("✅ 游戏系统冲突解决完成");
console.log("🎮 统一游戏引擎已准备就绪");
console.log("💡 所有全局游戏变量现在指向同一实例");

// 如果有之前的模块需要迁移，这里处理
if (typeof migrateOldModules === 'function') {
    migrateOldModules(unifiedGameEngine);
}

export { unifiedGameEngine };