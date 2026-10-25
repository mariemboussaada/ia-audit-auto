import {Component,OnInit,computed,inject,signal} from '@angular/core';
import {AnalyticsService} from '../core/analytics.service';
import {Kpi} from '../core/models';
import {ToastService} from '../core/toast.service';
@Component({selector:'app-kpi',template:`
<h2>Maintenance et indicateurs</h2><p class="sub">Suivi des KPI de la fiche et ré-entraînement des modèles.</p>
@if(k(); as x){
<div class="tiles"><div class="tile"><b [class.ok]="last()>=x.f1Target" [class.wa]="last()<x.f1Target">{{last().toFixed(2)}}</b><span>F1-score (cible ≥ {{x.f1Target}})</span></div>
 <div class="tile"><b>{{x.portalsAnalysed}} / {{x.portalsTarget}}</b><span>portails analysés</span></div>
 <div class="tile"><b class="ok">{{x.avgReportMinutes}} min</b><span>par rapport (max {{x.maxReportMinutes}})</span></div><div class="tile"><b>{{x.publications}} / {{x.publicationsTarget}}</b><span>publication</span></div></div>
<div class="g2"><div class="card"><h3>Progression du F1-score</h3>
 <svg viewBox="0 0 520 190" role="img" aria-label="Évolution du F1-score" class="chart">
  <line x1="40" x2="500" [attr.y1]="y(x.f1Target)" [attr.y2]="y(x.f1Target)" stroke="var(--wa)" stroke-dasharray="6 4" stroke-width="2"/>
  <polyline fill="none" stroke="var(--ac)" stroke-width="3" [attr.points]="pts()"/>
  @for(p of x.f1History; track p.month; let i=$index){<circle [attr.cx]="px(i)" [attr.cy]="y(p.value)" r="5" fill="var(--ac)"/>
   <text [attr.x]="px(i)" [attr.y]="y(p.value)-10" text-anchor="middle" font-size="12" fill="currentColor">{{p.value.toFixed(2)}}</text>
   <text [attr.x]="px(i)" y="186" text-anchor="middle" font-size="12" fill="currentColor">M{{p.month}}</text>}</svg></div>
<div class="card"><h3>Actions</h3><p class="mu">Le nouveau modèle remplace l'ancien seulement s'il atteint la cible.</p>
 <button class="btn" type="button" [disabled]="last()>=x.f1Target" (click)="retrain()">{{last()>=x.f1Target?'Modèle ré-entraîné':'Ré-entraîner les modèles'}}</button></div></div>}`})
export class KpiPage implements OnInit{
 svc=inject(AnalyticsService);toast=inject(ToastService);k=signal<Kpi|null>(null);
 last=computed(()=>this.k()?.f1History.at(-1)?.value??0);
 ngOnInit(){this.svc.kpi().subscribe(x=>this.k.set(x))}
 px(i:number){return 40+i*460/Math.max(1,(this.k()?.f1History.length??1)-1)}
 y(v:number){return 156-(v-.4)/.6*136}
 pts(){return (this.k()?.f1History??[]).map((p,i)=>this.px(i)+','+this.y(p.value)).join(' ')}
 retrain(){this.toast.show('Ré-entraînement en cours…');this.svc.retrain().subscribe(x=>{this.k.set(x);this.toast.show('F1-score passé à '+this.last().toFixed(2))})}}
