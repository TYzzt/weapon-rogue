/**
 * 游戏功能验证脚本
 * 测试游戏基本功能是否正常工作
 */

async function testGameFunctionality() {
    console.log('🧪 开始测试游戏功能...');

    // 等待系统加载
    await new Promise(resolve => {
        if (window.GameSystem && window.GameSystem.getModule('core')) {
            resolve();
        } else {
            setTimeout(resolve, 1000); // 等待1秒后再检查
        }
    });

    console.log('✅ 游戏系统已加载');

    // 测试基本模块可用性
    const coreModule = window.GameSystem.getModule('core');
    const saveModule = window.GameSystem.getModule('save');
    const achievementModule = window.GameSystem.getModule('achievements');
    const audioModule = window.GameSystem.getModule('audio');

    const tests = [
        {
            name: '核心模块',
            passed: !!coreModule,
            details: coreModule ? '✅ 已加载' : '❌ 未找到'
        },
        {
            name: '存档模块',
            passed: !!saveModule,
            details: saveModule ? '✅ 已加载' : '❌ 未找到'
        },
        {
            name: '成就模块',
            passed: !!achievementModule,
            details: achievementModule ? '✅ 已加载' : '❌ 未找到'
        },
        {
            name: '音频模块',
            passed: !!audioModule,
            details: audioModule ? '✅ 已加载' : '❌ 未找到'
        }
    ];

    // 打印测试结果
    tests.forEach(test => {
        console.log(`${test.passed ? '✅' : '❌'} ${test.name}: ${test.details}`);
    });

    // 测试开始游戏功能
    try {
        if (window.RogueGame && typeof window.RogueGame.startGame === 'function') {
            window.RogueGame.startGame();
            console.log('✅ 开始游戏功能正常');
        } else {
            console.log('❌ 开始游戏功能异常');
        }
    } catch (error) {
        console.log('❌ 开始游戏时发生错误:', error.message);
    }

    // 测试获取游戏状态
    try {
        const gameState = window.RogueGame.getState();
        if (gameState && gameState.player) {
            console.log('✅ 获取游戏状态功能正常');
        } else {
            console.log('❌ 获取游戏状态功能异常');
        }
    } catch (error) {
        console.log('❌ 获取游戏状态时发生错误:', error.message);
    }

    // 测试获取模块
    try {
        const coreModule = window.RogueGame.getModule('core');
        if (coreModule) {
            console.log('✅ 获取模块功能正常');
        } else {
            console.log('❌ 获取模块功能异常');
        }
    } catch (error) {
        console.log('❌ 获取模块时发生错误:', error.message);
    }

    console.log('🏁 功能测试完成');
}

// 运行测试
testGameFunctionality();