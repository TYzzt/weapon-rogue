// ==================== 增强版菜单系统 ====================

class MenuSystem {
    constructor() {
        this.currentMenu = 'start'; // start, pause, settings, achievements, game
        this.menuElements = {};

        // 初始化菜单系统
        this.initializeMenus();
        this.bindEvents();
    }

    // 初始化菜单系统
    initializeMenus() {
        // 获取主要的菜单元素
        this.menuElements = {
            startScreen: document.getElementById('start-screen'),
            gameOver: document.getElementById('game-over'),
            pauseMenu: document.getElementById('pause-menu'),
            settingsMenu: document.getElementById('settings-menu'),
            gameContainer: document.getElementById('game-container')
        };

        // 如果这些元素不存在，需要动态创建
        if (!this.menuElements.startScreen) {
            this.createStartScreen();
        }
        if (!this.menuElements.gameOver) {
            this.createGameOverScreen();
        }
        if (!this.menuElements.pauseMenu) {
            this.createPauseMenu();
        }
        if (!this.menuElements.settingsMenu) {
            this.createSettingsMenu();
        }
    }

    // 创建开始屏幕
    createStartScreen() {
        const startScreen = document.createElement('div');
        startScreen.id = 'start-screen';
        startScreen.className = 'start-screen';
        startScreen.innerHTML = `
            <div class="menu-content">
                <h1>🗡️ <span id="game-title">武器替换者</span></h1>
                <p class="description" id="game-description">
                    敌人掉落的武器<strong>必定替换</strong>你当前的武器<br>
                    这可能是好事，也可能是灾难...<br><br>
                    收集药水和遗物来改变命运
                </p>
                <div class="menu-buttons">
                    <button id="start-btn" class="menu-button primary">🎮 <span id="start-button-text">开始游戏</span></button>
                    <button id="continue-btn" class="menu-button secondary hidden">⏱️ <span id="continue-button-text">继续游戏</span></button>
                    <button id="achievements-btn" class="menu-button">🏆 <span id="achievements-button-text">成就</span></button>
                    <button id="settings-btn" class="menu-button">⚙️ <span id="settings-button-text">设置</span></button>
                    <button id="tutorial-btn" class="menu-button">📚 <span id="tutorial-button-text">教程</span></button>
                </div>
            </div>
        `;
        document.body.appendChild(startScreen);
        this.menuElements.startScreen = startScreen;
    }

    // 创建游戏结束屏幕
    createGameOverScreen() {
        const gameOver = document.createElement('div');
        gameOver.id = 'game-over';
        gameOver.className = 'game-over hidden';
        gameOver.innerHTML = `
            <div class="menu-content">
                <h2 id="game-over-title">💥 <span id="game-over-text">游戏结束</span></h2>
                <div class="game-stats">
                    <p id="final-level-text">你到达了第 <span id="final-level">0</span> 关</p>
                    <p id="final-kills-text">击败了 <span id="final-kills">0</span> 个敌人</p>
                    <p id="final-score-text">最终得分：<span id="final-score">0</span></p>
                    <p id="max-combo-text">最高连击：<span id="max-combo">0</span></p>
                </div>
                <div class="menu-buttons">
                    <button id="restart-btn" class="menu-button primary">🔄 <span id="restart-button-text">重新开始</span></button>
                    <button id="main-menu-btn" class="menu-button secondary">🏠 <span id="main-menu-button-text">返回主菜单</span></button>
                </div>
            </div>
        `;
        document.getElementById('game-container').appendChild(gameOver);
        this.menuElements.gameOver = gameOver;
    }

