import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';

import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 修正資料庫路徑：與 db.js 保持一致，放在 myexpress 根目錄下
const dbPath = path.join(__dirname, 'sqlite.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('無法開啟資料庫:', err.message);
    } else {
        console.log('成功連接到資料庫:', dbPath);
    }
});

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 查詢所有便當價格資料的 API (支援關鍵字過濾)
app.get('/api/quotes', (req, res) => {
  const { keyword } = req.query;
  let sql = 'SELECT * FROM prices';
  let params = [];

  if (keyword) {
    sql += ' WHERE name LIKE ? OR provider LIKE ?';
    params = [`%${keyword}%`, `%${keyword}%`];
  }

  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error('查詢失敗:', err.message);
      return res.status(500).json({ error: '資料庫查詢失敗' });
    }
    res.json(rows);
  });
});

// 按名稱查詢便當價格資料的 API (支援模糊搜尋，例如: /api?name=排骨)
app.get('/api', (req, res) => {
    let name = req.query.name;
    // 使用 LIKE 並搭配 % 來實現關鍵字搜尋
    let sql = 'SELECT * FROM prices WHERE name LIKE ?';
    db.all(sql, [`%${name}%`], (err, rows) => {
        if (err) {
            console.error('查詢失敗:', err.message);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(rows);
    });
});

// 新傳便當價格資料的 API (適合目前的前端需求)
app.post('/api/insert', (req, res) => {
  const { provider, name, price, date, source } = req.body;

  if (!name || !price || !date || !source) {
    return res.status(400).send('請提供完整的欄位：提供者、名稱、價格、日期、來源');
  }

  const sql = `INSERT INTO prices (provider, name, price, date, source) VALUES (?, ?, ?, ?, ?)`;
  const params = [provider || '一般用戶', name, price, date, source];

  db.run(sql, params, function (err) {
    if (err) {
      console.error('儲存資料失敗:', err.message);
      return res.status(500).send('資料庫儲存失敗');
    }
    res.send(`成功存入便當資料，ID: ${this.lastID}`);
  });
});

// 查詢所有推薦便當的 API
app.get('/api/recommendations', (req, res) => {
  db.all('SELECT * FROM bento', (err, rows) => {
    if (err) {
      console.error('查詢失敗:', err.message);
      return res.status(500).json({ error: '資料庫查詢失敗' });
    }
    res.json(rows);
  });
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

export default app;
