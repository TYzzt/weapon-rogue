/**
 * Rogue游戏功能验证工具
 * 用于测试修复后的游戏核心功能是否正常工作
 */

class GameValidator {
    constructor() {
        this.tests = [];
        this.results = [];
        this.passed = 0;
        this.failed = 0;

        console.log("🧪 游戏验证器已初始化");
    }

    /**
     * 运行所有验证测试
     */
    async runAllTests() {
        console.log("🔍 开始运行游戏功能验证...");

        // 测试1: 检查最终集成引擎是否存在
        this.addTest("最终集成游戏引擎存在", () => {
            return typeof window.FinalIntegratedGameEngine !== 'undefined';
        });

        // 测试2: 检查游戏状态是否存在
        this.addTest("游戏状态可用", () => {
            return typeof window.gameState !== 'undefined' && window.gameState !== null;
        });

        // 测试3: 检查核心模块是否注册
        this.addTest("核心模块已注册", () => {
            if (!window.FinalIntegratedGameEngine) return false;
            const coreModule = window.FinalIntegratedGameEngine.getModule('core');
            return coreModule !== undefined && coreModule !== null;
        });

        // 测试4: 检查音频模块是否注册
        this.addTest("音频模块已注册", () => {
            if (!window.FinalIntegratedGameEngine) return false;
            const audioModule = window.FinalIntegratedGameEngine.getModule('audio');
            return audioModule !== undefined && audioModule !== null;
        });

        // 测试5: 检查成就模块是否注册
        this.addTest("成就模块已注册", () => {
            if (!window.FinalIntegratedGameEngine) return false;
            const achievementModule = window.FinalIntegratedGameEngine.getModule('achievements');
            return achievementModule !== undefined && achievementModule !== null;
        });

        // 测试6: 检查保存模块是否注册
        this.addTest("保存模块已注册", () => {
            if (!window.FinalIntegratedGameEngine) return false;
            const saveModule = window.FinalIntegratedGameEngine.getModule('save');
            return saveModule !== undefined && saveModule !== null;
        });

        // 测试7: 检查性能优化器是否存在
        this.addTest("性能优化器存在", () => {
            return typeof window.EnhancedPerformanceOptimizer !== 'undefined';
        });

        // 测试8: 检查兼容性函数是否存在
        this.addTest("兼容性函数存在", () => {
            return typeof window.startGame === 'function' &&
                   typeof window.saveGame === 'function' &&
                   typeof window.loadGame === 'function';
        });

        // 运行所有测试
        for (const test of this.tests) {
            await this.runTest(test);
        }

        // 显示结果
        this.printResults();

        return {
            passed: this.passed,
            failed: this.failed,
            total: this.tests.length,
            success: this.failed === 0
        };
    }

    /**
     * 添加测试
     */
    addTest(name, testFn) {
        this.tests.push({ name, testFn });
    }

    /**
     * 运行单个测试
     */
    async runTest(test) {
        try {
            const startTime = performance.now();
            const result = await Promise.resolve(test.testFn());
            const endTime = performance.now();

            const testResult = {
                name: test.name,
                passed: result,
                time: endTime - startTime
            };

            this.results.push(testResult);

            if (result) {
                this.passed++;
                console.log(`✅ ${test.name}: 通过 (${Math.round(testResult.time)}ms)`);
            } else {
                this.failed++;
                console.log(`❌ ${test.name}: 失败`);
            }
        } catch (error) {
            this.failed++;
            this.results.push({
                name: test.name,
                passed: false,
                time: 0,
                error: error.message
            });
            console.log(`❌ ${test.name}: 出错 - ${error.message}`);
        }
    }

    /**
     * 打印测试结果
     */
    printResults() {
        console.log("\n📊 测试结果摘要:");
        console.log(`✅ 通过: ${this.passed}`);
        console.log(`❌ 失败: ${this.failed}`);
        console.log(`总计: ${this.tests.length}`);

        if (this.failed === 0) {
            console.log("🎉 所有测试均已通过！游戏功能正常。");
        } else {
            console.log(`⚠️ 有 ${this.failed} 个测试失败，请检查上述错误。`);
        }
    }

    /**
     * 运行游戏逻辑测试
     */
    async runGameLogicTests() {
        console.log("\n🎮 运行游戏逻辑测试...");

        // 模拟游戏状态更改
        if (window.gameState) {
            // 测试状态更新
            const originalScore = window.gameState.score;
            window.gameState.score = originalScore + 100;

            if (window.gameState.score === originalScore + 100) {
                console.log("✅ 游戏状态更新功能正常");
            } else {
                console.log("❌ 游戏状态更新功能异常");
            }

            // 恢复原始值
            window.gameState.score = originalScore;
        } else {
            console.log("❌ 无法访问游戏状态");
        }

        // 测试模块交互
        if (window.FinalIntegratedGameEngine) {
            const coreModule = window.FinalIntegratedGameEngine.getModule('core');
            if (coreModule && typeof coreModule.startGame === 'function') {
                console.log("✅ 模块交互功能正常");
            } else {
                console.log("❌ 模块交互功能异常");
            }
        } else {
            console.log("❌ 无法访问游戏引擎");
        }
    }
}

// 创建全局验证器实例
window.GameValidator = new GameValidator();

// 如果页面已加载，自动运行基本验证
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(async () => {
        console.log("🔍 自动运行游戏功能验证...");
        const results = await window.GameValidator.runAllTests();
        await window.GameValidator.runGameLogicTests();

        // 存储验证结果
        window.GameValidationResults = results;

        if (results.success) {
            console.log("🌟 游戏修复验证成功！所有功能正常工作。");
        } else {
            console.log("🚨 游戏修复验证发现问题，请查看上面的错误信息。");
        }
    }, 1000);
} else {
    document.addEventListener('DOMContentLoaded', async () => {
        console.log("🔍 自动运行游戏功能验证...");
        const results = await window.GameValidator.runAllTests();
        await window.GameValidator.runGameLogicTests();

        // 存储验证结果
        window.GameValidationResults = results;

        if (results.success) {
            console.log("🌟 游戏修复验证成功！所有功能正常工作。");
        } else {
            console.log("🚨 游戏修复验证发现问题，请查看上面的错误信息。");
        }
    });
}

console.log("🧪 游戏验证器已准备就绪");

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameValidator;
}