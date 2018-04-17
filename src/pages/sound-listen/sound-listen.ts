import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, Platform, LoadingController, Loading } from 'ionic-angular';

import { Media, MediaObject } from '@ionic-native/media';
import { BackgroundMode } from '@ionic-native/background-mode';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

import { Observable } from 'rxjs/rx';
import { Subscription } from "rxjs/Subscription";

import { ISound } from './../../interface/sound';
import { SearchPage } from '../search/search';
import { SoundProvider } from '../../providers/sound/sound';

@Component({
  selector: 'page-sound-listen',
  templateUrl: 'sound-listen.html',
})
export class SoundListenPage {

  sound: ISound;

  mediaObject: MediaObject;
  isPlaying: boolean = false;
  duration: number = 0;
  currentPosition: number = 0;
  subsPosition: Subscription;
  seekPosition: number;
  skipStep: number = 60;

  loadedProgress: number = 0;
  soundReady: boolean = false; // control by download 

  storagePath: string; // path for store file to local device
  fileUrl: string; // source file
  fileName: string; // file name on target related soundDownload mode in settings
  soundDownloaded: boolean; // every set value when onViewWillEnter
  tempSoundName: string = 'sound.mp3'; // set this name instead when soundDownloaded is false

  loader: Loading;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    private media: Media,
    private backgroundMode: BackgroundMode,
    private transfer: FileTransfer,
    private file: File,
    private loadingCtrl: LoadingController,
    private _zone: NgZone,
    public soundProvider: SoundProvider) {

    platform.ready().then(() => {

      this.backgroundMode.enable();

      if (this.platform.is('ios')) {
        this.storagePath = this.file.documentsDirectory;
      } else {
        this.storagePath = this.file.dataDirectory;
      }

      this.storagePath = this.storagePath + 'buddhadasa/sound/';

      this.sound = navParams.data;

      //this.fileUrl = 'http://sound.bia.or.th/administrator/biasound/1/1215120530020.mp3'; // for test
      this.fileUrl = this.sound.mp3_file; // source file
      this.fileName = this.sound.id + '.mp3'; // destination file name ; using for Check file exists

      this.loader = this.loadingCtrl.create();
    });

  }

  ionViewDidLoad(){
   //console.log('ionViewDidLoad SoundListenPage');
   
  }

  ionViewWillEnter() {
    this.platform.ready().then(() => {
      this.soundDownloaded = JSON.parse(localStorage.getItem('soundDownloaded'));
      this.initSound(this.fileUrl, this.fileName);
      this.soundProvider.updateView(this.sound.id).then(() => { });
    });
  }

  ionViewWillLeave() {
    this.mediaObject.release();
    this.stopSound();
  }

  search() {
    this.navCtrl.push(SearchPage);
  }

  changeSeekTo() {
    if (this.seekPosition != this.currentPosition && this.currentPosition > 0) {
      this.mediaObject.seekTo(this.seekPosition * 1000);
      //console.log('seek to: ' + this.seekPosition);
      this.currentPosition = this.seekPosition;
    }
  }

  stopSound() {
    this.subsPosition.unsubscribe();
    // this.backgroundMode.disable();
    this.mediaObject.stop();
    this.currentPosition = 0;
   // this.duration = -1;
    this.seekPosition = 0;
    this.isPlaying = false;
  }

  skipForward() {
    let seekTo: number = this.currentPosition + this.skipStep;
    if (seekTo > this.duration) {
      seekTo = 0;
      this.seekPosition = 0;
    }
    this.mediaObject.seekTo(seekTo * 1000);
  }

  skipBackward() {
    let seekTo: number = this.currentPosition - this.skipStep;
    if (seekTo < 0) {
      seekTo = 0;
      this.seekPosition = 0;
    }
    this.mediaObject.seekTo(seekTo * 1000);
  }

  initSound(fileUrl: string, fileName: string) {

    this.platform.ready().then(() => {

      let filePath = '';

      if (this.soundDownloaded) {

        let fileFound = false;
        filePath = this.storagePath + fileName;

        this.file.checkFile(this.storagePath, fileName)
          .then((res) => { // file exists do then, file not exists jump to do at catch block.

            //console.log('file found: ' + JSON.stringify(res));

            this.soundReady = true;
            fileFound = true; // ป้องกันการ donwload file ซ้ำใน catch; ถ้ามี error ต่อจากบรรทัดนี้ มันจะไปทำที่ catch ทันที

            this.mediaObject = this.media.create(filePath.replace(/^file:\/\//, ''));
            this.playSound();

          })
          .catch(error => {

            //console.log('file not found : ' + JSON.stringify(error));

            if (!fileFound) {
              this.downloadAndPlaySound(fileUrl, filePath);
            } // end if fileFound
          }); // end checkFile

      }else {

        filePath = this.storagePath + this.tempSoundName;
        this.downloadAndPlaySound(fileUrl, filePath);

        //console.log('soundDownloaded = false : new download file : ' + filePath);
      } // end if soundDownloaded

    });
  }

  downloadAndPlaySound(fileUrl: string, filePath: string) {

    this.loader.setContent(`<center>กำลังดาวน์โหลด<br>เสียง ${this.loadedProgress}%</center>`);
    this.loader.present();

    let transfer: FileTransferObject = this.transfer.create();

    transfer.download(fileUrl, filePath)
      .then(entry => {

        this.soundReady = true;

        this.mediaObject = this.media.create(filePath.replace(/^file:\/\//, ''));
        this.playSound();
        //console.log('download success : ' + url);

      })
      .catch(error => {

        console.log('download failed : ' + JSON.stringify(error));

      });

    transfer.onProgress((progressEvent) => {
      //console.log('on progress: ' + JSON.stringify(progressEvent));
      //this.loadedProgress = Math.round(progressEvent.loaded / progressEvent.total);
      this._zone.run(() => {
        this.loadedProgress = (progressEvent.lengthComputable) ? Math.floor(progressEvent.loaded / progressEvent.total * 100) : -1;
        //console.log('loadedProgress: ' + this.loadedProgress + '%');
        this.loader.setContent(`<center>กำลังดาวน์โหลด<br>เสียง ${this.loadedProgress}%</center>`);

        if (this.loadedProgress == 100) {
          this.loader.dismiss();
          this.loadedProgress = 0;
        }
      });
    });
  }

  playSound() {

    if (this.soundReady) {

      if (!this.isPlaying) {

        this.isPlaying = true;

        this.mediaObject.play();

        this.subsPosition = Observable.interval(1000).subscribe(() => {

          this.mediaObject.getCurrentPosition().then((position) => {

            this.currentPosition = Math.floor(position);
            //console.log('current position : ' + this.currentPosition);
            this.seekPosition = this.currentPosition;

            if (this.duration <= 0) {
              this.duration = Math.floor(this.mediaObject.getDuration());
            }

            if (this.currentPosition >= 1 && (this.currentPosition == this.duration)) {
              // this.subsPosition.unsubscribe();
              // this.currentPosition = 0;
              // this.seekPosition = 0;
              // this.isPlaying = false;
              this.stopSound();
            }

            if (this.currentPosition == -1) {
              this.stopSound();
            }
          });

        });

      } else {

        this.isPlaying = false;

        this.mediaObject.pause();
        this.subsPosition.unsubscribe();
      }
    }
  }

}
