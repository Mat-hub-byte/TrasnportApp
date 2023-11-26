import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; /* B - nos da info de la url actual para extraer el id de la url*/

import { HttpClient } from '@angular/common/http'; /* F - importamos el httpClient para comunicarnos con la api */
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-museo-profile',
  templateUrl: './museo-profile.page.html',
  styleUrls: ['./museo-profile.page.scss'],
})
export class MuseoProfilePage implements OnInit {

  /* E - Vemos que "A" funciona por consola = lo guardamos en 1 variable */
  infoId : string;
  /* I - la implementamos en 1 variable la info particular para usarla en el html*/
  museoParticular;/* datos del museo particular dentro de esta variable - L36 */
  


  constructor(
    private activatedrout: ActivatedRoute, /* C - instanciamos ActivateRoute para poder usar implementarlo */
    /* G - la implementamos en 1 variable para usarla */
    private http: HttpClient,
    private utilsSvc: UtilsService
    ) { }

  ngOnInit() {
    /* A - extraer url */  
    console.log(
            /* D - snapshot + paramMap extrae el nombre declarado en app-routing.module.ts, es decir, el id*/
      this.infoId = this.activatedrout.snapshot.paramMap.get('id')
    );

     /* H traemos de la api toda la info de ese id */   
    this.http.get('https://www.cultura.gob.ar/api/v2.0/museos/' + this.infoId).subscribe(res =>{
      console.log(res)
      this.museoParticular = res;
    })            
  
  }

                      /* le paso el valor y el "tipo" que refiere a si es Email o Teléfono */
  copiarAlPortapapeles(valor: string, tipo: string) {
    if (valor) {
      // Crear un elemento textarea
      const textarea = document.createElement('textarea');
  
      // Establecer el valor del textarea con el número de teléfono o correo electrónico
      textarea.value = valor;
  
      // Agregar el textarea al final del cuerpo del documento (DOM) NECESARIO para operaciones
      document.body.appendChild(textarea);
  
      // Seleccionar el contenido del textarea
      textarea.select();
  
      // Ejecutar el comando de copiar en el documento
      document.execCommand('copy');
  
      // Eliminar el textarea del cuerpo del documento
      document.body.removeChild(textarea);
  
      // Mostrar un mensaje de copiado
      this.utilsSvc.presentToas({
        message: `${tipo} Copiado`,
        duration: 1250,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      });
    } else {
      // Mostrar un mensaje de información no disponible
      this.utilsSvc.presentToas({
        message: `${tipo} No Disponible`,
        duration: 1250,
        color: 'danger',
        position: 'middle',
        icon: 'close-circle-outline'
      });
    }
  }


    

  }