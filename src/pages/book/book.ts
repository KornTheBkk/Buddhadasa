import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SearchPage } from '../search/search';

@Component({
  selector: 'page-book',
  templateUrl: 'book.html',
})
export class BookPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BookPage');
  }

  search() {
    this.navCtrl.push(SearchPage);
  }
}
