// Muaz Khan     - https://github.com/muaz-khan
// MIT License   - https://www.WebRTC-Experiment.com/licence/
// Source Code   - https://github.com/muaz-khan/Chrome-Extensions
console.log('background.js');

var all_task = {};
var config = {
    user: {
        authorization: false
    },
    order_id: localStorage.getItem('orderId') || '',
    text_error_not_authorization: 'Пожалуйста, авторизуйтесь',
    text_error_if_role_not_tester: 'Пожалуйста, авторизуйтесь как тестировщик',
    tabId: 0,
    url: 'https://testlk.uxcrowd.ru',
    //url: 'http://localhost:9797',
    //url: 'http://192.168.2.121:9797/',
    debug: false,
    allTime: [],
    activeStep: function () {
        return localStorage.getItem('activeStep')
    },
    nextStep: function (step) {
        uxc_debugger('localStorage.getItem(activeStep)', localStorage.getItem('activeStep'));
        localStorage.setItem('activeStep', (Number(localStorage.getItem('activeStep')) + 1));
    },
    scenario: function () {
        return JSON.parse(localStorage.getItem('scenario'));
    },
    step: JSON.parse(localStorage.getItem('allTask')),
    // getScenario: function () {
    //     for (var i in this.step) {
    //         if (this.step[i].id == this.order_id) {
    //             this.scenario = this.step[i].scenario;
    //         }
    //     }
    // },
    getActiveStep: function () {
        // this.getScenario();
        if (this.scenario().steps.length == 0) {
            return false;
        } else {
            uxc_debugger('orderNum', this.scenario().steps[this.activeStep()].orderNum);
            localStorage.setItem('orderNum', (this.scenario().steps[this.activeStep()].orderNum));
            return this.scenario().steps[this.activeStep()]
        }
    },
    resetStep: function () {
        localStorage.setItem('activeStep', 0);
    },
    addTime: function () {
        this.allTime.push({
            startTime: dateDiff(localStorage.getItem('startDate'), new Date()),
            orderNum: localStorage.getItem('orderNum')
        });
        uxc_debugger('this.allTime', this.allTime);
    },
    createSteps: function () {
        var fullStepAndTime = [];
        var scenario = this.scenario();
        for (var num in scenario.steps) {
            fullStepAndTime.push({
                'orderNum': scenario.steps[num].orderNum,
                'stepId': scenario.steps[num].id,
                'startTime': this.allTime[num].startTime
            });
        }
        return fullStepAndTime;
    }
};

function dateDiff(date1, date2) {
    date1 = new Date(date1);
    date2 = new Date(date2);

    var seconds = date2.getSeconds() - date1.getSeconds();
    if (seconds < 0) {
        seconds += 60;
        date2.setMinutes(date2.getMinutes() - 1);
    }
    var minutes = date2.getMinutes() - date1.getMinutes();
    if (minutes < 0) {
        minutes += 60;
        date2.setHours(date2.getHours() - 1);
    }
    var hours = date2.getHours() - date1.getHours();
    if (hours < 0) {
        hours += 24;
        date2.setDate(date2.getDate() - 1);
    }
    if (hours < 10) {
        hours = '0' + hours;
    }
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    if (seconds < 10) {
        seconds = '0' + seconds;
    }
    return hours + ':' + minutes + ':' + seconds;
}

localStorage.setItem('tabRecAudio', false);
localStorage.setItem('RecUxc', false);
localStorage.setItem('openPluginsUxc', false);
localStorage.setItem('host_site', '');
localStorage.setItem('helpOpen', false);

var mainPageUrl = '';
var mainPageScenario = {};
var localSaveBlob = '';
var step = JSON.parse(localStorage.getItem('allTask'));
var uxc_debugger = function (name) {
    if (config.debug) {
        console.log(' ');
        console.log('%c---Start Debag---', 'background: #ffffff; color: #ff0000');
        console.log('%cПеременная(ые):', 'background: #ffffff; color: #ff0000', name);
        for (var i = 1; i < arguments.length; i++) {
            console.log(arguments[i]);
        }
        console.log('%c---Stop Debag---', 'background: #ffffff; color: #ff0000');
        console.log(' ');
    }
};

