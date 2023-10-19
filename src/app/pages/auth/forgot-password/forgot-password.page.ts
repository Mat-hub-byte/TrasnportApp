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

  async submit() {

    const loading = await this.UtilsSvc.loading();
    await loading.present();

    if (this.form.valid) {

      this.firebaseSvc.sendRecoveryEmail(this.form.value.email).then(res => {

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
