
import { HttpClient, HttpEvent, HttpRequest ,HttpErrorResponse} from '@angular/common/http';

import { Injectable } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
import { user } from '../demo/domain/user.model';
import { Router } from '@angular/router';

export enum Role {
  ADMIN = "ADMIN",
  CONSULTANT = "CONSULTANR"
}

export interface UserRole {
  id: number;
  role: Role
}

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string,
    password: string,
    role: UserRole;
    verificationCode?: string,
    enabled: boolean
    username: string;
    accountNonLocked: boolean;
    accountNonExpired: boolean;
    credentialsNonExpired: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private baseUrl = 'http://localhost:8087/api/csv/admin';
  
  constructor(private http: HttpClient,private router: Router) { }

    // Add a new Row
    listUsers(size = 5, page = 0, sortBy = "id", asc = true, searchTerm?: string): Observable<any> {
      return this.http.get(`${this.baseUrl}/list-users`, {params: {size, page, sortBy, asc, searchTerm}});
    }
   
    listUserRoles() {
      return this.http.get(`${this.baseUrl}/list-user-roles`);
    }

  // Delete a user
  deleteUser(id: number) {
    return this.http.delete(`${this.baseUrl}/delete-user/${id}`);
  }

  // Update a user
  updateUser(updated: User) {
    return this.http.post(`${this.baseUrl}/update-user`, updated);
  }

}