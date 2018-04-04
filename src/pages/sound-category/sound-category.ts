import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Loading, Refresher } from 'ionic-angular';

import { ICategory } from '../../interface/category';

import { SoundProvider } from '../../providers/sound/sound';
import { SoundArchivePage } from './../sound-archive/sound-archive';
import { SearchPage } from '../search/search';

@Component({
  selector: 'page-sound-category',
  templateUrl: 'sound-category.html',
})
export class SoundCategoryPage {

  loader: Loading;

  category: ICategory;
  totalCategory: number = 0;
  subcategories: Array<ICategory> = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public soundProvider: SoundProvider) {

    this.loader = this.loadingCtrl.create({
      content: 'Loading'
    });

    this.getSubcategory();

  }

  ionViewDidLoad() {

  }

  search() {
    this.navCtrl.push(SearchPage);
  }

  getSubcategory() {
    this.loader.present();

    this.category = this.navParams.get('category');
    //console.log(this.category);
    this.soundProvider.getCategory(this.category.id)
      .then((res: any) => {
        this.loader.dismiss();
        //console.log(res);

        if (res.ok) {
          this.subcategories = []; //clear value
          let data: Array<ICategory> = res.data;
          this.totalCategory = res.data.length;
          //this.subcategories = res.data;
          data.forEach(c => { 
            this.subcategories.push({
              id: c.id,
              name: c.name
            });
          });
        }
       })
      .catch(error => { 
        this.loader.dismiss();
        console.log(error);
      });
  }

  getSoundArchive(subcategory: ICategory) {
    this.navCtrl.push(SoundArchivePage, subcategory);
  }

  doRefresh(refresher: Refresher) {

    this.soundProvider.getCategory(this.category.id)
      .then((res: any) => {
        refresher.complete();
        //console.log(data);

        if (res.ok) {
          this.subcategories = []; //clear value
          let data: Array<ICategory> = res.data;
          this.totalCategory = res.data.length;
          //this.subcategories = res.data;
          data.forEach(c => { 
            this.subcategories.push({
              id: c.id,
              name: c.name
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
