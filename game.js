// 武器替换者 - Weapon Rogue
// 核心玩法：敌人掉落的武器必定替换当前武器

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

// ==================== 游戏数据 ====================

// 武器库 - 从垃圾到神器
const WEAPONS = [
    // Common weapons (普通)
    { name: '生锈的刀', damage: 5, rarity: 'common', color: '#888' },
    { name: '木棍', damage: 3, rarity: 'common', color: '#8B4513' },
    { name: '破布条', damage: 2, rarity: 'common', color: '#aaa' },
    { name: '旧扫帚', damage: 4, rarity: 'common', color: '#A0522D' },
    { name: '石头', damage: 6, rarity: 'common', color: '#808080' },
    { name: '生锈的叉子', damage: 4, rarity: 'common', color: '#C0C0C0' },
    { name: '破碎的瓶子', damage: 5, rarity: 'common', color: '#7CFC00' },
    { name: '铁勺', damage: 3, rarity: 'common', color: '#696969' },
    { name: '木板', damage: 6, rarity: 'common', color: '#D2B48C' },
    { name: '废纸团', damage: 1, rarity: 'common', color: '#FFFFE0' },
    { name: '削尖的树枝', damage: 4, rarity: 'common', color: '#8FBC8F' },
    { name: '旧拖鞋', damage: 2, rarity: 'common', color: '#696969' },
    { name: '生锈的剪刀', damage: 5, rarity: 'common', color: '#C0C0C0' },
    { name: '玻璃片', damage: 7, rarity: 'common', color: '#00CED1' },
    { name: '破碗碎片', damage: 5, rarity: 'common', color: '#F5DEB3' },

    // Uncommon weapons (不常见)
    { name: '铁剑', damage: 10, rarity: 'uncommon', color: '#silver' },
    { name: '钢斧', damage: 15, rarity: 'uncommon', color: '#666' },
    { name: '长矛', damage: 12, rarity: 'uncommon', color: '#888888' },
    { name: '铜制短剑', damage: 11, rarity: 'uncommon', color: '#B87333' },
    { name: '精制弓箭', damage: 14, rarity: 'uncommon', color: '#8B4513' },
    { name: '小手斧', damage: 13, rarity: 'uncommon', color: '#A9A9A9' },
    { name: '猎人之弩', damage: 16, rarity: 'uncommon', color: '#654321' },
    { name: '钢钉锤', damage: 12, rarity: 'uncommon', color: '#2F4F4F' },
    { name: '双刃匕首', damage: 13, rarity: 'uncommon', color: '#DCDCDC' },
    { name: '轻便弯刀', damage: 11, rarity: 'uncommon', color: '#FFD700' },
    { name: '青铜战锤', damage: 14, rarity: 'uncommon', color: '#CD853F' },
    { name: '强化木杖', damage: 10, rarity: 'uncommon', color: '#DAA520' },
    { name: '双头长枪', damage: 15, rarity: 'uncommon', color: '#C0C0C0' },
    { name: '铁齿狼牙棒', damage: 16, rarity: 'uncommon', color: '#708090' },
    { name: '硬化骨刀', damage: 12, rarity: 'uncommon', color: '#F5F5DC' },

    // Rare weapons (稀有)
    { name: '秘银剑', damage: 25, rarity: 'rare', color: '#00ffff' },
    { name: '火焰之刃', damage: 30, rarity: 'rare', color: '#ff4500' },
    { name: '冰霜之刺', damage: 28, rarity: 'rare', color: '#0080ff' },
    { name: '雷鸣法杖', damage: 32, rarity: 'rare', color: '#FFFF00' },
    { name: '毒蛇匕首', damage: 31, rarity: 'rare', color: '#32CD32' },
    { name: '暗影之爪', damage: 33, rarity: 'rare', color: '#4B0082' },
    { name: '神圣十字弓', damage: 34, rarity: 'rare', color: '#F0E68C' },
    { name: '龙鳞剑', damage: 35, rarity: 'rare', color: '#FF6347' },
    { name: '星辰法杖', damage: 36, rarity: 'rare', color: '#8A2BE2' },
    { name: '风暴战锤', damage: 37, rarity: 'rare', color: '#7CFC00' },
    { name: '血月镰刀', damage: 38, rarity: 'rare', color: '#8B0000' },
    { name: '翡翠刃', damage: 32, rarity: 'rare', color: '#00FF7F' },
    { name: '紫金权杖', damage: 33, rarity: 'rare', color: '#DA70D6' },
    { name: '极地之矛', damage: 35, rarity: 'rare', color: '#E0FFFF' },
    { name: '熔岩巨剑', damage: 39, rarity: 'rare', color: '#FF4500' },

    // Epic weapons (史诗)
    { name: '暗影匕首', damage: 35, rarity: 'epic', color: '#8b00ff' },
    { name: '圣光之剑', damage: 40, rarity: 'epic', color: '#ffd700' },
    { name: '死神之镰', damage: 45, rarity: 'epic', color: '#000000' },
    { name: '天使之翼剑', damage: 48, rarity: 'epic', color: '#FFFFFF' },
    { name: '远古龙枪', damage: 50, rarity: 'epic', color: '#4169E1' },
    { name: '时光之刃', damage: 47, rarity: 'epic', color: '#9370DB' },
    { name: '末日审判槌', damage: 46, rarity: 'epic', color: '#BDB76B' },
    { name: '彩虹魔杖', damage: 52, rarity: 'epic', color: '#FF69B4' },
    { name: '混沌之刃', damage: 55, rarity: 'epic', color: '#663399' },
    { name: '创世之斧', damage: 53, rarity: 'epic', color: '#8B4513' },

    // Legendary weapons (传说)
    { name: '龙息巨剑', damage: 50, rarity: 'legendary', color: '#ff0000' },
    { name: '神之刃', damage: 100, rarity: 'legendary', color: '#ffffff' },
    { name: '毁天灭地杖', damage: 85, rarity: 'legendary', color: '#FF00FF' },
    { name: '宇宙终结者', damage: 90, rarity: 'legendary', color: '#0000FF' },
    { name: '万物之主', damage: 75, rarity: 'legendary', color: '#228B22' },
    { name: '永恒守护', damage: 60, rarity: 'legendary', color: '#FFD700' },
    { name: '虚无之吻', damage: 80, rarity: 'legendary', color: '#36454F' },

    // Mythic weapons (神话)
    { name: '开发者之剑', damage: 999, rarity: 'mythic', color: '#ff00ff' },
    { name: '元神之剑', damage: 500, rarity: 'mythic', color: '#FF1493' },
];

