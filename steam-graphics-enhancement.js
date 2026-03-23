// ==================== Steam版图形特效系统 ====================
//
// 为游戏添加丰富的图形特效，包括：
// 1. 粒子系统
// 2. 武器特效
// 3. 受伤特效
// 4. 爆炸特效
// 5. UI动画

class SteamGraphicsEnhancement {
    constructor() {
        this.particles = [];
        this.canvas = null;
        this.ctx = null;
        this.animationFrameId = null;
        this.effects = [];

        this.init();
    }

    init() {
        // 获取canvas上下文
        this.canvas = document.getElementById('gameCanvas');
        if (this.canvas) {
            this.ctx = this.canvas.getContext('2d');
        }

        // 初始化粒子系统
        this.initParticleSystem();

        // 初始化特效系统
        this.initEffectsSystem();

        // 启动渲染循环
        this.startRenderLoop();

        console.log("✨ 图形特效系统已初始化");
    }

    // 初始化粒子系统
    initParticleSystem() {
        this.particleTypes = {
            'hit': {
                color: ['#FF0000', '#FF4500', '#FF6347'],
                life: 20,
                size: { min: 2, max: 5 },
                velocity: { min: 1, max: 4 },
                gravity: 0.1
            },
            'heal': {
                color: ['#00FF00', '#32CD32', '#98FB98'],
                life: 30,
                size: { min: 3, max: 6 },
                velocity: { min: 0.5, max: 2 },
                gravity: -0.05
            },
            'levelup': {
                color: ['#FFD700', '#FFFF00', '#FFA500'],
                life: 40,
                size: { min: 4, max: 8 },
                velocity: { min: 1, max: 3 },
                gravity: 0
            },
            'weapon_pickup': {
                color: ['#4169E1', '#6495ED', '#87CEEB'],
                life: 25,
                size: { min: 3, max: 5 },
                velocity: { min: 1, max: 3 },
                gravity: 0.05
            },
            'enemy_death': {
                color: ['#808080', '#A9A9A9', '#C0C0C0'],
                life: 15,
                size: { min: 2, max: 4 },
                velocity: { min: 1, max: 5 },
                gravity: 0.15
            },
            'critical': {
                color: ['#FF00FF', '#DA70D6', '#FF69B4'],
                life: 15,
                size: { min: 5, max: 10 },
                velocity: { min: 2, max: 6 },
                gravity: 0
            },
            'elemental_fire': {
                color: ['#FF4500', '#FF6347', '#FFD700'],
                life: 25,
                size: { min: 3, max: 7 },
                velocity: { min: 1, max: 4 },
                gravity: -0.05
            },
            'elemental_ice': {
                color: ['#87CEEB', '#E0F6FF', '#B0E0E6'],
                life: 30,
                size: { min: 3, max: 6 },
                velocity: { min: 0.5, max: 2 },
                gravity: 0
            },
            'elemental_lightning': {
                color: ['#FFFF00', '#7CFC00', '#00FFFF'],
                life: 10,
                size: { min: 1, max: 3 },
                velocity: { min: 3, max: 8 },
                gravity: 0
            }
        };

        console.log("🌟 粒子系统已初始化");
    }

    // 初始化特效系统
    initEffectsSystem() {
        this.effectTypes = {
            'screen_shake': {
                duration: 10,
                intensity: 5,
                active: false
            },
            'flash_damage': {
                duration: 10,
                color: '#FF0000',
                active: false
            },
            'combo_counter': {
                duration: 120, // 2秒
                active: false
            }
        };

        console.log("🎬 特效系统已初始化");
    }

    // 创建粒子
    createParticle(x, y, type, count = 5) {
        if (!this.particleTypes[type]) return;

        const particleConfig = this.particleTypes[type];

        for (let i = 0; i < count; i++) {
            const particle = {
                x: x,
                y: y,
                size: Math.random() * (particleConfig.size.max - particleConfig.size.min) + particleConfig.size.min,
                color: particleConfig.color[Math.floor(Math.random() * particleConfig.color.length)],
                vx: (Math.random() - 0.5) * 2 * particleConfig.velocity.max,
                vy: (Math.random() - 0.5) * 2 * particleConfig.velocity.max,
                life: particleConfig.life,
                maxLife: particleConfig.life,
                gravity: particleConfig.gravity,
                type: type
            };

            this.particles.push(particle);
        }
    }

