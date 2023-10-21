import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-publish',
  templateUrl: './add-update-publish.component.html',
  styleUrls: ['./add-update-publish.component.scss'],
})
export class AddUpdatePublishComponent  implements OnInit {

  form = new FormGroup({
    id: new FormControl(''),
    image:new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.maxLength(280)])
  })


  firebaseSvc = inject(FirebaseService);
  UtilsSvc = inject(UtilsService);

  ngOnInit() {

  }

  //----------SACAR O SELECCIONAR UNA FOTO------------
  async takeImage(){
    const DataUrl = (await this.UtilsSvc.takePicture('Imagen de publicacion')).dataUrl;
    this.form.controls.image.setValue(DataUrl);

  }

  async submit() {

    const loading = await this.UtilsSvc.loading();
    await loading.present();

    if (this.form.valid) {

      this.firebaseSvc.signUp(this.form.value as User).then( async res => {

        await this.firebaseSvc.updateUser(this.form.value.name);

        let uid = res.user.uid;
        
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