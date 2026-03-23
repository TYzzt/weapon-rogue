// 测试品质保底系统
console.log("开始测试品质保底系统...");

// 模拟游戏状态
if (typeof gameState === 'undefined') {
    window.gameState = {
        level: 1,
        player: { hp: 100, maxHp: 100, weapon: null },
        consecutiveCommonDrops: 0,
        consecutiveUncommonDrops: 0,
        qualityBoostLevel: 0,
        lastQualityBoostTime: 0
    };
}

// 等待所有脚本加载完成
setTimeout(function() {
    console.log("检查品质保底系统是否已加载...");

    if (typeof getQualityGuaranteedWeapon !== 'undefined') {
        console.log("✓ 品质保底系统已成功加载");

        // 测试武器生成
        console.log("\n测试武器生成:");

        for (let i = 0; i < 10; i++) {
            const weapon = getQualityGuaranteedWeapon(1);
            console.log(`武器 ${i+1}: ${weapon.name} (${weapon.rarity}), 伤害: ${weapon.damage}`);

            // 更新UI显示（如果可用）
            if (typeof updateUI !== 'undefined') {
                updateUI();
            }
        }

        console.log("\n测试连续获得普通武器的保底机制:");
        console.log("当前状态:", getQualityGuaranteeStatus());

        // 模拟连续获得普通武器
        for (let i = 0; i < 10; i++) {
            // 强制生成普通武器
            gameState.consecutiveCommonDrops = i;
            console.log(`普通武器连击: ${i}, 保底提升: ${Math.min(i * 3, 30)}%`);

            const weapon = getQualityGuaranteedWeapon(1);
            console.log(`  -> 生成武器: ${weapon.name} (${weapon.rarity})`);
        }

        console.log("\n最终状态:", getQualityGuaranteeStatus());
        console.log("\n✓ 品质保底系统测试完成");
    } else {
        console.log("✗ 品质保底系统未找到，请检查脚本加载顺序");
    }
}, 2000); // 等待2秒以确保所有脚本加载完成