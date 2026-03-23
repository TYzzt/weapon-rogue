// ==================== Steam版多语言本地化系统 ====================
//
// 为游戏添加中英文本地化支持，包括：
// 1. 多语言文本映射
// 2. 语言切换功能
// 3. 文本自动翻译
// 4. UI文本更新

class SteamLocalizationSystem {
    constructor() {
        this.currentLanguage = 'zh';
        this.supportedLanguages = ['zh', 'en'];
        this.translationKeys = {};

        // 语言翻译映射
        this.translations = {
            zh: {
                // 游戏UI文本
                'gameTitle': '武器替换者 - Steam版',
                'startGame': '开始游戏',
                'continueGame': '继续游戏',
                'settings': '游戏设置',
                'achievements': '成就系统',
                'restart': '重新开始',
                'mainMenu': '主菜单',

                // 游戏状态文本
                'level': '等级',
                'kills': '击杀',
                'combo': '连击',
                'score': '分数',
                'hp': '生命',
                'weapon': '武器',
                'enemies': '敌人',

                // 操作说明
                'controlsTitle': '操作说明',
                'moveInstruction': '移动: WASD 或方向键',
                'attackInstruction': '战斗: 靠近敌人自动攻击',
                'weaponInstruction': '武器: 拾取新武器自动替换当前武器',
                'objective': '目标: 生存并达到更高关卡',

                // 设置选项
                'soundEnabled': '音效开启',
                'musicEnabled': '音乐开启',
                'difficulty': '难度',
                'easy': '简单',
                'normal': '普通',
                'hard': '困难',
                'insane': '疯狂',

                // 游戏提示
                'gameOver': '游戏结束',
                'finalLevel': '你达到了第',
                'finalKills': '总共击杀',
                'finalScore': '获得了',
                'finalCombo': '最大连击数',

                // 关卡里程碑
                'levelUp': '升级到第 %d 关！',
                'milestoneReached': '里程碑达成：%s - %s',

                // 武器效果
                'weaponPickup': '获得了新武器: %s!',
                'weaponAttack': '攻击造成 %d 点伤害!',

                // 敌人相关
                'enemyHit': '受到了 %d 点伤害',
                'enemyDefeated': '击败了敌人！',

                // 技能相关
                'skillAOE': '技能 %s 击中了 %d 个敌人!',
                'skillNoHit': '技能 %s 没有击中任何敌人',
                'skillHeal': '技能 %s 恢复了 %d 点生命!',
                'skillTeleport': '技能 %s 传送完成!',
                'skillBerserk': '技能 %s 狂暴效果激活!',

                // 成就提示
                'achievementUnlock': '成就解锁: %s',

                // 药水效果
                'potionHeal': '使用 %s，恢复 %d 生命',
                'potionShield': '使用 %s，下次武器替换免疫',
                'potionLuck': '使用 %s，幸运提升！',
                'potionDamage': '使用 %s，攻击力 +%d',
                'potionSpeed': '使用 %s，移动速度 +%d！',

                // 遗物效果
                'relicObtain': '获得遗物：%s - %s',

                // 特殊事件
                'elementalStorm': '元素风暴即将来临！',
                'timeWarp': '时间扭曲！敌人变慢，你变快！',
                'treasureRain': '宝物洪流！',

                // 提示文本
                'saveSuccess': '进度已保存',
                'saveFail': '保存失败',
                'loadSuccess': '进度已加载',
                'loadFail': '读取存档失败',
                'clearSave': '存档已清除',

                // 敌人类型
                'enemyMelee': '近战怪',
                'enemyRanged': '远程怪',
                'enemyElite': '精英怪',
                'enemyBoss': '首领',

                // 武器稀有度
                'rarityCommon': '普通',
                'rarityUncommon': '不常见',
                'rarityRare': '稀有',
                'rarityEpic': '史诗',
                'rarityLegendary': '传说',
                'rarityMythic': '神话',

                // 游戏状态
                'playing': '游戏中',
                'paused': '已暂停',
                'gameComplete': '恭喜通关！',

                // 按键提示
                'keyWASD': 'WASD',
                'keyArrows': '方向键',
                'keySpace': '空格',
                'keyESC': 'ESC',

                // 菜单文本
                'menuStart': '开始游戏',
                'menuContinue': '继续游戏',
                'menuSettings': '设置',
                'menuAchievements': '成就',
                'menuQuit': '退出游戏',
                'menuResume': '继续游戏',
                'menuBack': '返回',

                // 难度描述
                'difficultyEasyDesc': '适合新手，敌人较弱',
                'difficultyNormalDesc': '标准难度，平衡体验',
                'difficultyHardDesc': '挑战性较高，敌人更强',
                'difficultyInsaneDesc': '极度困难，只为高手设计',

                // 教程提示
                'tutorialWelcome': '欢迎来到武器替换者!',
                'tutorialConcept': '核心机制',
                'tutorialMovement': '移动控制',
                'tutorialCombat': '战斗系统',
                'tutorialWeapons': '武器替换',
                'tutorialEnemies': '敌人类型',
                'tutorialRelics': '遗物系统',
                'tutorialProgression': '关卡推进',
                'tutorialAchievements': '成就系统',
                'tutorialComplete': '教程完成!',

                // 成就分类
                'categoryProgress': '进度',
                'categoryCombat': '战斗',
                'categoryWeapon': '武器',
                'categoryChallenge': '挑战',

                // 其他UI文本
                'yes': '是',
                'no': '否',
                'ok': '确定',
                'cancel': '取消',
                'apply': '应用',
                'close': '关闭'
            },
            en: {
                // Game UI Text
                'gameTitle': 'Weapon Rogue - Steam Edition',
                'startGame': 'Start Game',
                'continueGame': 'Continue Game',
                'settings': 'Game Settings',
                'achievements': 'Achievement System',
                'restart': 'Restart Game',
                'mainMenu': 'Main Menu',

                // Game Status Text
                'level': 'Level',
                'kills': 'Kills',
                'combo': 'Combo',
                'score': 'Score',
                'hp': 'HP',
                'weapon': 'Weapon',
                'enemies': 'Enemies',

                // Controls Instruction
                'controlsTitle': 'Controls Guide',
                'moveInstruction': 'Movement: WASD or Arrow Keys',
                'attackInstruction': 'Combat: Approach enemies to auto-attack',
                'weaponInstruction': 'Weapons: Picking up new weapons replaces current weapon',
                'objective': 'Objective: Survive and reach higher levels',

                // Settings Options
                'soundEnabled': 'Sound Effects Enabled',
                'musicEnabled': 'Music Enabled',
                'difficulty': 'Difficulty',
                'easy': 'Easy',
                'normal': 'Normal',
                'hard': 'Hard',
                'insane': 'Insane',

                // Game Tips
                'gameOver': 'Game Over',
                'finalLevel': 'You reached Level',
                'finalKills': 'Total kills',
                'finalScore': 'Score earned',
                'finalCombo': 'Max combo',

                // Level Milestones
                'levelUp': 'Leveled up to Level %d!',
                'milestoneReached': 'Milestone Reached: %s - %s',

                // Weapon Effects
                'weaponPickup': 'Got new weapon: %s!',
                'weaponAttack': 'Attack dealt %d damage!',

                // Enemies Related
                'enemyHit': 'Took %d damage',
                'enemyDefeated': 'Enemy defeated!',

                // Skills Related
                'skillAOE': 'Skill %s hit %d enemies!',
                'skillNoHit': 'Skill %s hit no enemies',
                'skillHeal': 'Skill %s healed %d HP!',
                'skillTeleport': 'Skill %s teleport complete!',
                'skillBerserk': 'Skill %s berserk activated!',

                // Achievements
                'achievementUnlock': 'Achievement Unlocked: %s',

                // Potion Effects
                'potionHeal': 'Used %s, recovered %d HP',
                'potionShield': 'Used %s, immune to next weapon swap',
                'potionLuck': 'Used %s, luck increased!',
                'potionDamage': 'Used %s, attack +%d',
                'potionSpeed': 'Used %s, movement speed +%d!',

                // Relic Effects
                'relicObtain': 'Obtained relic: %s - %s',

                // Special Events
                'elementalStorm': 'Elemental storm approaching!',
                'timeWarp': 'Time warp! Enemies slow down, you speed up!',
                'treasureRain': 'Treasure rain!',

                // Prompt Text
                'saveSuccess': 'Progress saved',
                'saveFail': 'Save failed',
                'loadSuccess': 'Progress loaded',
                'loadFail': 'Failed to load save',
                'clearSave': 'Save cleared',

                // Enemy Types
                'enemyMelee': 'Melee Enemy',
                'enemyRanged': 'Ranged Enemy',
                'enemyElite': 'Elite Enemy',
                'enemyBoss': 'Boss Enemy',

                // Weapon Rarity
                'rarityCommon': 'Common',
                'rarityUncommon': 'Uncommon',
                'rarityRare': 'Rare',
                'rarityEpic': 'Epic',
                'rarityLegendary': 'Legendary',
                'rarityMythic': 'Mythic',

                // Game States
                'playing': 'Playing',
                'paused': 'Paused',
                'gameComplete': 'Congratulations, you won!',

                // Key Tips
                'keyWASD': 'WASD',
                'keyArrows': 'Arrow Keys',
                'keySpace': 'Space',
                'keyESC': 'ESC',

                // Menu Text
                'menuStart': 'Start Game',
                'menuContinue': 'Continue',
                'menuSettings': 'Settings',
                'menuAchievements': 'Achievements',
                'menuQuit': 'Quit Game',
                'menuResume': 'Resume Game',
                'menuBack': 'Back',

                // Difficulty Descriptions
                'difficultyEasyDesc': 'For beginners, weaker enemies',
                'difficultyNormalDesc': 'Standard challenge, balanced experience',
                'difficultyHardDesc': 'More challenging, stronger enemies',
                'difficultyInsaneDesc': 'Extremely difficult, for experts only',

                // Tutorial Tips
                'tutorialWelcome': 'Welcome to Weapon Rogue!',
                'tutorialConcept': 'Core Mechanism',
                'tutorialMovement': 'Movement Controls',
                'tutorialCombat': 'Combat System',
                'tutorialWeapons': 'Weapon Swapping',
                'tutorialEnemies': 'Enemy Types',
                'tutorialRelics': 'Relic System',
                'tutorialProgression': 'Level Progression',
                'tutorialAchievements': 'Achievement System',
                'tutorialComplete': 'Tutorial Complete!',

                // Achievement Categories
                'categoryProgress': 'Progress',
                'categoryCombat': 'Combat',
                'categoryWeapon': 'Weapons',
                'categoryChallenge': 'Challenges',

                // Other UI Text
                'yes': 'Yes',
                'no': 'No',
                'ok': 'OK',
                'cancel': 'Cancel',
                'apply': 'Apply',
                'close': 'Close'
            }
        };

        this.init();
    }

