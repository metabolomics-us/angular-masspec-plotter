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
                    data = data.split(' ').map(function(x) {
                        return x.split(':').map(Number);
                    });
                }


                // Compute plot limits
                var mzMax = Math.max.apply(Math, data.map(function(x) { return x[0]; }));
                var intensityMax = Math.max.apply(Math, data.map(function(x) { return x[1]; }));

                function maxIntensityInRange(min, max) {
                    var maxLocalIntensity = 0;

                    for(var i = 0; i < data.length; i++) {
                        if(data[i][0] >= max)
                            break;

                        else if(data[i][0] >= min && data[i][1] >= maxLocalIntensity)
                            maxLocalIntensity = data[i][1];
                    }

                    return maxLocalIntensity;
                }


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

                    xaxis: { min: 0, max: Math.max(mzMax, 1000) },
                    yaxis: { min: 0, max: 1.25 * intensityMax },

                    legend: {show: false}
                };


                // Format plot if a thumbnail version is desired
                if(miniPlot) {
                    // Remove tick labels, redefine axis maxima and remove border
                    options.xaxis.ticks = false;
                    options.yaxis.ticks = false;

                    options.xaxis.max = 1000;
                    options.yaxis.max = intensityMax;

                    options.grid.show = false;

                    // Filter low intensity peaks
                    data = data.filter(function(x) { return x[1] > 0.05 * intensityMax });
                }

                // Otherwise, set up plot selection zoom and tooltips
                else {
                    options.selection = {
                        mode: 'x'
                    };

                    // options.tooltip = true;
                    // options.tooltipOpts = {
                    //     content: "<h4>%s</h4><ul><li>X is %x</li><li>Y is %y</li></ul>",
                    //     shifts: {
                    //         x: 10,
                    //         y: 20
                    //     },
                    //     defaultTheme: false
                    // };
                }


                // Find placeholder element and plot the mass spectrum
                var placeholder = $(element).find(".masspec");
                var plot = $.plot(placeholder, [data], options);


                // Set up interactivity if this is a full plot
                if(!miniPlot) {
                    // Add button to reset selection zooming
                    $('<div class="button" style="right: 20px; top: 20px">Reset Zoom</div>')
                        .appendTo(placeholder)
                        .click(function (event) {
                            event.preventDefault();
                            console.log('test')

                            // Reset x-axis range
                            $.each(plot.getXAxes(), function(_, axis) {
                                axis.options.min = 0;
                                axis.options.max = Math.max(mzMax, 1000);
                            });

                            // Reset y-axis range
                            $.each(plot.getYAxes(), function(_, axis) {
                                axis.options.min = 0;
                                axis.options.max = 1.25 * intensityMax;
                            });

                            // Redraw plot
                            plot.setupGrid();
                            plot.draw();
                            plot.clearSelection();
                        });

                    // Define selection zoom functionality
            		placeholder.bind("plotselected", function(event, range) {
                        // Get maximum intensity in given range
                        var maxLocalIntensity = maxIntensityInRange(range.xaxis.from, range.xaxis.to);

                        // Set x-axis range
            			$.each(plot.getXAxes(), function(_, axis) {
            				axis.options.min = range.xaxis.from;
            				axis.options.max = range.xaxis.to;
            			});

                        // Set y-axis range
                        $.each(plot.getYAxes(), function(_, axis) {
                            axis.options.min = 0;
                            axis.options.max = 1.25 * maxLocalIntensity;
                        });

                        // Redraw plot
            			plot.setupGrid();
            			plot.draw();
            			plot.clearSelection();
            		});
                }
            }
        }
    });
