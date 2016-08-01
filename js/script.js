var config = {
    user: {
        authorization: false
    },
    text_error_not_authorization: 'Пожалуйста, авторизуйтесь'
};

function init() {
    console.log('1');
    $.ajax({
        type: "GET",
        url: "http://uxcrowd.ru:8081/api/tester/new-tasks",
        success: function (all_task) {
            config.user.authorization = true;
            var task_dom = "";
            for (var task in all_task) {
                task_dom += "<div class='col-xs-12'>" +
                    "<div class='row item_el'>" +
                    "<div class='col-xs-2 id_el'>" + all_task[task].id + "</div>" +
                    "<div class='col-xs-10 text_el div_content_text' data-placement='bottom' data-toggle='popover' data-trigger='hover' data-content='<span class=\"item_title\">" + all_task[task].url + "</span>' data-original-title='' title=''><a class='href_url' href='" + all_task[task].url + "' data-url='" + all_task[task].url + "'>" + all_task[task].url + "</a></div>" +
                    "</div></div>";
            }
            $('#task').html(task_dom);
            $("[data-toggle=popover]").popover({
                html: true
            });
            $('.href_url').click(function (e) {
                e.preventDefault();
                openPage($(this).data('url'))

            });
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
        $('.not_authorization').hide();
    } else {
        $('.authorization').hide();
        $('.not_authorization').show();
    }
}
function openPage(url) {
    if (url.split(':')[0] == 'http' || url.split(':')[0] == 'https') {
        window.open(url, '_blank');
    } else {
        window.open('http://' + url, '_blank');
    }
}

init();

/*
 function init() {
 $('.nav-tabs a').click(function (e) {
 e.preventDefault();
 $(".tab-pane").hide();
 $($(this).attr('href')).show();
 });

 $('.rec_btn').click(function () {
 setBackground("pageRecId", '0', '0');
 //TODO-front: проверить нет ли открытых
 chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
 $('.rec_btn').append(tabs.id);
 setBackground("pageRecId", tabs.id, tabs.windowId);
 });
 setBackground("startRec", 'init', '');
 function queryTab(tab) {
 console.log('открытый TAB', tab);
 chrome.tabs.query({}, function (array_of_Tabs) {
 var id_tab_rec = '';
 var id_tab_rec_window_id = '';
 for (var i in array_of_Tabs) {
 console.log(array_of_Tabs[i])
 if (array_of_Tabs[i].title == "https://сгвэо.рф/test/index.html") {
 id_tab_rec = array_of_Tabs[i].id;
 id_tab_rec_window_id = array_of_Tabs[i].index;
 console.log(id_tab_rec)
 }
 }
 $('.stop_btn').append(id_tab_rec);
 setBackground("idActiveTab", tab, '');
 });
 }

 chrome.tabs.create({active: false, url: 'https://xn--b1ab8aj6d.xn--p1ai/test/index.html'}, function (tab) {
 queryTab(tab)
 });
 });

 $('.stop_btn').click(function () {
 setBackground("stopRec");
 });


 $.ajax({
 type: "GET",
 url: "http://uxcrowd.ru:8081/api/tester/new-tasks",
 success: function (all_task) {
 console.log('1');
 var task_dom = "";
 for (var task in all_task) {
 if (window.location.href.indexOf(all_task[task].url) != -1) {
 chrome.tabs.getSelected(null, function (tab) { //выбирается ид открытого таба, выполняется коллбек с ним
 chrome.tabs.sendMessage(tab.id, {msg: all_task[task]}); //запрос  на сообщение
 });
 }
 task_dom += "<div class='col-xs-12'><div class='row'><div class='col-xs-2'>" + all_task[task].id + "</div><div class='col-xs-10'>" + all_task[task].url + "</div></div></div>";
 }
 $('#task').html(task_dom);
 },
 error: function (data) {
 console.log('2');
 $('#task').text(data);
 }
 });
 }


 // Работа с DOM (injected.js)
 function setDom(code) {
 chrome.tabs.getSelected(null, function (tab) {
 chrome.tabs.executeScript(tab.id, {code: code});
 });
 }
 //Работа с Background.js
 function setBackground(eventPage, object, objWin) {
 chrome.runtime.sendMessage({eventPage: eventPage, obj: object, objWin: objWin}, function (obj) {
 console.log('Ответ от фоновой странице:', obj.text);
 return obj;
 });
 }

 init();


 $('.btn_login').click(function () {
 $.ajax({
 type: "GET",
 url: "http://uxcrowd.ru:8081/api/authentication",
 method: "POST",
 data: {
 'username': 'win7tester',
 'password': '!QAZxsw2',
 'remember-me': true,
 'submit': 'Login'
 },
 success: function (all_task) {
 console.log('1');
 var task_dom = "";
 for (var task in all_task) {
 if (window.location.href.indexOf(all_task[task].url) != -1) {
 chrome.tabs.getSelected(null, function (tab) { //выбирается ид открытого таба, выполняется коллбек с ним
 chrome.tabs.sendMessage(tab.id, {msg: all_task[task]}); //запрос  на сообщение
 });
 }
 task_dom += "<div class='col-xs-12'><div class='row'><div class='col-xs-2'>" + all_task[task].id + "</div><div class='col-xs-10'>" + all_task[task].url + "</div></div></div>";
 }
 $('#task').html(task_dom);
 },
 error: function (data) {
 console.log('2');
 $('#task').text(data);
 }
 });
 });
 */