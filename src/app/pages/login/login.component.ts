import { Component, Inject, inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { DataService } from '../data.service';
import { JwtHelperService } from '@auth0/angular-jwt';


@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router)
  dataService = inject(DataService);
  loginform !: FormGroup;
  isRedirecting = false;

  
  private jwtHelper = new JwtHelperService(); // Initialize JwtHelperService
  data: any = {};

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  


    
  ngOnInit(): void {
      this.loginform=this.fb.group({
        email: ['', Validators.compose([Validators.required, Validators.email])],
        password:['',Validators.required]
  
      })
      if (isPlatformBrowser(this.platformId)){

      this.data = this.dataService.getUserData();
      }else{
        
      }

    if (this.data.token && !this.jwtHelper.isTokenExpired(this.data.token)) {
      this.isRedirecting = true;
      this.router.navigate(['/home']);
    }else {

    }


      
    }
    login(){
      this.authService.loginService(this.loginform.value)
      .subscribe({
        next:(res:any)=>{
          console.log(res);
          
          this.dataService.saveUserData(res);


          this.router.navigate(['home'])

          //alert("Login is Success!");

          // if (!this.loginform.value.email && !this.loginform.value.password){
          //   alert("email or passward incorrect");
          // }
          this.loginform.reset();
          
  
        },
        error:(err)=>{
          console.log(err);
          alert("Invalid email or password")
        }
      })
    }
  }