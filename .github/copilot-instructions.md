## 專案概觀（big picture）

這是個以純靜態 HTML/CSS（少量內嵌 JS）構成的個人作品網站。檔案平放在專案根目錄，主要頁面有 `index.html`、`about.html`、`yoyo.html`、`god.html` 等；樣式分成全域 `style.css` 與每頁/局部覆寫的 `index.css`、`about.css` 等。圖片與媒體分散在 `picture/` 與 `p2/` 目錄。

主要設計決策/約定：
- 每頁為獨立靜態 HTML（無 template engine），導覽列與 footer 直接複製在每個 HTML 檔中，修改時需同時編輯所有頁面。
- 全站有一個基底樣式 `style.css`，接著個別頁面載入像 `index.css` 來覆寫（index.html 先載入 `style.css`、再載入 `index.css`，後者可覆蓋前者）。

## 開發/除錯工作流程（quick wins）
- 開發時可用瀏覽器直接開啟 `index.html` 或在本機啟動簡易 HTTP server（可用 VS Code Live Server 或 `python -m http.server`）。
- 修改 CSS/HTML 後只需重新整理瀏覽器檢視；使用 DevTools 可快速定位樣式被哪個檔案覆寫（注意載入順序）。

## 對 AI 編輯代理的具體指示（actionable）
- 當要新增頁面：在根目錄建立 `newpage.html`，複製 `index.html` 的結構，並在每個現有頁面導覽列加入連結（目前沒有中央 template）。
- 當要新增/替換圖片：把檔案放到 `picture/`（優先）或 `p2/`，並使用相對路徑（範例：`<img src="picture/a001_工作區域 1.png">`）。注意：檔名含空白或非 ASCII，若要改名請同時更新所有引用。
- 修改樣式時：優先編輯 `style.css` 放全站通用樣式；若只影響單一頁面，編輯該頁的 CSS 檔（如 `index.css`）。

## 注意到的實際問題 / 可立即修正的地方
- JavaScript 與 CSS 類名不一致：`index.css` 使用 `.fade-in.active` 來顯示淡入效果，但 `index.html` 的內嵌 script 是在選取 `.reveal` 並加上 `active`，導致動畫在目前 HTML 中不會被觸發。定位檔案：`index.html`（script 區塊）、`index.css`（.fade-in 定義）。修正建議：把 script 的選取器改為 `.fade-in` 或把要淡入的 element 加上 `reveal` 類別。
- CSS 檔之間有重複或衝突（例如 body 在 `style.css` 與 `index.css` 都被定義；顏色/字型也有不同設定）。修改時請注意載入順序（`link` 的先後）與使用更具體 selector 以避免無意的覆寫。

## 常見類別與範例（在專案中常見的 pattern）
- 互動/樣式：`.btn-primary`（按鈕樣式）、`.card` / `.card-img`（角色卡片）、`.profile` / `.profile-img`、`.hero`、`.about`、`.fade-in`。
- 導覽列：`.navbar` 與 `.nav-links`，logo 圖檔通常放 `picture/a002.png`。
- Footer 的內容固定在每個 HTML 檔內，聯絡資訊直接寫在 `footer` 區塊。

## 整合點與外部依賴
- 專案目前不含 package.json、建置工具或第三方後端。所有資源為靜態檔案，瀏覽器即能展示。若未來加入自動化（例如部署、打包），請新增對應的 config 並在此檔註明。

## 要求 AI 的行為準則（針對此專案）
- 只修改必要檔案，避免全站複寫：例如若要更新 navbar，先提出把 navbar 抽出為 partial 的變更計畫，再一次性修改並測試每頁。
- 在變更 HTML/CSS 前，先在 PR 註明要修改的頁面清單與簡短測試步驟（如何在本地驗證）。
- 若新增資源（影像、字型），請確認路徑與檔名無空白，並更新所有引用。

---
如果你想要我直接把上述自動修正（例如修正 reveal/fade-in 的不一致）套用到檔案，或是把 navbar 抽出成共用 partial 並示範部署流程，我可以先做一個小型變更 PR（本機修改 + 測試）並把變更檔案列出來。請告訴我想先做哪一項。 
