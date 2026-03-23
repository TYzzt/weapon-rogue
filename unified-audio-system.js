// ==================== 统一音频系统 ====================
//
// 本系统合并了以下功能：
// 1. 基础音效系统 (audio-system.js)
// 2. 增强版音效管理器 (enhanced-audio.js)
// 3. Steam版音效系统 (steam-audio-system.js)
//
// 特点：
// - 保持所有现有音频功能
// - 解决命名冲突
// - 使用单一的 unifiedAudioManager 实例
// - 保持与 game.js 的兼容性
// - 添加适当的注释说明功能模块

class UnifiedAudioSystem {
    constructor() {
        // 基础设置
        this.isEnabled = true;
        this.musicEnabled = true;
        this.soundEnabled = true;
        this.masterVolume = 1.0;
        this.musicVolume = 0.6;
        this.soundVolume = 0.8;

        // Web Audio Context
        this.audioContext = null;

        // 音效和音乐数据
        this.sounds = {};
        this.musicTracks = {};

        // 播放状态
        this.currentMusic = null;
        this.currentSounds = new Set(); // 正在播放的音效

        // 音效池，避免频繁创建Audio对象
        this.audioPool = new Map();
        this.activeSounds = new Set();

        // 音效映射表 (结合了三个系统的音效)
        this.soundMap = {
            // 基础音效 (来自 audio-system.js)
            'attack': { type: 'synth', params: { frequency: 220, waveform: 'square', duration: 0.1 } },
            'hit': { type: 'synth', params: { frequency: 180, waveform: 'sawtooth', duration: 0.05 } },
            'critical_hit': { type: 'synth', params: { frequency: 440, waveform: 'sine', duration: 0.2, detune: 10 } },
            'weapon_pickup': { type: 'synth', params: { frequency: 523.25, waveform: 'triangle', duration: 0.3 } }, // C5
            'weapon_change': { type: 'synth', params: { frequency: 392.00, waveform: 'sine', duration: 0.15 } }, // G4
            'potion_use': { type: 'synth', params: { frequency: 659.25, waveform: 'sine', duration: 0.2, detune: 5 } }, // E5
            'treasure_open': { type: 'synth', params: { frequency: 783.99, waveform: 'sine', duration: 0.4, detune: 15 } }, // G5
            'player_hurt': { type: 'synth', params: { frequency: 150, waveform: 'sawtooth', duration: 0.15, detune: -10 } },
            'player_heal': { type: 'synth', params: { frequency: 659.25, waveform: 'sine', duration: 0.25 } }, // E5
            'player_levelup': {
                type: 'synth',
                params: { frequency: 523.25, waveform: 'sine', duration: 0.1, detune: 0 },
                extra: [{ frequency: 659.25, duration: 0.1, detune: 0 },
                       { frequency: 783.99, duration: 0.2, detune: 0 }]
            }, // C5 -> E5 -> G5
            'step': { type: 'noise', params: { type: 'white', duration: 0.05 } },
            'door_open': { type: 'synth', params: { frequency: 220, waveform: 'sawtooth', duration: 0.5 } },
            'victory': {
                type: 'synth',
                params: { frequency: 523.25, duration: 0.2 },
                extra: [{ frequency: 659.25, duration: 0.2 },
                       { frequency: 783.99, duration: 0.4 }]
            }, // C5 -> E5 -> G5
            'defeat': { type: 'synth', params: { frequency: 110, waveform: 'sawtooth', duration: 0.8, detune: -5 } }, // A2
            'menu_select': { type: 'synth', params: { frequency: 880, waveform: 'sine', duration: 0.05 } }, // A5
            'menu_back': { type: 'synth', params: { frequency: 659.25, waveform: 'sine', duration: 0.08 } }, // E5
            'notification': { type: 'synth', params: { frequency: 1046.50, waveform: 'sine', duration: 0.03 } }, // C6
            'achievement_unlock': {
                type: 'synth',
                params: { frequency: 1318.51, duration: 0.05 },
                extra: [{ frequency: 987.77, duration: 0.1 },
                       { frequency: 1174.66, duration: 0.15 },
                       { frequency: 1318.51, duration: 0.2 }]
            }, // G6 -> B5 -> Bb5 -> G6

            // 扩展音效 (来自 enhanced-audio.js 和 steam-audio-system.js)
            'collect': 'assets/sounds/collect.mp3',
            'hurt': 'assets/sounds/hurt.mp3',
            'gameOver': 'assets/sounds/game_over.mp3',
            'victory': 'assets/sounds/victory.mp3',
            'level_up': 'assets/sounds/level_up.mp3',
            'enemy_death': 'assets/sounds/enemy_death.mp3',
            'heal': 'assets/sounds/heal.mp3',
            'skill_use': 'assets/sounds/skill_use.mp3',
            'potion_pickup': 'assets/sounds/potion_pickup.mp3',
            'boss_appear': 'assets/sounds/boss_appear.mp3',
            'combo_break': 'assets/sounds/combo_break.mp3',
            'relic_pickup': 'assets/sounds/relic_pickup.mp3',
            'teleport': 'assets/sounds/teleport.mp3',
            'shield_block': 'assets/sounds/shield_block.mp3',
            'magic_spell': 'assets/sounds/magic_spell.mp3',
            'bow_shoot': 'assets/sounds/bow_shoot.mp3',
            'coin_pickup': 'assets/sounds/coin_pickup.mp3',
            'powerup': 'assets/sounds/powerup.mp3',
            'damage_taken': 'assets/sounds/damage_taken.mp3',
            'combo_increase': 'assets/sounds/combo_increase.mp3',
            'item_drop': 'assets/sounds/item_drop.mp3',
            'footstep': 'assets/sounds/footstep.mp3',
            'ambient_loop': 'assets/sounds/ambient_loop.mp3',

            // Steam版特有音效
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

        // 增强功能设置
        this.spatialAudioEnabled = false; // 3D音效开关
        this.audioProfiles = {
            'balanced': { master: 0.7, music: 0.6, sound: 0.8 },
            'music_focused': { master: 0.7, music: 0.8, sound: 0.5 },
            'effects_focused': { master: 0.7, music: 0.5, sound: 0.8 },
            'quiet': { master: 0.4, music: 0.4, sound: 0.4 }
        };

        // 当前游戏状态（用于动态混音）
        this.gameState = null;

        this.init();
        console.log("🎵 统一音频系统已初始化");
    }

    // 初始化音频系统
    init() {
        this.setupAudioContext();
        this.loadDefaultSounds();
        this.initEnhancedFeatures();
        this.loadUserPreferences();
        console.log("🔊 统一音频系统准备就绪");
    }

    // 设置音频上下文
    setupAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log('Web Audio API 已初始化');
        } catch (e) {
            console.warn('无法初始化Web Audio API:', e);
        }

