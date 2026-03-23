// 武器替换者 - Weapon Rogue
// 核心玩法：敌人掉落的武器必定替换当前武器

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

// ==================== 图像资源加载系统 ====================

// 预加载所有精灵图像
const imageCache = {};

function loadImage(src) {
    return new Promise((resolve, reject) => {
        if (imageCache[src]) {
            resolve(imageCache[src]);
            return;
        }

        const img = new Image();
        img.onload = () => {
            imageCache[src] = img;
            resolve(img);
        };
        img.onerror = reject;
        img.src = src;
    });
}

async function loadAllImages() {
    const imagesToLoad = [
        'assets/sprites/weapon_sword.png',
        'assets/sprites/enemy_slime.png',
        'assets/sprites/enemies.png',
        'assets/sprites/potions.png'
    ];

    const promises = imagesToLoad.map(src => loadImage(src));
    await Promise.all(promises);
}

// 预加载图像后开始游戏
loadAllImages().then(() => {
    console.log('所有游戏图像加载完成');
    // 如果需要的话，可以在图像加载完成后自动启动游戏
    // 或者显示准备就绪的状态
}).catch(err => {
    console.error('图像加载失败:', err);
    // 即使图像加载失败也继续，因为我们会提供回退机制
});

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

    // 新增普通武器
    { name: '钝剑', damage: 8, rarity: 'common', color: '#C0C0C0' },
    { name: '破旧的锤子', damage: 7, rarity: 'common', color: '#A9A9A9' },
    { name: '木棒', damage: 4, rarity: 'common', color: '#8B4513' },
    { name: '破损的镰刀', damage: 6, rarity: 'common', color: '#696969' },
    { name: '旧匕首', damage: 5, rarity: 'common', color: '#708090' },
    { name: '断掉的剑', damage: 3, rarity: 'common', color: '#808080' },
    { name: '生锈的镰刀', damage: 6, rarity: 'common', color: '#2F4F4F' },
    { name: '粗糙的短斧', damage: 7, rarity: 'common', color: '#666666' },
    { name: '废弃的钩爪', damage: 5, rarity: 'common', color: '#A9A9A9' },
    { name: '木制长矛', damage: 6, rarity: 'common', color: '#8B4513' },

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

    // 新增不常见武器
    { name: '镀银短剑', damage: 18, rarity: 'uncommon', color: '#C0C0C0' },
    { name: '精灵长弓', damage: 17, rarity: 'uncommon', color: '#228B22' },
    { name: '附魔战斧', damage: 19, rarity: 'uncommon', color: '#8B4513' },
    { name: '轻型重剑', damage: 16, rarity: 'uncommon', color: '#696969' },
    { name: '淬毒匕首', damage: 15, rarity: 'uncommon', color: '#32CD32' },
    { name: '秘银锤', damage: 18, rarity: 'uncommon', color: '#C0C0C0' },
    { name: '符文长矛', damage: 20, rarity: 'uncommon', color: '#800080' },
    { name: '炼金法杖', damage: 17, rarity: 'uncommon', color: '#FFD700' },
    { name: '烈焰之刃', damage: 22, rarity: 'uncommon', color: '#FF4500' },
    { name: '寒冰战斧', damage: 20, rarity: 'uncommon', color: '#87CEEB' },

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

    // 新增稀有武器
    { name: '星尘法杖', damage: 40, rarity: 'rare', color: '#FF69B4' },
    { name: '凤凰之羽扇', damage: 42, rarity: 'rare', color: '#FF6347' },
    { name: '雷电鞭', damage: 44, rarity: 'rare', color: '#00BFFF' },
    { name: '暗夜匕首', damage: 45, rarity: 'rare', color: '#000080' },
    { name: '圣洁之锤', damage: 43, rarity: 'rare', color: '#FFFFE0' },
    { name: '月光短剑', damage: 41, rarity: 'rare', color: '#ADD8E6' },
    { name: '荆棘长鞭', damage: 38, rarity: 'rare', color: '#228B22' },
    { name: '水晶战斧', damage: 46, rarity: 'rare', color: '#B0E0E6' },
    { name: '虚空之刃', damage: 47, rarity: 'rare', color: '#4B0082' },
    { name: '时光沙漏剑', damage: 48, rarity: 'rare', color: '#DAA520' },

    // 新增高级稀有武器，作为稀有和史诗之间的过渡
    { name: '暴风之刃', damage: 42, rarity: 'rare', color: '#87CEEB' },
    { name: '雷神之锤', damage: 43, rarity: 'rare', color: '#B0C4DE' },
    { name: '海神三叉戟', damage: 44, rarity: 'rare', color: '#20B2AA' },
    // 新增的传说级武器
    { name: '时空裂隙刃', damage: 60, rarity: 'epic', color: '#9932CC' },

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

    // 新增史诗武器
    { name: '天罚之剑', damage: 58, rarity: 'epic', color: '#FFD700' },
    { name: '深渊之触', damage: 56, rarity: 'epic', color: '#483D8B' },
    { name: '永恒之火', damage: 60, rarity: 'epic', color: '#FF4500' },
    { name: '冰封王座', damage: 57, rarity: 'epic', color: '#87CEEB' },
    { name: '风暴之眼', damage: 62, rarity: 'epic', color: '#7CFC00' },
    { name: '灵魂收割者', damage: 65, rarity: 'epic', color: '#2F4F4F' },
    { name: '破晓之光', damage: 63, rarity: 'epic', color: '#FFFF00' },
    { name: '暮光之刃', damage: 61, rarity: 'epic', color: '#8A2BE2' },
    { name: '创世纪元', damage: 68, rarity: 'epic', color: '#FF1493' },
    { name: '宇宙法则', damage: 66, rarity: 'epic', color: '#9370DB' },

    // 新增史诗+级别武器，填补史诗和传说之间的差距
    { name: '龙王之怒', damage: 60, rarity: 'epic', color: '#FF4500' },
    { name: '风暴使者', damage: 65, rarity: 'epic', color: '#87CEEB' },
    { name: '时光守护者', damage: 70, rarity: 'epic', color: '#9370DB' },

    // Legendary weapons (传说)
    { name: '龙息巨剑', damage: 50, rarity: 'legendary', color: '#ff0000' },
    { name: '神之刃', damage: 100, rarity: 'legendary', color: '#ffffff' },
    { name: '毁天灭地杖', damage: 85, rarity: 'legendary', color: '#FF00FF' },
    { name: '宇宙终结者', damage: 90, rarity: 'legendary', color: '#0000FF' },
    { name: '万物之主', damage: 75, rarity: 'legendary', color: '#228B22' },
    { name: '永恒守护', damage: 60, rarity: 'legendary', color: '#FFD700' },
    { name: '虚无之吻', damage: 80, rarity: 'legendary', color: '#36454F' },
    { name: '凤凰之剑', damage: 70, rarity: 'legendary', color: '#FF4500' },
    { name: '雷神之锤', damage: 75, rarity: 'legendary', color: '#F0E68C' },
    { name: '海神三叉戟', damage: 82, rarity: 'legendary', color: '#00CED1' },
    { name: '创世之柱', damage: 88, rarity: 'legendary', color: '#FFD700' },

    // Mythic weapons (神话)
    { name: '开发者之剑', damage: 999, rarity: 'mythic', color: '#ff00ff' },
    { name: '元神之剑', damage: 500, rarity: 'mythic', color: '#FF1493' },
    { name: '平衡之锤', damage: 150, rarity: 'mythic', color: '#7B68EE' },
    { name: '创世神之刃', damage: 1200, rarity: 'mythic', color: '#9370DB' },
    { name: '宇宙之心', damage: 800, rarity: 'mythic', color: '#00FFFF' },

    // 新增武器类型
    // 新增传说武器
    { name: '光明审判剑', damage: 95, rarity: 'legendary', color: '#FDFD96' },
    { name: '暗夜魔刃', damage: 88, rarity: 'legendary', color: '#663399' },
    { name: '自然之怒', damage: 85, rarity: 'legendary', color: '#32CD32' },
    { name: '地狱火镰', damage: 92, rarity: 'legendary', color: '#FF4500' },

    // 新增神话武器
    { name: '创世之剑', damage: 1000, rarity: 'mythic', color: '#9370DB' },
    { name: '终焉之枪', damage: 950, rarity: 'mythic', color: '#000000' },

    // 新增稀有武器
    { name: '龙血长矛', damage: 41, rarity: 'rare', color: '#FF6347' },
    { name: '雷神战斧', damage: 43, rarity: 'rare', color: '#B0C4DE' },
    { name: '精灵魔弓', damage: 39, rarity: 'rare', color: '#228B22' },
    { name: '恶魔权杖', damage: 45, rarity: 'rare', color: '#8B0000' },
    { name: '天使之翼', damage: 38, rarity: 'rare', color: '#F5FFFA' },
    { name: '冰霜之心', damage: 42, rarity: 'rare', color: '#E0F6FF' },

    // 新增不常见武器
    { name: '钢骨利刃', damage: 19, rarity: 'uncommon', color: '#778899' },
    { name: '野兽之牙', damage: 17, rarity: 'uncommon', color: '#DAA520' },
    { name: '钢铁巨锤', damage: 21, rarity: 'uncommon', color: '#C0C0C0' },
    { name: '毒藤鞭', damage: 16, rarity: 'uncommon', color: '#2E8B57' },
    { name: '沙漠弯刀', damage: 18, rarity: 'uncommon', color: '#F4A460' },

    // 新增普通武器
    { name: '生锈的战锤', damage: 7, rarity: 'common', color: '#696969' },
    { name: '破烂法袍', damage: 1, rarity: 'common', color: '#483D8B' },
    { name: '朽木长矛', damage: 5, rarity: 'common', color: '#8FBC8F' },
    { name: '破锅盖', damage: 3, rarity: 'common', color: '#C0C0C0' },
    { name: '生锈的链枷', damage: 6, rarity: 'common', color: '#A9A9A9' },
];

