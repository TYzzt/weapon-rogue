// ==================== Steam版新手引导教程系统 ====================
//
// 实现游戏的完整新手引导系统，包括：
// 1. 游戏机制介绍
// 2. 操作指南
// 3. 交互式教程
// 4. 提示系统

class SteamTutorialSystem {
    constructor() {
        this.tutorialSteps = []; // 教程步骤
        this.currentStep = 0; // 当前步骤
        this.isActive = false; // 是否激活教程
        this.tutorialModal = null; // 教程模态窗口
        this.overlay = null; // 高亮遮罩
        this.completedSteps = new Set(); // 已完成的步骤
        this.autoAdvance = true; // 是否自动前进到下一步

        // 初始化教程步骤
        this.initializeTutorialSteps();

        // 创建教程UI元素
        this.createTutorialUI();

        console.log('Steam版新手引导教程系统已初始化');
    }

    // 初始化教程步骤
    initializeTutorialSteps() {
        this.tutorialSteps = [
            {
                id: 'welcome',
                title: '欢迎来到武器替换者!',
                description: '这是一款独特的Roguelike游戏，每次拾取新武器都会替换当前武器',
                highlightElement: null,
                action: 'showWelcomeMessage',
                nextCondition: 'clickAnyButton',
                position: 'center'
            },
            {
                id: 'gameConcept',
                title: '核心机制',
                description: '在游戏中，每当您拾取一把新武器，它将立即替换您当前的武器。合理利用不同武器的特性来战胜敌人！',
                highlightElement: null,
                action: 'explainCoreConcept',
                nextCondition: 'anyKey',
                position: 'center'
            },
            {
                id: 'movement',
                title: '移动控制',
                description: '使用 WASD 键或方向键来控制角色移动。尝试移动您的角色！',
                highlightElement: null,
                action: 'highlightMovementKeys',
                nextCondition: 'moveCharacter',
                position: 'center'
            },
            {
                id: 'combat',
                title: '战斗系统',
                description: '靠近敌人即可自动攻击。您的武器决定了攻击力。注意躲避敌人的攻击！',
                highlightElement: null,
                action: 'explainCombat',
                nextCondition: 'attackEnemy',
                position: 'center'
            },
            {
                id: 'weaponPickup',
                title: '武器替换',
                description: '当您接触到新的武器时，它会立即替换您当前的武器。武器有不同稀有度，影响攻击力。',
                highlightElement: null,
                action: 'highlightWeaponPickup',
                nextCondition: 'pickupWeapon',
                position: 'center'
            },
            {
                id: 'enemies',
                title: '敌人类型',
                description: '面对各种类型的敌人，每个敌人都有不同的攻击模式和生命值。小心强大的精英敌人！',
                highlightElement: null,
                action: 'explainEnemies',
                nextCondition: 'killEnemy',
                position: 'center'
            },
            {
                id: 'relics',
                title: '遗物系统',
                description: '拾取遗物可以获得永久性的能力提升，帮助您在后续关卡中生存。',
                highlightElement: null,
                action: 'explainRelics',
                nextCondition: 'pickupRelic',
                position: 'center'
            },
            {
                id: 'levelProgression',
                title: '关卡推进',
                description: '每击败一定数量的敌人就会进入下一关，敌人会变得更强大。努力到达更高的关卡！',
                highlightElement: null,
                action: 'explainLevelProgression',
                nextCondition: 'reachLevel2',
                position: 'center'
            },
            {
                id: 'achievements',
                title: '成就系统',
                description: '游戏内置丰富的成就系统，挑战自己完成各种有趣的挑战！',
                highlightElement: 'achievements-btn',
                action: 'showAchievements',
                nextCondition: 'viewAchievements',
                position: 'bottom-right'
            },
            {
                id: 'completion',
                title: '教程完成!',
                description: '恭喜您掌握了游戏基础！现在您可以自由探索游戏内容，挑战更高关卡。祝您游戏愉快！',
                highlightElement: null,
                action: 'showCompletionMessage',
                nextCondition: 'none',
                position: 'center'
            }
        ];
    }

