#!/usr/bin/env python3
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "skill-pack"
OUTPUT = ROOT / "public" / "downloads" / "skill-pack.zip"
FIXED_TIME = (2026, 7, 10, 0, 0, 0)


def main() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    with ZipFile(OUTPUT, "w", compression=ZIP_DEFLATED, compresslevel=9) as archive:
        for source in sorted(path for path in SOURCE.rglob("*") if path.is_file()):
            relative = source.relative_to(SOURCE).as_posix()
            info = ZipInfo(f"skill-pack/{relative}", FIXED_TIME)
            info.compress_type = ZIP_DEFLATED
            mode = 0o755 if relative.endswith((".sh", ".py")) else 0o644
            info.external_attr = mode << 16
            archive.writestr(info, source.read_bytes())
    print(f"Built {OUTPUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
