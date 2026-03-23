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

    // 新增普通武器
    { name: '旧渔网', damage: 2, rarity: 'common', color: '#1E90FF' },
    { name: '破木屐', damage: 3, rarity: 'common', color: '#8B4513' },
    { name: '枯枝', damage: 4, rarity: 'common', color: '#6B8E23' },
    { name: '碎石块', damage: 5, rarity: 'common', color: '#708090' },
    { name: '锈蚀鱼叉', damage: 6, rarity: 'common', color: '#A9A9A9' },
    { name: '破旧手套', damage: 2, rarity: 'common', color: '#2F4F4F' },
    { name: '破损雨伞', damage: 4, rarity: 'common', color: '#800000' },
    { name: '断箭头', damage: 5, rarity: 'common', color: '#CD853F' },
    { name: '破陶罐', damage: 3, rarity: 'common', color: '#A0522D' },
    { name: '腐朽长棍', damage: 5, rarity: 'common', color: '#654321' },

    // 新增不常见武器
    { name: '工匠锤', damage: 14, rarity: 'uncommon', color: '#C0C0C0' },
    { name: '猎人小刀', damage: 12, rarity: 'uncommon', color: '#8B4513' },
    { name: '铁皮护腕', damage: 11, rarity: 'uncommon', color: '#696969' },

    // 新增不常见武器
    { name: '精灵短弓', damage: 13, rarity: 'uncommon', color: '#228B22' },
    { name: '矮人战斧', damage: 18, rarity: 'uncommon', color: '#A0522D' },
    { name: '游侠长鞭', damage: 14, rarity: 'uncommon', color: '#8FBC8F' },
    { name: '盗贼匕首', damage: 15, rarity: 'uncommon', color: '#696969' },
    { name: '牧师法杖', damage: 13, rarity: 'uncommon', color: '#FFD700' },

    // 新增稀有武器
    { name: '龙牙匕首', damage: 36, rarity: 'rare', color: '#3CB371' },
    { name: '凤凰涅槃剑', damage: 40, rarity: 'rare', color: '#FF4500' },
    { name: '雷霆之怒', damage: 38, rarity: 'rare', color: '#00BFFF' },
    { name: '极光之刃', damage: 37, rarity: 'rare', color: '#7FFFD4' },
    { name: '月华法杖', damage: 39, rarity: 'rare', color: '#F0E68C' },

    // 新增史诗武器
    { name: '银河战神剑', damage: 54, rarity: 'epic', color: '#4169E1' },
    { name: '深渊恐惧', damage: 57, rarity: 'epic', color: '#2F4F4F' },
    { name: '时间之主', damage: 61, rarity: 'epic', color: '#9370DB' },
    { name: '空间撕裂者', damage: 59, rarity: 'epic', color: '#8A2BE2' },
    { name: '真理追寻者', damage: 64, rarity: 'epic', color: '#FF1493' },

    // 新增传说武器
    { name: '造物之主', damage: 90, rarity: 'legendary', color: '#FFD700' },
    { name: '虚无缥缈', damage: 86, rarity: 'legendary', color: '#F8F8FF' },
    { name: '审判日', damage: 93, rarity: 'legendary', color: '#FFFFFF' },
    { name: '世界之树', damage: 87, rarity: 'legendary', color: '#32CD32' },
    { name: '混沌之核', damage: 91, rarity: 'legendary', color: '#FF00FF' },

    // 新增神话武器
    { name: '现实扭曲者', damage: 1100, rarity: 'mythic', color: '#FF69B4' },
    { name: '维度支配者', damage: 1050, rarity: 'mythic', color: '#4682B4' },
    { name: '概念抹除者', damage: 1300, rarity: 'mythic', color: '#9400D3' },
    { name: '宇宙起源', damage: 1250, rarity: 'mythic', color: '#000000' },
    { name: '存在意义', damage: 1150, rarity: 'mythic', color: '#0000FF' },
    { name: '锋利镰刀', damage: 15, rarity: 'uncommon', color: '#2F4F4F' },
    { name: '游侠短剑', damage: 13, rarity: 'uncommon', color: '#708090' },
    { name: '坚固战锤', damage: 16, rarity: 'uncommon', color: '#A9A9A9' },
    { name: '磨砺斧头', damage: 17, rarity: 'uncommon', color: '#666666' },
    { name: '坚韧藤条', damage: 10, rarity: 'uncommon', color: '#8FBC8F' },
    { name: '锐利标枪', damage: 18, rarity: 'uncommon', color: '#C0C0C0' },
    { name: '精钢指虎', damage: 14, rarity: 'uncommon', color: '#2F4F4F' },

    // 新增稀有武器
    { name: '雷鸣之锤', damage: 28, rarity: 'rare', color: '#FFD700' },
    { name: '月华匕首', damage: 26, rarity: 'rare', color: '#7FFFD4' },
    { name: '炽热战斧', damage: 31, rarity: 'rare', color: '#FF4500' },
    { name: '苍穹之弓', damage: 29, rarity: 'rare', color: '#87CEEB' },
    { name: '翡翠法杖', damage: 32, rarity: 'rare', color: '#00FF7F' },
    { name: '寒冰三叉戟', damage: 33, rarity: 'rare', color: '#E0F6FF' },
    { name: '烈焰鞭', damage: 30, rarity: 'rare', color: '#FF6347' },
    { name: '风暴战刃', damage: 34, rarity: 'rare', color: '#4682B4' },
    { name: '圣光之刃', damage: 35, rarity: 'rare', color: '#FFFFFF' },
    { name: '暗影魔剑', damage: 36, rarity: 'rare', color: '#2F2F2F' },

    // 新增史诗武器
    { name: '末日之刃', damage: 42, rarity: 'epic', color: '#8B008B' },
    { name: '天罚雷锤', damage: 44, rarity: 'epic', color: '#FFFF00' },
    { name: '龙魂战斧', damage: 46, rarity: 'epic', color: '#FF4500' },
    { name: '天使审判', damage: 48, rarity: 'epic', color: '#FFFAF0' },
    { name: '深渊凝视', damage: 50, rarity: 'epic', color: '#000080' },
    { name: '时光之河', damage: 47, rarity: 'epic', color: '#48D1CC' },
    { name: '星云之怒', damage: 49, rarity: 'epic', color: '#9370DB' },
    { name: '创世之锤', damage: 45, rarity: 'epic', color: '#F0E68C' },
    { name: '虚无吞噬者', damage: 52, rarity: 'epic', color: '#000000' },
    { name: '元素支配者', damage: 51, rarity: 'epic', color: '#32CD32' },

    // 新增传说武器
    { name: '万神之剑', damage: 65, rarity: 'legendary', color: '#FF1493' },
    { name: '不朽之证', damage: 70, rarity: 'legendary', color: '#4169E1' },
    { name: '秩序之锚', damage: 68, rarity: 'legendary', color: '#7CFC00' },
    { name: '混沌之眼', damage: 72, rarity: 'legendary', color: '#FF00FF' },
    { name: '永恒之约', damage: 75, rarity: 'legendary', color: '#00BFFF' },

    // 新增神话武器
    { name: '概念具现', damage: 600, rarity: 'mythic', color: '#9932CC' },
    { name: '现实扭曲器', damage: 700, rarity: 'mythic', color: '#00FA9A' },
    { name: '维度棱镜', damage: 650, rarity: 'mythic', color: '#FF69B4' },
    { name: '因果律武器', damage: 750, rarity: 'mythic', color: '#4169E1' },
    { name: '观测者之眼', damage: 680, rarity: 'mythic', color: '#3CB371' },

    // 新增普通武器
    { name: '铁铲', damage: 4, rarity: 'common', color: '#A0522D' },
    { name: '木尺', damage: 3, rarity: 'common', color: '#D2B48C' },
    { name: '竹签', damage: 2, rarity: 'common', color: '#9ACD32' },
    { name: '扫帚柄', damage: 3, rarity: 'common', color: '#8B4513' },
    { name: '菜刀', damage: 5, rarity: 'common', color: '#C0C0C0' },
    { name: '擀面杖', damage: 4, rarity: 'common', color: '#D2B48C' },
    { name: '筷子', damage: 2, rarity: 'common', color: '#8B4513' },
    { name: '锅铲', damage: 4, rarity: 'common', color: '#C0C0C0' },
    { name: '钥匙扣', damage: 3, rarity: 'common', color: '#FFD700' },
    { name: '衣架', damage: 2, rarity: 'common', color: '#C0C0C0' },

    // 新增不常见武器
    { name: '银针', damage: 12, rarity: 'uncommon', color: '#C0C0C0' },
    { name: '钢丝', damage: 11, rarity: 'uncommon', color: '#A9A9A9' },
    { name: '铁钳', damage: 14, rarity: 'uncommon', color: '#708090' },
    { name: '铜管', damage: 13, rarity: 'uncommon', color: '#B87333' },
    { name: '石斧', damage: 15, rarity: 'uncommon', color: '#808080' },
    { name: '骨锥', damage: 16, rarity: 'uncommon', color: '#F5F5DC' },
    { name: '钢爪', damage: 17, rarity: 'uncommon', color: '#696969' },
    { name: '铁钩', damage: 15, rarity: 'uncommon', color: '#2F4F4F' },
    { name: '铜哨', damage: 12, rarity: 'uncommon', color: '#CD853F' },
    { name: '铁刺', damage: 14, rarity: 'uncommon', color: '#778899' },

    // 新增稀有武器
    { name: '水晶匕首', damage: 25, rarity: 'rare', color: '#B0E0E6' },
    { name: '月牙刃', damage: 27, rarity: 'rare', color: '#FFE4C4' },
    { name: '星辉剑', damage: 29, rarity: 'rare', color: '#FFFACD' },
    { name: '日轮斧', damage: 31, rarity: 'rare', color: '#FFD700' },
    { name: '海神叉', damage: 33, rarity: 'rare', color: '#00CED1' },
    { name: '雷神锤', damage: 32, rarity: 'rare', color: '#F0E68C' },
    { name: '风神扇', damage: 28, rarity: 'rare', color: '#87CEEB' },
    { name: '土神锤', damage: 35, rarity: 'rare', color: '#DAA520' },
    { name: '火龙鞭', damage: 34, rarity: 'rare', color: '#FF4500' },
    { name: '冰晶刃', damage: 30, rarity: 'rare', color: '#87CEFA' },

    // 新增史诗武器
    { name: '创世之弓', damage: 40, rarity: 'epic', color: '#FFB6C1' },
    { name: '灭世之矛', damage: 42, rarity: 'epic', color: '#CD5C5C' },
    { name: '封神之印', damage: 44, rarity: 'epic', color: '#F0FFF0' },
    { name: '诛仙之剑', damage: 46, rarity: 'epic', color: '#7FFFD4' },
    { name: '戮仙之斧', damage: 48, rarity: 'epic', color: '#DEB887' },
    { name: '陷仙之锤', damage: 45, rarity: 'epic', color: '#D8BFD8' },
    { name: '绝仙之刃', damage: 47, rarity: 'epic', color: '#DDA0DD' },
    { name: '盘古斧', damage: 49, rarity: 'epic', color: '#BDB76B' },
    { name: '女娲石', damage: 43, rarity: 'epic', color: '#F5DEB3' },
    { name: '伏羲琴', damage: 41, rarity: 'epic', color: '#DAA520' },

    // 新增传说武器
    { name: '鸿蒙剑', damage: 60, rarity: 'legendary', color: '#32CD32' },
    { name: '太初刀', damage: 62, rarity: 'legendary', color: '#BA55D3' },
    { name: '混元锤', damage: 64, rarity: 'legendary', color: '#48D1CC' },
    { name: '太极扇', damage: 58, rarity: 'legendary', color: '#F4A460' },
    { name: '阴阳镜', damage: 66, rarity: 'legendary', color: '#663399' },
    { name: '八卦炉', damage: 55, rarity: 'legendary', color: '#FF0000' },
    { name: '乾坤鼎', damage: 68, rarity: 'legendary', color: '#20B2AA' },
    { name: '轮回盘', damage: 65, rarity: 'legendary', color: '#FF69B4' },
    { name: '造化果', damage: 57, rarity: 'legendary', color: '#FF1493' },
    { name: '混沌珠', damage: 70, rarity: 'legendary', color: '#9370DB' },

    // 新增的普通武器（50+新武器的第一批）
    { name: '铁锅', damage: 6, rarity: 'common', color: '#708090' },
    { name: '擀面杖', damage: 5, rarity: 'common', color: '#D2B48C' },
    { name: '汤勺', damage: 2, rarity: 'common', color: '#C0C0C0' },
    { name: '叉子', damage: 3, rarity: 'common', color: '#C0C0C0' },
    { name: '削皮刀', damage: 4, rarity: 'common', color: '#708090' },
    { name: '扳手', damage: 6, rarity: 'common', color: '#A9A9A9' },
    { name: '锤子', damage: 7, rarity: 'common', color: '#696969' },
    { name: '螺丝刀', damage: 4, rarity: 'common', color: '#CD853F' },
    { name: '钳子', damage: 5, rarity: 'common', color: '#778899' },
    { name: '卷尺', damage: 2, rarity: 'common', color: '#D3D3D3' },

    // 新增的不常见武器
    { name: '工兵铲', damage: 12, rarity: 'uncommon', color: '#808080' },
    { name: '登山镐', damage: 14, rarity: 'uncommon', color: '#C0C0C0' },
    { name: '伐木斧', damage: 16, rarity: 'uncommon', color: '#8B4513' },
    { name: '猎刀', damage: 15, rarity: 'uncommon', color: '#2F4F4F' },
    { name: '军用匕首', damage: 13, rarity: 'uncommon', color: '#708090' },
    { name: '战术锤', damage: 17, rarity: 'uncommon', color: '#A9A9A9' },
    { name: '警棍', damage: 11, rarity: 'uncommon', color: '#2F2F2F' },
    { name: '船桨', damage: 13, rarity: 'uncommon', color: '#8B4513' },
    { name: '鱼叉', damage: 18, rarity: 'uncommon', color: '#4682B4' },
    { name: '三节棍', damage: 14, rarity: 'uncommon', color: '#DAA520' },

    // Steam发布新增不常见武器 (10个)
    { name: '消防斧', damage: 19, rarity: 'uncommon', color: '#B22222' },
    { name: '撬棍', damage: 16, rarity: 'uncommon', color: '#2F4F4F' },
    { name: '手电筒', damage: 12, rarity: 'uncommon', color: '#DAA520' },
    { name: '登山绳', damage: 11, rarity: 'uncommon', color: '#8B4513' },
    { name: '指南针', damage: 10, rarity: 'uncommon', color: '#C0C0C0' },
    { name: '望远镜', damage: 13, rarity: 'uncommon', color: '#2F4F4F' },
    { name: '瑞士军刀', damage: 15, rarity: 'uncommon', color: '#696969' },
    { name: '工字锉', damage: 14, rarity: 'uncommon', color: '#708090' },
    { name: '平口钳', damage: 13, rarity: 'uncommon', color: '#A9A9A9' },
    { name: '钢锯', damage: 16, rarity: 'uncommon', color: '#666666' },

    // 新增的稀有武器
    { name: '符文短剑', damage: 22, rarity: 'rare', color: '#4169E1' },
    { name: '月牙铲', damage: 25, rarity: 'rare', color: '#7FFFD4' },
    { name: '龙鳞匕', damage: 24, rarity: 'rare', color: '#FF6347' },
    { name: '凤凰羽扇', damage: 26, rarity: 'rare', color: '#FF6347' },
    { name: '玄武甲胄', damage: 23, rarity: 'rare', color: '#2F4F4F' },
    { name: '青龙偃月刀', damage: 28, rarity: 'rare', color: '#7CFC00' },
    { name: '白虎啸天', damage: 27, rarity: 'rare', color: '#F5F5DC' },
    { name: '朱雀之翼', damage: 29, rarity: 'rare', color: '#FF4500' },
    { name: '麒麟角', damage: 30, rarity: 'rare', color: '#F0E68C' },
    { name: '貔貅牙', damage: 25, rarity: 'rare', color: '#DAA520' },

    // Steam发布新增稀有武器 (10个)
    { name: '雷神 hammer', damage: 32, rarity: 'rare', color: '#F0E68C' },
    { name: '凤凰涅槃', damage: 33, rarity: 'rare', color: '#FF4500' },
    { name: '龙鳞战甲', damage: 31, rarity: 'rare', color: '#4169E1' },
    { name: '虎符令', damage: 29, rarity: 'rare', color: '#CD5C5C' },
    { name: '凤鸣琴', damage: 30, rarity: 'rare', color: '#F5DEB3' },
    { name: '麒麟玉佩', damage: 28, rarity: 'rare', color: '#8FBC8F' },
    { name: '玄武石印', damage: 34, rarity: 'rare', color: '#2F4F4F' },
    { name: '饕餮纹鼎', damage: 35, rarity: 'rare', color: '#696969' },
    { name: '伏魔杵', damage: 32, rarity: 'rare', color: '#8B0000' },
    { name: '降妖杖', damage: 31, rarity: 'rare', color: '#228B22' },

    // 新增的史诗武器
    { name: '天罡北斗阵', damage: 35, rarity: 'epic', color: '#483D8B' },
    { name: '地煞黄泉路', damage: 36, rarity: 'epic', color: '#8B0000' },
    { name: '五行相生剑', damage: 37, rarity: 'epic', color: '#32CD32' },
    { name: '八卦游龙阵', damage: 38, rarity: 'epic', color: '#FFD700' },
    { name: '奇门遁甲', damage: 39, rarity: 'epic', color: '#9370DB' },
    { name: '太乙玄门', damage: 40, rarity: 'epic', color: '#000080' },
    { name: '九宫八卦', damage: 41, rarity: 'epic', color: '#4169E1' },
    { name: '混元一气', damage: 42, rarity: 'epic', color: '#7CFC00' },
    { name: '道法自然', damage: 43, rarity: 'epic', color: '#228B22' },
    { name: '无极生太极', damage: 44, rarity: 'epic', color: '#F0F8FF' },

    // Steam发布新增史诗武器 (10个)
    { name: '开天辟地斧', damage: 45, rarity: 'epic', color: '#8B0000' },
    { name: '补天神石', damage: 46, rarity: 'epic', color: '#228B22' },
    { name: '移山填海鞭', damage: 47, rarity: 'epic', color: '#DAA520' },
    { name: '呼风唤雨扇', damage: 48, rarity: 'epic', color: '#00BFFF' },
    { name: '撒豆成兵旗', damage: 49, rarity: 'epic', color: '#FF1493' },
    { name: '起死回生丹', damage: 50, rarity: 'epic', color: '#FF69B4' },
    { name: '千里眼镜', damage: 45, rarity: 'epic', color: '#4169E1' },
    { name: '顺风耳环', damage: 46, rarity: 'epic', color: '#FFD700' },
    { name: '腾云驾雾靴', damage: 44, rarity: 'epic', color: '#9370DB' },
    { name: '缩地成寸带', damage: 47, rarity: 'epic', color: '#32CD32' },

    // 新增的传说武器
    { name: '三界之主', damage: 55, rarity: 'legendary', color: '#FF1493' },
    { name: '六道轮回', damage: 58, rarity: 'legendary', color: '#8A2BE2' },
    { name: '阴阳两仪', damage: 56, rarity: 'legendary', color: '#FFFFFF' },
    { name: '四象归一', damage: 57, rarity: 'legendary', color: '#FFA500' },
    { name: '五行逆天', damage: 59, rarity: 'legendary', color: '#FF0000' },

    // Steam发布新增传说武器 (5个)
    { name: '创世神剑', damage: 65, rarity: 'legendary', color: '#FFD700' },
    { name: '灭世魔刀', damage: 67, rarity: 'legendary', color: '#8B0000' },
    { name: '造化神鼎', damage: 63, rarity: 'legendary', color: '#228B22' },
    { name: '轮回天盘', damage: 64, rarity: 'legendary', color: '#4169E1' },
    { name: '混沌珠琏', damage: 66, rarity: 'legendary', color: '#9370DB' }

    // 新增的神话武器
    { name: '大道至简', damage: 850, rarity: 'mythic', color: '#FFFF00' },
    { name: '无为而治', damage: 820, rarity: 'mythic', color: '#00FF00' },
    { name: '万物归一', damage: 900, rarity: 'mythic', color: '#FF00FF' },

    // Steam发布新增武器 (符合1-2小时游戏内容目标)
    // 新增普通武器 (10个)
    { name: '旧雨伞', damage: 5, rarity: 'common', color: '#800000' },
    { name: '晾衣杆', damage: 4, rarity: 'common', color: '#8B4513' },
    { name: '橡皮鸭', damage: 1, rarity: 'common', color: '#FFFF00' },
    { name: '计算器', damage: 2, rarity: 'common', color: '#C0C0C0' },
    { name: '圆规', damage: 3, rarity: 'common', color: '#0000FF' },
    { name: '放大镜', damage: 2, rarity: 'common', color: '#F5DEB3' },
    { name: '打气筒', damage: 3, rarity: 'common', color: '#A9A9A9' },
    { name: '订书机', damage: 4, rarity: 'common', color: '#696969' },
    { name: '台灯', damage: 2, rarity: 'common', color: '#DAA520' },
    { name: '鼠标', damage: 1, rarity: 'common', color: '#000000' }
];

// 引入额外内容 - 从外部文件加载，这里定义备用内容
const ADDITIONAL_EPIC_WEAPONS = [
    { name: '时光倒流剑', damage: 53, rarity: 'epic', color: '#7B68EE', effect: 'time_reverse', desc: '有时能使敌人倒退一秒' },
    { name: '虚无之刃', damage: 54, rarity: 'epic', color: '#4B0082', effect: 'phase_through', desc: '偶尔穿透敌人' },
    { name: '雷神之锤', damage: 55, rarity: 'epic', color: '#B0C4DE', effect: 'chain_lightning', desc: '攻击可能引发连锁闪电' },
    { name: '海神三叉戟', damage: 56, rarity: 'epic', color: '#20B2AA', effect: 'tidal_wave', desc: '攻击产生冲击波' },
    { name: '风暴使者', damage: 57, rarity: 'epic', color: '#87CEEB', effect: 'wind_boost', desc: '增加移动速度' },
    { name: '冰霜女王', damage: 58, rarity: 'epic', color: '#B0E0E6', effect: 'freeze', desc: '有几率冻结敌人' },
    { name: '烈焰君主', damage: 59, rarity: 'epic', color: '#FF4500', effect: 'burn', desc: '造成持续燃烧伤害' },
    { name: '自然之怒', damage: 60, rarity: 'epic', color: '#228B22', effect: 'poison', desc: '造成毒素伤害' },
    { name: '暗物质匕首', damage: 61, rarity: 'epic', color: '#000000', effect: 'gravity_well', desc: '吸引附近敌人' },
    { name: '光明制裁者', damage: 62, rarity: 'epic', color: '#FFFFFF', effect: 'holy_blast', desc: '对黑暗敌人造成额外伤害' },
];

