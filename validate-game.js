/**
 * 游戏功能验证脚本
 * 用于测试重构后的游戏核心功能是否正常运行
 */

// 验证全局游戏系统是否存在
function validateGlobalSystem() {
    console.log('🔍 验证全局游戏系统...');

    if (typeof window.RogueGame === 'undefined') {
        console.error('❌ RogueGame 全局对象未定义');
        return false;
    }

    if (typeof window.RogueGame.getState !== 'function') {
        console.error('❌ getState 方法未定义');
        return false;
    }

    if (typeof window.RogueGame.registerModule !== 'function') {
        console.error('❌ registerModule 方法未定义');
        return false;
    }

    console.log('✅ 全局游戏系统验证通过');
    return true;
}

// 验证游戏状态
function validateGameState() {
    console.log('🔍 验证游戏状态...');

    try {
        const state = window.RogueGame.getState();

        if (!state) {
            console.error('❌ 游戏状态为空');
            return false;
        }

        if (typeof state.player === 'undefined') {
            console.error('❌ 玩家状态未定义');
            return false;
        }

        if (typeof state.player.x === 'undefined' || typeof state.player.y === 'undefined') {
            console.error('❌ 玩家坐标未定义');
            return false;
        }

        console.log('✅ 游戏状态验证通过');
        return true;
    } catch (e) {
        console.error('❌ 验证游戏状态时出错:', e.message);
        return false;
    }
}

// 验证模块系统
function validateModuleSystem() {
    console.log('🔍 验证模块系统...');

    try {
        const modules = window.RogueGame.getLoadedModuleNames();

        if (!Array.isArray(modules)) {
            console.error('❌ getLoadedModuleNames 未返回数组');
            return false;
        }

        if (modules.length === 0) {
            console.warn('⚠️  未发现已加载的模块');
        } else {
            console.log(`✅ 发现 ${modules.length} 个已加载模块:`, modules);
        }

        return true;
    } catch (e) {
        console.error('❌ 验证模块系统时出错:', e.message);
        return false;
    }
}

// 验证性能系统
function validatePerformanceSystem() {
    console.log('🔍 验证性能系统...');

    try {
        if (!window.RogueGame.performanceMonitor) {
            console.error('❌ 性能监控器未定义');
            return false;
        }

        if (typeof window.RogueGame.reportPerformance !== 'function') {
            console.error('❌ reportPerformance 方法未定义');
            return false;
        }

        console.log('✅ 性能系统验证通过');
        return true;
    } catch (e) {
        console.error('❌ 验证性能系统时出错:', e.message);
        return false;
    }
}

// 运行所有验证
function runValidation() {
    console.log('🎮 开始验证游戏功能...');

    const results = [
        validateGlobalSystem(),
        validateGameState(),
        validateModuleSystem(),
        validatePerformanceSystem()
    ];

    const passedTests = results.filter(r => r).length;
    const totalTests = results.length;

    console.log(`\n📊 验证结果: ${passedTests}/${totalTests} 测试通过`);

    if (passedTests === totalTests) {
        console.log('🎉 所有验证通过！游戏系统正常运行。');
        return true;
    } else {
        console.error(`💥 ${totalTests - passedTests} 个验证失败，请检查游戏系统。`);
        return false;
    }
}

// 在页面加载完成后运行验证
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runValidation);
} else {
    // 如果文档已经加载完成，则直接运行验证
    setTimeout(runValidation, 100);
}

// 也提供手动运行验证的方法
window.runGameValidation = runValidation;

console.log('✅ 游戏功能验证脚本已加载');