        // 模拟音频可用性检测
        this.isAudioSupported = !!this.audioContext;
    }

    // 加载默认音效 (合成音效部分)
    loadDefaultSounds() {
        // 音乐轨道定义
        this.musicTracks = {
            'main_theme': {
                title: '主菜单主题',
                duration: 120000, // 2分钟
                loop: true,
                mood: 'epic'
            },
            'battle_music': {
                title: '战斗音乐',
                duration: 180000, // 3分钟
                loop: true,
                mood: 'intense'
            },
            'exploration': {
                title: '探索音乐',
                duration: 240000, // 4分钟
                loop: true,
                mood: 'mysterious'
            },
            'boss_battle': {
                title: 'Boss战音乐',
                duration: 200000, // 稍长一些
                loop: true,
                mood: 'dramatic'
            },
            'victory_theme': {
                title: '胜利主题',
                duration: 30000, // 30秒
                loop: false,
                mood: 'triumphant'
            },
            'defeat_theme': {
                title: '失败主题',
                duration: 45000, // 45秒
                loop: false,
                mood: 'sad'
            }
        };

        // 预加载常用音效以减少延迟
        this.setupSoundPooling();
    }

    // 初始化增强功能
    initEnhancedFeatures() {
        // 动态音乐混合
        this.setupDynamicMixing();

        // 音效池管理
        this.setupSoundPooling();

        // 音频分析功能
        this.setupAudioAnalysis();
    }

    // 设置动态混音
    setupDynamicMixing() {
        // 根据游戏状态动态调整音乐和音效的平衡
        this.dynamicMixHandler = setInterval(() => {
            if (!this.isEnabled) return;

            // 在战斗激烈时降低音乐音量，突出音效
            if (this.gameState && this.gameState.inIntenseCombat) {
                this.setMusicVolume(this.musicVolume * 0.7);
                this.setSoundVolume(this.soundVolume * 1.2);
            } else {
                // 恢复正常音量
                this.setMusicVolume(this.musicVolume);
                this.setSoundVolume(this.soundVolume);
            }
        }, 5000); // 每5秒检查一次
    }

    // 设置音效池
    setupSoundPooling() {
        // 预加载常用的音效以减少延迟
        this.soundPool = new Map();

        // 预热常用音效
        const commonSounds = [
            'attack', 'hit', 'weapon_pickup', 'potion_use', 'player_hurt',
            'collect', 'level_up', 'menu_select', 'skill_use', 'achievement_unlock',
            'weapon_equip', 'elemental_impact', 'level_milestone', 'combo_increase'
        ];

        for (const soundId of commonSounds) {
            this.preloadSound(soundId);
        }
    }

    // 预加载音效
    preloadSound(soundId) {
        // 在真实实现中，这里会预加载音频资源
        // 模拟预加载
        if (this.soundMap[soundId] || this.sounds[soundId]) {
            this.soundPool.set(soundId, true);
            console.log(`📦 预加载音效: ${soundId}`);
        }
    }

    // 设置音频分析
    setupAudioAnalysis() {
        // 为音效添加更多参数，如3D位置、距离衰减等
        this.audioAnalyzer = {
            calculateDistanceAttenuation: (distance, maxDistance) => {
                // 简单的距离衰减公式
                return Math.max(0, 1 - (distance / maxDistance));
            },

            applyPitchShift: (soundId, pitchModifier) => {
                // 模拟音调变化
                console.log(`🎵 音调变化应用于 "${soundId}": ${pitchModifier}x`);
            }
        };
    }

    // 加载外部音效文件
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
    async playSound(soundId, customVolume = null) {
        if (!this.isEnabled || !this.soundEnabled) {
            return false;
        }

        // 应用相对音量
        const volume = customVolume !== null ? customVolume : this.soundVolume;
        const effectiveVolume = volume * this.masterVolume;

        // 检查是否为合成音效
        if (this.soundMap[soundId] && typeof this.soundMap[soundId] === 'object' && this.soundMap[soundId].type === 'synth') {
            // 播放合成音效（来自 audio-system.js）
            const sound = this.soundMap[soundId];
            return this.playSynthesizedSound(soundId, sound, effectiveVolume);
        }

        // 如果没有这个音效，先尝试加载
        if (!this.sounds[soundId]) {
            if (this.soundMap[soundId] && typeof this.soundMap[soundId] === 'string') {
                await this.loadSound(soundId, this.soundMap[soundId]);
            } else {
                this.createFallbackSound(soundId);
            }
        }

        // 播放外部音效或回退音效
        if (this.audioContext && this.sounds[soundId] && typeof this.sounds[soundId] !== 'string') {
            return new Promise((resolve) => {
                try {
                    if (this.sounds[soundId] instanceof AudioBuffer) {
                        // 播放已加载的音频缓冲区
                        const source = this.audioContext.createBufferSource();
                        source.buffer = this.sounds[soundId];

                        const gainNode = this.audioContext.createGain();
                        gainNode.gain.value = effectiveVolume;
                        source.connect(gainNode);
                        gainNode.connect(this.audioContext.destination);

                        source.onended = () => {
                            this.currentSounds.delete(soundId);
                            resolve();
                        };

                        // 模拟音效正在播放
                        this.currentSounds.add(soundId);
                        source.start(0);
                    } else if (typeof this.sounds[soundId] === 'object') {
                        // 播放程序生成的回退音效
                        this.playGeneratedSound(this.sounds[soundId], effectiveVolume);

                        // 模拟音效正在播放
                        this.currentSounds.add(soundId);

                        // 计算持续时间后移除播放中的音效
                        const duration = Array.isArray(this.sounds[soundId].frequency) ?
                                       this.sounds[soundId].duration :
                                       this.sounds[soundId].duration;

                        setTimeout(() => {
                            this.currentSounds.delete(soundId);
                            resolve();
                        }, duration * 1000);
                    }
                } catch (e) {
                    console.warn(`播放音效失败: ${soundId}`, e);
                    this.currentSounds.delete(soundId);
                    resolve();
                }
            });
        } else {
            // 如果Web Audio API不可用，尝试使用简单的HTML5 Audio
            return this.fallbackPlaySound(soundId, effectiveVolume);
        }

        return true;
    }

    // 播放合成音效 (来自 audio-system.js)
    playSynthesizedSound(soundId, sound, effectiveVolume) {
        if (!this.isEnabled || !this.soundEnabled) {
            return false;
        }

        if (sound.type === 'synth' || sound.type === 'noise') {
            // 模拟播放音效
            console.log(`🔊 播放合成音效: ${soundId} (音量: ${effectiveVolume})`);

            // 模拟音效正在播放
            this.currentSounds.add(soundId);

            // 移除播放完成的音效
            const duration = sound.params?.duration || 0.2;
            setTimeout(() => {
                this.currentSounds.delete(soundId);
            }, duration * 1000);

            return true;
        }

        return false;
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
    async playMusic(musicId, loop = true) {
        if (!this.isEnabled || !this.musicEnabled) {
            return false;
        }

        // 检查是否为内部定义的音乐轨道
        const internalTrack = this.musicTracks[musicId];
        if (internalTrack && typeof internalTrack === 'object') {
            // 播放内部定义的音乐（合成音乐）
            return this.playSynthesizedMusic(musicId, internalTrack, loop);
        }

        const musicPath = this.musicMap[musicId];
        if (!musicPath) {
            console.warn(`音乐 "${musicId}" 未定义`);
            return false;
        }

        // 停止当前音乐
        this.stopMusic();

        try {
            this.currentMusic = new Audio(musicPath);
            this.currentMusic.volume = this.musicVolume * this.masterVolume;
            this.currentMusic.loop = loop;

            // 记录当前播放的音乐
            this.currentMusic._musicId = musicId;
            this.currentMusic._loop = loop;

            // 尝试播放音乐
            const playPromise = this.currentMusic.play();

            if (playPromise !== undefined) {
                try {
                    await playPromise;
                    console.log(`🎶 播放音乐: ${musicId} (循环: ${loop})`);
                } catch (e) {
                    console.warn('音乐播放被阻止（可能需要用户交互）:', e);
                }
            } else {
                console.log(`🎶 播放音乐: ${musicId} (循环: ${loop})`);
            }
        } catch (e) {
            console.warn('创建音乐播放器失败:', e);
        }

        return true;
    }

    // 播放合成音乐 (来自 audio-system.js)
    playSynthesizedMusic(musicId, track, loop) {
        if (!this.isEnabled || !this.musicEnabled) {
            return false;
        }

        // 停止当前音乐
        this.stopMusic();

        // 模拟播放音乐
        console.log(`🎶 播放合成音乐: ${track.title} (循环: ${loop})`);

        // 记录当前播放的音乐
        this.currentMusic = {
            id: musicId,
            track: track,
            startTime: Date.now(),
            loop: loop
        };

        // 模拟音乐播放过程
        const duration = track.duration;
        const playbackTimeout = setTimeout(() => {
            if (this.currentMusic && this.currentMusic.id === musicId) {
                if (loop) {
                    // 重新播放循环音乐
                    this.playSynthesizedMusic(musicId, track, true);
                } else {
                    // 音乐播放完毕
                    this.currentMusic = null;
                    console.log(`🎶 音乐 "${track.title}" 播放完毕`);
                }
            }
        }, duration);

        // 存储超时ID以便后续可以取消
        this.currentMusic.timeoutId = playbackTimeout;

        return true;
    }

    // 停止音乐
    stopMusic() {
        if (this.currentMusic) {
            if (this.currentMusic instanceof Audio) {
                this.currentMusic.pause();
            } else if (this.currentMusic.timeoutId) {
                clearTimeout(this.currentMusic.timeoutId);
            }
            this.currentMusic = null;
            console.log("⏹️ 音乐已停止");
        }
    }

    // 暂停音乐
    pauseMusic() {
        if (this.currentMusic && this.currentMusic instanceof Audio) {
            this.currentMusic.pause();
            console.log("⏸️ 音乐已暂停");
        } else if (this.currentMusic && this.currentMusic.timeoutId) {
            clearTimeout(this.currentMusic.timeoutId);

            // 计算剩余播放时间
            const elapsedTime = Date.now() - this.currentMusic.startTime;
            const remainingTime = this.currentMusic.track.duration - elapsedTime;

            this.currentMusic.paused = true;
            this.currentMusic.remainingTime = remainingTime;

            console.log("⏸️ 音乐已暂停");
        }
    }

    // 恢复音乐
    resumeMusic() {
        if (this.currentMusic && this.currentMusic.paused && this.currentMusic.remainingTime > 0) {
            // 重新设置超时以完成播放
            const playbackTimeout = setTimeout(() => {
                if (this.currentMusic && this.currentMusic.id === this.currentMusic.id) {
                    if (this.currentMusic.loop) {
                        this.playMusic(this.currentMusic.id, true);
                    } else {
                        this.currentMusic = null;
                        console.log(`🎶 音乐播放完毕`);
                    }
                }
            }, this.currentMusic.remainingTime);

            this.currentMusic.timeoutId = playbackTimeout;
            this.currentMusic.paused = false;

            console.log("▶️ 音乐已恢复");
        } else if (this.currentMusic && this.currentMusic instanceof Audio) {
            this.currentMusic.play().catch(e => {
                console.warn('恢复音乐播放失败:', e);
            });
            console.log("▶️ 音乐已恢复");
        }
    }

    // 带位置的音效播放（模拟3D音效）
    playSpatialSound(soundId, position = { x: 0, y: 0 }) {
        if (!this.spatialAudioEnabled) {
            return this.playSound(soundId);
        }

        // 在真实环境中，这将使用Web Audio API的空间化功能
        // 计算相对于玩家位置的音效距离和方向
        const playerPos = this.gameState ? { x: this.gameState.player?.x || 0, y: this.gameState.player?.y || 0 } : { x: 0, y: 0 };

        const dx = position.x - playerPos.x;
        const dy = position.y - playerPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // 计算衰减后的声音大小
        const attenuation = this.audioAnalyzer.calculateDistanceAttenuation(distance, 500); // 最大距离500像素
        const effectiveVolume = this.soundVolume * attenuation;

        console.log(`📍 3D音效 "${soundId}" 从位置 (${position.x}, ${position.y}) 播放, 距离: ${distance.toFixed(2)}, 音量: ${effectiveVolume.toFixed(2)}`);

        return this.playSound(soundId, effectiveVolume);
    }

    // 设置总体音量
    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        console.log(`🔊 主音量设置为: ${this.masterVolume}`);
        this.updateUserPreferences();
    }

    // 设置音乐音量
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        console.log(`🎶 音乐音量设置为: ${this.musicVolume}`);
        if (this.currentMusic && this.currentMusic instanceof Audio) {
            this.currentMusic.volume = this.musicVolume * this.masterVolume;
        }
        this.updateUserPreferences();
    }

    // 设置音效音量
    setSoundVolume(volume) {
        this.soundVolume = Math.max(0, Math.min(1, volume));
        console.log(`🔊 音效音量设置为: ${this.soundVolume}`);
        this.updateUserPreferences();
    }

    // 启用/禁用音效
    setSoundEnabled(enabled) {
        this.soundEnabled = enabled;
        console.log(`🔊 音效已${enabled ? '启用' : '禁用'}`);
        this.updateUserPreferences();
    }

    // 启用/禁用音乐
    setMusicEnabled(enabled) {
        this.musicEnabled = enabled;
        if (!enabled) {
            this.stopMusic();
        }
        console.log(`🎶 音乐已${enabled ? '启用' : '禁用'}`);
        this.updateUserPreferences();
    }

    // 启用/禁用整个音频系统
    setEnabled(enabled) {
        this.isEnabled = enabled;
        if (!enabled) {
            this.stopMusic();
            // 停止所有音效（如果有正在播放的话）
        }
        console.log(`🎵 音频系统已${enabled ? '启用' : '禁用'}`);
        this.updateUserPreferences();
    }

    // 应用音频配置
    applyAudioProfile(profileName) {
        const profile = this.audioProfiles[profileName];
        if (!profile) {
            console.warn(`音频配置 "${profileName}" 不存在`);
            return false;
        }

        this.setMasterVolume(profile.master);
        this.setMusicVolume(profile.music);
        this.setSoundVolume(profile.sound);

        console.log(`🎚️ 应用音频配置: ${profileName}`);
        return true;
    }

    // 启用/禁用空间音效
    setSpatialAudioEnabled(enabled) {
        this.spatialAudioEnabled = enabled;
        console.log(`🗺️ 空间音效已${enabled ? '启用' : '禁用'}`);
        this.updateUserPreferences();
    }

    // 添加环境音效
    addAmbientTrack(trackName, config) {
        this.musicTracks[trackName] = {
            title: config.title || trackName,
            duration: config.duration || 180000,
            loop: true,
            mood: 'ambient',
            type: 'environmental',
            priority: config.priority || 'low'
        };

        console.log(`🌿 添加环境音轨: ${trackName}`);
    }

    // 获取推荐的音乐（基于游戏状态）
    getRecommendedMusic() {
        if (this.gameState) {
            if (this.gameState.isGameOver) return 'defeat_theme';
            if (this.gameState.hasWon) return 'victory_theme';
            if (this.gameState.inBossFight) return 'boss_battle';
            if (this.gameState.inCombat) return 'battle_music';
            if (this.gameState.onMainMenu) return 'main_theme';
        }
        return 'exploration';
    }

    // 自动播放推荐音乐
    autoPlayRecommendedMusic() {
        const recommended = this.getRecommendedMusic();
        return this.playMusic(recommended);
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
            await this.playMusic(musicToPlay, false);
            return;
        } else if (gameState === 'game_over') {
            musicToPlay = 'game_over';
            volume = 0.5;
            await this.playMusic(musicToPlay, false);
            return;
        } else if (gameState === 'victory') {
            musicToPlay = 'victory_theme';
            volume = 0.6;
            await this.playMusic(musicToPlay, false);
            return;
        } else if (gameState === 'achievement') {
            musicToPlay = 'achievement_hub';
            volume = 0.4;
        }

        await this.playMusic(musicToPlay, true);
        this.setMusicVolume(volume);
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

    // 简单回退播放音效（当Web Audio API不可用时）
    fallbackPlaySound(name, volume) {
        return new Promise((resolve) => {
            // 尝试使用简单的方法播放音效
            if ('Audio' in window) {
                const audioPath = this.soundMap[name];
                if (audioPath && typeof audioPath === 'string') {
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

    // 获取当前播放状态
    getPlaybackStatus() {
        return {
            isEnabled: this.isEnabled,
            musicEnabled: this.musicEnabled,
            soundEnabled: this.soundEnabled,
            currentMusic: this.currentMusic ? {
                id: this.currentMusic.id || (this.currentMusic._musicId),
                title: this.musicTracks[this.currentMusic.id]?.title || (this.musicMap[this.currentMusic._musicId]),
                elapsed: Date.now() - (this.currentMusic.startTime || 0),
                duration: this.musicTracks[this.currentMusic.id]?.duration || 0,
                loop: this.currentMusic.loop || this.currentMusic._loop || false,
                paused: this.currentMusic.paused || false
            } : null,
            playingSounds: Array.from(this.currentSounds),
            volumes: {
                master: this.masterVolume,
                music: this.musicVolume,
                sound: this.soundVolume
            }
        };
    }

    // 获取可用的音效列表
    getAvailableSounds() {
        return [...Object.keys(this.soundMap), ...Object.keys(this.sounds)];
    }

    // 获取可用的音乐列表
    getAvailableMusic() {
        return [...Object.keys(this.musicMap), ...Object.keys(this.musicTracks)];
    }

    // 播放适合当前情境的音乐
    playSituationalMusic(context) {
        let musicId;

        switch (context) {
            case 'main_menu':
                musicId = 'main_theme';
                break;
            case 'battle':
            case 'combat':
                musicId = 'battle_music';
                break;
            case 'exploration':
            case 'level_transition':
                musicId = 'exploration';
                break;
            case 'boss_fight':
                musicId = 'boss_battle';
                break;
            case 'victory':
                musicId = 'victory_theme';
                break;
            case 'defeat':
            case 'game_over':
                musicId = 'defeat_theme';
                break;
            case 'achievement':
                // 播放音效而不是音乐
                this.playSound('achievement_unlock');
                return true;
            default:
                // 根据当前游戏状态选择适当的音乐
                if (this.gameState) {
                    if (this.gameState.inBattle) {
                        musicId = 'battle_music';
                    } else if (this.gameState.currentLevel % 5 === 0) {
                        // Boss关卡
                        musicId = 'boss_battle';
                    } else {
                        musicId = 'exploration';
                    }
                } else {
                    musicId = 'main_theme';
                }
        }

        return this.playMusic(musicId);
    }

    // 加载用户偏好设置
    loadUserPreferences() {
        try {
            const savedEnabled = localStorage.getItem('audioEnabled');
            const savedMusicEnabled = localStorage.getItem('musicEnabled');
            const savedSoundEnabled = localStorage.getItem('soundEnabled');
            const savedMasterVolume = localStorage.getItem('masterVolume');
            const savedMusicVolume = localStorage.getItem('musicVolume');
            const savedSoundVolume = localStorage.getItem('soundVolume');

            if (savedEnabled !== null) this.isEnabled = savedEnabled === 'true';
            if (savedMusicEnabled !== null) this.musicEnabled = savedMusicEnabled === 'true';
            if (savedSoundEnabled !== null) this.soundEnabled = savedSoundEnabled === 'true';
            if (savedMasterVolume !== null) this.masterVolume = parseFloat(savedMasterVolume);
            if (savedMusicVolume !== null) this.musicVolume = parseFloat(savedMusicVolume);
            if (savedSoundVolume !== null) this.soundVolume = parseFloat(savedSoundVolume);

            console.log("🎧 已加载用户音频偏好设置");
        } catch (error) {
            console.warn("⚠️ 加载音频偏好设置失败:", error);
            // 使用默认设置
            this.resetToDefaults();
        }
    }

    // 更新用户偏好设置
    updateUserPreferences() {
        try {
            localStorage.setItem('audioEnabled', this.isEnabled);
            localStorage.setItem('musicEnabled', this.musicEnabled);
            localStorage.setItem('soundEnabled', this.soundEnabled);
            localStorage.setItem('masterVolume', this.masterVolume.toString());
            localStorage.setItem('musicVolume', this.musicVolume.toString());
            localStorage.setItem('soundVolume', this.soundVolume.toString());

            console.log("💾 音频偏好设置已保存");
        } catch (error) {
            console.warn("⚠️ 保存音频偏好设置失败:", error);
        }
    }

    // 重置为默认设置
    resetToDefaults() {
        this.isEnabled = true;
        this.musicEnabled = true;
        this.soundEnabled = true;
        this.masterVolume = 1.0;
        this.musicVolume = 0.6;
        this.soundVolume = 0.8;

        console.log("🔧 音频设置已重置为默认值");
        this.updateUserPreferences();
    }

    // 测试音效
    testSound(soundId) {
        console.log(`🔍 测试音效: ${soundId}`);
        return this.playSound(soundId);
    }

    // 测试音乐
    testMusic(musicId) {
        console.log(`🔍 测试音乐: ${musicId}`);
        return this.playMusic(musicId, false); // 不循环测试音乐
    }

    // 获取系统信息
    getInfo() {
        return {
            isAudioSupported: this.isAudioSupported,
            isEnabled: this.isEnabled,
            hasMusic: this.currentMusic !== null,
            soundsPlaying: this.currentSounds.size,
            availableSounds: this.getAvailableSounds().length,
            availableMusic: this.getAvailableMusic().length,
            spatialAudioEnabled: this.spatialAudioEnabled
        };
    }

    // 设置游戏状态（用于动态混音等）
    setGameState(gameState) {
        this.gameState = gameState;
    }

    // 销毁音频系统（清理资源）
    destroy() {
        this.stopMusic();

        // 清理正在播放的音效
        this.currentSounds.clear();

        // 清理定时器
        if (this.dynamicMixHandler) {
            clearInterval(this.dynamicMixHandler);
        }

        // 关闭音频上下文
        if (this.audioContext) {
            this.audioContext.close();
        }

        console.log("🧹 统一音频系统已销毁");
    }
}

// 创建统一音频系统实例
const unifiedAudioManager = new UnifiedAudioSystem();

// 将音频系统添加到全局作用域以保持向后兼容性
window.UnifiedAudioSystem = UnifiedAudioSystem;
window.unifiedAudioManager = unifiedAudioManager;

// 为旧系统提供兼容性接口
window.AudioSystem = UnifiedAudioSystem;
window.EnhancedAudioManager = UnifiedAudioSystem;
window.SteamAudioSystem = UnifiedAudioSystem;

// 旧版音频管理器兼容性
window.audioManager = unifiedAudioManager;
window.enhancedAudioManager = unifiedAudioManager;
window.steamAudioSystem = unifiedAudioManager;

// 便捷函数 (兼容旧接口)
window.playSound = (id, volume) => unifiedAudioManager.playSound(id, volume);
window.playMusic = (id, loop) => unifiedAudioManager.playMusic(id, loop);
window.stopMusic = () => unifiedAudioManager.stopMusic();
window.setMusicVolume = (volume) => unifiedAudioManager.setMusicVolume(volume);
window.setSoundVolume = (volume) => unifiedAudioManager.setSoundVolume(volume);
window.enableSound = (enabled) => unifiedAudioManager.setSoundEnabled(enabled);
window.enableMusic = (enabled) => unifiedAudioManager.setMusicEnabled(enabled);

// Steam版兼容性函数
window.playSceneSound = (scene, params) => unifiedAudioManager.playSceneSound(scene, params);
window.playGameMusic = (gameState) => unifiedAudioManager.playGameMusic(gameState);

console.log("🚀 统一音频系统已完全加载");
