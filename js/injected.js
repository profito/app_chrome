//Обьявляем глобальный обьект для переменных
var UXC_js = {
    allTask: {},
    colTask: 0,
    activeStep: 0
};

function UXC_initialization() {
    console.log('UXC_initialization');
    chrome.runtime.sendMessage({eventPage: "statusRec"}, function (obj) {
        console.log('obj.openPluginsUxc', obj);
        if (obj.openPluginsUxc != "false" && window.location.href.indexOf(obj.host_site) != -1 && window.location.href.indexOf("https://www.google.ru/_/chrome/newtab") == -1) {
            //добавляем на страницу UXC контейнер
            $('body').append("<div class='UXC_Plugins'></div>");
            //заполняем его основным шаблоном
            $('.UXC_Plugins').html(tmpl("UXC_tmpl_main", {}));
            //$('.uxc_step').html('<img style="" src="chrome-extension://lbfcfchlgpdbmmdabmjmdapibaoomjmg/images/loader.gif">');
            //$('body').html(tmpl("UXC_tmpl_start", {}));
            if (obj.helpOpen == "true") {
                next(4);
            }
            var interval_uxc_btn = window.setInterval(function () {
                if ($('.uxc_btn_play').length > 0) {
                    $('.uxc_btn_play').click(function () {
                        document.getElementsByTagName('body')[0].removeChild(document.getElementById('uxc_main_modal'));
                        chrome.runtime.sendMessage({eventPage: "startRec"});
                    });
                    clearInterval(interval_uxc_btn);
                }
            }, 1000);
            if (obj.statusRec != "false") {
                chrome.runtime.sendMessage({eventPage: "getStep"}, function (obj) {
                    console.log('sc', obj);
                    if (obj.scenario) {
                        $('.uxc_main_block').html(tmpl("UXC_tmpl_step"));
                        $('.uxc_item_resume').hide();
                        $('.closeRec').hide();
                        $('.uxc_item_description').text(obj.scenario.description);
                        $('.uxc_text_next').html((Number(obj.activeStep) + 1) + '/' + obj.allStep);
                        $('.uxc_number_element').html('Задание ' + (Number(obj.activeStep) + 1));
                        if ((Number(obj.activeStep) + 1) == obj.allStep) {
                            $('.uxc_item_resume').hide();
                            $('.uxc_item_pause').hide();
                            $('.uxc_item_next').hide();
                            $('.closeRec').show();
                            UXC_events_stop();
                        }
                        UXC_events_next();
                    } else {
                        UXC_open_modal('В данном тестe нет шагов', 'document.getElementsByTagName(\'body\')[0].removeChild(document.getElementById(\'uxc_main_modal\'));', 'Закрыть', '');
                    }
                    UXC_position();
                })

            }
        }
    });

    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            if (request.status_rec == "true") {
                console.log('Запись');
                console.log( $('.uxc_header_rec span'));
                $('.uxc_header_rec').text('Запись');
            }
            if (request.status_rec == "false") {
                console.log('Пауза');
                console.log( $('.uxc_header_rec span'));
                $('.uxc_header_rec').text('Пауза');
            }
            if (request.statusRecEl == "true") {
                chrome.runtime.sendMessage({eventPage: "getStep"}, function (obj) {
                    console.log('sc', obj);
                    if (obj.scenario) {
                        $('.uxc_main_block').html(tmpl("UXC_tmpl_step"));
                        $('.uxc_item_resume').hide();
                        $('.closeRec').hide();
                        $('.uxc_item_description').text(obj.scenario.description);
                        $('.uxc_text_next').html((Number(obj.activeStep) + 1) + '/' + obj.allStep);
                        $('.uxc_number_element').html('Задание ' + (Number(obj.activeStep) + 1));
                        if ((Number(obj.activeStep) + 1) == obj.allStep) {
                            $('.uxc_item_resume').hide();
                            $('.uxc_item_pause').hide();
                            $('.uxc_item_next').hide();
                            $('.closeRec').show();
                            UXC_events_stop();
                        }
                        UXC_events_next();
                    } else {
                        UXC_open_modal('В данном тестe нет шагов', 'document.getElementsByTagName(\'body\')[0].removeChild(document.getElementById(\'uxc_main_modal\'));', 'Закрыть', '');
                    }
                    UXC_position();
                })
            }

            $('.uxc_header_rec span').text('Идет запись');

            if (request.statusRecEl == "false") {
                UXC_open_modal(' К сожалению, данный тест уже завершен.', 'document.getElementsByTagName(\'body\')[0].removeChild(document.getElementById(\'uxc_main_modal\'));', 'Закрыть', '');
            }
            console.log('request', request);
            if (request.statusSend == "true") {
                UXC_open_modal('Спасибо! Ваше видео загрузилось!', 'document.getElementsByTagName(\'body\')[0].removeChild(document.getElementById(\'uxc_main_modal\'));', 'Ok', '');
            }
            if (request.statusSend == "false") {
                UXC_open_modal('Ошибка! Попробуйте позднее!', 'document.getElementsByTagName(\'body\')[0].removeChild(document.getElementById(\'uxc_main_modal\'));', 'Ok', '');
            }
        });

}

