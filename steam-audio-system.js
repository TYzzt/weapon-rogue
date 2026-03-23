// ==================== Steam版音效系统增强 ====================
//
// 为Steam发布目标增强音效系统
// 添加更多音效和背景音乐
// 实现音效池管理和音乐循环播放

class SteamAudioSystem {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.musicTracks = {};
        this.soundEnabled = true;
        this.musicEnabled = true;
        this.masterVolume = 1.0;

        // 音效池，避免频繁创建Audio对象
        this.audioPool = new Map();
        this.activeSounds = new Set();

        // 音乐播放状态
        this.currentMusic = null;
        this.musicVolume = 0.5;
        this.soundVolume = 0.7;

        // 音效映射表
        this.soundMap = {
            // 基础音效
            'collect': 'assets/sounds/collect.mp3',
            'hurt': 'assets/sounds/hurt.mp3',
            'gameOver': 'assets/sounds/game_over.mp3',
            'victory': 'assets/sounds/victory.mp3',
            'weapon_pickup': 'assets/sounds/weapon_pickup.mp3',
            'attack': 'assets/sounds/attack.mp3',
            'level_up': 'assets/sounds/level_up.mp3',
            'hit': 'assets/sounds/hit.mp3',
            'enemy_death': 'assets/sounds/enemy_death.mp3',
            'heal': 'assets/sounds/heal.mp3',
            'menu_select': 'assets/sounds/menu_select.mp3',
            'skill_use': 'assets/sounds/skill_use.mp3',
            'potion_pickup': 'assets/sounds/potion_pickup.mp3',
            'boss_appear': 'assets/sounds/boss_appear.mp3',
            'critical_hit': 'assets/sounds/critical_hit.mp3',
            'combo_break': 'assets/sounds/combo_break.mp3',
            'relic_pickup': 'assets/sounds/relic_pickup.mp3',
            'teleport': 'assets/sounds/teleport.mp3',
            'shield_block': 'assets/sounds/shield_block.mp3',
            'magic_spell': 'assets/sounds/magic_spell.mp3',
            'bow_shoot': 'assets/sounds/bow_shoot.mp3',

            // 成就相关音效
            'achievement_unlock': 'assets/sounds/achievement_unlock.mp3',

            // 新增Steam版音效
            'weapon_equip': 'assets/sounds/weapon_equip.mp3',
            'elemental_impact': 'assets/sounds/elemental_impact.mp3',
            'burn_effect': 'assets/sounds/burn_effect.mp3',
            'freeze_effect': 'assets/sounds/freeze_effect.mp3',
            'stun_effect': 'assets/sounds/stun_effect.mp3',
            'poison_effect': 'assets/sounds/poison_effect.mp3',
            'teleport_strike': 'assets/sounds/teleport_strike.mp3',
            'chain_lightning': 'assets/sounds/chain_lightning.mp3',
            'damage_reflect': 'assets/sounds/damage_reflect.mp3',
            'level_milestone': 'assets/sounds/level_milestone.mp3',
            'combo_increase': 'assets/sounds/combo_increase.mp3',
            'boss_defeat': 'assets/sounds/boss_defeat.mp3',
            'special_item_drop': 'assets/sounds/special_item_drop.mp3',
            'player_revive': 'assets/sounds/player_revive.mp3',
            'environment_wind': 'assets/sounds/environment_wind.mp3',
            'environment_water': 'assets/sounds/environment_water.mp3',
            'environment_fire': 'assets/sounds/environment_fire.mp3',
            'environment_magic': 'assets/sounds/environment_magic.mp3'
        };

        // 音乐曲目映射表
        this.musicMap = {
            'main_theme': 'assets/music/main_theme.mp3',
            'battle_music': 'assets/music/battle_music.mp3',
            'exploration': 'assets/music/exploration.mp3',
            'boss_battle': 'assets/music/boss_battle.mp3',
            'level_complete': 'assets/music/level_complete.mp3',
            'game_over': 'assets/music/game_over.mp3',
            'victory_theme': 'assets/music/victory_theme.mp3',
            'calm_area': 'assets/music/calm_area.mp3',
            'tension_build': 'assets/music/tension_build.mp3',
            'achievement_hub': 'assets/music/achievement_hub.mp3'
        };

