// ==================== 图形效果增强系统 ====================
//
// 本系统实现游戏的图形增强功能，包括粒子效果、动画优化和视觉特效
// 提升游戏的视觉体验和沉浸感

class GraphicsEnhancementSystem {
    constructor() {
        this.effects = [];
        this.animations = [];
        this.particleSystems = [];
        this.graphicsQuality = 'high'; // low, medium, high, ultra
        this.isEffectsEnabled = true;
        this.animationFrameId = null;

        this.canvas = null;
        this.ctx = null;
        this.offscreenCanvas = null;
        this.offscreenCtx = null;

        this.init();
        console.log("✨ 图形效果增强系统已初始化");
    }

    // 初始化图形增强系统
    init() {
        this.setupCanvas();
        this.createParticleSystemTemplates();
        this.loadQualitySettings();
        this.animate();
        console.log("🎬 图形增强系统初始化完成");
    }

    // 设置画布
    setupCanvas() {
        // 查找游戏画布或创建新的
        this.canvas = document.getElementById('game-canvas') || document.querySelector('canvas');

        if (!this.canvas) {
            // 如果没有找到现有画布，创建一个新的
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'game-canvas';
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;

            const container = document.getElementById('game-container') || document.body;
            container.appendChild(this.canvas);
        }

        this.ctx = this.canvas.getContext('2d');

        // 创建离屏画布用于效果渲染
        this.offscreenCanvas = document.createElement('canvas');
        this.offscreenCanvas.width = this.canvas.width;
        this.offscreenCanvas.height = this.canvas.height;
        this.offscreenCtx = this.offscreenCanvas.getContext('2d');

        console.log("🎨 画布设置完成");
    }

    // 创建粒子系统模板
    createParticleSystemTemplates() {
        this.particleTemplates = {
            // 攻击效果粒子
            attack: {
                maxParticles: 15,
                lifeSpan: 0.5,
                speed: { min: 50, max: 150 },
                size: { min: 2, max: 6 },
                color: ['#FFD700', '#FFA500', '#FFFF00'], // 金色到橙色到黄色
                shape: 'circle',
                emissionRate: 5
            },

            // 受伤效果粒子
            hit: {
                maxParticles: 20,
                lifeSpan: 0.3,
                speed: { min: 30, max: 100 },
                size: { min: 3, max: 8 },
                color: ['#FF0000', '#FF4500', '#B22222'], // 红色系列
                shape: 'circle',
                emissionRate: 8
            },

            // 武器获取效果粒子
            weaponPickup: {
                maxParticles: 25,
                lifeSpan: 0.8,
                speed: { min: 20, max: 80 },
                size: { min: 4, max: 10 },
                color: ['#00BFFF', '#1E90FF', '#0000FF'], // 蓝色系列
                shape: 'star',
                emissionRate: 10
            },

            // 治疗效果粒子
            heal: {
                maxParticles: 18,
                lifeSpan: 0.6,
                speed: { min: 25, max: 70 },
                size: { min: 3, max: 7 },
                color: ['#32CD32', '#00FF7F', '#7CFC00'], // 绿色系列
                shape: 'circle',
                emissionRate: 6
            },

            // 暴击效果粒子
            critical: {
                maxParticles: 30,
                lifeSpan: 0.4,
                speed: { min: 80, max: 200 },
                size: { min: 5, max: 12 },
                color: ['#FF1493', '#FF69B4', '#FFB6C1'], // 粉色系列
                shape: 'diamond',
                emissionRate: 15
            },

            // 死亡爆炸粒子
            explosion: {
                maxParticles: 50,
                lifeSpan: 1.0,
                speed: { min: 60, max: 180 },
                size: { min: 4, max: 15 },
                color: ['#FF4500', '#FF6347', '#FFD700', '#FFA500'], // 橙红色系列
                shape: 'circle',
                emissionRate: 25
            }
        };

        console.log("☄️ 粒子系统模板已创建");
    }

    // 启用/禁用效果
    setEffectsEnabled(enabled) {
        this.isEffectsEnabled = enabled;
        console.log(`🌈 视觉效果已${enabled ? '启用' : '禁用'}`);
    }

