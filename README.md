# Resume

[![Deploy GitHub Pages](https://github.com/ovws/resume/actions/workflows/deploy.yml/badge.svg)](https://github.com/ovws/resume/actions/workflows/deploy.yml)
[![Vercel](https://img.shields.io/badge/Vercel-Live-000000?logo=vercel)](https://r.qiwensong.com/)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-2563eb?logo=github)](https://ovws.github.io/resume/)

齐文崧的单页时间轴简历。项目使用原生 HTML、CSS 和 JavaScript 构建，无框架、无依赖、无需编译，可同时部署到 GitHub Pages 与 Vercel。

## 在线访问

| 平台 | 地址 |
| --- | --- |
| Vercel | [r.qiwensong.com](https://r.qiwensong.com/) |
| GitHub Pages | [ovws.github.io/resume](https://ovws.github.io/resume/) |

两个站点均从仓库根目录发布同一套静态文件，因此页面内容与样式应保持一致。

## 功能特点

- 单屏横向时间轴，支持鼠标拖动、滚轮和底部节点导航
- 中英文切换，并使用 `localStorage` 记住语言偏好
- 响应式布局，适配桌面端与移动端
- 蓝紫青光域、发光节点、轨道线与轻玻璃质感视觉效果
- 浏览器打印布局，可通过“导出 PDF”按钮保存简历
- 支持 `prefers-reduced-motion`，并为打印模式隐藏装饰背景
- 纯静态实现，不需要安装依赖或执行构建命令

## 本地预览

克隆仓库后，在项目根目录启动任意静态文件服务器：

```bash
git clone https://github.com/ovws/resume.git
cd resume
python -m http.server 8080
```

然后访问 [http://localhost:8080](http://localhost:8080)。

## 项目结构

```text
.
├── index.html                  # 页面结构、默认内容与打印模板
├── styles.css                 # 页面布局、响应式与视觉样式
├── main.js                    # 时间轴交互、中英文内容与打印逻辑
├── fonts/                     # 本地字体资源
├── vercel.json                # Vercel 静态部署配置
├── .github/workflows/deploy.yml
│                               # GitHub Pages 部署工作流
├── .nojekyll                   # 禁用 GitHub Pages 的 Jekyll 处理
└── Archive/                    # 历史版本与不再参与主页构建的文件
```

## 修改简历

- 在 `main.js` 的 `i18n.zh` 与 `i18n.en` 中同步修改中英文经历、标签和导航文字。
- 在 `index.html` 中修改页面元信息、联系方式、初始内容和打印模板中的日期。
- 在 `styles.css` 中调整颜色、背景、卡片、时间轴及不同屏幕尺寸下的布局。
- 替换字体时，同时更新 `fonts/` 中的文件和 `index.html`、`styles.css` 内对应路径。

修改后建议至少检查中文、英文、移动端和浏览器打印预览。

> 本仓库是公开简历，电话号码、邮箱等写入源码的信息也会公开。Fork 后请先替换为自己的资料。

## 部署

### GitHub Pages

仓库通过 `.github/workflows/deploy.yml` 自动部署：

1. 推送或合并到 `master`（也兼容 `main`）。
2. GitHub Actions 上传仓库根目录并发布到 GitHub Pages。
3. 可在仓库的 **Actions** 页面查看部署状态。

### Vercel

Vercel 必须同样使用仓库根目录：

| 设置项 | 值 |
| --- | --- |
| Root Directory | 留空，即仓库根目录 |
| Framework Preset | Other / 无框架 |
| Build Command | 留空 |
| Output Directory | `.` |

`vercel.json` 已声明静态输出目录。不要把 Root Directory 设置为 `src` 或 `Archive`，否则 Vercel 会发布历史版本，导致它与 GitHub Pages 显示不同。

## 历史文件

旧版源码、依赖文件和早期说明统一保存在 `Archive/`。这些文件仅用于留档，当前主页入口始终是仓库根目录的 `index.html`。

## 致谢

早期版本参考了多份优秀的在线简历项目，包括 [wikiq/resume](https://github.com/wikiq/resume)。感谢相关作者的分享与启发。
