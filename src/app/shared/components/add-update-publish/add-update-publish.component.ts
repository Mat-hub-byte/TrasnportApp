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
export class AddUpdatePublishComponent implements OnInit {

  form = new FormGroup({
    id: new FormControl(''),
    image: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.maxLength(280)])
  })


  firebaseSvc = inject(FirebaseService);
  UtilsSvc = inject(UtilsService);

  user = {} as User;

  ngOnInit() {

    this.user = this.UtilsSvc.getFromLocalStorage('user');

  }

  //----------SACAR O SELECCIONAR UNA FOTO------------
  async takeImage() {
    const DataUrl = (await this.UtilsSvc.takePicture('Imagen de publicacion')).dataUrl;
    this.form.controls.image.setValue(DataUrl);

  }

  async submit() {



    if (this.form.valid) {


      let path= `users/${this.user.uid}/products`

      const loading = await this.UtilsSvc.loading();
      await loading.present();


      //Subir la imagen y obtener la URL
      let dataUrl = this.form.value.image;
      let imagePath = `${this.user.uid}/${Date.now()}`;
      let imageUrl = await this.firebaseSvc.uploadImage(imagePath,dataUrl );

      this.form.controls.image.setValue(imageUrl);

      delete this.form.value.id

      this.firebaseSvc.addDocument(path, this.form.value).then(async res => {

        this.UtilsSvc.dismissModal({ success:true });

        this.UtilsSvc.presentToas({
          message:'Producto creado exitosamente',
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline'
        })

      }).catch(error => {
        console.log(error);

        this.UtilsSvc.presentToas({
          message: error.message,
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