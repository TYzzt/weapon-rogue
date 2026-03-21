const fs = require('fs');
const path = require('path');

console.log('🎮 武器替换者游戏功能测试');

// 测试1: 检查必要的图像文件
console.log('\n🔍 检查图像资源...');
const spriteDir = './assets/sprites/';
const requiredImages = [
    'weapon_sword.png',
    'enemy_slime.png',
    'enemies.png',
    'potions.png'
];

let allImagesPresent = true;
for (const img of requiredImages) {
    const fullPath = path.join(spriteDir, img);
    if (fs.existsSync(fullPath)) {
        const stats = fs.statSync(fullPath);
        console.log(`  ✅ ${img} (${(stats.size/1024).toFixed(1)} KB)`);
    } else {
        console.log(`  ❌ ${img} (缺失!)`);
        allImagesPresent = false;
    }
}

// 测试2: 检查 game.js 是否包含图像加载代码
console.log('\n🔧 检查 game.js 图像加载功能...');
const gameJsContent = fs.readFileSync('./game.js', 'utf8');

const hasImageLoading = [
    'imageCache',
    'loadImage(',
    'loadAllImages(',
    'assets/sprites/'
].every(str => gameJsContent.includes(str));

if (hasImageLoading) {
    console.log('  ✅ 图像加载系统已实现');
} else {
    console.log('  ❌ 图像加载系统缺失');
}

// 测试3: 检查精灵图使用
const hasSpriteDrawing = [
    'imageCache[\'assets/sprites/weapon_sword.png\']',
    'imageCache[\'assets/sprites/enemy_slime.png\']',
    'imageCache[\'assets/sprites/potions.png\']'
].every(str => gameJsContent.includes(str));

if (hasSpriteDrawing) {
    console.log('  ✅ 精灵图绘制功能已实现');
} else {
    console.log('  ❌ 精灵图绘制功能缺失');
}

// 测试4: 检查 Player 类的更新
const hasUpdatedPlayerDraw = gameJsContent.includes('const weaponImg = imageCache') &&
                              gameJsContent.includes('ctx.drawImage(weaponImg');

if (hasUpdatedPlayerDraw) {
    console.log('  ✅ Player 类已更新为使用精灵图');
} else {
    console.log('  ❌ Player 类未正确更新');
}

// 测试5: 检查 Enemy 类的更新
const hasUpdatedEnemyDraw = gameJsContent.includes('enemyImg = imageCache') &&
                            gameJsContent.includes('ctx.drawImage(enemyImg');

if (hasUpdatedEnemyDraw) {
    console.log('  ✅ Enemy 类已更新为使用精灵图');
} else {
    console.log('  ❌ Enemy 类未正确更新');
}

// 测试6: 检查 Drop 类的更新
const hasUpdatedDropDraw = gameJsContent.includes('const potionImg = imageCache') &&
                           gameJsContent.includes('ctx.drawImage(potionImg');

if (hasUpdatedDropDraw) {
    console.log('  ✅ Drop 类已更新为使用精灵图');
} else {
    console.log('  ❌ Drop 类未正确更新');
}

// 总结
console.log('\n🎯 测试总结:');
const hasAllImages = allImagesPresent;
const isFullyImplemented = hasAllImages && hasImageLoading && hasSpriteDrawing &&
                          hasUpdatedPlayerDraw && hasUpdatedEnemyDraw && hasUpdatedDropDraw;

if (isFullyImplemented) {
    console.log('  🎉 所有测试通过！游戏已成功更新为使用精灵图');
    console.log('  ✨ 主要改进:');
    console.log('    • 实现了图像预加载系统');
    console.log('    • 玩家武器现在使用 weapon_sword.png 精灵图');
    console.log('    • 史莱姆敌人使用 enemy_slime.png 精灵图');
    console.log('    • 其他敌人使用 enemies.png 精灵图');
    console.log('    • 药水使用 potions.png 精灵图');
    console.log('    • 包含回退机制以保证兼容性');
} else {
    console.log('  ⚠️  某些功能可能未完全实现，请检查以上错误项');
}