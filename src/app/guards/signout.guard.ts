import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {map} from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SignoutGuard implements CanActivate {
  constructor(private AFauth: AngularFireAuth, private router: Router){

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.AFauth.authState.pipe(map(auth =>{
        if(isNullOrUndefined(auth)){        
          return true;
        }else{
          var authe=auth;
        var veri= authe.emailVerified;
          if(veri==false){
            this.AFauth.signOut();
            alert("Verifica tu correo electronico");
            return true;
          }else{
            this.router.navigate(['home/articulos']);
            return false;
          }
        }
        
      }))
  
  }
  
}
