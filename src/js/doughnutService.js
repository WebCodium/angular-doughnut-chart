angular.module('angular-doughnut-chart').service('doughnutChartService', [function () {
    'use strict';
    var service = {};

    // credits to http://modernizr.com/ for the feature test
    service.isSupported = !!(document.createElementNS && document.createElementNS('http://www.w3.org/2000/svg', "svg").createSVGRect);

    service.getPercent = function (percent, length) {
        return (100 - percent) * length / 100;
    };

    service.getLengthCircle = function (radius) {
        return Math.floor(Math.PI * 2 * radius);
    };

    service.setSize = function (radius, stroke) {
        return {
            width: radius * 2 + stroke,
            height: radius * 2 + stroke
        };
    };

    service.setCircleAttrs = function (radius, stroke) {
        return {
            r: radius,
            cx: radius + stroke / 2,
            cy: radius + stroke / 2
        };
    };

    return service;
}]);