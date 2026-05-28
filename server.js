const bcrypt = require('bcrypt');
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));
const db = mysql.createConnection({
    host: 'mysql-16959fe0-gryden-542d.l.aivencloud.com',
    port: 15684, // Ваш порт з Aiven
    user: 'avnadmin',
    password: process.env.DB_PASSWORD,
    database: 'defaultdb',
    ssl: {
        rejectUnauthorized: false // Хмарні бази часто вимагають SSL-з'єднання
    }
});

db.connect(err => {
    if (err) console.error('Помилка підключення:', err);
    else console.log('Успішно підключено до хмарної MySQL!');
});

// --- API ТОВАРІВ ---
app.get('/api/products', (req, res) => {
    const category = req.query.category;
    const search = req.query.search;
    let sql = 'SELECT * FROM products WHERE 1=1';
    let queryParams = []; 

    if (category && category !== 'all') { sql += ' AND category = ?'; queryParams.push(category); }
    if (search) { sql += ' AND title LIKE ?'; queryParams.push(`%${search}%`); }

    db.query(sql, queryParams, (err, results) => {
        if (err) return res.status(500).json({ error: 'Помилка отримання' });
        res.json(results);
    });
});
// --- API ДЛЯ ПОПУЛЯРНИХ ТОВАРІВ ---
app.get('/api/popular-products', (req, res) => {
    const ids = req.query.ids ? req.query.ids.split(',') : [];
    if (ids.length === 0) {
        return res.json([]);
    }
    
    // Використовуємо SQL IN, щоб отримати товари за вказаними ID
    const sql = 'SELECT * FROM products WHERE id IN (?)';
    db.query(sql, [ids], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Помилка бази даних' });
        }
        res.json(results);
    });
});
app.get('/api/product/:id', (req, res) => {
    db.query('SELECT * FROM products WHERE id = ?', [req.params.id], (err, results) => {
        if (err || results.length === 0) return res.status(404).json({ error: 'Не знайдено' });
        const product = results[0];
        let galleryArray = [];
        if (product.gallery) {
            const folderPath = product.gallery.trim();
            const absoluteFolderPath = path.join(__dirname, folderPath);
            try {
                if (fs.existsSync(absoluteFolderPath)) {
                    galleryArray = fs.readdirSync(absoluteFolderPath)
                        .filter(f => f.match(/\.(jpg|jpeg|png|webp|gif|mp4|mov|avi|mkv)$/i))
                        .map(f => `${folderPath}/${f}`);
                }
            } catch (err) { console.error(err); }
        }
        if (product.image_url && !galleryArray.includes(product.image_url)) galleryArray.unshift(product.image_url);
        product.gallery_images = galleryArray;
        res.json(product);
    });
});

// --- КОШИК ---
app.post('/api/cart', (req, res) => {
    const { session_id, product_id } = req.body;
    db.query('SELECT * FROM cart WHERE session_id = ? AND product_id = ?', [session_id, product_id], (err, results) => {
        if (results.length > 0) db.query('UPDATE cart SET quantity = quantity + 1 WHERE id = ?', [results[0].id], () => res.json({ success: true }));
        else db.query('INSERT INTO cart (session_id, product_id, quantity) VALUES (?, ?, 1)', [session_id, product_id], () => res.json({ success: true }));
    });
});
// Обов'язково додайте цей маршрут у server.js
app.post('/api/cart/update', (req, res) => {
    const { cart_id, action } = req.body;

    let sql = '';
    if (action === 'increase') {
        sql = 'UPDATE cart SET quantity = quantity + 1 WHERE id = ?';
    } else if (action === 'decrease') {
        sql = 'UPDATE cart SET quantity = quantity - 1 WHERE id = ? AND quantity > 1';
    } else if (action === 'delete') {
        sql = 'DELETE FROM cart WHERE id = ?';
    }

    if (sql) {
        db.query(sql, [cart_id], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true });
        });
    } else {
        res.status(400).json({ error: 'Невідома дія' });
    }
});
// =========================================
// МАРШРУТИ КОШИКА (СКОПІЮЙ ЦЕЙ БЛОК)
// =========================================

