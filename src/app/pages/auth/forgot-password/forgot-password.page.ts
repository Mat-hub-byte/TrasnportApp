import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  })


  firebaseSvc = inject(FirebaseService);
  UtilsSvc = inject(UtilsService);

  ngOnInit() {
  }
    /**
   * @method submit
   */
  async submit() {
    if (this.form.valid) {// si el form es valid

      const loading = await this.UtilsSvc.loading();// se crea un loading
      await loading.present(); // se presenta el loading
      
     
      this.firebaseSvc.sendRecoveryEmail(this.form.value.email).then(res => { // se envia recuperar contraseña al email del campo

        this.UtilsSvc.presentToas({// popout si fue exitoso
          message: 'Se ha enviado un mail a tu casilla asociada',
          duration: 3000,
          color: 'primary',
          position: 'middle',
          icon: 'mail-outline'
        })

        this.UtilsSvc.routerlink('/auth'); // redirije al login
        this.form.reset();

      }).catch(error => {
        console.log(error);

        this.UtilsSvc.presentToas({  
          message: error.massage,
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

  

}
