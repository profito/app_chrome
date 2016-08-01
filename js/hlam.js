function errorHandler(e) {
    var msg = '';

    switch (e.code) {
        case FileError.QUOTA_EXCEEDED_ERR:
            msg = 'QUOTA_EXCEEDED_ERR';
            break;
        case FileError.NOT_FOUND_ERR:
            msg = 'NOT_FOUND_ERR';
            break;
        case FileError.SECURITY_ERR:
            msg = 'SECURITY_ERR';
            break;
        case FileError.INVALID_MODIFICATION_ERR:
            msg = 'INVALID_MODIFICATION_ERR';
            break;
        case FileError.INVALID_STATE_ERR:
            msg = 'INVALID_STATE_ERR';
            break;
        default:
            msg = 'Unknown Error';
            break;
    }
    ;

    console.log('Error: ' + msg);
}


$.get(chrome.extension.getURL('/js/RecordRTC.js'),
    function (data) {
        var script = document.createElement("script");
        script.setAttribute("type", "text/javascript");
        script.innerHTML = data;
        document.getElementsByTagName("head")[0].appendChild(script);
    }
);
$.get(chrome.extension.getURL('/js/screenshot.js'),
    function (data) {
        var script = document.createElement("script");
        script.setAttribute("type", "text/javascript");
        script.innerHTML = data;
        document.getElementsByTagName("head")[0].appendChild(script);
    }
);
$.get(chrome.extension.getURL('/js/ffmpeg_asm.js'),
    function (data) {
        var script = document.createElement("script");
        script.setAttribute("type", "text/javascript");
        script.innerHTML = data;
        document.getElementsByTagName("head")[0].appendChild(script).setAttribute('class', 'ux_crowed');
    }
);
function getUrl() {
    if (window.location.href.split('/')['2'] == 'http://www.ya.ru/') {
        return true;
    } else {
        if (window.location.href == "http://uxcrowd.ru:8081/#/app-tester-home/new-tasks") {
            console.log('uxcrowd')
        }
        return false;
    }
}


chrome.tabs.getSelected(null, function (tab) {
    chrome.tabs.executeScript(tab.id, {
        code: "chrome.extension.sendRequest({content: document.body.innerHTML}, function(response) { console.log('success'); });"
    }, function () {
        console.log('done');
    });
});

chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function (response) {
        console.log(response);
        chrome.tabs.executeScript(tab.id, {code: "addPort('1')"});
    });
});
/*
 chrome.tabs.onUpdated.addListener(function (id, info, tab) {
 if (info.url) {
 if (/url/.test(info.url)) {
 chrome.pageAction.show(id);
 console.log('chrome.tabs');
 console.log(chrome.tabs);
 }
 }
 });
 */

/*window.addEventListener('beforeunload', function (e) {
 e.preventDefault(); var cm = '';
 (e || window.event).returnValue = cm;
 return cm; }, false);*/
// Шаблон отрисовки шагов на клиента
// $('body').append('' +
//     '<script type="text/html" id="item_tmpl">' +
//     '<div id="<%=id%>" class="<%=(i % 2 == 1 ? " even" : "")%>">' +
//     '<div class="grid_1 alpha right">' +
//     '<img class="righted" src="<%=profile_image_url%>"/>' +
//     '</div>' +
//     '<div class="grid_6 omega contents">' +
//     '<p><b><a href="/<%=from_user%>"><%=from_user%></a>:</b> <%=text%></p>' +
//     '</div>' +
//     '</div>' +
//     '</script>');
// var results = $('.uxcrowd_list_step:eq(0)');
// results.html(tmpl("item_tmpl", {id:1, i:6, even:'even', profile_image_url:'urls',from_user:'user',text:'text'}))