angular.module('angular-doughnut-chart', []);
angular.module('angular-doughnut-chart').constant('doughnutChartConfig', {
    radius: 100,
    stroke: 14
});
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

    service.round = function (percent) {
        return Math.round(percent);
    };

    return service;
}]);
angular.module('angular-doughnut-chart').directive('doughnutChart', ['doughnutChartService', 'doughnutChartConfig', '$timeout', function (service, config, $timeout) {
    'use strict';

    var base = {
        restrict: "E",
        scope: {
            percentage: "="
        }
    };
    //message for browsers which don't support svg
    if (!service.isSupported) {
        return angular.extend(base, {
            template: '<div class="doughnut-chart-wrapper">Not supported</div>'
        });
    }
    return angular.extend(base, {
        link: function (scope, element) {
            scope.radius = config.radius;
            scope.stroke = config.stroke;
            scope.round = service.round;
            scope.length = service.getLengthCircle(scope.radius);
            scope.dashOffset = scope.length;

            function setDashOffset() {
                scope.dashOffset = service.getPercent(scope.percentage, scope.length);
            }

            //set width for svg
            element.find('svg').attr(
                service.setSize(scope.radius, scope.stroke)
            );

            //set cx, cy and r for circles
            element.find('circle').attr(
                service.setCircleAttrs(scope.radius, scope.stroke)
            );

            //for animation on load
            if (scope.percentage) {
                scope.animate = true;
                $timeout(setDashOffset);

            }

            //watch for percentage
            scope.$watch('percentage', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    scope.percentage = newValue;
                    if (scope.animate) {
                        setDashOffset();
                    } else {
                        //for first animation when percent gets asynchronously
                        scope.animate = true;
                        $timeout(setDashOffset);
                    }
                }
            });
        },
        template: '<div class="doughnut-chart-wrapper" ng-show="percentage" style="width: {{radius * 2 + stroke}}px;"><div class="dough-text-suffix"><span class="dough-text">{{round(percentage)}}</span><sup class="dough-suffix">%</sup></div><svg xmlns="http://www.w3.org/2000/svg" width="" height=""><g><circle fill="none" class="circle-bg" stroke-width="{{stroke}}"/><circle fill="none" class="circle-animation" stroke-width="{{stroke}}" style="stroke-dasharray: {{length}};stroke-dashoffset: {{dashOffset}};"/></g></svg></div>'
    });
}]);