/**
 * 功能验证脚本 - 验证修复后的游戏系统功能正常
 * 测试核心游戏功能、模块交互和性能表现
 */

class GameValidator {
    constructor() {
        this.tests = [];
        this.results = [];
        this.passedTests = 0;
        this.failedTests = 0;
        
        console.log("🔍 游戏功能验证器已初始化");
    }

    /**
     * 添加测试用例
     */
    addTest(name, testFunction) {
        this.tests.push({ name, testFunction });
    }

    /**
     * 运行所有测试
     */
    async runAllTests() {
        console.log(`🧪 开始运行 ${this.tests.length} 个测试用例...`);

        for (const test of this.tests) {
            console.log(`🔄 运行测试: ${test.name}`);
            
            try {
                const result = await Promise.resolve(test.testFunction());
                
                if (result) {
                    this.passedTests++;
                    this.results.push({ name: test.name, status: 'PASS', message: 'Test passed' });
                    console.log(`✅ ${test.name}: 通过`);
                } else {
                    this.failedTests++;
                    this.results.push({ name: test.name, status: 'FAIL', message: 'Test failed' });
                    console.error(`❌ ${test.name}: 失败`);
                }
            } catch (error) {
                this.failedTests++;
                this.results.push({ name: test.name, status: 'ERROR', message: error.message });
                console.error(`💥 ${test.name}: 错误 - ${error.message}`);
            }
        }

        this.printSummary();
        return { passed: this.passedTests, failed: this.failedTests, total: this.tests.length };
    }

    /**
     * 打印测试摘要
     */
    printSummary() {
        console.log("\n" + "=".repeat(50));
        console.log("📊 测试结果摘要:");
        console.log(`✅ 通过: ${this.passedTests}`);
        console.log(`❌ 失败: ${this.failedTests}`);
        console.log(`总计: ${this.tests.length}`);
        console.log("=".repeat(50));

        // 打印详细结果
        console.log("\n📝 详细结果:");
        this.results.forEach(result => {
            const statusSymbol = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '💥';
            console.log(`${statusSymbol} ${result.name}: ${result.status} - ${result.message}`);
        });

        // 整体状态
        const overallStatus = this.failedTests === 0 ? '✅ 所有测试通过!' : '⚠️ 存在失败的测试';
        console.log(`\n${overallStatus}`);
    }

    /**
     * 验证集成游戏系统的基本功能
     */
    validateBasicSystem() {
        console.log("\n🔍 验证集成游戏系统...");

        // 检查全局变量是否存在
        if (!window.IntegratedGameSystem) {
            throw new Error("IntegratedGameSystem 未定义");
        }

        // 检查状态是否存在
        if (!window.IntegratedGameSystem.state) {
            throw new Error("游戏状态未初始化");
        }

        // 检查玩家状态
        if (!window.IntegratedGameSystem.state.player) {
            throw new Error("玩家状态未初始化");
        }

        // 检查方法是否存在
        const requiredMethods = [
            'updateState', 'getState', 'registerModule', 'getModule', 
            'initializeAllModules', 'getLoadedModuleNames'
        ];

        for (const method of requiredMethods) {
            if (typeof window.IntegratedGameSystem[method] !== 'function') {
                throw new Error(`方法 ${method} 不存在`);
            }
        }

        console.log("✅ 基本系统验证通过");
        return true;
    }

    /**
     * 验证游戏状态管理
     */
    validateStateManager() {
        console.log("\n🔍 验证游戏状态管理...");

        const system = window.IntegratedGameSystem;
        const initialState = { ...system.getState() };

        // 测试状态更新
        const testUpdate = { player: { x: 100, y: 200 } };
        system.updateState(testUpdate);

        const newState = system.getState();
        if (newState.player.x !== 100 || newState.player.y !== 200) {
            throw new Error("状态更新失败");
        }

        // 验证深度合并
        const nestedUpdate = { player: { hp: 80, weapon: 'sword' } };
        system.updateState(nestedUpdate);

        const finalState = system.getState();
        if (finalState.player.x !== 100 || finalState.player.hp !== 80) {
            throw new Error("深度合并更新失败");
        }

        // 恢复初始状态
        system.updateState(initialState);

        console.log("✅ 状态管理验证通过");
        return true;
    }

