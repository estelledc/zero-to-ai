#!/usr/bin/env python3
"""
Learn Journal 笔记质量检查（精简版）
用法：python lint-notes.py [目录路径]
默认检查当前目录下的 learnings/ 和 sources/

检查规则：
- learnings/*.md 必须含"来源"字段
- learnings/*.md 文件名必须 kebab-case
- sources/*.md 必须含"状态"字段
- 内部 .md 链接必须能解析（无死链）
"""

import os
import re
import sys
from pathlib import Path


def has_field_in_header(content: str, field: str) -> bool:
    """检查文件头部（前 15 行）是否包含指定字段标记。
    支持格式：**字段：** 或 **字段:** 或 字段: 或 字段：
    """
    header_lines = content.split("\n")[:15]
    header = "\n".join(header_lines)
    # 匹配 **来源：** 或 **来源:** 或 来源: 或 来源：
    pattern = rf"(\*\*)?{re.escape(field)}(：|:)"
    return bool(re.search(pattern, header))


def main():
    root = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(".")
    errors = []

    # 检查 learnings/
    learnings_dir = root / "learnings"
    if learnings_dir.exists():
        for f in learnings_dir.glob("*.md"):
            if f.name.startswith("_"):
                continue

            # 检查文件名 kebab-case
            stem = f.stem
            if stem != stem.lower() or " " in stem or "_" in stem:
                errors.append(f"[命名] {f}: 文件名应为 kebab-case（小写+连字符）")

            # 检查"来源"字段（只看文件头部）
            content = f.read_text(encoding="utf-8")
            if not has_field_in_header(content, "来源"):
                errors.append(f"[缺字段] {f}: 缺少「来源」字段")

    # 检查 sources/
    sources_dir = root / "sources"
    if sources_dir.exists():
        for f in sources_dir.glob("*.md"):
            if f.name.startswith("_"):
                continue

            content = f.read_text(encoding="utf-8")
            if not has_field_in_header(content, "状态"):
                errors.append(f"[缺字段] {f}: 缺少「状态」字段")

    # 检查内部链接（死链检测）
    md_files = list(root.rglob("*.md"))
    link_pattern = re.compile(r"\[([^\]]*)\]\(([^)]+)\)")

    for f in md_files:
        content = f.read_text(encoding="utf-8")
        # 用逐行状态机过滤代码块内容（支持嵌套代码块）
        lines_outside_code = []
        in_code_block = False
        for line in content.split("\n"):
            stripped = line.strip()
            if stripped.startswith("```"):
                in_code_block = not in_code_block
                continue
            if not in_code_block:
                lines_outside_code.append(line)
        content_no_code = "\n".join(lines_outside_code)

        for match in link_pattern.finditer(content_no_code):
            link_target = match.group(2)
            # 跳过外部链接和锚点
            if link_target.startswith("http") or link_target.startswith("#"):
                continue
            # 解析相对路径
            target_path = (f.parent / link_target).resolve()
            # 去掉锚点部分
            target_path = Path(str(target_path).split("#")[0])
            if not target_path.exists():
                errors.append(f"[死链] {f}: 链接 {link_target} 指向不存在的文件")

    # 输出结果
    if errors:
        print(f"发现 {len(errors)} 个问题：\n")
        for e in errors:
            print(f"  {e}")
        print(f"\n共 {len(errors)} 个问题需要修复。")
        sys.exit(1)
    else:
        print("所有检查通过！")
        sys.exit(0)


if __name__ == "__main__":
    main()
