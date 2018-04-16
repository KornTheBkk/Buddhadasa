import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'thaiDate',
})
export class ThaiDatePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, relativeTime: boolean = false, showTime: boolean = false) {

    let res = null;

    if (!relativeTime) {
      let date = value.split(' ')[0];
      let ymd = date.split('-');
      let strTime = '';
      //console.log('incTime:  ' + incTime);

      if (showTime) {
        let t = value.split(' ')[1];
        strTime = ' ' + t.slice(0, 5); // 15:20:34
      }

      res = `${ymd[2]}/${ymd[1]}/${parseInt(ymd[0]) + 543}${strTime}`;
    } else {
      res = moment(value, "YYYY-MM-DD H:mm:ss").fromNow();
    }

    return res;
  }
}
