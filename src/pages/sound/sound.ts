import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { SoundProvider } from '../../providers/sound/sound';

@IonicPage()
@Component({
  selector: 'page-sound',
  templateUrl: 'sound.html',
})
export class SoundPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public soundProvider: SoundProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SoundPage');
    
  }

  ionViewWillEnter(){
    this.getCategory();
  }

  getCategory() {
    this.soundProvider.getCategory(0)
      .then((data: any) => { 
        console.log(data);
      })
      .catch(error => { 
        console.log(error);
      });
  }

}
