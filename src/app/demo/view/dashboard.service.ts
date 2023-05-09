
import { HttpClient, HttpEvent, HttpRequest ,HttpErrorResponse} from '@angular/common/http';

import { Injectable } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';

import { Router } from '@angular/router';
import jwt_decode from "jwt-decode";



@Injectable({
  providedIn: 'root'
})
export class dashboardservice {

    
  private baseUrl = 'http://localhost:8087/api/csv';
    
  
  constructor(private http: HttpClient,private router: Router) { }


  getContractCount(): Observable<any> {
   return this.http.get(`${this.baseUrl}/contrat/count`);
  }
  getDosssierCount(): Observable<any> {
    return this.http.get(`${this.baseUrl}/dossier/count`);
   }
 getTierCount():Observable<any>
 {
  return this.http.get(`${this.baseUrl}/tier/count`);
 }
 getUsersCount():Observable<any>
 {
  return this.http.get(`${this.baseUrl}/admin/users/count`);
 }
}