function saveVideo() {
    uxc_debugger('saveVideo', 'зашел');
    var steps = config.createSteps();
    uxc_debugger('createSteps', config.createSteps());
    uxc_debugger('localStorage.getItem(taskIdResponse)', localStorage.getItem('taskIdResponse'));
    uxc_debugger('saveVideo', 'зашел');
    var formData = new FormData();
    formData.append('task-id', localStorage.getItem('taskIdResponse'));
    formData.append('video-file', localSaveBlob);
    formData.append('name', formData.get('video-file').name + '.webm');
    formData.append('tag-dto', JSON.stringify(steps));
    var xhr = new XMLHttpRequest();
    xhr.upload.onprogress = function (event) {
        uxc_debugger('Загружено на сервер', event.loaded + ' байт из ' + event.total);
    };
    xhr.open("POST", config.url + '/api/video-upload-app/', true);
    xhr.setRequestHeader('X-CSRF-Token', config.csrf_token);
    xhr.onreadystatechange = function () {
        uxc_debugger('xhr.readyState, XMLHttpRequest.DONE, xhr.status ', xhr.readyState, XMLHttpRequest.DONE, xhr.status);
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            if (localStorage.getItem('tabRecAudio') != "false") {
                chrome.tabs.remove(Number(localStorage.getItem('tabRecAudio')), function (obj) {
                    localStorage.setItem('tabRecAudio', false);
                    uxc_debugger('obj close tab recAudio', obj);
                    uxc_debugger('Tab RecAudio closed');
                });
            }
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {statusSend: "true"});
            });
            location.reload();
        } else {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 404) {
                if (localStorage.getItem('tabRecAudio') != "false") {
                    chrome.tabs.remove(Number(localStorage.getItem('tabRecAudio')), function (obj) {
                        localStorage.setItem('tabRecAudio', false);
                        uxc_debugger('obj close tab recAudio', obj);
                        uxc_debugger('Tab RecAudio closed');
                    });
                }
                chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, {statusSend: "false"});
                });
                location.reload();
            }
        }
    };
    xhr.send(formData);
    console.log('Записали закрыли ', localStorage.getItem('tabRecAudio'));
    console.log(localStorage.getItem('tabRecAudio') != "false");
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.eventPage == "config") {
        config = request.obj;
    }
    if (request.eventPage == "pageRecId") {
        pageRecId = request.obj;
        pageRecWinId = request.objWin;
        mainPageUrl = request.url;
    }
    if (request.eventPage == "allTask") {
        all_task = request.obj;
    }
    if (request.eventPage == "getIncludeUrl") {
        sendResponse({statusRec: localStorage.getItem('RecUxc')});
    }
    if (request.eventPage == "getStep") {
        if (config.getActiveStep()) {
            sendResponse({scenario: config.getActiveStep()});
            config.allTime.push({startTime: "00:00:00", orderNum: localStorage.getItem('orderNum')});
        } else {
            sendResponse({scenario: false});
            location.reload();
        }
    }
    if (request.eventPage == "exitRec") {
        var idTab = Number(localStorage.getItem('tabRecAudio'));
        if(localStorage.getItem('tabRecAudio')!="false") {
            chrome.tabs.remove(idTab, function (obj) {
                localStorage.setItem('tabRecAudio', false);
                console.log('exitRec закрыли ', localStorage.getItem('tabRecAudio'));
                uxc_debugger('obj close tab recAudio', obj);
                uxc_debugger('Tab RecAudio closed');
            });
        }
        location.reload();

    }
    if (request.eventPage == "nextStep") {
        if (config.activeStep() >= (config.scenario().steps.length - 1)) {
            config.resetStep();
            sendResponse({scenario: 'finish'});
        } else {
            config.nextStep();
            if (config.getActiveStep()) {
                sendResponse({scenario: config.getActiveStep()});
                config.addTime();
            } else {
                sendResponse({scenario: false});
                location.reload();
            }
        }
    }
    if (request.eventPage == "startRec") {
        var orderId = localStorage.getItem('orderId');
        $.ajax({
            url: config.url + '/api/tester/create-task?orderId=' + orderId,
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                localStorage.setItem('taskIdResponse', data.id);
                localStorage.setItem('startDate', new Date());
                getUserConfigs();
                config.resetStep();
                localStorage.setItem('RecUxc', true);
                chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, {statusRecEl: "true"});
                });
                localStorage.setItem('helpOpen', false);
            },
            error: function (data) {
                localStorage.setItem('RecUxc', false);
                chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, {statusRecEl: "false"});
                });
                localStorage.setItem('helpOpen', true);
            }
        });

    }
    if (request.eventPage == "pauseRec") {
        recorder.pauseRecording();
        sendResponse({UXC_request: true});
    }
    if (request.eventPage == "stopRec") {
        localStorage.setItem('RecUxc', false);
        localStorage.setItem('openPluginsUxc', false);
        getUserConfigs();
        sendResponse({UXC_request: localStorage.getItem('RecUxc')});
        if (localStorage.getItem('tabRecAudio') != false) {
            var idTab = Number(localStorage.getItem('tabRecAudio'));
            chrome.tabs.remove(idTab, function (obj) {
                localStorage.setItem('tabRecAudio', false);
                console.log('stopRec закрыли ', localStorage.getItem('tabRecAudio'));
                uxc_debugger('obj close tab recAudio', obj);
                uxc_debugger('Tab RecAudio closed');
            })
        }
    }
    if (request.eventPage == "setBtn") {
        authorization();
        localStorage.setItem('helpOpen', true);
        localStorage.setItem('orderId', request.orderId);
        uxc_debugger('orderId из истории', localStorage.getItem('orderId'));
        startRender();
        sendResponse({UXC_request: true});
        localStorage.setItem('openPluginsUxc', true);
    }
    if (request.eventPage == "setStep") {
        uxc_debugger('Шаги', request.step);
        step = request.step;
        sendResponse({UXC_request: true});
    }
    if (request.eventPage == "statusRec") {
        uxc_debugger('statusRec', localStorage.getItem('RecUxc'));
        sendResponse({
            statusRec: localStorage.getItem('RecUxc'),
            openPluginsUxc: localStorage.getItem('openPluginsUxc'),
            host_site: localStorage.getItem('host_site'),
            helpOpen: localStorage.getItem('helpOpen')
        });
    }
    if (request.eventPage == "authorization") {
        uxc_debugger('authorization');
        authorization();
    }
    if (request.eventPage == "stepRec") {
        uxc_debugger('stepRec');
        authorization();
    }
});
chrome.browserAction.setIcon({
    path: 'images/main-icon.png'
});

