(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core')) :
    typeof define === 'function' && define.amd ? define('masspec-plotter-lib', ['exports', '@angular/core'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global['masspec-plotter-lib'] = {}, global.ng.core));
}(this, (function (exports, i0) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (Object.prototype.hasOwnProperty.call(b, p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __rest(s, e) {
        var t = {};
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
                t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }
    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }
    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); };
    }
    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(metadataKey, metadataValue);
    }
    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            } }
            function rejected(value) { try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }
    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function () { if (t[0] & 1)
                throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f)
                throw new TypeError("Generator is already executing.");
            while (_)
                try {
                    if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                        return t;
                    if (y = 0, t)
                        op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2])
                                _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                }
                catch (e) {
                    op = [6, e];
                    y = 0;
                }
                finally {
                    f = t = 0;
                }
            if (op[0] & 5)
                throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    }
    var __createBinding = Object.create ? (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
    }) : (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        o[k2] = m[k];
    });
    function __exportStar(m, o) {
        for (var p in m)
            if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p))
                __createBinding(o, m, p);
    }
    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m)
            return m.call(o);
        if (o && typeof o.length === "number")
            return {
                next: function () {
                    if (o && i >= o.length)
                        o = void 0;
                    return { value: o && o[i++], done: !o };
                }
            };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    /** @deprecated */
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }
    /** @deprecated */
    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }
    function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2)
            for (var i = 0, l = from.length, ar; i < l; i++) {
                if (ar || !(i in from)) {
                    if (!ar)
                        ar = Array.prototype.slice.call(from, 0, i);
                    ar[i] = from[i];
                }
            }
        return to.concat(ar || from);
    }
    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }
    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n])
            i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try {
            step(g[n](v));
        }
        catch (e) {
            settle(q[0][3], e);
        } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length)
            resume(q[0][0], q[0][1]); }
    }
    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }
    function __asyncValues(o) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function (v) { resolve({ value: v, done: d }); }, reject); }
    }
    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        }
        else {
            cooked.raw = raw;
        }
        return cooked;
    }
    ;
    var __setModuleDefault = Object.create ? (function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function (o, v) {
        o["default"] = v;
    };
    function __importStar(mod) {
        if (mod && mod.__esModule)
            return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    }
    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }
    function __classPrivateFieldGet(receiver, state, kind, f) {
        if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    }
    function __classPrivateFieldSet(receiver, state, value, kind, f) {
        if (kind === "m")
            throw new TypeError("Private method is not writable");
        if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
    }

    var MasspecPlotterLibComponent = /** @class */ (function () {
        function MasspecPlotterLibComponent(el, renderer) {
            this.el = el;
            this.renderer = renderer;
        }
        MasspecPlotterLibComponent.prototype.ngOnChanges = function (changes) {
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
        };
        MasspecPlotterLibComponent.prototype.ngOnInit = function () {
            this.initializePlot();
        };
        MasspecPlotterLibComponent.prototype.computePlotLimits = function (data) {
            var mzMax;
            if (this.pmzMax !== undefined) {
                mzMax = this.pmzMax;
            }
            else {
                mzMax = Math.max.apply(Math, data.map(function (x) { return x[0]; }));
            }
            var intensityMax = Math.max.apply(Math, data.map(function (x) { return x[1]; }));
            return [mzMax, intensityMax];
        };
        MasspecPlotterLibComponent.prototype.initializePlot = function () {
            var _this = this;
            this.parsedData = this.parseData(this.spectrum);
            var data = this.parsedData.data;
            var annotations = this.parsedData.annotations;
            // Compute plot limits
            var _a = __read(this.computePlotLimits(data), 2), mzMax = _a[0], intensityMax = _a[1];
            // Base options
            var options = {
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
                data = data.filter(function (x) { return x[1] > 0.05 * intensityMax; });
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
            var plotData = data.map(function (x) { return ({ data: [[x[0], 0], x], lines: { show: true, lineWidth: 0.75 } }); });
            var containerId = this.el.nativeElement.id;
            this.placeholder = $('#' + containerId).find('.masspec');
            this.plot = $.plot(this.placeholder, plotData, options);
            // Set up interactivity if this is a full plot
            if (typeof this.miniPlot === 'undefined') {
                // Plot annotations
                this.plotAnnotations();
                // Define selection zoom functionality
                this.placeholder.bind('plotselected', function (event, range) {
                    // Get maximum intensity in given range
                    var maxLocalIntensity = _this.maxIntensityInRange(data, range.xaxis.from, range.xaxis.to);
                    // Set x-axis range
                    $.each(_this.plot.getXAxes(), function (_, axis) {
                        axis.options.min = range.xaxis.from;
                        axis.options.max = range.xaxis.to;
                    });
                    // Set y-axis range
                    $.each(_this.plot.getYAxes(), function (_, axis) {
                        axis.options.min = 0;
                        axis.options.max = maxLocalIntensity;
                    });
                    // Redraw plot
                    _this.plot.setupGrid();
                    _this.plot.draw();
                    _this.plot.clearSelection();
                    _this.plotAnnotations();
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
                }).appendTo(this.placeholder).click(function (event) {
                    event.preventDefault();
                    _this.redrawPlot();
                });
                // Define functionality for plot hover / tooltips
                this.placeholder.bind('plothover', function (event, pos, item) {
                    var showTooltip = function (contents) {
                        $('canvas').css('cursor', 'pointer');
                        var p = _this.plot.pointOffset({ x: pos.x, y: pos.y });
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
                        }).appendTo(_this.placeholder);
                    };
                    // Remove current tooltip and highlight
                    $('#masspec-tooltip').remove();
                    $('canvas').css('cursor', 'auto');
                    _this.plot.unhighlight();
                    // If datapoint is selected, show the tooltip
                    if (item) {
                        showTooltip('m/z = ' + item.datapoint[0] + '<br />abundance = ' + item.datapoint[1]);
                    }
                    // Otherwise, check if line being hovered over
                    else {
                        // Find nearest ion
                        var nearestIon_1 = {
                            dist: -1
                        };
                        var cursor_1 = _this.plot.pointOffset({ x: pos.x, y: pos.y });
                        $.each(data, function (i, x) {
                            var p = _this.plot.pointOffset({ x: x[0], y: x[1] });
                            if (nearestIon_1.dist === -1 ||
                                (Math.abs(p.left - cursor_1.left) < nearestIon_1.dist && pos.y > 0 && pos.y < x[1])) {
                                nearestIon_1.dist = Math.abs(p.left - cursor_1.left);
                                nearestIon_1.i = i;
                                nearestIon_1.datapoint = x;
                            }
                        });
                        // Set tooltip if we are near an ion peak
                        if (nearestIon_1.dist !== -1 && nearestIon_1.dist < _this.plot.getOptions().grid.mouseActiveRadius) {
                            showTooltip('m/z = ' + nearestIon_1.datapoint[0] + '<br />abundance = ' + nearestIon_1.datapoint[1]);
                        }
                    }
                });
                // Replot annotations when window is resized
                this.placeholder.resize(function () { return _this.plotAnnotations(); });
            }
        };
        MasspecPlotterLibComponent.prototype.redrawPlot = function () {
            var plotData = this.parsedData.data.map(function (x) { return ({ data: [[x[0], 0], x], lines: { show: true, lineWidth: 0.75 } }); });
            this.plot.setData(plotData);
            // Compute plot limits
            var _a = __read(this.computePlotLimits(this.parsedData.data), 2), mzMax = _a[0], intensityMax = _a[1];
            // Reset x-axis range
            $.each(this.plot.getXAxes(), function (_, axis) {
                axis.options.min = 0;
                axis.options.max = 1.05 * mzMax;
            });
            // Reset y-axis range
            $.each(this.plot.getYAxes(), function (_, axis) {
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
        };
        /**
         * Add annotations for the top n ions
         * @param data spectrum data
         * @param plot plot element
         * @param placeholder placeholder element
         * @param n number of top ions
         */
        MasspecPlotterLibComponent.prototype.plotAnnotations = function (n) {
            var e_1, _a;
            if (n === void 0) { n = 3; }
            // Remove all annotation elements
            $('.masspec-annotation').remove();
            try {
                // Add annotations
                for (var _b = __values(this.getTopPeaks(this.parsedData.data, this.plot, n)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var peak = _c.value;
                    var p = this.plot.pointOffset({ x: peak[0], y: peak[1] });
                    // Place annotation and then reposition to center on ion
                    var annotation = $('<div class="masspec-annotation">' + peak[0] + '</div>').css({
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
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        };
        /**
         * Find the maximum intensity in the given range+
         * @param data plot data
         * @param min minimum m/z
         * @param max maximum m/z
         */
        MasspecPlotterLibComponent.prototype.maxIntensityInRange = function (data, min, max) {
            var e_2, _a;
            var maxLocalIntensity = 0;
            try {
                for (var data_1 = __values(data), data_1_1 = data_1.next(); !data_1_1.done; data_1_1 = data_1.next()) {
                    var x = data_1_1.value;
                    if (x[0] >= max) {
                        break;
                    }
                    else if (x[0] >= min && x[1] >= maxLocalIntensity) {
                        maxLocalIntensity = x[1];
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (data_1_1 && !data_1_1.done && (_a = data_1.return)) _a.call(data_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return Math.max(maxLocalIntensity, 0.1);
        };
        /**
         * Find the n ions with the highest intensity in the given range
         * @param data spectrum data
         * @param plot plot object
         * @param n number of highest intensity ions
         */
        MasspecPlotterLibComponent.prototype.getTopPeaks = function (data, plot, n) {
            if (n === void 0) { n = 3; }
            // Get plot minimum and maximum
            var min = plot.getXAxes()[0].options.min;
            var max = plot.getXAxes()[0].options.max;
            // Get data within range and sort by decreasing intensity
            var reducedData = data.filter(function (x) { return min <= x[0] && x[0] <= max; });
            reducedData.sort(function (a, b) { return b[1] - a[1]; });
            // Return the top n hits
            return reducedData.slice(0, n);
        };
        /**
         * Parse data into a plottable format
         * @param originalData spectrum data
         */
        MasspecPlotterLibComponent.prototype.parseData = function (originalData) {
            var data = [];
            var annotations = [];
            // Parse data if it is in the standard string format
            if (typeof originalData === 'string') {
                data = originalData.split(' ').map(function (x) { return x.split(':').map(Number); });
            }
            // Check that the data is in a readable form already
            else if (Array.isArray(originalData) && originalData.length > 0 && Array.isArray(originalData[0])) {
                data = originalData;
            }
            // Reduce the object-form of the mass spectrum
            else if (Array.isArray(originalData) && originalData.length > 0 && typeof originalData[0] === 'object') {
                originalData.forEach(function (x) {
                    if (typeof x.selected === 'undefined' || x.selected === true) {
                        data.push([x.ion, x.intensity]);
                        if (x.annotation && x.annotation !== '') {
                            annotations.push([x.ion, x.annotation]);
                        }
                    }
                });
            }
            if (data.length > 1000) {
                data.sort(function (a, b) { return b[1] - a[1]; });
                data = data.slice(0, 1000);
            }
            // Sort data by m/z
            data.sort(function (a, b) { return a[0] - b[0]; });
            data = this.truncate ? data.map(function (x) { return [Number(x[0].toFixed(4)), Number(x[1].toFixed(2))]; }) : data;
            // Return parsed data
            return { data: data, annotations: annotations };
        };
        return MasspecPlotterLibComponent;
    }());
    MasspecPlotterLibComponent.ɵfac = function MasspecPlotterLibComponent_Factory(t) { return new (t || MasspecPlotterLibComponent)(i0.ɵɵdirectiveInject(i0.ElementRef), i0.ɵɵdirectiveInject(i0.Renderer2)); };
    MasspecPlotterLibComponent.ɵcmp = i0.ɵɵdefineComponent({ type: MasspecPlotterLibComponent, selectors: [["lib-masspec-plotter-lib"]], inputs: { spectrum: "spectrum", miniPlot: "miniPlot", pmzMax: "pmzMax", truncate: "truncate" }, features: [i0.ɵɵNgOnChangesFeature], decls: 2, vars: 0, consts: [[2, "width", "100%", "height", "100%", "display", "inline-block"], [1, "masspec", 2, "width", "100%", "height", "100%"]], template: function MasspecPlotterLibComponent_Template(rf, ctx) {
            if (rf & 1) {
                i0.ɵɵelementStart(0, "div", 0);
                i0.ɵɵelement(1, "div", 1);
                i0.ɵɵelementEnd();
            }
        }, encapsulation: 2 });
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(MasspecPlotterLibComponent, [{
                type: i0.Component,
                args: [{
                        selector: 'lib-masspec-plotter-lib',
                        template: "\n    <div style=\"width: 100%; height: 100%; display: inline-block;\">\n      <div class=\"masspec\" style=\"width: 100%; height: 100%\"></div>\n    </div>\n  "
                    }]
            }], function () { return [{ type: i0.ElementRef }, { type: i0.Renderer2 }]; }, { spectrum: [{
                    type: i0.Input
                }], miniPlot: [{
                    type: i0.Input
                }], pmzMax: [{
                    type: i0.Input
                }], truncate: [{
                    type: i0.Input
                }] });
    })();

    var MasspecPlotterLibModule = /** @class */ (function () {
        function MasspecPlotterLibModule() {
        }
        return MasspecPlotterLibModule;
    }());
    MasspecPlotterLibModule.ɵmod = i0.ɵɵdefineNgModule({ type: MasspecPlotterLibModule });
    MasspecPlotterLibModule.ɵinj = i0.ɵɵdefineInjector({ factory: function MasspecPlotterLibModule_Factory(t) { return new (t || MasspecPlotterLibModule)(); }, imports: [[]] });
    (function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(MasspecPlotterLibModule, { declarations: [MasspecPlotterLibComponent], exports: [MasspecPlotterLibComponent] }); })();
    /*@__PURE__*/ (function () {
        i0.ɵsetClassMetadata(MasspecPlotterLibModule, [{
                type: i0.NgModule,
                args: [{
                        declarations: [MasspecPlotterLibComponent],
                        imports: [],
                        exports: [MasspecPlotterLibComponent]
                    }]
            }], null, null);
    })();

    /*
     * Public API Surface of masspec-plotter-lib
     */

    /**
     * Generated bundle index. Do not edit.
     */

    exports.MasspecPlotterLibComponent = MasspecPlotterLibComponent;
    exports.MasspecPlotterLibModule = MasspecPlotterLibModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=masspec-plotter-lib.umd.js.map
