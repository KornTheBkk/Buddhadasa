import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { SearchPage } from '../search/search';

@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {

  pushNotification: boolean;
  bookDownloaded: boolean;
  songDownloaded: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform) {

    this.platform.ready().then(() => {

      this.pushNotification = JSON.parse(localStorage.getItem('pushNotification'));
      this.bookDownloaded = JSON.parse(localStorage.getItem('bookDownloaded'));
      this.songDownloaded = JSON.parse(localStorage.getItem('songDownloaded'));

    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingPage');
  }

  search() {
    this.navCtrl.push(SearchPage);
  }

  updateSetting(name: string) {

    if (name == 'push') {
      localStorage.setItem('pushNotification', this.pushNotification.toString());
    } else if (name == 'book') {
      localStorage.setItem('bookDownloaded', this.bookDownloaded.toString());
    } else if (name == 'song') {
      localStorage.setItem('songDownloaded', this.songDownloaded.toString());
    }
  }


}
