var express = require("express");
var server = express();
var bodyParser = require("body-parser");
var fileUpload = require("express-fileupload");
var DB = require("nedb-promises");

// --- 資料庫設定 ---
// 修正點：必須定義 ContactDB 才能執行 insert
var ContactDB = DB.create(__dirname + "/Contact.db");
var PorfolioDB = DB.create(__dirname + "/Porfolio.db");

// --- 伺服器設定 ---
server.set("view engine", 'ejs');
server.set("views", __dirname + "/view");

// --- 中間件設定 (清理重複部分) ---
server.use(express.static(__dirname + "/Public"));
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(fileUpload({ limits: { fileSize: 2 * 1024 * 1024 } }));

// ---路由設定 ---

// 首頁路由 (確保能讀取到 index.html)
server.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// 聯絡表單處理
server.post("/contact", (req, res) => {
    const { name, email, message } = req.body;

    // Email 格式偵測 (Regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // 驗證邏輯
    if (!name || !email || !message) {
        return res.render("msg", { message: "❌ 送出失敗：請填寫所有必要欄位。" });
    }

    if (!emailRegex.test(email)) {
        return res.render("msg", { message: "❌ 送出失敗：Email 格式不正確。" });
    }

    // 存入 ContactDB
    ContactDB.insert({
        name,
        email,
        message,
        timestamp: new Date()
    }).then(() => {
        // 處理上傳檔案
        if (req.files && req.files.myFile1) {
            var upFile = req.files.myFile1;
            var uploadPath = __dirname + "/Public/upload/" + upFile.name;
            
            upFile.mv(uploadPath, function(err) {
                if (err) return res.render("msg", { message: "資料已存，但檔案上傳出錯。" });
                res.render("msg", { message: "✅ 感謝回饋！您的訊息與附件已成功送出。" });
            });
        } else {
            res.render("msg", { message: "✅ 感謝回饋！您的訊息已成功存入資料庫。" });
        }
    }).catch(err => {
        res.render("msg", { message: "⚠️ 伺服器錯誤：" + err });
    });
});

// 啟動伺服器
server.listen(8080, () => {
    console.log("👉 請至：http://localhost:8080");
});