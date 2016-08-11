var config = {
    user: {
        authorization: false
    },
    text_error_not_authorization: 'Пожалуйста, авторизуйтесь',
    tabId: 0,
    url: 'http://localhost:9797'
    //url: 'http://192.168.2.121:9797/'
};

function init() {
    $.ajax({
        type: "GET",
        url: config.url + "/api/tester/new-tasks",
        success: function (all_task) {
            config.user.authorization = true;
            var task_dom = "";
            for (var task in all_task) {
                task_dom += "<div class='col-xs-12'>" +
                    "<div class='row item_el'>" +
                    "<div class='col-xs-2 id_el'><div class='row'>" + all_task[task].id + "</div></div>" +
                    "<div class='col-xs-10 text_el div_content_text' data-placement='bottom' data-toggle='popover' data-trigger='hover' data-content='<span class=\"item_title\">" + all_task[task].url + "</span>' data-original-title='' title=''><a class='href_url' href='" + all_task[task].url + "' data-url='" + all_task[task].url + "'>" + all_task[task].url + "</a></div>" +
                    "</div></div>";
            }
            $('#task').html(task_dom);
            $("[data-toggle=popover]").popover({
                html: true
            });
            $('.href_url').click(function (e) {
                e.preventDefault();
                openPage($(this).data('url'));
            });
            setBackground("allTask", all_task);
            updateView();
        },
        error: function (data) {
            //TODO-front: добавить проверку других ошибок
            if (data.status == 401) {
                config.user.authorization = false;
            }
            $('#task').text(config.text_error_not_authorization);
            updateView();
        }
    });
}

function updateView() {
    if (config.user.authorization) {
        $('.authorization').show();
        $('.loader').hide();
    } else {
        $('.not_authorization').show();
        $('.loader').hide();
    }
}

//TODO-front: переписать открытие окон
function openPage(url) {
    if (url.split(':')[0] == 'http' || url.split(':')[0] == 'https') {
        chrome.tabs.create({url: url}, function (tabs) {
            config.tabId = tabs.id;
            setBackground("pageRecId", tabs.id, tabs.windowId, url);
        });
    } else {
        chrome.tabs.create({url: 'http://' + url}, function (tabs) {
            config.tabId = tabs.id;
            setBackground("pageRecId", tabs.id, tabs.windowId, url);
        });
    }
}

init();

// Работа с DOM (injected.js)
function setDom(code, tabId) {
    chrome.tabs.executeScript(tabId, {code: code});
}

//Работа с Background.js
function setBackground(eventPage, object, objWin, url) {
    chrome.runtime.sendMessage({eventPage: eventPage, obj: object, objWin: objWin, url: url}, function (obj) {
        console.log('Ответ от фоновой странице:', obj);
        return obj;
    });
}

//Постоянный порт на все страницы
var runtimePort;
chrome.runtime.onConnect.addListener(function (port) {
    runtimePort = port;
    runtimePort.onMessage.addListener(function (message) {
        if (!message || !message.messageFromContentScript1234) {
            console.log('message.messageFromContentScript1234')
            return;
        }
        if (message.sdp) {
            console.log('message.sdp')
        }
    });
});
