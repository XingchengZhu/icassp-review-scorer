# ICASSP Review Score Annotator / ICASSP 评审评分助手

A utility script for the ICASSP 2026 Author Response page. It automatically parses reviewer comments, annotates exact scores based on the conference rubric, and calculates the total score for each reviewer.

这是一个用于 ICASSP 2026 作者回复页面（Author Response）的辅助脚本。它能自动解析审稿人的评语，根据会议评分标准在每一项评语前标注具体分数，并自动计算每位审稿人的总分。

![ICASSP Scorer Demo](icassp-score-example.png.png)
<p align="center"><em>Script in action: Automatic scoring annotations and total score calculation / 脚本运行效果预览</em></p>

---

## Features / 功能特点

* **Auto-Scoring / 自动打分**: Automatically detects key phrases (e.g., "Technically sound...") and inserts the corresponding score (e.g., `[4]`) in red.
    * 自动识别评语关键词（如 "Technically sound..."），并在文本前插入红色的具体分数 `[4]`。
* **Total Score Calculation / 总分计算**: Sums up scores for each individual reviewer and displays a badge (e.g., `Score: 25`) in the reviewer's header.
    * 自动累加每位审稿人的各项得分，并在 "Reviewer X" 的标题栏右侧显示黄色的总分徽章。
* **Smart Filtering / 智能过滤**: Ignores the general "Reviewers" summary card to prevent duplicate counting.
    * 自动识别并跳过 "Reviewers" 总览框，只针对具体的单人审稿人计算分数，避免重复计算。
* **Dynamic Support / 动态支持**: Includes a polling mechanism to handle dynamically loaded content (AJAX).
    * 针对动态加载的网页内容，脚本包含自动轮询机制，确保内容加载后立即打分。

---

## Usage / 使用方法

### Method 1: UserScript (Recommended) / 方法一：油猴脚本（推荐）

1.  Install the **Tampermonkey** extension for your browser.
    * 安装浏览器扩展 **Tampermonkey (油猴)**。
2.  Create a new script and copy the content of `icassp_scorer.user.js`.
    * 点击扩展图标 -> "添加新脚本"，复制 `icassp_scorer.user.js` 中的代码并保存。
3.  Refresh the ICASSP Author Response page.
    * 刷新 ICASSP 作者回复页面即可生效。

### Method 2: Manual Console (No Install) / 方法二：控制台手动运行（免安装）

1.  Open the ICASSP Author Response page.
    * 打开 ICASSP 作者回复页面。
2.  Press `F12` to open DevTools and go to the **Console** tab.
    * 按 `F12` 打开开发者工具，点击 **Console (控制台)** 标签。
3.  Paste the code from `manual_console_script.js` and press **Enter**.
    * 复制 `manual_console_script.js` 中的代码，粘贴到控制台并按 **Enter** 回车。

---

## Troubleshooting / 常见问题

* **Not working? / 不生效？**
    * Check if Tampermonkey has permission to access `cmsworkshops.com`.
    * 检查 Tampermonkey 是否有权限读取 `cmsworkshops.com` 的数据。
* **Incognito Mode / 无痕模式**
    * Ensure Tampermonkey is allowed in Incognito mode if you are using it.
    * 如果你在无痕模式下使用，请确保在扩展管理中允许 Tampermonkey 在无痕模式下运行。

## Disclaimer / 免责声明
This script is for reference only. Scoring rules are based on known ICASSP 2026 criteria.
本脚本仅供辅助参考，评分规则基于 ICASSP 2026 已知标准。请以官方最终结果为准。