    // 创建教程UI元素
    createTutorialUI() {
        // 创建教程模态窗口
        this.tutorialModal = document.createElement('div');
        this.tutorialModal.id = 'tutorial-modal';
        this.tutorialModal.className = 'tutorial-modal hidden';
        this.tutorialModal.innerHTML = `
            <div class="tutorial-content">
                <div class="tutorial-header">
                    <h3 id="tutorial-title">教程标题</h3>
                    <button id="skip-tutorial" class="skip-btn">×</button>
                </div>
                <div class="tutorial-body">
                    <p id="tutorial-description">教程描述</p>
                    <div id="tutorial-highlight-area" class="highlight-area"></div>
                </div>
                <div class="tutorial-footer">
                    <div class="tutorial-progress">
                        <span id="current-step">1</span>/<span id="total-steps">${this.tutorialSteps.length}</span>
                    </div>
                    <div class="tutorial-actions">
                        <button id="prev-step" class="tutorial-btn btn-secondary">上一步</button>
                        <button id="next-step" class="tutorial-btn btn-primary">下一步</button>
                    </div>
                </div>
            </div>
        `;

        // 创建高亮遮罩
        this.overlay = document.createElement('div');
        this.overlay.id = 'tutorial-overlay';
        this.overlay.className = 'tutorial-overlay hidden';

        document.body.appendChild(this.tutorialModal);
        document.body.appendChild(this.overlay);

        // 绑定事件
        this.bindTutorialEvents();
    }

    // 绑定教程事件
    bindTutorialEvents() {
        // 下一步按钮
        document.getElementById('next-step')?.addEventListener('click', () => {
            this.nextStep();
        });

        // 上一步按钮
        document.getElementById('prev-step')?.addEventListener('click', () => {
            this.previousStep();
        });

        // 跳过教程按钮
        document.getElementById('skip-tutorial')?.addEventListener('click', () => {
            this.skipTutorial();
        });

        // 键盘事件
        document.addEventListener('keydown', (e) => {
            if (!this.isActive) return;

            // ESC键跳过教程
            if (e.key === 'Escape') {
                this.skipTutorial();
            }
            // 空格键或回车键下一步
            else if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                this.nextStep();
            }
        });

