import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MuseoProfilePageRoutingModule } from './museo-profile-routing.module';

import { MuseoProfilePage } from './museo-profile.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MuseoProfilePageRoutingModule,
    SharedModule
  ],
  declarations: [MuseoProfilePage]
})
export class MuseoProfilePageModule {}
