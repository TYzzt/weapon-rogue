// ==================== Steam版完整菜单系统 ====================
//
// 实现游戏的完整菜单系统，包括：
// 1. 主菜单
// 2. 暂停菜单
// 3. 设置菜单
// 4. 成就菜单
// 5. 音效/视觉效果设置

class SteamMenuSystem {
    constructor() {
        this.currentMenu = 'main'; // 当前显示的菜单
        this.menuElements = {}; // 存储菜单DOM元素的引用
        this.isVisible = false; // 菜单是否可见
        this.gameWasRunning = false; // 游戏暂停前是否在运行

        // 初始化菜单系统
        this.init();
    }

    // 初始化菜单系统
    init() {
        this.createMenuStructure();
        this.setupEventListeners();
        this.hideAllMenus();

        console.log('Steam版菜单系统已初始化');
    }

    // 创建菜单结构
    createMenuStructure() {
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
    }

    // 创建主菜单
    createMainMenu() {
        const mainMenu = document.createElement('div');
        mainMenu.id = 'main-menu';
        mainMenu.className = 'menu-overlay';
        mainMenu.innerHTML = `
            <div class="menu-container">
                <h1 class="game-title">_weaponRogue_</h1>
                <p class="game-subtitle">武器替换者</p>

                <div class="menu-buttons">
                    <button id="start-game-btn" class="menu-button btn-primary">
                        <span class="btn-icon">⚔️</span>
                        <span class="btn-text">开始游戏</span>
                    </button>

                    <button id="continue-game-btn" class="menu-button btn-secondary">
                        <span class="btn-icon">▶️</span>
                        <span class="btn-text">继续游戏</span>
                    </button>

                    <button id="settings-btn" class="menu-button btn-secondary">
                        <span class="btn-icon">⚙️</span>
                        <span class="btn-text">设置</span>
                    </button>

                    <button id="achievements-btn" class="menu-button btn-secondary">
                        <span class="btn-icon">🏆</span>
                        <span class="btn-text">成就</span>
                    </button>

                    <button id="quit-game-btn" class="menu-button btn-danger">
                        <span class="btn-icon">🚪</span>
                        <span class="btn-text">退出游戏</span>
                    </button>
                </div>

                <div class="game-stats">
                    <div class="stat-item">
                        <span class="stat-label">最高关卡:</span>
                        <span id="highest-level-stat" class="stat-value">-</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">成就解锁:</span>
                        <span id="achievements-stat" class="stat-value">-/</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">游戏时间:</span>
                        <span id="playtime-stat" class="stat-value">-</span>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(mainMenu);
        this.menuElements.main = mainMenu;
    }

    // 创建暂停菜单
    createPauseMenu() {
        const pauseMenu = document.createElement('div');
        pauseMenu.id = 'pause-menu';
        pauseMenu.className = 'menu-overlay';
        pauseMenu.innerHTML = `
            <div class="menu-container">
                <h2 class="menu-title">游戏暂停</h2>

                <div class="menu-buttons">
                    <button id="resume-game-btn" class="menu-button btn-primary">
                        <span class="btn-icon">▶️</span>
                        <span class="btn-text">继续游戏</span>
                    </button>

                    <button id="pause-settings-btn" class="menu-button btn-secondary">
                        <span class="btn-icon">⚙️</span>
                        <span class="btn-text">设置</span>
                    </button>

                    <button id="main-menu-btn" class="menu-button btn-secondary">
                        <span class="btn-icon">🏠</span>
                        <span class="btn-text">主菜单</span>
                    </button>

                    <button id="save-and-quit-btn" class="menu-button btn-danger">
                        <span class="btn-icon">💾</span>
                        <span class="btn-text">保存并退出</span>
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(pauseMenu);
        this.menuElements.pause = pauseMenu;
    }

