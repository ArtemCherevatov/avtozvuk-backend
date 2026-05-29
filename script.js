// =========================================
// 1. ГЛОБАЛЬНІ НАЛАШТУВАННЯ ТА СЕСІЯ
// =========================================
let sessionId = localStorage.getItem('session_id');
if (!sessionId) {
    sessionId = 'guest_' + Date.now();
    localStorage.setItem('session_id', sessionId);
}

// Функція оновлення кількості товарів у кошику
async function updateCartCount() {
    try {
        const response = await fetch(`https://avtozvuk-api.onrender.com/api/cart/count?session_id=${sessionId}`);
        const data = await response.json();
        const cartCountEl = document.getElementById('cartCount');
        if (cartCountEl) cartCountEl.innerText = data.count || 0;
    } catch (error) {
        console.error('Помилка завантаження кількості:', error);
    }
}
document.addEventListener('DOMContentLoaded', updateCartCount);


// =========================================
// 2. НАВІГАЦІЯ, МЕНЮ ТА ПРОФІЛЬ (ДЛЯ ВСІХ СТОРІНОК)
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    // Гамбургер-меню
    const burgerBtn = document.getElementById('burgerBtn');
    const mobileNav = document.getElementById('mobileNav');

    if (burgerBtn && mobileNav) {
        burgerBtn.addEventListener('click', function(event) {
            event.stopPropagation(); 
            mobileNav.classList.toggle('open');
            burgerBtn.innerHTML = mobileNav.classList.contains('open') ? '✕' : '☰';
        });

        document.addEventListener('click', function(event) {
            if (mobileNav.classList.contains('open') && !mobileNav.contains(event.target)) {
                mobileNav.classList.remove('open');
                burgerBtn.innerHTML = '☰'; 
            }
        });
    }

    // Випадаюче меню профілю
    const profileBtn = document.getElementById('profileBtn');
    const profileMenu = document.getElementById('profileMenu');
    const dropdownLogoutBtn = document.getElementById('dropdownLogoutBtn');

    if (profileBtn && profileMenu) {
        profileBtn.addEventListener('click', (e) => {
            e.stopPropagation(); 
            if (!localStorage.getItem('user')) {
                window.location.href = 'authorization.html';
                return;
            }
            profileMenu.classList.toggle('show');
        });

        document.addEventListener('click', (e) => {
            if (!profileMenu.contains(e.target) && !profileBtn.contains(e.target)) {
                profileMenu.classList.remove('show');
            }
        });

        if (dropdownLogoutBtn) {
            dropdownLogoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('user');
                window.location.href = 'index.html';
            });
        }
    }
});


