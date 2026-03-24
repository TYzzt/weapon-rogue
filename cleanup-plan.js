/**
 * 游戏模块清理脚本
 * 用于移除重复和冲突的旧模块文件
 * 保留整合后的新模块系统
 */

console.log('🧹 开始清理游戏模块文件...');

// 需要保留的文件
const filesToKeep = [
    'unified-module-system.js',    // 统一模块系统
    'game-core.js',               // 游戏核心功能
    'game-modules.js',            // 整合的游戏模块
    'game-main.js',               // 新版主入口
    'index.html',                 // 游戏主页面
    'main.js'                     // 原始主文件（保留以备回滚）
];

// 需要移除的重复功能文件
const redundantFiles = [
    'module-manager.js',
    'core-system.js',
    'save-system.js',
    'enhanced-save-system.js',
    'unified-save-system.js',
    'comprehensive-save-system.js',
    'advanced-save-system.js',
    'achievement-system.js',
    'enhanced-achievement-system.js',
    'unified-achievement-system.js',
    'complete-achievement-system.js',
    'audio-system.js',
    'enhanced-audio.js',
    'steam-audio-system.js',
    'unified-audio-system.js',
    'core-gameplay-improvements.js',
    'core-game-mechanics-overhaul.js',
    'enhanced-core-gameplay.js',
    'core-gameplay-enhancements.js',
    'advanced-gameplay-enhancement.js',
    'extended-gameplay-enhancement.js',
    'game-mechanics-enhancement.js',
    'core-mechanics-enhancement.js',
    'content-additions.js',
    'content-expansion-enhancement.js',
    'content-expansion-system.js',
    'content-expansion-enhanced.js',
    'content-expansion.js',
    'content-expansion-extension.js',
    'extended-content-system.js',
    'comprehensive-game-expansion.js',
    'steam-enhanced-weapon-system.js',
    'steam-controller-support.js',
    'steam-localization.js',
    'steam-achievement-system.js',
    'steam-enhancement-pack.js',
    'steam-content-update.js',
    'steam-graphics-enhancement.js',
    'steam-save-system.js',
    'steam-game-enhancement.js',
    'steam-enhancements.js',
    'steam-menu-system.js',
    'steam-tutorial-system.js',
    'steam-content-expansion.js',
    'particle-system.js',
    'performance-optimized-manager.js',
    'performance-monitor.js',
    'performance-optimizer.js',
    'graphics-enhancement-system.js',
    'localization-system.js',
    'controller-support-system.js',
    'controller-support.js',
    'menu-system.js',
    'enhanced-menu.js',
    'tutorial-system.js',
    'i18n.js',
    'validate-game.js',
    'balance-enhancement.js',
    'balance-patch.js',
    'game-balance-patch.js',
    'balance-optimization.js',
    'weapon-balance-enhancement.js',
    'player-growth-enhancement.js',
    'passive-skill-system.js',
    'milestone-enhancement.js',
    'quality-guarantee-ui-patch.js',
    'quality-guarantee-system.js',
    'comprehensive-enhancement-pack.js',
    'comprehensive-enhancement.js',
    'comprehensive-game-expansion.js',
    'enhanced-enemy-ai.js',
    'achievement-system.js',
    'enhanced-achievements.js',
    'enhanced-achievement-logic.js',
    'compact-game.js',
    'game.js',
    'test-restructured-game.js',
    'test_game_functionality.js',
    'test_quality_guarantee.js',
    'unified-game.js',
    'unified-module-system.js',
    'module-adapters.js'
];

console.log('📋 需要保留的文件:', filesToKeep);
console.log('📋 需要移除的冗余文件:', redundantFiles);

// 由于这是一个前端脚本，实际的文件删除需要在服务器端执行
// 这里只是记录哪些文件可以安全删除

console.log('✅ 清理计划已完成，冗余文件列表已生成');

// 提供一个函数供后续处理
function getCleanupReport() {
    return {
        filesToKeep,
        redundantFiles,
        message: '以上是建议的文件清理列表，实际删除需要在服务端执行'
    };
}

// 如果在Node.js环境中，导出清理报告
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getCleanupReport,
        filesToKeep,
        redundantFiles
    };
}