localStorage.setItem('allStep', {});

function addStep() {
    var obj_step = JSON.stringify(localStorage.getItem('allStep'));
    obj_step(new Date(localStorage.getItem('startDate')).getHours() + ':' + new Date(localStorage.getItem('startDate')).getMinutes() + ':' + new Date(localStorage.getItem('startDate')).getSeconds());
}

function authorization() {
    $.ajax({
        type: "GET",
        url: config.url + "/api/account",
        success: function (data) {
            uxc_debugger('Роль', data.role);
            //TODO-front: сделать отдельные оповещения на роли
            if (data.role == "ROLE_TESTER") {
                config.user.authorization = true;
                uxc_debugger('Данные авторизации', data);
                getCookiesUXC(config.url, "CSRF-TOKEN", function (csrf_token) {
                    uxc_debugger('csrf_token', csrf_token);
                    config.csrf_token = csrf_token;
                    getCookiesUXC(config.url, "_ym_uid", function (_ym_uid) {
                        uxc_debugger('_ym_uid', _ym_uid);
                        config._ym_uid = _ym_uid;
                        setTask();
                    });
                });
            } else {
                config.user.authorization = true;
                setScript('updateView', config.text_error_if_role_not_tester, true);
            }
        },
        error: function (data) {
            uxc_debugger('/api/account error data', data);
            config.user.authorization = false;
            setScript('updateView', config.text_error_not_authorization, false);
        }
    });
}

function setTask() {
    uxc_debugger('config', config);
    $.ajax({
        type: "GET",
        url: config.url + "/api/tester/new-tasks",
        success: function (all_task) {
            uxc_debugger('allTask', all_task);
            localStorage.setItem('allTask', JSON.stringify(all_task));
            setScript('allTask', localStorage.getItem('allTask'));
        },
        error: function (data) {
            setScript('allTaskError');
            uxc_debugger('error api/tester/new-tasks', data);
        }
    });
}

function getCookiesUXC(domain, name, callback) {
    chrome.cookies.get({"url": domain, "name": name}, function (cookie) {
        if (callback) {
            callback(cookie.value);
        }
    });
}


