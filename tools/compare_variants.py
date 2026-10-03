"""校验三个模板版本：内容文件应逐字一致，只有样式不同。

用法（在仓库根目录执行）：
    python tools/compare_variants.py

为什么需要它
------------
三个版本共用同一套 index.html / main.js / lang/*.json，差异只在
assets/css/style.css。若某次改动只落在一个版本里，会造成「换个版本内容就变了」
的困惑。本脚本用来发现这种不一致。
"""

import hashlib
import sys
from pathlib import Path

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

ROOT = Path(__file__).resolve().parent.parent

VERSIONS = ["v1-terminal", "v2-editorial", "v3-brutalist"]
NAMES = {
    "v1-terminal": "V1 终端编辑器",
    "v2-editorial": "V2 温润刊物",
    "v3-brutalist": "V3 霓虹潮玩",
}

# 应当逐字一致的内容文件
CONTENT_FILES = [
    "index.html",
    "lang/zh.json",
    "lang/en.json",
    "assets/js/main.js",
    "assets/js/i18n.js",
    "assets/images/avatar.svg",
]

# 各版本自己的样式
STYLE_FILE = "assets/css/style.css"


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()[:16]


def main() -> int:
    present = [v for v in VERSIONS if (ROOT / v).is_dir()]
    if len(present) < 2:
        print(f"只找到 {len(present)} 个版本目录，无需比对。")
        return 0

    ok = True

    print("=" * 66)
    print("内容一致性（各版本应逐字相同）")
    print("=" * 66)
    reference = present[0]
    for f in CONTENT_FILES:
        base = (ROOT / reference / f)
        if not base.is_file():
            print(f"  ✗ {f}: 在 {reference} 中缺失")
            ok = False
            continue
        want = digest(base)
        row = []
        for v in present:
            p = ROOT / v / f
            if not p.is_file():
                row.append(f"{v}=缺失")
                ok = False
            else:
                got = digest(p)
                row.append(f"{v}={'同' if got == want else '异'}")
                if got != want:
                    ok = False
        print(f"  {f:<28} {want}  " + "  ".join(row))

    print()
    print("=" * 66)
    print("样式差异（各版本应各不相同）")
    print("=" * 66)
    seen = {}
    for v in present:
        p = ROOT / v / STYLE_FILE
        if not p.is_file():
            print(f"  ✗ {v}: 缺少 {STYLE_FILE}")
            ok = False
            continue
        d = digest(p)
        lines = len(p.read_text(encoding="utf-8").splitlines())
        seen.setdefault(d, []).append(v)
        print(f"  {NAMES.get(v, v):<16} {d}  {lines:>5} 行  {p.stat().st_size:>6} B")

    dup = {d: vs for d, vs in seen.items() if len(vs) > 1}
    if dup:
        ok = False
        print()
        for d, vs in dup.items():
            print(f"  ✗ 样式重复：{', '.join(vs)} 的 {STYLE_FILE} 完全相同")

    print()
    print("=" * 66)
    if ok:
        print("结论：三个版本内容一致、样式各自独立 ✓")
    else:
        print("结论：存在不一致，见上 ✗")
    print("=" * 66)
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
