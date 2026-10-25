/** MODÈLES DE RÉFÉRENCE : à reprendre tels quels côté backend (mêmes noms de champs, mêmes valeurs d'énumération). */
export type Role='ADMIN'|'PORTAL_MANAGER'|'INSTRUCTOR'|'WCAG_AUDITOR'|'JUNIOR_AUDITOR';
export type UserStatus='PENDING'|'ACTIVE'|'DISABLED';
export interface User{id:number;name:string;email:string;role:Role;status:UserStatus;invited:boolean}
export interface LoginRequest{email:string;password:string;code?:string}
export interface LoginResponse{token:string;user:User}
export interface RegisterRequest{name:string;email:string;password:string}
export interface InvitationRequest{name:string;email:string;role:Role}

export type FindingKind='CONTRAST'|'HIERARCHY'|'FONT';
export type Decision='CONFIRMED'|'DISMISSED';
export interface Finding{id:number;page:string;kind:FindingKind;element:string;foreground?:string;background?:string;
 ratio?:number;compliant:boolean;recommendation:string;decision?:Decision}
export type Level='WCAG_AA'|'WCAG_AAA';
export type LabelDecision='WCAG_AA'|'WCAG_AAA'|'REJECTED';
export type DossierStatus='ANALYZING'|'ANALYZED'|'REVIEWED'|'DECIDED';
export interface Dossier{id:number;url:string;pages:number;requestedLevel:Level;status:DossierStatus;label?:LabelDecision;
 rulesVersion:number;submittedBy:string;createdAt:string;findings:Finding[]}
export interface SubmitDossierRequest{url:string;pages:number;requestedLevel:Level}

export interface Rules{version:number;contrastAA:number;contrastAAA:number;minFontPx:number;createdBy:string;createdAt:string}
export type PublishRulesRequest=Pick<Rules,'contrastAA'|'contrastAAA'|'minFontPx'>;

export interface DivergenceCase{page:string;element:string;ratio?:number;reason:string}
export interface Divergences{falsePositives:DivergenceCase[];falseNegatives:DivergenceCase[]}

export interface Kpi{f1History:{month:number;value:number}[];f1Target:number;portalsAnalysed:number;portalsTarget:number;
 avgReportMinutes:number;maxReportMinutes:number;publications:number;publicationsTarget:number}
export interface ApiError{code:string;message:string}
