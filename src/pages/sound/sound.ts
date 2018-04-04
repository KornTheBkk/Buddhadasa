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
  categoryNum: number;

  loader: Loading;

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
    console.log('ionViewDidLoad SoundPage');
    
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
          let data: Array<ICategory> = res.data;

          this.categoryNum = res.data.length;

          data.forEach(c => {
            this.categories.push({
              id: c.id,
              name: c.name,
              description: c.description,
              parent_id: c.parent_id
            });
          });
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
          let data: Array<ICategory> = res.data;

          this.categoryNum = res.data.length;

          data.forEach(c => {
            this.categories.push({
              id: c.id,
              name: c.name,
              description: c.description,
              parent_id: c.parent_id
            });
          });
        }

      })
      .catch(error => {
        refresher.complete();
        console.log(JSON.stringify(error));
      });
    
  }

}