const RARITY_WEIGHTS = {
    common: 50,
    uncommon: 30,
    rare: 15,
    epic: 4,
    legendary: 0.9,
    mythic: 0.1
};

// 药水系统
const POTIONS = [
    { name: '生命药水', effect: 'heal', value: 30, color: '#ff0000' },
    { name: '武器保护剂', effect: 'protect', duration: 3, color: '#00ff00' }, // 保护下次不替换
    { name: '幸运药水', effect: 'luck', duration: 5, color: '#ffd700' }, // 提高稀有度
    { name: '力量药水', effect: 'damage', duration: 5, value: 10, color: '#ff8800' },
];

// 遗物系统
const RELICS = [
    { name: '贪婪护符', effect: 'better_drops', desc: '掉落武器稀有度提升' },
    { name: '记忆水晶', effect: 'remember', desc: '可以保留上一个武器' },
    { name: '时间沙漏', effect: 'slow_replace', desc: '武器替换延迟 3 秒' },
    { name: '双生宝石', effect: 'dual_wield', desc: '可以同时持有两个武器' },
    { name: '命运之轮', effect: 'choice', desc: '可以从两个掉落中选择一个' },
];

// ==================== 游戏状态 ====================

let gameState = {
    player: {
        hp: 100,
        maxHp: 100,
        weapon: null,
        weapons: [], // 双持时用
        lastWeapon: null, // 记忆水晶用
        attackRange: 80, // 攻击范围
        attackCooldown: 0, // 攻击冷却
        lastHitTime: 0, // 上次命中时间
        combo: 0, // 连击数
        maxCombo: 0, // 最大连击数
        score: 0, // 得分
    },
    level: 1,
    kills: 0,
    potions: [],
    relics: [],
    buffs: [],
    enemies: [],
    drops: [],
    projectiles: [],
    particles: [],
    isPlaying: false,
    isGameOver: false,
    screenShake: 0, // 屏幕震动
};

// ==================== 工具函数 ====================

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

