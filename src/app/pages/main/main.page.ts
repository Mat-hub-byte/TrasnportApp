import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  
  // variable con el arreglo de paginas
  pages=[
    {title: 'Inicio', url: '/main/home', icon: 'home-outline'},
    {title: 'Perfil', url: '/main/profile', icon: 'person-outline'}, 
    {title: 'Museos', url: '/main/museos', icon: 'information-circle-outline'}, 
  ]
  
  router = inject(Router);
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  currentPath: string = ''; // para saber en que urr esta actualmente el usuario, inicializada en 0.

  ngOnInit() {
    this.router.events.subscribe((event:any) => { 
    if(event?.url) this.currentPath = event.url;
    
    })
  }

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  //======Cerrar sesion=========
  signOut(){
    this.firebaseSvc.signOut();
  }
}