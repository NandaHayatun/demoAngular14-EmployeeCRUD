import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { EmployeeServices } from '../APIServices/employee.services';
import { first } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit  {
  loginForm: FormGroup
  submitted = false;
  error = '';
  constructor(
    private router:Router, private formBuilder : FormBuilder, private http : HttpClient, 
    private route: ActivatedRoute, private employeeService: EmployeeServices
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username:['', Validators.required],
      password:['', Validators.required]
    })
  }
  
  get f(){
    return this.loginForm.controls;
  }
  
  login(){
    if(this.loginForm){
      this.processLogin();
      console.log('harusnya mau');
    }
  }
  
  private processLogin(){
    this.http.get<any>("http://localhost:3000/loginAccount").subscribe(res =>{
      const user = res.find((a:any)=>{
        return a.username === this.loginForm.value.username && a.password === this.loginForm.value.password
      });
      if(user){
        alert('Login Successfull');
        this.loginForm.reset;
        this.router.navigate(["/EmployeeList"])
      }else{
        alert("user not found")
      }
    }, err =>{
      alert("Something went wrong")
    })
  }

}
