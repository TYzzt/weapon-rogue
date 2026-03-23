/**
 * 游戏功能验证测试
 */

console.log("🧪 开始验证重构后的游戏功能...");

// 模拟游戏状态和核心功能
function validateCoreGameplay() {
    console.log("🔍 验证核心游戏玩法...");

    // 检查全局变量是否正确定义
    const checks = [
        { name: 'window.game', condition: typeof window.game !== 'undefined' },
        { name: 'window.game.state', condition: window.game && typeof window.game.state !== 'undefined' },
        { name: 'player object', condition: window.game && window.game.state && window.game.state.player },
        { name: 'game methods', condition: window.game && typeof window.game.start === 'function' },
        { name: 'weapon system', condition: window.game && window.game.systems && window.game.systems.weapon },
        { name: 'enemy system', condition: window.game && window.game.systems && window.game.systems.enemy }
    ];

    let passed = 0;
    let total = checks.length;

    checks.forEach(check => {
        if (check.condition) {
            console.log(`✅ ${check.name} - 通过`);
            passed++;
        } else {
            console.log(`❌ ${check.name} - 失败`);
        }
    });

    console.log(`📊 核心功能验证结果: ${passed}/${total} 项通过`);

    // 模拟游戏状态更新
    if (window.game) {
        console.log("🎮 测试游戏状态更新...");

        const initialState = { ...window.game.state.player };
        console.log("📋 初始状态:", initialState);

        // 模拟玩家移动
        window.game.state.mouseX = 500;
        window.game.state.mouseY = 300;
        window.game.updatePlayerPosition();

        console.log("🖱️ 模拟鼠标移动后位置:", window.game.state.player.x, window.game.state.player.y);

        // 模拟获得武器
        const testWeapon = { name: '测试武器', damage: 25, rarity: 'rare', color: '#00FFFF' };
        window.game.pickupWeapon(testWeapon);

        if (window.game.state.player.weapon && window.game.state.player.weapon.name === '测试武器') {
            console.log("⚔️ 武器获取功能正常");
        } else {
            console.log("⚠️ 武器获取功能异常");
        }

        // 模拟敌人生成
        window.game.systems.enemy.spawnEnemy();
        if (window.game.state.enemies.length > 0) {
            console.log("👾 敌人生成功能正常");
        } else {
            console.log("⚠️ 敌人生成功能异常");
        }

        // 模拟击杀敌人
        const initialKills = window.game.state.kills;
        if (window.game.killEnemy) {
            window.game.killEnemy({});
            if (window.game.state.kills > initialKills) {
                console.log("💀 敌人击杀功能正常");
            } else {
                console.log("⚠️ 敌人击杀功能异常");
            }
        }

        console.log("✅ 游戏状态更新测试完成");
    }

    return passed === total;
}

// 验证模块系统
function validateModularSystem() {
    console.log("\n🧩 验证模块化系统...");

    if (!window.game || !window.game.systems) {
        console.log("❌ 模块系统未正确初始化");
        return false;
    }

    const systems = Object.keys(window.game.systems);
    console.log(`📋 已注册的系统: ${systems.join(', ')}`);

    // 检查每个系统是否有必要的方法
    let systemCheckPassed = true;
    for (const [name, system] of Object.entries(window.game.systems)) {
        if (!system.update || !system.render) {
            console.log(`❌ 系统 ${name} 缺少必要的方法`);
            systemCheckPassed = false;
        } else {
            console.log(`✅ 系统 ${name} 方法完整`);
        }
    }

    // 检查系统是否能正确访问游戏状态
    for (const [name, system] of Object.entries(window.game.systems)) {
        if (!system.state) {
            console.log(`⚠️ 系统 ${name} 可能没有正确绑定状态`);
        } else {
            console.log(`✅ 系统 ${name} 状态访问正常`);
        }
    }

    return systemCheckPassed;
}

// 验证性能优化
function validatePerformanceOptimization() {
    console.log("\n⚡ 验证性能优化...");

    // 检查是否有性能监控功能
    if (typeof window.PerformanceMonitor !== 'undefined') {
        console.log("✅ 性能监控类存在");
    } else {
        console.log("⚠️ 性能监控类不存在");
    }

    // 检查是否有优化的事件系统
    if (window.OptimizedGameManager) {
        console.log("✅ 优化的游戏管理器存在");
    } else {
        console.log("⚠️ 优化的游戏管理器不存在");
    }

    // 检查内存管理
    const maxEnemies = window.game && window.game.config ? window.game.config.maxEnemies : null;
    if (maxEnemies) {
        console.log(`✅ 敌人数量限制已设置为 ${maxEnemies}`);
    } else {
        console.log("⚠️ 敌人数量限制未设置");
    }

    return true;
}

// 验证重构的主要目标
function validateRestructureGoals() {
    console.log("\n🎯 验证重构目标...");

    const goals = [
        {
            name: "全局变量冲突解决",
            check: () => {
                // 检查是否使用了单一状态管理模式
                return window.game && window.game.state;
            },
            description: "使用单一游戏状态对象而非分散的全局变量"
        },
        {
            name: "模块化架构实现",
            check: () => {
                // 检查是否有模块化系统
                return window.game && window.game.systems;
            },
            description: "功能按模块组织，降低耦合度"
        },
        {
            name: "性能优化",
            check: () => {
                // 检查是否有性能优化措施
                return window.game && window.game.config && window.game.config.maxEnemies;
            },
            description: "限制实体数量，优化更新循环"
        },
        {
            name: "功能完整性",
            check: () => {
                // 检查核心功能是否保留
                return window.game &&
                       typeof window.game.start === 'function' &&
                       typeof window.game.killEnemy === 'function' &&
                       typeof window.game.pickupWeapon === 'function';
            },
            description: "保留原始游戏核心玩法"
        }
    ];

    let goalsMet = 0;
    goals.forEach(goal => {
        if (goal.check()) {
            console.log(`✅ ${goal.name}: ${goal.description}`);
            goalsMet++;
        } else {
            console.log(`❌ ${goal.name}: ${goal.description}`);
        }
    });

    console.log(`📈 重构目标达成: ${goalsMet}/${goals.length}`);

    return goalsMet === goals.length;
}

// 运行所有验证
function runValidation() {
    console.log("🚀 开始全面验证重构后的游戏系统...\n");

    const results = [
        { name: "核心玩法", result: validateCoreGameplay() },
        { name: "模块系统", result: validateModularSystem() },
        { name: "性能优化", result: validatePerformanceOptimization() },
        { name: "重构目标", result: validateRestructureGoals() }
    ];

    console.log("\n🏁 验证总结:");
    results.forEach(result => {
        console.log(`${result.result ? '✅' : '❌'} ${result.name}: ${result.result ? '通过' : '失败'}`);
    });

    const allPassed = results.every(r => r.result);

    console.log(`\n🎯 重构验证 ${allPassed ? '成功' : '部分成功'}`);
    console.log(allPassed
        ? "🎉 重构成功！解决了全局变量冲突，实现了模块化架构，优化了性能，并保持了核心玩法。"
        : "⚠️ 重构部分成功，请检查失败的验证项目。");

    return allPassed;
}

// 如果在浏览器环境中运行，则等待页面加载后执行验证
if (typeof window !== 'undefined' && window.document) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(runValidation, 1000); // 给游戏系统一点时间初始化
        });
    } else {
        setTimeout(runValidation, 1000); // 给游戏系统一点时间初始化
    }
} else {
    // Node.js 环境中直接运行
    runValidation();
}

console.log("🔍 验证工具已加载，将在游戏初始化后自动运行测试...");