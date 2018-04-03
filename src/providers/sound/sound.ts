import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import 'rxjs/add/operator/timeout';

@Injectable()
export class SoundProvider {

  constructor(public http: HttpClient, @Inject('API_URL') public apiUrl: string) {
  }

  getCategory(parent_id?: number) {
    
    if (!parent_id) {
      parent_id = 0;
    }

    //let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return new Promise((resolve, reject) => { 
      this.http.get(`${this.apiUrl}/sound-categories/${parent_id}`)
        .timeout(10000)
        .subscribe(res => { 
          resolve(res);
        }, error => { 
          reject(error);
        });  
    });

  }

  getSound(categoryId?: any) {
  
    if (!categoryId) {
      categoryId = '';
    }
   // console.log(`${this.apiUrl}/sounds?cateogy_id=${categoryId}`);
    
    return new Promise((resolve, reject) => { 
      this.http.get(`${this.apiUrl}/sounds?cateogy_id=${categoryId}`)
        .timeout(10000)
        .subscribe(res => { 
          resolve(res);
        }, error => { 
          reject(error);
        });  
    });
  
  }

}
