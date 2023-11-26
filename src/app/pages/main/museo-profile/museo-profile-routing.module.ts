import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MuseoProfilePage } from './museo-profile.page';

const routes: Routes = [
  {
    path: '',
    component: MuseoProfilePage
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MuseoProfilePageRoutingModule {}
