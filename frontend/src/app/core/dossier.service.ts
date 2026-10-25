import {HttpClient} from '@angular/common/http';
import {Injectable,inject} from '@angular/core';
import {API} from './env';
import {Decision,Dossier,LabelDecision,SubmitDossierRequest} from './models';
@Injectable({providedIn:'root'})
export class DossierService{
 private http=inject(HttpClient);
 /** GET /dossiers : PORTAL_MANAGER voit les siens, INSTRUCTOR voit tous les dossiers à instruire */
 list(){return this.http.get<Dossier[]>(`${API}/dossiers`)}
 /** GET /dossiers/{id} : sert aussi au suivi de l'analyse (status ANALYZING puis ANALYZED) */
 get(id:number){return this.http.get<Dossier>(`${API}/dossiers/${id}`)}
 /** POST /dossiers : répond tout de suite (201) avec status ANALYZING ; l'analyse continue en arrière-plan */
 submit(req:SubmitDossierRequest){return this.http.post<Dossier>(`${API}/dossiers`,req)}
 /** PATCH /dossiers/{id}/findings/{findingId} : INSTRUCTOR. Passe le dossier à REVIEWED quand tous les constats sont revus */
 reviewFinding(id:number,findingId:number,decision:Decision){return this.http.patch<Dossier>(`${API}/dossiers/${id}/findings/${findingId}`,{decision})}
 /** POST /dossiers/{id}/label : INSTRUCTOR. 409 REVIEW_INCOMPLETE si tous les constats ne sont pas revus */
 decide(id:number,label:LabelDecision){return this.http.post<Dossier>(`${API}/dossiers/${id}/label`,{label})}
}
