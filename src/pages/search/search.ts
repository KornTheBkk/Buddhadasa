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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public soundProvider: SoundProvider,
    private sqlite: SQLite,
    private searchProvider: SearchProvider) {

    platform.ready().then(() => {
      this.initSQLite();
    });
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

  ionViewDidLoad() {
    //console.log('ionViewDidLoad SearchPage');
  }

  ionViewWillEnter() {
    setTimeout(() => {
      this.searchbar.setFocus();
    }, 1000);

  }

  getLog() {
    this.searchProvider.getLog(this.db)
      .then((res: any) => { 
        //console.log(res);
        this.historyLog = [];
        
        if (res.rows.length > 0) {
          for (let i = 0; i < res.rows.length; i++){

            let item = {
              name: res.rows.item(i).name,
              created_at: moment.unix(res.rows.item(i).created_at).format("DD/MM/YYYY HH:mm:ss")
            };

            this.historyLog.push(item);
          }
        }
        //console.log(this.historyLog);
        
      })
      .catch(error => { 
        console.log('get log error : ' + JSON.stringify(error));       
      });
  }

  onInput(event) {
    //console.log('on input: ' + JSON.stringify(event));
    this.search();
    this.getLog();
  }

  onCancel(event) {
    //console.log('on cancel: ' + JSON.stringify(event));
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

    this.logSearch();

    if (sound.mp3_file) {
      this.navCtrl.push(SoundListenPage, sound);
    } else {
      console.log('Can\'t navigate to listen.');
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

}
