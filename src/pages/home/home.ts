import { IBook } from './../../interface/book';
import { Component } from '@angular/core';
import { NavController, App, Refresher, AlertController, Platform, LoadingController, Loading } from 'ionic-angular';

import { BookDetailPage } from './../book-detail/book-detail';

import { BookProvider } from './../../providers/book/book';
import { SoundProvider } from './../../providers/sound/sound';
import { BannerProvider } from '../../providers/banner/banner';

import { ISound } from '../../interface/sound';
import { SoundListenPage } from '../sound-listen/sound-listen';

//import * as moment from 'moment';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  loader: Loading;

  sounds: Array<ISound> = [];
  soundsTotal: number = 5;

  bookTotal: number = 5;
  books: Array<IBook> = [];

  banners: Array<{ image: string }> = [{ image: null }];
  bannerUrl: string;

  constructor(
    public navCtrl: NavController,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public soundProvider: SoundProvider,
    private app: App,
    private bookProvider: BookProvider,
    public alertCtrl: AlertController,
    private bannerProvider: BannerProvider) {

    this.loader = this.loadingCtrl.create({
      content: 'Loading'
    });
  }

  ionViewDidLoad() {
    this.getRecommendedSound();
    this.getRecommendedBook();
    this.getBanner();
  }

  ionViewWillEnter() {    
    let indexRandom = Math.floor((Math.random() * this.banners.length));    
    this.bannerUrl = this.banners[indexRandom].image;
  }

  getBanner() {
    this.bannerProvider.getBanner()
      .then((res: any) => {
        //console.log('getBanner ok');
        if (res.ok) {
          let data = res.data.data;          
          for (let i = 0; i < data.length; i++){
            this.banners[i] = data[i];
          }
          
          // fires once then it will fire in ionViewWillEnter
          let indexRandom = Math.floor((Math.random() * this.banners.length));
          this.bannerUrl = this.banners[indexRandom].image;
        }
      })
      .catch(error => {
        console.log('getBanner error: ' + JSON.stringify(error));
      });
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
              published_at: s.published_at,
              view: s.view,
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
    if (sound.mp3_file) {
      this.soundProvider.updateView(sound.id).then(() => { });
      this.navCtrl.push(SoundListenPage, sound);
    } else {
      console.log('No have mp3 file.');
    }
  }

  navigateToListenPage() {
    this.app.getRootNav().getActiveChildNav().select(1);
  }

  navigateToBookPage() {
    this.app.getRootNav().getActiveChildNav().select(2);
  }

  navigateToBookDetail(book: IBook) {
    if (book.pdf_file) {
      this.navCtrl.push(BookDetailPage, book);

    } else {

      let alert = this.alertCtrl.create({
        title: 'Alert!',
        subTitle: 'ไม่พบไฟล์หนังสือเล่มนี้จากฐานข้อมูล',
        buttons: ['OK']
      });
      alert.present();

    }
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
              published_at: s.published_at,
              showed_at: s.showed_at,
              view: s.view,
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