function startRender() {
    var orderId = localStorage.getItem('orderId');
    uxc_debugger('orderId из истории', localStorage.getItem('orderId'));
    var list_task = JSON.parse(localStorage.getItem('allTask'));
    if (orderId != 2 && orderId != 1) {
        for (var num in list_task) {
            // uxc_debugger('list_task' + num, list_task[num]);
            if (list_task[num].id == orderId) {
                mainPageUrl = list_task[num].url;
                mainPageScenario = list_task[num].scenario;
                localStorage.setItem('scenario', JSON.stringify(mainPageScenario));
                startRenderFunction();
            }
        }
    } else {
        $.ajax({
            url: config.url + '/api/tester/order-info?id=' + orderId,
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                mainPageUrl = data.site;
                $.ajax({
                    url: config.url + '/new-scenario?orderId=' + orderId,
                    method: 'GET',
                    dataType: 'json',
                    success: function (data) {
                        mainPageScenario = data;
                        localStorage.setItem('scenario', JSON.stringify(mainPageScenario));
                        startRenderFunction();
                    }
                })
            },
            error: function (data) {
                uxc_debugger('error startRender()', data);
            }
        });
    }

}

function startRenderFunction() {

    uxc_debugger('mainPageUrl.split(.)[0]', mainPageUrl.split('.')[0]);
    var newMainPageUrl = '';
    if (mainPageUrl.split('.')[0] == 'www') {
        newMainPageUrl = 'http://' + mainPageUrl;
    } else {
        if (mainPageUrl.split(':')[0] == 'https') {
            newMainPageUrl = mainPageUrl;
        } else {
            if (mainPageUrl.split(':')[0] == 'http') {
                newMainPageUrl = mainPageUrl;
            } else {
                newMainPageUrl = 'http://' + mainPageUrl;
            }
        }
    }
    uxc_debugger('host_site1', '');
    chrome.tabs.create({url: newMainPageUrl}, function (tabs) {
        config.tabId = tabs.id;
        var host_site = '';
        if (tabs.url.split('/')[0] == 'http:' || tabs.url.split('/')[0] == 'https:') {
            host_site = tabs.url.split('/')[2];
        } else {
            host_site = tabs.url.split('/')[0];
        }
        if (host_site.split('.').length > 2 && host_site.split('.')[host_site.split('.').length - 1] != '') {
            if (host_site.split('.')[0] == 'www') {
                host_site = host_site.split('.')[1];
            } else {
                host_site = host_site.split('.')[0];
            }
        } else {
            host_site = host_site.split('.')[0];
        }
        uxc_debugger('tabs', tabs);
        uxc_debugger('host_site', host_site);
        localStorage.setItem('host_site', host_site);
        localStorage.setItem('tabsId', tabs.id);
        localStorage.setItem('index', tabs.index);
    });
    uxc_debugger('startRender', '');
}

//Работа с script.js
function setScript(eventPage, object, objWin, url) {
    chrome.runtime.sendMessage({eventPage: eventPage, obj: object, objWin: objWin, url: url}, function (obj) {
        //uxc_debugger('Ответ от фоновой странице:', obj);
        return obj;
    });
}


/*-------------------------------                   ---REC---                      -----------------------------------*/
/*-------------------------------                   ---REC---                      -----------------------------------*/
/*-------------------------------                   ---REC---                      -----------------------------------*/
/*-------------------------------                   ---REC---                      -----------------------------------*/
/*-------------------------------                   ---REC---                      -----------------------------------*/
/*-------------------------------                   ---REC---                      -----------------------------------*/
//chrome.browserAction.onClicked.addListener(getUserConfigs);

function captureDesktop() {
    if (recorder && recorder.stream && recorder.stream.onended) {
        recorder.stream.onended();
        return;
    }


    chrome.browserAction.setIcon({
        path: 'images/main-icon.png'
    });

    var screenSources = ['window', 'screen'];

    if (enableTabAudio) {
        screenSources = ['tab', 'audio'];
    }

    try {
        chrome.desktopCapture.chooseDesktopMedia(screenSources, onAccessApproved);
    } catch (e) {
        getUserMediaError();
    }
}

var recorder;

