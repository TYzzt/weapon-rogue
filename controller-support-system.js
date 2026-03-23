// ==================== 手柄支持系统 ====================
//
// 本系统实现游戏的手柄/游戏pad支持功能
// 提供完整的控制器映射和输入处理

class ControllerSupportSystem {
    constructor() {
        this.isConnected = false;
        this.controllers = new Map();
        this.mappingProfile = 'default';
        this.isEnabled = false;
        this.gamepadPolling = null;

        // 默认控制器映射
        this.defaultMapping = {
            axes: {
                leftStickX: 0,      // 左摇杆X轴
                leftStickY: 1,      // 左摇杆Y轴
                rightStickX: 2,     // 右摇杆X轴
                rightStickY: 3,     // 右摇杆Y轴
            },
            buttons: {
                actionBottom: 0,    // 动作按钮(PS:X/A,Xbox:A)
                actionRight: 1,     // 动作按钮(PS:O/B,Xbox:B)
                actionLeft: 2,      // 动作按钮(PS:△/X,Xbox:X)
                actionTop: 3,       // 动作按钮(PS:□/Y,Xbox:Y)
                leftBumper: 4,      // 左保险杠
                rightBumper: 5,     // 右保险杠
                leftTrigger: 6,     // 左扳机
                rightTrigger: 7,    // 右扳机
                select: 8,          // 选择键(Share)
                start: 9,           // 开始键(Options)
                leftStickPress: 10, // 左摇杆按下
                rightStickPress: 11,// 右摇杆按下
                dpadUp: 12,         // 方向键上
                dpadDown: 13,       // 方向键下
                dpadLeft: 14,       // 方向键左
                dpadRight: 15,      // 方向键右
                home: 16,           // Home键
            },
            deadzone: 0.2          // 摇杆死区
        };

        this.currentMapping = { ...this.defaultMapping };
        this.buttonStates = new Map();
        this.axisValues = new Map();
        this.lastTimestamp = new Map();

        this.init();
        console.log("🎮 手柄支持系统已初始化");
    }

    // 初始化手柄系统
    init() {
        this.setupEventListeners();
        this.loadControllerSettings();
        this.startPolling();
        console.log("🕹️ 手柄支持系统初始化完成");
    }

    // 设置事件监听器
    setupEventListeners() {
        // 监听游戏控制器连接事件
        window.addEventListener('gamepadconnected', (e) => {
            this.onGamepadConnected(e.gamepad);
        });

        // 监听游戏控制器断开事件
        window.addEventListener('gamepaddisconnected', (e) => {
            this.onGamepadDisconnected(e.gamepad);
        });

        console.log("🔗 游戏控制器事件监听器已设置");
    }

    // 游戏控制器连接处理
    onGamepadConnected(gamepad) {
        this.controllers.set(gamepad.index, gamepad);
        this.isConnected = true;
        this.isEnabled = true;

        // 初始化按钮状态
        for (let i = 0; i < gamepad.buttons.length; i++) {
            this.buttonStates.set(`${gamepad.index}-${i}`, { pressed: false, touched: false, value: 0 });
        }

        // 初始化摇杆值
        for (let i = 0; i < gamepad.axes.length; i++) {
            this.axisValues.set(`${gamepad.index}-${i}`, gamepad.axes[i]);
        }

        console.log(`🔌 游戏控制器连接: ${gamepad.id} (Index: ${gamepad.index})`);

        // 播放连接提示音
        if (window.playSound) {
            window.playSound('notification');
        }

        // 触发连接回调
        this.onControllerConnected(gamepad);
    }

    // 游戏控制器断开处理
    onGamepadDisconnected(gamepad) {
        this.controllers.delete(gamepad.index);
        this.isConnected = this.controllers.size > 0;

        // 清除相关状态
        for (let i = 0; i < gamepad.buttons.length; i++) {
            this.buttonStates.delete(`${gamepad.index}-${i}`);
        }
        for (let i = 0; i < gamepad.axes.length; i++) {
            this.axisValues.delete(`${gamepad.index}-${i}`);
        }

        console.log(`🔌 游戏控制器断开: ${gamepad.id} (Index: ${gamepad.index})`);

        // 触发断开回调
        this.onControllerDisconnected(gamepad);
    }

    // 控制器连接回调
    onControllerConnected(gamepad) {
        // 这里可以添加控制器连接时的处理逻辑
        console.log(`🎮 控制器 ${gamepad.id} 已准备就绪`);
    }

