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
    password: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)])
  })


  firebaseSvc = inject(FirebaseService);
  UtilsSvc = inject(UtilsService);

  ngOnInit() {

  }

  async submit() {

    const loading = await this.UtilsSvc.loading();
    await loading.present();

    if (this.form.valid) {

      this.firebaseSvc.signUp(this.form.value as User).then( async res => {

        await this.firebaseSvc.updateUser(this.form.value.name);

        let uid = res.user.uid;

        this.form.controls.uid.setValue(uid);

        this.setUserInfo(uid);

        
      }).catch(error => {
        console.log(error);

        this.UtilsSvc.presentToas({
          message: error.message,
          duration:2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        })

      }).finally(() => {
        loading.dismiss();
      })
    }

  }
  

  async setUserInfo(uid:string) {

    const loading = await this.UtilsSvc.loading();
    await loading.present();

    let path = 'users/${uid}';
    delete this.form.value.password; 

    if (this.form.valid) {

      this.firebaseSvc.setDocument(path, this.form.value).then( async res => {

        this.UtilsSvc.presentToas({
          message: 'Te registraste correctamente',
          duration:2500,
          color: 'primary',
          position: 'middle',
          icon: 'trophy-outline'
        })

        this.UtilsSvc.saveInLocalStorage('user', this.form.value);

        this.UtilsSvc.routerlink('/auth');

        this.form.reset();


      }).catch(error => {
        console.log(error);

        this.UtilsSvc.presentToas({
          message: error.message,
          duration:2500,
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