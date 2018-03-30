import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SoundArchivePage } from './sound-archive';

@NgModule({
  declarations: [
    SoundArchivePage,
  ],
  imports: [
    IonicPageModule.forChild(SoundArchivePage),
  ],
})
export class SoundArchivePageModule {}
