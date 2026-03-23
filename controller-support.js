// ==================== 游戏控制器支持系统 ====================

class GameControllerSupport {
    constructor() {
        this.gamepadIndex = null;
        this.connected = false;
        this.axesDeadzone = 0.2; // 摇杆死区
        this.buttonStates = {};
        this.prevButtonStates = {};

        // 控制器配置
        this.config = {
            moveXAxis: 0,      // 左摇杆X轴
            moveYAxis: 1,      // 左摇杆Y轴
            aimXAxis: 2,       // 右摇杆X轴
            aimYAxis: 3,       // 右摇杆Y轴
            attackButton: 0,   // A键 - 攻击
            skillAButton: 1,   // B键 - 技能1
            skillBButton: 2,   // X键 - 技能2
            skillCButton: 3,   // Y键 - 技能3
            skillDButton: 4,   // LB键 - 技能4
            pauseButton: 9,    // START键 - 暂停
            menuButton: 8      // BACK键 - 菜单
        };

        // 事件监听器
        this.setupEventListeners();
    }

    setupEventListeners() {
        window.addEventListener('gamepadconnected', (e) => {
            this.onGamepadConnected(e);
        });

        window.addEventListener('gamepaddisconnected', (e) => {
            this.onGamepadDisconnected(e);
        });

        // 定期检查控制器状态
        setInterval(() => {
            if (this.connected && this.gamepadIndex !== null) {
                this.updateGamepadState();
            }
        }, 16); // 约60fps
    }

    onGamepadConnected(e) {
        console.log(`控制器连接: ${e.gamepad.id}`);
        this.gamepadIndex = e.gamepad.index;
        this.connected = true;

        // 更新UI显示控制器已连接
        this.onConnectionChanged(true);

        if (typeof showCombatLog !== 'undefined') {
            showCombatLog('🎮 控制器已连接', 'weapon-get');
        }
    }

    onGamepadDisconnected(e) {
        console.log(`控制器断开: ${e.gamepad.id}`);
        if (this.gamepadIndex === e.gamepad.index) {
            this.gamepadIndex = null;
            this.connected = false;

            // 更新UI显示控制器已断开
            this.onConnectionChanged(false);
        }

        if (typeof showCombatLog !== 'undefined') {
            showCombatLog('🎮 控制器已断开', 'weapon-lose');
        }
    }

    updateGamepadState() {
        const gamepad = navigator.getGamepads()[this.gamepadIndex];
        if (!gamepad) return;

        // 更新按钮状态
        for (let i = 0; i < gamepad.buttons.length; i++) {
            const button = gamepad.buttons[i];
            this.prevButtonStates[i] = this.buttonStates[i];
            this.buttonStates[i] = button.pressed;

            // 检测按钮按下事件
            if (button.pressed && !this.prevButtonStates[i]) {
                this.onButtonDown(i);
            }

            // 检测按钮释放事件
            if (!button.pressed && this.prevButtonStates[i]) {
                this.onButtonUp(i);
            }
        }

        // 处理摇杆输入
        this.handleAxesInput(gamepad);
    }

    handleAxesInput(gamepad) {
        // 获取摇杆值
        const moveX = Math.abs(gamepad.axes[this.config.moveXAxis]) > this.axesDeadzone ?
                      gamepad.axes[this.config.moveXAxis] : 0;
        const moveY = Math.abs(gamepad.axes[this.config.moveYAxis]) > this.axesDeadzone ?
                      gamepad.axes[this.config.moveYAxis] : 0;
        const aimX = Math.abs(gamepad.axes[this.config.aimXAxis]) > this.axesDeadzone ?
                     gamepad.axes[this.config.aimXAxis] : 0;
        const aimY = Math.abs(gamepad.axes[this.config.aimYAxis]) > this.axesDeadzone ?
                     gamepad.axes[this.config.aimYAxis] : 0;

        // 更新玩家移动（如果游戏正在运行）
        if (typeof player !== 'undefined' && typeof gameState !== 'undefined' && gameState.isPlaying) {
            if (moveX !== 0 || moveY !== 0) {
                // 计算新位置（相对玩家当前位置）
                const moveDistance = 5; // 移动速度
                const newX = player.x + moveX * moveDistance;
                const newY = player.y + moveY * moveDistance;

                // 确保不超出边界
                player.x = Math.max(player.size, Math.min(canvas.width - player.size, newX));
                player.y = Math.max(player.size, Math.min(canvas.height - player.size, newY));
            }

            // 更新瞄准方向（用于武器朝向）
            if (aimX !== 0 || aimY !== 0) {
                // 计算鼠标位置模拟瞄准
                mouseX = player.x + aimX * (canvas.width / 2);
                mouseY = player.y + aimY * (canvas.height / 2);
            }
        }
    }