    // 创建暂停菜单
    createPauseMenu() {
        const pauseMenu = document.createElement('div');
        pauseMenu.id = 'pause-menu';
        pauseMenu.className = 'pause-menu hidden';
        pauseMenu.innerHTML = `
            <div class="menu-content">
                <h2 id="pause-title">⏸️ <span id="pause-text">游戏暂停</span></h2>
                <div class="menu-buttons">
                    <button id="continue-btn" class="menu-button primary">▶️ <span id="continue-button-text">继续游戏</span></button>
                    <button id="restart-btn" class="menu-button">🔄 <span id="restart-button-text">重新开始</span></button>
                    <button id="settings-btn" class="menu-button">⚙️ <span id="settings-button-text">设置</span></button>
                    <button id="achievements-btn" class="menu-button">🏆 <span id="achievements-button-text">成就</span></button>
                    <button id="main-menu-btn" class="menu-button secondary">🏠 <span id="main-menu-button-text">返回主菜单</span></button>
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
        settingsMenu.className = 'settings-menu hidden';
        settingsMenu.innerHTML = `
            <div class="menu-content">
                <h2 id="settings-title">⚙️ <span id="settings-text">游戏设置</span></h2>
                <div class="settings-options">
                    <div class="setting-option">
                        <label>
                            <input type="checkbox" id="sound-enabled" checked>
                            <span id="sound-enabled-text">🔊 音效开启</span>
                        </label>
                    </div>
                    <div class="setting-option">
                        <label>
                            <input type="checkbox" id="music-enabled" checked>
                            <span id="music-enabled-text">🎵 音乐开启</span>
                        </label>
                    </div>
                    <div class="setting-option">
                        <label>
                            <span id="difficulty-text">🎯 难度:</span>
                            <select id="difficulty-select">
                                <option value="easy" id="easy-difficulty">🐣 简单</option>
                                <option value="normal" selected id="normal-difficulty">🎮 普通</option>
                                <option value="hard" id="hard-difficulty">💀 困难</option>
                            </select>
                        </label>
                    </div>
                    <div class="setting-option">
                        <label>
                            <span id="language-text">🌐 语言:</span>
                            <select id="language-select">
                                <option value="zh" id="chinese-lang">🇨🇳 中文</option>
                                <option value="en" id="english-lang">🇺🇸 English</option>
                            </select>
                        </label>
                    </div>
                    <div class="setting-option">
                        <label>
                            <input type="checkbox" id="controller-enabled">
                            <span id="controller-enabled-text">🎮 手柄支持</span>
                        </label>
                    </div>
                </div>
                <div class="menu-buttons">
                    <button id="back-to-pause" class="menu-button secondary">↩️ <span id="back-to-pause-text">返回暂停菜单</span></button>
                    <button id="back-to-main" class="menu-button secondary">🏠 <span id="back-to-main-text">返回主菜单</span></button>
                </div>
            </div>
        `;
        document.getElementById('game-container').appendChild(settingsMenu);
        this.menuElements.settingsMenu = settingsMenu;
    }

    // 绑定菜单事件
    bindEvents() {
        // 开始按钮
        const startBtn = document.getElementById('start-btn');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.switchToGame();
                if (typeof startGame !== 'undefined') {
                    startGame();
                }
            });
        }

        // 继续游戏按钮
        const continueBtn = document.getElementById('continue-btn');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => {
                this.hideAllMenus();
                if (typeof resumeGame !== 'undefined') {
                    resumeGame();
                } else if (typeof gameState !== 'undefined') {
                    gameState.paused = false;
                }
            });
        }

        // 设置按钮
        const settingsBtns = document.querySelectorAll('#settings-btn');
        settingsBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchToSettings();
            });
        });

        // 成就按钮
        const achievementsBtns = document.querySelectorAll('#achievements-btn');
        achievementsBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.showAchievements();
            });
        });

        // 返回主菜单按钮
        const mainMenuBtns = document.querySelectorAll('#main-menu-btn');
        mainMenuBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchToStart();
                if (typeof stopGame !== 'undefined') {
                    stopGame();
                }
            });
        });

        // 重新开始按钮
        const restartBtns = document.querySelectorAll('#restart-btn');
        restartBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.hideAllMenus();
                if (typeof restartGame !== 'undefined') {
                    restartGame();
                } else if (typeof startGame !== 'undefined') {
                    startGame(true); // 强制重新开始
                }
            });
        });

        // 设置菜单返回按钮
        const backToPauseBtn = document.getElementById('back-to-pause');
        if (backToPauseBtn) {
            backToPauseBtn.addEventListener('click', () => {
                this.switchToPause();
            });
        }

        const backToMainBtn = document.getElementById('back-to-main');
        if (backToMainBtn) {
            backToMainBtn.addEventListener('click', () => {
                this.switchToStart();
            });
        }

        // 设置选项变化监听
        const soundToggle = document.getElementById('sound-enabled');
        if (soundToggle) {
            soundToggle.addEventListener('change', (e) => {
                if (typeof enhancedAudioManager !== 'undefined') {
                    enhancedAudioManager.setSoundEnabled(e.target.checked);
                } else if (typeof AudioManager !== 'undefined') {
                    AudioManager.setSoundEnabled(e.target.checked);
                }
                localStorage.setItem('soundEnabled', e.target.checked);
            });
        }

        const musicToggle = document.getElementById('music-enabled');
        if (musicToggle) {
            musicToggle.addEventListener('change', (e) => {
                if (typeof enhancedAudioManager !== 'undefined') {
                    enhancedAudioManager.setMusicEnabled(e.target.checked);
                } else if (typeof AudioManager !== 'undefined') {
                    AudioManager.setMusicEnabled(e.target.checked);
                }
                localStorage.setItem('musicEnabled', e.target.checked);
            });
        }

        const difficultySelect = document.getElementById('difficulty-select');
        if (difficultySelect) {
            difficultySelect.addEventListener('change', (e) => {
                if (typeof updateDifficulty !== 'undefined') {
                    updateDifficulty(e.target.value);
                }
                localStorage.setItem('difficulty', e.target.value);
            });
        }

        const languageSelect = document.getElementById('language-select');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                if (typeof switchLanguage !== 'undefined') {
                    switchLanguage(e.target.value);
                }
                localStorage.setItem('language', e.target.value);
            });
        }

        const controllerToggle = document.getElementById('controller-enabled');
        if (controllerToggle) {
            controllerToggle.addEventListener('change', (e) => {
                if (typeof enableController !== 'undefined') {
                    enableController(e.target.checked);
                }
                localStorage.setItem('controllerEnabled', e.target.checked);
            });
        }

        // ESC键暂停游戏
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (typeof gameState !== 'undefined' && gameState.isPlaying && !gameState.isGameOver) {
                    this.switchToPause();
                }
            }
        });
    }

    // 切换到游戏界面
    switchToGame() {
        this.hideAllMenus();
        this.currentMenu = 'game';
    }

    // 切换到开始界面
    switchToStart() {
        this.hideAllMenus();
        if (this.menuElements.startScreen) {
            this.menuElements.startScreen.classList.remove('hidden');
        }
        this.currentMenu = 'start';
    }

    // 切换到暂停界面
    switchToPause() {
        this.hideAllMenus();
        if (this.menuElements.pauseMenu) {
            this.menuElements.pauseMenu.classList.remove('hidden');
        }
        this.currentMenu = 'pause';
    }

    // 切换到设置界面
    switchToSettings() {
        this.hideAllMenus();
        if (this.menuElements.settingsMenu) {
            this.menuElements.settingsMenu.classList.remove('hidden');
        }
        this.currentMenu = 'settings';
    }

    // 显示成就界面
    showAchievements() {
        // 创建成就弹窗
        const achievementsContainer = document.createElement('div');
        achievementsContainer.id = 'achievements-popup';
        achievementsContainer.className = 'popup-overlay';
        achievementsContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            backdrop-filter: blur(5px);
        `;

        // 获取成就数据
        let unlockedCount = 0;
        let totalCount = 0;

        if (typeof enhancedAchievementSystem !== 'undefined') {
            unlockedCount = enhancedAchievementSystem.getUnlockedCount();
            totalCount = enhancedAchievementSystem.getTotalCount();
        } else if (typeof AchievementSystem !== 'undefined') {
            unlockedCount = AchievementSystem.getUnlockedCount();
            totalCount = AchievementSystem.getTotalCount();
        }

        // 构建成就列表
        let achievementsHtml = `
            <div class="popup-content" style="
                background: linear-gradient(145deg, #2c3e50, #1a1a2e);
                padding: 30px;
                border-radius: 15px;
                width: 90%;
                max-width: 800px;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 0 40px rgba(100, 100, 255, 0.4);
                border: 2px solid #4cc9f0;
                color: white;
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="color: #ffd700; margin: 0;">🏆 游戏成就 (${unlockedCount}/${totalCount})</h2>
                    <button id="close-achievements" style="
                        background: #e74c3c;
                        color: white;
                        border: none;
                        border-radius: 50%;
                        width: 40px;
                        height: 40px;
                        cursor: pointer;
                        font-size: 18px;
                    ">✕</button>
                </div>
                <div id="achievements-list" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 15px;">
        `;

        // 根据可用的成就系统获取成就列表
        let achievementList = [];
        let achievementsUnlocked = {};

        if (typeof enhancedAchievementSystem !== 'undefined') {
            achievementList = enhancedAchievementSystem.achievementList;
            achievementsUnlocked = enhancedAchievementSystem.achievements;
        } else if (typeof AchievementSystem !== 'undefined') {
            achievementList = AchievementSystem.achievementList;
            achievementsUnlocked = AchievementSystem.achievements;
        }

        if (achievementList.length > 0) {
            for (const achievement of achievementList) {
                const isUnlocked = achievementsUnlocked[achievement.id]?.unlocked;
                const name = typeof achievement.name === 'function' ? achievement.name() : achievement.name;
                const description = typeof achievement.description === 'function' ? achievement.description() : achievement.description;

                const statusClass = isUnlocked ? 'unlocked' : 'locked';
                const icon = isUnlocked ? '✅' : '🔒';
                const borderColor = isUnlocked ? '#4ade80' : '#94a3b8';
                const bgColor = isUnlocked ? 'rgba(74, 222, 128, 0.1)' : 'rgba(148, 163, 184, 0.1)';

                achievementsHtml += `
                    <div style="
                        padding: 15px;
                        background: ${bgColor};
                        border-radius: 10px;
                        border-left: 4px solid ${borderColor};
                        transition: transform 0.2s ease;
                    " onmouseover="this.style.transform='translateX(5px)'" onmouseout="this.style.transform='translateX(0)'">
                        <div style="display: flex; align-items: center; margin-bottom: 8px;">
                            <span style="font-size: 24px; margin-right: 10px;">${icon}</span>
                            <h3 style="margin: 0; color: ${isUnlocked ? '#4ade80' : '#94a3b8'}; font-size: 16px;">${name}</h3>
                        </div>
                        <p style="margin: 5px 0 0 0; color: ${isUnlocked ? '#cbd5e1' : '#94a3b8'}; font-size: 14px;">${description}</p>
                        ${isUnlocked ? `<small style="color: #60a5fa; display: block; margin-top: 5px;">解锁时间: ${new Date(achievementsUnlocked[achievement.id]?.timestamp).toLocaleString()}</small>` : ''}
                    </div>
                `;
            }
        } else {
            achievementsHtml += '<p style="color: #cbd5e1; text-align: center; grid-column: 1 / -1;">暂无成就数据</p>';
        }

        achievementsHtml += `
                </div>
            </div>
        `;

        achievementsContainer.innerHTML = achievementsHtml;
        document.body.appendChild(achievementsContainer);

        // 绑定关闭按钮事件
        document.getElementById('close-achievements').addEventListener('click', () => {
            document.body.removeChild(achievementsContainer);
        });

        // 点击背景关闭
        achievementsContainer.addEventListener('click', (e) => {
            if (e.target === achievementsContainer) {
                document.body.removeChild(achievementsContainer);
            }
        });
    }

