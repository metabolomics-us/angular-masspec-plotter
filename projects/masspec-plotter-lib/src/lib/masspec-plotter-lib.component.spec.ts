import { SimpleChange, SimpleChanges } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MasspecPlotterLibComponent } from './masspec-plotter-lib.component';

declare var $: any;

describe('NgMassSpecPlotterComponent', () => {
  let component: MasspecPlotterLibComponent;
  let fixture: ComponentFixture<MasspecPlotterLibComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MasspecPlotterLibComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasspecPlotterLibComponent);
    component = fixture.componentInstance;
    spyOn(component, 'initializePlot');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute the correct plot limits', () => {
    let data = [[100, 50], [105, 100], [125, 25]];
    let [mzMax, intensityMax] = component.computePlotLimits(data);
    expect(mzMax).toEqual(125);
    expect(intensityMax).toEqual(100);
  });

  it('should compute plot limits with pmzMax specified', () => {
    component.pmzMax = 200;
    let data = [[100, 50], [105, 100], [125, 25]];
    let [mzMax, intensityMax] = component.computePlotLimits(data);
    expect(mzMax).toEqual(200);
    expect(intensityMax).toEqual(100);
  });

  it('should produce the correct spectrum array', () => {
    let spectrum = "100:50 105:100 125:25";
    let correctData = [[100, 50], [105, 100], [125, 25]];
    let parsedData = component.parseData(spectrum);
    let data = parsedData.data;
    expect(data).toEqual(correctData);
  });

  it('should call the right functions on pmzMax changes', () => {
    spyOn(component, 'parseData');
    spyOn(component, 'redrawPlot');
    component.spectrum = '100:12 121:100 150:40';
    component.plot = ''; // making plot any object that is not undefined
    let changes: SimpleChanges;
    let pmzMax: SimpleChange;
    pmzMax = {
      currentValue: 200,
      firstChange: true,
      previousValue: undefined,
      isFirstChange: () => {
        return true;
      }
    }
    changes = {
      pmzMax: pmzMax
    }
    component.ngOnChanges(changes);
    expect(component.redrawPlot).toHaveBeenCalled();
    expect(component.parseData).not.toHaveBeenCalled();
  });

  it('should call the right functions on pmzMax changes', () => {
    spyOn(component, 'parseData');
    spyOn(component, 'redrawPlot');
    component.spectrum = '100:12 121:100 150:40';
    component.plot = ''; // making plot any object that is not undefined
    let changes: SimpleChanges;
    let spectrum: SimpleChange;
    spectrum = {
      currentValue: '100:12 121:100 150:40',
      firstChange: true,
      previousValue: undefined,
      isFirstChange: () => {
        return true;
      }
    }
    changes = {
      spectrum: spectrum
    }
    component.ngOnChanges(changes);
    expect(component.redrawPlot).toHaveBeenCalled();
    expect(component.parseData).toHaveBeenCalled();
  });
});
