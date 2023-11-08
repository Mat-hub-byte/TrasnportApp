import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as firebaseService from 'src/app/services/firebase.service';
import { FirebaseApp } from '@angular/fire/app';

@Component({
  selector: 'app-museos',
  templateUrl: './museos.page.html',
  styleUrls: ['./museos.page.scss'],
  providers: [firebaseService.FirebaseService]
})
export class MuseosPage implements OnInit {

  constructor(private http: firebaseService.FirebaseService) { }

  museos: any[] = [];

  ngOnInit() {

    //Obtiene info de los museos (api) mediante GET
    //Agregamos <any> a  this.http.get para evitar "Propery 'results' does not exist on typo 'object'."
    this.http.getAll().subscribe(res=>{
      console.log('res', res); //Muestra el array
      //ITEM B - Lo colocamos dentro de una variable array para luego recorrerla 
      this.museos = res.results;
    })

  }

}
