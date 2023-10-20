import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {
  
  
  firebaseSvc = inject(FirebaseService);
  utileSvc=inject(UtilsService);


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      let user = localStorage.getItem('user');

    return new Promise((resolve)=>{
      this.firebaseSvc.getAuth().onAuthStateChanged((auth)=>{

        if(!auth) resolve (true);
        
        else {
          this.utileSvc.routerlink('/main/home');
          resolve(false);
        }
      })
    })
  }
  
}