    // 设置图形质量
    setGraphicsQuality(quality) {
        this.graphicsQuality = quality;

        // 根据质量调整粒子数量
        switch(quality) {
            case 'low':
                for (let template in this.particleTemplates) {
                    this.particleTemplates[template].maxParticles = Math.floor(this.particleTemplates[template].maxParticles * 0.4);
                    this.particleTemplates[template].emissionRate = Math.floor(this.particleTemplates[template].emissionRate * 0.4);
                }
                break;
            case 'medium':
                for (let template in this.particleTemplates) {
                    this.particleTemplates[template].maxParticles = Math.floor(this.particleTemplates[template].maxParticles * 0.7);
                    this.particleTemplates[template].emissionRate = Math.floor(this.particleTemplates[template].emissionRate * 0.7);
                }
                break;
            case 'high':
                // 默认值
                break;
            case 'ultra':
                for (let template in this.particleTemplates) {
                    this.particleTemplates[template].maxParticles = Math.ceil(this.particleTemplates[template].maxParticles * 1.5);
                    this.particleTemplates[template].emissionRate = Math.ceil(this.particleTemplates[template].emissionRate * 1.5);
                }
                break;
        }

        console.log(`🖼️ 图形质量设置为: ${quality}`);
        this.saveQualitySettings();
    }

    // 创建粒子系统
    createParticleSystem(templateName, x, y, properties = {}) {
        if (!this.particleTemplates[templateName]) {
            console.warn(`粒子模板 "${templateName}" 不存在`);
            return null;
        }

        const template = { ...this.particleTemplates[templateName], ...properties };

        const particleSystem = {
            id: Date.now() + Math.random(),
            x: x,
            y: y,
            particles: [],
            maxParticles: template.maxParticles,
            lifeSpan: template.lifeSpan,
            speed: template.speed,
            size: template.size,
            color: template.color,
            shape: template.shape,
            emissionRate: template.emissionRate,
            emissionTimer: 0,
            duration: properties.duration || 2000, // 2秒默认持续时间
            createdAt: Date.now(),
            isFinished: false,

            // 创建单个粒子
            createParticle: function() {
                return {
                    x: this.x + (Math.random() - 0.5) * 20, // 小范围偏移
                    y: this.y + (Math.random() - 0.5) * 20,
                    vx: (Math.random() - 0.5) * 2, // 随机方向
                    vy: (Math.random() - 0.5) * 2,
                    life: 1,
                    initialLife: 1,
                    size: this.size.min + Math.random() * (this.size.max - this.size.min),
                    color: this.color[Math.floor(Math.random() * this.color.length)],
                    rotation: Math.random() * Math.PI * 2,
                    rotationSpeed: (Math.random() - 0.5) * 0.2
                };
            }
        };

        // 添加到系统列表
        this.particleSystems.push(particleSystem);
        console.log(`☄️ 创建了 ${templateName} 粒子系统在 (${x}, ${y})`);

        return particleSystem;
    }

    // 播放攻击效果
    playAttackEffect(x, y) {
        if (!this.isEffectsEnabled) return;

        this.createParticleSystem('attack', x, y);
        console.log(`⚔️ 攻击效果在 (${x}, ${y}) 播放`);
    }

    // 播放受击效果
    playHitEffect(x, y) {
        if (!this.isEffectsEnabled) return;

        this.createParticleSystem('hit', x, y);
        console.log(`💥 受击效果在 (${x}, ${y}) 播放`);
    }

    // 播放武器获取效果
    playWeaponPickupEffect(x, y) {
        if (!this.isEffectsEnabled) return;

        this.createParticleSystem('weaponPickup', x, y);
        console.log(`✨ 武器获取效果在 (${x}, ${y}) 播放`);
    }

    // 播放治疗效果
    playHealEffect(x, y) {
        if (!this.isEffectsEnabled) return;

        this.createParticleSystem('heal', x, y);
        console.log(`💚 治疗效果在 (${x}, ${y}) 播放`);
    }

    // 播放暴击效果
    playCriticalEffect(x, y) {
        if (!this.isEffectsEnabled) return;

        this.createParticleSystem('critical', x, y, { duration: 1500 });
        console.log(`🔥 暴击效果在 (${x}, ${y}) 播放`);
    }