// 更新稀有度权重，调整为更合理的平衡性分布
const RARITY_WEIGHTS = {
    common: 50,
    uncommon: 25,
    rare: 15,
    epic: 7,
    legendary: 2.5,
    mythic: 0.5
};

// 调整稀有度权重，使游戏更有挑战性和成就感
const RARITY_WEIGHTS = {
    common: 45,
    uncommon: 30,
    rare: 15,
    epic: 7,
    legendary: 2.5,
    mythic: 0.5
};

// 药水系统
const POTIONS = [
    { name: '生命药水', effect: 'heal', value: 30, color: '#ff0000' },
    { name: '武器保护剂', effect: 'protect', duration: 3, color: '#00ff00' }, // 保护下次不替换
    { name: '幸运药水', effect: 'luck', duration: 5, color: '#ffd700' }, // 提高稀有度
    { name: '力量药水', effect: 'damage', duration: 5, value: 10, color: '#ff8800' },

    // 新增药水类型
    { name: '护盾药水', effect: 'shield', duration: 8, value: 20, color: '#8A2BE2' }, // 获得护盾
    { name: '速度药水', effect: 'speed', duration: 6, value: 2, color: '#00BFFF' }, // 增加移动速度
    { name: '回复药水', effect: 'regen', duration: 10, value: 5, color: '#32CD32' }, // 持续回血
    { name: '反击药水', effect: 'counter', duration: 7, value: 15, color: '#FF6347' }, // 受伤时反击
    // 新增的新药水类型
    { name: '净化药水', effect: 'purge_negative', value: 1, color: '#98FB98' }, // 清除负面状态
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
        hp: 150,  // 增加玩家初始生命值，应对更多敌人
        maxHp: 150,  // 同步最大生命值
        weapon: null,
        weapons: [], // 双持时用
        lastWeapon: null, // 记忆水晶用
        attackRange: 90, // 增加攻击范围，提高操作手感
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

// ==================== 存档系统 ====================

const SaveSystem = {
    saveKey: 'weaponRogueSave',

    // 保存游戏状态
    save: function() {
        const saveData = {
            gameState: {
                level: gameState.level,
                kills: gameState.kills,
                player: {
                    hp: gameState.player.hp,
                    maxHp: gameState.player.maxHp,
                    weapon: gameState.player.weapon,
                    score: gameState.player.score,
                    maxCombo: gameState.player.maxCombo
                },
                relics: gameState.relics,
                achievements: AchievementSystem.achievements // 保存成就状态
            },
            timestamp: Date.now()
        };

        try {
            localStorage.setItem(this.saveKey, JSON.stringify(saveData));
            console.log('游戏进度已保存');
            showCombatLog('💾 进度已自动保存', 'weapon-get');
        } catch (error) {
            console.error('保存失败:', error);
            showCombatLog('⚠️ 保存失败', 'weapon-lose');
        }
    },

    // 加载游戏状态
    load: function() {
        try {
            const saveData = localStorage.getItem(this.saveKey);
            if (saveData) {
                const parsedData = JSON.parse(saveData);

                // 恢复游戏状态
                gameState.level = parsedData.gameState.level || 1;
                gameState.kills = parsedData.gameState.kills || 0;
                gameState.player.hp = parsedData.gameState.player.hp || 120;
                gameState.player.maxHp = parsedData.gameState.player.maxHp || 120;
                gameState.player.weapon = parsedData.gameState.player.weapon || null;
                gameState.player.score = parsedData.gameState.player.score || 0;
                gameState.player.maxCombo = parsedData.gameState.player.maxCombo || 0;
                gameState.relics = parsedData.gameState.relics || [];

                // 恢复成就状态
                if (parsedData.gameState.achievements) {
                    AchievementSystem.achievements = parsedData.gameState.achievements;
                }

                console.log('游戏进度已加载');
                showCombatLog('📂 进度已加载', 'weapon-get');
                return true;
            }
        } catch (error) {
            console.error('加载失败:', error);
            showCombatLog('⚠️ 读取存档失败', 'weapon-lose');
        }
        return false;
    },

    // 删除存档
    clear: function() {
        try {
            localStorage.removeItem(this.saveKey);
            console.log('存档已删除');
            showCombatLog('🗑️ 存档已清除', 'weapon-get');
        } catch (error) {
            console.error('清除失败:', error);
        }
    }
};

// ==================== 成就系统 ====================

const AchievementSystem = {
    achievements: {}, // 动态存储成就解锁状态

    // 定义成就列表
    achievementList: [
        // 游戏进度相关
        { id: 'first_blood', name: '第一滴血', description: '击杀第一个敌人', condition: 'kills >= 1' },
        { id: 'blood_thirsty', name: '嗜血者', description: '击杀10个敌人', condition: 'kills >= 10' },
        { id: 'killing_spree', name: '大开杀戒', description: '击杀50个敌人', condition: 'kills >= 50' },
        { id: 'monster_hunter', name: '怪物猎人', description: '击杀100个敌人', condition: 'kills >= 100' },
        { id: 'first_level', name: '登堂入室', description: '到达第5关', condition: 'level >= 5' },
        { id: 'explorer', name: '探索者', description: '到达第10关', condition: 'level >= 10' },
        { id: 'conqueror', name: '征服者', description: '到达第20关', condition: 'level >= 20' },
        { id: 'master', name: '大师', description: '到达第30关', condition: 'level >= 30' },
        { id: 'legend', name: '传奇', description: '到达第50关（通关）', condition: 'level >= 50' },

        // 战斗相关
        { id: 'combo_king', name: '连击之王', description: '达成10连击', condition: 'maxCombo >= 10' },
        { id: 'combo_master', name: '连击大师', description: '达成20连击', condition: 'maxCombo >= 20' },
        { id: 'high_scoring', name: '高分达人', description: '单局得分超过1000', condition: 'score >= 1000' },
        { id: 'higher_scoring', name: '高手', description: '单局得分超过5000', condition: 'score >= 5000' },
        { id: 'top_scoring', name: '顶尖高手', description: '单局得分超过10000', condition: 'score >= 10000' },
        { id: 'survivor', name: '幸存者', description: '在10关内存活', condition: 'level >= 10 && hp > 50' },
        { id: 'tough_skin', name: '铜皮铁骨', description: '在20关内存活且生命值超过30', condition: 'level >= 20 && hp > 30' },

        // 武器相关
        { id: 'weapon_collector', name: '武器收藏家', description: '使用过10种不同的武器', condition: 'uniqueWeapons >= 10' },
        { id: 'weapon_master', name: '武器大师', description: '使用过20种不同的武器', condition: 'uniqueWeapons >= 20' },
        { id: 'rare_finder', name: '稀有发现者', description: '获得史诗级武器', condition: 'hasEpicWeapon' },
        { id: 'legendary_hunter', name: '传说猎人', description: '获得传说级武器', condition: 'hasLegendaryWeapon' },
        { id: 'mythic_power', name: '神话之力', description: '获得神话级武器', condition: 'hasMythicWeapon' },

        // 特殊挑战
        { id: 'lucky_charm', name: '幸运护符', description: '使用幸运药水并击杀5个敌人', condition: 'luckyKills >= 5' },
        { id: 'phoenix_rise', name: '凤凰涅槃', description: '在濒死状态下使用生命药水', condition: 'reviveFromLowHp' },
        { id: 'guardian', name: '守护者', description: '获得3件不同的遗物', condition: 'relicsCollected >= 3' },
        { id: 'treasure_hoarder', name: '宝藏囤积者', description: '获得5件不同的遗物', condition: 'relicsCollected >= 5' },
        { id: 'speed_demon', name: '速度恶魔', description: '在15关内通关（使用加速药水）', condition: 'finishFast' },
        { id: 'pacifist', name: '和平主义者', description: '到达第10关但只杀死最少数量的敌人', condition: 'pacifistLevel' },
        { id: 'berserker', name: '狂战士', description: '连续使用狂暴技能3次', condition: 'berserkStreak' },
        { id: 'skill_master', name: '技能大师', description: '成功使用所有4个技能各10次', condition: 'skillsUsed >= 40' },
        { id: 'elemental_master', name: '元素大师', description: '使用所有类型的药水', condition: 'usedAllPotions' },

        // 新增成就 (第二波)
        { id: 'survival_expert', name: '生存专家', description: '在第40关时生命值仍然大于70', condition: 'level >= 40 && hp > 70' },
        { id: 'combo_legend', name: '连击传说', description: '达成50连击', condition: 'maxCombo >= 50' },
        { id: 'lucky_strike', name: '幸运一击', description: '使用幸运药水状态下击杀Boss', condition: 'luckyBossKill' },
        { id: 'weapon_connoisseur', name: '武器鉴赏家', description: '使用过50种不同的武器', condition: 'uniqueWeapons >= 50' },
        { id: 'one_hit_kill', name: '一击必杀', description: '使用传说及以上武器一击击杀Boss', condition: 'oneHitBossKill' },
        { id: 'phoenix_rebirth', name: '凤凰重生', description: '连续3次在濒死状态使用生命药水', condition: 'triplePhoenix' },
        { id: 'invincible', name: '无敌', description: '到达第25关且从未生命值归零', condition: 'level >= 25 && neverTookFullDamage' },
        { id: 'berserker_legend', name: '狂战传说', description: '连续使用狂暴技能10次', condition: 'berserkLegend' },
        { id: 'elemental_warden', name: '元素守护者', description: '获得所有药水类型的各5瓶', condition: 'collectAllPotions' },
        { id: 'relic_collector', name: '遗物收藏家', description: '收集全部7种遗物', condition: 'collectAllRelics' },
    ],

    // 临时状态变量，用于跟踪复杂的成就条件
    tempStats: {
        uniqueWeaponsUsed: new Set(),
        luckyKillCount: 0,
        lowHpReviveCount: 0,
        relicsCollected: 0,
        skillsUsed: 0,
        usedPotionTypes: new Set(),
        berserkStreak: 0,
        lastBerserkTime: 0
    },

    // 检查成就条件并解锁成就
    checkAchievements: function() {
        const newAchievements = [];

        for (const achievement of this.achievementList) {
            if (!this.achievements[achievement.id]) {
                // 检查成就条件是否满足
                if (this.evaluateCondition(achievement.condition)) {
                    this.unlock(achievement);
                    newAchievements.push(achievement);
                }
            }
        }

        return newAchievements;
    },

    // 评估成就条件
    evaluateCondition: function(condition) {
        // 使用eval来动态评估条件表达式，注意在生产环境中这是不安全的
        // 但在游戏内部实现中，我们可以控制输入
        try {
            // 创建一个上下文对象，用于评估条件
            const context = {
                kills: gameState.kills,
                level: gameState.level,
                hp: gameState.player.hp,
                maxCombo: gameState.player.maxCombo,
                score: gameState.player.score,
                weapon: gameState.player.weapon,
                relics: gameState.relics
            };

            // 简单替换实现，支持基本比较
            if (condition === 'kills >= 1') return context.kills >= 1;
            if (condition === 'kills >= 10') return context.kills >= 10;
            if (condition === 'kills >= 50') return context.kills >= 50;
            if (condition === 'kills >= 100') return context.kills >= 100;
            if (condition === 'level >= 5') return context.level >= 5;
            if (condition === 'level >= 10') return context.level >= 10;
            if (condition === 'level >= 20') return context.level >= 20;
            if (condition === 'level >= 30') return context.level >= 30;
            if (condition === 'level >= 50') return context.level >= 50;
            if (condition === 'maxCombo >= 10') return context.maxCombo >= 10;
            if (condition === 'maxCombo >= 20') return context.maxCombo >= 20;
            if (condition === 'score >= 1000') return context.score >= 1000;
            if (condition === 'score >= 5000') return context.score >= 5000;
            if (condition === 'score >= 10000') return context.score >= 10000;
            if (condition === 'level >= 10 && hp > 50') return context.level >= 10 && context.hp > 50;
            if (condition === 'level >= 20 && hp > 30') return context.level >= 20 && context.hp > 30;

            // 检查是否有史诗武器
            if (condition === 'hasEpicWeapon' && context.weapon) {
                return context.weapon.rarity === 'epic';
            }

            // 检查是否有传说武器
            if (condition === 'hasLegendaryWeapon' && context.weapon) {
                return context.weapon.rarity === 'legendary';
            }

            // 检查是否有神话武器
            if (condition === 'hasMythicWeapon' && context.weapon) {
                return context.weapon.rarity === 'mythic';
            }

            // 检查拥有的遗物数量
            if (condition === 'relicsCollected >= 3') {
                return context.relics && context.relics.length >= 3;
            }
            if (condition === 'relicsCollected >= 5') {
                return context.relics && context.relics.length >= 5;
            }

            // 检查复杂条件
            if (condition === 'uniqueWeapons >= 10') {
                return this.tempStats.uniqueWeaponsUsed.size >= 10;
            }
            if (condition === 'uniqueWeapons >= 20') {
                return this.tempStats.uniqueWeaponsUsed.size >= 20;
            }
            if (condition === 'uniqueWeapons >= 50') {
                return this.tempStats.uniqueWeaponsUsed.size >= 50;
            }
            if (condition === 'luckyKills >= 5') {
                return this.tempStats.luckyKillCount >= 5;
            }

            // 新增成就条件
            if (condition === 'level >= 40 && hp > 70') {
                return context.level >= 40 && context.hp > 70;
            }
            if (condition === 'maxCombo >= 50') {
                return context.maxCombo >= 50;
            }

            return false;
        } catch (e) {
            console.error('评估成就条件时出错:', e);
            return false;
        }
    },

    // 解锁成就
    unlock: function(achievement) {
        this.achievements[achievement.id] = {
            unlocked: true,
            timestamp: Date.now(),
            name: achievement.name,
            description: achievement.description
        };

        console.log(`成就解锁: ${achievement.name}`);
        showCombatLog(`🏆 成就解锁: ${achievement.name}`, 'weapon-get');

        // 保存成就状态
        SaveSystem.save();
    },

    // 获取已解锁成就的数量
    getUnlockedCount: function() {
        return Object.keys(this.achievements).filter(id => this.achievements[id].unlocked).length;
    },

    // 获取总成就数量
    getTotalCount: function() {
        return this.achievementList.length;
    },

    // 当玩家获得新武器时调用
    onWeaponAcquired: function(weapon) {
        if (weapon) {
            this.tempStats.uniqueWeaponsUsed.add(weapon.name);
            this.checkAchievements();
        }
    },

    // 当玩家使用幸运药水并击杀敌人时调用
    onLuckyKill: function() {
        this.tempStats.luckyKillCount++;
        this.checkAchievements();
    },

    // 当玩家使用生命药水脱离危险状态时调用
    onPhoenixRise: function() {
        this.tempStats.lowHpReviveCount++;
        this.checkAchievements();
    },

    // 当玩家获得遗物时调用
    onRelicAcquired: function() {
        this.tempStats.relicsCollected++;
        this.checkAchievements();
    },

    // 当玩家使用技能时调用
    onSkillUsed: function() {
        this.tempStats.skillsUsed++;
        this.checkAchievements();
    },

    // 当玩家使用药水时调用
    onPotionUsed: function(potion) {
        this.tempStats.usedPotionTypes.add(potion.name);
        this.checkAchievements();
    },

    // 当玩家使用幸运药水击杀敌人时调用
    onLuckyBossKill: function() {
        this.tempStats.luckyBossKill = true;
        this.checkAchievements();
    },

    // 当玩家一击击杀Boss时调用
    onOneHitBossKill: function() {
        this.tempStats.oneHitBossKill = true;
        this.checkAchievements();
    },

    // 当玩家连续三次濒死时使用生命药水
    onTriplePhoenix: function() {
        this.tempStats.triplePhoenix = (this.tempStats.triplePhoenix || 0) + 1;
        this.checkAchievements();
    },

    // 当玩家从未完全死亡时调用
    onNeverTookFullDamage: function() {
        this.tempStats.neverTookFullDamage = true;
        this.checkAchievements();
    },

    // 当玩家连续使用狂暴技能时调用
    onBerserkLegend: function() {
        this.tempStats.berserkLegend = (this.tempStats.berserkLegend || 0) + 1;
        this.checkAchievements();
    },

    // 重置临时统计数据（通常在游戏重启时）
    resetTempStats: function() {
        this.tempStats = {
            uniqueWeaponsUsed: new Set(),
            luckyKillCount: 0,
            lowHpReviveCount: 0,
            relicsCollected: 0,
            skillsUsed: 0,
            usedPotionTypes: new Set(),
            berserkStreak: 0,
            lastBerserkTime: 0,
            luckyBossKill: false,
            oneHitBossKill: false,
            triplePhoenix: 0,
            neverTookFullDamage: false,
            berserkLegend: 0
        };
    }
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
        cooldown: 360, // 6秒 (调整冷却时间以优化平衡性)
        effect: 'aoe_damage',
        description: '对周围所有敌人造成2倍武器伤害'
    },
    W: {
        name: '治疗光环',
        cooldown: 600, // 10秒 (调整冷却时间以优化平衡性)
        effect: 'heal',
        description: '恢复30%最大生命值'
    },
    E: {
        name: '闪现',
        cooldown: 300, // 5秒 (调整冷却时间以优化平衡性)
        effect: 'teleport',
        description: '瞬间传送到鼠标位置'
    },
    R: {
        name: '狂暴',
        cooldown: 720, // 12秒 (调整冷却时间以优化平衡性)
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
                const distance = getDistance(gameState.player, enemy);

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
            createParticles(gameState.player.x, gameState.player.y, '#00FF00', 20);
            showCombatLog(`💚 ${skill.name} 恢复 ${healAmount} 生命!`, 'weapon-get');
            success = true;
            break;

        case 'teleport':
            // 闪现到鼠标位置
            const distance = getDistance(gameState.player, {x: mouseX, y: mouseY});
            const teleportDistance = Math.min(distance, 150); // 最大传送距离

            const angle = Math.atan2(mouseY - gameState.player.y, mouseX - gameState.player.x);
            gameState.player.x += Math.cos(angle) * teleportDistance;
            gameState.player.y += Math.sin(angle) * teleportDistance;

            // 边界检查
            gameState.player.x = Math.max(player.size, Math.min(canvas.width - player.size, gameState.player.x));
            gameState.player.y = Math.max(player.size, Math.min(canvas.height - player.size, gameState.player.y));

            createParticles(gameState.player.x, gameState.player.y, '#8A2BE2', 15);
            showCombatLog(`✨ ${skill.name} 成功传送!`, 'weapon-get');
            success = true;
            break;

        case 'berserk':
            // 狂暴状态 - 伤害翻倍
            gameState.buffs.push({
                effect: 'berserk_damage',
                duration: 5, // 5秒
                value: 2 // 伤害倍数
            });
            createParticles(gameState.player.x, gameState.player.y, '#FF0000', 25);
            showCombatLog(`😠 ${skill.name} 开启，伤害翻倍!`, 'weapon-get');
            success = true;
            break;
    }

    if (success) {
        // 通知成就系统使用了技能
        AchievementSystem.onSkillUsed();

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

    // 同步更新HTML元素的冷却显示
    updateHtmlSkillCooldowns();
}

// 更新HTML形式的技能冷却显示
function updateHtmlSkillCooldowns() {
    const skillKeys = ['Q', 'W', 'E', 'R'];
    for (const key of skillKeys) {
        const cooldown = skillCooldowns[key];
        const maxCooldown = SKILLS[key].cooldown;
        const elementId = key.toLowerCase() + '-cooldown';
        const cooldownElement = document.getElementById(elementId);

        if (cooldownElement) {
            if (cooldown > 0) {
                const percent = (cooldown / maxCooldown) * 100;
                const angle = 360 * (percent / 100);
                const clipPath = `conic-gradient(from 0deg, #667eea 0deg ${angle}deg, transparent ${angle}deg 360deg)`;

                cooldownElement.style.setProperty('--clip-path', clipPath);
                cooldownElement.style.display = 'block';
            } else {
                cooldownElement.style.display = 'none';
            }
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

// 获取随机稀有度
function getRandomRarity() {
    const totalWeight = Object.values(RARITY_WEIGHTS).reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;

    for (const [rarity, weight] of Object.entries(RARITY_WEIGHTS)) {
        random -= weight;
        if (random <= 0) {
            return rarity;
        }
    }

    // 如果随机值超出预期范围，默认返回common
    return 'common';
}

// 生成随机武器
function generateWeapon() {
    const rarity = getRandomRarity();
    const weaponsOfRarity = WEAPONS.filter(w => w.rarity === rarity);
    const weapon = weaponsOfRarity[randomInt(0, weaponsOfRarity.length - 1)];
    return { ...weapon, id: Date.now() + Math.random() };
}

// ==================== 音效管理器 ====================
const AudioManager = {
    sounds: {},

    // 初始化音效对象（仅作为预留接口）
    init() {
        // 在这里可以加载各种音效
        console.log('音效系统已初始化');
    },

    // 播放音效的占位函数
    playSound(soundName) {
        // 预留接口，未来可以集成Web Audio API
        // 例如: this.sounds[soundName]?.play();

        // 临时使用简单的振动反馈（在支持的设备上）
        if (navigator.vibrate) {
            navigator.vibrate(10); // 轻微震动10ms作为反馈
        }
    }
};

// 初始化音效系统
AudioManager.init();

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

        // 绘制当前武器（使用精灵图）
        if (gameState.player.weapon) {
            const weaponImg = imageCache['assets/sprites/weapon_sword.png'];
            if (weaponImg) {
                // 根据鼠标位置确定武器角度
                const angle = Math.atan2(mouseY - this.y, mouseX - this.x);

                // 添加攻击动画效果
                let weaponScale = 1.0;
                if (gameState.player.attackCooldown > 0) {
                    // 攻击时武器放大效果
                    weaponScale = 1.2 + (gameState.player.attackCooldown / 15) * 0.3;
                }

                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(angle);

                // 绘制武器精灵，带缩放效果
                const scaledSize = 40 * weaponScale;
                const scaledHeight = 16 * weaponScale;

                // 根据武器稀有度设置不同色调
                ctx.save();
                const weaponImg = imageCache['assets/sprites/weapon_sword.png'];

                // 创建一个临时画布用于给武器染色
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = weaponImg.width;
                tempCanvas.height = weaponImg.height;
                const tempCtx = tempCanvas.getContext('2d');
                tempCtx.drawImage(weaponImg, 0, 0);

                // 获取图像数据
                const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
                const data = imageData.data;

                // 根据武器稀有度修改颜色
                const rarityColors = {
                    'common': [200, 200, 200],      // 灰色
                    'uncommon': [34, 139, 34],     // 绿色
                    'rare': [0, 191, 255],        // 蓝色
                    'epic': [138, 43, 226],       // 紫色
                    'legendary': [255, 215, 0],    // 金色
                    'mythic': [255, 0, 255]       // 粉色
                };

                const colors = rarityColors[gameState.player.weapon.rarity] || [255, 255, 255]; // 默认白色

                // 修改像素颜色
                for (let i = 0; i < data.length; i += 4) {
                    // 只处理非透明像素
                    if (data[i + 3] > 0) {  // Alpha通道大于0
                        data[i] = colors[0];     // Red
                        data[i + 1] = colors[1]; // Green
                        data[i + 2] = colors[2]; // Blue
                    }
                }

                tempCtx.putImageData(imageData, 0, 0);

                // 绘制修改后的武器
                ctx.drawImage(tempCanvas, 15, -8, scaledSize, scaledHeight);
                ctx.restore();
            }

            // 绘制武器名称标签（在攻击时更明显）
            if (gameState.player.attackCooldown > 0) {
                ctx.fillStyle = gameState.player.weapon.color;
                ctx.font = 'bold 12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(gameState.player.weapon.name, this.x, this.y - this.size - 10);
                ctx.textAlign = 'left';
            }
        }
    }
    
    update() {
        // 计算基础速度
        let effectiveSpeed = this.speed;

        // 应用速度增益效果
        const speedBuff = gameState.buffs.find(b => b.effect === 'speed');
        if (speedBuff) {
            effectiveSpeed += speedBuff.value;
        }

        // 玩家跟随鼠标
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 5) {
            this.x += (dx / dist) * effectiveSpeed;
            this.y += (dy / dist) * effectiveSpeed;
        }

        // 边界限制
        this.x = Math.max(this.size, Math.min(canvas.width - this.size, this.x));
        this.y = Math.max(this.size, Math.min(canvas.height - this.size, this.y));
    }
}

// 定义敌人类型
const ENEMY_TYPES = {
    MELEE: { name: '近战', speed: 1.5, hp: 0.6, damage: 0.8, size: 1, behavior: 'melee' },  // 降低近战敌人血量和伤害
    RANGED: { name: '远程', speed: 0.8, hp: 0.5, damage: 1.0, size: 0.8, behavior: 'ranged' },  // 降低远程敌人血量和伤害
    ELITE: { name: '精英', speed: 1.2, hp: 1.2, damage: 1.2, size: 1.5, behavior: 'melee' },  // 降低精英敌人血量和伤害
    SUPPORT: { name: '支援', speed: 1.0, hp: 0.7, damage: 0.5, size: 1.2, behavior: 'support' }, // 支援型敌人，伤害较低
    TANK: { name: '坦克', speed: 0.3, hp: 2.5, damage: 1.5, size: 2.0, behavior: 'melee' }, // 坦克型敌人，血厚但移动缓慢且伤害降低
    BOSS: { name: 'Boss', speed: 0.5, hp: 2.0, damage: 1.5, size: 1.8, behavior: 'mixed' }, // 进一步降低Boss的血量和伤害
    ARCHER: { name: '弓箭手', speed: 0.7, hp: 0.6, damage: 1.5, size: 1.1, behavior: 'ranged' }, // 弓箭手敌人，降低伤害
    // 新增法师敌人，远程魔法攻击
    MAGE: { name: '法师', speed: 0.6, hp: 0.7, damage: 1.8, size: 1.2, behavior: 'ranged' },

    // 新增更多敌人类型
    ASSASSIN: { name: '刺客', speed: 2.0, hp: 0.8, damage: 2.0, size: 0.9, behavior: 'melee' }, // 高速高伤害低血量
    GOLEM: { name: '石像鬼', speed: 0.4, hp: 3.0, damage: 1.0, size: 2.2, behavior: 'melee' }, // 极高血量低伤害
    NECROMANCER: { name: '亡灵法师', speed: 0.5, hp: 1.0, damage: 2.2, size: 1.3, behavior: 'ranged' }, // 召唤亡灵单位
    DRAGON: { name: '幼龙', speed: 0.9, hp: 2.2, damage: 1.8, size: 2.0, behavior: 'ranged' }, // 飞行单位，高血高伤害
    UNDEAD: { name: '亡灵战士', speed: 0.7, hp: 1.5, damage: 1.3, size: 1.1, behavior: 'melee' }, // 亡灵单位，有一定抗性
    BEAST: { name: '野兽', speed: 1.8, hp: 0.9, damage: 1.4, size: 1.0, behavior: 'melee' }, // 高速野兽，具有突袭能力
    ELEMENTAL: { name: '元素生物', speed: 1.0, hp: 1.1, damage: 1.6, size: 1.1, behavior: 'ranged' }, // 随机元素攻击
    SKELETON: { name: '骷髅', speed: 0.9, hp: 0.8, damage: 0.9, size: 0.9, behavior: 'melee' }, // 基础亡灵单位
    DEMON: { name: '小恶魔', speed: 1.3, hp: 1.0, damage: 1.7, size: 1.2, behavior: 'melee' }, // 火属性伤害
    ORC: { name: '兽人', speed: 1.1, hp: 1.8, damage: 1.6, size: 1.6, behavior: 'melee' }, // 高血高伤害近战

    // 新增更多敌人类型 (第2波)
    GOBLIN: { name: '哥布林', speed: 1.6, hp: 0.7, damage: 1.2, size: 0.8, behavior: 'melee' }, // 小型快速敌人
    SPIDER: { name: '蜘蛛', speed: 1.4, hp: 0.6, damage: 1.3, size: 0.7, behavior: 'ranged' }, // 小型远程敌人
    WIZARD: { name: '巫师', speed: 0.4, hp: 0.9, damage: 2.5, size: 1.3, behavior: 'ranged' }, // 高伤害法师
    BERSERKER: { name: '狂战士', speed: 1.8, hp: 1.4, damage: 2.0, size: 1.7, behavior: 'melee' }, // 高攻高血低防
    PHANTOM: { name: '幻影', speed: 2.2, hp: 0.4, damage: 2.5, size: 0.8, behavior: 'melee' }, // 超高速敌人，伤害高但血薄
    GOATMAN: { name: '羊头人', speed: 1.0, hp: 2.0, damage: 1.5, size: 1.5, behavior: 'melee' }, // 高血中伤害
    CRYSTAL: { name: '水晶守护者', speed: 0.2, hp: 4.0, damage: 2.2, size: 2.5, behavior: 'ranged' }, // 极高血量，远程攻击
    SHADOW: { name: '暗影刺客', speed: 2.5, hp: 0.5, damage: 3.0, size: 0.6, behavior: 'melee' }, // 极速高伤低血
    TROLL: { name: '巨魔', speed: 0.6, hp: 3.5, damage: 1.8, size: 2.4, behavior: 'melee' }, // 超高血量中伤害
    LICH: { name: '巫妖王', speed: 0.3, hp: 2.8, damage: 3.0, size: 2.0, behavior: 'ranged' }, // 高血高伤害远程

    // 新增敌人类型 (第三波)
    ANGEL: { name: '天使', speed: 0.8, hp: 3.0, damage: 2.8, size: 2.2, behavior: 'ranged' }, // 高血高伤神圣单位
    PIRATE: { name: '海盗', speed: 1.4, hp: 1.6, damage: 2.2, size: 1.4, behavior: 'melee' }, // 中速高伤近战
    NINJA: { name: '忍者', speed: 2.3, hp: 0.6, damage: 2.8, size: 0.8, behavior: 'melee' }, // 极速高伤低血
    CYBORG: { name: '机械战士', speed: 1.1, hp: 2.5, damage: 2.0, size: 1.8, behavior: 'ranged' }, // 机械单位，远程攻击
    ELF: { name: '精灵', speed: 1.6, hp: 1.2, damage: 2.4, size: 1.0, behavior: 'ranged' }, // 精灵射手，高攻速
    DRUID: { name: '德鲁伊', speed: 0.9, hp: 2.2, damage: 2.1, size: 1.5, behavior: 'mixed' }, // 混合型敌人，可近可远
};

class Enemy {
    constructor(level, type = null) {
        if (type === null) {
            // 随机选择敌人类型，越到后面精英和Boss出现几率越高
            const rand = Math.random();
            if (level < 3 && rand < 0.4) {
                type = 'MELEE';
            } else if (level < 5 && rand < 0.6) {
                type = 'RANGED';
            } else if (level < 8 && rand < 0.75) {
                type = 'ELITE';
            } else if (level < 10 && rand < 0.8) {
                type = 'SUPPORT'; // 新增支援型敌人
            } else if (level < 12 && rand < 0.85) {
                type = 'ARCHER'; // 新增弓箭手敌人
            } else if (level < 14 && rand < 0.88) {
                type = 'MAGE'; // 新增法师敌人
            } else if (level < 16 && rand < 0.90) {
                type = 'ASSASSIN'; // 新增刺客敌人
            } else if (level < 18 && rand < 0.92) {
                type = 'UNDEAD'; // 新增亡灵敌人
            } else if (level < 20 && rand < 0.94) {
                type = 'BEAST'; // 新增野兽敌人
            } else if (level < 22 && rand < 0.95) {
                type = 'SKELETON'; // 新增骷髅敌人
            } else if (level < 24 && rand < 0.96) {
                type = 'GOBLIN'; // 新增哥布林敌人
            } else if (level < 26 && rand < 0.97) {
                type = 'DRAGON'; // 新增龙类敌人
            } else if (level < 28 && rand < 0.975) {
                type = 'GOLEM'; // 新增石像鬼敌人
            } else if (level < 30 && rand < 0.98) {
                type = 'SPIDER'; // 新增蜘蛛敌人
            } else if (level < 32 && rand < 0.985) {
                type = 'BERSERKER'; // 新增狂战士敌人
            } else if (level < 34 && rand < 0.99) {
                type = 'WIZARD'; // 新增巫师敌人
            } else if (level < 36 && rand < 0.992) {
                type = 'PHANTOM'; // 新增幻影敌人
            } else if (level < 38 && rand < 0.994) {
                type = 'TROLL'; // 新增巨魔敌人
            } else if (level < 40 && rand < 0.996) {
                type = 'LICH'; // 新增巫妖王敌人
            } else if (level < 42 && rand < 0.997) {
                type = 'ANGEL'; // 新增天使敌人
            } else if (level < 44 && rand < 0.998) {
                type = 'PIRATE'; // 新增海盗敌人
            } else if (level < 46 && rand < 0.9985) {
                type = 'NINJA'; // 新增忍者敌人
            } else if (level < 48 && rand < 0.999) {
                type = 'CYBORG'; // 新增机械战士敌人
            } else if (level < 50 && rand < 0.9992) {
                type = 'ELF'; // 新增精灵敌人
            } else if (level < 52 && rand < 0.9994) {
                type = 'DRUID'; // 新增德鲁伊敌人
            } else if (rand < 0.9995) {
                type = 'SHADOW'; // 新增暗影刺客敌人
            } else if (rand < 0.9996) {
                type = 'BOSS';
            } else if (rand < 0.9998) {
                type = 'DEMON'; // 小恶魔
            } else {
                type = 'ELEMENTAL'; // 元素生物
            }
        }

        this.type = type;
        this.config = ENEMY_TYPES[type];

        this.size = Math.floor(20 * this.config.size + randomInt(0, 15));
        this.x = Math.random() < 0.5 ? -this.size : canvas.width + this.size;
        this.y = randomInt(0, canvas.height);
        this.speed = randomFloat(0.5 + this.config.speed, 1.5 + this.config.speed + level * 0.1);
        this.hp = Math.floor((15 + level * 6) * this.config.hp); // 调整基础血量，使游戏整体难度更平衡
        this.maxHp = this.hp;
        this.damage = Math.floor((3 + level * 1.2) * this.config.damage); // 调整基础伤害，使游戏整体难度更平衡
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
            case 'ARCHER': return `hsl(${randomInt(30, 90)}, 70%, 50%)`; // 黄色/绿色系 - 弓箭手
            case 'MAGE': return `hsl(${randomInt(240, 280)}, 80%, 60%)`; // 深蓝色系 - 法师
            case 'ASSASSIN': return `hsl(${randomInt(0, 30)}, 80%, 30%)`; // 深棕色系 - 刺客
            case 'GOLEM': return `hsl(${randomInt(180, 220)}, 50%, 40%)`; // 灰蓝系 - 石像鬼
            case 'NECROMANCER': return `hsl(${randomInt(300, 330)}, 70%, 40%)`; // 暗紫色系 - 亡灵法师
            case 'DRAGON': return `hsl(${randomInt(0, 30)}, 70%, 45%)`; // 暗红系 - 龙
            case 'UNDEAD': return `hsl(${randomInt(60, 120)}, 40%, 35%)`; // 暗绿系 - 亡灵
            case 'BEAST': return `hsl(${randomInt(30, 60)}, 70%, 50%)`; // 棕色系 - 野兽
            case 'ELEMENTAL': return `hsl(${randomInt(180, 240)}, 80%, 60%)`; // 水蓝系 - 元素
            case 'SKELETON': return `hsl(${randomInt(120, 180)}, 20%, 70%)`; // 灰白系 - 骷髅
            case 'DEMON': return `hsl(${randomInt(0, 15)}, 80%, 45%)`; // 红色系 - 恶魔
            case 'ORC': return `hsl(${randomInt(120, 160)}, 60%, 40%)`; // 绿色系 - 兽人
            case 'GOBLIN': return `hsl(${randomInt(80, 120)}, 70%, 45%)`; // 浅绿色系 - 哥布林
            case 'SPIDER': return `hsl(${randomInt(0, 20)}, 30%, 20%)`; // 深褐色系 - 蜘蛛
            case 'WIZARD': return `hsl(${randomInt(250, 290)}, 90%, 70%)`; // 鲜艳紫色系 - 巫师
            case 'BERSERKER': return `hsl(${randomInt(0, 20)}, 90%, 40%)`; // 深橙色系 - 狂战士
            case 'PHANTOM': return `hsl(${randomInt(270, 300)}, 50%, 30%)`; // 暗紫色系 - 幻影
            case 'GOATMAN': return `hsl(${randomInt(20, 50)}, 60%, 45%)`; // 深棕色系 - 羊头人
            case 'CRYSTAL': return `hsl(${randomInt(180, 210)}, 80%, 70%)`; // 淡蓝色系 - 水晶守护者
            case 'SHADOW': return `hsl(${randomInt(0, 360)}, 100%, 5%)`; // 纯黑色系 - 暗影刺客
            case 'TROLL': return `hsl(${randomInt(60, 100)}, 40%, 30%)`; // 暗绿色系 - 巨魔
            case 'LICH': return `hsl(${randomInt(280, 320)}, 70%, 35%)`; // 深紫色系 - 巫妖王
            default: return `hsl(${randomInt(0, 60)}, 70%, 50%)`;
        }
    }

    draw() {
        // 绘制敌人（使用精灵图）
        let enemyImg;
        if (this.type === 'MELEE') {
            // 如果是史莱姆类型的敌人，使用史莱姆精灵
            enemyImg = imageCache['assets/sprites/enemy_slime.png'];
        } else {
            // 其他敌人类型使用通用敌人精灵
            enemyImg = imageCache['assets/sprites/enemies.png'];
        }

        if (enemyImg) {
            // 根据敌人类型和大小调整绘制尺寸
            const drawWidth = this.size * 2 * 0.8; // 缩小一些使其适应原来圆形大小
            const drawHeight = this.size * 2 * 0.8;

            ctx.drawImage(enemyImg, this.x - drawWidth/2, this.y - drawHeight/2, drawWidth, drawHeight);

            // 为支援型敌人添加光环效果
            if (this.type === 'SUPPORT') {
                // 绘制一个淡蓝色的光环
                ctx.strokeStyle = 'rgba(0, 255, 255, 0.4)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size + 5, 0, Math.PI * 2);
                ctx.stroke();

                // 绘制一个小图标表示支援能力
                ctx.fillStyle = 'rgba(0, 255, 255, 0.7)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size/2, 0, Math.PI * 2);
                ctx.fill();
            }

            // 为法师敌人添加魔法光环效果
            if (this.type === 'MAGE') {
                // 绘制一个紫色的魔法光环
                const alpha = 0.3 + Math.sin(Date.now()/200) * 0.2; // 淡入淡出效果
                ctx.strokeStyle = `rgba(147, 112, 219, ${alpha})`;
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size + 8, 0, Math.PI * 2);
                ctx.stroke();

                // 内部还有一个较小的光环
                ctx.strokeStyle = `rgba(123, 104, 238, ${alpha * 0.7})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size + 4, 0, Math.PI * 2);
                ctx.stroke();
            }
        } else {
            // 如果图像未加载，则回退到原来的绘制方式
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();

            // 为支援型敌人添加特殊标记
            if (this.type === 'SUPPORT') {
                // 绘制支援型敌人的特殊光环
                ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size + 5, 0, Math.PI * 2);
                ctx.stroke();
            }

            // 绘制边框
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // 绘制血条（无论使用哪种绘制方式都需要）
        const hpPercent = this.hp / this.maxHp;
        ctx.fillStyle = '#333';
        ctx.fillRect(this.x - 25, this.y - this.size - 15, 50, 8);
        ctx.fillStyle = hpPercent > 0.5 ? '#0f0' : hpPercent > 0.25 ? '#ff0' : '#f00';
        ctx.fillRect(this.x - 25, this.y - this.size - 15, 50 * hpPercent, 8);

        // 武器指示（只在没有精灵图时显示）
        if (!enemyImg) {
            ctx.fillStyle = this.weapon.color;
            ctx.fillRect(this.x - 15, this.y + this.size + 8, 30, 6);
        }
    }

    update() {
        const dx = gameState.player.x - this.x;
        const dy = gameState.player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (this.config.behavior === 'ranged' && dist > 100) {
            // 远程敌人保持距离
            this.x -= (dx / dist) * this.speed * 0.5;
            this.y -= (dy / dist) * this.speed * 0.5;
        } else if (this.config.behavior === 'support') {
            // 支援型敌人 - 不直接攻击玩家，而是增强附近敌人
            this.supportNearbyEnemies();

            // 缓慢靠近玩家但不紧追
            if (dist > 150) {
                this.x += (dx / dist) * this.speed * 0.3;
                this.y += (dy / dist) * this.speed * 0.3;
            } else if (dist < 100) {
                // 太近时稍微后退
                this.x -= (dx / dist) * this.speed * 0.2;
                this.y -= (dy / dist) * this.speed * 0.2;
            }
        } else {
            // 近战敌人靠近玩家
            this.x += (dx / dist) * this.speed;
            this.y += (dy / dist) * this.speed;
        }

        // 远程敌人射击逻辑
        if (this.config.behavior === 'ranged' || this.config.behavior === 'mixed' || this.type === 'MAGE') {
            this.shootCooldown--;
            if (this.shootCooldown <= 0 && dist < 200) {
                if (this.type === 'MAGE') {
                    this.castMagicSpell(); // 法师施放魔法
                } else {
                    this.shootAtPlayer();
                }
                this.shootCooldown = this.type === 'MAGE' ? 90 : 60; // 法师攻击频率稍低但威力更强
            }
        }
    }

    // 支援型敌人的辅助方法
    supportNearbyEnemies() {
        // 寻找附近的敌人并给予增益
        for (const enemy of gameState.enemies) {
            if (enemy !== this) {
                const supportDist = getDistance(this, enemy);
                if (supportDist < 100) { // 支援范围
                    // 每帧轻微提升附近敌人的伤害和速度
                    enemy.damage = Math.min(enemy.damage + 0.01, enemy.damage * 1.5); // 设置上限防止无限增长
                    enemy.speed = Math.min(enemy.speed + 0.005, enemy.speed * 1.3);

                    // 绘制支援效果连线
                    if (Math.random() < 0.1) { // 偶尔产生特效
                        createParticles(
                            (this.x + enemy.x) / 2,
                            (this.y + enemy.y) / 2,
                            '#00FFFF',
                            2,
                            'support_beam'
                        );
                    }
                }
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

    // 法师施放魔法技能
    castMagicSpell() {
        // 创建向玩家发射的魔法弹
        const angle = Math.atan2(
            gameState.player.y - this.y,
            gameState.player.x - this.x
        );

        // 创建多个魔法弹形成扇形攻击
        for (let i = -1; i <= 1; i++) {
            const spreadAngle = angle + i * 0.3; // 30度扩散

            const projectile = {
                x: this.x,
                y: this.y,
                speed: this.projectileSpeed * 0.8, // 稍慢一点以显示魔法特性
                dx: Math.cos(spreadAngle) * this.projectileSpeed * 0.8,
                dy: Math.sin(spreadAngle) * this.projectileSpeed * 0.8,
                size: 8, // 更大的魔法弹
                color: this.color,
                damage: Math.floor(this.damage * 0.6), // 法术伤害稍高
                type: 'magic' // 标记为魔法类型
            };

            gameState.projectiles.push(projectile);
        }

        // 生成魔法粒子效果
        createMagicParticles(this.x, this.y, this.color, 6);

        // 偶尔产生声音反馈效果
        if (Math.random() < 0.3) {
            createParticles(this.x, this.y, this.color, 5, 'sparkle');
        }
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

        // 绘制掉落物（使用精灵图）
        if (this.type === 'potion') {
            const potionImg = imageCache['assets/sprites/potions.png'];
            if (potionImg) {
                ctx.save();
                ctx.translate(this.x, this.y + bobY);

                // 根据药水类型选择精灵图的不同部分（如果有多张药水图）
                ctx.drawImage(potionImg, -this.size, -this.size, this.size * 2, this.size * 2);

                ctx.restore();
            } else {
                // 回退到原来的绘制方式
                ctx.fillStyle = '#ff0000';
                ctx.beginPath();
                ctx.arc(this.x, this.y + bobY, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        } else if (this.type === 'weapon') {
            // 武器掉落物也可以有特殊图标
            const weaponImg = imageCache['assets/sprites/weapon_sword.png'];
            if (weaponImg) {
                ctx.save();
                ctx.translate(this.x, this.y + bobY);

                // 绘制武器精灵
                ctx.drawImage(weaponImg, -this.size, -this.size, this.size * 2, this.size * 2);

                ctx.restore();
            } else {
                // 回退到原来的绘制方式
                ctx.fillStyle = this.item.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y + bobY, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        } else {
            // 其他类型（如遗物）
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
            case 'magic':
                this.size = randomInt(3, 6);
                this.speedX = randomFloat(-2, 2);
                this.speedY = randomFloat(-2, 2);
                this.life = 1;
                this.decay = randomFloat(0.005, 0.02);
                this.gravity = 0;
                this.oscillation = randomFloat(0.02, 0.05); // 振荡效果
                this.angle = randomFloat(0, Math.PI * 2);
                this.oscillationSpeed = randomFloat(0.05, 0.1);
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
            case 'magic':
                // 绘制魔法效果，带有振荡运动
                ctx.globalAlpha = this.life * 0.7;

                // 计算振荡位置
                const offsetX = Math.cos(this.angle) * 5 * (this.life * 10);
                const offsetY = Math.sin(this.angle) * 5 * (this.life * 10);

                // 绘制发光魔法球
                const magicGradient = ctx.createRadialGradient(
                    this.x + offsetX, this.y + offsetY, 0,
                    this.x + offsetX, this.y + offsetY, this.size
                );
                magicGradient.addColorStop(0, lightenColor(this.color, 30));
                magicGradient.addColorStop(0.5, this.color);
                magicGradient.addColorStop(1, 'transparent');

                ctx.fillStyle = magicGradient;
                ctx.beginPath();
                ctx.arc(this.x + offsetX, this.y + offsetY, this.size, 0, Math.PI * 2);
                ctx.fill();

                // 更新振荡角度
                this.angle += this.oscillationSpeed;

                // 恢复全局透明度
                ctx.globalAlpha = this.life;
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

// 创建魔法粒子效果
function createMagicParticles(x, y, color, count = 8) {
    for (let i = 0; i < count; i++) {
        gameState.particles.push(new Particle(x, y, color, 'magic'));
    }
}

// 增强的屏幕震动功能 - 修正版本
function shakeScreen(intensity, duration) {
    gameState.screenShake = Math.max(gameState.screenShake, intensity);
    // 使用更平滑的震动衰减
    setTimeout(() => {
        // 震动会在duration时间内平滑衰减到0
        // 在这里我们不会立即设置为0，而是依赖主循环中的自然衰减
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
        if (getDistance(gameState.player, drop) < player.size + drop.size) {
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

    // 播放收集物品音效
    AudioManager.playSound('collect');

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

    // 通知成就系统获取了新武器
    AchievementSystem.onWeaponAcquired(newWeapon);

    const logMsg = oldWeapon
        ? `💔 失去 ${oldWeapon.name} → ⚔️ 获得 ${newWeapon.name}`
        : `⚔️ 获得 ${newWeapon.name}`;

    const logClass = newWeapon.damage > (oldWeapon?.damage || 0) ? 'weapon-get' : 'weapon-lose';
    showCombatLog(logMsg, logClass);

    // 更好的粒子效果
    createParticles(player.x, player.y, newWeapon.color, 20, 'explosion');
}

function usePotion(potion) {
    // 通知成就系统使用了药水
    AchievementSystem.onPotionUsed(potion);

    switch (potion.effect) {
        case 'heal':
            gameState.player.hp = Math.min(gameState.player.maxHp, gameState.player.hp + potion.value);

            // 检查是否在低血量时使用生命药水，触发凤凰涅槃成就
            if (gameState.player.hp < gameState.player.maxHp * 0.2 && potion.value > gameState.player.maxHp * 0.3) {
                AchievementSystem.onPhoenixRise();
            }

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

        // 新增药水效果
        case 'shield':
            // 添加护盾效果
            gameState.buffs.push({ effect: 'shield', duration: potion.duration, value: potion.value });
            showCombatLog(`🛡️ 使用 ${potion.name}，获得 ${potion.value} 点护盾！`, 'weapon-get');
            break;
        case 'speed':
            // 增加玩家速度
            gameState.buffs.push({ effect: 'speed', duration: potion.duration, value: potion.value });
            showCombatLog(`💨 使用 ${potion.name}，移动速度 +${potion.value}！`, 'weapon-get');
            break;
        case 'regen':
            // 生命回复效果
            gameState.buffs.push({ effect: 'regen', duration: potion.duration, value: potion.value });
            showCombatLog(`🌿 使用 ${potion.name}，持续回血！`, 'weapon-get');
            break;

        case 'counter':
            // 反击效果 - 受伤时反击
            gameState.buffs.push({ effect: 'counter', duration: potion.duration, value: potion.value });
            showCombatLog(`⚔️ 使用 ${potion.name}，获得反击能力！`, 'weapon-get');
            break;

        case 'purge_negative':
            // 净化效果 - 清除负面状态
            const negativeEffects = ['poison', 'slow', 'curse']; // 假设这些是负面效果
            const originalBuffCount = gameState.buffs.length;

            // 过滤掉负面状态
            gameState.buffs = gameState.buffs.filter(buff => !negativeEffects.includes(buff.effect));

            const removedCount = originalBuffCount - gameState.buffs.length;
            if (removedCount > 0) {
                showCombatLog(`🧪 使用 ${potion.name}，清除了 ${removedCount} 个负面状态！`, 'weapon-get');
            } else {
                showCombatLog(`🧪 使用 ${potion.name}，没有负面状态可清除`, 'weapon-get');
            }
            break;
    }
    updateUI();
}

function collectRelic(relic) {
    gameState.relics.push(relic);

    // 通知成就系统获得了遗物
    AchievementSystem.onRelicAcquired();

    showCombatLog(`🏺 获得遗物：${relic.name} - ${relic.desc}`, 'weapon-get');
    updateUI();
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

    // 随着关卡提高，生成速度加快（调整为更平缓的增长，使游戏体验更好）
    // 初始速度较慢，让新手玩家有适应期；后期增速更快，增加挑战性
    const spawnRate = Math.max(1000, 8000 - gameState.level * 120); // 调整增长速率以优化平衡性
    setTimeout(spawnEnemy, spawnRate);
}

function updateBuffs() {
    // 处理再生效果
    const regenBuff = gameState.buffs.find(b => b.effect === 'regen');
    if (regenBuff) {
        // 每秒恢复一定生命值
        if (Date.now() % 1000 < 17) { // 约每秒60次中的1次（约每秒恢复一次）
            gameState.player.hp = Math.min(gameState.player.maxHp, gameState.player.hp + regenBuff.value);
        }
    }

    // 注意：反击效果将在碰撞检测中处理

    for (let i = gameState.buffs.length - 1; i >= 0; i--) {
        gameState.buffs[i].duration -= 1/60; // 假设 60fps
        if (gameState.buffs[i].duration <= 0) {
            gameState.buffs.splice(i, 1);
        }
    }
}

function updateUI() {
    document.getElementById('hp').textContent = gameState.player.hp;
    document.getElementById('maxHp').textContent = gameState.player.maxHp;  // 更新最大生命值显示
    document.getElementById('weapon').textContent = gameState.player.weapon?.name || '无';
    document.getElementById('level').textContent = gameState.level;
    document.getElementById('goal').textContent = `击杀${Math.min(30, 5 + Math.floor(gameState.level * 1.2) + Math.floor(gameState.level / 4) * 3)}敌升级`;
    document.getElementById('kills').textContent = gameState.kills;
    document.getElementById('combo').textContent = gameState.player.combo;
    document.getElementById('score').textContent = gameState.player.score;

    // 更新生命值条
    const healthPercent = (gameState.player.hp / gameState.player.maxHp) * 100;
    document.getElementById('health-bar').style.width = `${healthPercent}%`;

    // 更新BUFF显示
    if (gameState.buffs.length > 0) {
        const buffNames = gameState.buffs.map(buff => {
            const effectNames = {
                'protect': '🛡️保护',
                'luck': '✨幸运',
                'damage': '💪力量',
                'shield': '🛡️护盾',
                'speed': '💨加速',
                'regen': '🌿回血',
                'counter': '⚔️反击',
                'berserk_damage': '😠狂暴'
            };
            return effectNames[buff.effect] || buff.effect;
        });
        document.getElementById('buffs').textContent = buffNames.join(',');
    } else {
        document.getElementById('buffs').textContent = '无';
    }

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

    // 应用狂暴伤害倍数
    const berserkBuff = gameState.buffs.find(b => b.effect === 'berserk_damage');
    if (berserkBuff) damage *= berserkBuff.value;

    // 检查是否使用了幸运药水
    const luckBuff = gameState.buffs.find(b => b.effect === 'luck');
    let usedLuck = luckBuff !== undefined;

    let hitCount = 0;

    // 检查是否有敌人在攻击范围内
    for (let i = gameState.enemies.length - 1; i >= 0; i--) {
        const enemy = gameState.enemies[i];
        const distance = getDistance(gameState.player, enemy);

        if (distance <= player.size + enemy.size + gameState.player.attackRange) {
            // 击中敌人
            enemy.hp -= damage;
            hitCount++;

            // 创建增强的击中粒子效果（根据当前武器类型）
            enhancedAttackEffect(enemy.x, enemy.y, damage, gameState.player.weapon);

            // 如果敌人死亡
            if (enemy.hp <= 0) {
                // 增加得分
                let enemyScore = Math.floor(enemy.maxHp / 10);
                switch(enemy.type) {
                    case 'MELEE': enemyScore += 10; break;
                    case 'RANGED': enemyScore += 20; break;
                    case 'ELITE': enemyScore += 50; break;
                    case 'TANK': enemyScore += 75; break; // 为新增的坦克类型添加分数
                    case 'BOSS': enemyScore += 100; break;
                }

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

                // 根据当前关卡决定升级所需的击杀数，使其与UI显示一致
                // 优化升级公式：前期增长较慢，让玩家有适应期；后期增长加快，保持挑战性
                const killsNeededForLevel = Math.min(30, 5 + Math.floor(gameState.level * 1.2) + Math.floor(gameState.level / 4) * 3);

                if (gameState.kills % killsNeededForLevel === 0) {
                    gameState.level++;
                    showCombatLog(`🎉 升级到第 ${gameState.level} 关！`, 'weapon-get');
                }

                gameState.enemies.splice(i, 1);

                // 如果使用了幸运药水并且击杀敌人，记录幸运击杀
                if (usedLuck) {
                    AchievementSystem.onLuckyKill();
                }
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

// 增强的攻击效果
function enhancedAttackEffect(x, y, damage, weaponType) {
    // 基础伤害效果
    createParticles(x, y, '#FFD700', 5 + Math.floor(damage/10));

    // 根据武器稀有度创建不同颜色的粒子
    let particleColor = '#FFD700'; // 默认金色
    if (weaponType) {
        switch(weaponType.rarity) {
            case 'common': particleColor = '#888888'; break; // 灰色
            case 'uncommon': particleColor = '#4CAF50'; break; // 绿色
            case 'rare': particleColor = '#2196F3'; break; // 蓝色
            case 'epic': particleColor = '#9C27B0'; break; // 紫色
            case 'legendary': particleColor = '#FF9800'; break; // 橙色
            case 'mythic': particleColor = '#E91E63'; break; // 粉色
        }

        // 创建与武器稀有度匹配的粒子
        createParticles(x, y, particleColor, 8 + Math.floor(damage/5));
    }

    // 如果是史诗及以上级别的武器，创建额外的光环效果
    if (weaponType && (weaponType.rarity === 'epic' || weaponType.rarity === 'legendary' || weaponType.rarity === 'mythic')) {
        // 创建一个更大的光环效果
        createParticles(x, y, particleColor, 12 + Math.floor(damage/4), 'explosion');

        // 增加屏幕震动
        gameState.screenShake = Math.min(15, 5 + Math.floor(damage/10)); // 最大震动15
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
        if (getDistance(gameState.player, enemy) < player.size + enemy.size) {
            // 计算伤害
            let damage = enemy.damage;
            if (gameState.player.weapon) {
                let weaponDamage = gameState.player.weapon.damage;
                const damageBuff = gameState.buffs.find(b => b.effect === 'damage');
                if (damageBuff) weaponDamage += damageBuff.value;

                // 应用狂暴伤害倍数
                const berserkBuff = gameState.buffs.find(b => b.effect === 'berserk_damage');
                if (berserkBuff) weaponDamage *= berserkBuff.value;

                damage = Math.max(1, damage - weaponDamage / 5);
            }

            // 检查是否有护盾效果
            const shieldBuff = gameState.buffs.find(b => b.effect === 'shield');
            if (shieldBuff) {
                // 先减少护盾值
                const shieldReduction = Math.min(damage, shieldBuff.value);
                damage -= shieldReduction;

                // 更新护盾值
                shieldBuff.value -= shieldReduction;

                if (shieldBuff.value <= 0) {
                    // 护盾耗尽，移除buff
                    const shieldIndex = gameState.buffs.findIndex(b => b.effect === 'shield');
                    if (shieldIndex !== -1) {
                        gameState.buffs.splice(shieldIndex, 1);
                    }
                }
            }

            // 播放受伤音效
            AudioManager.playSound('hurt');

            gameState.player.hp -= damage;
            createParticles(gameState.player.x, gameState.player.y, '#ff0000', 15, 'explosion');

            // 检查是否有反击效果
            const counterBuff = gameState.buffs.find(b => b.effect === 'counter');
            if (counterBuff) {
                // 对敌人造成反击伤害
                enemy.hp -= counterBuff.value;

                // 创建反击粒子效果
                createParticles(enemy.x, enemy.y, '#FFD700', 10, 'sparkle');

                // 如果敌人因此死亡
                if (enemy.hp <= 0) {
                    // 增加得分
                    let enemyScore = Math.floor(enemy.maxHp / 10);
                    switch(enemy.type) {
                        case 'MELEE': enemyScore += 10; break;
                        case 'RANGED': enemyScore += 20; break;
                        case 'ELITE': enemyScore += 50; break;
                        case 'TANK': enemyScore += 75; break;
                        case 'BOSS': enemyScore += 100; break;
                    }

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
                }
            }

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
        if (getDistance(gameState.player, proj) < player.size + proj.size) {
            // 检查是否有护盾效果
            const shieldBuff = gameState.buffs.find(b => b.effect === 'shield');
            let projDamage = proj.damage;

            if (shieldBuff) {
                // 先减少护盾值
                const shieldReduction = Math.min(projDamage, shieldBuff.value);
                projDamage -= shieldReduction;

                // 更新护盾值
                shieldBuff.value -= shieldReduction;

                if (shieldBuff.value <= 0) {
                    // 护盾耗尽，移除buff
                    const shieldIndex = gameState.buffs.findIndex(b => b.effect === 'shield');
                    if (shieldIndex !== -1) {
                        gameState.buffs.splice(shieldIndex, 1);
                    }
                }
            }

            // 检查是否有反击效果 - 注意反击只针对接触伤害，不包括射弹
            // 但如果确实想要反击射弹，可以取消注释下面几行
            /*
            const counterBuff = gameState.buffs.find(b => b.effect === 'counter');
            if (counterBuff) {
                // 找到发射该射弹的敌人并对其造成伤害
                // 由于我们没有跟踪射弹来源，暂时跳过
            }
            */

            gameState.player.hp -= projDamage;
            createParticles(proj.x, proj.y, proj.color, 12, 'explosion');
            gameState.projectiles.splice(i, 1);

            // 受到射弹攻击时的屏幕震动
            gameState.screenShake = Math.min(10, projDamage);

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
        // 添加存档和读档快捷键
        case 's':
            SaveSystem.save();
            break;
        case 'l':
            SaveSystem.load();
            updateUI(); // 确保UI更新
            break;
        case 'c':
            // 检查并显示当前成就状态
            const unlocked = AchievementSystem.getUnlockedCount();
            const total = AchievementSystem.getTotalCount();
            showCombatLog(`📊 成就: ${unlocked}/${total}`, 'weapon-get');
            break;
    }
});

function gameLoop() {
    if (!gameState.isPlaying) return;

    // 检查胜利条件：达到第50关
    if (gameState.level >= 50) {
        winGame();
        return;
    }

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
    // 同步 player 位置到 gameState
    gameState.player.x = player.x;
    gameState.player.y = player.y;
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

    // 绘制支援型敌人与其他敌人的连接线
    for (const enemy of gameState.enemies) {
        if (enemy.type === 'SUPPORT') {
            // 为每个支援型敌人绘制到其支援范围内其他敌人的连线
            for (const otherEnemy of gameState.enemies) {
                if (otherEnemy !== enemy) {
                    const dist = getDistance(enemy, otherEnemy);
                    if (dist < 100) { // 支援范围
                        ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(enemy.x, enemy.y);
                        ctx.lineTo(otherEnemy.x, otherEnemy.y);
                        ctx.stroke();
                    }
                }
            }
        }
    }

    // 绘制所有敌人
    gameState.enemies.forEach(enemy => enemy.draw());
    gameState.projectiles.forEach(proj => {
        // 使用自定义精灵绘制射弹（如果有对应图像）
        // 否则使用原始的圆形绘制
        const enemyImg = imageCache['assets/sprites/enemies.png'];
        if (enemyImg) {
            // 尝试使用敌人精灵的一个小部分作为射弹
            ctx.save();
            ctx.translate(proj.x, proj.y);
            // 使用缩放比例使精灵适合射弹大小
            ctx.drawImage(enemyImg, -proj.size, -proj.size, proj.size*2, proj.size*2);
            ctx.restore();
        } else {
            // 回退到原来的绘制方式
            ctx.fillStyle = proj.color;
            ctx.beginPath();
            ctx.arc(proj.x, proj.y, proj.size, 0, Math.PI * 2);
            ctx.fill();
        }
    });

    checkCollisions();
    updateUI();

    // 检查成就
    AchievementSystem.checkAchievements();

    // 绘制技能冷却显示
    drawSkillCooldowns();

    if (gameState.screenShake > 0) {
        ctx.restore(); // 恢复画布变换
    }

    requestAnimationFrame(gameLoop);
}

function startGame() {
    // 尝试加载之前的存档
    const hasSave = SaveSystem.load();

    // 检查图像是否已加载，如果没有则等待加载完成
    if (Object.keys(imageCache).length === 0) {
        loadAllImages().then(() => {
            console.log('延迟加载的游戏图像完成');
            initGame();
        }).catch(err => {
            console.error('延迟图像加载失败:', err);
            initGame(); // 即使失败也要继续
        });
    } else {
        initGame();
    }
}

function initGame() {
    // 保存当前的游戏状态，以便在重新开始游戏时决定是否重置
    const shouldResetGame = !gameState.isPlaying; // 如果游戏没在进行中，表示是全新开始

    gameState = {
        player: {
            x: canvas.width / 2,  // 添加玩家坐标
            y: canvas.height / 2, // 添加玩家坐标
            hp: 150,  // 提高玩家初始生命值以增强生存能力
            maxHp: 150,  // 同步最大生命值
            weapon: null,
            weapons: [],
            lastWeapon: null,
            attackRange: 90, // 增加攻击范围，提高操作手感
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

    // 如果不是全新的游戏，尝试从localStorage恢复游戏状态
    if (!shouldResetGame) {
        SaveSystem.load();
    } else {
        // 如果是全新游戏，重置成就系统临时状态
        AchievementSystem.resetTempStats();
    }

    // 重置技能冷却
    for (const key in skillCooldowns) {
        skillCooldowns[key] = 0;
    }

    // 重新初始化玩家对象
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;

    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-over').classList.add('hidden');

    spawnEnemy();
    gameLoop();
}

function gameOver() {
    gameState.isPlaying = false;
    gameState.isGameOver = true;

    // 播放游戏结束音效
    AudioManager.playSound('gameOver');

    // 创建大量爆炸粒子效果
    for (let i = 0; i < 100; i++) {
        createParticles(gameState.player.x, gameState.player.y, '#ff0000', 1, 'explosion');
    }

    // 强烈的屏幕震动
    gameState.screenShake = 30;

    document.getElementById('final-level').textContent = gameState.level;
    document.getElementById('final-kills').textContent = gameState.kills;
    document.getElementById('final-score').textContent = gameState.player.score; // 需要在HTML中添加此元素
    document.getElementById('game-over').classList.remove('hidden');

    // 检查成就
    AchievementSystem.checkAchievements();
}

function winGame() {
    // 播放胜利音效
    AudioManager.playSound('victory');

    // 创建大量庆祝粒子效果
    for (let i = 0; i < 200; i++) {
        createParticles(gameState.player.x, gameState.player.y,
                       `hsl(${Math.random() * 360}, 100%, 50%)`, 3, 'sparkle');
    }

    // 巨大的屏幕震动
    gameState.screenShake = 50;

    // 显示胜利信息
    showCombatLog(`🎊 恭喜通关！达到第 ${gameState.level} 关！`, 'weapon-get');

    // 更新UI并显示游戏结束界面（胜利）
    document.getElementById('final-level').textContent = gameState.level;
    document.getElementById('final-kills').textContent = gameState.kills;
    document.getElementById('final-score').textContent = gameState.player.score;
    document.getElementById('game-over').classList.remove('hidden');

    // 修改标题为"获胜"
    setTimeout(() => {
        document.querySelector('#game-over h2').textContent = '🎉 胜利!';
    }, 100);

    gameState.isPlaying = false;
    gameState.isGameOver = true;

    // 检查成就
    AchievementSystem.checkAchievements();
}

// 按钮事件
document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('restart-btn').addEventListener('click', startGame);

// 初始绘制
ctx.fillStyle = '#1a1a2e';
ctx.fillRect(0, 0, canvas.width, canvas.height);
