// ==================== 玩家成长曲线增强 ====================
//
// 该增强系统旨在优化玩家的成长体验，包括：
// 1. 更平滑的属性成长曲线
// 2. 技能系统优化
// 3. 生命值与攻击力平衡
// 4. 特殊成长奖励机制

if (typeof PLAYER_GROWTH_ENHANCEMENT === 'undefined') {
    window.PLAYER_GROWTH_ENHANCEMENT = true;

    console.log("玩家成长曲线增强系统已加载");

    // 1. 扩展玩家属性系统
    if (typeof initializePlayerOriginal === 'undefined') {
        window.initializePlayerOriginal = typeof initializePlayer !== 'undefined' ? initializePlayer : function() {
            // 默认初始化逻辑
            gameState.player = {
                x: canvas.width / 2,
                y: canvas.height / 2,
                size: 20,
                speed: 5,
                hp: 100,
                maxHp: 100,
                damage: 10, // 基础攻击力
                weapon: null,
                attackRange: 50,
                currentCombo: 0,
                comboTimer: 0,
                lastHitTime: 0,
                buffs: [], // 玩家增益效果
                debuffs: [] // 玩家减益效果
            };
        };

        // 增强玩家初始化
        window.initializePlayer = function() {
            // 调用原始初始化
            initializePlayerOriginal();

            // 添加新的成长属性
            gameState.player = {
                ...gameState.player,
                baseDamage: 10, // 基础攻击力
                damageMultiplier: 1.0, // 伤害倍数
                attackSpeed: 1.0, // 攻击速度
                critChance: 0.05, // 暴击率
                critMultiplier: 1.5, // 暴击倍数
                armor: 0, // 护甲
                lifeSteal: 0, // 生命偷取百分比
                dodgeChance: 0.02, // 闪避率
                movementSpeedBonus: 0, // 移动速度加成
                specialAbilities: {
                    quickHeal: { cooldown: 0, maxCooldown: 5000 }, // 快速治疗
                    powerStrike: { cooldown: 0, maxCooldown: 8000 }, // 强力打击
                    defensiveStance: { cooldown: 0, maxCooldown: 10000 } // 防御姿态
                }
            };
        };
    }

    // 2. 优化升级系统
    if (typeof handleLevelUpEnhanced === 'undefined') {
        window.handleLevelUpEnhanced = function() {
            // 原有升级逻辑
            gameState.level++;

            // 更精细的属性分配
            const attributePoints = 3; // 每级获得3点属性点
            if (!gameState.player.attributePoints) {
                gameState.player.attributePoints = 0;
            }
            gameState.player.attributePoints += attributePoints;

            // 更平衡的生命值增长
            const baseHpGain = 8;
            let hpGain;

            if (gameState.level <= 10) {
                // 前10级较稳定的增长
                hpGain = baseHpGain + Math.floor(gameState.level * 0.5);
            } else if (gameState.level <= 25) {
                // 10-25级适度增长
                hpGain = baseHpGain + Math.floor(5 + (gameState.level - 10) * 0.7);
            } else {
                // 25级后增长放缓
                hpGain = baseHpGain + Math.floor(15 + (gameState.level - 25) * 0.3);
            }

            // 应用生命值增长
            gameState.player.maxHp += hpGain;
            gameState.player.hp += hpGain;

            // 限制最大生命值，保持挑战性
            const maxHpLimit = 350;
            gameState.player.maxHp = Math.min(gameState.player.maxHp, maxHpLimit);
            gameState.player.hp = Math.min(gameState.player.hp, gameState.player.maxHp);

            // 增加基础攻击力
            const damageGain = Math.max(1, Math.floor(gameState.level * 0.3));
            gameState.player.baseDamage += damageGain;

            // 增加少量暴击率
            gameState.player.critChance += 0.005; // 每级增加0.5%暴击率
            gameState.player.critChance = Math.min(gameState.player.critChance, 0.5); // 限制暴击率上限为50%

            // 检查里程碑事件
            handleMilestoneEvents();

            // 显示升级提示
            showCombatLog(t('levelUp').replace('%d', gameState.level), 'level-up');

            // 特效提示
            showLevelUpEffect();
        };

        // 替换原始升级函数（如果需要）
        if (typeof handleLevelUpOriginal) {
            window.handleLevelUpOriginal = handleLevelUpEnhanced;
        }
    }

    // 3. 创建属性分配UI（如果不存在）
    if (typeof showAttributeAllocation === 'undefined') {
        window.showAttributeAllocation = function() {
            // 创建属性分配面板
            const panel = document.createElement('div');
            panel.id = 'attribute-panel';
            panel.style.position = 'absolute';
            panel.style.top = '50%';
            panel.style.left = '50%';
            panel.style.transform = 'translate(-50%, -50%)';
            panel.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            panel.style.color = 'white';
            panel.style.padding = '20px';
            panel.style.border = '2px solid gold';
            panel.style.borderRadius = '10px';
            panel.style.zIndex = '1000';
            panel.style.display = 'flex';
            panel.style.flexDirection = 'column';
            panel.style.gap = '10px';

            // 属性点数显示
            const pointsLeft = document.createElement('div');
            pointsLeft.textContent = `剩余属性点: ${gameState.player.attributePoints}`;
            pointsLeft.style.fontSize = '18px';
            pointsLeft.style.textAlign = 'center';
            pointsLeft.style.marginBottom = '15px';

            // 属性按钮容器
            const attributesContainer = document.createElement('div');
            attributesContainer.style.display = 'grid';
            attributesContainer.style.gridTemplateColumns = '1fr 1fr';
            attributesContainer.style.gap = '10px';

            // 创建属性分配按钮
            const createAttributeButton = (attrName, displayName, incrementValue) => {
                const container = document.createElement('div');
                container.style.display = 'flex';
                container.style.alignItems = 'center';
                container.style.justifyContent = 'space-between';

                const label = document.createElement('span');
                label.textContent = `${displayName}: ${Math.floor(gameState.player[attrName])}`;

                const button = document.createElement('button');
                button.textContent = '+';
                button.onclick = () => {
                    if (gameState.player.attributePoints > 0) {
                        gameState.player[attrName] += incrementValue;
                        gameState.player.attributePoints--;

                        // 更新显示
                        label.textContent = `${displayName}: ${Math.floor(gameState.player[attrName])}`;
                        pointsLeft.textContent = `剩余属性点: ${gameState.player.attributePoints}`;

                        // 如果属性点用完，关闭面板
                        if (gameState.player.attributePoints <= 0) {
                            document.body.removeChild(panel);
                        }
                    }
                };

                container.appendChild(label);
                container.appendChild(button);
                return container;
            };

            // 添加各种属性按钮
            attributesContainer.appendChild(createAttributeButton('maxHp', '生命值', 5));
            attributesContainer.appendChild(createAttributeButton('baseDamage', '攻击力', 1));
            attributesContainer.appendChild(createAttributeButton('critChance', '暴击率', 0.01));
            attributesContainer.appendChild(createAttributeButton('armor', '护甲', 0.5));

            panel.appendChild(pointsLeft);
            panel.appendChild(attributesContainer);

            // 添加关闭按钮
            const closeButton = document.createElement('button');
            closeButton.textContent = '关闭';
            closeButton.style.marginTop = '15px';
            closeButton.style.padding = '5px 10px';
            closeButton.onclick = () => {
                document.body.removeChild(panel);
            };
            panel.appendChild(closeButton);

            document.body.appendChild(panel);

            // 阻止游戏继续进行直到分配完成
            gameState.isPaused = true;
        };
    }

    // 4. 优化战斗系统，增加暴击和伤害计算
    if (typeof calculatePlayerDamageOriginal === 'undefined') {
        window.calculatePlayerDamageOriginal = typeof calculatePlayerDamage !== 'undefined' ?
            calculatePlayerDamage : function() {
            // 默认伤害计算
            return gameState.player.baseDamage * gameState.player.damageMultiplier;
        };

        // 增强版伤害计算
        window.calculatePlayerDamage = function(target = null) {
            // 基础伤害
            let damage = gameState.player.baseDamage;

            // 武器伤害加成
            if (gameState.player.weapon && gameState.player.weapon.damage) {
                damage += gameState.player.weapon.damage;
            }

            // 伤害倍数
            damage *= gameState.player.damageMultiplier;

            // 检查是否暴击
            const isCrit = Math.random() < gameState.player.critChance;
            if (isCrit) {
                damage *= gameState.player.critMultiplier;

                // 显示暴击特效
                showCombatLog('暴击!', 'critical-hit');
            }

            // 应用目标防御
            if (target && target.armor) {
                damage *= (1 - Math.min(target.armor / (target.armor + 100), 0.75)); // 最多减少75%伤害
            }

            return Math.floor(damage);
        };
    }

    // 5. 增强伤害减免系统
    if (typeof calculatePlayerDefenseOriginal === 'undefined') {
        window.calculatePlayerDefenseOriginal = typeof calculatePlayerDefense !== 'undefined' ?
            calculatePlayerDefense : function(damage) {
            // 默认伤害减免
            return damage;
        };

        // 增强版伤害减免
        window.calculatePlayerDefense = function(incomingDamage) {
            // 基础护甲减免
            let reducedDamage = incomingDamage;
            if (gameState.player.armor > 0) {
                reducedDamage *= (1 - Math.min(gameState.player.armor / (gameState.player.armor + 150), 0.6)); // 最多减少60%伤害
            }

            // 检查是否闪避
            if (Math.random() < gameState.player.dodgeChance) {
                showCombatLog('闪避!', 'dodge');
                return 0; // 完全躲避伤害
            }

            // 生命偷取效果
            if (gameState.player.lifeSteal > 0 && gameState.player.hp < gameState.player.maxHp) {
                const healAmount = Math.floor(incomingDamage * gameState.player.lifeSteal);
                gameState.player.hp = Math.min(gameState.player.hp + healAmount, gameState.player.maxHp);
            }

            return Math.floor(reducedDamage);
        };
    }

    // 6. 优化连击系统
    if (typeof updateComboEnhanced === 'undefined') {
        window.updateComboEnhanced = function(newCombo) {
            const previousCombo = gameState.player.currentCombo || 0;

            gameState.player.currentCombo = newCombo;
            gameState.player.comboTimer = Date.now();

            // 更新UI
            document.getElementById('combo').textContent = newCombo > 0 ? `连击: ${newCombo}` : '';

            // 根据连击数提供奖励
            if (newCombo > 0) {
                // 增加连击相关的伤害倍数
                gameState.player.damageMultiplier = 1.0 + (newCombo * 0.02); // 每连击+2%伤害

                // 增加连击相关的移速
                gameState.player.speed = 5 + (newCombo * 0.05); // 每连击+0.05移速
            } else {
                // 重置到基础值
                gameState.player.damageMultiplier = 1.0;
                gameState.player.speed = 5 + gameState.player.movementSpeedBonus;
            }

            // 检查连击里程碑奖励
            if (newCombo > 0 && newCombo % 10 === 0) {
                showCombatLog(`${newCombo}连击!`, 'combo-milestone');
            }
        };

        // 替换原始连击更新函数
        if (typeof updateComboOriginal) {
            window.updateComboOriginal = updateComboEnhanced;
        }
    }

    // 7. 添加技能冷却系统
    if (typeof updateSpecialAbilities === 'undefined') {
        window.updateSpecialAbilities = function() {
            // 更新所有特殊技能的冷却
            for (const ability in gameState.player.specialAbilities) {
                const skill = gameState.player.specialAbilities[ability];
                if (skill.cooldown > 0) {
                    skill.cooldown = Math.max(0, skill.cooldown - 16); // 假设60FPS，约每帧16ms
                }
            }
        };
    }

    // 8. 创建升级特效
    if (typeof showLevelUpEffect === 'undefined') {
        window.showLevelUpEffect = function() {
            // 创建视觉升级效果
            const effect = document.createElement('div');
            effect.style.position = 'fixed';
            effect.style.top = '20%';
            effect.style.left = '50%';
            effect.style.transform = 'translateX(-50%)';
            effect.style.color = 'gold';
            effect.style.fontSize = '32px';
            effect.style.fontWeight = 'bold';
            effect.style.textShadow = '0 0 10px rgba(255, 215, 0, 0.8)';
            effect.style.zIndex = '999';
            effect.style.pointerEvents = 'none';
            effect.textContent = `Lv.${gameState.level}!`;

            document.body.appendChild(effect);

            // 动画效果
            let opacity = 1;
            const fadeEffect = setInterval(() => {
                opacity -= 0.05;
                effect.style.opacity = opacity;
                effect.style.top = (parseFloat(effect.style.top) - 0.5) + '%';

                if (opacity <= 0) {
                    clearInterval(fadeEffect);
                    document.body.removeChild(effect);
                }
            }, 50);
        };
    }

    // 9. 增加特殊成就检测
    if (typeof checkGrowthAchievements === 'undefined') {
        window.checkGrowthAchievements = function() {
            // 检查与玩家成长相关的成就
            if (gameState.level >= 10 && typeof enhancedAchievementSystem !== 'undefined') {
                enhancedAchievementSystem.unlockAchievement('milestone_ten_levels');
            }

            if (gameState.player.maxHp >= 200) {
                enhancedAchievementSystem.unlockAchievement('tank_like');
            }

            if (gameState.player.baseDamage >= 50) {
                enhancedAchievementSystem.unlockAchievement('damage_overload');
            }
        };
    }

    // 10. 增加玩家状态更新循环
    if (typeof playerStatusUpdateLoop === 'undefined') {
        window.playerStatusUpdateLoop = setInterval(() => {
            if (gameState.isPlaying && !gameState.isGameOver) {
                // 更新特殊技能冷却
                updateSpecialAbilities();

                // 定期检查成长相关成就
                if (Date.now() % 10000 < 100) { // 每10秒检查一次成就
                    checkGrowthAchievements();
                }

                // 更新属性显示（如果存在UI）
                updatePlayerStatsUI();
            }
        }, 16); // 约60FPS
    }

    // 11. 更新玩家状态UI
    if (typeof updatePlayerStatsUI === 'undefined') {
        window.updatePlayerStatsUI = function() {
            // 更新属性点提示（如果有剩余点数）
            if (gameState.player.attributePoints > 0) {
                // 显示属性分配提示
                const allocationHint = document.getElementById('allocation-hint') ||
                                      document.createElement('div');
                allocationHint.id = 'allocation-hint';
                allocationHint.textContent = `按 P 分配属性点 (${gameState.player.attributePoints}剩余)`;
                allocationHint.style.position = 'absolute';
                allocationHint.style.bottom = '20px';
                allocationHint.style.right = '20px';
                allocationHint.style.color = 'yellow';
                allocationHint.style.backgroundColor = 'rgba(0,0,0,0.6)';
                allocationHint.style.padding = '5px 10px';
                allocationHint.style.borderRadius = '5px';

                if (!document.getElementById('allocation-hint')) {
                    document.body.appendChild(allocationHint);
                }
            } else {
                // 移除提示
                const hint = document.getElementById('allocation-hint');
                if (hint) {
                    hint.remove();
                }
            }
        };
    }

    // 12. 添加键盘事件监听用于属性分配
    document.addEventListener('keydown', function(event) {
        if (event.key === 'p' || event.key === 'P') {
            if (gameState.player.attributePoints > 0) {
                showAttributeAllocation();
            }
        }
    });

    console.log("玩家成长曲线增强系统已完全应用");
} else {
    console.log("玩家成长曲线增强系统已存在，跳过重复加载");
}