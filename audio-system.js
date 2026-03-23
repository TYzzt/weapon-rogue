// ==================== 音效系统 ====================
//
// 本系统实现游戏的音效和背景音乐功能
// 包括多种音效类型、音乐播放控制和音频设置管理

class AudioSystem {
    constructor() {
        this.isEnabled = true;
        this.musicEnabled = true;
        this.soundEnabled = true;
        this.volume = 0.7; // 总体音量 (0-1)
        this.musicVolume = 0.6; // 音乐音量 (0-1)
        this.soundVolume = 0.8; // 音效音量 (0-1)

        // 音效预设
        this.sounds = {};
        this.musicTracks = {};

        // 当前播放状态
        this.currentMusic = null;
        this.currentSounds = new Set(); // 正在播放的音效

        this.init();
        console.log("🎵 音效系统已初始化");
    }

    // 初始化音频系统
    init() {
        this.loadDefaultSounds();
        this.setupAudioContext();
        this.loadUserPreferences();
        console.log("🔊 音效系统准备就绪");
    }

    // 加载默认音效
    loadDefaultSounds() {
        // 这里我们模拟音效，实际游戏中会从音频文件加载
        this.sounds = {
            // 战斗音效
            'attack': { type: 'synth', params: { frequency: 220, waveform: 'square', duration: 0.1 } },
            'hit': { type: 'synth', params: { frequency: 180, waveform: 'sawtooth', duration: 0.05 } },
            'critical_hit': { type: 'synth', params: { frequency: 440, waveform: 'sine', duration: 0.2, detune: 10 } },

            // 武器相关音效
            'weapon_pickup': { type: 'synth', params: { frequency: 523.25, waveform: 'triangle', duration: 0.3 } }, // C5
            'weapon_change': { type: 'synth', params: { frequency: 392.00, waveform: 'sine', duration: 0.15 } }, // G4

            // 道具音效
            'potion_use': { type: 'synth', params: { frequency: 659.25, waveform: 'sine', duration: 0.2, detune: 5 } }, // E5
            'treasure_open': { type: 'synth', params: { frequency: 783.99, waveform: 'sine', duration: 0.4, detune: 15 } }, // G5

            // 角色音效
            'player_hurt': { type: 'synth', params: { frequency: 150, waveform: 'sawtooth', duration: 0.15, detune: -10 } },
            'player_heal': { type: 'synth', params: { frequency: 659.25, waveform: 'sine', duration: 0.25 } }, // E5
            'player_levelup': { type: 'synth', params: { frequency: 523.25, waveform: 'sine', duration: 0.1, detune: 0 },
                               extra: [{ frequency: 659.25, duration: 0.1, detune: 0 },
                                      { frequency: 783.99, duration: 0.2, detune: 0 }] }, // C5 -> E5 -> G5

            // 环境音效
            'step': { type: 'noise', params: { type: 'white', duration: 0.05 } },
            'door_open': { type: 'synth', params: { frequency: 220, waveform: 'sawtooth', duration: 0.5 } },

            // 胜负音效
            'victory': { type: 'synth', params: { frequency: 523.25, duration: 0.2 },
                        extra: [{ frequency: 659.25, duration: 0.2 },
                               { frequency: 783.99, duration: 0.4 }] }, // C5 -> E5 -> G5
            'defeat': { type: 'synth', params: { frequency: 110, waveform: 'sawtooth', duration: 0.8, detune: -5 } }, // A2

            // 界面音效
            'menu_select': { type: 'synth', params: { frequency: 880, waveform: 'sine', duration: 0.05 } }, // A5
            'menu_back': { type: 'synth', params: { frequency: 659.25, waveform: 'sine', duration: 0.08 } }, // E5
            'notification': { type: 'synth', params: { frequency: 1046.50, waveform: 'sine', duration: 0.03 } }, // C6

            // 成就音效
            'achievement_unlock': { type: 'synth', params: { frequency: 1318.51, duration: 0.05 },
                                  extra: [{ frequency: 987.77, duration: 0.1 },
                                         { frequency: 1174.66, duration: 0.15 },
                                         { frequency: 1318.51, duration: 0.2 }] } // G6 -> B5 -> Bb5 -> G6
        };

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
    }