// =========================================
// 3. АВТОРИЗАЦІЯ ТА РЕЄСТРАЦІЯ
// =========================================
if (window.location.href.includes('authorization.html')) {
    if (localStorage.getItem('user')) {
        window.location.href = 'cabinet.html';
    }

    document.addEventListener('DOMContentLoaded', () => {
        const tabLogin = document.getElementById('tabLogin');
        const tabRegister = document.getElementById('tabRegister');
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const loginMessage = document.getElementById('loginMessage');
        const regMessage = document.getElementById('regMessage');
        const regPhone = document.getElementById('regPhone');

        // Маска телефону
        if (regPhone) {
            regPhone.addEventListener('focus', function() { if (this.value === '') this.value = '+380 '; });
            regPhone.addEventListener('input', function() {
                let val = this.value.replace(/\D/g, '');
                if (val.startsWith('380')) val = val.substring(3);
                else if (val.startsWith('0')) val = val.substring(1);
                let f = '+380 ';
                if (val.length > 0) f += '(' + val.substring(0, 2);
                if (val.length >= 3) f += ') ' + val.substring(2, 5);
                if (val.length >= 6) f += '-' + val.substring(5, 7);
                if (val.length >= 8) f += '-' + val.substring(7, 9);
                this.value = f;
            });
        }

        if (tabLogin && tabRegister) {
            tabLogin.addEventListener('click', () => {
                tabLogin.classList.add('active');
                tabRegister.classList.remove('active');
                loginForm.style.display = 'block';
                registerForm.style.display = 'none';
                loginMessage.innerHTML = ''; 
            });

            tabRegister.addEventListener('click', () => {
                tabRegister.classList.add('active');
                tabLogin.classList.remove('active');
                registerForm.style.display = 'block';
                loginForm.style.display = 'none';
                regMessage.innerHTML = '';
            });

            registerForm.addEventListener('submit', async (e) => {
                e.preventDefault(); 
                const first_name = document.getElementById('regFirstName').value;
                const last_name = document.getElementById('regLastName').value;
                const phone = document.getElementById('regPhone').value;
                const email = document.getElementById('regEmail').value;
                const password = document.getElementById('regPassword').value;

                try {
                    const response = await fetch('https://avtozvuk-api.onrender.com/api/register', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ first_name, last_name, phone, email, password}) 
                    });
                    const data = await response.json();
                    if (!response.ok) {
                        regMessage.innerHTML = `<span style="color: #ff4d4d;">${data.error}</span>`;
                    } else {
                        regMessage.innerHTML = `<span style="color: #4ade80;">${data.message}</span>`;
                        registerForm.reset(); 
                        setTimeout(() => tabLogin.click(), 2000);
                    }
                } catch (error) {
                    regMessage.innerHTML = '<span style="color: #ff4d4d;">Помилка з\'єднання.</span>';
                }
            });

            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = document.getElementById('loginEmail').value;
                const password = document.getElementById('loginPassword').value;

                try {
                    const response = await fetch('https://avtozvuk-api.onrender.com/api/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email, password })
                    });
                    const data = await response.json();

                    if (!response.ok) {
                        loginMessage.innerHTML = `<span style="color: #ff4d4d;">${data.error}</span>`;
                    } else {
                        loginMessage.innerHTML = `<span style="color: #4ade80;">${data.message}</span>`;
                        
                        // Зберігаємо повний об'єкт користувача
                        localStorage.setItem('user', JSON.stringify(data.user));
                        
                        // ВАЖЛИВО: Окремо зберігаємо ID для замовлень
                        localStorage.setItem('user_id', data.user.id); 
                        
                        setTimeout(() => { window.location.href = 'index.html'; }, 1000);
                    }
                } catch (error) {
                    loginMessage.innerHTML = '<span style="color: #ff4d4d;">Помилка з\'єднання.</span>';
                }
            });
        }
    });
}


// =========================================
// 4. ГОЛОВНА СТОРІНКА (ПОПУЛЯРНІ ТОВАРИ)
// =========================================
if (window.location.href.includes('index.html') || window.location.pathname === '/') {
    document.addEventListener('DOMContentLoaded', () => {
        const popularContainer = document.getElementById('catalogGrid');
        
        if (popularContainer) {
            const targetIds = [1, 2, 3, 5]; 
            fetch(`https://avtozvuk-api.onrender.com/api/popular-products?ids=${targetIds.join(',')}`)
                .then(response => response.json())
                .then(products => {
                    popularContainer.innerHTML = ''; 
                    const finalProducts = products.slice(0, 3); 

                    finalProducts.forEach(product => {
                        const cardHTML = `
                            <div class="product-card">
                                <img src="${product.image_url}" alt="${product.title}" class="product-img">
                                <h3 class="product-title">${product.title}</h3>
                                <div class="product-price">${product.price} грн</div>
                                <a href="product.html?id=${product.id}" class="btn-buy">КУПИТИ</a>
                            </div>
                        `;
                        popularContainer.insertAdjacentHTML('beforeend', cardHTML);
                    });
                })
                .catch(error => console.error('Помилка завантаження популярних товарів:', error));
        }
    });
}


