if (!window.jQuery) {
    console.log('s');
    document.write('<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>')
    console.log('s');

}
$(window).ready(function () {
    console.log('st');
    setTimeout(function () {
        console.log('st1');
        if (window.location.href.indexOf('localhost:9797') != -1) {
            console.log('1');
            $('.btn.btn-success.btn-sm').click(function () {
                chrome.runtime.sendMessage({
                    eventPage: "setBtn",
                    orderId: $(this).parent().attr('action').split('=')[1]
                }, function (obj) {
                    console.log(obj)
                });
            })
        }
        chrome.runtime.sendMessage({eventPage: "getIncludeUrl"}, function (obj) {
            console.log('Cтатус записи', obj.statusRec);
            if (obj.statusRec) {
                $.get('https://xn--b1ab8aj6d.xn--p1ai/test/include/tmpl.html',
                    function (data) {
                        var link = document.createElement('div');
                        link.innerHTML = data;
                        document.getElementsByTagName("head")[0].appendChild(link);
                    }
                );
                console.log('Загружены шаблоны');
                $.get('https://xn--b1ab8aj6d.xn--p1ai/test/include/style.css',
                    function (data) {
                        var link = document.createElement('style');
                        link.rel = 'stylesheet';
                        link.type = 'text/css';
                        link.innerHTML = data;
                        document.getElementsByTagName("head")[0].appendChild(link);
                    }
                );
                console.log('Загружены стили');
                $.get('chrome-extension://lbfcfchlgpdbmmdabmjmdapibaoomjmg/js/injected.js',
                    function (data) {
                        var script = document.createElement("script");
                        script.setAttribute("type", "text/javascript");
                        script.innerHTML = data;
                        document.getElementsByTagName("body")[0].appendChild(script);
                        UXC_initialization();
                    }
                );
                console.log('Загружены скрипты');
            }
        });
    }, 500);
});
