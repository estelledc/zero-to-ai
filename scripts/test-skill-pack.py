#!/usr/bin/env python3
import json
import stat
import subprocess
import tempfile
from pathlib import Path, PurePosixPath
from zipfile import ZipFile

ROOT = Path(__file__).resolve().parents[1]
ARCHIVE = ROOT / "public" / "downloads" / "skill-pack.zip"
SKILLS = {"capture", "daily-review", "health-check", "learn"}


def fail(message: str) -> None:
    raise SystemExit(message)


def main() -> None:
    with ZipFile(ARCHIVE) as archive:
        names = archive.namelist()
        if not names or any(PurePosixPath(name).parts[0] != "skill-pack" for name in names):
            fail("ZIP must have exactly the skill-pack root")
        for entry in archive.infolist():
            path = PurePosixPath(entry.filename)
            if path.is_absolute() or ".." in path.parts:
                fail(f"unsafe ZIP path: {entry.filename}")
            mode = entry.external_attr >> 16
            if stat.S_ISLNK(mode):
                fail(f"symlink is not allowed: {entry.filename}")

        required = {
            "skill-pack/README.md",
            "skill-pack/SETUP.md",
            "skill-pack/adapters/claude-code/CLAUDE.md",
            "skill-pack/adapters/codex/AGENTS.md",
            "skill-pack/scripts/init.sh",
            *(f"skill-pack/skills/{name}/SKILL.md" for name in SKILLS),
        }
        missing = sorted(required - set(names))
        if missing:
            fail(f"missing ZIP entries: {json.dumps(missing, ensure_ascii=False)}")
        legacy = [name for name in names if name.startswith("skill-pack/skills/") and name.endswith(".md") and not name.endswith("/SKILL.md")]
        if legacy:
            fail(f"legacy flat skill files found: {legacy}")
        for name in SKILLS:
            content = archive.read(f"skill-pack/skills/{name}/SKILL.md").decode()
            if not content.startswith("---\n") or "description:" not in content.split("---", 2)[1]:
                fail(f"invalid SKILL.md frontmatter: {name}")

        with tempfile.TemporaryDirectory() as directory:
            archive.extractall(directory)
            pack = Path(directory) / "skill-pack"
            target = Path(directory) / "journal-smoke"
            subprocess.run(["bash", str(pack / "scripts/init.sh"), str(target)], cwd=pack, check=True)
            for expected in ("config.yaml", "daily", "learnings", "problems", "sources"):
                if not (target / expected).exists():
                    fail(f"init smoke missing {expected}")

    print(f"Skill pack smoke passed ({len(names)} files)")


if __name__ == "__main__":
    main()