// =========================================
// 5. КАТАЛОГ ТА ПОШУК
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    // =========================================
    // 1. СТАРИЙ ПОШУК У ШАПЦІ (Для Головної сторінки тощо)
    // =========================================
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', () => {
            const query = searchInput.value.trim();
            if (query) window.location.href = `catalog.html?search=${encodeURIComponent(query)}`;
        });
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') searchBtn.click();
        });
    }

    // =========================================
    // 2. ЛОГІКА СТОРІНКИ КАТАЛОГУ
    // =========================================
    if (window.location.href.includes('catalog.html')) {
        const catalogGrid = document.getElementById('catalogGrid');
        if (!catalogGrid) return;

        const urlParams = new URLSearchParams(window.location.search);
        const searchParam = urlParams.get('search') || '';
        const filterFromUrl = urlParams.get('filter') || 'all';

        // --- НОВИЙ ВЕЛИКИЙ ПОШУК ---
        const bigSearchInput = document.getElementById('big-catalog-search');
        const bigSearchBtn = document.getElementById('big-search-btn');

        // Якщо в URL є пошуковий запит - вставляємо його у велике поле
        if (searchParam && bigSearchInput) {
            bigSearchInput.value = searchParam;
        }

        // Обробка кліку по великій кнопці "Знайти"
        if (bigSearchBtn && bigSearchInput) {
            bigSearchBtn.addEventListener('click', () => {
                const query = bigSearchInput.value.trim();
                // Перезавантажуємо сторінку з новим пошуком
                window.location.href = `catalog.html?search=${encodeURIComponent(query)}`;
            });
            bigSearchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') bigSearchBtn.click();
            });
        }

        // --- ПАГІНАЦІЯ: Змінні ---
        let allProducts = []; // Тут зберігаємо всі завантажені товари
        const itemsPerPage = 20; // Кількість товарів на сторінці
        let currentPage = 1; // Поточна сторінка

        // --- ЗАВАНТАЖЕННЯ ТОВАРІВ ---
        async function loadProducts(category = 'all', searchQuery = '') {
            try {
                let url = `https://avtozvuk-api.onrender.com/api/products?category=${category}`;
                if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;

                const response = await fetch(url);
                allProducts = await response.json();

                if (allProducts.length === 0) {
                    catalogGrid.innerHTML = '<p style="text-align: center; width: 100%; color: #999;">За вашим запитом нічого не знайдено.</p>';
                    const paginationDiv = document.getElementById('pagination');
                    if (paginationDiv) paginationDiv.innerHTML = ''; // Ховаємо пагінацію
                    return;
                }

                currentPage = 1; // Завжди починаємо з першої сторінки
                displayPage(currentPage);
                setupPagination();

            } catch (error) {
                console.error('Помилка завантаження товарів:', error);
                catalogGrid.innerHTML = '<p>Не вдалося завантажити товари.</p>';
            }
        }

        // --- ВІДОБРАЖЕННЯ КОНКРЕТНОЇ СТОРІНКИ ---
        function displayPage(page) {
            catalogGrid.innerHTML = '';
            
            const start = (page - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            const paginatedItems = allProducts.slice(start, end);

            paginatedItems.forEach(product => {
                const card = `
                    <div class="product-card">
                        <img src="${product.image_url}" alt="${product.title}" class="product-img">
                        <h3 class="product-title">${product.title}</h3>
                        <div class="product-price">${product.price} грн</div>
                        <a href="product.html?id=${product.id}" class="btn-buy">КУПИТИ</a>
                    </div>
                `;
                catalogGrid.innerHTML += card;
            });
        }

        // --- СТВОРЕННЯ КНОПОК ПАГІНАЦІЇ ---
        function setupPagination() {
            const paginationDiv = document.getElementById('pagination');
            if (!paginationDiv) return;
            paginationDiv.innerHTML = '';

            const pageCount = Math.ceil(allProducts.length / itemsPerPage);
            if (pageCount <= 1) return; // Не малюємо кнопки, якщо сторінка лише одна

            for (let i = 1; i <= pageCount; i++) {
                const btn = document.createElement('button');
                btn.classList.add('page-btn');
                if (i === currentPage) btn.classList.add('active'); // Синя кнопка для поточної
                btn.innerText = i;

                btn.addEventListener('click', () => {
                    currentPage = i;
                    displayPage(currentPage);
                    setupPagination(); // Оновлюємо колір кнопок
                    
                    // Плавна прокрутка вгору при натисканні на нову сторінку
                    const bigSearch = document.querySelector('.big-search-wrapper') || document.getElementById('catalogGrid');
                    if (bigSearch) {
                        bigSearch.scrollIntoView({ behavior: 'smooth' });
                    }
                });

                paginationDiv.appendChild(btn);
            }
        }

        // Завантажуємо товари при відкритті сторінки
        loadProducts(filterFromUrl, searchParam);

        // --- ФІЛЬТРАЦІЯ ПО КАТЕГОРІЯХ (Кнопки "Магнітоли", "Камери") ---
        const categoryButtons = document.querySelectorAll('.category-card');
        categoryButtons.forEach(button => {
            if (button.getAttribute('data-category') === filterFromUrl) {
                button.classList.add('active');
            }
            button.addEventListener('click', function() {
                categoryButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                const selectedCategory = this.getAttribute('data-category');
                catalogGrid.innerHTML = '<p style="text-align: center; width: 100%; color: #999;">Оновлюємо каталог...</p>';
                
                // Очищаємо велике поле пошуку, якщо користувач клікнув на категорію
                if(bigSearchInput) bigSearchInput.value = ''; 
                
                loadProducts(selectedCategory, '');
            });
        });
    }
});

