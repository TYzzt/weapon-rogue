// ==================== 国际化/本地化系统 ====================

const LANGUAGES = {
    zh: {
        // 游戏文本
        title: "武器替换者",
        description: "敌人掉落的武器<strong>必定替换</strong>你当前的武器<br>这可能是好事，也可能是灾难...<br><br>收集药水和遗物来改变命运",
        startButton: "开始游戏",
        achievementsButton: "成就",
        restartButton: "重新开始",
        continueButton: "继续游戏",
        settingsButton: "设置",
        mainMenuButton: "返回主菜单",
        backToPauseButton: "返回暂停菜单",
        gameOver: "游戏结束",
        finalLevel: "你到达了第",
        finalKills: "击败了",
        finalScore: "最终得分：",
        healthBar: "生命",
        weapon: "武器",
        level: "关卡",
        goal: "目标",
        kills: "击杀",
        combo: "连击",
        score: "分数",
        buffs: "BUFF",
        inventory: "背包",
        potions: "药水",
        relics: "遗物",

        // 战斗日志
        levelUp: "🎉 升级到第 %d 关！",
        skillAOE: "🌀 %s 击中 %d 个敌人!",
        skillNoHit: "🌀 %s 没有击中任何敌人",
        skillHeal: "💚 %s 恢复 %d 生命!",
        skillTeleport: "✨ %s 成功传送!",
        skillBerserk: "😠 %s 开启，伤害翻倍!",
        weaponGet: "获得新武器：%s!",
        weaponLost: "失去武器：%s...",

        // 教程文本
        tutorialWelcome: "欢迎！",
        tutorialWelcomeMsg: "欢迎来到《武器替换者》！你的目标是尽可能活得更久，击败更多敌人！",
        tutorialMovement: "移动控制",
        tutorialMovementMsg: "移动鼠标来控制角色移动",
        tutorialCombat: "战斗",
        tutorialCombatMsg: "点击鼠标来攻击周围的敌人",
        tutorialWeapons: "武器",
        tutorialWeaponsMsg: "敌人会掉落武器，拾取它们！注意：新武器会替换当前武器",
        tutorialSkills: "技能",
        tutorialSkillsMsg: "按下 Q/W/E/R 键使用四个技能，每个技能有不同的效果",
        tutorialComplete: "教程完成",
        tutorialCompleteMsg: "祝你好运，勇敢的冒险者！",

        // 成就标题和描述
        achFirstBlood: "第一滴血",
        achFirstBloodDesc: "击杀第一个敌人",
        achBloodThirsty: "嗜血者",
        achBloodThirstyDesc: "击杀10个敌人",
        achKillingSpree: "大开杀戒",
        achKillingSpreeDesc: "击杀50个敌人",
        achMonsterHunter: "怪物猎人",
        achMonsterHunterDesc: "击杀100个敌人",
        achFirstLevel: "登堂入室",
        achFirstLevelDesc: "到达第5关",
        achExplorer: "探索者",
        achExplorerDesc: "到达第10关",
        achConqueror: "征服者",
        achConquerorDesc: "到达第20关",
        achMaster: "大师",
        achMasterDesc: "到达第30关",
        achLegend: "传奇",
        achLegendDesc: "到达第50关（通关）",
        achComboKing: "连击之王",
        achComboKingDesc: "达成10连击",
        achComboMaster: "连击大师",
        achComboMasterDesc: "达成20连击",
        achHighScoring: "高分达人",
        achHighScoringDesc: "单局得分超过1000",
        achHigherScoring: "高手",
        achHigherScoringDesc: "单局得分超过5000",
        achTopScoring: "顶尖高手",
        achTopScoringDesc: "单局得分超过10000",
        achSurvivor: "幸存者",
        achSurvivorDesc: "在10关内存活",
        achToughSkin: "铜皮铁骨",
        achToughSkinDesc: "在20关内存活且生命值超过30",

        // 设置选项
        soundEnabled: "音效开启",
        musicEnabled: "音乐开启",
        difficulty: "难度",
        easy: "简单",
        normal: "普通",
        hard: "困难",

        // 技能名称
        skillAoeName: "旋风斩",
        skillHealName: "治疗光环",
        skillTeleportName: "闪现",
        skillBerserkName: "狂暴"
    },
    en: {
        // Game texts
        title: "Weapon Rogue",
        description: "<strong>Enemies' weapons will definitely replace</strong> your current weapon<br>This could be good or a disaster...<br><br>Collect potions and relics to change your fate",
        startButton: "Start Game",
        achievementsButton: "Achievements",
        restartButton: "Restart",
        continueButton: "Continue",
        settingsButton: "Settings",
        mainMenuButton: "Main Menu",
        backToPauseButton: "Back to Pause",
        gameOver: "Game Over",
        finalLevel: "You reached level",
        finalKills: "Defeated",
        finalScore: "Final Score:",
        healthBar: "HP",
        weapon: "Weapon",
        level: "Level",
        goal: "Goal",
        kills: "Kills",
        combo: "Combo",
        score: "Score",
        buffs: "BUFFS",
        inventory: "Inventory",
        potions: "Potions",
        relics: "Relics",

        // Combat logs
        levelUp: "🎉 Leveled up to level %d!",
        skillAOE: "🌀 %s hit %d enemies!",
        skillNoHit: "🌀 %s didn't hit any enemies",
        skillHeal: "💚 %s restored %d HP!",
        skillTeleport: "✨ %s teleported successfully!",
        skillBerserk: "😠 %s activated, damage doubled!",
        weaponGet: "Got new weapon: %s!",
        weaponLost: "Lost weapon: %s...",

        // Tutorial texts
        tutorialWelcome: "Welcome!",
        tutorialWelcomeMsg: "Welcome to Weapon Rogue! Your goal is to survive as long as possible and defeat more enemies!",
        tutorialMovement: "Movement Control",
        tutorialMovementMsg: "Move mouse to control character movement",
        tutorialCombat: "Combat",
        tutorialCombatMsg: "Click mouse to attack nearby enemies",
        tutorialWeapons: "Weapons",
        tutorialWeaponsMsg: "Enemies will drop weapons, pick them up! Note: New weapons will replace current weapon",
        tutorialSkills: "Skills",
        tutorialSkillsMsg: "Press Q/W/E/R keys to use four skills, each with different effects",
        tutorialComplete: "Tutorial Complete",
        tutorialCompleteMsg: "Good luck, brave adventurer!",

        // Achievement titles and descriptions
        achFirstBlood: "First Blood",
        achFirstBloodDesc: "Kill first enemy",
        achBloodThirsty: "Blood Thirsty",
        achBloodThirstyDesc: "Kill 10 enemies",
        achKillingSpree: "Killing Spree",
        achKillingSpreeDesc: "Kill 50 enemies",
        achMonsterHunter: "Monster Hunter",
        achMonsterHunterDesc: "Kill 100 enemies",
        achFirstLevel: "Getting Started",
        achFirstLevelDesc: "Reach level 5",
        achExplorer: "Explorer",
        achExplorerDesc: "Reach level 10",
        achConqueror: "Conqueror",
        achConquerorDesc: "Reach level 20",
        achMaster: "Master",
        achMasterDesc: "Reach level 30",
        achLegend: "Legend",
        achLegendDesc: "Reach level 50 (Complete)",
        achComboKing: "Combo King",
        achComboKingDesc: "Achieve 10 combo",
        achComboMaster: "Combo Master",
        achComboMasterDesc: "Achieve 20 combo",
        achHighScoring: "High Scorer",
        achHighScoringDesc: "Score over 1000 in single game",
        achHigherScoring: "Expert",
        achHigherScoringDesc: "Score over 5000 in single game",
        achTopScoring: "Top Scorer",
        achTopScoringDesc: "Score over 10000 in single game",
        achSurvivor: "Survivor",
        achSurvivorDesc: "Survive to level 10",
        achToughSkin: "Tough Skin",
        achToughSkinDesc: "Survive to level 20 with HP above 30",

        // Settings options
        soundEnabled: "Sound Enabled",
        musicEnabled: "Music Enabled",
        difficulty: "Difficulty",
        easy: "Easy",
        normal: "Normal",
        hard: "Hard",

        // Skill names
        skillAoeName: "Whirlwind Slash",
        skillHealName: "Healing Aura",
        skillTeleportName: "Teleport",
        skillBerserkName: "Berserker"
    }
};