    // 隐藏所有菜单
    hideAllMenus() {
        if (this.menuElements.startScreen) {
            this.menuElements.startScreen.classList.add('hidden');
        }
        if (this.menuElements.gameOver) {
            this.menuElements.gameOver.classList.add('hidden');
        }
        if (this.menuElements.pauseMenu) {
            this.menuElements.pauseMenu.classList.add('hidden');
        }
        if (this.menuElements.settingsMenu) {
            this.menuElements.settingsMenu.classList.add('hidden');
        }
    }

    // 更新UI文本（国际化）
    updateUIText() {
        if (typeof t !== 'undefined') {
            // 更新开始屏幕文本
            const titleElement = document.getElementById('game-title');
            if (titleElement) titleElement.textContent = t('title');

            const descriptionElement = document.getElementById('game-description');
            if (descriptionElement) descriptionElement.innerHTML = t('description');

            const startBtnText = document.getElementById('start-button-text');
            if (startBtnText) startBtnText.textContent = t('startButton');

            const achievementsBtnText = document.getElementById('achievements-button-text');
            if (achievementsBtnText) achievementsBtnText.textContent = t('achievementsButton');

            const settingsBtnText = document.getElementById('settings-button-text');
            if (settingsBtnText) settingsBtnText.textContent = t('settingsButton');

            // 更新游戏结束文本
            const gameOverText = document.getElementById('game-over-text');
            if (gameOverText) gameOverText.textContent = t('gameOver');

            const finalLevelText = document.getElementById('final-level-text');
            if (finalLevelText) finalLevelText.innerHTML = `${t('finalLevel')} <span id="final-level">0</span>`;

            const finalKillsText = document.getElementById('final-kills-text');
            if (finalKillsText) finalKillsText.innerHTML = `${t('finalKills')} <span id="final-kills">0</span> ${t('kills')}`;

            const finalScoreText = document.getElementById('final-score-text');
            if (finalScoreText) finalScoreText.innerHTML = `${t('finalScore')}<span id="final-score">0</span>`;

            // 更新暂停菜单文本
            const pauseText = document.getElementById('pause-text');
            if (pauseText) pauseText.textContent = t('gameOver'); // 重用游戏结束文本

            const continueBtnText = document.getElementById('continue-button-text');
            if (continueBtnText) continueBtnText.textContent = t('continueButton');

            const restartBtnText = document.getElementById('restart-button-text');
            if (restartBtnText) restartBtnText.textContent = t('restartButton');

            const mainMenuBtnText = document.getElementById('main-menu-button-text');
            if (mainMenuBtnText) mainMenuBtnText.textContent = t('mainMenuButton');

            // 更新设置菜单文本
            const settingsText = document.getElementById('settings-text');
            if (settingsText) settingsText.textContent = t('settingsButton');

            const soundEnabledText = document.getElementById('sound-enabled-text');
            if (soundEnabledText) soundEnabledText.textContent = `🔊 ${t('soundEnabled')}`;

            const musicEnabledText = document.getElementById('music-enabled-text');
            if (musicEnabledText) musicEnabledText.textContent = `🎵 ${t('musicEnabled')}`;

            const difficultyText = document.getElementById('difficulty-text');
            if (difficultyText) difficultyText.textContent = `🎯 ${t('difficulty')}`;

            // 更新难度选项文本
            const easyDiffText = document.getElementById('easy-difficulty');
            if (easyDiffText) easyDiffText.textContent = `🐣 ${t('easy')}`;

            const normalDiffText = document.getElementById('normal-difficulty');
            if (normalDiffText) normalDiffText.textContent = `🎮 ${t('normal')}`;

            const hardDiffText = document.getElementById('hard-difficulty');
            if (hardDiffText) hardDiffText.textContent = `💀 ${t('hard')}`;

            // 更新语言选项文本
            const chineseLangText = document.getElementById('chinese-lang');
            if (chineseLangText) chineseLangText.textContent = '🇨🇳 中文';

            const englishLangText = document.getElementById('english-lang');
            if (englishLangText) englishLangText.textContent = '🇺🇸 English';

            // 更新返回按钮文本
            const backToPauseText = document.getElementById('back-to-pause-text');
            if (backToPauseText) backToPauseText.textContent = t('backToPauseButton');

            const backToMainText = document.getElementById('back-to-main-text');
            if (backToMainText) backToMainText.textContent = t('mainMenuButton');
        }
    }
}