    // 创建设置菜单
    createSettingsMenu() {
        const settingsMenu = document.createElement('div');
        settingsMenu.id = 'settings-menu';
        settingsMenu.className = 'menu-overlay';
        settingsMenu.innerHTML = `
            <div class="menu-container">
                <h2 class="menu-title">游戏设置</h2>

                <div class="settings-panel">
                    <div class="setting-group">
                        <h3>音频设置</h3>

                        <div class="setting-item">
                            <label for="master-volume">主音量</label>
                            <input type="range" id="master-volume" min="0" max="100" value="70">
                            <span id="master-volume-value">70%</span>
                        </div>

                        <div class="setting-item">
                            <label for="sfx-volume">音效音量</label>
                            <input type="range" id="sfx-volume" min="0" max="100" value="80">
                            <span id="sfx-volume-value">80%</span>
                        </div>

                        <div class="setting-item">
                            <label for="music-volume">音乐音量</label>
                            <input type="range" id="music-volume" min="0" max="100" value="60">
                            <span id="music-volume-value">60%</span>
                        </div>

                        <div class="setting-toggle">
                            <label for="sound-enabled">启用音效</label>
                            <input type="checkbox" id="sound-enabled" checked>
                        </div>

                        <div class="setting-toggle">
                            <label for="music-enabled">启用音乐</label>
                            <input type="checkbox" id="music-enabled" checked>
                        </div>
                    </div>

                    <div class="setting-group">
                        <h3>视觉设置</h3>

                        <div class="setting-toggle">
                            <label for="particle-effects">粒子效果</label>
                            <input type="checkbox" id="particle-effects" checked>
                        </div>

                        <div class="setting-toggle">
                            <label for="screen-shake">屏幕震动</label>
                            <input type="checkbox" id="screen-shake" checked>
                        </div>

                        <div class="setting-toggle">
                            <label for="motion-blur">运动模糊</label>
                            <input type="checkbox" id="motion-blur">
                        </div>

                        <div class="setting-item">
                            <label for="animation-speed">动画速度</label>
                            <input type="range" id="animation-speed" min="50" max="200" value="100">
                            <span id="animation-speed-value">100%</span>
                        </div>
                    </div>

                    <div class="setting-group">
                        <h3>游戏设置</h3>

                        <div class="setting-toggle">
                            <label for="auto-save">自动存档</label>
                            <input type="checkbox" id="auto-save" checked>
                        </div>

                        <div class="setting-item">
                            <label for="difficulty-setting">难度</label>
                            <select id="difficulty-setting">
                                <option value="easy">简单</option>
                                <option value="normal" selected>普通</option>
                                <option value="hard">困难</option>
                                <option value="insane">疯狂</option>
                            </select>
                        </div>

                        <div class="setting-item">
                            <label for="language-setting">语言</label>
                            <select id="language-setting">
                                <option value="zh">中文</option>
                                <option value="en">English</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="menu-buttons">
                    <button id="apply-settings-btn" class="menu-button btn-primary">
                        <span class="btn-icon">✅</span>
                        <span class="btn-text">应用设置</span>
                    </button>

                    <button id="back-from-settings-btn" class="menu-button btn-secondary">
                        <span class="btn-icon">↩️</span>
                        <span class="btn-text">返回</span>
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(settingsMenu);
        this.menuElements.settings = settingsMenu;
    }

    // 创建成就菜单
    createAchievementsMenu() {
        const achievementsMenu = document.createElement('div');
        achievementsMenu.id = 'achievements-menu';
        achievementsMenu.className = 'menu-overlay';
        achievementsMenu.innerHTML = `
            <div class="menu-container">
                <h2 class="menu-title">成就系统</h2>

                <div class="achievements-stats">
                    <div class="stat-item">
                        <span class="stat-label">已解锁成就:</span>
                        <span id="unlocked-count" class="stat-value">0</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">总成就数:</span>
                        <span id="total-count" class="stat-value">0</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">完成度:</span>
                        <span id="completion-percent" class="stat-value">0%</span>
                    </div>
                </div>

                <div id="achievements-list" class="achievements-list">
                    <!-- 成就项目将通过JavaScript动态填充 -->
                </div>

                <div class="menu-buttons">
                    <button id="back-from-achievements-btn" class="menu-button btn-secondary">
                        <span class="btn-icon">↩️</span>
                        <span class="btn-text">返回</span>
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(achievementsMenu);
        this.menuElements.achievements = achievementsMenu;
    }

