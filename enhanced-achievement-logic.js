// ==================== 成就解锁逻辑增强 ====================

// 增强成就解锁逻辑
class AchievementUnlockLogic {
    constructor() {
        // 监听游戏关键事件
        this.setupEventListeners();
    }

    // 设置事件监听器
    setupEventListeners() {
        // 监听游戏开始事件
        this.setupGameStartListener();

        // 监听敌人死亡事件
        this.setupEnemyDeathListener();

        // 监听武器获取事件
        this.setupWeaponPickupListener();

        // 监听药水使用事件
        this.setupPotionUseListener();

        // 监听遗物获取事件
        this.setupRelicPickupListener();

        // 监听技能使用事件
        this.setupSkillUseListener();

        // 监听升级事件
        this.setupLevelUpListener();

        // 监听连击变化事件
        this.setupComboChangeListener();
    }

    // 设置游戏开始监听器
    setupGameStartListener() {
        // 在游戏开始时初始化成就系统
        if (typeof startGame !== 'undefined') {
            const originalStartGame = startGame;
            window.startGame = function(forceNew = false) {
                if (typeof enhancedAchievementSystem !== 'undefined') {
                    enhancedAchievementSystem.onGameStart();
                    enhancedAchievementSystem.resetTempStats();
                } else if (typeof AchievementSystem !== 'undefined') {
                    AchievementSystem.onGameStart();
                    AchievementSystem.resetTempStats();
                }

                // 调用原始函数
                originalStartGame.call(this, forceNew);
            };
        }
    }

    // 设置敌人死亡监听器
    setupEnemyDeathListener() {
        // 监听击杀Boss的事件
        if (typeof killEnemy !== 'undefined') {
            const originalKillEnemy = killEnemy;
            window.killEnemy = function(enemy) {
                // 调用原始函数
                const result = originalKillEnemy.call(this, enemy);

                // 检查并处理击杀相关的成就
                if (typeof enhancedAchievementSystem !== 'undefined') {
                    if (enemy.type === 'BOSS') {
                        enhancedAchievementSystem.onBossDefeat();
                    }

                    // 如果使用了传说武器击杀，记录成就
                    if (typeof gameState !== 'undefined' && gameState.player && gameState.player.weapon) {
                        if (['legendary', 'mythic'].includes(gameState.player.weapon.rarity)) {
                            enhancedAchievementSystem.onLegendaryWeaponKill();
                        }
                    }
                } else if (typeof AchievementSystem !== 'undefined') {
                    if (enemy.type === 'BOSS') {
                        AchievementSystem.onBossDefeat();
                    }

                    if (typeof gameState !== 'undefined' && gameState.player && gameState.player.weapon) {
                        if (['legendary', 'mythic'].includes(gameState.player.weapon.rarity)) {
                            AchievementSystem.onLegendaryWeaponKill();
                        }
                    }
                }

                return result;
            };
        }
    }

    // 设置武器获取监听器
    setupWeaponPickupListener() {
        // 如果有获取武器的函数，增强其逻辑
        if (typeof pickupWeapon !== 'undefined') {
            const originalPickupWeapon = pickupWeapon;
            window.pickupWeapon = function(weapon) {
                // 调用原始函数
                const result = originalPickupWeapon.call(this, weapon);

                // 通知成就系统获取了新武器
                if (typeof enhancedAchievementSystem !== 'undefined') {
                    enhancedAchievementSystem.onWeaponAcquired(weapon);
                } else if (typeof AchievementSystem !== 'undefined') {
                    AchievementSystem.onWeaponAcquired(weapon);
                }

                return result;
            };
        }
    }

    // 设置药水使用监听器
    setupPotionUseListener() {
        // 如果有使用药水的函数，增强其逻辑
        if (typeof usePotion !== 'undefined') {
            const originalUsePotion = usePotion;
            window.usePotion = function(potion) {
                // 调用原始函数前记录状态
                const previousHp = gameState.player.hp;

                // 调用原始函数
                const result = originalUsePotion.call(this, potion);

                // 通知成就系统使用了药水
                if (typeof enhancedAchievementSystem !== 'undefined') {
                    enhancedAchievementSystem.onPotionUsed(potion);

                    // 检查凤凰涅槃成就
                    if (previousHp < gameState.player.maxHp * 0.2 && potion.effect === 'heal') {
                        enhancedAchievementSystem.onPhoenixRise();
                    }
                } else if (typeof AchievementSystem !== 'undefined') {
                    AchievementSystem.onPotionUsed(potion);

                    if (previousHp < gameState.player.maxHp * 0.2 && potion.effect === 'heal') {
                        AchievementSystem.onPhoenixRise();
                    }
                }

                return result;
            };
        }
    }

    // 设置遗物获取监听器
    setupRelicPickupListener() {
        // 如果有获取遗物的函数，增强其逻辑
        if (typeof collectRelic !== 'undefined') {
            const originalCollectRelic = collectRelic;
            window.collectRelic = function(relic) {
                // 调用原始函数
                const result = originalCollectRelic.call(this, relic);

                // 通知成就系统获取了遗物
                if (typeof enhancedAchievementSystem !== 'undefined') {
                    enhancedAchievementSystem.onRelicAcquired();
                } else if (typeof AchievementSystem !== 'undefined') {
                    AchievementSystem.onRelicAcquired();
                }

                return result;
            };
        }
    }

