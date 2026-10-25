import {HttpErrorResponse,HttpInterceptorFn,HttpResponse} from '@angular/common/http';
import {delay,mergeMap,of,throwError,timer} from 'rxjs';
import {ratio,suggest} from './contrast';
import {API} from './env';
import {ApiError,DivergenceCase,Dossier,DossierStatus,Finding,FindingKind,Level,Role,Rules,User} from './models';
/** Faux backend en mémoire. Sert aussi de spécification du comportement attendu. */
const MFA:Role[]=['ADMIN','INSTRUCTOR','WCAG_AUDITOR'];
const RAW:{id:number;page:string;kind:FindingKind;element:string;foreground?:string;background?:string}[]=[
 {id:1,page:'/accueil',kind:'CONTRAST',element:'Lien « Services en ligne »',foreground:'#8a8a8a',background:'#ffffff'},
 {id:2,page:'/accueil',kind:'CONTRAST',element:'Texte du bandeau',foreground:'#6b7fa0',background:'#eef2f8'},
 {id:3,page:'/services',kind:'HIERARCHY',element:'Titres H1 → H4 : niveaux sautés'},
 {id:4,page:'/services',kind:'FONT',element:'Pied de page en 10 px'},
 {id:5,page:'/contact',kind:'CONTRAST',element:'Bouton « Envoyer »',foreground:'#1b4f72',background:'#ffffff'}];
const u=(id:number,name:string,email:string,role:Role,status:User['status']='ACTIVE'):User=>({id,name,email,role,status,invited:false});
const db={nextId:100,f1:[.52,.61,.68,.73,.78],
 users:[u(1,'Amel Trabelsi','admin@ia-audit.tn','ADMIN'),u(2,'Karim Ben Salah','portail@ministere.gov.tn','PORTAL_MANAGER'),u(3,'Sonia Gharbi','instructeur@uge.gov.tn','INSTRUCTOR'),
  u(4,'Marc Lefèvre','auditeur@wcag-intl.org','WCAG_AUDITOR'),u(5,'Yassine Hamdi','junior@uge.gov.tn','JUNIOR_AUDITOR'),u(6,'Nadia Mansour','nadia@sante.gov.tn','PORTAL_MANAGER','PENDING')],
 rules:[{version:1,contrastAA:4.5,contrastAAA:7,minFontPx:12,createdBy:'Configuration initiale',createdAt:new Date().toISOString()}] as Rules[],
 dossiers:[] as Dossier[]};
const refresh=(d:Dossier)=>{const r=db.rules[0];d.rulesVersion=r.version;d.findings.forEach(f=>{
 if(f.foreground&&f.background){f.ratio=ratio(f.foreground,f.background);f.compliant=f.ratio>=r.contrastAA;f.recommendation=f.compliant?'Aucune action':'Assombrir le texte en '+suggest(f.foreground,f.background,r.contrastAA)}
 else{f.compliant=false;f.recommendation=f.kind==='FONT'?`Porter la taille à ${r.minFontPx} px minimum.`:'Insérer un H2 et un H3 intermédiaires.'}})};
const make=(url:string,pages:number,requestedLevel:Level,status:DossierStatus):Dossier=>{
 const d:Dossier={id:db.nextId++,url,pages:Math.min(15,Math.max(1,pages||15)),requestedLevel,status,rulesVersion:1,submittedBy:'Karim Ben Salah',createdAt:new Date().toISOString(),
  findings:RAW.map(r=>({...r,compliant:false,recommendation:''}) as Finding)};refresh(d);return d};
