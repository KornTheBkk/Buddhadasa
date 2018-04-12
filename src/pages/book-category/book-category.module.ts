import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BookCategoryPage } from './book-category';

@NgModule({
  declarations: [
    BookCategoryPage,
  ],
  imports: [
    IonicPageModule.forChild(BookCategoryPage),
  ],
})
export class BookCategoryPageModule {}