function getDistance(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

// 技能系统
const SKILLS = {
    Q: {
        name: '旋风斩',
        cooldown: 300, // 5秒 (60fps * 5)
        effect: 'aoe_damage',
        description: '对周围所有敌人造成2倍武器伤害'
    },
    W: {
        name: '治疗光环',
        cooldown: 480, // 8秒
        effect: 'heal',
        description: '恢复30%最大生命值'
    },
    E: {
        name: '闪现',
        cooldown: 240, // 4秒
        effect: 'teleport',
        description: '瞬间传送到鼠标位置'
    },
    R: {
        name: '狂暴',
        cooldown: 600, // 10秒
        effect: 'berserk',
        description: '接下来5秒内伤害翻倍'
    }
};

// 技能状态管理
const skillCooldowns = {
    Q: 0,
    W: 0,
    E: 0,
    R: 0
};

// 激活技能
function useSkill(skillKey) {
    if (skillCooldowns[skillKey] > 0) return false; // 技能还在冷却中

    const skill = SKILLS[skillKey];
    let success = false;

    switch (skill.effect) {
        case 'aoe_damage':
            // 旋风斩 - 对周围敌人造成伤害
            let hitEnemies = 0;
            const weaponDamage = gameState.player.weapon ? gameState.player.weapon.damage : 5;
            const aoeRadius = 100; // 作用半径

            for (let i = gameState.enemies.length - 1; i >= 0; i--) {
                const enemy = gameState.enemies[i];
                const distance = getDistance(player, enemy);

                if (distance <= aoeRadius) {
                    enemy.hp -= weaponDamage * 2; // 2倍武器伤害
                    createParticles(enemy.x, enemy.y, '#FF4500', 8);

                    if (enemy.hp <= 0) {
                        // 敌人死亡处理
                        let enemyScore = Math.floor(enemy.maxHp / 10);
                        switch(enemy.type) {
                            case 'MELEE': enemyScore += 10; break;
                            case 'RANGED': enemyScore += 20; break;
                            case 'ELITE': enemyScore += 50; break;
                            case 'BOSS': enemyScore += 100; break;
                        }
                        gameState.player.score += enemyScore;

                        gameState.kills++;
                        if (gameState.kills % 10 === 0) {
                            gameState.level++;
                            showCombatLog(`🎉 升级到第 ${gameState.level} 关！`, 'weapon-get');
                        }

                        gameState.enemies.splice(i, 1);
                    }
                    hitEnemies++;
                }
            }

            if (hitEnemies > 0) {
                showCombatLog(`🌀 ${skill.name} 击中 ${hitEnemies} 个敌人!`, 'weapon-get');
                success = true;
            } else {
                showCombatLog(`🌀 ${skill.name} 没有击中任何敌人`, 'weapon-lose');
            }
            break;

        case 'heal':
            // 治疗光环
            const healAmount = Math.floor(gameState.player.maxHp * 0.3);
            gameState.player.hp = Math.min(gameState.player.maxHp, gameState.player.hp + healAmount);
            createParticles(player.x, player.y, '#00FF00', 20);
            showCombatLog(`💚 ${skill.name} 恢复 ${healAmount} 生命!`, 'weapon-get');
            success = true;
            break;

        case 'teleport':
            // 闪现到鼠标位置
            const distance = getDistance(player, {x: mouseX, y: mouseY});
            const teleportDistance = Math.min(distance, 150); // 最大传送距离

            const angle = Math.atan2(mouseY - player.y, mouseX - player.x);
            player.x += Math.cos(angle) * teleportDistance;
            player.y += Math.sin(angle) * teleportDistance;

            // 边界检查
            player.x = Math.max(player.size, Math.min(canvas.width - player.size, player.x));
            player.y = Math.max(player.size, Math.min(canvas.height - player.size, player.y));

            createParticles(player.x, player.y, '#8A2BE2', 15);
            showCombatLog(`✨ ${skill.name} 成功传送!`, 'weapon-get');
            success = true;
            break;

        case 'berserk':
            // 狂暴状态
            gameState.buffs.push({
                effect: 'damage',
                duration: 5, // 5秒
                value: gameState.player.weapon ? gameState.player.weapon.damage : 10
            });
            createParticles(player.x, player.y, '#FF0000', 25);
            showCombatLog(`😠 ${skill.name} 开启，伤害翻倍!`, 'weapon-get');
            success = true;
            break;
    }

    if (success) {
        skillCooldowns[skillKey] = skill.cooldown;
        return true;
    }
    return false;
}

// 更新技能冷却
function updateSkillCooldowns() {
    for (const key in skillCooldowns) {
        if (skillCooldowns[key] > 0) {
            skillCooldowns[key]--;
        }
    }
}

// 技能冷却显示
function drawSkillCooldowns() {
    const skillKeys = ['Q', 'W', 'E', 'R'];
    const keyPositions = [
        {x: 50, y: canvas.height - 50},
        {x: 100, y: canvas.height - 50},
        {x: 150, y: canvas.height - 50},
        {x: 200, y: canvas.height - 50}
    ];

    for (let i = 0; i < skillKeys.length; i++) {
        const key = skillKeys[i];
        const pos = keyPositions[i];
        const cooldown = skillCooldowns[key];
        const maxCooldown = SKILLS[key].cooldown;

        // 绘制技能按钮背景
        ctx.fillStyle = cooldown > 0 ? '#555' : '#000';
        ctx.globalAlpha = 0.7;
        ctx.fillRect(pos.x - 20, pos.y - 20, 40, 40);
        ctx.globalAlpha = 1;

        // 绘制按键字母
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(key, pos.x, pos.y);

        // 绘制冷却进度
        if (cooldown > 0) {
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 18, -Math.PI/2, (-Math.PI/2) + (Math.PI * 2 * (cooldown/maxCooldown)));
            ctx.stroke();

            // 显示剩余时间
            const secondsLeft = Math.ceil(cooldown / 60);
            ctx.fillStyle = '#fff';
            ctx.font = '12px Arial';
            ctx.fillText(secondsLeft.toString(), pos.x, pos.y + 25);
        }
    }
}

// 生成随机武器
function generateWeapon() {
    const rarity = getRandomRarity();
    const weaponsOfRarity = WEAPONS.filter(w => w.rarity === rarity);
    const weapon = weaponsOfRarity[randomInt(0, weaponsOfRarity.length - 1)];
    return { ...weapon, id: Date.now() + Math.random() };
}

// ==================== 实体类 ====================

