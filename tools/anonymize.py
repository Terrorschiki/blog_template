"""把模板仓库里的个人信息替换成中性占位符 XXXX。

用法（在仓库根目录执行）：
    python tools/anonymize.py          # 预览（不写入）
    python tools/anonymize.py --apply  # 实际写入

替换规则见 RULES。三个版本共用同一套内容，因此规则会应用到所有版本目录。
"""

import argparse
import sys
from pathlib import Path

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

ROOT = Path(__file__).resolve().parent.parent
VERSIONS = ["v1-terminal", "v2-editorial", "v3-brutalist"]

# 只在这些文件里做替换（不含 tools/ 与 README）
TARGETS = [
    "index.html",
    "lang/zh.json",
    "lang/en.json",
    "assets/js/main.js",
]

# 被替换的原始串刻意用拼接写法，避免脚本自身又留下个人信息痕迹。
_OLD_NAME = "Terro" + "rschiki"          # 原站点名（首字母大写形式）
_OLD_NAME_L = "terro" + "rschiki"        # 全小写形式
_OLD_PROMPT = _OLD_NAME_L + "@blog"      # 终端提示符

# 顺序重要：更具体的串要排在更宽泛的串前面
RULES = [
    # 终端提示符
    (_OLD_PROMPT, "XXXX@blog"),
    # 邮箱占位符（统一成 XXXX）
    ("your-email@example.com", "XXXX@example.com"),
    ("your-name/your-repo", "XXXX/XXXX"),
    # 站点名（大小写两种写法）
    (_OLD_NAME, "XXXX"),
    (_OLD_NAME_L, "XXXX"),
]


def process(path: Path, apply: bool) -> dict:
    """处理单个文件，返回 {替换规则: 次数} 统计。"""
    text = path.read_text(encoding="utf-8")
    original = text
    counts = {}
    for old, new in RULES:
        n = text.count(old)
        if n:
            counts[(old, new)] = counts.get((old, new), 0) + n
            text = text.replace(old, new)
    if text != original and apply:
        path.write_text(text, encoding="utf-8", newline="\n")
    return counts


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--apply", action="store_true", help="实际写入（默认只预览）")
    args = ap.parse_args()

    total = 0
    for v in VERSIONS:
        vdir = ROOT / v
        if not vdir.is_dir():
            print(f"跳过（不存在）：{v}")
            continue

        merged = {}
        for rel in TARGETS:
            p = vdir / rel
            if not p.is_file():
                continue
            for key, n in process(p, args.apply).items():
                merged[key] = merged.get(key, 0) + n

        print(f"  {v}")
        if not merged:
            print("    （无需替换）")
        for (old, new), n in merged.items():
            print(f"    {old}  ->  {new}   ({n} 处)")
            total += n

    print()
    if total == 0:
        print("没有需要替换的内容（可能已经处理过）。")
    else:
        print(f"共 {total} 处" + ("已写入。" if args.apply else "，加 --apply 实际写入。"))


if __name__ == "__main__":
    main()
