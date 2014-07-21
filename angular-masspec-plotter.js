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
                    data = [ data.split(' ').map(function(x) { return x.split(':').map(Number) }) ];
                }


                // Compute plot limits
                var mz_min = Math.min.apply(Math, data[0].map(function(x) { return x[0]; }));
                var mz_max = Math.max.apply(Math, data[0].map(function(x) { return x[0]; }));
                var intensity_max = Math.max.apply(Math, data[0].map(function(x) { return x[1]; }));


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
                        labelMargin: 10,
                        backgroundColor: '#fff',
                        color: '#e2e6e9',
                        borderColor: null
                    }
                };


                // Format plot if a thumbnail version is desired
                if(miniPlot) {
                    options.xaxis = { ticks: false, min: 0, max: 1000 };
                    options.yaxis = { ticks: false };

                    // Filter low intensity peaks
                    data = data.filter(function(x) { return x[0][1] > 0.05 * intensity_max });
                }

                // Otherwise, enable interactivity
                else {
                    options.xaxis = {
                        zoomRange: [mz_min, mz_max],
                        panRange: [mz_min, mz_max]
                    }
                    options.yaxis = {
                        zoomRange: [0, 1.25 * intensity_max],
                        panRange: [0, 1.25 * intensity_max]
                    }
                    options.zoom = { interactive: true };
                    options.pan = { interactive: true };
                }

                // Plot
                var placeholder = $(element).find(".masspec");

                var plot = $.plot(placeholder, data, options);

                if(!miniPlot) {
                    $('<div class="button" style="right: 20px; top: 20px">Reset Zoom</div>')
                        .appendTo(placeholder)
                        .click(function (event) {
                            event.preventDefault();
                            plot.zoomOut();
                    });
                }
            }
        }
    });