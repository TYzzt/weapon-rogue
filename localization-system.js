// ==================== 本地化系统 ====================
//
// 本系统实现游戏的多语言支持功能
// 包括中英文切换、文本翻译和本地化资源配置

class LocalizationSystem {
    constructor() {
        this.currentLanguage = 'zh-CN';
        this.supportedLanguages = ['zh-CN', 'en-US'];
        this.translations = {};
        this.fallbackLanguage = 'en-US';
        this.textElements = new Map();

        this.init();
        console.log("🌐 本地化系统已初始化");
    }

    // 初始化本地化系统
    init() {
        this.loadTranslations();
        this.scanPageForLocalizableText();
        this.loadUserPreferences();
        this.applyLocalization();
        console.log("🌍 本地化系统初始化完成");
    }

    // 加载翻译资源
    loadTranslations() {
        this.translations = {
            'zh-CN': {
                // 游戏标题
                'title': '武器替换者',
                'subtitle': '敌人掉落的武器必定替换你当前的武器',

                // 菜单文本
                'startButton': '开始游戏',
                'continueButton': '继续游戏',
                'achievementsButton': '成就',
                'settingsButton': '设置',
                'tutorialButton': '教程',
                'pauseButton': '暂停',
                'resumeButton': '继续',
                'restartButton': '重新开始',
                'mainMenuButton': '主菜单',
                'backButton': '返回',
                'applyButton': '应用',

                // 游戏UI文本
                'health': '生命值',
                'weapon': '武器',
                'level': '关卡',
                'score': '得分',
                'kills': '击杀',
                'enemies': '敌人',
                'damage': '伤害',
                'speed': '速度',

                // 游戏状态文本
                'gameOver': '游戏结束',
                'victory': '胜利!',
                'winMessage': '恭喜你完成了游戏!',
                'loseMessage': '再接再厉!',

                // 成就文本
                'achievementsTitle': '游戏成就',
                'achievementUnlocked': '成就解锁!',
                'achievementLocked': '未解锁',

                // 设置文本
                'settingsTitle': '游戏设置',
                'audioSettings': '音频设置',
                'gameSettings': '游戏设置',
                'controlSettings': '控制设置',
                'languageSettings': '语言设置',
                'soundEnabled': '音效开启',
                'musicEnabled': '音乐开启',
                'showNotifications': '显示通知',
                'showAnimations': '显示动画效果',
                'difficulty': '难度',
                'easy': '简单',
                'normal': '普通',
                'hard': '困难',
                'language': '语言',

                // 提示消息
                'loading': '加载中...',
                'saving': '保存中...',
                'loadingComplete': '加载完成',
                'saveSuccess': '保存成功',
                'saveFailed': '保存失败',

                // 游戏内文本
                'weaponAcquired': '获得新武器',
                'criticalHit': '暴击!',
                'combo': '连击',
                'treasureFound': '发现宝藏!',
                'levelComplete': '关卡完成!',
                'newRecord': '新纪录!',

                // 操作提示
                'moveInstruction': '使用WASD移动',
                'attackInstruction': '左键攻击',
                'interactInstruction': '靠近互动',

                // 版本信息
                'version': '版本',

                // 按钮标签
                'ok': '确定',
                'cancel': '取消',
                'yes': '是',
                'no': '否',
                'confirm': '确认',

                // 状态信息
                'connecting': '连接中...',
                'connected': '已连接',
                'disconnected': '已断开',
                'error': '错误',
                'warning': '警告',
                'info': '信息',

                // 游戏特定术语
                'weaponMaster': '武器大师',
                'survivalMode': '生存模式',
                'challengeMode': '挑战模式',
                'timeTrial': '竞速模式',

                // 教程文本
                'tutorialWelcome': '欢迎来到武器替换者',
                'tutorialMovement': '移动操作',
                'tutorialCombat': '战斗操作',
                'tutorialTips': '游戏提示',
                'tutorialComplete': '教程完成'
            },

            'en-US': {
                // Game title
                'title': 'Weapon Rogue',
                'subtitle': 'Enemies drop weapons that replace your current weapon',

                // Menu text
                'startButton': 'Start Game',
                'continueButton': 'Continue',
                'achievementsButton': 'Achievements',
                'settingsButton': 'Settings',
                'tutorialButton': 'Tutorial',
                'pauseButton': 'Pause',
                'resumeButton': 'Resume',
                'restartButton': 'Restart',
                'mainMenuButton': 'Main Menu',
                'backButton': 'Back',
                'applyButton': 'Apply',

                // Game UI text
                'health': 'Health',
                'weapon': 'Weapon',
                'level': 'Level',
                'score': 'Score',
                'kills': 'Kills',
                'enemies': 'Enemies',
                'damage': 'Damage',
                'speed': 'Speed',

                // Game status text
                'gameOver': 'Game Over',
                'victory': 'Victory!',
                'winMessage': 'Congratulations on completing the game!',
                'loseMessage': 'Try Again!',

                // Achievement text
                'achievementsTitle': 'Game Achievements',
                'achievementUnlocked': 'Achievement Unlocked!',
                'achievementLocked': 'Locked',

                // Settings text
                'settingsTitle': 'Game Settings',
                'audioSettings': 'Audio Settings',
                'gameSettings': 'Game Settings',
                'controlSettings': 'Control Settings',
                'languageSettings': 'Language Settings',
                'soundEnabled': 'Sound Enabled',
                'musicEnabled': 'Music Enabled',
                'showNotifications': 'Show Notifications',
                'showAnimations': 'Show Animation Effects',
                'difficulty': 'Difficulty',
                'easy': 'Easy',
                'normal': 'Normal',
                'hard': 'Hard',
                'language': 'Language',

                // Prompt messages
                'loading': 'Loading...',
                'saving': 'Saving...',
                'loadingComplete': 'Loading Complete',
                'saveSuccess': 'Save Successful',
                'saveFailed': 'Save Failed',

                // In-game text
                'weaponAcquired': 'New Weapon Acquired',
                'criticalHit': 'Critical Hit!',
                'combo': 'Combo',
                'treasureFound': 'Treasure Found!',
                'levelComplete': 'Level Complete!',
                'newRecord': 'New Record!',

                // Action prompts
                'moveInstruction': 'Move with WASD',
                'attackInstruction': 'Left Click to Attack',
                'interactInstruction': 'Approach to Interact',

                // Version info
                'version': 'Version',

                // Button labels
                'ok': 'OK',
                'cancel': 'Cancel',
                'yes': 'Yes',
                'no': 'No',
                'confirm': 'Confirm',

                // Status info
                'connecting': 'Connecting...',
                'connected': 'Connected',
                'disconnected': 'Disconnected',
                'error': 'Error',
                'warning': 'Warning',
                'info': 'Info',

                // Game-specific terms
                'weaponMaster': 'Weapon Master',
                'survivalMode': 'Survival Mode',
                'challengeMode': 'Challenge Mode',
                'timeTrial': 'Time Trial',

                // Tutorial text
                'tutorialWelcome': 'Welcome to Weapon Rogue',
                'tutorialMovement': 'Movement Controls',
                'tutorialCombat': 'Combat Controls',
                'tutorialTips': 'Game Tips',
                'tutorialComplete': 'Tutorial Complete'
            }
        };

        console.log("📚 翻译资源已加载");
    }

