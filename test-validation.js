/**
 * 游戏功能验证脚本
 * 测试游戏核心功能是否正常工作
 */

// 等待游戏系统加载完成
function waitForGameSystem(timeout = 5000) {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();

        function check() {
            if (window.OptimizedGameSystem && window.RogueGame) {
                resolve(true);
            } else if (Date.now() - startTime > timeout) {
                reject(new Error('游戏系统加载超时'));
            } else {
                setTimeout(check, 100);
            }
        }

        check();
    });
}

// 验证游戏状态管理
function testGameState() {
    console.log('🧪 开始测试游戏状态管理...');

    try {
        const gameState = window.OptimizedGameSystem.getState();

        if (!gameState) {
            throw new Error('游戏状态未定义');
        }

        if (!gameState.player) {
            throw new Error('玩家状态未定义');
        }

        if (typeof gameState.player.hp !== 'number') {
            throw new Error('玩家HP不是数字类型');
        }

        console.log('✅ 游戏状态管理正常');
        return true;
    } catch (error) {
        console.error('❌ 游戏状态管理测试失败:', error.message);
        return false;
    }
}

// 验证模块系统
function testModuleSystem() {
    console.log('🧪 开始测试模块系统...');

    try {
        const modules = [
            'core',
            'audio',
            'achievements',
            'save',
            'integrated'
        ];

        for (const moduleName of modules) {
            const module = window.OptimizedGameSystem.getModule(moduleName);
            if (!module) {
                throw new Error(`模块 ${moduleName} 未找到`);
            }
        }

        console.log('✅ 模块系统正常');
        return true;
    } catch (error) {
        console.error('❌ 模块系统测试失败:', error.message);
        return false;
    }
}

// 验证基本游戏功能
function testBasicGameFunctions() {
    console.log('🧪 开始测试基本游戏功能...');

    try {
        // 检查RogueGame接口
        if (typeof window.RogueGame.startGame !== 'function') {
            throw new Error('startGame 方法不存在');
        }

        if (typeof window.RogueGame.pauseGame !== 'function') {
            throw new Error('pauseGame 方法不存在');
        }

        if (typeof window.RogueGame.resumeGame !== 'function') {
            throw new Error('resumeGame 方法不存在');
        }

        if (typeof window.RogueGame.restartGame !== 'function') {
            throw new Error('restartGame 方法不存在');
        }

        if (typeof window.RogueGame.saveGame !== 'function') {
            throw new Error('saveGame 方法不存在');
        }

        if (typeof window.RogueGame.loadGame !== 'function') {
            throw new Error('loadGame 方法不存在');
        }

        console.log('✅ 基本游戏功能正常');
        return true;
    } catch (error) {
        console.error('❌ 基本游戏功能测试失败:', error.message);
        return false;
    }
}

// 验证事件系统
function testEventSystem() {
    console.log('🧪 开始测试事件系统...');

    try {
        let eventTriggered = false;

        // 订阅一个测试事件
        window.OptimizedGameSystem.eventBus.subscribe('test-event', () => {
            eventTriggered = true;
        });

        // 发布测试事件
        window.OptimizedGameSystem.eventBus.emit('test-event', { testData: 'hello' });

        // 稍等一下让事件处理完成
        setTimeout(() => {
            if (!eventTriggered) {
                throw new Error('事件未被正确触发');
            }
        }, 50);

        console.log('✅ 事件系统正常');
        return true;
    } catch (error) {
        console.error('❌ 事件系统测试失败:', error.message);
        return false;
    }
}

// 运行所有测试
async function runAllTests() {
    console.log('🎮 开始运行游戏功能验证测试...');

    try {
        // 等待游戏系统加载
        await waitForGameSystem();
        console.log('✅ 游戏系统加载完成');

        // 运行各项测试
        const tests = [
            { name: '游戏状态管理', fn: testGameState },
            { name: '模块系统', fn: testModuleSystem },
            { name: '基本游戏功能', fn: testBasicGameFunctions },
            { name: '事件系统', fn: testEventSystem }
        ];

        let passedTests = 0;
        let totalTests = tests.length;

        for (const test of tests) {
            console.log(`\n--- ${test.name} ---`);
            if (await Promise.resolve(test.fn())) {
                passedTests++;
            }
        }

        console.log('\n📊 测试结果汇总:');
        console.log(`通过: ${passedTests}/${totalTests}`);

        if (passedTests === totalTests) {
            console.log('🎉 所有测试均已通过！游戏功能正常。');
            return true;
        } else {
            console.log('⚠️  部分测试失败，请检查游戏功能。');
            return false;
        }
    } catch (error) {
        console.error('❌ 测试过程中出现错误:', error.message);
        return false;
    }
}

// 在页面加载完成后运行测试
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        runAllTests();
    });
} else {
    runAllTests();
}

// 提供手动运行测试的函数
window.runGameValidationTests = runAllTests;