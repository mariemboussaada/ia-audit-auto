# Contrat d'API — IA-Audit-Auto

Référence : les modèles TypeScript de `src/app/core/models.ts` (mêmes noms de champs, mêmes valeurs d'énumération, JSON en camelCase) et les services de `src/app/core/*.service.ts` (un commentaire par appel). Le comportement attendu est illustré par `src/app/core/mock-backend.ts`.

Préfixe : `/api` (modifiable dans `core/env.ts`). Authentification : en-tête `Authorization: Bearer <token>` sur tous les appels sauf `/auth/*`. Dates en ISO 8601.

## Endpoints

| Service | Méthode et chemin | Corps | Réponse | Rôles |
|---|---|---|---|---|
| AuthService | `POST /auth/login` | `LoginRequest` | `LoginResponse` | public |
| AuthService | `POST /auth/register` | `RegisterRequest` | `User` (201, status PENDING, rôle PORTAL_MANAGER) | public |
| DossierService | `GET /dossiers` | | `Dossier[]` | PORTAL_MANAGER (les siens), INSTRUCTOR (tous) |
| DossierService | `GET /dossiers/{id}` | | `Dossier` | PORTAL_MANAGER (le sien), INSTRUCTOR |
| DossierService | `POST /dossiers` | `SubmitDossierRequest` | `Dossier` (201, status ANALYZING) | PORTAL_MANAGER |
| DossierService | `PATCH /dossiers/{id}/findings/{findingId}` | `{decision}` | `Dossier` | INSTRUCTOR |
| DossierService | `POST /dossiers/{id}/label` | `{label}` | `Dossier` (status DECIDED) | INSTRUCTOR |
| RulesService | `GET /rules/current` | | `Rules` | WCAG_AUDITOR, ADMIN |
| RulesService | `GET /rules` | | `Rules[]` (récente en premier) | WCAG_AUDITOR, ADMIN |
| RulesService | `POST /rules` | `PublishRulesRequest` | `Rules` (201) | WCAG_AUDITOR |
| UserService | `GET /users` | | `User[]` | ADMIN |
| UserService | `POST /users/invitations` | `InvitationRequest` | `User` (201, invited=true) | ADMIN |
| UserService | `PATCH /users/{id}` | `{status: 'ACTIVE'\|'DISABLED'}` | `User` | ADMIN |
| AnalyticsService | `GET /divergences` | | `Divergences` (sans URL de site) | WCAG_AUDITOR, JUNIOR_AUDITOR |
| AnalyticsService | `GET /kpi` | | `Kpi` | ADMIN |
| AnalyticsService | `POST /models/retraining` | | `Kpi` | ADMIN |

## Règles métier

- **Statuts d'un dossier :** `ANALYZING` → `ANALYZED` → `REVIEWED` → `DECIDED`. Le passage à `ANALYZED` est fait par le moteur d'analyse. Le passage à `REVIEWED` est automatique quand tous les constats ont une `decision`. Le frontend interroge `GET /dossiers/{id}` chaque seconde tant que le statut est `ANALYZING`.
- **Constat (`Finding`) :** `ratio` et `compliant` sont calculés par le backend avec la version de règles active (`rulesVersion`). Pour `HIERARCHY` et `FONT`, pas de couleurs ni de ratio, et `compliant` vaut false.
- **Règles :** `contrastAA ≥ 4,5`, `contrastAAA ≥ 7`, `minFontPx ≥ 12`, sinon 400 `RULE_BELOW_STANDARD`. Chaque publication crée une nouvelle version. Un dossier garde la version avec laquelle il a été analysé.
- **Comptes :** un compte a un seul rôle. Les rôles ADMIN, INSTRUCTOR et WCAG_AUDITOR exigent un code à deux facteurs (voir ci-dessous).

## Erreurs

Format : `{ "code": string, "message": string }` (type `ApiError`), message en français affichable tel quel.

| Statut | code | Cas |
|---|---|---|
| 401 | `INVALID_CREDENTIALS` | courriel ou mot de passe incorrect |
| 401 | `INVALID_CODE` | code à deux facteurs incorrect |
| 403 | `MFA_REQUIRED` | code manquant : le frontend affiche alors le champ de code et renvoie la requête avec `code` |
| 403 | `ACCOUNT_PENDING` / `ACCOUNT_DISABLED` | compte non utilisable |
| 400 | `RULE_BELOW_STANDARD` | règles hors norme |
| 409 | `EMAIL_EXISTS` | courriel déjà utilisé |
| 409 | `REVIEW_INCOMPLETE` | décision de label avant la fin de la revue |
| 404 | `NOT_FOUND` | ressource introuvable |

Un 401 sur tout autre appel renvoie l'utilisateur vers la page de connexion.

## Non couvert par l'interface actuelle (à ajouter si besoin)

Ajout d'un constat manuel par l'instructeur (US15), export JSON/PDF du rapport vers l'UGE (US12), contre-expertise (US17), progression des modules de formation, journal d'audit.
