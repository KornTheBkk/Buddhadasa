import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Loading, Refresher } from 'ionic-angular';

import { BookSearchPage } from './../book-search/book-search';
import { BookCategoryPage } from './../book-category/book-category';

import { BookProvider } from '../../providers/book/book';
import { IBookCategory } from '../../interface/book-category';

@Component({
  selector: 'page-book',
  templateUrl: 'book.html',
})
export class BookPage {

  loader: Loading;

  categories: Array<IBookCategory> = [];
  totalCategory: number;

  //config pagination
  page: number = 1;
  totalPage: number = 0;

  isLoadingMore: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private bookProvider: BookProvider) {

    this.loader = this.loadingCtrl.create({
      content: 'Loading'
    });
  }

  ionViewDidLoad() {
    this.getCategory();
  }

  search() {
    this.navCtrl.push(BookSearchPage);
  }

  navigateToDetail(category: IBookCategory) {
    this.navCtrl.push(BookCategoryPage, category);
  }

  getCategory() {
    this.loader.present();

    this.bookProvider.getCategory(0)
      .then((res: any) => {
        //console.log(res);
        this.loader.dismiss();

        if (res.ok) {

          this.categories = []; //clear value

          let data: Array<IBookCategory> = res.data.data;

          this.totalCategory = data.length;

          data.forEach(c => {
            this.categories.push({
              id: c.id,
              name: c.name,
              description: c.description,
              parent_id: c.parent_id,
              total_book: c.total_book
            });
          });

          this.page = res.data.current_page;
          this.totalPage = res.data.last_page;
          this.totalCategory = res.data.total;
        }

      })
      .catch(error => {
        this.loader.dismiss();
        console.log(error);
      });
  }

  doInfinite(infiniteScroll) {

    if (!this.isLoadingMore) {
      let nextPage = this.page + 1;
      this.isLoadingMore = true;

      setTimeout(() => {

        this.bookProvider.getCategory(0, nextPage)
          .then((res: any) => {

            this.isLoadingMore = false;

            if (res.ok) {
              //this.sounds = res.data;
              let data: Array<IBookCategory> = res.data.data;

              data.forEach(c => {
                this.categories.push({
                  id: c.id,
                  name: c.name,
                  description: c.description,
                  parent_id: c.parent_id,
                  total_book: c.total_book
                });
              });

              this.page = res.data.current_page;
              this.totalPage = res.data.last_page;
              this.totalCategory = res.data.total;

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

    this.bookProvider.getCategory(0)
      .then((res: any) => {
        refresher.complete();
        //console.log(data);

        if (res.ok) {

          this.categories = []; //clear value

          let data: Array<IBookCategory> = res.data.data;
          this.totalCategory = data.length;
          //this.subcategories = res.data;
          data.forEach(c => {
            this.categories.push({
              id: c.id,
              name: c.name,
              description: c.description,
              parent_id: c.parent_id,
              total_book: c.total_book
            });
          });

          this.page = res.data.current_page;
          this.totalPage = res.data.last_page;
          this.totalCategory = res.data.total;
        }

      })
      .catch(error => {
        refresher.complete();
        console.log(JSON.stringify(error));
      });
  }
}
