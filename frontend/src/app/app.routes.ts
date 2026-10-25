import {inject} from '@angular/core';
import {CanActivateFn,Routes} from '@angular/router';
import {Router} from '@angular/router';
import {AuthService} from './core/auth.service';
import {Role} from './core/models';
import {HOME} from './core/roles';
import {Comptes} from './pages/comptes';
import {DossierPage} from './pages/dossier';
import {Divergences} from './pages/divergences';
import {Formation} from './pages/formation';
import {InstructionPage} from './pages/instruction';
import {KpiPage} from './pages/kpi';
import {Login} from './pages/login';
import {Regles} from './pages/regles';
const guard:CanActivateFn=route=>{const u=inject(AuthService).user(),r=inject(Router);
 if(!u)return r.parseUrl('/login');return (route.data['roles'] as Role[]).includes(u.role)||r.parseUrl(HOME[u.role])};
const g=(roles:Role[])=>({canActivate:[guard],data:{roles}});
export const routes:Routes=[
 {path:'login',component:Login},
 {path:'dossier',component:DossierPage,...g(['PORTAL_MANAGER'])},{path:'instruction',component:InstructionPage,...g(['INSTRUCTOR'])},
 {path:'divergences',component:Divergences,...g(['WCAG_AUDITOR','JUNIOR_AUDITOR'])},{path:'regles',component:Regles,...g(['WCAG_AUDITOR'])},
 {path:'formation',component:Formation,...g(['JUNIOR_AUDITOR'])},{path:'comptes',component:Comptes,...g(['ADMIN'])},{path:'kpi',component:KpiPage,...g(['ADMIN'])},
 {path:'**',redirectTo:'login'}];
