import { Component, Input, OnInit, inject } from '@angular/core';
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
  /**
   * @method signOut de services/firebase.service.ts
   */
  signOut() {
    this.firebaseSvc.signOut(),
      localStorage.removeItem('user')
  }

  /**
   * 
   * @returns user de localstorage = service/utils.service.ts
   */
  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }
  
  // sirve para ejecutar una funcion que cada vez q el usuario entre a la pagina
  ionViewWillEnter() {
    this.getProducts();
  }
  

  //funcion para actualizar la lista de publicaciones 
  doRefresh(event) {
    setTimeout(() => {
      this.getProducts(),
      event.target.complete();
    }, 2000);
  }



  //----------Obtener productos
  /**
   * @method getProducts Obtiene la columna 'product' del uid del user logeado
    utiliza el getCollectionData de service/firebase.service.ts*/
  getProducts() {
    let path = `users/${this.user().uid}/products`;
    let sub = this.firebaseSvc.getCollectionData(path).subscribe({
      next: (res: any) => {
        console.log(res);
        this.products = res;
        sub.unsubscribe();
      }
    });


  };


  //----------------Agregar o actualizar producto----------------
  /**
   * @method addUpdateProduct 
   */             //product tiene interface models/product.model.ts
  async addUpdateProduct(product?: Product) {
      await this.utilsSvc.presentModal({ // espera para la presentacion
      component: AddUpdatePublishComponent,
      componentProps: { product }
    });
      this.getProducts(); //linea 51
  }


  // =======Eliminar producto==========
  async deleteProduct(product: Product) {

    let path = `users/${this.user().uid}/products/${product.id}`

    const loading = await this.utilsSvc.loading();
    await loading.present();

    let imagePath = await this.firebaseSvc.getFilePath(product.image);
    await this.firebaseSvc.deleteFile(imagePath);

    this.products = this.products.filter(p => p.id !== product.id) //Actualiza la lista, sin el producto que se elminio y se pasa por parametro

    this.firebaseSvc.deleteDocument(path).then(async res => {
      this.utilsSvc.presentToas({
        message: 'Producto eliminado exitosamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      })

    }).catch(error => { // si hay error
      console.log(error);

      this.utilsSvc.presentToas({ // muetra el error 
        message: error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
      })

    }).finally(() => { // finaliza carga linea 87
      loading.dismiss();
    })
  }

}
