import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  BASE_URL:string = "http://localhost:3000"
  constructor(private httpClient:HttpClient) { }

  handelQueryRun(query:string):Observable<any>{
    return this.httpClient.get(`${this.BASE_URL}/user/create-role`)
  }
}