// =========================================
// 6. СТОРІНКА ОДНОГО ТОВАРУ (КАРУСЕЛЬ ТА КНОПКА КУПИТИ)
// =========================================
if (window.location.href.includes('product.html')) {
    document.addEventListener('DOMContentLoaded', async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');

        if (!productId || productId === 'null') {
            document.getElementById('loading').innerHTML = 'Помилка: Невірний ID товару.';
            return;
        }

        try {
            const response = await fetch(`https://avtozvuk-api.onrender.com/api/product/${productId}`);
            const product = await response.json();

            if (product.error) {
                document.getElementById('loading').innerHTML = 'Помилка: товар відсутній у базі.';
                return;
            }

            const titleEl = document.getElementById('productTitle') || document.getElementById('product-title');
            if (titleEl) titleEl.innerText = product.title;
            
            const priceEl = document.getElementById('productPrice');
            if (priceEl) priceEl.innerText = product.price;
            
            const descEl = document.getElementById('productDescription');
            if (descEl) descEl.innerHTML = product.description || 'Опис відсутній.';

            // Карусель
            const images = product.gallery_images && product.gallery_images.length > 0 
                         ? product.gallery_images 
                         : [product.image_url]; 

            let currentIndex = 0;
            const isVideo = (url) => url.match(/\.(mp4|mov|avi|mkv|webm)$/i);

            const mainMediaBox = document.getElementById('mainMediaBox');
            const thumbnailTrack = document.getElementById('thumbnailTrack');
            const paginationDots = document.getElementById('paginationDots');
            const progressFill = document.getElementById('progressFill');

            if (mainMediaBox && thumbnailTrack && paginationDots && progressFill) {
                const renderMainMedia = (index) => {
                    mainMediaBox.innerHTML = '';
                    const src = images[index];
                    if (isVideo(src)) {
                        mainMediaBox.innerHTML = `<video src="${src}" controls autoplay muted class="main-media-item"></video>`;
                    } else {
                        mainMediaBox.innerHTML = `<img src="${src}" alt="Фото товару" class="main-media-item">`;
                    }
                };

                const updateCarouselState = () => {
                    renderMainMedia(currentIndex);
                    Array.from(thumbnailTrack.children).forEach((thumb, index) => {
                        thumb.className = `thumb-item ${index === currentIndex ? 'active' : ''}`;
                    });
                    Array.from(paginationDots.children).forEach((dot, index) => {
                        dot.className = `dot ${index === currentIndex ? 'active' : ''}`;
                    });
                    const progress = ((currentIndex + 1) / images.length) * 100;
                    progressFill.style.width = `${progress}%`;
                    const activeThumb = thumbnailTrack.children[currentIndex];
                    if (activeThumb) activeThumb.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                };

                images.forEach((src, index) => {
                    const thumb = isVideo(src) ? document.createElement('video') : document.createElement('img');
                    thumb.src = src;
                    thumb.className = `thumb-item ${index === 0 ? 'active' : ''}`;
                    thumb.addEventListener('click', () => { currentIndex = index; updateCarouselState(); });
                    thumbnailTrack.appendChild(thumb);

                    const dot = document.createElement('div');
                    dot.className = `dot ${index === 0 ? 'active' : ''}`;
                    dot.addEventListener('click', () => { currentIndex = index; updateCarouselState(); });
                    paginationDots.appendChild(dot);
                });

                document.getElementById('prevMainBtn')?.addEventListener('click', () => {
                    currentIndex = (currentIndex > 0) ? currentIndex - 1 : images.length - 1;
                    updateCarouselState();
                });
                document.getElementById('nextMainBtn')?.addEventListener('click', () => {
                    currentIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0;
                    updateCarouselState();
                });
                document.getElementById('prevThumbBtn')?.addEventListener('click', () => thumbnailTrack.scrollBy({ left: -200, behavior: 'smooth' }));
                document.getElementById('nextThumbBtn')?.addEventListener('click', () => thumbnailTrack.scrollBy({ left: 200, behavior: 'smooth' }));

                if (images.length > 0) updateCarouselState();
            }

            const loadingEl = document.getElementById('loading');
            const contentEl = document.getElementById('productContent');
            if (loadingEl) loadingEl.style.display = 'none';
            if (contentEl) contentEl.style.display = 'grid';

        } catch (error) {
            console.error('Помилка:', error);
            const loadingEl = document.getElementById('loading');
            if (loadingEl) loadingEl.innerHTML = 'Помилка зв\'язку з сервером.';
        }

        // Логіка додавання в кошик
        const myCartBtn = document.getElementById('addToCartBtn');
        if (myCartBtn) {
            myCartBtn.addEventListener('click', async () => { 
                try {
                    const response = await fetch('https://avtozvuk-api.onrender.com/api/cart', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ session_id: sessionId, product_id: productId })
                    });
                    const result = await response.json();
                    
                    if (result.success) {
                        updateCartCount(); 
                        const originalHTML = myCartBtn.innerHTML;
                        myCartBtn.innerHTML = '✅ У КОШИКУ';
                        myCartBtn.style.background = '#4ade80';
                        myCartBtn.style.color = '#000';
                        setTimeout(() => {
                            myCartBtn.innerHTML = originalHTML;
                            myCartBtn.style.background = '#3b82f6';
                            myCartBtn.style.color = '#fff';
                        }, 2000);
                    }
                } catch (error) {
                    console.error('Помилка додавання в кошик:', error);
                }
            });
        }
    });
}