    // 控制器断开回调
    onControllerDisconnected(gamepad) {
        // 这里可以添加控制器断开时的处理逻辑
        console.log(`🎮 控制器 ${gamepad.id} 已断开连接`);

        if (!this.isConnected) {
            console.log("⚠️ 所有控制器均已断开");
        }
    }

    // 开始轮询游戏控制器
    startPolling() {
        this.gamepadPolling = setInterval(() => {
            if (this.isEnabled && this.isConnected) {
                this.pollControllers();
            }
        }, 16); // 约60FPS

        console.log("⏱️ 控制器轮询已启动 (60 FPS)");
    }

    // 轮询所有控制器
    pollControllers() {
        const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];

        for (const gamepad of gamepads) {
            if (!gamepad) continue;

            // 更新按钮状态
            for (let i = 0; i < gamepad.buttons.length; i++) {
                const button = gamepad.buttons[i];
                const buttonKey = `${gamepad.index}-${i}`;

                const previousState = this.buttonStates.get(buttonKey);
                if (!previousState) continue;

                // 检查按钮状态变化
                if (button.pressed && !previousState.pressed) {
                    // 按钮按下
                    this.onButtonDown(gamepad.index, i, button);
                } else if (!button.pressed && previousState.pressed) {
                    // 按钮释放
                    this.onButtonUp(gamepad.index, i, button);
                } else if (button.pressed && previousState.pressed) {
                    // 按钮持续按下
                    this.onButtonHold(gamepad.index, i, button);
                }

                // 更新状态
                this.buttonStates.set(buttonKey, {
                    pressed: button.pressed,
                    touched: button.touched,
                    value: button.value
                });
            }

            // 更新摇杆值
            for (let i = 0; i < gamepad.axes.length; i++) {
                const axisValue = gamepad.axes[i];
                const axisKey = `${gamepad.index}-${i}`;

                // 应用死区
                const correctedValue = Math.abs(axisValue) > this.currentMapping.deadzone ? axisValue : 0;
                this.axisValues.set(axisKey, correctedValue);

                // 触发摇杆移动事件
                this.onAxisMove(gamepad.index, i, correctedValue);
            }
        }
    }

    // 按钮按下事件
    onButtonDown(controllerIndex, buttonIndex, button) {
        // 根据当前映射配置触发相应动作
        const mappedAction = this.getActionForButton(buttonIndex);

        if (mappedAction) {
            this.executeAction(mappedAction, controllerIndex, buttonIndex, button.value);
        }

        console.log(`🔽 按钮按下: Controller ${controllerIndex}, Button ${buttonIndex} (${mappedAction || 'unmapped'})`);
    }

    // 按钮释放事件
    onButtonUp(controllerIndex, buttonIndex, button) {
        const mappedAction = this.getActionForButton(buttonIndex);

        if (mappedAction) {
            this.executeActionRelease(mappedAction, controllerIndex, buttonIndex);
        }

        console.log(`🔼 按钮释放: Controller ${controllerIndex}, Button ${buttonIndex}`);
    }

    // 按钮持续按下事件
    onButtonHold(controllerIndex, buttonIndex, button) {
        const mappedAction = this.getActionForButton(buttonIndex);

        if (mappedAction) {
            this.executeActionHold(mappedAction, controllerIndex, buttonIndex, button.value);
        }
        // 可选：处理持续按住的逻辑
    }

    // 摇杆移动事件
    onAxisMove(controllerIndex, axisIndex, value) {
        const mappedAction = this.getActionForAxis(axisIndex);

        if (mappedAction) {
            this.executeAxisAction(mappedAction, controllerIndex, axisIndex, value);
        }

        // 特殊处理移动摇杆
        if (axisIndex === this.currentMapping.axes.leftStickX || axisIndex === this.currentMapping.axes.leftStickY) {
            // 计算移动向量
            const moveX = this.axisValues.get(`${controllerIndex}-${this.currentMapping.axes.leftStickX}`) || 0;
            const moveY = this.axisValues.get(`${controllerIndex}-${this.currentMapping.axes.leftStickY}`) || 0;

            if (Math.abs(moveX) > this.currentMapping.deadzone || Math.abs(moveY) > this.currentMapping.deadzone) {
                this.handleMovement(moveX, moveY);
            }
        }

        // 特殊处理瞄准摇杆
        if (axisIndex === this.currentMapping.axes.rightStickX || axisIndex === this.currentMapping.axes.rightStickY) {
            // 计算瞄准向量
            const aimX = this.axisValues.get(`${controllerIndex}-${this.currentMapping.axes.rightStickX}`) || 0;
            const aimY = this.axisValues.get(`${controllerIndex}-${this.currentMapping.axes.rightStickY}`) || 0;

            if (Math.abs(aimX) > this.currentMapping.deadzone || Math.abs(aimY) > this.currentMapping.deadzone) {
                this.handleAiming(aimX, aimY);
            }
        }
    }

    // 获取按钮对应的动作
    getActionForButton(buttonIndex) {
        for (const [action, btnIndex] of Object.entries(this.currentMapping.buttons)) {
            if (btnIndex === buttonIndex) {
                return action;
            }
        }
        return null;
    }

    // 获取摇杆轴对应的动作
    getActionForAxis(axisIndex) {
        for (const [action, axIndex] of Object.entries(this.currentMapping.axes)) {
            if (axIndex === axisIndex) {
                return action;
            }
        }
        return null;
    }

    // 执行按钮动作
    executeAction(action, controllerIndex, buttonIndex, value) {
        switch(action) {
            case 'actionBottom': // A/X 按钮
                this.performPrimaryAction();
                break;
            case 'actionRight': // B/O 按钮
                this.performSecondaryAction();
                break;
            case 'leftBumper':
                this.cyclePreviousWeapon();
                break;
            case 'rightBumper':
                this.cycleNextWeapon();
                break;
            case 'leftTrigger':
                this.performBlock();
                break;
            case 'rightTrigger':
                this.performAttack();
                break;
            case 'start':
                this.togglePauseMenu();
                break;
            case 'select':
                this.openInventory();
                break;
            case 'dpadUp':
            case 'dpadDown':
            case 'dpadLeft':
            case 'dpadRight':
                this.handleDPad(action);
                break;
            default:
                // 自定义动作可以通过事件系统触发
                this.dispatchCustomEvent(`controller:${action}`, { controllerIndex, buttonIndex, value });
        }
    }

    // 执行按钮释放动作
    executeActionRelease(action, controllerIndex, buttonIndex) {
        // 根据需要处理按钮释放事件
        switch(action) {
            case 'leftTrigger':
                this.releaseBlock();
                break;
            case 'rightTrigger':
                this.releaseAttack();
                break;
        }
    }

    // 执行按钮持续按住动作
    executeActionHold(action, controllerIndex, buttonIndex, value) {
        // 根据需要处理持续按住事件
    }

    // 执行摇杆动作
    executeAxisAction(action, controllerIndex, axisIndex, value) {
        // 摇杆动作通常在 onAxisMove 中直接处理
    }

    // 执行主要动作 (例如：攻击/交互)
    performPrimaryAction() {
        // 模拟鼠标左键点击或攻击
        if (window.attack) {
            window.attack();
        }
        console.log("⚔️ 执行主要动作");
    }

    // 执行次要动作 (例如：跳跃/特殊技能)
    performSecondaryAction() {
        // 可以用来执行特殊技能或其他动作
        console.log("⭐ 执行次要动作");
    }

    // 循环切换上一个武器
    cyclePreviousWeapon() {
        // 如果游戏有循环切换武器的函数
        if (window.cyclePreviousWeapon) {
            window.cyclePreviousWeapon();
        }
        console.log("🔄 切换到上一个武器");
    }

    // 循环切换下一个武器
    cycleNextWeapon() {
        // 如果游戏有循环切换武器的函数
        if (window.cycleNextWeapon) {
            window.cycleNextWeapon();
        }
        console.log("🔄 切换到下一个武器");
    }

    // 执行格挡
    performBlock() {
        console.log("🛡️ 开始格挡");
    }

    // 释放格挡
    releaseBlock() {
        console.log("🛡️ 停止格挡");
    }

    // 执行攻击
    performAttack() {
        if (window.attack) {
            window.attack();
        }
        console.log("⚔️ 执行攻击");
    }

    // 释放攻击
    releaseAttack() {
        console.log("⚔️ 释放攻击");
    }

    // 切换暂停菜单
    togglePauseMenu() {
        if (window.showPauseMenu) {
            window.showPauseMenu();
        }
        console.log("⏸️ 切换暂停菜单");
    }

    // 打开库存/物品栏
    openInventory() {
        console.log("🎒 打开物品栏");
    }

    // 处理十字键
    handleDPad(direction) {
        switch(direction) {
            case 'dpadUp':
                // 上方向
                break;
            case 'dpadDown':
                // 下方向
                break;
            case 'dpadLeft':
                // 左方向
                break;
            case 'dpadRight':
                // 右方向
                break;
        }
        console.log(`🎮 十字键: ${direction}`);
    }

    // 处理移动
    handleMovement(x, y) {
        // 模拟键盘WASD移动
        const moveThreshold = 0.5;

        if (y < -moveThreshold) {
            // 向上移动
            this.simulateKeyPress('KeyW');
        } else if (y > moveThreshold) {
            // 向下移动
            this.simulateKeyPress('KeyS');
        }

        if (x < -moveThreshold) {
            // 向左移动
            this.simulateKeyPress('KeyA');
        } else if (x > moveThreshold) {
            // 向右移动
            this.simulateKeyPress('KeyD');
        }

        // 如果需要更精确的移动，可以调用游戏的移动函数
        if (window.movePlayer) {
            window.movePlayer(x, y);
        }

        // 更新玩家朝向
        if (window.setPlayerDirection) {
            window.setPlayerDirection(x, y);
        }
    }

    // 处理瞄准
    handleAiming(x, y) {
        // 计算瞄准角度
        const angle = Math.atan2(y, x);

        // 如果游戏有瞄准函数
        if (window.aimToward) {
            window.aimToward(angle);
        }

        console.log(`🎯 瞄准角度: ${angle} 弧度`);
    }

    // 模拟按键事件
    simulateKeyPress(keyCode) {
        const event = new KeyboardEvent('keydown', {
            key: keyCode.replace('Key', '').toLowerCase(),
            code: keyCode,
            bubbles: true
        });
        document.dispatchEvent(event);
    }

    // 派发自定义事件
    dispatchCustomEvent(eventName, detail) {
        const event = new CustomEvent(eventName, { detail });
        document.dispatchEvent(event);
    }

    // 启用手柄支持
    enableController(enable = true) {
        this.isEnabled = enable;
        if (enable) {
            this.startPolling();
            console.log("🎮 手柄支持已启用");
        } else {
            if (this.gamepadPolling) {
                clearInterval(this.gamepadPolling);
                this.gamepadPolling = null;
            }
            console.log("🎮 手柄支持已禁用");
        }

        // 保存设置
        this.saveControllerSettings();
    }

    // 检查手柄是否已连接
    isControllerConnected() {
        return this.isConnected;
    }

    // 获取连接的控制器数量
    getConnectedControllerCount() {
        return this.controllers.size;
    }

    // 获取控制器状态
    getControllerStatus() {
        const status = {
            isEnabled: this.isEnabled,
            isConnected: this.isConnected,
            controllers: []
        };

        for (const [index, controller] of this.controllers) {
            status.controllers.push({
                index: index,
                id: controller.id,
                mapping: controller.mapping,
                buttons: controller.buttons.length,
                axes: controller.axes.length
            });
        }

        return status;
    }

    // 创建自定义控制器映射
    createCustomMapping(mappingName, mappingConfig) {
        this.customMappings = this.customMappings || {};
        this.customMappings[mappingName] = mappingConfig;
        console.log(`🎮 创建自定义映射: ${mappingName}`);
    }

    // 加载控制器映射配置
    loadControllerMapping(mappingName) {
        if (mappingName === 'default') {
            this.currentMapping = { ...this.defaultMapping };
        } else if (this.customMappings && this.customMappings[mappingName]) {
            this.currentMapping = { ...this.customMappings[mappingName] };
        } else {
            console.warn(`⚠️ 未找到映射配置: ${mappingName}, 使用默认配置`);
            this.currentMapping = { ...this.defaultMapping };
        }

        console.log(`🎮 加载映射配置: ${mappingName}`);
    }

    // 获取当前映射配置
    getCurrentMapping() {
        return { ...this.currentMapping };
    }

    // 加载控制器设置
    loadControllerSettings() {
        try {
            const enabled = localStorage.getItem('controllerEnabled');
            const mapping = localStorage.getItem('controllerMapping');
            const deadzone = localStorage.getItem('controllerDeadzone');

            if (enabled !== null) {
                this.enableController(enabled === 'true');
            }

            if (mapping) {
                this.loadControllerMapping(mapping);
            }

            if (deadzone) {
                this.currentMapping.deadzone = parseFloat(deadzone);
            }

            console.log("📥 控制器设置已加载");
        } catch (error) {
            console.warn("⚠️ 加载控制器设置失败:", error);
        }
    }

    // 保存控制器设置
    saveControllerSettings() {
        try {
            localStorage.setItem('controllerEnabled', this.isEnabled);
            localStorage.setItem('controllerMapping', this.mappingProfile);
            localStorage.setItem('controllerDeadzone', this.currentMapping.deadzone.toString());

            console.log("💾 控制器设置已保存");
        } catch (error) {
            console.warn("⚠️ 保存控制器设置失败:", error);
        }
    }

    // 获取支持的控制器类型
    getSupportedControllers() {
        return [
            'Xbox Wireless Controller',
            'Sony DualShock 4',
            'Sony PlayStation 5 Controller',
            'Nintendo Switch Pro Controller'
        ];
    }

    // 测试特定按钮
    testButton(buttonIndex) {
        console.log(`🔍 测试按钮 ${buttonIndex} ...`);
        // 按钮测试会在下一个轮询周期捕获状态
    }

    // 校准摇杆
    calibrateAxes() {
        // 简单校准方法：将当前值作为中点
        for (const [index, controller] of this.controllers) {
            for (let i = 0; i < controller.axes.length; i++) {
                const currentVal = controller.axes[i];
                // 这里可以实现更复杂的校准算法
                console.log(`📏 校准控制器 ${index} 轴 ${i}: ${currentVal}`);
            }
        }
    }

    // 获取所有连接的控制器信息
    getAllControllersInfo() {
        const controllersInfo = [];

        const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
        for (const gamepad of gamepads) {
            if (gamepad) {
                controllersInfo.push({
                    index: gamepad.index,
                    id: gamepad.id,
                    connected: gamepad.connected,
                    timestamp: gamepad.timestamp,
                    mapping: gamepad.mapping,
                    buttons: gamepad.buttons.map((btn, idx) => ({
                        index: idx,
                        pressed: btn.pressed,
                        touched: btn.touched,
                        value: btn.value
                    })),
                    axes: gamepad.axes.map((axis, idx) => ({
                        index: idx,
                        value: axis
                    }))
                });
            }
        }

        return controllersInfo;
    }

    // 振动支持 (如果浏览器支持)
    triggerRumble(controllerIndex, strongMagnitude = 0.5, weakMagnitude = 0.5, duration = 500) {
        if ('vibrationActuator' in this.controllers.get(controllerIndex)) {
            const actuator = this.controllers.get(controllerIndex).vibrationActuator;
            if (actuator && actuator.playEffect) {
                actuator.playEffect('dual-rumble', {
                    startDelay: 0,
                    duration: duration,
                    weakMagnitude: weakMagnitude,
                    strongMagnitude: strongMagnitude
                });
            }
        }
    }

    // 触发轻微振动
    triggerWeakRumble(controllerIndex, duration = 200) {
        this.triggerRumble(controllerIndex, 0.1, 0.5, duration);
    }

    // 触发强烈振动
    triggerStrongRumble(controllerIndex, duration = 300) {
        this.triggerRumble(controllerIndex, 0.8, 0.3, duration);
    }

    // 销毁控制器系统
    destroy() {
        if (this.gamepadPolling) {
            clearInterval(this.gamepadPolling);
            this.gamepadPolling = null;
        }

        this.controllers.clear();
        this.buttonStates.clear();
        this.axisValues.clear();
        this.lastTimestamp.clear();

        console.log("🧹 手柄支持系统已销毁");
    }
}

