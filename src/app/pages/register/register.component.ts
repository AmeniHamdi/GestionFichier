import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { user } from "src/app/demo/domain/user.model";
import { UploadFileService } from "src/app/services/upload-file.service";

@Component({
    selector: "app-register",
    templateUrl: "./register.component.html",
    styleUrls: ["./register.component.scss"],
    providers: [MessageService],
})
export class RegisterComponent {
    SignUpForm: FormGroup = new FormGroup({
        firstName: new FormControl("", Validators.required),
        lastName: new FormControl("", Validators.required),
        email: new FormControl("", [Validators.required, Validators.email]),
        password: new FormControl("", [
            Validators.required,
            Validators.minLength(8),
        ]),
    });
    userInfo: user = { firstName: "", lastName: "", password: "", email: "" };

    // email: string;
    // password: string ;

    constructor(
        private uploadFileService: UploadFileService,
        private router: Router,
        private messageService: MessageService
    ) {}

    // signin(){
    //   console.log(this.password);
    //   console.log(this.email);

    // }

    saveUser() {
        if (this.SignUpForm.valid) {
            this.messageService.add({
                severity: "success",
                summary: "Success",
                detail: `Registered! Verify your email.`,
            });
        }

        console.log(this.userInfo.email);
        console.log(this.userInfo.firstName);

        console.log(this.userInfo.lastName);
        console.log(this.userInfo.password);
        // this.userInfo.password=this.password;
        // this.userInfo.email= this.email;

        console.log(this.userInfo);

        this.uploadFileService
            .authService("register", this.userInfo)
            .subscribe((response: any) => {
                console.log(response);
                this.router.navigate(['/']);
            });
    }
}
