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
            scope.length = service.getLengthCircle(scope.radius);
            scope.id = 'circle-animation-' + service.getId();
            scope.dashOffset = scope.length;

            function setDashOffset() {
                document.getElementById(scope.id).style.strokeDashoffset = service.getPercent(scope.percentage, scope.length) + 'px';
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
        template: '<div class="doughnut-chart-wrapper" ng-show="percentage" style="width: {{radius * 2 + stroke}}px;"><div class="dough-text-suffix"><span class="dough-text">{{percentage}}</span><sup class="dough-suffix">%</sup></div><svg xmlns="http://www.w3.org/2000/svg"><g><circle fill="none" class="circle-bg" stroke-width="{{stroke}}"/><circle fill="none" class="circle-animation" id="{{id}}" stroke-width="{{stroke}}" style="stroke-dasharray: {{length}};stroke-dashoffset: {{dashOffset}};"/></g></svg></div>'
    });
}]);