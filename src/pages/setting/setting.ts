import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';

import { File } from '@ionic-native/file';

@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {

  pushNotification: boolean;
  bookDownloaded: boolean;
  soundDownloaded: boolean;

  path: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private platform: Platform,
    private file: File) {

    this.platform.ready().then(() => {

      this.pushNotification = JSON.parse(localStorage.getItem('pushNotification'));
      this.bookDownloaded = JSON.parse(localStorage.getItem('bookDownloaded'));
      this.soundDownloaded = JSON.parse(localStorage.getItem('soundDownloaded'));

      if (this.platform.is('ios')) {
        this.path = this.file.documentsDirectory;
      } else {
        this.path = this.file.dataDirectory;
      }

      this.path = this.path + '/buddhadasa';

    });
  }

  ionViewDidLoad() {
  }

  updateSetting(name: string) {

    if (name == 'push') {
      localStorage.setItem('pushNotification', this.pushNotification.toString());

    } else if (name == 'book') {
      localStorage.setItem('bookDownloaded', this.bookDownloaded.toString());

      if (!this.bookDownloaded) {
        this.removeDir('book');
      }

    } else if (name == 'sound') {
      localStorage.setItem('soundDownloaded', this.soundDownloaded.toString());

      if (!this.soundDownloaded) {
        this.removeDir('sound');
      }
    }
  }

  removeDir(dirName: string) {

    this.file.removeRecursively(this.path, dirName)
      .then(removeResult => {
        console.log('removeDir: ' + JSON.stringify(removeResult));
      })
      .catch(error => {
        console.log('removeDir error: ' + JSON.stringify(error));
      });
  }


}
