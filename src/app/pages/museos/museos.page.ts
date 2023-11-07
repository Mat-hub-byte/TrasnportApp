import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-museos',
  templateUrl: './museos.page.html',
  styleUrls: ['./museos.page.scss'],
})
export class MuseosPage implements OnInit {

  constructor(private http: HttpClient) { }

  museos: any[] = [];

  ngOnInit() {

    //Obtiene info de los museos (api) mediante GET
    //Agregamos <any> a  this.http.get para evitar "Propery 'results' does not exist on typo 'object'."
    this.http.get<any>('https://www.cultura.gob.ar/api/v2.0/museos/').subscribe(res =>{
      console.log(res); //Muestra el array
      //ITEM B - Lo colocamos dentro de una variable array para luego recorrerla 
      this.museos = res.results;
    })

  }

}
