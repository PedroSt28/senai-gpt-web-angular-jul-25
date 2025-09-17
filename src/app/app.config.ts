import { ApplicationConfig, inject, provideZoneChangeDetection, } from '@angular/core';
import { provideRouter, Router } from '@angular/router';

import { routes } from './app.routes';
import { HttpErrorResponse, HttpInterceptorFn, provideHttpClient, withInterceptors } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const router = inject(Router);//direciona para as telas

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {

      if (err.status == 401) {    //tokens expirado

        localStorage.clear();   //Limpa todos os dados do localStorege
        router.navigate(["/login0"]);

      }

      return throwError(() => err);

    })

  )

}

export const appConfig: ApplicationConfig = {
  //instancia o HttpModule
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideHttpClient(withInterceptors([authInterceptor])),]

};