// 1. Отримання вмісту кошика
app.get('/api/cart', (req, res) => {
    const sessionId = req.query.session_id; 
    if (!sessionId) return res.status(400).json({ error: 'Немає сесії' });

    const sql = 'SELECT cart.id as cart_id, cart.quantity, products.* FROM cart JOIN products ON cart.product_id = products.id WHERE cart.session_id = ?';
    db.query(sql, [sessionId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// 2. Кількість товарів у шапці
app.get('/api/cart/count', (req, res) => {
    const sessionId = req.query.session_id; 
    if (!sessionId) return res.json({ count: 0 });

    db.query('SELECT SUM(quantity) AS count FROM cart WHERE session_id = ?', [sessionId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ count: results[0].count || 0 });
    });
});


app.post('/api/checkout', (req, res) => {
    const { session_id, name, lastname, phone, comment, user_id } = req.body;

    const query = `
        SELECT cart.product_id, cart.quantity, products.title, products.price 
        FROM cart 
        JOIN products ON cart.product_id = products.id 
        WHERE cart.session_id = ?`;

    db.query(query, [session_id], (err, items) => {
        if (err || items.length === 0) return res.status(500).json({ error: 'Кошик порожній' });

        const total_price = items.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
        const itemsJson = JSON.stringify(items);

        // 1. Спочатку вставляємо замовлення БЕЗ номера (щоб отримати ID)
        const sql = 'INSERT INTO orders (user_id, name, lastname, phone, comment, items, session_id, total_price) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        
        db.query(sql, [user_id, name, lastname, phone, comment, itemsJson, session_id, total_price], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            // 2. Отримуємо ID, який створила база (наприклад, 14)
            const newOrderId = result.insertId;
            
            // 3. Формуємо номер за вашим зразком (наприклад: ORD-2026-14)
            const crmNumber = `ORD-${new Date().getFullYear()}-${newOrderId}`;

            // 4. Записуємо цей номер у колонку crm_number
            db.query('UPDATE orders SET crm_number = ? WHERE id = ?', [crmNumber, newOrderId], (err) => {
                if (err) console.error("Помилка запису crm_number:", err);

                // Очищаємо кошик
                db.query('DELETE FROM cart WHERE session_id = ?', [session_id], () => {
                    res.json({ success: true });
                });
            });
        });
    });
});

// --- АДМІНКА ---
app.get('/api/admin/orders', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const offset = (page - 1) * limit;

    db.query('SELECT COUNT(*) as total FROM orders', (err, countResult) => {
        const total = countResult[0].total;
        db.query('SELECT * FROM orders ORDER BY created_at DESC LIMIT ? OFFSET ?', [limit, offset], (err, results) => {
            res.json({ orders: results, total: total });
        });
    });
});

app.get('/api/admin/profile', (req, res) => {
    db.query('SELECT first_name, last_name FROM users WHERE id = ?', [req.query.id], (err, results) => {
        if (results.length > 0) res.json(results[0]);
        else res.status(404).json({ error: 'Не знайдено' });
    });
});

app.post('/api/admin/save-all-statuses', (req, res) => {
    req.body.updates.forEach(upd => {
        db.query(`UPDATE orders SET ${upd.field} = ? WHERE id = ?`, [upd.value ? 1 : 0, upd.order_id]);
    });
    res.json({ success: true });
});

app.delete('/api/admin/delete-order/:id', (req, res) => {
    db.query('DELETE FROM orders WHERE id = ?', [req.params.id], () => res.json({ success: true }));
});

// --- ОТРИМАТИ ЗАМОВЛЕННЯ КОРИСТУВАЧА ---
app.get('/api/my-orders', (req, res) => {
    const userId = req.query.user_id; // Отримуємо ID з запиту

    const sql = 'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC';
    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});
// --- АВТОРИЗАЦІЯ ---

// Маршрут для логіну
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    
    // Шукаємо користувача тільки за email
    const sql = 'SELECT * FROM users WHERE email = ?';
    
    db.query(sql, [email], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Помилка сервера' });
        
        // Якщо користувача не знайдено
        if (results.length === 0) {
            return res.status(401).json({ error: 'Невірний email або пароль' });
        }
        
        const user = results[0];
        
        // Порівнюємо введений пароль із зашифрованим з бази
        const match = await bcrypt.compare(password, user.password);
        
        if (match) {
            res.json({ message: 'Вхід успішний!', user: user });
        } else {
            res.status(401).json({ error: 'Невірний email або пароль' });
        }
    });
});

// Маршрут для реєстрації
app.post('/api/register', async (req, res) => {
    const { firstName, lastName, phone, email, password } = req.body;
    
    // Перевіряємо, чи є такий email
    const checkUserSql = 'SELECT * FROM users WHERE email = ?';
    db.query(checkUserSql, [email], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Помилка сервера' });
        if (results.length > 0) return res.status(400).json({ error: 'Користувач з таким email вже існує!' });
        
        try {
            // Шифруємо пароль перед збереженням
            const hashedPassword = await bcrypt.hash(password, 10);
            
            // Зберігаємо всі дані
            const insertUserSql = 'INSERT INTO users (first_name, last_name, phone, email, password) VALUES (?, ?, ?, ?, ?)';
            db.query(insertUserSql, [firstName, lastName, phone, email, hashedPassword], (err, result) => {
                if (err) return res.status(500).json({ error: 'Не вдалося зареєструвати' });
                res.json({ message: 'Реєстрація успішна!', userId: result.insertId });
            });
        } catch (hashError) {
            res.status(500).json({ error: 'Помилка шифрування пароля' });
        }
    });
});
app.listen(3001, () => {
    console.log('Сервер працює: https://avtozvuk-api.onrender.com');
});
