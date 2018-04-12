import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { IBookCategory } from '../../interface/book-category';


@IonicPage()
@Component({
  selector: 'page-book-category',
  templateUrl: 'book-category.html',
})
export class BookCategoryPage {

  category: IBookCategory;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.category = navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BookCategoryPage');
  }

}
