import { SoundPage } from './../../pages/sound/sound';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';


@Component({
  selector: 'header',
  templateUrl: 'header.html'
})
export class HeaderComponent {

  text: string;

  constructor(public navCtrl: NavController) {
    console.log('Hello HeaderComponent Component');
    this.text = 'Hello World';
  }

  navigateToSound(){
    this.navCtrl.push(SoundPage);
  }

}
