import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPage } from './main.page';
import { MuseosPage } from './museos/museos.page';

const routes: Routes = [
  {
    path: '',
    component: MainPage,

    children: [
      {
        path: 'home',
        loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'home-public',
        loadChildren: () => import('./home-public/home-public.module').then(m => m.HomePublicPageModule)
      },
      {
        path: 'museos',
        loadChildren: () => import('./museos/museos.module').then(m => m.MuseosPageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfilePageModule)
      },      
    ]
  },
  {
    path: 'home-public',
    loadChildren: () => import('./home-public/home-public.module').then( m => m.HomePublicPageModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule { }
