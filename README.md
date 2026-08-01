# 經典服職業命運抽籤

三人三職業的新楓之谷經典服隨機職業抽籤工具。純前端、無會員、無資料庫，打開就能抽。

正式網域建議：`https://draw.ctrlzworks.com`

## 功能

- 三位玩家各自抽一次：槍騎兵 / 僧侶 / 冰雷巫師
- 職業池不重複，最終三人必定不同職業
- 約 1.5–2 秒抽籤輪播動畫（尊重 `prefers-reduced-motion`）
- `localStorage` 保存名字與抽籤結果（含資料版本）
- 複製結果、重新抽籤（需確認）
- 響應式：桌機橫向三欄、手機直向堆疊

## 建議 Node.js 版本

- **Node.js 20 LTS** 或以上（建議 20 / 22）
- 使用 npm 10+

## Environment Variables

本專案為純靜態前端，**不需要任何環境變數**。

## 安裝

```bash
npm install
```

## 本機開發

```bash
npm run dev
```

瀏覽器開啟終端機顯示的本機網址（預設 `http://localhost:5173`）。

## Build

```bash
npm run build
```

產物輸出至 `dist/`。可先本機預覽：

```bash
npm run preview
```

## Lint

```bash
npm run lint
```

## Cloudflare Pages 部署

### 方式 A：連接 Git 倉庫（建議）

1. 將本專案推送到 GitHub / GitLab。
2. 登入 [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → Connect to Git。
3. 選擇此倉庫與分支（例如 `main`）。
4. Build 設定：

| 項目 | 值 |
|------|-----|
| Framework preset | Vite |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/`（預設） |
| Node.js version | `20`（在 Environment variables 設 `NODE_VERSION=20`，或於 Pages 設定選擇） |

5. 環境變數：無需設定應用程式用變數。
6. 儲存並部署。成功後會得到 `*.pages.dev` 網址。

### 方式 B：直接上傳

```bash
npm run build
```

到 Cloudflare Pages → **Upload assets**，上傳 `dist/` 資料夾內容。

### SPA 與標頭

專案已包含：

- `public/_redirects`：SPA fallback（`/* → /index.html`）
- `public/_headers`：基本安全標頭與靜態資源快取

這些檔案會在 build 時複製到 `dist/`。

## 綁定 draw.ctrlzworks.com

假設主網域 `ctrlzworks.com` 已在 Cloudflare 管理 DNS：

1. Cloudflare Pages 專案 → **Custom domains** → **Set up a custom domain**。
2. 輸入 `draw.ctrlzworks.com`。
3. Cloudflare 通常會自動新增 CNAME：

| Type | Name | Target |
|------|------|--------|
| CNAME | `draw` | `<your-project>.pages.dev` |

4. 若 DNS 不在 Cloudflare：到你的 DNS 供應商新增同樣的 CNAME，指向 Pages 提供的目標。
5. 等待 SSL 憑證就緒後，以 `https://draw.ctrlzworks.com` 開啟網站。

> 若主網域已在 Cloudflare Proxy（橘雲），保持 Proxy 開啟即可，HTTPS 由 Cloudflare 處理。

## 其他平台（簡述）

### Vercel

- Framework：Vite
- Build Command：`npm run build`
- Output Directory：`dist`

### Netlify

- Build command：`npm run build`
- Publish directory：`dist`
- `_redirects` 已就緒

## 專案結構

```text
src/
  components/   # UI 元件
  hooks/        # 抽籤狀態與動畫
  lib/          # 職業資料、隨機抽籤、localStorage
  types/        # TypeScript 型別
  App.tsx
  main.tsx
  index.css
public/
  favicon.svg
  _redirects
  _headers
```

## 授權與素材說明

本站不使用任何官方 MapleStory / 新楓之谷受版權保護的圖片、Logo、角色或音樂。視覺以 CSS、emoji 與開源字型呈現。