function onAccessApproved(chromeMediaSourceId) {
    if (!chromeMediaSourceId || !chromeMediaSourceId.toString().length) {
        if (getChromeVersion() < 53) {
            getUserMediaError();
            return;
        }

        askToStopExternalStreams();
        setDefaults();
        chrome.runtime.reload();
        return;
    }

    var constraints = {
        audio: false,
        video: {
            mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: chromeMediaSourceId
            },
            optional: []
        }
    };

    if (aspectRatio) {
        constraints.video.mandatory.minAspectRatio = aspectRatio;
    }

    if (videoMaxFrameRates && videoMaxFrameRates.toString().length) {
        videoMaxFrameRates = parseInt(videoMaxFrameRates);

        // 30 fps seems max-limit in Chrome?
        if (videoMaxFrameRates /* && videoMaxFrameRates <= 30 */) {
            constraints.video.maxFrameRate = videoMaxFrameRates;
        }
    }

    if (resolutions.maxWidth && resolutions.maxHeight) {
        constraints.video.mandatory.maxWidth = resolutions.maxWidth;
        constraints.video.mandatory.maxHeight = resolutions.maxHeight;
    }

    if (enableTabAudio) {
        constraints.audio = {
            mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: chromeMediaSourceId
            },
            optional: []
        };
    }

    navigator.webkitGetUserMedia(constraints, gotStream, getUserMediaError);

    function gotStream(stream) {
        var options = {
            type: 'video',
            disableLogs: false,
            recorderType: MediaStreamRecorder // StereoAudioRecorder
        };

        if (videoCodec && videoCodec !== 'Default') {
            options.mimeType = 'video/webm; codecs=' + videoCodec.toLowerCase();
        }

        if (getChromeVersion() >= 52) {
            if (audioBitsPerSecond) {
                audioBitsPerSecond = parseInt(audioBitsPerSecond);
                if (!audioBitsPerSecond || audioBitsPerSecond > 128) { // 128000
                    audioBitsPerSecond = 128;
                }
                if (!audioBitsPerSecond || audioBitsPerSecond < 6) {
                    audioBitsPerSecond = 6; // opus (smallest 6kbps, maximum 128kbps)
                }
            }

            if (videoBitsPerSecond) {
                videoBitsPerSecond = parseInt(videoBitsPerSecond);
                if (!videoBitsPerSecond || videoBitsPerSecond < 100) {
                    videoBitsPerSecond = 100; // vp8 (smallest 100kbps)
                }
            }

            if (enableTabAudio || enableMicrophone) {
                if (audioBitsPerSecond) {
                    options.audioBitsPerSecond = audioBitsPerSecond * 1000;
                }
                if (videoBitsPerSecond) {
                    options.videoBitsPerSecond = videoBitsPerSecond * 1000;
                }
            } else if (videoBitsPerSecond) {
                options.bitsPerSecond = videoBitsPerSecond * 1000;
            }
        }

        if (audioStream && audioStream.getAudioTracks && audioStream.getAudioTracks().length) {
            audioPlayer = document.createElement('audio');
            audioPlayer.src = URL.createObjectURL(audioStream);

            context = new AudioContext();

            var gainNode = context.createGain();
            gainNode.connect(context.destination);
            gainNode.gain.value = 0; // don't play for self

            mediaStremSource = context.createMediaStreamSource(audioStream);
            mediaStremSource.connect(gainNode);

            mediaStremDestination = context.createMediaStreamDestination();
            mediaStremSource.connect(mediaStremDestination)

            stream.addTrack(mediaStremDestination.stream.getAudioTracks()[0]);
        }

        recorder = RecordRTC(stream, options);

        try {
            recorder.startRecording();
            alreadyHadGUMError = false;
        } catch (e) {
            getUserMediaError();
        }

        recorder.stream = stream;

        isRecording = true;
        onRecording();

        recorder.stream.onended = function () {
            if (recorder && recorder.stream) {
                recorder.stream.onended = function () {
                };
            }

            stopScreenRecording();
        };

        recorder.stream.getVideoTracks()[0].onended = function () {
            if (recorder && recorder.stream && recorder.stream.onended) {
                recorder.stream.onended();
            }
        };

        initialTime = Date.now()
        timer = setInterval(checkTime, 100);
    }
}

function askToStopExternalStreams() {
    try {
        runtimePort.postMessage({
            stopStream: true,
            messageFromContentScript1234: true
        });
    } catch (e) {
    }
}

function getLocalBlob() {
    invokeSaveAsDialog(localSaveBlob, 'UXCrowd-' + (new Date).toISOString().replace(/:|\./g, '-') + '.webm');
}

var peer;

