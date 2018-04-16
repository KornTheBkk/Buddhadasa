import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Loading, Refresher } from 'ionic-angular';

// Interface
import { ICategory } from '../../interface/category';

import { SoundProvider } from '../../providers/sound/sound';
import { SoundCategoryPage } from '../sound-category/sound-category';
import { SearchPage } from '../search/search';

@Component({
  selector: 'page-sound',
  templateUrl: 'sound.html',
})
export class SoundPage {

  categories: Array<ICategory> = [];
  totalCategory: number;

  //config pagination
  page: number = 1;
  totalPage: number = 0;

  loader: Loading;

  isLoadingMore: boolean = false;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public soundProvider: SoundProvider) {

    this.loader = this.loadingCtrl.create({
      content: 'Loading'
    });
  }

  ionViewDidLoad() {
    this.getCategory();
  }

  ionViewWillEnter() {

  }

  search() {
    this.navCtrl.push(SearchPage);
  }

  getCategory() {

    this.loader.present();

    this.soundProvider.getCategory(0)
      .then((res: any) => {
        //console.log(data);
        this.loader.dismiss();

        if (res.ok) {
          this.categories = []; //clear value
          let data: Array<ICategory> = res.data.data;

          this.totalCategory = data.length;

          data.forEach(c => {
            this.categories.push({
              id: c.id,
              name: c.name,
              description: c.description,
              parent_id: c.parent_id
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

  selectedCategory(category: ICategory) {
    this.navCtrl.push(SoundCategoryPage, { category })
  }

  doRefresh(refresher: Refresher) {

    this.soundProvider.getCategory(0)
      .then((res: any) => {
        refresher.complete();
        //console.log(data);

        if (res.ok) {
          this.categories = []; //clear value
          let data: Array<ICategory> = res.data.data;

          this.totalCategory = res.data.length;

          data.forEach(c => {
            this.categories.push({
              id: c.id,
              name: c.name,
              description: c.description,
              parent_id: c.parent_id
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

  doInfinite(infiniteScroll) {

    if (!this.isLoadingMore) {
      let nextPage = this.page + 1;
      this.isLoadingMore = true;

      setTimeout(() => {

        this.soundProvider.getCategory(0, nextPage)
          .then((res: any) => {

            this.isLoadingMore = false;

            if (res.ok) {
              //this.sounds = res.data;
              let data: Array<ICategory> = res.data.data;
              data.forEach(c => {
                this.categories.push({
                  id: c.id,
                  name: c.name,
                  description: c.description,
                  parent_id: c.parent_id
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

}