// 创建菜单系统实例
const menuSystem = new MenuSystem();

// 页面加载完成后更新文本
document.addEventListener('DOMContentLoaded', () => {
    if (typeof menuSystem !== 'undefined') {
        menuSystem.updateUIText();
    }

    // 加载保存的设置
    const savedSound = localStorage.getItem('soundEnabled');
    const savedMusic = localStorage.getItem('musicEnabled');
    const savedDifficulty = localStorage.getItem('difficulty');
    const savedLanguage = localStorage.getItem('language');
    const savedController = localStorage.getItem('controllerEnabled');

    if (savedSound !== null) {
        const soundToggle = document.getElementById('sound-enabled');
        if (soundToggle) {
            soundToggle.checked = savedSound === 'true';
            if (typeof enhancedAudioManager !== 'undefined') {
                enhancedAudioManager.setSoundEnabled(savedSound === 'true');
            }
        }
    }

    if (savedMusic !== null) {
        const musicToggle = document.getElementById('music-enabled');
        if (musicToggle) {
            musicToggle.checked = savedMusic === 'true';
            if (typeof enhancedAudioManager !== 'undefined') {
                enhancedAudioManager.setMusicEnabled(savedMusic === 'true');
            }
        }
    }

    if (savedDifficulty) {
        const difficultySelect = document.getElementById('difficulty-select');
        if (difficultySelect) {
            difficultySelect.value = savedDifficulty;
            if (typeof updateDifficulty !== 'undefined') {
                updateDifficulty(savedDifficulty);
            }
        }
    }

    if (savedLanguage) {
        const languageSelect = document.getElementById('language-select');
        if (languageSelect) {
            languageSelect.value = savedLanguage;
            if (typeof switchLanguage !== 'undefined') {
                switchLanguage(savedLanguage);
            }
        }
    }

    if (savedController !== null) {
        const controllerToggle = document.getElementById('controller-enabled');
        if (controllerToggle) {
            controllerToggle.checked = savedController === 'true';
            if (typeof enableController !== 'undefined') {
                enableController(savedController === 'true');
            }
        }
    }
});