// 扩展版控制器系统，增加高级功能
class AdvancedControllerSupport extends ControllerSupportSystem {
    constructor() {
        super();
        this.adaptiveTriggers = new Map(); // 自适应扳机
        this.motionControls = new Map();    // 动作控制
        this.profileManagement = new ProfileManager();

        this.setupAdvancedFeatures();
        console.log("🎮 AdvancedControllerSupport 已初始化");
    }

    // 设置高级功能
    setupAdvancedFeatures() {
        // 设置配置文件管理
        this.setupProfileManagement();

        // 初始化高级功能
        this.initializeAdaptiveTriggers();
        this.initializeMotionControls();

        console.log("⚙️ 高级控制器功能已设置");
    }

    // 设置配置文件管理
    setupProfileManagement() {
        this.profileManagement = {
            profiles: {},
            currentProfile: 'default',

            saveProfile: (name, config) => {
                this.profileManagement.profiles[name] = config;
                localStorage.setItem(`controller-profile-${name}`, JSON.stringify(config));
            },

            loadProfile: (name) => {
                if (this.profileManagement.profiles[name]) {
                    return this.profileManagement.profiles[name];
                }

                const saved = localStorage.getItem(`controller-profile-${name}`);
                if (saved) {
                    try {
                        const config = JSON.parse(saved);
                        this.profileManagement.profiles[name] = config;
                        return config;
                    } catch (e) {
                        console.error('Failed to load controller profile:', e);
                    }
                }

                return null;
            },

            setCurrentProfile: (name) => {
                const profile = this.profileManagement.loadProfile(name);
                if (profile) {
                    this.currentMapping = { ...profile };
                    this.profileManagement.currentProfile = name;
                    console.log(`🎮 切换到配置文件: ${name}`);
                    return true;
                }
                return false;
            }
        };
    }

