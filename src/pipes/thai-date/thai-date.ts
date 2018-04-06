import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the ThaiDatePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'thaiDate',
})
export class ThaiDatePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, ...args) {

    let date = value.split(' ')[0];
    let ymd = date.split('-');
    
    return `${ymd[2]}/${ymd[1]}/${parseInt(ymd[0]) + 543}`;
  }
}
