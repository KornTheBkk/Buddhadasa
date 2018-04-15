import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Searchbar, Platform } from 'ionic-angular';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

import { SoundProvider } from '../../providers/sound/sound';
import { ISound } from '../../interface/sound';

import { SoundListenPage } from './../sound-listen/sound-listen';

import { SearchProvider } from './../../providers/search/search';

import * as moment from 'moment';


@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  @ViewChild('searchbar') searchbar: Searchbar;

  shouldShowCancel: boolean = false;
  find: string = null;

  items: Array<any> = [];
  totalItem: number = 0;
  isLoading: boolean = false;

  //config pagination
  page: number = 1;
  totalPage: number = 0;

  db: SQLiteObject = null;

  historyLog: Array<any> = [];
  isHistory: boolean = true; // begining let show history log
  pageLog: number = 1; // for log
  totalPageLog: number = 0; // for log

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public soundProvider: SoundProvider,
    private sqlite: SQLite,
    private searchProvider: SearchProvider) {

      this.platform.ready().then(() => {
        this.initSQLite();
      });
    
      this.searchProvider.setCategory('song');
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad SearchPage');
  }

  ionViewWillEnter() {
    setTimeout(() => {
      this.searchbar.setFocus();
    }, 1000);

  }

  onInput(event) {
    //console.log('on input: ' + JSON.stringify(event));
    this.search();
   // this.getLog();
    this.isHistory = false; 
  }

  onClear(event) {
    //console.log('on clear : ' + JSON.stringify(event));
    this.find = null;
    this.isHistory = true;
    this.items = [];
  }


  initSQLite() {

    this.sqlite.create({
      name: 'buddhadasa.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {

        this.db = db;
        this.getLog();
      })
      .catch(e => console.log(e));
  }

  getLog() {
    if (this.historyLog.length == 0) {

      this.isHistory = true;

      this.searchProvider.getLog(this.db)
        .then((res: any) => {
          console.log(res);
          this.historyLog = [];

          if (res.rows.length > 0) {
            for (let i = 0; i < res.rows.length; i++) {

              let item = {
                name: res.rows.item(i).name,
                created_at: moment.unix(res.rows.item(i).created_at).format("YYYY-MM-DD HH:mm:ss")
              };

              this.historyLog.push(item);
            }

            this.pageLog = res.currentPage;
            this.totalPageLog = res.totalPage;
          }
          //console.log(this.historyLog);

        })
        .catch(error => {
          console.log('get log error : ' + JSON.stringify(error));
        });
    }
  }

  resetValue() {
    this.page = 1;
    this.totalPage = 0;
    this.items = [];
    this.totalItem = 0;
    this.isLoading = false;
  }

  search() {

    this.items = [];

    if (this.find.trim()) {
      this.isLoading = true;
      this.isHistory = false;

      this.soundProvider.search(this.find)
        .then((res: any) => {
          this.isLoading = false;
          //console.log((res));

          if (res.ok) {
            //this.items = res.data;
            //console.log(this.items);
            this.totalItem = res.total;
            //this.sounds = res.data;
            let data: Array<ISound> = res.data.data;
            data.forEach(s => {
              let item = {
                id: s.id,
                sound_category_id: s.sound_category_id,
                title: s.title,
                subtitle: s.subtitle,
                description: s.description,
                showed_at: s.showed_at,
                duration: s.duration,
                mp3_file: s.mp3_file
              };
              this.items.push(item);
            });

            this.page = res.data.current_page;
            this.totalPage = res.data.last_page;
            this.totalItem = res.data.total;

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

  navigateToListen(sound: ISound) {
    //console.log('navigateToListen');
    
    this.logSearch();

    if (sound.mp3_file) {
      this.soundProvider.updateView(sound.id).then(() => { });
      this.navCtrl.push(SoundListenPage, sound);
    } else {
      console.log('No have mp3 file.');
    }
  }

  doInfinite(infiniteScroll) {
    let nextPage = this.page + 1;

    setTimeout(() => {

      if (this.find.trim()) {

        this.soundProvider.search(this.find, nextPage)
          .then((res: any) => {
            this.isLoading = false;
            //console.log((res));

            if (res.ok) {

              this.totalItem = res.total;

              let data: Array<ISound> = res.data.data;
              data.forEach(s => {
                let item = {
                  id: s.id,
                  sound_category_id: s.sound_category_id,
                  title: s.title,
                  subtitle: s.subtitle,
                  description: s.description,
                  showed_at: s.showed_at,
                  duration: s.duration,
                  mp3_file: s.mp3_file
                };
                this.items.push(item);
              });

              this.page = res.data.current_page;
              this.totalPage = res.data.last_page;
              this.totalItem = res.data.total;

            } else {
              console.log('Retrive data failed');
            }

          })
          .catch(error => {
            this.isLoading = false;
            console.log('Error: ' + JSON.stringify(error));
          });
      }

      infiniteScroll.complete();
    }, 1000);
  }

  logSearch() {
    //console.log('db: ' + this.db);
    let find = this.find.trim();

    if (find && this.db) {
      console.log('log serach : ' + find);
      this.searchProvider.log(this.db, find)
        .then(res => {
          //console.log('logSearch inserted: ' + JSON.stringify(res));
          console.log(JSON.stringify(res));
        })
        .catch(error => {
          console.log('Error : ' + JSON.stringify(error));
        });
    }
  }

  historyClicked(log: any) {

    this.searchProvider.updateLog(this.db, log.name)
      .then(res => {

      })
      .catch(error => {

      });

    this.find = log.name;
    this.search();
  }

  doInfiniteLog(infiniteScroll) {
    let nextPage = this.pageLog + 1;

    setTimeout(() => {

      this.searchProvider.getLog(this.db, nextPage)
        .then((res: any) => {
          //console.log(res);

          if (res.rows.length > 0) {
            for (let i = 0; i < res.rows.length; i++) {

              let item = {
                name: res.rows.item(i).name,
                created_at: moment.unix(res.rows.item(i).created_at).format("DD/MM/YYYY HH:mm:ss")
              };

              this.historyLog.push(item);
            }

            this.pageLog = res.currentPage;
            this.totalPageLog = res.totalPage;
          }
          //console.log(this.historyLog);

        })
        .catch(error => {
          console.log('get log error : ' + JSON.stringify(error));
        });

      infiniteScroll.complete();
    }, 1000);
  }

  clearHistorySearch() {
    this.searchProvider.clearLog(this.db, 'song').then(() => { });
    this.historyLog = [];
  }
}
