$(function () {

    var client_id = "545b4972e16c6d7ac22c";
    var client_secret = "443e8bcbe931f64f212882fc3d1e246aa416bdec";
    var redirect_uri = "https://892768447.github.io/static/index.html";
    var scope = "read:user";
    var access_token = localStorage.getItem("GT_ACCESS_TOKEN");

    function queryParse() {
        var search = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window.location.search;

        if (!search) return {};
        var queryString = search[0] === '?' ? search.substring(1) : search;
        var query = {};
        queryString.split('&').forEach(function (queryStr) {
            var _queryStr$split = queryStr.split('='),
                _queryStr$split2 = (0, _slicedToArray3.default)(_queryStr$split, 2),
                key = _queryStr$split2[0],
                value = _queryStr$split2[1];
            /* istanbul ignore else */


            if (key) query[decodeURIComponent(key)] = decodeURIComponent(value);
        });

        return query;
    };

    function login() {
        window.location.href = "https://github.com/login/oauth/authorize?client_id=" + client_id + "&redirect_uri=" + redirect_uri + "&scope=" + scope;
    }

    var query = (0, queryParse)();
    if (query.code) {
        console.log('get access token');
        $.getJSON("https://github.com/login/oauth/access_token?client_id=" + client_id + "&client_secret=" + client_secret + "&code=" + code, function (response) {
            console.log(response);
            access_token = response.access_token;
            localStorage.setItem("GT_ACCESS_TOKEN", access_token);
        });
    } else {
        if (access_token === null || access_token.length === 0) {
            // 未登录
            setTimeout(login, 5000);
            return;
        }
    }

});