import { Component } from '@angular/core';
import { user } from 'src/app/demo/domain/user.model';
import { UploadFileService } from 'src/app/services/upload-file.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  userInfo : user={firstName:"",lastName:"",password:"",email:""};


  
  // email: string;
  // password: string ;


  constructor(
    private uploadFileService: UploadFileService
  ) { }

  // signin(){
  //   console.log(this.password);
  //   console.log(this.email);



  // }

  
  saveUser() {
    
    console.log(this.userInfo.email);
    console.log(this.userInfo.firstName);
    
    console.log(this.userInfo.lastName);
    console.log(this.userInfo.password);
  // this.userInfo.password=this.password;
  // this.userInfo.email= this.email;
  
   
   
    console.log(this.userInfo);
   

    this.uploadFileService.authService
          ("register", this.userInfo).subscribe((response: any) => {
            console.log(response);
         });
        
      }
      
  
  

}
