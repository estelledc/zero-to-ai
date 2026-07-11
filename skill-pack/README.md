# Learn Journal Skill Pack

> 让 AI 编程助手变成你的结构化学习伙伴。

## 30 秒上手

1. 把 `skill-pack/` 文件夹复制到你的项目根目录（或任意空文件夹）
2. 根据你用的 AI 工具，把对应的适配文件复制到根目录：
   - Claude Code → 复制 `adapters/claude-code/CLAUDE.md` 到根目录，并把 `skills/` 内容复制到 `.claude/skills/`
   - Codex → 复制 `adapters/codex/AGENTS.md` 到根目录
   - CatDesk → 复制 `adapters/catdesk/CATDESK.md` 到根目录
   - Cursor → 复制 `adapters/cursor/.cursorrules` 到根目录
3. 复制 `config.yaml.example` 为 `config.yaml`，填入你的名字和学习方向
4. 打开 AI 助手，说："帮我初始化学习空间"
5. 回答几个问题，开始使用

详细安装说明见 [SETUP.md](SETUP.md)。

## 它能做什么

- **日终回顾**：每天下班前，AI 引导你回顾今天做了什么、学了什么
- **知识捕获**：聊天中提到新概念，AI 帮你结构化记录成学习笔记
- **智能分类**：自动判断内容应该记到日报、学习笔记还是问题记录
- **教学引导**：用六步讲解法帮你真正理解新概念（不是死记硬背）
- **交叉引用**：新笔记自动关联已有知识，形成知识网络
- **间隔复习**（第二周自动开启）：追踪掌握度，提醒你复习快忘的内容

## 文件结构

```
skill-pack/
├── protocols/          ← 核心方法论（AI 遵循的规则）
├── templates/          ← 工件模板（日报、笔记等的格式）
├── skills/             ← 功能描述（AI 在什么时候做什么）
├── adapters/           ← 平台适配（不同 AI 工具的入口文件）
└── scripts/            ← 可选工具脚本
```

## 你的学习空间长这样

初始化后，你的文件夹会变成：

```
my-learning/
├── config.yaml         ← 你的配置
├── daily/              ← 每天的工作日志
├── learnings/          ← 学到的新知识
├── problems/           ← 解决过的问题
└── sources/            ← 学习材料收藏
```

所有内容都是普通 markdown 文件，你可以用任何编辑器打开。

## 兼容性

| AI 工具        | 支持状态                                           |
| -------------- | -------------------------------------------------- |
| Claude Code    | ✅ 结构与安装 smoke 已验证；真实账户交互待人工验收 |
| OpenAI Codex   | ⚠️ 仅有规则适配器，尚未完成官方文档复核            |
| CatDesk        | ⚠️ 仅有规则适配器，未做真实环境验收                |
| Cursor         | ⚠️ 仅有规则适配器，未做真实环境验收                |
| Windsurf       | ⚠️ 未测试（理论兼容）                              |
| GitHub Copilot | ⚠️ 未测试                                          |

## 来源

本 skill 包从作者的私有学习工作流中提炼而来，经过 50+ 天实际使用验证。

这里的 50+ 天只证明原作者工作流，不等于所有平台均已验证。每个平台的当前状态以上表为准。
