$(function () {

    var client_id = "b2586560cc31ebdf329f";
    var client_secret = "ec9ec941b90691e9c0d9c0bff5a8e9d576f4e347";
    var redirect_uri = "https://892768447.github.io/static/index.html";
    var scope = "read:user";

    function getQueryVariable(url) {
        var args = {};
        var vars = url.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            args[pair[0]] = pair[1];
        }
        return args;
    }

    function login() {
        var state = encodeURIComponent(encodeURIComponent(new Date()).replace(/%/g, ""));
        localStorage.setItem("state", state);
        localStorage.setItem("time", Date.parse(new Date()) / 1000);
        window.location.href = "https://github.com/login/oauth/authorize?client_id=" + client_id + "&redirect_uri=" + redirect_uri + "&scope=" + scope + "&state=" + encodeURIComponent(state);
    }
    if (localStorage.getItem("access_token") === null) {
        // 未登录
        login();
        return;
    }

    // 判断url中是否有state和code字段
    if (window.location.href.indexOf("state=") > 0 && window.location.href.indexOf("code=")) {
        console.log('get access token');
        var oldState = localStorage.getItem("state");
        var oldTime = localStorage.getItem("time") || 0;
        var time = Date.parse(new Date()) / 1000 - parseInt(oldTime);
        if (time < 0 || time > 600) {
            //login();
            return;
        }
        var args = getQueryVariable(window.location.search.substring(1));
        var state = decodeURIComponent(args["state"]);
        var code = args["code"];
        if (oldState !== state || code === undefined || code.length === 0) {
            //login();
            console.log("check failed");
            return;
        }
        console.log(state);
        console.log(code);
        $.post("https://github.com/login/oauth/access_token", { "client_id": client_id, "client_secret": client_secret, "code": code, "state": encodeURIComponent(state) }, function (response) {
            // process responseF
            args = getQueryVariable(response.data);
            var access_token = args["access_token"];
            if(access_token===undefined||access_token.length===0){
                console.log("get access_token failed");
                return;
            }
            localStorage.setItem("access_token", access_token);
        });
    }

    var access_token = localStorage.get("access_token");
});