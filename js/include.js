if (!window.jQuery) {
    document.write('<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>')
}
$(window).ready(function () {
    setTimeout(function () {
        if (window.location.href.indexOf('uxcrowd.ru:8081') != -1) {
            $('.btn.btn-success.btn-sm').click(function () {
                chrome.runtime.sendMessage({
                    eventPage: "setBtn",
                    orderId: $(this).parent().attr('action').split('=')[1]
                }, function (obj) {
                   // console.log(obj)
                });
            })
        }
        chrome.runtime.sendMessage({eventPage: "getIncludeUrl"}, function (obj) {
            //console.log('Cтатус записи', obj.statusRec);
            if (obj.statusRec) {
                $.get('chrome-extension://imehafdibiebgjhlfjhgfpljhapekiab/tmpl/tmpl.html',
                    function (data) {
                        var link = document.createElement('div');
                        link.innerHTML = data;
                        document.getElementsByTagName("head")[0].appendChild(link);
                    }
                );
            //    console.log('Загружены шаблоны');
                $.get('chrome-extension://imehafdibiebgjhlfjhgfpljhapekiab/css/uxc_injected_style.css',
                    function (data) {
                        var link = document.createElement('style');
                        link.rel = 'stylesheet';
                        link.type = 'text/css';
                        link.innerHTML = data;
                        document.getElementsByTagName("head")[0].appendChild(link);
                    }
                );
            //    console.log('Загружены стили');
                $.get('chrome-extension://imehafdibiebgjhlfjhgfpljhapekiab/js/injected.js',
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
