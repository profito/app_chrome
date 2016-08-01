function buildingDom(text) {
    console.log(text);
}
function addEvent() {
    console.log('Обращаемся к фоновой странице eventPage = startStep');
    chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
        console.log(response.farewell);
    });
    $('.uxcrowd_item_tool_step_stop').click(function () {
        console.log('Обращаемся к фоновой странице eventPage = stopStep');
        chrome.runtime.sendMessage({eventPage: "stopStep", step: $(this).data('step')}, function (obj) {
            console.log('Ответ от фоновой странице:', obj.text);
        });
    });
}
