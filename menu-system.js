// ==================== 菜单系统 ====================
//
// 本系统实现游戏的完整菜单体系，包括主菜单、暂停菜单、设置菜单和成就菜单
// 以及响应式UI和流畅的导航体验

class MenuSystem {
    constructor() {
        this.currentMenu = 'main'; // 当前显示的菜单
        this.menuStack = []; // 菜单栈，用于导航历史
        this.uiElements = {}; // UI元素引用
        this.isInitialized = false;
        this.animationQueue = []; // 动画队列

        this.init();
        console.log("🎮 菜单系统已初始化");
    }

    // 初始化菜单系统
    init() {
        this.createDOMStructure();
        this.bindEvents();
        this.localizeText(); // 本地化文本
        this.applyTheme(); // 应用主题
        this.isInitialized = true;

        // 显示主菜单
        this.showMenu('main');
        console.log("📋 菜单系统初始化完成");
    }

    // 创建DOM结构
    createDOMStructure() {
        // 确保容器存在
        let container = document.getElementById('game-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'game-container';
            container.style.width = '100%';
            container.style.height = '100%';
            document.body.appendChild(container);
        }

        // 主菜单
        this.createMainMenu();

        // 暂停菜单
        this.createPauseMenu();

        // 设置菜单
        this.createSettingsMenu();

        // 成就菜单
        this.createAchievementsMenu();

        // 游戏结束菜单
        this.createGameOverMenu();

        // 加载界面
        this.createLoadingScreen();

        console.log("🏗️ 菜单DOM结构已创建");
    }

