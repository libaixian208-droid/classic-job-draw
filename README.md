# 經典服職業命運抽籤

新楓之谷經典版職業抽籤工具：開房勾選 2～12 職，人數等於職業池，每人抽到不重複職業。對齊開服設定（100 級／目前最高二轉）。抽籤途中只見自己的結果，全員抽完後才揭曉。

正式網域：`https://draw.ctrlzworks.com`  
暫時網址：`https://classic-job-draw.pages.dev`

## 功能

- **房間代碼**：建立／加入 6 碼房間；開房可勾選經典版 12 職（人數＝勾選數）
- **觀戰**：`?room=XXXXXX&watch=1` 或大廳「觀戰」，只看進度與結果
- 名字註冊／登入（每房最多與職業池相同人數；第一位註冊者為房主）
- **通行碼**：註冊／登入需 4～8 位數字，避免別人用名字搶登入
- **離開房間**：真正釋出名額；房主離開會自動交接；「切換帳號」則保留座位
- **房主**：改職業池、踢人、重新抽籤（已有人抽過須先重抽才能改池）
- API 依 IP 限流，降低刷房／掃碼風險
- 登入後只能看見自己的抽籤結果，其他人職業不顯示
- 伺服器端職業池不重複；抽籤有鎖／revision 防競態
- 約 1.5–2 秒抽籤輪播動畫（尊重 `prefers-reduced-motion`）
- Cloudflare KV 按房間保存狀態（閒置約 14 天過期，介面會顯示剩餘天數）
- 瀏覽器 localStorage 保存房間＋登入 token
- 複製結果、分享結果圖（Web Share／下載 PNG）
- 職業攻略：對齊《新楓之谷：經典版》V001（100 級／最高二轉／維多利亞島）；等級標示、弱屬／人少標籤
- **必解任務**：月妙／綠水靈組隊、忍耐之森／忍耐之林、內拉手套等裝備線（依等級標示）
- API 短暫失敗會自動重試；標籤頁隱藏時暫停輪詢
- PWA（可加到主畫面；離線可開殼層）
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

## CI

GitHub Actions（`.github/workflows/ci.yml`）會在 push／PR 執行 `lint` + `build`。

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
  components/       # 登入、抽籤、結果、觀戰、房主 UI
  hooks/
  lib/              # 前端 API client、分享圖、攻略
  types/
  App.tsx
public/             # favicon、PWA manifest／SW、headers
.github/workflows/  # CI
wrangler.toml       # Pages + KV 設定
```

## API 概要

| Method | Path | 說明 |
|--------|------|------|
| POST | `/api/rooms` | 建立房間（勾選職業池） |
| GET | `/api/session` | 公開隊伍狀態（不含職業） |
| POST | `/api/register` | 註冊名字＋通行碼 |
| POST | `/api/login` | 用名字＋通行碼登入 |
| POST | `/api/me` | 以 token 取得自己的資料 |
| POST | `/api/draw` | 為自己抽籤 |
| POST | `/api/reset` | 清除所有人職業結果（保留註冊；房主） |
| POST | `/api/jobs` | 更新職業池（房主；無人抽過） |
| POST | `/api/kick` | 踢出玩家（房主） |
| POST | `/api/leave` | 自己離開並釋出名額 |

## 授權與素材說明

本站不使用任何官方 MapleStory / 新楓之谷受版權保護的圖片、Logo、角色或音樂。視覺以 CSS、emoji 與開源字型呈現。
