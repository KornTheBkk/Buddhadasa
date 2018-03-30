import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';

import { ICategory } from '../../interface/category';

import { SoundProvider } from '../../providers/sound/sound';
import { SoundArchivePage } from './../sound-archive/sound-archive';

@IonicPage()
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

  getSubcategory() {
    this.loader.present();

    this.category = this.navParams.get('category');
    //console.log(this.category);
    this.soundProvider.getCategory(this.category.id)
      .then((res: any) => {
        this.loader.dismiss();
        //console.log(res);

        if (res.ok) {
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

}
