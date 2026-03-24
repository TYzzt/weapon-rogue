// ==================== 统一菜单系统 ====================
//
// 合并基础菜单、增强菜单和Steam菜单系统
// 1. 支持多种菜单界面（主菜单、暂停、设置、成就等）
// 2. 集成本地化和主题系统
// 3. 与统一存档系统集成
// 4. 保持向后兼容性
// 5. 优化性能和稳定性

class UnifiedMenuSystem {
    constructor() {
        this.currentMenu = 'main'; // 当前显示的菜单
        this.menuStack = []; // 菜单栈，用于导航历史
        this.menuElements = {}; // 菜单DOM元素引用
        this.isInitialized = false;
        this.isVisible = false;
        this.gameWasRunning = false; // 游戏暂停前是否在运行
        this.animationQueue = []; // 动画队列

        // 本地化文本
        this.localization = {
            zh: {
                // 菜单项
                startGame: '开始游戏',
                continue: '继续游戏',
                settings: '设置',
                achievements: '成就',
                quit: '退出',
                pause: '暂停',
                gameOver: '游戏结束',
                victory: '胜利',

                // 设置项
                sound: '音效',
                music: '音乐',
                difficulty: '难度',
                language: '语言',
                controls: '控制',

                // 游戏元素
                level: '关卡',
                kills: '击杀',
                score: '分数',
                hp: '生命值',
                combo: '连击',

                // 描述文本
                gameDescription: '敌人掉落的武器<strong>必定替换</strong>你当前的武器<br>这可能是好事，也可能是灾难...<br><br>收集药水和遗物来改变命运',
                weaponRogue: '武器替换者',

                // 按钮文本
                yes: '是',
                no: '否',
                confirm: '确认',
                cancel: '取消'
            },
            en: {
                // 菜单项
                startGame: 'Start Game',
                continue: 'Continue',
                settings: 'Settings',
                achievements: 'Achievements',
                quit: 'Quit',
                pause: 'Pause',
                gameOver: 'Game Over',
                victory: 'Victory',

                // 设置项
                sound: 'Sound',
                music: 'Music',
                difficulty: 'Difficulty',
                language: 'Language',
                controls: 'Controls',

                // 游戏元素
                level: 'Level',
                kills: 'Kills',
                score: 'Score',
                hp: 'HP',
                combo: 'Combo',

                // 描述文本
                gameDescription: '<strong>Enemies\' weapons</strong> will replace your current weapon<br>This could be good, or a disaster...<br><br>Collect potions and relics to change fate',
                weaponRogue: 'Weapon Rogue',

                // 按钮文本
                yes: 'Yes',
                no: 'No',
                confirm: 'Confirm',
                cancel: 'Cancel'
            }
        };

        // 当前语言
        this.currentLanguage = 'zh';

        // 初始化菜单系统
        this.init();
    }

    // 初始化菜单系统
    init() {
        this.createDOMStructure();
        this.setupEventListeners();
        this.localizeText(); // 本地化文本
        this.applyTheme(); // 应用主题
        this.isInitialized = true;

        // 监听游戏状态变化
        this.setupGameStateListeners();

        console.log("🎮 统一菜单系统初始化完成");
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

        // 胜利菜单
        this.createVictoryMenu();

        // 加载界面
        this.createLoadingScreen();

        console.log("🏗️ 统一菜单DOM结构已创建");
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
            pointer-events: none;
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
                    margin-top: 0;
                ">🗡️ ${this.getLocalizedText('weaponRogue')}</h1>

                <p class="description" id="game-description" style="
                    font-size: 1.2rem;
                    margin-bottom: 2rem;
                    line-height: 1.6;
                    color: #e2e2e2;
                ">${this.getLocalizedText('gameDescription')}</p>

                <div class="menu-buttons" style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1rem;
                ">
                    <button id="start-button" class="menu-button" style="
                        background: linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%);
                        color: white;
                        border: none;
                        padding: 1rem 2rem;
                        font-size: 1.2rem;
                        border-radius: 50px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        min-width: 200px;
                        box-shadow: 0 5px 15px rgba(67, 97, 238, 0.4);
                    ">${this.getLocalizedText('startGame')}</button>

