import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { user } from '../demo/domain/user.model';
import { UploadFileService } from '../services/upload-file.service';

@Component({
  selector: 'app-login',
  templateUrl: './app.login.component.html',
})
export class AppLoginComponent {



  LogInForm : FormGroup= new FormGroup({
    
   
    email:new FormControl ('', [Validators.required,Validators.email]),
    password: new FormControl ('',[Validators.required , Validators.minLength(8)])
  })

userInfo : user={password:"",email:""};



submitted :boolean;
  constructor(
    private uploadFileService: UploadFileService,
    private router: Router
  ) { }

  signin(){
    console.log(this.userInfo.password);
    console.log(this.userInfo.email);



  }

  
  saveUser() {
    
    console.log(this.userInfo.email);
    console.log(this.userInfo.password);
  this.userInfo.password=this.userInfo.password;
  this.userInfo.email= this.userInfo.email;
  
   
   
    console.log(this.userInfo);
   

    this.uploadFileService.authService
          ("authenticate", this.userInfo).subscribe((response: any) => {
            console.log(response);
            if (response.error)
            { this.router.navigate(['access']);
              return  }

            this.router.navigate(['']);
       //     error => console.error(error)
         });
        
      }
      
  
  

}