    init() {
        // 从本地存储加载语言设置
        this.loadLanguageSetting();

        // 更新所有UI文本
        this.updateAllUIText();

        console.log(`🌐 本地化系统已初始化，当前语言: ${this.currentLanguage}`);
    }

    // 加载语言设置
    loadLanguageSetting() {
        const savedLang = localStorage.getItem('gameLanguage');
        if (savedLang && this.supportedLanguages.includes(savedLang)) {
            this.currentLanguage = savedLang;
        } else {
            // 检测浏览器语言
            const browserLang = navigator.language.substring(0, 2);
            if (this.supportedLanguages.includes(browserLang)) {
                this.currentLanguage = browserLang;
            } else {
                // 默认中文
                this.currentLanguage = 'zh';
            }

            // 保存设置
            this.saveLanguageSetting();
        }
    }

    // 保存语言设置
    saveLanguageSetting() {
        localStorage.setItem('gameLanguage', this.currentLanguage);
    }

    // 切换语言
    switchLanguage(langCode) {
        if (this.supportedLanguages.includes(langCode)) {
            this.currentLanguage = langCode;
            this.saveLanguageSetting();

            // 更新所有UI文本
            this.updateAllUIText();

            console.log(`🌐 语言已切换到: ${langCode}`);

            return true;
        }
        return false;
    }

