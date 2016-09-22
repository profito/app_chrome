//var idApp = 'dfhbnhciflaelghihmdfldmlpfbiobgc';
var idApp = 'lbfcfchlgpdbmmdabmjmdapibaoomjmg';

if (!window.jQuery) {
    document.write('<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>')
}
$(window).ready(function () {
    setTimeout(function () {
        if (window.location.href.indexOf('app-tester-home/new-tasks') != -1) {
            var intervalID = window.setInterval(function () {
                if ($('.btn.btn-success.btn-sm').length > 0) {
                    $('.btn.btn-success.btn-sm').click(function () {
                        chrome.runtime.sendMessage({
                            eventPage: "setBtn",
                            orderId: $(this).parent().attr('action').split('=')[1]
                        }, function (obj) {
                            // console.log(obj)
                        });
                    });
                    clearInterval(intervalID)
                }
            }, 1000)
        }
        if ((window.location.href.indexOf('app-tester-home') != -1) || (window.location.href.indexOf('app-new-tester-home') != -1)) {
            var intervalTesterHome = window.setInterval(function () {
                if ($('.tester-header-items.header-text a[href="uxcrowd://?orderId=2"]').length > 0) {
                    $('[action="uxcrowd://?orderId=1"]').click(function () {
                        chrome.runtime.sendMessage({
                            eventPage: "setBtn",
                            orderId: 1
                        }, function (obj) {
                        });
                    });

                    $('.tester-header-items.header-text a[href="uxcrowd://?orderId=2"]').click(function () {
                        chrome.runtime.sendMessage({
                            eventPage: "setBtn",
                            orderId: 2
                        }, function (obj) {
                        });
                    });
                    clearInterval(intervalTesterHome)
                }
            }, 1000)
        }
        if (window.location.href.indexOf('instruction4') != -1) {
            var intervalInstruction = window.setInterval(function () {
                if ($('button[type=submit]').length > 0) {
                    $('button[type=submit]').click(function (e) {
                        e.preventDefault();
                        chrome.runtime.sendMessage({
                            eventPage: "setBtn",
                            orderId: '1'
                        }, function (obj) {
                        });
                    });
                    clearInterval(intervalInstruction)
                }
            }, 1000)
        }
        chrome.runtime.sendMessage({eventPage: "getIncludeUrl"}, function (obj) {
            //console.log('Cтатус записи', obj.statusRec);
            if (obj.statusRec) {
                $.get('chrome-extension://' + idApp + '/tmpl/tmpl.html',
                    function (data) {
                        var link = document.createElement('div');
                        link.innerHTML = data;
                        document.getElementsByTagName("head")[0].appendChild(link);
                    }
                );
                //console.log('Загружены шаблоны');
                $.get('chrome-extension://' + idApp + '/css/uxc_injected_style.css',
                    function (data) {
                        var link = document.createElement('style');
                        link.rel = 'stylesheet';
                        link.type = 'text/css';
                        link.innerHTML = data;
                        document.getElementsByTagName("head")[0].appendChild(link);
                    }
                );
                //console.log('Загружены стили');
                $.get('chrome-extension://' + idApp + '/js/injected.js',
                    function (data) {
                        var script = document.createElement("script");
                        script.setAttribute("type", "text/javascript");
                        script.innerHTML = data;
                        document.getElementsByTagName("body")[0].appendChild(script);
                        UXC_initialization();
                    }
                );
                //  console.log('Загружены скрипты');
            }
        });
    }, 500);
});
