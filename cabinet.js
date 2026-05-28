window.enableEdit = function(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
        input.disabled = false;
        input.focus();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const userData = localStorage.getItem('user');
    if (!userData) { window.location.href = 'authorization.html'; return; }

    const user = JSON.parse(userData);
    const oldEmail = user.email; 

    document.getElementById('cabFirstName').value = user.first_name || '';
    document.getElementById('cabLastName').value = user.last_name || '';
    
    const phoneInput = document.getElementById('cabPhone');
    const emailInput = document.getElementById('cabEmail');
    const newPasswordInput = document.getElementById('cabNewPassword');
    
    phoneInput.value = user.phone || '';
    emailInput.value = user.email || '';

    const modal = document.getElementById('passwordModal');
    const modalPasswordInput = document.getElementById('modalConfirmPassword');
    const modalError = document.getElementById('modalError');
    const messageDiv = document.getElementById('message');

    // Кнопка Зберегти
    document.getElementById('saveBtn').addEventListener('click', () => {
        const currentPhone = phoneInput.value;
        const currentEmail = emailInput.value;
        const newPass = newPasswordInput.value;

        if (currentPhone === user.phone && currentEmail === user.email && newPass.trim() === '') {
            messageDiv.innerHTML = '<span style="color: #aaa;">Ви не внесли жодних змін.</span>';
            return;
        }

        modalError.innerHTML = '';
        modalPasswordInput.value = '';
        modal.style.display = 'flex';
    });

    // Кнопки модалки
    document.getElementById('cancelModalBtn').addEventListener('click', () => {
        modal.style.display = 'none';
    });

    document.getElementById('confirmModalBtn').addEventListener('click', async () => {
        const oldPassword = modalPasswordInput.value;
        const phone = phoneInput.value;
        const email = emailInput.value;
        const newPassword = newPasswordInput.value;

        if (oldPassword.trim() === '') {
            modalError.innerHTML = 'Будь ласка, введіть пароль!';
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/api/update-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ oldEmail, phone, email, oldPassword, newPassword })
            });

            const data = await response.json();

            if (!response.ok) {
                modalError.innerHTML = data.error;
            } else {
                modal.style.display = 'none';
                messageDiv.innerHTML = `<span style="color: #4ade80;">${data.message}</span>`;
                
                user.phone = phone;
                user.email = email;
                localStorage.setItem('user', JSON.stringify(user));
                
                phoneInput.disabled = true;
                emailInput.disabled = true;
                newPasswordInput.disabled = true;
                newPasswordInput.value = '';
            }
        } catch (error) {
            modalError.innerHTML = 'Помилка з\'єднання з сервером.';
        }
    });

    // Кнопка Вийти
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('user');
        window.location.href = 'authorization.html';
    });
});
// =========================================
// ПЕРЕВІРКА НА АДМІНА ДЛЯ КНОПКИ CRM
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    const crmBtn = document.getElementById('crmLinkBtn');
    
    if (crmBtn) {
        const userDataString = localStorage.getItem('user');
        
        if (userDataString) {
            try {
                const user = JSON.parse(userDataString);
                
                // Перевіряємо статус адміна
                if (user.is_admin == 1) {
                    crmBtn.style.display = 'block'; // Вмикаємо кнопку!
                }
            } catch (error) {
                console.error('Помилка читання даних користувача');
            }
        }
    }
});
// ЯК ТРЕБА ЗРОБИТИ:
const checkoutForm = document.getElementById('checkoutForm');

    if (checkoutForm) {
        checkoutForm.addEventListener('submit', async (e) => {
            // ... ваш код оформлення замовлення ...
        });
    }

    checkboxes.forEach(cb => {
        updates.push({
            order_id: cb.getAttribute('data-order-id'),
            field: cb.getAttribute('data-field'),
            value: cb.checked
        });
    });

    try {
        const response = await fetch('http://localhost:3001/api/admin/save-all-statuses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ updates })
        });
        
        if (response.ok) alert('Зміни успішно збережено!');
    } catch (e) {
        alert('Помилка збереження');
    }
