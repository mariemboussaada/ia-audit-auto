import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ratio} from '../core/contrast';
@Component({selector:'app-formation',imports:[FormsModule],template:`
<h2>Espace de formation</h2><p class="sub">Modules WCAG, IA et BI, et outil de calcul de contraste.</p>
<div class="tiles">@for(m of modules; track m.n){<div class="tile"><span>{{m.n}}</span><div class="bar"><i [style.width.%]="m.p"></i></div><span>{{m.p}} % terminé</span></div>}</div>
<div class="card"><h3>Calculateur de contraste</h3>
 <div class="row"><div><label for="f">Texte</label><input id="f" type="color" [(ngModel)]="fg"></div><div><label for="b">Fond</label><input id="b" type="color" [(ngModel)]="bg"></div></div>
 <div class="pv" [style.color]="fg" [style.background]="bg"><b class="big">Titre de la page</b><br>Texte courant de démonstration.</div>
 <p><b class="big">{{r().toFixed(2)}} : 1</b></p>
 @for(t of tests(); track t.l){<span class="tag" [class.ok]="t.ok" [class.ko]="!t.ok">{{t.l}} {{t.ok?'réussi':'échoué'}}</span> }</div>`})
export class Formation{
 fg='#767676';bg='#ffffff';modules=[{n:'Bases WCAG 2.1',p:70},{n:'IA et vision par ordinateur',p:30},{n:'Tableaux de bord BI',p:0}];
 r(){return ratio(this.fg,this.bg)}
 tests(){const v=this.r();return [{l:'AA normal',ok:v>=4.5},{l:'AA grand texte',ok:v>=3},{l:'AAA normal',ok:v>=7},{l:'AAA grand texte',ok:v>=4.5}]}}
