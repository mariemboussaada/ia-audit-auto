import {Component,OnInit,inject,signal} from '@angular/core';
import {AnalyticsService} from '../core/analytics.service';
import {DivergenceCase,Divergences as Data} from '../core/models';
@Component({selector:'app-divergences',template:`
<h2>Cas de divergence</h2><p class="sub">Les cas où l'IA et l'instructeur ne sont pas d'accord. Sites masqués : dossiers anonymisés.</p>
@if(data(); as x){
<div class="tiles"><div class="tile"><b class="wa">{{x.falsePositives.length}}</b><span>faux positifs</span></div><div class="tile"><b class="ko">{{x.falseNegatives.length}}</b><span>faux négatifs</span></div>
 <div class="tile"><b>{{x.falsePositives.length+x.falseNegatives.length}}</b><span>cas à étudier</span></div></div>
<div class="card"><h3>Constats écartés (faux positifs)</h3><p class="mu">L'IA a signalé un problème, l'instructeur a jugé que ce n'en était pas un.</p>
 <div class="scroll"><table><thead><tr><th>Page</th><th>Élément</th><th>Mesure de l'IA</th><th>Pourquoi ils divergent</th></tr></thead><tbody>
 @for(r of x.falsePositives; track $index){<tr><td>{{r.page}}</td><td>{{r.element}}</td><td>{{fmt(r)}}</td><td>{{r.reason}}</td></tr>}</tbody></table></div></div>
<div class="card"><h3>Constats ajoutés (faux négatifs)</h3><p class="mu">L'instructeur a relevé un problème que l'IA n'avait pas détecté.</p>
 <div class="scroll"><table><thead><tr><th>Page</th><th>Élément</th><th>Mesure de l'IA</th><th>Pourquoi ils divergent</th></tr></thead><tbody>
 @for(r of x.falseNegatives; track $index){<tr><td>{{r.page}}</td><td>{{r.element}}</td><td>{{fmt(r)}}</td><td>{{r.reason}}</td></tr>}</tbody></table></div></div>}`})
export class Divergences implements OnInit{
 svc=inject(AnalyticsService);data=signal<Data|null>(null);
 ngOnInit(){this.svc.divergences().subscribe(d=>this.data.set(d))}
 fmt(r:DivergenceCase){return r.ratio===undefined?'—':r.ratio.toFixed(1).replace('.',',')+':1'}}
