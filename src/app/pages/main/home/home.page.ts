import { Component, OnInit, inject } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdatePublishComponent } from 'src/app/shared/components/add-update-publish/add-update-publish.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})


export class HomePage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utileSvc = inject(UtilsService);

  ngOnInit(): void { }

  //----------------cierre de sesion----------------
  signOut() {
    this.firebaseSvc.signOut()
  }

  //----------------agregar y actualizar producto----------------
  addUpdateProduct(){
    this.utileSvc.presentModal({
      component: AddUpdatePublishComponent,
      cssClass: 'add-update-modal'
    })
  }

}
