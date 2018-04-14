import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { SearchPage } from '../search/search';

@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {

  pushNotification: boolean = true;
  bookDownloaded: boolean = true;
  songDownloaded: boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform) {

    this.platform.ready().then(() => {

      let localPushNotification = localStorage.getItem('pushNotification');
      let localBookDownloaded = localStorage.getItem('bookDownloaded');
      let localSongDonwloaded = localStorage.getItem('songDownloaded');

      if (localBookDownloaded) {
        this.bookDownloaded = JSON.parse(localBookDownloaded);
      } else {
        localStorage.setItem('bookDownloaded', 'true');
      }

      if (localSongDonwloaded) {
        this.songDownloaded = JSON.parse(localSongDonwloaded);
      } else {
        localStorage.setItem('songDownloaded', 'true');
      }

      if (localPushNotification) {
        this.pushNotification = JSON.parse(localPushNotification);
      } else {
        localStorage.setItem('pushNotification', 'true');
      }


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