const ADDITIONAL_LEGENDARY_WEAPONS = [
    { name: '创世之柱', damage: 75, rarity: 'legendary', color: '#FFD700', effect: 'creation_field', desc: '周围持续生成有益能量' },
    { name: '混沌之核', damage: 76, rarity: 'legendary', color: '#FF00FF', effect: 'chaos_orb', desc: '发射混乱球体' },
    { name: '审判日', damage: 77, rarity: 'legendary', color: '#FFFFFF', effect: 'judgment_day', desc: '周期性审判范围内敌人' },
    { name: '世界之树', damage: 78, rarity: 'legendary', color: '#32CD32', effect: 'life_bloom', desc: '持续恢复生命值' },
    { name: '虚无缥缈', damage: 79, rarity: 'legendary', color: '#F8F8FF', effect: 'intangibility', desc: '短暂无敌效果' },
    { name: '造物之主', damage: 80, rarity: 'legendary', color: '#FFD700', effect: 'creation', desc: '能创造临时盟友' },
    { name: '末日使者', damage: 81, rarity: 'legendary', color: '#8B0000', effect: 'apocalypse', desc: '蓄力后毁灭一片区域' },
    { name: '永恒大帝', damage: 82, rarity: 'legendary', color: '#4169E1', effect: 'eternity', desc: '大幅延长所有增益效果' },
    { name: '宇宙之心', damage: 83, rarity: 'legendary', color: '#0000FF', effect: 'cosmic_resonance', desc: '与宇宙共鸣，增强所有属性' },
    { name: '多元掌控', damage: 84, rarity: 'legendary', color: '#9370DB', effect: 'dimensional_control', desc: '能够操控维度力量' },
];

const ADDITIONAL_MYTHIC_WEAPONS = [
    { name: '概念抹除者', damage: 1400, rarity: 'mythic', color: '#9400D3', effect: 'conceptual_erasure', desc: '从概念层面抹除敌人' },
    { name: '维度支配者', damage: 1350, rarity: 'mythic', color: '#4682B4', effect: 'dimensional_dominion', desc: '掌控多个维度的力量' },
    { name: '现实扭曲器', damage: 1200, rarity: 'mythic', color: '#FF69B4', effect: 'reality_distortion', desc: '扭曲现实规则' },
    { name: '宇宙起源', damage: 1500, rarity: 'mythic', color: '#000000', effect: 'origin_of_universe', desc: '重现宇宙诞生的力量' },
    { name: '存在意义', damage: 1300, rarity: 'mythic', color: '#0000FF', effect: 'meaning_of_existence', desc: '揭示存在的真谛并摧毁非存在' },
    { name: '绝对零度', damage: 1100, rarity: 'mythic', color: '#87CEEB', effect: 'absolute_zero', desc: '将一切降至绝对零度' },
    { name: '时间之主', damage: 1600, rarity: 'mythic', color: '#9370DB', effect: 'lord_of_time', desc: '掌控时间的流动' },
    { name: '空间之王', damage: 1550, rarity: 'mythic', color: '#4169E1', effect: 'king_of_space', desc: '掌控空间的形态' },
    { name: '虚无之神', damage: 1700, rarity: 'mythic', color: '#2F4F4F', effect: 'god_of_void', desc: '化身虚无，超越存在' },
    { name: '无限手套', damage: 2000, rarity: 'mythic', color: '#8A2BE2', effect: 'infinity_gauntlet', desc: '拥有无限的力量' },
];

// 合并额外武器到主武器库
WEAPONS.push(...ADDITIONAL_EPIC_WEAPONS, ...ADDITIONAL_LEGENDARY_WEAPONS, ...ADDITIONAL_MYTHIC_WEAPONS);

// 引入内容扩展
try {
    // 动态加载内容扩展
    if (typeof require !== 'undefined') {
        // Node.js 环境
        const contentExpansion = require('./content-expansion-extension.js');
    } else {
        // 浏览器环境 - 使用动态导入
        import('./content-expansion-extension.js').catch(() => {
            console.log('内容扩展模块未找到，使用基础内容');
        });
    }
} catch (e) {
    console.log('加载内容扩展时出错:', e);
}

// 新增敌人类型
const ADDITIONAL_ENEMY_TYPES = {
    // 机械系敌人
    ROBOT: { name: '机器人', speed: 0.9, hp: 2.0, damage: 1.8, size: 1.6, behavior: 'mechanical', element: 'metal' },
    CYBORG: { name: '半机械人', speed: 1.4, hp: 2.5, damage: 2.2, size: 1.8, behavior: 'hybrid', element: 'metal' },
    DRONE: { name: '无人机', speed: 2.0, hp: 0.8, damage: 1.2, size: 0.8, behavior: 'flying', element: 'metal' },
    TURRET: { name: '炮塔', speed: 0.0, hp: 1.5, damage: 2.5, size: 1.2, behavior: 'stationary', element: 'metal' },

    // 神话系敌人
    ANGEL: { name: '天使', speed: 1.2, hp: 3.0, damage: 2.8, size: 2.0, behavior: 'divine', element: 'holy' },
    DEMIGOD: { name: '半神', speed: 0.8, hp: 6.0, damage: 3.5, size: 2.5, behavior: 'divine', element: 'divine' },
    DRAGON_KING: { name: '龙王', speed: 0.7, hp: 7.0, damage: 4.0, size: 3.0, behavior: 'dragon', element: 'dragon' },

    // 稀有变种敌人
    ZOMBIE: { name: '僵尸', speed: 0.4, hp: 2.2, damage: 1.4, size: 1.3, behavior: 'undead', element: 'undead' },
    ORGE: { name: '食人魔', speed: 0.6, hp: 4.0, damage: 2.8, size: 2.2, behavior: 'brute', element: 'earth' },

    // 飞行敌人
    PHOENIX: { name: '凤凰', speed: 1.5, hp: 2.5, damage: 3.0, size: 1.8, behavior: 'flying', element: 'fire' },
    GRIFFIN: { name: '狮鹫', speed: 1.6, hp: 3.2, damage: 2.6, size: 2.0, behavior: 'flying', element: 'air' },
    BASILISK: { name: '蛇怪', speed: 0.9, hp: 4.5, damage: 3.2, size: 1.9, behavior: 'gaze', element: 'poison' },
    KRAKEN: { name: '北海巨妖', speed: 0.3, hp: 8.0, damage: 4.5, size: 3.5, behavior: 'tentacles', element: 'water' },

    // 稀有精英变种
    UNICORN: { name: '独角兽', speed: 1.8, hp: 3.5, damage: 2.5, size: 1.7, behavior: 'divine', element: 'holy' },
};

// 合并敌人类型
Object.assign(ENEMY_TYPES, ADDITIONAL_ENEMY_TYPES);

// 新增药水类型
const ADDITIONAL_POTIONS = [
    { name: '传送药水', effect: 'teleport', value: 1, color: '#9370DB', desc: '瞬间传送到随机位置' },
    { name: '时间减缓', effect: 'slow_time', duration: 5, color: '#4169E1', desc: '减缓周围敌人时间' },
    { name: '护盾超载', effect: 'shield_overflow', value: 50, color: '#00BFFF', desc: '获得超大护盾' },
    { name: '元素精通', effect: 'elemental_mastery', duration: 10, value: 2, color: '#32CD32', desc: '元素伤害翻倍' },
    { name: '暴击专精', effect: 'crit_mastery', duration: 8, value: 0.3, color: '#FF4500', desc: '暴击率大幅提升' },
    { name: '反伤护盾', effect: 'thorns_shield', duration: 6, value: 0.2, color: '#8A2BE2', desc: '反弹部分伤害给攻击者' },
    { name: '吸血光环', effect: 'vampire_aura', duration: 7, value: 0.15, color: '#8B0000', desc: '攻击时恢复部分生命' },
    { name: '元素转换', effect: 'element_convert', value: 1, color: '#FFD700', desc: '临时改变武器元素属性' },
    { name: '抗性提升', effect: 'resistance_up', duration: 10, value: 0.5, color: '#20B2AA', desc: '减少受到的伤害' },
    { name: '敏捷提升', effect: 'agility_boost', duration: 8, value: 1.5, color: '#98FB98', desc: '大幅提升移动速度和闪避' },
];

// 合并药水
POTIONS.push(...ADDITIONAL_POTIONS);

// 新增遗物类型
const ADDITIONAL_RELICS = [
    { name: '时空沙漏', effect: 'time_dilation', desc: '偶尔减缓游戏时间' },
    { name: '元素核心', effect: 'elemental_synergy', desc: '元素攻击产生额外效果' },
    { name: '生命之种', effect: 'life_regeneration', desc: '持续缓慢恢复生命值' },
    { name: '量子护盾', effect: 'quantum_shield', desc: '有机会完全抵消一次攻击' },
    { name: '命运之骰', effect: 'dice_fate', desc: '随机获得正面效果' },
    { name: '灵魂链接', effect: 'soul_link', desc: '将部分伤害转移到附近的敌人' },
    { name: '无限循环', effect: 'infinite_loop', desc: '有时技能效果会被复制' },
    { name: '虚无之盒', effect: 'void_box', desc: '可以储存一个物品供以后使用' },
];

// 合并遗物
RELICS.push(...ADDITIONAL_RELICS);

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
// 根据Steam计划进行平衡性调整，确保游戏中后期有更好的稀有装备掉落率
const RARITY_WEIGHTS = {
    common: 38,      // 稍微降低常见武器比例
    uncommon: 27,    // 稍微降低不常见武器比例
    rare: 20,        // 提高稀有武器比例，增加中期游戏乐趣
    epic: 10,        // 提高史诗武器比例，让玩家更有目标感
    legendary: 4,    // 稍微提高传说武器比例，保持珍贵感的同时不过于稀少
    mythic: 0.5      // 神话武器保持极低概率
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

    // 扩展药水系统 - 增加更多药水类型
    { name: '狂暴药水', effect: 'berserk_damage', duration: 4, value: 1.5, color: '#DC143C' }, // 伤害增加50%
    { name: '隐身药水', effect: 'invisibility', duration: 3, color: '#9370DB' }, // 短暂隐身（视觉效果）
    { name: '爆炸药水', effect: 'aoe_blast', value: 25, color: '#FF4500' }, // 范围伤害
    { name: '复制药水', effect: 'duplicate_weapon', value: 1, color: '#00FA9A' }, // 复制当前武器
    { name: '洞察药水', effect: 'reveal_enemies', duration: 10, color: '#1E90FF' }, // 显示敌人位置
    { name: '治疗光环', effect: 'heal_aura', duration: 6, value: 2, color: '#7CFC00' }, // 持续治疗
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
    // 玩家状态
    player: {
        hp: 120,  // 调整玩家初始生命值到适中水平，增加游戏挑战性
        maxHp: 120,  // 同步最大生命值
        weapon: null,
        weapons: [], // 双持时用
        lastWeapon: null, // 记忆水晶用
        attackRange: 70, // 调整攻击范围到合理范围，提高游戏操作手感
        attackCooldown: 0, // 攻击冷却
        lastHitTime: 0, // 上次命中时间
        combo: 0, // 连击数
        maxCombo: 0, // 最大连击数
        score: 0, // 得分
        // 连击奖励属性
        comboDamageMultiplier: 1.0, // 连击伤害倍率
        comboAttackSpeed: 1.0, // 连击攻击速度倍率
        comboDefense: 1.0 // 连击防御倍率（受伤减少）
    },
    // 游戏进度
    level: 1,
    kills: 0,
    // 道具
    potions: [],
    relics: [],
    buffs: [],
    // 游戏实体
    enemies: [],
    drops: [],
    projectiles: [],
    particles: [],
    // 游戏状态
    isPlaying: false,
    isGameOver: false,
    screenShake: 0, // 屏幕震动
    lastHealTime: 0, // 上次自然恢复时间
    // 存档扩展数据
    highestLevel: 1,        // 历史最高关卡
    totalKills: 0,          // 历史总击杀数
    totalGames: 0,          // 总游戏次数
    winCount: 0,            // 获胜次数
    highScores: [],         // 高分榜
    weaponStats: {},        // 武器使用统计
    totalPlayTime: 0,       // 总游戏时间
    gamesPlayed: 0,         // 已玩游戏数
    totalDamageDealt: 0,    // 总造成伤害
    totalDamageTaken: 0,    // 总受到伤害
    skillsUsed: { Q: 0, W: 0, E: 0, R: 0 }, // 技能使用统计
    // 当前游戏开始时间
    currentGameStartTime: 0,
};

// ==================== 存档系统 ====================

