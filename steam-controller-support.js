// ==================== Steam版控制器支持系统 ====================
//
// 为游戏添加全面的控制器支持，包括：
// 1. 游戏手柄支持
// 2. 按键映射
// 3. 震动反馈
// 4. 控制方案自定义

class SteamControllerSupport {
    constructor() {
        this.controllers = new Map();
        this.gamepadMapping = {};
        this.isConnected = false;
        this.vibrationSupported = false;
        this.customMappings = {};

        this.inputStates = {
            left: false,
            right: false,
            up: false,
            down: false,
            action1: false, // 攻击/互动
            action2: false, // 特殊技能
            start: false,   // 开始/暂停
            select: false   // 选择/菜单
        };

        this.defaultBindings = {
            axes: {
                leftStickX: 0,
                leftStickY: 1,
                rightStickX: 2,
                rightStickY: 3
            },
            buttons: {
                up: 12,
                down: 13,
                left: 14,
                right: 15,
                action1: 0,   // A button
                action2: 2,   // X button
                start: 9,     // Start button
                select: 8,    // Select button
                leftShoulder: 4,
                rightShoulder: 5,
                leftTrigger: 6,
                rightTrigger: 7
            }
        };

        this.init();
    }

    init() {
        // 检测游戏手柄连接
        this.setupGamepadDetection();

        // 设置输入监听
        this.setupInputListeners();

        // 检测震动支持
        this.checkVibrationSupport();

        console.log("🎮 控制器支持系统已初始化");
    }

    // 设置游戏手柄检测
    setupGamepadDetection() {
        window.addEventListener('gamepadconnected', (e) => {
            this.handleGamepadConnected(e.gamepad);
        });

        window.addEventListener('gamepaddisconnected', (e) => {
            this.handleGamepadDisconnected(e.gamepad);
        });

        // 定期检查手柄状态
        this.pollGamepads();
    }

    // 处理手柄连接
    handleGamepadConnected(gamepad) {
        this.controllers.set(gamepad.index, {
            gamepad: gamepad,
            mapping: this.defaultBindings,
            lastUpdate: Date.now(),
            vibration: {
                leftMotor: 0,
                rightMotor: 0,
                duration: 0
            }
        });

        this.isConnected = true;

        if (typeof showCombatLog !== 'undefined') {
            showCombatLog(`🎮 手柄 ${gamepad.index + 1} 已连接: ${gamepad.id}`, 'weapon-get');
        }

        console.log(`🎮 手柄已连接: ${gamepad.id} (ID: ${gamepad.index})`);
    }

    // 处理手柄断开连接
    handleGamepadDisconnected(gamepad) {
        this.controllers.delete(gamepad.index);

        if (this.controllers.size === 0) {
            this.isConnected = false;
        }

        if (typeof showCombatLog !== 'undefined') {
            showCombatLog(`🎮 手柄 ${gamepad.index + 1} 已断开`, 'weapon-lose');
        }

        console.log(`🎮 手柄已断开: ${gamepad.index}`);
    }

    // 轮询手柄状态
    pollGamepads() {
        const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];

        for (const gamepad of gamepads) {
            if (gamepad) {
                this.updateGamepadState(gamepad);
            }
        }

