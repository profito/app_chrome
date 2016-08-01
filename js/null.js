
console.log('null');
console.log($('body'));


$.get('https://xn--b1ab8aj6d.xn--p1ai/test/injected.js',
    function (data) {
        var script = document.createElement("script");
        script.setAttribute("type", "text/javascript");
        script.innerHTML = data;
        console.log(data);
        document.getElementsByTagName("body")[0].appendChild(script);
      
    }
);