    // 获取翻译文本
    t(key, ...args) {
        const translation = this.translations[this.currentLanguage][key];

        if (!translation) {
            // 如果找不到翻译，返回键值或中文默认值
            return this.translations['zh'][key] || key;
        }

        // 处理参数替换
        let result = translation;
        args.forEach((arg, index) => {
            result = result.replace(new RegExp(`%${index + 1 || 's'}`, 'g'), arg);
        });

        // 特殊处理 %d 占位符
        if (args.length > 0) {
            args.forEach((arg, index) => {
                result = result.replace('%d', arg);
            });
        }

        return result;
    }

    // 获取当前语言
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    // 获取支持的语言列表
    getSupportedLanguages() {
        return [...this.supportedLanguages];
    }

    // 更新特定元素的文本
    updateElementText(selector, key) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
            const translatedText = this.t(key);
            elements.forEach(element => {
                element.textContent = translatedText;
            });
        }
    }

    // 更新所有UI文本
    updateAllUIText() {
        // 更新标题
        document.title = this.t('gameTitle');

        // 更新按钮文本
        this.updateElementText('#start-btn, .start-btn', 'startGame');
        this.updateElementText('#continue-btn, .continue-btn', 'continueGame');
        this.updateElementText('#settings-btn, .settings-btn', 'settings');
        this.updateElementText('#achievements-btn, .achievements-btn', 'achievements');
        this.updateElementText('#restart-btn, .restart-btn', 'restart');
        this.updateElementText('#main-menu-btn, .main-menu-btn', 'mainMenu');

        // 更新设置界面
        this.updateElementText('label[for="sound-enabled"]', 'soundEnabled');
        this.updateElementText('label[for="music-enabled"]', 'musicEnabled');
        this.updateElementText('label[for="difficulty-select"]', 'difficulty');
        this.updateElementText('#difficulty-select option[value="easy"]', 'easy');
        this.updateElementText('#difficulty-select option[value="normal"]', 'normal');
        this.updateElementText('#difficulty-select option[value="hard"]', 'hard');
        this.updateElementText('#difficulty-select option[value="insane"]', 'insane');

        // 更新状态栏标签
        this.updateElementText('#stats div:first-child', 'level');
        this.updateElementText('#stats div:nth-child(2)', 'kills');
        this.updateElementText('#stats div:nth-child(3)', 'combo');
        this.updateElementText('#stats div:nth-child(4)', 'score');
        this.updateElementText('#stats div:nth-child(5)', 'hp');
        this.updateElementText('#stats div:nth-child(6)', 'weapon');
        this.updateElementText('#stats div:last-child', 'enemies');

        // 更新游戏结束界面
        this.updateElementText('#game-over h2', 'gameOver');
        this.updateElementText('#game-over p:first-child span:first-child', 'finalLevel');
        this.updateElementText('#game-over p:nth-child(2) span:first-child', 'finalKills');
        this.updateElementText('#game-over p:nth-child(3) span:first-child', 'finalScore');
        this.updateElementText('#game-over p:last-child span:first-child', 'finalCombo');

        // 更新开始界面描述
        this.updateElementText('.game-stats p:first-child', 'controlsTitle');
        this.updateElementText('.game-stats p:nth-child(2)', 'moveInstruction');
        this.updateElementText('.game-stats p:nth-child(3)', 'attackInstruction');
        this.updateElementText('.game-stats p:nth-child(4)', 'weaponInstruction');
        this.updateElementText('.game-stats p:last-child', 'objective');

        console.log(`📝 已更新所有UI文本为 ${this.currentLanguage} 语言`);
    }

    // 动态翻译函数（供游戏内部使用）
    translateText(originalText, key = null) {
        if (key) {
            return this.t(key);
        }

        // 尝试基于原文查找对应的翻译键
        const reverseLookup = this.findTranslationKey(originalText);
        if (reverseLookup) {
            return this.t(reverseLookup);
        }

        // 如果找不到，返回原文
        return originalText;
    }

    // 查找翻译键（辅助函数）
    findTranslationKey(originalText) {
        for (const [key, translations] of Object.entries(this.translations.zh)) {
            if (translations === originalText) {
                return key;
            }
        }
        return null;
    }

    // 添加新的翻译键值对
    addTranslation(lang, key, value) {
        if (!this.translations[lang]) {
            this.translations[lang] = {};
        }

        this.translations[lang][key] = value;
        console.log(`➕ 已添加新的翻译: ${lang}.${key} = "${value}"`);
    }

    // 批量添加翻译
    addTranslations(lang, translationsObj) {
        if (!this.translations[lang]) {
            this.translations[lang] = {};
        }

        Object.assign(this.translations[lang], translationsObj);
        console.log(`➕ 已批量添加 ${Object.keys(translationsObj).length} 条翻译到 ${lang} 语言`);
    }

    // 获取语言信息
    getLanguageInfo() {
        return {
            current: this.currentLanguage,
            supported: this.supportedLanguages,
            totalTranslations: Object.keys(this.translations[this.currentLanguage]).length
        };
    }

    // 格式化数字（根据不同语言的习惯）
    formatNumber(num) {
        // 根据语言选择数字格式
        switch (this.currentLanguage) {
            case 'en':
                return num.toLocaleString('en-US');
            case 'zh':
            default:
                return num.toLocaleString('zh-CN');
        }
    }

    // 格式化货币（如果游戏有经济系统）
    formatCurrency(amount) {
        // 根据语言选择货币格式
        switch (this.currentLanguage) {
            case 'en':
                return `$${amount}`;
            case 'zh':
            default:
                return `${amount}金币`;
        }
    }
}