        // 点击外部区域下一步
        this.tutorialModal.addEventListener('click', (e) => {
            if (e.target === this.tutorialModal || e.target === this.overlay) {
                this.nextStep();
            }
        });
    }

    // 开始教程
    startTutorial(force = false) {
        // 检查是否已完成教程
        if (!force && this.isTutorialCompleted()) {
            console.log('教程已经完成，无需再次开始');
            return;
        }

        this.isActive = true;
        this.currentStep = 0;
        this.completedSteps.clear();

        // 显示第一个教程步骤
        this.showCurrentStep();

        // 隐藏游戏UI元素
        this.toggleGameUI(false);

        console.log('教程已开始');
    }

    // 显示当前步骤
    showCurrentStep() {
        if (this.currentStep < 0 || this.currentStep >= this.tutorialSteps.length) {
            console.error('无效的教程步骤索引:', this.currentStep);
            return;
        }

        const step = this.tutorialSteps[this.currentStep];
        this.updateTutorialUI(step);

        // 执行步骤特定操作
        this.executeStepAction(step);

        // 显示教程界面
        this.tutorialModal.classList.remove('hidden');
        this.overlay.classList.remove('hidden');

        console.log(`显示教程步骤 ${this.currentStep + 1}: ${step.title}`);
    }

    // 更新教程UI
    updateTutorialUI(step) {
        document.getElementById('tutorial-title').textContent = step.title;
        document.getElementById('tutorial-description').textContent = step.description;
        document.getElementById('current-step').textContent = this.currentStep + 1;
        document.getElementById('total-steps').textContent = this.tutorialSteps.length;

        // 根据步骤位置调整样式
        this.tutorialModal.className = `tutorial-modal tutorial-position-${step.position}`;
    }

    // 执行步骤特定操作
    executeStepAction(step) {
        switch (step.action) {
            case 'showWelcomeMessage':
                this.showWelcomeAnimation();
                break;
            case 'explainCoreConcept':
                this.highlightCoreMechanic();
                break;
            case 'highlightMovementKeys':
                this.highlightMovementControls();
                break;
            case 'explainCombat':
                this.highlightCombatArea();
                break;
            case 'highlightWeaponPickup':
                this.highlightWeaponSystem();
                break;
            case 'explainEnemies':
                this.highlightEnemyInfo();
                break;
            case 'explainRelics':
                this.highlightRelicSystem();
                break;
            case 'explainLevelProgression':
                this.highlightProgressionSystem();
                break;
            case 'showAchievements':
                this.highlightAchievementButton();
                break;
            case 'showCompletionMessage':
                this.showCompletionAnimation();
                break;
            default:
                console.log('未知的步骤动作:', step.action);
        }
    }

    // 显示欢迎动画
    showWelcomeAnimation() {
        // 创建欢迎特效
        this.createFloatingText('欢迎!', 100, 100, 'welcome-effect');
    }

    // 高亮核心机制
    highlightCoreMechanic() {
        // 创建机制解释动画
        this.createFloatingText('武器替换系统', 200, 200, 'mechanic-highlight');
    }

    // 高亮移动控制
    highlightMovementControls() {
        // 在屏幕上高亮显示WASD键位
        this.highlightKeyControls(['W', 'A', 'S', 'D']);
    }

    // 高亮战斗区域
    highlightCombatArea() {
        // 创建战斗提示
        this.createFloatingText('靠近敌人进行攻击', 300, 300, 'combat-tip');
    }

    // 高亮武器系统
    highlightWeaponSystem() {
        // 创建武器提示
        this.createFloatingText('新武器 → 替换当前武器', 400, 250, 'weapon-tip');
    }

    // 高亮敌人信息
    highlightEnemyInfo() {
        // 创建敌人提示
        this.createFloatingText('注意不同敌人类型', 350, 200, 'enemy-tip');
    }

    // 高亮遗物系统
    highlightRelicSystem() {
        // 创建遗物提示
        this.createFloatingText('拾取遗物获得永久提升', 450, 300, 'relic-tip');
    }

    // 高亮进度系统
    highlightProgressionSystem() {
        // 创建进度提示
        this.createFloatingText('击败敌人进入新关卡', 250, 150, 'progression-tip');
    }

    // 高亮成就按钮
    highlightAchievementButton() {
        const achievementsBtn = document.getElementById('achievements-btn');
        if (achievementsBtn) {
            achievementsBtn.classList.add('pulse-animation');
            setTimeout(() => {
                achievementsBtn.classList.remove('pulse-animation');
            }, 2000);
        }
    }

    // 显示完成动画
    showCompletionAnimation() {
        this.createFloatingText('教程完成! 🎉', 200, 200, 'completion-effect');
    }

    // 创建浮动文本
    createFloatingText(text, x, y, className = '') {
        const floatingElement = document.createElement('div');
        floatingElement.className = `floating-text ${className}`;
        floatingElement.textContent = text;
        floatingElement.style.left = `${x}px`;
        floatingElement.style.top = `${y}px`;

        document.body.appendChild(floatingElement);

        // 添加淡出效果
        setTimeout(() => {
            floatingElement.style.transition = 'opacity 1s ease-out';
            floatingElement.style.opacity = '0';

            setTimeout(() => {
                if (floatingElement.parentNode) {
                    floatingElement.parentNode.removeChild(floatingElement);
                }
            }, 1000);
        }, 2000);
    }

    // 高亮按键控制
    highlightKeyControls(keys) {
        keys.forEach(key => {
            const keyElement = document.createElement('div');
            keyElement.className = 'key-highlight';
            keyElement.textContent = key;
            keyElement.style.position = 'fixed';
            keyElement.style.background = 'rgba(255, 215, 0, 0.8)';
            keyElement.style.color = 'black';
            keyElement.style.padding = '10px';
            keyElement.style.borderRadius = '5px';
            keyElement.style.zIndex = '10000';
            keyElement.style.fontWeight = 'bold';

            // 根据按键位置设置位置
            const positions = {
                'W': { top: '20%', left: '50%', transform: 'translate(-50%, -50%)' },
                'A': { top: '50%', left: '30%', transform: 'translate(-50%, -50%)' },
                'S': { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
                'D': { top: '50%', left: '70%', transform: 'translate(-50%, -50%)' }
            };

            if (positions[key]) {
                keyElement.style.top = positions[key].top;
                keyElement.style.left = positions[key].left;
                keyElement.style.transform = positions[key].transform;
            }

            document.body.appendChild(keyElement);

            // 3秒后移除
            setTimeout(() => {
                if (keyElement.parentNode) {
                    keyElement.parentNode.removeChild(keyElement);
                }
            }, 3000);
        });
    }

    // 下一步
    nextStep() {
        if (this.currentStep < this.tutorialSteps.length - 1) {
            this.completedSteps.add(this.tutorialSteps[this.currentStep].id);
            this.currentStep++;
            this.showCurrentStep();
        } else {
            // 教程完成
            this.completeTutorial();
        }
    }

    // 上一步
    previousStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.showCurrentStep();
        }
    }

    // 跳过教程
    skipTutorial() {
        this.isActive = false;
        this.hideTutorial();

        // 标记为已完成（但不是通过正常流程）
        this.markAsCompleted();

        console.log('教程已跳过');
    }

    // 完成教程
    completeTutorial() {
        this.isActive = false;
        this.completedSteps = new Set(this.tutorialSteps.map(step => step.id));
        this.hideTutorial();
        this.markAsCompleted();

        console.log('教程已完成');
    }

    // 隐藏教程
    hideTutorial() {
        this.tutorialModal.classList.add('hidden');
        this.overlay.classList.add('hidden');

        // 显示游戏UI元素
        this.toggleGameUI(true);
    }

    // 切换游戏UI显示状态
    toggleGameUI(show) {
        const gameUIElements = document.querySelectorAll('.game-ui, #hud, #game-overlay, #canvas-container');
        gameUIElements.forEach(element => {
            element.style.visibility = show ? 'visible' : 'hidden';
        });
    }

    // 检查是否已完成教程
    isTutorialCompleted() {
        // 检查localStorage中是否有完成标记
        const completed = localStorage.getItem('weaponRogueTutorialCompleted');
        return completed === 'true';
    }

    // 标记为已完成
    markAsCompleted() {
        localStorage.setItem('weaponRogueTutorialCompleted', 'true');
    }

    // 重置教程状态
    resetTutorial() {
        localStorage.removeItem('weaponRogueTutorialCompleted');
        this.completedSteps.clear();
        console.log('教程状态已重置');
    }

    // 显示提示信息
    showHint(message, duration = 5000) {
        const hintElement = document.createElement('div');
        hintElement.className = 'tutorial-hint';
        hintElement.innerHTML = `
            <div class="hint-content">
                <span class="hint-icon">💡</span>
                <span class="hint-text">${message}</span>
                <button class="hint-close" onclick="this.parentNode.parentNode.remove()">×</button>
            </div>
        `;

        document.body.appendChild(hintElement);

        // 设定定时器移除提示
        setTimeout(() => {
            if (hintElement.parentNode) {
                hintElement.parentNode.removeChild(hintElement);
            }
        }, duration);
    }

    // 检查是否应该显示特定提示
    shouldShowHint(hintId) {
        const shownHints = JSON.parse(localStorage.getItem('shownTutorialHints') || '[]');
        return !shownHints.includes(hintId);
    }

    // 标记提示已显示
    markHintAsShown(hintId) {
        let shownHints = JSON.parse(localStorage.getItem('shownTutorialHints') || '[]');
        if (!shownHints.includes(hintId)) {
            shownHints.push(hintId);
            localStorage.setItem('shownTutorialHints', JSON.stringify(shownHints));
        }
    }

    // 显示上下文相关提示
    showContextualHint(context) {
        let message = '';
        let hintId = '';

        switch (context) {
            case 'first_enemy':
                message = '靠近敌人即可自动攻击。注意躲避敌人的攻击！';
                hintId = 'first_enemy_hint';
                break;
            case 'first_weapon':
                message = '新武器会替换当前武器。观察武器的伤害和稀有度！';
                hintId = 'first_weapon_hint';
                break;
            case 'low_health':
                message = '生命值较低！寻找生命药水或遗物来恢复生命值。';
                hintId = 'low_health_hint';
                break;
            case 'combo_building':
                message = '连续击败敌人可以建立连击！连击越高，奖励越大。';
                hintId = 'combo_building_hint';
                break;
            default:
                return;
        }

        if (this.shouldShowHint(hintId)) {
            this.showHint(message);
            this.markHintAsShown(hintId);
        }
    }

    // 获取当前步骤信息
    getCurrentStepInfo() {
        if (this.currentStep >= 0 && this.currentStep < this.tutorialSteps.length) {
            return {
                step: this.currentStep + 1,
                total: this.tutorialSteps.length,
                title: this.tutorialSteps[this.currentStep].title,
                description: this.tutorialSteps[this.currentStep].description,
                completed: this.completedSteps.size,
                progress: (this.completedSteps.size / this.tutorialSteps.length) * 100
            };
        }
        return null;
    }

    // 更新游戏状态相关的教程检查
    checkGameTutorialConditions() {
        if (!this.isActive) return;

        const currentStep = this.tutorialSteps[this.currentStep];
        let shouldAdvance = false;

        switch (currentStep.nextCondition) {
            case 'clickAnyButton':
                // 通过点击按钮操作，自动在点击后下一步
                shouldAdvance = true;
                break;
            case 'anyKey':
                // 任意按键后下一步
                shouldAdvance = true;
                break;
            case 'moveCharacter':
                // 检查玩家是否移动（如果游戏逻辑可用）
                if (typeof gameState !== 'undefined' && gameState.player) {
                    // 实际游戏中应检查玩家是否实际移动了
                    shouldAdvance = true; // 示例逻辑
                }
                break;
            case 'attackEnemy':
                // 检查是否攻击了敌人
                shouldAdvance = true; // 示例逻辑
                break;
            case 'pickupWeapon':
                // 检查是否拾取了武器
                shouldAdvance = true; // 示例逻辑
                break;
            case 'killEnemy':
                // 检查是否击败了敌人
                shouldAdvance = true; // 示例逻辑
                break;
            case 'pickupRelic':
                // 检查是否拾取了遗物
                shouldAdvance = true; // 示例逻辑
                break;
            case 'reachLevel2':
                // 检查是否到达第2关
                if (typeof gameState !== 'undefined' && gameState.level >= 2) {
                    shouldAdvance = true;
                }
                break;
        }

        if (shouldAdvance && this.autoAdvance) {
            // 添加一点延迟让玩家阅读当前提示
            setTimeout(() => {
                this.nextStep();
            }, 3000);
        }
    }

    // 在特定游戏事件时显示教程提示
    onGameEvent(event, data) {
        switch (event) {
            case 'gameStart':
                // 检查玩家是否已经完成了教程，如果没有则询问是否开始
                if (!this.isTutorialCompleted() &&
                    localStorage.getItem('askedToShowTutorial') !== 'true') {

                    if (confirm('您是第一次玩游戏吗？需要查看新手教程吗？')) {
                        this.startTutorial();
                    }
                    localStorage.setItem('askedToShowTutorial', 'true');
                }
                break;

            case 'firstEnemyEncountered':
                this.showContextualHint('first_enemy');
                break;

            case 'firstWeaponAcquired':
                this.showContextualHint('first_weapon');
                break;

            case 'playerLowHealth':
                this.showContextualHint('low_health');
                break;

            case 'comboIncreasing':
                this.showContextualHint('combo_building');
                break;

            default:
                // 处理其他游戏事件
                break;
        }
    }
}