// 保留旧的接口以兼容现有代码
const SaveSystem = {
    saveKey: 'weaponRogueSave',

    // 保存游戏状态 - 使用新的SaveManager
    save: function() {
        if (typeof saveManager !== 'undefined') {
            return saveManager.save();
        } else {
            // 如果新的存档系统不可用，使用简化版本
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
        }
    },

    // 加载游戏状态 - 使用新的SaveManager
    load: function() {
        if (typeof saveManager !== 'undefined') {
            return saveManager.load();
        } else {
            // 如果新的存档系统不可用，使用简化版本
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
        }
    },

    // 删除存档 - 使用新的SaveManager
    clear: function() {
        if (typeof saveManager !== 'undefined') {
            return saveManager.clear();
        } else {
            // 如果新的存档系统不可用，使用简化版本
            try {
                localStorage.removeItem(this.saveKey);
                console.log('存档已删除');
                showCombatLog('🗑️ 存档已清除', 'weapon-get');
            } catch (error) {
                console.error('清除失败:', error);
            }
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

        // 新增成就 (第三波)
        { id: 'first_win', name: '初试啼声', description: '完成第一次游戏', condition: 'firstWin' },
        { id: 'weapon_diversity', name: '武器多样化', description: '同时拥有5种不同稀有度的武器', condition: 'weaponDiversity' },
        { id: 'lucky_charm_pro', name: '幸运星', description: '使用幸运药水连续击杀10个敌人', condition: 'luckyKillStreak' },
        { id: 'tank_like', name: '坦克般存在', description: '到达第15关且生命值不低于80', condition: 'tankLike' },
        { id: 'speed_runner', name: '疾风骤雨', description: '在30分钟内到达第25关', condition: 'speedRun' },
        { id: 'pacifist_win', name: '和平主义者', description: '完成游戏但只击杀最少必需的敌人', condition: 'pacifistWin' },
        { id: 'elemental_adept', name: '元素专家', description: '连续使用3种不同元素的药水', condition: 'elementalAdept' },
        { id: 'master_of_arts', name: '武学宗师', description: '掌握所有4种技能', condition: 'masterOfArts' },
        { id: 'boss_destroyer', name: 'Boss破坏者', description: '连续击败3个Boss', condition: 'bossDestroyer' },
        { id: 'legendary_weapon_master', name: '传说武器大师', description: '使用传说武器击败10个敌人', condition: 'legendaryWeaponMaster' },

        // 新增成就 (第四波)
        { id: 'mythic_mastery', name: '神话掌握', description: '使用神话武器击败任意敌人', condition: 'mythicWeaponKill' },
        { id: 'combo_destroyer', name: '连击破坏者', description: '达成100连击', condition: 'maxCombo >= 100' },
        { id: 'ultimate_survivor', name: '终极幸存者', description: '到达第45关', condition: 'level >= 45' },
        { id: 'weapon_explorer', name: '武器探险家', description: '使用过75种不同的武器', condition: 'uniqueWeapons >= 75' },
        { id: 'elixir_master', name: '药水大师', description: '使用过每种药水各10次', condition: 'usedAllPotionsTenTimes' },
        { id: 'relic_pioneer', name: '遗物先锋', description: '收集到所有遗物各3件', condition: 'relicPioneer' },
        { id: 'perfect_run', name: '完美运行', description: '到达第30关且生命值保持在90以上', condition: 'level >= 30 && hp > 90' },
        { id: 'elemental_supremacy', name: '元素霸业', description: '同时使用3种不同类型的药水效果', condition: 'elementalSupremacy' },
        { id: 'boss_rush', name: 'Boss冲刺', description: '在1小时内击败10个Boss', condition: 'bossRush' },
        { id: 'immortal_legend', name: '不朽传说', description: '到达第50关且从未死亡', condition: 'level >= 50 && immortal' },
    ],

    // 临时状态变量，用于跟踪复杂的成就条件
    tempStats: {
        uniqueWeaponsUsed: [], // 追踪使用的不同武器 - 使用数组而非Set
        luckyKillCount: 0, // 幸运转杀计数
        lowHpReviveCount: 0, // 濒死复活计数
        relicsCollected: 0, // 收集的遗物数量
        skillsUsed: 0, // 使用技能的总数
        usedPotionTypes: [], // 使用过的药水类型 - 使用数组而非Set
        berserkStreak: 0, // 狂暴连击数
        lastBerserkTime: 0, // 上次使用狂暴的时间
        consecutiveLuckyKills: 0, // 连续幸运击杀
        lastLuckyKillTime: 0, // 上次幸运击杀时间
        bossKillStreak: 0, // Boss击杀连击
        lastBossKillTime: 0, // 上次击杀Boss的时间
        legendaryWeaponKills: 0, // 传说武器击杀数
        lastWeaponChangeTime: 0, // 上次更换武器的时间
        skillsUsedByType: { Q: 0, W: 0, E: 0, R: 0 }, // 各类型技能使用次数
        lastPotionTypes: [], // 最近使用的药水类型（用于追踪连续使用）
        speedRunStartTime: 0, // 速通开始时间
        firstWinCompleted: false, // 是否完成首次胜利
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
                return this.tempStats.uniqueWeaponsUsed.length >= 10;
            }
            if (condition === 'uniqueWeapons >= 20') {
                return this.tempStats.uniqueWeaponsUsed.length >= 20;
            }
            if (condition === 'uniqueWeapons >= 50') {
                return this.tempStats.uniqueWeaponsUsed.length >= 50;
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

            // 第三波新增成就条件
            if (condition === 'firstWin') {
                return context.level >= 50; // 假设通关即为首次胜利
            }
            if (condition === 'luckyKillStreak') {
                return this.tempStats.luckyKillCount >= 10;
            }
            if (condition === 'tankLike') {
                return context.level >= 15 && context.hp >= 80;
            }
            if (condition === 'weaponDiversity') {
                // 检查是否同时拥有5种不同稀有度的武器（common, uncommon, rare, epic, legendary/mythic）
                // 这个条件会在武器获取时动态检查
                const rarities = new Set();
                // 遍历所有获得过的武器类型
                this.tempStats.uniqueWeaponsUsed.forEach(weaponName => {
                    const weapon = WEAPONS.find(w => w.name === weaponName);
                    if (weapon) {
                        rarities.add(weapon.rarity);
                    }
                });
                return rarities.size >= 5;
            }

            // 新增第四波成就条件
            if (condition === 'mythicWeaponKill') {
                return this.tempStats.legendaryWeaponKills > 0; // 复用现有的传奇武器击杀计数
            }
            if (condition === 'maxCombo >= 100') {
                return context.maxCombo >= 100;
            }
            if (condition === 'level >= 45') {
                return context.level >= 45;
            }
            if (condition === 'uniqueWeapons >= 75') {
                return this.tempStats.uniqueWeaponsUsed.length >= 75;
            }
            if (condition === 'usedAllPotionsTenTimes') {
                // 检查是否使用过每种药水各10次，这里简化为检查药水使用种类数量
                return this.tempStats.usedPotionTypes.length >= POTIONS.length && this.tempStats.usedPotionTypes.every(type => true); // 简化实现
            }
            if (condition === 'relicPioneer') {
                return context.relics && context.relics.length >= 3 * RELICS.length; // 简化实现
            }
            if (condition === 'level >= 30 && hp > 90') {
                return context.level >= 30 && context.hp > 90;
            }
            if (condition === 'elementalSupremacy') {
                return this.tempStats.usedPotionTypes.size >= 3; // 简化实现为使用了3种不同药水
            }
            if (condition === 'bossRush') {
                return this.tempStats.bossKillStreak >= 10; // 简化为连续击败10个Boss
            }
            if (condition === 'level >= 50 && immortal') {
                // 简化为达到50级且生命值较高（未死亡多次）
                return context.level >= 50 && context.hp > 50; // 简化实现
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
            // 记录使用的不同武器（避免重复）
            if (!this.tempStats.uniqueWeaponsUsed.includes(weapon.name)) {
                this.tempStats.uniqueWeaponsUsed.push(weapon.name);
            }
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
        // 记录使用的不同药水类型（避免重复）
        if (!this.tempStats.usedPotionTypes.includes(potion.name)) {
            this.tempStats.usedPotionTypes.push(potion.name);
        }
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

    // 当玩家使用幸运药水连续击杀敌人时调用
    onLuckyKillStreak: function() {
        const currentTime = Date.now();
        // 如果上次幸运击杀在3秒内，则增加连续计数
        if (currentTime - this.tempStats.lastLuckyKillTime < 3000) {
            this.tempStats.consecutiveLuckyKills++;
        } else {
            this.tempStats.consecutiveLuckyKills = 1;
        }
        this.tempStats.lastLuckyKillTime = currentTime;

        this.checkAchievements();
    },

    // 当玩家击败Boss时调用
    onBossDefeat: function() {
        const currentTime = Date.now();
        // 如果上次击败Boss在5分钟内，则增加连续计数
        if (currentTime - this.tempStats.lastBossKillTime < 300000) { // 5分钟
            this.tempStats.bossKillStreak++;
        } else {
            this.tempStats.bossKillStreak = 1;
        }
        this.tempStats.lastBossKillTime = currentTime;

        this.checkAchievements();
    },

    // 当玩家使用传说武器击杀敌人时调用
    onLegendaryWeaponKill: function() {
        this.tempStats.legendaryWeaponKills++;
        this.checkAchievements();
    },

    // 当玩家使用不同类型技能时调用
    onSpecificSkillUsed: function(skillKey) {
        if (this.tempStats.skillsUsedByType[skillKey] !== undefined) {
            this.tempStats.skillsUsedByType[skillKey]++;
            this.tempStats.skillsUsed++; // 同时增加总技能使用数
        }
        this.checkAchievements();
    },

    // 当玩家使用不同类型药水时调用
    onSpecificPotionUsed: function(potionType) {
        // 添加到最近使用的药水类型列表
        this.tempStats.lastPotionTypes.push(potionType);
        if (this.tempStats.lastPotionTypes.length > 3) {
            this.tempStats.lastPotionTypes.shift(); // 只保留最近3个

            // 检查是否连续使用了三种不同类型的药水
            if (new Set(this.tempStats.lastPotionTypes).size === 3) {
                this.tempStats.elementalAdept = true;
            }
        }

        this.checkAchievements();
    },

    // 当游戏开始时调用（用于追踪速通成就）
    onGameStart: function() {
        this.tempStats.speedRunStartTime = Date.now();
        this.checkAchievements();
    },

    // 当游戏通关时调用
    onGameWin: function() {
        this.tempStats.firstWinCompleted = true;
        // 检查速通成就
        const timeElapsed = (Date.now() - this.tempStats.speedRunStartTime) / 60000; // 转换为分钟
        if (timeElapsed <= 30) {
            this.tempStats.speedRunComplete = true;
        }
        this.checkAchievements();
    },

    // 重置临时统计数据（通常在游戏重启时）
    resetTempStats: function() {
        this.tempStats = {
            uniqueWeaponsUsed: [],  // 使用数组而非Set，以便于序列化
            luckyKillCount: 0,
            lowHpReviveCount: 0,
            relicsCollected: 0,
            skillsUsed: 0,
            usedPotionTypes: [],  // 使用数组而非Set，以便于序列化
            berserkStreak: 0,
            lastBerserkTime: 0,
            luckyBossKill: false,
            oneHitBossKill: false,
            triplePhoenix: 0,
            neverTookFullDamage: false,
            berserkLegend: 0,

            // 新增追踪项
            consecutiveLuckyKills: 0,
            lastLuckyKillTime: 0,
            bossKillStreak: 0,
            lastBossKillTime: 0,
            legendaryWeaponKills: 0,
            lastWeaponChangeTime: 0,
            skillsUsedByType: { Q: 0, W: 0, E: 0, R: 0 },
            lastPotionTypes: [],
            speedRunStartTime: 0,
            firstWinCompleted: false,
            speedRunComplete: false,
            elementalAdept: false,
        };
    }
};

// ==================== 里程碑系统 ====================

const MilestoneSystem = {
    milestones: {}, // 动态存储里程碑解锁状态

    // 定义里程碑列表
    milestoneList: [
        // 新手里程碑
        { id: 'milestone_newbie', name: '新手入门', description: '到达第3关', condition: 'level >= 3', reward: { hpBonus: 10 } },
        { id: 'milestone_explorer', name: '初级探索者', description: '到达第7关', condition: 'level >= 7', reward: { weaponProtection: 1 } },

        // 中级里程碑
        { id: 'milestone_warrior', name: '初级战士', description: '到达第12关', condition: 'level >= 12', reward: { damageBonus: 5 } },
        { id: 'milestone_collector', name: '收藏爱好者', description: '获得10种不同武器', condition: 'uniqueWeapons >= 10', reward: { hpBonus: 15 } },
        { id: 'milestone_combo', name: '连击入门', description: '达成5连击', condition: 'maxCombo >= 5', reward: { attackSpeedBonus: 0.1 } },

        // 高级里程碑
        { id: 'milestone_veteran', name: '资深玩家', description: '到达第20关', condition: 'level >= 20', reward: { hpBonus: 25, damageBonus: 8 } },
        { id: 'milestone_master', name: '大师级', description: '到达第30关', condition: 'level >= 30', reward: { damageBonus: 15, attackSpeedBonus: 0.2 } },
        { id: 'milestone_legendary', name: '传说之路', description: '使用传说武器击杀50个敌人', condition: 'legendaryKills >= 50', reward: { critChance: 0.1 } },

        // 专家里程碑
        { id: 'milestone_elite', name: '精英玩家', description: '到达第40关', condition: 'level >= 40', reward: { hpBonus: 40, damageBonus: 20 } },
        { id: 'milestone_perfectionist', name: '完美主义者', description: '到达第45关且生命值高于60', condition: 'level >= 45 && hp > 60', reward: { allBonuses: 1 } },
        { id: 'milestone_legend', name: '传奇人物', description: '到达第50关', condition: 'level >= 50', reward: { ultimateBonus: 1 } },

        // 挑战里程碑
        { id: 'milestone_speedrunner', name: '速通专家', description: '在20分钟内到达第15关', condition: 'speedRun15', reward: { speedBonus: 0.3 } },
        { id: 'milestone_combo_master', name: '连击大师', description: '达成30连击', condition: 'maxCombo >= 30', reward: { comboEffect: 1 } },
        { id: 'milestone_luck_master', name: '幸运大师', description: '使用幸运药水击杀30个敌人', condition: 'luckyKills >= 30', reward: { luckBonus: 0.2 } }
    ],

    // 临时状态变量，用于跟踪复杂的里程碑条件
    tempStats: {
        speedRunStartLevel: 0,
        speedRunStartTime: 0,
        legendaryKills: 0,
        luckyKills: 0,
        uniqueWeaponsUsed: [],
        lastLevelReached: 0
    },

    // 检查里程碑条件并解锁里程碑
    checkMilestones: function() {
        const newMilestones = [];

        for (const milestone of this.milestoneList) {
            if (!this.milestones[milestone.id]) {
                // 检查里程碑条件是否满足
                if (this.evaluateCondition(milestone.condition)) {
                    this.unlock(milestone);
                    newMilestones.push(milestone);

                    // 应用里程碑奖励
                    this.applyReward(milestone.reward);
                }
            }
        }

        return newMilestones;
    },

    // 评估里程碑条件
    evaluateCondition: function(condition) {
        try {
            const context = {
                level: gameState.level,
                hp: gameState.player.hp,
                maxCombo: gameState.player.maxCombo,
                uniqueWeapons: this.tempStats.uniqueWeaponsUsed.length,
                legendaryKills: this.tempStats.legendaryKills,
                luckyKills: this.tempStats.luckyKills
            };

            // 简单条件评估
            if (condition === 'level >= 3') return context.level >= 3;
            if (condition === 'level >= 7') return context.level >= 7;
            if (condition === 'level >= 12') return context.level >= 12;
            if (condition === 'uniqueWeapons >= 10') return context.uniqueWeapons >= 10;
            if (condition === 'maxCombo >= 5') return context.maxCombo >= 5;
            if (condition === 'level >= 20') return context.level >= 20;
            if (condition === 'level >= 30') return context.level >= 30;
            if (condition === 'legendaryKills >= 50') return context.legendaryKills >= 50;
            if (condition === 'level >= 40') return context.level >= 40;
            if (condition === 'level >= 45 && hp > 60') return context.level >= 45 && context.hp > 60;
            if (condition === 'level >= 50') return context.level >= 50;
            if (condition === 'maxCombo >= 30') return context.maxCombo >= 30;
            if (condition === 'luckyKills >= 30') return context.luckyKills >= 30;

            return false;
        } catch (e) {
            console.error('评估里程碑条件时出错:', e);
            return false;
        }
    },

    // 解锁里程碑
    unlock: function(milestone) {
        this.milestones[milestone.id] = {
            unlocked: true,
            timestamp: Date.now(),
            name: milestone.name,
            description: milestone.description,
            reward: milestone.reward
        };

        console.log(`里程碑解锁: ${milestone.name}`);
        showCombatLog(`🎯 里程碑: ${milestone.name}`, 'weapon-get');

        // 保存里程碑状态
        SaveSystem.save();
    },

    // 获取已解锁里程碑的数量
    getUnlockedCount: function() {
        return Object.keys(this.milestones).filter(id => this.milestones[id].unlocked).length;
    },

    // 获取总里程碑数量
    getTotalCount: function() {
        return this.milestoneList.length;
    },

    // 应用里程碑奖励
    applyReward: function(reward) {
        if (!reward) return;

        // 根据奖励类型应用不同的加成
        if (reward.hpBonus) {
            gameState.player.maxHp += reward.hpBonus;
            gameState.player.hp += reward.hpBonus; // 立即恢复额外生命值
        }
        if (reward.damageBonus) {
            // 对于伤害加成，我们将其作为全局乘数处理
            if (!gameState.player.damageBonus) {
                gameState.player.damageBonus = 0;
            }
            gameState.player.damageBonus += reward.damageBonus;
        }
        if (reward.attackSpeedBonus) {
            if (!gameState.player.attackSpeedBonus) {
                gameState.player.attackSpeedBonus = 1.0;
            }
            gameState.player.attackSpeedBonus += reward.attackSpeedBonus;
        }
        if (reward.speedBonus) {
            if (!gameState.player.speedBonus) {
                gameState.player.speedBonus = 0;
            }
            gameState.player.speedBonus += reward.speedBonus;
        }
    },

    // 当玩家达到新等级时调用
    onLevelUp: function(level) {
        // 更新最高等级记录
        if (level > this.tempStats.lastLevelReached) {
            this.tempStats.lastLevelReached = level;

            // 如果是第15关开始记录速通数据
            if (level === 15 && this.tempStats.speedRunStartLevel === 0) {
                this.tempStats.speedRunStartTime = Date.now();
                this.tempStats.speedRunStartLevel = 15;
            }

            // 检查里程碑
            this.checkMilestones();
        }
    },

    // 当玩家使用传说武器击杀敌人时调用
    onLegendaryKill: function() {
        this.tempStats.legendaryKills++;
        this.checkMilestones();
    },

    // 当玩家使用幸运药水击杀敌人时调用
    onLuckyKill: function() {
        this.tempStats.luckyKills++;
        this.checkMilestones();
    },

    // 当玩家获得新武器时调用
    onWeaponAcquired: function(weapon) {
        if (weapon && !this.tempStats.uniqueWeaponsUsed.includes(weapon.name)) {
            this.tempStats.uniqueWeaponsUsed.push(weapon.name);
            this.checkMilestones();
        }
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

                    // 创建增强的攻击效果
                    enhancedAttackEffect(enemy.x, enemy.y, weaponDamage * 2, gameState.player.weapon);

                    if (enemy.hp <= 0) {
                        // 创建增强的死亡效果
                        enhancedDeathEffect(enemy.x, enemy.y, enemy.type);

                        // 播放敌人死亡音效
                        AudioManager.playSound('enemy_death');

                        // Boss敌人额外音效
                        if (enemy.type === 'BOSS') {
                            AudioManager.playSound('victory');
                        }

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

                        // 根据当前关卡决定升级所需的击杀数，使其与UI显示一致
                        // 优化升级公式：前期增长较慢，让玩家有适应期；后期增长加快，保持挑战性
                        const killsNeededForLevel = Math.min(30, 5 + Math.floor(gameState.level * 1.2) + Math.floor(gameState.level / 4) * 3);

                        if (gameState.kills % killsNeededForLevel === 0) {
                            gameState.level++;

                            // 通知里程碑系统玩家升级
                            if (typeof MilestoneSystem !== 'undefined') {
                                MilestoneSystem.onLevelUp(gameState.level);
                            }

                            showCombatLog(t('levelUp').replace('%d', gameState.level), 'weapon-get');

                            // 增强的升级视觉效果
                            createRainbowEffect(player.x, player.y, 30); // 彩虹庆祝效果
                            createLaserEffect(player.x, player.y, '#FFD700'); // 金色激光
                            for (let i = 0; i < 5; i++) {
                                setTimeout(() => {
                                    createTwinkleEffect(player.x, player.y, '#FFD700', 10);
                                }, i * 200);
                            }

                            AudioManager.playSound('level_up');

                            // 升级时增加玩家生命值
                            // 每升一级增加一定生命值，但增长递减
                            const baseHpIncrease = 8; // 基础生命值增加量
                            const levelMultiplier = Math.max(0.3, 1.0 - (gameState.level * 0.005)); // 随等级增长递减
                            const hpIncrease = Math.floor(baseHpIncrease * levelMultiplier);

                            gameState.player.maxHp += hpIncrease;
                            gameState.player.hp += hpIncrease; // 同时恢复相应生命值

                            // 限制最大生命值，避免过度膨胀
                            const maxHpLimit = 500; // 设定最大生命值上限
                            gameState.player.maxHp = Math.min(gameState.player.maxHp, maxHpLimit);
                            gameState.player.hp = Math.min(gameState.player.hp, gameState.player.maxHp);

                            // 检查并处理特殊关卡里程碑事件
                            handleMilestoneEvents();
                        }

                        gameState.enemies.splice(i, 1);
                    }
                    hitEnemies++;
                }
            }

            if (hitEnemies > 0) {
                showCombatLog(t('skillAOE').replace('%s', skill.name).replace('%d', hitEnemies), 'weapon-get');
                success = true;
            } else {
                showCombatLog(t('skillNoHit').replace('%s', skill.name), 'weapon-lose');
            }
            break;

        case 'heal':
            // 治疗光环
            const healAmount = Math.floor(gameState.player.maxHp * 0.3);
            gameState.player.hp = Math.min(gameState.player.maxHp, gameState.player.hp + healAmount);

            // 增强的治疗特效
            createParticles(gameState.player.x, gameState.player.y, '#00FF00', 20);
            createPulseEffect(gameState.player.x, gameState.player.y, '#00FF00');
            createTwinkleEffect(gameState.player.x, gameState.player.y, '#00FF00', 15);
            createRippleEffect(gameState.player.x, gameState.player.y, '#00FF77');

            showCombatLog(t('skillHeal').replace('%s', skill.name).replace('%d', healAmount), 'weapon-get');
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

            // 播放传送音效
            AudioManager.playSound('teleport');

            // 增强的传送特效
            createParticles(gameState.player.x, gameState.player.y, '#8A2BE2', 15);
            createLaserEffect(gameState.player.x, gameState.player.y, '#8A2BE2');
            createTwinkleEffect(gameState.player.x, gameState.player.y, '#9370DB', 10);

            // 原位置留下的残影特效
            createRippleEffect(gameState.player.x - Math.cos(angle) * teleportDistance,
                              gameState.player.y - Math.sin(angle) * teleportDistance,
                              '#8A2BE2');

            showCombatLog(t('skillTeleport').replace('%s', skill.name), 'weapon-get');
            success = true;
            break;

        case 'berserk':
            // 狂暴状态 - 伤害翻倍
            gameState.buffs.push({
                effect: 'berserk_damage',
                duration: 5, // 5秒
                value: 2 // 伤害倍数
            });

            // 播放狂暴音效
            AudioManager.playSound('magic_spell');

            createParticles(gameState.player.x, gameState.player.y, '#FF0000', 25);

            // 添加额外的狂暴特效
            createRippleEffect(gameState.player.x, gameState.player.y, '#FF0000');
            createLaserEffect(gameState.player.x, gameState.player.y, '#FF4500');
            createRainbowEffect(gameState.player.x, gameState.player.y, 15);

            showCombatLog(t('skillBerserk').replace('%s', skill.name), 'weapon-get');
            success = true;
            break;
    }

    if (success) {
        // 播放技能使用音效
        AudioManager.playSound('skill_use');

        // 增加技能使用计数
        gameState.skillsUsed = (gameState.skillsUsed || 0) + 1;

        // 通知成就系统使用了技能
        AchievementSystem.onSkillUsed();
        AchievementSystem.onSpecificSkillUsed(skillKey);

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
    // 根据当前关卡动态调整稀有度权重
    const level = gameState.level || 1;

    // 使用sigmoid函数来平滑调整权重
    const levelFactor = 1 / (1 + Math.exp(-0.1 * (level - 10))); // 在第10关左右开始显著变化

    // 计算动态权重
    const commonWeight = Math.max(30, 60 - (levelFactor * 30));  // 从60降到30
    const uncommonWeight = 25;  // 保持不变
    const rareWeight = 15 + (levelFactor * 10);  // 从15升到25
    const epicWeight = 5 + (levelFactor * 10);   // 从5升到15
    const legendaryWeight = 1 + (levelFactor * 5); // 从1升到6
    const mythicWeight = 0.5 + (levelFactor * 2);  // 从0.5升到2.5

    const dynamicWeights = {
        common: commonWeight,
        uncommon: uncommonWeight,
        rare: rareWeight,
        epic: epicWeight,
        legendary: legendaryWeight,
        mythic: mythicWeight
    };

    const totalWeight = Object.values(dynamicWeights).reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;

    for (const [rarity, weight] of Object.entries(dynamicWeights)) {
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

// ==================== 特殊游戏机制 ====================

// 概念融合机制 - 当玩家连续使用同一种稀有度的武器时，会触发概念融合
let consecutiveWeapons = { common: 0, uncommon: 0, rare: 0, epic: 0, legendary: 0, mythic: 0 };

// 检查概念融合
function checkConceptFusion(weapon) {
    if (!weapon || !weapon.rarity) return;

    // 增加当前稀有度的连续计数
    consecutiveWeapons[weapon.rarity]++;

    // 重置其他稀有度的计数
    for (const rarity in consecutiveWeapons) {
        if (rarity !== weapon.rarity) {
            consecutiveWeapons[rarity] = 0;
        }
    }

    // 检查是否达到融合阈值
    const fusionThreshold = 5; // 连续使用5次相同稀有度触发融合
    if (consecutiveWeapons[weapon.rarity] >= fusionThreshold) {
        showCombatLog(`✨ 概念融合！连续使用${rarityNames[weapon.rarity]}武器已达到${consecutiveWeapons[weapon.rarity]}次`, 'weapon-get');

        // 触发融合效果 - 例如增加得分、生命值或其他增益
        if (gameState.player.hp < gameState.player.maxHp) {
            // 稍微恢复生命值
            const healAmount = Math.floor(gameState.player.maxHp * 0.1);
            gameState.player.hp = Math.min(gameState.player.maxHp, gameState.player.hp + healAmount);
            showCombatLog(`❤️ 概念融合恢复了${healAmount}生命值`, 'weapon-get');
        }

        // 增加得分奖励
        gameState.player.score += 100 * consecutiveWeapons[weapon.rarity];

        // 重置计数
        consecutiveWeapons[weapon.rarity] = 0;
    }
}

// 稀有度名称映射
const rarityNames = {
    'common': '普通',
    'uncommon': '不常见',
    'rare': '稀有',
    'epic': '史诗',
    'legendary': '传说',
    'mythic': '神话'
};

// ==================== 音效管理器 ====================
const AudioManager = {
    audioContext: null,
    sounds: {},
    musicEnabled: true,
    soundEnabled: true,

    // 音效映射 - 将音效名映射到音频文件路径
    soundMap: {
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
        'bow_shoot': 'assets/sounds/bow_shoot.mp3'
    },

    // 初始化音频上下文
    init() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log('音效系统已初始化');

            // 预加载音频文件和基本音效
            this.preloadSounds();
            this.createBasicSounds();
        } catch (e) {
            console.warn('无法初始化Web Audio API，将使用简单音效:', e);
        }
    },

    // 预加载音频文件
    async preloadSounds() {
        // 尝试加载音频文件，如果失败则使用程序生成的音效作为回退
        for (const [soundName, soundPath] of Object.entries(this.soundMap)) {
            await this.loadSound(soundName, soundPath);
        }
    },

    // 加载音频文件
    loadSound(name, path) {
        return new Promise((resolve) => {
            // 尝试加载外部音频文件，如果失败则使用程序生成的音效作为回退
            const audio = new Audio();
            audio.src = path;

            audio.addEventListener('loadeddata', () => {
                // 音频加载成功，将其包装为可播放函数
                this.sounds[name] = () => {
                    if (!this.soundEnabled) return;

                    // 创建新的audio元素播放声音，避免重复播放冲突
                    const newAudio = new Audio(path);
                    newAudio.volume = 0.7;
                    newAudio.play().catch(e => console.warn(`音频播放失败: ${name}`, e));
                };

                console.log(`音频文件已加载: ${path}`);
                resolve();
            });

            audio.addEventListener('error', () => {
                // 加载失败，使用程序生成的音效作为回退
                console.warn(`音频文件加载失败，使用回退音效: ${path}`);

                // 为常见音效提供回退程序音效
                switch(name) {
                    case 'collect':
                        this.sounds[name] = this.createTone(523.25, 0.1);
                        break;
                    case 'hurt':
                        this.sounds[name] = this.createTone(220.00, 0.2);
                        break;
                    case 'gameOver':
                        this.sounds[name] = this.createTone(110.00, 0.8);
                        break;
                    case 'victory':
                        this.sounds[name] = this.createChord([261.63, 329.63, 392.00], 1.0);
                        break;
                    case 'weapon_pickup':
                        this.sounds[name] = this.createTone(659.25, 0.15);
                        break;
                    case 'attack':
                        this.sounds[name] = this.createWhiteNoise(0.05);
                        break;
                    case 'level_up':
                        this.sounds[name] = this.createChord([261.63, 329.63, 392.00, 523.25], 0.5);
                        break;
                    case 'hit':
                        this.sounds[name] = this.createWhiteNoise(0.02);
                        break;
                    case 'enemy_death':
                        this.sounds[name] = this.createTone(329.63, 0.15);
                        break;
                    case 'heal':
                        this.sounds[name] = this.createChord([392.00, 523.25, 659.25], 0.3);
                        break;
                    case 'menu_select':
                        this.sounds[name] = this.createTone(783.99, 0.1); // G5
                        break;
                    case 'skill_use':
                        this.sounds[name] = this.createChord([329.63, 523.25], 0.2);
                        break;
                    case 'potion_pickup':
                        this.sounds[name] = this.createTone(659.25, 0.1);
                        break;
                    case 'boss_appear':
                        this.sounds[name] = this.createChord([110.00, 146.83, 220.00], 1.2);
                        break;
                    case 'critical_hit':
                        this.sounds[name] = this.createWhiteNoise(0.1);
                        break;
                    case 'combo_break':
                        this.sounds[name] = this.createTone(146.83, 0.3);
                        break;
                    case 'relic_pickup':
                        this.sounds[name] = this.createChord([523.25, 659.25], 0.4);
                        break;
                    case 'teleport':
                        this.sounds[name] = this.createTone(987.77, 0.2); // B5
                        break;
                    case 'shield_block':
                        this.sounds[name] = this.createWhiteNoise(0.08);
                        break;
                    case 'magic_spell':
                        this.sounds[name] = this.createChord([261.63, 349.23, 523.25], 0.3);
                        break;
                    case 'bow_shoot':
                        this.sounds[name] = this.createTone(783.99, 0.05);
                        break;
                    default:
                        // 默认使用简单的音效
                        this.sounds[name] = this.createTone(440.00, 0.1);
                }

                resolve();
            });
        });
    },

    // 创建基本音效
    createBasicSounds() {
        // 如果某些音效尚未定义，创建默认的程序生成音效
        const fallbackSounds = {
            'collect': this.createTone(523.25, 0.1), // C5 音符，用于收集物品
            'hurt': this.createTone(220.00, 0.2), // A3 音符，用于受伤
            'gameOver': this.createTone(110.00, 0.8), // A2 音符，用于游戏结束
            'victory': this.createChord([261.63, 329.63, 392.00], 1.0), // C-E-G 和弦，用于胜利
            'weapon_pickup': this.createTone(659.25, 0.15), // E5 音符，用于获得武器
            'attack': this.createWhiteNoise(0.05), // 白噪声，用于攻击
            'level_up': this.createChord([261.63, 329.63, 392.00, 523.25], 0.5), // C-E-G-C 和弦，用于升级
            'hit': this.createWhiteNoise(0.02), // 短促白噪声，用于击中
            'enemy_death': this.createTone(329.63, 0.15), // E4 音符，用于敌人死亡
            'heal': this.createChord([392.00, 523.25, 659.25], 0.3), // G-E-C 和弦，用于治疗
            'menu_select': this.createTone(783.99, 0.1), // G5 音符，用于菜单选择
            'skill_use': this.createChord([329.63, 523.25], 0.2), // E-G 和弦，用于技能释放
            'potion_pickup': this.createTone(659.25, 0.1), // E5 音符，用于获得药水
            'boss_appear': this.createChord([110.00, 146.83, 220.00], 1.2), // A-D-A 和弦，用于Boss出现
            'critical_hit': this.createWhiteNoise(0.1), // 关键击音效
            'combo_break': this.createTone(146.83, 0.3), // D3 音符，用于连击中断
            'relic_pickup': this.createChord([523.25, 659.25], 0.4), // C-E 和弦，用于获得遗物
            'teleport': this.createTone(987.77, 0.2), // B5 音符，用于传送
            'shield_block': this.createWhiteNoise(0.08), // 格挡音效
            'magic_spell': this.createChord([261.63, 349.23, 523.25], 0.3), // C-F-C 和弦，用于魔法
            'bow_shoot': this.createTone(783.99, 0.05) // G5 音符，用于弓箭射击
        };

        // 只添加尚未定义的音效（即加载失败时使用的回退音效）
        for (const [name, soundFunc] of Object.entries(fallbackSounds)) {
            if (!this.sounds[name]) {
                this.sounds[name] = soundFunc;
            }
        }
    },

    // 创建简单音调
    createTone(frequency, duration) {
        if (!this.audioContext) return null;

        return () => {
            if (!this.soundEnabled) return;

            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            oscillator.type = 'square'; // 方波音色

            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        };
    },

    // 创建和弦
    createChord(frequencies, duration) {
        if (!this.audioContext) return null;

        return () => {
            if (!this.soundEnabled) return;

            frequencies.forEach(freq => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);

                oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                oscillator.type = 'sine'; // 正弦波音色

                gainNode.gain.setValueAtTime(0.05, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + duration);
            });
        };
    },

    // 创建白噪声
    createWhiteNoise(duration) {
        if (!this.audioContext) return null;

        return () => {
            if (!this.soundEnabled) return;

            const bufferSize = this.audioContext.sampleRate * duration;
            const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
            const output = buffer.getChannelData(0);

            for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
            }

            const noise = this.audioContext.createBufferSource();
            noise.buffer = buffer;

            const filter = this.audioContext.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 1000;

            const gainNode = this.audioContext.createGain();
            gainNode.gain.value = 0.1;

            noise.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            noise.start(this.audioContext.currentTime);
        };
    },

    // 播放音效
    playSound(soundName) {
        if (typeof soundName === 'string' && this.sounds[soundName]) {
            this.sounds[soundName]();
        } else if (typeof soundName === 'function') {
            soundName();
        }

        // 同时保留震动反馈
        if (navigator.vibrate && this.soundEnabled) {
            navigator.vibrate(10);
        }
    },

    // 控制音效开关
    setSoundEnabled(enabled) {
        this.soundEnabled = enabled;
    },

    // 控制音乐开关
    setMusicEnabled(enabled) {
        this.musicEnabled = enabled;
    },

    // 获取音效状态
    isSoundEnabled() {
        return this.soundEnabled;
    },

    isMusicEnabled() {
        return this.musicEnabled;
    },

    // 背景音乐相关
    currentMusic: null,
    musicVolume: 0.5,

    // 播放背景音乐
    playMusic(musicName) {
        if (!this.musicEnabled) return;

        // 停止当前音乐
        this.stopMusic();

        const musicPath = `assets/music/${musicName}.mp3`;
        const music = new Audio(musicPath);
        music.loop = true;
        music.volume = this.musicVolume;

        // 预防错误
        music.addEventListener('error', (e) => {
            console.warn(`音乐文件加载失败: ${musicPath}`, e);
            // 这里可以实现程序生成的背景音乐作为回退
        });

        music.play().catch(e => console.warn('音乐播放失败:', e));
        this.currentMusic = music;
    },

    // 停止背景音乐
    stopMusic() {
        if (this.currentMusic) {
            this.currentMusic.pause();
            this.currentMusic = null;
        }
    },

    // 设置音乐音量
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.currentMusic) {
            this.currentMusic.volume = this.musicVolume;
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

    // 新增敌人类型 (第四波)
    DEMIGOD: { name: '半神', speed: 0.5, hp: 5.0, damage: 4.0, size: 3.0, behavior: 'mixed' }, // 极高血量极高伤害的顶级敌人
    PLANET: { name: '行星守护者', speed: 0.1, hp: 8.0, damage: 2.5, size: 4.0, behavior: 'ranged' }, // 巨大型敌人，极难击败
    COSMOS: { name: '宇宙意志', speed: 0.3, hp: 6.0, damage: 3.5, size: 3.5, behavior: 'mixed' }, // 全能型终极敌人

    // 新增更多敌人类型 (第六波)
    NINJA: { name: '忍者', speed: 2.0, hp: 0.7, damage: 2.2, size: 0.8, behavior: 'melee' }, // 快速潜行攻击者
    DRUID: { name: '德鲁伊', speed: 0.7, hp: 1.8, damage: 2.0, size: 1.4, behavior: 'ranged' }, // 自然系法师，可治疗附近敌人
    WEREWOLF: { name: '狼人', speed: 1.5, hp: 2.2, damage: 2.4, size: 1.8, behavior: 'melee' }, // 夜晚增强型敌人
    PHOENIX: { name: '凤凰', speed: 1.2, hp: 1.5, damage: 2.5, size: 1.6, behavior: 'ranged' }, // 可重生一次的敌人
    KRAKEN: { name: '海怪', speed: 0.5, hp: 4.5, damage: 2.8, size: 3.0, behavior: 'ranged' }, // 大型远程攻击敌人
    GARGOYLE: { name: '石像鬼', speed: 1.0, hp: 3.0, damage: 1.2, size: 1.7, behavior: 'melee' }, // 白天静止，夜晚活动
    HARPY: { name: '鹰身女妖', speed: 1.7, hp: 1.0, damage: 1.8, size: 1.3, behavior: 'ranged' }, // 飞行单位，会干扰玩家移动

    // 新增更多敌人类型 (第七波)
    DRACOLICH: { name: '龙巫妖', speed: 0.8, hp: 5.0, damage: 3.2, size: 2.8, behavior: 'ranged' }, // 不死龙，极其危险
    VOID_TERROR: { name: '虚空恐魔', speed: 1.9, hp: 2.0, damage: 3.5, size: 2.2, behavior: 'melee' }, // 吞噬一切的虚空生物
    DEMIGORGON: { name: '深渊领主', speed: 1.1, hp: 6.0, damage: 3.8, size: 3.2, behavior: 'mixed' }, // 混合攻击的顶级敌人
    LEVIATHAN: { name: '利维坦', speed: 0.4, hp: 7.0, damage: 3.0, size: 3.5, behavior: 'ranged' }, // 巨大水系敌人
    COLOSSUS: { name: '巨人', speed: 0.9, hp: 8.0, damage: 4.0, size: 4.0, behavior: 'melee' }, // 陆地最强敌人
    CHAOS_LORD: { name: '混沌领主', speed: 0.6, hp: 9.0, damage: 4.5, size: 3.8, behavior: 'mixed' }, // 混乱属性敌人，能力不定
    REALITY_WEAVER: { name: '现实编织者', speed: 0.2, hp: 10.0, damage: 5.0, size: 4.5, behavior: 'ranged' }, // 最终BOSS级敌人
    NINJA: { name: '忍者', speed: 2.3, hp: 0.6, damage: 2.8, size: 0.8, behavior: 'melee' }, // 极速高伤害低血量
    CYBORG: { name: '机械战士', speed: 1.1, hp: 2.2, damage: 2.0, size: 1.7, behavior: 'ranged' }, // 机械化敌人，远程攻击
    ELF: { name: '精灵', speed: 1.5, hp: 1.2, damage: 2.2, size: 1.1, behavior: 'ranged' }, // 精灵弓箭手，高精准度
    DRUID: { name: '德鲁伊', speed: 0.7, hp: 1.8, damage: 2.5, size: 1.4, behavior: 'ranged' }, // 自然法师，可召唤
    ZOMBIE: { name: '僵尸', speed: 0.5, hp: 1.6, damage: 1.2, size: 1.2, behavior: 'melee' }, // 缓慢但耐打的亡灵
    ORGE: { name: '食人魔', speed: 0.7, hp: 2.8, damage: 2.2, size: 2.2, behavior: 'melee' }, // 大型近战怪物
    PHOENIX: { name: '凤凰', speed: 1.2, hp: 1.0, damage: 2.4, size: 1.3, behavior: 'ranged' }, // 火系飞行敌人，会重生
    KRAKEN: { name: '海怪', speed: 0.4, hp: 4.5, damage: 1.5, size: 2.8, behavior: 'ranged' }, // 大型水域敌人，触手攻击

    // 新增敌人类型 (第六波)
    DRAGON_KING: { name: '龙王', speed: 0.8, hp: 5.0, damage: 3.0, size: 3.2, behavior: 'ranged' }, // 强大的龙族君主，具有强大魔法
    UNICORN: { name: '独角兽', speed: 1.5, hp: 2.0, damage: 2.5, size: 1.6, behavior: 'melee' }, // 神圣生物，高机动性
    BASILISK: { name: '蛇怪', speed: 0.6, hp: 3.0, damage: 2.8, size: 1.9, behavior: 'ranged' }, // 石化攻击的危险生物
    GRIFFIN: { name: '狮鹫', speed: 1.4, hp: 2.2, damage: 2.2, size: 2.0, behavior: 'mixed' }, // 空中地面皆可攻击
    MINOTAUR: { name: '牛头怪', speed: 1.0, hp: 4.0, damage: 2.0, size: 2.5, behavior: 'melee' }, // 迷宫守护者，高血高攻
    HYDRA: { name: '九头蛇', speed: 0.7, hp: 6.0, damage: 1.8, size: 3.0, behavior: 'ranged' }, // 多头怪物，被砍掉头会长出新头
    PEGASUS: { name: '飞马', speed: 2.0, hp: 1.5, damage: 1.5, size: 1.4, behavior: 'ranged' }, // 高速空中单位
    COCKATRICE: { name: '鸡蛇怪', speed: 1.1, hp: 1.8, damage: 2.6, size: 1.2, behavior: 'ranged' }, // 小型石化生物
    CHIMERA: { name: '奇美拉', speed: 1.2, hp: 3.5, damage: 2.4, size: 2.2, behavior: 'mixed' }, // 多头混合生物，多重攻击
    BANSHEE: { name: '女妖', speed: 1.8, hp: 1.2, damage: 3.0, size: 1.0, behavior: 'ranged' }, // 高速精神攻击者

    // Steam发布新增敌人类型 (10个)
    WEREWOLF: { name: '狼人', speed: 1.7, hp: 2.4, damage: 2.6, size: 1.9, behavior: 'melee' }, // 变身敌人，夜晚更强
    MERMAID: { name: '美人鱼', speed: 0.9, hp: 1.8, damage: 2.2, size: 1.3, behavior: 'ranged' }, // 水系敌人，治疗附近敌人
    GARGOYLE: { name: '石像鬼', speed: 0.3, hp: 3.2, damage: 1.8, size: 1.6, behavior: 'ranged' }, // 白天石化，晚上攻击
    FAIRY: { name: '仙女', speed: 1.6, hp: 0.8, damage: 1.5, size: 0.7, behavior: 'support' }, // 辅助敌人，增强附近敌人
    HARPY: { name: '鹰身女妖', speed: 1.8, hp: 1.2, damage: 2.0, size: 1.2, behavior: 'ranged' }, // 飞行单位，干扰玩家
    CRYPTID: { name: '神秘生物', speed: 1.3, hp: 2.0, damage: 2.8, size: 1.4, behavior: 'mixed' }, // 未知生物，随机行为
    CONSTRUCT: { name: '构造体', speed: 0.5, hp: 4.5, damage: 2.0, size: 2.0, behavior: 'melee' }, // 机械单位，高血量
    ENT: { name: '树人', speed: 0.6, hp: 5.0, damage: 2.5, size: 2.5, behavior: 'melee' }, // 森林守护者，巨大体型
    SHADOW_DOPPELGANGER: { name: '暗影分身', speed: 2.1, hp: 1.0, damage: 3.2, size: 0.9, behavior: 'melee' }, // 快速多变的敌人
    ETHEREAL_BEING: { name: '灵体生物', speed: 1.0, hp: 1.5, damage: 2.5, size: 1.1, behavior: 'ranged' } // 穿透攻击的敌人
};

