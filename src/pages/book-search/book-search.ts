import { Component } from '@angular/core';
import { NavController, NavParams, Platform, Refresher } from 'ionic-angular';
import { BookProvider } from '../../providers/book/book';
import { IBook } from '../../interface/book';


@Component({
  selector: 'page-book-search',
  templateUrl: 'book-search.html',
})
export class BookSearchPage {


  shouldShowCancel: boolean = false;
  find: string = null;

  books: Array<IBook> = [];
  totalBook: number = 0;
  isLoading: boolean = false;

  //config pagination
  page: number = 1;
  totalPage: number = 0;
  pageSize: number = 10;

  isLoadingMore: boolean = false; // lock to do infinite when processing


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public bookProvider: BookProvider) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BookSearchPage');
  }

  onInput(event) {
    this.search();
  }

  onClear(event) {

  }

  resetValue() {
    this.page = 1;
    this.totalPage = 0;
    this.books = [];
    this.totalBook = 0;
    this.isLoading = false;
  }

  search() {

    this.books = [];

    if (this.find.trim()) {
      this.isLoading = true;

      this.bookProvider.search(this.find, 1, this.pageSize)
        .then((res: any) => {
          this.isLoading = false;
          //console.log((res));

          if (res.ok) {
            //this.items = res.data;
            //console.log(this.items);
            this.totalBook = res.total;
            //this.sounds = res.data;
            let data: Array<IBook> = res.data.data;

            this.books = this.bookProvider.bookMapping(data);
            //console.log(this.books);

            this.page = res.data.current_page;
            this.totalPage = res.data.last_page;
            this.totalBook = res.data.total;

          } else {
            console.log('Retrive data failed');
          }

        })
        .catch(error => {
          this.isLoading = false;
          console.log('Error: ' + JSON.stringify(error));
        });
    } else {
      //console.log('reset value');
      this.resetValue();
    }
  }

  doInfinite(infiniteScroll) {

    if (!this.isLoadingMore) {
      let nextPage = this.page + 1;
      this.isLoadingMore = true;

      setTimeout(() => {

        this.bookProvider.search(this.find, nextPage, this.pageSize)
          .then((res: any) => {
            //console.log(res);

            this.isLoadingMore = false;

            if (res.ok) {
              //this.sounds = res.data;
              let data: Array<IBook> = res.data.data;

              this.books = [...this.books, ...this.bookProvider.bookMapping(data)];

              this.page = res.data.current_page;
              this.totalPage = res.data.last_page;
              this.totalBook = res.data.total;

            } else {
              console.log('Retieve data failed');
            }

          })
          .catch(error => {
            console.log(JSON.stringify(error));
          });

        infiniteScroll.complete();
      }, 1000);
    }
  }

  doRefresh(refresher: Refresher) {

    this.bookProvider.search(this.find, 1, this.pageSize)
      .then((res: any) => {
        refresher.complete();
        //console.log('res: ' + JSON.stringify(res));

        if (res.ok) {

          this.books = [];
          //this.totalBook = res.total;
          //this.sounds = res.data;
          let data: Array<IBook> = res.data.data;
          this.books = this.bookProvider.bookMapping(data);

          this.page = res.data.current_page;
          this.totalPage = res.data.last_page;
          this.totalBook = res.data.total;
        }

      })
      .catch(error => {
        refresher.complete();
        console.log(JSON.stringify(error));
      });
  }

}