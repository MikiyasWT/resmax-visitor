import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { NgToastService } from 'ng-angular-popup';
import { environment } from 'src/environments/environment';
import { ApiService } from '../services/api.service';
import { AuthService } from '../shared/auth.service';
  
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  public loginform!: FormGroup;
  public loginStatus: boolean = true; 
  
  constructor(public formbuilder: FormBuilder,
              private api: ApiService, 
              private router: Router,
              private toast: NgToastService,
              private auth: AuthService,
              private jwtHelper: JwtHelperService            
              ) { }

  ngOnInit(): void {

    // if(this.auth.isLoggedIn()){
    //   this.router.navigate(['dashboard'])   
    //   }

    this.loginform = this.formbuilder.group({
      contact_number:[""],   
      password:[""]
    });
  }
 
  
  login(){
    const url = `${environment.apiUrl}/login.php`;
    this.api.login(this.loginform.value)
    .subscribe({
      next:(res) => {
            //console.log(res.token);
            const token = res.token;
            //const token = localStorage.getItem('token');
            const decodedToken = (this.jwtHelper.decodeToken(token || ''));
            const role = decodedToken.data.role;

            if(token){
              localStorage.setItem("token",token);
              
              this.toast.success({detail:"success message",summary:"login successful",duration:5000});
              this.loginform.reset();
              //this.router.navigate(['dashboard']);

              switch(role){
                case 'Super Admin': this.router.navigate(['dashboard']);
                                     break;
                case 'Admin': this.router.navigate(['dashboard']);
                                     break;                    
                case 'Client': this.router.navigate(['client']);
                                     break;                 
                case 'Customer': this.router.navigate(['customer']);
                                     break;            
                case 'Security': this.router.navigate(['security']);
                                     break;                                   
              }

            }
            else {
              this.loginStatus = false;
              this.loginform.reset();
              this.toast.error({detail:"login failed",summary:"incorrect email & password",duration:5000});
            }
      },
      error:(err) =>{
        console.log(err);
        this.loginform.reset();
        this.toast.error({detail:"Error occured",summary:"an error occure while attempting to login",duration:5000});
      }
    });

    
  }
}






