/*jslint browser */
// Настройки в объекте, как цены в лабе 6 (getPrices).
function getSettings() {
    "use strict";
    return {
        // Адрес формы на formcarry.com (Your form API endpoint).
        formUrl: "https://formcarry.com/s/4x3w7YgF3zp",
        // Часть адреса, которая появляется, когда открыт попап.
        popupHash: "#feedback",
        // Ключ, под которым значения лежат в LocalStorage.
        storageKey: "feedbackForm"
    };
}

// Показать и скрыть попап, как показ полей в лабе 6 (js-change.html).
function showPopup() {
    "use strict";
    document.getElementById("popup").style.display = "flex";
}

function hidePopup() {
    "use strict";
    document.getElementById("popup").style.display = "none";
}

// Вывод сообщения пользователю: обычное, ошибка или успех.
function showMessage(text, className) {
    "use strict";
    let status = document.getElementById("status");
    status.textContent = text;
    status.className = className;
}

// History API: при открытии попапа добавляем запись в историю
// и меняем адрес страницы (в конце появится #feedback).
function openForm() {
    "use strict";
    let settings = getSettings();
    showMessage("", "");
    showPopup();
    history.pushState({popup: true}, "", settings.popupHash);
}

// Кнопка "Закрыть" работает как кнопка "Назад" в браузере.
function closeForm() {
    "use strict";
    if (history.state !== null && history.state.popup) {
        history.back();
    } else {
        // Страницу открыли сразу по ссылке с #feedback,
        // записи для возврата нет, просто убираем #feedback из адреса.
        history.replaceState(null, "", window.location.pathname);
        hidePopup();
    }
}

// Нажали "Назад" или "Вперед" в браузере: смотрим на адрес страницы.
function checkAddress() {
    "use strict";
    let settings = getSettings();
    if (window.location.hash === settings.popupHash) {
        showPopup();
    } else {
        hidePopup();
    }
}

// LocalStorage: сохраняем значения всех полей в виде JSON,
// как в js-json.html.
function saveForm() {
    "use strict";
    let settings = getSettings();
    let form = document.getElementById("feedback-form");
    let data = {
        agree: form.elements.agree.checked,
        email: form.elements.email.value,
        fio: form.elements.fio.value,
        message: form.elements.message.value,
        organization: form.elements.organization.value,
        phone: form.elements.phone.value
    };
    localStorage.setItem(settings.storageKey, JSON.stringify(data));
}

// Читаем сохраненные значения и подставляем в поля.
function restoreForm() {
    "use strict";
    let settings = getSettings();
    let form = document.getElementById("feedback-form");
    let saved = localStorage.getItem(settings.storageKey);
    if (saved === null) {
        return;
    }
    let data = JSON.parse(saved);
    form.elements.agree.checked = data.agree;
    form.elements.email.value = data.email;
    form.elements.fio.value = data.fio;
    form.elements.message.value = data.message;
    form.elements.organization.value = data.organization;
    form.elements.phone.value = data.phone;
}

// Отправка формы на formcarry.com без перезагрузки страницы (fetch).
function sendForm(event) {
    "use strict";
    event.preventDefault();

    let settings = getSettings();
    let form = document.getElementById("feedback-form");
    let button = document.getElementById("send-button");

    // Проверка телефона регулярным выражением, как в лабе 5 (js-match.html).
    if (form.elements.phone.value.match(/^\+?[0-9 ()\-]{6,20}$/) === null) {
        showMessage("Ошибка: введите телефон цифрами, например +7 900 123-45-67.", "error");
        return;
    }

    showMessage("Отправка...", "");
    button.disabled = true;

    // Заголовок Accept нужен, чтобы formcarry ответил в формате JSON.
    fetch(settings.formUrl, {
        body: new FormData(form),
        headers: {Accept: "application/json"},
        method: "POST"
    }).then(function (response) {
        if (!response.ok) {
            throw new Error("Ответ сервера: " + response.status);
        }
        // Успех: очищаем поля и сохраненные значения.
        form.reset();
        localStorage.removeItem(settings.storageKey);
        showMessage("Спасибо! Сообщение отправлено.", "success");
    }).catch(function (error) {
        showMessage("Ошибка: не удалось отправить сообщение. " + error.message, "error");
    }).then(function () {
        button.disabled = false;
    });
}

// Подключение обработчиков после загрузки DOM: js-events.html.
window.addEventListener("DOMContentLoaded", function () {
    "use strict";
    let settings = getSettings();
    let popup = document.getElementById("popup");
    let form = document.getElementById("feedback-form");

    document.getElementById("open-button").addEventListener("click", openForm);
    document.getElementById("close-button").addEventListener("click", closeForm);
    popup.addEventListener("click", function (event) {
        // Клик по затемнению вокруг формы тоже закрывает попап.
        if (event.target === popup) {
            closeForm();
        }
    });

    window.addEventListener("popstate", checkAddress);
    form.addEventListener("input", saveForm);
    form.addEventListener("submit", sendForm);

    restoreForm();

    // Если страницу открыли по ссылке с #feedback, сразу показываем форму.
    if (window.location.hash === settings.popupHash) {
        showPopup();
    }
});
