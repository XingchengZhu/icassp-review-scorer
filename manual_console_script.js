(function () {
    // Log start message
    // 启动日志
    console.log(">>> ICASSP Manual Scorer Started / 手动评分脚本启动...");

    // Scoring Rules / 评分规则
    const rules = [
        { k: 'Clearly out of scope', s: 0 }, { k: 'Scope relevance is marginal', s: 1 }, { k: 'Clearly within scope', s: 2 },
        { k: 'Technically sound without', s: 4 }, { k: 'Some minor concerns', s: 3 }, { k: 'Moderate concerns', s: 2 }, { k: 'Major errors', s: 1 },
        { k: 'Highly novel', s: 4 }, { k: 'Substantial novelty', s: 3 }, { k: 'Moderate novelty', s: 2 }, { k: 'Limited novelty', s: 1 }, { k: 'Not novel', s: 0 },
        { k: 'Sufficient validation', s: 3 }, { k: 'Limited but convincing', s: 2 }, { k: 'Lacking in some respect', s: 1 }, { k: 'Insufficient validation', s: 0 },
        { k: 'Highly significant', s: 5 }, { k: 'Substantial contribution', s: 4 }, { k: 'Moderate contribution', s: 3 }, { k: 'Insufficient contribution', s: 2 }, { k: 'Limited contribution', s: 1 }, { k: 'Insignificant contribution', s: 0 },
        { k: 'Complete list of references without', s: 3 }, { k: 'A largely complete list', s: 2 }, { k: 'Some significant omissions', s: 1 }, { k: 'One or more major omissions', s: 0 },
        { k: 'All references are directly relevant', s: 3 }, { k: 'Some of the references are of limited', s: 2 }, { k: 'Some of the references are clearly', s: 1 }, { k: 'A significant number of references', s: 0 },
        { k: 'Well-structured and clearly', s: 4 }, { k: 'Some minor structural', s: 3 }, { k: 'Moderate issues of', s: 2 }, { k: 'Serious structural', s: 1 }, { k: 'incomprehensible', s: 0 }
    ];

    // Find all cards
    // 获取页面卡片
    const cards = document.querySelectorAll('.card');
    let reviewerCount = 0;

    cards.forEach(card => {
        // 1. Locate Header
        // 1. 找到卡片头部
        const header = card.querySelector('.card-header');
        if (!header) return;

        const headerText = header.innerText || "";

        // === Filtering Logic / 过滤逻辑 ===
        // Skip "Reviewers" (plural) summary card
        // 跳过 "Reviewers"（复数）总览卡片
        if (headerText.includes("Reviewers")) return; 
        
        // Skip non-Reviewer cards (e.g. Paper Info)
        // 跳过非审稿人卡片（如论文信息）
        if (!headerText.includes("Reviewer")) return; 

        // 2. Process cells within the card
        // 2. 处理卡片内的评分格
        const cells = card.querySelectorAll('.cms-bg-review');
        if (cells.length === 0) return;

        let currentCardTotal = 0;
        let matchCountInCard = 0;

        cells.forEach(cell => {
            // Prevent double scoring
            // 防止重复打分
            if (cell.dataset.manualScored === 'true') return;

            // Normalize text
            // 标准化文本（去换行和空格）
            const text = (cell.innerText || "").replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim();
            
            for (const rule of rules) {
                if (text.includes(rule.k)) {
                    // Mark as processed
                    // 标记为已处理
                    cell.dataset.manualScored = 'true';
                    
                    // Inject Score
                    // 注入分数
                    cell.innerHTML = `<span style="color:red; font-weight:bold; margin-right:5px;">[${rule.s}]</span>` + cell.innerHTML;
                    
                    currentCardTotal += rule.s;
                    matchCountInCard++;
                    break; 
                }
            }
        });

        // 3. Add Total Score Badge to Header
        // 3. 在头部添加总分徽章
        if (matchCountInCard > 0) {
            reviewerCount++;
            
            // Check if already added
            // 检查是否已添加
            if (!header.dataset.totalAdded) {
                header.dataset.totalAdded = 'true';
                
                const badge = document.createElement('span');
                badge.style.cssText = "float:right; background:#ffc107; color:black; font-weight:bold; padding:2px 8px; border-radius:4px; font-size:14px; margin-left:10px; border:1px solid #333;";
                badge.innerText = `Score: ${currentCardTotal}`;
                
                header.appendChild(badge);
            }
        }
    });

    if (reviewerCount > 0) {
        console.log(`✅ Success: Calculated scores for ${reviewerCount} reviewers. / 成功计算了 ${reviewerCount} 位审稿人的总分。`);
    } else {
        console.log("❌ No unscored reviewer cards found. / 未找到未处理的审稿人卡片。");
    }
})();
