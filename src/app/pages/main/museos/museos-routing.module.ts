import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MuseosPage } from './museos.page';

const routes: Routes = [
  {
    path: '',
    component: MuseosPage,
    
  },
  {
    path: 'museo-profile',
    loadChildren: () => import('../museo-profile/museo-profile.module').then( m => m.MuseoProfilePageModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MuseosPageRoutingModule {}