    // 播放爆炸效果
    playExplosionEffect(x, y) {
        if (!this.isEffectsEnabled) return;

        this.createParticleSystem('explosion', x, y, { duration: 2500 });
        console.log(`💣 爆炸效果在 (${x}, ${y}) 播放`);
    }

    // 绘制粒子
    drawParticles() {
        for (let i = this.particleSystems.length - 1; i >= 0; i--) {
            const system = this.particleSystems[i];

            // 检查系统是否完成
            if (Date.now() - system.createdAt > system.duration) {
                system.isFinished = true;
            }

            // 更新和绘制粒子
            for (let j = system.particles.length - 1; j >= 0; j--) {
                const p = system.particles[j];

                // 更新粒子
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 1 / (system.lifeSpan * 60); // 假设60fps
                p.rotation += p.rotationSpeed;

                // 删除生命周期结束的粒子
                if (p.life <= 0) {
                    system.particles.splice(j, 1);
                    continue;
                }

                // 绘制粒子
                this.ctx.save();
                this.ctx.translate(p.x, p.y);
                this.ctx.rotate(p.rotation);

                this.ctx.globalAlpha = p.life; // 根据生命周期调整透明度

                if (system.shape === 'circle') {
                    this.ctx.fillStyle = p.color;
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, p.size * p.life, 0, Math.PI * 2);
                    this.ctx.fill();
                } else if (system.shape === 'star') {
                    this.drawStar(0, 0, 5, p.size * p.life, p.size * p.life * 0.4);
                } else if (system.shape === 'diamond') {
                    this.ctx.fillStyle = p.color;
                    this.ctx.beginPath();
                    this.ctx.moveTo(0, -p.size * p.life);
                    this.ctx.lineTo(p.size * p.life, 0);
                    this.ctx.lineTo(0, p.size * p.life);
                    this.ctx.lineTo(-p.size * p.life, 0);
                    this.ctx.closePath();
                    this.ctx.fill();
                }

                this.ctx.restore();
            }

            // 创建新粒子
            system.emissionTimer++;
            if (system.emissionTimer >= 60 / system.emissionRate && system.particles.length < system.maxParticles && !system.isFinished) {
                if (system.particles.length < system.maxParticles) {
                    system.particles.push(system.createParticle());
                }
                system.emissionTimer = 0;
            }

            // 删除完成的系统
            if (system.isFinished && system.particles.length === 0) {
                this.particleSystems.splice(i, 1);
            }
        }
    }

    // 绘制星星形状
    drawStar(cx, cy, spikes, outerRadius, innerRadius) {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        let step = Math.PI / spikes;

        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy - outerRadius);

        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            this.ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            this.ctx.lineTo(x, y);
            rot += step;
        }

        this.ctx.lineTo(cx, cy - outerRadius);
        this.ctx.closePath();
        this.ctx.fill();
    }

    // 创建动画
    createAnimation(properties) {
        const animation = {
            id: Date.now() + Math.random(),
            ...properties,
            startTime: Date.now(),
            isPlaying: true,
            progress: 0
        };

        this.animations.push(animation);
        console.log(`🎬 创建动画: ${animation.id}`);

        return animation;
    }

    // 更新动画
    updateAnimations() {
        for (let i = this.animations.length - 1; i >= 0; i--) {
            const anim = this.animations[i];
            const elapsed = Date.now() - anim.startTime;
            anim.progress = Math.min(elapsed / anim.duration, 1);

            // 计算插值
            if (anim.target && anim.properties) {
                for (const prop of anim.properties) {
                    if (anim.startValues && anim.endValues && anim.startValues[prop] !== undefined && anim.endValues[prop] !== undefined) {
                        const startVal = anim.startValues[prop];
                        const endVal = anim.endValues[prop];

                        // 使用缓动函数
                        const easedProgress = this.easeInOutQuad(anim.progress);
                        const currentValue = startVal + (endVal - startVal) * easedProgress;

                        // 应用到目标
                        anim.target[prop] = currentValue;
                    }
                }
            }

            // 动画完成回调
            if (anim.progress >= 1) {
                if (anim.onComplete) anim.onComplete();
                this.animations.splice(i, 1);
            }
        }
    }

    // 缓动函数
    easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    // 创建闪烁效果
    createBlinkEffect(element, duration = 1000, interval = 200) {
        let isVisible = true;
        const originalOpacity = element.style.opacity || '1';

        const blinkInterval = setInterval(() => {
            element.style.opacity = isVisible ? '0' : originalOpacity;
            isVisible = !isVisible;
        }, interval);

        setTimeout(() => {
            clearInterval(blinkInterval);
            element.style.opacity = originalOpacity;
        }, duration);

        console.log(`✨ 创建闪烁效果于元素，持续 ${duration}ms`);
    }

    // 创建脉冲效果
    createPulseEffect(element, duration = 1000) {
        const originalTransform = element.style.transform || '';
        let scale = 1;
        const grow = true;

        const pulseAnimation = setInterval(() => {
            scale = 1 + 0.1 * Math.sin(Date.now() / 100);
            element.style.transform = `${originalTransform} scale(${scale})`;
        }, 16); // ~60fps

        setTimeout(() => {
            clearInterval(pulseAnimation);
            element.style.transform = originalTransform;
        }, duration);

        console.log(`💫 创建脉冲效果于元素，持续 ${duration}ms`);
    }

    // 创建拖尾效果
    createTrailEffect(object, color = '#FFFFFF', length = 10) {
        const trail = {
            id: Date.now() + Math.random(),
            object: object,
            positions: [],
            color: color,
            maxLength: length,
            opacityDecay: 0.8
        };

        this.effects.push(trail);
        console.log(`🌠 创建拖尾效果，长度: ${length}`);

        return trail;
    }

    // 绘制拖尾
    drawTrails() {
        for (const effect of this.effects) {
            if (effect.positions && effect.positions.length > 1) {
                this.ctx.globalCompositeOperation = 'lighter';

                for (let i = 0; i < effect.positions.length; i++) {
                    const pos = effect.positions[i];
                    const alpha = (i / effect.positions.length) * effect.opacityDecay;

                    this.ctx.globalAlpha = alpha;
                    this.ctx.fillStyle = effect.color;
                    this.ctx.beginPath();
                    this.ctx.arc(pos.x, pos.y, 3 * alpha, 0, Math.PI * 2);
                    this.ctx.fill();
                }

                this.ctx.globalCompositeOperation = 'source-over';
                this.ctx.globalAlpha = 1;
            }
        }
    }

    // 主动画循环
    animate() {
        if (!this.ctx) return;

        // 清除画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 更新和绘制动画
        this.updateAnimations();

        // 更新和绘制粒子
        this.drawParticles();

        // 绘制拖尾效果
        this.drawTrails();

        // 继续动画循环
        this.animationFrameId = requestAnimationFrame(() => this.animate());
    }

    // 创建屏幕震动效果
    screenShake(intensity = 10, duration = 500) {
        const originalTransform = this.canvas.style.transform || '';
        let shakeStartTime = Date.now();

        const shake = () => {
            const elapsed = Date.now() - shakeStartTime;
            if (elapsed < duration) {
                const x = (Math.random() - 0.5) * intensity;
                const y = (Math.random() - 0.5) * intensity;
                this.canvas.style.transform = `translate(${x}px, ${y}px)`;

                requestAnimationFrame(shake);
            } else {
                this.canvas.style.transform = originalTransform;
            }
        };

        shake();
        console.log(` earthquack 屏幕震动效果，强度: ${intensity}, 持续: ${duration}ms`);
    }

    // 创建渐入渐出效果
    fadeEffect(targetElement, fromOpacity, toOpacity, duration = 1000) {
        const startOpacity = parseFloat(fromOpacity);
        const endOpacity = parseFloat(toOpacity);
        const startTime = Date.now();

        const fade = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const currentOpacity = startOpacity + (endOpacity - startOpacity) * progress;
            targetElement.style.opacity = currentOpacity;

            if (progress < 1) {
                requestAnimationFrame(fade);
            }
        };

        fade();
        console.log(`🎭 渐变效果，从 ${fromOpacity} 到 ${toOpacity}，持续 ${duration}ms`);
    }

    // 创建光晕效果
    createGlowEffect(x, y, radius, color, duration = 1000) {
        const startTime = Date.now();

        const glow = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            if (progress < 1) {
                this.ctx.save();
                this.ctx.shadowColor = color;
                this.ctx.shadowBlur = radius * (1 - progress);
                this.ctx.fillStyle = color;
                this.ctx.globalAlpha = 0.3 * (1 - progress);
                this.ctx.beginPath();
                this.ctx.arc(x, y, 5, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.restore();

                requestAnimationFrame(glow);
            }
        };

        glow();
        console.log(`💡 光晕效果在 (${x}, ${y})，半径: ${radius}，颜色: ${color}`);
    }

    // 加载图形质量设置
    loadQualitySettings() {
        const savedQuality = localStorage.getItem('graphicsQuality');
        if (savedQuality) {
            this.setGraphicsQuality(savedQuality);
        } else {
            this.setGraphicsQuality('high'); // 默认高质量
        }

        console.log("📥 图形质量设置已加载");
    }

    // 保存图形质量设置
    saveQualitySettings() {
        try {
            localStorage.setItem('graphicsQuality', this.graphicsQuality);
            console.log("💾 图形质量设置已保存");
        } catch (error) {
            console.warn("⚠️ 保存图形质量设置失败:", error);
        }
    }

    // 调整画布大小
    resizeCanvas(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;

        this.offscreenCanvas.width = width;
        this.offscreenCanvas.height = height;

        console.log(`📐 画布大小调整为 ${width}x${height}`);
    }

    // 获取系统状态
    getStatus() {
        return {
            isEffectsEnabled: this.isEffectsEnabled,
            graphicsQuality: this.graphicsQuality,
            activeParticleSystems: this.particleSystems.length,
            activeAnimations: this.animations.length,
            totalEffects: this.effects.length,
            canvasSize: {
                width: this.canvas.width,
                height: this.canvas.height
            }
        };
    }

    // 销毁系统
    destroy() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }

        this.particleSystems = [];
        this.animations = [];
        this.effects = [];

        console.log("🧹 图形增强系统已销毁");
    }
}

