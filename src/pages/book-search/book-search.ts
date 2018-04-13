import { Component } from '@angular/core';
import { NavController, NavParams, Platform, Refresher, LoadingController, Loading, AlertController } from 'ionic-angular';

import { BookProvider } from '../../providers/book/book';

import { IBook } from '../../interface/book';

import { DocumentViewer } from '@ionic-native/document-viewer';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';


@Component({
  selector: 'page-book-search',
  templateUrl: 'book-search.html',
})
export class BookSearchPage {

  loader: Loading;

  shouldShowCancel: boolean = false;
  find: string = null;

  books: Array<IBook> = [];
  totalBook: number = 0;
  isLoading: boolean = false;

  //config pagination
  page: number = 1;
  totalPage: number = 0;
  pageSize: number = 10;

  isLoadingMore: boolean = false; // lock to do infinite when processing

  stragePath: string; // path for store file to local device


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public bookProvider: BookProvider,
    public loadingCtrl: LoadingController,
    private document: DocumentViewer,
    private file: File,
    private transfer: FileTransfer,
    public alertCtrl: AlertController) {

    this.loader = this.loadingCtrl.create({
      content: 'Loading'
    });


    if (this.platform.is('ios')) {
      this.stragePath = this.file.documentsDirectory;
    } else {
      this.stragePath = this.file.dataDirectory;
    }

    this.stragePath = this.stragePath + 'buddhadasa/book/';

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BookSearchPage');
  }

  onInput(event) {
    this.search();
  }

  onClear(event) {

  }

  resetValue() {
    this.page = 1;
    this.totalPage = 0;
    this.books = [];
    this.totalBook = 0;
    this.isLoading = false;
  }

  navigateToBookDetail(book: IBook) {
    if (book.pdf_file) {

      this.bookProvider.updateView(book.id).then(() => { });

      let fileName = book.id + '.pdf'; // name for store to local device storage.      
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

  search() {

    this.books = [];

    if (this.find.trim()) {
      this.isLoading = true;

      this.bookProvider.search(this.find, 1, this.pageSize)
        .then((res: any) => {
          this.isLoading = false;
          //console.log((res));

          if (res.ok) {
            //this.items = res.data;
            //console.log(this.items);
            this.totalBook = res.total;
            //this.sounds = res.data;
            let data: Array<IBook> = res.data.data;

            this.books = this.bookProvider.bookMapping(data);
            //console.log(this.books);

            this.page = res.data.current_page;
            this.totalPage = res.data.last_page;
            this.totalBook = res.data.total;

          } else {
            console.log('Retrive data failed');
          }

        })
        .catch(error => {
          this.isLoading = false;
          console.log('Error: ' + JSON.stringify(error));
        });
    } else {
      //console.log('reset value');
      this.resetValue();
    }
  }

  doInfinite(infiniteScroll) {

    if (!this.isLoadingMore) {
      let nextPage = this.page + 1;
      this.isLoadingMore = true;

      setTimeout(() => {

        this.bookProvider.search(this.find, nextPage, this.pageSize)
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

    this.bookProvider.search(this.find, 1, this.pageSize)
      .then((res: any) => {
        refresher.complete();
        //console.log('res: ' + JSON.stringify(res));

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


      let filePath = this.stragePath + fileName;

      this.file.checkFile(this.stragePath, fileName)
        .then(() => {

          //console.log('file found');

          this.document.viewDocument(filePath, 'application/pdf', {});

        })
        .catch(error => {

          this.loader.present();

          //console.log(JSON.stringify(error));

          //console.log('file not found');

          let transfer: FileTransferObject = this.transfer.create();

          transfer.download(fileUrl, filePath)
            .then(entry => {

              this.loader.dismiss();

              let url = entry.toURL();
              this.document.viewDocument(url, 'application/pdf', {});
            })
            .catch(error => {

              this.loader.dismiss();
              //console.log(JSON.stringify(error));

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