    // 扫描页面查找可本地化的文本
    scanPageForLocalizableText() {
        // 查找所有带data-i18n属性的元素
        const localizableElements = document.querySelectorAll('[data-i18n]');

        for (const element of localizableElements) {
            const key = element.getAttribute('data-i18n');
            this.textElements.set(element, key);
        }

        console.log(`🔍 扫描到 ${this.textElements.size} 个可本地化的文本元素`);
    }

    // 应用本地化
    applyLocalization() {
        if (!this.translations[this.currentLanguage]) {
            console.warn(`⚠️ 未找到语言包: ${this.currentLanguage}，使用回退语言: ${this.fallbackLanguage}`);
            this.currentLanguage = this.fallbackLanguage;
        }

        // 更新已扫描的元素
        for (const [element, key] of this.textElements) {
            const translatedText = this.getTranslation(key);
            if (translatedText) {
                // 根据元素类型设置文本
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translatedText;
                } else {
                    element.textContent = translatedText;
                }
            }
        }

        // 如果存在全局函数，也更新它们
        this.updateGlobalUIElements();

        console.log(`🌎 本地化已应用到 ${this.textElements.size} 个元素，使用语言: ${this.currentLanguage}`);
    }

    // 更新全局UI元素
    updateGlobalUIElements() {
        // 更新可能存在的全局UI元素
        const globalElements = [
            { selector: '#game-title', key: 'title' },
            { selector: '#start-button-text', key: 'startButton' },
            { selector: '#continue-button-text', key: 'continueButton' },
            { selector: '#achievements-button-text', key: 'achievementsButton' },
            { selector: '#settings-button-text', key: 'settingsButton' },
            { selector: '#tutorial-button-text', key: 'tutorialButton' },
            { selector: '#pause-text', key: 'pauseButton' },
            { selector: '#resume-button-text', key: 'resumeButton' },
            { selector: '#restart-button-text', key: 'restartButton' },
            { selector: '#main-menu-button-text', key: 'mainMenuButton' },
            { selector: '#back-button-text', key: 'backButton' },
            { selector: '#apply-button-text', key: 'applyButton' },
            { selector: '#settings-text', key: 'settingsTitle' },
            { selector: '#game-over-text', key: 'gameOver' },
            { selector: '#victory-text', key: 'victory' },
            { selector: '#achievements-menu-title', key: 'achievementsTitle' }
        ];

        for (const elementInfo of globalElements) {
            const element = document.querySelector(elementInfo.selector);
            if (element) {
                const translatedText = this.getTranslation(elementInfo.key);
                if (translatedText) {
                    element.textContent = translatedText;
                }
            }
        }
    }

    // 获取翻译文本
    getTranslation(key) {
        if (this.translations[this.currentLanguage] && this.translations[this.currentLanguage][key]) {
            return this.translations[this.currentLanguage][key];
        }

        // 回退到默认语言
        if (this.translations[this.fallbackLanguage] && this.translations[this.fallbackLanguage][key]) {
            return this.translations[this.fallbackLanguage][key];
        }

        // 如果都没有，返回键名
        console.warn(`⚠️ 未找到翻译: ${key}`);
        return key;
    }

    // 切换语言
    switchLanguage(newLanguage) {
        if (!this.supportedLanguages.includes(newLanguage)) {
            console.warn(`⚠️ 不支持的语言: ${newLanguage}`);
            return false;
        }

        this.currentLanguage = newLanguage;
        this.applyLocalization();

        // 更新游戏状态中的语言设置
        if (typeof currentLanguage !== 'undefined') {
            window.currentLanguage = newLanguage;
        }

        // 如果存在全局设置函数，也更新它们
        if (window.updateLanguageSetting) {
            window.updateLanguageSetting(newLanguage);
        }

        // 保存用户偏好
        this.saveUserPreferences();

        console.log(`🌐 语言已切换至: ${newLanguage}`);

        // 播放语言切换音效
        if (window.playSound) {
            window.playSound('notification');
        }

        return true;
    }

    // 获取当前语言
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    // 获取支持的语言列表
    getSupportedLanguages() {
        return [...this.supportedLanguages];
    }

    // 添加新的翻译键值对
    addTranslation(language, key, value) {
        if (!this.translations[language]) {
            this.translations[language] = {};
        }

        this.translations[language][key] = value;
        console.log(`➕ 添加翻译: [${language}] ${key} = "${value}"`);
    }

    // 批量添加翻译
    addTranslations(language, translationsObject) {
        if (!this.translations[language]) {
            this.translations[language] = {};
        }

        Object.assign(this.translations[language], translationsObject);
        console.log(`➕ 批量添加 ${Object.keys(translationsObject).length} 个翻译到 [${language}]`);
    }

    // 获取翻译包信息
    getTranslationInfo(language = null) {
        if (language) {
            return {
                language: language,
                totalKeys: Object.keys(this.translations[language] || {}).length,
                isComplete: this.isTranslationComplete(language)
            };
        } else {
            const info = {};
            for (const lang of this.supportedLanguages) {
                info[lang] = this.getTranslationInfo(lang);
            }
            return info;
        }
    }

    // 检查翻译是否完整
    isTranslationComplete(language) {
        const referenceLang = this.fallbackLanguage;
        const referenceKeys = Object.keys(this.translations[referenceLang] || {});
        const currentKeys = Object.keys(this.translations[language] || {});

        return referenceKeys.every(key => currentKeys.includes(key));
    }

    // 加载用户偏好设置
    loadUserPreferences() {
        try {
            const savedLanguage = localStorage.getItem('language');
            if (savedLanguage && this.supportedLanguages.includes(savedLanguage)) {
                this.currentLanguage = savedLanguage;
                console.log(`📥 从本地存储加载语言设置: ${savedLanguage}`);
            } else {
                // 如果没有保存的设置，使用浏览器语言（如果支持）
                const browserLang = this.getBrowserLanguage();
                if (this.supportedLanguages.includes(browserLang)) {
                    this.currentLanguage = browserLang;
                }
                console.log(`🌐 使用浏览器语言检测: ${browserLang}`);
            }
        } catch (error) {
            console.warn("⚠️ 加载语言偏好设置失败:", error);
        }
    }

    // 保存用户偏好设置
    saveUserPreferences() {
        try {
            localStorage.setItem('language', this.currentLanguage);
            console.log(`💾 语言偏好设置已保存: ${this.currentLanguage}`);
        } catch (error) {
            console.warn("⚠️ 保存语言偏好设置失败:", error);
        }
    }

    // 获取浏览器语言
    getBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage || 'en-US';

        // 尝试匹配支持的语言
        if (browserLang.startsWith('zh')) {
            return 'zh-CN';
        } else if (browserLang.startsWith('en')) {
            return 'en-US';
        }

        // 默认英语
        return 'en-US';
    }

    // 获取语言名称
    getLanguageDisplayName(languageCode) {
        const names = {
            'zh-CN': '中文',
            'en-US': 'English'
        };

        return names[languageCode] || languageCode;
    }

    // 翻译数字（某些语言中）
    formatNumber(number) {
        // 目前只是简单返回，可根据需要实现格式化
        return number.toLocaleString(this.currentLanguage);
    }

    // 翻译日期时间
    formatDate(date) {
        return date.toLocaleString(this.currentLanguage, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    // 本地化货币（如果需要）
    formatCurrency(amount, currency = 'USD') {
        return new Intl.NumberFormat(this.currentLanguage, {
            style: 'currency',
            currency: currency
        }).format(amount);
    }

    // 注册新的本地化元素
    registerElement(element, translationKey) {
        if (element && translationKey) {
            this.textElements.set(element, translationKey);
            this.updateElementText(element, translationKey);
        }
    }

    // 更新单个元素的文本
    updateElementText(element, translationKey = null) {
        if (!element) return;

        // 如果没有提供键值，尝试从属性获取
        if (!translationKey) {
            translationKey = element.getAttribute('data-i18n');
        }

        if (translationKey) {
            const translatedText = this.getTranslation(translationKey);
            if (translatedText) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = translatedText;
                } else {
                    element.textContent = translatedText;
                }
            }
        }
    }

    // 批量更新元素文本
    updateElementsText(selectorOrElements, translationKey) {
        let elements;

        if (typeof selectorOrElements === 'string') {
            elements = document.querySelectorAll(selectorOrElements);
        } else if (selectorOrElements instanceof HTMLElement) {
            elements = [selectorOrElements];
        } else {
            elements = selectorOrElements;
        }

        for (const element of elements) {
            this.updateElementText(element, translationKey);
        }
    }

    // 获取当前语言的文本方向（LTR/RTL）
    getTextDirection() {
        // 简化处理：中文和英文都是从左到右
        // 如果需要支持RTL语言，可在此扩展
        return 'ltr';
    }

    // 本地化系统的完整状态
    getStatus() {
        return {
            currentLanguage: this.currentLanguage,
            supportedLanguages: this.supportedLanguages,
            isRTL: this.getTextDirection() === 'rtl',
            totalStrings: this.getTranslationInfo()[this.currentLanguage].totalKeys,
            elementsLocalized: this.textElements.size,
            localizationComplete: this.isTranslationComplete(this.currentLanguage)
        };
    }

    // 重置本地化到默认设置
    resetToDefault() {
        this.currentLanguage = this.getBrowserLanguage();
        this.applyLocalization();
        this.saveUserPreferences();
        console.log("🔄 本地化已重置为默认设置");
    }

    // 销毁本地化系统
    destroy() {
        this.textElements.clear();
        console.log("🧹 本地化系统已销毁");
    }
}

