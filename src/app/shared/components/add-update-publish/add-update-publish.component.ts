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
  /**
   * @method takeImage
   */
  async takeImage() {
    // Llama al método takePicture del servicies/utils.service.ts para capturar o seleccionar una imagen
    const DataUrl = (await this.UtilsSvc.takePicture('Imagen de publicacion')).dataUrl;
    // Establece el valor del campo 'image' en el formulario con la URL de la imagen capturada/seleccionada
    this.form.controls.image.setValue(DataUrl);

  }
  /**
   * @method submit
   */
  submit() {
    if (this.form.valid) {// verifica si el formulario es valido
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

        this.UtilsSvc.presentToas({ // popuot exitoso
          message:'Producto creado exitosamente',
          duration: 1500,
          color: 'success',
          position: 'middle',
          icon: 'checkmark-circle-outline'
        })

      }).catch(error => { //en caso de error
        console.log(error);

        this.UtilsSvc.presentToas({ // msj de error
          message: error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        })

      }).finally(() => { //finaliza loading
        loading.dismiss();
      })
    
  }

  // Actualizar producto
  async updateProduct() {

      // Construye la ruta de users, con su user uid (linea 31) en FireStorage
      let path= `users/${this.user.uid}/products/${this.product.id}`
      // Muestra un indicador de carga
      const loading = await this.UtilsSvc.loading();
      await loading.present();


      // ========== Si cambio la imagen, subir la nueva y obtener la url =====
      //verifica si la URL de la imagen actual en el formulario es diferente de la URL de la imagen existente en el producto 
      //si son diferentes, significa que el usuario ha cargado o seleccionado una nueva imagen para el producto. En este caso, se procede a actualizar la imagen del producto.
      if(this.form.value.image !== this.product.image){
      let dataUrl = this.form.value.image; // obtiene la nueva URL de la imagen del formulario y la almacena en la variable dataUrl.
      let imagePath = await this.firebaseSvc.getFilePath(this.product.image); // se utiliza para obtener la ruta de archivo en el servicio Firebase (o en la ubicación donde se almacena la imagen en Firebase) para la imagen existente en el producto. Esto se hace utilizando el servicio this.firebaseSvc para obtener la ruta del archivo correspondiente a la imagen actual del producto (this.product.image). La espera (await) indica que esta operación podría llevar un tiempo, ya que se está accediendo a Firebase.
      let imageUrl = await this.firebaseSvc.uploadImage(imagePath,dataUrl ); // se utiliza para cargar la nueva imagen (dataUrl) en la ruta de archivo previamente obtenida (imagePath). Esto se hace utilizando el servicio this.firebaseSvc para cargar la nueva imagen en Firebase. La operación también podría llevar un tiempo, por lo que se utiliza await.
      this.form.controls.image.setValue(imageUrl);} //establece el valor del campo "image" en el formulario con la nueva URL de la imagen (imageUrl) que se ha cargado en Firebase. De esta manera, se actualiza la imagen del producto en el formulario con la nueva imagen cargada por el usuario.

      delete this.form.value.id //para eliminar la propiedad "id" del objeto this.form.value. Puede ser necesario hacer esto si el servicio de Firebase no necesita la propiedad "id" para realizar la actualización o inserción en la base de datos.
      
      //updatedocument de service/utils toma el path del doc q se quiere actualizar (linea 108) --- this.form.value: El objeto que contiene los datos que se utilizarán para actualizar el documento. Probablemente, esto contiene los datos del producto que el usuario ha editado en el formulario.
      this.firebaseSvc.updateDocument(path, this.form.value).then(async res => { //es una promesa que se ejecuta una vez que se completa la actualización

        this.UtilsSvc.dismissModal({ success:true }); // se utiliza para indicar que la operación se completó con éxito

        this.UtilsSvc.presentToas({ // popout exitoso
          message:'Producto actualizado exitosamente',
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

}