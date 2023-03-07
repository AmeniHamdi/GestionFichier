import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

  private baseUrl = 'http://localhost:8086/api/csv';
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

  
  
}