import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs';

export const globalInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  console.log(req.headers);
  const clonedRequest = req.clone({
    setHeaders: {
      _SSID: String(localStorage.getItem("_SSID"))
    }
  })
  return next(clonedRequest).pipe(tap((event: HttpEvent<any>) => {
    if(event instanceof HttpResponse){
      const userSessionId = event.headers.get('_SSID');
      if(userSessionId){
        window.localStorage.setItem('_SSID', userSessionId);
      }
    }
  }))
};
