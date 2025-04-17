import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roundDecimal',
  standalone: true
})
export class RoundDecimalPipe implements PipeTransform {

  transform(value: any, decimalPlace: any): any {
    try {
      if (decimalPlace && !isNaN(value)) {
        const tFormat = decimalPlace.split('-');
        switch (tFormat[0]) {
          case '0':
            value = parseFloat(value).toFixed(tFormat[1]);
            break;
          case '1':
            value = Math.ceil(value);
            break;
          case '2':
            value = Math.floor(value);
            break;
          default:
            value = parseFloat(value).toFixed(tFormat[1]);
            break;
        }
        return value;
      } else {
        return value;
      }
    } catch (e) {
      return value;
    }
  }

}