    // 设置音频上下文（模拟）
    setupAudioContext() {
        // 在真实环境中，我们会创建Web Audio API上下文
        // 这里我们创建一个简化的模拟实现
        this.audioContext = {
            currentTime: Date.now() / 1000, // 模拟时间
            createOscillator: () => ({ type: 'sine', frequency: { value: 440 }, connect: () => {}, start: () => {}, stop: () => {} }),
            createGain: () => ({ gain: { value: 1 }, connect: () => {} })
        };

        // 模拟音频可用性检测
        this.isAudioSupported = true;
    }

    // 播放音效
    playSound(soundId, customVolume = null) {
        if (!this.isEnabled || !this.soundEnabled) {
            return false;
        }

        const sound = this.sounds[soundId];
        if (!sound) {
            console.warn(`音效 "${soundId}" 未定义`);
            return false;
        }

        // 模拟播放音效
        const volume = customVolume !== null ? customVolume : this.soundVolume;

        // 对于合成音效，模拟播放过程
        if (sound.type === 'synth' || sound.type === 'noise') {
            // 在真实环境中这里会使用Web Audio API播放声音
            console.log(`🔊 播放音效: ${soundId} (音量: ${volume})`);

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

    // 播放音乐
    playMusic(musicId, loop = true) {
        if (!this.isEnabled || !this.musicEnabled) {
            return false;
        }

        const track = this.musicTracks[musicId];
        if (!track) {
            console.warn(`音乐 "${musicId}" 未定义`);
            return false;
        }

        // 停止当前音乐
        this.stopMusic();

        // 模拟播放音乐
        console.log(`🎶 播放音乐: ${track.title} (循环: ${loop})`);

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
                    this.playMusic(musicId, true);
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
        if (this.currentMusic && this.currentMusic.timeoutId) {
            clearTimeout(this.currentMusic.timeoutId);
        }
        this.currentMusic = null;
        console.log("⏹️ 音乐已停止");
    }

    // 暂停音乐
    pauseMusic() {
        if (this.currentMusic && this.currentMusic.timeoutId) {
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
        }
    }

    // 设置总体音量
    setMasterVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        console.log(`🔊 总体音量设置为: ${this.volume}`);
        this.updateUserPreferences();
    }

    // 设置音乐音量
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        console.log(`🎶 音乐音量设置为: ${this.musicVolume}`);
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

    // 获取当前播放状态
    getPlaybackStatus() {
        return {
            isEnabled: this.isEnabled,
            musicEnabled: this.musicEnabled,
            soundEnabled: this.soundEnabled,
            currentMusic: this.currentMusic ? {
                id: this.currentMusic.id,
                title: this.musicTracks[this.currentMusic.id]?.title,
                elapsed: Date.now() - this.currentMusic.startTime,
                duration: this.musicTracks[this.currentMusic.id]?.duration,
                loop: this.currentMusic.loop,
                paused: this.currentMusic.paused || false
            } : null,
            playingSounds: Array.from(this.currentSounds),
            volumes: {
                master: this.volume,
                music: this.musicVolume,
                sound: this.soundVolume
            }
        };
    }

    // 获取可用的音效列表
    getAvailableSounds() {
        return Object.keys(this.sounds);
    }

    // 获取可用的音乐列表
    getAvailableMusic() {
        return Object.keys(this.musicTracks);
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
                if (typeof gameState !== 'undefined') {
                    if (gameState.inBattle) {
                        musicId = 'battle_music';
                    } else if (gameState.currentLevel % 5 === 0) {
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
            const savedVolume = localStorage.getItem('masterVolume');
            const savedMusicVolume = localStorage.getItem('musicVolume');
            const savedSoundVolume = localStorage.getItem('soundVolume');

            if (savedEnabled !== null) this.isEnabled = savedEnabled === 'true';
            if (savedMusicEnabled !== null) this.musicEnabled = savedMusicEnabled === 'true';
            if (savedSoundEnabled !== null) this.soundEnabled = savedSoundEnabled === 'true';
            if (savedVolume !== null) this.volume = parseFloat(savedVolume);
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
            localStorage.setItem('masterVolume', this.volume.toString());
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
        this.volume = 0.7;
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
            availableSounds: Object.keys(this.sounds).length,
            availableMusic: Object.keys(this.musicTracks).length
        };
    }

    // 销毁音频系统（清理资源）
    destroy() {
        this.stopMusic();
        // 清理正在播放的音效
        this.currentSounds.clear();
        console.log("🧹 音频系统已销毁");
    }
}

// 增强版音频管理器
class EnhancedAudioManager extends AudioSystem {
    constructor() {
        super();
        this.spatialAudioEnabled = false; // 3D音效开关
        this.audioProfiles = {
            'balanced': { master: 0.7, music: 0.6, sound: 0.8 },
            'music_focused': { master: 0.7, music: 0.8, sound: 0.5 },
            'effects_focused': { master: 0.7, music: 0.5, sound: 0.8 },
            'quiet': { master: 0.4, music: 0.4, sound: 0.4 }
        };
        this.initEnhancedFeatures();
        console.log("🎼 增强版音频管理器已初始化");
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
            if (typeof gameState !== 'undefined' && gameState.inIntenseCombat) {
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
        const commonSounds = ['attack', 'hit', 'weapon_pickup', 'potion_use', 'player_hurt'];
        for (const soundId of commonSounds) {
            this.preloadSound(soundId);
        }
    }

    // 预加载音效
    preloadSound(soundId) {
        // 在真实实现中，这里会预加载音频资源
        // 模拟预加载
        if (this.sounds[soundId]) {
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

    // 带位置的音效播放（模拟3D音效）
    playSpatialSound(soundId, position = { x: 0, y: 0 }) {
        if (!this.spatialAudioEnabled) {
            return this.playSound(soundId);
        }

        // 在真实环境中，这将使用Web Audio API的空间化功能
        // 计算相对于玩家位置的音效距离和方向
        const playerPos = typeof gameState !== 'undefined' ? { x: gameState.player?.x || 0, y: gameState.player?.y || 0 } : { x: 0, y: 0 };

        const dx = position.x - playerPos.x;
        const dy = position.y - playerPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // 计算衰减后的声音大小
        const attenuation = this.audioAnalyzer.calculateDistanceAttenuation(distance, 500); // 最大距离500像素
        const effectiveVolume = this.soundVolume * attenuation;

        console.log(`📍 3D音效 "${soundId}" 从位置 (${position.x}, ${position.y}) 播放, 距离: ${distance.toFixed(2)}, 音量: ${effectiveVolume.toFixed(2)}`);

        return this.playSound(soundId, effectiveVolume);
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
        if (typeof gameState !== 'undefined') {
            if (gameState.isGameOver) return 'defeat_theme';
            if (gameState.hasWon) return 'victory_theme';
            if (gameState.inBossFight) return 'boss_battle';
            if (gameState.inCombat) return 'battle_music';
            if (gameState.onMainMenu) return 'main_theme';
        }
        return 'exploration';
    }

    // 自动播放推荐音乐
    autoPlayRecommendedMusic() {
        const recommended = this.getRecommendedMusic();
        return this.playMusic(recommended);
    }

    // 销毁增强功能
    destroy() {
        super.destroy();

        if (this.dynamicMixHandler) {
            clearInterval(this.dynamicMixHandler);
        }

        console.log("🧹 增强版音频管理器已销毁");
    }
}

// 初始化音频系统
const audioManager = new EnhancedAudioManager();

// 将音频系统添加到全局作用域
window.AudioSystem = AudioSystem;
window.EnhancedAudioManager = EnhancedAudioManager;
window.audioManager = audioManager;

// 便捷函数
window.playSound = (id, volume) => audioManager.playSound(id, volume);
window.playMusic = (id, loop) => audioManager.playMusic(id, loop);
window.stopMusic = () => audioManager.stopMusic();
window.setMusicVolume = (volume) => audioManager.setMusicVolume(volume);
window.setSoundVolume = (volume) => audioManager.setSoundVolume(volume);
window.enableSound = (enabled) => audioManager.setSoundEnabled(enabled);
window.enableMusic = (enabled) => audioManager.setMusicEnabled(enabled);

console.log("🚀 音效系统已完全加载");