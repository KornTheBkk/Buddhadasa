import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';
import * as moment from 'moment';

@Injectable()
export class SearchProvider {

  perPage: number = 10;

  constructor(public http: HttpClient) {

  }

  getLog(db: SQLiteObject, page: number = 1) {

    if (page <= 0) {
      page = 1;
    }

    let offset = (page - 1) * this.perPage;

    return new Promise((resolve, reject) => {

      this.getTotalLog(db)
        .then((totalRows: number) => {
          //console.log('totalRows: ' + totalRows);
          let totalPage = Math.ceil(totalRows / this.perPage);

          let sql = `SELECT * FROM SearchLog ORDER BY created_at DESC LIMIT ${offset}, ${this.perPage}`;
          console.log(sql);

          db.executeSql(sql, [])
            .then(res => {

              let result = {
                currentPage: page,
                totalPage: totalPage,
                rows: res.rows
              };
              resolve(result);
            })
            .catch(error => {
              reject(error);
            });
        })
        .catch(error => {
          //console.log(error);
          reject(error);
        });

    });
  }

  log(db: SQLiteObject, log: string) {

    return new Promise((resolve, reject) => {

      this.logExists(db, log)
        .then((isExists: boolean) => {
          //console.log('log isExists : ' + isExists);
          if (!isExists) {

            let sql = 'INSERT INTO SearchLog (name, created_at) VALUES (?, ?)';
            //let currentTime = moment().format('YYYY-MM-DD h:mm:ss');
            let currentTime = moment().unix();

            db.executeSql(sql, [log, currentTime])
              .then(res => {
                resolve(res);
              })
              .catch(error => {
                reject(error);
              });

          } else {

            this.updateLog(db, log)
              .then(res => {
                resolve(res);
              })
              .catch(error => {
                reject(error);
              });

          }

        })
        .catch(error => {
          //console.log('Error! ' + error);
          reject(error);
        });
    });

  }

  private logExists(db: SQLiteObject, log: string) {

    let isExists = false;
    let sql = 'SELECT id FROM SearchLog WHERE name = ?';

    return new Promise((resolve, reject) => {
      db.executeSql(sql, [log])
        .then((res: any) => {
          //console.log('logExists: ' + JSON.stringify(res));

          if (res.rows.length > 0) {
            isExists = true;
          }
          resolve(isExists);
        })
        .catch(error => {
          //console.log('logExists Error: ' + JSON.stringify(error));
          reject(error);
        });
    });
  }

  updateLog(db: SQLiteObject, log: string) {

    return new Promise((resolve, reject) => {

      // update this log to created_at
      let sql = 'UPDATE SearchLog SET created_at = ? WHERE name = ?';
      let currentTime = moment().unix();

      db.executeSql(sql, [currentTime, log])
        .then(res => {
          resolve(res);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  getTotalLog(db: SQLiteObject) {
    return new Promise((resolve, reject) => {

      let sql = 'SELECT id FROM SearchLog';

      db.executeSql(sql, [])
        .then(res => {
          let totalRows = res.rows.length;
          resolve(totalRows);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

}
