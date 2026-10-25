import {Component,computed,input} from '@angular/core';
import {Dossier,DossierStatus} from './core/models';
import {LEVEL_TEXT} from './core/roles';
export interface Part{v:number;l:string;c:string}
@Component({selector:'app-donut',template:`
<div class="dn"><svg viewBox="0 0 120 120" width="130" height="130" role="img" [attr.aria-label]="alt()">
 <circle cx="60" cy="60" r="48" fill="none" stroke="var(--bg)" stroke-width="16"/>
 @for(a of arcs(); track a.l){<circle cx="60" cy="60" r="48" fill="none" [attr.stroke]="a.c" stroke-width="16" [attr.stroke-dasharray]="a.d" [attr.stroke-dashoffset]="a.o" transform="rotate(-90 60 60)"/>}
 <text x="60" y="66" text-anchor="middle" font-size="20" font-weight="700" fill="currentColor">{{centre()}}</text></svg>
<ul class="lg">@for(p of parts(); track p.l){<li><i [style.background]="p.c"></i>{{p.l}} : {{p.v}}</li>}</ul></div>`})
export class Donut{
 parts=input.required<Part[]>();centre=input('');
 alt=computed(()=>this.parts().map(p=>p.l+' '+p.v).join(', '));
 arcs=computed(()=>{const L=2*Math.PI*48,T=this.parts().reduce((a,p)=>a+p.v,0)||1;let o=0;
  return this.parts().map(p=>{const l=p.v/T*L,a={l:p.l,c:p.c,d:`${l} ${L-l}`,o:-o};o+=l;return a})})}
@Component({selector:'app-stepper',template:`<ol class="stp" aria-label="Avancement du dossier">@for(x of steps; track x; let i=$index){<li [class.d]="i<n()">{{x}}</li>}</ol>`})
export class Stepper{
 status=input<DossierStatus|undefined>();steps=['Soumis','Analysé','Revu','Label décidé'];
 n=computed(()=>({ANALYZING:1,ANALYZED:2,REVIEWED:3,DECIDED:4} as Record<string,number>)[this.status()??'']??0)}
@Component({selector:'app-dossier-card',template:`
<div class="card"><h3>Dossier analysé</h3><div class="row">
<div><span class="mu">Site audité</span><br><b>{{d().url}}</b></div><div><span class="mu">Pages analysées</span><br><b>{{d().pages}}</b></div>
<div><span class="mu">Label demandé</span><br><b>{{level[d().requestedLevel]}}</b></div><div><span class="mu">Règles</span><br><b>v{{d().rulesVersion}}</b></div></div></div>`})
export class DossierCard{d=input.required<Dossier>();level=LEVEL_TEXT}