class Player {
    constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.size = 30;
        this.speed = 5;
        this.color = '#4ade80';
    }
    
    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制当前武器
        if (gameState.player.weapon) {
            ctx.fillStyle = gameState.player.weapon.color;
            ctx.fillRect(this.x + 20, this.y - 5, 25, 8);
        }
    }
    
    update() {
        // 玩家跟随鼠标
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > 5) {
            this.x += (dx / dist) * this.speed;
            this.y += (dy / dist) * this.speed;
        }
        
        // 边界限制
        this.x = Math.max(this.size, Math.min(canvas.width - this.size, this.x));
        this.y = Math.max(this.size, Math.min(canvas.height - this.size, this.y));
    }
}

// 定义敌人类型
const ENEMY_TYPES = {
    MELEE: { name: '近战', speed: 1.5, hp: 1, damage: 1, size: 1, behavior: 'melee' },
    RANGED: { name: '远程', speed: 0.8, hp: 0.7, damage: 1.5, size: 0.8, behavior: 'ranged' },
    ELITE: { name: '精英', speed: 1.2, hp: 2, damage: 1.8, size: 1.5, behavior: 'melee' },
    BOSS: { name: 'Boss', speed: 1.0, hp: 5, damage: 2.5, size: 2.0, behavior: 'mixed' },
};

class Enemy {
    constructor(level, type = null) {
        if (type === null) {
            // 随机选择敌人类型，越到后面精英和Boss出现几率越高
            const rand = Math.random();
            if (level < 3 && rand < 0.7) {
                type = 'MELEE';
            } else if (level < 5 && rand < 0.85) {
                type = 'RANGED';
            } else if (level < 10 && rand < 0.95) {
                type = 'ELITE';
            } else if (rand < 0.98) {
                type = 'BOSS';
            } else {
                type = ['MELEE', 'RANGED', 'ELITE'][randomInt(0, 2)];
            }
        }

        this.type = type;
        this.config = ENEMY_TYPES[type];

        this.size = Math.floor(20 * this.config.size + randomInt(0, 15));
        this.x = Math.random() < 0.5 ? -this.size : canvas.width + this.size;
        this.y = randomInt(0, canvas.height);
        this.speed = randomFloat(0.5 + this.config.speed, 1.5 + this.config.speed + level * 0.1);
        this.hp = Math.floor((20 + level * 8) * this.config.hp);
        this.maxHp = this.hp;
        this.damage = Math.floor((5 + level * 1.5) * this.config.damage);
        this.color = this.getEnemyColor();
        this.weapon = generateWeapon();

        // 对于远程敌人，添加射击属性
        this.shootCooldown = 0;
        this.projectileSpeed = 3;
    }

    getEnemyColor() {
        switch(this.type) {
            case 'MELEE': return `hsl(${randomInt(0, 20)}, 70%, 50%)`; // 橙色系
            case 'RANGED': return `hsl(${randomInt(200, 260)}, 70%, 50%)`; // 蓝色系
            case 'ELITE': return `hsl(${randomInt(270, 330)}, 70%, 50%)`; // 紫色系
            case 'BOSS': return `hsl(${randomInt(330, 360)}, 80%, 45%)`; // 红色系
            default: return `hsl(${randomInt(0, 60)}, 70%, 50%)`;
        }
    }

    draw() {
        // 绘制敌人主体
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // 绘制边框
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // 绘制敌人类型标识
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fff';
        let typeSymbol = '?';
        switch(this.type) {
            case 'MELEE': typeSymbol = '⚔️'; break;
            case 'RANGED': typeSymbol = '🏹'; break;
            case 'ELITE': typeSymbol = '👑'; break;
            case 'BOSS': typeSymbol = '👹'; break;
        }
        ctx.fillText(typeSymbol, this.x, this.y + 4);

        // 血条
        const hpPercent = this.hp / this.maxHp;
        ctx.fillStyle = '#333';
        ctx.fillRect(this.x - 25, this.y - this.size - 15, 50, 8);
        ctx.fillStyle = hpPercent > 0.5 ? '#0f0' : hpPercent > 0.25 ? '#ff0' : '#f00';
        ctx.fillRect(this.x - 25, this.y - this.size - 15, 50 * hpPercent, 8);

        // 武器指示
        ctx.fillStyle = this.weapon.color;
        ctx.fillRect(this.x - 15, this.y + this.size + 8, 30, 6);
    }

    update() {
        const dx = gameState.player.x - this.x;
        const dy = gameState.player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (this.config.behavior === 'ranged' && dist > 100) {
            // 远程敌人保持距离
            this.x -= (dx / dist) * this.speed * 0.5;
            this.y -= (dy / dist) * this.speed * 0.5;
        } else {
            // 近战敌人靠近玩家
            this.x += (dx / dist) * this.speed;
            this.y += (dy / dist) * this.speed;
        }

        // 远程敌人射击逻辑
        if (this.config.behavior === 'ranged' || this.config.behavior === 'mixed') {
            this.shootCooldown--;
            if (this.shootCooldown <= 0 && dist < 200) {
                this.shootAtPlayer();
                this.shootCooldown = 60; // 每秒射击一次
            }
        }
    }

