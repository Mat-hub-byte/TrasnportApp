import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MuseosPage } from './museos.page';

const routes: Routes = [
  {
    path: '',
    component: MuseosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MuseosPageRoutingModule {}
