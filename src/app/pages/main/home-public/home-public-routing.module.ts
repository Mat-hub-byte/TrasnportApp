import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePublicPage } from './home-public.page';

const routes: Routes = [
  {
    path: '',
    component: HomePublicPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePublicPageRoutingModule {}
