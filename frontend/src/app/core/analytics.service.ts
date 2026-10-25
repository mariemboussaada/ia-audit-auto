import {HttpClient} from '@angular/common/http';
import {Injectable,inject} from '@angular/core';
import {API} from './env';
import {Divergences,Kpi} from './models';
@Injectable({providedIn:'root'})
export class AnalyticsService{
 private http=inject(HttpClient);
 /** GET /divergences : WCAG_AUDITOR, JUNIOR_AUDITOR. Dossiers anonymisés (jamais l'URL du site) */
 divergences(){return this.http.get<Divergences>(`${API}/divergences`)}
 /** GET /kpi : ADMIN */
 kpi(){return this.http.get<Kpi>(`${API}/kpi`)}
 /** POST /models/retraining : ADMIN. Renvoie les KPI mis à jour */
 retrain(){return this.http.post<Kpi>(`${API}/models/retraining`,{})}
}