// 游戏特定本地化系统
class GameLocalizationSystem extends LocalizationSystem {
    constructor() {
        super();
        this.gameSpecificTranslations = {};
        this.initGameLocalization();
        console.log("🎮 游戏特定本地化系统已初始化");
    }

    // 初始化游戏特定本地化
    initGameLocalization() {
        // 游戏特定术语翻译
        this.gameSpecificTranslations = {
            'zh-CN': {
                // 武器类型
                'sword': '剑',
                'axe': '斧',
                'bow': '弓',
                'staff': '法杖',
                'dagger': '匕首',
                'hammer': '锤',

                // 敌人类型
                'slime': '史莱姆',
                'goblin': '哥布林',
                'skeleton': '骷髅',
                'zombie': '僵尸',
                'orc': '兽人',
                'dragon': '龙',

                // 物品类型
                'potion': '药水',
                'scroll': '卷轴',
                'ring': '戒指',
                'amulet': '护符',
                'armor': '护甲',

                // 元素类型
                'fire': '火',
                'ice': '冰',
                'lightning': '雷',
                'poison': '毒',
                'holy': '神圣',
                'dark': '暗影',

                // 特殊效果
                'critical': '暴击',
                'burn': '燃烧',
                'freeze': '冰冻',
                'poisoned': '中毒',
                'stunned': '眩晕',
                'healed': '治疗',

                // 稀有度
                'common': '普通',
                'uncommon': '罕见',
                'rare': '稀有',
                'epic': '史诗',
                'legendary': '传说',

                // 技能类型
                'melee': '近战',
                'ranged': '远程',
                'magic': '魔法',
                'utility': '辅助'
            },

            'en-US': {
                // Weapon types
                'sword': 'Sword',
                'axe': 'Axe',
                'bow': 'Bow',
                'staff': 'Staff',
                'dagger': 'Dagger',
                'hammer': 'Hammer',

                // Enemy types
                'slime': 'Slime',
                'goblin': 'Goblin',
                'skeleton': 'Skeleton',
                'zombie': 'Zombie',
                'orc': 'Orc',
                'dragon': 'Dragon',

                // Item types
                'potion': 'Potion',
                'scroll': 'Scroll',
                'ring': 'Ring',
                'amulet': 'Amulet',
                'armor': 'Armor',

                // Element types
                'fire': 'Fire',
                'ice': 'Ice',
                'lightning': 'Lightning',
                'poison': 'Poison',
                'holy': 'Holy',
                'dark': 'Dark',

                // Special effects
                'critical': 'Critical',
                'burn': 'Burn',
                'freeze': 'Freeze',
                'poisoned': 'Poisoned',
                'stunned': 'Stunned',
                'healed': 'Healed',

                // Rarities
                'common': 'Common',
                'uncommon': 'Uncommon',
                'rare': 'Rare',
                'epic': 'Epic',
                'legendary': 'Legendary',

                // Skill types
                'melee': 'Melee',
                'ranged': 'Ranged',
                'magic': 'Magic',
                'utility': 'Utility'
            }
        };

        // 合并游戏特定翻译到主翻译对象
        for (const lang of this.supportedLanguages) {
            Object.assign(this.translations[lang], this.gameSpecificTranslations[lang]);
        }

        console.log("🎲 游戏特定翻译已加载");
    }

