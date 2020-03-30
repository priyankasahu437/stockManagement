import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/services/Product/product.service';
import { Product } from 'src/app/models/product';
import { AppHeaderComponent } from '../layout/app-header/app-header.component';
import { DataService } from 'src/app/services/Shared/data.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  product: Product;
  productId: number;
  sizeId: number;
  colorId: number;
  quantity:number;
  constructor(private productService: ProductService,
              private route: ActivatedRoute) { 
                this.product = new Product();
                
              }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.productId = params['id'];
    })
    this.getProductDetailsById();
  }

  getProductDetailsById(){
    this.productService.getProductDetailsById(this.productId)
    .subscribe(p => {
      // alert(JSON.stringify(p))
      this.product = p as Product;
      this.colorId = p.Color[0].AttributeValueId;
      this.sizeId = p.Size[0].AttributeValueId;
      this.quantity = p.Size[0].Quantity;
      // alert(JSON.stringify(p.Size[0].Quantity))
      this.productId=p.ProductId;
      console.log(this.product);
    })
  }

}
