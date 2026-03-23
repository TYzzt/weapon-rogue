/**
 * 统一游戏入口和核心机制
 * 集成所有游戏功能模块，避免全局命名空间冲突
 */

// 创建游戏命名空间以避免全局污染
var RogueGame = RogueGame || {};

(function() {
    'use strict';

    // 游戏状态管理
    this.state = {
        player: {
            x: 400,
            y: 300,
            size: 30,
            speed: 5,
            hp: 100,
            maxHp: 100,
            weapon: null,
            isPlaying: false,
            isGameOver: false,
            score: 0,
            maxCombo: 0,
            currentCombo: 0,
            relics: [],
            skillsUsed: { Q: 0, W: 0, E: 0, R: 0 }
        },
        level: 1,
        kills: 0,
        enemies: [],
        items: [],
        mouseX: 400,
        mouseY: 300,
        enemySpawnTimer: 0,
        enemySpawnRate: 2000,
        combatLog: [],
        startTime: null,
        sessionTime: 0,
        highestLevel: 1,
        totalKills: 0,
        totalGames: 1,
        winCount: 0,
        highScores: [],
        weaponStats: {},
        totalPlayTime: 0,
        gamesPlayed: 0,
        totalDamageDealt: 0,
        totalDamageTaken: 0,
        achievementCount: 0,
        regionsDiscovered: 0,
        modesAttempted: 0,
        secretFound: false,
        easterEggsFound: 0,
        collectedCommonWeapons: 0,
        legendaryWeaponsObtained: 0,
        mythicWeaponsObtained: 0,
        rarestWeaponObtained: { rarity: 0 },
        currentKillStreak: 0,
        maxSingleHitDamage: 0,
        // 特殊事件状态
        homeEnemySurge: false,
        officeEnemySurge: false,
        quantumReality: false,
        toolEmpowerment: 1.0
    };

    // 模块注册系统
    this.modules = {};

    // 注册模块的方法
    this.registerModule = function(name, module) {
        if (this.modules[name]) {
            console.warn(`模块 ${name} 已存在，正在覆盖`);
        }
        this.modules[name] = module;
        if (module.init) {
            module.init(this);
        }
        console.log(`模块 ${name} 已注册`);
    };

    // 获取模块的方法
    this.getModule = function(name) {
        return this.modules[name];
    };

    // 获取游戏状态的方法
    this.getState = function() {
        return this.state;
    };

    // 更新游戏状态的方法
    this.updateState = function(newState) {
        this.deepMerge(this.state, newState);
    };

    // 深度合并对象
    this.deepMerge = function(target, source) {
        for (let key in source) {
            if (source.hasOwnProperty(key)) {
                if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
                    if (!target[key]) target[key] = {};
                    this.deepMerge(target[key], source[key]);
                } else {
                    target[key] = source[key];
                }
            }
        }
    };

    // 主游戏循环
    this.gameLoop = function() {
        if (!this.state.player.isPlaying || this.state.player.isGameOver) return;

        const currentTime = Date.now();
        const deltaTime = currentTime - (this.lastFrameTime || currentTime);
        this.lastFrameTime = currentTime;

        // 更新所有模块
        for (let moduleName in this.modules) {
            const module = this.modules[moduleName];
            if (module.update) {
                module.update(deltaTime, this.state);
            }
        }

        // 绘制游戏画面
        this.render();

        // 继续下一帧
        requestAnimationFrame(() => this.gameLoop());
    };

    // 渲染游戏画面
    this.render = function() {
        if (typeof ctx === 'undefined') return;

        // 清除画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 让所有模块绘制自己
        for (let moduleName in this.modules) {
            const module = this.modules[moduleName];
            if (module.render) {
                module.render(ctx, this.state);
            }
        }
    };

    // 开始游戏
    this.startGame = function() {
        this.state.player.isPlaying = true;
        this.state.player.isGameOver = false;
        this.state.startTime = Date.now();

        // 通知所有模块游戏开始
        for (let moduleName in this.modules) {
            const module = this.modules[moduleName];
            if (module.onStart) {
                module.onStart(this.state);
            }
        }

        this.gameLoop();
        console.log('游戏开始');
    };

    // 结束游戏
    this.endGame = function() {
        this.state.player.isPlaying = false;
        this.state.player.isGameOver = true;

        // 通知所有模块游戏结束
        for (let moduleName in this.modules) {
            const module = this.modules[moduleName];
            if (module.onEnd) {
                module.onEnd(this.state);
            }
        }

        console.log('游戏结束');
    };

    // 初始化完成标志
    this.initialized = true;
    console.log('RogueGame 系统初始化完成');

}).call(RogueGame);

// 全局访问点，仅此一处污染全局命名空间
window.RogueGame = RogueGame;

// 为向后兼容提供的全局函数（使用安全包装）
if (typeof window.startGame === 'undefined') {
    window.startGame = function() {
        if (window.RogueGame && typeof window.RogueGame.startGame === 'function') {
            window.RogueGame.startGame();
        } else {
            console.error('RogueGame 系统尚未初始化');
        }
    };
}

if (typeof window.endGame === 'undefined') {
    window.endGame = function() {
        if (window.RogueGame && typeof window.RogueGame.endGame === 'function') {
            window.RogueGame.endGame();
        } else {
            console.error('RogueGame 系统尚未初始化');
        }
    };
}

console.log('🎮 统一游戏系统已加载');