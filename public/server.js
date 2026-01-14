var express = require("express");
var server = express();
var bodyParser = require("body-parser");
var fileUpload = require("express-fileupload");
var DB = require("nedb-promises");

// 資料庫設定
var ContactDB = DB.create(__dirname + "/Contact.db");

// 模板引擎與靜態檔案
server.set("view engine", 'ejs');
server.set("views", __dirname + "/view");
server.use(express.static(__dirname + "/Public"));

// 中間件
server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(fileUpload({ limits: { fileSize: 2 * 1024 * 1024 } }));

// --- 路由設定 ---

// 1. 偵測並儲存聯絡資訊
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

    // 存入資料庫
    ContactDB.insert({
        name,
        email,
        message,
        timestamp: new Date()
    }).then(() => {
        // 處理上傳檔案 (如果有的話)
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
server.listen(80, () => {
    console.log("Server is running on port 80");
});