    // 更新粒子
    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];

            // 更新位置
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += particle.gravity; // 应用重力

            // 更新生命周期
            particle.life--;

            // 移除生命周期结束的粒子
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    // 绘制粒子
    drawParticles() {
        if (!this.ctx) return;

        this.particles.forEach(particle => {
            const alpha = particle.life / particle.maxLife;
            this.ctx.globalAlpha = alpha;

            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });

        this.ctx.globalAlpha = 1.0; // 重置透明度
    }

    // 创建屏幕震动效果
    createScreenShake(intensity = 5, duration = 10) {
        this.effectTypes.screen_shake.intensity = intensity;
        this.effectTypes.screen_shake.duration = duration;
        this.effectTypes.screen_shake.active = true;
    }

    // 创建伤害闪烁效果
    createDamageFlash() {
        this.effectTypes.flash_damage.duration = 10;
        this.effectTypes.flash_damage.active = true;
    }

    // 创建连击数字效果
    createComboEffect(x, y, combo) {
        if (combo < 2) return; // 只有连击数大于1才显示

        const effect = {
            type: 'combo_counter',
            x: x,
            y: y,
            text: `${combo} COMBO!`,
            life: 120, // 2秒
            maxLife: 120,
            fontSize: 20,
            color: combo >= 10 ? '#FFD700' : '#FFFFFF' // 10连击以上金色
        };

        this.effects.push(effect);
    }

    // 更新特效
    updateEffects() {
        // 更新屏幕震动
        if (this.effectTypes.screen_shake.active) {
            this.effectTypes.screen_shake.duration--;
            if (this.effectTypes.screen_shake.duration <= 0) {
                this.effectTypes.screen_shake.active = false;
            }
        }

        // 更新伤害闪烁
        if (this.effectTypes.flash_damage.active) {
            this.effectTypes.flash_damage.duration--;
            if (this.effectTypes.flash_damage.duration <= 0) {
                this.effectTypes.flash_damage.active = false;
            }
        }

        // 更新其他特效
        for (let i = this.effects.length - 1; i >= 0; i--) {
            const effect = this.effects[i];
            effect.life--;

            // 更新连击特效的位置（向上漂浮）
            if (effect.type === 'combo_counter') {
                effect.y -= 0.5; // 向上移动
                effect.fontSize = 20 + (1 - effect.life / effect.maxLife) * 10; // 开始时较大
            }

            if (effect.life <= 0) {
                this.effects.splice(i, 1);
            }
        }
    }

    // 绘制特效
    drawEffects() {
        if (!this.ctx) return;

        // 应用屏幕震动
        if (this.effectTypes.screen_shake.active) {
            const shakeX = (Math.random() - 0.5) * this.effectTypes.screen_shake.intensity;
            const shakeY = (Math.random() - 0.5) * this.effectTypes.screen_shake.intensity;

            // 通过变换整个画布来实现震动效果
            this.ctx.save();
            this.ctx.translate(shakeX, shakeY);
        }

        // 绘制伤害闪烁
        if (this.effectTypes.flash_damage.active) {
            const alpha = this.effectTypes.flash_damage.duration / 10;
            this.ctx.fillStyle = `rgba(255, 0, 0, ${alpha * 0.3})`;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }

        // 绘制其他特效
        this.effects.forEach(effect => {
            const alpha = effect.life / effect.maxLife;
            this.ctx.globalAlpha = alpha;

            if (effect.type === 'combo_counter') {
                this.ctx.font = `${effect.fontSize}px Arial`;
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';

                // 添加阴影效果
                this.ctx.shadowColor = 'black';
                this.ctx.shadowBlur = 5;
                this.ctx.shadowOffsetX = 2;
                this.ctx.shadowOffsetY = 2;

                this.ctx.fillStyle = effect.color;
                this.ctx.fillText(effect.text, effect.x, effect.y);

                // 重置阴影
                this.ctx.shadowColor = 'transparent';
                this.ctx.shadowBlur = 0;
            }
        });

        this.ctx.globalAlpha = 1.0; // 重置透明度

        // 如果应用了震动变换，恢复
        if (this.effectTypes.screen_shake.active) {
            this.ctx.restore();
        }
    }

    // 启动渲染循环
    startRenderLoop() {
        const render = () => {
            if (this.ctx) {
                this.updateParticles();
                this.updateEffects();
                this.drawParticles();
                this.drawEffects();
            }

            this.animationFrameId = requestAnimationFrame(render);
        };

        render();
    }

    // 销毁系统
    destroy() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        this.particles = [];
        this.effects = [];
        console.log("🧹 图形特效系统已销毁");
    }

    // 公共API方法

    // 敌人受伤特效
    enemyHitEffect(x, y, isCritical = false) {
        if (isCritical) {
            this.createParticle(x, y, 'critical', 15);
            this.createScreenShake(3, 8);
        } else {
            this.createParticle(x, y, 'hit', 8);
        }
    }

    // 玩家受伤特效
    playerHitEffect(x, y) {
        this.createParticle(x, y, 'hit', 12);
        this.createDamageFlash();
        this.createScreenShake(2, 5);
    }

    // 武器拾取特效
    weaponPickupEffect(x, y) {
        this.createParticle(x, y, 'weapon_pickup', 10);
        this.createScreenShake(1, 3);
    }

    // 升级特效
    levelUpEffect(x, y) {
        this.createParticle(x, y, 'levelup', 20);
        this.createScreenShake(4, 10);
    }

    // 敌人死亡特效
    enemyDeathEffect(x, y) {
        this.createParticle(x, y, 'enemy_death', 15);
    }

    // 治疗特效
    healEffect(x, y) {
        this.createParticle(x, y, 'heal', 10);
    }

    // 元素特效
    elementalEffect(x, y, elementType) {
        const effectType = `elemental_${elementType}`;
        if (this.particleTypes[effectType]) {
            this.createParticle(x, y, effectType, 8);
        }
    }

    // 连击特效
    comboEffect(x, y, combo) {
        this.createComboEffect(x, y, combo);
    }

    // 爆炸特效
    explosionEffect(x, y, size = 50) {
        // 中心爆炸粒子
        this.createParticle(x, y, 'hit', 25);

        // 环形扩散粒子
        for (let i = 0; i < 36; i++) {
            const angle = (i / 36) * Math.PI * 2;
            const px = x + Math.cos(angle) * size;
            const py = y + Math.sin(angle) * size;
            this.createParticle(px, py, 'hit', 3);
        }

        this.createScreenShake(5, 12);
    }
}

