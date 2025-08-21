import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  BASE_URL:string = `https://3000-firebase-sql-playground-1752058990341.cluster-fkltigo73ncaixtmokrzxhwsfc.cloudworkstations.dev`

  constructor(private httpClient:HttpClient) { }

  handelQueryRun(query:string):Observable<any>{
    return this.httpClient.post(`${this.BASE_URL}/query/run-query`, {query})
  }
}