class Enemy {
    constructor(level, type = null) {
        // 为不同类型敌人添加不同的生成权重，让游戏体验更平衡
        const enemyWeights = {
            'MELEE': Math.min(0.4, 0.4 - (level * 0.005)), // 随等级提高，近战敌人比例稍微下降
            'RANGED': Math.min(0.3, 0.25 + (level * 0.008)), // 随等级提高，远程敌人比例适当上升
            'ELITE': Math.min(0.15, 0.05 + (level * 0.008)), // 精英敌人随等级提高而增加
            'SUPPORT': Math.min(0.1, 0.02 + (level * 0.005)), // 支援型敌人随等级提高而增加
            'ARCHER': Math.min(0.1, 0.02 + (level * 0.005)), // 弓箭手随等级提高而增加
            'MAGE': Math.min(0.08, 0.01 + (level * 0.005)), // 法师随等级提高而增加
            'ASSASSIN': Math.min(0.05, 0.005 + (level * 0.004)), // 刺客随等级提高而增加
            'UNDEAD': Math.min(0.05, 0.005 + (level * 0.004)), // 亡灵随等级提高而增加
            'BEAST': Math.min(0.05, 0.005 + (level * 0.004)), // 野兽随等级提高而增加
            'SKELETON': Math.min(0.05, 0.003 + (level * 0.003)), // 骷髅随等级提高而增加
            'GOBLIN': Math.min(0.05, 0.003 + (level * 0.003)), // 哥布林随等级提高而增加
            'DRAGON': Math.min(0.03, 0.001 + (level * 0.002)), // 龙类随等级提高而增加
            'GOLEM': Math.min(0.03, 0.001 + (level * 0.002)), // 石像鬼随等级提高而增加
            'SPIDER': Math.min(0.03, 0.001 + (level * 0.002)), // 蜘蛛随等级提高而增加
            'BERSERKER': Math.min(0.02, 0.0005 + (level * 0.0015)), // 狂战士随等级提高而增加
            'WIZARD': Math.min(0.02, 0.0005 + (level * 0.0015)), // 巫师随等级提高而增加
            'PHANTOM': Math.min(0.02, 0.0005 + (level * 0.0015)), // 幻影随等级提高而增加
            'TROLL': Math.min(0.01, 0.0002 + (level * 0.001)), // 巨魔随等级提高而增加
            'LICH': Math.min(0.01, 0.0002 + (level * 0.001)), // 巫妖王随等级提高而增加
            'ANGEL': Math.min(0.005, 0.0001 + (level * 0.0008)), // 天使随等级提高而增加
            'PIRATE': Math.min(0.005, 0.0001 + (level * 0.0008)), // 海盗随等级提高而增加
            'NINJA': Math.min(0.005, 0.0001 + (level * 0.0008)), // 忍者随等级提高而增加
            'CYBORG': Math.min(0.005, 0.0001 + (level * 0.0008)), // 机械战士随等级提高而增加
            'ELF': Math.min(0.005, 0.0001 + (level * 0.0008)), // 精灵随等级提高而增加
            'DRUID': Math.min(0.005, 0.0001 + (level * 0.0008)), // 德鲁伊随等级提高而增加
            'SHADOW': Math.min(0.003, 0.00005 + (level * 0.0005)), // 暗影随等级提高而增加
            'BOSS': Math.min(0.002, 0.00003 + (level * 0.0003)), // Boss随等级提高而增加
            'DEMIGOD': Math.min(0.001, 0.00001 + (level * 0.0001)), // 半神随等级提高而增加
            'DEMON': Math.min(0.001, 0.00001 + (level * 0.0001)), // 小恶魔随等级提高而增加
            'PLANET': Math.min(0.0005, 0.000005 + (level * 0.00005)), // 行星级随等级提高而增加
            'COSMOS': Math.min(0.0001, 0.000001 + (level * 0.00001)), // 宇宙级随等级提高而增加
            'ELEMENTAL': Math.min(0.003, 0.00005 + (level * 0.0003)) // 元素生物随等级提高而增加
        };

        // 计算总权重
        let totalWeight = 0;
        for (const weight of Object.values(enemyWeights)) {
            totalWeight += weight;
        }

        // 随着关卡提高，添加新的敌人类型
        // 为新添加的敌人类型添加权重
        if (level > 8) { // 只有在较高的关卡才出现新敌人
            enemyWeights['ANGEL'] = Math.min(0.005, 0.0001 + (level * 0.0002)); // 天使随等级提高而增加
            enemyWeights['PIRATE'] = Math.min(0.005, 0.0001 + (level * 0.0002)); // 海盗随等级提高而增加
            enemyWeights['NINJA'] = Math.min(0.005, 0.0001 + (level * 0.0003)); // 忍者随等级提高而增加
            enemyWeights['CYBORG'] = Math.min(0.004, 0.0001 + (level * 0.0002)); // 机械战士随等级提高而增加
            enemyWeights['ELF'] = Math.min(0.004, 0.0001 + (level * 0.0002)); // 精灵随等级提高而增加
            enemyWeights['DRUID'] = Math.min(0.004, 0.0001 + (level * 0.0002)); // 德鲁伊随等级提高而增加
        }

        if (level > 12) { // 更高的关卡才出现以下敌人
            enemyWeights['ZOMBIE'] = Math.min(0.003, 0.0001 + (level * 0.0001)); // 僵尸随等级提高而增加
            enemyWeights['ORGE'] = Math.min(0.002, 0.00005 + (level * 0.0001)); // 食人魔随等级提高而增加
        }

        if (level > 20) { // 非常高的关卡才出现以下敌人
            enemyWeights['PHOENIX'] = Math.min(0.001, 0.00005 + (level * 0.00008)); // 凤凰随等级提高而增加
            enemyWeights['KRAKEN'] = Math.min(0.0005, 0.00002 + (level * 0.00005)); // 海怪随等级提高而增加
        }

        // 更高关卡（25级以上）出现更稀有的敌人
        if (level > 25) {
            enemyWeights['DRAGON_KING'] = Math.min(0.0003, 0.00001 + (level * 0.00003)); // 龙王随等级提高而增加
            enemyWeights['UNICORN'] = Math.min(0.0003, 0.00001 + (level * 0.00003)); // 独角兽随等级提高而增加
        }

        if (level > 30) {
            enemyWeights['BASILISK'] = Math.min(0.0002, 0.000005 + (level * 0.00002)); // 蛇怪随等级提高而增加
            enemyWeights['GRIFFIN'] = Math.min(0.0002, 0.000005 + (level * 0.00002)); // 狮鹫随等级提高而增加
        }

        if (level > 35) {
            enemyWeights['MINOTAUR'] = Math.min(0.0001, 0.000003 + (level * 0.00001)); // 牛头怪随等级提高而增加
            enemyWeights['HYDRA'] = Math.min(0.0001, 0.000003 + (level * 0.00001)); // 九头蛇随等级提高而增加
        }

        if (level > 40) {
            enemyWeights['PEGASUS'] = Math.min(0.0001, 0.000002 + (level * 0.000008)); // 飞马随等级提高而增加
            enemyWeights['COCKATRICE'] = Math.min(0.0001, 0.000002 + (level * 0.000008)); // 鸡蛇怪随等级提高而增加
            enemyWeights['CHIMERA'] = Math.min(0.00008, 0.000001 + (level * 0.000005)); // 奇美拉随等级提高而增加
            enemyWeights['BANSHEE'] = Math.min(0.00008, 0.000001 + (level * 0.000005)); // 女妖随等级提高而增加
        }

        // 为Steam发布新增的敌人类型添加权重（等级更高的时候出现）
        if (level > 30) {
            enemyWeights['WEREWOLF'] = Math.min(0.0001, 0.00001 + (level * 0.00002)); // 狼人随等级提高而增加
            enemyWeights['MERMAID'] = Math.min(0.0001, 0.00001 + (level * 0.00002)); // 美人鱼随等级提高而增加
        }

        if (level > 35) {
            enemyWeights['GARGOYLE'] = Math.min(0.00008, 0.000005 + (level * 0.00001)); // 石像鬼随等级提高而增加
            enemyWeights['FAIRY'] = Math.min(0.00008, 0.000005 + (level * 0.00001)); // 仙女随等级提高而增加
            enemyWeights['HARPY'] = Math.min(0.00008, 0.000005 + (level * 0.00001)); // 鹰身女妖随等级提高而增加
        }

        if (level > 45) {
            enemyWeights['CRYPTID'] = Math.min(0.00005, 0.000003 + (level * 0.000008)); // 神秘生物随等级提高而增加
            enemyWeights['CONSTRUCT'] = Math.min(0.00005, 0.000003 + (level * 0.000008)); // 构造体随等级提高而增加
        }

        if (level > 50) {
            enemyWeights['ENT'] = Math.min(0.00003, 0.000001 + (level * 0.000005)); // 树人随等级提高而增加
            enemyWeights['SHADOW_DOPPELGANGER'] = Math.min(0.00003, 0.000001 + (level * 0.000005)); // 暗影分身随等级提高而增加
            enemyWeights['ETHEREAL_BEING'] = Math.min(0.00003, 0.000001 + (level * 0.000005)); // 灵体生物随等级提高而增加
        }

        // 随机选择敌人类型，基于权重
        let randomValue = Math.random() * totalWeight;
        let cumulativeWeight = 0;

        for (const [enemyType, weight] of Object.entries(enemyWeights)) {
            cumulativeWeight += weight;
            if (randomValue <= cumulativeWeight) {
                type = enemyType;
                break;
            }
        }

        this.type = type;
        this.config = ENEMY_TYPES[type];

        // 如果是BOSS类型，播放BOSS出现音效
        if (this.type === 'BOSS') {
            AudioManager.playSound('boss_appear');
        }

        this.size = Math.floor(20 * this.config.size + randomInt(0, 15));
        this.x = Math.random() < 0.5 ? -this.size : canvas.width + this.size;
        this.y = randomInt(0, canvas.height);
        this.speed = randomFloat(0.5 + this.config.speed, 1.2 + this.config.speed + Math.log(level + 1) * 0.3); // 使用对数增长减缓速度提升
        this.hp = Math.floor((10 + level * 2.2 + Math.pow(level * 0.3, 1.4)) * this.config.hp); // 使用幂函数调整血量增长曲线，使早期更易打，后期更有挑战
        this.maxHp = this.hp;
        this.damage = Math.floor((2.0 + level * 0.6 + Math.pow(level * 0.25, 1.3)) * this.config.damage); // 调整伤害增长曲线，使其更平衡
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
        this.type = type; // 'standard', 'sparkle', 'smoke', 'explosion', 'magic', 'impact', 'beam', 'comet', 'pulse', 'ripple', 'laser', 'rainbow', 'twinkle'

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
            case 'impact': // 新增撞击特效
                this.size = randomInt(2, 5);
                this.speedX = randomFloat(-6, 6);
                this.speedY = randomFloat(-6, 6);
                this.life = 1;
                this.decay = randomFloat(0.03, 0.06);
                this.gravity = 0.05;
                this.trail = []; // 轨迹数组
                this.maxTrailLength = 5; // 最大轨迹长度
                break;
            case 'beam': // 新增光束特效
                this.size = randomInt(1, 3);
                this.speedX = randomFloat(-1, 1);
                this.speedY = randomFloat(-1, 1);
                this.life = 1;
                this.decay = randomFloat(0.01, 0.02);
                this.gravity = 0;
                this.length = randomInt(20, 40); // 光束长度
                this.angle = Math.atan2(this.speedY, this.speedX); // 光束角度
                break;
            case 'comet': // 新增彗星特效
                this.size = randomInt(4, 8);
                this.speedX = randomFloat(-15, 15);
                this.speedY = randomFloat(-15, 15);
                this.life = 1;
                this.decay = randomFloat(0.005, 0.01);
                this.gravity = 0;
                this.trail = [];
                this.maxTrailLength = 10;
                this.trailDecay = randomFloat(0.85, 0.95); // 轨迹淡出速度
                break;
            case 'pulse': // 新增脉冲特效
                this.size = randomInt(8, 12);
                this.speedX = 0;
                this.speedY = 0;
                this.life = 1;
                this.decay = randomFloat(0.02, 0.04);
                this.gravity = 0;
                this.originalSize = this.size; // 保存原始大小
                this.pulseSpeed = randomFloat(0.2, 0.5); // 脉冲速度
                this.pulsePhase = randomFloat(0, Math.PI * 2); // 脉冲相位
                break;
            case 'ripple': // 波纹效果
                this.size = randomInt(10, 20);
                this.speedX = 0;
                this.speedY = 0;
                this.life = 1;
                this.decay = randomFloat(0.01, 0.03);
                this.gravity = 0;
                this.originalSize = this.size; // 保存原始大小
                this.expandSpeed = randomFloat(1.5, 2.5); // 扩散速度
                break;
            case 'laser': // 激光效果
                this.size = randomInt(1, 2);
                this.speedX = randomFloat(-0.5, 0.5);
                this.speedY = randomFloat(-0.5, 0.5);
                this.life = 1;
                this.decay = randomFloat(0.02, 0.05);
                this.gravity = 0;
                this.length = randomInt(30, 60); // 激光长度
                this.angle = Math.atan2(this.speedY, this.speedX);
                this.laserWidth = randomInt(3, 6); // 激光宽度
                this.oscillation = randomFloat(0.1, 0.3); // 震荡效果
                break;
            case 'rainbow': // 彩虹效果
                this.size = randomInt(3, 7);
                this.speedX = randomFloat(-3, 3);
                this.speedY = randomFloat(-3, 3);
                this.life = 1;
                this.decay = randomFloat(0.01, 0.02);
                this.gravity = 0;
                this.hue = randomInt(0, 360); // 初始色调
                this.colorShift = randomFloat(0.5, 2); // 色调变化速度
                break;
            case 'twinkle': // 闪烁效果
                this.size = randomInt(1, 3);
                this.speedX = 0;
                this.speedY = 0;
                this.life = 1;
                this.decay = randomFloat(0.01, 0.03);
                this.gravity = 0;
                this.twinkleSpeed = randomFloat(0.05, 0.1); // 闪烁速度
                this.twinklePhase = randomFloat(0, Math.PI * 2); // 闪烁相位
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

        // 更新轨迹效果
        if (this.type === 'impact' || this.type === 'comet') {
            this.trail.push({x: this.x, y: this.y, life: this.life, size: this.size});
            if (this.trail.length > this.maxTrailLength) {
                this.trail.shift();
            }
        }
    }

