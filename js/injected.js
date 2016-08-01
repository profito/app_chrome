console.log('init');
function buildingDom(text) {
    console.log(text);
}
function addEvent() {
    console.log('Обращаемся к фоновой странице eventPage = startStep');
    chrome.runtime.sendMessage({greeting: "hello"}, function (response) {
        console.log(response.farewell);
    });
    console.log('Обращаемся к фоновой странице eventPage = stopStep');
    chrome.runtime.sendMessage({eventPage: "stopStep", step: 2}, function (obj) {
        console.log('Ответ от фоновой странице:', obj.text);
    });
}
