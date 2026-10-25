import {HttpClient} from '@angular/common/http';
import {Injectable,inject} from '@angular/core';
import {API} from './env';
import {PublishRulesRequest,Rules} from './models';
@Injectable({providedIn:'root'})
export class RulesService{
 private http=inject(HttpClient);
 /** GET /rules/current */
 current(){return this.http.get<Rules>(`${API}/rules/current`)}
 /** GET /rules : historique des versions, la plus récente en premier */
 history(){return this.http.get<Rules[]>(`${API}/rules`)}
 /** POST /rules : WCAG_AUDITOR. 400 RULE_BELOW_STANDARD si contrastAA<4.5, contrastAAA<7 ou minFontPx<12 */
 publish(req:PublishRulesRequest){return this.http.post<Rules>(`${API}/rules`,req)}
}