    // 设置技能使用监听器
    setupSkillUseListener() {
        // 如果有使用技能的函数，增强其逻辑
        if (typeof useSkill !== 'undefined') {
            const originalUseSkill = useSkill;
            window.useSkill = function(skillKey, skill) {
                // 调用原始函数
                const result = originalUseSkill.call(this, skillKey, skill);

                // 通知成就系统使用了技能
                if (typeof enhancedAchievementSystem !== 'undefined') {
                    enhancedAchievementSystem.onSkillUsed();
                    enhancedAchievementSystem.onSpecificSkillUsed(skillKey);
                } else if (typeof AchievementSystem !== 'undefined') {
                    AchievementSystem.onSkillUsed();
                    AchievementSystem.onSpecificSkillUsed(skillKey);
                }

                return result;
            };
        }
    }

    // 设置升级监听器
    setupLevelUpListener() {
        // 如果有升级的函数，增强其逻辑
        if (typeof levelUp !== 'undefined') {
            const originalLevelUp = levelUp;
            window.levelUp = function() {
                // 调用原始函数
                const result = originalLevelUp.call(this);

                // 检查升级相关的成就
                if (typeof enhancedAchievementSystem !== 'undefined') {
                    enhancedAchievementSystem.checkAchievements();
                } else if (typeof AchievementSystem !== 'undefined') {
                    AchievementSystem.checkAchievements();
                }

                return result;
            };
        }
    }

    // 设置连击变化监听器
    setupComboChangeListener() {
        // 监听连击数变化
        if (typeof updateCombo !== 'undefined') {
            const originalUpdateCombo = updateCombo;
            window.updateCombo = function(newCombo) {
                // 记录之前的连击数
                const prevCombo = gameState.player.currentCombo || 0;

                // 调用原始函数
                const result = originalUpdateCombo.call(this, newCombo);

                // 如果连击中断（非因为敌人死亡导致），可能涉及连击相关成就
                if (prevCombo > 0 && newCombo === 0 && typeof enhancedAchievementSystem !== 'undefined') {
                    enhancedAchievementSystem.checkAchievements();
                } else if (prevCombo > 0 && newCombo === 0 && typeof AchievementSystem !== 'undefined') {
                    AchievementSystem.checkAchievements();
                }

                return result;
            };
        }
    }

    // 监听幸运击杀事件（当使用幸运药水击杀敌人时）
    onLuckyKill() {
        if (typeof enhancedAchievementSystem !== 'undefined') {
            enhancedAchievementSystem.onLuckyKill();
            enhancedAchievementSystem.onLuckyKillStreak();
        } else if (typeof AchievementSystem !== 'undefined') {
            AchievementSystem.onLuckyKill();
            AchievementSystem.onLuckyKillStreak();
        }
    }

    // 监听通关事件
    onGameWin() {
        if (typeof enhancedAchievementSystem !== 'undefined') {
            enhancedAchievementSystem.onGameWin();
        } else if (typeof AchievementSystem !== 'undefined') {
            AchievementSystem.onGameWin();
        }
    }

    // 监听游戏结束事件
    onGameOver() {
        // 在游戏结束时检查所有成就
        if (typeof enhancedAchievementSystem !== 'undefined') {
            enhancedAchievementSystem.checkAchievements();
        } else if (typeof AchievementSystem !== 'undefined') {
            AchievementSystem.checkAchievements();
        }
    }
}

// 创建成就解锁逻辑增强实例
const achievementUnlockLogic = new AchievementUnlockLogic();

// 全局函数，供游戏其他部分调用
function notifyLuckyKill() {
    if (typeof achievementUnlockLogic !== 'undefined') {
        achievementUnlockLogic.onLuckyKill();
    }
}

function notifyGameWin() {
    if (typeof achievementUnlockLogic !== 'undefined') {
        achievementUnlockLogic.onGameWin();
    }
}

function notifyGameOver() {
    if (typeof achievementUnlockLogic !== 'undefined') {
        achievementUnlockLogic.onGameOver();
    }
}

// 监听键盘事件，用于特殊成就
document.addEventListener('keydown', function(event) {
    // 某些特殊按键可能解锁特殊成就
    if (event.ctrlKey && event.key === 'a') {
        // Ctrl+A可能用于全选，在游戏中的特殊操作可解锁成就
        console.log("特殊操作检测到，可能解锁特殊成就");
    }
});

// 定期检查成就（每5秒）
setInterval(() => {
    if (typeof gameState !== 'undefined' && gameState.isPlaying) {
        if (typeof enhancedAchievementSystem !== 'undefined') {
            enhancedAchievementSystem.checkAchievements();
        } else if (typeof AchievementSystem !== 'undefined') {
            AchievementSystem.checkAchievements();
        }
    }
}, 5000);