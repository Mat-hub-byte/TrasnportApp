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
  signOut() {
    this.firebaseSvc.signOut(),
      localStorage.removeItem('user')
  }

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }
  // sirve para ejecutar una funcion que cada vez q el usuario entre a la pagina
  ionViewWillEnter() {
    this.getProducts();
  }



  //----------Obtener productos
  getProducts() {
    let path = `users/${this.user().uid}/products`;
    let sub = this.firebaseSvc.getCollectionData(path).subscribe({
      next: (res: any) =>{
        console.log(res);
        this.products = res;
        sub.unsubscribe();}
    });


  };


  //----------------Agregar o actualizar producto----------------
  async addUpdateProduct(product?: Product) {
    let success = await this.utilsSvc.presentModal({
      component: AddUpdatePublishComponent,
      cssClass: 'add-update-modal',
      componentProps: { product }
    });

    if (success) {
      this.getProducts();
    }
  }


  // =======Eliminar producto==========
  async deleteProduct(product: Product) {
    
    let path= `users/${this.user().uid}/products/${product.id}`

    const loading = await this.utilsSvc.loading();
    await loading.present();

    let imagePath = await this.firebaseSvc.getFilePath(product.image);
    await this.firebaseSvc.deleteFile(imagePath);

    this.products = this.products.filter(p => p.id !== product.id)

    this.firebaseSvc.deleteDocument(path).then(async res => {
      this.utilsSvc.presentToas({
        message:'Producto eliminado exitosamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      })

    }).catch(error => {
      console.log(error);

      this.utilsSvc.presentToas({
        message: error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
      })

    }).finally(() => {
      loading.dismiss();
    })
}

}
