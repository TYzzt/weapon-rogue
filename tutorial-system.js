// ==================== 教程系统 ====================

class TutorialSystem {
    constructor() {
        this.tutorialSteps = [
            {
                id: 'welcome',
                title: () => t('tutorialWelcome'),
                message: () => t('tutorialWelcomeMsg'),
                condition: () => true,  // 总是显示第一步
                onShow: () => this.centerTutorialBox(),
                onNext: () => {}
            },
            {
                id: 'movement',
                title: () => t('tutorialMovement'),
                message: () => t('tutorialMovementMsg'),
                condition: () => true,
                onShow: () => {},
                onNext: () => {}
            },
            {
                id: 'combat',
                title: () => t('tutorialCombat'),
                message: () => t('tutorialCombatMsg'),
                condition: () => gameState.level >= 1,
                onShow: () => {},
                onNext: () => {}
            },
            {
                id: 'weapons',
                title: () => t('tutorialWeapons'),
                message: () => t('tutorialWeaponsMsg'),
                condition: () => gameState.kills >= 1,  // 击杀至少一个敌人后显示
                onShow: () => {},
                onNext: () => {}
            },
            {
                id: 'skills',
                title: () => t('tutorialSkills'),
                message: () => t('tutorialSkillsMsg'),
                condition: () => gameState.player?.weapon,  // 拥有武器后显示
                onShow: () => {},
                onNext: () => {}
            },
            {
                id: 'complete',
                title: () => t('tutorialComplete'),
                message: () => t('tutorialCompleteMsg'),
                condition: () => true,
                onShow: () => {},
                onNext: () => this.finishTutorial()
            }
        ];

        this.currentStep = 0;
        this.tutorialCompleted = false;
        this.tutorialActive = false;
        this.tutorialBox = null;

        // 检查是否已完成教程
        const savedTutorial = localStorage.getItem('tutorialCompleted');
        if (savedTutorial) {
            this.tutorialCompleted = JSON.parse(savedTutorial);
        }
    }

    // 开始教程
    startTutorial(force = false) {
        if (this.tutorialCompleted && !force) {
            return;
        }

        this.currentStep = 0;
        this.tutorialActive = true;
        this.showCurrentStep();
    }

    // 显示当前步骤
    showCurrentStep() {
        if (this.currentStep >= this.tutorialSteps.length) {
            this.finishTutorial();
            return;
        }

        const step = this.tutorialSteps[this.currentStep];

        // 创建教程弹窗
        this.createTutorialBox(step);
    }

