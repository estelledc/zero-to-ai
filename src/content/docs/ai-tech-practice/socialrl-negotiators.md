---
title: SocialRL：礼貌助手为什么不等于合格谈判代理
description: 用可计分博弈理解意图建模、信息披露、反制和价值交换，并设计安全的小型评测
tags: [ai-tech-practice, reinforcement-learning, social-reasoning, agents]
difficulty: advanced
lastVerified: '2026-08-30'
source:
  title: 'From Passive Delegates to Strategic Negotiators: Reinforcing Social Reasoning in Small Language Models'
  publisher: Microsoft Research
  url: https://www.microsoft.com/en-us/research/articles/from-passive-delegates-to-strategic-negotiators-reinforcing-social-reasoning-in-small-language-models/
  published: '2026-07-15'
---

## 先说结论

“友好、透明、尽快达成一致”在普通助手里是优点，在利益冲突里可能让代理过早泄露底价、一次被拒就让步。合格的谈判 Agent 必须忠实代表委托人的目标，同时守住授权和诚实边界；SocialRL 展示的是社会推理训练方法，不是教模型操纵真人。

## 问题

谈判没有像数学题那样唯一正确答案。高分可能来自题目容易、对手太弱或牺牲长期关系。只奖励成交，会训练出无底线让步；只奖励己方收益，又可能鼓励欺骗和僵局。评测还必须面对随机对手：同一个开局，不同回复会让轨迹无法直接横比。

## 核心机制

Microsoft 将能力拆成四项：推断对方意图、控制信息披露、对失衡方案进行策略性反制、用低价值筹码交换高价值结果。SocialRL 在物品分配、露营资源、求职条件和二手议价四类游戏中训练 4B 模型。游戏可生成新局面并给出分数，但奖励会对照每个场景的 Pareto-efficient、envy-free 参考点，减少“抽到简单题”的影响。

训练可先做监督蒸馏，再用 PPO；面对随机对手时，团队选择学习到的 value function 按实际状态估计基线，而不是把同一 prompt 的多条随机轨迹强行组内比较。原文报告该 4B 模型在特定留出设置中达到或超过部分 GPT-5 系列谈判表现，本文未独立复现。

## 如何接到 Zero-to-AI 学习实践

给代理写一张委托卡：目标、不可披露信息、可让步区间、必须请示的事项、退出线。把“成交”拆成己方效用、双方是否同意、隐私泄露、越权承诺四个指标。日志中区分推断与事实；模型猜测对方偏好，不能写成已知。真实发送报价前始终保留人工确认。

同一委托卡还要规定哪些策略禁止使用，否则“提高得分”可能悄悄改变行为规范。

## 低成本实验

用纸面生成 20 个固定物品分配局面，双方各有私有分值。让两个相同模型分别使用“尽快达成一致”和“按委托卡协商”提示，对同一个固定对手各跑一遍。盲评己方得分、总效用、成交率、底价泄露和越权次数。只在模拟环境使用虚构身份与筹码；样本小就报告个案差异，不宣称训练出了 SocialRL。

**成功证据：** 20 个局面、双方私有分值、提示和盲评表均保存；委托卡组在不增加泄露与越权的前提下改善至少一个预先指定的效用指标。

**停止线：** 对手或场景在两组间变化、指标在看完结果后才选择，或实验触及真实身份、金钱和对外承诺时，停止比较。

## 误区

- 战略性不等于欺骗。隐瞒私人底价可以合规，捏造事实和未经授权承诺则是另一条边界。
- 高己方得分不自动代表好代理，还要看授权、隐私、公平与长期影响。
- 从一种博弈学到的策略不会稳定迁移到所有社交场景；原文也报告跨任务迁移不均匀。

## 原文与证据边界

页面披露的是研究团队设计的游戏、奖励与留出评测。其对手、提示、训练资源和社会规范都限定了结论。本文只把可审计的委托与评测结构迁移到学习实践，不建议在未告知对方时部署自动谈判。

本文是原创中文实践解读，不是逐句译文。英文原文见 [Microsoft Research 官方文章](https://www.microsoft.com/en-us/research/articles/from-passive-delegates-to-strategic-negotiators-reinforcing-social-reasoning-in-small-language-models/)。
