import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import 'rxjs/add/operator/timeout';


@Injectable()
export class BookProvider {

  httpTimeout: number = 5000;

  constructor(public http: HttpClient, @Inject('API_URL') public apiUrl: string) {
  }

  getCategory(parent_id?: number, page?: any) {
    
    if (!parent_id) {
      parent_id = 0;
    }

    if (!page) {
      page = '';
    }    

    let url = `${this.apiUrl}/book-categories/${parent_id}/?page=${page}`;

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

  getBooks(categoryId?: any, page?: any, pageSize?: any) {
  
    if (!categoryId) {
      categoryId = '';
    }

    if (!page) {
      page = '';
    }

    if (!pageSize) {
      pageSize = '';
    }

    let url = `${this.apiUrl}/books/?book_category_id=${categoryId}&page=${page}&page_size=${pageSize}`;
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
