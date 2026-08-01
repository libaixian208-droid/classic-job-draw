# 經典服職業命運抽籤

三人三職業的新楓之谷經典服隨機職業抽籤工具。每位冒險者需用名字註冊／登入，且只能看到自己的職業結果。

正式網域：`https://draw.ctrlzworks.com`  
暫時網址：`https://classic-job-draw.pages.dev`

## 功能

- 名字註冊／登入（最多 3 人）
- 登入後只能看見自己的抽籤結果，其他人職業不顯示
- 伺服器端職業池不重複，最終三人必定不同職業
- 約 1.5–2 秒抽籤輪播動畫（尊重 `prefers-reduced-motion`）
- Cloudflare KV 保存共用抽籤狀態；瀏覽器 localStorage 只保存登入 token
- 複製自己的結果、重新抽籤（需確認；保留已註冊名字）
- 響應式：手機友善

## 建議 Node.js 版本

- **Node.js 20 LTS** 或以上（建議 20 / 22）
- 使用 npm 10+

## Environment Variables

應用程式本身**不需要**環境變數。

部署時需要 Cloudflare 資源綁定：

| Binding | 類型 | 說明 |
|---------|------|------|
| `DRAW_KV` | KV Namespace | 儲存抽籤 session（已寫在 `wrangler.toml`） |

## 安裝

```bash
npm install
```

## 本機開發

```bash
npm run dev
```

瀏覽器開啟終端機顯示的本機網址（預設 `http://localhost:5173`）。

本機透過 Vite middleware 提供記憶體版 `/api`（重新啟動後資料會清空）。正式環境使用 Cloudflare Pages Functions + KV。

## Build

```bash
npm run build
```

產物輸出至 `dist/`。可先本機預覽靜態頁（不含正式 KV API）：

```bash
npm run preview
```

完整含 Functions 的本機預覽：

```bash
npm run build
npx wrangler pages dev dist
```

## Lint

```bash
npm run lint
```

## Cloudflare Pages 部署

### 直接部署（目前專案使用）

```bash
npm run build
npx wrangler pages deploy dist --project-name=classic-job-draw
```

`wrangler.toml` 已設定 `DRAW_KV` binding 與 `pages_build_output_dir`。

### 連接 Git 倉庫

1. 推送到 GitHub。
2. Cloudflare Dashboard → Workers & Pages → 選擇專案或新建。
3. Build 設定：

| 項目 | 值 |
|------|-----|
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node.js version | `20` |

4. Settings → Functions → KV namespace bindings：綁定 `DRAW_KV`。

### SPA 與標頭

- `public/_redirects`：SPA fallback
- `public/_headers`：基本安全標頭

## 綁定 draw.ctrlzworks.com（Porkbun DNS）

DNS 若在 Porkbun（不在 Cloudflare）：

1. Cloudflare Pages → Custom domains → 加入 `draw.ctrlzworks.com`
2. 到 Porkbun → Domain Management → `ctrlzworks.com` → DNS
3. 新增：

| Type | Host | Answer / Target |
|------|------|-----------------|
| CNAME | `draw` | `classic-job-draw.pages.dev` |

4. 等待 DNS 與 SSL 生效後開啟 `https://draw.ctrlzworks.com`

## 專案結構

```text
functions/
  api/[[path]].ts   # Pages Functions API
  _lib/             # session / handlers / KV store
src/
  components/       # 登入、抽籤、結果 UI
  hooks/
  lib/              # 前端 API client、動畫
  types/
  App.tsx
public/
wrangler.toml       # Pages + KV 設定
```

## API 概要

| Method | Path | 說明 |
|--------|------|------|
| GET | `/api/session` | 公開隊伍狀態（不含職業） |
| POST | `/api/register` | 註冊名字 |
| POST | `/api/login` | 用名字登入 |
| POST | `/api/me` | 以 token 取得自己的資料 |
| POST | `/api/draw` | 為自己抽籤 |
| POST | `/api/reset` | 清除所有人職業結果（保留註冊） |

## 授權與素材說明

本站不使用任何官方 MapleStory / 新楓之谷受版權保護的圖片、Logo、角色或音樂。視覺以 CSS、emoji 與開源字型呈現。