function stopScreenRecording() {
    isRecording = false;

    recorder.stopRecording(function () {

        convertElement(recorder.blob);

        localSaveBlob = recorder.blob;

        saveVideo();

        //сохранение видео не клиент
        //invokeSaveAsDialog(recorder.blob, 'UXCrowd-' + (new Date).toISOString().replace(/:|\./g, '-') + '.webm');

        /*


         */

        askToStopExternalStreams();

        try {
            peer.close();
            peer = null;
        } catch (e) {
        }

        try {
            audioPlayer.src = null;
            mediaStremDestination.disconnect();
            mediaStremSource.disconnect();
            context.disconnect();
            context = null;
        } catch (e) {
        }
    });

    if (timer) {
        clearTimeout(timer);
    }
    setBadgeText('');

    chrome.browserAction.setTitle({
        title: 'Record Screen'
    });
}

function setDefaults() {
    chrome.browserAction.setIcon({
        path: 'images/main-icon.png'
    });

    if (recorder && recorder.stream) {
        recorder.stream.stop();
        if (recorder && recorder.stream && recorder.stream.onended) {
            recorder.stream.onended();
        }
    }

    recorder = null;
    isRecording = false;
    imgIndex = 0;
}

var isRecording = false;
var images = ['recordRTC-progress-1.png', 'recordRTC-progress-2.png', 'recordRTC-progress-3.png', 'recordRTC-progress-4.png', 'recordRTC-progress-5.png'];
var imgIndex = 0;
var reverse = false;

function onRecording() {
    chrome.browserAction.setIcon({
        path: 'images/' + images[imgIndex]
    });

    if (!reverse) {
        imgIndex++;

        if (imgIndex > images.length - 1) {
            imgIndex = images.length - 1;
            reverse = true;
        }
    } else {
        imgIndex--;

        if (imgIndex < 0) {
            imgIndex = 1;
            reverse = false;
        }
    }

    if (isRecording) {
        setTimeout(onRecording, 800);
        return;
    }

    chrome.browserAction.setIcon({
        path: 'images/main-icon.png'
    });
}

function setBadgeText(text) {
    chrome.browserAction.setBadgeBackgroundColor({
        color: [39, 230, 90, 255]
    });

    chrome.browserAction.setBadgeText({
        text: text + ''
    });
}

var initialTime, timer;

function checkTime() {
    if (!initialTime) return;
    var timeDifference = Date.now() - initialTime;
    var formatted = convertTime(timeDifference);
    setBadgeText(formatted);

    chrome.browserAction.setTitle({
        title: 'Recording duration: ' + formatted
    });
}

function convertTime(miliseconds) {
    var totalSeconds = Math.floor(miliseconds / 1000);
    var minutes = Math.floor(totalSeconds / 60);
    var seconds = totalSeconds - minutes * 60;

    minutes += '';
    seconds += '';

    if (minutes.length === 1) {
        // minutes = '0' + minutes;
    }

    if (seconds.length === 1) {
        seconds = '0' + seconds;
    }

    return minutes + ':' + seconds;
}

function getChromeVersion() {
    var raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
    return raw ? parseInt(raw[2], 10) : 52;
}

var resolutions = {
    maxWidth: 29999,
    maxHeight: 8640
};
var aspectRatio = 1.77;
var audioBitsPerSecond = 0;
var videoBitsPerSecond = 0;

var enableTabAudio = false;
var enableMicrophone = false;
var audioStream = false;

var videoCodec = 'Default';
var videoMaxFrameRates = '';