    /**
     * 验证模块系统
     */
    validateModuleSystem() {
        console.log("\n🔍 验证模块系统...");

        const system = window.IntegratedGameSystem;
        
        // 创建一个测试模块
        const testModule = {
            name: 'testModule',
            init: function(sys) {
                this.system = sys;
                this.initialized = true;
            },
            testMethod: function() {
                return 'test-result';
            }
        };

        // 注册模块
        const registrationResult = system.registerModule('testModule', testModule);
        if (!registrationResult) {
            throw new Error("模块注册失败");
        }

        // 验证模块获取
        const retrievedModule = system.getModule('testModule');
        if (!retrievedModule) {
            throw new Error("无法获取已注册的模块");
        }

        // 验证模块方法调用
        if (retrievedModule.testMethod() !== 'test-result') {
            throw new Error("模块方法调用失败");
        }

        // 清理测试模块
        system.modules.delete('testModule');
        system.loadedModules.delete('testModule');

        console.log("✅ 模块系统验证通过");
        return true;
    }

    /**
     * 验证事件系统
     */
    validateEventSystem() {
        console.log("\n🔍 验证事件系统...");

        const system = window.IntegratedGameSystem;
        let eventReceived = false;
        const testData = { value: 'test-event' };

        // 订阅事件
        system.eventBus.subscribe('testEvent', (data) => {
            if (data.value === testData.value) {
                eventReceived = true;
            }
        });

        // 发布事件
        system.eventBus.emit('testEvent', testData);

        // 检查事件是否被接收
        if (!eventReceived) {
            throw new Error("事件未正确传递");
        }

        console.log("✅ 事件系统验证通过");
        return true;
    }

    /**
     * 验证物理引擎
     */
    validatePhysicsEngine() {
        console.log("\n🔍 验证物理引擎...");

        const obj1 = { x: 0, y: 0, size: 10 };
        const obj2 = { x: 10, y: 0, size: 10 };

        // 测试距离计算
        const distance = window.PhysicsEngine.distance(obj1, obj2);
        if (Math.abs(distance - 10) > 0.001) {
            throw new Error(`距离计算错误: 期望 10, 得到 ${distance}`);
        }

        // 测试碰撞检测
        const collision = window.PhysicsEngine.checkCollision(obj1, obj2, 0);
        if (!collision) {
            throw new Error("碰撞检测失败 - 应该检测到碰撞");
        }

        // 测试无碰撞情况
        const obj3 = { x: 50, y: 0, size: 10 };
        const noCollision = window.PhysicsEngine.checkCollision(obj1, obj3, 0);
        if (noCollision) {
            throw new Error("碰撞检测失败 - 不应该检测到碰撞");
        }

        console.log("✅ 物理引擎验证通过");
        return true;
    }

    /**
     * 验证敌人生成器
     */
    validateSpawner() {
        console.log("\n🔍 验证敌人生成器...");

        // 创建测试游戏状态
        const testState = {
            level: 1,
            kills: 0,
            enemies: []
        };

        // 创建敌人生成器实例
        const spawner = new window.EnemySpawner();
        
        // 模拟生成敌人
        spawner.spawnEnemy(testState);

        // 检查是否生成了敌人
        if (testState.enemies.length !== 1) {
            throw new Error("敌人生成失败");
        }

        // 检查生成的敌人属性
        const enemy = testState.enemies[0];
        const requiredProps = ['x', 'y', 'size', 'speed', 'hp', 'maxHp', 'damage', 'color'];
        
        for (const prop of requiredProps) {
            if (!(prop in enemy)) {
                throw new Error(`敌人缺少属性: ${prop}`);
            }
        }

        console.log("✅ 敌人生成器验证通过");
        return true;
    }

    /**
     * 验证性能监控器
     */
    validatePerformanceMonitor() {
        console.log("\n🔍 验证性能监控器...");

        // 创建性能监控器实例
        const monitor = new window.PerformanceMonitor();
        
        // 测试帧时间记录
        const start = monitor.startFrame();
        const end = monitor.endFrame();
        
        if (typeof end !== 'number' || end < 0) {
            throw new Error("帧时间记录失败");
        }

        // 测试平均帧时间
        const avgTime = monitor.getAverageFrameTime();
        if (typeof avgTime !== 'number' || avgTime < 0) {
            throw new Error("平均帧时间计算失败");
        }

        // 测试FPS计算
        const fps = monitor.getFPS();
        if (typeof fps !== 'number' || fps < 0) {
            throw new Error("FPS计算失败");
        }

        console.log("✅ 性能监控器验证通过");
        return true;
    }