// 创建全局实例
window.steamLocalization = new SteamLocalizationSystem();

// 与游戏逻辑集成
if (typeof showCombatLog !== 'undefined') {
    // 保存原始函数
    const originalShowCombatLog = window.showCombatLog;

    // 扩展showCombatLog以支持翻译
    window.showCombatLog = function(text, className) {
        // 尝试翻译文本（如果它是已知的键值）
        let translatedText = text;

        if (window.steamLocalization) {
            // 检查文本是否是翻译键格式（如 'levelUp'）
            if (text.includes('%d')) {
                // 这是带有参数的翻译键，如 'levelUp' -> '升级到第 %d 关！'
                const parts = text.split(' ');
                if (parts.length > 1 && !isNaN(parseInt(parts[parts.length - 1]))) {
                    const level = parseInt(parts[parts.length - 1]);
                    const key = parts[0];

                    if (window.steamLocalization.translations[window.steamLocalization.currentLanguage][key]) {
                        translatedText = window.steamLocalization.t(key).replace('%d', level);
                    }
                }
            } else {
                // 检查是否为直接的翻译键
                if (window.steamLocalization.translations[window.steamLocalization.currentLanguage][text]) {
                    translatedText = window.steamLocalization.t(text);
                }
            }
        }

        originalShowCombatLog(translatedText, className);
    };
}