// 高级图形效果管理器
class AdvancedGraphicsManager extends GraphicsEnhancementSystem {
    constructor() {
        super();
        this.postProcessingEffects = [];
        this.lightingSystem = null;
        this.shaderEffects = [];

        this.setupAdvancedFeatures();
        console.log("🔮 高级图形管理器已初始化");
    }

    // 设置高级功能
    setupAdvancedFeatures() {
        this.setupLightingSystem();
        this.setupPostProcessing();

        console.log("⚙️ 高级图形功能已设置");
    }

    // 设置光照系统
    setupLightingSystem() {
        this.lightingSystem = {
            lights: [],
            ambientLight: 0.3, // 环境光强度

            addLight: (x, y, radius, color, intensity = 1) => {
                this.lightingSystem.lights.push({
                    x, y, radius, color, intensity,
                    id: Date.now() + Math.random()
                });
            },

            removeLight: (id) => {
                this.lightingSystem.lights = this.lightingSystem.lights.filter(light => light.id !== id);
            },

            render: (ctx, canvas) => {
                // 创建光照贴图
                const lightMap = document.createElement('canvas');
                lightMap.width = canvas.width;
                lightMap.height = canvas.height;
                const lightCtx = lightMap.getContext('2d');

                // 绘制环境光
                lightCtx.fillStyle = `rgba(0, 0, 0, ${1 - this.lightingSystem.ambientLight})`;
                lightCtx.fillRect(0, 0, canvas.width, canvas.height);

                // 绘制光源
                for (const light of this.lightingSystem.lights) {
                    const gradient = lightCtx.createRadialGradient(
                        light.x, light.y, 0,
                        light.x, light.y, light.radius
                    );
                    gradient.addColorStop(0, `${light.color}${Math.floor(light.intensity * 255).toString(16).padStart(2, '0')}`);
                    gradient.addColorStop(1, `${light.color}00`);

                    lightCtx.globalCompositeOperation = 'lighter';
                    lightCtx.fillStyle = gradient;
                    lightCtx.fillRect(0, 0, canvas.width, canvas.height);
                    lightCtx.globalCompositeOperation = 'source-over';
                }

                // 将光照应用到主画布
                ctx.save();
                ctx.globalCompositeOperation = 'multiply';
                ctx.drawImage(lightMap, 0, 0);
                ctx.restore();
            }
        };

        console.log("💡 光照系统已设置");
    }

