import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);
  router = inject(Router)

  //------------------ loading -----------------------
  loading(): Promise<HTMLIonLoadingElement> {
    return this.loadingCtrl.create({ spinner: 'crescent' })
  }

  //------------------ toast -----------------------
  async presentToas(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }
  //------------------ Enruta a cualquier pagina disponible -----------------------

  routerlink(url: string) {
    return this.router.navigateByUrl(url)
  }

  //------------------ guardar un elemento en localstrage -------------------------

  saveInLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value));
  }

  //------------------ OBTENER un elemento en localstrage -------------------------
  getFromLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key))
  }

}
