import {Component,OnInit,inject,signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RulesService} from '../core/rules.service';
import {Rules} from '../core/models';
import {ToastService} from '../core/toast.service';
@Component({selector:'app-regles',imports:[FormsModule],template:`
<h2>Règles d'analyse</h2><p class="sub">Seuils utilisés par le moteur. Chaque modification crée une version, indiquée dans les rapports.</p>
@if(history()[0]; as r){<div class="tiles"><div class="tile"><b>v{{r.version}}</b><span>version active</span></div><div class="tile"><b>{{r.contrastAA}}:1</b><span>contraste AA</span></div>
 <div class="tile"><b>{{r.contrastAAA}}:1</b><span>contraste AAA</span></div><div class="tile"><b>{{r.minFontPx}} px</b><span>police minimale</span></div></div>}
<div class="g2"><div class="card"><h3>Nouvelle version</h3>
 <label for="a">Contraste AA (norme : 4,5 minimum)</label><input id="a" type="number" step="0.1" [(ngModel)]="aa">
 <label for="b">Contraste AAA (norme : 7 minimum)</label><input id="b" type="number" step="0.1" [(ngModel)]="aaa">
 <label for="f">Taille minimale de police, en px (règle du projet)</label><input id="f" type="number" [(ngModel)]="font">
 <p class="ko" role="alert">{{err()}}</p><button class="btn" type="button" (click)="save()">Publier la nouvelle version</button></div>
<div class="card"><h3>Historique des versions</h3><div class="scroll"><table><thead><tr><th>Version</th><th>AA</th><th>AAA</th><th>Police</th><th>Auteur</th></tr></thead><tbody>
 @for(r of history(); track r.version){<tr><td>v{{r.version}}</td><td>{{r.contrastAA}}</td><td>{{r.contrastAAA}}</td><td>{{r.minFontPx}} px</td><td>{{r.createdBy}}</td></tr>}</tbody></table></div></div></div>`})
export class Regles implements OnInit{
 svc=inject(RulesService);toast=inject(ToastService);history=signal<Rules[]>([]);err=signal('');aa=4.5;aaa=7;font=12;
 ngOnInit(){this.svc.history().subscribe(h=>{this.history.set(h);this.aa=h[0].contrastAA;this.aaa=h[0].contrastAAA;this.font=h[0].minFontPx})}
 save(){this.err.set('');this.svc.publish({contrastAA:this.aa,contrastAAA:this.aaa,minFontPx:this.font}).subscribe({
  next:r=>{this.history.update(h=>[r,...h]);this.toast.show('Règles versionnées (v'+r.version+')')},error:e=>this.err.set(e.error?.message??'Erreur')})}}