        requestAnimationFrame(() => this.pollGamepads());
    }

    // 更新手柄状态
    updateGamepadState(gamepad) {
        if (!gamepad || !this.controllers.has(gamepad.index)) {
            return;
        }

        const controller = this.controllers.get(gamepad.index);
        const mapping = controller.mapping;

        // 更新按钮状态
        for (const [action, buttonIndex] of Object.entries(mapping.buttons)) {
            const pressed = gamepad.buttons[buttonIndex]?.pressed || false;

            if (pressed !== this.inputStates[action]) {
                this.inputStates[action] = pressed;

                // 处理输入
                this.handleInput(action, pressed);
            }
        }

        // 更新摇杆状态（模拟键盘输入）
        const leftStickX = gamepad.axes[mapping.axes.leftStickX] || 0;
        const leftStickY = gamepad.axes[mapping.axes.leftStickY] || 0;

        // 摇杆死区处理
        const deadzone = 0.2;

        this.inputStates.left = Math.abs(leftStickX) > deadzone && leftStickX < -deadzone;
        this.inputStates.right = Math.abs(leftStickX) > deadzone && leftStickX > deadzone;
        this.inputStates.up = Math.abs(leftStickY) > deadzone && leftStickY < -deadzone;
        this.inputStates.down = Math.abs(leftStickY) > deadzone && leftStickY > deadzone;

        controller.lastUpdate = Date.now();
    }

    // 设置输入监听器（兼容键盘和手柄）
    setupInputListeners() {
        // 键盘事件监听
        document.addEventListener('keydown', (e) => {
            if (!this.isConnected) { // 仅在没有连接手柄时响应键盘
                this.handleKeyboardInput(e.code, true);
            }
        });

        document.addEventListener('keyup', (e) => {
            if (!this.isConnected) {
                this.handleKeyboardInput(e.code, false);
            }
        });
    }

    // 处理键盘输入
    handleKeyboardInput(key, isPressed) {
        let action = null;

        switch(key) {
            case 'KeyW':
            case 'ArrowUp':
                action = 'up';
                break;
            case 'KeyS':
            case 'ArrowDown':
                action = 'down';
                break;
            case 'KeyA':
            case 'ArrowLeft':
                action = 'left';
                break;
            case 'KeyD':
            case 'ArrowRight':
                action = 'right';
                break;
            case 'Space':
            case 'KeyX':
                action = 'action1';
                break;
            case 'ShiftLeft':
            case 'KeyZ':
                action = 'action2';
                break;
            case 'Enter':
            case 'Escape':
                action = 'start';
                break;
            case 'Tab':
                action = 'select';
                break;
        }

        if (action) {
            this.inputStates[action] = isPressed;
            this.handleInput(action, isPressed);
        }
    }

    // 处理输入事件
    handleInput(action, isPressed) {
        if (!isPressed) return; // 只处理按下事件

        // 根据动作执行相应游戏功能
        switch(action) {
            case 'up':
            case 'down':
            case 'left':
            case 'right':
                this.handleMovement();
                break;
            case 'action1':
                this.handleAction1();
                break;
            case 'action2':
                this.handleAction2();
                break;
            case 'start':
                this.handleStart();
                break;
            case 'select':
                this.handleSelect();
                break;
        }
    }

    // 处理移动输入
    handleMovement() {
        // 这里可以将输入状态传递给游戏逻辑
        if (typeof gameState !== 'undefined' && gameState.player) {
            // 获取输入状态并转换为移动方向
            let moveX = 0, moveY = 0;

            if (this.inputStates.left) moveX -= 1;
            if (this.inputStates.right) moveX += 1;
            if (this.inputStates.up) moveY -= 1;
            if (this.inputStates.down) moveY += 1;

            // 标准化对角线移动
            if (moveX !== 0 && moveY !== 0) {
                moveX *= 0.707;
                moveY *= 0.707;
            }

            // 更新玩家位置（如果游戏逻辑允许）
            if (typeof movePlayer !== 'undefined') {
                movePlayer(moveX, moveY);
            }
        }
    }

    // 处理主要动作
    handleAction1() {
        // 主要攻击/互动动作
        if (typeof gameState !== 'undefined' && gameState.player) {
            // 这里可以触发攻击或其他主要动作
            if (typeof triggerAttack !== 'undefined') {
                triggerAttack();
            }
        }
    }

    // 处理次要动作
    handleAction2() {
        // 次要技能/特殊动作
        if (typeof gameState !== 'undefined' && gameState.player) {
            // 这里可以触发特殊技能
            if (typeof useSpecialSkill !== 'undefined') {
                useSpecialSkill();
            }
        }
    }

    // 处理开始按钮
    handleStart() {
        // 暂停/菜单
        if (typeof togglePause !== 'undefined') {
            togglePause();
        }
    }

    // 处理选择按钮
    handleSelect() {
        // 菜单选择
        if (typeof openMenu !== 'undefined') {
            openMenu();
        }
    }

    // 检测震动支持
    checkVibrationSupport() {
        // 检查浏览器是否支持震动API
        if ('vibrate' in navigator) {
            this.vibrationSupported = true;
            console.log("✅ 浏览器震动支持已检测");
        } else {
            console.log("❌ 浏览器不支持震动");
        }
    }

    // 触发手柄震动
    triggerVibration(controllerIndex, leftMotor = 0.5, rightMotor = 0.5, duration = 500) {
        if (!this.vibrationSupported) return;

        const controller = this.controllers.get(controllerIndex);
        if (!controller) return;

        // 模拟震动（由于Web Gamepad API目前不支持震动）
        controller.vibration = {
            leftMotor,
            rightMotor,
            duration,
            startTime: Date.now()
        };

        // 显示震动反馈
        console.log(`📢 手柄 ${controllerIndex} 震动: L=${leftMotor}, R=${rightMotor}, Duration=${duration}ms`);

        // 触发视觉震动反馈
        if (typeof window.steamGraphicsEnhancement) {
            window.steamGraphicsEnhancement.createScreenShake(leftMotor * 5, duration / 50);
        }
    }

    // 设置自定义按键映射
    setCustomMapping(profileName, mapping) {
        this.customMappings[profileName] = {
            ...this.defaultBindings,
            ...mapping
        };

        console.log(`⚙️ 已保存自定义控制配置: ${profileName}`);
    }

    // 加载控制配置
    loadMapping(profileName) {
        if (this.customMappings[profileName]) {
            this.defaultBindings = this.customMappings[profileName];
            console.log(`⚙️ 已加载控制配置: ${profileName}`);

            // 更新所有已连接手柄的映射
            this.controllers.forEach(controller => {
                controller.mapping = this.defaultBindings;
            });
        }
    }

    // 获取当前连接的控制器数量
    getConnectedControllersCount() {
        return this.controllers.size;
    }

    // 获取控制器状态
    getControllerStatus() {
        const status = {
            isConnected: this.isConnected,
            controllersCount: this.controllers.size,
            vibrationSupported: this.vibrationSupported,
            controllers: []
        };

        this.controllers.forEach((controller, index) => {
            status.controllers.push({
                index: index,
                id: controller.gamepad.id,
                connected: controller.gamepad.connected,
                timestamp: controller.lastUpdate
            });
        });

        return status;
    }

    // 振动预设效果
    vibratePreset(type) {
        switch(type) {
            case 'hit':
                this.triggerVibration(0, 0.3, 0.3, 200);
                break;
            case 'powerup':
                this.triggerVibration(0, 0.2, 0.6, 300);
                break;
            case 'levelup':
                this.triggerVibration(0, 0.7, 0.7, 500);
                break;
            case 'explosion':
                this.triggerVibration(0, 0.9, 0.9, 800);
                break;
            case 'critical':
                this.triggerVibration(0, 1.0, 0.8, 600);
                break;
            default:
                this.triggerVibration(0, 0.5, 0.5, 300);
        }
    }

    // 重置所有输入状态
    resetInputs() {
        Object.keys(this.inputStates).forEach(key => {
            this.inputStates[key] = false;
        });
    }
}

