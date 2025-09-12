import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface Response {
  rows: any[],
  command: string,
  count: number
}

@Injectable({
  providedIn: 'root'
})
export class AppService {

  // BASE_URL:string = "http://localhost:3000"
  BASE_URL = `https://sql-playground-production-476f.up.railway.app`
  constructor(private httpClient:HttpClient) { }

  sendProvisionRequest(): Observable<any> {
    return this.httpClient.post(`${this.BASE_URL}/user/create`,{})
  }

  handelQueryRun(query:string):Observable<Response>{
    return this.httpClient.post<Response>(`${this.BASE_URL}/query/run-query`,{query})
  }
}
