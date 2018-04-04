import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';

import { Media, MediaObject } from '@ionic-native/media';
import { BackgroundMode } from '@ionic-native/background-mode';

import { Observable } from 'rxjs/rx';
import { Subscription } from "rxjs/Subscription";

import { ISound } from './../../interface/sound';
import { SearchPage } from '../search/search';

@Component({
  selector: 'page-sound-listen',
  templateUrl: 'sound-listen.html',
})
export class SoundListenPage {

  sound: ISound;

  file: MediaObject;
  audio: any;
  isLoading: boolean = false;

  filename: string;
  isPlaying: boolean = false;
  duration: number = 0;
  currentPosition: number = -1;
  tempPosition: number = 1; // สำหรับเก็บ currentPosition ไว้เพื่อเช็ค position ซ้ำ ถ้าซ้ำแสดงว่ากำหลังโหลดอยู่ จะให้ขึ้น loading
  obsPosition: Subscription;
  seekPosition: number;

  skipStep: number = 60;
  messageAlert: string = null;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    private media: Media,
    private backgroundMode: BackgroundMode) {

    

    this.audio = navParams.data;
    this.filename = this.audio.mp3_file;
    console.log(this.audio.mp3_file);
    
  }

  ionViewWillEnter(){
    this.platform.ready().then(() => {
      this.initializeMedia();
    });
  }

  ionViewWillLeave() {
    this.file.release();
    this.stop();
  }

  search() {
    this.navCtrl.push(SearchPage);
  }

  initializeMedia() {

    this.backgroundMode.enable();
    this.file = this.media.create(this.filename);
    this.play(); // set autoplay

    this.file.onError.subscribe(error => console.log('Error!', JSON.stringify(error)));

    this.file.onStatusUpdate.subscribe(status => {
      console.log('on status update: ' + status);
      //console.log('init duration: ' + this.duration);
    });
  }

  changeSeekTo() {
    if (this.seekPosition != this.currentPosition && this.currentPosition > 0) {
      this.file.seekTo(this.seekPosition * 1000);
      console.log('seek to: ' + this.seekPosition);
      this.currentPosition = this.seekPosition;
    }
  }

  play() {

    if (this.isPlaying) {
      this.pause();

    } else {

      if (!this.backgroundMode.isEnabled()) {
        this.backgroundMode.enable();
      }

      this.isLoading = true
      //this.messageAlert = "กำลังโหลดเสียง..."

      this.isPlaying = true;
      this.file.play();

      this.obsPosition = Observable.interval(1000).subscribe(() => {

        this.file.getCurrentPosition().then((position) => {

          position = Math.floor(position);

          //console.log(`isLoading: ${this.isLoading}, position: ${position}, tempPosition: ${this.tempPosition}`);

          if (position >= 1) {
            if (this.tempPosition == 1) { //ทำครั้งแรกครั้งเดียว
              this.isLoading = false;
            }
            //เช็คเมื่อ playing อยู่แล้วมีการโหลดจากเน็ต
            if (position >= 2 && (position == this.tempPosition) && !this.isLoading) {
              //console.log('loading present');
              this.isLoading = true;
              //this.messageAlert = "กำลังโหลดเสียง..."

            } else if (this.isLoading && position != this.tempPosition) {
              //console.log('loading dismiss');
              this.isLoading = false;
              this.messageAlert = null;
            }
          }

          if (this.isLoading) {
            console.log('refresh player');

            //refresh player: pause & play : ถ้าไม่ทำแบบนี้ เน็ตช้าๆ มันจะค้างและไม่เล่นต่อ
            this.refreshPlayer();
          }

          this.tempPosition = position;

          if (position >= 1 && (position == this.duration)) {
            this.currentPosition = 0;
            this.seekPosition = 0;
            this.isPlaying = false;
            this.isLoading = false;
            this.file.stop();
            this.obsPosition.unsubscribe();
            //this.file.play();

            console.log('stop then loop');

            //this.messageAlert = "กำลังโหลดเสียง..."
            //this.stop(); // ถ้าเอา comment ออก จะไม่เล่นต่อเนื่องเมื่อจบ
          } else {
            this.currentPosition = position;
            this.seekPosition = position;
          }

          if (this.duration <= 0) { // ทำครั้งแรกเท่านั้น หรือดึงข้อมูลมาแล้วอาจจะได้ -1
            this.duration = Math.floor(this.file.getDuration());
          }


          console.log('current position: ' + this.currentPosition);
        });

      });
    }
  }

  refreshPlayer() {
    if (this.isPlaying) {
      this.file.pause();
      this.file.play();
    }

  }

  pause() {
    if (this.isPlaying) {
      this.obsPosition.unsubscribe();
      this.isPlaying = false;
      this.file.pause();
      //console.log('playing: ' + this.playing);
    }
  }

  stop() {
    this.obsPosition.unsubscribe();
    // this.backgroundMode.disable();
    this.file.stop();
    this.currentPosition = 0;
    this.seekPosition = 0;
    this.isPlaying = false;
    this.isLoading = false;
    //console.log('playing: ' + this.playing);
  }

  skipForward() {
    let seekTo: number = this.currentPosition + this.skipStep;
    if (seekTo > this.duration) {
      seekTo = 0;
      this.seekPosition = 0;
    }
    this.file.seekTo(seekTo * 1000);
  }

  skipBackward() {
    let seekTo: number = this.currentPosition - this.skipStep;
    if (seekTo < 0) {
      seekTo = 0;
      this.seekPosition = 0;
    }
    this.file.seekTo(seekTo * 1000);
  }


}
