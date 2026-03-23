// ==================== 高级特效系统 ====================

class ParticleSystem {
    constructor() {
        this.particles = [];
        this.effects = {
            'hit': this.createHitEffect,
            'heal': this.createHealEffect,
            'levelUp': this.createLevelUpEffect,
            'weaponPickup': this.createWeaponPickupEffect,
            'enemyDeath': this.createEnemyDeathEffect,
            'burn': this.createBurnEffect,
            'poison': this.createPoisonEffect,
            'teleport': this.createTeleportEffect,
            'critical': this.createCriticalEffect,
            'combo': this.createComboEffect
        };
    }

    // 添加粒子
    addParticle(particle) {
        this.particles.push(particle);
    }

    // 更新所有粒子
    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update();
            if (this.particles[i].life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    // 绘制所有粒子
    draw(ctx) {
        this.particles.forEach(particle => particle.draw(ctx));
    }

    // 创建撞击特效
    createHitEffect(x, y, options = {}) {
        const particles = [];
        const count = options.count || 5;
        const color = options.color || '#FF5555';

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 3;
            const size = 2 + Math.random() * 3;

            particles.push(new Particle({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: size,
                color: color,
                life: 30 + Math.random() * 30,
                decay: 0.95
            }));
        }

        return particles;
    }

    // 创建治疗特效
    createHealEffect(x, y, options = {}) {
        const particles = [];
        const count = options.count || 8;
        const color = options.color || '#55FF55';

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1 + Math.random() * 2;
            const size = 1 + Math.random() * 2;

            particles.push(new Particle({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: size,
                color: color,
                life: 40 + Math.random() * 20,
                decay: 0.92,
                gravity: -0.05
            }));
        }

        return particles;
    }

    // 创建升级特效
    createLevelUpEffect(x, y, options = {}) {
        const particles = [];
        const count = options.count || 20;
        const colors = ['#FFD700', '#FFA500', '#FF6347', '#FF1493', '#9370DB'];

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1 + Math.random() * 4;
            const size = 2 + Math.random() * 2;
            const color = colors[Math.floor(Math.random() * colors.length)];

            particles.push(new Particle({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: size,
                color: color,
                life: 60 + Math.random() * 30,
                decay: 0.94,
                glow: true
            }));
        }

        return particles;
    }

    // 创建武器拾取特效
    createWeaponPickupEffect(x, y, options = {}) {
        const particles = [];
        const count = options.count || 15;
        const baseColor = options.color || '#4169E1';

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.5 + Math.random() * 2;
            const size = 1.5 + Math.random() * 1.5;

            particles.push(new Particle({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: size,
                color: baseColor,
                life: 50 + Math.random() * 25,
                decay: 0.96,
                pulse: true
            }));
        }

        return particles;
    }

    // 创建敌人死亡特效
    createEnemyDeathEffect(x, y, options = {}) {
        const particles = [];
        const count = options.count || 12;
        const color = options.color || '#8B0000';

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1 + Math.random() * 3;
            const size = 2 + Math.random() * 2;

            particles.push(new Particle({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: size,
                color: color,
                life: 40 + Math.random() * 20,
                decay: 0.93
            }));
        }

        return particles;
    }

    // 创建燃烧特效
    createBurnEffect(x, y, options = {}) {
        const particles = [];
        const count = options.count || 6;
        const colors = ['#FF4500', '#FF6347', '#FF8C00'];

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.5 + Math.random() * 1.5;
            const size = 2 + Math.random() * 1.5;
            const color = colors[Math.floor(Math.random() * colors.length)];

            particles.push(new Particle({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: size,
                color: color,
                life: 25 + Math.random() * 15,
                decay: 0.90,
                glow: true,
                floatUp: true
            }));
        }

        return particles;
    }

    // 创建中毒特效
    createPoisonEffect(x, y, options = {}) {
        const particles = [];
        const count = options.count || 5;
        const color = options.color || '#32CD32';

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.3 + Math.random() * 1;
            const size = 1.5 + Math.random() * 1;

            particles.push(new Particle({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: size,
                color: color,
                life: 35 + Math.random() * 15,
                decay: 0.94,
                floatDown: true,
                wobble: true
            }));
        }

        return particles;
    }

    // 创建传送特效
    createTeleportEffect(x, y, options = {}) {
        const particles = [];
        const count = options.count || 25;
        const colors = ['#9370DB', '#BA55D3', '#DA70D6', '#FF00FF', '#8A2BE2'];

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 4;
            const size = 2 + Math.random() * 2;
            const color = colors[Math.floor(Math.random() * colors.length)];

            particles.push(new Particle({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: size,
                color: color,
                life: 20 + Math.random() * 20,
                decay: 0.92,
                glow: true
            }));
        }

        return particles;
    }

    // 创建暴击特效
    createCriticalEffect(x, y, options = {}) {
        const particles = [];
        const count = options.count || 10;
        const colors = ['#FFD700', '#FFFF00', '#FFA500'];

        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 3 + Math.random() * 3;
            const size = 3 + Math.random() * 2;
            const color = colors[Math.floor(Math.random() * colors.length)];

            particles.push(new Particle({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: size,
                color: color,
                life: 25 + Math.random() * 15,
                decay: 0.90,
                glow: true
            }));
        }

        // 添加文字特效
        particles.push(new TextParticle({
            x: x,
            y: y,
            text: 'CRITICAL!',
            fontSize: 24,
            color: '#FFFF00',
            life: 60
        }));

        return particles;
    }

    // 创建连击特效
    createComboEffect(x, y, combo, options = {}) {
        const particles = [];

        // 添加数字特效
        particles.push(new TextParticle({
            x: x,
            y: y,
            text: `${combo} COMBO!`,
            fontSize: 20,
            color: combo >= 50 ? '#FFD700' :
                   combo >= 20 ? '#FFA500' :
                   combo >= 10 ? '#9370DB' : '#4169E1',
            life: 90,
            floatUp: true
        }));

        // 添加闪光粒子
        const count = Math.min(combo / 2, 15); // 根据连击数调整粒子数量
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1 + Math.random() * 3;
            const size = 2 + Math.random() * 2;
            const hue = (combo * 10) % 360; // 根据连击数变化颜色

            particles.push(new Particle({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: size,
                color: `hsl(${hue}, 100%, 70%)`,
                life: 40 + Math.random() * 20,
                decay: 0.94,
                glow: true
            }));
        }

        return particles;
    }

    // 播放特效
    playEffect(type, x, y, options = {}) {
        if (this.effects[type]) {
            const effectParticles = this.effects[type].call(this, x, y, options);
            if (Array.isArray(effectParticles)) {
                effectParticles.forEach(p => this.addParticle(p));
            }
        }
    }

    // 清除所有粒子
    clear() {
        this.particles = [];
    }
}

