/*global $ */
// Слайдер на плагине Slick, как в лекции 5 (jQuery и плагин Slick).
// Функция внутри $(document).ready() срабатывает
// после загрузки DOM, как в my.js.
$(document).ready(function () {
    "use strict";

    // Пишем под слайдером текст "Страница 1 из 3".
    // Событие init срабатывает при создании слайдера,
    // afterChange после каждой прокрутки,
    // reInit при смене размера экрана.
    $(".slider").on("init reInit afterChange", function (
        ignore,
        slick,
        currentSlide
    ) {
        let first = currentSlide;
        if (first === undefined) {
            first = 0;
        }
        // Номер страницы = номер первой картинки на экране
        // делим на число картинок, которые листаем за раз.
        let page = Math.ceil(first / slick.options.slidesToScroll) + 1;
        let total = slick.getDotCount() + 1;
        $("#pager").text("Страница " + page + " из " + total);
    });

    // Настройки как в примере с responsive из лекции:
    // на широком экране 3 картинки, на смартфоне (до 600px) одна.
    $(".slider").slick({
        dots: true,
        infinite: false,
        responsive: [
            {
                breakpoint: 600,
                settings: {
                    slidesToScroll: 1,
                    slidesToShow: 1
                }
            }
        ],
        slidesToScroll: 3,
        slidesToShow: 3,
        speed: 300
    });
});