// 当前语言
let currentLanguage = "zh"; // 默认中文

// 获取翻译文本
function t(key) {
    const lang = LANGUAGES[currentLanguage];
    if (lang && lang[key]) {
        return lang[key];
    }
    // 回退到中文，再回退到英文
    const zhLang = LANGUAGES["zh"];
    if (zhLang && zhLang[key]) {
        return zhLang[key];
    }
    const enLang = LANGUAGES["en"];
    if (enLang && enLang[key]) {
        return enLang[key];
    }
    // 如果都没有找到，返回键名
    return key;
}

// 更新界面文本
function updateUIText() {
    // 更新开始界面文本
    const startScreen = document.getElementById("start-screen");
    if (startScreen) {
        const title = startScreen.querySelector("h1");
        if (title) title.innerHTML = `⚔️ ${t("title")}`;

        const description = startScreen.querySelector(".description");
        if (description) description.innerHTML = t("description");

        const startBtn = document.getElementById("start-btn");
        if (startBtn) startBtn.textContent = t("startButton");

        const achievementsBtn = document.getElementById("achievements-btn");
        if (achievementsBtn) achievementsBtn.textContent = t("achievementsButton");
    }

    // 更新游戏结束界面文本
    const gameOver = document.getElementById("game-over");
    if (gameOver) {
        const gameOverHeader = gameOver.querySelector("h2");
        if (gameOverHeader) gameOverHeader.textContent = t("gameOver");

        const restartBtn = document.getElementById("restart-btn");
        if (restartBtn) restartBtn.textContent = t("restartButton");
    }

    // 更新暂停菜单文本
    const pauseMenu = document.getElementById("pause-menu");
    if (pauseMenu) {
        const pauseHeader = pauseMenu.querySelector("h2");
        if (pauseHeader) pauseHeader.textContent = t("gameOver"); // "Game Over" also used for pause

        const continueBtn = document.getElementById("continue-btn");
        if (continueBtn) continueBtn.textContent = t("continueButton");

        const settingsBtn = document.getElementById("settings-btn");
        if (settingsBtn) settingsBtn.textContent = t("settingsButton");

        const mainMenuBtn = document.getElementById("main-menu-btn");
        if (mainMenuBtn) mainMenuBtn.textContent = t("mainMenuButton");
    }

    // 更新设置菜单文本
    updateSettingsUIText();

    // 更新技能名称
    updateSkillNames();
}

