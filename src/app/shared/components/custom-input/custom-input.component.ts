import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
})
export class CustomInputComponent  implements OnInit {

  @Input() control!: FormControl;
  @Input() type!: string;
  @Input() label!: string;
  @Input() autocomplete!: string;
  @Input() icon!: string;
  
  isPassword!: boolean;
  hide:boolean = true;

  constructor() { }

  ngOnInit() {
    if (this.type == 'password') this.isPassword = true;
  }
  /**
   * @method showOrHidePassword // muestra o 'esconde' lo escrito
   */
  showOrHidePassword(){
    
    this.hide = !this.hide;
    
    if (this.hide) this.type ='password'; // si el tipo esta oculto es formato password
    else this.type = 'text'; // de lo contrario es tipo formato texto
  }

}
