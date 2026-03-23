// ==================== 品质保底系统UI更新补丁 ====================
//
// 该补丁修改了UI更新函数，添加了品质保底系统状态的显示

if (typeof QUALITY_GUARANTEE_UI_PATCH === 'undefined') {
    window.QUALITY_GUARANTEE_UI_PATCH = true;

    console.log("品质保底系统UI补丁已加载");

    // 保存原始的updateUI函数
    if (typeof updateUIOriginalWithoutQuality === 'undefined') {
        window.updateUIOriginalWithoutQuality = typeof updateUI !== 'undefined' ? updateUI : function() {
            console.warn("未找到原始updateUI函数");
        };
    }

    // 重写updateUI函数，添加品质保底系统UI
    window.updateUI = function() {
        // 调用原始的UI更新函数
        updateUIOriginalWithoutQuality();

        // 添加品质保底系统指示器
        let qualityIndicator = document.getElementById('quality-guarantee-indicator');

        if (!qualityIndicator) {
            // 如果不存在则创建品质保底指示器元素
            qualityIndicator = document.createElement('div');
            qualityIndicator.id = 'quality-guarantee-indicator';

            // 创建内部HTML
            qualityIndicator.innerHTML = `
                <div>💎 武器品质保底</div>
                <div>普通武器连击: <span id="consecutive-common-count">0</span></div>
                <div>品质提升: <span id="quality-boost-percent">0%</span></div>
                <div class="quality-guarantee-bar">
                    <div class="quality-guarantee-fill" id="quality-boost-bar"></div>
                </div>
            `;

            document.getElementById('game-container').appendChild(qualityIndicator);
        }

        // 更新品质保底系统数值显示
        if (typeof getQualityGuaranteeStatus !== 'undefined') {
            const status = getQualityGuaranteeStatus();

            // 更新连击计数
            const countElement = document.getElementById('consecutive-common-count');
            if (countElement) {
                countElement.textContent = status.consecutiveCommonDrops;

                // 根据连击次数改变颜色，表示紧急程度
                if (status.consecutiveCommonDrops >= 8) {
                    countElement.style.color = '#f87171'; // 红色，表示即将触发保底
                } else if (status.consecutiveCommonDrops >= 5) {
                    countElement.style.color = '#fbbf24'; // 黄色，表示接近保底
                } else {
                    countElement.style.color = '#4ade80'; // 绿色，表示正常
                }
            }

            // 更新品质提升百分比
            const boostElement = document.getElementById('quality-boost-percent');
            if (boostElement) {
                boostElement.textContent = status.boostPercentage + '%';
            }

            // 更新品质提升进度条
            const barElement = document.getElementById('quality-boost-bar');
            if (barElement) {
                // 进度条最大宽度为80%，在连续获得8次普通武器时达到最大
                const maxWidth = 80;
                const currentWidth = Math.min(maxWidth, (status.consecutiveCommonDrops / 8) * maxWidth);
                barElement.style.width = currentWidth + '%';

                // 根据进度改变颜色
                if (currentWidth >= maxWidth * 0.8) {
                    barElement.style.background = 'linear-gradient(90deg, #f87171, #ef4444)'; // 红色渐变
                } else if (currentWidth >= maxWidth * 0.5) {
                    barElement.style.background = 'linear-gradient(90deg, #fbbf24, #f59e0b)'; // 黄色渐变
                } else {
                    barElement.style.background = 'linear-gradient(90deg, #4ade80, #22c55e)'; // 绿色渐变
                }
            }
        }
    };

    // 游戏重启时需要重新初始化UI
    if (typeof initializeQualityGuaranteeUI === 'undefined') {
        window.initializeQualityGuaranteeUI = function() {
            // 在DOM加载完成后添加品质保底指示器
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', function() {
                    // 确保UI元素存在
                    let qualityIndicator = document.getElementById('quality-guarantee-indicator');
                    if (!qualityIndicator) {
                        // 稍微延迟以确保其他UI元素都已加载
                        setTimeout(updateUI, 100);
                    }
                });
            } else {
                // DOM已加载，直接更新UI
                setTimeout(updateUI, 100);
            }
        };

        // 自动初始化
        initializeQualityGuaranteeUI();
    }
}