// ==================== 增强版音效系统 ====================

class EnhancedAudioManager {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.musicEnabled = true;
        this.soundEnabled = true;

        // 音效池，避免频繁创建Audio对象
        this.audioPool = new Map();

        // 当前播放的音效，用于管理重叠
        this.activeSounds = new Set();

        // 音效映射 - 将音效名映射到音频文件路径
        this.soundMap = {
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

            // 新增音效
            'achievement_unlock': 'assets/sounds/achievement_unlock.mp3',
            'coin_pickup': 'assets/sounds/coin_pickup.mp3',
            'door_open': 'assets/sounds/door_open.mp3',
            'powerup': 'assets/sounds/powerup.mp3',
            'damage_taken': 'assets/sounds/damage_taken.mp3',
            'combo_increase': 'assets/sounds/combo_increase.mp3',
            'item_drop': 'assets/sounds/item_drop.mp3',
            'footstep': 'assets/sounds/footstep.mp3',
            'ambient_loop': 'assets/sounds/ambient_loop.mp3'
        };
    }

    // 初始化音频上下文
    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log('增强版音效系统已初始化');

            // 预加载常用音效
            this.preloadCommonSounds();
        } catch (e) {
            console.warn('无法初始化Web Audio API，将使用简单音效:', e);
        }
    }

    // 预加载常用音效
    async preloadCommonSounds() {
        const commonSounds = [
            'collect', 'hurt', 'weapon_pickup', 'attack', 'level_up',
            'hit', 'enemy_death', 'heal', 'menu_select', 'skill_use'
        ];

        for (const soundName of commonSounds) {
            if (this.soundMap[soundName]) {
                await this.loadSound(soundName, this.soundMap[soundName]);
            }
        }
    }

    // 加载单个音效
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
                frequency = 600; duration = 0.15; type = 'square';
                break;
            case 'attack':
                frequency = 300; duration = 0.1; type = 'triangle';
                break;
            case 'level_up':
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
            default:
                frequency = 500; duration = 0.1; type = 'sine';
        }

        this.sounds[name] = { frequency, duration, type };
    }

    // 播放音效
    playSound(name, volume = 1.0) {
        // 如果音效关闭，直接返回
        if (!this.soundEnabled) return;

        // 如果没有这个音效，先尝试加载
        if (!this.sounds[name]) {
            if (this.soundMap[name]) {
                this.loadSound(name, this.soundMap[name]);
            } else {
                this.createFallbackSound(name);
            }
        }

        if (this.audioContext && this.sounds[name] && typeof this.sounds[name] !== 'string') {
            try {
                if (this.sounds[name] instanceof AudioBuffer) {
                    // 播放已加载的音频缓冲区
                    const source = this.audioContext.createBufferSource();
                    source.buffer = this.sounds[name];

                    const gainNode = this.audioContext.createGain();
                    gainNode.gain.value = volume;
                    source.connect(gainNode);
                    gainNode.connect(this.audioContext.destination);

                    source.start(0);
                } else if (typeof this.sounds[name] === 'object') {
                    // 播放程序生成的回退音效
                    this.playGeneratedSound(this.sounds[name], volume);
                }
            } catch (e) {
                console.warn(`播放音效失败: ${name}`, e);
            }
        } else {
            // 如果Web Audio API不可用，尝试使用简单的HTML5 Audio
            this.fallbackPlaySound(name);
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
                    }, idx * 100);
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
    playMusic(name, volume = 0.5, loop = true) {
        if (!this.musicEnabled) return;

        const musicPath = this.soundMap[name];
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
            this.currentMusic.volume = volume;
            this.currentMusic.loop = loop;
            this.currentMusic.play().catch(e => {
                console.warn('播放音乐失败，使用静默模式:', e);
            });
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

    // 简单回退播放音效（当Web Audio API不可用时）
    fallbackPlaySound(name) {
        // 尝试使用简单的方法播放音效
        if ('Audio' in window) {
            const audioPath = this.soundMap[name];
            if (audioPath) {
                const audio = new Audio(audioPath);
                audio.volume = 0.7;
                audio.play().catch(e => {
                    // 静默失败
                });
            }
        }
    }

    // 设置音效开关
    setSoundEnabled(enabled) {
        this.soundEnabled = enabled;
    }

    // 设置音乐开关
    setMusicEnabled(enabled) {
        this.musicEnabled = enabled;
        if (!enabled && this.currentMusic) {
            this.stopMusic();
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
}

// 创建增强版音效管理器实例
const enhancedAudioManager = new EnhancedAudioManager();

// 页面加载完成后初始化音效系统
document.addEventListener('DOMContentLoaded', () => {
    enhancedAudioManager.init();

    // 监听设置变化
    const soundToggle = document.getElementById('sound-enabled');
    if (soundToggle) {
        soundToggle.addEventListener('change', (e) => {
            enhancedAudioManager.setSoundEnabled(e.target.checked);
        });
    }

    const musicToggle = document.getElementById('music-enabled');
    if (musicToggle) {
        musicToggle.addEventListener('change', (e) => {
            enhancedAudioManager.setMusicEnabled(e.target.checked);
        });
    }
});