import {Component,OnInit,inject,signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DossierService} from '../core/dossier.service';
import {Decision,Dossier,FindingKind,LabelDecision} from '../core/models';
import {KIND_TEXT,LABEL_TEXT} from '../core/roles';
import {ToastService} from '../core/toast.service';
import {DossierCard,Stepper} from '../shared';
@Component({selector:'app-instruction',imports:[FormsModule,Stepper,DossierCard],template:`
<h2>Dossier à instruire</h2><p class="sub">Revoyez chaque constat de l'IA, puis décidez du label national.</p>
@if(d(); as x){
<app-stepper [status]="x.status"/><app-dossier-card [d]="x"/>
<div class="g2">
 <div class="card"><h3>Revue en cours</h3><div class="mu">Constats revus : <b>{{done(x)}} / {{x.findings.length}}</b></div>
  <div class="bar"><i [style.width.%]="done(x)/x.findings.length*100"></i></div>
  <h3 class="mt">Carte des anomalies</h3>
  <div class="hm"><div></div>@for(k of kinds; track k){<div class="mu">{{text[k]}}</div>}
   @for(p of pages(x); track p){<div class="mu l">{{p}}</div>@for(k of kinds; track k){<div [class.bad]="n(x,p,k)>0" [class.good]="n(x,p,k)===0">{{n(x,p,k)}}</div>}}</div></div>
 <div class="card"><h3>Décision de label</h3><label for="l">Label national UGE</label>
  <select id="l" [(ngModel)]="label"><option value="WCAG_AA">WCAG AA</option><option value="WCAG_AAA">WCAG AAA</option><option value="REJECTED">Refusé — corrections requises</option></select>
  <button class="btn" type="button" [disabled]="x.status!=='REVIEWED'" (click)="decide(x)">Décider le label</button>
  @if(x.status==='ANALYZED'){<p class="mu">Revoyez tous les constats pour activer la décision.</p>}
  @if(x.label){<p class="ok"><b>Décision : {{labels[x.label]}}</b></p>}</div></div>
<div class="card"><h3>Constats de l'IA</h3><div class="scroll"><table>
 <thead><tr><th>Élément</th><th>Mesure</th><th>Avis IA</th><th>Votre revue</th></tr></thead><tbody>
 @for(f of x.findings; track f.id){<tr><td>{{f.page}}<br><small class="mu">{{f.element}}</small></td>
  <td>@if(f.ratio!==undefined){<span class="sw" [style.color]="f.foreground" [style.background]="f.background">Aa</span> {{f.ratio.toFixed(2)}}:1}@else{—}</td>
  <td><span class="tag" [class.ko]="!f.compliant" [class.ok]="f.compliant">{{f.compliant?'Conforme':'Non conforme'}}</span></td>
  <td>@if(f.decision; as dc){<span class="tag" [class.ok]="dc==='CONFIRMED'" [class.wa]="dc==='DISMISSED'">{{dc==='CONFIRMED'?'Confirmé':'Écarté'}}</span>}
   @else{<button class="btn alt" type="button" (click)="review(x,f.id,'CONFIRMED')">Confirmer</button> <button class="btn alt" type="button" (click)="review(x,f.id,'DISMISSED')">Écarter</button>}</td></tr>}
 </tbody></table></div></div>}@else{<p class="mu">Aucun dossier à instruire.</p>}`})
export class InstructionPage implements OnInit{
 svc=inject(DossierService);toast=inject(ToastService);d=signal<Dossier|null>(null);
 label:LabelDecision='WCAG_AA';labels=LABEL_TEXT;text=KIND_TEXT;kinds:FindingKind[]=['CONTRAST','HIERARCHY','FONT'];
 ngOnInit(){this.svc.list().subscribe(l=>this.d.set(l.at(-1)??null))}
 done(x:Dossier){return x.findings.filter(f=>f.decision).length}
 pages(x:Dossier){return [...new Set([...x.findings.map(f=>f.page),'/faq','/actualités'])]}
 n(x:Dossier,p:string,k:FindingKind){return x.findings.filter(f=>f.page===p&&f.kind===k&&!f.compliant).length}
 review(x:Dossier,fid:number,dc:Decision){this.svc.reviewFinding(x.id,fid,dc).subscribe(r=>this.d.set(r))}
 decide(x:Dossier){this.svc.decide(x.id,this.label).subscribe({next:r=>{this.d.set(r);this.toast.show('Décision enregistrée')},error:e=>this.toast.show(e.error?.message??'Erreur')})}}
