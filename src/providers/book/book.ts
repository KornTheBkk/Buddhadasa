import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import 'rxjs/add/operator/timeout';
import { IBook } from '../../interface/book';


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

  updateView(bookId: number) {

    let url = `${this.apiUrl}/book-view/${bookId}`;
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

  search(find: string, page?: number, pageSize?: number) {

    let pageQuery: string = '';
    let pageSizeQuery: string = '';

    if (page > 0) {
      pageQuery = '&page=' + page;
    }

    if (pageSize > 0) {
      pageSizeQuery = '&page_size=' + pageSize;
    }

    let url = `${this.apiUrl}/books?find=${find}${pageQuery}${pageSizeQuery}`;
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

  bookMapping(books: Array<IBook>) {

    let res: Array<IBook> = [];

    books.forEach(book => {
      let item = {
        id: book.id,
        book_category_id: book.book_category_id,
        title: book.title,
        subtitle: book.subtitle,
        description: book.description,
        published_at: book.published_at,
        view: book.view,
        pdf_file: book.pdf_file,
        image: book.image,
        image_thumb: book.image_thumb ? book.image_thumb : null,
        image_thumb_square: book.image_thumb_square ? book.image_thumb_square : null
      };
      res.push(item);
    });

    return res;
  }

}
