import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SoundListenPage } from './sound-listen';

@NgModule({
  declarations: [
    SoundListenPage,
  ],
  imports: [
    IonicPageModule.forChild(SoundListenPage),
  ],
})
export class SoundListenPageModule {}
