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
  /**
   * 
   * @param promptLabelHeader 
   * @returns // crecion de la toma de la foto
   */
  async takePicture(promptLabelHeader: string) { // utiliza la API de la cámara de Capacitor
    return await Camera.getPhoto({ // obtiene una foto desde la cámara del dispositivo
      quality: 90, //calidad de la imagen
      allowEditing: true, // permite edicion
      resultType: CameraResultType.DataUrl, // tipo de resultado - URL de datos
      source: CameraSource.Prompt, // fuente de imagen - cámara con un cuadro de diálogo de selección
      promptLabelHeader,
      promptLabelPhoto: 'Seleccionar una imagen',
      promptLabelPicture:'Toma una foto'
    });
  };

  //------------------ loading -----------------------
  /**
   * @method loading
   * @returns // creacion de carga (visual) formato crescent
   */
  loading(): Promise<HTMLIonLoadingElement> {
    return this.loadingCtrl.create({ spinner: 'crescent' })
  }

  //------------------ toast -----------------------
  /**
   * 
   * @param opts // parametro opcional
   */
  async presentToas(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }
  //------------------ Enruta a cualquier pagina disponible -----------------------
  /**
   * @method routerlink
   * @param url // url de tipo string
   * @returns 
   */
  routerlink(url: string) {
    return this.router.navigateByUrl(url) // navega a la url indicada
  }

  //------------------ guardar un elemento en localstrage -------------------------
  /**
   * @method saveInLocalStorage
   * @param key 
   * @param value 
   * @returns 
   */
  saveInLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value));
  }

  //------------------ OBTENER un elemento en localstrage -------------------------
  /**
   * @method getFromLocalStorage
   * @param key 
   * @returns 
   */
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
  /**
   * @method presentModal
   * @param opts 
   * @returns 
   */
  async presentModal(opts: ModalOptions) {
    const modal = await this.modalCtrl.create(opts); // Crea una instancia del modal 
    await modal.present(); // Presenta el modal en la interfaz de usuario
    const { data } = await modal.onWillDismiss(); // Espera a que el modal se cierre y obtiene los datos asociados a su cierre

    // Si hay datos al cerrar, retorna esos datos
    if (data) return data;
  }

  /**
   * 
   * @param data 
   * @returns cierra o descarta el modal
   */
  dismissModal(data) {
    return this.modalCtrl.dismiss();
  }

}