function getUserConfigs() {
    chrome.storage.sync.get(null, function (items) {
        if (items['audioBitsPerSecond'] && items['audioBitsPerSecond'].toString().length) {
            audioBitsPerSecond = parseInt(items['audioBitsPerSecond']);
        }

        if (items['videoBitsPerSecond'] && items['videoBitsPerSecond'].toString().length) {
            videoBitsPerSecond = parseInt(items['videoBitsPerSecond']);
        }

        if (items['enableTabAudio']) {
            enableTabAudio = items['enableTabAudio'] == 'true';
        }

        if (items['enableMicrophone']) {
            enableMicrophone = items['enableMicrophone'] == 'true';
        }

        if (items['videoCodec']) {
            videoCodec = items['videoCodec'];
        }

        if (items['videoMaxFrameRates'] && items['videoMaxFrameRates'].toString().length) {
            videoMaxFrameRates = parseInt(items['videoMaxFrameRates']);
        }

        var _resolutions = items['resolutions'];
        if (!_resolutions || _resolutions == 'Default (29999x8640)') {
            resolutions = {
                maxWidth: 29999,
                maxHeight: 8640
            };

            chrome.storage.sync.set({
                resolutions: _resolutions
            }, function () {
            });
        }

        if (_resolutions === '4K UHD (3840x2160)') {
            //  16:9
            aspectRatio = 1.77;

            resolutions.maxWidth = 3840;
            resolutions.maxHeight = 2160;
        }

        if (_resolutions === 'WQXGA (2560x1600)') {
            //  16:10
            aspectRatio = 1.6;

            resolutions.maxWidth = 2560;
            resolutions.maxHeight = 1600;
        }

        if (_resolutions === 'WQHD (2560x1440)') {
            //  16:9
            aspectRatio = 1.77;

            resolutions.maxWidth = 2560;
            resolutions.maxHeight = 1440;
        }

        if (_resolutions === 'WUXGA (1920x1200)') {
            //  16:10
            aspectRatio = 1.6;

            resolutions.maxWidth = 1920;
            resolutions.maxHeight = 1200;
        }

        if (_resolutions === 'Full HD (1920x1080)') {
            //  16:9
            aspectRatio = 1.77;

            resolutions.maxWidth = 1920;
            resolutions.maxHeight = 1080;
        }

        if (_resolutions === 'WSXGA+ (1680x1050)') {
            //  16:10
            aspectRatio = 1.6;

            resolutions.maxWidth = 1680;
            resolutions.maxHeight = 1050;
        }

        if (_resolutions === 'UXGA (1600x1200)') {
            //  4:3
            aspectRatio = 1.3;

            resolutions.maxWidth = 1600;
            resolutions.maxHeight = 1200;
        }

        if (_resolutions === 'HD+ (1600x900)') {
            //  16:9
            aspectRatio = 1.77;

            resolutions.maxWidth = 1600;
            resolutions.maxHeight = 900;
        }

        if (_resolutions === 'WXGA+ (1440x900)') {
            //  16:10
            aspectRatio = 1.6;

            resolutions.maxWidth = 1440;
            resolutions.maxHeight = 900;
        }

        if (_resolutions === 'HD (1366x768)') {
            //  ~16:9
            aspectRatio = 1.77;

            resolutions.maxWidth = 1366;
            resolutions.maxHeight = 768;
        }

        if (_resolutions === 'HD (1360x768)') {
            //  ~16:9
            aspectRatio = 1.77;

            resolutions.maxWidth = 1360;
            resolutions.maxHeight = 768;
        }

        if (_resolutions === 'SXGA') {
            //  5:4
            aspectRatio = 1.25;

            resolutions.maxWidth = 1280;
            resolutions.maxHeight = 1024;
        }

        if (_resolutions === 'WXGA (1280x800)') {
            //  16:10
            aspectRatio = 1.6;

            resolutions.maxWidth = 1280;
            resolutions.maxHeight = 800;
        }

        if (_resolutions === 'WXGA (1280x768)') {
            //  5:3
            aspectRatio = 1.67;

            resolutions.maxWidth = 1280;
            resolutions.maxHeight = 768;
        }

        if (_resolutions === 'WXGA (1280x720)') {
            //  16:9
            aspectRatio = 1.77;

            resolutions.maxWidth = 1280;
            resolutions.maxHeight = 720;
        }

        if (_resolutions === 'XGA+ (1152x864)') {
            //  4:3
            aspectRatio = 1.3;

            resolutions.maxWidth = 1152;
            resolutions.maxHeight = 864;
        }

        if (_resolutions === 'XGA (1024x768)') {
            //  4:3
            aspectRatio = 1.3;

            resolutions.maxWidth = 1024;
            resolutions.maxHeight = 768;
        }

        if (_resolutions === 'WSVGA (1024x600)') {
            //  ~17:10
            aspectRatio = 1.7;

            resolutions.maxWidth = 1024;
            resolutions.maxHeight = 600;
        }

        if (_resolutions === 'SVGA (800x600)') {
            //  4:3
            aspectRatio = 1.3;

            resolutions.maxWidth = 800;
            resolutions.maxHeight = 600;
        }

        if (_resolutions === '720p (1280x720)') {
            //  16:9
            aspectRatio = 1.77;

            resolutions.maxWidth = 1280;
            resolutions.maxHeight = 720;
        }

        if (_resolutions === '360p (640x360)') {
            //  16:9
            aspectRatio = 1.77;

            resolutions.maxWidth = 640;
            resolutions.maxHeight = 360;
        }

        /* Перекрываем конфиг пользователя */

        enableTabAudio = false;
        enableMicrophone = true;

        //HD
        aspectRatio = 1.77;
        resolutions.maxWidth = 1360;
        resolutions.maxHeight = 768;

        //FPS
        videoMaxFrameRates = 24;

        //audio и video битрейт


        audioBitsPerSecond = 94;
        videoBitsPerSecond = 420;


        //Видео Кодек
        videoCodec = 'VP9';


        if (enableMicrophone) {
            lookupForHTTPsTab(function (notification) {
                uxc_debugger('notification', notification);

                if (notification === 'no-https-tab') {

                    // skip microphone
                    captureDesktop();
                }
            });
            return;
        }

        captureDesktop();
    });
}

