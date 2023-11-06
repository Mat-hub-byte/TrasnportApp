import { Component, OnInit, inject } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdatePublishComponent } from 'src/app/shared/components/add-update-publish/add-update-publish.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})


export class HomePage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

 products: Product[] = [];

  ngOnInit(): void { }

  //----------------cierre de sesion----------------
   signOut() {
     this.firebaseSvc.signOut()
  }

  user():User{
    return this.utilsSvc.getFromLocalStorage('user');
  }
  // sirve para ejecutar una funcion que cada vez q el usuario entre a la pagina
  ionViewWillEnter(){
    this.getProducts();
  }



  //----------Obtener productos
  getProducts(){
    let path= `users/${this.user().uid}/products`;
    let sub = this.firebaseSvc.getCollectionData(path).subscribe((res: any) => {
      console.log(res);
      this.products = res;
      sub.unsubscribe();
    });
  

  };


  //----------------agregar y actualizar producto----------------
  addUpdateProduct(){
    this.utilsSvc.presentModal({
      component: AddUpdatePublishComponent,
      cssClass: 'add-update-modal'
    })
  }

}
