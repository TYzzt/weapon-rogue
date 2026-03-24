/**
 * 新版主游戏入口文件
 * 使用整合后的模块系统重新组织游戏功能
 */

// 确保在引入其他模块之前统一系统已经加载
if (typeof window.GameSystem === 'undefined') {
    console.error('❌ 统一游戏系统未加载，请检查 unified-module-system.js 是否在页面中正确引入');
}

// 游戏启动检查和初始化
function initializeGame() {
    console.log('🚀 开始初始化 Rogue 游戏系统...');

    // 检查必需的模块是否已加载
    const requiredModules = ['core', 'audio', 'save', 'achievements'];
    const missingModules = [];

    for (const moduleName of requiredModules) {
        if (!window.GameSystem.getModule(moduleName)) {
            missingModules.push(moduleName);
        }
    }

    if (missingModules.length > 0) {
        console.error(`❌ 缺少必需模块: ${missingModules.join(', ')}`);
        return false;
    }

    console.log('✅ 所有必需模块已加载');

    // 等待DOM准备就绪
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startGameSystems);
    } else {
        startGameSystems();
    }

    return true;
}

function startGameSystems() {
    console.log('🎮 启动游戏系统...');

    // 获取所有已注册的模块
    const modules = window.GameSystem.getLoadedModuleNames();
    console.log(`📋 已加载模块: ${modules.join(', ')}`);

    // 通知所有模块游戏即将开始
    for (const moduleName of modules) {
        const module = window.GameSystem.getModule(moduleName);
        if (module && typeof module.onGameStart === 'function') {
            try {
                module.onGameStart();
            } catch (error) {
                console.error(`❌ 模块 ${moduleName} 启动失败:`, error);
            }
        }
    }

    console.log('✅ 游戏系统启动完成');

    // 设置键盘快捷键
    setupKeyboardShortcuts();

    // 显示游戏启动信息
    showStartupMessage();
}

function setupKeyboardShortcuts() {
    // 为常用操作设置键盘快捷键
    document.addEventListener('keydown', (e) => {
        // 按P键暂停/继续游戏
        if (e.key.toLowerCase() === 'p') {
            e.preventDefault();
            const coreModule = window.GameSystem.getModule('core');
            if (coreModule) {
                if (window.GameSystem.getState().player.isPlaying) {
                    coreModule.pauseGame();
                } else {
                    coreModule.resumeGame();
                }
            }
        }
        // 按R键重新开始游戏
        else if (e.key.toLowerCase() === 'r') {
            e.preventDefault();
            const coreModule = window.GameSystem.getModule('core');
            if (coreModule && typeof coreModule.restartGame === 'function') {
                coreModule.restartGame();
            }
        }
        // 按S键手动保存游戏
        else if (e.key.toLowerCase() === 's') {
            e.preventDefault();
            const saveModule = window.GameSystem.getModule('save');
            if (saveModule && typeof saveModule.saveGame === 'function') {
                saveModule.saveGame();
            }
        }
        // 按L键手动加载游戏
        else if (e.key.toLowerCase() === 'l') {
            e.preventDefault();
            const saveModule = window.GameSystem.getModule('save');
            if (saveModule && typeof saveModule.loadGame === 'function') {
                saveModule.loadGame();
            }
        }
    });
}

function showStartupMessage() {
    console.log('===============================================');
    console.log('🎮 Rogue 游戏系统已成功启动！');
    console.log('快捷键说明:');
    console.log('  - WASD/方向键: 移动角色');
    console.log('  - 空格键: 特殊动作');
    console.log('  - P键: 暂停/继续游戏');
    console.log('  - R键: 重新开始');
    console.log('  - S键: 保存游戏');
    console.log('  - L键: 加载游戏');
    console.log('  - 鼠标: 控制角色面向方向并进行攻击');
    console.log('===============================================');
}

// 启动游戏
if (!initializeGame()) {
    console.error('❌ 游戏初始化失败');
} else {
    console.log('✅ Rogue 游戏系统初始化完成');
}

// 导出全局接口以供外部脚本使用（如果在Node.js环境中）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeGame,
        startGameSystems,
        setupKeyboardShortcuts
    };
}