var alreadyHadGUMError = false;

function getUserMediaError() {
    if (!alreadyHadGUMError) {
        // retry with default values
        resolutions = {};
        aspectRatio = false;
        audioBitsPerSecond = false;
        videoBitsPerSecond = false;

        enableTabAudio = false;
        enableMicrophone = false;
        audioStream = false;

        // below line makes sure we retried merely once
        alreadyHadGUMError = true;

        videoMaxFrameRates = '';
        videoCodec = 'Default';

        captureDesktop();
        return;
    }

    askToStopExternalStreams();
    setDefaults();
    chrome.runtime.reload();
}

// Check whether new version is installed
chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason.search(/install/g) === -1) return;
    chrome.runtime.openOptionsPage();
});

// Check for updates
chrome.runtime.onUpdateAvailable.addListener(function (details) {
    // alert('RecordRTC chrome-extension has new updates. Please update the extension.');
});

var runtimePort;

chrome.runtime.onConnect.addListener(function (port) {
    runtimePort = port;

    runtimePort.onMessage.addListener(function (message) {
        if (!message || !message.messageFromContentScript1234) {
            return;
        }

        if (message.sdp) {
            createAnswer(message.sdp);
        }
    });
});

var alreadyTriedToOpenAnHTTPsPage = false;

function lookupForHTTPsTab(callback) {
    chrome.tabs.query({
        // active: true,
        // currentWindow: true,
        index: Number(localStorage.getItem('index'))
        //id:localStorage.getItem('tabsId'),
    }, function (tabs) {
        uxc_debugger('tabs2', tabs[0]);

        var tabFound = tabs[0];
        uxc_debugger('tabFound.url.indexOf(https:)==-1', tabFound.url.indexOf('https:') == '-1');

        if (tabFound.url.indexOf('https:') != '-1') {
            executeScript(tabFound.id, tabFound.id);
        } else {
            chrome.tabs.create({
                url: 'https://test.uxcrowd.ru/recaudios.html'
            }, function (tabNew) {
                console.log('уже есть ', localStorage.getItem('tabRecAudio'));
                localStorage.setItem('tabRecAudio', tabNew.id);
                console.log('новый ', localStorage.getItem('tabRecAudio'));
                executeScript(tabNew.id, tabFound.id);
            });
        }
    });
}

function executeScript(tabIdNew, tabId) {
    uxc_debugger('executeScript tabId ', tabId);


    chrome.tabs.executeScript(tabIdNew, {
        file: 'js/content-script.js'
    });
    chrome.tabs.update(tabId, {
        active: true
    });
}

function createAnswer(sdp) {
    peer = new webkitRTCPeerConnection(null);

    peer.onicecandidate = function (event) {
        if (!event || !!event.candidate) return;

        try {
            runtimePort.postMessage({
                sdp: peer.localDescription,
                messageFromContentScript1234: true
            });
        } catch (e) {
        }
    };

    peer.onaddstream = function (event) {
        audioStream = event.stream;
        captureDesktop();
    };

    peer.setRemoteDescription(new RTCSessionDescription(sdp));

    peer.createAnswer(function (sdp) {
        peer.setLocalDescription(sdp);
    }, function () {
    }, {
        optional: [],
        mandatory: {
            OfferToReceiveAudio: true,
            OfferToReceiveVideo: false
        }
    });
}

var audioPlayer, context, mediaStremSource, mediaStremDestination;


