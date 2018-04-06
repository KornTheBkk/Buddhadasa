import { Component, Inject } from '@angular/core';
import { NavController, App, Refresher } from 'ionic-angular';

import { SearchPage } from '../search/search';

import { SoundProvider } from './../../providers/sound/sound';
import { ISound } from '../../interface/sound';
import { SoundListenPage } from '../sound-listen/sound-listen';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  sounds: Array<ISound> = [];
  soundsTotal: number = 5;

  constructor(
    public navCtrl: NavController,
    public soundProvider: SoundProvider,
    private app: App,
    @Inject('API_ASSETS') public apiAssets: string) {

  }

  ionViewDidLoad() {
    this.getRecommendedSound();
  }

  search() {
    this.navCtrl.push(SearchPage);
  }

  getRecommendedSound() {

    this.soundProvider.getSound(null, null, this.soundsTotal)
      .then((res: any) => {
       // console.log(res);
        if (res.ok) {
          let data: Array<ISound> = res.data.data;
          data.forEach(s => {
            let sound = {
              id: s.id,
              sound_category_id: s.sound_category_id,
              title: s.title,
              subtitle: s.subtitle,
              showed_at: s.showed_at,
              duration: s.duration,
              mp3_file: s.mp3_file ? `${this.apiAssets}/${s.mp3_file}` : null,
            };
            this.sounds.push(sound);
          });
        }
      })
      .catch(error => {
        console.log(JSON.stringify(error));
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

  navigateToListenPage() {
    this.app.getRootNav().getActiveChildNav().select(1);
  }

  doRefresh(refresher: Refresher) {
    //console.log('do refresh');

    this.soundProvider.getSound(null, null, this.soundsTotal)
      .then((res: any) => {
        refresher.complete();
       // console.log(res);
        
        if (res.ok) {
          this.sounds = [];

          let data: Array<ISound> = res.data.data;
          data.forEach(s => {
            let sound = {
              id: s.id,
              sound_category_id: s.sound_category_id,
              title: s.title,
              subtitle: s.subtitle,
              showed_at: s.showed_at,
              duration: s.duration,
              mp3_file: s.mp3_file ? `${this.apiAssets}/${s.mp3_file}` : null,
            };
            this.sounds.push(sound);
          });
        }
      })
      .catch(error => {
        refresher.complete();
        console.log(JSON.stringify(error));
      });
  }


}
