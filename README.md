# 个人博客模板 · 三种风格

纯静态个人博客 / 主页模板，**同一套内容与逻辑，三种完全不同的视觉风格**。
不需要 Node.js、不需要构建步骤、不需要后端，改完文案与图片即可直接部署到 GitHub Pages。

每个版本都自带**亮色（白日）与暗色（黑夜）两套完整配色**，右上角按钮可一键切换。

---

## 目录

- [三种风格一览](#三种风格一览)
- [如何打开（本地预览）](#如何打开本地预览)
- [如何选择与使用](#如何选择与使用)
- [如何修改成你自己的内容](#如何修改成你自己的内容)
- [部署到 GitHub Pages](#部署到-github-pages)
- [目录结构](#目录结构)
- [常见问题](#常见问题)

---

## 三种风格一览

| 版本 | 目录 | 设计取向 | 最适合 |
| --- | --- | --- | --- |
| **V1 终端编辑器** | [`v1-terminal/`](v1-terminal/) | 深夜代码编辑器：等宽字体、`~/Projects` 路径式标题、`//` 注释式空状态、Git 提交式时间轴、网格背景 | 技术博客、开发者求职；受众以程序员为主时辨识度最高 |
| **V2 温润刊物** | [`v2-editorial/`](v2-editorial/) | 纸质刊物：衬线标题、暖白纸张底色与纸纹、居中对称版式、发丝分隔线、Logo 换成纯文字签名 | 偏内容型的博客、写长文；希望给人沉稳专业印象 |
| **V3 霓虹潮玩** | [`v3-brutalist/`](v3-brutalist/) | 新粗野主义：高饱和撞色、粗黑描边、硬阴影（不模糊）、胶囊标签、波点背景 | 做自媒体 / 视频 / 设计 / 前端方向，想让人一眼记住 |

### 各自的双主题配色

| 版本 | ☀️ 亮色 | 🌙 暗色 |
| --- | --- | --- |
| V1 终端编辑器 | 浅色代码编辑器：`#f6f8fa` 底 / 深蓝 `#0969da` | 深夜编辑器：`#0b0e14` 底 / 亮蓝 `#58a6ff` |
| V2 温润刊物 | 暖白纸张：`#f7f3ec` / 赭石 `#9a5b33` | 暖黑：`#1a1714` / 浅赭 `#d39a67` |
| V3 霓虹潮玩 | 奶油海报：`#fdf6e8` / 亮粉 `#e0114b` | 夜店霓虹：`#131313` / 荧光粉 `#ff4d7e` + 浅色描边 |

> 暗色并非简单反色。V3 在暗色下把**描边与硬阴影改用浅色**（否则黑描边会糊进背景）；
> V2 保留纸质气质、改用暖黑；V1 的亮色是完整的 VS Code Light+ 配色。

### 三个版本共有的功能

- 六个并列栏目：**项目合集 / 文章 / 自媒体视频 / 经历时间轴 / 技术栈 / 联系方式**
- 中文 / English 一键切换（`lang/zh.json`、`lang/en.json`）
- 亮色 / 暗色主题切换（右上角按钮，选择会被浏览器记住）
- 滚动进入动效、响应式布局（桌面 / 平板 / 手机）
- 模板作者的示例内容已全部清空，各栏目显示友好占位提示

---

## 如何打开（本地预览）

> ⚠️ **不要直接双击 `index.html`。**
> 页面文案是通过 `fetch` 从 `lang/*.json` 加载的，`file://` 协议下浏览器会因安全策略拒绝读取，
> 结果就是**一片空白**。必须用本地静态服务器打开。

### 方法一：Python（推荐，最通用）

```bash
# 进入仓库根目录后执行
python -m http.server 8000
```

然后按版本访问对应地址：

| 版本 | 打开地址 |
| --- | --- |
| V1 终端编辑器 | <http://localhost:8000/v1-terminal/> |
| V2 温润刊物 | <http://localhost:8000/v2-editorial/> |
| V3 霓虹潮玩 | <http://localhost:8000/v3-brutalist/> |

### 方法二：Node.js

```bash
npx serve .
# 然后访问 http://localhost:3000/v1-terminal/ 等
```

### 方法三：VS Code Live Server 插件

右键某个版本目录下的 `index.html` → **Open with Live Server**。
（注意要右键版本目录里的那份，而不是仓库根目录）

### 方法四：只做本地预览、不装任何东西

逐个进入版本目录再起服务器，例如：

```bash
cd v2-editorial
python -m http.server 8000
# 访问 http://localhost:8000/
```

### 打开之后可以试什么

- 点右上角 **☀️ / 🌙 按钮**切换白日 / 黑夜
- 点右上角 **「中文 / English」**切换语言
- 点导航栏切换栏目，页面会平滑滚动
- 手机上打开会自动适配（导航栏折成两行）

---

## 如何选择与使用

三种风格**互不依赖**，各自是完整的站点。选一个用即可：

**方式 A：只要一个版本（推荐给使用者）**

```bash
git clone https://github.com/XXXX/blog_template.git
# 挑一个版本，把它的内容拷到你的仓库根目录
cp -r blog_template/v2-editorial/* /path/to/your-repo/
```

> 注意：部署时 **`index.html` 必须在仓库根目录**，所以是把**版本目录里的内容**拷出来，
> 而不是把整个版本目录拷过去。

**方式 B：三个都要，并排对比（推荐给挑选阶段）**

直接克隆整个仓库，按上面的「如何打开」逐个访问即可。

**方式 C：作为参考，只借用某个部件**

例如只想要 V3 的配色，可以把 `v3-brutalist/assets/css/style.css` 末尾「站点主题定稿」那一段
（约 400 行）复制到你自己的 `style.css` 末尾。三个版本的区别**只在样式**，
`index.html`、`assets/js/*`、`lang/*` 完全一致。

---

## 如何修改成你自己的内容

内容分两个地方存放：

| 你要改的东西 | 文件 | 说明 |
| --- | --- | --- |
| **有哪些内容、顺序、图片、链接** | `assets/js/main.js` | 顶部的 6 个数组 |
| **每张卡片上显示的文字** | `lang/zh.json`、`lang/en.json` | 用 `.` 分层的文案键 |

> `main.js` 里的 `titleKey` / `descKey` 就是语言包里的键名。
> **两边必须同时改、键名完全一致**，否则页面上会直接显示键名。

### 快速上手：改这几处就能变成你自己的站点

1. **站点标题**：`index.html` 里的 `<title>` 和 `<meta name="description">`
2. **终端 Logo**（V1/V3 可见）：`index.html` 中 `<span class="terminal-user">` 里的 `XXXX@blog`
3. **头像**：把图片放进 `assets/images/`，改 `index.html` 里的 `<img class="avatar">` 与 `<link rel="icon">`
4. **自我介绍**：`lang/zh.json` 与 `lang/en.json` 的 `intro.title` / `intro.desc`
5. **页脚**：同上两个文件的 `footer.copyright`
6. **联系方式**：`assets/js/main.js` 的 `CONTACT_LINKS`（邮箱、GitHub、B站、知乎等，已写成注释，取消注释即可）

### 写第一篇文章

编辑 `assets/js/main.js` 的 `DOCUMENTS`：

```js
const DOCUMENTS = [
  {
    titleKey: 'documents.item0.title',
    descKey: 'documents.item0.desc',
    links: [
      { href: 'https://zhuanlan.zhihu.com/p/123456789', labelKey: 'projects.links.zhihu', icon: 'fab fa-zhihu' },
    ],
  },
];
```

再到 `lang/zh.json` 与 `lang/en.json` 补上对应键：

```json
"documents": {
  "title": "文章",
  "empty": "文章整理中，敬请期待。",
  "item0": { "title": "我的第一篇文章", "desc": "这篇文章讲的是……" }
}
```

**数组里有了内容，「文章整理中」这句空状态提示会自动消失。**

### 其它栏目

同样是「`main.js` 加数据 + `lang/*.json` 加文案」两步：

| 栏目 | 数组 | 备注 |
| --- | --- | --- |
| 项目合集 | `PROJECTS` | `img` 可省略（变纯文字卡片）；`tags` 直接写文字 |
| 自媒体视频 | `VIDEOS` | `platform` 可选，显示成平台角标；链接跳转到 B站/抖音/YouTube |
| 经历时间轴 | `TIMELINE_EVENTS` | 字符串数组，**顺序即展示顺序** |
| 技术栈 | `TECH_STACK` | 按 `category` 分组，`items` 写名称与图标 |
| 联系方式 | `CONTACT_LINKS` | `icon` / `key`（语言包键）/ `link` |

图标名到 [Font Awesome 6](https://fontawesome.com/search?o=r&m=free) 搜索，复制形如 `fab fa-github` 的名字。

### 改配色

每个版本的 `assets/css/style.css` **末尾**都有一段「站点主题定稿」，那里集中定义了该风格的全部颜色变量：

```css
html:not([data-theme="dark"]) {   /* 亮色 */
  --bg-body: #f6f8fa;
  --primary: #0969da;
  ...
}
html[data-theme="dark"] {          /* 暗色 */
  --bg-body: #0b0e14;
  --primary: #58a6ff;
  ...
}
```

改这几个变量即可换肤。**注意改亮色时要同步改暗色**，否则暗色模式下会不协调。

---

## 部署到 GitHub Pages

以你自己的仓库为例：

1. 把选定版本的内容放到仓库**根目录**（`index.html` 与 `assets/`、`lang/` 同级）
2. 推送到 GitHub
3. 仓库 **Settings → Pages**
4. **Source** 选 `Deploy from a branch`，**Branch** 选 `main` + `/ (root)`，保存
5. 等 1–3 分钟，访问 `https://<你的用户名或组织名>.github.io/<仓库名>/`

> 若仓库名恰好是 `<你的用户名>.github.io`，站点会发布在 `https://<你的用户名>.github.io/`（根域名）。

### 一个实用建议：给静态资源加版本号

GitHub Pages 对静态资源设置了 `Cache-Control: max-age=600`，而 `style.css` / `main.js`
文件名不带版本号，因此**改完样式后浏览器可能仍在用旧缓存**。可以这样加版本号：

```html
<link rel="stylesheet" href="assets/css/style.css?v=2">
<script src="assets/js/main.js?v=2"></script>
```

改样式时把 `v=2` 递增即可让所有访客立刻拿到新文件。

---

## 目录结构

```text
blog_template/
├── v1-terminal/                # 版本一：终端编辑器
│   ├── index.html
│   ├── assets/
│   │   ├── css/style.css       # 全部样式与配色变量
│   │   ├── js/main.js          # ★ 内容配置区（6 个数组）
│   │   ├── js/i18n.js          # 中英文切换
│   │   └── images/avatar.svg   # 占位头像，换成你自己的照片
│   └── lang/
│       ├── zh.json             # ★ 中文文案
│       └── en.json             # ★ 英文文案
├── v2-editorial/               # 版本二：温润刊物（结构同上）
├── v3-brutalist/               # 版本三：霓虹潮玩（结构同上）
├── tools/                      # 可选的开发期自检脚本
└── README.md
```

三个版本的 `index.html` / `assets/js/*` / `lang/*` **完全一致**，只有 `assets/css/style.css` 不同。

### 关于 tools/

`tools/` 里的脚本是给**维护这套模板**用的（依赖 Node.js 或 Python），使用模板时可以直接忽略或删除：

| 脚本 | 用途 |
| --- | --- |
| `check_site.js` | 检查语言包键是否一致、图片路径是否存在、有无遗漏的占位符 |
| `verify_render.js` | 在 Node 里模拟 DOM 执行真实脚本，验证页面能正常渲染 |
| `compare_variants.py` | 校验三个版本的内容文件是否逐字一致（只有样式应当不同） |

带参数指定要检查的版本：

```bash
node tools/check_site.js v2-editorial
node tools/verify_render.js v2-editorial
python tools/compare_variants.py
```

---

## 常见问题

**Q：直接双击 `index.html` 是空白？**
这是最常遇到的问题。文案通过 `fetch` 加载 JSON，`file://` 下被浏览器安全策略拦截。
请按上面的「如何打开」用本地服务器访问。

**Q：页面标题显示成 `documents.item0.title` 这样的键名？**
语言包里缺少这个键，或键名拼错。检查 `lang/zh.json` 与 `lang/en.json` 是否都有，注意层级与大小写完全一致。

**Q：三个版本能合并成一个站点吗？**
本模板的设计是「选一个用」。若确实想要一个站点内切换三套皮肤，可以把三份 `style.css`
末尾的定稿段分别改成 `html[data-skin="1"]{...}`、`html[data-skin="2"]{...}` 再做切换器 ——
但那需要改造代码，不属于开箱即用的范围。

**Q：改了文件但页面没变化？**
本地是浏览器缓存，按 `Ctrl + F5` 强制刷新；线上则等 Pages 构建完成（仓库 **Actions** 页面可看进度），
必要时给静态资源加版本号（见上文）。

**Q：暗色/亮色的选择为什么没跟着默认值走？**
主题切换会把访客的选择写进浏览器 `localStorage`，**它的优先级高于默认值**。
想恢复默认，可在控制台执行 `localStorage.removeItem('theme')` 后强制刷新。

**Q：中文和 Emoji 会不会出问题？**
不会，所有文件都是 UTF-8 编码。

**Q：JSON 写错了怎么发现？**
最常见的错误是**多了一个逗号**（每项之间用逗号，但最后一项后面不能有逗号）。
可以用 `node tools/check_site.js` 检查，或看浏览器 F12 控制台的 `[i18n] Load failed` 报错。

**Q：可以商用吗？**
模板本身是通用前端代码。你替换进去的图片、字体、图标等第三方资源需自行确认授权；
Font Awesome 免费版有其自己的许可条款。

---

## 许可与致谢

模板最初改编自一个纯前端个人主页模板结构，此后重写了样式与内容配置方式。
你可以自由使用、修改并用于个人或商业项目，第三方资源（图标、字体、图片）的授权请自行确认。