    // 获取游戏术语翻译
    getGameTerm(term) {
        const translation = this.getTranslation(term);
        if (translation !== term) {
            return translation; // 找到了翻译
        }

        // 如果不是通用翻译，尝试在游戏特定翻译中查找
        if (this.gameSpecificTranslations[this.currentLanguage] &&
            this.gameSpecificTranslations[this.currentLanguage][term]) {
            return this.gameSpecificTranslations[this.currentLanguage][term];
        }

        // 如果还是没找到，返回原文
        return term;
    }

    // 本地化武器名称
    localizeWeaponName(weapon) {
        if (!weapon || !weapon.name) return 'Unknown';

        // 首先尝试完整的武器名称
        const fullTranslation = this.getTranslation(weapon.name);
        if (fullTranslation !== weapon.name) {
            return fullTranslation;
        }

        // 如果没有完整名称翻译，尝试组合翻译
        let localizedName = weapon.name;

        // 查找并替换武器类型
        const weaponTypes = ['sword', 'axe', 'bow', 'staff', 'dagger', 'hammer'];
        for (const type of weaponTypes) {
            if (localizedName.toLowerCase().includes(type)) {
                localizedName = localizedName.replace(new RegExp(type, 'gi'), this.getGameTerm(type));
            }
        }

        // 查找并替换元素属性
        const elements = ['fire', 'ice', 'lightning', 'poison', 'holy', 'dark'];
        for (const element of elements) {
            if (localizedName.toLowerCase().includes(element)) {
                localizedName = localizedName.replace(new RegExp(element, 'gi'), this.getGameTerm(element));
            }
        }

        // 查找并替换稀有度
        const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
        for (const rarity of rarities) {
            if (localizedName.toLowerCase().includes(rarity)) {
                localizedName = localizedName.replace(new RegExp(rarity, 'gi'), this.getGameTerm(rarity));
            }
        }

        return localizedName;
    }

