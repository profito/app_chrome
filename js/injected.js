//Обьявляем глобальный обьект для переменных
var UXC_js = {
    allTask: {},
    colTask: 0,
    activeStep: 0
};

function UXC_initialization() {
    console.log('UXC_initialization');
    chrome.runtime.sendMessage({eventPage: "statusRec"}, function (obj) {
        if (obj.openPluginsUxc != "false") {
            //добавляем на страницу UXC контейнер
            $('body').append("<div class='UXC_Plugins'></div>");
            //заполняем его основным шаблоном
            $('.UXC_Plugins').html(tmpl("UXC_tmpl_main", {}));
            $('.uxc_step').html('<img style="" src="chrome-extension://lbfcfchlgpdbmmdabmjmdapibaoomjmg/images/loader.gif">');
            $('.uxc_main_block').html(tmpl("UXC_tmpl_start", {}));
            var uxc_btn_play = $('.uxc_btn_play');
            $(uxc_btn_play).click(function () {
                chrome.runtime.sendMessage({eventPage: "startRec"}, function (obj) {
                    if (obj.UXC_request == true) {
                        chrome.runtime.sendMessage({eventPage: "getStep"}, function (obj) {
                            if (obj.scenario) {
                                $('.uxc_main_block').html(tmpl("UXC_tmpl_step"));
                                $('.uxc_item_description').text(obj.scenario.description);
                                UXC_events_next();
                            }
                        })
                    }
                });
            });
            if (obj.statusRec != "false") {
                chrome.runtime.sendMessage({eventPage: "getStep"}, function (obj) {
                    if (obj.scenario) {
                        $('.uxc_main_block').html(tmpl("UXC_tmpl_step"));
                        $('.uxc_item_description').text(obj.scenario.description);
                        UXC_events_next();
                    }
                })
            }
        }
    });
}

function UXC_events_next() {
    var uxc_item_next = $('.uxc_item_next');
    var uxc_btn_stop = $('.uxc_btn_stop');
    $(uxc_item_next).click(function () {
        chrome.runtime.sendMessage({eventPage: "nextStep"}, function (obj) {
            if (obj.scenario) {
                if (obj.scenario == "finish") {
                    $('.uxc_main_block').html(tmpl("UXC_tmpl_stop"));
                    $(uxc_btn_stop).attr({disabled: false});
                    UXC_events_stop();
                } else {
                    $('.uxc_item_description').text(obj.scenario.description);
                }
            }
        })
    });
}


function UXC_events_stop() {
    var uxc_btn_stop = $('.uxc_btn_stop');
    $(uxc_btn_stop).click(function () {
        chrome.runtime.sendMessage({eventPage: "stopRec"}, function (obj) {
            $('.UXC_Plugins').remove();
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
