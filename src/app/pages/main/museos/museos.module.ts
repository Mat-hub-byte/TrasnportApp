import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MuseosPageRoutingModule } from './museos-routing.module';

import { MuseosPage } from './museos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MuseosPageRoutingModule
  ],
  declarations: [MuseosPage]
})
export class MuseosPageModule {}