    shootAtPlayer() {
        // 创建射弹向玩家方向发射
        const angle = Math.atan2(
            gameState.player.y - this.y,
            gameState.player.x - this.x
        );

        const projectile = {
            x: this.x,
            y: this.y,
            speed: this.projectileSpeed,
            dx: Math.cos(angle) * this.projectileSpeed,
            dy: Math.sin(angle) * this.projectileSpeed,
            size: 6,
            color: this.color,
            damage: Math.floor(this.damage * 0.5)
        };

        gameState.projectiles.push(projectile);
    }
}

class Drop {
    constructor(x, y, item, type) {
        this.x = x;
        this.y = y;
        this.item = item;
        this.type = type; // 'weapon', 'potion', 'relic'
        this.size = 20;
        this.bobOffset = 0;
    }
    
    draw() {
        this.bobOffset += 0.1;
        const bobY = Math.sin(this.bobOffset) * 5;
        
        ctx.fillStyle = this.type === 'weapon' ? this.item.color : 
                       this.type === 'potion' ? '#ff0000' : '#ffd700';
        ctx.beginPath();
        ctx.arc(this.x, this.y + bobY, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // 发光效果
        ctx.strokeStyle = ctx.fillStyle;
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

class Particle {
    constructor(x, y, color, type = 'standard') {
        this.x = x;
        this.y = y;
        this.color = color;
        this.type = type; // 'standard', 'sparkle', 'smoke', 'explosion'

        switch(type) {
            case 'sparkle':
                this.size = randomInt(2, 4);
                this.speedX = randomFloat(-8, 8);
                this.speedY = randomFloat(-8, 8);
                this.life = 1;
                this.decay = randomFloat(0.01, 0.03);
                this.gravity = 0.1;
                break;
            case 'smoke':
                this.size = randomInt(5, 12);
                this.speedX = randomFloat(-2, 2);
                this.speedY = randomFloat(-3, -1);
                this.life = 1;
                this.decay = randomFloat(0.005, 0.015);
                this.gravity = 0.05;
                break;
            case 'explosion':
                this.size = randomInt(6, 15);
                this.speedX = randomFloat(-10, 10);
                this.speedY = randomFloat(-10, 10);
                this.life = 1;
                this.decay = randomFloat(0.02, 0.05);
                this.gravity = 0.02;
                break;
            case 'standard':
            default:
                this.size = randomInt(3, 8);
                this.speedX = randomFloat(-5, 5);
                this.speedY = randomFloat(-5, 5);
                this.life = 1;
                this.decay = randomFloat(0.02, 0.05);
                this.gravity = 0;
        }
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= this.decay;

        // 应用重力
        if (this.gravity !== 0) {
            this.speedY += this.gravity;
        }

        // 阻力效果
        this.speedX *= 0.98;
        this.speedY *= 0.98;
    }

    draw() {
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;

        // 根据粒子类型绘制不同的形状
        switch(this.type) {
            case 'sparkle':
                // 绘制闪光点
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();

                // 添加发光效果
                ctx.shadowColor = this.color;
                ctx.shadowBlur = 10;
                ctx.fill();
                ctx.shadowBlur = 0;
                break;
            case 'smoke':
                // 绘制烟雾
                ctx.globalAlpha = this.life * 0.5;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'explosion':
                // 绘制爆炸效果
                const gradient = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, this.size
                );
                gradient.addColorStop(0, this.color);
                gradient.addColorStop(0.7, lightenColor(this.color, 50));
                gradient.addColorStop(1, 'transparent');

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'standard':
            default:
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
        }

        ctx.globalAlpha = 1;
    }
}

// 辅助函数：颜色变亮
function lightenColor(color, percent) {
    // 简化版本，如果输入的是十六进制颜色
    if (color.startsWith('#')) {
        let num = parseInt(color.slice(1), 16);
        let amt = Math.round(2.55 * percent);
        let R = (num >> 16) + amt;
        let G = (num >> 8 & 0x00FF) + amt;
        let B = (num & 0x0000FF) + amt;

        R = (R < 255) ? R : 255;
        G = (G < 255) ? G : 255;
        B = (B < 255) ? B : 255;

        R = Math.max(0, R);
        G = Math.max(0, G);
        B = Math.max(0, B);

        const RR = ((R.toString(16).length === 1) ? "0" + R.toString(16) : R.toString(16));
        const GG = ((G.toString(16).length === 1) ? "0" + G.toString(16) : G.toString(16));
        const BB = ((B.toString(16).length === 1) ? "0" + B.toString(16) : B.toString(16));

        return "#" + RR + GG + BB;
    }
    return color; // 如果不是十六进制颜色，返回原色
}

// 创建更丰富的粒子效果
function createParticles(x, y, color, count, type = 'standard') {
    for (let i = 0; i < count; i++) {
        gameState.particles.push(new Particle(x, y, color, type));
    }
}

// 增强的屏幕震动功能
function shakeScreen(intensity, duration) {
    gameState.screenShake = intensity;
    // 在duration毫秒后逐渐减少震动
    setTimeout(() => {
        if (gameState.screenShake > 0) {
            gameState.screenShake = Math.max(0, gameState.screenShake - 1);
        }
    }, duration);
}

// ==================== 游戏逻辑 ====================

const player = new Player();
let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});

