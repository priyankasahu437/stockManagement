import { Component, OnInit, Input } from '@angular/core';
import { ProductService } from 'src/app/services/Product/product.service';
import { CartProduct } from 'src/app/models/cart-product';
import { ToastrService } from 'ngx-toastr';
import { AppHeaderComponent } from '../../layout/app-header/app-header.component';
import { DataService } from 'src/app/services/Shared/data.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-to-cart',
  templateUrl: './add-to-cart.component.html',
  styleUrls: ['./add-to-cart.component.scss']
})
export class AddToCartComponent implements OnInit {

  quantity: number;
  @Input() sizeId: number;
  @Input() colorId: number;
  @Input() productId: number;
  @Input() isHomePage: boolean;
  messge: string;
  productDetailsArray=[];
  newMessage: number;
  messageList:  string[] = [];
  constructor(private productService:ProductService,
              private toastr: ToastrService,
              private dataService: DataService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.productId = params['id'];
    })
    // alert(this.productId)

    this.quantity = 1;
    this.dataService.currentMessage.subscribe(msg => this.messge = msg);
    
    // this.productService.getProductDetailsById(this.productId)
    // .subscribe(p => {
    //   // product = p as CartProduct;
    //   alert("PRODUCT DETAIL "+ JSON.stringify(p))
    // })


    this.productService
      .getMessages()
      .subscribe((message: string) => {
        var productDetails = JSON.parse(message)
        var quant =productDetails.find((item)=>{
          return item.product_id == this.productId
        })
        // var finalData = JSON.stringify(quant)
        // alert(quant.product_quantity)

        // this.messageList.push(message);
        this.newMessage = parseInt(quant.product_quantity);
      });
  }

  onAddProductToCart(){
    // alert(this.productId)
    let product: CartProduct;
    // alert(this.quantity)
    this.productService.getProductDetailsById(this.productId)
    .subscribe(p => {
      // alert(JSON.stringify(p))
    var productDetails={sizeId:this.sizeId,productId:this.productId,colorId:this.colorId,quantity:this.quantity}
    //Socket Send Message
    // this.productService.sendMessage(productDetails);

this.productDetailsArray = JSON.parse(localStorage.getItem('socketCart'))
this.productDetailsArray.push(productDetails)

    // this.productService
    // .getMessages()
    // .subscribe((message: string) => {
    //   // this.messageList.push(message);
    //   this.newMessage = parseInt(message);
    // });

      
      product = p as CartProduct;
      product.Quantity = this.quantity;
      product.SizeId = this.sizeId;
      product.ColorId = this.colorId;
      let cart: CartProduct[] = JSON.parse(localStorage.getItem('Cart'));
      if(cart == null){
        cart = [];
        cart.push(product);
      } else{
        let currentProduct = cart.filter(a => a.ProductId == product.ProductId);
        if(currentProduct.length > 0){
          cart.filter(a => {
            a.Quantity = a.Quantity + this.quantity;
          });
        } else{
          cart.push(product);
        }
      }
      this.dataService.updateCartItemCount(cart.length);
      this.dataService.updateShoppingCart(cart);
      localStorage.setItem('Cart', JSON.stringify(cart));
      localStorage.setItem('socketCart',JSON.stringify(this.productDetailsArray))
      this.toastr.success('<i class="fas fa-check ml-1 pr-2"></i><strong>Product Added to the Cart</strong>', null, {
        timeOut: 3000,
        toastClass: 'toast-header',
        progressBar: true,
        progressAnimation: 'decreasing',
        closeButton: true,
        enableHtml: true
      });
    });
    
  }

  sendMessage() {
    this.productService.sendMessage(this.newMessage);

      // this.productService
      // .getMessages()
      // .subscribe((message: string) => {
      //   this.messageList.push(message);
      // });
  }

  // showToast() {
  //   // this.toastrService.show(
  //   //   'This is super toast message',
  //   //   `This is toast number:`);
  // }

}
