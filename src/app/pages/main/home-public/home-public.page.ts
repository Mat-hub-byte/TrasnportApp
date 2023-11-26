import { Component, OnInit } from '@angular/core';

import { User } from 'src/app/models/user.model';
import { Product } from 'src/app/models/product.model';

import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-home-public',
  templateUrl: './home-public.page.html',
  styleUrls: ['./home-public.page.scss'],
})
export class HomePublicPage implements OnInit {

  users: User[] = [];
  products: Product[] = []; //Product interface exportada desde models

  constructor(private firebaseSvc: FirebaseService, private utilsSvc : UtilsService) { }

  ngOnInit() {
    this.getUsersWithPhotos();
    this.loadPhotosForUsers();
  }

  /**
   * 
   * @returns user de localstorage = service/utils.service.ts
   */
  user(): User { // User = interface en 'models'
    return this.utilsSvc.getFromLocalStorage('user');
  }

  

  getUsersWithPhotos() {
    this.firebaseSvc.getCollectionData('users').subscribe((users: User[]) => {
      this.users = users;
      // Ahora que tienes la información de los usuarios, puedes cargar las fotos para cada usuario
      this.loadPhotosForUsers();
    });
  }

  loadPhotosForUsers() {
  for (const user of this.users) {
    this.firebaseSvc.getCollectionData(`users/${user.uid}/products`, { orderBy: 'createdAt' })
      .subscribe((products: Product[]) => {
        // Asegúrate de que cada usuario tenga su propia lista de productos
        user.products = products;
      });
  }
}


  //----------Obtener productos
  /**
   * @method getProducts Obtiene la columna 'product' del uid del user (getFromLocalStorage linea 38) 
   * logeado utiliza el getCollectionData de service/firebase.service.ts linea 85*/
  getProducts() {
    let path = `users/${this.user().uid}/products`;
    let sub = this.firebaseSvc.getCollectionData(path, { orderBy: 'createdAt' }).subscribe({
      next: (res: any) => {
        console.log(res);
        this.products = res;
      } // libera recursos
    });
  }

    //funcion para actualizar la lista de publicaciones 
    doRefresh(event) {
      setTimeout(() => {
        this.getProducts(),
        event.target.complete();
      }, 2000);
    }

}