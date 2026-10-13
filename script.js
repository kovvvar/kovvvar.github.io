// Цены в объекте, как в js-json.html и web6/public/my.js.
function getPrices() {
    "use strict";
    return {
        serviceOptions: {
            glossy: 0,
            matte: 20
        },
        serviceProperty: 50,
        serviceTypes: [10, 50, 100]
    };
}

function updateCost() {
    "use strict";
    let quantityField = document.getElementsByName("quantity");
    let types = document.getElementsByName("serviceType");
    let option = document.getElementsByName("serviceOption");
    let property = document.getElementsByName("property");
    let result = document.getElementById("result");
    let serviceType = "1";

    types.forEach(function (radio) {
        if (radio.checked) {
            serviceType = radio.value;
        }
    });

    // Показываем поля по выбранному типу, как в js-change.html.
    let optionGroup = document.getElementById("option-group");
    let propertyGroup = document.getElementById("property-group");
    if (serviceType === "2") {
        optionGroup.style.display = "block";
    } else {
        optionGroup.style.display = "none";
    }
    if (serviceType === "3") {
        propertyGroup.style.display = "block";
    } else {
        propertyGroup.style.display = "none";
    }

    let prices = getPrices();
    let priceIndex = parseInt(serviceType, 10) - 1;
    let price = prices.serviceTypes[priceIndex];

    // Доплата учитывается только у соответствующего типа услуги.
    if (serviceType === "2") {
        price += prices.serviceOptions[option[0].value];
    }
    if (serviceType === "3" && property[0].checked) {
        price += prices.serviceProperty;
    }

    // Проверка количества сохранена из лабы 5 (js-match.html).
    if (quantityField[0].value.match(/^\d+$/) === null) {
        result.textContent = "Ошибка: введите только цифры без пробелов.";
        return;
    }

    let quantity = parseInt(quantityField[0].value, 10);
    let cost = quantity * price;
    if (!Number.isSafeInteger(cost)) {
        result.textContent = "Ошибка: введено слишком большое количество.";
        return;
    }

    result.textContent = "Стоимость услуги: " + cost + " руб.";
}

// Обработчики после загрузки DOM, как в js-change.html.
window.addEventListener("DOMContentLoaded", function () {
    "use strict";
    let quantity = document.getElementsByName("quantity");
    quantity[0].addEventListener("input", updateCost);
    quantity[0].addEventListener("change", updateCost);

    let types = document.getElementsByName("serviceType");
    types.forEach(function (radio) {
        radio.addEventListener("change", updateCost);
    });

    let option = document.getElementsByName("serviceOption");
    option[0].addEventListener("change", updateCost);
    let property = document.getElementsByName("property");
    property[0].addEventListener("change", updateCost);

    let form = document.getElementById("calculator");
    form.addEventListener("submit", function (event) {
        event.preventDefault();
    });

    updateCost();
});
