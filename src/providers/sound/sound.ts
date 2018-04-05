import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import 'rxjs/add/operator/timeout';

@Injectable()
export class SoundProvider {

  httpTimeout: number = 10000;

  constructor(public http: HttpClient, @Inject('API_URL') public apiUrl: string) {
  }

  getCategory(parent_id?: number, page?: number) {
    
    if (!parent_id) {
      parent_id = 0;
    }

    //let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return new Promise((resolve, reject) => { 
      this.http.get(`${this.apiUrl}/sound-categories/${parent_id}/?page=${page}`)
        .timeout(this.httpTimeout)
        .subscribe(res => { 
          resolve(res);
        }, error => { 
          reject(error);
        });  
    });

  }

  getSound(categoryId?: any, page?: number) {
  
    if (!categoryId) {
      categoryId = '';
    }
   // console.log(`${this.apiUrl}/sounds?cateogy_id=${categoryId}`);
    
    return new Promise((resolve, reject) => { 
      this.http.get(`${this.apiUrl}/sounds?cateogy_id=${categoryId}&page=${page}`)
        .timeout(this.httpTimeout)
        .subscribe(res => { 
          resolve(res);
        }, error => { 
          reject(error);
        });  
    });
  
  }

  search(find: string, page?: number) {

    let pageQuery: string = '';

    if (page > 0) {
      pageQuery = '&page=' + page;
    }

    return new Promise((resolve, reject) => { 
      this.http.get(`${this.apiUrl}/sounds?find=${find}${pageQuery}`)
        .timeout(this.httpTimeout)
        .subscribe(res => {
          resolve(res);
        }, error => { 
          reject(error);
        });
    });
  }

}
