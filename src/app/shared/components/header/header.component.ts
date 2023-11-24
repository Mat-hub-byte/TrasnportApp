import { Component, Input, OnInit, inject } from '@angular/core';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {

  @Input() title!: string;  
  @Input() backButton!: string;
  @Input() isModal!: boolean;  
  @Input() showMenu!: boolean;


  utileSvc = inject(UtilsService);

  ngOnInit() {}

  /**
   * 
   * @param data opcional
   */
  dismissModal(data?: any){ // parámetro opcional del tipo any
    this.utileSvc.dismissModal(data); //cierra un modal (ventana emergente) en la app from utils.service.ts
  }

}
