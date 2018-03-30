import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SoundCategoryPage } from './sound-category';

@NgModule({
  declarations: [
    SoundCategoryPage,
  ],
  imports: [
    IonicPageModule.forChild(SoundCategoryPage),
  ],
})
export class SoundCategoryPageModule {}
