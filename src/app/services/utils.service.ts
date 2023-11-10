import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, ModalOptions, ToastController, ToastOptions } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { CorsOptions } from "cors";
@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);
  modalCtrl = inject(ModalController);
  router = inject(Router);

  //------------------------config imagen-----------------------------
  async takePicture(promptLabelHeader: string) {
    return await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
      promptLabelHeader,
      promptLabelPhoto: 'Seleccionar una imagen',
      promptLabelPicture:'Toma una foto'
    });
  };

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
    const item = localStorage.getItem(key);
  
    if (item) {
      return JSON.parse(item);
    } else {
      // Manejar el caso en que el valor no existe en localStorage
      return null; // o cualquier valor predeterminado que desees devolver
    }
  }

  //-------------------Modal------------------

  async presentModal(opts: ModalOptions) {
    const modal = await this.modalCtrl.create(opts);
    await modal.present();
    const { data } = await modal.onWillDismiss();

    if (data) return data;
  }

  dismissModal(data) {
    return this.modalCtrl.dismiss();
  }

}
