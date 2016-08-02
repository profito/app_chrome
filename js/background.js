var statusRec = false;
var pageRecId;
var pageRecWinId;

$.get(chrome.extension.getURL('/js/injected.js'),
    function (data) {
        var script = document.createElement("script");
        script.setAttribute("type", "text/javascript");
        script.innerHTML = data;
        document.getElementsByTagName("head")[0].appendChild(script);
    }
);


setTimeout(setImg, 1000);
function setImg() {
    $.get(chrome.extension.getURL('/js/include.js'),
        function (data) {
            var script = document.createElement("div");
            script.setAttribute("type", "text/javascript");
            script.innerHTML = data;
            document.getElementsByTagName("body")[0].appendChild(script);
        }
    );

}

chrome.tabs.getSelected(null, function (tab) {
    chrome.tabs.captureVisibleTab(pageRecWinId, function (obj) {
        document.getElementsByClassName('testDiv')[0].innerHTML = '<img src="' + obj + '" width="100%" height="100%">'
        //         console.log('<img src="' + obj + '" width="100%" height="100%">')
    });
});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(sender.tab ?
        "from a content script:" + sender.tab.url :
            "from the extension");
        if (request.greeting == "hello")
            sendResponse({farewell: "goodbye"});
    });

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log('Пришло:', request);
    if (request.eventPage == "startStep") {
        sendResponse({text: "Шаг " + request.step + " начат"});
    }
    if (request.eventPage == "stopStep") {
        sendResponse({text: "Шаг " + request.step + " завершен"});
    }
    if (request.eventPage == "idActiveTab") {
        console.log('obj:', request)
        chrome.tabs.query({index: request.obj.index}, function (tab) {
            console.log(tab);
        })
    }
    if (request.eventPage == "startRec") {
        console.log('obj:', request.obj)
        //  sendResponse({text: "Пробуем начать запись "});
        //  if (request.obj != 'init') {
        //statusRec = true;
        console.log(sender);
        //  }
        // // $('iframe#myFrame').contents().find('#start').click();
        //  $('#start').click();

        chrome.tabs.getSelected(null, function (tab) {
            chrome.tabs.captureVisibleTab(pageRecWinId, function (obj) {
                document.getElementsByClassName('testDiv')[0].innerHTML = '<img src="' + obj + '" width="100%" height="100%">'
                //         console.log('<img src="' + obj + '" width="100%" height="100%">')
            });
        });


    }
    if (request.eventPage == "pageRecId") {
        pageRecId = request.obj;
        pageRecWinId = request.objWin;
    }
    if (request.eventPage == "stopRec") {
        sendResponse({text: "Запись остановлена "});
        statusRec = false;
        //$('iframe#myFrame').contents().find('#stop').click();
        document.getElementById('stop').click();
    }
});
function getPage() {
    if (statusRec) {
        chrome.tabs.getSelected(null, function (tab) {
            chrome.tabs.captureVisibleTab(pageRecWinId, function (obj) {
                $.get(chrome.extension.getURL('/js/injected.js'),
                    function (data) {
                        var script = document.createElement("img");
                        script.setAttribute("src", obj);
                        document.getElementsByTagName("body")[0].appendChild(script);
                    }
                );
                document.getElementsByTagName("body")[0].html = document.getElementsByTagName("body")[0].html + '<img src="' + obj + '" width="100%" height="100%">';
                console.log('<img src="' + obj + '" width="100%" height="100%">')
            });
            chrome.tabs.captureVisibleTab(pageRecWinId, function (obj) {
                var img_el = document.createElement("img");
                img_el.setAttribute("src", "http://ya.ru");
                document.getElementsByTagName("body")[0].appendChild(img_el);
                // document.getElementsByClassName('bodu')[0].innerHTML = '<img src="' + obj + '" width="100%" height="100%">'
            });
        });
    }
}
window.onload = listenPort();
function listenPort() {
    chrome.runtime.onConnect.addListener(function (port) {
        console.assert(port.name == "main_port");
        port.onMessage.addListener(function (msg) {
            if (msg.request == "status") {
                chrome.storage.local.get("status", function (r) {
                    port.postMessage({status: r.status});
                    console.log('1')
                });
            }
            if (msg.request2 == "token") {
                chrome.storage.local.get("token", function (r) {
                    port.postMessage({status: r.token});
                    console.log('2')
                });
            }
            console.log('3')
        });
    });
}


setInterval(getPage, 40);

console.log('Загружен!');