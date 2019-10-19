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
        window.location.href = "https://github.com/login/oauth/authorize?client_id=" + client_id + "&redirect_uri=" + redirect_uri + "&scope=" + scope;
    }

    // 判断url中是否有state和code字段
    if (window.location.href.indexOf("code=") > -1) {
        console.log('get access token');
        var args = getQueryVariable(window.location.search.substring(1));
        var code = args["code"];
        if (code === undefined || code.length === 0) {
            //login();
            console.log("check failed");
            return;
        }
        $.post("https://github.com/login/oauth/access_token", { "client_id": client_id, "client_secret": client_secret, "code": code}, function (response) {
            // process response
            args = getQueryVariable(response.data);
            var access_token = args["access_token"];
            if (access_token === undefined || access_token.length === 0) {
                console.log("get access_token failed");
                return;
            }
            localStorage.setItem("access_token", access_token);
        });
    }

    if (localStorage.getItem("access_token") === null) {
        // 未登录
        login();
        return;
    }

    var access_token = localStorage.get("access_token");
});