import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DxRangeSelectorComponent, DxRangeSelectorModule } from 'devextreme-angular';
import { AsSplitService } from '../../services/As-Split/as-split.service';
import { ChartsAxisLabelOverlap, LabelOverlap, TextOverflow } from 'devextreme/common/charts';

@Component({
  selector: 'orion-platform-range-navigator',
  standalone: true,
  imports: [DxRangeSelectorModule],
  templateUrl: './range-navigator.component.html',
  styleUrl: './range-navigator.component.scss'
})
export class RangeNavigatorComponent implements OnInit, AfterViewInit {
  @Input() rangeDataSource : object[] = [];
  @Input() value: number[] = [];
  @Input() windowID :any;
  @Output() selectedRange = new EventEmitter();
  redrawOnResizeValue : boolean = true;
  intervalType = 'number';
  interval = 1;
  labelFormat?: string;
  labelPosition?: 'Outside';
  type = 'Range';
  xName = 'x';
  yName = 'y';
  tooltip = {enable: false, displayMode: 'Always'};
  allowSnapping = true;
  overlappingBehavior: ChartsAxisLabelOverlap | LabelOverlap | TextOverflow = "none"; //Default value is 'hide' -- 'none' is for showing all range labels
 
  @ViewChild(DxRangeSelectorComponent, {static: false})
  dxRangeSelector?: DxRangeSelectorComponent;

  // navigatorStyleSettings = {
  //   thumb: {
  //     type: 'Rectangle'
  //   }
  // };

  constructor(private asSplitService: AsSplitService) {
    this.customizeText = this.customizeText.bind(this);
  }

  ngOnInit() {
    this.selectedRange.emit({start: this.value[0], end: this.value[1]});
  }
  ngAfterViewInit() {
    /*
    this.asSplitService.getSplitEvents().subscribe((data) => {
      this.reRenderDxRangeSelector();
    });
    this.asSplitService.getSideNavState().subscribe((data) => {
      this.reRenderDxRangeSelector();
    });
    */
    //this.reRenderDxRangeSelector(50);
  }

  onDrawn(event:any) {
    // this.reRenderDxRangeSelector();
  }
/*
  reRenderDxRangeSelector(timeOut = 500) {
    //resize bug--
    //https://js.devexpress.com/Documentation/21_1/Guide/Angular_Components/Component_Configuration_Syntax/#Call_Methods
    //https://js.devexpress.com/Documentation/21_1/ApiReference/UI_Components/dxRangeSelector/Methods/#render
    // if (!this.initialResize) {
    setTimeout(() => {
      if (this.dxRangeSelector && this.dxRangeSelector.instance) {
        this.dxRangeSelector.instance.render();

        const rangeTrackerRefList = document.getElementsByClassName('slider-tracker');
        if (rangeTrackerRefList && rangeTrackerRefList.length) {
          for (let i = 0; i < rangeTrackerRefList.length; i++) {
            rangeTrackerRefList[i]['style'].rx = '2';
            rangeTrackerRefList[i]['style'].ry = '2';
          }
        }
        //Customize slider handle here
      } else {
        console.log('dxRangeSelector not found!');
      }
    }, timeOut);
    // }
  }
*/
  customizeText(value :any) {
    if (value && value.value) {
      return value.value > 52 ? value.value - 52 : value.value;
    }
    return value.value;
  }

  //DEPRECATED -
  labelRender(args :any) {
    const {value} = args;
    args.text = `${value > 52 ? value - 52 : value}`;
  }

  changed(event:any) {
    if (event.value && event.value.length) {
      const start = Math.round(event.value[0]).toString();
      const end = Math.round(event.value[1]).toString();
      this.value = [Math.round(event.value[0]), Math.round(event.value[1])];
      this.selectedRange.emit({start: start, end: end});
    }
    // start = parseInt(start.toString());
    // end = parseInt(end.toString());
    // this.selectedRange.emit({ start: start, end: end });
  }
}
