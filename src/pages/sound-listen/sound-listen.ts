import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ISound } from './../../interface/sound';

@IonicPage()
@Component({
  selector: 'page-sound-listen',
  templateUrl: 'sound-listen.html',
})
export class SoundListenPage {

  sound: ISound;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.detail();
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad SoundListenPage');
  }

  detail() {
    this.sound = this.navParams.data;
    console.log(this.sound);
    
  }

}