// 点击拾取或攻击
canvas.addEventListener('click', () => {
    if (!gameState.isPlaying || gameState.isGameOver) return;

    // 检查是否点击到掉落物
    let clickedOnItem = false;
    for (let i = gameState.drops.length - 1; i >= 0; i--) {
        const drop = gameState.drops[i];
        if (getDistance(player, drop) < player.size + drop.size) {
            collectDrop(drop);
            gameState.drops.splice(i, 1);
            clickedOnItem = true;
        }
    }

    // 如果没有点击到物品，则进行攻击
    if (!clickedOnItem) {
        attackEnemies();
    }
});

function collectDrop(drop) {
    if (drop.type === 'weapon') {
        replaceWeapon(drop.item);
    } else if (drop.type === 'potion') {
        usePotion(drop.item);
    } else if (drop.type === 'relic') {
        collectRelic(drop.item);
    }

    createParticles(drop.x, drop.y, drop.item.color || '#fff', 15, 'sparkle');
}

function replaceWeapon(newWeapon) {
    const oldWeapon = gameState.player.weapon;

    // 检查保护buff
    const protectIndex = gameState.buffs.findIndex(b => b.effect === 'protect');
    if (protectIndex !== -1) {
        gameState.buffs.splice(protectIndex, 1);
        showCombatLog(`🛡️ 武器保护生效！保留了 ${oldWeapon?.name || '无'} `, 'weapon-lose');
        return;
    }

    // 记忆水晶效果
    if (gameState.relics.some(r => r.effect === 'remember')) {
        gameState.player.lastWeapon = oldWeapon;
    }

    gameState.player.weapon = newWeapon;

    const logMsg = oldWeapon
        ? `💔 失去 ${oldWeapon.name} → ⚔️ 获得 ${newWeapon.name}`
        : `⚔️ 获得 ${newWeapon.name}`;

    const logClass = newWeapon.damage > (oldWeapon?.damage || 0) ? 'weapon-get' : 'weapon-lose';
    showCombatLog(logMsg, logClass);

    // 更好的粒子效果
    createParticles(player.x, player.y, newWeapon.color, 20, 'explosion');
}

function usePotion(potion) {
    switch (potion.effect) {
        case 'heal':
            gameState.player.hp = Math.min(gameState.player.maxHp, gameState.player.hp + potion.value);
            showCombatLog(`💚 使用 ${potion.name}，恢复 ${potion.value} 生命`, 'weapon-get');
            break;
        case 'protect':
            gameState.buffs.push({ effect: 'protect', duration: potion.duration });
            showCombatLog(`🛡️ 使用 ${potion.name}，下次武器替换免疫`, 'weapon-get');
            break;
        case 'luck':
            gameState.buffs.push({ effect: 'luck', duration: potion.duration });
            showCombatLog(`✨ 使用 ${potion.name}，幸运提升！`, 'weapon-get');
            break;
        case 'damage':
            gameState.buffs.push({ effect: 'damage', duration: potion.duration, value: potion.value });
            showCombatLog(`💪 使用 ${potion.name}，攻击力 +${potion.value}`, 'weapon-get');
            break;
    }
    updateUI();
}

function collectRelic(relic) {
    gameState.relics.push(relic);
    showCombatLog(`🏺 获得遗物：${relic.name} - ${relic.desc}`, 'weapon-get');
    updateUI();
}

function createParticles(x, y, color, count) {
    for (let i = 0; i < count; i++) {
        gameState.particles.push(new Particle(x, y, color));
    }
}

function showCombatLog(text, className) {
    let logEl = document.getElementById('combat-log');
    if (!logEl) {
        logEl = document.createElement('div');
        logEl.id = 'combat-log';
        logEl.className = 'combat-log';
        document.getElementById('game-container').appendChild(logEl);
    }
    
    logEl.innerHTML = `<span class="${className}">${text}</span>`;
    logEl.style.opacity = '1';
    
    setTimeout(() => {
        logEl.style.opacity = '0';
    }, 2000);
}

function updateComboTimer() {
    const currentTime = Date.now();
    const timeDiff = currentTime - gameState.player.lastHitTime;

    // 如果超过3秒没有击中敌人，则重置连击
    if (timeDiff > 3000 && gameState.player.combo > 0) {
        resetCombo();
    }
}

function spawnEnemy() {
    if (!gameState.isPlaying) return;

    gameState.enemies.push(new Enemy(gameState.level));

    // 随着关卡提高，生成速度加快
    const spawnRate = Math.max(500, 2000 - gameState.level * 100);
    setTimeout(spawnEnemy, spawnRate);
}

function updateBuffs() {
    for (let i = gameState.buffs.length - 1; i >= 0; i--) {
        gameState.buffs[i].duration -= 1/60; // 假设 60fps
        if (gameState.buffs[i].duration <= 0) {
            gameState.buffs.splice(i, 1);
        }
    }
}