function next(num) {
    switch (num) {
        case 1:
            UXC_open_modal('В данном тестировании мы не оцениваем вас.<br> Мы оцениваем только сайты, с которыми вы будете работать.', 'next(2)', 'Далее', 'uxc_green');
            break;
        case 2:
            UXC_open_modal('Пожалуйста, внимательно читайте все задания<br> и громко проговаривайте все ваши действия вслух.', 'next(3)', 'Далее', 'uxc_green');
            break;
        case 3:
            UXC_open_modal('Текст заданий вы увидите в окне в правом верхнем углу экрана <div class="uxc_printscreen"></div>', 'next(4)', 'Далее', 'uxc_green');
            break;
        case 4:
            UXC_open_modal('Если вы готовы приступить к тестированию,<br> нажмите кнопку «Начать запись»', '', 'Начать запись', 'uxc_btn_play uxc_green');
            break;
    }
}


function UXC_open_modal(text, func, text_btn, uxc_class) {
    if (document.getElementById('uxc_main_modal')) {
        document.getElementsByTagName('body')[0].removeChild(document.getElementById('uxc_main_modal'));
    }
    if (func == "two_btn") {
        var uxc_element = document.createElement('div');
        uxc_element.id = "uxc_main_modal";
        uxc_element.innerHTML = tmpl("UXC_tmpl_modal_two", {
            text: text,
            text_one_btn: text_btn,
            uxc_close_btn: 'uxc_close_btn',
            text_two_btn: uxc_class,
            function_one: '',
            function_two: 'document.getElementsByTagName(\'body\')[0].removeChild(document.getElementById(\'uxc_main_modal\'))'
        });
        document.getElementsByTagName('body')[0].appendChild(uxc_element);
    } else {
        if (func == "no_btn") {
            var uxc_element = document.createElement('div');
            uxc_element.id = "uxc_main_modal";
            uxc_element.innerHTML = tmpl("UXC_tmpl_modal_no_btn", {
                text: text
            });
            document.getElementsByTagName('body')[0].appendChild(uxc_element);
        } else {
            var uxc_element = document.createElement('div');
            uxc_element.id = "uxc_main_modal";
            uxc_element.innerHTML = tmpl("UXC_tmpl_modal", {
                text: text,
                funcModal: func,
                textBtn: text_btn,
                uxc_class: uxc_class
            });
            document.getElementsByTagName('body')[0].appendChild(uxc_element);
        }
    }
}


function UXC_events_next() {
    var interval_uxc_close = window.setInterval(function () {
        if ($('.uxc_close').length > 0) {
            $('.uxc_close').click(function () {
                UXC_open_modal('В данный момент происходит запись видео,<br> Вы уверены что хотите прервать запись?', 'two_btn', 'Да', 'Нет')
                var interval_uxc_close_yes = window.setInterval(function () {
                    console.log('uxc_close');
                    if ($('.uxc_close_btn').length > 0) {
                        $('.uxc_close_btn').click(function () {
                            chrome.runtime.sendMessage({eventPage: "exitRec"}, function (obj) {
                            });
                            document.getElementsByTagName('body')[0].removeChild(document.getElementById('uxc_main_modal'));
                            document.getElementsByTagName('body')[0].removeChild(document.getElementsByClassName('UXC_Plugins')[0]);
                        });
                        clearInterval(interval_uxc_close_yes);
                    }
                }, 500);
            });
            clearInterval(interval_uxc_close);
        }
    }, 333);
    var uxc_item_next = $('.uxc_item_next');
    var uxc_btn_stop = $('.uxc_btn_stop');
    $(uxc_item_next).click(function () {
        chrome.runtime.sendMessage({eventPage: "nextStep"}, function (obj) {
            console.log('sc', obj);
            if (obj.scenario) {
                if (obj.scenario == "finish" || (Number(obj.activeStep) + 1) == obj.allStep) {
                    $('.uxc_item_resume').hide();
                    $('.uxc_item_pause').hide();
                    $('.uxc_item_next').hide();
                    $('.closeRec').show();
                    $('.uxc_text_next').html((Number(obj.activeStep) + 1) + '/' + obj.allStep);
                    $('.uxc_number_element').html('Задание ' + (Number(obj.activeStep) + 1));
                    UXC_events_stop();
                } else {
                    $('.uxc_text_next').html((Number(obj.activeStep) + 1) + '/' + obj.allStep);
                    $('.uxc_number_element').html('Задание ' + (Number(obj.activeStep) + 1));
                    $('.uxc_item_description').text(obj.scenario.description);
                }
            } else {
                UXC_open_modal('В данном тестe нет шагов', 'document.getElementsByTagName(\'body\')[0].removeChild(document.getElementById(\'uxc_main_modal\'));', 'Закрыть', '');
            }
        })
    });
    var uxc_item_pause = $('.uxc_item_pause');
    $(uxc_item_pause).click(function () {
        chrome.runtime.sendMessage({eventPage: "pauseRec"}, function (obj) {
            console.log('pauseRec', obj);
            $('.uxc_item_resume').show();
            $('.uxc_item_pause').hide();
            $('.uxc_item_next').hide();
        });
    });
    var resumeRec = $('.uxc_item_resume');
    $(resumeRec).click(function () {
        chrome.runtime.sendMessage({eventPage: "resumeRec"}, function (obj) {
            console.log('resumeRec', obj);
            $('.uxc_item_resume').hide();
            $('.uxc_item_pause').show();
            $('.uxc_item_next').show();
        });
    })

}


