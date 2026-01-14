const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

// 中間件設定
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 設定靜態資源目錄
app.use(express.static(path.join(__dirname, '/')));

//  HTML 檔案路徑
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/about.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'about.html'));
});

app.get('/yoyo.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'yoyo.html'));
});

app.get('/rabbit.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'rabbit.html'));
});

app.get('/god.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'god.html'));
});

// 回饋表單提交 
app.post('/submit-feedback', (req, res) => {
    const { name, email, message } = req.body;

    // 偵測郵件格式是否正確
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!name || !email || !message) {
        return res.status(400).send('請填寫完整資訊');
    }

    if (!emailRegex.test(email)) {
        return res.status(400).send('Email 格式錯誤');
    }

    // 資料寫入資料庫 
    console.log(`收到來自 ${name} 的回饋！`);
    console.log(`Email: ${email}`);
    console.log(`內容: ${message}`);

    // 回傳成功訊息給前端
    res.send(`<h1>送出成功！</h1><p>謝謝 ${name} 的回饋，我們已收到您的訊息。</p><a href="/">返回首頁</a>`);
});

// 5. 啟動伺服器
app.listen(8080, () => {
    console.log(`伺服器已啟動：http://localhost:8080`);
});