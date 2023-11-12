import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  //formulario del login 
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  })

  // Inyección de servicios
  firebaseSvc = inject(FirebaseService);
  UtilsSvc = inject(UtilsService);

  ngOnInit() {

  }

  /**
   * @method submit // Método para manejar el envío del formulario de inicio de sesión
   */
  async submit() {

    // Muestra un indicador de carga
    const loading = await this.UtilsSvc.loading();
    await loading.present();

    // Verifica si el formulario es válido
    if (this.form.valid) {

      // Obtiene la información del usuario desde Firestore
      this.firebaseSvc.signIn(this.form.value as User).then(res => {

        this.getUserInfo(res.user.uid);
        

      }).catch(error => { // Maneja errores al obtener la información del usuario
        console.log(error);

        this.UtilsSvc.presentToas({ // Muestra un mensaje Toast de error
          message: error.message,
          duration:2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        })

      }).finally(() => { // Oculta el indicador de carga al finalizar inicia en linea 36
        loading.dismiss();
      })
    }

  }

  /**
   * 
   * @param uid 
   */
  async getUserInfo(uid:string) { // Método para obtener información del usuario después de iniciar sesión

    // Muestra un indicador de carga
    const loading = await this.UtilsSvc.loading();
    await loading.present();

    // Construye la ruta en Firestore utilizando el UID
    let path = `users/${uid}`;

    // Verifica si el formulario es válido
    if (this.form.valid) {

      // Obtiene la información del usuario desde Firestore
      this.firebaseSvc.getDocument(path).then( (user:User) => {

        // Guarda la información del usuario en el `localStorage`
        this.UtilsSvc.saveInLocalStorage('user', user);
        // Navega a la página principal del usuario
        this.UtilsSvc.routerlink('/main/home');
        // Restablece el formulario
        this.form.reset();

        // Muestra un mensaje Toast de bienvenida
        this.UtilsSvc.presentToas({
          message: `Te damos la Bienvenida ${user.name}`,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'person-circle-outline'
        })

        


      }).catch(error => { // Maneja errores al obtener la información del usuario
        console.log(error);

        this.UtilsSvc.presentToas({ // Muestra un mensaje Toast de error
          message: error.massage,
          duration:2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        })

      }).finally(() => { // Oculta el indicador de carga al finalizar inicia en linea 73
        loading.dismiss();
      })
    }

  }

}
  

