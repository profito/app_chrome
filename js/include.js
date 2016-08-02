chrome.runtime.sendMessage({eventPage: "getIncludeUrl"}, function (obj) {
    if (obj.url) {
        obj.url = obj.url.split('www.')[1] || obj.url;
        obj.url = obj.url.split('https://')[1] || obj.url;
        obj.url = obj.url.split('http://')[1] || obj.url;
        var locUrl = window.location.href;
        locUrl = window.location.href.split('www.')[1] || locUrl;
        locUrl = window.location.href.split('https://')[1] || locUrl;
        locUrl = window.location.href.split('http://')[1] || locUrl;
        while ((obj.url.charAt(obj.url.length - 1) == '/') ||
        (obj.url.charAt(obj.url.length - 1) == '.')) {
            obj.url = obj.url.substring(0, obj.url.length - 1);
        }
        while ((locUrl.charAt(locUrl.length - 1) == '/') ||
        (locUrl.charAt(locUrl.length - 1) == '.')) {
            locUrl = locUrl.substring(0, locUrl.length - 1);
        }
        if (locUrl == obj.url) {
            $.get('https://xn--b1ab8aj6d.xn--p1ai/test/include/tmpl.html',
                function (data) {
                    document.getElementsByTagName("body")[0].innerHTML = document.getElementsByTagName("body")[0].innerHTML + data;
                }
            );
            $.get('https://xn--b1ab8aj6d.xn--p1ai/test/include/style.css',
                function (data) {
                    var link = document.createElement('style');
                    link.rel = 'stylesheet';
                    link.type = 'text/css';
                    link.innerHTML = data;
                    document.getElementsByTagName("head")[0].appendChild(link);
                }
            );
            $.get('https://xn--b1ab8aj6d.xn--p1ai/test/include/injected.js',
                function (data) {
                    var script = document.createElement("script");
                    script.setAttribute("type", "text/javascript");
                    script.innerHTML = data;
                    document.getElementsByTagName("body")[0].appendChild(script);
                }
            );
        }
    }
});
