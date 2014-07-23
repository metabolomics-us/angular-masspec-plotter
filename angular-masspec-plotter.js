angular.module('angularMasspecPlotter', [])
    .directive("massSpec", function () {
        return {
            restrict: 'E',
            require: 'ngModel',
            scope:{
                bindModel: '=ngModel'
            },

            priority: 1,

            replace: 'true',
            template:
                '<div style="width: 100%; height: 100%; display: inline-block;">'+
                '<div class="masspec" style="width: 100%; height: 100%"></div>'+
                // Unable to plot multiple mass specs with different states due to scope issues
                //'<div ng-bind="masspecLabel" style="text-align: center; font-style: oblique;"></div>'+
                '</div>',

            link: function (scope, element, attrs) {
                // Retrieve the data
                var data = scope.bindModel;

                // Parse data if it is in the standard string format
                if(typeof data === 'string') {
                    data = data.split(' ').map(function(x) { return x.split(':').map(Number) });
                }


                // Compute plot limits
                var mz_min = Math.min.apply(Math, data.map(function(x) { return x[0]; }));
                var mz_max = Math.max.apply(Math, data.map(function(x) { return x[0]; }));
                var intensity_max = Math.max.apply(Math, data.map(function(x) { return x[1]; }));


                // Type of plot
                var miniPlot = ('mini' in attrs)


                // Base options
                var options = {
                    series: {
                        color: '#00f',
                        bars: {
                            show: true,
                            barWidth: 0.00001,
                            align: "center"
                        }
                    },
                    grid: {
                        labelMargin: 15,

                        backgroundColor: '#fff',
                        color: '#e2e6e9',
                        borderColor: null
                    },
                    xaxis: { min: 0, max: mz_max },
                    yaxis: { min: 0, max: 1.25 * intensity_max }
                };


                // Format plot if a thumbnail version is desired
                if(miniPlot) {
                    options.xaxis = { ticks: false, min: 0, max: 1000 };
                    options.yaxis = { ticks: false, min: 0, max: 1.25 * intensity_max };

                    // Filter low intensity peaks
                    data = data.filter(function(x) { return x[1] > 0.05 * intensity_max });
                }

                // Plot
                var placeholder = $(element).find(".masspec");
                var plot = $.plot(placeholder, [data], options);
            }
        }
    });