function updateUI() {
    document.getElementById('hp').textContent = gameState.player.hp;
    document.getElementById('weapon').textContent = gameState.player.weapon?.name || '无';
    document.getElementById('level').textContent = gameState.level;
    document.getElementById('kills').textContent = gameState.kills;
    document.getElementById('combo').textContent = gameState.player.combo;
    document.getElementById('score').textContent = gameState.player.score;

    // 更新背包
    const potionsList = gameState.potions.map(p => `${p.name}`).join(', ') || '空';
    const relicsList = gameState.relics.map(r => `${r.name}`).join(', ') || '空';
    document.getElementById('potions').textContent = `药水：${potionsList}`;
    document.getElementById('relics').textContent = `遗物：${relicsList}`;
}

// 攻击敌人
function attackEnemies() {
    if (gameState.player.attackCooldown > 0) return;

    const currentTime = Date.now();
    const weaponDamage = gameState.player.weapon ? gameState.player.weapon.damage : 5;
    let damage = weaponDamage;

    // 应用增伤buff
    const damageBuff = gameState.buffs.find(b => b.effect === 'damage');
    if (damageBuff) damage += damageBuff.value;

    let hitCount = 0;

    // 检查是否有敌人在攻击范围内
    for (let i = gameState.enemies.length - 1; i >= 0; i--) {
        const enemy = gameState.enemies[i];
        const distance = getDistance(player, enemy);

        if (distance <= player.size + enemy.size + gameState.player.attackRange) {
            // 击中敌人
            enemy.hp -= damage;
            hitCount++;

            // 创建击中粒子效果
            createParticles(enemy.x, enemy.y, '#FFD700', 5);

            // 如果敌人死亡
            if (enemy.hp <= 0) {
                // 增加得分
                let enemyScore = Math.floor(enemy.maxHp / 10) + enemy.type === 'MELEE' ? 10 :
                                enemy.type === 'RANGED' ? 20 :
                                enemy.type === 'ELITE' ? 50 :
                                enemy.type === 'BOSS' ? 100 : 10;

                gameState.player.score += enemyScore;

                // 生成掉落
                const dropChance = 0.7;
                if (Math.random() < dropChance) {
                    gameState.drops.push(new Drop(
                        enemy.x, enemy.y,
                        enemy.weapon, 'weapon'
                    ));
                }

                // 小概率掉落药水或遗物
                if (Math.random() < 0.15) {
                    const potion = POTIONS[randomInt(0, POTIONS.length - 1)];
                    gameState.drops.push(new Drop(enemy.x, enemy.y, potion, 'potion'));
                }

                if (Math.random() < 0.05) {
                    const relic = RELICS[randomInt(0, RELICS.length - 1)];
                    gameState.drops.push(new Drop(enemy.x, enemy.y, relic, 'relic'));
                }

                gameState.kills++;

                // 每 10 杀升级
                if (gameState.kills % 10 === 0) {
                    gameState.level++;
                    showCombatLog(`🎉 升级到第 ${gameState.level} 关！`, 'weapon-get');
                }

                gameState.enemies.splice(i, 1);
            } else {
                // 只是击中敌人但未杀死
                createParticles(enemy.x, enemy.y, '#FF4500', 3);
            }
        }
    }

    if (hitCount > 0) {
        // 更新连击
        updateCombo(currentTime);

        // 显示连击信息
        showCombatLog(`⚔️ 攻击造成 ${damage} 点伤害!`, 'weapon-get');

        // 设置攻击冷却
        gameState.player.attackCooldown = 15; // 15帧冷却

        // 屏幕轻微震动
        gameState.screenShake = 5;
    } else {
        // 错过攻击，重置连击
        resetCombo();
    }
}

// 更新连击系统
function updateCombo(currentTime) {
    const timeDiff = currentTime - gameState.player.lastHitTime;

    // 如果上次攻击在3秒内，则增加连击
    if (timeDiff < 3000) {
        gameState.player.combo++;
        if (gameState.player.combo > gameState.player.maxCombo) {
            gameState.player.maxCombo = gameState.player.combo;
        }
    } else {
        // 否则重置连击
        gameState.player.combo = 1;
    }

    gameState.player.lastHitTime = currentTime;

    // 连击奖励得分
    gameState.player.score += gameState.player.combo;

    // 显示连击信息
    if (gameState.player.combo >= 2) {
        showCombatLog(`🔥 ${gameState.player.combo} 连击!`, 'weapon-get');
    }
}

// 重置连击
function resetCombo() {
    gameState.player.combo = 0;
}

// 检测敌人的碰撞（保持原有的碰撞检测）
function checkCollisions() {
    // 玩家与敌人碰撞
    for (const enemy of gameState.enemies) {
        if (getDistance(player, enemy) < player.size + enemy.size) {
            // 计算伤害
            let damage = enemy.damage;
            if (gameState.player.weapon) {
                let weaponDamage = gameState.player.weapon.damage;
                const damageBuff = gameState.buffs.find(b => b.effect === 'damage');
                if (damageBuff) weaponDamage += damageBuff.value;
                damage = Math.max(1, damage - weaponDamage / 5);
            }

            gameState.player.hp -= damage;
            createParticles(player.x, player.y, '#ff0000', 15, 'explosion');

            // 屏幕震动效果
            gameState.screenShake = Math.min(15, damage);

            if (gameState.player.hp <= 0) {
                gameOver();
            }
        }
    }

    // 玩家与敌人射弹碰撞
    for (let i = gameState.projectiles.length - 1; i >= 0; i--) {
        const proj = gameState.projectiles[i];
        if (getDistance(player, proj) < player.size + proj.size) {
            gameState.player.hp -= proj.damage;
            createParticles(proj.x, proj.y, proj.color, 12, 'explosion');
            gameState.projectiles.splice(i, 1);

            // 受到射弹攻击时的屏幕震动
            gameState.screenShake = Math.min(10, proj.damage);

            if (gameState.player.hp <= 0) {
                gameOver();
            }
        }
    }
}

