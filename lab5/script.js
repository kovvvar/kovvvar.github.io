// Работа с формой и проверка строки: js-form.html и js-match.html.
function calculateCost(event) {
    "use strict";
    event.preventDefault();

    let quantityField = document.getElementsByName("quantity");
    let productField = document.getElementsByName("product");
    let result = document.getElementById("result");

    if (quantityField[0].value.match(/^\d+$/) === null) {
        result.textContent = "Ошибка: введите только цифры без пробелов.";
        return;
    }

    let quantity = parseInt(quantityField[0].value, 10);
    let price = parseInt(productField[0].value, 10);
    let cost = quantity * price;

    if (!Number.isSafeInteger(cost)) {
        result.textContent = "Ошибка: введено слишком большое количество.";
        return;
    }

    result.textContent = "Стоимость заказа: " + cost + " руб.";
}

// Подключение обработчика после загрузки DOM: js-events.html.
window.addEventListener("DOMContentLoaded", function () {
    "use strict";
    let button = document.getElementById("calculate-button");
    button.addEventListener("click", calculateCost);
});