    // 创建游戏结束菜单
    createGameOverMenu() {
        const gameOverMenu = document.createElement('div');
        gameOverMenu.id = 'game-over-menu';
        gameOverMenu.className = 'menu-overlay';
        gameOverMenu.innerHTML = `
            <div class="menu-container">
                <h2 class="menu-title game-over-title">游戏结束</h2>

                <div class="game-over-stats">
                    <div class="stat-item-large">
                        <span class="stat-label">最终关卡:</span>
                        <span id="final-level" class="stat-value-large">1</span>
                    </div>
                    <div class="stat-item-large">
                        <span class="stat-label">击杀数:</span>
                        <span id="final-kills" class="stat-value-large">0</span>
                    </div>
                    <div class="stat-item-large">
                        <span class="stat-label">得分:</span>
                        <span id="final-score" class="stat-value-large">0</span>
                    </div>
                    <div class="stat-item-large">
                        <span class="stat-label">最大连击:</span>
                        <span id="final-combo" class="stat-value-large">0</span>
                    </div>
                </div>

                <div class="menu-buttons">
                    <button id="restart-game-btn" class="menu-button btn-primary">
                        <span class="btn-icon">🔄</span>
                        <span class="btn-text">重新开始</span>
                    </button>

                    <button id="main-menu-from-over-btn" class="menu-button btn-secondary">
                        <span class="btn-icon">🏠</span>
                        <span class="btn-text">主菜单</span>
                    </button>

                    <button id="save-and-quit-over-btn" class="menu-button btn-danger">
                        <span class="btn-icon">💾</span>
                        <span class="btn-text">保存并退出</span>
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(gameOverMenu);
        this.menuElements.gameOver = gameOverMenu;
    }

    // 设置事件监听器
    setupEventListeners() {
        // 主菜单按钮事件
        document.getElementById('start-game-btn')?.addEventListener('click', () => this.startNewGame());
        document.getElementById('continue-game-btn')?.addEventListener('click', () => this.continueGame());
        document.getElementById('settings-btn')?.addEventListener('click', () => this.showSettingsMenu());
        document.getElementById('achievements-btn')?.addEventListener('click', () => this.showAchievementsMenu());
        document.getElementById('quit-game-btn')?.addEventListener('click', () => this.quitGame());

        // 暂停菜单按钮事件
        document.getElementById('resume-game-btn')?.addEventListener('click', () => this.resumeGame());
        document.getElementById('pause-settings-btn')?.addEventListener('click', () => this.showSettingsMenu());
        document.getElementById('main-menu-btn')?.addEventListener('click', () => this.showMainMenu());
        document.getElementById('save-and-quit-btn')?.addEventListener('click', () => this.saveAndQuit());

        // 设置菜单按钮事件
        document.getElementById('apply-settings-btn')?.addEventListener('click', () => this.applySettings());
        document.getElementById('back-from-settings-btn')?.addEventListener('click', () => this.backFromSettings());

        // 成就菜单按钮事件
        document.getElementById('back-from-achievements-btn')?.addEventListener('click', () => this.showMainMenu());

        // 游戏结束菜单按钮事件
        document.getElementById('restart-game-btn')?.addEventListener('click', () => this.restartGame());
        document.getElementById('main-menu-from-over-btn')?.addEventListener('click', () => this.showMainMenu());
        document.getElementById('save-and-quit-over-btn')?.addEventListener('click', () => this.saveAndQuit());

        // 设置滑块事件
        this.setupSliderEvents();

        // 键盘快捷键
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }

    // 设置滑块事件
    setupSliderEvents() {
        // 主音量滑块
        const masterVolumeSlider = document.getElementById('master-volume');
        const masterVolumeValue = document.getElementById('master-volume-value');
        if (masterVolumeSlider && masterVolumeValue) {
            masterVolumeSlider.addEventListener('input', (e) => {
                masterVolumeValue.textContent = e.target.value + '%';
            });
        }

        // 音效音量滑块
        const sfxVolumeSlider = document.getElementById('sfx-volume');
        const sfxVolumeValue = document.getElementById('sfx-volume-value');
        if (sfxVolumeSlider && sfxVolumeValue) {
            sfxVolumeSlider.addEventListener('input', (e) => {
                sfxVolumeValue.textContent = e.target.value + '%';
            });
        }

        // 音乐音量滑块
        const musicVolumeSlider = document.getElementById('music-volume');
        const musicVolumeValue = document.getElementById('music-volume-value');
        if (musicVolumeSlider && musicVolumeValue) {
            musicVolumeSlider.addEventListener('input', (e) => {
                musicVolumeValue.textContent = e.target.value + '%';
            });
        }

        // 动画速度滑块
        const animationSpeedSlider = document.getElementById('animation-speed');
        const animationSpeedValue = document.getElementById('animation-speed-value');
        if (animationSpeedSlider && animationSpeedValue) {
            animationSpeedSlider.addEventListener('input', (e) => {
                animationSpeedValue.textContent = e.target.value + '%';
            });
        }
    }

    // 处理键盘按键
    handleKeyPress(e) {
        // ESC键切换暂停菜单
        if (e.key === 'Escape') {
            if (this.currentMenu === 'main' || this.currentMenu === 'settings' || this.currentMenu === 'achievements') {
                // 如果已经在菜单中，不做任何事
                return;
            }

            if (this.isVisible) {
                this.resumeGame();
            } else {
                this.showPauseMenu();
            }
        }

        // Tilde键 (~) 显示/隐藏控制台（调试用途）
        if (e.key === '`' && e.ctrlKey) {
            // 控制台功能，可以根据需要实现
        }
    }

    // 显示主菜单
    showMainMenu() {
        this.hideAllMenus();
        this.menuElements.main.style.display = 'flex';
        this.currentMenu = 'main';
        this.isVisible = true;

        // 更新统计数据
        this.updateMainMenuStats();

        // 播放菜单音乐
        if (window.steamAudioSystem) {
            window.steamAudioSystem.playMusic('menu', 0.5);
        }
    }

    // 显示暂停菜单
    showPauseMenu() {
        if (typeof gameState !== 'undefined' && gameState.isPlaying) {
            this.gameWasRunning = true;
            // 暂停游戏逻辑（如果游戏有暂停功能）
            if (typeof pauseGame !== 'undefined') {
                pauseGame();
            }
        }

        this.hideAllMenus();
        this.menuElements.pause.style.display = 'flex';
        this.currentMenu = 'pause';
        this.isVisible = true;
    }

    // 显示设置菜单
    showSettingsMenu() {
        this.hideAllMenus();
        this.menuElements.settings.style.display = 'flex';
        this.currentMenu = 'settings';
        this.isVisible = true;

        // 加载当前设置
        this.loadCurrentSettings();
    }

    // 显示成就菜单
    showAchievementsMenu() {
        this.hideAllMenus();
        this.menuElements.achievements.style.display = 'flex';
        this.currentMenu = 'achievements';
        this.isVisible = true;

        // 更新成就列表
        this.updateAchievementsList();
    }

    // 显示游戏结束菜单
    showGameOverMenu(level, kills, score, combo) {
        // 更新游戏结束统计
        document.getElementById('final-level').textContent = level || 1;
        document.getElementById('final-kills').textContent = kills || 0;
        document.getElementById('final-score').textContent = score || 0;
        document.getElementById('final-combo').textContent = combo || 0;

        this.hideAllMenus();
        this.menuElements.gameOver.style.display = 'flex';
        this.currentMenu = 'gameOver';
        this.isVisible = true;
    }

    // 隐藏所有菜单
    hideAllMenus() {
        Object.values(this.menuElements).forEach(menu => {
            if (menu) menu.style.display = 'none';
        });
        this.isVisible = false;
    }

    // 开始新游戏
    startNewGame() {
        this.hideAllMenus();
        this.isVisible = false;

        // 如果存在游戏开始函数，调用它
        if (typeof startGame !== 'undefined') {
            startGame();
        } else {
            console.log("开始新游戏");
            // 这里可以初始化游戏状态
            if (typeof gameState !== 'undefined') {
                gameState.level = 1;
                gameState.kills = 0;
                gameState.score = 0;
                gameState.isPlaying = true;

                if (gameState.player) {
                    gameState.player.hp = gameState.player.maxHp || 150;
                    gameState.player.weapon = null;
                }
            }
        }
    }

    // 继续游戏
    continueGame() {
        // 尝试从存档加载游戏
        if (typeof comprehensiveSaveSystem !== 'undefined') {
            if (comprehensiveSaveSystem.hasSave()) {
                comprehensiveSaveSystem.load();
                this.hideAllMenus();
                this.isVisible = false;

                // 通知游戏恢复运行
                if (typeof resumeGame !== 'undefined') {
                    resumeGame();
                }
            } else {
                // 如果没有存档，开始新游戏
                this.startNewGame();
            }
        } else {
            // 如果没有存档系统，开始新游戏
            this.startNewGame();
        }
    }

    // 恢复游戏
    resumeGame() {
        this.hideAllMenus();
        this.isVisible = false;

        if (this.gameWasRunning) {
            // 恢复游戏运行
            if (typeof resumeGame !== 'undefined') {
                resumeGame();
            }
            this.gameWasRunning = false;
        }
    }

    // 重新开始游戏
    restartGame() {
        // 重置游戏状态
        if (typeof gameState !== 'undefined') {
            gameState.level = 1;
            gameState.kills = 0;
            gameState.score = 0;
            gameState.isPlaying = true;

            if (gameState.player) {
                gameState.player.hp = gameState.player.maxHp || 150;
                gameState.player.weapon = null;
                gameState.player.score = 0;
                gameState.player.maxCombo = 0;
            }

            gameState.relics = [];
            gameState.enemies = [];
            gameState.weapons = [];
            gameState.potions = [];
        }

        this.hideAllMenus();
        this.isVisible = false;

        // 如果有重新开始函数，调用它
        if (typeof restartGame !== 'undefined') {
            restartGame();
        }
    }

    // 应用设置
    applySettings() {
        // 获取设置值并应用
        const masterVolume = parseInt(document.getElementById('master-volume').value) / 100;
        const sfxVolume = parseInt(document.getElementById('sfx-volume').value) / 100;
        const musicVolume = parseInt(document.getElementById('music-volume').value) / 100;
        const soundEnabled = document.getElementById('sound-enabled').checked;
        const musicEnabled = document.getElementById('music-enabled').checked;
        const particleEffects = document.getElementById('particle-effects').checked;
        const screenShake = document.getElementById('screen-shake').checked;
        const motionBlur = document.getElementById('motion-blur').checked;
        const autoSave = document.getElementById('auto-save').checked;
        const difficulty = document.getElementById('difficulty-setting').value;
        const language = document.getElementById('language-setting').value;

        // 应用到音频系统
        if (window.steamAudioSystem) {
            window.steamAudioSystem.setVolume('master', masterVolume);
            window.steamAudioSystem.setVolume('sfx', sfxVolume);
            window.steamAudioSystem.setVolume('music', musicVolume);
            window.steamAudioSystem.setSoundEnabled(soundEnabled);
            window.steamAudioSystem.setMusicEnabled(musicEnabled);
        }

        // 应用到游戏设置
        window.soundEnabled = soundEnabled;
        window.musicEnabled = musicEnabled;
        window.selectedDifficulty = difficulty;
        window.currentLanguage = language;

        // 自动存档设置
        if (autoSave && typeof comprehensiveSaveSystem !== 'undefined') {
            comprehensiveSaveSystem.startAutoSave();
        } else if (!autoSave && typeof comprehensiveSaveSystem !== 'undefined') {
            comprehensiveSaveSystem.stopAutoSave();
        }

        // 播放确认音效
        if (window.steamAudioSystem) {
            window.steamAudioSystem.playSound('menu_select');
        }

        console.log('设置已应用');
    }

    // 从设置菜单返回
    backFromSettings() {
        // 根据之前显示的菜单决定返回哪里
        if (this.currentMenu === 'pause') {
            this.showPauseMenu();
        } else {
            this.showMainMenu();
        }
    }

    // 保存并退出
    saveAndQuit() {
        // 保存游戏
        if (typeof comprehensiveSaveSystem !== 'undefined') {
            comprehensiveSaveSystem.save();
        }

        // 返回主菜单
        this.showMainMenu();
    }

    // 退出游戏
    quitGame() {
        // 显示确认对话框（实际部署时可能需要真正的对话框）
        if (confirm('确定要退出游戏吗？')) {
            // 保存游戏
            if (typeof comprehensiveSaveSystem !== 'undefined') {
                comprehensiveSaveSystem.save();
            }

            // 这里可以添加实际的退出逻辑
            console.log('退出游戏');

            // 对于浏览器环境，我们只能返回主菜单
            this.showMainMenu();
        }
    }

    // 更新主菜单统计数据
    updateMainMenuStats() {
        // 从存档系统获取数据
        if (typeof comprehensiveSaveSystem !== 'undefined') {
            const saveInfo = comprehensiveSaveSystem.getSaveInfo();
            if (saveInfo) {
                document.getElementById('highest-level-stat').textContent = saveInfo.highestLevel || '1';
                document.getElementById('playtime-stat').textContent =
                    Math.round((saveInfo.playTime || 0) / 60) + '分钟';
            }
        }

        // 从成就系统获取数据
        if (typeof CompleteAchievementSystem !== 'undefined') {
            const unlockedCount = CompleteAchievementSystem.getUnlockedCount();
            const totalCount = CompleteAchievementSystem.getTotalCount();
            document.getElementById('achievements-stat').textContent = `${unlockedCount}/${totalCount}`;
        }
    }

    // 更新成就列表
    updateAchievementsList() {
        const achievementsList = document.getElementById('achievements-list');
        if (!achievementsList) return;

        if (typeof CompleteAchievementSystem !== 'undefined') {
            const unlockedCount = CompleteAchievementSystem.getUnlockedCount();
            const totalCount = CompleteAchievementSystem.getTotalCount();

            document.getElementById('unlocked-count').textContent = unlockedCount;
            document.getElementById('total-count').textContent = totalCount;
            document.getElementById('completion-percent').textContent =
                Math.round((unlockedCount / totalCount) * 100) + '%';

            // 清空现有列表
            achievementsList.innerHTML = '';

            // 获取所有成就定义
            const allAchievements = CompleteAchievementSystem.getAllAchievementDefinitions();
            const unlockedAchievements = new Set(Object.keys(CompleteAchievementSystem.unlockedAchievements));

            // 按类别组织成就
            const categorizedAchievements = {};
            allAchievements.forEach(achievement => {
                if (!categorizedAchievements[achievement.category]) {
                    categorizedAchievements[achievement.category] = [];
                }
                categorizedAchievements[achievement.category].push(achievement);
            });

            // 创建类别标题和成就列表
            Object.entries(categorizedAchievements).forEach(([category, achievements]) => {
                const categorySection = document.createElement('div');
                categorySection.className = 'achievement-category';

                const categoryTitle = document.createElement('h4');
                categoryTitle.textContent = this.getCategoryDisplayName(category);
                categorySection.appendChild(categoryTitle);

                const categoryList = document.createElement('div');
                categoryList.className = 'category-achievements';

                achievements.forEach(achievement => {
                    const achievementItem = document.createElement('div');
                    achievementItem.className = `achievement-item ${unlockedAchievements.has(achievement.id) ? 'unlocked' : 'locked'}`;

                    achievementItem.innerHTML = `
                        <div class="achievement-icon">${unlockedAchievements.has(achievement.id) ? '🏆' : '🔒'}</div>
                        <div class="achievement-content">
                            <div class="achievement-name">${achievement.name}</div>
                            <div class="achievement-desc">${achievement.description}</div>
                        </div>
                    `;

                    categoryList.appendChild(achievementItem);
                });

                categorySection.appendChild(categoryList);
                achievementsList.appendChild(categorySection);
            });
        }
    }

    // 获取类别显示名称
    getCategoryDisplayName(category) {
        const names = {
            'progress': '进度',
            'combat': '战斗',
            'weapon': '武器',
            'challenge': '挑战'
        };
        return names[category] || category;
    }

    // 加载当前设置
    loadCurrentSettings() {
        // 从全局变量或系统加载当前设置
        document.getElementById('master-volume').value =
            (window.steamAudioSystem?.getVolume('master') || 0.7) * 100;
        document.getElementById('sfx-volume').value =
            (window.steamAudioSystem?.getVolume('sfx') || 0.8) * 100;
        document.getElementById('music-volume').value =
            (window.steamAudioSystem?.getVolume('music') || 0.6) * 100;

        document.getElementById('sound-enabled').checked =
            window.steamAudioSystem?.isSoundEnabled() ?? true;
        document.getElementById('music-enabled').checked =
            window.steamAudioSystem?.isMusicEnabled() ?? true;

        document.getElementById('particle-effects').checked =
            window.particleEffectsEnabled ?? true;
        document.getElementById('screen-shake').checked =
            window.screenShakeEnabled ?? true;
        document.getElementById('motion-blur').checked =
            window.motionBlurEnabled ?? false;
        document.getElementById('auto-save').checked =
            true; // 默认启用

        document.getElementById('difficulty-setting').value =
            window.selectedDifficulty || 'normal';
        document.getElementById('language-setting').value =
            window.currentLanguage || 'zh';

        // 更新数值显示
        document.getElementById('master-volume-value').textContent =
            Math.round((window.steamAudioSystem?.getVolume('master') || 0.7) * 100) + '%';
        document.getElementById('sfx-volume-value').textContent =
            Math.round((window.steamAudioSystem?.getVolume('sfx') || 0.8) * 100) + '%';
        document.getElementById('music-volume-value').textContent =
            Math.round((window.steamAudioSystem?.getVolume('music') || 0.6) * 100) + '%';
        document.getElementById('animation-speed-value').textContent = '100%';
    }

    // 检查菜单是否可见
    isMenuVisible() {
        return this.isVisible;
    }

    // 获取当前菜单
    getCurrentMenu() {
        return this.currentMenu;
    }

    // 更新游戏内UI元素的可见性（当菜单出现时）
    updateGameUIVisibility(show) {
        // 查找游戏UI元素并更新它们的可见性
        const gameUIElements = document.querySelectorAll('.game-ui, #hud, #game-overlay');
        gameUIElements.forEach(element => {
            element.style.display = show ? 'block' : 'none';
        });
    }
}

// 创建全局菜单系统实例
window.steamMenuSystem = new SteamMenuSystem();

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    if (window.steamMenuSystem) {
        // 显示主菜单
        setTimeout(() => {
            window.steamMenuSystem.showMainMenu();
        }, 500);
    }
});

// 游戏相关函数（如果没有定义则创建默认函数）
if (typeof startGame === 'undefined') {
    window.startGame = function() {
        console.log("开始新游戏");
        if (window.steamMenuSystem) {
            window.steamMenuSystem.hideAllMenus();
        }
    };
}

if (typeof pauseGame === 'undefined') {
    window.pauseGame = function() {
        console.log("游戏已暂停");
    };
}

if (typeof resumeGame === 'undefined') {
    window.resumeGame = function() {
        console.log("游戏已恢复");
    };
}

if (typeof restartGame === 'undefined') {
    window.restartGame = function() {
        console.log("游戏已重新开始");
    };
}

console.log("Steam版完整菜单系统已准备就绪");