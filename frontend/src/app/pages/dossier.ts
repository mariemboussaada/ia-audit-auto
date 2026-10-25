import {Component,OnDestroy,OnInit,inject,signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DossierService} from '../core/dossier.service';
import {Dossier,Level} from '../core/models';
import {KIND_TEXT,LABEL_TEXT} from '../core/roles';
import {Donut,Part,Stepper} from '../shared';
@Component({selector:'app-dossier',imports:[FormsModule,Donut,Stepper],template:`
<h2>Mon dossier de labellisation</h2><p class="sub">Soumettez votre portail, suivez l'instruction et lisez le pré-diagnostic.</p>
<app-stepper [status]="d()?.status"/>
<div class="g2">
 <div class="card"><h3>Nouvelle soumission</h3>
  <label for="u">Adresse du portail</label><input id="u" [(ngModel)]="url">
  <label for="p">Pages à analyser (1 à 15)</label><input id="p" type="number" min="1" max="15" [(ngModel)]="pages">
  <label for="l">Label demandé</label><select id="l" [(ngModel)]="level"><option value="WCAG_AA">WCAG AA</option><option value="WCAG_AAA">WCAG AAA</option></select>
  <p class="ko" role="alert">{{err()}}</p>
  <button class="btn" type="button" [disabled]="d()?.status==='ANALYZING'" (click)="submit()">Lancer le pré-audit</button>
  @if(d()?.status==='ANALYZING'){<p class="sub" role="status">Analyse en cours…</p>}</div>
 @if(d(); as x){<div class="card"><h3>Conformité des contrôles</h3><app-donut [parts]="parts(x)" [centre]="pct(x)+' %'"/>
  <p class="mt">Décision de label : <b>{{x.label?labels[x.label]:'en attente de l\\'instructeur'}}</b></p></div>}</div>
@if(d(); as x){<div class="card"><h3>Rapport de pré-diagnostic</h3><div class="scroll"><table>
 <thead><tr><th>Page</th><th>Type</th><th>Élément</th><th>Résultat</th><th>Correction suggérée</th></tr></thead>
 <tbody>@for(f of x.findings; track f.id){<tr><td>{{f.page}}</td><td>{{kinds[f.kind]}}</td><td>{{f.element}}</td>
  <td><span class="tag" [class.ko]="!f.compliant" [class.ok]="f.compliant">{{f.compliant?'Conforme':'Non conforme'}}</span></td><td>{{f.recommendation}}</td></tr>}</tbody></table></div></div>}`})
export class DossierPage implements OnInit,OnDestroy{
 svc=inject(DossierService);d=signal<Dossier|null>(null);err=signal('');labels=LABEL_TEXT;kinds=KIND_TEXT;
 url='https://portail.ministere.gov.tn';pages=15;level:Level='WCAG_AA';timer:ReturnType<typeof setInterval>|undefined;
 ngOnInit(){this.svc.list().subscribe(l=>{this.d.set(l.at(-1)??null);this.poll()})}
 ngOnDestroy(){clearInterval(this.timer)}
 submit(){this.err.set('');this.svc.submit({url:this.url,pages:this.pages,requestedLevel:this.level}).subscribe({
  next:x=>{this.d.set(x);this.poll()},error:e=>this.err.set(e.error?.message??'Erreur')})}
 poll(){clearInterval(this.timer);if(this.d()?.status!=='ANALYZING')return;
  this.timer=setInterval(()=>this.svc.get(this.d()!.id).subscribe(x=>{this.d.set(x);if(x.status!=='ANALYZING')clearInterval(this.timer)}),1000)}
 bad(x:Dossier){return x.findings.filter(f=>!f.compliant).length}
 pct(x:Dossier){return Math.round((x.findings.length-this.bad(x))/x.findings.length*100)}
 parts(x:Dossier):Part[]{return [{v:x.findings.length-this.bad(x),l:'Conformes',c:'var(--ok)'},{v:this.bad(x),l:'Non conformes',c:'var(--ko)'}]}}