    // 设置后期处理
    setupPostProcessing() {
        // 创建各种后期处理效果
        this.postProcessingEffects = {
            bloom: {
                enabled: false,
                intensity: 1.0,
                threshold: 0.8
            },
            motionBlur: {
                enabled: false,
                intensity: 0.5
            },
            chromaticAberration: {
                enabled: false,
                intensity: 0.01
            },
            vignette: {
                enabled: true,
                darkness: 0.3,
                smoothness: 0.2
            }
        };

        console.log("🎨 后期处理效果已设置");
    }

    // 添加灯光
    addLight(x, y, radius, color, intensity = 1) {
        if (this.lightingSystem) {
            this.lightingSystem.addLight(x, y, radius, color, intensity);
        }
    }

    // 移除灯光
    removeLight(id) {
        if (this.lightingSystem) {
            this.lightingSystem.removeLight(id);
        }
    }

    // 应用后期处理
    applyPostProcessing(ctx, canvas) {
        // 暗角效果
        if (this.postProcessingEffects.vignette.enabled) {
            this.applyVignetteEffect(ctx, canvas);
        }

        // 霓虹光效
        if (this.postProcessingEffects.bloom.enabled) {
            this.applyBloomEffect(ctx, canvas);
        }
    }

    // 应用暗角效果
    applyVignetteEffect(ctx, canvas) {
        const { darkness, smoothness } = this.postProcessingEffects.vignette;
        const gradient = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 0,
            canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
        );
        gradient.addColorStop(0, `rgba(0, 0, 0, 0)`);
        gradient.addColorStop(1 - smoothness, `rgba(0, 0, 0, 0)`);
        gradient.addColorStop(1, `rgba(0, 0, 0, ${darkness})`);

