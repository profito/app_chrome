//Обьявляем глобальный обьект для переменных
var UXC_js = {
    allTask: {},
    colTask: 0,
    activeStep: 0
};

function UXC_initialization() {
    console.log('UXC_initialization');
    chrome.runtime.sendMessage({eventPage: "statusRec"}, function (obj) {
        if (obj.statusRec != "false") {
            //добавляем на страницу UXC контейнер
            $('body').append("<div class='UXC_Plugins'></div>");
            //заполняем его основным шаблоном
            $('.UXC_Plugins').html(tmpl("UXC_tmpl_main", {}));
            $('.uxc_step').html('<img style="" src="chrome-extension://lbfcfchlgpdbmmdabmjmdapibaoomjmg/images/loader.gif">');

            //запрашиваем шаги
            chrome.runtime.sendMessage({eventPage: "getStep"}, function (obj) {
                console.log('obj.scenario', obj);
                if (obj.scenario) {
                    //отрисовываем шаги
                    $('.uxc_step').html(tmpl("UXC_tmpl_step", {steps: obj.scenario.description}));
                    //делаем первый шак активным
                    UXC_events();
                }
            })
        }
    });
}

// var step = [{
//     'orderNum': 3602,
//     'stepId': 1,
//     'startTime': '00:00:00'
// }, {
//     'orderNum': 3602,
//     'stepId': 2,
//     'startTime': '00:01:00'
// }, {
//     'orderNum': 3602,
//     'stepId': 3,
//     'startTime': '00:02:00'
// }];
//
//
// chrome.runtime.sendMessage({eventPage: "setStep", step: step}, function (obj) {
//     if (obj.UXC_request == true) {
//         $(uxc_btn_play).attr({disabled: true});
//         $(uxc_item_next).attr({disabled: false});
//         console.log('start');
//     }
// });

function UXC_events() {
    var UXC_Plugins = $('.UXC_Plugins');
    var uxc_step = $('.uxc_step');
    var uxc_btn_play = $('.uxc_btn_play');
    var uxc_btn_pause = $('.uxc_btn_pause');
    var uxc_btn_stop = $('.uxc_btn_stop');
    var uxc_item_next = $('.uxc_item_next');
    var uxc_post = $('.uxc_post');
    $(uxc_btn_play).click(function () {
        chrome.runtime.sendMessage({eventPage: "startRec"}, function (obj) {
            if (obj.UXC_request == true) {
                $(uxc_btn_play).attr({disabled: true});
                $(uxc_item_next).attr({disabled: false});
                console.log('start');
            }
        });
    });
    $(uxc_btn_pause).click(function () {
        chrome.runtime.sendMessage({eventPage: "pauseRec"}, function (obj) {
            if (obj.UXC_request == true) {
                console.log('pause');
            }
        });
    });
    $(uxc_btn_stop).click(function () {
        chrome.runtime.sendMessage({eventPage: "stopRec"}, function (obj) {
            if (obj.UXC_request == true) {
                console.log('stop');
            }
        });
    });
    $(uxc_item_next).click(function () {
        chrome.runtime.sendMessage({eventPage: "nextStep"}, function (obj) {
            console.log('obj.scenario', obj);
            if (obj.scenario) {
                if (obj.scenario == "finish") {
                    $('.uxc_step').html(tmpl("UXC_tmpl_step_finish"));
                    $(uxc_btn_stop).attr({disabled:false});
                } else {
                    $('.uxc_item_description').text(obj.scenario.description);
                }
            }
        })
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
