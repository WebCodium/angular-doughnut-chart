angular
    .module('angular-doughnut-chart', [])
    .directive('doughnutChart', ['$animateCss', '$interval', '$timeout', function ($animateCss, $interval, $timeout) {
        'use strict';

        var config = {
            stroke: 14
        };

        var service = {
            index: 0,
            // credits to http://modernizr.com/ for the feature test
            isSupported: !!(document.createElementNS && document.createElementNS('http://www.w3.org/2000/svg', "svg").createSVGRect),
            getPercent: function (percent, length) {
                return (100 - percent) * length / 100;
            },
            getLengthCircle: function (radius) {
                return Math.floor(Math.PI * 2 * radius);
            },
            setCircleAttrs: function (radius, stroke) {
                return {
                    r: radius,
                    cx: -(radius + stroke / 2),
                    cy: radius + stroke / 2
                };
            },
            getClass: function () {
                return 'doughnut-chart-' + (this.index++);
            }
        };

        var base = {
            restrict: "E",
            scope: {
                percentage: "=",
                stroke: "="
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
                scope.stroke = scope.stroke || config.stroke;

                function setDashOffset() {
                    scope.oldPecentage = scope.oldPecentage || 0;
                    scope.curPercent = scope.oldPecentage;
                    var diff = scope.percentage - scope.oldPecentage;
                    scope.curPercent += diff > 0 ? 1 : -1;
                    scope.intervalText = $interval(function () {
                        scope.curPercent += diff > 0 ? 1 : -1;
                        if (scope.curPercent === scope.percentage)
                            $interval.cancel(scope.intervalText);
                    }, 1000 / Math.abs(diff));
                    $animateCss(element.find('circle').eq(1), {
                        to: {'stroke-dashoffset': service.getPercent(scope.percentage, scope.length)}
                    }).start();
                }

                function firstAnimate() {
                    scope.animate = true;
                    $animateCss(element.find('circle').eq(1), {
                        addClass: 'doughnut-allow-animation'
                    }).start().then(setDashOffset);
                }

                function drawDoughNut(resize) {
                    scope.radius = (document.querySelectorAll('.' + scope.class)[0].offsetWidth - scope.stroke) / 2;
                    scope.length = service.getLengthCircle(scope.radius);
                    $animateCss(element.find('circle').eq(1), {
                        to: {'stroke-dashoffset': scope.length}
                    }).start().then(function () {
                        scope.drawed = true;
                        //set cx, cy and r for circles
                        scope.circles = element.find('circle').attr(
                            service.setCircleAttrs(scope.radius, scope.stroke)
                        );
                        if (resize) {
                            scope.circles.eq(1).removeClass('doughnut-allow-animation');
                            setDashOffset();
                        }
                        //for animation on load
                        if (scope.percentage && !scope.animate) {
                            firstAnimate();
                        }
                    });
                }

                scope.class = service.getClass();
                $animateCss(element.children(), {
                    addClass: scope.class
                }).start().then(drawDoughNut);

                //watch for percentage
                scope.$watch('percentage', function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        scope.percentage = newValue;
                        scope.oldPecentage = oldValue;
                        if (scope.animate) {
                            scope.circles.eq(1).addClass('doughnut-allow-animation');
                            setDashOffset();
                        } else if (scope.drawed) {
                            //for first animation when percent gets asynchronously
                            firstAnimate();
                        }
                    }
                });
                angular.element(window).on('resize', function () {
                    drawDoughNut(true);
                });
            },
            template: '<div class="doughnut-chart-wrapper">' +
            '<div class="dough-text-suffix"><span class="dough-text">{{curPercent}}</span><sup class="dough-suffix">%</sup></div>' +
            '<svg xmlns="http://www.w3.org/2000/svg">' +
            '<circle fill="none" class="circle-bg" stroke-width="{{stroke}}"/>' +
            '<circle fill="none" class="circle-animation" stroke-width="{{stroke}}" style="stroke-dasharray: {{length}};"/>' +
            '</svg>' +
            '</div>'
        });
    }]);
//# sourceMappingURL=doughnutchart.js.map
