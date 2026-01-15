const express = require("express");
const server = express();
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const DB = require("nedb-promises");
const path = require("path");

// --- 1. 資料庫設定 ---
// 程式啟動時會自動在根目錄建立這些 .db 檔案
const ContactDB = DB.create(path.join(__dirname, "Contact.db"));
const PorfolioDB = DB.create(path.join(__dirname, "Porfolio.db"));

// --- 2. 伺服器模板與靜態檔案設定 ---
server.set("view engine", "ejs");
server.set("views", path.join(__dirname, "view"));

// 設定靜態檔案根目錄，確保 CSS、JS 與圖片能被讀取
// 包含 Public 資料夾以及根目錄（為了讀取 index.html 等）
server.use(express.static(path.join(__dirname, "Public")));
server.use(express.static(__dirname)); 

// --- 3. 中間件設定 ---
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(fileUpload({ 
    limits: { fileSize: 2 * 1024 * 1024 }, // 限制 2MB
    createParentPath: true 
}));

// --- 4. 路由設定 ---

// 首頁
server.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// 各分頁路由
const pages = ["about", "yoyo", "rabbit", "god"];
pages.forEach(page => {
    server.get(`/${page}.html`, (req, res) => {
        res.sendFile(path.join(__dirname, `${page}.html`));
    });
});

// 聯絡表單處理
server.post("/contact", async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // 基礎驗證
        if (!name || !email || !message) {
            return res.render("msg", { message: "❌ 送出失敗：請填寫所有必要欄位。" });
        }
        if (!emailRegex.test(email)) {
            return res.render("msg", { message: "❌ 送出失敗：Email 格式不正確。" });
        }

        // 存入 NeDB 資料庫
        await ContactDB.insert({
            name,
            email,
            message,
            timestamp: new Date()
        });

        // 處理檔案上傳
        if (req.files && req.files.myFile1) {
            const upFile = req.files.myFile1;
            const uploadPath = path.join(__dirname, "Public/upload", upFile.name);
            await upFile.mv(uploadPath);
            return res.render("msg", { message: "✅ 感謝回饋！您的訊息與附件已成功送出。" });
        }

        res.render("msg", { message: "✅ 感謝回饋！您的訊息已成功存入資料庫。" });
    } catch (err) {
        res.render("msg", { message: "⚠️ 伺服器錯誤：" + err.message });
    }
});

// --- 5. 啟動伺服器 ---
const PORT = 8080;
server.listen(PORT, () => {
    console.log(`🚀 伺服器已啟動：http://localhost:${PORT}`);
    console.log(`📁 資料庫檔案將存放在：${__dirname}`);
});