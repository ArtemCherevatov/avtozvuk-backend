document.addEventListener('DOMContentLoaded', () => {
    const popularContainer = document.getElementById('catalogGrid');
    
    // Перевіряємо, чи ми на головній сторінці
    if (popularContainer && window.location.href.includes('main.html')) {
        
        // Список ваших 4 ID товарів
        const targetIds = [1, 2, 3, 5]; 
        
        fetch(`https://avtozvuk-api.onrender.com/api/popular-products?ids=${targetIds.join(',')}`)
            .then(response => response.json())
            .then(products => {
                // Повне очищення перед вставкою
                popularContainer.innerHTML = ''; 
                
                // Беремо рівно 4 (про всяк випадок, якщо сервер віддасть більше)
                const limit = products.slice(0, 4);
                
                limit.forEach(product => {
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
            .catch(err => console.error('Помилка популярних:', err));
    }
});