import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BookProvider } from './../../providers/book/book';
import { IBook } from '../../interface/book';
import { BookSearchPage } from '../book-search/book-search';

@Component({
  selector: 'page-book-detail',
  templateUrl: 'book-detail.html',
})
export class BookDetailPage {

  book: IBook;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private bookProvider: BookProvider) {
    
    this.book = this.navParams.data;
    this.updateView(this.book.id);
  }

  ionViewDidLoad() {
  }

  search() {
    this.navCtrl.push(BookSearchPage);
  }

  updateView(bookId: number) {
    this.bookProvider.updateView(bookId)
      .then((res: any) => { 
        if (res.ok) {
          //console.log(JSON.stringify(res));
        } else {
          console.log(JSON.stringify(res.message));
        }
      })
      .catch(error => { 
        console.log(JSON.stringify(error));
      });
  }

}