// 粒子类
class Particle {
    constructor(options) {
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.vx = options.vx || 0;
        this.vy = options.vy || 0;
        this.size = options.size || 2;
        this.originalSize = this.size;
        this.color = options.color || '#FFFFFF';
        this.life = options.life || 60;
        this.maxLife = this.life;
        this.decay = options.decay || 0.95;
        this.gravity = options.gravity || 0;
        this.floatUp = options.floatUp || false;
        this.floatDown = options.floatDown || false;
        this.wobble = options.wobble || false;
        this.wobbleAmount = options.wobbleAmount || 0.5;
        this.wobbleSpeed = options.wobbleSpeed || 0.2;
        this.wobbleOffset = Math.random() * Math.PI * 2;
        this.glow = options.glow || false;
        this.pulse = options.pulse || false;
        this.pulseSpeed = options.pulseSpeed || 0.1;
        this.rotation = options.rotation || 0;
        this.rotationSpeed = options.rotationSpeed || 0;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.gravity !== 0) {
            this.vy += this.gravity;
        }

        if (this.floatUp) {
            this.vy -= 0.1;
        }

        if (this.floatDown) {
            this.vy += 0.05;
        }

        if (this.wobble) {
            this.x += Math.sin(Date.now() * this.wobbleSpeed + this.wobbleOffset) * this.wobbleAmount;
        }

        this.life--;

        // 应用衰减
        this.vx *= this.decay;
        this.vy *= this.decay;

        // 更新大小（如果有脉动效果）
        if (this.pulse) {
            this.size = this.originalSize + Math.sin(Date.now() * this.pulseSpeed) * 0.5;
        }

        // 更新旋转
        this.rotation += this.rotationSpeed;
    }

    draw(ctx) {
        const alpha = this.life / this.maxLife;
        if (alpha <= 0) return;

        ctx.save();
        ctx.globalAlpha = alpha;

        if (this.glow) {
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 10;
        }

        ctx.fillStyle = this.color;
        ctx.beginPath();

        if (this.rotation !== 0) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size);
            ctx.restore();
        } else {
            ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
        }

        ctx.restore();
    }
}

// 文字粒子类
class TextParticle {
    constructor(options) {
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.text = options.text || '';
        this.fontSize = options.fontSize || 16;
        this.originalFontSize = this.fontSize;
        this.color = options.color || '#FFFFFF';
        this.life = options.life || 60;
        this.maxLife = this.life;
        this.floatUp = options.floatUp || false;
        this.vy = this.floatUp ? -1 : 0;
        this.pulse = options.pulse || false;
        this.pulseSpeed = options.pulseSpeed || 0.1;
    }

    update() {
        this.y += this.vy;
        if (this.floatUp) {
            this.vy -= 0.05; // 慢慢减速上升
        }

        this.life--;

        // 更新字体大小（如果有脉动效果）
        if (this.pulse) {
            this.fontSize = this.originalFontSize + Math.sin(Date.now() * this.pulseSpeed) * 2;
        }
    }

    draw(ctx) {
        const alpha = this.life / this.maxLife;
        if (alpha <= 0) return;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.font = `bold ${this.fontSize}px Arial`;
        ctx.fillStyle = this.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.text, this.x, this.y);
        ctx.restore();
    }
}

// 创建全局特效系统实例
const particleSystem = new ParticleSystem();

// 便捷函数来播放特效
function playHitEffect(x, y, options) {
    particleSystem.playEffect('hit', x, y, options);
}

function playHealEffect(x, y, options) {
    particleSystem.playEffect('heal', x, y, options);
}

function playLevelUpEffect(x, y, options) {
    particleSystem.playEffect('levelUp', x, y, options);
}

function playWeaponPickupEffect(x, y, options) {
    particleSystem.playEffect('weaponPickup', x, y, options);
}

function playEnemyDeathEffect(x, y, options) {
    particleSystem.playEffect('enemyDeath', x, y, options);
}

function playBurnEffect(x, y, options) {
    particleSystem.playEffect('burn', x, y, options);
}

function playPoisonEffect(x, y, options) {
    particleSystem.playEffect('poison', x, y, options);
}

function playTeleportEffect(x, y, options) {
    particleSystem.playEffect('teleport', x, y, options);
}

function playCriticalEffect(x, y, options) {
    particleSystem.playEffect('critical', x, y, options);
}

function playComboEffect(x, y, combo, options) {
    particleSystem.playEffect('combo', x, y, combo, options);
}

// 更新游戏循环以包含粒子系统
function updateParticles() {
    particleSystem.update();
}

function drawParticles(ctx) {
    particleSystem.draw(ctx);
}

console.log("高级特效系统已加载");