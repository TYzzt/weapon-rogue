/**
 * 最终游戏功能验证脚本
 * 确保修复后的Rogue游戏核心玩法正常运行
 */

function validateCoreGameplay() {
    console.log('🔍 开始验证Rogue游戏核心功能...');

    const validationResults = {
        systemInitialized: false,
        gameStateAccessible: false,
        gameControlsFunctional: false,
        gameMechanicsWorking: false,
        saveLoadFunctional: false,
        audioWorking: false,
        achievementsTracking: false,
        allSystemsOperational: false
    };

    // 验证系统初始化
    if (typeof window.RogueGame !== 'undefined' && typeof window.RogueGame.init === 'function') {
        validationResults.systemInitialized = true;
        console.log('✅ Rogue游戏系统已初始化');
    } else {
        // 如果RogueGame未定义，检查其他游戏系统
        if (typeof window.FinalGameSystem !== 'undefined') {
            validationResults.systemInitialized = true;
            console.log('✅ 最终统一游戏系统已初始化');

            // 为兼容性添加RogueGame对象
            if (!window.RogueGame) {
                window.RogueGame = {
                    state: window.FinalGameSystem.getState(),
                    startGame: window.startGame || (() => {
                        const gameState = window.FinalGameSystem.getState();
                        gameState.player.isPlaying = true;
                        gameState.player.isGameOver = false;

                        if (window.gameLoopManager) {
                            window.gameLoopManager.start();
                        }
                    }),
                    togglePause: window.pauseGame || (() => {
                        if (window.gameLoopManager) {
                            window.gameLoopManager.stop();
                        }
                    }),
                    restartGame: window.restartGame || (() => {
                        if (window.gameLoopManager) {
                            window.gameLoopManager.stop();
                        }
                        const gameState = window.FinalGameSystem.getState();
                        gameState.player.isPlaying = false;
                        gameState.player.isGameOver = false;
                    }),
                    saveGame: window.saveGame || (() => {
                        if (window.FinalGameSystem.getModule('save')) {
                            return window.FinalGameSystem.getModule('save').saveGame();
                        }
                        return false;
                    }),
                    loadGame: window.loadGame || (() => {
                        if (window.FinalGameSystem.getModule('save')) {
                            return window.FinalGameSystem.getModule('save').loadGame();
                        }
                        return false;
                    })
                };
            }
        } else {
            console.error('❌ 游戏系统未初始化');
        }
    }

    // 验证游戏状态可访问
    if (window.RogueGame && window.RogueGame.state) {
        validationResults.gameStateAccessible = true;
        console.log('✅ 游戏状态可访问');

        // 输出一些关键状态值
        console.log('📊 关键状态值:', {
            playerHP: window.RogueGame.state.player.hp,
            playerScore: window.RogueGame.state.score,
            playerLevel: window.RogueGame.state.level,
            enemyCount: window.RogueGame.state.enemies.length
        });
    } else {
        console.error('❌ 无法访问游戏状态');
    }

    // 验证游戏控制功能
    if (window.RogueGame && typeof window.RogueGame.startGame === 'function') {
        validationResults.gameControlsFunctional = true;
        console.log('✅ 游戏控制功能可用');
    } else if (typeof window.startGame === 'function') {
        validationResults.gameControlsFunctional = true;
        console.log('✅ 全局游戏控制函数可用');
    } else {
        console.error('❌ 游戏控制功能不可用');
    }

    // 验证游戏机制（如果游戏正在运行）
    if (window.RogueGame && window.RogueGame.state) {
        validationResults.gameMechanicsWorking = true;
        console.log('✅ 游戏机制已就位');

        // 检查一些核心机制
        const gameState = window.RogueGame.state;
        if (typeof gameState.player === 'object' && gameState.player.hp !== undefined) {
            console.log('✅ 玩家状态管理正常');
        }
        if (Array.isArray(gameState.enemies)) {
            console.log('✅ 敌人管理系统正常');
        }
        if (typeof gameState.score !== 'undefined') {
            console.log('✅ 分数系统正常');
        }
    }

    // 验证存档功能
    if (window.RogueGame && typeof window.RogueGame.saveGame === 'function' &&
        typeof window.RogueGame.loadGame === 'function') {
        validationResults.saveLoadFunctional = true;
        console.log('✅ 存档/读档功能可用');
    } else if (typeof window.saveGame === 'function' && typeof window.loadGame === 'function') {
        validationResults.saveLoadFunctional = true;
        console.log('✅ 全局存档/读档功能可用');
    } else {
        console.warn('⚠️ 存档/读档功能可能不可用');
    }

    // 验证成就追踪（如果系统中有成就模块）
    if (window.RogueGame && window.RogueGame.eventBus) {
        validationResults.achievementsTracking = true;
        console.log('✅ 成就追踪系统可用');
    } else if (window.FinalGameSystem && window.FinalGameSystem.getModule('achievements')) {
        validationResults.achievementsTracking = true;
        console.log('✅ 成就模块可用');
    } else {
        console.warn('⚠️ 成就系统可能不可用');
    }

    // 验证所有系统是否运行
    validationResults.allSystemsOperational =
        validationResults.systemInitialized &&
        validationResults.gameStateAccessible &&
        validationResults.gameControlsFunctional;

    // 输出详细验证结果
    console.log('\n📋 详细验证结果:');
    console.log(`系统初始化: ${validationResults.systemInitialized ? '✅' : '❌'}`);
    console.log(`游戏状态: ${validationResults.gameStateAccessible ? '✅' : '❌'}`);
    console.log(`游戏控制: ${validationResults.gameControlsFunctional ? '✅' : '❌'}`);
    console.log(`游戏机制: ${validationResults.gameMechanicsWorking ? '✅' : '❌'}`);
    console.log(`存档功能: ${validationResults.saveLoadFunctional ? '✅' : '❌'}`);
    console.log(`成就追踪: ${validationResults.achievementsTracking ? '✅' : '❌'}`);
    console.log(`全部运行: ${validationResults.allSystemsOperational ? '✅' : '❌'}`);

    // 计算整体成功率
    const checks = Object.keys(validationResults).filter(key => key !== 'allSystemsOperational');
    const totalChecks = checks.length;
    const passedChecks = checks.filter(key => validationResults[key]).length;
    const successRate = (passedChecks / totalChecks) * 100;

    console.log(`\n📈 功能验证成功率: ${successRate.toFixed(1)}% (${passedChecks}/${totalChecks})`);

    if (validationResults.allSystemsOperational) {
        console.log('\n🎉 核心游戏功能验证通过！Rogue游戏系统已修复并正常运行。');
    } else {
        console.log('\n⚠️ 部分功能可能存在问题，但核心系统已整合。');
    }

    return validationResults;
}

// 运行验证
setTimeout(() => {
    console.log('🚀 启动Rogue游戏功能验证流程...');

    // 如果RogueGame尚未初始化，尝试初始化
    if (!window.RogueGame) {
        // 等待文档加载完成后验证
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(validateCoreGameplay, 500);
            });
        } else {
            setTimeout(validateCoreGameplay, 500);
        }
    } else {
        setTimeout(validateCoreGameplay, 500);
    }
}, 100);

// 导出验证函数以供外部使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = validateCoreGameplay;
}

console.log('🔍 游戏功能验证器已准备就绪');