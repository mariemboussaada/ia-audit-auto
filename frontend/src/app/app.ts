import {Component,computed,inject} from '@angular/core';
import {Router,RouterLink,RouterLinkActive,RouterOutlet} from '@angular/router';
import {AuthService} from './core/auth.service';
import {NAV,ROLE_LABEL} from './core/roles';
import {ToastService} from './core/toast.service';
@Component({selector:'app-root',imports:[RouterOutlet,RouterLink,RouterLinkActive],template:`
<div class="app" [class.solo]="!auth.user()">
 @if(auth.user(); as u){
  <nav aria-label="Navigation">
   <div class="brand"><b>✓</b><span>IA-Audit-Auto<small>CAD-eAcc-A1 · UGE</small></span></div>
   <div class="who"><b>{{u.name}}</b><br><span>{{roleLabel[u.role]}}</span></div>
   <h4>Mon espace</h4>
   @for(n of nav(); track n.path){<a [routerLink]="n.path" routerLinkActive="on"><span aria-hidden="true">{{n.icon}}</span>{{n.label}}</a>}
   <h4>Session</h4><button type="button" (click)="logout()"><span aria-hidden="true">⎋</span>Se déconnecter</button>
  </nav>}
 <main><router-outlet/></main>
</div>
@if(toast.message()){<div id="toast" role="status">{{toast.message()}}</div>}`})
export class App{
 auth=inject(AuthService);toast=inject(ToastService);router=inject(Router);roleLabel=ROLE_LABEL;
 nav=computed(()=>{const u=this.auth.user();return NAV.filter(n=>!!u&&n.roles.includes(u.role))});
 logout(){this.auth.logout();this.router.navigateByUrl('/login')}}
