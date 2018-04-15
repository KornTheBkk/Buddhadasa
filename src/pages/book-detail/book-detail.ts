import { Component } from '@angular/core';
import { NavController, NavParams, Loading, LoadingController, Platform, AlertController } from 'ionic-angular';
import { BookProvider } from './../../providers/book/book';
import { IBook } from '../../interface/book';
import { BookSearchPage } from '../book-search/book-search';

import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { DocumentViewer } from '@ionic-native/document-viewer';

@Component({
  selector: 'page-book-detail',
  templateUrl: 'book-detail.html',
})
export class BookDetailPage {

  book: IBook;

  loader: Loading;

  storagePath: string; // path for store file to local device

  bookDownloaded: boolean; // every set value when onViewWillEnter
  tempBookName: string = 'book.pdf'; // set this name when bookDownloaded is false

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    private document: DocumentViewer,
    private file: File,
    private transfer: FileTransfer,
    public alertCtrl: AlertController,
    private bookProvider: BookProvider) {

    platform.ready().then(() => {

      this.loader = this.loadingCtrl.create({
        content: 'Loading'
      });

      if (this.platform.is('ios')) {
        this.storagePath = this.file.documentsDirectory;
      } else {
        this.storagePath = this.file.dataDirectory;
      }

      this.storagePath = this.storagePath + 'buddhadasa/book/';

      this.book = this.navParams.data;

    });
  }

  ionViewDidLoad() {
  }

  ionViewWillEnter() {
    this.platform.ready().then(() => {
      this.bookDownloaded = JSON.parse(localStorage.getItem('bookDownloaded'));
    });
  }

  search() {
    this.navCtrl.push(BookSearchPage);
  }

  updateView(bookId: number) {
    this.bookProvider.updateView(bookId)
      .then((res: any) => {
        if (res.ok) {
          //console.log(JSON.stringify(res));
        } else {
          console.log(JSON.stringify(res.message));
        }
      })
      .catch(error => {
        console.log(JSON.stringify(error));
      });
  }

  read() {
    if (this.book.pdf_file) {
      this.updateView(this.book.id);
      let fileName = this.book.id + '.pdf';
      this.downloadAndOpenPdf(this.book.pdf_file, fileName);
    }
  }

  downloadAndOpenPdf(fileUrl: string, fileName: string) {

    this.platform.ready().then(() => {

      this.loader.setContent(`กำลังดาวน์โหลดหนังสือ...`);

      let filePath: string;

      if (this.bookDownloaded) {

        filePath = this.storagePath + fileName;

        this.file.checkFile(this.storagePath, fileName)
          .then(() => {

            console.log('bookDownloaded = true : file found');
            this.document.viewDocument(filePath, 'application/pdf', {});

          })
          .catch(error => {

            console.log('bookDownloaded = true : file not found : ' + filePath);
            this.openPdf(fileUrl, filePath);
            //console.log(JSON.stringify(error));

          });

      } else {


        filePath = this.storagePath + this.tempBookName;
        this.openPdf(fileUrl, filePath);

        console.log('bookDownloaded = false : new download file : ' + filePath);
      } // end if bookDonwloaded



    });
  }

  openPdf(fileUrl: string, filePath: string) {

    this.loader.present();

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
  }

}
