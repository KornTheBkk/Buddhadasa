import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SoundPage } from './sound';

@NgModule({
  declarations: [
    SoundPage,
  ],
  imports: [
    IonicPageModule.forChild(SoundPage),
  ],
})
export class SoundPageModule {}
