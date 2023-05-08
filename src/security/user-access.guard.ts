import { Injectable } from "@angular/core";
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
    UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";
import { UploadFileService } from "src/app/services/upload-file.service";

@Injectable({
    providedIn: "root",
})
export class UserAccessGuard implements CanActivate {
    constructor(
        private uploadService: UploadFileService,
        private router: Router
    ) {}

    canActivate(): boolean {
        //only logged users
        if (!this.uploadService.isLoggedIn()) {
            this.router.navigateByUrl("/");
            return false;
        }
        return true;
    }
}

@Injectable({
    providedIn: "root",
})
export class AdminAccessGuard implements CanActivate {
    constructor(
        private uploadService: UploadFileService,
        private router: Router
    ) {}

    canActivate(): boolean {
        //only logged users
        if (!this.uploadService.isAdmin()) {
            this.router.navigateByUrl("/");
            return false;
        }
        return true;
    }
}