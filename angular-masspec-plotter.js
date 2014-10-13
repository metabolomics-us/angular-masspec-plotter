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
                /**
                 * Find the maximum intensity in the given range
                 */
                function maxIntensityInRange(min, max) {
                    var maxLocalIntensity = 0;

                    for(var i = 0; i < data.length; i++) {
                        if(data[i][0] >= max)
                            break;

                        else if(data[i][0] >= min && data[i][1] >= maxLocalIntensity)
                            maxLocalIntensity = data[i][1];
                    }

                    return Math.max(maxLocalIntensity, 10);
                }

                /**
                 * Find the n ions with the highest intensity in the given range
                 */
                function getTopPeaks(data, min, max, n) {
                    // Set default values if not given
                    min = typeof min !== 'undefined' ? min : 0;
                    max = typeof max !== 'undefined' ? max : data[data.length - 1][0];
                    n = typeof n !== 'undefined' ? n : 3;

                    // Get data within range
                    reducedData = [];

                    for(var i = 0; i < data.length; i++) {
                        if(min <= data[i][0] && data[i][0] <= max)
                            reducedData.push(data[i]);
                    }

                    // Sort data
                    reducedData.sort(function(a, b) {
                        return b[1] - a[1];
                    });

                    // Return the top n hits
                    return reducedData.slice(0, n);
                }



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


                // Type of plot
                var miniPlot = ('mini' in attrs)


                // Base options
                var options = {
                    series: {
                        color: '#00f',
                        lines: { show: true }
                    },

                    grid: {
                        labelMargin: 15,

                        backgroundColor: '#fff',
                        color: '#e2e6e9',

                        borderWidth: {top: 0, right: 0, bottom: 1, left: 1},
                        borderColor: null
                    },

                    xaxis: { min: 0, max: Math.max(mzMax, 1000) },
                    yaxis: { min: 0, max: 1.15 * intensityMax },

                    legend: {show: false}
                };



                // Format plot if a thumbnail version is desired
                if(miniPlot) {
                    // Remove tick labels, redefine axis maxima
                    options.xaxis.ticks = false;
                    options.yaxis.ticks = false;

                    options.xaxis.max = 1000;
                    options.yaxis.max = intensityMax;

                    // Filter low intensity peaks
                    data = data.filter(function(x) { return x[1] > 0.05 * intensityMax });
                }

                // Otherwise, set up plot selection zoom and tooltips
                else {
                    options.selection = {
                        mode: 'x'
                    };

                    options.grid.hoverable = true;
                    options.grid.mouseActiveRadius = 10;
                }



                // Find placeholder element and plot the mass spectrum
                var plotData = [];

                for(var i = 0; i < data.length; i++)
                    plotData.push({ data: [[data[i][0], 0], data[i]], lines: { show: true } });

                var placeholder = $(element).find(".masspec");
                var plot = $.plot(placeholder, plotData, options);



                // Set up interactivity if this is a full plot
                if(!miniPlot) {
                    // Define selection zoom functionality
                    placeholder.bind('plotselected', function(event, range) {
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
                            axis.options.max = 1.15 * maxLocalIntensity;
                        });

                        // Redraw plot
                        plot.setupGrid();
                        plot.draw();
                        plot.clearSelection();
                    });

                    // Add button to reset selection zooming
                    $('<div class="button" style="right: 20px; top: 20px">Reset Zoom</div>').css({
                        'position': 'absolute',
                        'cursor': 'pointer',
                        'font-size': 'smaller',
                        'color': '#999',
                        'background-color': '#eee',
                        'padding': '2px'
                    }).appendTo(placeholder).click(function (event) {
                        event.preventDefault();

                        // Reset x-axis range
                        $.each(plot.getXAxes(), function(_, axis) {
                            axis.options.min = 0;
                            axis.options.max = Math.max(mzMax, 1000);
                        });

                        // Reset y-axis range
                        $.each(plot.getYAxes(), function(_, axis) {
                            axis.options.min = 0;
                            axis.options.max = 1.15 * intensityMax;
                        });

                        // Redraw plot
                        plot.setupGrid();
                        plot.draw();
                        plot.clearSelection();
                    });

                    // Define functionality for plot hover / tooltips
                    placeholder.bind('plothover', function (event, pos, item) {
                        function showTooltip(contents) {
                            $('canvas').css('cursor', 'pointer');

                            $('<div id="maspec-tooltip">'+ contents +'</div>').css({
                                'position': 'absolute',
                                'top': pos.pageY + 5,
                                'left': pos.pageX + 5,
                                'font-size': 'smaller',
                                'background': '#fff',
                                'z-index': '1040',
                                'padding': '0.4em 0.6em',
                                'border-radius': '0.5em',
                                'border': '1px solid #111',
                                'white-space': 'nowrap'
                            }).appendTo('body');
                        }


                        // Remove current tooltip and highlight
                        $("#maspec-tooltip").remove();
                        $('canvas').css('cursor', 'auto');
                        plot.unhighlight();


                        // If datapoint is selected, show the tooltip
                        if(item)
                            showTooltip('m/z = '+ item.datapoint[0] +'<br />abundance = '+ item.datapoint[1]);

                        // Otherwise, check if line being hovered over
                        else {
                            // Find nearest ion
                            var nearestIon = {
                                dist: -1
                            }

                            $.each(data, function(i, x) {
                                if(nearestIon.dist == -1 ||
                                        (Math.abs(x[0] - pos.x) < nearestIon.dist && pos.y > 0 && pos.y < x[1])) {
                                    nearestIon.dist = Math.abs(x[0] - pos.x);
                                    nearestIon.i = i;
                                    nearestIon.datapoint = x;
                                }
                            });

                            // Set tooltip if we are near an ion peak
                            if(nearestIon.dist != -1 && nearestIon.dist < plot.getOptions().grid.mouseActiveRadius)
                                showTooltip('m/z = '+ nearestIon.datapoint[0] +'<br />abundance = '+ nearestIon.datapoint[1]);
                        }
                    });
                }
            }
        }
    });