// 创建全局实例
window.steamControllerSupport = new SteamControllerSupport();

// 与游戏逻辑集成
if (typeof gameState !== 'undefined') {
    // 保存原始的移动函数
    if (typeof movePlayer !== 'undefined') {
        const originalMovePlayer = window.movePlayer;

        window.movePlayer = function(dx, dy) {
            if (window.steamControllerSupport?.isConnected) {
                // 手柄输入优先
                return originalMovePlayer(dx, dy);
            } else {
                // 仍支持键盘输入
                return originalMovePlayer(dx, dy);
            }
        };
    }
}

// 与图形特效集成
if (typeof showCombatLog !== 'undefined') {
    const originalShowCombatLog = window.showCombatLog;

    window.showCombatLog = function(text, className) {
        originalShowCombatLog(text, className);

        // 根据不同类型触发震动反馈
        if (window.steamControllerSupport) {
            switch(className) {
                case 'hit':
                case 'enemy-death':
                    window.steamControllerSupport.vibratePreset('hit');
                    break;
                case 'level-up':
                    window.steamControllerSupport.vibratePreset('levelup');
                    break;
                case 'weapon-get':
                    window.steamControllerSupport.vibratePreset('powerup');
                    break;
                case 'critical-hit':
                    window.steamControllerSupport.vibratePreset('critical');
                    break;
                case 'special-event':
                    window.steamControllerSupport.vibratePreset('explosion');
                    break;
            }
        }
    };
}

// 提供API函数用于游戏集成
window.getControllerState = function() {
    if (window.steamControllerSupport) {
        return window.steamControllerSupport.inputStates;
    }
    return {};
};

window.isUsingController = function() {
    if (window.steamControllerSupport) {
        return window.steamControllerSupport.isConnected;
    }
    return false;
};

window.triggerHapticFeedback = function(type = 'hit') {
    if (window.steamControllerSupport) {
        window.steamControllerSupport.vibratePreset(type);
    }
};

console.log("Steam版控制器支持系统已加载，支持手柄和键盘混合操作");