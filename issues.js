$(function () {

    var client_id = "545b4972e16c6d7ac22c";
    var client_secret = "443e8bcbe931f64f212882fc3d1e246aa416bdec";
    var redirect_uri = "https://892768447.github.io/static/index.html";
    var scope = "read:user";
    var access_token = localStorage.getItem("GT_ACCESS_TOKEN");

    function queryParse(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = encodeURI(window.location.search).substr(1).match(reg);
        if (r != null) return decodeURI(unescape(r[2]));
        return null;
    }

    function login() {
        window.location.href = "https://github.com/login/oauth/authorize?client_id=" + client_id +
            "&redirect_uri=" + redirect_uri + "&scope=" + scope;
    }

    function getIssues(page) {
        $.ajax({
            type: "GET",
            url: "https://api.github.com/repos/PyQt5/PyQt/issues",
            data: { state: "all", sort: "created", direction: "desc", page:  page},
            headers: { Authorization: "token " + access_token },
            dataType: "json",
            success: function (response, status, xhr) {
                console.log(response);
                var links = xhr.getResponseHeader('Link');
                var reg = /page=(\d+)/g;
                var current_page = reg.exec(links);
                var total_page = reg.exec(links);
                console.log(current_page[1]);
                console.log(total_page[1]);
                var html = template('tpl-issues', {issues: [response[29]]});
                $("#issues-list").html(html);
            },
            error: function (xhr, errorType, error) {
                console.error(xhr);
            }
        });
    }

    var code = queryParse("code");
    if (code) {
        $.post("https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/access_token", { client_id: client_id, client_secret: client_secret, code: code },
            function (response) {
                access_token = response.access_token;
                localStorage.setItem("GT_ACCESS_TOKEN", access_token);
                window.location.href = window.location.href.split("?")[0]
            }, "json");
    } else {
        if (access_token === null || access_token.length === 0) {
            // 未登录
            login();
            return;
        }
    }

    // 获取issues列表
    var page = queryParse("page");
    if (page) {
        try {
            page = parseInt(page);
        } catch (error) {
            page = 1;
        }
    }
    getIssues(page);

});