    // 初始化自适应扳机
    initializeAdaptiveTriggers() {
        // 检测是否有自适应扳机支持
        console.log("⚙️ 初始化自适应扳机支持");
    }

    // 初始化动作控制
    initializeMotionControls() {
        // 检测设备方向传感器等
        console.log("⚙️ 初始化动作控制支持");
    }

    // 高级移动处理（支持更精细的摇杆移动）
    handleAdvancedMovement(x, y) {
        // 计算更精确的角度和距离
        const angle = Math.atan2(y, x);
        const magnitude = Math.min(1, Math.sqrt(x*x + y*y));

        // 应用更平滑的移动
        const moveX = Math.cos(angle) * magnitude;
        const moveY = Math.sin(angle) * magnitude;

        // 调用游戏的高级移动函数
        if (window.advancedMovePlayer) {
            window.advancedMovePlayer(moveX, moveY, magnitude, angle);
        }

        console.log(`🕹️ 高级移动: 角度=${angle}, 幅度=${magnitude}`);
    }

    // 高级瞄准处理
    handleAdvancedAiming(x, y) {
        // 更精确的瞄准计算
        const angle = Math.atan2(y, x);

        // 提供更平滑的瞄准过渡
        if (window.smoothAimToward) {
            window.smoothAimToward(angle);
        }

        console.log(`🎯 高级瞄准: 角度=${angle}`);
    }

