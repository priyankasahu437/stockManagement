import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from 'src/app/models/Product';
import { Paging } from 'src/app/models/paging';
import { ProductPaginData } from 'src/app/models/product-pagin-data';
import { Socket } from 'ngx-socket-io';
// import * as io from 'socket.io-client';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  url = localStorage.getItem('ServerUrl');
  constructor(private http: HttpClient,private socket: Socket) { 

  }

  geProductByDepartmentId(paging: Paging): Observable<Product[]>{
    return this.http.post<Product[]>(`${this.url}department/getDepartments`, paging);
  }

  getProductList(paging: Paging): Observable<ProductPaginData> {
    return this.http.post<ProductPaginData>(`${this.url}product/getFilteredProducts`, { paging: paging });
  }

  getProductDetailsById(productId: number):Observable<Product> {
    return this.http.get<Product>(`${this.url}product/getProductDetails?productId=${productId}`);
  }

  public sendMessage(productDetails) {
    // alert("hi "+productDetails)
    this.socket.emit('new-message', productDetails);
}

public getMessages = () => {
  return Observable.create((observer) => {
          this.socket.on('new-message', (message) => {
              observer.next(message);
          });
  });
}

}
