import {provideHttpClient,withInterceptors} from '@angular/common/http';
import {ApplicationConfig,provideZonelessChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';
import {env} from './core/env';
import {authInterceptor} from './core/http';
import {mockBackend} from './core/mock-backend';
export const appConfig:ApplicationConfig={providers:[provideZonelessChangeDetection(),provideRouter(routes),
 provideHttpClient(withInterceptors(env.useMock?[authInterceptor,mockBackend]:[authInterceptor]))]};
