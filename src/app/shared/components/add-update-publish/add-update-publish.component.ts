import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-publish',
  templateUrl: './add-update-publish.component.html',
  styleUrls: ['./add-update-publish.component.scss'],
})
export class AddUpdatePublishComponent implements OnInit {

  @Input() product: Product; 

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
    if (this.product) this.form.setValue(this.product); 

  }

  //----------SACAR O SELECCIONAR UNA FOTO------------
  async takeImage() {
    const DataUrl = (await this.UtilsSvc.takePicture('Imagen de publicacion')).dataUrl;
    this.form.controls.image.setValue(DataUrl);

  }

  submit() {
    if (this.form.valid) {
     if (this.product) {this.updateProduct()}
      else this.createProduct();
    }
  }
  
  //Crear producto
  async createProduct() {

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

  // Actualizar producto
  async updateProduct() {
    
      let path= `users/${this.user.uid}/products/${this.product.id}`

      const loading = await this.UtilsSvc.loading();
      await loading.present();


      // ========== Si cambio la imagen, subir la nueva y obtener la url =====
      if(this.form.value.image !== this.product.image){
      let dataUrl = this.form.value.image;
      let imagePath = await this.firebaseSvc.getFilePath(this.product.image);
      let imageUrl = await this.firebaseSvc.uploadImage(imagePath,dataUrl );
      this.form.controls.image.setValue(imageUrl);}

      delete this.form.value.id

      this.firebaseSvc.updateDocument(path, this.form.value).then(async res => {

        this.UtilsSvc.dismissModal({ success:true });

        this.UtilsSvc.presentToas({
          message:'Producto actualizado exitosamente',
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