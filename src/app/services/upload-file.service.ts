import { HttpClient, HttpErrorResponse, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
import { user } from '../demo/domain/user.model';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

  private baseUrl = 'http://localhost:8086/api/csv';
  private authUrl ='http://localhost:8086/auth';
  constructor(private http: HttpClient) { }

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
  // Delete a row in my table
  delete(type: string, id: number) {
    return this.http.delete(`${this.baseUrl}/${type}/${id}`);
  }

  // Update a row in my table
  edit(type: string, updated: any) {
    return this.http.patch(`${this.baseUrl}/${type}/edit`, updated);
  }
  // Get all files
  getAllObjects(data: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/${data}`);
  }
   //auth service
   authService(type:any,user:user) : Observable<any>{
    return this.http.post(`${this.authUrl}/${type}`,user)
    .pipe(
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
   //addUser
   RegisterService(type:any,user:user) : Observable<any>{
    return this.http.post(`${this.authUrl}/${type}`,user);
  }

  save(type: string, toAdd: any) {
    return this.http.post(`${this.baseUrl}/${type}`, toAdd);
  } 
  
}