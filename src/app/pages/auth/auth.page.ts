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


  firebaseSvc = inject(FirebaseService);
  UtilsSvc = inject(UtilsService);

  ngOnInit() {

  }

  async submit() {

    const loading = await this.UtilsSvc.loading();
    await loading.present();

    if (this.form.valid) {

      this.firebaseSvc.signIn(this.form.value as User).then(res => {

        this.getUserInfo(res.user.uid);
        

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

  async getUserInfo(uid:string) {

    const loading = await this.UtilsSvc.loading();
    await loading.present();

    let path = 'users/${uid}';

    if (this.form.valid) {

      this.firebaseSvc.getDocument(path).then( (user:User) => {

        this.UtilsSvc.saveInLocalStorage('user', user);
        this.UtilsSvc.routerlink('/main/home');
        this.form.reset();

        this.UtilsSvc.presentToas({
          message: `Te damos la Bienvenida CABRON ${user.name}`,
          duration:3500,
          color: 'primary',
          position: 'middle',
          icon: 'person-circle-outline'
        })

        


      }).catch(error => {
        console.log(error);

        this.UtilsSvc.presentToas({
          message: error.massage,
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
  

