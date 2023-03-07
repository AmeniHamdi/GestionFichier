import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { user } from '../demo/domain/user.model';
import { UploadFileService } from '../services/upload-file.service';

@Component({
  selector: 'app-login',
  templateUrl: './app.login.component.html',
})
export class AppLoginComponent {

userInfo : user={password:"",email:""};

  email: string;
  password: string ;

submitted :boolean;
  constructor(
    private uploadFileService: UploadFileService
  ) { }

  signin(){
    console.log(this.password);
    console.log(this.email);



  }

  
  saveUser() {
    
    console.log(this.email);
    console.log(this.password);
  this.userInfo.password=this.password;
  this.userInfo.email= this.email;
  
   
   
    console.log(this.userInfo);
   

    this.uploadFileService.authService
          ("authenticate", this.userInfo).subscribe((response: any) => {
            console.log(response);
         });
        
      }
      
  
  

}
