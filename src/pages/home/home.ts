import { IBook } from './../../interface/book';
import { Component } from '@angular/core';
import { NavController, App, Refresher } from 'ionic-angular';

import { SearchPage } from '../search/search';

import { BookProvider } from './../../providers/book/book';
import { SoundProvider } from './../../providers/sound/sound';
import { ISound } from '../../interface/sound';
import { SoundListenPage } from '../sound-listen/sound-listen';

//import * as moment from 'moment';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  sounds: Array<ISound> = [];
  soundsTotal: number = 5;

  bookTotal: number = 5;
  books: Array<IBook> = [];

  constructor(
    public navCtrl: NavController,
    public soundProvider: SoundProvider,
    private app: App,
    private bookProvider: BookProvider) {

    /* let currentTime = moment().unix();
    console.log(`currentTime : ${currentTime} | ${moment().format('YYYY-MM-DD HH:mm:ss')}`);      
    let tt = moment.unix(1523265057).format("DD/MM/YYYY HH:mm:ss")
    console.log(tt); */

  }

  ionViewDidLoad() {
    this.getRecommendedSound();
    this.getRecommendedBook();
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
              description: s.description,
              showed_at: s.showed_at,
              duration: s.duration,
              mp3_file: s.mp3_file
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

  navigateToBookPage() {
    this.app.getRootNav().getActiveChildNav().select(2);
  }

  navigateToBookDetail(book: IBook) {

  }

  getRecommendedBook() {

    this.bookProvider.getBooks(null, null, this.soundsTotal)
      .then((res: any) => {
        // console.log(res);
        if (res.ok) {
          let data: Array<IBook> = res.data.data;
          this.books = this.bookProvider.bookMapping(data);
        }
      })
      .catch(error => {
        console.log(JSON.stringify(error));
      });
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
              description: s.description,
              showed_at: s.showed_at,
              duration: s.duration,
              mp3_file: s.mp3_file
            };
            this.sounds.push(sound);
          });
        }
      })
      .catch(error => {
        refresher.complete();
        console.log(JSON.stringify(error));
      });

    this.bookProvider.getBooks(null, null, this.soundsTotal)
      .then((res: any) => {
        // console.log(res);
        if (res.ok) {
          this.books = [];
          
          let data: Array<IBook> = res.data.data;
          this.books = this.bookProvider.bookMapping(data);
        }
      })
      .catch(error => {
        console.log(JSON.stringify(error));
      });
  }


}
