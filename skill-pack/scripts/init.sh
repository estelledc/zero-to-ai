#!/bin/bash
# Learn Journal 初始化脚本
# 用法：bash init.sh [目标目录]
# 如果不指定目标目录，默认在当前目录创建

set -e

TARGET="${1:-.}"

echo "=== Learn Journal 初始化 ==="
echo ""

# 创建学习空间目录
mkdir -p "$TARGET/daily"
mkdir -p "$TARGET/learnings"
mkdir -p "$TARGET/problems"
mkdir -p "$TARGET/sources"

echo "已创建目录结构："
echo "  daily/      — 每天的工作日志"
echo "  learnings/  — 学到的新知识"
echo "  problems/   — 解决过的问题"
echo "  sources/    — 学习材料收藏"
echo ""

# 创建默认 config.yaml（如果不存在）
if [ ! -f "$TARGET/config.yaml" ]; then
  cat > "$TARGET/config.yaml" << 'EOF'
# Learn Journal 配置
# 请根据自己的情况修改以下内容

user:
  name: ""              # 你的名字
  direction: ""         # 学习方向（如：前端开发、后端开发、数据分析）
  level: beginner       # beginner / intermediate / experienced
  language: zh          # zh / en

modules:
  daily: true           # 日报
  learnings: true       # 学习笔记
  problems: true        # 问题记录
  sources: true         # 学习材料
  review: false         # 间隔复习（建议积累 5 篇笔记后开启）
  quality_check: false  # 质量门禁（建议使用一周后开启）

style:
  analogy_first: true   # 解释概念时先用类比
  ask_why: true         # 追问为什么
  socratic: true        # 苏格拉底式验证
EOF
  echo "已创建 config.yaml — 请编辑填入你的信息"
else
  echo "config.yaml 已存在，跳过"
fi

echo ""
echo "初始化完成！"
echo ""
echo "下一步："
echo "  1. 编辑 config.yaml 填入你的名字和学习方向"
echo "  2. 将平台适配文件复制到项目根目录："
echo "     - Claude Code: cp adapters/claude-code/CLAUDE.md ."
echo "                    mkdir -p .claude/skills && cp -R skills/. .claude/skills/"
echo "     - Codex:       cp adapters/codex/AGENTS.md ."
echo "     - Cursor:      cp adapters/cursor/.cursorrules ."
echo "     - CatDesk:     参考 SETUP.md 中的说明"
echo "  3. 开始和 AI 对话，说\"今天学了 X\"试试看"