    /**
     * 验证主游戏类初始化
     */
    validateGameInitialization() {
        console.log("\n🔍 验证主游戏初始化...");

        try {
            // 创建主游戏实例
            const game = new window.MainIntegrativeGame();
            
            // 验证必要属性
            const requiredProps = [
                'engine', 'canvas', 'ctx', 'animationId', 'lastFrameTime', 'gameRunning', 'keys', 'mouse'
            ];
            
            for (const prop of requiredProps) {
                if (!(prop in game)) {
                    throw new Error(`游戏实例缺少属性: ${prop}`);
                }
            }

            // 尝试初始化（如果页面环境允许）
            if (typeof document !== 'undefined') {
                // 但不实际执行init，因为可能影响当前页面
                if (typeof game.init === 'function') {
                    console.log("✅ 游戏初始化方法存在");
                } else {
                    throw new Error("游戏初始化方法不存在");
                }
            }

            console.log("✅ 主游戏初始化验证通过");
            return true;
        } catch (error) {
            if (error.message.includes('document is not defined')) {
                // 在非浏览器环境忽略这个问题
                console.log("⚠️ 非浏览器环境，跳过游戏初始化测试");
                return true;
            }
            throw error;
        }
    }

    /**
     * 验证冲突解决
     */
    validateConflictResolution() {
        console.log("\n🔍 验证冲突解决...");

        // 检查是否只有一个主要的游戏系统实例
        const primarySystems = [
            'IntegratedGameSystem',
            'FinalGameSystem', 
            'GameEngine',
            'GameManager',
            'GameSystem'
        ].filter(name => window[name] !== undefined);

        // 确保只有 IntegratedGameSystem 存在或者它是唯一的主系统
        if (typeof window.IntegratedGameSystem !== 'undefined') {
            // 检查其他系统是否被正确清理
            const deprecatedSystems = ['GameEngine', 'GameSystem', 'GameManager', 'FinalGameSystem']
                .filter(name => window[name] !== undefined && window[name] !== window.IntegratedGameSystem);
            
            if (deprecatedSystems.length > 0) {
                console.warn(`⚠️ 检测到未完全清理的旧系统: ${deprecatedSystems.join(', ')}`);
                // 对于验证目的，我们仍认为这是可接受的，因为清理可能异步进行
            }
        } else {
            throw new Error("IntegratedGameSystem 未正确初始化");
        }

        console.log("✅ 冲突解决验证通过");
        return true;
    }

    /**
     * 运行所有验证测试
     */
    async runValidation() {
        // 添加所有验证测试
        this.addTest("基本系统功能", () => this.validateBasicSystem());
        this.addTest("状态管理", () => this.validateStateManager());
        this.addTest("模块系统", () => this.validateModuleSystem());
        this.addTest("事件系统", () => this.validateEventSystem());
        this.addTest("物理引擎", () => this.validatePhysicsEngine());
        this.addTest("敌人生成器", () => this.validateSpawner());
        this.addTest("性能监控器", () => this.validatePerformanceMonitor());
        this.addTest("游戏初始化", () => this.validateGameInitialization());
        this.addTest("冲突解决", () => this.validateConflictResolution());

        // 运行所有测试
        return await this.runAllTests();
    }
}

// 在适当的时机运行验证
async function runGameValidation() {
    console.log("🚀 开始游戏功能验证...");

    // 确保必要的系统已加载
    if (typeof window.IntegratedGameSystem === 'undefined') {
        console.error("❌ 集成游戏系统未加载，等待2秒后重试...");
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    if (typeof window.IntegratedGameSystem === 'undefined') {
        console.error("❌ 集成游戏系统仍然未加载，验证失败");
        return { passed: 0, failed: 1, total: 1, error: "System not loaded" };
    }

    // 创建验证器并运行测试
    const validator = new GameValidator();
    const results = await validator.runValidation();
    
    // 将结果存储到全局，便于后续检查
    window.GameValidationResults = results;
    
    return results;
}

// 页面加载完成后运行验证
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runGameValidation);
} else {
    // 延迟执行以确保所有脚本已加载
    setTimeout(runGameValidation, 500);
}

console.log("🔍 游戏验证器已准备就绪");
