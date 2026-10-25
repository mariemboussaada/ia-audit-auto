import {LabelDecision,Level,Role} from './models';
export const ROLE_LABEL:Record<Role,string>={ADMIN:'Administrateur de la plateforme',PORTAL_MANAGER:'Responsable de portail',INSTRUCTOR:'Instructeur UGE',WCAG_AUDITOR:'Auditeur WCAG certifié',JUNIOR_AUDITOR:'Auditeur junior'};
export const HOME:Record<Role,string>={ADMIN:'/comptes',PORTAL_MANAGER:'/dossier',INSTRUCTOR:'/instruction',WCAG_AUDITOR:'/divergences',JUNIOR_AUDITOR:'/divergences'};
export const LEVEL_TEXT:Record<Level,string>={WCAG_AA:'WCAG AA',WCAG_AAA:'WCAG AAA'};
export const LABEL_TEXT:Record<LabelDecision,string>={WCAG_AA:'WCAG AA',WCAG_AAA:'WCAG AAA',REJECTED:'Refusé — corrections requises'};
export const KIND_TEXT={CONTRAST:'Contraste',HIERARCHY:'Hiérarchie',FONT:'Police'};
export const NAV:{path:string;label:string;icon:string;roles:Role[]}[]=[
 {path:'/dossier',label:'Mon dossier',icon:'🏛️',roles:['PORTAL_MANAGER']},
 {path:'/instruction',label:'Instruction UGE',icon:'🧭',roles:['INSTRUCTOR']},
 {path:'/divergences',label:'Cas de divergence',icon:'🔎',roles:['WCAG_AUDITOR','JUNIOR_AUDITOR']},
 {path:'/regles',label:'Règles d\'analyse',icon:'📐',roles:['WCAG_AUDITOR']},
 {path:'/formation',label:'Formation',icon:'🎓',roles:['JUNIOR_AUDITOR']},
 {path:'/comptes',label:'Gestion des comptes',icon:'👥',roles:['ADMIN']},
 {path:'/kpi',label:'Maintenance et KPI',icon:'🛠️',roles:['ADMIN']}];