// =========================================
// 7. СТОРІНКА "МОЇ ЗАМОВЛЕННЯ"
// =========================================
if (window.location.href.includes('my-orders.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        const ordersContainer = document.getElementById('ordersContainer');
        const userRaw = localStorage.getItem('user');

        if (!userRaw) {
            window.location.href = 'authorization.html';
        } else if (ordersContainer) {
            const user = JSON.parse(userRaw);
            // ЗМІНІТЬ ЦЕЙ РЯДОК:
            fetch(`https://avtozvuk-api.onrender.com/api/my-orders?user_id=${user.id}`) // Тепер передаємо user.id
                .then(res => res.json())
                .then(orders => {
                    if (orders.length === 0) {
                        ordersContainer.innerHTML = '<p style="text-align: center; font-size: 1.1rem; margin-top: 50px;">У вас ще немає замовлень 😢</p>';
                        return;
                    }

                    let html = '';
                    orders.forEach(order => {
                        let items = [];
                        try { items = JSON.parse(order.items); } catch(e) {}

                        let itemsHtml = items.map(item => `
                            <li class="order-item">
                                <span>${item.title} <b>x${item.quantity}</b></span>
                                <span>${item.price * item.quantity} грн</span>
                            </li>
                        `).join('');

                        html += `
                            <div class="order-card">
                                <div class="order-header">
                                    <h3 class="order-id">Замовлення №${order.crm_number || order.id}</h3>
                                </div>
                                <ul class="order-items">
                                    ${itemsHtml}
                                </ul>
                                ${order.comment ? `<div class="order-comment"><b>Коментар:</b> ${order.comment}</div>` : ''}
                                <div class="order-total">Разом: ${order.total_price} грн</div>
                            </div>
                        `;
                    });
                    ordersContainer.innerHTML = html;
                })
                .catch(error => {
                    console.error('Помилка завантаження замовлень:', error);
                    ordersContainer.innerHTML = '<p style="text-align: center; color: red;">Помилка з\'єднання із сервером.</p>';
                });
        }
    });
}
// =========================================
// ЛОГІКА КОШИКА (ПЕРЕНЕСЕНО В SCRIPT.JS)
// =========================================
if (window.location.href.includes('cart.html')) {
    const cartSessionId = localStorage.getItem('session_id');
    const container = document.getElementById('cartItemsContainer');
    const totalBox = document.getElementById('cartTotalBox');
    const totalPriceEl = document.getElementById('cartTotalPrice');

    // 1. Функція завантаження товарів
    async function loadCart() {
        try {
            const response = await fetch(`https://avtozvuk-api.onrender.com/api/cart?session_id=${cartSessionId}`);
            const items = await response.json();

            if (items.length === 0) {
                container.innerHTML = `<div class="empty-cart-message"><h2>Ваш кошик порожній 😔</h2><br><a href="catalog.html" class="btn-return-catalog">Перейти до каталогу</a></div>`;
                if(totalBox) totalBox.style.display = 'none';
                return;
            }

            let html = '';
            let totalSum = 0;
            items.forEach(item => {
                totalSum += item.price * item.quantity;
                html += `
                    <div class="cart-item">
                        <img src="${item.image_url}" alt="Товар">
                        <div class="cart-item-info"><h3>${item.title}</h3></div>
                        <div class="qty-controls">
                            <button class="qty-btn minus-btn" data-id="${item.cart_id}">−</button>
                            <div class="qty-value">${item.quantity}</div>
                            <button class="qty-btn plus-btn" data-id="${item.cart_id}">+</button>
                        </div>
                        <div class="cart-price">${item.price * item.quantity} грн</div>
                        <button class="delete-btn" data-id="${item.cart_id}">🗑️</button>
                    </div>`;
            });
            container.innerHTML = html;
            if(totalPriceEl) totalPriceEl.innerText = totalSum;
            if(totalBox) totalBox.style.display = 'block';
        } catch (error) {
            container.innerHTML = '<p style="color:red;">Помилка завантаження бази даних.</p>';
        }
    }

    // 2. Один єдиний слухач кліків для всього кошика
    document.addEventListener('click', async (e) => {
        const btn = e.target.closest('.plus-btn, .minus-btn, .delete-btn');
        if (!btn) return;

        if (btn.dataset.processing === "true") return;
        btn.dataset.processing = "true";

        let action = '';
        if (btn.classList.contains('plus-btn')) action = 'increase';
        else if (btn.classList.contains('minus-btn')) action = 'decrease';
        else if (btn.classList.contains('delete-btn')) action = 'delete';

        try {
            const response = await fetch('https://avtozvuk-api.onrender.com/api/cart/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cart_id: btn.getAttribute('data-id'), action: action })
            });
            const result = await response.json();
            if (result.success) await loadCart();
        } catch (err) {
            console.error(err);
        } finally {
            btn.dataset.processing = "false";
        }
    });
    // =========================================
    // ЛОГІКА ЗАМОВЛЕННЯ (ЗАМІНІТЬ ЦИМ)
    // =========================================
    // Знаходимо форму та модальне вікно
    const checkoutModal = document.getElementById('checkoutModal');
    const checkoutForm = document.getElementById('checkoutForm');

    if (checkoutForm) {
        checkoutForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Забороняємо стандартну відправку форми

            // Отримуємо ID користувача
            let currentUserId = localStorage.getItem('user_id');
            if (!currentUserId) {
                const userObj = JSON.parse(localStorage.getItem('user') || '{}');
                if (userObj && userObj.id) {
                    currentUserId = userObj.id;
                    localStorage.setItem('user_id', currentUserId);
                }
            }

            // Формуємо дані для відправки
            const orderData = {
                session_id: localStorage.getItem('session_id'),
                user_id: currentUserId,
                name: document.getElementById('clientName').value,
                lastname: document.getElementById('clientLastname').value,
                phone: document.getElementById('clientPhone').value,
                comment: document.getElementById('clientComment').value
            };

            try {
                // Відправляємо замовлення на сервер
                const response = await fetch('https://avtozvuk-api.onrender.com/api/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderData)
                });

                const result = await response.json();
                
                if (result.success) {
                    alert('Замовлення успішно оформлено!');
                    
                    // Закриваємо модалку та очищаємо поля
                    checkoutModal.style.display = 'none';
                    checkoutForm.reset();

                    // Оновлюємо кошик без перезавантаження сторінки
                    // loadCart() — це ваша функція, яку ви визначили вище в цьому ж файлі
                    await loadCart(); 
                    
                } else {
                    alert('Помилка: ' + (result.error || 'Спробуйте ще раз'));
                }
            } catch (error) {
                console.error('Помилка:', error);
                alert('Не вдалося зв\'язатися з сервером. Перевірте підключення.');
            }
        });
    }
    // 3. Логіка модального вікна
    const openCheckoutBtn = document.getElementById('openCheckoutBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');

    if (openCheckoutBtn) {
        console.log("Кнопка оформлення знайдена!"); // ДОДАЙТЕ ЦЕЙ РЯДОК
        openCheckoutBtn.addEventListener('click', () => {
            console.log("На кнопку натиснули!"); // І ЦЕЙ
            if (checkoutModal) checkoutModal.style.display = 'flex';
        });
    } else {
        console.error("Кнопка 'openCheckoutBtn' не знайдена в DOM!"); // І ЦЕЙ
    }
    if (closeModalBtn) closeModalBtn.addEventListener('click', () => checkoutModal.style.display = 'none');

    document.addEventListener('DOMContentLoaded', loadCart);
}