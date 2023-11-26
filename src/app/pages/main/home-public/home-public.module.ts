import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePublicPageRoutingModule } from './home-public-routing.module';

import { HomePublicPage } from './home-public.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePublicPageRoutingModule,
    SharedModule
  ],
  declarations: [HomePublicPage]
})
export class HomePublicPageModule {}
