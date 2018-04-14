import { Component } from '@angular/core';
import { NavController, NavParams, Loading, LoadingController, Refresher, Platform, AlertController } from 'ionic-angular';

import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { DocumentViewer } from '@ionic-native/document-viewer';

import { IBookCategory } from '../../interface/book-category';

import { BookProvider } from './../../providers/book/book';
import { IBook } from '../../interface/book';
import { BookSearchPage } from '../book-search/book-search';

@Component({
  selector: 'page-book-category',
  templateUrl: 'book-category.html',
})
export class BookCategoryPage {

  loader: Loading;

  category: IBookCategory;
  totalBook: number;
  books: Array<IBook> = [];

  //config pagination
  pageSize: number = 10;
  page: number = 1;
  totalPage: number = 0;
  nextPageUrl: string;

  isLoadingMore: boolean = false; // lock to do infinite when processing

  storagePath: string; // path for store file to local device

  bookDownloaded: boolean;
  tempBookName: string = 'book.pdf'; // set this name when bookDownloaded is false

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    private bookProvider: BookProvider,
    private document: DocumentViewer,
    private file: File,
    private transfer: FileTransfer,
    public alertCtrl: AlertController) {

    platform.ready().then(() => {

      this.loader = this.loadingCtrl.create({
        content: 'Loading'
      });

      this.category = navParams.data;

      if (this.platform.is('ios')) {
        this.storagePath = this.file.documentsDirectory;
      } else {
        this.storagePath = this.file.dataDirectory;
      }

      this.storagePath = this.storagePath + 'buddhadasa/book/';

    });
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad BookCategoryPage');
    this.getBooks();
  }

  ionViewWillEnter() {
    
    this.platform.ready().then(() => {
      this.bookDownloaded = JSON.parse(localStorage.getItem('bookDownloaded'));
    });
  }

  search() {
    this.navCtrl.push(BookSearchPage);
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

  getBooks() {

    this.loader.present();

    this.bookProvider.getBooks(this.category.id, 1, this.pageSize)
      .then((res: any) => {
        this.loader.dismiss();
        //console.log(res);

        if (res.ok) {
          this.books = [];
          //this.totalBook = res.total;
          //this.sounds = res.data;
          let data: Array<IBook> = res.data.data;
          this.books = this.bookProvider.bookMapping(data);

          this.page = res.data.current_page;
          this.totalPage = res.data.last_page;
          this.totalBook = res.data.total;

        } else {
          console.log('Retieve data failed');
        }

      })
      .catch(error => {
        this.loader.dismiss();
        console.log(error)
      });
  }

  doInfinite(infiniteScroll) {

    if (!this.isLoadingMore) {
      let nextPage = this.page + 1;
      this.isLoadingMore = true;

      setTimeout(() => {

        this.bookProvider.getBooks(this.category.id, nextPage, this.pageSize)
          .then((res: any) => {
            //console.log(res);

            this.isLoadingMore = false;

            if (res.ok) {
              //this.sounds = res.data;
              let data: Array<IBook> = res.data.data;

              this.books = [...this.books, ...this.bookProvider.bookMapping(data)];

              this.page = res.data.current_page;
              this.totalPage = res.data.last_page;
              this.totalBook = res.data.total;

            } else {
              console.log('Retieve data failed');
            }

          })
          .catch(error => {
            console.log(JSON.stringify(error));
          });

        infiniteScroll.complete();
      }, 1000);
    }
  }


  doRefresh(refresher: Refresher) {

    this.bookProvider.getBooks(this.category.id, 1, this.pageSize)
      .then((res: any) => {
        refresher.complete();
        //console.log(data);

        if (res.ok) {

          this.books = [];
          //this.totalBook = res.total;
          //this.sounds = res.data;
          let data: Array<IBook> = res.data.data;
          this.books = this.bookProvider.bookMapping(data);

          this.page = res.data.current_page;
          this.totalPage = res.data.last_page;
          this.totalBook = res.data.total;
        }

      })
      .catch(error => {
        refresher.complete();
        console.log(JSON.stringify(error));
      });
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

  private openPdf(fileUrl: string, filePath: string) {

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