// 提供全局翻译函数
window.t = function(key, ...args) {
    if (window.steamLocalization) {
        return window.steamLocalization.t(key, ...args);
    }
    return key;
};

// 提供语言切换函数
window.switchLanguage = function(lang) {
    if (window.steamLocalization) {
        return window.steamLocalization.switchLanguage(lang);
    }
    return false;
};

// 提供当前语言查询函数
window.getCurrentLanguage = function() {
    if (window.steamLocalization) {
        return window.steamLocalization.getCurrentLanguage();
    }
    return 'zh';
};

// 与菜单系统集成
if (window.steamMenuSystem) {
    // 语言切换后更新菜单文本
    const originalShowMainMenu = window.steamMenuSystem.showMainMenu;
    window.steamMenuSystem.showMainMenu = function() {
        // 在显示主菜单前更新文本
        if (window.steamLocalization) {
            window.steamLocalization.updateAllUIText();
        }
        originalShowMainMenu.call(this);
    };
}

// 与成就系统集成
if (window.CompleteAchievementSystem) {
    // 更新成就系统的文本
    const updateAchievementTexts = () => {
        if (window.steamLocalization) {
            // 更新成就类别名称
            window.CompleteAchievementSystem.getCategoryDisplayName = function(category) {
                const names = {
                    'progress': window.steamLocalization.t('categoryProgress'),
                    'combat': window.steamLocalization.t('categoryCombat'),
                    'weapon': window.steamLocalization.t('categoryWeapon'),
                    'challenge': window.steamLocalization.t('categoryChallenge')
                };
                return names[category] || category;
            };
        }
    };

    updateAchievementTexts();
}

console.log("Steam版多语言本地化系统已准备就绪，支持中英文切换");