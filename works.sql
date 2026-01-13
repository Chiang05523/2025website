/* 建立資料庫*/
CREATE DATABASE IF NOT EXISTS portfolio_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE portfolio_db;

/* 使用者 */
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* 作品分類*/
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_name VARCHAR(50) NOT NULL
);

/* 作品資料*/
CREATE TABLE works (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  image_path VARCHAR(255),
  category_id INT,
  author_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (category_id) REFERENCES categories(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,

  FOREIGN KEY (author_id) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

/* 預設資料 */

/* 使用者 */
INSERT INTO users (name, email) VALUES
('江幼婷', 'ella5231123@gmail.com');

/* 分類 */
INSERT INTO categories (category_name) VALUES
('角色創作'),
('插畫日常'),
('舞展視覺設計');

/* 作品資料 */
INSERT INTO works (title, description, image_path, category_id, author_id) VALUES
(
  '呦呦',
  '第一支繪帳，以個人人設繪製圖畫，練習不同色彩搭配。',
  'picture/a004.png',
  1,
  1
),
(
  '潦草小兔',
  '以繪畫日常與動態為主，練習故事與動態表現。',
  'picture/a005.png',
  2,
  1
),
(
  'G.O.D DAMN 舞展',
  '2025年G.O.D熱舞社第25屆舞展主視覺、邀請函與周邊設計。',
  'picture/b001.jpg',
  3,
  1
);