db.dossiers=[make('https://portail.ministere.gov.tn',15,'WCAG_AA','ANALYZED')];
const kpi=()=>({f1History:db.f1.map((value,i)=>({month:6+i*3,value})),f1Target:.8,portalsAnalysed:14,portalsTarget:20,avgReportMinutes:3.2,maxReportMinutes:5,publications:0,publicationsTarget:1});
export const mockBackend:HttpInterceptorFn=(req,next)=>{
 if(!req.url.startsWith(API))return next(req);
 const p=req.url.slice(API.length),m=req.method,b=req.body as any;let x:RegExpMatchArray|null;
 const ok=(body:unknown,status=200)=>of(new HttpResponse({status,body:structuredClone(body)})).pipe(delay(250));
 const ko=(status:number,code:string,message:string)=>timer(250).pipe(mergeMap(()=>throwError(()=>new HttpErrorResponse({status,error:{code,message} satisfies ApiError}))));
 if(m==='POST'&&p==='/auth/login'){const us=db.users.find(v=>v.email===b.email);
  if(!us)return ko(401,'INVALID_CREDENTIALS','Identifiants incorrects.');
  if(us.status==='PENDING')return ko(403,'ACCOUNT_PENDING','Compte en attente de validation par l\'administrateur.');
  if(us.status==='DISABLED')return ko(403,'ACCOUNT_DISABLED','Compte désactivé.');
  if(MFA.includes(us.role)&&!b.code)return ko(403,'MFA_REQUIRED','Saisissez le code à deux facteurs.');
  if(MFA.includes(us.role)&&b.code!=='123456')return ko(401,'INVALID_CODE','Code à deux facteurs incorrect.');
  return ok({token:'mock-'+us.id,user:us})}
 if(m==='POST'&&p==='/auth/register'){if(db.users.some(v=>v.email===b.email))return ko(409,'EMAIL_EXISTS','Ce courriel existe déjà.');
  const n=u(db.nextId++,b.name,b.email,'PORTAL_MANAGER','PENDING');db.users.push(n);return ok(n,201)}
 if(m==='GET'&&p==='/dossiers')return ok(db.dossiers);
 if(m==='POST'&&p==='/dossiers'){const d=make(b.url,b.pages,b.requestedLevel,'ANALYZING');db.dossiers=[d];setTimeout(()=>d.status='ANALYZED',2700);return ok(d,201)}
 if((x=p.match(/^\/dossiers\/(\d+)$/))&&m==='GET'){const d=db.dossiers.find(v=>v.id===+x![1]);return d?ok(d):ko(404,'NOT_FOUND','Dossier introuvable.')}
 if((x=p.match(/^\/dossiers\/(\d+)\/findings\/(\d+)$/))&&m==='PATCH'){const d=db.dossiers.find(v=>v.id===+x![1]),f=d?.findings.find(v=>v.id===+x![2]);
  if(!d||!f)return ko(404,'NOT_FOUND','Constat introuvable.');f.decision=b.decision;
  if(d.status==='ANALYZED'&&d.findings.every(v=>v.decision))d.status='REVIEWED';return ok(d)}
 if((x=p.match(/^\/dossiers\/(\d+)\/label$/))&&m==='POST'){const d=db.dossiers.find(v=>v.id===+x![1]);
  if(!d)return ko(404,'NOT_FOUND','Dossier introuvable.');
  if(d.status!=='REVIEWED')return ko(409,'REVIEW_INCOMPLETE','Revoyez tous les constats avant de décider.');
  d.label=b.label;d.status='DECIDED';return ok(d)}
 if(m==='GET'&&p==='/rules/current')return ok(db.rules[0]);
 if(m==='GET'&&p==='/rules')return ok(db.rules);
 if(m==='POST'&&p==='/rules'){if(b.contrastAA<4.5||b.contrastAAA<7||b.minFontPx<12)return ko(400,'RULE_BELOW_STANDARD','Valeur inférieure à la norme ou à la règle du projet.');
  db.rules.unshift({version:db.rules[0].version+1,...b,createdBy:'Marc Lefèvre',createdAt:new Date().toISOString()});db.dossiers.forEach(refresh);return ok(db.rules[0],201)}
 if(m==='GET'&&p==='/users')return ok(db.users);
 if(m==='POST'&&p==='/users/invitations'){if(db.users.some(v=>v.email===b.email))return ko(409,'EMAIL_EXISTS','Ce courriel existe déjà.');
  const n={...u(db.nextId++,b.name,b.email,b.role),invited:true};db.users.push(n);return ok(n,201)}
 if((x=p.match(/^\/users\/(\d+)$/))&&m==='PATCH'){const us=db.users.find(v=>v.id===+x![1]);if(!us)return ko(404,'NOT_FOUND','Utilisateur introuvable.');us.status=b.status;return ok(us)}
 if(m==='GET'&&p==='/divergences'){
  const fp:DivergenceCase[]=[{page:'/accueil',element:'Texte du bandeau décoratif',ratio:4.4,reason:'Élément décoratif, exclu du critère de contraste.'},{page:'/services',element:'Texte d\'un logo',ratio:3.1,reason:'Les logos sont exemptés du critère de contraste.'},
   ...db.dossiers.flatMap(d=>d.findings.filter(f=>!f.compliant&&f.decision==='DISMISSED').map(f=>({page:f.page,element:f.element,ratio:f.ratio,reason:'Écarté par l\'instructeur sur le dossier en cours.'})))];
  return ok({falsePositives:fp,falseNegatives:[{page:'/formulaire',element:'Menu déroulant inutilisable au clavier',reason:'L\'analyse visuelle ne teste pas la navigation au clavier.'},{page:'/accueil',element:'Texte sur image de fond variable',ratio:2.8,reason:'L\'IA a mesuré un fond moyen et non le cas le plus défavorable.'}]})}
 if(m==='GET'&&p==='/kpi')return ok(kpi());
 if(m==='POST'&&p==='/models/retraining'){if(db.f1.at(-1)!<.8)db.f1.push(.82);return ok(kpi())}
 return ko(404,'NOT_FOUND',`${m} ${p}`)};
