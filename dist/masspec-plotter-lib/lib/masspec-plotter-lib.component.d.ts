import { OnInit, OnChanges, SimpleChanges, Renderer2, ElementRef } from '@angular/core';
import * as i0 from "@angular/core";
export declare class MasspecPlotterLibComponent implements OnInit, OnChanges {
    private el;
    private renderer;
    spectrum: string;
    miniPlot: boolean;
    pmzMax: number;
    truncate: boolean;
    parsedData: any;
    plot: any;
    placeholder: any;
    constructor(el: ElementRef, renderer: Renderer2);
    ngOnChanges(changes: SimpleChanges): void;
    ngOnInit(): void;
    computePlotLimits(data: any[]): any[];
    initializePlot(): void;
    redrawPlot(): void;
    /**
     * Add annotations for the top n ions
     * @param data spectrum data
     * @param plot plot element
     * @param placeholder placeholder element
     * @param n number of top ions
     */
    plotAnnotations(n?: number): void;
    /**
     * Find the maximum intensity in the given range+
     * @param data plot data
     * @param min minimum m/z
     * @param max maximum m/z
     */
    maxIntensityInRange(data: any, min: any, max: any): number;
    /**
     * Find the n ions with the highest intensity in the given range
     * @param data spectrum data
     * @param plot plot object
     * @param n number of highest intensity ions
     */
    getTopPeaks(data: any, plot: any, n?: number): any;
    /**
     * Parse data into a plottable format
     * @param originalData spectrum data
     */
    parseData(originalData: any): {
        data: any[];
        annotations: any[];
    };
    static ɵfac: i0.ɵɵFactoryDef<MasspecPlotterLibComponent, never>;
    static ɵcmp: i0.ɵɵComponentDefWithMeta<MasspecPlotterLibComponent, "lib-masspec-plotter-lib", never, { "spectrum": "spectrum"; "miniPlot": "miniPlot"; "pmzMax": "pmzMax"; "truncate": "truncate"; }, {}, never, never>;
}
//# sourceMappingURL=masspec-plotter-lib.component.d.ts.map