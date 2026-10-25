import {HttpErrorResponse} from '@angular/common/http';
import {Component,inject,signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../core/auth.service';
import {env} from '../core/env';
import {ApiError} from '../core/models';
import {HOME} from '../core/roles';
@Component({selector:'app-login',imports:[FormsModule],template:`
<div class="card login"><h2>Connexion</h2><p class="sub">Vous serez redirigé vers l'interface de votre rôle.</p>
<label for="e">Courriel</label><input id="e" type="email" [(ngModel)]="email" autocomplete="username">
<label for="p">Mot de passe</label><input id="p" type="password" [(ngModel)]="password" autocomplete="current-password">
@if(needsCode()){<label for="c">Code à deux facteurs</label><input id="c" inputmode="numeric" maxlength="6" [(ngModel)]="code" autocomplete="one-time-code">}
<p class="ko" role="alert">{{err()}}</p>
<button class="btn" type="button" [disabled]="busy()" (click)="submit()">Se connecter</button>
@if(mock){<h3 class="mt">Comptes de démonstration</h3><p class="mu small">Mot de passe libre, code à deux facteurs 123456.</p>
 @for(a of demo; track a.e){<button class="btn alt" type="button" (click)="fill(a.e)">{{a.l}}</button> }}</div>`})
export class Login{
 auth=inject(AuthService);router=inject(Router);mock=env.useMock;
 email='';password='';code='';needsCode=signal(false);err=signal('');busy=signal(false);
 demo=[{l:'Administrateur',e:'admin@ia-audit.tn'},{l:'Responsable de portail',e:'portail@ministere.gov.tn'},{l:'Instructeur',e:'instructeur@uge.gov.tn'},{l:'Auditeur WCAG',e:'auditeur@wcag-intl.org'},{l:'Auditeur junior',e:'junior@uge.gov.tn'},{l:'Inscription en attente',e:'nadia@sante.gov.tn'}];
 fill(e:string){this.email=e;this.password='demo1234';this.code='';this.needsCode.set(false);this.err.set('')}
 submit(){this.busy.set(true);this.err.set('');
  this.auth.login({email:this.email,password:this.password,code:this.code||undefined}).subscribe({
   next:r=>this.router.navigateByUrl(HOME[r.user.role]),
   error:(e:HttpErrorResponse)=>{this.busy.set(false);const b=e.error as ApiError|null;if(b?.code==='MFA_REQUIRED')this.needsCode.set(true);this.err.set(b?.message??'Connexion impossible.')}})}}
