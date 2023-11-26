import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, ModalOptions } from '@ionic/angular';
import { promises } from 'dns';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { TermsComponent } from 'src/app/shared/components/terms/terms.component';
import { collection } from '@angular/fire/firestore';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  firebaseSvc = inject(FirebaseService); 
  UtilsSvc = inject(UtilsService);
  ModalCtrl= inject(ModalController);

  uid: string = null

  async ngOnInit() {
  }

  user(): User {
    return this.UtilsSvc.getFromLocalStorage('user');
  }

  async takeImage() {
    let user = this.user();
    // Construye la ruta de users, con su user uid en FireStorage
      let path= `users/${user.uid}`

    // Llama al método takePicture del servicies/utils.service.ts para capturar o seleccionar una imagen
    const DataUrl = (await this.UtilsSvc.takePicture('Imagen del Perfil')).dataUrl;

    // Muestra un indicador de carga
      const loading = await this.UtilsSvc.loading();
      await loading.present();

    let imagePath = `${user.uid}/profile`; //cada vez que se suba una imagen de perfil se remplaza
    user.image = await this.firebaseSvc.uploadImage(imagePath, DataUrl);

    this.firebaseSvc.updateDocument(path, {image: user.image}).then(async res => { //es una promesa que se ejecuta una vez que se completa la actualización

      this.UtilsSvc.saveInLocalStorage('user', user);

      this.UtilsSvc.presentToas({ // popout exitoso
        message:'Imagen actualizado exitosamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      })

    }).catch(error => { // en caso de error
      console.log(error);

      this.UtilsSvc.presentToas({ // msj
        message: error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
      })

    }).finally(() => { //finaliza carga
      loading.dismiss();
    })
  }

  termsModal(){
    this.UtilsSvc.presentModal({
      component: TermsComponent,
      cssClass: 'add-update-modal'
    }) 
  }
}