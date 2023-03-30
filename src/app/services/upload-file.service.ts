
import { HttpClient, HttpEvent, HttpRequest ,HttpErrorResponse} from '@angular/common/http';

import { Injectable } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
import { user } from '../demo/domain/user.model';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

  private baseUrl = 'http://192.168.56.3:8086/api/csv';
  private authUrl ='http://192.168.56.3:8086/auth';
  
  constructor(private http: HttpClient,private router: Router) { }

  //Upload a csv file
  upload(file: File , data: any): Observable<HttpEvent<any>>{
      const formData: FormData = new FormData();

      formData.append('file',file);

      const req = new HttpRequest('POST', `${this.baseUrl}/${data}/upload`, formData, {
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
  getAllObjects(type: string, size = 5, page = 0, sortBy = "id", asc = true): Observable<any> {
    return this.http.get(`${this.baseUrl}/${type}`, {params: {size, page, sortBy, asc}});
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


logout() {
  sessionStorage.clear();
  this.router.navigate(["/"]);
}
    
}