    draw() {
        ctx.globalAlpha = this.life;

        // 根据粒子类型绘制不同的形状
        switch(this.type) {
            case 'sparkle':
                // 绘制闪光点
                ctx.fillStyle = this.color;
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
                ctx.fillStyle = this.color;
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
            case 'impact': // 撞击特效
                // 绘制主体
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();

                // 绘制轨迹
                for (let i = 0; i < this.trail.length; i++) {
                    const point = this.trail[i];
                    const trailAlpha = this.life * (i / this.trail.length);
                    ctx.globalAlpha = trailAlpha;

                    ctx.beginPath();
                    ctx.arc(point.x, point.y, point.size * (i / this.trail.length), 0, Math.PI * 2);
                    ctx.fillStyle = this.color;
                    ctx.fill();
                }
                ctx.globalAlpha = this.life;
                break;
            case 'beam': // 光束特效
                // 保存当前变换状态
                ctx.save();

                // 移动到粒子位置并旋转
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);

                // 创建渐变光束
                const beamGradient = ctx.createLinearGradient(0, 0, this.length, 0);
                beamGradient.addColorStop(0, this.color);
                beamGradient.addColorStop(0.5, lightenColor(this.color, 70));
                beamGradient.addColorStop(1, this.color);

                ctx.fillStyle = beamGradient;

                // 绘制光束
                ctx.beginPath();
                ctx.rect(0, -this.size/2, this.length, this.size);
                ctx.fill();

                // 恢复变换状态
                ctx.restore();
                break;
            case 'comet': // 彗星特效
                // 绘制主体
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();

                // 绘制尾巴
                ctx.globalCompositeOperation = 'screen'; // 使用叠加混合模式
                for (let i = 0; i < this.trail.length; i++) {
                    const point = this.trail[i];
                    const trailLife = point.life * Math.pow(this.trailDecay, this.trail.length - i);
                    const trailSize = point.size * (i / this.trail.length);

                    ctx.globalAlpha = trailLife;
                    ctx.fillStyle = this.color;
                    ctx.beginPath();
                    ctx.arc(point.x, point.y, trailSize, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.globalCompositeOperation = 'source-over'; // 恢复正常混合模式

                ctx.globalAlpha = this.life;
                break;
            case 'pulse': // 脉冲特效
                // 计算脉冲大小
                const pulseSize = this.originalSize + Math.sin(Date.now() / 1000 * this.pulseSpeed + this.pulsePhase) * 5;

                // 创建脉冲效果
                const pulseGradient = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, pulseSize
                );
                pulseGradient.addColorStop(0, lightenColor(this.color, 80));
                pulseGradient.addColorStop(0.3, this.color);
                pulseGradient.addColorStop(0.7, darkenColor(this.color, 30));
                pulseGradient.addColorStop(1, 'transparent');

                ctx.fillStyle = pulseGradient;
                ctx.beginPath();
                ctx.arc(this.x, this.y, pulseSize, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'ripple': // 波纹效果
                // 计算波纹半径
                const rippleRadius = this.originalSize + (1 - this.life) * this.expandSpeed * 50;

                // 创建波纹效果
                const rippleGradient = ctx.createRadialGradient(
                    this.x, this.y, this.originalSize * 0.3,
                    this.x, this.y, rippleRadius
                );
                rippleGradient.addColorStop(0, lightenColor(this.color, 70));
                rippleGradient.addColorStop(0.7, this.color);
                rippleGradient.addColorStop(0.8, darkenColor(this.color, 30));
                rippleGradient.addColorStop(1, 'transparent');

                ctx.fillStyle = rippleGradient;
                ctx.beginPath();
                ctx.arc(this.x, this.y, rippleRadius, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'laser': // 激光效果
                // 保存当前状态
                ctx.save();

                // 移动到粒子位置并旋转
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);

                // 计算振荡偏移
                const oscillationOffset = Math.sin(Date.now() / 100 * this.oscillation) * 2;

                // 创建激光渐变
                const laserGradient = ctx.createLinearGradient(0, 0, this.length, 0);
                laserGradient.addColorStop(0, lightenColor(this.color, 80));
                laserGradient.addColorStop(0.3, this.color);
                laserGradient.addColorStop(0.7, darkenColor(this.color, 20));
                laserGradient.addColorStop(1, 'transparent');

                // 绘制激光主体
                ctx.fillStyle = laserGradient;
                ctx.beginPath();
                ctx.rect(0, -this.laserWidth/2 + oscillationOffset, this.length, this.laserWidth);
                ctx.fill();

                // 添加激光中心亮线
                ctx.fillStyle = lightenColor(this.color, 50);
                ctx.fillRect(0, -1, this.length, 2);

                // 恢复状态
                ctx.restore();
                break;
            case 'rainbow': // 彩虹效果
                // 根据生命周期更新色调
                const currentHue = (this.hue + this.life * 100 * this.colorShift) % 360;
                const rainbowColor = `hsl(${currentHue}, 100%, 60%)`;

                // 绘制彩色粒子
                ctx.fillStyle = rainbowColor;
                ctx.globalAlpha = this.life;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();

                // 添加发光效果
                ctx.shadowColor = rainbowColor;
                ctx.shadowBlur = 10;
                ctx.fill();
                ctx.shadowBlur = 0;

                break;
            case 'twinkle': // 闪烁效果
                // 计算闪烁强度
                const twinkleIntensity = Math.abs(Math.sin(Date.now() / 1000 * this.twinkleSpeed + this.twinklePhase));
                const twinkleSize = this.size + twinkleIntensity * 3;

                // 绘制闪烁粒子
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.life * twinkleIntensity;
                ctx.beginPath();
                ctx.arc(this.x, this.y, twinkleSize, 0, Math.PI * 2);
                ctx.fill();

                // 添加闪烁光晕
                ctx.shadowColor = this.color;
                ctx.shadowBlur = 15;
                ctx.fill();
                ctx.shadowBlur = 0;

                break;
            case 'standard':
            default:
                ctx.fillStyle = this.color;
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

// 辅助函数：颜色变暗
function darkenColor(color, percent) {
    // 简化版本，如果输入的是十六进制颜色
    if (color.startsWith('#')) {
        let num = parseInt(color.slice(1), 16);
        let amt = Math.round(2.55 * percent);
        let R = (num >> 16) - amt;
        let G = (num >> 8 & 0x00FF) - amt;
        let B = (num & 0x0000FF) - amt;

        R = (R > 0) ? R : 0;
        G = (G > 0) ? G : 0;
        B = (B > 0) ? B : 0;

        const RR = ((R.toString(16).length === 1) ? "0" + R.toString(16) : R.toString(16));
        const GG = ((G.toString(16).length === 1) ? "0" + G.toString(16) : G.toString(16));
        const BB = ((B.toString(16).length === 1) ? "0" + B.toString(16) : B.toString(16));

        return "#" + RR + GG + BB;
    }
    // 如果是其他格式，直接返回原色
    return color;
}

// 创建更丰富的粒子效果
function createParticles(x, y, color, count, type = 'standard') {
    for (let i = 0; i < count; i++) {
        gameState.particles.push(new Particle(x, y, color, type));
    }
}

// 创建武器获取的增强特效
function createWeaponGetEffect(x, y, weapon) {
    const color = weapon.color || '#ffffff';

    // 创建多层特效
    createParticles(x, y, color, 15, 'sparkle');  // 闪光效果
    createParticles(x, y, color, 10, 'magic');    // 魔法效果
    createParticles(x, y, color, 8, 'beam');      // 光束效果
    createPulseEffect(x, y, color);               // 脉冲效果

    // 根据武器稀有度添加额外特效
    switch(weapon.rarity) {
        case 'rare':
            createParticles(x, y, '#4A90E2', 10, 'sparkle'); // 蓝色稀有特效
            createRippleEffect(x, y, '#4A90E2'); // 蓝色波纹特效
            break;
        case 'epic':
            createParticles(x, y, '#9b5de5', 15, 'magic'); // 紫色史诗特效
            createParticles(x, y, '#9b5de5', 8, 'beam');   // 紫色光束
            createLaserEffect(x, y, '#9b5de5'); // 紫色激光
            break;
        case 'legendary':
            createParticles(x, y, '#FFD700', 20, 'sparkle'); // 金色传说特效
            createParticles(x, y, '#FFA500', 15, 'magic');   // 橙色魔法
            createParticles(x, y, '#FF69B4', 10, 'pulse');   // 粉色脉冲
            createRainbowEffect(x, y, 15); // 彩虹效果
            shakeScreen(10, 200); // 轻微屏幕震动
            break;
        case 'mythic':
            createParticles(x, y, '#FF00FF', 25, 'sparkle'); // 紫红色神话特效
            createParticles(x, y, '#00FFFF', 20, 'magic');   // 青色魔法
            createParticles(x, y, '#FFFF00', 15, 'beam');    // 黄色光束
            createParticles(x, y, '#00FF00', 10, 'pulse');   // 绿色脉冲
            createRainbowEffect(x, y, 20); // 强化彩虹效果
            createTwinkleEffect(x, y, '#FFFFFF', 15); // 白色闪烁
            shakeScreen(15, 300); // 中等屏幕震动
            break;
        default: // common and uncommon
            createTwinkleEffect(x, y, color, 5); // 普通物品添加闪烁效果
    }
}

// 创建魔法粒子效果
function createMagicParticles(x, y, color, count = 8) {
    for (let i = 0; i < count; i++) {
        gameState.particles.push(new Particle(x, y, color, 'magic'));
    }
}

// 增强的屏幕震动功能
function shakeScreen(intensity, duration) {
    gameState.screenShake = Math.max(gameState.screenShake, intensity);
    // 使用更平滑的震动衰减
    const startTime = Date.now();
    const decayInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        if (elapsed >= duration) {
            clearInterval(decayInterval);
        }
    }, 10); // 更新间隔
}

// 增强的攻击效果
function enhancedAttackEffect(x, y, damage, weapon) {
    // 根据武器类型和伤害创建不同效果
    const color = weapon?.color || '#ffffff';
    const particleCount = Math.min(20, Math.max(5, damage / 2)); // 基于伤害调整粒子数量

    // 创建主要的冲击波效果
    createParticles(x, y, color, particleCount, 'impact');

    // 如果伤害很高，添加额外的特效
    if (damage > 20) {
        createParticles(x, y, lightenColor(color, 30), particleCount * 2, 'sparkle');
        // 添加光晕效果
        createPulseEffect(x, y, color);
    }

    // 适中的屏幕震动
    const shakeIntensity = Math.min(15, damage / 3);
    shakeScreen(shakeIntensity, 200);
}

// 创建脉冲效果
function createPulseEffect(x, y, color) {
    // 创建脉冲环形效果
    createParticles(x, y, color, 1, 'pulse');
}

// 创建波纹效果
function createRippleEffect(x, y, color) {
    createParticles(x, y, color, 1, 'ripple');
}

// 创建激光效果
function createLaserEffect(x, y, color) {
    createParticles(x, y, color, 5, 'laser');
}

// 创建彩虹效果
function createRainbowEffect(x, y, count = 10) {
    for (let i = 0; i < count; i++) {
        // 随机色调，产生彩虹效果
        const hue = Math.floor(Math.random() * 360);
        const color = `hsl(${hue}, 100%, 60%)`;
        createParticles(x, y, color, 1, 'rainbow');
    }
}

// 创建闪烁效果
function createTwinkleEffect(x, y, color, count = 8) {
    for (let i = 0; i < count; i++) {
        createParticles(x, y, color, 1, 'twinkle');
    }
}

// 增强的敌人死亡效果
function enhancedDeathEffect(x, y, enemyType) {
    const colors = {
        'MELEE': '#FF6B6B',
        'RANGED': '#4ECDC4',
        'ELITE': '#FFE66D',
        'BOSS': '#FF0000',
        'TANK': '#888888',
        'SUPPORT': '#9B5DE5'
    };

    const color = colors[enemyType] || '#FFFFFF';

    // 根据敌人类型调整特效
    switch(enemyType) {
        case 'BOSS':
            // Boss死亡时的大型爆炸
            createParticles(x, y, color, 50, 'explosion');
            createParticles(x, y, color, 30, 'magic');
            createParticles(x, y, color, 20, 'beam');
            shakeScreen(30, 500);
            break;
        case 'ELITE':
            // 精英敌人死亡效果
            createParticles(x, y, color, 25, 'explosion');
            createParticles(x, y, color, 15, 'sparkle');
            shakeScreen(15, 300);
            break;
        case 'TANK':
            // 坦克敌人死亡效果
            createParticles(x, y, color, 30, 'explosion');
            createParticles(x, y, color, 20, 'smoke');
            shakeScreen(20, 400);
            break;
        default:
            // 普通敌人死亡效果
            createParticles(x, y, color, 15, 'explosion');
            createParticles(x, y, color, 8, 'sparkle');
            break;
    }
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
        // 播放武器拾取音效
        AudioManager.playSound('weapon_pickup');
    } else if (drop.type === 'potion') {
        usePotion(drop.item);
        // 播放药水拾取音效
        AudioManager.playSound('potion_pickup');
    } else if (drop.type === 'relic') {
        collectRelic(drop.item);
        // 播放遗物拾取音效
        AudioManager.playSound('relic_pickup');
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

    // 增加获取的武器计数
    gameState.weaponsAcquired = (gameState.weaponsAcquired || 0) + 1;

    // 根据武器稀有度播放不同音效
    if (newWeapon.rarity === 'epic') {
        AudioManager.playSound('skill_use'); // 使用技能音效表示史诗级武器
    } else if (newWeapon.rarity === 'legendary') {
        AudioManager.playSound('victory'); // 使用胜利音效表示传说级武器
    } else if (newWeapon.rarity === 'mythic') {
        // 使用特殊音效表示神话级武器
        AudioManager.playSound('magic_spell');
    }

    // 检查概念融合
    checkConceptFusion(newWeapon);

    // 通知成就系统和里程碑系统获取了新武器
    AchievementSystem.onWeaponAcquired(newWeapon);

    // 通知里程碑系统获取了新武器
    if (typeof MilestoneSystem !== 'undefined') {
        MilestoneSystem.onWeaponAcquired(newWeapon);
    }

    const logMsg = oldWeapon
        ? `💔 失去 ${oldWeapon.name} → ⚔️ 获得 ${newWeapon.name}`
        : `⚔️ 获得 ${newWeapon.name}`;

    const logClass = newWeapon.damage > (oldWeapon?.damage || 0) ? 'weapon-get' : 'weapon-lose';
    showCombatLog(logMsg, logClass);

    // 创建增强的武器获取特效
    createWeaponGetEffect(player.x, player.y, newWeapon);
}

function usePotion(potion) {
    // 增加使用的药水计数
    gameState.potionsUsed = (gameState.potionsUsed || 0) + 1;

    // 通知成就系统使用了药水
    AchievementSystem.onPotionUsed(potion);

    switch (potion.effect) {
        case 'heal':
            gameState.player.hp = Math.min(gameState.player.maxHp, gameState.player.hp + potion.value);

            // 播放治疗音效
            AudioManager.playSound('heal');

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

        // 新增扩展药水效果
        case 'berserk_damage':
            gameState.buffs.push({ effect: 'berserk_damage', duration: potion.duration, value: potion.value });
            showCombatLog(`😠 使用 ${potion.name}，伤害提升 ${(potion.value - 1) * 100}%！`, 'weapon-get');
            break;

        case 'invisibility':
            gameState.buffs.push({ effect: 'invisibility', duration: potion.duration });
            showCombatLog(`👁️ 使用 ${potion.name}，获得短暂隐身！`, 'weapon-get');
            // 这里可以添加一些视觉效果，比如降低玩家可见度
            break;

        case 'aoe_blast':
            // 范围伤害效果
            let hitEnemies = 0;
            const weaponDamage = gameState.player.weapon ? gameState.player.weapon.damage : 5;
            const aoeRadius = 100; // 作用半径

            for (let i = gameState.enemies.length - 1; i >= 0; i--) {
                const enemy = gameState.enemies[i];
                const distance = getDistance(gameState.player, enemy);

                if (distance <= aoeRadius) {
                    enemy.hp -= potion.value; // 直接使用药水的伤害值

                    // 创建攻击效果
                    enhancedAttackEffect(enemy.x, enemy.y, potion.value, gameState.player.weapon);

                    if (enemy.hp <= 0) {
                        // 处理敌人死亡
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
                            const potionItem = POTIONS[randomInt(0, POTIONS.length - 1)];
                            gameState.drops.push(new Drop(enemy.x, enemy.y, potionItem, 'potion'));
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

                            // 通知里程碑系统玩家升级
                            if (typeof MilestoneSystem !== 'undefined') {
                                MilestoneSystem.onLevelUp(gameState.level);
                            }

                            showCombatLog(t('levelUp').replace('%d', gameState.level), 'weapon-get');
                            AudioManager.playSound('level_up');

                            // 升级时增加玩家生命值
                            // 每升一级增加一定生命值，但增长递减
                            const baseHpIncrease = 8; // 基础生命值增加量
                            const levelMultiplier = Math.max(0.3, 1.0 - (gameState.level * 0.005)); // 随等级增长递减
                            const hpIncrease = Math.floor(baseHpIncrease * levelMultiplier);

                            gameState.player.maxHp += hpIncrease;
                            gameState.player.hp += hpIncrease; // 同时恢复相应生命值

                            // 限制最大生命值，避免过度膨胀
                            const maxHpLimit = 500; // 设定最大生命值上限
                            gameState.player.maxHp = Math.min(gameState.player.maxHp, maxHpLimit);
                            gameState.player.hp = Math.min(gameState.player.hp, gameState.player.maxHp);

                            // 检查并处理特殊关卡里程碑事件
                            handleMilestoneEvents();
                        }

                        gameState.enemies.splice(i, 1);
                    }
                    hitEnemies++;
                }
            }

            showCombatLog(`💥 使用 ${potion.name}，击中 ${hitEnemies} 个敌人！`, 'weapon-get');
            break;

        case 'duplicate_weapon':
            // 复制当前武器
            if (gameState.player.weapon) {
                const duplicatedWeapon = {...gameState.player.weapon, id: Date.now() + Math.random()};
                gameState.potions.push(duplicatedWeapon); // 添加到药水栏？不对，应该直接替换
                showCombatLog(`游戏副本 ${potion.name}，复制了当前武器！`, 'weapon-get');
            } else {
                showCombatLog(`❌ ${potion.name} 无效，当前没有武器！`, 'weapon-lose');
            }
            break;

        case 'reveal_enemies':
            // 显示敌人位置的效果，可以只是显示日志或临时视觉效果
            const enemyCount = gameState.enemies.length;
            gameState.buffs.push({ effect: 'reveal_enemies', duration: potion.duration });
            showCombatLog(`👁️ 使用 ${potion.name}，发现地图上有 ${enemyCount} 个敌人！`, 'weapon-get');
            break;

        case 'heal_aura':
            // 持续治疗效果
            gameState.buffs.push({ effect: 'regen', duration: potion.duration, value: potion.value });
            showCombatLog(`💚 使用 ${potion.name}，持续治疗！`, 'weapon-get');
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
    // 基础生成间隔随关卡增加逐渐缩短，但有一个最小值避免敌人过多
    // 修改曲线为指数形式，使早期游戏更轻松，后期挑战更有节奏感
    const baseSpawnRate = Math.max(7000 - (gameState.level * 30) - (gameState.level * gameState.level * 0.3), 1000); // 使用二次函数调整曲线，给玩家更好的适应过程
    const minSpawnRate = 1000; // 略微提高最小生成间隔，确保玩家总有喘息机会
    const spawnRate = Math.max(minSpawnRate, baseSpawnRate);

    // 根据难度调整生成速率
    const adjustedSpawnRate = spawnRate / gameState.enemySpawnRate;

    setTimeout(spawnEnemy, adjustedSpawnRate);
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

    // 自然生命恢复机制 - 玩家生命值随时间缓慢恢复
    const currentTime = Date.now();
    if (!gameState.lastHealTime) {
        gameState.lastHealTime = currentTime;
    }

    if (currentTime - gameState.lastHealTime > 5000) { // 每5秒恢复一次
        // 只有在没有受伤的情况下才能自然恢复
        if (currentTime - gameState.lastHitTime > 3000) { // 3秒内未受伤才开始恢复
            // 根据当前生命值百分比调整恢复量 - 生命越低恢复越慢
            const healAmount = Math.max(1, Math.floor(gameState.player.maxHp * 0.02 * (gameState.player.hp / gameState.player.maxHp)));
            if (healAmount > 0) {
                gameState.player.hp = Math.min(gameState.player.maxHp, gameState.player.hp + healAmount);
                gameState.lastHealTime = currentTime;

                // 创建小幅度的治疗粒子效果
                if (healAmount > 0) {
                    createParticles(gameState.player.x, gameState.player.y, '#00FF00', 3);
                }
            }
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
    // 调整升级所需击杀数，使其更具挑战性但不会过于困难
    const killGoal = Math.min(30, 5 + Math.floor(gameState.level * 1.2) + Math.floor(gameState.level / 5) * 2);
    document.getElementById('goal').textContent = `击杀${killGoal}敌升级`;
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

    // 更新里程碑进度
    if (typeof MilestoneSystem !== 'undefined') {
        const unlockedMilestones = MilestoneSystem.getUnlockedCount();
        const totalMilestones = MilestoneSystem.getTotalCount();
        document.getElementById('milestones').textContent = `里程碑：${unlockedMilestones}/${totalMilestones}`;
    }

    // 添加控制器状态显示
    updateControllerStatus();
}

// 更新控制器状态显示
function updateControllerStatus() {
    // 检查是否有游戏手柄连接
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    const connected = Array.from(gamepads).some(gp => gp && gp.connected);

    let controllerIndicator = document.getElementById('controller-status');

    if (connected) {
        // 如果还没有创建控制器状态元素，则创建它
        if (!controllerIndicator) {
            controllerIndicator = document.createElement('div');
            controllerIndicator.id = 'controller-status';
            controllerIndicator.style.position = 'absolute';
            controllerIndicator.style.top = '10px';
            controllerIndicator.style.right = '10px';
            controllerIndicator.style.fontSize = '14px';
            controllerIndicator.style.color = '#4ade80';
            controllerIndicator.style.zIndex = '100';
            controllerIndicator.style.background = 'rgba(0,0,0,0.5)';
            controllerIndicator.style.padding = '5px 10px';
            controllerIndicator.style.borderRadius = '5px';
            controllerIndicator.style.fontFamily = 'monospace';
            document.getElementById('game-container').appendChild(controllerIndicator);
        }

        controllerIndicator.textContent = '🎮 控制器已连接';

        // 同时显示控制器操作提示
        showControllerHints();
    } else {
        // 移除控制器状态元素（如果存在）
        if (controllerIndicator) {
            controllerIndicator.remove();
        }

        // 隐藏控制器提示
        hideControllerHints();
    }
}

// 显示控制器操作提示
function showControllerHints() {
    let hintsElement = document.getElementById('controller-hints');

    if (!hintsElement) {
        hintsElement = document.createElement('div');
        hintsElement.id = 'controller-hints';
        hintsElement.style.position = 'absolute';
        hintsElement.style.bottom = '10px';
        hintsElement.style.left = '10px';
        hintsElement.style.fontSize = '12px';
        hintsElement.style.color = '#ffffff';
        hintsElement.style.zIndex = '100';
        hintsElement.style.background = 'rgba(0,0,0,0.7)';
        hintsElement.style.padding = '10px';
        hintsElement.style.borderRadius = '5px';
        hintsElement.style.fontFamily = 'monospace';
        hintsElement.style.maxWidth = '250px';
        hintsElement.innerHTML = `
            <div>🎮 控制器操作提示:</div>
            <div>• 左摇杆/方向键: 移动</div>
            <div>• A键/X键: 普通攻击</div>
            <div>• X/Y/B/A: 使用Q/W/E/R技能</div>
            <div>• 开始键: 暂停游戏</div>
        `;
        document.getElementById('game-container').appendChild(hintsElement);
    }
}

// 隐藏控制器操作提示
function hideControllerHints() {
    const hintsElement = document.getElementById('controller-hints');
    if (hintsElement) {
        hintsElement.remove();
    }
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

    // 应用连击伤害倍数
    damage *= gameState.player.comboDamageMultiplier;

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
                // 创建增强的死亡效果
                enhancedDeathEffect(enemy.x, enemy.y, enemy.type);

                // 播放敌人死亡音效
                AudioManager.playSound('enemy_death');

                // Boss敌人额外音效
                if (enemy.type === 'BOSS') {
                    AudioManager.playSound('victory');
                    // 通知成就系统击败了Boss
                    AchievementSystem.onBossDefeat();
                }

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
                    showCombatLog(t('levelUp').replace('%d', gameState.level), 'weapon-get');
                    AudioManager.playSound('level_up');

                    // 升级时增加玩家生命值
                    // 每升一级增加一定生命值，但增长递减
                    const baseHpIncrease = 8; // 基础生命值增加量
                    const levelMultiplier = Math.max(0.3, 1.0 - (gameState.level * 0.005)); // 随等级增长递减
                    const hpIncrease = Math.floor(baseHpIncrease * levelMultiplier);

                    gameState.player.maxHp += hpIncrease;
                    gameState.player.hp += hpIncrease; // 同时恢复相应生命值

                    // 限制最大生命值，避免过度膨胀
                    const maxHpLimit = 500; // 设定最大生命值上限
                    gameState.player.maxHp = Math.min(gameState.player.maxHp, maxHpLimit);
                    gameState.player.hp = Math.min(gameState.player.hp, gameState.player.maxHp);
                }

                gameState.enemies.splice(i, 1);

                // 如果使用了幸运药水并且击杀敌人，记录幸运击杀
                if (usedLuck) {
                    AchievementSystem.onLuckyKill();
                    AchievementSystem.onLuckyKillStreak();

                    // 通知里程碑系统玩家使用幸运药水击杀敌人
                    if (typeof MilestoneSystem !== 'undefined') {
                        MilestoneSystem.onLuckyKill();
                    }
                }

                // 如果使用传说及以上级别的武器击杀敌人，记录传奇武器击杀
                if (gameState.player.weapon &&
                    (gameState.player.weapon.rarity === 'legendary' || gameState.player.weapon.rarity === 'mythic')) {
                    AchievementSystem.onLegendaryWeaponKill();

                    // 通知里程碑系统玩家使用传说武器击杀敌人
                    if (typeof MilestoneSystem !== 'undefined') {
                        MilestoneSystem.onLegendaryKill();
                    }
                }
            } else {
                // 只是击中敌人但未杀死
                createParticles(enemy.x, enemy.y, '#FF4500', 3);

                // 播放击中音效
                AudioManager.playSound('hit');
            }
        }
    }

