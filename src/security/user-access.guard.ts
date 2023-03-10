import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UploadFileService } from 'src/app/services/upload-file.service';

@Injectable({
  providedIn: 'root'
})

export class UserAccessGuard implements CanActivate {
  constructor(private authService: UploadFileService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    //only logged users
    return null ;
     this.authService.isLoggedIn();
  }
  
}
