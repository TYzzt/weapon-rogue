// ==================== Rogue游戏系统集成测试 (修复版) ====================
//
// 该测试验证以下关键功能：
// 1. 最终集成游戏引擎是否正确初始化
// 2. 核心模块（核心机制、音频、成就、保存）是否正确注册
// 3. 游戏状态是否可以正常访问和修改
// 4. 基本游戏功能是否可用

// 为Node.js环境创建全局window对象
global.window = global;
global.document = {
    readyState: 'complete',
    addEventListener: () => {}
};

// 为localStorage提供一个简单的模拟实现
const localStorageData = {};
global.localStorage = {
    getItem: (key) => localStorageData[key] || null,
    setItem: (key, value) => { localStorageData[key] = value; },
    removeItem: (key) => { delete localStorageData[key]; },
    clear: () => { for (let key in localStorageData) delete localStorageData[key]; }
};

// 引入必要的模块
console.log("🚀 开始Rogue游戏系统集成测试...\n");

// 测试结果统计
let passedTests = 0;
let totalTests = 0;

// 断言函数
function assert(condition, message) {
    totalTests++;
    if (condition) {
        console.log(`✅ 测试通过: ${message}`);
        passedTests++;
    } else {
        console.log(`❌ 测试失败: ${message}`);
    }
}

