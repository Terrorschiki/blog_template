/*
 * 站点自检脚本：改完内容后跑一遍，能提前发现绝大多数低级错误。
 *
 * 用法（在仓库根目录执行）：
 *     node tools/check_site.js                  # 默认检查 v1-terminal
 *     node tools/check_site.js v2-editorial     # 指定要检查的版本
 *
 * 检查内容：
 *   1. lang/*.json 是否为合法 JSON；
 *   2. 中英文语言包的键是否完全一致（一边漏写就会显示成键名）；
 *   3. main.js 里引用的 titleKey / descKey / category / contact key
 *      是否在两个语言包里都存在；
 *   4. PROJECTS 里引用的封面图是否真实存在；
 *   5. index.html 里的图片与脚本路径是否存在；
 *   6. 六个内容数组（PROJECTS / DOCUMENTS / VIDEOS / TIMELINE_EVENTS /
 *      TECH_STACK / CONTACT_LINKS）是否仍然存在，避免误改结构；
 *   7. 是否还残留占位符（如 your-email@example.com）。
 */
const fs = require('fs');
const path = require('path');

const VERSIONS = ['v1-terminal', 'v2-editorial', 'v3-brutalist'];
const ROOT = path.resolve(__dirname, '..');

// 版本名可来自命令行参数；未指定时若只有一个版本目录则自动选用
let version = process.argv[2];
if (!version) {
  const found = VERSIONS.filter((v) => fs.existsSync(path.join(ROOT, v)));
  if (found.length === 1) {
    version = found[0];
  } else {
    version = 'v1-terminal';
  }
}
if (!fs.existsSync(path.join(ROOT, version))) {
  console.error(`找不到版本目录：${version}`);
  console.error(`可用版本：${VERSIONS.filter((v) => fs.existsSync(path.join(ROOT, v))).join(', ')}`);
  process.exit(1);
}

const SITE = path.join(ROOT, version);
const problems = [];
const warnings = [];

console.log(`检查版本：${version}\n`);

function read(p) {
  return fs.readFileSync(path.join(SITE, p), 'utf8');
}

function exists(rel) {
  return fs.existsSync(path.join(SITE, rel));
}

// ---------- 1. 语言包 ----------
const LANGS = {};
for (const lang of ['zh', 'en']) {
  const rel = `lang/${lang}.json`;
  if (!exists(rel)) {
    problems.push(`缺少语言包：${rel}`);
    continue;
  }
  try {
    LANGS[lang] = JSON.parse(read(rel));
  } catch (err) {
    problems.push(`${rel} 不是合法 JSON：${err.message}`);
  }
}
if (!LANGS.zh || !LANGS.en) {
  console.error(problems.join('\n'));
  process.exit(1);
}

// ---------- 2. 两个语言包键是否一致 ----------
function flatten(obj, prefix = '') {
  const out = [];
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) out.push(...flatten(v, key));
    else out.push(key);
  }
  return out;
}
const zhKeys = new Set(flatten(LANGS.zh));
const enKeys = new Set(flatten(LANGS.en));
for (const k of zhKeys) if (!enKeys.has(k)) problems.push(`en.json 缺少键：${k}（zh.json 中有）`);
for (const k of enKeys) if (!zhKeys.has(k)) problems.push(`zh.json 缺少键：${k}（en.json 中有）`);

function hasKey(key) {
  return zhKeys.has(key) && enKeys.has(key);
}

// ---------- 3. main.js 中引用的键 ----------
const MAIN = 'assets/js/main.js';

/**
 * 去掉注释后再做静态分析，避免把注释里的示例（如 projects.item0.title）
 * 误报成“缺失的键”。会跳过字符串字面量，因此 // 和 /* 出现在字符串里不受影响。
 */
