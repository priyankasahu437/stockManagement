import { Component, OnInit } from '@angular/core';
import { CartProduct } from 'src/app/models/cart-product';
import { ProductService } from 'src/app/services/Product/product.service';

@Component({
  selector: 'app-payment-info',
  templateUrl: './payment-info.component.html',
  styleUrls: ['./payment-info.component.scss']
})
export class PaymentInfoComponent implements OnInit {

  checkoutProducts: CartProduct[];
  totalPrice: number = 0;
  date: number;
  tax = 6.4;
  remark: string = '';
  constructor(private productService:ProductService) {
    const products = JSON.parse(localStorage.getItem('Cart'));
    console.log(JSON.stringify(products))
    this.checkoutProducts = products;
    products.forEach((product) => {
			this.totalPrice += product.Price;
		});
  }

  ngOnInit() {
  }

  checkOutItem(){
    var alterCart = JSON.parse(localStorage.getItem('socketCart'));

    this.productService.sendMessage(JSON.stringify(alterCart));

    // alert(alterCart)
  }

}