        ctx.save();
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
    }

    // 应用霓虹光效
    applyBloomEffect(ctx, canvas) {
        // 简化版的霓虹光效实现
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // 简单的提亮效果
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            // 检测明亮像素
            if (r > 200 || g > 200 || b > 200) {
                data[i] = Math.min(255, r + 50);     // R
                data[i + 1] = Math.min(255, g + 50); // G
                data[i + 2] = Math.min(255, b + 50); // B
            }
        }

        ctx.putImageData(imageData, 0, 0);
    }

    // 重写animate方法以包含高级效果
    animate() {
        if (!this.ctx) return;

        // 清除画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 更新和绘制动画
        this.updateAnimations();

        // 更新和绘制粒子
        this.drawParticles();

        // 绘制拖尾效果
        this.drawTrails();

        // 应用光照系统
        if (this.lightingSystem) {
            this.lightingSystem.render(this.ctx, this.canvas);
        }

        // 应用后期处理
        this.applyPostProcessing(this.ctx, this.canvas);

        // 继续动画循环
        this.animationFrameId = requestAnimationFrame(() => this.animate());
    }

    // 销毁高级功能
    destroy() {
        super.destroy();

        this.postProcessingEffects = null;
        this.lightingSystem = null;
        this.shaderEffects = [];

        console.log("🧹 高级图形管理器已销毁");
    }
}

// 初始化图形增强系统
const graphicsSystem = new AdvancedGraphicsManager();

// 将图形系统添加到全局作用域
window.GraphicsEnhancementSystem = GraphicsEnhancementSystem;
window.AdvancedGraphicsManager = AdvancedGraphicsManager;
window.graphicsSystem = graphicsSystem;

// 便捷函数
window.playAttackEffect = (x, y) => graphicsSystem.playAttackEffect(x, y);
window.playHitEffect = (x, y) => graphicsSystem.playHitEffect(x, y);
window.playWeaponPickupEffect = (x, y) => graphicsSystem.playWeaponPickupEffect(x, y);
window.playHealEffect = (x, y) => graphicsSystem.playHealEffect(x, y);
window.playCriticalEffect = (x, y) => graphicsSystem.playCriticalEffect(x, y);
window.screenShake = (intensity, duration) => graphicsSystem.screenShake(intensity, duration);
window.createBlinkEffect = (element, duration, interval) => graphicsSystem.createBlinkEffect(element, duration, interval);
window.createPulseEffect = (element, duration) => graphicsSystem.createPulseEffect(element, duration);

console.log("🚀 图形效果增强系统已完全加载");