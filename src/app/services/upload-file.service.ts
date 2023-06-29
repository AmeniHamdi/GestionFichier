
import { HttpClient, HttpEvent, HttpRequest ,HttpErrorResponse} from '@angular/common/http';

import { Injectable } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
import { user } from '../demo/domain/user.model';
import { Router } from '@angular/router';
import jwt_decode from "jwt-decode";



@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

  private baseUrl = 'http://localhost:8087/api/csv';
  private authUrl ='http://localhost:8087/auth';

  constructor(private http: HttpClient,private router: Router) { }

  //Upload a csv file
  upload(file: File): Observable<HttpEvent<any>>{
      const formData: FormData = new FormData();

      formData.append('file',file);

      // const url = data === "tier" ? `${this.baseUrl}/${data}/test-kafka` : `${this.baseUrl}/${data}/upload`

      const req = new HttpRequest('POST', `${this.baseUrl}/kafka/upload`, formData, {
        reportProgress: true,
        responseType: 'json'
      });

      return this.http.request(req);
  }

  uploadCSV(file: File, type: string): Observable<HttpEvent<any>>{
    const formData: FormData = new FormData();

    formData.append('file',file);

    // const url = data === "tier" ? `${this.baseUrl}/${data}/test-kafka` : `${this.baseUrl}/${data}/upload`

    const req = new HttpRequest('POST', `${this.baseUrl}/${type}/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
}
    // Add a new Row
    save(type: string, toAdd: any) {
      return this.http.post(`${this.baseUrl}/${type}`, toAdd);
    } 

  // Delete a row in my table
  delete(type: string, id: number) {
    return this.http.delete(`${this.baseUrl}/${type}/${id}`);
  }

  // Update a row in my table
  edit(type: string, updated: any) {
    return this.http.patch(`${this.baseUrl}/${type}/edit`, updated);
  }
  // Get all files with pagination
  getAllObjects(type: string, size = 5, page = 0, sortBy = "id", asc = true, searchTerm?: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${type}`, {params: {size, page, sortBy, asc, searchTerm}});
  }

  searchTiers(type:any) :Observable<any>{
    return this.http.get(`${this.baseUrl}/${type}/Search`)
  }

   //Authentification
   authService(type:any,user:user) : Observable<any>{
    return this.http
    .post(`${this.authUrl}/${type}`,user).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          // client-side error
          errorMessage = `Error: ${error.status}`;
        } else {
          // server-side error
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
    //    console.error("hhhhhhhhh",errorMessage);
        return of({error: true});
      })
    );
  }
   //Registration
   RegisterService(type:any,user:user) : Observable<any>{
    return this.http.post(`${this.authUrl}/${type}`,user)
  }

  private handleError(httpError: HttpErrorResponse) {
    let message: string = "";

    if (httpError.error instanceof ProgressEvent) {
        console.log("in progrss event");
        message = "Network error";
    }
    else {
        message = httpError.error.message;
        console.error(
            `Backend returned code ${httpError.status}, ` +
                `body was: ${httpError.error}`
        );
    }
  }

  isLoggedIn(): boolean {
    return sessionStorage.getItem("token") !== null;
  }

  isAdmin(): boolean {
    const {authorities} = jwt_decode(sessionStorage.getItem("token")) as any;
    return authorities.authority === "ADMIN";
  }


logout() {
  sessionStorage.clear();
  this.router.navigate(["/"]);
}
    
}