    if (hitCount > 0) {
        // 更新连击
        updateCombo(currentTime);

        // 显示连击信息
        showCombatLog(`⚔️ 攻击造成 ${Math.floor(damage)} 点伤害!`, 'weapon-get');

        // 设置攻击冷却
        // 应用连击攻击速度加成
        const baseCooldown = 15; // 基础冷却
        gameState.player.attackCooldown = Math.floor(baseCooldown * gameState.player.comboAttackSpeed); // 15帧冷却

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

        // 根据连击数提供奖励效果
        applyComboRewards();
    } else {
        // 否则重置连击
        gameState.player.combo = 1;
    }

    gameState.player.lastHitTime = currentTime;

    // 连击奖励得分（根据连击数增加得分倍率）
    const comboScoreBonus = Math.floor(gameState.player.combo * 0.5); // 基础奖励
    gameState.player.score += 1 + comboScoreBonus; // 基础得分为1加上连击奖励

    // 显示连击信息（仅在特定连击数显示特殊提示）
    if (gameState.player.combo >= 2 &&
        (gameState.player.combo === 5 ||
         gameState.player.combo === 10 ||
         gameState.player.combo >= 20 && gameState.player.combo % 10 === 0)) {
        showCombatLog(`🔥 ${gameState.player.combo} 连击!`, 'weapon-get');

        // 播放特殊的连击音效
        if (gameState.player.combo >= 20) {
            AudioManager.playSound('critical_hit'); // 高连击特殊音效
        } else if (gameState.player.combo >= 10) {
            AudioManager.playSound('level_up'); // 高连击音效
        } else if (gameState.player.combo >= 5) {
            AudioManager.playSound('collect'); // 连击音效
        }
    }
}

// 应用连击奖励效果
function applyComboRewards() {
    // 不同连击阶段提供不同奖励
    if (gameState.player.combo >= 50) {
        // 50+连击: 伤害增加50%，攻击速度提升
        gameState.player.comboDamageMultiplier = 1.5;
        gameState.player.comboAttackSpeed = 0.7; // 攻击间隔减少30%
        gameState.player.comboDefense = 1.0; // 受伤减少10%
    } else if (gameState.player.combo >= 30) {
        // 30+连击: 伤害增加40%，攻击速度提升
        gameState.player.comboDamageMultiplier = 1.4;
        gameState.player.comboAttackSpeed = 0.75;
        gameState.player.comboDefense = 1.0;
    } else if (gameState.player.combo >= 20) {
        // 20+连击: 伤害增加30%，轻微防御加成
        gameState.player.comboDamageMultiplier = 1.3;
        gameState.player.comboAttackSpeed = 0.85;
        gameState.player.comboDefense = 0.8; // 受伤减少20%
    } else if (gameState.player.combo >= 10) {
        // 10+连击: 伤害增加20%
        gameState.player.comboDamageMultiplier = 1.2;
        gameState.player.comboAttackSpeed = 1.0;
        gameState.player.comboDefense = 1.0;
    } else if (gameState.player.combo >= 5) {
        // 5+连击: 伤害增加10%
        gameState.player.comboDamageMultiplier = 1.1;
        gameState.player.comboAttackSpeed = 1.0;
        gameState.player.comboDefense = 1.0;
    } else {
        // 低于5连击: 无奖励
        gameState.player.comboDamageMultiplier = 1.0;
        gameState.player.comboAttackSpeed = 1.0;
        gameState.player.comboDefense = 1.0;
    }
}

// 重置连击奖励
function resetComboRewards() {
    gameState.player.comboDamageMultiplier = 1.0;
    gameState.player.comboAttackSpeed = 1.0;
    gameState.player.comboDefense = 1.0;
}

// 重置连击
function resetCombo() {
    // 播放连击中断音效
    if (gameState.player.combo > 0) {
        AudioManager.playSound('combo_break');
    }
    gameState.player.combo = 0;

    // 同时重置连击奖励
    resetComboRewards();
}

// 检测敌人的碰撞（保持原有的碰撞检测）
function checkCollisions() {
    // 玩家与敌人碰撞
    for (const enemy of gameState.enemies) {
        if (getDistance(gameState.player, enemy) < player.size + enemy.size) {
            // 计算伤害
            let damage = enemy.damage;

            // 计算护甲减免 - 基于武器的防御能力（使用武器伤害的一定比例作为防御）
            let armorReduction = 0;
            if (gameState.player.weapon) {
                // 护甲值为基础武器伤害的一定比例，避免过度防御
                armorReduction = Math.floor(gameState.player.weapon.damage * 0.2);

                // 应用护甲减免，但至少受到1点伤害
                damage = Math.max(1, damage - armorReduction);

                // 计算玩家的真实伤害减免量
                const actualReduction = enemy.damage - damage;

                // 如果有伤害减免，显示减伤提示
                if (actualReduction > 0) {
                    showCombatLog(`🛡️ 护甲减免 ${actualReduction} 伤害`, 'weapon-get');
                }
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
                        showCombatLog('🛡️ 护盾已耗尽', 'weapon-lose');
                    }
                }
            }

            // 播放受伤音效
            AudioManager.playSound('hurt');

            // 应用连击防御加成
            damage *= gameState.player.comboDefense;

            // 如果最终伤害仍大于0，减少玩家生命值
            if (damage > 0) {
                gameState.player.hp -= damage;

                // 更新最后一次受伤时间（用于自然恢复系统）
                gameState.lastHitTime = Date.now();

                // 创建伤害特效
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

                        // 根据当前关卡决定升级所需的击杀数，使其与UI显示一致
                        // 优化升级公式：前期增长较慢，让玩家有适应期；后期增长加快，保持挑战性
                        const killsNeededForLevel = Math.min(30, 5 + Math.floor(gameState.level * 1.2) + Math.floor(gameState.level / 4) * 3);

                        if (gameState.kills % killsNeededForLevel === 0) {
                            gameState.level++;

                            // 通知里程碑系统玩家升级
                            if (typeof MilestoneSystem !== 'undefined') {
                                MilestoneSystem.onLevelUp(gameState.level);
                            }

                            showCombatLog(t('levelUp').replace('%d', gameState.level), 'weapon-get');
                            AudioManager.playSound('level_up');
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
                        showCombatLog('🛡️ 护盾已耗尽', 'weapon-lose');
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

            // 应用武器护甲减免到射弹伤害
            let projArmorReduction = 0;
            if (gameState.player.weapon) {
                projArmorReduction = Math.floor(gameState.player.weapon.damage * 0.1);
                projDamage = Math.max(1, projDamage - projArmorReduction);
            }

            // 应用连击防御加成
            projDamage *= gameState.player.comboDefense;

            gameState.player.hp -= projDamage;

            // 更新最后一次受伤时间（用于自然恢复系统）
            gameState.lastHitTime = Date.now();

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

    // 检查教程进度
    TutorialSystem.checkTutorial();

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

    // 更新控制器状态显示
    updateControllerStatus();

    // 更新粒子系统
    if (typeof updateParticles !== 'undefined') {
        updateParticles();
    }

    if (gameState.screenShake > 0) {
        ctx.restore(); // 恢复画布变换
    }

    // 绘制粒子系统
    if (typeof drawParticles !== 'undefined') {
        drawParticles(ctx);
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

// 教程系统
const TutorialSystem = {
    tutorialSteps: [
        {
            title: "欢迎来到武器替换者!",
            message: "在这个游戏中，你必须不断更换武器来应对敌人。",
            condition: () => true,
            highlight: null
        },
        {
            title: "移动控制",
            message: "使用鼠标控制角色移动，靠近武器即可自动拾取并替换当前武器。",
            condition: () => true, // 初始显示
            highlight: null
        },
        {
            title: "战斗系统",
            message: "靠近敌人即可自动攻击，注意躲避敌人的攻击。",
            condition: () => gameState.enemies.length > 0,
            highlight: null
        },
        {
            title: "武器替换",
            message: "重要提醒：敌人掉落的武器会**强制替换**你当前的武器，这是游戏的核心机制！",
            condition: () => gameState.weaponsAcquired >= 1,
            highlight: null
        },
        {
            title: "生命与治疗",
            message: "生命值会随时间缓慢恢复，也可以通过拾取生命药水来治疗。",
            condition: () => gameState.potions.length > 0 || gameState.player.hp < gameState.player.maxHp,
            highlight: null
        },
        {
            title: "关卡目标",
            message: "击败一定数量的敌人即可进入下一关，每关敌人都会变得更强大！",
            condition: () => gameState.level > 1,
            highlight: null
        },
        {
            title: "技能系统",
            message: "按 Q/W/E/R 键使用不同技能，每个技能有独立的冷却时间。",
            condition: () => gameState.skillsUsed >= 1,
            highlight: null
        },
        {
            title: "教程完成",
            message: "恭喜！你已经掌握了游戏的基本操作。尽情享受武器替换的乐趣吧！",
            condition: () => gameState.level >= 3,
            highlight: null
        }
    ],

    currentStep: 0,
    tutorialVisible: false,

    init() {
        this.currentStep = 0;
        this.tutorialVisible = false;
    },

    checkTutorial() {
        if (this.currentStep >= this.tutorialSteps.length || this.currentStep >= 8) { // 限制最大步骤
            return; // 教程已完成
        }

        // 检查当前步骤的条件是否满足
        const currentTime = Date.now();
        if (currentTime - gameState.lastTutorialCheck < 2000) { // 防止频繁检查
            return;
        }
        gameState.lastTutorialCheck = currentTime;

        const currentStep = this.tutorialSteps[this.currentStep];
        if (currentStep && currentStep.condition()) {
            this.showTutorial(this.currentStep);
            this.currentStep++;
        }
    },

    showTutorial(stepIndex) {
        if (stepIndex >= this.tutorialSteps.length || !this.tutorialSteps[stepIndex]) return;

        const step = this.tutorialSteps[stepIndex];

        // 创建教程弹窗
        this.hideTutorial(); // 先隐藏之前的教程

        const tutorialDiv = document.createElement('div');
        tutorialDiv.id = 'tutorial-popup';
        tutorialDiv.style.position = 'absolute';
        tutorialDiv.style.top = '50%';
        tutorialDiv.style.left = '50%';
        tutorialDiv.style.transform = 'translate(-50%, -50%)';
        tutorialDiv.style.background = 'rgba(10, 10, 30, 0.95)';
        tutorialDiv.style.padding = '25px';
        tutorialDiv.style.borderRadius = '15px';
        tutorialDiv.style.border = '2px solid #ffd700';
        tutorialDiv.style.zIndex = '400';
        tutorialDiv.style.backdropFilter = 'blur(10px)';
        tutorialDiv.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.5)';
        tutorialDiv.style.textAlign = 'center';
        tutorialDiv.style.maxWidth = '500px';
        tutorialDiv.style.minWidth = '400px';

        tutorialDiv.innerHTML = `
            <h3 style="color: #ffd700; margin-top: 0; text-shadow: 0 0 10px rgba(255, 215, 0, 0.7);">${step.title}</h3>
            <p style="font-size: 16px; line-height: 1.6; margin: 15px 0; color: #eee;">${step.message}</p>
            <button id="tutorial-next" style="padding: 10px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 50px; cursor: pointer; margin-top: 15px;">知道了</button>
        `;

        document.body.appendChild(tutorialDiv);

        // 绑定下一步按钮事件
        document.getElementById('tutorial-next').addEventListener('click', () => {
            this.hideTutorial();
        });

        this.tutorialVisible = true;
    },

    hideTutorial() {
        const existingTutorial = document.getElementById('tutorial-popup');
        if (existingTutorial) {
            document.body.removeChild(existingTutorial);
        }
        this.tutorialVisible = false;
    }
};

function initGame() {
    // 播放游戏开始音效
    AudioManager.playSound('victory'); // 使用胜利音效表示新的冒险开始

    // 播放游戏主音乐
    AudioManager.playMusic('game_main');

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

        // 存档扩展数据 - 保留这些值不会重置
        highestLevel: gameState.highestLevel || 1,        // 历史最高关卡
        totalKills: gameState.totalKills || 0,            // 历史总击杀数
        totalGames: gameState.totalGames || 0,            // 总游戏次数
        winCount: gameState.winCount || 0,                // 获胜次数
        highScores: gameState.highScores || [],           // 高分榜
        weaponStats: gameState.weaponStats || {},         // 武器使用统计
        totalPlayTime: gameState.totalPlayTime || 0,      // 总游戏时间
        gamesPlayed: gameState.gamesPlayed || 0,          // 已玩游戏数
        totalDamageDealt: gameState.totalDamageDealt || 0,// 总造成伤害
        totalDamageTaken: gameState.totalDamageTaken || 0,// 总受到伤害
        skillsUsed: gameState.skillsUsed || { Q: 0, W: 0, E: 0, R: 0 }, // 技能使用统计
        // 当前游戏开始时间
        currentGameStartTime: Date.now(),

        // 新增教程相关状态
        weaponsAcquired: 0, // 记录获取的武器数量
        potionsUsed: 0,     // 记录使用的药水数量
        skillsUsedCount: 0,      // 记录使用的技能数量
        difficulty: gameState.difficulty || 'normal', // 难度设置
        enemySpawnRate: 1.0, // 敌人生成速率
        enemyDamageMultiplier: 1.0, // 敌人伤害倍率
        tutorialStep: 0,    // 教程步骤
        lastTutorialCheck: 0 // 上次检查教程的时间
    };

    // 如果不是全新的游戏，尝试从localStorage恢复游戏状态
    if (!shouldResetGame) {
        SaveSystem.load();
    } else {
        // 如果是全新游戏，重置成就系统临时状态
        AchievementSystem.resetTempStats();
        // 通知成就系统新游戏开始
        AchievementSystem.onGameStart();

        // 初始化教程
        TutorialSystem.init();
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

    // 如果是新游戏，显示第一步教程
    if (shouldResetGame) {
        setTimeout(() => {
            TutorialSystem.showTutorial(0);
            TutorialSystem.currentStep = 1;
        }, 1000);
    }

    gameLoop();
}

function gameOver() {
    gameState.isPlaying = false;
    gameState.isGameOver = true;

    // 更新游戏统计数据
    gameState.totalGames = (gameState.totalGames || 0) + 1;
    gameState.totalKills = (gameState.totalKills || 0) + gameState.kills;

    // 更新最高关卡
    if (gameState.level > (gameState.highestLevel || 0)) {
        gameState.highestLevel = gameState.level;
    }

    // 计算当前游戏的持续时间并更新总游戏时间
    if (gameState.currentGameStartTime) {
        const currentGameDuration = Date.now() - gameState.currentGameStartTime;
        gameState.totalPlayTime = (gameState.totalPlayTime || 0) + currentGameDuration;
    }

    // 停止背景音乐，播放游戏结束音效
    AudioManager.stopMusic();
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

    // 保存游戏进度
    SaveSystem.save();
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

    // 更新游戏统计数据
    gameState.totalGames = (gameState.totalGames || 0) + 1;
    gameState.winCount = (gameState.winCount || 0) + 1;
    gameState.totalKills = (gameState.totalKills || 0) + gameState.kills;

    // 更新最高关卡
    if (gameState.level > (gameState.highestLevel || 0)) {
        gameState.highestLevel = gameState.level;
    }

    // 计算当前游戏的持续时间并更新总游戏时间
    if (gameState.currentGameStartTime) {
        const currentGameDuration = Date.now() - gameState.currentGameStartTime;
        gameState.totalPlayTime = (gameState.totalPlayTime || 0) + currentGameDuration;
    }

    // 更新高分榜
    if (typeof saveManager !== 'undefined') {
        saveManager.addHighScore(gameState.player.score, gameState.level);
    }

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

    // 通知成就系统游戏通关
    AchievementSystem.onGameWin();

    // 检查成就
    AchievementSystem.checkAchievements();

    // 保存游戏进度
    SaveSystem.save();
}

// 按钮事件
document.getElementById('start-btn').addEventListener('click', () => {
    // 播放菜单选择音效
    AudioManager.playSound('menu_select');
    // 停止主菜单音乐，开始游戏音乐
    AudioManager.stopMusic();
    startGame();
});
document.getElementById('restart-btn').addEventListener('click', () => {
    // 播放菜单选择音效
    AudioManager.playSound('menu_select');
    startGame();
});

// 添加暂停菜单相关事件监听器
let gamePaused = false;

// ESC键暂停游戏
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (gameState.isPlaying && !gameState.isGameOver) {
            if (gamePaused) {
                resumeGame();
            } else {
                pauseGame();
            }
        }
    }
});

