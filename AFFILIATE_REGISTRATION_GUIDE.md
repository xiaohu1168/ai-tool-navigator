# AI 工具联盟计划注册清单

> 更新日期: 2026-06-20
> 来源: 综合公开信息与研究结果

---

## 快速注册指南

### 🟢 第一梯队：立即注册（零门槛，马上可用）

| 工具 | 佣金 | 注册链接 | 备注 |
|------|------|----------|------|
| **Canva** | 30% 首月 | https://www.canva.com/affiliates/ | 90天cookie，设计类流量大 |
| **Jasper** | 30% 循环 | https://www.jasper.ai/affiliate-program | PartnerStack 平台 |
| **Notion** | $10/注册 | https://www.notion.so/affiliate-program | 教育市场大 |
| **ElevenLabs** | 30% 循环 | https://elevenlabs.io/affiliate-program | AI 语音增长快 |
| **Writesonic** | 30% 循环 | https://writesonic.com/affiliate-program | 90天cookie |
| **Copy.ai** | 23% 循环 | https://www.copy.ai/affiliate-program | 营销工具 |
| **QuillBot** | 25% 循环 | https://quillbot.com/affiliates | Impact Radius 平台 |
| **Speechify** | 20% 循环 | https://speechify.com/affiliate-program | 教育/无障碍市场 |
| **PlayHT** | 25% 循环 | https://play.ht/affiliate-program | 语音生成 |
| **Synthesia** | 20% 循环 | https://www.synthesia.io/affiliate-program | AI 视频 |
| **Murf AI** | 20% 循环 | https://murf.ai/affiliate-program | 视频旁白 |
| **Runway ML** | 20% | https://runwayml.com/affiliates/ | 视频 AI 领先 |
| **Perplexity AI** | 20% 循环 | https://www.perplexity.ai/affiliate | 搜索 AI |
| **Replit** | 20% 循环 | https://replit.com/site/affiliate | PartnerStack 平台 |
| **Grammarly** | 20% 循环 | https://www.grammarly.com/affiliate-program | Impact Radius 平台 |

### 🟡 第二梯队：需要平台账号

| 平台 | 注册链接 | 用途 |
|------|----------|------|
| **Impact** | https://impact.com/ | Canva, Grammarly, Speechify, QuillBot |
| **PartnerStack** | https://www.partnerstack.com/ | Jasper, Replit, Adobe |
| **Impact Radius** | https://www.impactradius.com/ | Grammarly, QuillBot, Speechify |

### 🔴 第三梯队：无公开联盟计划

| 工具 | 现状 | 替代方案 |
|------|------|----------|
| **ChatGPT / OpenAI** | 无公开联盟计划 | 联系 partnerships@openai.com |
| **Claude / Anthropic** | 无公开联盟计划 | 联系 partnerships@anthropic.com |
| **Cursor** | 有 referral 但不公开 | 用普通链接 + ?via=heyaihub |
| **Midjourney** | 积分奖励非现金 | 用普通链接 + ?via=heyaihub |

---

## 注册步骤

### 1. 注册各平台账号

```bash
# 依次注册以下平台（都免费）
- Impact: https://impact.com/
- PartnerStack: https://www.partnerstack.com/
- Impact Radius: https://www.impactradius.com/
```

### 2. 申请具体品牌项目

每个品牌的注册链接都在上表中。大多数品牌：
- 不需要最低流量要求
- 不需要网站审核
- 注册后即可获取联盟链接

### 3. 替换种子脚本中的占位链接

```bash
# 编辑 seed-affiliate-links.js 中的 AFFILIATE_TEMPLATES 数组
# 将 https://example.com/?via=heyaihub
# 替换为 https://example.com/?ref=YOUR_AFFILIATE_ID
```

### 4. 通过 Admin 面板管理

- 登录 /admin → 工具管理
- 点击 🔗 Manage Links
- 编辑每条联盟链接的 URL

---

## 注意事项

1. **佣金类型区分**
   - 首月佣金：只赚第一个月的钱
   - 循环佣金：用户续费就一直赚
   - 固定金额：每成功注册赚固定钱数

2. **Cookie 时长**
   - 30天：标准
   - 60天：较好
   - 90天：最佳（Canva, Grammarly, Writesonic）

3. **无联盟计划的品牌**
   - 仍然可以用普通链接 + `?via=heyaihub` 参数
   - 通过 Admin 面板随时替换为真实联盟链接
   - 前端追踪系统已就绪，不影响用户体验

4. **注册材料准备**
   - 网站 URL
   - 月流量数据（如有）
   - 内容类型说明
   - 社交媒体账号（部分平台需要）

---

## 推荐操作顺序

### 今天
1. 注册 Canva、Jasper、Notion、ElevenLabs（佣金最高）
2. 注册 Impact 和 PartnerStack 平台账号

### 本周
3. 注册其余 12+ 个品牌
4. 替换种子脚本中的占位链接

### 持续
5. 监控各联盟计划的转化数据
6. 联系 ChatGPT/Claude 的合作伙伴团队
7. 根据数据优化链接位置和文案

---

*所有链接和信息基于 2026 年 6 月公开资料。佣金和条款可能变动，请以官方页面为准。*
