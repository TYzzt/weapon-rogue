/**
 * 游戏功能验证脚本
 * 测试核心玩法功能是否正常
 */

// 创建一个简单的测试函数
async function validateCoreGameplay() {
    console.log('🔍 开始验证核心游戏功能...');

    let testsPassed = 0;
    let totalTests = 0;

    // 测试1: 检查GameEngine是否存在
    totalTests++;
    if (typeof window.GameEngine !== 'undefined') {
        console.log('✅ GameEngine 已定义');
        testsPassed++;
    } else {
        console.error('❌ GameEngine 未定义');
    }

    // 测试2: 检查核心模块是否存在
    totalTests++;
    if (window.GameEngine && window.GameEngine.getModule('core')) {
        console.log('✅ 核心模块已注册');
        testsPassed++;
    } else {
        console.error('❌ 核心模块未找到');
    }

    // 测试3: 检查状态管理
    totalTests++;
    if (window.gameState) {
        console.log('✅ 游戏状态已定义');
        testsPassed++;
    } else {
        console.error('❌ 游戏状态未定义');
    }

    // 测试4: 检查关键游戏函数
    totalTests++;
    const coreModule = window.GameEngine ? window.GameEngine.getModule('core') : null;
    if (coreModule && typeof coreModule.startGame === 'function') {
        console.log('✅ startGame 函数可用');
        testsPassed++;
    } else {
        console.error('❌ startGame 函数不可用');
    }

    // 测试5: 尝试开始游戏
    totalTests++;
    try {
        if (coreModule) {
            // 备份原始函数
            const originalStartGame = coreModule.startGame;

            // 监听游戏开始
            let gameStarted = false;
            coreModule.startGame = function() {
                gameStarted = true;
                originalStartGame.call(this);
                console.log('🎮 游戏启动成功');
            };

            // 尝试启动游戏
            coreModule.startGame();

            if (gameStarted) {
                console.log('✅ 游戏启动功能正常');
                testsPassed++;
            } else {
                console.error('❌ 游戏启动功能异常');
            }

            // 恢复原函数
            coreModule.startGame = originalStartGame;
        } else {
            console.error('❌ 无法测试游戏启动 - 核心模块不可用');
        }
    } catch (error) {
        console.error('❌ 游戏启动测试出错:', error);
    }

    // 测试6: 检查存档模块
    totalTests++;
    if (window.GameEngine && window.GameEngine.getModule('save')) {
        console.log('✅ 存档模块已注册');
        testsPassed++;
    } else {
        console.error('❌ 存档模块未找到');
    }

    // 测试7: 检查成就模块
    totalTests++;
    if (window.GameEngine && window.GameEngine.getModule('achievements')) {
        console.log('✅ 成就模块已注册');
        testsPassed++;
    } else {
        console.error('❌ 成就模块未找到');
    }

    // 测试8: 检查模块整合器
    totalTests++;
    if (typeof window.safeRegisterModule === 'function') {
        console.log('✅ 模块注册函数可用');
        testsPassed++;
    } else {
        console.error('❌ 模块注册函数不可用');
    }

    // 测试9: 检查性能优化器
    totalTests++;
    if (typeof window.PerformanceOptimizer !== 'undefined') {
        console.log('✅ 性能优化器已加载');
        testsPassed++;
    } else {
        console.error('❌ 性能优化器未加载');
    }

    // 测试10: 检查冲突解决器
    totalTests++;
    if (typeof window.resolveGlobalConflicts !== 'undefined') {
        console.log('✅ 冲突解决器已加载');
        testsPassed++;
    } else {
        console.error('❌ 冲突解决器未加载');
    }

    // 输出结果
    console.log(`\n📊 测试结果: ${testsPassed}/${totalTests} 项测试通过`);

    if (testsPassed === totalTests) {
        console.log('🎉 所有核心功能验证通过！');
        return true;
    } else {
        const failedCount = totalTests - testsPassed;
        console.warn(`⚠️  ${failedCount} 项测试失败，请检查上述错误`);
        return false;
    }
}

// 运行验证
setTimeout(async () => {
    // 等待页面和脚本加载完成
    if (document.readyState !== 'loading') {
        await validateCoreGameplay();
    } else {
        document.addEventListener('DOMContentLoaded', async () => {
            await validateCoreGameplay();
        });
    }
}, 1000);

console.log('🔬 游戏功能验证器已加载，将在页面加载完成后运行测试');