// 暂停游戏
function pauseGame() {
    if (gameState.isPlaying && !gameState.isGameOver && !gamePaused) {
        gamePaused = true;
        gameState.isPlaying = false;
        document.getElementById('pause-menu').classList.remove('hidden');

        // 暂停期间降低背景音乐音量
        if (AudioManager.currentMusic) {
            AudioManager.musicBeforePause = AudioManager.currentMusic.volume;
            AudioManager.currentMusic.volume = AudioManager.musicVolume * 0.3; // 降低到30%
        }

        // 暂停期间阻止游戏循环
        cancelAnimationFrame(gameLoopId);
    }
}

// 恢复游戏
function resumeGame() {
    if (gamePaused) {
        gamePaused = false;
        gameState.isPlaying = true;
        document.getElementById('pause-menu').classList.add('hidden');

        // 恢复背景音乐音量
        if (AudioManager.currentMusic) {
            AudioManager.currentMusic.volume = AudioManager.musicBeforePause || AudioManager.musicVolume;
        }

        // 重新开始游戏循环
        gameLoopId = requestAnimationFrame(gameLoop);
    }
}

// 暂停菜单按钮事件
document.getElementById('continue-btn').addEventListener('click', () => {
    // 播放菜单选择音效
    AudioManager.playSound('menu_select');
    resumeGame();
});
document.getElementById('settings-btn').addEventListener('click', () => {
    // 播放菜单选择音效
    AudioManager.playSound('menu_select');
    document.getElementById('pause-menu').classList.add('hidden');
    document.getElementById('settings-menu').classList.remove('hidden');
});

document.getElementById('main-menu-btn').addEventListener('click', () => {
    // 播放菜单选择音效
    AudioManager.playSound('menu_select');
    // 返回主菜单
    gameState.isPlaying = false;
    gameState.isGameOver = false;
    gamePaused = false;
    document.getElementById('pause-menu').classList.add('hidden');
    document.getElementById('start-screen').classList.remove('hidden');

    // 停止游戏循环
    if (gameLoopId) {
        cancelAnimationFrame(gameLoopId);
    }

    // 播放主菜单背景音乐
    AudioManager.playMusic('main_menu');
});

// 设置菜单按钮事件
document.getElementById('back-to-pause').addEventListener('click', () => {
    // 播放菜单选择音效
    AudioManager.playSound('menu_select');
    document.getElementById('settings-menu').classList.add('hidden');
    document.getElementById('pause-menu').classList.remove('hidden');
});

// 设置菜单控件事件
document.getElementById('sound-enabled').addEventListener('change', (e) => {
    AudioManager.setSoundEnabled(e.target.checked);
});

document.getElementById('music-enabled').addEventListener('change', (e) => {
    AudioManager.setMusicEnabled(e.target.checked);
});

document.getElementById('difficulty-select').addEventListener('change', (e) => {
    gameState.difficulty = e.target.value;
    // 根据难度调整游戏参数
    switch(e.target.value) {
        case 'easy':
            gameState.enemySpawnRate = 1.5;  // 敌人生成速度较慢
            gameState.enemyDamageMultiplier = 0.7;  // 敌人伤害较低
            break;
        case 'normal':
            gameState.enemySpawnRate = 1.0;
            gameState.enemyDamageMultiplier = 1.0;
            break;
        case 'hard':
            gameState.enemySpawnRate = 0.7;  // 敌人生成速度较快
            gameState.enemyDamageMultiplier = 1.3;  // 敌人伤害较高
            break;
    }
});

// 成就按钮事件
if (document.getElementById('achievements-btn')) {
    document.getElementById('achievements-btn').addEventListener('click', () => {
        // 创建一个弹窗显示成就
        const achievementsContainer = document.createElement('div');
        achievementsContainer.id = 'achievements-popup';
        achievementsContainer.style.position = 'absolute';
        achievementsContainer.style.top = '50%';
        achievementsContainer.style.left = '50%';
        achievementsContainer.style.transform = 'translate(-50%, -50%)';
        achievementsContainer.style.background = 'rgba(10, 10, 30, 0.95)';
        achievementsContainer.style.padding = '30px';
        achievementsContainer.style.borderRadius = '20px';
        achievementsContainer.style.border = '3px solid #4a4a6a';
        achievementsContainer.style.zIndex = '300';
        achievementsContainer.style.backdropFilter = 'blur(10px)';
        achievementsContainer.style.boxShadow = '0 0 40px rgba(100, 100, 255, 0.4)';
        achievementsContainer.style.maxHeight = '80vh';
        achievementsContainer.style.overflowY = 'auto';
        achievementsContainer.style.textAlign = 'left';

        const unlocked = AchievementSystem.getUnlockedCount();
        const total = AchievementSystem.getTotalCount();

        let achievementsHtml = `
            <h2 style="text-align: center; margin-bottom: 20px; color: #ffd700;">🏆 游戏成就 (${unlocked}/${total})</h2>
            <div style="max-height: 400px; overflow-y: auto;">
        `;

        for (const achievement of AchievementSystem.achievementList) {
            const isUnlocked = AchievementSystem.achievements[achievement.id];
            const status = isUnlocked ? '✅ 已解锁' : '🔒 未解锁';
            const style = isUnlocked ? 'color: #4ade80;' : 'color: #94a3b8; opacity: 0.7;';

            achievementsHtml += `
                <div style="margin: 10px 0; padding: 10px; background: rgba(0,0,0,0.3); border-radius: 8px; border-left: 3px solid ${isUnlocked ? '#4ade80' : '#94a3b8'}; ${style}">
                    <strong>${achievement.name}</strong><br>
                    <small>${achievement.description}</small><br>
                    <em style="font-size: 0.9em;">[${status}]</em>
                </div>
            `;
        }

        achievementsHtml += '</div>';
        achievementsHtml += '<button id="close-achievements" style="margin-top: 20px; padding: 10px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 50px; cursor: pointer;">关闭</button>';

        achievementsContainer.innerHTML = achievementsHtml;
        document.body.appendChild(achievementsContainer);

        document.getElementById('close-achievements').addEventListener('click', () => {
            document.body.removeChild(achievementsContainer);
        });
    });
}

// 初始绘制
ctx.fillStyle = '#1a1a2e';
ctx.fillRect(0, 0, canvas.width, canvas.height);

// ==================== 游戏控制器支持 ====================

// 游戏控制器相关变量
let gamepads = {};
let controllerConnected = false;
let controllerVibrationSupported = false;

// 连接控制器
window.addEventListener('gamepadconnected', (e) => {
    console.log('游戏控制器已连接:', e.gamepad);
    gamepads[e.gamepad.index] = e.gamepad;
    controllerConnected = true;

    // 尝试启用震动支持
    if ('vibrationActuator' in e.gamepad && e.gamepad.vibrationActuator) {
        controllerVibrationSupported = true;
        console.log('震动支持已启用');
    }

    showCombatLog('🎮 游戏控制器已连接', 'weapon-get');
});

// 断开控制器
window.addEventListener('gamepaddisconnected', (e) => {
    console.log('游戏控制器已断开:', e.gamepad);
    delete gamepads[e.gamepad.index];
    controllerConnected = Object.keys(gamepads).length > 0;

    showCombatLog('🎮 游戏控制器已断开', 'weapon-lose');
});

// 获取活动的游戏手柄
function getActiveGamepad() {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    for (let i = 0; i < gamepads.length; i++) {
        if (gamepads[i]) {
            return gamepads[i];
        }
    }
    return null;
}

// 游戏控制器更新循环
function updateGamepadInput() {
    if (!controllerConnected) return;

    const gamepad = getActiveGamepad();
    if (!gamepad) return;

    // 获取左摇杆的值 (用于移动)
    const leftStickX = gamepad.axes[0]; // 左右
    const leftStickY = gamepad.axes[1]; // 上下

    // 获取右摇杆的值 (用于瞄准)
    const rightStickX = gamepad.axes[2]; // 左右
    const rightStickY = gamepad.axes[3]; // 上下

    // 设置移动阈值（避免轻微漂移）
    const moveThreshold = 0.1;
    if (Math.abs(leftStickX) > moveThreshold || Math.abs(leftStickY) > moveThreshold) {
        // 使用摇杆控制玩家移动
        player.targetX = gameState.player.x + leftStickX * 5;
        player.targetY = gameState.player.y + leftStickY * 5;

        // 确保玩家不会移出边界
        player.targetX = Math.max(player.size, Math.min(canvas.width - player.size, player.targetX));
        player.targetY = Math.max(player.size, Math.min(canvas.height - player.size, player.targetY));
    }

    // 如果右摇杆被使用，则用作瞄准方向
    const aimThreshold = 0.1;
    if (Math.abs(rightStickX) > aimThreshold || Math.abs(rightStickY) > aimThreshold) {
        // 使用右摇杆方向代替鼠标位置
        const angle = Math.atan2(rightStickY, rightStickX);
        mouseX = gameState.player.x + Math.cos(angle) * 100; // 假设固定距离
        mouseY = gameState.player.y + Math.sin(angle) * 100;
    }

    // 检查按钮状态 (A, B, X, Y 对应 0-3号按钮)
    if (gamepad.buttons[0] && gamepad.buttons[0].pressed) { // A键 - 技能Q
        useSkill('Q');
    }
    if (gamepad.buttons[1] && gamepad.buttons[1].pressed) { // B键 - 技能W
        useSkill('W');
    }
    if (gamepad.buttons[2] && gamepad.buttons[2].pressed) { // X键 - 技能E
        useSkill('E');
    }
    if (gamepad.buttons[3] && gamepad.buttons[3].pressed) { // Y键 - 技能R
        useSkill('R');
    }

    // 检查肩键 (LB, RB 对应 4, 5号按钮)
    if (gamepad.buttons[4] && gamepad.buttons[4].pressed) { // LB键 - 可以用作其他功能
        // 暂时留空，可扩展功能
    }
    if (gamepad.buttons[5] && gamepad.buttons[5].pressed) { // RB键 - 可以用作其他功能
        // 暂时留空，可扩展功能
    }

    // 检查扳机键 (LT, RT 对应 6, 7号按钮)
    if (gamepad.buttons[6] && gamepad.buttons[6].pressed) { // LT键
        // 可以用来切换某种模式或功能
    }
    if (gamepad.buttons[7] && gamepad.buttons[7].pressed) { // RT键
        // 可以用来快速使用某个物品
    }

    // 开始/选择按钮 (8, 9号按钮)
    if (gamepad.buttons[8] && gamepad.buttons[8].pressed) { // Back/View键
        // 可以映射到暂停菜单
        if (gameState.isPlaying && !document.getElementById('pause-menu').classList.contains('hidden')) {
            document.getElementById('pause-menu').classList.remove('hidden');
        }
    }
    if (gamepad.buttons[9] && gamepad.buttons[9].pressed) { // Start/Menu键
        // 可以映射到暂停菜单
        togglePauseMenu();
    }
}

// 在游戏循环中调用控制器更新
const originalGameLoop = gameLoop;
gameLoop = function() {
    if (!gameState.isPlaying) return;

    // 更新控制器输入
    updateGamepadInput();

    // 调用原始游戏循环
    originalGameLoop();
};

// 关卡里程碑事件处理器
function handleMilestoneEvents() {
    // 检查特定关卡的里程碑事件
    switch(gameState.level) {
        case 5:
            showCombatLog('🎉 到达第5关！解锁了新的敌人类型：弓箭手！', 'weapon-get');
            break;
        case 10:
            showCombatLog('🎊 到达第10关！你正在成为一名真正的战士！', 'weapon-get');
            // 在第10关开始增加精英敌人比例
            break;
        case 15:
            showCombatLog('🌟 到达第15关！新的敌人类型现已出现：法师和刺客！', 'weapon-get');
            break;
        case 20:
            showCombatLog('🏆 到达第20关！你是个传奇英雄！', 'weapon-get');
            // 从第20关开始增加Boss出现频率
            break;
        case 25:
            showCombatLog('👑 到达第25关！神话级别的挑战者！', 'weapon-get');
            showCombatLog('🐉 新敌人类型解锁：龙类、石像鬼！', 'weapon-get');
            break;
        case 30:
            showCombatLog('🌌 到达第30关！进入传奇领域！', 'weapon-get');
            showCombatLog('👻 新敌人类型解锁：幻影、巫妖王！', 'weapon-get');
            break;
        case 35:
            showCombatLog('💫 到达第35关！半神境界！', 'weapon-get');
            showCombatLog('🦄 新敌人类型解锁：独角兽、蛇怪、狮鹫！', 'weapon-get');
            break;
        case 40:
            showCombatLog('🌠 到达第40关！宇宙意志的挑战者！', 'weapon-get');
            showCombatLog('🦅 新敌人类型解锁：飞马、奇美拉、女妖！', 'weapon-get');
            break;
        case 45:
            showCombatLog('⭐ 到达第45关！接近神之境界！', 'weapon-get');
            showCombatLog('🐉 新敌人类型解锁：龙王！', 'weapon-get');
            break;
        case 50:
            showCombatLog('👑 到达第50关！你是真正的游戏冠军！', 'victory');
            // 播放胜利音效
            AudioManager.playSound('victory');
            break;
        default:
            // 检查每5关的特殊事件
            if (gameState.level > 50 && gameState.level % 10 === 0) {
                showCombatLog(`🚀 第${gameState.level}关！你在创造历史！`, 'weapon-get');
            }
            break;
    }

    // 每10关增加一点玩家生命值（从第10关开始）
    if (gameState.level > 1 && gameState.level % 10 === 0) {
        gameState.player.maxHp += 10;
        gameState.player.hp += 10; // 同时恢复对应的生命值
        gameState.player.hp = Math.min(gameState.player.hp, gameState.player.maxHp);

        showCombatLog(`💪 生命力提升！最大生命值+10`, 'heal');
    }

    // 每20关给玩家一个特殊奖励
    if (gameState.level > 1 && gameState.level % 20 === 0) {
        // 随机给予一个药水作为奖励
        const randomPotion = POTIONS[Math.floor(Math.random() * POTIONS.length)];
        gameState.potions.push(randomPotion);

        showCombatLog(`🎁 里程碑奖励！获得药水：${randomPotion.name}`, 'potion_pickup');
        AudioManager.playSound('collect');
    }
}

// ==================== Steam版游戏增强系统 ====================
//
// 该系统包含：
// 1. 更丰富的敌人AI行为
// 2. 更多特殊事件
// 3. 更好的视觉特效
// 4. 更深入的游戏机制

// 扩展敌人AI行为
const ENHANCED_AI_BEHAVIORS = {
    // 机械系AI
    mechanical: {
        name: '机械智能',
        description: '精确计算的攻击和移动',
        movementPattern: 'precise',
        attackStrategy: 'calculated',
        weakness: 'electricity',
        resistance: 'poison'
    },
    // 神话系AI
    divine: {
        name: '神圣智慧',
        description: '使用神圣力量进行战斗',
        movementPattern: 'graceful',
        attackStrategy: 'blessed',
        weakness: 'darkness',
        resistance: 'light'
    },
    // 混合型AI
    hybrid: {
        name: '混合智能',
        description: '结合生物与机械特征',
        movementPattern: 'adaptive',
        attackStrategy: 'combined',
        weakness: 'disruption',
        resistance: 'adaptation'
    },
    // 飞行AI
    flying: {
        name: '飞行优势',
        description: '从空中发起攻击',
        movementPattern: 'aerial',
        attackStrategy: 'aerial_strike',
        weakness: 'ground_attacks',
        resistance: 'melee_defense'
    },
    // 凝视攻击AI
    gaze: {
        name: '凝视攻击',
        description: '使用凝视造成效果',
        movementPattern: 'stationary',
        attackStrategy: 'gaze_attack',
        weakness: 'blindness',
        resistance: 'eye_protection'
    },
    // 触手AI
    tentacles: {
        name: '多触手攻击',
        description: '使用多触手进行全方位攻击',
        movementPattern: 'flexible',
        attackStrategy: 'multi_tentacle',
        weakness: 'cutting',
        resistance: 'distributed_damage'
    }
};

// 新增特殊关卡事件
const SPECIAL_EVENTS = [
    {
        id: 'elemental_storm',
        name: '元素风暴',
        trigger: (level) => level % 10 === 0 && level > 5,
        effect: function() {
            gameState.currentElementalStorm = {
                type: ['fire', 'ice', 'lightning', 'earth'][Math.floor(Math.random() * 4)],
                duration: 30000, // 30秒
                multiplier: 1.5
            };
            showCombatLog('🌀 元素风暴即将来临！', 'special-event');
        },
        description: '元素风暴增强特定元素伤害'
    },
    {
        id: 'weapon_blessing',
        name: '武器祝福',
        trigger: (level) => level % 15 === 0 && level > 10,
        effect: function() {
            gameState.currentWeaponBlessing = {
                duration: 60000, // 60秒
                damageBoost: 1.3,
                specialEffect: true
            };
            showCombatLog('✨ 武器祝福！攻击力提升30%', 'special-event');
        },
        description: '临时提升武器威力'
    },
    {
        id: 'time_warp',
        name: '时间扭曲',
        trigger: (level) => level % 20 === 0 && level > 15,
        effect: function() {
            gameState.currentTimeWarp = {
                duration: 45000, // 45秒
                slowEnemies: true,
                boostPlayer: true
            };
            showCombatLog('⏰ 时间扭曲！敌人变慢，你变快！', 'special-event');
        },
        description: '改变时间流速'
    },
    {
        id: 'treasure_horde',
        name: '宝藏洪流',
        trigger: (level) => level % 25 === 0 && level > 20,
        effect: function() {
            // 在本关生成额外的宝箱和稀有掉落
            gameState.extraTreasureSpawn = true;
            showCombatLog('💰 宝藏洪流！掉落翻倍！', 'special-event');
        },
        description: '增加稀有掉落率'
    }
];

// 新增玩家能力
const PLAYER_ABILITIES = {
    // 终极技能
    ULTIMATE_BARRIER: {
        name: '终极屏障',
        description: '短时间内无敌并反弹伤害',
        cooldown: 120000, // 2分钟
        duration: 5000, // 5秒
        effect: function() {
            gameState.player.barrierActive = true;
            gameState.player.barrierEndTime = Date.now() + 5000;
            showCombatLog('🛡️ 终极屏障激活！', 'ability-used');
        }
    },
    // 生命汲取
    LIFE_DRAIN: {
        name: '生命汲取',
        description: '吸收敌人生命力',
        cooldown: 90000, // 1.5分钟
        duration: 10000, // 10秒
        effect: function() {
            gameState.player.lifeDrainActive = true;
            gameState.player.lifeDrainEndTime = Date.now() + 10000;
            showCombatLog('💉 生命汲取激活！', 'ability-used');
        }
    },
    // 元素掌控
    ELEMENT_MASTERY: {
        name: '元素掌控',
        description: '元素伤害翻倍，持续一定时间',
        cooldown: 150000, // 2.5分钟
        duration: 15000, // 15秒
        effect: function() {
            gameState.player.elementMasteryActive = true;
            gameState.player.elementMasteryEndTime = Date.now() + 15000;
            showCombatLog('🔥❄️⚡ 元素掌控激活！', 'ability-used');
        }
    }
};

