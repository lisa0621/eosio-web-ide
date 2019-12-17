var test = /** @class */ (function () {

    test.title = "Title";
    test.availableKeys = ["123", "abc"];
    // console.log(test.title);
    // console.log(test.availableKeys);
    function test() {}

    test.prototype.getAvailableKeys = function () {
        return  test.availableKeys;
    }

    test.prototype.cube = function (x) {
        return x * x * x;
    }

    test.prototype.hello = function () {
        return "Hello!";
    }

    test.prototype.getApiTest = function() {

        var request = new XMLHttpRequest()

        request.open('GET', 'https://ghibliapi.herokuapp.com/films', true)
        request.onload = function() {
        // Begin accessing JSON data here
        var data = JSON.parse(this.response)

        if (request.status >= 200 && request.status < 400) {
            data.forEach(movie => {
            console.log(movie.title)
            })
        } else {
            console.log('error')
        }
        }

        request.send();
    }

    return test;
}());

exports.test = test;
