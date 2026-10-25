import {Component,OnInit,computed,inject,signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {UserService} from '../core/user.service';
import {Role,User} from '../core/models';
import {ROLE_LABEL} from '../core/roles';
import {ToastService} from '../core/toast.service';
import {Donut,Part} from '../shared';
@Component({selector:'app-comptes',imports:[FormsModule,Donut],template:`
<h2>Gestion des comptes</h2><p class="sub">Seul l'administrateur crée, valide et désactive les comptes. Chaque compte a un seul rôle.</p>
<div class="tiles"><div class="tile"><b>{{count('ACTIVE')}}</b><span>comptes actifs</span></div><div class="tile"><b class="wa">{{count('PENDING')}}</b><span>inscriptions à valider</span></div>
 <div class="tile"><b>{{invited()}}</b><span>invitations envoyées</span></div></div>
<div class="g2"><div class="card"><h3>Répartition par rôle</h3><app-donut [parts]="parts()" [centre]="''+users().length"/></div>
<div class="card"><h3>Inviter un utilisateur</h3>
 <label for="n">Nom</label><input id="n" [(ngModel)]="n"><label for="e">Courriel</label><input id="e" type="email" [(ngModel)]="e">
 <label for="r">Rôle</label><select id="r" [(ngModel)]="r">@for(k of roles; track k){<option [value]="k">{{label[k]}}</option>}</select>
 <button class="btn" type="button" (click)="invite()">Envoyer l'invitation</button></div></div>
<div class="card"><h3>Comptes</h3><div class="scroll"><table><thead><tr><th>Nom</th><th>Rôle</th><th>Statut</th><th>Action</th></tr></thead><tbody>
 @for(u of users(); track u.id){<tr><td>{{u.name}}<br><small class="mu">{{u.email}}</small></td><td>{{label[u.role]}}</td>
  <td><span class="tag" [class.wa]="u.status==='PENDING'" [class.ok]="u.status==='ACTIVE'" [class.ko]="u.status==='DISABLED'">{{u.status==='PENDING'?'À valider':u.status==='ACTIVE'?(u.invited?'Invité':'Actif'):'Désactivé'}}</span></td>
  <td><button class="btn alt" type="button" (click)="toggle(u)">{{u.status==='PENDING'?'Valider':u.status==='ACTIVE'?'Désactiver':'Réactiver'}}</button></td></tr>}</tbody></table></div></div>
<div class="card"><h3>Droits par rôle</h3><div class="scroll"><table><thead><tr><th>Droit</th>@for(k of roles; track k){<th>{{label[k]}}</th>}</tr></thead><tbody>
 @for(d of rights; track d[0]){<tr><td>{{d[0]}}</td>@for(k of roles; track k){<td>{{d[1].includes(k)?'Oui':'—'}}</td>}</tr>}</tbody></table></div></div>`})
export class Comptes implements OnInit{
 svc=inject(UserService);toast=inject(ToastService);users=signal<User[]>([]);label=ROLE_LABEL;
 roles:Role[]=['ADMIN','PORTAL_MANAGER','INSTRUCTOR','WCAG_AUDITOR','JUNIOR_AUDITOR'];n='';e='';r:Role='INSTRUCTOR';
 colors=['#0b7f86','#b87a00','#23864f','#7a5cc7','#c93b3b'];
 rights:[string,Role[]][]=[['Soumettre un portail',['PORTAL_MANAGER']],['Lire le pré-diagnostic',['PORTAL_MANAGER','INSTRUCTOR']],['Revoir les constats, décider du label',['INSTRUCTOR']],
  ['Régler les règles d\'analyse',['WCAG_AUDITOR']],['Consulter les cas de divergence',['WCAG_AUDITOR','JUNIOR_AUDITOR']],['Suivre la formation',['JUNIOR_AUDITOR']],['Gérer les comptes, voir les KPI',['ADMIN']]];
 invited=computed(()=>this.users().filter(u=>u.invited).length);
 parts=computed<Part[]>(()=>this.roles.map((k,i)=>({v:this.users().filter(u=>u.role===k).length,l:this.label[k],c:this.colors[i]})));
 ngOnInit(){this.svc.list().subscribe(l=>this.users.set(l))}
 count(s:string){return this.users().filter(u=>u.status===s).length}
 toggle(u:User){this.svc.setStatus(u.id,u.status==='ACTIVE'?'DISABLED':'ACTIVE').subscribe(x=>{this.users.update(l=>l.map(v=>v.id===x.id?x:v));this.toast.show('Compte mis à jour')})}
 invite(){if(!this.n.trim()||!this.e.trim()){this.toast.show('Renseignez le nom et le courriel');return}
  this.svc.invite({name:this.n.trim(),email:this.e.trim(),role:this.r}).subscribe({next:x=>{this.users.update(l=>[...l,x]);this.n='';this.e='';this.toast.show('Invitation envoyée')},error:err=>this.toast.show(err.error?.message??'Erreur')})}}
