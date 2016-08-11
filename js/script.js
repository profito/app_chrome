var config = {
    user: {
        authorization: false
    },
    order_id: '',
    text_error_not_authorization: 'Пожалуйста, авторизуйтесь',
    tabId: 0,
    url: 'http://localhost:9797',
    //url: 'http://192.168.2.121:9797/',
    debug: true,
    uxc_debugger: function (name) {
        if (this.debug) {
            console.log(' ');
            console.log('---Start Debag---');
            console.log('Переменная(ые):', name);
            for (var i = 1; i < arguments.length; i++) {
                console.log(arguments[i]);
            }
            console.log('---Stop Debag---');
            console.log(' ');
        }
    }
};


function authorization() {
    $.ajax({
        type: "GET",
        url: config.url + "/api/account",
        success: function (data) {
            config.user.authorization = true;
            config.uxc_debugger('Данные авторизации', data);
            function getCookiesUXC(domain, name, callback) {
                chrome.cookies.get({"url": domain, "name": name}, function (cookie) {
                    if (callback) {
                        callback(cookie.value);
                    }
                });
            }

            getCookiesUXC(config.url, "CSRF-TOKEN", function (csrf_token) {
                config.uxc_debugger('csrf_token', csrf_token);
                config.csrf_token = csrf_token;
                getCookiesUXC(config.url, "_ym_uid", function (_ym_uid) {
                    config.uxc_debugger('_ym_uid', _ym_uid);
                    config._ym_uid = _ym_uid;
                    setTask();
                });
            });

        },
        error: function (data) {
            if (data.status == 401) {
                config.user.authorization = false;
                updateView();
            }
            $('#task').text(config.text_error_not_authorization);
            updateView();
        }
    });
}


function setTask() {
    $.ajax({
        type: "GET",
        url: config.url + "/api/tester/new-tasks",
        success: function (all_task) {
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
            setBackground("config", config);
            setBackground("allTask", all_task);
            updateView();
        },
        error: function (data) {
            if (data.status == 401) {
                config.user.authorization = false;
                updateView();
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

authorization();

// Работа с DOM (injected.js)
function setDom(code, tabId) {
    chrome.tabs.executeScript(tabId, {code: code});
}

//Работа с Background.js
function setBackground(eventPage, object, objWin, url) {
    chrome.runtime.sendMessage({eventPage: eventPage, obj: object, objWin: objWin, url: url}, function (obj) {
        //config.uxc_debugger('Ответ от фоновой странице:', obj);
        return obj;
    });
}

//Постоянный порт на все страницы
var runtimePort;
chrome.runtime.onConnect.addListener(function (port) {
    runtimePort = port;
    runtimePort.onMessage.addListener(function (message) {
        if (!message || !message.messageFromContentScript1234) {
            config.uxc_debugger('message.messageFromContentScript1234')
            return;
        }
        if (message.sdp) {
            config.uxc_debugger('message.sdp')
        }
    });
});


// text текст выводимый перед отображением первого атребута