    // 本地化敌人名称
    localizeEnemyName(enemy) {
        if (!enemy || !enemy.name) return 'Unknown Enemy';

        // 尝试完整名称翻译
        const fullTranslation = this.getTranslation(enemy.name);
        if (fullTranslation !== enemy.name) {
            return fullTranslation;
        }

        // 简单处理：直接查找敌人类型
        const enemyTypes = ['slime', 'goblin', 'skeleton', 'zombie', 'orc', 'dragon'];
        for (const type of enemyTypes) {
            if (enemy.name.toLowerCase().includes(type)) {
                return enemy.name.replace(new RegExp(type, 'gi'), this.getGameTerm(type));
            }
        }

        return enemy.name;
    }

    // 本地化物品名称
    localizeItemName(item) {
        if (!item || !item.name) return 'Unknown Item';

        // 尝试完整名称翻译
        const fullTranslation = this.getTranslation(item.name);
        if (fullTranslation !== item.name) {
            return fullTranslation;
        }

        // 检查物品类型
        if (item.type) {
            const typeName = this.getGameTerm(item.type);
            if (typeName !== item.type) {
                return `${typeName} ${item.name}`;
            }
        }

        return item.name;
    }

    // 格式化本地化消息
    formatMessage(messageTemplate, ...params) {
        // 简单的消息格式化，可以扩展为更复杂的模板引擎
        let message = messageTemplate;

        for (let i = 0; i < params.length; i++) {
            message = message.replace(`{${i}}`, params[i]);
        }

        return message;
    }
}

// 初始化本地化系统
const localizationSystem = new GameLocalizationSystem();

// 将本地化系统添加到全局作用域
window.LocalizationSystem = LocalizationSystem;
window.GameLocalizationSystem = GameLocalizationSystem;
window.localizationSystem = localizationSystem;

// 全局翻译函数
window.t = (key) => localizationSystem.getTranslation(key);
window.switchLanguage = (lang) => localizationSystem.switchLanguage(lang);
window.getCurrentLanguage = () => localizationSystem.getCurrentLanguage();
window.localizeWeapon = (weapon) => localizationSystem.localizeWeaponName(weapon);
window.localizeEnemy = (enemy) => localizationSystem.localizeEnemyName(enemy);
window.localizeItem = (item) => localizationSystem.localizeItemName(item);

// 便捷函数用于动态添加本地化元素
window.registerLocalizedString = (element, key) => localizationSystem.registerElement(element, key);

console.log("🚀 本地化系统已完全加载");