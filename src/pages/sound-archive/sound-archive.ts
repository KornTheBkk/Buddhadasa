import { SoundListenPage } from './../sound-listen/sound-listen';
import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';

import { SoundProvider } from './../../providers/sound/sound';

import { ICategory } from './../../interface/category';
import { ISound } from '../../interface/sound';

@IonicPage()
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

  getSounds() {

    this.loader.present();

    this.subcategory = this.navParams.data;

    this.soundProvider.getSound(this.subcategory.id)
      .then((res: any) => {
        this.loader.dismiss();
        console.log(res);
        this.totalSound = res.total;
        //this.sounds = res.data;
        let data: Array<ISound> = res.data;
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

}