        // 初始化音频上下文
        this.init();
    }

    // 初始化音频系统
    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log('Steam版音效系统已初始化');

            // 预加载常用音效
            this.preloadCommonSounds();

            // 预加载背景音乐
            this.preloadCommonMusic();
        } catch (e) {
            console.warn('无法初始化Web Audio API，将使用简单音效:', e);
        }
    }

    // 预加载常用音效
    async preloadCommonSounds() {
        const commonSounds = [
            'collect', 'hurt', 'weapon_pickup', 'attack', 'level_up',
            'hit', 'enemy_death', 'heal', 'menu_select', 'skill_use',
            'achievement_unlock', 'level_milestone', 'combo_increase'
        ];

        for (const soundName of commonSounds) {
            if (this.soundMap[soundName]) {
                await this.loadSound(soundName, this.soundMap[soundName]);
            }
        }
    }

    // 预加载常用音乐
    async preloadCommonMusic() {
        const commonMusic = [
            'main_theme', 'battle_music', 'exploration', 'boss_battle'
        ];

        for (const musicName of commonMusic) {
            if (this.musicMap[musicName]) {
                await this.loadMusicTrack(musicName, this.musicMap[musicName]);
            }
        }
    }

    // 加载音效
    async loadSound(name, path) {
        try {
            if (this.audioContext) {
                const response = await fetch(path);
                if (!response.ok) throw new Error(`无法加载音频文件: ${path}`);

                const arrayBuffer = await response.arrayBuffer();
                const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

                this.sounds[name] = audioBuffer;
                console.log(`音效加载成功: ${name}`);
            }
        } catch (e) {
            console.warn(`音效加载失败，将使用程序生成的回退音效: ${name}`, e);
            this.createFallbackSound(name);
        }
    }

    // 加载音乐曲目
    async loadMusicTrack(name, path) {
        try {
            // 音乐使用Audio对象而非AudioBuffer，因为音乐通常是循环播放的长音频
            this.musicTracks[name] = path;
            console.log(`音乐曲目加载成功: ${name}`);
        } catch (e) {
            console.warn(`音乐曲目加载失败: ${name}`, e);
        }
    }

    // 创建回退音效（当音频文件不存在时使用程序生成的音效）
    createFallbackSound(name) {
        // 对不同类型的音效生成不同的回退声音
        let frequency, duration, type;

        switch (name) {
            case 'collect':
                frequency = 800; duration = 0.1; type = 'sine';
                break;
            case 'hurt':
                frequency = 150; duration = 0.3; type = 'sawtooth';
                break;
            case 'victory':
                frequency = [523.25, 659.25, 783.99]; duration = 0.5; type = 'sine';
                break;
            case 'weapon_pickup':
            case 'weapon_equip':
                frequency = 600; duration = 0.15; type = 'square';
                break;
            case 'attack':
                frequency = 300; duration = 0.1; type = 'triangle';
                break;
            case 'level_up':
            case 'level_milestone':
                frequency = [440, 554.37, 659.25]; duration = 0.4; type = 'sine';
                break;
            case 'hit':
                frequency = 400; duration = 0.05; type = 'square';
                break;
            case 'enemy_death':
                frequency = 200; duration = 0.2; type = 'sawtooth';
                break;
            case 'heal':
                frequency = 450; duration = 0.25; type = 'sine';
                break;
            case 'menu_select':
                frequency = 700; duration = 0.08; type = 'sine';
                break;
            case 'skill_use':
                frequency = [300, 400]; duration = 0.2; type = 'sawtooth';
                break;
            case 'achievement_unlock':
                frequency = [659.25, 783.99, 1046.50]; duration = 0.6; type = 'sine';
                break;
            case 'critical_hit':
                frequency = [800, 1000]; duration = 0.15; type = 'square';
                break;
            case 'elemental_impact':
                frequency = [200, 400, 600]; duration = 0.3; type = 'sawtooth';
                break;
            case 'burn_effect':
                frequency = 150; duration = 0.4; type = 'sawtooth';
                break;
            case 'freeze_effect':
                frequency = 300; duration = 0.2; type = 'sine';
                break;
            case 'stun_effect':
                frequency = 250; duration = 0.15; type = 'square';
                break;
            case 'poison_effect':
                frequency = 120; duration = 0.3; type = 'sawtooth';
                break;
            case 'teleport_strike':
                frequency = [400, 600, 800]; duration = 0.25; type = 'sine';
                break;
            case 'chain_lightning':
                frequency = [500, 700, 900]; duration = 0.2; type = 'square';
                break;
            case 'combo_increase':
                frequency = [600, 700, 800]; duration = 0.3; type = 'sine';
                break;
            default:
                frequency = 500; duration = 0.1; type = 'sine';
        }

        this.sounds[name] = { frequency, duration, type };
    }

    // 播放音效
    playSound(name, volume = 1.0) {
        // 如果音效关闭，直接返回
        if (!this.soundEnabled) return Promise.resolve();

        // 应用相对音量
        const effectiveVolume = volume * this.soundVolume * this.masterVolume;

        // 如果没有这个音效，先尝试加载
        if (!this.sounds[name]) {
            if (this.soundMap[name]) {
                this.loadSound(name, this.soundMap[name]);
            } else {
                this.createFallbackSound(name);
            }
        }

        if (this.audioContext && this.sounds[name] && typeof this.sounds[name] !== 'string') {
            return new Promise((resolve) => {
                try {
                    if (this.sounds[name] instanceof AudioBuffer) {
                        // 播放已加载的音频缓冲区
                        const source = this.audioContext.createBufferSource();
                        source.buffer = this.sounds[name];

                        const gainNode = this.audioContext.createGain();
                        gainNode.gain.value = effectiveVolume;
                        source.connect(gainNode);
                        gainNode.connect(this.audioContext.destination);

                        source.onended = () => {
                            resolve();
                        };

                        source.start(0);
                    } else if (typeof this.sounds[name] === 'object') {
                        // 播放程序生成的回退音效
                        this.playGeneratedSound(this.sounds[name], effectiveVolume);
                        resolve(); // 立即解析，因为生成音效是异步的
                    }
                } catch (e) {
                    console.warn(`播放音效失败: ${name}`, e);
                    resolve();
                }
            });
        } else {
            // 如果Web Audio API不可用，尝试使用简单的HTML5 Audio
            return this.fallbackPlaySound(name, effectiveVolume);
        }
    }

    // 播放程序生成的声音
    playGeneratedSound(soundConfig, volume = 1.0) {
        if (!this.audioContext) return;

        const { frequency, duration, type } = soundConfig;

        try {
            if (Array.isArray(frequency)) {
                // 播放多个频率的音效
                frequency.forEach((freq, idx) => {
                    setTimeout(() => {
                        this.playSingleTone(freq, duration, type, volume * (1 - idx * 0.2));
                    }, idx * 50);
                });
            } else {
                // 播放单一频率的音效
                this.playSingleTone(frequency, duration, type, volume);
            }
        } catch (e) {
            console.warn('播放程序生成音效失败:', e);
        }
    }

    // 播放单一音调
    playSingleTone(frequency, duration, type, volume) {
        if (!this.audioContext) return;

        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.type = type;
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        } catch (e) {
            console.warn('播放音调失败:', e);
        }
    }

    // 播放背景音乐
    async playMusic(name, volume = 0.5, loop = true) {
        if (!this.musicEnabled) return;

        const musicPath = this.musicMap[name];
        if (!musicPath) {
            console.warn(`音乐文件不存在: ${name}`);
            return;
        }

        // 暂停当前音乐（如果有）
        if (this.currentMusic) {
            this.currentMusic.pause();
        }

        try {
            this.currentMusic = new Audio(musicPath);
            this.currentMusic.volume = volume * this.musicVolume * this.masterVolume;
            this.currentMusic.loop = loop;

            // 尝试播放音乐
            const playPromise = this.currentMusic.play();

            if (playPromise !== undefined) {
                try {
                    await playPromise;
                    console.log(`音乐播放成功: ${name}`);
                } catch (e) {
                    console.warn('音乐播放被阻止（可能需要用户交互）:', e);
                    // 在某些浏览器中，需要用户交互才能播放音频
                    // 我们可以稍后在用户交互后尝试播放
                }
            }
        } catch (e) {
            console.warn('创建音乐播放器失败:', e);
        }
    }

    // 停止背景音乐
    stopMusic() {
        if (this.currentMusic) {
            this.currentMusic.pause();
            this.currentMusic = null;
        }
    }

    // 暂停背景音乐
    pauseMusic() {
        if (this.currentMusic) {
            this.currentMusic.pause();
        }
    }

    // 恢复背景音乐
    resumeMusic() {
        if (this.currentMusic) {
            this.currentMusic.play().catch(e => {
                console.warn('恢复音乐播放失败:', e);
            });
        }
    }

    // 简单回退播放音效（当Web Audio API不可用时）
    fallbackPlaySound(name, volume) {
        return new Promise((resolve) => {
            // 尝试使用简单的方法播放音效
            if ('Audio' in window) {
                const audioPath = this.soundMap[name];
                if (audioPath) {
                    const audio = new Audio(audioPath);
                    audio.volume = volume;

                    audio.onended = () => resolve();
                    audio.onerror = () => resolve();

                    audio.play().catch(e => {
                        // 静默失败
                        resolve();
                    });
                } else {
                    resolve();
                }
            } else {
                resolve();
            }
        });
    }

    // 根据游戏状态自动播放适当的音乐
    async playGameMusic(gameState) {
        if (!this.musicEnabled) return;

        let musicToPlay = 'exploration';
        let volume = 0.4;

        if (gameState === 'menu') {
            musicToPlay = 'main_theme';
            volume = 0.5;
        } else if (gameState === 'battle') {
            musicToPlay = 'battle_music';
            volume = 0.45;
        } else if (gameState === 'boss') {
            musicToPlay = 'boss_battle';
            volume = 0.5;
        } else if (gameState === 'level_up') {
            musicToPlay = 'level_complete';
            volume = 0.6;
            // 只播放一次，不循环
            await this.playMusic(musicToPlay, volume, false);
            return;
        } else if (gameState === 'game_over') {
            musicToPlay = 'game_over';
            volume = 0.5;
            await this.playMusic(musicToPlay, volume, false);
            return;
        } else if (gameState === 'victory') {
            musicToPlay = 'victory_theme';
            volume = 0.6;
            await this.playMusic(musicToPlay, volume, false);
            return;
        } else if (gameState === 'achievement') {
            musicToPlay = 'achievement_hub';
            volume = 0.4;
        }

        await this.playMusic(musicToPlay, volume, true);
    }

    // 设置音效开关
    setSoundEnabled(enabled) {
        this.soundEnabled = enabled;
        localStorage.setItem('soundEnabled', enabled);
    }

    // 设置音乐开关
    setMusicEnabled(enabled) {
        this.musicEnabled = enabled;
        localStorage.setItem('musicEnabled', enabled);
        if (!enabled && this.currentMusic) {
            this.stopMusic();
        }
    }

    // 设置主音量
    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
    }

    // 设置音效音量
    setSoundVolume(volume) {
        this.soundVolume = Math.max(0, Math.min(1, volume));
    }

    // 设置音乐音量
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.currentMusic) {
            this.currentMusic.volume = this.musicVolume * this.masterVolume;
        }
    }

    // 获取音效/音乐状态
    isSoundEnabled() {
        return this.soundEnabled;
    }

    isMusicEnabled() {
        return this.musicEnabled;
    }

    // 销毁音频资源
    destroy() {
        if (this.currentMusic) {
            this.currentMusic.pause();
            this.currentMusic = null;
        }

        if (this.audioContext) {
            this.audioContext.close();
        }
    }

    // 播放特定场景的音效
    async playSceneSound(scene, params = {}) {
        switch (scene) {
            case 'weapon_change':
                await this.playSound('weapon_equip', params.volume || 1.0);
                break;
            case 'elemental_attack':
                await this.playSound('elemental_impact', params.volume || 1.0);
                if (params.element) {
                    await this.playSound(`${params.element}_effect`, params.volume || 0.8);
                }
                break;
            case 'level_milestone':
                await this.playSound('level_milestone', params.volume || 1.0);
                break;
            case 'combo_increased':
                await this.playSound('combo_increase', params.volume || 0.7);
                break;
            case 'achievement_unlocked':
                await this.playSound('achievement_unlock', params.volume || 1.0);
                break;
            case 'boss_appears':
                await this.playSound('boss_appear', params.volume || 1.0);
                break;
            case 'boss_defeated':
                await this.playSound('boss_defeat', params.volume || 1.0);
                break;
            case 'special_item_dropped':
                await this.playSound('special_item_drop', params.volume || 0.9);
                break;
            case 'player_revived':
                await this.playSound('player_revive', params.volume || 1.0);
                break;
            default:
                console.log(`未知场景: ${scene}`);
        }
    }
}

// 创建Steam版音效系统实例
const steamAudioSystem = new SteamAudioSystem();

// 页面加载完成后初始化音效系统
document.addEventListener('DOMContentLoaded', () => {
    // 从localStorage加载音频设置
    const savedSound = localStorage.getItem('soundEnabled');
    const savedMusic = localStorage.getItem('musicEnabled');

    if (savedSound !== null) {
        steamAudioSystem.setSoundEnabled(savedSound === 'true');
    }

    if (savedMusic !== null) {
        steamAudioSystem.setMusicEnabled(savedMusic === 'true');
    }

    console.log("Steam版音效系统已准备就绪");
});

// 与现有系统的集成
if (typeof enhancedAudioManager !== 'undefined') {
    // 如果已有增强音效管理器，将新系统整合进去
    window.steamAudioSystem = steamAudioSystem;
} else {
    // 否则使用新系统
    window.enhancedAudioManager = steamAudioSystem;
}

console.log("Steam版音效系统已完全加载");