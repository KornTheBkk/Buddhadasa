import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = TabsPage;

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private sqlite: SQLite) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      this.initSQLite();


      // init setting vars
      if (!localStorage.getItem('pushNotification')) {
        localStorage.setItem('bookDownloaded', 'true');
      }

      if (!localStorage.getItem('bookDownloaded')) {
        localStorage.setItem('songDownloaded', 'true');
      }

      if (!localStorage.getItem('songDownloaded')) {
        localStorage.setItem('pushNotification', 'true');
      }      

    });
  }

  initSQLite() {

    this.sqlite.create({
      name: 'buddhadasa.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {

        db.executeSql(`
          CREATE TABLE IF NOT EXISTS SearchLog (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(255),
            category VARCHAR(50),
            created_at INTEGER
          )`, {})
          .then(() => console.log('SearchLog table was created successfully.'))
          .catch(e => console.log(e));

      })
      .catch(e => console.log(e)); 

  }
}
