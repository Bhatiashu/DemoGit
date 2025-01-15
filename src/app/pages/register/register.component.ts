import { Component, OnInit } from '@angular/core';
import {inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router,RouterModule } from '@angular/router';




@Component({
  selector: 'app-register',
  standalone:true,
  imports: [CommonModule,ReactiveFormsModule,RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'

})
export class RegisterComponent implements OnInit{
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router)

  registerForm !: FormGroup;

  ngOnInit(): void {
    this.registerForm=this.fb.group({
      firstname:['',Validators.required],
      lastname:['',Validators.required],
      mobile:['',Validators.compose([Validators.required, Validators.pattern(/^[6-9]\d{9}$/)])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password:['',Validators.required],
      age:['',Validators.required],
      fatherName:['',Validators.required],
      address:['',Validators.required]


    })
    
  }
  register(){
    this.authService.registerService(this.registerForm.value)
    .subscribe({
      next:(res)=>{
        alert("User Created!");
        this.router.navigate(['login']);
        this.registerForm.reset();
      },
      error:(error)=>{
        console.log(error);
        alert("Invalid data from User")
      }
    })

  }

}
