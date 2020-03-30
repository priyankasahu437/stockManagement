import { Component, OnInit } from '@angular/core';
import { CartProduct } from 'src/app/models/cart-product';
import { DataService } from 'src/app/services/Shared/data.service';

@Component({
  selector: 'app-small-cart',
  templateUrl: './small-cart.component.html',
  styleUrls: ['./small-cart.component.scss']
})
export class SmallCartComponent implements OnInit {

  cart: CartProduct[] = [];
  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.cart.subscribe(a => this.cart = a);
  }

  getCartProductItems(){
    this.cart = JSON.parse(localStorage.getItem('Cart'));
  }

  onRemoveProductsFromCart(productId: number){
    // alert(localStorage.getItem('socketCart'))
    var alterCart = JSON.parse(localStorage.getItem('socketCart'));
    var alteredCart = alterCart.filter(a=>a.productId != productId)
    localStorage.setItem('socketCart',JSON.stringify(alteredCart))
    // alert(localStorage.getItem('socketCart'))

    this.cart = this.cart.filter(a => a.ProductId != productId);
    localStorage.setItem('Cart', JSON.stringify(this.cart));
    this.dataService.updateCartItemCount(this.cart.length);
    this.dataService.updateShoppingCart(this.cart);
  }

}
