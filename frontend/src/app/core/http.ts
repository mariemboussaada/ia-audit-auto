import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {catchError,throwError} from 'rxjs';
import {AuthService} from './auth.service';
/** Ajoute le jeton Bearer et renvoie vers la connexion sur une erreur 401 */
export const authInterceptor:HttpInterceptorFn=(req,next)=>{
 const a=inject(AuthService),r=inject(Router),t=a.getToken();
 return next(t?req.clone({setHeaders:{Authorization:`Bearer ${t}`}}):req).pipe(
  catchError(e=>{if(e.status===401&&!req.url.endsWith('/auth/login')){a.logout();r.navigateByUrl('/login')}return throwError(()=>e)}))};
