var config = {
    user: {
        authorization: false
    },
    order_id: '',
    text_error_not_authorization: 'Пожалуйста, авторизуйтесь',
    text_error_if_role_not_tester: 'Пожалуйста, авторизуйтесь как тестировщик',
    tabId: 0,
    //url: 'https://lk.uxcrowd.ru:8081',
    url: 'http://localhost:9797',
    //url: 'http://192.168.2.121:9797/',
    debug: false
};
var uxc_debugger = function (name) {
    if (config.debug) {
        console.log(' ');
        console.log('---Start Debag---');
        console.log('Переменная(ые):', name);
        for (var i = 1; i < arguments.length; i++) {
            console.log(arguments[i]);
        }
        console.log('---Stop Debag---');
        console.log(' ');
    }
};

function updateView() {
    if (config.user.authorization) {
        $('.authorization').show();
        $('.loader').hide();
    } else {
        $('.not_authorization').show();
        $('.loader').hide();
    }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.eventPage == "allTask") {
        renderStep(JSON.parse(request.obj))
    }
    if (request.eventPage == "allTaskError") {
        uxc_debugger('allTaskError', '');
        config.user.authorization = false;
        $('#task').text(config.text_error_not_authorization);
        updateView();
    }
    if (request.eventPage == "updateView") {
        config.user.authorization = request.objWin;
        $('#task').text(request.obj);
        updateView();
    }
});

function authorization() {
    setBackground("authorization");
}

//TODO-front: переписать открытие окон
function openPage(orderId) {
    chrome.runtime.sendMessage({
        eventPage: "setBtn",
        orderId: orderId
    }, function (obj) {
    });
    /*if (url.split(':')[0] == 'http' || url.split(':')[0] == 'https') {
     chrome.tabs.create({url: url}, function (tabs) {
     config.tabId = tabs.id;
     setBackground("pageRecId", tabs.id, tabs.windowId, url);
     });
     } else {
     chrome.tabs.create({url: 'http://' + url}, function (tabs) {
     config.tabId = tabs.id;
     setBackground("pageRecId", tabs.id, tabs.windowId, url);
     });
     }*/
}

function renderStep(all_task) {
    var task_dom = "";
    for (var task in all_task) {
        task_dom += "<div class='col-xs-12'>" +
            "<div class='row item_el'>" +
            "<div class='col-xs-2 id_el'><div class='row'>" + all_task[task].id + "</div></div>" +
            "<div class='col-xs-10 text_el div_content_text' data-placement='bottom' data-toggle='popover' data-trigger='hover' data-content='<span class=\"item_title\">" + all_task[task].url + "</span>' data-original-title='' title=''><a class='href_url' href='" + all_task[task].url + "' data-id='" + all_task[task].id + "'>" + all_task[task].url + "</a></div>" +
            "</div></div>";
    }
    $('#task').html(task_dom);
    // $("[data-toggle=popover]").popover({
    //     html: true
    // });
    $('.href_url').click(function (e) {
        e.preventDefault();
        openPage($(this).data('id'));
    });
    config.user.authorization = true;
    updateView();
    uxc_debugger('отрисовали шаги all_task', all_task);
}

authorization();

// Работа с DOM (injected.js)
function setDom(code, tabId) {
    chrome.tabs.executeScript(tabId, {code: code});
}

//Работа с Background.js
function setBackground(eventPage, object, objWin, url) {
    chrome.runtime.sendMessage({eventPage: eventPage, obj: object, objWin: objWin, url: url}, function (obj) {
        //uxc_debugger('Ответ от фоновой странице:', obj);
        return obj;
    });
}

//Постоянный порт на все страницы
var runtimePort;
chrome.runtime.onConnect.addListener(function (port) {
    runtimePort = port;
    runtimePort.onMessage.addListener(function (message) {
        if (!message || !message.messageFromContentScript1234) {
            uxc_debugger('message.messageFromContentScript1234')
            return;
        }
        if (message.sdp) {
            uxc_debugger('message.sdp')
        }
    });
});


// text текст выводимый перед отображением первого атребута

