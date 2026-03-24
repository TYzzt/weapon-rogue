/**
 * 游戏功能验证脚本
 * 用于测试整合后的游戏模块是否正常工作
 */

function validateGameSystem() {
    console.log('🔍 开始验证游戏系统...');

    const validationResults = {
        unifiedSystem: false,
        coreModule: false,
        audioModule: false,
        saveModule: false,
        achievementsModule: false,
        allModulesReady: false
    };

    // 验证统一模块系统
    if (typeof window.GameSystem !== 'undefined') {
        validationResults.unifiedSystem = true;
        console.log('✅ 统一模块系统已加载');
    } else {
        console.error('❌ 统一模块系统未加载');
    }

    // 验证各模块是否注册成功
    if (validationResults.unifiedSystem) {
        const modules = ['core', 'audio', 'save', 'achievements'];

        for (const moduleName of modules) {
            const module = window.GameSystem.getModule(moduleName);
            if (module) {
                validationResults[`${moduleName}Module`] = true;
                console.log(`✅ ${moduleName} 模块已注册`);

                // 验证模块是否有必需的方法
                if (moduleName === 'core') {
                    if (typeof module.startGame === 'function') {
                        console.log('✅ Core模块包含startGame方法');
                    } else {
                        console.error('❌ Core模块缺少startGame方法');
                    }
                } else if (moduleName === 'audio') {
                    if (typeof module.playSound === 'function') {
                        console.log('✅ Audio模块包含playSound方法');
                    } else {
                        console.error('❌ Audio模块缺少playSound方法');
                    }
                } else if (moduleName === 'save') {
                    if (typeof module.saveGame === 'function') {
                        console.log('✅ Save模块包含saveGame方法');
                    } else {
                        console.error('❌ Save模块缺少saveGame方法');
                    }
                } else if (moduleName === 'achievements') {
                    if (typeof module.checkAchievements === 'function') {
                        console.log('✅ Achievements模块包含checkAchievements方法');
                    } else {
                        console.error('❌ Achievements模块缺少checkAchievements方法');
                    }
                }
            } else {
                console.error(`❌ ${moduleName} 模块未注册`);
            }
        }

        // 检查所有模块是否都已准备就绪
        validationResults.allModulesReady = modules.every(mod => validationResults[`${mod}Module`]);

        if (validationResults.allModulesReady) {
            console.log('✅ 所有模块均已成功注册');
        } else {
            console.error('❌ 部分模块未正确注册');
        }
    }

    // 验证游戏状态
    if (validationResults.unifiedSystem) {
        try {
            const gameState = window.GameSystem.getState();
            if (gameState && typeof gameState === 'object') {
                console.log('✅ 游戏状态对象可访问');
                console.log('📊 当前游戏状态:', {
                    player: gameState.player,
                    level: gameState.level,
                    kills: gameState.kills
                });
            } else {
                console.error('❌ 无法访问游戏状态');
            }
        } catch (error) {
            console.error('❌ 访问游戏状态时出错:', error);
        }
    }

    // 验证向后兼容性接口
    const compatibilityFunctions = ['startGame', 'restartGame', 'pauseGame', 'resumeGame', 'saveGame', 'loadGame'];
    console.log('🔗 验证向后兼容性接口...');
    compatibilityFunctions.forEach(funcName => {
        if (typeof window[funcName] === 'function') {
            console.log(`✅ ${funcName} 兼容性接口可用`);
        } else {
            console.warn(`⚠️ ${funcName} 兼容性接口不可用`);
        }
    });

    // 输出验证摘要
    console.log('\n📋 验证摘要:');
    console.log(`统一模块系统: ${validationResults.unifiedSystem ? '✅' : '❌'}`);
    console.log(`核心模块: ${validationResults.coreModule ? '✅' : '❌'}`);
    console.log(`音频模块: ${validationResults.audioModule ? '✅' : '❌'}`);
    console.log(`存档模块: ${validationResults.saveModule ? '✅' : '❌'}`);
    console.log(`成就模块: ${validationResults.achievementsModule ? '✅' : '❌'}`);
    console.log(`所有模块就绪: ${validationResults.allModulesReady ? '✅' : '❌'}`);

    const totalChecks = Object.keys(validationResults).length;
    const passedChecks = Object.values(validationResults).filter(result => result).length;
    const successRate = (passedChecks / totalChecks) * 100;

    console.log(`\n📈 整体成功率: ${successRate.toFixed(1)}% (${passedChecks}/${totalChecks})`);

    return validationResults;
}

// 运行验证
setTimeout(() => {
    const results = validateGameSystem();

    // 评估整体健康状况
    if (results.allModulesReady && results.unifiedSystem) {
        console.log('\n🎉 游戏系统验证通过！所有核心功能正常工作。');
    } else {
        console.log('\n⚠️ 游戏系统存在一些问题，需要进一步调试。');
    }
}, 1000);

// 导出验证函数以供外部使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = validateGameSystem;
}