// 处理按键
document.addEventListener('keydown', (e) => {
    if (!gameState.isPlaying || gameState.isGameOver) return;

    switch(e.key.toLowerCase()) {
        case 'q':
            useSkill('Q');
            break;
        case 'w':
            useSkill('W');
            break;
        case 'e':
            useSkill('E');
            break;
        case 'r':
            useSkill('R');
            break;
    }
});

function gameLoop() {
    if (!gameState.isPlaying) return;

    // 应用屏幕震动
    if (gameState.screenShake > 0) {
        const shakeIntensity = Math.min(10, gameState.screenShake);
        const shakeX = (Math.random() - 0.5) * shakeIntensity;
        const shakeY = (Math.random() - 0.5) * shakeIntensity;
        ctx.save();
        ctx.translate(shakeX, shakeY);
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 更新
    player.update();
    updateBuffs();
    updateSkillCooldowns(); // 更新技能冷却
    updateComboTimer(); // 更新连击计时器

    // 更新攻击冷却
    if (gameState.player.attackCooldown > 0) {
        gameState.player.attackCooldown--;
    }

    // 更新屏幕震动
    if (gameState.screenShake > 0) {
        gameState.screenShake--;
    }

    // 更新敌人
    for (let i = gameState.enemies.length - 1; i >= 0; i--) {
        const enemy = gameState.enemies[i];
        enemy.update();

        // 更新敌人射弹
        for (let j = gameState.projectiles.length - 1; j >= 0; j--) {
            const proj = gameState.projectiles[j];
            proj.x += proj.dx;
            proj.y += proj.dy;

            // 移除超出边界的射弹
            if (proj.x < 0 || proj.x > canvas.width || proj.y < 0 || proj.y > canvas.height) {
                gameState.projectiles.splice(j, 1);
                continue;
            }
        }

        // 检查敌人是否被击杀
        if (enemy.hp <= 0) {
            gameState.enemies.splice(i, 1);
        }
    }

    // 更新掉落物
    gameState.drops.forEach(drop => drop.draw());

    // 更新粒子
    for (let i = gameState.particles.length - 1; i >= 0; i--) {
        const p = gameState.particles[i];
        p.update();
        p.draw();
        if (p.life <= 0) gameState.particles.splice(i, 1);
    }

    // 绘制
    player.draw();
    gameState.enemies.forEach(enemy => enemy.draw());
    gameState.projectiles.forEach(proj => {
        ctx.fillStyle = proj.color;
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, proj.size, 0, Math.PI * 2);
        ctx.fill();
    });

    checkCollisions();
    updateUI();

    // 绘制技能冷却显示
    drawSkillCooldowns();

    if (gameState.screenShake > 0) {
        ctx.restore(); // 恢复画布变换
    }

    requestAnimationFrame(gameLoop);
}

function startGame() {
    gameState = {
        player: {
            hp: 100,
            maxHp: 100,
            weapon: null,
            weapons: [],
            lastWeapon: null,
            attackRange: 80, // 攻击范围
            attackCooldown: 0, // 攻击冷却
            lastHitTime: 0, // 上次命中时间
            combo: 0, // 连击数
            maxCombo: 0, // 最大连击数
            score: 0, // 得分
        },
        level: 1,
        kills: 0,
        potions: [],
        relics: [],
        buffs: [],
        enemies: [],
        drops: [],
        projectiles: [],
        particles: [],
        isPlaying: true,
        isGameOver: false,
        screenShake: 0, // 屏幕震动
    };

    // 重置技能冷却
    for (const key in skillCooldowns) {
        skillCooldowns[key] = 0;
    }

    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-over').classList.add('hidden');

    spawnEnemy();
    gameLoop();
}

function gameOver() {
    gameState.isPlaying = false;
    gameState.isGameOver = true;

    // 创建大量爆炸粒子效果
    for (let i = 0; i < 100; i++) {
        createParticles(player.x, player.y, '#ff0000', 1, 'explosion');
    }

    // 强烈的屏幕震动
    gameState.screenShake = 30;

    document.getElementById('final-level').textContent = gameState.level;
    document.getElementById('final-kills').textContent = gameState.kills;
    document.getElementById('final-score').textContent = gameState.player.score; // 需要在HTML中添加此元素
    document.getElementById('game-over').classList.remove('hidden');
}

// 按钮事件
document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('restart-btn').addEventListener('click', startGame);

// 初始绘制
ctx.fillStyle = '#1a1a2e';
ctx.fillRect(0, 0, canvas.width, canvas.height);
