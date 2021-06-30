import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
export class MasspecPlotterLibComponent {
    constructor(el, renderer) {
        this.el = el;
        this.renderer = renderer;
    }
    ngOnChanges(changes) {
        // Watch the data source for changes to spectrum or pmzMax
        if (typeof this.plot !== 'undefined') {
            if (changes.hasOwnProperty('spectrum') && typeof changes.spectrum !== 'undefined') {
                this.parsedData = this.parseData(this.spectrum);
                this.redrawPlot();
            }
            else if (changes.hasOwnProperty('pmzMax') && typeof changes.pmzMax !== 'undefined' && this.spectrum) {
                // No need to parse data again if adjusting x-axis
                this.redrawPlot();
            }
        }
    }
    ngOnInit() {
        this.initializePlot();
    }
    computePlotLimits(data) {
        let mzMax;
        if (this.pmzMax !== undefined) {
            mzMax = this.pmzMax;
        }
        else {
            mzMax = Math.max.apply(Math, data.map(x => x[0]));
        }
        const intensityMax = Math.max.apply(Math, data.map(x => x[1]));
        return [mzMax, intensityMax];
    }
    initializePlot() {
        this.parsedData = this.parseData(this.spectrum);
        let data = this.parsedData.data;
        const annotations = this.parsedData.annotations;
        // Compute plot limits
        let [mzMax, intensityMax] = this.computePlotLimits(data);
        // Base options
        const options = {
            series: {
                color: '#00f',
                lines: { show: true, lineWidth: 0.5 },
                shadowSize: 0
            },
            grid: {
                labelMargin: 15,
                backgroundColor: '#fff',
                color: '#e2e6e9',
                borderWidth: { top: 0, right: 0, bottom: 1, left: 1 },
                borderColor: null
            },
            legend: { show: false }
        };
        // Format plot if a thumbnail version is desired
        if (typeof this.miniPlot !== 'undefined') {
            // Remove tick labels and set plot limits
            options.xaxis = { min: 0, max: Math.max(1.05 * mzMax, 500), ticks: false };
            options.yaxis = { min: 0, max: intensityMax, ticks: false };
            // Filter low intensity peaks
            data = data.filter(x => x[1] > 0.05 * intensityMax);
        }
        // Otherwise, set up plot selection zoom and tooltips
        else {
            // Set up plot limits
            options.xaxis = { min: 0, max: 1.05 * mzMax };
            options.yaxis = { min: 0, max: intensityMax };
            // Set plot selection mode
            options.selection = { mode: 'x' };
            // Set hoverable plot properties
            options.grid.hoverable = true;
            options.grid.mouseActiveRadius = 10;
        }
        // Find placeholder element and plot the mass spectrum
        const plotData = data.map(x => ({ data: [[x[0], 0], x], lines: { show: true, lineWidth: 0.75 } }));
        const containerId = this.el.nativeElement.id;
        this.placeholder = $('#' + containerId).find('.masspec');
        this.plot = $.plot(this.placeholder, plotData, options);
        // Set up interactivity if this is a full plot
        if (typeof this.miniPlot === 'undefined') {
            // Plot annotations
            this.plotAnnotations();
            // Define selection zoom functionality
            this.placeholder.bind('plotselected', (event, range) => {
                // Get maximum intensity in given range
                const maxLocalIntensity = this.maxIntensityInRange(data, range.xaxis.from, range.xaxis.to);
                // Set x-axis range
                $.each(this.plot.getXAxes(), (_, axis) => {
                    axis.options.min = range.xaxis.from;
                    axis.options.max = range.xaxis.to;
                });
                // Set y-axis range
                $.each(this.plot.getYAxes(), (_, axis) => {
                    axis.options.min = 0;
                    axis.options.max = maxLocalIntensity;
                });
                // Redraw plot
                this.plot.setupGrid();
                this.plot.draw();
                this.plot.clearSelection();
                this.plotAnnotations();
            });
            // Add button to reset selection zooming
            $('<div><i class="fa fa-arrows-alt fa-2x"></i></div>').css({
                position: 'absolute',
                top: '10px',
                right: '10px',
                cursor: 'pointer',
                'font-size': 'smaller',
                color: '#000',
                // 'background-color': '#eee',
                padding: '2px'
            }).appendTo(this.placeholder).click((event) => {
                event.preventDefault();
                this.redrawPlot();
            });
            // Define functionality for plot hover / tooltips
            this.placeholder.bind('plothover', (event, pos, item) => {
                const showTooltip = (contents) => {
                    $('canvas').css('cursor', 'pointer');
                    const p = this.plot.pointOffset({ x: pos.x, y: pos.y });
                    $('<div id="masspec-tooltip">' + contents + '</div>').css({
                        position: 'absolute',
                        top: p.top + 5,
                        left: p.left + 5,
                        'font-size': 'smaller',
                        background: '#fff',
                        'z-index': '1040',
                        padding: '0.4em 0.6em',
                        'border-radius': '0.5em',
                        border: '1px solid #111',
                        'white-space': 'nowrap'
                    }).appendTo(this.placeholder);
                };
                // Remove current tooltip and highlight
                $('#masspec-tooltip').remove();
                $('canvas').css('cursor', 'auto');
                this.plot.unhighlight();
                // If datapoint is selected, show the tooltip
                if (item) {
                    showTooltip('m/z = ' + item.datapoint[0] + '<br />abundance = ' + item.datapoint[1]);
                }
                // Otherwise, check if line being hovered over
                else {
                    // Find nearest ion
                    const nearestIon = {
                        dist: -1
                    };
                    const cursor = this.plot.pointOffset({ x: pos.x, y: pos.y });
                    $.each(data, (i, x) => {
                        const p = this.plot.pointOffset({ x: x[0], y: x[1] });
                        if (nearestIon.dist === -1 ||
                            (Math.abs(p.left - cursor.left) < nearestIon.dist && pos.y > 0 && pos.y < x[1])) {
                            nearestIon.dist = Math.abs(p.left - cursor.left);
                            nearestIon.i = i;
                            nearestIon.datapoint = x;
                        }
                    });
                    // Set tooltip if we are near an ion peak
                    if (nearestIon.dist !== -1 && nearestIon.dist < this.plot.getOptions().grid.mouseActiveRadius) {
                        showTooltip('m/z = ' + nearestIon.datapoint[0] + '<br />abundance = ' + nearestIon.datapoint[1]);
                    }
                }
            });
            // Replot annotations when window is resized
            this.placeholder.resize(() => this.plotAnnotations());
        }
    }
    redrawPlot() {
        const plotData = this.parsedData.data.map(x => ({ data: [[x[0], 0], x], lines: { show: true, lineWidth: 0.75 } }));
        this.plot.setData(plotData);
        // Compute plot limits
        let [mzMax, intensityMax] = this.computePlotLimits(this.parsedData.data);
        // Reset x-axis range
        $.each(this.plot.getXAxes(), (_, axis) => {
            axis.options.min = 0;
            axis.options.max = 1.05 * mzMax;
        });
        // Reset y-axis range
        $.each(this.plot.getYAxes(), (_, axis) => {
            axis.options.min = 0;
            axis.options.max = intensityMax;
        });
        // Redraw plot
        this.plot.setupGrid();
        this.plot.draw();
        this.plot.clearSelection();
        if (typeof this.miniPlot === 'undefined') {
            this.plotAnnotations();
        }
    }
    /**
     * Add annotations for the top n ions
     * @param data spectrum data
     * @param plot plot element
     * @param placeholder placeholder element
     * @param n number of top ions
     */
    plotAnnotations(n = 3) {
        // Remove all annotation elements
        $('.masspec-annotation').remove();
        // Add annotations
        for (const peak of this.getTopPeaks(this.parsedData.data, this.plot, n)) {
            const p = this.plot.pointOffset({ x: peak[0], y: peak[1] });
            // Place annotation and then reposition to center on ion
            const annotation = $('<div class="masspec-annotation">' + peak[0] + '</div>').css({
                position: 'absolute',
                top: p.top - 12,
                color: '#f00',
                'font-size': 'x-small',
                'text-align': 'center'
            });
            annotation.appendTo(this.placeholder);
            annotation.css({ left: p.left - annotation.width() / 2 });
        }
    }
    /**
     * Find the maximum intensity in the given range+
     * @param data plot data
     * @param min minimum m/z
     * @param max maximum m/z
     */
    maxIntensityInRange(data, min, max) {
        let maxLocalIntensity = 0;
        for (const x of data) {
            if (x[0] >= max) {
                break;
            }
            else if (x[0] >= min && x[1] >= maxLocalIntensity) {
                maxLocalIntensity = x[1];
            }
        }
        return Math.max(maxLocalIntensity, 0.1);
    }
    /**
     * Find the n ions with the highest intensity in the given range
     * @param data spectrum data
     * @param plot plot object
     * @param n number of highest intensity ions
     */
    getTopPeaks(data, plot, n = 3) {
        // Get plot minimum and maximum
        const min = plot.getXAxes()[0].options.min;
        const max = plot.getXAxes()[0].options.max;
        // Get data within range and sort by decreasing intensity
        const reducedData = data.filter(x => min <= x[0] && x[0] <= max);
        reducedData.sort((a, b) => b[1] - a[1]);
        // Return the top n hits
        return reducedData.slice(0, n);
    }
    /**
     * Parse data into a plottable format
     * @param originalData spectrum data
     */
    parseData(originalData) {
        let data = [];
        const annotations = [];
        // Parse data if it is in the standard string format
        if (typeof originalData === 'string') {
            data = originalData.split(' ').map(x => x.split(':').map(Number));
        }
        // Check that the data is in a readable form already
        else if (Array.isArray(originalData) && originalData.length > 0 && Array.isArray(originalData[0])) {
            data = originalData;
        }
        // Reduce the object-form of the mass spectrum
        else if (Array.isArray(originalData) && originalData.length > 0 && typeof originalData[0] === 'object') {
            originalData.forEach(x => {
                if (typeof x.selected === 'undefined' || x.selected === true) {
                    data.push([x.ion, x.intensity]);
                    if (x.annotation && x.annotation !== '') {
                        annotations.push([x.ion, x.annotation]);
                    }
                }
            });
        }
        if (data.length > 1000) {
            data.sort((a, b) => b[1] - a[1]);
            data = data.slice(0, 1000);
        }
        // Sort data by m/z
        data.sort((a, b) => a[0] - b[0]);
        data = this.truncate ? data.map(x => [Number(x[0].toFixed(4)), Number(x[1].toFixed(2))]) : data;
        // Return parsed data
        return { data, annotations };
    }
}
MasspecPlotterLibComponent.ɵfac = function MasspecPlotterLibComponent_Factory(t) { return new (t || MasspecPlotterLibComponent)(i0.ɵɵdirectiveInject(i0.ElementRef), i0.ɵɵdirectiveInject(i0.Renderer2)); };
MasspecPlotterLibComponent.ɵcmp = i0.ɵɵdefineComponent({ type: MasspecPlotterLibComponent, selectors: [["lib-masspec-plotter-lib"]], inputs: { spectrum: "spectrum", miniPlot: "miniPlot", pmzMax: "pmzMax", truncate: "truncate" }, features: [i0.ɵɵNgOnChangesFeature], decls: 2, vars: 0, consts: [[2, "width", "100%", "height", "100%", "display", "inline-block"], [1, "masspec", 2, "width", "100%", "height", "100%"]], template: function MasspecPlotterLibComponent_Template(rf, ctx) { if (rf & 1) {
        i0.ɵɵelementStart(0, "div", 0);
        i0.ɵɵelement(1, "div", 1);
        i0.ɵɵelementEnd();
    } }, encapsulation: 2 });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(MasspecPlotterLibComponent, [{
        type: Component,
        args: [{
                selector: 'lib-masspec-plotter-lib',
                template: `
    <div style="width: 100%; height: 100%; display: inline-block;">
      <div class="masspec" style="width: 100%; height: 100%"></div>
    </div>
  `
            }]
    }], function () { return [{ type: i0.ElementRef }, { type: i0.Renderer2 }]; }, { spectrum: [{
            type: Input
        }], miniPlot: [{
            type: Input
        }], pmzMax: [{
            type: Input
        }], truncate: [{
            type: Input
        }] }); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFzc3BlYy1wbG90dGVyLWxpYi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiL2hvbWUvbm9sYW4vRGV2ZWxvcG1lbnQvbW9uYS1zZXJ2aWNlcy9hbmd1bGFyLW1hc3NwZWMtcGxvdHRlci9wcm9qZWN0cy9tYXNzcGVjLXBsb3R0ZXItbGliL3NyYy8iLCJzb3VyY2VzIjpbImxpYi9tYXNzcGVjLXBsb3R0ZXItbGliLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsU0FBUyxFQUEwRCxLQUFLLEVBQUMsTUFBTSxlQUFlLENBQUM7O0FBWXZHLE1BQU0sT0FBTywwQkFBMEI7SUFZckMsWUFBb0IsRUFBYyxFQUFVLFFBQW1CO1FBQTNDLE9BQUUsR0FBRixFQUFFLENBQVk7UUFBVSxhQUFRLEdBQVIsUUFBUSxDQUFXO0lBQUksQ0FBQztJQUVwRSxXQUFXLENBQUMsT0FBc0I7UUFFaEMsMERBQTBEO1FBQzFELElBQUksT0FBTyxJQUFJLENBQUMsSUFBSSxLQUFLLFdBQVcsRUFBRTtZQUNwQyxJQUFJLE9BQU8sQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLElBQUksT0FBTyxPQUFPLENBQUMsUUFBUSxLQUFLLFdBQVcsRUFBRTtnQkFDakYsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDaEQsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO2FBQ25CO2lCQUFNLElBQUksT0FBTyxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsSUFBSSxPQUFPLE9BQU8sQ0FBQyxNQUFNLEtBQUssV0FBVyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ3JHLGtEQUFrRDtnQkFDbEQsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO2FBQ25CO1NBQ0Y7SUFDSCxDQUFDO0lBRUQsUUFBUTtRQUNOLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUN4QixDQUFDO0lBRUQs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aEIsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9uZW50LCBPbkluaXQsIE9uQ2hhbmdlcywgU2ltcGxlQ2hhbmdlcywgUmVuZGVyZXIyLEVsZW1lbnRSZWYsIElucHV0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuZGVjbGFyZSB2YXIgJDogYW55O1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdsaWItbWFzc3BlYy1wbG90dGVyLWxpYicsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdiBzdHlsZT1cIndpZHRoOiAxMDAlOyBoZWlnaHQ6IDEwMCU7IGRpc3BsYXk6IGlubGluZS1ibG9jaztcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJtYXNzcGVjXCIgc3R5bGU9XCJ3aWR0aDogMTAwJTsgaGVpZ2h0OiAxMDAlXCI+PC9kaXY+XG4gICAgPC9kaXY+XG4gIGBcbn0pXG5leHBvcnQgY2xhc3MgTWFzc3BlY1Bsb3R0ZXJMaWJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcyB7XG4gIEBJbnB1dCgpIHNwZWN0cnVtOiBzdHJpbmc7XG4gIEBJbnB1dCgpIG1pbmlQbG90OiBib29sZWFuO1xuXG4gIC8vIEFkZGVkIDIwMjEvMDQvMjBcbiAgQElucHV0KCkgcG16TWF4OiBudW1iZXI7XG4gIEBJbnB1dCgpIHRydW5jYXRlOiBib29sZWFuO1xuXG4gIHBhcnNlZERhdGE6IGFueTtcbiAgcGxvdDtcbiAgcGxhY2Vob2xkZXI7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBlbDogRWxlbWVudFJlZiwgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyKSB7IH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG5cbiAgICAvLyBXYXRjaCB0aGUgZGF0YSBzb3VyY2UgZm9yIGNoYW5nZXMgdG8gc3BlY3RydW0gb3IgcG16TWF4XG4gICAgaWYgKHR5cGVvZiB0aGlzLnBsb3QgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBpZiAoY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eSgnc3BlY3RydW0nKSAmJiB0eXBlb2YgY2hhbmdlcy5zcGVjdHJ1bSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdGhpcy5wYXJzZWREYXRhID0gdGhpcy5wYXJzZURhdGEodGhpcy5zcGVjdHJ1bSk7XG4gICAgICAgIHRoaXMucmVkcmF3UGxvdCgpO1xuICAgICAgfSBlbHNlIGlmIChjaGFuZ2VzLmhhc093blByb3BlcnR5KCdwbXpNYXgnKSAmJiB0eXBlb2YgY2hhbmdlcy5wbXpNYXggIT09ICd1bmRlZmluZWQnICYmIHRoaXMuc3BlY3RydW0pIHtcbiAgICAgICAgLy8gTm8gbmVlZCB0byBwYXJzZSBkYXRhIGFnYWluIGlmIGFkanVzdGluZyB4LWF4aXNcbiAgICAgICAgdGhpcy5yZWRyYXdQbG90KCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5pbml0aWFsaXplUGxvdCgpO1xuICB9XG5cbiAgY29tcHV0ZVBsb3RMaW1pdHMoZGF0YTogYW55W10pIHtcbiAgICBsZXQgbXpNYXg6IG51bWJlcjtcbiAgICBpZiAodGhpcy5wbXpNYXggIT09IHVuZGVmaW5lZCkge1xuICAgICAgbXpNYXggPSB0aGlzLnBtek1heDtcbiAgICB9IGVsc2Uge1xuICAgICAgbXpNYXggPSBNYXRoLm1heC5hcHBseShNYXRoLCBkYXRhLm1hcCh4ID0+IHhbMF0pKTtcbiAgICB9XG4gICAgY29uc3QgaW50ZW5zaXR5TWF4ID0gTWF0aC5tYXguYXBwbHkoTWF0aCwgZGF0YS5tYXAoeCA9PiB4WzFdKSk7XG4gICAgcmV0dXJuIFttek1heCwgaW50ZW5zaXR5TWF4XTtcbiAgfVxuXG4gIGluaXRpYWxpemVQbG90KCkge1xuICAgIHRoaXMucGFyc2VkRGF0YSA9IHRoaXMucGFyc2VEYXRhKHRoaXMuc3BlY3RydW0pO1xuICAgIGxldCBkYXRhID0gdGhpcy5wYXJzZWREYXRhLmRhdGE7XG4gICAgY29uc3QgYW5ub3RhdGlvbnMgPSB0aGlzLnBhcnNlZERhdGEuYW5ub3RhdGlvbnM7XG5cbiAgICAvLyBDb21wdXRlIHBsb3QgbGltaXRzXG4gICAgbGV0IFttek1heCwgaW50ZW5zaXR5TWF4XSA9IHRoaXMuY29tcHV0ZVBsb3RMaW1pdHMoZGF0YSk7XG5cbiAgICAvLyBCYXNlIG9wdGlvbnNcbiAgICBjb25zdCBvcHRpb25zOiBhbnkgPSB7XG4gICAgICBzZXJpZXM6IHtcbiAgICAgICAgY29sb3I6ICcjMDBmJyxcbiAgICAgICAgbGluZXM6IHtzaG93OiB0cnVlLCBsaW5lV2lkdGg6IDAuNX0sXG4gICAgICAgIHNoYWRvd1NpemU6IDBcbiAgICAgIH0sXG5cbiAgICAgIGdyaWQ6IHtcbiAgICAgICAgbGFiZWxNYXJnaW46IDE1LFxuXG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogJyNmZmYnLFxuICAgICAgICBjb2xvcjogJyNlMmU2ZTknLFxuXG4gICAgICAgIGJvcmRlcldpZHRoOiB7dG9wOiAwLCByaWdodDogMCwgYm90dG9tOiAxLCBsZWZ0OiAxfSxcbiAgICAgICAgYm9yZGVyQ29sb3I6IG51bGxcbiAgICAgIH0sXG5cbiAgICAgIGxlZ2VuZDoge3Nob3c6IGZhbHNlfVxuICAgIH07XG5cbiAgICAvLyBGb3JtYXQgcGxvdCBpZiBhIHRodW1ibmFpbCB2ZXJzaW9uIGlzIGRlc2lyZWRcbiAgICBpZiAodHlwZW9mIHRoaXMubWluaVBsb3QgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAvLyBSZW1vdmUgdGljayBsYWJlbHMgYW5kIHNldCBwbG90IGxpbWl0c1xuICAgICAgb3B0aW9ucy54YXhpcyA9IHttaW46IDAsIG1heDogTWF0aC5tYXgoMS4wNSAqIG16TWF4LCA1MDApLCB0aWNrczogZmFsc2V9O1xuICAgICAgb3B0aW9ucy55YXhpcyA9IHttaW46IDAsIG1heDogaW50ZW5zaXR5TWF4LCB0aWNrczogZmFsc2V9O1xuXG4gICAgICAvLyBGaWx0ZXIgbG93IGludGVuc2l0eSBwZWFrc1xuICAgICAgZGF0YSA9IGRhdGEuZmlsdGVyKHggPT4geFsxXSA+IDAuMDUgKiBpbnRlbnNpdHlNYXgpO1xuICAgIH1cblxuICAgIC8vIE90aGVyd2lzZSwgc2V0IHVwIHBsb3Qgc2VsZWN0aW9uIHpvb20gYW5kIHRvb2x0aXBzXG4gICAgZWxzZSB7XG4gICAgICAvLyBTZXQgdXAgcGxvdCBsaW1pdHNcbiAgICAgIG9wdGlvbnMueGF4aXMgPSB7bWluOiAwLCBtYXg6IDEuMDUgKiBtek1heH07XG4gICAgICBvcHRpb25zLnlheGlzID0ge21pbjogMCwgbWF4OiBpbnRlbnNpdHlNYXh9O1xuXG4gICAgICAvLyBTZXQgcGxvdCBzZWxlY3Rpb24gbW9kZVxuICAgICAgb3B0aW9ucy5zZWxlY3Rpb24gPSB7bW9kZTogJ3gnfTtcblxuICAgICAgLy8gU2V0IGhvdmVyYWJsZSBwbG90IHByb3BlcnRpZXNcbiAgICAgIG9wdGlvbnMuZ3JpZC5ob3ZlcmFibGUgPSB0cnVlO1xuICAgICAgb3B0aW9ucy5ncmlkLm1vdXNlQWN0aXZlUmFkaXVzID0gMTA7XG4gICAgfVxuXG4gICAgLy8gRmluZCBwbGFjZWhvbGRlciBlbGVtZW50IGFuZCBwbG90IHRoZSBtYXNzIHNwZWN0cnVtXG4gICAgY29uc3QgcGxvdERhdGEgPSBkYXRhLm1hcCh4ID0+ICh7ZGF0YTogW1t4WzBdLCAwXSwgeF0sIGxpbmVzOiB7c2hvdzogdHJ1ZSwgbGluZVdpZHRoOiAwLjc1fX0pKTtcblxuICAgIGNvbnN0IGNvbnRhaW5lcklkOiBzdHJpbmcgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuaWQ7XG4gICAgdGhpcy5wbGFjZWhvbGRlciA9ICQoJyMnICsgY29udGFpbmVySWQpLmZpbmQoJy5tYXNzcGVjJyk7XG4gICAgdGhpcy5wbG90ID0gJC5wbG90KHRoaXMucGxhY2Vob2xkZXIsIHBsb3REYXRhLCBvcHRpb25zKTtcblxuXG4gICAgLy8gU2V0IHVwIGludGVyYWN0aXZpdHkgaWYgdGhpcyBpcyBhIGZ1bGwgcGxvdFxuICAgIGlmICh0eXBlb2YgdGhpcy5taW5pUGxvdCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIC8vIFBsb3QgYW5ub3RhdGlvbnNcbiAgICAgIHRoaXMucGxvdEFubm90YXRpb25zKCk7XG5cbiAgICAgIC8vIERlZmluZSBzZWxlY3Rpb24gem9vbSBmdW5jdGlvbmFsaXR5XG4gICAgICB0aGlzLnBsYWNlaG9sZGVyLmJpbmQoJ3Bsb3RzZWxlY3RlZCcsIChldmVudCwgcmFuZ2UpID0+IHtcbiAgICAgICAgLy8gR2V0IG1heGltdW0gaW50ZW5zaXR5IGluIGdpdmVuIHJhbmdlXG4gICAgICAgIGNvbnN0IG1heExvY2FsSW50ZW5zaXR5ID0gdGhpcy5tYXhJbnRlbnNpdHlJblJhbmdlKGRhdGEsIHJhbmdlLnhheGlzLmZyb20sIHJhbmdlLnhheGlzLnRvKTtcblxuICAgICAgICAvLyBTZXQgeC1heGlzIHJhbmdlXG4gICAgICAgICQuZWFjaCh0aGlzLnBsb3QuZ2V0WEF4ZXMoKSwgKF8sIGF4aXMpID0+IHtcbiAgICAgICAgICBheGlzLm9wdGlvbnMubWluID0gcmFuZ2UueGF4aXMuZnJvbTtcbiAgICAgICAgICBheGlzLm9wdGlvbnMubWF4ID0gcmFuZ2UueGF4aXMudG87XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFNldCB5LWF4aXMgcmFuZ2VcbiAgICAgICAgJC5lYWNoKHRoaXMucGxvdC5nZXRZQXhlcygpLCAoXywgYXhpcykgPT4ge1xuICAgICAgICAgIGF4aXMub3B0aW9ucy5taW4gPSAwO1xuICAgICAgICAgIGF4aXMub3B0aW9ucy5tYXggPSBtYXhMb2NhbEludGVuc2l0eTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gUmVkcmF3IHBsb3RcbiAgICAgICAgdGhpcy5wbG90LnNldHVwR3JpZCgpO1xuICAgICAgICB0aGlzLnBsb3QuZHJhdygpO1xuICAgICAgICB0aGlzLnBsb3QuY2xlYXJTZWxlY3Rpb24oKTtcbiAgICAgICAgdGhpcy5wbG90QW5ub3RhdGlvbnMoKTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBBZGQgYnV0dG9uIHRvIHJlc2V0IHNlbGVjdGlvbiB6b29taW5nXG4gICAgICAkKCc8ZGl2PjxpIGNsYXNzPVwiZmEgZmEtYXJyb3dzLWFsdCBmYS0yeFwiPjwvaT48L2Rpdj4nKS5jc3Moe1xuICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgdG9wOiAnMTBweCcsXG4gICAgICAgIHJpZ2h0OiAnMTBweCcsXG4gICAgICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgICAgICAnZm9udC1zaXplJzogJ3NtYWxsZXInLFxuICAgICAgICBjb2xvcjogJyMwMDAnLFxuICAgICAgICAvLyAnYmFja2dyb3VuZC1jb2xvcic6ICcjZWVlJyxcbiAgICAgICAgcGFkZGluZzogJzJweCdcbiAgICAgIH0pLmFwcGVuZFRvKHRoaXMucGxhY2Vob2xkZXIpLmNsaWNrKChldmVudCkgPT4ge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB0aGlzLnJlZHJhd1Bsb3QoKTtcbiAgICAgIH0pO1xuXG5cbiAgICAgIC8vIERlZmluZSBmdW5jdGlvbmFsaXR5IGZvciBwbG90IGhvdmVyIC8gdG9vbHRpcHNcbiAgICAgIHRoaXMucGxhY2Vob2xkZXIuYmluZCgncGxvdGhvdmVyJywgKGV2ZW50LCBwb3MsIGl0ZW0pID0+IHtcbiAgICAgICAgY29uc3Qgc2hvd1Rvb2x0aXAgPSAoY29udGVudHMpID0+IHtcbiAgICAgICAgICAkKCdjYW52YXMnKS5jc3MoJ2N1cnNvcicsICdwb2ludGVyJyk7XG5cbiAgICAgICAgICBjb25zdCBwID0gdGhpcy5wbG90LnBvaW50T2Zmc2V0KHt4OiBwb3MueCwgeTogcG9zLnl9KTtcblxuICAgICAgICAgICQoJzxkaXYgaWQ9XCJtYXNzcGVjLXRvb2x0aXBcIj4nICsgY29udGVudHMgKyAnPC9kaXY+JykuY3NzKHtcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgdG9wOiBwLnRvcCArIDUsXG4gICAgICAgICAgICBsZWZ0OiBwLmxlZnQgKyA1LFxuICAgICAgICAgICAgJ2ZvbnQtc2l6ZSc6ICdzbWFsbGVyJyxcbiAgICAgICAgICAgIGJhY2tncm91bmQ6ICcjZmZmJyxcbiAgICAgICAgICAgICd6LWluZGV4JzogJzEwNDAnLFxuICAgICAgICAgICAgcGFkZGluZzogJzAuNGVtIDAuNmVtJyxcbiAgICAgICAgICAgICdib3JkZXItcmFkaXVzJzogJzAuNWVtJyxcbiAgICAgICAgICAgIGJvcmRlcjogJzFweCBzb2xpZCAjMTExJyxcbiAgICAgICAgICAgICd3aGl0ZS1zcGFjZSc6ICdub3dyYXAnXG4gICAgICAgICAgfSkuYXBwZW5kVG8odGhpcy5wbGFjZWhvbGRlcik7XG4gICAgICAgIH07XG5cblxuICAgICAgICAvLyBSZW1vdmUgY3VycmVudCB0b29sdGlwIGFuZCBoaWdobGlnaHRcbiAgICAgICAgJCgnI21hc3NwZWMtdG9vbHRpcCcpLnJlbW92ZSgpO1xuICAgICAgICAkKCdjYW52YXMnKS5jc3MoJ2N1cnNvcicsICdhdXRvJyk7XG4gICAgICAgIHRoaXMucGxvdC51bmhpZ2hsaWdodCgpO1xuXG5cbiAgICAgICAgLy8gSWYgZGF0YXBvaW50IGlzIHNlbGVjdGVkLCBzaG93IHRoZSB0b29sdGlwXG4gICAgICAgIGlmIChpdGVtKSB7XG4gICAgICAgICAgc2hvd1Rvb2x0aXAoJ20veiA9ICcgKyBpdGVtLmRhdGFwb2ludFswXSArICc8YnIgLz5hYnVuZGFuY2UgPSAnICsgaXRlbS5kYXRhcG9pbnRbMV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gT3RoZXJ3aXNlLCBjaGVjayBpZiBsaW5lIGJlaW5nIGhvdmVyZWQgb3ZlclxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAvLyBGaW5kIG5lYXJlc3QgaW9uXG4gICAgICAgICAgY29uc3QgbmVhcmVzdElvbjogYW55ID0ge1xuICAgICAgICAgICAgZGlzdDogLTFcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgY29uc3QgY3Vyc29yID0gdGhpcy5wbG90LnBvaW50T2Zmc2V0KHt4OiBwb3MueCwgeTogcG9zLnl9KTtcblxuICAgICAgICAgICQuZWFjaChkYXRhLCAoaSwgeCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcCA9IHRoaXMucGxvdC5wb2ludE9mZnNldCh7eDogeFswXSwgeTogeFsxXX0pO1xuXG4gICAgICAgICAgICBpZiAobmVhcmVzdElvbi5kaXN0ID09PSAtMSB8fFxuICAgICAgICAgICAgICAoTWF0aC5hYnMocC5sZWZ0IC0gY3Vyc29yLmxlZnQpIDwgbmVhcmVzdElvbi5kaXN0ICYmIHBvcy55ID4gMCAmJiBwb3MueSA8IHhbMV0pKSB7XG4gICAgICAgICAgICAgIG5lYXJlc3RJb24uZGlzdCA9IE1hdGguYWJzKHAubGVmdCAtIGN1cnNvci5sZWZ0KTtcbiAgICAgICAgICAgICAgbmVhcmVzdElvbi5pID0gaTtcbiAgICAgICAgICAgICAgbmVhcmVzdElvbi5kYXRhcG9pbnQgPSB4O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgLy8gU2V0IHRvb2x0aXAgaWYgd2UgYXJlIG5lYXIgYW4gaW9uIHBlYWtcbiAgICAgICAgICBpZiAobmVhcmVzdElvbi5kaXN0ICE9PSAtMSAmJiBuZWFyZXN0SW9uLmRpc3QgPCB0aGlzLnBsb3QuZ2V0T3B0aW9ucygpLmdyaWQubW91c2VBY3RpdmVSYWRpdXMpIHtcbiAgICAgICAgICAgIHNob3dUb29sdGlwKCdtL3ogPSAnICsgbmVhcmVzdElvbi5kYXRhcG9pbnRbMF0gKyAnPGJyIC8+YWJ1bmRhbmNlID0gJyArIG5lYXJlc3RJb24uZGF0YXBvaW50WzFdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICAvLyBSZXBsb3QgYW5ub3RhdGlvbnMgd2hlbiB3aW5kb3cgaXMgcmVzaXplZFxuICAgICAgdGhpcy5wbGFjZWhvbGRlci5yZXNpemUoKCkgPT4gdGhpcy5wbG90QW5ub3RhdGlvbnMoKSk7XG4gICAgfVxuICB9XG5cbiAgcmVkcmF3UGxvdCgpIHtcbiAgICBjb25zdCBwbG90RGF0YSA9IHRoaXMucGFyc2VkRGF0YS5kYXRhLm1hcCh4ID0+ICh7ZGF0YTogW1t4WzBdLCAwXSwgeF0sIGxpbmVzOiB7c2hvdzogdHJ1ZSwgbGluZVdpZHRoOiAwLjc1fX0pKTtcbiAgICB0aGlzLnBsb3Quc2V0RGF0YShwbG90RGF0YSk7XG5cbiAgICAvLyBDb21wdXRlIHBsb3QgbGltaXRzXG4gICAgbGV0IFttek1heCwgaW50ZW5zaXR5TWF4XSA9IHRoaXMuY29tcHV0ZVBsb3RMaW1pdHModGhpcy5wYXJzZWREYXRhLmRhdGEpO1xuXG4gICAgLy8gUmVzZXQgeC1heGlzIHJhbmdlXG4gICAgJC5lYWNoKHRoaXMucGxvdC5nZXRYQXhlcygpLCAoXywgYXhpcykgPT4ge1xuICAgICAgYXhpcy5vcHRpb25zLm1pbiA9IDA7XG4gICAgICBheGlzLm9wdGlvbnMubWF4ID0gMS4wNSAqIG16TWF4O1xuICAgIH0pO1xuXG4gICAgLy8gUmVzZXQgeS1heGlzIHJhbmdlXG4gICAgJC5lYWNoKHRoaXMucGxvdC5nZXRZQXhlcygpLCAoXywgYXhpcykgPT4ge1xuICAgICAgYXhpcy5vcHRpb25zLm1pbiA9IDA7XG4gICAgICBheGlzLm9wdGlvbnMubWF4ID0gaW50ZW5zaXR5TWF4O1xuICAgIH0pO1xuXG4gICAgLy8gUmVkcmF3IHBsb3RcbiAgICB0aGlzLnBsb3Quc2V0dXBHcmlkKCk7XG4gICAgdGhpcy5wbG90LmRyYXcoKTtcbiAgICB0aGlzLnBsb3QuY2xlYXJTZWxlY3Rpb24oKTtcblxuICAgIGlmICh0eXBlb2YgdGhpcy5taW5pUGxvdCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRoaXMucGxvdEFubm90YXRpb25zKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhbm5vdGF0aW9ucyBmb3IgdGhlIHRvcCBuIGlvbnNcbiAgICogQHBhcmFtIGRhdGEgc3BlY3RydW0gZGF0YVxuICAgKiBAcGFyYW0gcGxvdCBwbG90IGVsZW1lbnRcbiAgICogQHBhcmFtIHBsYWNlaG9sZGVyIHBsYWNlaG9sZGVyIGVsZW1lbnRcbiAgICogQHBhcmFtIG4gbnVtYmVyIG9mIHRvcCBpb25zXG4gICAqL1xuICBwbG90QW5ub3RhdGlvbnMobiA9IDMpIHtcbiAgICAvLyBSZW1vdmUgYWxsIGFubm90YXRpb24gZWxlbWVudHNcbiAgICAkKCcubWFzc3BlYy1hbm5vdGF0aW9uJykucmVtb3ZlKCk7XG5cbiAgICAvLyBBZGQgYW5ub3RhdGlvbnNcbiAgICBmb3IgKGNvbnN0IHBlYWsgb2YgdGhpcy5nZXRUb3BQZWFrcyh0aGlzLnBhcnNlZERhdGEuZGF0YSwgdGhpcy5wbG90LCBuKSkge1xuICAgICAgY29uc3QgcCA9IHRoaXMucGxvdC5wb2ludE9mZnNldCh7eDogcGVha1swXSwgeTogcGVha1sxXX0pO1xuXG4gICAgICAvLyBQbGFjZSBhbm5vdGF0aW9uIGFuZCB0aGVuIHJlcG9zaXRpb24gdG8gY2VudGVyIG9uIGlvblxuICAgICAgY29uc3QgYW5ub3RhdGlvbiA9ICQoJzxkaXYgY2xhc3M9XCJtYXNzcGVjLWFubm90YXRpb25cIj4nICsgcGVha1swXSArICc8L2Rpdj4nKS5jc3Moe1xuICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgdG9wOiBwLnRvcCAtIDEyLFxuICAgICAgICBjb2xvcjogJyNmMDAnLFxuICAgICAgICAnZm9udC1zaXplJzogJ3gtc21hbGwnLFxuICAgICAgICAndGV4dC1hbGlnbic6ICdjZW50ZXInXG4gICAgICB9KTtcbiAgICAgIGFubm90YXRpb24uYXBwZW5kVG8odGhpcy5wbGFjZWhvbGRlcik7XG4gICAgICBhbm5vdGF0aW9uLmNzcyh7bGVmdDogcC5sZWZ0IC0gYW5ub3RhdGlvbi53aWR0aCgpIC8gMn0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5kIHRoZSBtYXhpbXVtIGludGVuc2l0eSBpbiB0aGUgZ2l2ZW4gcmFuZ2UrXG4gICAqIEBwYXJhbSBkYXRhIHBsb3QgZGF0YVxuICAgKiBAcGFyYW0gbWluIG1pbmltdW0gbS96XG4gICAqIEBwYXJhbSBtYXggbWF4aW11bSBtL3pcbiAgICovXG4gIG1heEludGVuc2l0eUluUmFuZ2UoZGF0YSwgbWluLCBtYXgpIHtcbiAgICBsZXQgbWF4TG9jYWxJbnRlbnNpdHkgPSAwO1xuXG4gICAgZm9yIChjb25zdCB4IG9mIGRhdGEpIHtcbiAgICAgIGlmICh4WzBdID49IG1heCkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgZWxzZSBpZiAoeFswXSA+PSBtaW4gJiYgeFsxXSA+PSBtYXhMb2NhbEludGVuc2l0eSkge1xuICAgICAgICBtYXhMb2NhbEludGVuc2l0eSA9IHhbMV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIE1hdGgubWF4KG1heExvY2FsSW50ZW5zaXR5LCAwLjEpO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbmQgdGhlIG4gaW9ucyB3aXRoIHRoZSBoaWdoZXN0IGludGVuc2l0eSBpbiB0aGUgZ2l2ZW4gcmFuZ2VcbiAgICogQHBhcmFtIGRhdGEgc3BlY3RydW0gZGF0YVxuICAgKiBAcGFyYW0gcGxvdCBwbG90IG9iamVjdFxuICAgKiBAcGFyYW0gbiBudW1iZXIgb2YgaGlnaGVzdCBpbnRlbnNpdHkgaW9uc1xuICAgKi9cbiAgZ2V0VG9wUGVha3MoZGF0YSwgcGxvdCwgbiA9IDMpIHtcbiAgICAvLyBHZXQgcGxvdCBtaW5pbXVtIGFuZCBtYXhpbXVtXG4gICAgY29uc3QgbWluID0gcGxvdC5nZXRYQXhlcygpWzBdLm9wdGlvbnMubWluO1xuICAgIGNvbnN0IG1heCA9IHBsb3QuZ2V0WEF4ZXMoKVswXS5vcHRpb25zLm1heDtcblxuICAgIC8vIEdldCBkYXRhIHdpdGhpbiByYW5nZSBhbmQgc29ydCBieSBkZWNyZWFzaW5nIGludGVuc2l0eVxuICAgIGNvbnN0IHJlZHVjZWREYXRhID0gZGF0YS5maWx0ZXIoeCA9PiBtaW4gPD0geFswXSAmJiB4WzBdIDw9IG1heCk7XG4gICAgcmVkdWNlZERhdGEuc29ydCgoYSwgYikgPT4gYlsxXSAtIGFbMV0pO1xuXG4gICAgLy8gUmV0dXJuIHRoZSB0b3AgbiBoaXRzXG4gICAgcmV0dXJuIHJlZHVjZWREYXRhLnNsaWNlKDAsIG4pO1xuICB9XG5cbiAgLyoqXG4gICAqIFBhcnNlIGRhdGEgaW50byBhIHBsb3R0YWJsZSBmb3JtYXRcbiAgICogQHBhcmFtIG9yaWdpbmFsRGF0YSBzcGVjdHJ1bSBkYXRhXG4gICAqL1xuICBwYXJzZURhdGEob3JpZ2luYWxEYXRhKSB7XG4gICAgbGV0IGRhdGEgPSBbXTtcbiAgICBjb25zdCBhbm5vdGF0aW9ucyA9IFtdO1xuXG4gICAgLy8gUGFyc2UgZGF0YSBpZiBpdCBpcyBpbiB0aGUgc3RhbmRhcmQgc3RyaW5nIGZvcm1hdFxuICAgIGlmICh0eXBlb2Ygb3JpZ2luYWxEYXRhID09PSAnc3RyaW5nJykge1xuICAgICAgZGF0YSA9IG9yaWdpbmFsRGF0YS5zcGxpdCgnICcpLm1hcCh4ID0+IHguc3BsaXQoJzonKS5tYXAoTnVtYmVyKSk7XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgdGhhdCB0aGUgZGF0YSBpcyBpbiBhIHJlYWRhYmxlIGZvcm0gYWxyZWFkeVxuICAgIGVsc2UgaWYgKEFycmF5LmlzQXJyYXkob3JpZ2luYWxEYXRhKSAmJiBvcmlnaW5hbERhdGEubGVuZ3RoID4gMCAmJiBBcnJheS5pc0FycmF5KG9yaWdpbmFsRGF0YVswXSkpIHtcbiAgICAgIGRhdGEgPSBvcmlnaW5hbERhdGE7XG4gICAgfVxuXG4gICAgLy8gUmVkdWNlIHRoZSBvYmplY3QtZm9ybSBvZiB0aGUgbWFzcyBzcGVjdHJ1bVxuICAgIGVsc2UgaWYgKEFycmF5LmlzQXJyYXkob3JpZ2luYWxEYXRhKSAmJiBvcmlnaW5hbERhdGEubGVuZ3RoID4gMCAmJiB0eXBlb2Ygb3JpZ2luYWxEYXRhWzBdID09PSAnb2JqZWN0Jykge1xuICAgICAgb3JpZ2luYWxEYXRhLmZvckVhY2goeCA9PiB7XG4gICAgICAgIGlmICh0eXBlb2YgeC5zZWxlY3RlZCA9PT0gJ3VuZGVmaW5lZCcgfHwgeC5zZWxlY3RlZCA9PT0gdHJ1ZSkge1xuICAgICAgICAgIGRhdGEucHVzaChbeC5pb24sIHguaW50ZW5zaXR5XSk7XG5cbiAgICAgICAgICBpZiAoeC5hbm5vdGF0aW9uICYmIHguYW5ub3RhdGlvbiAhPT0gJycpIHtcbiAgICAgICAgICAgIGFubm90YXRpb25zLnB1c2goW3guaW9uLCB4LmFubm90YXRpb25dKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChkYXRhLmxlbmd0aCA+IDEwMDApIHtcbiAgICAgIGRhdGEuc29ydCgoYSwgYikgPT4gYlsxXSAtIGFbMV0pO1xuICAgICAgZGF0YSA9IGRhdGEuc2xpY2UoMCwgMTAwMCk7XG4gICAgfVxuXG4gICAgLy8gU29ydCBkYXRhIGJ5IG0velxuICAgIGRhdGEuc29ydCgoYSwgYikgPT4gYVswXSAtIGJbMF0pO1xuXG4gICAgZGF0YSA9IHRoaXMudHJ1bmNhdGUgPyBkYXRhLm1hcCh4ID0+IFtOdW1iZXIoeFswXS50b0ZpeGVkKDQpKSwgTnVtYmVyKHhbMV0udG9GaXhlZCgyKSldKSA6IGRhdGE7XG5cbiAgICAvLyBSZXR1cm4gcGFyc2VkIGRhdGFcbiAgICByZXR1cm4ge2RhdGEsIGFubm90YXRpb25zfTtcbiAgfVxuXG59XG4iXX0=