// 更新设置界面文本
function updateSettingsUIText() {
    const settingsMenu = document.getElementById("settings-menu");
    if (settingsMenu) {
        const settingsHeader = settingsMenu.querySelector("h2");
        if (settingsHeader) settingsHeader.textContent = t("settingsButton");

        const soundLabel = settingsMenu.querySelector("#sound-enabled + label");
        if (soundLabel) soundLabel.textContent = t("soundEnabled");

        const musicLabel = settingsMenu.querySelector("#music-enabled + label");
        if (musicLabel) musicLabel.textContent = t("musicEnabled");

        // 重新构建难度选择
        const difficultySelect = document.getElementById("difficulty-select");
        if (difficultySelect) {
            difficultySelect.innerHTML = `
                <option value="easy">${t("easy")}</option>
                <option value="normal" selected>${t("normal")}</option>
                <option value="hard">${t("hard")}</option>
            `;
        }

        const backToPauseBtn = document.getElementById("back-to-pause");
        if (backToPauseBtn) backToPauseBtn.textContent = t("backToPauseButton");
    }
}

// 更新技能名称
function updateSkillNames() {
    // 这里可以根据语言设置更新技能名称
    // 注意：SKILLS 是常量，在初始化后不能修改
    // 我们在显示时使用翻译
}

// 语言切换函数
function switchLanguage(lang) {
    if (LANGUAGES[lang]) {
        currentLanguage = lang;
        localStorage.setItem("language", lang);
        updateUIText();
        showCombatLog(`🌐 ${lang === "zh" ? "已切换到中文" : "Switched to English"}`, "weapon-get");
    }
}

// 添加语言切换功能到设置菜单
function addLanguageToggle() {
    const settingsMenu = document.getElementById("settings-menu");
    if (settingsMenu) {
        // 创建语言选择下拉框
        const langSelector = document.createElement("div");
        langSelector.className = "setting-option";
        langSelector.innerHTML = `
            <label>
                Language:
                <select id="language-select">
                    <option value="zh" ${currentLanguage === "zh" ? "selected" : ""}>中文</option>
                    <option value="en" ${currentLanguage === "en" ? "selected" : ""}>English</option>
                </select>
            </label>
        `;

        // 找到现有的设置选项容器并添加语言选择
        const settingsContainer = settingsMenu.querySelector("div") || settingsMenu;
        settingsContainer.appendChild(langSelector);

        // 绑定语言选择事件
        document.getElementById("language-select").addEventListener("change", (e) => {
            switchLanguage(e.target.value);
        });
    }
}

// 初始化语言
function initLanguage() {
    const savedLang = localStorage.getItem("language");
    if (savedLang && LANGUAGES[savedLang]) {
        currentLanguage = savedLang;
    } else {
        // 尝试检测浏览器语言
        const browserLang = navigator.language.substring(0, 2);
        if (LANGUAGES[browserLang]) {
            currentLanguage = browserLang;
        }
    }

    // 添加语言切换按钮到设置菜单
    addLanguageToggle();

    updateUIText();
}

// 初始化语言系统
document.addEventListener('DOMContentLoaded', function() {
    initLanguage();
});