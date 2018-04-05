import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import 'rxjs/add/operator/timeout';

@Injectable()
export class SoundProvider {

  httpTimeout: number = 10000;

  constructor(public http: HttpClient, @Inject('API_URL') public apiUrl: string) {
  }

  getCategory(parent_id?: number, page?: any) {
    
    if (!parent_id) {
      parent_id = 0;
    }

    if (!page) {
      page = '';
    }    

    //let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let url = `${this.apiUrl}/sound-categories/${parent_id}/?page=${page}`;

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

  getSound(categoryId?: any, page?: any) {
  
    if (!categoryId) {
      categoryId = '';
    }

    if (!page) {
      page = '';
    }

    let url = `${this.apiUrl}/sounds/?sound_category_id=${categoryId}&page=${page}`;
    //console.log(url);
    
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

  search(find: string, page?: number) {

    let pageQuery: string = '';

    if (page > 0) {
      pageQuery = '&page=' + page;
    }

    let url = `${this.apiUrl}/sounds?find=${find}${pageQuery}`;
    //console.log(url);

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

  getTotalSound(categoryId?: any) {
  
    if (!categoryId) {
      categoryId = '';
    }

    let url = `${this.apiUrl}/sound-total/${categoryId}`;
    //console.log(url);

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