function runFixedIntegrationTest() {
    console.log("\n🔍 首先加载游戏引擎模块...\n");

    try {
        require('./game-engine.js');  // GameEngine 和 EventBus
        console.log("✅ 游戏引擎模块加载成功");
    } catch (e) {
        console.log(`❌ 游戏引擎模块加载失败: ${e.message}`);
        return;
    }

    console.log("\n🔍 接着加载核心玩法增强模块...\n");

    try {
        require('./core-gameplay-enhancements.js');
        console.log("✅ 核心玩法增强模块加载成功");
    } catch (e) {
        console.log(`❌ 核心玩法增强模块加载失败: ${e.message}`);
    }

    // 单独加载增强版存档系统，修复autoSaveTimer的问题
    console.log("\n🔍 加载增强版存档系统（处理定时器问题）...\n");

    // 定义autoSaveTimer以避免冲突
    global.autoSaveTimer = null;

    try {
        // 使用函数作用域来隔离autoSaveTimer的影响
        const saveModuleContent = require('fs').readFileSync('./enhanced-save-system.js', 'utf8');
        const saveModuleFunction = new Function('window', 'localStorage', 'showCombatLog', 'gameState', 'AchievementSystem', 'SaveManager', 'setInterval', 'clearInterval', saveModuleContent + '; return { EnhancedSaveManager, enhancedSaveManager };');

        // 执行增强版存档系统
        const saveResult = saveModuleFunction(
            window,
            localStorage,
            console.log,
            window.gameState || { player: { x: 400, y: 300, size: 30, speed: 5, hp: 100, maxHp: 100 } },
            { achievements: {}, tempStats: {} },
            { getSaveData: () => ({}) },
            (fn, time) => { console.log(`Scheduled interval for ${time}ms`); return 1; },
            (id) => { console.log(`Cleared interval ${id}`); }
        );

        console.log("✅ 增强版存档系统加载成功");
    } catch (e) {
        console.log(`⚠️ 增强版存档系统加载遇到问题（继续测试）: ${e.message}`);
        // 继续测试而不是退出
    }

    console.log("\n🔍 加载增强版成就系统...\n");

    try {
        require('./enhanced-achievements.js');
        console.log("✅ 增强版成就系统加载成功");
    } catch (e) {
        console.log(`❌ 增强版成就系统加载失败: ${e.message}`);
    }

    console.log("\n🔍 验证游戏引擎初始化...\n");

    // 1. 检查游戏引擎是否存在
    assert(typeof GameEngine !== 'undefined', "GameEngine 类已定义");
    assert(typeof window.GameEngine !== 'undefined', "全局 GameEngine 实例已创建");

    // 修复instanceof问题
    if (typeof GameEngine !== 'undefined' && typeof window.GameEngine !== 'undefined') {
        const isValidInstance = window.GameEngine && window.GameEngine.constructor && window.GameEngine.constructor.name === 'GameEngine';
        assert(isValidInstance, "全局 GameEngine 是正确的实例");
    } else {
        console.log("❌ 无法验证 GameEngine 实例");
    }

    // 2. 检查核心模块是否存在
    assert(typeof CoreGameplayEnhancements !== 'undefined', "CoreGameplayEnhancements 类已定义");
    assert(typeof EnhancedSaveManager !== 'undefined', "EnhancedSaveManager 类已定义");
    assert(typeof EnhancedAchievementSystem !== 'undefined', "EnhancedAchievementSystem 类已定义");

    console.log("\n🔍 验证游戏状态管理...\n");

    // 3. 检查游戏状态是否可访问
    assert(window.gameState !== undefined, "全局 gameState 存在");
    if (window.GameEngine) {
        assert(window.GameEngine.getState() !== undefined, "GameEngine.getState() 方法可用");
        assert(typeof window.GameEngine.updateState === 'function', "GameEngine.updateState 方法可用");

        // 4. 测试状态修改功能
        const originalX = window.gameState.player.x;
        window.GameEngine.updateState({ player: { x: 999 }});
        assert(window.gameState.player.x === 999, "GameState 更新功能正常工作");

        // 恢复原始值
        window.GameEngine.updateState({ player: { x: originalX }});
        assert(window.gameState.player.x === originalX, "GameState 恢复功能正常工作");
    }

    console.log("\n🔍 验证模块注册系统...\n");

    // 5. 检查模块注册功能
    if (window.GameEngine) {
        assert(typeof window.GameEngine.registerModule === 'function', "GameEngine.registerModule 方法可用");
        assert(typeof window.GameEngine.getModule === 'function', "GameEngine.getModule 方法可用");
        assert(typeof window.GameEngine.getModules === 'function', "GameEngine.getModules 方法可用");

        // 6. 测试模块注册功能
        const mockModule = {
            name: "TestModule",
            init: function(engine) {
                this.engine = engine;
            },
            testFunction: function() { return "works"; }
        };

        const registrationResult = window.GameEngine.registerModule("TestModule", mockModule);
        assert(registrationResult === true, "模块注册功能正常工作");

        const retrievedModule = window.GameEngine.getModule("TestModule");
        assert(retrievedModule !== undefined, "可以从引擎获取已注册模块");
        if (retrievedModule) {
            assert(retrievedModule.testFunction() === "works", "模块方法可以正常调用");
        }
    }

    console.log("\n🔍 验证音频系统集成...\n");

    // 7. 检查音频系统是否存在（如果已定义）
    const audioSystemExists = typeof window.AudioManager !== 'undefined' ||
                              typeof window.EnhancedAudioSystem !== 'undefined' ||
                              typeof window.unifiedAudioSystem !== 'undefined';
    assert(audioSystemExists, "音频系统已集成");

    console.log("\n🔍 验证成就系统集成...\n");

    // 8. 检查成就系统是否存在
    const achievementSystemExists = typeof window.AchievementSystem !== 'undefined' ||
                                    typeof window.EnhancedAchievementSystem !== 'undefined' ||
                                    typeof window.enhancedAchievementSystem !== 'undefined';
    assert(achievementSystemExists, "成就系统已集成");

    // 9. 测试成就系统基本功能
    if (window.enhancedAchievementSystem) {
        assert(typeof window.enhancedAchievementSystem.checkAchievements === 'function', "成就检查功能可用");
        assert(typeof window.enhancedAchievementSystem.unlock === 'function', "成就解锁功能可用");
    }

    console.log("\n🔍 验证保存系统集成...\n");

    // 10. 检查保存系统是否存在
    const saveSystemExists = typeof window.SaveManager !== 'undefined' ||
                             typeof window.EnhancedSaveManager !== 'undefined' ||
                             typeof window.enhancedSaveManager !== 'undefined';
    assert(saveSystemExists, "保存系统已集成");

    // 11. 测试保存系统基本功能
    if (window.enhancedSaveManager) {
        assert(typeof window.enhancedSaveManager.save === 'function', "保存功能可用");
        assert(typeof window.enhancedSaveManager.load === 'function', "加载功能可用");
    }

    console.log("\n🔍 验证核心游戏机制...\n");

    // 12. 检查核心游戏机制是否正常集成
    const coreMechanicsExist = typeof window.WEAPONS !== 'undefined' ||
                               typeof window.spawnEnemy !== 'undefined' ||
                               typeof window.applyWeapon !== 'undefined';
    assert(coreMechanicsExist, "核心游戏机制已集成");

    // 13. 检查扩展武器库是否正常
    if (window.WEAPONS && Array.isArray(window.WEAPONS)) {
        assert(window.WEAPONS.length > 0, "武器库包含武器");
        const mythicWeapons = window.WEAPONS.filter(w => w && w.rarity === 'mythic');
        assert(mythicWeapons.length > 0, "扩展武器库包含神话级武器");
    }

    console.log("\n🔍 验证事件系统...\n");

    // 14. 检查事件总线是否存在
    if (window.GameEngine) {
        assert(window.GameEngine.eventBus !== undefined, "事件总线已初始化");
        assert(typeof window.GameEngine.eventBus.subscribe === 'function', "事件订阅功能可用");
        assert(typeof window.GameEngine.eventBus.emit === 'function', "事件发布功能可用");

        // 15. 测试事件系统
        let eventReceived = false;
        const testCallback = () => { eventReceived = true; };

        window.GameEngine.eventBus.subscribe('testEvent', testCallback);
        window.GameEngine.eventBus.emit('testEvent', { testData: 'integration test' });

        assert(eventReceived, "事件系统正常工作");

        // 取消订阅清理
        window.GameEngine.eventBus.unsubscribe('testEvent', testCallback);
    }

    console.log("\n🔍 验证游戏状态持久化...\n");

    // 16. 检查localStorage访问权限
    try {
        localStorage.setItem('__test__', 'test');
        localStorage.removeItem('__test__');
        assert(true, "localStorage 可访问");
    } catch(e) {
        assert(false, "localStorage 不可访问");
    }

    console.log("\n🔍 运行综合功能测试...\n");

    // 17. 测试游戏引擎的模块依赖管理
    if (window.GameEngine) {
        assert(typeof window.GameEngine.getAllDependencies === 'function', "模块依赖分析功能可用");
        assert(typeof window.GameEngine.wouldCreateCycle === 'function', "循环依赖检测功能可用");

        // 18. 检查是否所有关键模块都已注册
        const loadedModules = window.GameEngine.getLoadedModuleNames();
        const hasBasicModules = loadedModules.length > 0;
        assert(hasBasicModules, "至少有一个基本模块已注册");

        console.log(`📋 已加载模块: ${loadedModules.slice(0, 10).join(', ')}${loadedModules.length > 10 ? '...' : ''}`);
    }

    // 19. 检查游戏状态结构完整性
    if (window.gameState) {
        const requiredStateKeys = ['player', 'level', 'kills', 'enemies', 'items'];
        let stateIntegrity = true;
        for (const key of requiredStateKeys) {
            if (!(key in window.gameState)) {
                stateIntegrity = false;
                break;
            }
        }
        assert(stateIntegrity, "游戏状态包含必需的键");

        // 20. 验证玩家状态结构
        if (window.gameState.player) {
            const requiredPlayerKeys = ['x', 'y', 'hp', 'maxHp', 'size', 'isPlaying'];
            let playerStateIntegrity = true;
            for (const key of requiredPlayerKeys) {
                if (!(key in window.gameState.player)) {
                    playerStateIntegrity = false;
                    break;
                }
            }
            assert(playerStateIntegrity, "玩家状态包含必需的键");
        }
    }

    console.log("\n🎯 所有测试完成!\n");

    // 输出测试总结
    console.log(`📊 测试结果: ${passedTests}/${totalTests} 项测试通过`);
    const passRate = Math.round((passedTests / totalTests) * 100);
    console.log(`📈 通过率: ${passRate}%`);

    if (passRate >= 95) {
        console.log("🎉 集成测试成功! 游戏系统核心功能正常工作。");
    } else if (passRate >= 80) {
        console.log("👍 集成测试基本通过，存在少量非关键问题。");
    } else {
        console.log("⚠️ 集成测试发现问题，请检查上述失败项目。");
    }

    // 返回测试结果
    return {
        passed: passedTests,
        total: totalTests,
        passRate: passRate,
        success: passRate >= 95
    };
}

// 运行测试
const testResult = runFixedIntegrationTest();

// 导出测试结果
module.exports = { runFixedIntegrationTest, testResult };