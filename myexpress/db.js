import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 資料庫檔案路徑
const dbPath = path.join(__dirname, 'sqlite.db');

// 開啟並連線資料庫
// sqlite3.Database 會在檔案不存在時自動建立它
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('開啟資料庫失敗:', err.message);
  } else {
    console.log('成功連接到 SQLite 資料庫:', dbPath);
    // 初始化資料表
    initializeTable();
  }
});

function initializeTable() {
  // 僅保留 prices 表，其餘舊表一律刪除
  db.run(`DROP TABLE IF EXISTS prices`);
  db.run(`DROP TABLE IF EXISTS bento`);
  db.run(`DROP TABLE IF EXISTS movie_quotes`);

  // 定義包含 provider 的價格表格
  const sqlPrices = `
    CREATE TABLE IF NOT EXISTS prices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT,
      provider TEXT,
      name TEXT,
      price INTEGER,
      source TEXT
    )
  `;

  db.run(sqlPrices, (err) => {
    if (err) {
      console.error('建立 prices 資料表失敗:', err.message);
    } else {
      console.log('prices 資料表已就緒');
      // 插入範例數據
      insertInitialData();
    }
  });
}

function insertInitialData() {
  const data = [
  { "provider": "官方/市場調查", "item_name": "台鐵排骨便當", "price": 60, "source_url": "https://www.railway.gov.tw", "entry_date": "2016-05-20" },
  { "provider": "官方/市場調查", "item_name": "台鐵排骨便當", "price": 60, "source_url": "https://www.railway.gov.tw", "entry_date": "2017-12-01" },
  { "provider": "官方/市場調查", "item_name": "台鐵排骨便當", "price": 60, "source_url": "https://www.railway.gov.tw", "entry_date": "2018-06-30" },
  { "provider": "官方/市場調查", "item_name": "台鐵排骨便當", "price": 60, "source_url": "https://www.railway.gov.tw", "entry_date": "2019-11-05" },
  { "provider": "官方/市場調查", "item_name": "台鐵排骨便當", "price": 80, "source_url": "https://www.railway.gov.tw", "entry_date": "2020-08-12" },
  { "provider": "官方/市場調查", "item_name": "台鐵排骨便當", "price": 80, "source_url": "https://www.railway.gov.tw", "entry_date": "2021-05-20" },
  { "provider": "官方/市場調查", "item_name": "台鐵排骨便當", "price": 80, "source_url": "https://www.railway.gov.tw", "entry_date": "2022-03-15" },
  { "provider": "官方/市場調查", "item_name": "台鐵排骨便當", "price": 100, "source_url": "https://www.railway.gov.tw", "entry_date": "2023-01-20" },
  { "provider": "官方/市場調查", "item_name": "台鐵排骨便當", "price": 100, "source_url": "https://www.railway.gov.tw", "entry_date": "2024-03-10" },
  { "provider": "官方/市場調查", "item_name": "台鐵排骨便當", "price": 110, "source_url": "https://www.railway.gov.tw", "entry_date": "2025-02-14" },
  { "provider": "正忠排骨", "item_name": "正忠排骨便當", "price": 75, "source_url": "https://www.jengjong.com.tw", "entry_date": "2016-04-10" },
  { "provider": "正忠排骨", "item_name": "正忠排骨便當", "price": 80, "source_url": "https://www.jengjong.com.tw", "entry_date": "2018-01-05" },
  { "provider": "正忠排骨", "item_name": "正忠排骨便當", "price": 85, "source_url": "https://www.jengjong.com.tw", "entry_date": "2020-11-15" },
  { "provider": "正忠排骨", "item_name": "正忠排骨便當", "price": 95, "source_url": "https://www.jengjong.com.tw", "entry_date": "2022-06-01" },
  { "provider": "正忠排骨", "item_name": "正忠排骨便當", "price": 100, "source_url": "https://www.jengjong.com.tw", "entry_date": "2023-12-20" },
  { "provider": "正忠排骨", "item_name": "正忠排骨便當", "price": 110, "source_url": "https://www.jengjong.com.tw", "entry_date": "2024-10-01" },
  { "provider": "正忠排骨", "item_name": "正忠排骨便當", "price": 115, "source_url": "https://www.jengjong.com.tw", "entry_date": "2026-03-01" },
  { "provider": "悟饕池上", "item_name": "招牌鐵路便當", "price": 80, "source_url": "https://www.wu-tau.com", "entry_date": "2017-02-28" },
  { "provider": "悟饕池上", "item_name": "招牌鐵路便當", "price": 85, "source_url": "https://www.wu-tau.com", "entry_date": "2019-08-15" },
  { "provider": "悟饕池上", "item_name": "招牌鐵路便當", "price": 95, "source_url": "https://www.wu-tau.com", "entry_date": "2021-10-10" },
  { "provider": "悟饕池上", "item_name": "招牌鐵路便當", "price": 105, "source_url": "https://www.wu-tau.com", "entry_date": "2023-04-05" },
  { "provider": "悟饕池上", "item_name": "招牌鐵路便當", "price": 115, "source_url": "https://www.wu-tau.com", "entry_date": "2025-01-20" },
  { "provider": "7-11便利商店", "item_name": "國民便當", "price": 55, "source_url": "https://www.7-11.com.tw", "entry_date": "2016-09-01" },
  { "provider": "7-11便利商店", "item_name": "國民便當", "price": 59, "source_url": "https://www.7-11.com.tw", "entry_date": "2018-11-20" },
  { "provider": "7-11便利商店", "item_name": "國民便當", "price": 65, "source_url": "https://www.7-11.com.tw", "entry_date": "2020-05-15" },
  { "provider": "7-11便利商店", "item_name": "國民便當", "price": 79, "source_url": "https://www.7-11.com.tw", "entry_date": "2022-08-10" },
  { "provider": "7-11便利商店", "item_name": "國民便當", "price": 89, "source_url": "https://www.7-11.com.tw", "entry_date": "2024-02-28" },
  { "provider": "7-11便利商店", "item_name": "奮起湖便當", "price": 65, "source_url": "https://www.7-11.com.tw", "entry_date": "2016-02-14" },
  { "provider": "7-11便利商店", "item_name": "奮起湖便當", "price": 75, "source_url": "https://www.7-11.com.tw", "entry_date": "2019-12-01" },
  { "provider": "7-11便利商店", "item_name": "奮起湖便當", "price": 89, "source_url": "https://www.7-11.com.tw", "entry_date": "2022-03-20" },
  { "provider": "7-11便利商店", "item_name": "奮起湖便當", "price": 99, "source_url": "https://www.7-11.com.tw", "entry_date": "2024-05-15" },
  { "provider": "全家便利商店", "item_name": "金咖哩豬排飯", "price": 69, "source_url": "https://www.family.com.tw", "entry_date": "2017-05-10" },
  { "provider": "全家便利商店", "item_name": "金咖哩豬排飯", "price": 79, "source_url": "https://www.family.com.tw", "entry_date": "2019-11-25" },
  { "provider": "全家便利商店", "item_name": "金咖哩豬排飯", "price": 89, "source_url": "https://www.family.com.tw", "entry_date": "2021-12-01" },
  { "provider": "全家便利商店", "item_name": "金咖哩豬排飯", "price": 99, "source_url": "https://www.family.com.tw", "entry_date": "2023-09-15" },
  { "provider": "全家便利商店", "item_name": "金咖哩豬排飯", "price": 109, "source_url": "https://www.family.com.tw", "entry_date": "2025-04-20" },
  { "provider": "學區學辦", "item_name": "學生排骨飯", "price": 50, "source_url": "https://www.ntu.edu.tw", "entry_date": "2016-09-15" },
  { "provider": "學區學辦", "item_name": "學生排骨飯", "price": 55, "source_url": "https://www.ntu.edu.tw", "entry_date": "2018-09-15" },
  { "provider": "學區學辦", "item_name": "學生排骨飯", "price": 65, "source_url": "https://www.ntu.edu.tw", "entry_date": "2020-09-15" },
  { "provider": "學區學辦", "item_name": "學生排骨飯", "price": 75, "source_url": "https://www.ntu.edu.tw", "entry_date": "2022-09-15" },
  { "provider": "學區學辦", "item_name": "學生排骨飯", "price": 85, "source_url": "https://www.ntu.edu.tw", "entry_date": "2024-09-15" },
  { "provider": "健康餐盒業者", "item_name": "舒肥雞胸餐盒", "price": 90, "source_url": "https://www.ubereats.com", "entry_date": "2018-05-10" },
  { "provider": "健康餐盒業者", "item_name": "舒肥雞胸餐盒", "price": 110, "source_url": "https://www.ubereats.com", "entry_date": "2020-03-01" },
  { "provider": "健康餐盒業者", "item_name": "舒肥雞胸餐盒", "price": 130, "source_url": "https://www.ubereats.com", "entry_date": "2022-11-20" },
  { "provider": "健康餐盒業者", "item_name": "舒肥雞胸餐盒", "price": 150, "source_url": "https://www.ubereats.com", "entry_date": "2024-07-01" },
  { "provider": "健康餐盒業者", "item_name": "舒肥雞胸餐盒", "price": 165, "source_url": "https://www.ubereats.com", "entry_date": "2026-02-15" },
  { "provider": "鼎泰豐", "item_name": "排骨蛋炒飯", "price": 210, "source_url": "https://www.dintaifung.com.tw", "entry_date": "2017-01-01" },
  { "provider": "鼎泰豐", "item_name": "排骨蛋炒飯", "price": 230, "source_url": "https://www.dintaifung.com.tw", "entry_date": "2019-06-01" },
  { "provider": "鼎泰豐", "item_name": "排骨蛋炒飯", "price": 250, "source_url": "https://www.dintaifung.com.tw", "entry_date": "2022-11-01" },
  { "provider": "鼎泰豐", "item_name": "排骨蛋炒飯", "price": 280, "source_url": "https://www.dintaifung.com.tw", "entry_date": "2024-06-15" }
];

  db.serialize(() => {
    // 插入價格數據
    const stmtPrice = db.prepare(`INSERT INTO prices (date, provider, name, price, source) VALUES (?, ?, ?, ?, ?)`);
    
    // 強制刪除並重新建立 prices 資料
    db.run("DELETE FROM prices", () => {
      data.forEach(item => {
        stmtPrice.run([item.entry_date, item.provider, item.item_name, item.price, item.source_url]);
      });
      stmtPrice.finalize();
      console.log('成功清空並重新建立 prices 資料 (包含提供者資訊)');
    });
  });
}

export default db;
