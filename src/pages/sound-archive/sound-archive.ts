import { SoundListenPage } from './../sound-listen/sound-listen';
import { Component, Inject } from '@angular/core';
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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public soundProvider: SoundProvider,
    @Inject('API_ASSETS') public apiAssets: string) {

    this.loader = this.loadingCtrl.create({
      content: 'Loading'
    });

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
              mp3_file: `${this.apiAssets}/${s.mp3_file}`
              //mp3_file: 'http://sound.bia.or.th/administrator/biasound/6/6155320219020.mp3'
            };
            this.sounds.push(sound);
          });
        } else {
          console.log('Retieve data failed');
        }

      })
      .catch(error => {
        this.loader.dismiss();
        console.log(error)
      });
  }

  getSound(sound: ISound) {
    //console.log(sound);
    this.navCtrl.push(SoundListenPage, sound);
  }

  doRefresh(refresher: Refresher) {

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
              mp3_file: `${this.apiAssets}/${s.mp3_file}`
            };
            this.sounds.push(sound);
          });
        } else {
          console.log('Retieve data failed');
        }

      })
      .catch(error => {
        refresher.complete();
        console.log(JSON.stringify(error));
      });
  }

}
