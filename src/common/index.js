    var window;
    routeDefault();
    crossroads.addRoute('/home', function () {
        var ajaxHTML = new ej.base.Ajax('src/home/home.html', 'GET', true);
        ajaxHTML.send().then(function (value) {
            document.getElementById('content-area').innerHTML = value.toString();
            window.home();
        });
    });
    hasher.initialized.add(function (h) {
        crossroads.parse(h);
    });
    hasher.changed.add(function (h) {
        crossroads.parse(h);
    });
    hasher.init();
    function routeDefault() {
        crossroads.addRoute('', function () {
            window.location.href = '#/home';
            crossroads.hasher("home");
        });
    }
