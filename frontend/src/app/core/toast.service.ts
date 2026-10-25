import {Injectable,signal} from '@angular/core';
@Injectable({providedIn:'root'})
export class ToastService{readonly message=signal('');show(m:string){this.message.set(m);setTimeout(()=>this.message.set(''),2200)}}