// 扩展粒子系统效果
const PARTICLE_EFFECTS = {
    TIME_REVERSE: {
        name: '时间逆转',
        color: '#7B68EE',
        size: 3,
        life: 800,
        speed: 0.5,
        variation: 0.3,
        effect: 'reverse_motion'
    },
    CHAIN_LIGHTNING: {
        name: '连锁闪电',
        color: '#B0C4DE',
        size: 2,
        life: 400,
        speed: 3,
        variation: 0.5,
        effect: 'electrical_arc'
    },
    TIDAL_WAVE: {
        name: '潮汐冲击',
        color: '#20B2AA',
        size: 4,
        life: 1000,
        speed: 1.5,
        variation: 0.2,
        effect: 'wave_propagation'
    },
    FREEZE: {
        name: '冰冻',
        color: '#B0E0E6',
        size: 2,
        life: 1200,
        speed: 0.2,
        variation: 0.1,
        effect: 'freezing_crystal'
    },
    BURN: {
        name: '燃烧',
        color: '#FF4500',
        size: 3,
        life: 600,
        speed: 1,
        variation: 0.4,
        effect: 'flame_spread'
    },
    POISON_CLOUD: {
        name: '毒云',
        color: '#32CD32',
        size: 2.5,
        life: 1500,
        speed: 0.3,
        variation: 0.2,
        effect: 'poison_spread'
    }
};

// 增强武器效果处理
function enhanceWeaponEffects(weapon, target) {
    if (!weapon.effect) return false;

    switch(weapon.effect) {
        case 'time_reverse':
            if (Math.random() < 0.15) { // 15% 概率触发
                target.x -= target.dx * 20; // 回退2秒的位置
                target.y -= target.dy * 20;
                createParticleEffect(target.x, target.y, PARTICLE_EFFECTS.TIME_REVERSE);
                showCombatLog(`⏱️ ${weapon.name} 触发时间逆转！`, 'weapon-effect');
                return true;
            }
            break;

        case 'chain_lightning':
            if (Math.random() < 0.2) { // 20% 概率触发
                // 找到附近的敌人并造成连锁伤害
                const nearbyEnemies = gameState.enemies.filter(e =>
                    getDistance(target, e) < 80 && e !== target
                );

                for (let i = 0; i < Math.min(3, nearbyEnemies.length); i++) {
                    const e = nearbyEnemies[i];
                    e.hp -= weapon.damage * 0.5; // 50% 伤害

                    // 创建闪电粒子效果
                    createLightningEffect(target.x, target.y, e.x, e.y);
                    createParticleEffect(e.x, e.y, PARTICLE_EFFECTS.CHAIN_LIGHTNING);

                    if (e.hp <= 0) {
                        handleEnemyDeath(e);
                    }
                }
                showCombatLog(`⚡ ${weapon.name} 触发连锁闪电！`, 'weapon-effect');
                return true;
            }
            break;

        case 'tidal_wave':
            // 在目标周围产生冲击波
            createWaveEffect(target.x, target.y, 100);
            gameState.enemies.forEach(enemy => {
                if (getDistance(target, enemy) < 100) {
                    enemy.x += (enemy.x - target.x) * 0.3;
                    enemy.y += (enemy.y - target.y) * 0.3;
                    enemy.hp -= weapon.damage * 0.3;
                    createParticleEffect(enemy.x, enemy.y, PARTICLE_EFFECTS.TIDAL_WAVE);

                    if (enemy.hp <= 0) {
                        handleEnemyDeath(enemy);
                    }
                }
            });
            showCombatLog(`🌊 ${weapon.name} 产生潮汐冲击！`, 'weapon-effect');
            return true;

        case 'freeze':
            if (Math.random() < 0.18) { // 18% 概率冻结
                target.frozen = Date.now() + 3000; // 冻结3秒
                createParticleEffect(target.x, target.y, PARTICLE_EFFECTS.FREEZE);
                showCombatLog(`❄️ ${weapon.name} 冻结了敌人！`, 'weapon-effect');
                return true;
            }
            break;

        case 'burn':
            if (Math.random() < 0.25) { // 25% 概率点燃
                target.burning = Date.now() + 5000; // 燃烧5秒
                target.burnDamage = weapon.damage * 0.1; // 每秒造成10%武器伤害
                createParticleEffect(target.x, target.y, PARTICLE_EFFECTS.BURN);
                showCombatLog(`🔥 ${weapon.name} 点燃了敌人！`, 'weapon-effect');
                return true;
            }
            break;

        case 'poison':
            if (Math.random() < 0.22) { // 22% 概率中毒
                target.poisoned = Date.now() + 6000; // 中毒6秒
                target.poisonDamage = weapon.damage * 0.08; // 每秒造成8%武器伤害
                createPoisonCloud(target.x, target.y);
                showCombatLog(`☠️ ${weapon.name} 毒害了敌人！`, 'weapon-effect');
                return true;
            }
            break;
    }

    return false;
}

// 创建闪电效果
function createLightningEffect(x1, y1, x2, y2) {
    // 在两点之间创建闪电效果
    const segments = 5;
    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const x = x1 + (x2 - x1) * t;
        const y = y1 + (y2 - y1) * t;

        // 添加一些随机偏移来模拟闪电的形状
        const offsetX = (Math.random() - 0.5) * 15;
        const offsetY = (Math.random() - 0.5) * 15;

        createParticleEffect(x + offsetX, y + offsetY, PARTICLE_EFFECTS.CHAIN_LIGHTNING);
    }
}

// 创建波浪效果
function createWaveEffect(centerX, centerY, radius) {
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        createParticleEffect(x, y, PARTICLE_EFFECTS.TIDAL_WAVE);
    }
}

// 创建毒云
function createPoisonCloud(x, y) {
    for (let i = 0; i < 8; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 30;
        const px = x + Math.cos(angle) * distance;
        const py = y + Math.sin(angle) * distance;
        createParticleEffect(px, py, PARTICLE_EFFECTS.POISON_CLOUD);
    }
}

// 处理燃烧效果
function processBurnEffects() {
    gameState.enemies.forEach(enemy => {
        if (enemy.burning && Date.now() < enemy.burning) {
            enemy.hp -= enemy.burnDamage;
            if (enemy.hp <= 0) {
                handleEnemyDeath(enemy);
            }
        } else if (enemy.burning && Date.now() >= enemy.burning) {
            enemy.burning = null;
        }
    });
}

// 处理中毒效果
function processPoisonEffects() {
    gameState.enemies.forEach(enemy => {
        if (enemy.poisoned && Date.now() < enemy.poisoned) {
            enemy.hp -= enemy.poisonDamage;
            if (enemy.hp <= 0) {
                handleEnemyDeath(enemy);
            }
        } else if (enemy.poisoned && Date.now() >= enemy.poisoned) {
            enemy.poisoned = null;
        }
    });
}

// 处理冻结效果
function processFreezeEffects() {
    gameState.enemies.forEach(enemy => {
        if (enemy.frozen && Date.now() < enemy.frozen) {
            // 冻结期间敌人不能移动或攻击
            enemy.dx = 0;
            enemy.dy = 0;
        } else if (enemy.frozen && Date.now() >= enemy.frozen) {
            enemy.frozen = null;
        }
    });
}

// 增强的敌人生成器，考虑特殊事件
function enhancedSpawnEnemy() {
    // 原始敌人生成逻辑
    const baseSpawnInterval = 2000; // 基础生成间隔

    // 如果有时间扭曲事件，调整生成速度
    if (gameState.currentTimeWarp && Date.now() < gameState.currentTimeWarp.endTime) {
        // 敌人生速减慢
        setTimeout(enhancedSpawnEnemy, baseSpawnInterval * 1.5);
    } else {
        // 标准生成间隔
        setTimeout(enhancedSpawnEnemy, baseSpawnInterval);
    }

    // 根据关卡和特殊事件决定生成的敌人类型
    let enemyType;
    const level = gameState.level;
    const rand = Math.random();

    // 根据关卡和事件调整敌人类型概率
    if (gameState.currentElementalStorm) {
        // 元素风暴期间更可能生成对应元素的敌人
        if (gameState.currentElementalStorm.type === 'fire' && rand < 0.3) {
            enemyType = 'DRAGON'; // 或其他火元素敌人
        } else if (gameState.currentElementalStorm.type === 'ice' && rand < 0.3) {
            enemyType = 'GOLEM'; // 或其他冰元素敌人
        }
    }

    // 创建敌人
    const newEnemy = new Enemy(level, enemyType);
    gameState.enemies.push(newEnemy);

    // 检查是否触发特殊事件
    SPECIAL_EVENTS.forEach(event => {
        if (event.trigger(level) && Math.random() < 0.3) { // 30% 概率触发
            event.effect();
        }
    });
}

// 扩展游戏状态更新函数
function extendedGameUpdate() {
    // 处理各种状态效果
    processBurnEffects();
    processPoisonEffects();
    processFreezeEffects();

    // 检查特殊事件持续时间
    if (gameState.currentElementalStorm &&
        Date.now() > gameState.currentElementalStorm.startTime + gameState.currentElementalStorm.duration) {
        delete gameState.currentElementalStorm;
        showCombatLog('🌀 元素风暴结束', 'special-event-end');
    }

    if (gameState.currentWeaponBlessing &&
        Date.now() > gameState.currentWeaponBlessing.startTime + gameState.currentWeaponBlessing.duration) {
        delete gameState.currentWeaponBlessing;
        showCombatLog('✨ 武器祝福结束', 'special-event-end');
    }

    if (gameState.currentTimeWarp &&
        Date.now() > gameState.currentTimeWarp.startTime + gameState.currentTimeWarp.duration) {
        delete gameState.currentTimeWarp;
        showCombatLog('⏰ 时间扭曲结束', 'special-event-end');
    }

    // 处理玩家能力持续时间
    if (gameState.player.barrierActive &&
        Date.now() > gameState.player.barrierEndTime) {
        gameState.player.barrierActive = false;
        showCombatLog('🛡️ 终极屏障失效', 'ability-end');
    }

    if (gameState.player.lifeDrainActive &&
        Date.now() > gameState.player.lifeDrainEndTime) {
        gameState.player.lifeDrainActive = false;
        showCombatLog('💉 生命汲取结束', 'ability-end');
    }

    if (gameState.player.elementMasteryActive &&
        Date.now() > gameState.player.elementMasteryEndTime) {
        gameState.player.elementMasteryActive = false;
        showCombatLog('🔥❄️⚡ 元素掌控结束', 'ability-end');
    }
}

console.log('Steam版游戏增强系统已加载');
console.log('✓ 新增特殊敌人AI行为');
console.log('✓ 新增特殊关卡事件');
console.log('✓ 新增玩家能力系统');
console.log('✓ 扩展武器特效系统');

// 导出增强函数供游戏系统调用
window.enhancedSpawnEnemy = enhancedSpawnEnemy;
window.extendedGameUpdate = extendedGameUpdate;
window.enhanceWeaponEffects = enhanceWeaponEffects;

// 新增的史诗武器
const NEW_EPIC_WEAPONS = [
    { name: '时光倒流剑', damage: 53, rarity: 'epic', color: '#7B68EE', effect: 'time_reverse', desc: '有时能使敌人倒退一秒' },
    { name: '虚无之刃', damage: 54, rarity: 'epic', color: '#4B0082', effect: 'phase_through', desc: '偶尔穿透敌人' },
    { name: '雷神之锤', damage: 55, rarity: 'epic', color: '#B0C4DE', effect: 'chain_lightning', desc: '攻击可能引发连锁闪电' },
    { name: '海神三叉戟', damage: 56, rarity: 'epic', color: '#20B2AA', effect: 'tidal_wave', desc: '攻击产生冲击波' },
    { name: '风暴使者', damage: 57, rarity: 'epic', color: '#87CEEB', effect: 'wind_boost', desc: '增加移动速度' },
    { name: '冰霜女王', damage: 58, rarity: 'epic', color: '#B0E0E6', effect: 'freeze', desc: '有几率冻结敌人' },
    { name: '烈焰君主', damage: 59, rarity: 'epic', color: '#FF4500', effect: 'burn', desc: '造成持续燃烧伤害' },
    { name: '自然之怒', damage: 60, rarity: 'epic', color: '#228B22', effect: 'poison', desc: '造成毒素伤害' },
    { name: '暗物质匕首', damage: 61, rarity: 'epic', color: '#000000', effect: 'gravity_well', desc: '吸引附近敌人' },
    { name: '光明制裁者', damage: 62, rarity: 'epic', color: '#FFFFFF', effect: 'holy_blast', desc: '对黑暗敌人造成额外伤害' }
];

// 新增的传说武器
const NEW_LEGENDARY_WEAPONS = [
    { name: '创世之柱', damage: 75, rarity: 'legendary', color: '#FFD700', effect: 'creation_field', desc: '周围持续生成有益能量' },
    { name: '混沌之核', damage: 76, rarity: 'legendary', color: '#FF00FF', effect: 'chaos_orb', desc: '发射混乱球体' },
    { name: '审判日', damage: 77, rarity: 'legendary', color: '#FFFFFF', effect: 'judgment_day', desc: '周期性审判范围内敌人' },
    { name: '世界之树', damage: 78, rarity: 'legendary', color: '#32CD32', effect: 'life_bloom', desc: '持续恢复生命值' },
    { name: '虚无缥缈', damage: 79, rarity: 'legendary', color: '#F8F8FF', effect: 'intangibility', desc: '短暂无敌效果' },
    { name: '造物之主', damage: 80, rarity: 'legendary', color: '#FFD700', effect: 'creation', desc: '能创造临时盟友' },
    { name: '末日使者', damage: 81, rarity: 'legendary', color: '#8B0000', effect: 'apocalypse', desc: '蓄力后毁灭一片区域' },
    { name: '永恒大帝', damage: 82, rarity: 'legendary', color: '#4169E1', effect: 'eternity', desc: '大幅延长所有增益效果' },
    { name: '宇宙之心', damage: 83, rarity: 'legendary', color: '#0000FF', effect: 'cosmic_resonance', desc: '与宇宙共鸣，增强所有属性' },
    { name: '多元掌控', damage: 84, rarity: 'legendary', color: '#9370DB', effect: 'dimensional_control', desc: '能够操控维度力量' }
];

// 新增的神话武器
const NEW_MYTHIC_WEAPONS = [
    { name: '概念抹除者', damage: 1400, rarity: 'mythic', color: '#9400D3', effect: 'conceptual_erasure', desc: '从概念层面抹除敌人' },
    { name: '维度支配者', damage: 1350, rarity: 'mythic', color: '#4682B4', effect: 'dimensional_dominion', desc: '掌控多个维度的力量' },
    { name: '现实扭曲器', damage: 1200, rarity: 'mythic', color: '#FF69B4', effect: 'reality_distortion', desc: '扭曲现实规则' },
    { name: '宇宙起源', damage: 1500, rarity: 'mythic', color: '#000000', effect: 'origin_of_universe', desc: '重现宇宙诞生的力量' },
    { name: '存在意义', damage: 1300, rarity: 'mythic', color: '#0000FF', effect: 'meaning_of_existence', desc: '揭示存在的真谛并摧毁非存在' },
    { name: '绝对零度', damage: 1100, rarity: 'mythic', color: '#87CEEB', effect: 'absolute_zero', desc: '将一切降至绝对零度' },
    { name: '时间之主', damage: 1600, rarity: 'mythic', color: '#9370DB', effect: 'lord_of_time', desc: '掌控时间的流动' },
    { name: '空间之王', damage: 1550, rarity: 'mythic', color: '#4169E1', effect: 'king_of_space', desc: '掌控空间的形态' },
    { name: '虚无之神', damage: 1700, rarity: 'mythic', color: '#2F4F4F', effect: 'god_of_void', desc: '化身虚无，超越存在' },
    { name: '无限手套', damage: 2000, rarity: 'mythic', color: '#8A2BE2', effect: 'infinity_gauntlet', desc: '拥有无限的力量' }
];

// 合并新武器到主武器库
WEAPONS.push(...NEW_EPIC_WEAPONS, ...NEW_LEGENDARY_WEAPONS, ...NEW_MYTHIC_WEAPONS);

// 新增敌人类型
const NEW_ENEMY_TYPES = {
    // 机械系敌人
    ROBOT: { name: '机器人', speed: 0.9, hp: 2.0, damage: 1.8, size: 1.6, behavior: 'mechanical', element: 'metal' },
    CYBORG: { name: '半机械人', speed: 1.4, hp: 2.5, damage: 2.2, size: 1.8, behavior: 'hybrid', element: 'metal' },
    DRONE: { name: '无人机', speed: 2.0, hp: 0.8, damage: 1.2, size: 0.8, behavior: 'flying', element: 'metal' },
    TURRET: { name: '炮塔', speed: 0.0, hp: 1.5, damage: 2.5, size: 1.2, behavior: 'stationary', element: 'metal' },

    // 神话系敌人
    ANGEL: { name: '天使', speed: 1.2, hp: 3.0, damage: 2.8, size: 2.0, behavior: 'divine', element: 'holy' },
    DEMIGOD: { name: '半神', speed: 0.8, hp: 6.0, damage: 3.5, size: 2.5, behavior: 'divine', element: 'divine' },
    DRAGON_KING: { name: '龙王', speed: 0.7, hp: 7.0, damage: 4.0, size: 3.0, behavior: 'dragon', element: 'dragon' },

    // 稀有变种敌人
    ZOMBIE: { name: '僵尸', speed: 0.4, hp: 2.2, damage: 1.4, size: 1.3, behavior: 'undead', element: 'undead' },
    ORGE: { name: '食人魔', speed: 0.6, hp: 4.0, damage: 2.8, size: 2.2, behavior: 'brute', element: 'earth' },

    // 飞行敌人
    PHOENIX: { name: '凤凰', speed: 1.5, hp: 2.5, damage: 3.0, size: 1.8, behavior: 'flying', element: 'fire' },
    GRIFFIN: { name: '狮鹫', speed: 1.6, hp: 3.2, damage: 2.6, size: 2.0, behavior: 'flying', element: 'air' },
    BASILISK: { name: '蛇怪', speed: 0.9, hp: 4.5, damage: 3.2, size: 1.9, behavior: 'gaze', element: 'poison' },
    KRAKEN: { name: '北海巨妖', speed: 0.3, hp: 8.0, damage: 4.5, size: 3.5, behavior: 'tentacles', element: 'water' },

    // 稀有精英变种
    UNICORN: { name: '独角兽', speed: 1.8, hp: 3.5, damage: 2.5, size: 1.7, behavior: 'divine', element: 'holy' },
};

// 合并敌人类型
Object.assign(ENEMY_TYPES, NEW_ENEMY_TYPES);

// 新增药水类型
const NEW_POTIONS = [
    { name: '传送药水', effect: 'teleport', value: 1, color: '#9370DB', desc: '瞬间传送到随机位置' },
    { name: '时间减缓', effect: 'slow_time', duration: 5, color: '#4169E1', desc: '减缓周围敌人时间' },
    { name: '护盾超载', effect: 'shield_overflow', value: 50, color: '#00BFFF', desc: '获得超大护盾' },
    { name: '元素精通', effect: 'elemental_mastery', duration: 10, value: 2, color: '#32CD32', desc: '元素伤害翻倍' },
    { name: '暴击专精', effect: 'crit_mastery', duration: 8, value: 0.3, color: '#FF4500', desc: '暴击率大幅提升' },
    { name: '反伤护盾', effect: 'thorns_shield', duration: 6, value: 0.2, color: '#8A2BE2', desc: '反弹部分伤害给攻击者' },
    { name: '吸血光环', effect: 'vampire_aura', duration: 7, value: 0.15, color: '#8B0000', desc: '攻击时恢复部分生命' },
    { name: '元素转换', effect: 'element_convert', value: 1, color: '#FFD700', desc: '临时改变武器元素属性' },
    { name: '抗性提升', effect: 'resistance_up', duration: 10, value: 0.5, color: '#20B2AA', desc: '减少受到的伤害' },
    { name: '敏捷提升', effect: 'agility_boost', duration: 8, value: 1.5, color: '#98FB98', desc: '大幅提升移动速度和闪避' },
];

// 合并药水
POTIONS.push(...NEW_POTIONS);

// 新增遗物类型
const NEW_RELICS = [
    { name: '时空沙漏', effect: 'time_dilation', desc: '偶尔减缓游戏时间' },
    { name: '元素核心', effect: 'elemental_synergy', desc: '元素攻击产生额外效果' },
    { name: '生命之种', effect: 'life_regeneration', desc: '持续缓慢恢复生命值' },
    { name: '量子护盾', effect: 'quantum_shield', desc: '有机会完全抵消一次攻击' },
    { name: '命运之骰', effect: 'dice_fate', desc: '随机获得正面效果' },
    { name: '灵魂链接', effect: 'soul_link', desc: '将部分伤害转移到附近的敌人' },
    { name: '无限循环', effect: 'infinite_loop', desc: '有时技能效果会被复制' },
    { name: '虚无之盒', effect: 'void_box', desc: '可以储存一个物品供以后使用' },
];

// 合并遗物
RELICS.push(...NEW_RELICS);

// 新增成就
if (typeof enhancedAchievementSystem !== 'undefined') {
    const NEW_ACHIEVEMENTS = [
        { id: 'quantum_mechanic', name: '量子机械师', description: '使用量子护盾完全抵消10次攻击', condition: 'quantumShieldBlocks >= 10' },
        { id: 'time_lord', name: '时间领主', description: '使用时空沙漏减缓时间累计60秒', condition: 'timeDilatedSeconds >= 60' },
        { id: 'elemental_adept', name: '元素专家', description: '使用元素精通药水并击杀20个敌人', condition: 'elementalMasteryKills >= 20' },
        { id: 'mythic_treasure', name: '神话宝藏', description: '同时拥有3件神话武器', condition: 'mythicTreasure' },
        { id: 'boss_annihilator', name: 'Boss歼灭者', description: '连续击败5个Boss', condition: 'bossAnnihilation' },
        { id: 'combo_destroyer', name: '连击破坏者', description: '单次攻击击败5个以上敌人', condition: 'massDestruction' },
        { id: 'invincible_run', name: '无敌之旅', description: '达到第30关且从未生命值归零', condition: 'invincibleRun' },
        { id: 'elemental_mastery', name: '元素掌握', description: '使用所有元素类型的武器各击杀10个敌人', condition: 'elementalMasteryComplete' }
    ];
    enhancedAchievementSystem.achievementList.push(...NEW_ACHIEVEMENTS);
}
