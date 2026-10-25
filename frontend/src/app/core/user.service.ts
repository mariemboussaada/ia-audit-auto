import {HttpClient} from '@angular/common/http';
import {Injectable,inject} from '@angular/core';
import {API} from './env';
import {InvitationRequest,User} from './models';
@Injectable({providedIn:'root'})
export class UserService{
 private http=inject(HttpClient);
 /** GET /users : ADMIN */
 list(){return this.http.get<User[]>(`${API}/users`)}
 /** POST /users/invitations : ADMIN. 409 EMAIL_EXISTS si le courriel existe déjà */
 invite(req:InvitationRequest){return this.http.post<User>(`${API}/users/invitations`,req)}
 /** PATCH /users/{id} : ADMIN. PENDING->ACTIVE valide une inscription */
 setStatus(id:number,status:'ACTIVE'|'DISABLED'){return this.http.patch<User>(`${API}/users/${id}`,{status})}
}
