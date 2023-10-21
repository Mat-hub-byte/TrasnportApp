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


  utileSvc = inject(UtilsService);

  ngOnInit() {}

  dismissModal(data?: any){
    this.utileSvc.dismissModal(data);
  }

}