    // 创建教程弹窗
    createTutorialBox(step) {
        // 如果已有教程框，先移除
        if (this.tutorialBox) {
            this.tutorialBox.remove();
        }

        this.tutorialBox = document.createElement('div');
        this.tutorialBox.id = 'tutorial-box';
        this.tutorialBox.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(145deg, #1a1a2e, #16213e);
            color: #e6e6e6;
            padding: 25px;
            border-radius: 12px;
            z-index: 1000;
            box-shadow: 0 0 30px rgba(100, 100, 255, 0.5);
            border: 2px solid #4cc9f0;
            min-width: 400px;
            min-height: 200px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
        `;

        this.tutorialBox.innerHTML = `
            <h3 style="color: #4cc9f0; margin-top: 0; margin-bottom: 15px; font-size: 24px;">
                ${step.title()}
            </h3>
            <p style="font-size: 18px; margin: 15px 0; line-height: 1.5; flex-grow: 1; display: flex; align-items: center;">
                ${step.message()}
            </p>
            <div style="margin-top: 20px; display: flex; gap: 15px;">
                <button id="prev-tutorial-btn" class="tutorial-btn" style="
                    background: #4a4a8a; color: white; border: none; padding: 10px 20px;
                    border-radius: 6px; cursor: pointer; font-size: 16px; min-width: 80px;
                ">
                    ← ${this.currentStep > 0 ? '上一步' : '跳过'}
                </button>
                <button id="next-tutorial-btn" class="tutorial-btn" style="
                    background: #4361ee; color: white; border: none; padding: 10px 20px;
                    border-radius: 6px; cursor: pointer; font-size: 16px; min-width: 80px;
                ">
                    ${this.currentStep < this.tutorialSteps.length - 1 ? '下一步 →' : '完成'}
                </button>
            </div>
            <div style="margin-top: 15px; font-size: 14px; color: #a0a0c0;">
                ${this.currentStep + 1} / ${this.tutorialSteps.length}
            </div>
        `;

        document.body.appendChild(this.tutorialBox);

        // 绑定按钮事件
        document.getElementById('prev-tutorial-btn').addEventListener('click', () => {
            if (this.currentStep > 0) {
                this.previousStep();
            } else {
                this.skipTutorial();
            }
        });

        document.getElementById('next-tutorial-btn').addEventListener('click', () => {
            this.nextStep();
        });

        // 执行显示回调
        if (step.onShow) {
            step.onShow();
        }
    }

    // 下一步
    nextStep() {
        const currentStep = this.tutorialSteps[this.currentStep];
        if (currentStep.onNext) {
            currentStep.onNext();
        }

        this.currentStep++;
        if (this.currentStep >= this.tutorialSteps.length) {
            this.finishTutorial();
        } else {
            this.showCurrentStep();
        }
    }

    // 上一步
    previousStep() {
        this.currentStep--;
        if (this.currentStep < 0) {
            this.currentStep = 0;
        }
        this.showCurrentStep();
    }

    // 跳过教程
    skipTutorial() {
        this.finishTutorial();
    }

    // 完成教程
    finishTutorial() {
        this.tutorialCompleted = true;
        this.tutorialActive = false;

        // 保存教程完成状态
        localStorage.setItem('tutorialCompleted', JSON.stringify(true));

        // 移除教程框
        if (this.tutorialBox) {
            this.tutorialBox.remove();
            this.tutorialBox = null;
        }

        // 显示完成提示
        if (typeof showCombatLog !== 'undefined') {
            showCombatLog('🎓 教程已完成！祝您游戏愉快！', 'weapon-get');
        }
    }

    // 检查是否应该显示特定步骤
    shouldShowStep(stepIndex) {
        if (stepIndex >= this.tutorialSteps.length) return false;

        const step = this.tutorialSteps[stepIndex];
        return step.condition();
    }

    // 重置教程（用于调试或重新开始）
    resetTutorial() {
        this.tutorialCompleted = false;
        this.currentStep = 0;
        localStorage.removeItem('tutorialCompleted');
    }

    // 检查教程状态
    isTutorialCompleted() {
        return this.tutorialCompleted;
    }

    // 在特定事件触发时检查是否需要显示教程
    checkTutorialTrigger(event) {
        if (this.tutorialCompleted || this.tutorialActive) {
            return;
        }

        // 检查是否有需要显示的步骤
        for (let i = this.currentStep; i < this.tutorialSteps.length; i++) {
            if (this.shouldShowStep(i)) {
                // 如果是基于事件触发的步骤，可能需要自动显示
                if (event && i > this.currentStep) {
                    // 在某些事件发生时显示下一个合适教程
                    this.currentStep = i;
                    this.tutorialActive = true;
                    this.showCurrentStep();
                    break;
                }
            }
        }
    }
}

// 创建教程系统实例
const tutorialSystem = new TutorialSystem();

// 页面加载完成后检查是否显示教程
document.addEventListener('DOMContentLoaded', () => {
    // 检查URL参数或者特定条件来决定是否显示教程
    if (!tutorialSystem.isTutorialCompleted()) {
        // 可以添加延时以避免阻碍游戏启动
        setTimeout(() => {
            if (!tutorialSystem.isTutorialCompleted()) {
                tutorialSystem.startTutorial();
            }
        }, 2000);
    }
});

// 在游戏事件中触发教程
function triggerTutorialEvent(event) {
    if (typeof tutorialSystem !== 'undefined') {
        tutorialSystem.checkTutorialTrigger(event);
    }
}

// 在游戏代码中调用这些事件来触发教程
// 例如在击杀敌人时调用 triggerTutorialEvent('kill_enemy')