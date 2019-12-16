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
    return test;
}());

exports.test = test;