                    <button id="continue-button" class="menu-button" style="
                        background: linear-gradient(135deg, #4cc9f0 0%, #4895ef 100%);
                        color: white;
                        border: none;
                        padding: 1rem 2rem;
                        font-size: 1.2rem;
                        border-radius: 50px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        min-width: 200px;
                        box-shadow: 0 5px 15px rgba(76, 201, 240, 0.4);
                        display: none;
                    ">${this.getLocalizedText('continue')}</button>

                    <button id="settings-button-main" class="menu-button" style="
                        background: linear-gradient(135deg, #7209b7 0%, #560bad 100%);
                        color: white;
                        border: none;
                        padding: 0.8rem 1.5rem;
                        font-size: 1rem;
                        border-radius: 30px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        min-width: 180px;
                        box-shadow: 0 3px 10px rgba(114, 9, 183, 0.4);
                    ">${this.getLocalizedText('settings')}</button>

                    <button id="achievements-button" class="menu-button" style="
                        background: linear-gradient(135deg, #f72585 0%, #b5179e 100%);
                        color: white;
                        border: none;
                        padding: 0.8rem 1.5rem;
                        font-size: 1rem;
                        border-radius: 30px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        min-width: 180px;
                        box-shadow: 0 3px 10px rgba(247, 37, 133, 0.4);
                    ">${this.getLocalizedText('achievements')}</button>
                </div>
            </div>
        `;

        document.getElementById('game-container').appendChild(mainMenu);
        this.menuElements.mainMenu = mainMenu;
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
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 999;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease-in-out;
        `;
        pauseMenu.innerHTML = `
            <div class="menu-content" style="
                text-align: center;
                color: white;
                background: rgba(30, 30, 46, 0.95);
                padding: 2rem;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(5px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                min-width: 300px;
            ">
                <h2 style="margin-top: 0; color: #4cc9f0; margin-bottom: 1.5rem;">${this.getLocalizedText('pause')}</h2>

                <div class="menu-buttons" style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1rem;
                ">
                    <button id="resume-button" class="menu-button" style="
                        background: linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%);
                        color: white;
                        border: none;
                        padding: 0.8rem 2rem;
                        font-size: 1.1rem;
                        border-radius: 50px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        min-width: 180px;
                        margin-bottom: 0.5rem;
                    ">${this.getLocalizedText('continue')}</button>

                    <button id="settings-button-pause" class="menu-button" style="
                        background: linear-gradient(135deg, #7209b7 0%, #560bad 100%);
                        color: white;
                        border: none;
                        padding: 0.8rem 2rem;
                        font-size: 1rem;
                        border-radius: 50px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        min-width: 180px;
                    ">${this.getLocalizedText('settings')}</button>

                    <button id="main-menu-button" class="menu-button" style="
                        background: linear-gradient(135deg, #f72585 0%, #b5179e 100%);
                        color: white;
                        border: none;
                        padding: 0.8rem 2rem;
                        font-size: 1rem;
                        border-radius: 50px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        min-width: 180px;
                    ">${this.getLocalizedText('quit')}</button>
                </div>
            </div>
        `;

        document.getElementById('game-container').appendChild(pauseMenu);
        this.menuElements.pauseMenu = pauseMenu;
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
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 998;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease-in-out;
        `;
        settingsMenu.innerHTML = `
            <div class="menu-content" style="
                color: white;
                background: rgba(30, 30, 46, 0.95);
                padding: 2rem;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(5px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                min-width: 400px;
                max-width: 90vw;
            ">
                <h2 style="margin-top: 0; color: #4cc9f0; margin-bottom: 1.5rem;">${this.getLocalizedText('settings')}</h2>

                <div class="settings-options" style="margin-bottom: 1.5rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <span>${this.getLocalizedText('sound')}:</span>
                        <label class="switch" style="position: relative; display: inline-block; width: 60px; height: 34px;">
                            <input type="checkbox" id="sound-toggle" style="opacity: 0; width: 0; height: 0;">
                            <span class="slider" style="
                                position: absolute;
                                cursor: pointer;
                                top: 0;
                                left: 0;
                                right: 0;
                                bottom: 0;
                                background-color: #ccc;
                                transition: .4s;
                                border-radius: 34px;
                            ">
                                <span style="
                                    position: absolute;
                                    content: "";
                                    height: 26px;
                                    width: 26px;
                                    left: 4px;
                                    bottom: 4px;
                                    background-color: white;
                                    transition: .4s;
                                    border-radius: 50%;
                                "></span>
                            </span>
                        </label>
                    </div>

                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <span>${this.getLocalizedText('music')}:</span>
                        <label class="switch" style="position: relative; display: inline-block; width: 60px; height: 34px;">
                            <input type="checkbox" id="music-toggle" style="opacity: 0; width: 0; height: 0;">
                            <span class="slider" style="
                                position: absolute;
                                cursor: pointer;
                                top: 0;
                                left: 0;
                                right: 0;
                                bottom: 0;
                                background-color: #ccc;
                                transition: .4s;
                                border-radius: 34px;
                            ">
                                <span style="
                                    position: absolute;
                                    content: "";
                                    height: 26px;
                                    width: 26px;
                                    left: 4px;
                                    bottom: 4px;
                                    background-color: white;
                                    transition: .4s;
                                    border-radius: 50%;
                                "></span>
                            </span>
                        </label>
                    </div>

                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <span>${this.getLocalizedText('difficulty')}:</span>
                        <select id="difficulty-select" style="
                            background: rgba(255, 255, 255, 0.1);
                            color: white;
                            border: 1px solid rgba(255, 255, 255, 0.3);
                            padding: 0.5rem;
                            border-radius: 5px;
                            min-width: 120px;
                        ">
                            <option value="easy">${this.getLocalizedText('easy') || '简单'}</option>
                            <option value="normal" selected>${this.getLocalizedText('normal') || '普通'}</option>
                            <option value="hard">${this.getLocalizedText('hard') || '困难'}</option>
                        </select>
                    </div>

                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <span>${this.getLocalizedText('language')}:</span>
                        <select id="language-select" style="
                            background: rgba(255, 255, 255, 0.1);
                            color: white;
                            border: 1px solid rgba(255, 255, 255, 0.3);
                            padding: 0.5rem;
                            border-radius: 5px;
                            min-width: 120px;
                        ">
                            <option value="zh">中文</option>
                            <option value="en">English</option>
                        </select>
                    </div>
                </div>

                <div class="menu-buttons" style="
                    display: flex;
                    justify-content: center;
                    gap: 1rem;
                ">
                    <button id="apply-settings-button" class="menu-button" style="
                        background: linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%);
                        color: white;
                        border: none;
                        padding: 0.8rem 2rem;
                        font-size: 1rem;
                        border-radius: 50px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">${this.getLocalizedText('confirm')}</button>

                    <button id="back-from-settings" class="menu-button" style="
                        background: linear-gradient(135deg, #7209b7 0%, #560bad 100%);
                        color: white;
                        border: none;
                        padding: 0.8rem 2rem;
                        font-size: 1rem;
                        border-radius: 50px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">${this.getLocalizedText('cancel')}</button>
                </div>
            </div>
        `;

        document.getElementById('game-container').appendChild(settingsMenu);
        this.menuElements.settingsMenu = settingsMenu;
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
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 997;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease-in-out;
        `;
        achievementsMenu.innerHTML = `
            <div class="menu-content" style="
                color: white;
                background: rgba(30, 30, 46, 0.95);
                padding: 2rem;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(5px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                min-width: 600px;
                max-width: 90vw;
                max-height: 80vh;
                overflow-y: auto;
            ">
                <h2 style="margin-top: 0; color: #4cc9f0; margin-bottom: 1.5rem;">${this.getLocalizedText('achievements')}</h2>

                <div id="achievements-list" style="
                    max-height: 400px;
                    overflow-y: auto;
                    margin-bottom: 1.5rem;
                ">
                    <!-- Achievements will be populated dynamically -->
                </div>

                <div class="menu-buttons" style="
                    display: flex;
                    justify-content: center;
                ">
                    <button id="back-from-achievements" class="menu-button" style="
                        background: linear-gradient(135deg, #7209b7 0%, #560bad 100%);
                        color: white;
                        border: none;
                        padding: 0.8rem 2rem;
                        font-size: 1rem;
                        border-radius: 50px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">${this.getLocalizedText('cancel')}</button>
                </div>
            </div>
        `;

        document.getElementById('game-container').appendChild(achievementsMenu);
        this.menuElements.achievementsMenu = achievementsMenu;
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
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1001;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.5s ease-in-out;
        `;
        gameOverMenu.innerHTML = `
            <div class="menu-content" style="
                text-align: center;
                color: white;
                background: rgba(80, 10, 20, 0.95);
                padding: 2rem;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(5px);
                border: 1px solid rgba(255, 100, 100, 0.3);
                min-width: 400px;
            ">
                <h2 style="margin-top: 0; color: #ff6b6b; margin-bottom: 1rem;">💥 ${this.getLocalizedText('gameOver')}</h2>

                <div id="game-over-stats" style="margin-bottom: 1.5rem;">
                    <p>${this.getLocalizedText('level')}: <span id="final-level-display">1</span></p>
                    <p>${this.getLocalizedText('kills')}: <span id="final-kills-display">0</span></p>
                    <p>${this.getLocalizedText('score')}: <span id="final-score-display">0</span></p>
                    <p>${this.getLocalizedText('combo')}: <span id="final-combo-display">0</span></p>
                </div>

                <div class="menu-buttons" style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1rem;
                ">
                    <button id="restart-button" class="menu-button" style="
                        background: linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%);
                        color: white;
                        border: none;
                        padding: 1rem 2rem;
                        font-size: 1.1rem;
                        border-radius: 50px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        min-width: 180px;
                    ">${this.getLocalizedText('startGame')}</button>

                    <button id="main-menu-button-gameover" class="menu-button" style="
                        background: linear-gradient(135deg, #f72585 0%, #b5179e 100%);
                        color: white;
                        border: none;
                        padding: 0.8rem 1.5rem;
                        font-size: 1rem;
                        border-radius: 50px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        min-width: 180px;
                    ">${this.getLocalizedText('quit')}</button>
                </div>
            </div>
        `;

        document.getElementById('game-container').appendChild(gameOverMenu);
        this.menuElements.gameOverMenu = gameOverMenu;
    }

    // 创建胜利菜单
    createVictoryMenu() {
        const victoryMenu = document.createElement('div');
        victoryMenu.id = 'victory-menu';
        victoryMenu.className = 'menu victory-menu';
        victoryMenu.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1001;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.5s ease-in-out;
        `;
        victoryMenu.innerHTML = `
            <div class="menu-content" style="
                text-align: center;
                color: white;
                background: rgba(20, 80, 20, 0.95);
                padding: 2rem;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(5px);
                border: 1px solid rgba(100, 255, 100, 0.3);
                min-width: 400px;
            ">
                <h2 style="margin-top: 0; color: #4ade80; margin-bottom: 1rem;">🏆 ${this.getLocalizedText('victory')}</h2>

                <div id="victory-stats" style="margin-bottom: 1.5rem;">
                    <p>${this.getLocalizedText('level')}: <span id="victory-level-display">1</span></p>
                    <p>${this.getLocalizedText('kills')}: <span id="victory-kills-display">0</span></p>
                    <p>${this.getLocalizedText('score')}: <span id="victory-score-display">0</span></p>
                    <p>${this.getLocalizedText('combo')}: <span id="victory-combo-display">0</span></p>
                </div>

                <div class="menu-buttons" style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1rem;
                ">
                    <button id="victory-restart-button" class="menu-button" style="
                        background: linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%);
                        color: white;
                        border: none;
                        padding: 1rem 2rem;
                        font-size: 1.1rem;
                        border-radius: 50px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        min-width: 180px;
                    ">${this.getLocalizedText('startGame')}</button>

                    <button id="main-menu-button-victory" class="menu-button" style="
                        background: linear-gradient(135deg, #f72585 0%, #b5179e 100%);
                        color: white;
                        border: none;
                        padding: 0.8rem 1.5rem;
                        font-size: 1rem;
                        border-radius: 50px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        min-width: 180px;
                    ">${this.getLocalizedText('quit')}</button>
                </div>
            </div>
        `;

        document.getElementById('game-container').appendChild(victoryMenu);
        this.menuElements.victoryMenu = victoryMenu;
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
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.5s ease-in-out;
        `;
        loadingScreen.innerHTML = `
            <div style="
                text-align: center;
                color: white;
            ">
                <div class="spinner" style="
                    width: 50px;
                    height: 50px;
                    border: 3px solid rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    border-top-color: #4cc9f0;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 1rem;
                "></div>
                <p id="loading-text">加载中...</p>
            </div>
            <style>
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            </style>
        `;

        document.getElementById('game-container').appendChild(loadingScreen);
        this.menuElements.loadingScreen = loadingScreen;
    }

    // 设置事件监听器
    setupEventListeners() {
        // 主菜单按钮
        document.getElementById('start-button')?.addEventListener('click', () => {
            this.hideMenu('main');
            this.startGame();
        });

        document.getElementById('continue-button')?.addEventListener('click', () => {
            this.hideMenu('main');
            this.continueGame();
        });

        document.getElementById('settings-button-main')?.addEventListener('click', () => {
            this.showMenu('settings');
        });

        document.getElementById('achievements-button')?.addEventListener('click', () => {
            this.refreshAchievementsList();
            this.showMenu('achievements');
        });

        // 暂停菜单按钮
        document.getElementById('resume-button')?.addEventListener('click', () => {
            this.hideMenu('pause');
            this.resumeGame();
        });

        document.getElementById('settings-button-pause')?.addEventListener('click', () => {
            this.showMenu('settings');
        });

        document.getElementById('main-menu-button')?.addEventListener('click', () => {
            this.hideMenu('pause');
            this.showMenu('main');
            this.stopGame();
        });

        // 设置菜单按钮
        document.getElementById('apply-settings-button')?.addEventListener('click', () => {
            this.applySettings();
            this.hideMenu('settings');

            // 如果是从暂停菜单打开的设置，返回到暂停菜单
            if (this.currentMenu === 'settings' && this.wasInPause) {
                this.showMenu('pause');
            } else {
                this.showMenu('main');
            }
        });

        document.getElementById('back-from-settings')?.addEventListener('click', () => {
            this.hideMenu('settings');

            // 返回到之前的菜单
            if (this.wasInPause) {
                this.showMenu('pause');
            } else {
                this.showMenu('main');
            }
        });

        // 成就菜单按钮
        document.getElementById('back-from-achievements')?.addEventListener('click', () => {
            this.hideMenu('achievements');
            this.showMenu('main');
        });

        // 游戏结束菜单按钮
        document.getElementById('restart-button')?.addEventListener('click', () => {
            this.hideMenu('game-over');
            this.startGame();
        });

        document.getElementById('main-menu-button-gameover')?.addEventListener('click', () => {
            this.hideMenu('game-over');
            this.showMenu('main');
        });

        // 胜利菜单按钮
        document.getElementById('victory-restart-button')?.addEventListener('click', () => {
            this.hideMenu('victory');
            this.startGame();
        });

        document.getElementById('main-menu-button-victory')?.addEventListener('click', () => {
            this.hideMenu('victory');
            this.showMenu('main');
        });

        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            // ESC键打开/关闭暂停菜单
            if (e.key === 'Escape') {
                e.preventDefault();
                if (this.isGameRunning()) {
                    this.togglePause();
                }
            }

            // 如果在主菜单，回车键开始游戏
            if (e.key === 'Enter' && this.currentMenu === 'main') {
                this.hideMenu('main');
                this.startGame();
            }
        });

        // 设置切换框
        const soundToggle = document.getElementById('sound-toggle');
        const musicToggle = document.getElementById('music-toggle');
        const languageSelect = document.getElementById('language-select');

        if (soundToggle) {
            soundToggle.addEventListener('change', (e) => {
                if (window.unifiedAudioSystem) {
                    window.unifiedAudioSystem.setSoundEnabled(e.target.checked);
                }
            });
        }

        if (musicToggle) {
            musicToggle.addEventListener('change', (e) => {
                if (window.unifiedAudioSystem) {
                    window.unifiedAudioSystem.setMusicEnabled(e.target.checked);
                }
            });
        }

        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                this.currentLanguage = e.target.value;
                this.localizeText();
            });
        }
    }

    // 设置游戏状态监听器
    setupGameStateListeners() {
        // 监听游戏状态变化
        if (window.RogueGame) {
            window.RogueGame.eventBus.subscribe('gameOver', () => {
                this.showMenu('game-over');
                this.updateGameOverStats();
            });

            window.RogueGame.eventBus.subscribe('victory', () => {
                this.showMenu('victory');
                this.updateVictoryStats();
            });
        }
    }

    // 显示指定菜单
    showMenu(menuName) {
        if (!this.menuElements[`${menuName}Menu`]) {
            console.warn(`Menu ${menuName} not found`);
            return;
        }

        // 隐藏当前菜单
        if (this.currentMenu && this.menuElements[`${this.currentMenu}Menu`]) {
            this.hideMenu(this.currentMenu);
        }

        // 特殊处理：如果要显示暂停菜单且游戏正在运行，先暂停游戏
        if (menuName === 'pause' && this.isGameRunning()) {
            this.gameWasRunning = true;
            this.pauseGame();
        }

        // 如果是设置菜单，记录来源
        if (menuName === 'settings') {
            this.wasInPause = this.currentMenu === 'pause';
        }

        // 显示新菜单
        const menuElement = this.menuElements[`${menuName}Menu`];
        menuElement.style.opacity = '1';
        menuElement.style.pointerEvents = 'auto';

        this.currentMenu = menuName;
        this.isVisible = true;

        // 音效反馈
        if (window.unifiedAudioSystem) {
            window.unifiedAudioSystem.playSound('menu_select');
        }

        console.log(`菜单已显示: ${menuName}`);
    }

    // 隐藏指定菜单
    hideMenu(menuName) {
        if (!this.menuElements[`${menuName}Menu`]) {
            return;
        }

        const menuElement = this.menuElements[`${menuName}Menu`];
        menuElement.style.opacity = '0';
        menuElement.style.pointerEvents = 'none';

        if (this.currentMenu === menuName) {
            this.currentMenu = null;
        }

        // 如果隐藏的是暂停菜单且游戏之前在运行，恢复游戏
        if (menuName === 'pause' && this.gameWasRunning) {
            this.gameWasRunning = false;
            this.resumeGame();
        }

        console.log(`菜单已隐藏: ${menuName}`);
    }

    // 切换菜单（显示/隐藏）
    toggleMenu(menuName) {
        if (this.currentMenu === menuName) {
            this.hideMenu(menuName);
        } else {
            this.showMenu(menuName);
        }
    }

    // 切换暂停菜单
    togglePause() {
        if (this.currentMenu === 'pause') {
            this.hideMenu('pause');
            this.resumeGame();
        } else {
            this.showMenu('pause');
        }
    }

    // 隐藏所有菜单
    hideAllMenus() {
        Object.keys(this.menuElements).forEach(key => {
            if (key.endsWith('Menu')) {
                const menuName = key.replace('Menu', '');
                this.hideMenu(menuName);
            }
        });
        this.isVisible = false;
    }

    // 更新游戏结束统计
    updateGameOverStats() {
        const gameState = window.gameState || {};
        document.getElementById('final-level-display')?.textContent = gameState.level || 1;
        document.getElementById('final-kills-display')?.textContent = gameState.kills || 0;
        document.getElementById('final-score-display')?.textContent = gameState.player?.score || 0;
        document.getElementById('final-combo-display')?.textContent = gameState.player?.maxCombo || 0;
    }

    // 更新胜利统计
    updateVictoryStats() {
        const gameState = window.gameState || {};
        document.getElementById('victory-level-display')?.textContent = gameState.level || 1;
        document.getElementById('victory-kills-display')?.textContent = gameState.kills || 0;
        document.getElementById('victory-score-display')?.textContent = gameState.player?.score || 0;
        document.getElementById('victory-combo-display')?.textContent = gameState.player?.maxCombo || 0;
    }

    // 刷新成就列表
    refreshAchievementsList() {
        const achievementsList = document.getElementById('achievements-list');
        if (!achievementsList || !window.unifiedAchievementSystem) {
            return;
        }

        const unlocked = window.unifiedAchievementSystem.getUnlockedAchievements();
        const locked = window.unifiedAchievementSystem.getLockedAchievements();
        const stats = window.unifiedAchievementSystem.getStatistics();

        achievementsList.innerHTML = `
            <div style="text-align: center; margin-bottom: 1rem; color: #4ade80; font-weight: bold;">
                已解锁: ${stats.unlocked}/${stats.total} (${stats.percentage}%)
            </div>

            <div style="margin-bottom: 2rem;">
                <h3 style="color: #4ade80; margin: 0 0 0.5rem 0;">✓ 已解锁成就 (${unlocked.length})</h3>
                <div id="unlocked-achievements-list" style="max-height: 200px; overflow-y: auto;"></div>
            </div>

            <div>
                <h3 style="color: #f87171; margin: 0 0 0.5rem 0;">✗ 未解锁成就 (${locked.length})</h3>
                <div id="locked-achievements-list" style="max-height: 200px; overflow-y: auto;"></div>
            </div>
        `;

        // 显示已解锁成就
        const unlockedList = document.getElementById('unlocked-achievements-list');
        if (unlockedList) {
            unlockedList.innerHTML = unlocked.map(ach => `
                <div style="
                    padding: 0.5rem;
                    margin: 0.2rem 0;
                    background: rgba(74, 222, 128, 0.1);
                    border: 1px solid #4ade80;
                    border-radius: 5px;
                ">
                    <strong style="color: #4ade80;">✓ ${ach.name}</strong>
                    <div style="font-size: 0.9em; margin-top: 0.2rem;">${ach.description}</div>
                </div>
            `).join('');
        }

        // 显示未解锁成就
        const lockedList = document.getElementById('locked-achievements-list');
        if (lockedList) {
            lockedList.innerHTML = locked.map(ach => `
                <div style="
                    padding: 0.5rem;
                    margin: 0.2rem 0;
                    background: rgba(248, 113, 113, 0.1);
                    border: 1px solid #f87171;
                    border-radius: 5px;
                ">
                    <strong style="color: #f87171;">✗ ${ach.name}</strong>
                    <div style="font-size: 0.9em; margin-top: 0.2rem;">${ach.description}</div>
                </div>
            `).join('');
        }
    }

    // 应用设置
    applySettings() {
        const soundEnabled = document.getElementById('sound-toggle')?.checked ?? true;
        const musicEnabled = document.getElementById('music-toggle')?.checked ?? true;
        const difficulty = document.getElementById('difficulty-select')?.value ?? 'normal';
        const language = document.getElementById('language-select')?.value ?? 'zh';

        // 更新音频系统设置
        if (window.unifiedAudioSystem) {
            window.unifiedAudioSystem.setSoundEnabled(soundEnabled);
            window.unifiedAudioSystem.setMusicEnabled(musicEnabled);
        }

        // 更新游戏难度
        if (window.gameState) {
            window.gameState.selectedDifficulty = difficulty;
        }

        // 更新语言
        this.currentLanguage = language;
        this.localizeText();

        // 保存设置到存档
        if (window.unifiedSaveSystem && window.gameState) {
            window.gameState.soundEnabled = soundEnabled;
            window.gameState.musicEnabled = musicEnabled;
            window.gameState.selectedDifficulty = difficulty;
            window.gameState.currentLanguage = language;
            window.unifiedSaveSystem.save();
        }

        console.log('设置已应用');
    }

    // 加载保存的设置
    loadSavedSettings() {
        if (window.gameState) {
            // 恢复音频设置
            if (window.unifiedAudioSystem) {
                window.unifiedAudioSystem.setSoundEnabled(window.gameState.soundEnabled ?? true);
                window.unifiedAudioSystem.setMusicEnabled(window.gameState.musicEnabled ?? true);
            }

            // 恢复其他设置
            document.getElementById('sound-toggle').checked = window.gameState.soundEnabled ?? true;
            document.getElementById('music-toggle').checked = window.gameState.musicEnabled ?? true;
            document.getElementById('difficulty-select').value = window.gameState.selectedDifficulty ?? 'normal';
            document.getElementById('language-select').value = window.gameState.currentLanguage ?? 'zh';

            this.currentLanguage = window.gameState.currentLanguage ?? 'zh';
        }
    }

    // 本地化文本
    localizeText() {
        const currentLang = this.localization[this.currentLanguage] || this.localization['zh'];

        // 更新标题
        document.getElementById('main-title')?.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                node.textContent = `🗡️ ${currentLang.weaponRogue}`;
            }
        });

        // 由于innerHTML设置的文本，我们需要重新应用本地化
        this.updateMenuText();
    }

    // 更新菜单文本（内部使用）
    updateMenuText() {
        const currentLang = this.localization[this.currentLanguage] || this.localization['zh'];

        // 主菜单按钮
        this.updateButtonText('start-button', currentLang.startGame);
        this.updateButtonText('continue-button', currentLang.continue);
        this.updateButtonText('settings-button-main', currentLang.settings);
        this.updateButtonText('achievements-button', currentLang.achievements);

        // 暂停菜单按钮
        this.updateButtonText('resume-button', currentLang.continue);
        this.updateButtonText('settings-button-pause', currentLang.settings);
        this.updateButtonText('main-menu-button', currentLang.quit);

        // 设置菜单标题和标签
        document.querySelector('#settings-menu h2')?.replaceChildren(document.createTextNode(currentLang.settings));
        this.updateLabelOrSpan('.settings-options div:nth-child(1) span:first-child', currentLang.sound);
        this.updateLabelOrSpan('.settings-options div:nth-child(2) span:first-child', currentLang.music);
        this.updateLabelOrSpan('.settings-options div:nth-child(3) span:first-child', currentLang.difficulty);
        this.updateLabelOrSpan('.settings-options div:nth-child(4) span:first-child', currentLang.language);

        // 设置菜单按钮
        this.updateButtonText('apply-settings-button', currentLang.confirm);
        this.updateButtonText('back-from-settings', currentLang.cancel);

        // 成就菜单标题
        document.querySelector('#achievements-menu h2')?.replaceChildren(document.createTextNode(currentLang.achievements));
        this.updateButtonText('back-from-achievements', currentLang.cancel);

        // 游戏结束菜单
        document.querySelector('#game-over-menu h2')?.replaceChildren(document.createTextNode(`💥 ${currentLang.gameOver}`));
        this.updateButtonText('restart-button', currentLang.startGame);
        this.updateButtonText('main-menu-button-gameover', currentLang.quit);

        // 胜利菜单
        document.querySelector('#victory-menu h2')?.replaceChildren(document.createTextNode(`🏆 ${currentLang.victory}`));
        this.updateButtonText('victory-restart-button', currentLang.startGame);
        this.updateButtonText('main-menu-button-victory', currentLang.quit);

        // 统计标签
        this.updateStatLabels(currentLang);
    }

    // 更新按钮文本
    updateButtonText(buttonId, text) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.textContent = text;
        }
    }

    // 更新标签或span文本
    updateLabelOrSpan(selector, text) {
        const element = document.querySelector(selector);
        if (element) {
            element.textContent = text;
        }
    }

    // 更新统计标签
    updateStatLabels(lang) {
        document.querySelectorAll('#game-over-stats p').forEach(p => {
            if (p.textContent.includes('level')) {
                p.innerHTML = `${lang.level}: <span id="final-level-display">1</span>`;
            } else if (p.textContent.includes('kills')) {
                p.innerHTML = `${lang.kills}: <span id="final-kills-display">0</span>`;
            } else if (p.textContent.includes('score')) {
                p.innerHTML = `${lang.score}: <span id="final-score-display">0</span>`;
            } else if (p.textContent.includes('combo')) {
                p.innerHTML = `${lang.combo}: <span id="final-combo-display">0</span>`;
            }
        });

        document.querySelectorAll('#victory-stats p').forEach(p => {
            if (p.textContent.includes('level')) {
                p.innerHTML = `${lang.level}: <span id="victory-level-display">1</span>`;
            } else if (p.textContent.includes('kills')) {
                p.innerHTML = `${lang.kills}: <span id="victory-kills-display">0</span>`;
            } else if (p.textContent.includes('score')) {
                p.innerHTML = `${lang.score}: <span id="victory-score-display">0</span>`;
            } else if (p.textContent.includes('combo')) {
                p.innerHTML = `${lang.combo}: <span id="victory-combo-display">0</span>`;
            }
        });
    }

    // 应用主题
    applyTheme() {
        // 可以根据需要应用不同的主题
        // 目前使用默认主题
    }

    // 获取本地化文本
    getLocalizedText(key) {
        return this.localization[this.currentLanguage]?.[key] ||
               this.localization['zh'][key] ||
               key;
    }

    // 检查游戏是否正在运行
    isGameRunning() {
        return window.gameState?.player?.isPlaying === true &&
               window.gameState?.player?.isGameOver === false;
    }

    // 开始游戏
    startGame() {
        if (window.RogueGame) {
            window.RogueGame.startGame();
        }
    }

    // 继续游戏
    continueGame() {
        // 实现继续游戏的逻辑
        if (window.RogueGame) {
            window.RogueGame.resumeGame();
        }
    }

    // 停止游戏
    stopGame() {
        if (window.gameState) {
            window.gameState.player.isPlaying = false;
            window.gameState.player.isGameOver = true;
        }
    }

    // 暂停游戏
    pauseGame() {
        if (window.gameState) {
            window.gameState.player.isPlaying = false;
        }
    }

    // 恢复游戏
    resumeGame() {
        if (window.gameState) {
            window.gameState.player.isPlaying = true;
        }
    }

    // 显示加载界面
    showLoading(text = '加载中...') {
        const loadingScreen = this.menuElements.loadingScreen;
        if (loadingScreen) {
            document.getElementById('loading-text').textContent = text;
            loadingScreen.style.opacity = '1';
            loadingScreen.style.pointerEvents = 'auto';
        }
    }

    // 隐藏加载界面
    hideLoading() {
        const loadingScreen = this.menuElements.loadingScreen;
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.pointerEvents = 'none';
        }
    }

    // 销毁菜单系统
    destroy() {
        // 清理事件监听器
        document.removeEventListener('keydown', this.keydownHandler);

        // 移除所有菜单元素
        Object.values(this.menuElements).forEach(element => {
            if (element && element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });

        console.log("🧹 统一菜单系统已销毁");
    }
}

// 创建全局统一菜单系统实例
window.unifiedMenuSystem = new UnifiedMenuSystem();

// 页面加载完成后初始化设置
document.addEventListener('DOMContentLoaded', () => {
    // 等待其他系统初始化完成后再加载保存的设置
    setTimeout(() => {
        if (window.unifiedMenuSystem) {
            window.unifiedMenuSystem.loadSavedSettings();
        }
    }, 1000);

    console.log("Unified menu system ready");
});

console.log("🎮 统一菜单系统初始化完成");