function UXC_events_stop() {
    var uxc_btn_stop = $('.uxc_btn_stop');
    $(uxc_btn_stop).click(function () {
        chrome.runtime.sendMessage({eventPage: "stopRec"}, function (obj) {
            $('.UXC_Plugins').remove();
            UXC_open_modal('Пожалуйста, не закрывайте это окно. Идет загрузка видео', 'no_btn');
        });
    });
}

function UXC_events() {
    var UXC_Plugins = $('.UXC_Plugins');
    var uxc_step = $('.uxc_step');
    var uxc_btn_pause = $('.uxc_btn_pause');
    var uxc_item_next = $('.uxc_item_next');
    var uxc_item = $('.uxc_item');
    var uxc_post = $('.uxc_post');
    var uxc_btn_stop = $('.uxc_btn_stop');
    $(uxc_btn_pause).click(function () {
        chrome.runtime.sendMessage({eventPage: "pauseRec"}, function (obj) {
            if (obj.UXC_request == true) {
            }
        });
    });
}

//переключение на активный шаг
function UXC_active_step() {
    var uxc_active_el = $('.uxc_item:eq(' + UXC_js.activeStep + ')');
    if (!(uxc_active_el.hasClass('uxc_active_step'))) {
        $('.uxc_item').removeClass('uxc_active_step');
        $(uxc_active_el).addClass('uxc_active_step');
    }
}


//Шаблонизатор http://javascript.ru/unsorted/templating 03.08.16
(function () {
    var cache = {};
    this.tmpl = function tmpl(str, data) {
        var fn = !/\W/.test(str) ?
            cache[str] = cache[str] ||
                tmpl(document.getElementById(str).innerHTML) :
            new Function("obj",
                "var p=[],print=function(){p.push.apply(p,arguments);};" +
                "with(obj){p.push('" +
                str
                    .replace(/[\r\t\n]/g, " ")
                    .split("<%").join("\t")
                    .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                    .replace(/\t=(.*?)%>/g, "',$1,'")
                    .split("\t").join("');")
                    .split("%>").join("p.push('")
                    .split("\r").join("\\'")
                + "');}return p.join('');");
        return data ? fn(data) : fn;
    };
})();


function UXC_position() {
    console.log('UXC_position()');
    var UXC_block = document.getElementsByClassName("UXC_Plugins")[0];
    var UXC_block_item = document.getElementsByClassName("uxc_panel_header")[0];
    delta_x = 0;
    delta_y = 0;
    /* Ставим обработчики событий на нажатие и отпускание клавиши мыши */
    UXC_block_item.onmousedown = saveXY;

    document.onmouseup = clearXY;
    /* При нажатии кнопки мыши попадаем в эту функцию */
    function saveXY(obj_event) {
        /* Получаем текущие координаты курсора */
        if (obj_event) {
            x = obj_event.pageX;
            y = obj_event.pageY;
        }
        else {
            x = window.event.clientX;
            y = window.event.clientY;
        }
        /* Узнаём текущие координаты блока */
        x_block = UXC_block.offsetLeft;
        y_block = UXC_block.offsetTop;
        /* Узнаём смещение */
        delta_x = x_block - x;
        delta_y = y_block - y;
        /* При движении курсора устанавливаем вызов функции moveWindow */
        document.onmousemove = moveBlock;
    }

    function clearXY() {
        document.onmousemove = null; // При отпускании мыши убираем обработку события движения мыши
    }

    function moveBlock(obj_event) {
        /* Получаем новые координаты курсора мыши */
        if (obj_event) {
            x = obj_event.pageX;
            y = obj_event.pageY;
        }
        else {
            x = window.event.clientX;
            y = window.event.clientY;
        }
        /* Вычисляем новые координаты блока */
        new_x = delta_x + x;
        new_y = delta_y + y;
        UXC_block.style.top = new_y + "px";
        UXC_block.style.left = new_x + "px";
    }
}