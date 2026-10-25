import {HttpClient} from '@angular/common/http';
import {Injectable,inject,signal} from '@angular/core';
import {tap} from 'rxjs';
import {API} from './env';
import {LoginRequest,LoginResponse,RegisterRequest,User} from './models';
@Injectable({providedIn:'root'})
export class AuthService{
 private http=inject(HttpClient);
 readonly user=signal<User|null>(null);
 private token:string|null=null;
 getToken(){return this.token}
 /** POST /auth/login */
 login(req:LoginRequest){return this.http.post<LoginResponse>(`${API}/auth/login`,req).pipe(tap(r=>{this.token=r.token;this.user.set(r.user)}))}
 /** POST /auth/register : crée un compte PORTAL_MANAGER au statut PENDING */
 register(req:RegisterRequest){return this.http.post<User>(`${API}/auth/register`,req)}
 logout(){this.token=null;this.user.set(null)}
}