    // 创建主菜单
    createMainMenu() {
        const mainMenu = document.createElement('div');
        mainMenu.id = 'main-menu';
        mainMenu.className = 'menu main-menu';
        mainMenu.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.5s ease-in-out;
            backdrop-filter: blur(10px);
        `;
        mainMenu.innerHTML = `
            <div class="menu-content" style="
                text-align: center;
                color: white;
                z-index: 1001;
                padding: 2rem;
                background: rgba(0, 0, 0, 0.5);
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(5px);
                border: 1px solid rgba(255, 255, 255, 0.1);
            ">
                <h1 id="main-title" style="
                    font-size: 3rem;
                    margin-bottom: 1rem;
                    color: #4cc9f0;
                    text-shadow: 0 0 20px rgba(76, 201, 240, 0.7);
                    font-family: 'Arial', sans-serif;
                ">⚔️ 武器替换者</h1>

                <p id="main-subtitle" style="
                    font-size: 1.2rem;
                    margin-bottom: 2rem;
                    color: #e6e6e6;
                    max-width: 600px;
                    line-height: 1.6;
                ">敌人掉落的武器必定替换你当前的武器，这可能是好事，也可能是灾难...</p>

                <div id="main-menu-buttons" class="menu-buttons" style="
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    align-items: center;
                ">
                    <button id="start-game-btn" class="menu-button primary" style="
                        padding: 1rem 2rem;
                        font-size: 1.2rem;
                        background: linear-gradient(45deg, #4cc9f0, #4361ee);
                        color: white;
                        border: none;
                        border-radius: 50px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        min-width: 200px;
                        box-shadow: 0 5px 15px rgba(76, 201, 240, 0.4);
                    ">
                        <span style="margin-right: 0.5rem;">🎮</span>
                        <span id="start-game-text">开始游戏</span>
                    </button>

                    <button id="continue-game-btn" class="menu-button secondary" style="
                        padding: 1rem 2rem;
                        font-size: 1.2rem;
                        background: linear-gradient(45deg, #3a86ff, #3d5a80);
                        color: white;
                        border: none;
                        border-radius: 50px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        min-width: 200px;
                        opacity: 0.7;
                    ">
                        <span style="margin-right: 0.5rem;">⏱️</span>
                        <span id="continue-game-text">继续游戏</span>
                    </button>

                    <button id="achievements-btn" class="menu-button" style="
                        padding: 0.8rem 1.5rem;
                        font-size: 1rem;
                        background: rgba(255, 215, 0, 0.2);
                        color: gold;
                        border: 1px solid gold;
                        border-radius: 25px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        min-width: 180px;
                    ">
                        <span style="margin-right: 0.5rem;">🏆</span>
                        <span id="achievements-text">成就</span>
                    </button>

                    <button id="settings-btn" class="menu-button" style="
                        padding: 0.8rem 1.5rem;
                        font-size: 1rem;
                        background: rgba(255, 255, 255, 0.1);
                        color: silver;
                        border: 1px solid #666;
                        border-radius: 25px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        min-width: 180px;
                    ">
                        <span style="margin-right: 0.5rem;">⚙️</span>
                        <span id="settings-text">设置</span>
                    </button>

                    <button id="tutorial-btn" class="menu-button" style="
                        padding: 0.8rem 1.5rem;
                        font-size: 1rem;
                        background: rgba(50, 205, 50, 0.2);
                        color: #32cd32;
                        border: 1px solid #32cd32;
                        border-radius: 25px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        min-width: 180px;
                    ">
                        <span style="margin-right: 0.5rem;">📚</span>
                        <span id="tutorial-text">教程</span>
                    </button>
                </div>

                <div style="margin-top: 2rem; color: #aaa; font-size: 0.9rem;">
                    <p id="version-info">版本 1.0 | 为Steam准备</p>
                </div>
            </div>

            <div id="menu-background-animation" style="
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1000;
                pointer-events: none;
                opacity: 0.1;
            "></div>
        `;

        container.appendChild(mainMenu);
        this.uiElements.mainMenu = mainMenu;
    }

    // 创建暂停菜单
    createPauseMenu() {
        const pauseMenu = document.createElement('div');
        pauseMenu.id = 'pause-menu';
        pauseMenu.className = 'menu pause-menu';
        pauseMenu.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 1005;
            backdrop-filter: blur(5px);
        `;
        pauseMenu.innerHTML = `
            <div class="menu-content" style="
                text-align: center;
                color: white;
                background: rgba(30, 30, 46, 0.95);
                padding: 2rem;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
                border: 1px solid rgba(76, 201, 240, 0.3);
                min-width: 350px;
            ">
                <h2 id="pause-title" style="
                    color: #4cc9f0;
                    margin-bottom: 2rem;
                    font-size: 2rem;
                ">⏸️ 游戏暂停</h2>

                <div id="pause-menu-buttons" class="menu-buttons" style="
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    align-items: center;
                ">
                    <button id="resume-game-btn" class="menu-button primary" style="
                        padding: 1rem 2rem;
                        font-size: 1.1rem;
                        background: linear-gradient(45deg, #4cc9f0, #4361ee);
                        color: white;
                        border: none;
                        border-radius: 50px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        min-width: 200px;
                    ">
                        <span style="margin-right: 0.5rem;">▶️</span>
                        <span id="resume-game-text">继续游戏</span>
                    </button>

                    <button id="restart-game-btn" class="menu-button" style="
                        padding: 0.8rem 1.5rem;
                        font-size: 1rem;
                        background: rgba(220, 20, 60, 0.2);
                        color: #dc143c;
                        border: 1px solid #dc143c;
                        border-radius: 25px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        min-width: 200px;
                    ">
                        <span style="margin-right: 0.5rem;">🔄</span>
                        <span id="restart-game-text">重新开始</span>
                    </button>

                    <button id="settings-pause-btn" class="menu-button" style="
                        padding: 0.8rem 1.5rem;
                        font-size: 1rem;
                        background: rgba(255, 255, 255, 0.1);
                        color: silver;
                        border: 1px solid #666;
                        border-radius: 25px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        min-width: 200px;
                    ">
                        <span style="margin-right: 0.5rem;">⚙️</span>
                        <span id="settings-pause-text">设置</span>
                    </button>

                    <button id="main-menu-pause-btn" class="menu-button" style="
                        padding: 0.8rem 1.5rem;
                        font-size: 1rem;
                        background: rgba(139, 0, 0, 0.2);
                        color: #b22222;
                        border: 1px solid #b22222;
                        border-radius: 25px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        min-width: 200px;
                    ">
                        <span style="margin-right: 0.5rem;">🏠</span>
                        <span id="main-menu-pause-text">返回主菜单</span>
                    </button>
                </div>
            </div>
        `;

        container.appendChild(pauseMenu);
        this.uiElements.pauseMenu = pauseMenu;
    }

    // 创建设置菜单
    createSettingsMenu() {
        const settingsMenu = document.createElement('div');
        settingsMenu.id = 'settings-menu';
        settingsMenu.className = 'menu settings-menu';
        settingsMenu.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 1010;
            backdrop-filter: blur(5px);
        `;
        settingsMenu.innerHTML = `
            <div class="menu-content" style="
                text-align: center;
                color: white;
                background: rgba(30, 30, 46, 0.95);
                padding: 2rem;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
                border: 1px solid rgba(76, 201, 240, 0.3);
                min-width: 400px;
                max-width: 90%;
            ">
                <h2 id="settings-title" style="
                    color: #4cc9f0;
                    margin-bottom: 1.5rem;
                    font-size: 2rem;
                ">⚙️ 游戏设置</h2>

                <div class="settings-options" style="
                    text-align: left;
                    max-height: 60vh;
                    overflow-y: auto;
                    padding-right: 1rem;
                ">
                    <!-- 音频设置 -->
                    <div class="setting-group" style="margin-bottom: 1.5rem;">
                        <h3 id="audio-settings-title" style="color: #f8f9fa; margin-bottom: 1rem;">🔊 音频设置</h3>

                        <div class="setting-option" style="margin-bottom: 0.8rem;">
                            <label style="display: flex; align-items: center; cursor: pointer;">
                                <input type="checkbox" id="sound-enabled" style="
                                    width: 18px;
                                    height: 18px;
                                    margin-right: 10px;
                                ">
                                <span id="sound-enabled-text">音效开启</span>
                            </label>
                        </div>

                        <div class="setting-option" style="margin-bottom: 0.8rem;">
                            <label style="display: flex; align-items: center; cursor: pointer;">
                                <input type="checkbox" id="music-enabled" style="
                                    width: 18px;
                                    height: 18px;
                                    margin-right: 10px;
                                ">
                                <span id="music-enabled-text">音乐开启</span>
                            </label>
                        </div>

                        <div class="setting-option" style="margin-bottom: 0.8rem;">
                            <label style="display: flex; align-items: center; margin-bottom: 0.5rem;">
                                <span id="sound-volume-text">音效音量:</span>
                            </label>
                            <input type="range" id="sound-volume-slider" min="0" max="1" step="0.1" value="0.8" style="
                                width: 100%;
                                height: 6px;
                                border-radius: 3px;
                                background: #4a4a68;
                                outline: none;
                            ">
                        </div>

                        <div class="setting-option" style="margin-bottom: 0.8rem;">
                            <label style="display: flex; align-items: center; margin-bottom: 0.5rem;">
                                <span id="music-volume-text">音乐音量:</span>
                            </label>
                            <input type="range" id="music-volume-slider" min="0" max="1" step="0.1" value="0.6" style="
                                width: 100%;
                                height: 6px;
                                border-radius: 3px;
                                background: #4a4a68;
                                outline: none;
                            ">
                        </div>
                    </div>

                    <!-- 游戏设置 -->
                    <div class="setting-group" style="margin-bottom: 1.5rem;">
                        <h3 id="game-settings-title" style="color: #f8f9fa; margin-bottom: 1rem;">🎮 游戏设置</h3>

                        <div class="setting-option" style="margin-bottom: 0.8rem;">
                            <label style="display: flex; align-items: center; margin-bottom: 0.5rem;">
                                <span id="difficulty-text">难度:</span>
                            </label>
                            <select id="difficulty-select" style="
                                width: 100%;
                                padding: 0.5rem;
                                background: #2d2d44;
                                color: white;
                                border: 1px solid #4a4a68;
                                border-radius: 5px;
                            ">
                                <option value="easy" id="easy-difficulty">🐣 简单</option>
                                <option value="normal" id="normal-difficulty" selected>🎮 普通</option>
                                <option value="hard" id="hard-difficulty">💀 困难</option>
                            </select>
                        </div>

                        <div class="setting-option" style="margin-bottom: 0.8rem;">
                            <label style="display: flex; align-items: center; cursor: pointer;">
                                <input type="checkbox" id="show-notifications" style="
                                    width: 18px;
                                    height: 18px;
                                    margin-right: 10px;
                                ">
                                <span id="show-notifications-text">显示通知</span>
                            </label>
                        </div>

                        <div class="setting-option" style="margin-bottom: 0.8rem;">
                            <label style="display: flex; align-items: center; cursor: pointer;">
                                <input type="checkbox" id="show-animations" style="
                                    width: 18px;
                                    height: 18px;
                                    margin-right: 10px;
                                ">
                                <span id="show-animations-text">显示动画效果</span>
                            </label>
                        </div>
                    </div>

                    <!-- 控制设置 -->
                    <div class="setting-group" style="margin-bottom: 1.5rem;">
                        <h3 id="control-settings-title" style="color: #f8f9fa; margin-bottom: 1rem;">🎮 控制设置</h3>

                        <div class="setting-option" style="margin-bottom: 0.8rem;">
                            <label style="display: flex; align-items: center; cursor: pointer;">
                                <input type="checkbox" id="keyboard-controls" style="
                                    width: 18px;
                                    height: 18px;
                                    margin-right: 10px;
                                " checked disabled>
                                <span id="keyboard-controls-text">键盘控制 (WASD + 鼠标)</span>
                            </label>
                        </div>

                        <div class="setting-option" style="margin-bottom: 0.8rem;">
                            <label style="display: flex; align-items: center; cursor: pointer;">
                                <input type="checkbox" id="gamepad-enabled" style="
                                    width: 18px;
                                    height: 18px;
                                    margin-right: 10px;
                                ">
                                <span id="gamepad-enabled-text">手柄支持</span>
                            </label>
                        </div>
                    </div>

                    <!-- 语言设置 -->
                    <div class="setting-group" style="margin-bottom: 1.5rem;">
                        <h3 id="language-settings-title" style="color: #f8f9fa; margin-bottom: 1rem;">🌐 语言设置</h3>

                        <div class="setting-option" style="margin-bottom: 0.8rem;">
                            <label style="display: flex; align-items: center; margin-bottom: 0.5rem;">
                                <span id="language-text">语言:</span>
                            </label>
                            <select id="language-select" style="
                                width: 100%;
                                padding: 0.5rem;
                                background: #2d2d44;
                                color: white;
                                border: 1px solid #4a4a68;
                                border-radius: 5px;
                            ">
                                <option value="zh-CN" id="chinese-lang">🇨🇳 中文</option>
                                <option value="en-US" id="english-lang">🇺🇸 English</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div style="margin-top: 1.5rem; display: flex; gap: 1rem; justify-content: center;">
                    <button id="apply-settings-btn" class="menu-button primary" style="
                        padding: 0.8rem 1.5rem;
                        font-size: 1rem;
                        background: linear-gradient(45deg, #4cc9f0, #4361ee);
                        color: white;
                        border: none;
                        border-radius: 25px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">
                        <span id="apply-settings-text">应用设置</span>
                    </button>

                    <button id="back-from-settings-btn" class="menu-button secondary" style="
                        padding: 0.8rem 1.5rem;
                        font-size: 1rem;
                        background: rgba(255, 255, 255, 0.1);
                        color: #ddd;
                        border: 1px solid #666;
                        border-radius: 25px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">
                        <span id="back-settings-text">返回</span>
                    </button>
                </div>
            </div>
        `;

        container.appendChild(settingsMenu);
        this.uiElements.settingsMenu = settingsMenu;
    }

    // 创建成就菜单
    createAchievementsMenu() {
        const achievementsMenu = document.createElement('div');
        achievementsMenu.id = 'achievements-menu';
        achievementsMenu.className = 'menu achievements-menu';
        achievementsMenu.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 1015;
            backdrop-filter: blur(5px);
        `;
        achievementsMenu.innerHTML = `
            <div class="menu-content" style="
                text-align: center;
                color: white;
                background: rgba(30, 30, 46, 0.95);
                padding: 2rem;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
                border: 1px solid rgba(76, 201, 240, 0.3);
                min-width: 80%;
                max-width: 95%;
                min-height: 70%;
                max-height: 90%;
            ">
                <h2 id="achievements-menu-title" style="
                    color: gold;
                    margin-bottom: 1rem;
                    font-size: 2rem;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                ">
                    <span>🏆 游戏成就</span>
                    <span id="achievements-count" style="font-size: 1rem; color: #4cc9f0;">0/0</span>
                </h2>

                <div class="achievements-progress" style="
                    background: rgba(255, 215, 0, 0.1);
                    padding: 1rem;
                    border-radius: 10px;
                    margin-bottom: 1.5rem;
                    border: 1px solid gold;
                ">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span id="progress-text">完成进度</span>
                        <span id="progress-percent">0%</span>
                    </div>
                    <div style="
                        width: 100%;
                        height: 20px;
                        background: #333;
                        border-radius: 10px;
                        overflow: hidden;
                    ">
                        <div id="progress-bar" style="
                            height: 100%;
                            background: linear-gradient(90deg, #ffd700, #ffed4e);
                            width: 0%;
                            transition: width 0.5s ease;
                        "></div>
                    </div>
                </div>

                <div id="achievements-grid" class="achievements-grid" style="
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 1rem;
                    max-height: 50vh;
                    overflow-y: auto;
                    padding: 1rem;
                ">
                    <!-- 成就项将动态插入 -->
                </div>

                <div style="margin-top: 1.5rem;">
                    <button id="close-achievements-btn" class="menu-button secondary" style="
                        padding: 0.8rem 1.5rem;
                        font-size: 1rem;
                        background: rgba(255, 255, 255, 0.1);
                        color: #ddd;
                        border: 1px solid #666;
                        border-radius: 25px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">
                        <span style="margin-right: 0.5rem;">↩️</span>
                        <span id="close-achievements-text">关闭</span>
                    </button>
                </div>
            </div>
        `;

        container.appendChild(achievementsMenu);
        this.uiElements.achievementsMenu = achievementsMenu;
    }

    // 创建游戏结束菜单
    createGameOverMenu() {
        const gameOverMenu = document.createElement('div');
        gameOverMenu.id = 'game-over-menu';
        gameOverMenu.className = 'menu game-over-menu';
        gameOverMenu.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 1020;
            backdrop-filter: blur(5px);
        `;
        gameOverMenu.innerHTML = `
            <div class="menu-content" style="
                text-align: center;
                color: white;
                background: rgba(139, 0, 0, 0.85);
                padding: 2rem;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
                border: 1px solid rgba(220, 20, 60, 0.5);
                min-width: 400px;
            ">
                <h2 id="game-over-title" style="
                    color: #ff4757;
                    margin-bottom: 1.5rem;
                    font-size: 2.5rem;
                ">💀 游戏结束</h2>

                <div id="game-stats-display" style="
                    background: rgba(0, 0, 0, 0.3);
                    padding: 1.5rem;
                    border-radius: 10px;
                    margin-bottom: 2rem;
                    text-align: left;
                ">
                    <p id="final-level-stat"><strong>到达关卡:</strong> <span id="final-level-value">0</span></p>
                    <p id="final-kills-stat"><strong>击败敌人:</strong> <span id="final-kills-value">0</span></p>
                    <p id="final-score-stat"><strong>最终得分:</strong> <span id="final-score-value">0</span></p>
                    <p id="max-combo-stat"><strong>最高连击:</strong> <span id="max-combo-value">0</span></p>
                    <p id="play-time-stat"><strong>游戏时长:</strong> <span id="play-time-value">0s</span></p>
                </div>

                <div id="game-over-buttons" class="menu-buttons" style="
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    align-items: center;
                ">
                    <button id="restart-after-gameover-btn" class="menu-button primary" style="
                        padding: 1rem 2rem;
                        font-size: 1.1rem;
                        background: linear-gradient(45deg, #ff6b6b, #ee5a24);
                        color: white;
                        border: none;
                        border-radius: 50px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        min-width: 200px;
                    ">
                        <span style="margin-right: 0.5rem;">🔄</span>
                        <span id="restart-after-gameover-text">再次挑战</span>
                    </button>

                    <button id="main-menu-after-gameover-btn" class="menu-button secondary" style="
                        padding: 0.8rem 1.5rem;
                        font-size: 1rem;
                        background: rgba(255, 255, 255, 0.1);
                        color: #ddd;
                        border: 1px solid #666;
                        border-radius: 25px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        min-width: 200px;
                    ">
                        <span style="margin-right: 0.5rem;">🏠</span>
                        <span id="main-menu-after-gameover-text">主菜单</span>
                    </button>
                </div>
            </div>
        `;

        container.appendChild(gameOverMenu);
        this.uiElements.gameOverMenu = gameOverMenu;
    }

    // 创建加载界面
    createLoadingScreen() {
        const loadingScreen = document.createElement('div');
        loadingScreen.id = 'loading-screen';
        loadingScreen.className = 'loading-screen';
        loadingScreen.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            flex-direction: column;
        `;
        loadingScreen.innerHTML = `
            <div style="text-align: center; color: white; margin-bottom: 2rem;">
                <h2 id="loading-title" style="color: #4cc9f0; font-size: 2rem; margin-bottom: 1rem;">⏳ 加载中...</h2>
                <p id="loading-message">正在准备游戏世界</p>
            </div>

            <div style="
                width: 200px;
                height: 10px;
                background: #333;
                border-radius: 5px;
                overflow: hidden;
                margin-bottom: 1rem;
            ">
                <div id="loading-progress" style="
                    height: 100%;
                    background: linear-gradient(90deg, #4cc9f0, #4361ee);
                    width: 0%;
                    transition: width 0.3s ease;
                "></div>
            </div>

            <div id="loading-percentage" style="color: #4cc9f0; font-weight: bold;">0%</div>
        `;

        container.appendChild(loadingScreen);
        this.uiElements.loadingScreen = loadingScreen;
    }

    // 绑定事件
    bindEvents() {
        // 主菜单事件
        this.bindMainMenuEvents();

        // 暂停菜单事件
        this.bindPauseMenuEvents();

        // 设置菜单事件
        this.bindSettingsMenuEvents();

        // 成就菜单事件
        this.bindAchievementsMenuEvents();

        // 游戏结束菜单事件
        this.bindGameOverMenuEvents();

        // 全局事件
        this.bindGlobalEvents();

        console.log("🔗 菜单事件绑定完成");
    }

    // 绑定主菜单事件
    bindMainMenuEvents() {
        // 开始游戏按钮
        const startBtn = document.getElementById('start-game-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.hideCurrentMenu();
                this.startNewGame();
            });
        }

        // 继续游戏按钮
        const continueBtn = document.getElementById('continue-game-btn');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => {
                this.hideCurrentMenu();
                this.continueGame();
            });
        }

        // 成就按钮
        const achievementsBtn = document.getElementById('achievements-btn');
        if (achievementsBtn) {
            achievementsBtn.addEventListener('click', () => {
                this.showAchievementsMenu();
            });
        }

        // 设置按钮
        const settingsBtn = document.getElementById('settings-btn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                this.showSettingsMenu();
            });
        }

        // 教程按钮
        const tutorialBtn = document.getElementById('tutorial-btn');
        if (tutorialBtn) {
            tutorialBtn.addEventListener('click', () => {
                this.showTutorial();
            });
        }
    }

    // 绑定暂停菜单事件
    bindPauseMenuEvents() {
        // 继续游戏按钮
        const resumeBtn = document.getElementById('resume-game-btn');
        if (resumeBtn) {
            resumeBtn.addEventListener('click', () => {
                this.hideCurrentMenu();
                this.resumeGame();
            });
        }

        // 重新开始按钮
        const restartBtn = document.getElementById('restart-game-btn');
        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                this.hideCurrentMenu();
                this.restartGame();
            });
        }

        // 设置按钮
        const settingsPauseBtn = document.getElementById('settings-pause-btn');
        if (settingsPauseBtn) {
            settingsPauseBtn.addEventListener('click', () => {
                this.showSettingsMenu();
            });
        }

        // 返回主菜单按钮
        const mainMenuBtn = document.getElementById('main-menu-pause-btn');
        if (mainMenuBtn) {
            mainMenuBtn.addEventListener('click', () => {
                this.returnToMainMenu();
            });
        }
    }

    // 绑定设置菜单事件
    bindSettingsMenuEvents() {
        // 应用设置按钮
        const applyBtn = document.getElementById('apply-settings-btn');
        if (applyBtn) {
            applyBtn.addEventListener('click', () => {
                this.applySettings();
            });
        }

        // 返回按钮
        const backBtn = document.getElementById('back-from-settings-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.goBackFromSettings();
            });
        }

        // 实时监听设置更改
        const soundEnabled = document.getElementById('sound-enabled');
        if (soundEnabled) {
            soundEnabled.addEventListener('change', (e) => {
                if (window.audioManager) {
                    window.audioManager.setSoundEnabled(e.target.checked);
                }
            });
        }

        const musicEnabled = document.getElementById('music-enabled');
        if (musicEnabled) {
            musicEnabled.addEventListener('change', (e) => {
                if (window.audioManager) {
                    window.audioManager.setMusicEnabled(e.target.checked);
                }
            });
        }

        const soundSlider = document.getElementById('sound-volume-slider');
        if (soundSlider) {
            soundSlider.addEventListener('input', (e) => {
                if (window.audioManager) {
                    window.audioManager.setSoundVolume(parseFloat(e.target.value));
                }
            });
        }

        const musicSlider = document.getElementById('music-volume-slider');
        if (musicSlider) {
            musicSlider.addEventListener('input', (e) => {
                if (window.audioManager) {
                    window.audioManager.setMusicVolume(parseFloat(e.target.value));
                }
            });
        }

        const difficultySelect = document.getElementById('difficulty-select');
        if (difficultySelect) {
            difficultySelect.addEventListener('change', (e) => {
                if (window.updateDifficulty) {
                    window.updateDifficulty(e.target.value);
                }
            });
        }

        const gamepadEnabled = document.getElementById('gamepad-enabled');
        if (gamepadEnabled) {
            gamepadEnabled.addEventListener('change', (e) => {
                if (window.enableController) {
                    window.enableController(e.target.checked);
                }
            });
        }

        const languageSelect = document.getElementById('language-select');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                this.switchLanguage(e.target.value);
            });
        }
    }

    // 绑定成就菜单事件
    bindAchievementsMenuEvents() {
        const closeBtn = document.getElementById('close-achievements-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideCurrentMenu();
            });
        }
    }

    // 绑定游戏结束菜单事件
    bindGameOverMenuEvents() {
        const restartAfterGameoverBtn = document.getElementById('restart-after-gameover-btn');
        if (restartAfterGameoverBtn) {
            restartAfterGameoverBtn.addEventListener('click', () => {
                this.hideCurrentMenu();
                this.restartGame();
            });
        }

        const mainMenuAfterGameoverBtn = document.getElementById('main-menu-after-gameover-btn');
        if (mainMenuAfterGameoverBtn) {
            mainMenuAfterGameoverBtn.addEventListener('click', () => {
                this.returnToMainMenu();
            });
        }
    }

    // 绑定全局事件
    bindGlobalEvents() {
        // ESC键打开/关闭暂停菜单
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.currentMenu === 'main') {
                    // 在主菜单按ESC没有效果
                    return;
                } else if (this.currentMenu === 'game') {
                    // 在游戏中打开暂停菜单
                    this.showPauseMenu();
                } else if (this.currentMenu === 'pause') {
                    // 在暂停菜单中继续游戏
                    this.hideCurrentMenu();
                    this.resumeGame();
                } else {
                    // 在其他菜单中返回上级
                    this.goBack();
                }
            }
        });

        // 页面加载完成后的初始化
        window.addEventListener('load', () => {
            this.initializeMenuStates();
        });
    }

    // 初始化菜单状态
    initializeMenuStates() {
        // 检查是否有存档，更新继续游戏按钮状态
        this.updateContinueButtonState();

        // 加载保存的设置
        this.loadSavedSettings();

        console.log("📋 菜单状态初始化完成");
    }

    // 显示菜单
    showMenu(menuId) {
        // 隐藏当前菜单
        this.hideCurrentMenu();

        // 显示指定菜单
        if (this.uiElements[`${menuId}Menu`]) {
            this.uiElements[`${menuId}Menu`].style.display = 'flex';
            this.uiElements[`${menuId}Menu`].style.opacity = '1';
            this.currentMenu = menuId;

            // 特殊处理
            if (menuId === 'achievements') {
                this.updateAchievementsDisplay();
            } else if (menuId === 'settings') {
                this.updateSettingsDisplay();
            }

            console.log(`👁️ 显示菜单: ${menuId}`);
        }
    }

    // 隐藏当前菜单
    hideCurrentMenu() {
        if (this.uiElements[`${this.currentMenu}Menu`]) {
            this.uiElements[`${this.currentMenu}Menu`].style.display = 'none';
            this.uiElements[`${this.currentMenu}Menu`].style.opacity = '0';
        }
    }

    // 显示主菜单
    showMainMenu() {
        this.showMenu('main');
    }

    // 显示暂停菜单
    showPauseMenu() {
        this.showMenu('pause');
    }

    // 显示设置菜单
    showSettingsMenu() {
        this.showMenu('settings');
    }

    // 显示成就菜单
    showAchievementsMenu() {
        this.showMenu('achievements');
    }

    // 显示游戏结束菜单
    showGameOverMenu(stats = {}) {
        this.updateGameStatsDisplay(stats);
        this.showMenu('gameOver');
    }

    // 隐藏加载界面
    hideLoadingScreen() {
        if (this.uiElements.loadingScreen) {
            this.uiElements.loadingScreen.style.display = 'none';
        }
    }

    // 显示加载界面
    showLoadingScreen(message = '加载中...') {
        if (this.uiElements.loadingScreen) {
            document.getElementById('loading-message').textContent = message;
            this.uiElements.loadingScreen.style.display = 'flex';
        }
    }

    // 更新加载进度
    updateLoadingProgress(percent, message = null) {
        if (this.uiElements.loadingScreen) {
            const progressBar = document.getElementById('loading-progress');
            const percentText = document.getElementById('loading-percentage');

            if (progressBar) {
                progressBar.style.width = `${percent}%`;
            }

            if (percentText) {
                percentText.textContent = `${Math.round(percent)}%`;
            }

            if (message) {
                document.getElementById('loading-message').textContent = message;
            }
        }
    }

    // 更新游戏统计显示
    updateGameStatsDisplay(stats) {
        // 设置默认值
        const level = stats.level || 0;
        const kills = stats.kills || 0;
        const score = stats.score || 0;
        const maxCombo = stats.maxCombo || 0;
        const playTime = stats.playTime ? Math.floor(stats.playTime / 1000) : 0; // 转换为秒

        document.getElementById('final-level-value').textContent = level;
        document.getElementById('final-kills-value').textContent = kills;
        document.getElementById('final-score-value').textContent = score;
        document.getElementById('max-combo-value').textContent = maxCombo;
        document.getElementById('play-time-value').textContent = `${playTime}s`;
    }

    // 更新成就显示
    updateAchievementsDisplay() {
        if (typeof window.achievementSystem !== 'undefined') {
            const achievementsGrid = document.getElementById('achievements-grid');
            if (!achievementsGrid) return;

            // 清空当前成就列表
            achievementsGrid.innerHTML = '';

            // 获取成就系统信息
            const summary = window.achievementSystem.getStatsSummary();

            // 更新统计信息
            document.getElementById('achievements-count').textContent = `${summary.unlocked}/${summary.total}`;
            document.getElementById('progress-percent').textContent = `${summary.completion}%`;

            // 更新进度条
            document.getElementById('progress-bar').style.width = `${summary.completion}%`;

            // 添加所有成就
            for (const achievement of window.achievementSystem.achievementList) {
                const isUnlocked = window.achievementSystem.achievements[achievement.id]?.unlocked || false;

                const achievementEl = document.createElement('div');
                achievementEl.className = `achievement-item ${isUnlocked ? 'unlocked' : 'locked'}`;
                achievementEl.style.cssText = `
                    background: ${isUnlocked ? 'rgba(76, 201, 240, 0.15)' : 'rgba(100, 100, 100, 0.2)'};
                    border: 1px solid ${isUnlocked ? '#4cc9f0' : '#666'};
                    border-radius: 10px;
                    padding: 1rem;
                    text-align: left;
                    transition: transform 0.2s ease;
                `;
                achievementEl.innerHTML = `
                    <div style="display: flex; align-items: center; margin-bottom: 0.5rem;">
                        <span style="font-size: 1.5rem; margin-right: 0.5rem;">
                            ${isUnlocked ? '✅' : '🔒'}
                        </span>
                        <h4 style="margin: 0; color: ${isUnlocked ? '#4cc9f0' : '#aaa'}; font-size: 1.1rem;">
                            ${achievement.name}
                        </h4>
                        <span style="margin-left: auto; color: ${isUnlocked ? '#ffd700' : '#666'}; font-size: 0.8rem;">
                            ${isUnlocked ? `${achievement.points}分` : achievement.rarity}
                        </span>
                    </div>
                    <p style="margin: 0.5rem 0 0 0; color: ${isUnlocked ? '#e6e6e6' : '#888'}; font-size: 0.9rem;">
                        ${achievement.description}
                    </p>
                    ${isUnlocked ? `<small style="color: #4CAF50; display: block; margin-top: 0.3rem;">解锁于: ${new Date(window.achievementSystem.achievements[achievement.id].timestamp).toLocaleString()}</small>` : ''}
                `;

                achievementsGrid.appendChild(achievementEl);
            }
        }
    }

    // 更新设置显示
    updateSettingsDisplay() {
        if (window.audioManager) {
            document.getElementById('sound-enabled').checked = window.audioManager.soundEnabled;
            document.getElementById('music-enabled').checked = window.audioManager.musicEnabled;
            document.getElementById('sound-volume-slider').value = window.audioManager.soundVolume;
            document.getElementById('music-volume-slider').value = window.audioManager.musicVolume;
        }

        if (typeof selectedDifficulty !== 'undefined') {
            document.getElementById('difficulty-select').value = selectedDifficulty;
        }

        if (typeof controllerEnabled !== 'undefined') {
            document.getElementById('gamepad-enabled').checked = controllerEnabled;
        }

        if (typeof currentLanguage !== 'undefined') {
            document.getElementById('language-select').value = currentLanguage;
        }
    }

    // 应用设置
    applySettings() {
        // 更新音频设置（如果音频管理器存在）
        if (window.audioManager) {
            const soundEnabled = document.getElementById('sound-enabled').checked;
            const musicEnabled = document.getElementById('music-enabled').checked;
            const soundVolume = parseFloat(document.getElementById('sound-volume-slider').value);
            const musicVolume = parseFloat(document.getElementById('music-volume-slider').value);

            window.audioManager.setSoundEnabled(soundEnabled);
            window.audioManager.setMusicEnabled(musicEnabled);
            window.audioManager.setSoundVolume(soundVolume);
            window.audioManager.setMusicVolume(musicVolume);
        }

        // 更新难度
        const difficulty = document.getElementById('difficulty-select').value;
        if (window.updateDifficulty) {
            window.updateDifficulty(difficulty);
        }

        // 更新控制器设置
        const gamepadEnabled = document.getElementById('gamepad-enabled').checked;
        if (window.enableController) {
            window.enableController(gamepadEnabled);
        }

        // 更新语言
        const language = document.getElementById('language-select').value;
        this.switchLanguage(language);

        console.log("⚙️ 设置已应用");

        // 播放确认音效
        if (window.playSound) {
            window.playSound('menu_select');
        }
    }

    // 返回设置前的菜单
    goBackFromSettings() {
        if (this.currentMenu === 'settings') {
            // 返回到之前的菜单
            this.hideCurrentMenu();

            // 如果之前是在游戏中，返回暂停菜单
            if (typeof gameState !== 'undefined' && gameState.isPlaying) {
                this.showPauseMenu();
            } else {
                this.showMainMenu();
            }
        }
    }

    // 返回上级菜单
    goBack() {
        if (this.menuStack.length > 0) {
            const previousMenu = this.menuStack.pop();
            this.showMenu(previousMenu);
        } else {
            this.showMainMenu();
        }
    }

    // 开始新游戏
    startNewGame() {
        if (window.startGame) {
            window.startGame();
        }
        this.currentMenu = 'game';
        console.log("🎮 新游戏开始");
    }

    // 继续游戏
    continueGame() {
        if (window.loadGame) {
            window.loadGame();
            if (window.resumeGame) {
                window.resumeGame();
            }
        }
        this.currentMenu = 'game';
        console.log("🎮 游戏继续");
    }

    // 重新开始游戏
    restartGame() {
        if (window.restartGame) {
            window.restartGame();
        } else if (window.startGame) {
            window.startGame(true); // 强制重启
        }
        this.currentMenu = 'game';
        console.log("🔄 游戏重新开始");
    }

    // 恢复游戏
    resumeGame() {
        if (window.resumeGame) {
            window.resumeGame();
        }
        this.currentMenu = 'game';
        console.log("▶️ 游戏恢复");
    }

    // 返回主菜单
    returnToMainMenu() {
        if (window.stopGame) {
            window.stopGame();
        }
        this.showMainMenu();
        console.log("🏠 返回主菜单");
    }

    // 加载保存的设置
    loadSavedSettings() {
        // 音频设置
        if (window.audioManager) {
            const soundEnabled = localStorage.getItem('soundEnabled');
            const musicEnabled = localStorage.getItem('musicEnabled');
            const soundVolume = localStorage.getItem('soundVolume');
            const musicVolume = localStorage.getItem('musicVolume');

            if (soundEnabled !== null) {
                document.getElementById('sound-enabled').checked = soundEnabled === 'true';
                window.audioManager.setSoundEnabled(soundEnabled === 'true');
            }

            if (musicEnabled !== null) {
                document.getElementById('music-enabled').checked = musicEnabled === 'true';
                window.audioManager.setMusicEnabled(musicEnabled === 'true');
            }

            if (soundVolume !== null) {
                document.getElementById('sound-volume-slider').value = soundVolume;
                window.audioManager.setSoundVolume(parseFloat(soundVolume));
            }

            if (musicVolume !== null) {
                document.getElementById('music-volume-slider').value = musicVolume;
                window.audioManager.setMusicVolume(parseFloat(musicVolume));
            }
        }

        // 难度设置
        const savedDifficulty = localStorage.getItem('selectedDifficulty');
        if (savedDifficulty && document.getElementById('difficulty-select')) {
            document.getElementById('difficulty-select').value = savedDifficulty;
        }

        // 控制器设置
        const savedController = localStorage.getItem('controllerEnabled');
        if (savedController !== null && document.getElementById('gamepad-enabled')) {
            document.getElementById('gamepad-enabled').checked = savedController === 'true';
        }

        // 语言设置
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage && document.getElementById('language-select')) {
            document.getElementById('language-select').value = savedLanguage;
        }
    }

    // 更新继续游戏按钮状态
    updateContinueButtonState() {
        const continueBtn = document.getElementById('continue-game-btn');
        if (!continueBtn) return;

        // 检查是否有存档
        if (typeof localStorage !== 'undefined') {
            const saveData = localStorage.getItem('weaponRogueSave');
            if (saveData) {
                continueBtn.style.opacity = '1';
                continueBtn.style.cursor = 'pointer';
                continueBtn.onclick = () => {
                    this.hideCurrentMenu();
                    this.continueGame();
                };
            } else {
                continueBtn.style.opacity = '0.5';
                continueBtn.style.cursor = 'not-allowed';
                continueBtn.onclick = (e) => {
                    e.preventDefault();
                    alert('没有可继续的游戏存档');
                };
            }
        }
    }

    // 显示教程
    showTutorial() {
        alert('教程功能即将推出！\\n此功能将在后续更新中实现。');
        // 这里会显示游戏教程
    }

    // 切换语言
    switchLanguage(lang) {
        // 在真实实现中，这里会切换界面语言
        // 简化实现：只存储语言选择
        localStorage.setItem('language', lang);
        console.log(`🌐 语言已切换至: ${lang}`);
    }

    // 本地化文本（简化版）
    localizeText() {
        // 在实际实现中，这里会根据当前语言设置来更新所有界面文本
        // 目前我们只做标记，后续可扩展
        console.log("📝 文本本地化标记完成");
    }

    // 应用主题
    applyTheme() {
        // 创建CSS样式
        const style = document.createElement('style');
        style.id = 'menu-theme';
        style.textContent = `
            /* 按钮悬停效果 */
            .menu-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
            }

            .menu-button:active {
                transform: translateY(0);
            }

            /* 成就项目悬停效果 */
            .achievement-item:hover {
                transform: translateX(5px);
                border-color: #4cc9f0;
            }

            /* 滚动条样式 */
            .menu-content::-webkit-scrollbar,
            .achievements-grid::-webkit-scrollbar {
                width: 8px;
            }

            .menu-content::-webkit-scrollbar-track,
            .achievements-grid::-webkit-scrollbar-track {
                background: #2d2d44;
                border-radius: 4px;
            }

            .menu-content::-webkit-scrollbar-thumb,
            .achievements-grid::-webkit-scrollbar-thumb {
                background: #4a4a68;
                border-radius: 4px;
            }

            .menu-content::-webkit-scrollbar-thumb:hover,
            .achievements-grid::-webkit-scrollbar-thumb:hover {
                background: #5a5a78;
            }
        `;

        document.head.appendChild(style);
        console.log("🎨 菜单主题应用完成");
    }

    // 获取当前菜单状态
    getMenuStatus() {
        return {
            current: this.currentMenu,
            stack: this.menuStack,
            isVisible: this.currentMenu !== 'game',
            isMenuOpen: ['main', 'pause', 'settings', 'achievements', 'gameOver'].includes(this.currentMenu)
        };
    }

    // 销毁菜单系统
    destroy() {
        // 清理事件监听器
        // 移除DOM元素
        // 清理定时器等

        console.log("🧹 菜单系统已销毁");
    }
}

// 初始化菜单系统
const menuSystem = new MenuSystem();

// 将菜单系统添加到全局作用域
window.MenuSystem = MenuSystem;
window.menuSystem = menuSystem;

// 便捷函数
window.showMainMenu = () => menuSystem.showMainMenu();
window.showPauseMenu = () => menuSystem.showPauseMenu();
window.showSettings = () => menuSystem.showSettingsMenu();
window.showAchievements = () => menuSystem.showAchievementsMenu();
window.showGameOver = (stats) => menuSystem.showGameOverMenu(stats);
window.startGame = () => menuSystem.startNewGame();
window.continueGame = () => menuSystem.continueGame();
window.restartGame = () => menuSystem.restartGame();

console.log("🚀 菜单系统已完全加载");