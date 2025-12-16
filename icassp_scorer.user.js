// ==UserScript==
// @name         ICASSP 2026 Author Response Scorer
// @namespace    https://github.com/your-username/icassp-review-scorer
// @version      2.1
// @description  Auto-calculate specific scores and total scores for ICASSP 2026 reviewers. / 自动计算 ICASSP 2026 每一位审稿人的具体得分和总分。
// @match        https://cmsworkshops.com/ICASSP2026/papers/author_response.php*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    // Log to console to indicate the script is loaded
    // 控制台日志：提示脚本已加载
    console.log(">>> ICASSP Scorer Loaded / 脚本已加载 - Waiting for content... / 等待内容出现...");

    // Scoring Rules Definition
    // 评分规则定义：k = Keyword (关键词), s = Score (分数)
    const RULES = [
        // Q1: Scope
        { k: 'Clearly out of scope', s: 0 }, { k: 'Scope relevance is marginal', s: 1 }, { k: 'Clearly within scope', s: 2 },
        // Q2: Technical Correctness
        { k: 'Technically sound without', s: 4 }, { k: 'Some minor concerns', s: 3 }, { k: 'Moderate concerns', s: 2 }, { k: 'Major errors', s: 1 },
        // Q3: Novelty
        { k: 'Highly novel', s: 4 }, { k: 'Substantial novelty', s: 3 }, { k: 'Moderate novelty', s: 2 }, { k: 'Limited novelty', s: 1 }, { k: 'Not novel', s: 0 },
        // Q4: Validation
        { k: 'Sufficient validation', s: 3 }, { k: 'Limited but convincing', s: 2 }, { k: 'Lacking in some respect', s: 1 }, { k: 'Insufficient validation', s: 0 },
        // Q5: Contribution
        { k: 'Highly significant', s: 5 }, { k: 'Substantial contribution', s: 4 }, { k: 'Moderate contribution', s: 3 }, { k: 'Insufficient contribution', s: 2 }, { k: 'Limited contribution', s: 1 }, { k: 'Insignificant contribution', s: 0 },
        // Q6: Reference Completeness
        { k: 'Complete list of references without', s: 3 }, { k: 'A largely complete list', s: 2 }, { k: 'Some significant omissions', s: 1 }, { k: 'One or more major omissions', s: 0 },
        // Q7: Reference Relevance
        { k: 'All references are directly relevant', s: 3 }, { k: 'Some of the references are of limited', s: 2 }, { k: 'Some of the references are clearly', s: 1 }, { k: 'A significant number of references', s: 0 },
        // Q8: Clarity
        { k: 'Well-structured and clearly', s: 4 }, { k: 'Some minor structural', s: 3 }, { k: 'Moderate issues of', s: 2 }, { k: 'Serious structural', s: 1 }, { k: 'incomprehensible', s: 0 }
    ];

    // --- Core Processing Function / 核心处理函数 ---
    function processPage() {
        // Find all "card" elements on the page
        // 获取页面上所有的 .card 元素
        const cards = document.querySelectorAll('.card');
        if (cards.length === 0) return;

        let processedCount = 0;

        cards.forEach(card => {
            // 1. Check Header to filter out the summary table
            // 1. 检查标题栏，排除总览表
            const header = card.querySelector('.card-header');
            if (!header) return;

            const headerText = header.innerText || "";
            
            // Filter: Skip "Reviewers" (plural) summary card
            // 过滤：如果是 "Reviewers" (复数) 总表，跳过
            if (headerText.includes("Reviewers")) return;
            
            // Filter: Only process cards with "Reviewer" (singular) in title
            // 过滤：如果不是 Reviewer 卡片 (比如 Paper Information)，跳过
            if (!headerText.includes("Reviewer")) return;

            // 2. Find review cells within this card
            // 2. 在当前卡片中查找评分单元格
            const cells = card.querySelectorAll('.cms-bg-review');
            if (cells.length === 0) return;

            let currentCardTotal = 0;
            let matchCountInCard = 0;
            let hasNewUpdates = false;

            cells.forEach(cell => {
                // Clean text: remove newlines and extra spaces for better matching
                // 清洗文本：去除换行符和多余空格，确保匹配准确
                const text = (cell.innerText || "").replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim();
                
                // Find score for the current cell
                // 查找当前格子的分数
                let cellScore = -1;
                for (const rule of RULES) {
                    if (text.includes(rule.k)) {
                        cellScore = rule.s;
                        break;
                    }
                }

                if (cellScore > -1) { // Score found / 找到分数
                    // Only modify DOM if not already scored
                    // 只有当没有标记过时，才修改 HTML
                    if (cell.dataset.tmScored !== 'true') {
                        cell.dataset.tmScored = 'true';
                        // Insert red score tag
                        // 插入红色的分数标签
                        cell.innerHTML = `<span style="color:red; font-weight:bold; margin-right:5px;">[${cellScore}]</span>` + cell.innerHTML;
                        hasNewUpdates = true;
                    }
                    // Accumulate total score
                    // 累加总分
                    currentCardTotal += cellScore;
                    matchCountInCard++;
                }
            });

            // 3. Handle Header Total Score
            // 3. 处理标题栏的总分显示
            if (matchCountInCard > 0) {
                // Check if badge already exists
                // 检查是否已经加过总分徽章
                let badge = header.querySelector('.icassp-score-badge');
                
                if (!badge) {
                    // Create new badge
                    // 创建新徽章
                    badge = document.createElement('span');
                    badge.className = 'icassp-score-badge';
                    // Styling: Yellow background, black text
                    // 样式：黄底黑字
                    badge.style.cssText = "float:right; background:#ffc107; color:black; font-weight:bold; padding:2px 8px; border-radius:4px; font-size:14px; margin-left:10px; border:1px solid #333; box-shadow: 2px 2px 2px rgba(0,0,0,0.2);";
                    header.appendChild(badge);
                    hasNewUpdates = true;
                }
                
                // Update text to ensure accuracy
                // 更新文字（确保分数是最新的）
                if (badge.innerText !== `Score: ${currentCardTotal}`) {
                    badge.innerText = `Score: ${currentCardTotal}`;
                }
                
                if (hasNewUpdates) processedCount++;
            }
        });

        if (processedCount > 0) {
            console.log(`[ICASSP Scorer] Updated data for ${processedCount} reviewers / 更新了 ${processedCount} 位审稿人的数据`);
        }
    }

    // --- Execution Mechanism / 启动机制 ---

    // 1. Run immediately
    // 1. 立即尝试运行一次
    processPage();

    // 2. Polling: Check page every 1.5 seconds (Handles dynamic loading)
    // 2. 暴力轮询：每 1.5 秒检查一次页面（应对动态加载/AJAX）
    setInterval(processPage, 1500);

})();
