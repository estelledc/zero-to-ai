#!/usr/bin/env python3
"""Minimal PreToolUse fixture: block reads of common secret files."""

import json
import sys

payload = json.load(sys.stdin)
path = str(payload.get("tool_input", {}).get("file_path", ""))
if path.endswith("/.env") or "/secrets/" in path:
    print("Blocked secret-file read", file=sys.stderr)
    raise SystemExit(2)
