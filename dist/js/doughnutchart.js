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

    return service;
}]);
angular.module('angular-doughnut-chart').directive('doughnutChart', ['doughnutChartService', 'doughnutChartConfig', '$animateCss', function (service, config, $animateCss) {
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
            scope.length = service.getLengthCircle(scope.radius);
            scope.dashOffset = scope.length;

            function setDashOffset() {
                scope.dashOffset = service.getPercent(scope.percentage, scope.length);
            }

            function firstAnimate() {
                scope.animate = true;
                $animateCss(element.children(), {
                    addClass: 'doughnut-allow-animation'
                }).start().then(setDashOffset)
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
                firstAnimate();
            }

            //watch for percentage
            scope.$watch('percentage', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    scope.percentage = newValue;
                    if (scope.animate) {
                        setDashOffset();
                    } else {
                        //for first animation when percent gets asynchronously
                        firstAnimate();
                    }
                }
            });
        },
        template: '<div class="doughnut-chart-wrapper" ng-show="percentage" style="width: {{radius * 2 + stroke}}px;"><div class="dough-text-suffix"><span class="dough-text">{{percentage}}</span><sup class="dough-suffix">%</sup></div><svg xmlns="http://www.w3.org/2000/svg"><g><circle fill="none" class="circle-bg" stroke-width="{{stroke}}"/><circle fill="none" class="circle-animation" stroke-width="{{stroke}}" style="stroke-dasharray: {{length}};stroke-dashoffset: {{dashOffset}};"/></g></svg></div>'
    });
}]);