// 创建全局教程系统实例
window.steamTutorialSystem = new SteamTutorialSystem();

// 页面加载完成后绑定游戏事件
document.addEventListener('DOMContentLoaded', () => {
    if (window.steamTutorialSystem) {
        // 检查是否应该显示教程
        if (!window.steamTutorialSystem.isTutorialCompleted()) {
            // 询问玩家是否想要查看教程
            setTimeout(() => {
                if (confirm('您想要查看新手教程来学习游戏玩法吗？')) {
                    window.steamTutorialSystem.startTutorial();
                }
            }, 2000);
        }
    }
});

// 如果存在游戏系统，绑定事件
if (typeof window.gameState !== 'undefined') {
    // 绑定游戏事件监听
    window.addEventListener('gameStart', (e) => {
        if (window.steamTutorialSystem) {
            window.steamTutorialSystem.onGameEvent('gameStart');
        }
    });

    window.addEventListener('firstEnemyEncountered', (e) => {
        if (window.steamTutorialSystem) {
            window.steamTutorialSystem.onGameEvent('firstEnemyEncountered');
        }
    });
}

// 添加教程相关的CSS样式
const tutorialStyles = `
    <style id="tutorial-styles">
        /* 教程模态窗口 */
        .tutorial-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            transition: opacity 0.3s ease;
        }

        .tutorial-modal.hidden {
            display: none;
        }

        .tutorial-position-center {
            justify-content: center;
            align-items: center;
        }

        .tutorial-position-top {
            justify-content: center;
            align-items: flex-start;
            padding-top: 100px;
        }

        .tutorial-position-bottom {
            justify-content: center;
            align-items: flex-end;
            padding-bottom: 100px;
        }

        .tutorial-position-top-left {
            justify-content: flex-start;
            align-items: flex-start;
            padding: 50px;
        }

        .tutorial-position-top-right {
            justify-content: flex-end;
            align-items: flex-start;
            padding: 50px;
        }

        .tutorial-position-bottom-left {
            justify-content: flex-start;
            align-items: flex-end;
            padding: 50px;
        }

        .tutorial-position-bottom-right {
            justify-content: flex-end;
            align-items: flex-end;
            padding: 50px;
        }

        .tutorial-content {
            background: linear-gradient(145deg, #2c3e50, #1a1a2e);
            border-radius: 15px;
            border: 2px solid #4a90e2;
            box-shadow: 0 0 30px rgba(74, 144, 226, 0.5);
            width: 90%;
            max-width: 600px;
            color: white;
            overflow: hidden;
            animation: slideIn 0.5s ease-out;
        }

        @keyframes slideIn {
            from { transform: translateY(-50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }

        .tutorial-header {
            background: linear-gradient(to right, #4a90e2, #357abd);
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .tutorial-header h3 {
            margin: 0;
            font-size: 1.5em;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }

        .skip-btn {
            background: rgba(255, 0, 0, 0.3);
            border: none;
            color: white;
            font-size: 1.5em;
            cursor: pointer;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .skip-btn:hover {
            background: rgba(255, 0, 0, 0.5);
        }

        .tutorial-body {
            padding: 30px;
        }

        .tutorial-body p {
            font-size: 1.1em;
            line-height: 1.6;
            margin: 0 0 20px 0;
        }

        .highlight-area {
            background: rgba(255, 215, 0, 0.2);
            border: 2px dashed gold;
            border-radius: 10px;
            padding: 15px;
            margin: 20px 0;
        }

        .tutorial-footer {
            padding: 20px;
            background: rgba(0, 0, 0, 0.3);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .tutorial-progress {
            font-size: 1.1em;
            font-weight: bold;
            color: #4a90e2;
        }

        .tutorial-actions {
            display: flex;
            gap: 10px;
        }

        .tutorial-btn {
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1em;
            font-weight: bold;
            transition: all 0.3s ease;
        }

        .btn-primary {
            background: linear-gradient(to right, #4a90e2, #357abd);
            color: white;
        }

        .btn-primary:hover {
            background: linear-gradient(to right, #357abd, #2a5a9b);
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(58, 134, 207, 0.4);
        }

        .btn-secondary {
            background: linear-gradient(to right, #7f8c8d, #34495e);
            color: white;
        }

        .btn-secondary:hover {
            background: linear-gradient(to right, #34495e, #2c3e50);
            transform: translateY(-2px);
        }

        .btn-danger {
            background: linear-gradient(to right, #e74c3c, #c0392b);
            color: white;
        }

        .btn-danger:hover {
            background: linear-gradient(to right, #c0392b, #a93226);
            transform: translateY(-2px);
        }

        /* 教程遮罩 */
        .tutorial-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 9999;
        }

        .tutorial-overlay.hidden {
            display: none;
        }

        /* 浮动文本 */
        .floating-text {
            position: fixed;
            background: rgba(255, 215, 0, 0.9);
            color: black;
            padding: 15px 25px;
            border-radius: 10px;
            font-weight: bold;
            font-size: 1.2em;
            z-index: 10001;
            pointer-events: none;
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
            animation: floatUp 3s ease-out forwards;
        }

        @keyframes floatUp {
            0% { transform: translateY(0) scale(1); opacity: 1; }
            100% { transform: translateY(-100px) scale(1.1); opacity: 0; }
        }

        .welcome-effect {
            background: linear-gradient(45deg, #ff8a00, #e52e71);
            color: white;
            font-size: 2em;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }

        .mechanic-highlight {
            background: linear-gradient(45deg, #00c9ff, #92fe9d);
            color: black;
        }

        .combat-tip {
            background: linear-gradient(45deg, #ff416c, #ff4b2b);
            color: white;
        }

        .weapon-tip {
            background: linear-gradient(45deg, #7b4397, #dc2430);
            color: white;
        }

        .completion-effect {
            background: linear-gradient(45deg, #00b09b, #96c93d);
            color: white;
            font-size: 1.8em;
        }

        /* 按键高亮 */
        .key-highlight {
            position: fixed;
            background: rgba(255, 215, 0, 0.9);
            color: black;
            padding: 15px;
            border-radius: 10px;
            font-weight: bold;
            font-size: 1.5em;
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
            z-index: 10002;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0% { transform: scale(1); box-shadow: 0 0 20px rgba(255, 215, 0, 0.8); }
            50% { transform: scale(1.1); box-shadow: 0 0 30px rgba(255, 215, 0, 1); }
            100% { transform: scale(1); box-shadow: 0 0 20px rgba(255, 215, 0, 0.8); }
        }

        /* 教程提示 */
        .tutorial-hint {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 0;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            z-index: 10003;
            max-width: 350px;
            animation: slideInRight 0.5s ease-out;
        }

        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }

        .hint-content {
            display: flex;
            align-items: center;
            padding: 15px 20px;
        }

        .hint-icon {
            font-size: 1.5em;
            margin-right: 10px;
        }

        .hint-text {
            flex: 1;
            margin-right: 10px;
        }

        .hint-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.5em;
            cursor: pointer;
            padding: 0;
            width: 25px;
            height: 25px;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .hint-close:hover {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
        }

        /* 按钮脉冲动画 */
        .pulse-animation {
            animation: pulse 2s infinite;
        }
    </style>
`;

// 添加样式到头部
document.head.insertAdjacentHTML('beforeend', tutorialStyles);

console.log("Steam版新手引导教程系统已准备就绪");