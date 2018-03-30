import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import 'rxjs/add/operator/timeout';

@Injectable()
export class SoundProvider {

  constructor(public http: HttpClient, @Inject('API_URL') public apiUrl: string) {
  }

  getCategory(parent_id?: number) {
    
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return new Promise((resolve, reject) => { 
      this.http.get(this.apiUrl + '/sound-categories/0', { headers })
        .timeout(10000)
        .subscribe(res => { 
          resolve(res);
        }, error => { 
          reject(error);
        });  
    });

  }

}