// 创建全局实例
window.steamGraphicsEnhancement = new SteamGraphicsEnhancement();

// 与游戏逻辑集成
if (typeof showCombatLog !== 'undefined') {
    // 保存原始函数
    const originalShowCombatLog = window.showCombatLog;

    // 扩展showCombatLog函数以添加视觉反馈
    window.showCombatLog = function(text, className) {
        originalShowCombatLog(text, className);

        // 根据不同类型触发相应的视觉效果
        const playerX = window.gameState?.player?.x || 400;
        const playerY = window.gameState?.player?.y || 300;

        switch(className) {
            case 'weapon-get':
                if (window.steamGraphicsEnhancement) {
                    window.steamGraphicsEnhancement.weaponPickupEffect(playerX, playerY);
                }
                break;
            case 'level-up':
                if (window.steamGraphicsEnhancement) {
                    window.steamGraphicsEnhancement.levelUpEffect(playerX, playerY);
                }
                break;
            case 'enemy-death':
                if (window.gameState && window.gameState.lastHitEnemy) {
                    if (window.steamGraphicsEnhancement) {
                        window.steamGraphicsEnhancement.enemyDeathEffect(
                            window.gameState.lastHitEnemy.x,
                            window.gameState.lastHitEnemy.y
                        );
                    }
                }
                break;
            case 'critical-hit':
                if (window.gameState && window.gameState.lastHitEnemy) {
                    if (window.steamGraphicsEnhancement) {
                        window.steamGraphicsEnhancement.enemyHitEffect(
                            window.gameState.lastHitEnemy.x,
                            window.gameState.lastHitEnemy.y,
                            true
                        );
                    }
                }
                break;
            case 'hit':
                if (window.gameState && window.gameState.lastHitEnemy) {
                    if (window.steamGraphicsEnhancement) {
                        window.steamGraphicsEnhancement.enemyHitEffect(
                            window.gameState.lastHitEnemy.x,
                            window.gameState.lastHitEnemy.y
                        );
                    }
                }
                break;
            case 'heal':
                if (window.steamGraphicsEnhancement) {
                    window.steamGraphicsEnhancement.healEffect(playerX, playerY);
                }
                break;
            case 'combo-reward':
                if (window.gameState && window.gameState.player) {
                    if (window.steamGraphicsEnhancement) {
                        window.steamGraphicsEnhancement.comboEffect(
                            window.gameState.player.x,
                            window.gameState.player.y,
                            window.gameState.player.combo || 0
                        );
                    }
                }
                break;
        }
    };
}

// 如果游戏有伤害处理函数，集成视觉效果
if (typeof takeDamage !== 'undefined') {
    const originalTakeDamage = window.takeDamage;
    window.takeDamage = function(damage) {
        const result = originalTakeDamage(damage);

        // 添加受伤视觉效果
        if (window.gameState?.player && window.steamGraphicsEnhancement) {
            window.steamGraphicsEnhancement.playerHitEffect(
                window.gameState.player.x,
                window.gameState.player.y
            );
        }

        return result;
    };
}

// 如果有攻击函数，集成视觉效果
if (typeof attackEnemy !== 'undefined') {
    const originalAttackEnemy = window.attackEnemy;
    window.attackEnemy = function(enemy, weapon) {
        // 记录攻击的敌人，用于后续特效
        if (window.gameState) {
            window.gameState.lastHitEnemy = enemy;
        }

        const result = originalAttackEnemy(enemy, weapon);

        // 根据武器类型添加元素特效
        if (weapon && weapon.effects && window.steamGraphicsEnhancement) {
            weapon.effects.forEach(effect => {
                if (effect === 'fire' || effect === 'ice' || effect === 'lightning') {
                    window.steamGraphicsEnhancement.elementalEffect(enemy.x, enemy.y, effect);
                }
            });
        }

        return result;
    };
}

console.log("Steam版图形特效系统已准备就绪，为游戏增添绚丽视觉体验");