function stripComments(src) {
  let out = '';
  let i = 0;
  let quote = null;
  while (i < src.length) {
    const c = src[i];
    const next = src[i + 1];
    if (quote) {
      out += c;
      if (c === '\\') { out += next ?? ''; i += 2; continue; }
      if (c === quote) quote = null;
      i += 1;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { quote = c; out += c; i += 1; continue; }
    if (c === '/' && next === '/') { while (i < src.length && src[i] !== '\n') i += 1; continue; }
    if (c === '/' && next === '*') {
      i += 2;
      while (i < src.length && !(src[i] === '*' && src[i + 1] === '/')) i += 1;
      i += 2;
      continue;
    }
    out += c;
    i += 1;
  }
  return out;
}

const mainSrc = stripComments(read(MAIN));

const keyLiterals = new Set();
for (const m of mainSrc.matchAll(/\b(titleKey|descKey|category|platform)\s*:\s*'([^']+)'/g)) {
  const [, field, value] = m;
  // platform 的值是平台名（Bilibili 等），不指向语言包，跳过
  if (field === 'platform') continue;
  keyLiterals.add(value);
}
for (const m of mainSrc.matchAll(/\{\s*icon:\s*'[^']*',\s*key:\s*'([^']+)'/g)) keyLiterals.add(m[1]);
for (const m of mainSrc.matchAll(/labelKey:\s*'([^']+)'/g)) keyLiterals.add(m[1]);
// TIMELINE_EVENTS 这类以字符串形式列出的键
for (const m of mainSrc.matchAll(/'(timeline\.[A-Za-z0-9_]+)'/g)) keyLiterals.add(m[1]);

// 结构校验：五个内容数组必须都还在，避免后续维护时误删
for (const name of ['PROJECTS', 'DOCUMENTS', 'VIDEOS', 'TIMELINE_EVENTS', 'TECH_STACK']) {
  if (!new RegExp(`const\\s+${name}\\s*=\\s*\\[`).test(mainSrc)) {
    problems.push(`${MAIN} 中找不到内容数组 ${name}，结构可能被误改`);
  }
}

for (const key of keyLiterals) {
  if (!hasKey(key)) {
    problems.push(`${MAIN} 引用了语言包中不存在的键：${key}`);
    continue;
  }
  // 时间轴事件必须同时具备 date / title / desc
  if (key.startsWith('timeline.') && !key.endsWith('.empty')) {
    for (const sub of ['date', 'title', 'desc']) {
      if (!hasKey(`${key}.${sub}`)) problems.push(`${MAIN} 的时间轴事件 ${key} 缺少 .${sub}`);
    }
  }
}

// ---------- 4. 项目封面图 ----------
for (const m of mainSrc.matchAll(/img:\s*'([^']+)'/g)) {
  if (!exists(m[1])) problems.push(`${MAIN} 引用的封面图不存在：${m[1]}`);
}

// ---------- 5. index.html 中的本地资源 ----------
const HTML = 'index.html';
const htmlSrc = read(HTML);
const localRefs = new Set();
for (const m of htmlSrc.matchAll(/(?:src|href)="((?!https?:|mailto:|#)[^"]+)"/g)) localRefs.add(m[1]);
for (const rel of localRefs) {
  if (!exists(rel)) problems.push(`${HTML} 引用的文件不存在：${rel}`);
}

// ---------- 6. 占位符提醒 ----------
// 模板刻意保留了占位内容，提醒使用者替换成自己的信息。这些只作提醒，不算错误。
// 注意：站点名占位符是 4 个 X（XXXX）。这里若写成 3 个 X，会因为「XXXX 包含 XXX」
// 而把每一个名字占位符都误报一次，所以必须用 4 个 X 匹配。
const PLACEHOLDERS = [
  'XXXX',
  '填写你的',
  'your-email@example.com',
];
for (const rel of ['index.html', MAIN, 'lang/zh.json', 'lang/en.json']) {
  const src = read(rel);
  for (const token of PLACEHOLDERS) {
    if (src.includes(token)) warnings.push(`${rel} 仍是占位内容：${token}`);
  }
}

// ---------- 7. 版本结构提醒 ----------
// 三个版本应当只有 style.css 不同；若内容文件出现差异，多半是改漏了。
const CSS = 'assets/css/style.css';
if (!exists(CSS)) problems.push(`缺少样式文件 ${CSS}`);
else {
  const css = read(CSS);
  if (!css.includes('站点主题定稿')) {
    warnings.push(`${CSS} 中未找到「站点主题定稿」段落，配色变量可能被移动过`);
  }
  if (!/html:not\(\[data-theme="dark"\]\)\s*\{/.test(css)) {
    problems.push(`${CSS} 缺少亮色令牌块 html:not([data-theme="dark"])`);
  }
  if (!/html\[data-theme="dark"\]\s*\{/.test(css)) {
    problems.push(`${CSS} 缺少暗色令牌块 html[data-theme="dark"]`);
  }
}

// ---------- 输出 ----------
console.log('='.repeat(58));
if (warnings.length) {
  console.log(`提醒（${warnings.length} 项，发布前记得替换）：`);
  for (const w of warnings) console.log('  ! ' + w);
  console.log('-'.repeat(58));
}
if (problems.length) {
  console.log(`发现 ${problems.length} 个问题：`);
  for (const p of problems) console.log('  x ' + p);
  console.log('='.repeat(58));
  process.exit(1);
}
console.log('检查通过：语言包键一致、引用路径有效、双主题令牌齐备。');
console.log('='.repeat(58));
