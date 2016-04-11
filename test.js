var Route = function () {

    if (!(this instanceof Route)) {
        return new Route()
    }

    this._routes = [];
};

Route.prototype = {

    defined: function (url) {

        this._routes.forEach(function (item) {
            if (url === item) {
                return url
            } else {
                for (var route in this._routes) {
                    if (this.path(route, url)) {
                        return route
                    }
                }
            }
        });

        return false
    },

    path: function (route, url) {

        var route = route.split('/');
        var url = url.split('/');
        var route_length = route.length;
        var url_length = url.length;
        if (route_length !== url_length) {
            return false
        }
        for (var i; i < route_length; i++) {
            if (route[i] !== url[i] && route[i].indexOf('{') === -1) {
                return false
            }
        }
        return true
    },

    check: function (url, callback) {

        if (typeof url !== 'string' && callback && typeof callback === 'function') {
            return true
        }
        return false
    },

    params: function (uri) {

        var params = {};
        var absolutePath = window.location.pathname.split('/');
        var route = uri.split('/');
        var route_length = route.length;
        for (var i = 1; i < route_length; i++) {
            if (route[i].indexOf('{') !== -1) {
                params[route[i]] = absolutePath[i];
            }
        }
        return params;
    },

    add: function (url, callback) {

        if (this.check(url, callback)) {

            var route = this.defined(url);
            if (route) {
                this._routes[url] = {
                    callback: callback
                }
            } else {
                console.log(url + 'already defined')
            }
        }

    },

    call: function (url) {

        var route = this.defined(url);
        if (route) {
            var callback = this._routes[route].callback;
            callback(this.params(route));
        }
    }

};

