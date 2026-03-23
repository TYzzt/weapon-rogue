// ==================== 里程碑系统增强 ====================
//
// 该模块用于增强里程碑系统，提供更多样化的关卡事件和奖励

// 检查是否已加载，防止重复加载
if (typeof MILESTONE_SYSTEM_ENHANCED === 'undefined') {
    window.MILESTONE_SYSTEM_ENHANCED = true;

    console.log("里程碑系统增强模块已加载");

    // 增强里程碑系统类
    if (typeof MilestoneSystem !== 'undefined') {
        // 扩展现有里程碑系统
        const originalEvaluateMilestones = MilestoneSystem.evaluateMilestones;

        MilestoneSystem.evaluateMilestones = function() {
            // 调用原始方法
            originalEvaluateMilestones.call(this);

            // 检查当前关卡是否达到新的里程碑
            for (const milestone of this.milestones) {
                if (gameState.level === milestone.level && !this.completed.has(milestone.level)) {
                    this.completeMilestone(milestone);
                }
            }
        };

        // 重写里程碑完成方法，增加视觉和音效反馈
        MilestoneSystem.completeMilestone = function(milestone) {
            // 添加到已完成集合
            this.completed.add(milestone.level);

            // 显示里程碑完成消息
            showCombatLog(`🌟 里程碑达成！ - ${milestone.name}: ${milestone.description}`, 'milestone');

            // 播放里程碑音效
            if (typeof AudioManager !== 'undefined') {
                AudioManager.playSound('level_up');
            }

            // 应用里程碑奖励
            this.applyEnhancedReward(milestone.reward);

            // 触发里程碑相关的特殊事件
            this.triggerMilestoneEvent(milestone.level);
        };

        // 新增增强奖励方法
        MilestoneSystem.applyEnhancedReward = function(reward) {
            if (!reward) return;

            // 原有奖励逻辑
            if (reward.hpBonus) {
                gameState.player.maxHp += reward.hpBonus;
                gameState.player.hp += reward.hpBonus;
            }
            if (reward.damageBonus) {
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

            // 新增奖励类型
            if (reward.scoreBonus) {
                gameState.player.score += reward.scoreBonus;
                showCombatLog(`💰 获得 ${reward.scoreBonus} 分数奖励！`, 'weapon-get');
            }

            if (reward.specialWeapon) {
                // 给予特殊武器奖励
                const weapon = WEAPONS.find(w => w.name === reward.specialWeapon);
                if (weapon) {
                    // 模拟获得新武器的效果
                    showCombatLog(`🎁 获得里程碑奖励武器: ${weapon.name}!`, 'weapon-get');
                    // 注意：实际游戏中可能需要根据具体情况处理
                }
            }

            if (reward.instantHeal) {
                // 立即恢复一定百分比的生命值
                const healAmount = Math.floor(gameState.player.maxHp * reward.instantHeal);
                gameState.player.hp = Math.min(gameState.player.maxHp, gameState.player.hp + healAmount);
                showCombatLog(`❤️ 立即恢复 ${healAmount} 生命值`, 'heal');
            }

            if (reward.potionGift) {
                // 赠送指定药水
                const potion = POTIONS.find(p => p.name === reward.potionGift);
                if (potion) {
                    gameState.potions.push({...potion}); // 添加副本
                    showCombatLog(`🧪 获得奖励药水: ${potion.name}`, 'potion-pickup');
                }
            }

            // 限制属性上限
            gameState.player.maxHp = Math.min(gameState.player.maxHp, 500);
            gameState.player.hp = Math.min(gameState.player.hp, gameState.player.maxHp);
        };

        // 新增里程碑事件触发器
        MilestoneSystem.triggerMilestoneEvent = function(level) {
            switch(level) {
                case 10:
                    // 10关里程碑事件：给予特殊武器
                    this.giveSpecialWeaponReward();
                    break;
                case 20:
                    // 20关里程碑事件：大量恢复生命
                    gameState.player.hp = gameState.player.maxHp;
                    showCombatLog(`🌟 第20关！生命完全恢复！`, 'heal');
                    break;
                case 30:
                    // 30关里程碑事件：随机药水奖励
                    this.giveRandomPotionReward();
                    break;
                case 40:
                    // 40关里程碑事件：大量分数奖励
                    gameState.player.score += 2000;
                    showCombatLog(`💰 第40关！获得 2000 分数奖励！`, 'weapon-get');
                    break;
                case 50:
                    // 50关里程碑事件：终极奖励
                    this.ultimateReward();
                    break;
                default:
                    // 其他里程碑事件
                    if (level % 5 === 0 && level > 0) {
                        // 每5关给予额外奖励
                        gameState.player.maxHp += 5;
                        gameState.player.hp += 5;
                        showCombatLog(`💪 第${level}关里程碑！最大生命值+5`, 'heal');
                    }
                    break;
            }
        };

        // 里程碑奖励方法：给予特殊武器
        MilestoneSystem.giveSpecialWeaponReward = function() {
            // 随机给予一件稀有或以上品质的武器
            const rareAndAbove = WEAPONS.filter(w => w.rarity === 'rare' || w.rarity === 'epic' || w.rarity === 'legendary' || w.rarity === 'mythic');
            if (rareAndAbove.length > 0) {
                const randomWeapon = rareAndAbove[Math.floor(Math.random() * rareAndAbove.length)];
                showCombatLog(`🎁 里程碑奖励：获得 ${randomWeapon.name}!`, 'weapon-get');

                // 这里可以添加一些特殊逻辑，比如直接应用武器属性或给予奖励
                // 注意：这里不直接替换当前武器，只是作为奖励
                gameState.player.score += randomWeapon.damage * 10; // 给予分数奖励作为补偿
            }
        };

        // 里程碑奖励方法：给予随机药水
        MilestoneSystem.giveRandomPotionReward = function() {
            if (POTIONS.length > 0) {
                const randomPotion = POTIONS[Math.floor(Math.random() * POTIONS.length)];
                gameState.potions.push({...randomPotion});
                showCombatLog(`🧪 里程碑奖励：获得 ${randomPotion.name}!`, 'potion-pickup');
            }
        };

        // 里程碑奖励方法：终极奖励
        MilestoneSystem.ultimateReward = function() {
            // 第50关的终极奖励
            gameState.player.maxHp += 50; // 大幅提升生命值
            gameState.player.hp = gameState.player.maxHp; // 完全恢复
            gameState.player.score += 5000; // 大量分数奖励

            // 随机给予一件史诗或传说武器作为纪念
            const epicAndAbove = WEAPONS.filter(w => w.rarity === 'epic' || w.rarity === 'legendary' || w.rarity === 'mythic');
            if (epicAndAbove.length > 0) {
                const randomWeapon = epicAndAbove[Math.floor(Math.random() * epicAndAbove.length)];
                showCombatLog(`🎊 恭喜达到第50关！终极里程碑奖励：`, 'level-up');
                showCombatLog(`🌟 获得 ${randomWeapon.name}!`, 'weapon-get');
                showCombatLog(`❤️ 生命值上限+50，并完全恢复`, 'heal');
                showCombatLog(`💰 额外奖励 5000 分!`, 'weapon-get');
            }
        };

        // 新增里程碑进度显示方法
        MilestoneSystem.updateProgressDisplay = function() {
            const completedCount = this.completed.size;
            const totalCount = this.milestones.length;

            // 更新UI中的里程碑显示
            const milestoneElement = document.getElementById('milestones');
            if (milestoneElement) {
                milestoneElement.textContent = `${completedCount}/${totalCount}`;
            }

            return { completed: completedCount, total: totalCount };
        };

        // 添加新的里程碑查询方法
        MilestoneSystem.getNextMilestone = function() {
            // 查找下一个未完成的里程碑
            const unfinishedMilestones = this.milestones
                .filter(m => !this.completed.has(m.level))
                .sort((a, b) => a.level - b.level);

            return unfinishedMilestones.length > 0 ? unfinishedMilestones[0] : null;
        };

        // 添加里程碑提醒功能
        MilestoneSystem.checkUpcomingMilestone = function() {
            const nextMilestone = this.getNextMilestone();
            if (nextMilestone) {
                const levelsUntilNext = nextMilestone.level - gameState.level;

                if (levelsUntilNext === 1) {
                    // 距离下个里程碑还有1关，给出提醒
                    showCombatLog(`➡️ 下一关 ${nextMilestone.level} 将达到里程碑: ${nextMilestone.name}`, 'milestone');
                } else if (levelsUntilNext <= 3 && levelsUntilNext > 1) {
                    // 距离下个里程碑还有3关以内，给出预告
                    showCombatLog(`📅 即将到来的里程碑: ${nextMilestone.level} 关 - ${nextMilestone.name}`, 'milestone');
                }
            }
        };
    }

    // 如果没有现有的里程碑系统，创建一个新的
    if (typeof EnhancedMilestoneSystem === 'undefined') {
        class EnhancedMilestoneSystem {
            constructor() {
                this.milestones = [
                    // 基础里程碑
                    { level: 3, name: '新手上路', description: '到达第3关，熟悉基本操作', condition: 'level >= 3', reward: { hpBonus: 5 } },
                    { level: 5, name: '初露锋芒', description: '到达第5关，掌握基本战斗技巧', condition: 'level >= 5', reward: { hpBonus: 5, damageBonus: 0.1 } },
                    { level: 7, name: '小有所成', description: '到达第7关，战斗渐入佳境', condition: 'level >= 7', reward: { hpBonus: 5 } },
                    { level: 10, name: '第一道坎', description: '突破第10关，成为真正的战士', condition: 'level >= 10', reward: { hpBonus: 10, damageBonus: 0.2, potionGift: '生命药水' } },
                    { level: 15, name: '勇往直前', description: '到达第15关，证明你的实力', condition: 'level >= 15', reward: { hpBonus: 10 } },
                    { level: 20, name: '勇者传说', description: '到达第20关，传奇从此开始', condition: 'level >= 20', reward: { hpBonus: 15, damageBonus: 0.3, instantHeal: 1.0 } }, // 完全恢复
                    { level: 25, name: '英雄之路', description: '到达第25关，已是名副其实的英雄', condition: 'level >= 25', reward: { hpBonus: 15 } },
                    { level: 30, name: '传说之始', description: '到达第30关，踏入传说领域', condition: 'level >= 30', reward: { hpBonus: 20, damageBonus: 0.5, scoreBonus: 1000 } },
                    { level: 35, name: '超凡脱俗', description: '到达第35关，超越凡人界限', condition: 'level >= 35', reward: { hpBonus: 20 } },
                    { level: 40, name: '半神之躯', description: '到达第40关，拥有半神之力', condition: 'level >= 40', reward: { hpBonus: 25, damageBonus: 0.7, scoreBonus: 2000 } },
                    { level: 45, name: '接近神明', description: '到达第45关，触摸神性光辉', condition: 'level >= 45', reward: { hpBonus: 25 } },
                    { level: 50, name: '超越极限', description: '到达第50关，成为不朽传奇', condition: 'level >= 50', reward: { hpBonus: 50, damageBonus: 1.0, scoreBonus: 5000, instantHeal: 1.0 } },

                    // 扩展里程碑
                    { level: 55, name: '永恒守护', description: '超越第50关，成为永恒守护者', condition: 'level >= 55', reward: { hpBonus: 30, damageBonus: 0.8, scoreBonus: 3000 } },
                    { level: 60, name: '宇宙主宰', description: '第60关，掌控宇宙法则', condition: 'level >= 60', reward: { hpBonus: 40, damageBonus: 1.2, scoreBonus: 5000, instantHeal: 0.5 } },
                ];

                this.completed = new Set();
            }

            // 评估里程碑
            evaluateMilestones() {
                for (const milestone of this.milestones) {
                    if (gameState.level >= milestone.level && !this.completed.has(milestone.level)) {
                        this.completeMilestone(milestone);
                    }
                }

                // 更新进度显示
                this.updateProgressDisplay();

                // 检查即将到来的里程碑
                this.checkUpcomingMilestone();
            }

            // 完成里程碑
            completeMilestone(milestone) {
                this.completed.add(milestone.level);
                showCombatLog(`🌟 里程碑达成！ - ${milestone.name}: ${milestone.description}`, 'milestone');

                if (typeof AudioManager !== 'undefined') {
                    AudioManager.playSound('level_up');
                }

                this.applyEnhancedReward(milestone.reward);
                this.triggerMilestoneEvent(milestone.level);
            }

            // 应用增强奖励
            applyEnhancedReward(reward) {
                if (!reward) return;

                if (reward.hpBonus) {
                    gameState.player.maxHp += reward.hpBonus;
                    gameState.player.hp += reward.hpBonus;
                }
                if (reward.damageBonus) {
                    if (!gameState.player.damageBonus) {
                        gameState.player.damageBonus = 0;
                    }
                    gameState.player.damageBonus += reward.damageBonus;
                }
                if (reward.scoreBonus) {
                    gameState.player.score += reward.scoreBonus;
                    showCombatLog(`💰 获得 ${reward.scoreBonus} 分数奖励！`, 'weapon-get');
                }
                if (reward.instantHeal) {
                    const healAmount = Math.floor(gameState.player.maxHp * reward.instantHeal);
                    gameState.player.hp = Math.min(gameState.player.maxHp, gameState.player.hp + healAmount);
                    showCombatLog(`❤️ 立即恢复 ${healAmount} 生命值`, 'heal');
                }
                if (reward.potionGift) {
                    const potion = POTIONS.find(p => p.name === reward.potionGift);
                    if (potion) {
                        gameState.potions.push({...potion});
                        showCombatLog(`🧪 获得奖励药水: ${potion.name}`, 'potion-pickup');
                    }
                }

                gameState.player.maxHp = Math.min(gameState.player.maxHp, 1000); // 增加上限
                gameState.player.hp = Math.min(gameState.player.hp, gameState.player.maxHp);
            }

            // 触发里程碑事件
            triggerMilestoneEvent(level) {
                switch(level) {
                    case 10:
                        this.giveSpecialWeaponReward();
                        break;
                    case 20:
                        gameState.player.hp = gameState.player.maxHp;
                        showCombatLog(`🌟 第20关！生命完全恢复！`, 'heal');
                        break;
                    case 30:
                        this.giveRandomPotionReward();
                        break;
                    case 40:
                        gameState.player.score += 2000;
                        showCombatLog(`💰 第40关！获得 2000 分数奖励！`, 'weapon-get');
                        break;
                    case 50:
                        this.ultimateReward();
                        break;
                    default:
                        if (level % 5 === 0 && level > 0) {
                            gameState.player.maxHp += 5;
                            gameState.player.hp += 5;
                            showCombatLog(`💪 第${level}关里程碑！最大生命值+5`, 'heal');
                        }
                        break;
                }
            }

            // 给予特殊武器奖励
            giveSpecialWeaponReward() {
                const rareAndAbove = WEAPONS.filter(w => w.rarity === 'rare' || w.rarity === 'epic' || w.rarity === 'legendary' || w.rarity === 'mythic');
                if (rareAndAbove.length > 0) {
                    const randomWeapon = rareAndAbove[Math.floor(Math.random() * rareAndAbove.length)];
                    showCombatLog(`🎁 里程碑奖励：获得 ${randomWeapon.name}!`, 'weapon-get');
                    gameState.player.score += randomWeapon.damage * 10;
                }
            }

            // 给予随机药水奖励
            giveRandomPotionReward() {
                if (POTIONS.length > 0) {
                    const randomPotion = POTIONS[Math.floor(Math.random() * POTIONS.length)];
                    gameState.potions.push({...randomPotion});
                    showCombatLog(`🧪 里程碑奖励：获得 ${randomPotion.name}!`, 'potion-pickup');
                }
            }

            // 终极奖励
            ultimateReward() {
                gameState.player.maxHp += 50;
                gameState.player.hp = gameState.player.maxHp;
                gameState.player.score += 5000;

                const epicAndAbove = WEAPONS.filter(w => w.rarity === 'epic' || w.rarity === 'legendary' || w.rarity === 'mythic');
                if (epicAndAbove.length > 0) {
                    const randomWeapon = epicAndAbove[Math.floor(Math.random() * epicAndAbove.length)];
                    showCombatLog(`🎊 恭喜达到第50关！终极里程碑奖励：`, 'level-up');
                    showCombatLog(`🌟 获得 ${randomWeapon.name}!`, 'weapon-get');
                    showCombatLog(`❤️ 生命值上限+50，并完全恢复`, 'heal');
                    showCombatLog(`💰 额外奖励 5000 分!`, 'weapon-get');
                }
            }

            // 更新进度显示
            updateProgressDisplay() {
                const completedCount = this.completed.size;
                const totalCount = this.milestones.length;

                const milestoneElement = document.getElementById('milestones');
                if (milestoneElement) {
                    milestoneElement.textContent = `${completedCount}/${totalCount}`;
                }

                return { completed: completedCount, total: totalCount };
            }

            // 获取下一个里程碑
            getNextMilestone() {
                const unfinishedMilestones = this.milestones
                    .filter(m => !this.completed.has(m.level))
                    .sort((a, b) => a.level - b.level);

                return unfinishedMilestones.length > 0 ? unfinishedMilestones[0] : null;
            }

            // 检查即将到来的里程碑
            checkUpcomingMilestone() {
                const nextMilestone = this.getNextMilestone();
                if (nextMilestone) {
                    const levelsUntilNext = nextMilestone.level - gameState.level;

                    if (levelsUntilNext === 1) {
                        showCombatLog(`➡️ 下一关 ${nextMilestone.level} 将达到里程碑: ${nextMilestone.name}`, 'milestone');
                    } else if (levelsUntilNext <= 3 && levelsUntilNext > 1) {
                        showCombatLog(`📅 即将到来的里程碑: ${nextMilestone.level} 关 - ${nextMilestone.name}`, 'milestone');
                    }
                }
            }
        }

        // 如果没有现有系统，创建新实例
        if (typeof MilestoneSystem === 'undefined') {
            window.MilestoneSystem = new EnhancedMilestoneSystem();
        }
    }

    // 修改原始的游戏关卡升级函数以集成里程碑系统
    if (typeof handleMilestoneEvents !== 'undefined') {
        const originalHandleMilestoneEvents = handleMilestoneEvents;

        window.handleMilestoneEvents = function() {
            if (originalHandleMilestoneEvents) {
                originalHandleMilestoneEvents(); // 调用原始函数
            }

            // 调用增强的里程碑评估
            if (MilestoneSystem) {
                MilestoneSystem.evaluateMilestones();
            }
        };
    } else {
        // 如果没有原始函数，创建一个
        window.handleMilestoneEvents = function() {
            if (MilestoneSystem) {
                MilestoneSystem.evaluateMilestones();
            }
        };
    }

    console.log("里程碑系统增强模块已完全加载");
} else {
    console.log("里程碑系统增强模块已存在，跳过重复加载");
}