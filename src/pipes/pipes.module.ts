import { NgModule } from '@angular/core';
import { TimeSecToMinPipe } from './time-sec-to-min/time-sec-to-min';
import { ThaiDatePipe } from './thai-date/thai-date';
@NgModule({
	declarations: [TimeSecToMinPipe,
    ThaiDatePipe],
	imports: [],
	exports: [TimeSecToMinPipe,
    ThaiDatePipe]
})
export class PipesModule {}