    // 创建控制器配置文件
    createProfile(name, mappingConfig) {
        this.profileManagement.saveProfile(name, mappingConfig);
        console.log(`🎮 创建控制器配置文件: ${name}`);
    }

    // 切换到指定配置文件
    switchProfile(name) {
        return this.profileManagement.setCurrentProfile(name);
    }

    // 获取当前配置文件
    getCurrentProfileName() {
        return this.profileManagement.currentProfile;
    }

    // 获取所有配置文件
    getAllProfiles() {
        return Object.keys(this.profileManagement.profiles);
    }

    // 重写handleMovement以使用高级移动
    handleMovement(x, y) {
        this.handleAdvancedMovement(x, y);
    }

    // 重写handleAiming以使用高级瞄准
    handleAiming(x, y) {
        this.handleAdvancedAiming(x, y);
    }

    // 销毁高级功能
    destroy() {
        super.destroy();

        this.adaptiveTriggers.clear();
        this.motionControls.clear();
        this.profileManagement = null;

        console.log("🧹 高级控制器支持系统已销毁");
    }
}

// 初始化控制器支持系统
const controllerSystem = new AdvancedControllerSupport();

// 将控制器系统添加到全局作用域
window.ControllerSupportSystem = ControllerSupportSystem;
window.AdvancedControllerSupport = AdvancedControllerSupport;
window.controllerSystem = controllerSystem;

// 便捷函数
window.enableController = (enable) => controllerSystem.enableController(enable);
window.isControllerConnected = () => controllerSystem.isControllerConnected();
window.getControllerStatus = () => controllerSystem.getControllerStatus();
window.calibrateAxes = () => controllerSystem.calibrateAxes();
window.getAllControllersInfo = () => controllerSystem.getAllControllersInfo();

console.log("🚀 手柄支持系统已完全加载");