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

  //config pagination
  page: number = 1;
  totalPage: number = 0;

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
          let data: Array<ICategory> = res.data.data;
          this.totalCategory = data.length;
          //this.subcategories = res.data;
          let category = [];

          data.forEach(c => {
            //category[c.id];
          
            this.soundProvider.getTotalSound(c.id)
              .then((res: any) => { 

                let totalSound = 0;
                if (res.ok) {
                  totalSound = res.total;
                }

                this.subcategories.push({
                  id: c.id,
                  name: c.name,
                  order: c.order,
                  totalSound: totalSound
                });
              })
              .catch(error => { 
                console.log(JSON.stringify(error));

                this.subcategories.push({
                  id: c.id,
                  name: c.name,
                  order: c.order,
                  totalSound: 0
                });
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
          let data: Array<ICategory> = res.data.data;
          this.totalCategory = data.length;
          //this.subcategories = res.data;
          data.forEach(c => {
            
            this.soundProvider.getTotalSound(c.id)
              .then((res: any) => { 

                let totalSound = 0;
                if (res.ok) {
                  totalSound = res.total;
                }

                this.subcategories.push({
                  id: c.id,
                  name: c.name,
                  order: c.order,
                  totalSound: totalSound
                });
              })
              .catch(error => { 
                console.log(JSON.stringify(error));

                this.subcategories.push({
                  id: c.id,
                  name: c.name,
                  order: c.order,
                  totalSound: 0
                });
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
    let nextPage = this.page + 1;

    setTimeout(() => {

      this.soundProvider.getCategory(0, nextPage)
        .then((res: any) => {

          if (res.ok) {
            //this.sounds = res.data;
            let data: Array<ICategory> = res.data.data;
            data.forEach(c => {
              
              this.soundProvider.getTotalSound(c.id)
              .then((res: any) => { 

                let totalSound = 0;
                if (res.ok) {
                  totalSound = res.total;
                }

                this.subcategories.push({
                  id: c.id,
                  name: c.name,
                  order: c.order,
                  totalSound: totalSound
                });
              })
              .catch(error => { 
                console.log(JSON.stringify(error));

                this.subcategories.push({
                  id: c.id,
                  name: c.name,
                  order: c.order,
                  totalSound: 0
                });
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
