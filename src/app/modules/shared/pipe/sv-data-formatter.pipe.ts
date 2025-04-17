import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'svDataFormatter',
  standalone: true
})
export class SvDataFormatterPipe implements PipeTransform {

  transform(value: any, type: any): any {
    let modifiedData;
    switch (type) {
      case 'range-navigator':
        modifiedData = this.setRangeNavigatorData(value);
        break;

      //ADD other cases here

      default:
        break;
    }

    return modifiedData;
  }

  //#region Helper functions

  setRangeNavigatorData(data: any[]) {
    let rangeNavModifiedData:any[] = [];

    if (data && data.length) {
      rangeNavModifiedData = data.map((range) => {
        return {arg: range['x'], value: range['y']};
      });
    }
    return rangeNavModifiedData;
  }

  //#endregion Helper functions

}