    onButtonDown(buttonIndex) {
        switch (buttonIndex) {
            case this.config.attackButton:
                this.performAttack();
                break;
            case this.config.skillAButton: // Q技能 - 旋风斩
                this.useSkill('Q');
                break;
            case this.config.skillBButton: // W技能 - 治疗光环
                this.useSkill('W');
                break;
            case this.config.skillCButton: // E技能 - 闪现
                this.useSkill('E');
                break;
            case this.config.skillDButton: // R技能 - 狂暴
                this.useSkill('R');
                break;
            case this.config.pauseButton:
                this.togglePause();
                break;
            case this.config.menuButton:
                this.openMenu();
                break;
        }
    }

    onButtonUp(buttonIndex) {
        // 按钮释放事件（如果需要的话）
    }

    performAttack() {
        // 模拟鼠标点击进行攻击
        if (typeof gameState !== 'undefined' && gameState.isPlaying && typeof handlePlayerAttack !== 'undefined') {
            handlePlayerAttack();
        }
    }

    useSkill(skillKey) {
        // 模拟键盘按键使用技能
        if (typeof gameState !== 'undefined' && gameState.isPlaying) {
            // 创建一个键盘事件模拟
            const event = new KeyboardEvent('keydown', {
                key: skillKey,
                code: `Key${skillKey.toUpperCase()}`
            });
            document.dispatchEvent(event);
        }
    }

    togglePause() {
        if (typeof gameState !== 'undefined') {
            if (gameState.isPlaying && !gameState.isGameOver) {
                // 暂停游戏
                gameState.isPlaying = false;
                if (typeof menuSystem !== 'undefined') {
                    menuSystem.switchToPause();
                }
            } else if (!gameState.isPlaying && typeof menuSystem !== 'undefined') {
                // 继续游戏
                menuSystem.switchToGame();
                gameState.isPlaying = true;
            }
        }
    }

    openMenu() {
        // 打开主菜单
        if (typeof menuSystem !== 'undefined') {
            menuSystem.switchToStart();
        }
    }

    onConnectionChanged(connected) {
        // 更新游戏UI以反映控制器连接状态
        const controllerIndicator = document.getElementById('controller-indicator');
        if (controllerIndicator) {
            controllerIndicator.style.display = connected ? 'block' : 'none';
        }

        // 通知其他系统控制器状态变更
        if (typeof gameState !== 'undefined') {
            gameState.controllerConnected = connected;
        }

        // 如果有设置界面的控制器选项，也要更新
        if (typeof enhancedAudioManager !== 'undefined') {
            // 这里可以添加控制器状态的回调
        }
    }

    // 检查控制器是否连接
    isControllerConnected() {
        return this.connected;
    }

    // 获取控制器状态信息
    getControllerInfo() {
        if (!this.connected || this.gamepadIndex === null) {
            return null;
        }

        const gamepad = navigator.getGamepads()[this.gamepadIndex];
        if (!gamepad) {
            return null;
        }

        return {
            id: gamepad.id,
            index: gamepad.index,
            connected: gamepad.connected,
            timestamp: gamepad.timestamp,
            buttons: gamepad.buttons.map(b => ({ pressed: b.pressed, value: b.value })),
            axes: [...gamepad.axes]
        };
    }

    // 清理资源
    destroy() {
        this.connected = false;
        this.gamepadIndex = null;
        this.buttonStates = {};
        this.prevButtonStates = {};
    }
}

// 创建控制器支持实例
const gameController = new GameControllerSupport();

// 初始化控制器支持
function initControllerSupport() {
    // 检查浏览器是否支持Gamepad API
    if (!navigator.getGamepads && !window.GamepadEvent) {
        console.log("此浏览器不支持Gamepad API");
        return false;
    }

    console.log("控制器支持系统已初始化");
    return true;
}

// 页面加载完成后初始化控制器支持
document.addEventListener('DOMContentLoaded', () => {
    initControllerSupport();

    // 如果设置了启用控制器，检查是否已连接控制器
    const controllerEnabled = localStorage.getItem('controllerEnabled');
    if (controllerEnabled === 'true') {
        // 启用控制器支持
        console.log("控制器支持已启用");
    }
});

// 通用控制器辅助函数
function enableController(enabled) {
    if (typeof gameController !== 'undefined') {
        // 这里可以添加控制器启用/禁用的逻辑
        console.log(`控制器支持已${enabled ? '启用' : '禁用'}`);

        // 保存设置
        localStorage.setItem('controllerEnabled', enabled.toString());
    }
}

// 检查是否可以使用控制器
function isUsingController() {
    return typeof gameController !== 'undefined' &&
           gameController.isControllerConnected();
}