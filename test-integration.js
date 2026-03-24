// 简单测试集成系统是否正确创建
console.log("Testing integrated game system integration...");

// 检查全局变量是否已定义
console.log("Checking for IntegratedGameSystem...");
if (typeof window !== 'undefined' && window.IntegratedGameSystem) {
    console.log("✅ IntegratedGameSystem is available");
    console.log("✅ GameState is available:", !!window.gameState);
    console.log("✅ Has updateState method:", typeof window.IntegratedGameSystem.updateState === 'function');
    console.log("✅ Has getState method:", typeof window.IntegratedGameSystem.getState === 'function');
    console.log("✅ Has registerModule method:", typeof window.IntegratedGameSystem.registerModule === 'function');
    
    // 简单的状态测试
    try {
        const originalX = window.IntegratedGameSystem.getState().player.x;
        window.IntegratedGameSystem.updateState({ player: { x: 999 }});
        const newX = window.IntegratedGameSystem.getState().player.x;
        
        if (newX === 999) {
            console.log("✅ State update functionality works");
        } else {
            console.log("❌ State update functionality failed");
        }
        
        // 恢复原始值
        window.IntegratedGameSystem.updateState({ player: { x: originalX }});
        
    } catch (e) {
        console.log("❌ Error testing state functionality:", e.message);
    }
} else {
    console.log("❌ IntegratedGameSystem is not available");
}

console.log("Integration test completed.");
