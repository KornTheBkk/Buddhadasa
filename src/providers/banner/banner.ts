import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import 'rxjs/add/operator/timeout';


@Injectable()
export class BannerProvider {

  httpTimeout: number = 5000;
  
  constructor(public http: HttpClient, @Inject('API_URL') public apiUrl: string) {
  }

  getBanner() {

    let url = `${this.apiUrl}/banner/`;

    return new Promise((resolve, reject) => {
      this.http.get(url)
        .timeout(this.httpTimeout)
        .subscribe(res => {
          resolve(res);
        }, error => {
          reject(error);
        });
    });

  }

}
