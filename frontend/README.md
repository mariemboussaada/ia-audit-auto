# IA-Audit-Auto — Frontend Angular

```bash
npm install
npm start        # http://localhost:4200
npm run build
```

## Mode démonstration et vrai backend

Par défaut (`src/app/core/env.ts` : `useMock: true`), un faux backend en mémoire répond aux appels (`core/mock-backend.ts`). Comptes de démonstration : boutons sur la page de connexion, mot de passe libre, code à deux facteurs `123456`.

Pour utiliser le vrai backend : mettre `useMock: false` et régler `apiUrl`. En développement, un proxy évite les erreurs CORS : créer `proxy.conf.json` (`{"/api":{"target":"http://localhost:8080","secure":false}}`) puis `ng serve --proxy-config proxy.conf.json`.

## Pour l'équipe backend

Voir `API.md`. Les modèles de référence sont dans `src/app/core/models.ts` et les noms d'appels dans `src/app/core/*.service.ts`.

## Structure

- `core/` : modèles, services d'API, intercepteurs, faux backend.
- `pages/` : un composant par écran (connexion, dossier, instruction, divergences, règles, formation, comptes, KPI).
- `shared.ts` : anneau, frise d'étapes, carte du dossier.
