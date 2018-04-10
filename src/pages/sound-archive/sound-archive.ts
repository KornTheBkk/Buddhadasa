import { SoundListenPage } from './../sound-listen/sound-listen';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Loading, Refresher } from 'ionic-angular';

import { SoundProvider } from './../../providers/sound/sound';

import { ICategory } from './../../interface/category';
import { ISound } from '../../interface/sound';
import { SearchPage } from '../search/search';

@Component({
  selector: 'page-sound-archive',
  templateUrl: 'sound-archive.html',
})
export class SoundArchivePage {

  loader: Loading;

  subcategory: ICategory;
  totalSound: number;
  sounds: Array<ISound> = [];

  //config pagination
  page: number = 1;
  totalPage: number = 0;
  nextPageUrl: string;

  isLoadingMore: boolean = false; // lock to do infinite when processing

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public soundProvider: SoundProvider) {

    this.loader = this.loadingCtrl.create({
      content: 'Loading'
    });

    //this.subcategory = { name: '' };    
    this.getSounds();
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad SoundArchivePage');
  }

  search() {
    this.navCtrl.push(SearchPage);
  }

  getSounds() {

    this.loader.present();

    this.subcategory = this.navParams.data;

    this.soundProvider.getSound(this.subcategory.id)
      .then((res: any) => {
        this.loader.dismiss();
        //console.log(res);

        if (res.ok) {
          this.sounds = [];
          this.totalSound = res.total;
          //this.sounds = res.data;
          let data: Array<ISound> = res.data.data;
          data.forEach(s => {
            let sound = {
              id: s.id,
              sound_category_id: s.sound_category_id,
              title: s.title,
              subtitle: s.subtitle,
              showed_at: s.showed_at,
              duration: s.duration,
              mp3_file: s.mp3_file
              //mp3_file: 'http://sound.bia.or.th/administrator/biasound/6/6155320219020.mp3'
            };
            this.sounds.push(sound);
          });

          this.page = res.data.current_page;
          this.totalPage = res.data.last_page;
          this.totalSound = res.data.total;

        } else {
          console.log('Retieve data failed');
        }

      })
      .catch(error => {
        this.loader.dismiss();
        console.log(error)
      });
  }

  navigateToListen(sound: ISound) {
    //console.log(sound);
    if (sound.mp3_file) {
      this.navCtrl.push(SoundListenPage, sound);
    } else {
      console.log('Can\'t navigate to listen.');
    }
  }

  doRefresh(refresher: Refresher) {
    //console.log('do refresh');

    this.soundProvider.getSound(this.subcategory.id)
      .then((res: any) => {
        //console.log(res);
        refresher.complete();

        if (res.ok) {
          this.sounds = [];
          this.totalSound = res.total;
          //this.sounds = res.data;
          let data: Array<ISound> = res.data.data;
          data.forEach(s => {
            let sound = {
              id: s.id,
              sound_category_id: s.sound_category_id,
              title: s.title,
              subtitle: s.subtitle,
              showed_at: s.showed_at,
              duration: s.duration,
              mp3_file: s.mp3_file
            };
            this.sounds.push(sound);
          });

          this.page = res.data.current_page;
          this.totalPage = res.data.last_page;
          this.totalSound = res.data.total;

        } else {
          console.log('Retieve data failed');
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

        this.soundProvider.getSound(this.subcategory.id, nextPage)
          .then((res: any) => {
            this.isLoadingMore = false;

            if (res.ok) {
              this.totalSound = res.total;
              //this.sounds = res.data;
              let data: Array<ISound> = res.data.data;
              data.forEach(s => {
                let sound = {
                  id: s.id,
                  sound_category_id: s.sound_category_id,
                  title: s.title,
                  subtitle: s.subtitle,
                  showed_at: s.showed_at,
                  duration: s.duration,
                  mp3_file: s.mp3_file
                };
                this.sounds.push(sound);
              });

              this.page = res.data.current_page;
              this.totalPage = res.data.last_page;
              this.totalSound = res.data.total;
              //console.log(`${this.page} < ${this.totalPage}`);

            } else {
              console.log('Retieve data failed');
            }

          })
          .catch(error => {
            this.isLoadingMore = false;
            console.log(JSON.stringify(error));
          });

        infiniteScroll.complete();
      }, 1000);

    }
  }

}
