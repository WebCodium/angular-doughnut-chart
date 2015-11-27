angular
    .module('angular-doughnut-chart', [])
    .directive('doughnutChart', ['$animateCss', '$timeout', function ($animateCss, $timeout) {
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
            setSize: function (radius, stroke) {
                return {
                    width: radius * 2 + stroke,
                    height: radius * 2 + stroke
                };
            },
            setCircleAttrs: function (radius, stroke) {
                return {
                    r: radius,
                    cx: radius + stroke / 2,
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
                    scope.dashOffset = service.getPercent(scope.percentage, scope.length);
                }

                function firstAnimate() {
                    scope.animate = true;
                    $animateCss(element.find('circle').eq(1), {
                        addClass: 'doughnut-allow-animation'
                    }).start().then(setDashOffset);
                }

                function drawDoughNut(resize) {
                    $timeout(function () {
                        scope.radius = (document.querySelectorAll('.' + scope.class)[0].offsetWidth - scope.stroke) / 2;
                        scope.length = service.getLengthCircle(scope.radius);
                        scope.dashOffset = scope.length;

                        //set width for svg
                        element.find('svg').attr(
                            service.setSize(scope.radius, scope.stroke)
                        );

                        //set cx, cy and r for circles
                        var circle = element.find('circle').attr(
                            service.setCircleAttrs(scope.radius, scope.stroke)
                        );
                        if (resize) {
                            circle.eq(1).removeClass('doughnut-allow-animation');
                            setDashOffset();
                        }
                    });
                }

                if (!scope.class) {
                    scope.class = service.getClass();
                }
                $animateCss(element.children(), {
                    addClass: scope.class
                }).start().then(drawDoughNut);

                //for animation on load
                if (scope.percentage) {
                    firstAnimate();
                }

                //watch for percentage
                scope.$watch('percentage', function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        scope.percentage = newValue;
                        if (scope.animate) {
                            element.find('circle').eq(1).addClass('doughnut-allow-animation');
                            setDashOffset();
                        } else {
                            //for first animation when percent gets asynchronously
                            firstAnimate();
                        }
                    }
                });
                angular.element(window).on('resize', function () {
                    drawDoughNut(true);
                });
            },
            template: '<div class="doughnut-chart-wrapper" ng-show="percentage">' +
            '<div class="dough-text-suffix"><span class="dough-text">{{percentage}}</span><sup class="dough-suffix">%</sup></div>' +
            '<svg xmlns="http://www.w3.org/2000/svg">' +
            '<circle fill="none" class="circle-bg" stroke-width="{{stroke}}"/>' +
            '<circle fill="none" class="circle-animation" stroke-width="{{stroke}}" style="stroke-dasharray: {{length}}; stroke-dashoffset: {{dashOffset}}"/>' +
            '</svg>' +
            '</div>'
        });
    }]);