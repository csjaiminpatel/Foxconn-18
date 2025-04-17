import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceText',
  standalone: true
})
export class ReplaceTextPipe implements PipeTransform {

  transform(value: any, replaceText: any, state: any[]): any {
    for (let i = 0; i < state.length; i++) {
      if (state[i] === value) {
        value = replaceText;
        break;
      }
    }
    return value;
  }

}
