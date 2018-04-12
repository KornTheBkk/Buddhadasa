import { Component } from '@angular/core';
import { NavController, NavParams, Loading, LoadingController, Refresher } from 'ionic-angular';

import { IBookCategory } from '../../interface/book-category';

import { BookProvider } from './../../providers/book/book';
import { IBook } from '../../interface/book';

@Component({
  selector: 'page-book-category',
  templateUrl: 'book-category.html',
})
export class BookCategoryPage {

  loader: Loading;

  category: IBookCategory;
  totalBook: number;
  books: Array<IBook> = [];

  //config pagination
  pageSize: number = 10;
  page: number = 1;
  totalPage: number = 0;
  nextPageUrl: string;

  isLoadingMore: boolean = false; // lock to do infinite when processing


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private bookProvider: BookProvider) {

    this.loader = this.loadingCtrl.create({
      content: 'Loading'
    });

    this.category = navParams.data;
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad BookCategoryPage');
    this.getBooks();
  }

  readBook(book: IBook) {
    console.log(book.pdf_file);
    
  }

  getBooks() {

    this.loader.present();

    this.bookProvider.getBooks(this.category.id, 1, this.pageSize)
      .then((res: any) => {
        this.loader.dismiss();
        //console.log(res);

        if (res.ok) {
          this.books = [];
          //this.totalBook = res.total;
          //this.sounds = res.data;
          let data: Array<IBook> = res.data.data;
          data.forEach(s => {
            let book = {
              id: s.id,
              book_category_id: s.book_category_id,
              title: s.title,
              subtitle: s.subtitle,
              description: s.description,
              published_at: s.published_at,
              view: s.view,
              pdf_file: s.pdf_file,
              image: s.image,
              image_thumb: s.image_thumb ? s.image_thumb : null,
              image_thumb_square: s.image_thumb_square ? s.image_thumb_square : null
            };
            this.books.push(book);
          });

          this.page = res.data.current_page;
          this.totalPage = res.data.last_page;
          this.totalBook = res.data.total;

        } else {
          console.log('Retieve data failed');
        }

      })
      .catch(error => {
        this.loader.dismiss();
        console.log(error)
      });
  }

  doInfinite(infiniteScroll) {

    if (!this.isLoadingMore) {
      let nextPage = this.page + 1;
      this.isLoadingMore = true;

      setTimeout(() => {

        this.bookProvider.getBooks(this.category.id, nextPage, this.pageSize)
          .then((res: any) => {
            console.log(res);

            this.isLoadingMore = false;

            if (res.ok) {
              //this.sounds = res.data;
              let data: Array<IBook> = res.data.data;

              data.forEach(s => {
                let book = {
                  id: s.id,
                  book_category_id: s.book_category_id,
                  title: s.title,
                  subtitle: s.subtitle,
                  description: s.description,
                  published_at: s.published_at,
                  view: s.view,
                  pdf_file: s.pdf_file,
                  image: s.image,
                  image_thumb: s.image_thumb ? s.image_thumb : null,
                  image_thumb_square: s.image_thumb_square ? s.image_thumb_square : null
                };
                this.books.push(book);
              });

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

    this.bookProvider.getBooks(this.category.id, 1, this.pageSize)
      .then((res: any) => {
        refresher.complete();
        //console.log(data);

        if (res.ok) {

          this.books = [];
          //this.totalBook = res.total;
          //this.sounds = res.data;
          let data: Array<IBook> = res.data.data;
          data.forEach(s => {
            let book = {
              id: s.id,
              book_category_id: s.book_category_id,
              title: s.title,
              subtitle: s.subtitle,
              description: s.description,
              published_at: s.published_at,
              view: s.view,
              pdf_file: s.pdf_file,
              image: s.image,
              image_thumb: s.image_thumb ? s.image_thumb : null,
              image_thumb_square: s.image_thumb_square ? s.image_thumb_square : null
            };
            this.books.push(book);
          });

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
