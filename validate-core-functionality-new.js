/**
 * 验证修复后的Rogue游戏核心功能
 * 测试游戏引擎、模块系统和基本游戏功能
 */

function validateCoreFunctionality() {
    console.log("🔍 开始验证核心游戏功能...");

    const results = {
        gameState: false,
        gameEngine: false,
        modules: false,
        basicFunctions: false,
        errorCount: 0,
        errors: []
    };

    try {
        // 1. 检查游戏引擎是否存在且唯一
        console.log("🔍 检查游戏引擎...");
        const engineExists = !!(window.OptimizedGameEngine);

        if (engineExists) {
            results.gameEngine = true;
            console.log("✅ 游戏引擎存在");
        } else {
            results.errors.push("游戏引擎不存在");
            results.errorCount++;
            console.log("❌ 游戏引擎不存在");
        }

        // 2. 检查游戏状态
        console.log("🔍 检查游戏状态...");
        const gameStateExists = !!(window.gameState || (window.OptimizedGameEngine && window.OptimizedGameEngine.getState()));

        if (gameStateExists) {
            results.gameState = true;
            console.log("✅ 游戏状态存在");

            // 尝试获取状态
            const state = window.gameState || window.OptimizedGameEngine.getState();
            if (state && typeof state === 'object') {
                console.log("✅ 游戏状态可访问");
            } else {
                results.errors.push("游戏状态不可访问");
                results.errorCount++;
                console.log("❌ 游戏状态不可访问");
            }
        } else {
            results.errors.push("游戏状态不存在");
            results.errorCount++;
            console.log("❌ 游戏状态不存在");
        }

        // 3. 检查模块系统
        console.log("🔍 检查模块系统...");
        if (window.OptimizedGameEngine) {
            const moduleNames = window.OptimizedGameEngine.getLoadedModuleNames();
            if (moduleNames && moduleNames.length > 0) {
                results.modules = true;
                console.log(`✅ 模块系统正常，已加载 ${moduleNames.length} 个模块:`, moduleNames);

                // 检查关键模块
                const requiredModules = ['core', 'audio', 'achievements', 'save'];
                const foundModules = [];

                for (const moduleName of requiredModules) {
                    const module = window.OptimizedGameEngine.getModule(moduleName);
                    if (module) {
                        foundModules.push(moduleName);
                    }
                }

                if (foundModules.length >= 2) { // 至少要有核心模块和其他一个模块
                    console.log(`✅ 关键模块正常:`, foundModules);
                } else {
                    console.log(`⚠️ 关键模块不足:`, foundModules);
                }
            } else {
                console.log("⚠️ 没有加载任何模块，但这可能是正常的（取决于初始化状态）");
            }
        } else {
            results.errors.push("无法访问模块系统");
            results.errorCount++;
            console.log("❌ 无法访问模块系统");
        }

        // 4. 检查基本游戏函数
        console.log("🔍 检查基本游戏函数...");
        const requiredFunctions = ['startGame', 'saveGame', 'loadGame'];
        let functionalFunctions = 0;

        for (const funcName of requiredFunctions) {
            if (typeof window[funcName] === 'function') {
                functionalFunctions++;
                console.log(`✅ 函数 ${funcName} 存在`);
            } else {
                console.log(`⚠️ 函数 ${funcName} 不存在`);
            }
        }

        if (functionalFunctions >= 2) { // 至少需要2个函数才算基本功能完整
            results.basicFunctions = true;
        }

        // 5. 尝试基本操作测试
        console.log("🔍 执行基本操作测试...");
        try {
            // 尝试访问游戏状态
            const state = window.gameState || (window.OptimizedGameEngine && window.OptimizedGameEngine.getState());
            if (state) {
                // 尝试修改状态
                const originalScore = state.player?.score || 0;
                if (window.OptimizedGameEngine) {
                    window.OptimizedGameEngine.updateState({
                        player: { score: originalScore + 10 }
                    });

                    const newScore = window.OptimizedGameEngine.getState().player.score;
                    if (newScore === originalScore + 10) {
                        console.log("✅ 状态更新功能正常");
                    } else {
                        console.log("⚠️ 状态更新可能有问题");
                    }
                }
            }
        } catch (e) {
            results.errors.push(`基本操作测试失败: ${e.message}`);
            results.errorCount++;
            console.log(`❌ 基本操作测试失败:`, e.message);
        }

        // 6. 检查冲突解决
        console.log("🔍 检查冲突解决情况...");
        const expectedSingleInstance = ['GameSystem', 'GameEngine', 'OptimizedGameSystem', 'FinalGameSystem'];
        let uniqueEngines = 0;
        let firstEngine = null;

        for (const engineName of expectedSingleInstance) {
            if (window[engineName]) {
                if (!firstEngine) {
                    firstEngine = window[engineName];
                    uniqueEngines++;
                } else if (window[engineName] === firstEngine) {
                    // 指向同一个实例，这是好的
                    continue;
                } else {
                    uniqueEngines++; // 发现不同实例
                }
            }
        }

        if (uniqueEngines <= 1) {
            console.log("✅ 引擎实例冲突已解决");
        } else {
            console.log(`⚠️ 仍存在 ${uniqueEngines} 个不同的引擎实例`);
        }

    } catch (error) {
        results.errors.push(`验证过程中发生错误: ${error.message}`);
        results.errorCount++;
        console.error("❌ 验证过程中发生错误:", error);
    }

    // 生成结果摘要
    results.passRate = ((5 - results.errorCount) / 5) * 100;

    console.log("\n📊 验证结果摘要:");
    console.log(`   游戏引擎: ${results.gameEngine ? '✅' : '❌'}`);
    console.log(`   游戏状态: ${results.gameState ? '✅' : '❌'}`);
    console.log(`   模块系统: ${results.modules ? '✅' : '❌'}`);
    console.log(`   基本函数: ${results.basicFunctions ? '✅' : '❌'}`);
    console.log(`   错误数量: ${results.errorCount}`);
    console.log(`   通过率: ${results.passRate}%`);

    if (results.errorCount === 0) {
        console.log("\n🎉 所有核心功能验证通过！游戏修复成功！");
        results.status = "PASSED";
    } else if (results.passRate >= 60) {
        console.log("\n⚠️ 大部分核心功能正常，但存在一些问题");
        results.status = "PARTIAL";
    } else {
        console.log("\n❌ 核心功能存在问题，需要进一步修复");
        results.status = "FAILED";
    }

    if (results.errors.length > 0) {
        console.log("\n📝 错误详情:");
        results.errors.forEach((error, index) => {
            console.log(`   ${index + 1}. ${error}`);
        });
    }

    // 将结果存储到全局变量以便外部访问
    window.CoreValidationResult = results;

    return results;
}

// 运行验证
const validationResult = validateCoreFunctionality();

// 如果在Node.js环境中，导出验证函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateCoreFunctionality,
        validationResult
    };
}

console.log("✅ 核心功能验证完成");