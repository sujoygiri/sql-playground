import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs';

export const globalInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  console.log(req.headers);
  const clonedRequest = req.clone({
    setHeaders: {
      _ssid: localStorage.getItem("_ssid") ?? ''
    }
  })
  return next(clonedRequest).pipe(tap((event: HttpEvent<any>) => {
    if(event instanceof HttpResponse){
      const userSessionId = event.headers.get('_ssid');
      console.log(userSessionId);
      
      if(userSessionId){
        window.localStorage.setItem('_ssid', userSessionId);
      }
    }
  }))
};
