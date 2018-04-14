import { IBook } from './../../interface/book';
import { Component } from '@angular/core';
import { NavController, App, Refresher, AlertController, Platform, LoadingController, Loading } from 'ionic-angular';

import { SearchPage } from '../search/search';

import { BookProvider } from './../../providers/book/book';
import { SoundProvider } from './../../providers/sound/sound';
import { ISound } from '../../interface/sound';
import { SoundListenPage } from '../sound-listen/sound-listen';
import { DocumentViewer } from '@ionic-native/document-viewer';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

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

  storagePath: string; // path for store file to local device


  constructor(
    public navCtrl: NavController,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    private document: DocumentViewer,
    private file: File,
    private transfer: FileTransfer,
    public soundProvider: SoundProvider,
    private app: App,
    private bookProvider: BookProvider,
    public alertCtrl: AlertController) {

    /* let currentTime = moment().unix();
    console.log(`currentTime : ${currentTime} | ${moment().format('YYYY-MM-DD HH:mm:ss')}`);      
    let tt = moment.unix(1523265057).format("DD/MM/YYYY HH:mm:ss")
    console.log(tt); */

    this.loader = this.loadingCtrl.create({
      content: 'Loading'
    });

    if (this.platform.is('ios')) {
      this.storagePath = this.file.documentsDirectory;
    } else {
      this.storagePath = this.file.dataDirectory;
    }

    console.log('storagePath: ' + this.storagePath);
    

    this.storagePath = this.storagePath + 'buddhadasa/book/';

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

      this.bookProvider.updateView(book.id).then(() => { });

      let fileName = book.id + '.pdf';
      this.downloadAndOpenPdf(book.pdf_file, fileName);

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

  downloadAndOpenPdf(fileUrl: string, fileName: string) {

    this.platform.ready().then(() => {

      this.loader.setContent(`กำลังดาวน์โหลดหนังสือ...`);


      let filePath = this.storagePath + fileName;

      this.file.checkFile(this.storagePath, fileName)
        .then(() => {

          //console.log('file found');

          this.document.viewDocument(filePath, 'application/pdf', {});

        })
        .catch(error => {

          this.loader.present();

          //console.log(JSON.stringify(error));

         // console.log('file not found');

          let transfer: FileTransferObject = this.transfer.create();

          transfer.download(fileUrl, filePath)
            .then(entry => {

              this.loader.dismiss();

              let url = entry.toURL();
              this.document.viewDocument(url, 'application/pdf', {});
            })
            .catch(error => {

              this.loader.dismiss();
              //console.log('File not found : ' + JSON.stringify(error));

              let alert = this.alertCtrl.create({
                title: 'Alert!',
                subTitle: 'ไม่พบไฟล์หนังสือเล่มนี้จากฐานข้อมูล',
                buttons: ['OK']
              });
              alert.present();

            });

        });

    });
  }
}
