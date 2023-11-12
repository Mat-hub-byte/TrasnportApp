import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  form = new FormGroup({
    uid: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)])
  })


  firebaseSvc = inject(FirebaseService);
  UtilsSvc = inject(UtilsService);

  ngOnInit() {

  }

  /**
   * @method submit
   */
  async submit() {

    const loading = await this.UtilsSvc.loading(); // se crea un loading
    await loading.present(); // se presenta el loading

    if (this.form.valid) {

      this.firebaseSvc.signUp(this.form.value as User).then( async res => { // signUp con los valores de User (interface)

        await this.firebaseSvc.updateUser(this.form.value.name); //actualiza el nombre de usuario en Firebase Authentication

        let uid = res.user.uid; // Obtener el UID del usuario de la respuesta

        this.form.controls.uid.setValue(uid); // Establecer el UID en el campo 'uid' del formulario

        this.setUserInfo(uid); // Llamar a la función setUserInfo con el UID como argumento linea 72

        
      }).catch(error => { 
        console.log(error);

        this.UtilsSvc.presentToas({ // popout del error
          message: error.message,
          duration:2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        })

      }).finally(() => { // finaliza el loading inicia en linea 35
        loading.dismiss();
      })
    }

  }
  
  /**
   * 
   * @param uid string
   */
  async setUserInfo(uid:string) {

    // Muestra un indicador de carga
    const loading = await this.UtilsSvc.loading();
    await loading.present();

    // Construye la ruta en Firestore usando el UID
    let path = `users/${uid}`;
    // Elimina la contraseña del formulario
    delete this.form.value.password; 

    // Verifica la validez del formulario
    if (this.form.valid) {

      // Añade un documento en Firestore con la información del usuario
      this.firebaseSvc.setDocument(path, this.form.value).then( async res => {

        // Muestra un mensaje Toast de éxito
        this.UtilsSvc.presentToas({
          message: 'Te registraste correctamente',
          duration:2500,
          color: 'primary',
          position: 'middle',
          icon: 'trophy-outline'
        })

        // Guarda la información del usuario en el localStorage
        this.UtilsSvc.saveInLocalStorage('user', this.form.value);

        // Navega a otra página
        this.UtilsSvc.routerlink('/auth');

        // Restablece el formulario
        this.form.reset();


      }).catch(error => { // En caso de error al añadir el documento en Firestore
        console.log(error);

        // Muestra un mensaje Toast de error
        this.UtilsSvc.presentToas({
          message: error.message,
          duration:2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        })

      }).finally(() => { // Después de realizar las operaciones, oculta el indicador de carga q inicia en linea 76
        loading.dismiss();
      })
    }

  }

}