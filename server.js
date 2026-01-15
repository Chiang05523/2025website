const express = require("express");
const server = express();
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const DB = require("nedb-promises");
const path = require("path");

// --- 1. 資料庫設定 ---
// 這裡會自動生成 Contact.db
const ContactDB = DB.create(path.join(__dirname, "Contact.db"));
const PorfolioDB = DB.create(path.join(__dirname, "Porfolio.db"));

// --- 2. 伺服器模板與路徑設定 ---
server.set("view engine", "ejs");
server.set("views", path.join(__dirname, "view"));

// 重要：設定靜態資源目錄
// 這樣你的 HTML 才能讀到 css/style.css 或 picture/logo.png
server.use(express.static(__dirname)); 
server.use(express.static(path.join(__dirname, "/Public")));

// --- 3. 中間件設定 ---
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(fileUpload({ 
    limits: { fileSize: 2 * 1024 * 1024 }, 
    createParentPath: true 
}));

// --- 4. 路由設定 ---

// 首頁
server.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// 分頁自動處理
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

        if (!name || !email || !message) {
            return res.render("msg", { message: "❌ 送出失敗：請填寫所有必要欄位。" });
        }
        if (!emailRegex.test(email)) {
            return res.render("msg", { message: "❌ 送出失敗：Email 格式不正確。" });
        }

        await ContactDB.insert({
            name,
            email,
            message,
            timestamp: new Date()
        });

        // 檔案上傳 (對應 HTML 的 name="myFile1")
        if (req.files && req.files.myFile1) {
            const upFile = req.files.myFile1;
            const uploadPath = path.join(__dirname, "Public/upload", upFile.name);
            await upFile.mv(uploadPath);
            return res.render("msg", { message: "✅ 感謝回饋！您的訊息與附件已成功送出。" });
        }

        res.render("msg", { message: "✅ 感謝回饋！您的訊息已成功存入資料庫。" });
    } catch (err) {
        console.error(err);
        res.render("msg", { message: "⚠️ 伺服器錯誤：" + err.message });
    }
});

// --- 5. 啟動伺服器 ---
const PORT = 8080;
server.listen(PORT, () => {
    console.log(`🚀 伺服器已啟動：http://localhost:${PORT}`);
});