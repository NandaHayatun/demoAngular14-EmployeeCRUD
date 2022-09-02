import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { response } from 'express';
import { EmployeeServices } from '../APIServices/employee.services';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { MatSelect } from '@angular/material/select';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map,startWith} from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

export class Ngroup{
  constructor(public name: string){}
}
@Component({
  selector: 'app-addnew',
  templateUrl: './addnew.component.html',
  styleUrls: ['./addnew.component.scss']
})
export class AddnewComponent implements OnInit {
  group = new FormControl(undefined, [Validators.required, this.requireMatch.bind(this)]);
  options: string[] = ['FrontEnd','Backend','IT Infrastructure','DB Admin','System Implementor','QA Engineer','Project Manager','Flutter Developer','Graphic Designer','IT Auditor'];
  filteredOptions:Observable<string[]>;
  currentDate: any = new Date();
  addEmpForm: FormGroup;
  selected!:string;

  constructor(private employeeService: EmployeeServices, private formBuilder: FormBuilder, 
    private route: ActivatedRoute, private router: Router) { 
  }

  ngOnInit():void {
    this.filteredOptions = this.group.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );

    this.addEmpForm = this.formBuilder.group({
      username: ['', Validators.required, Validators.minLength(5), Validators.maxLength(15)],
      firstName: ['', Validators.required],
      lastName: ['',Validators.required],
      email: ['', Validators.required, Validators.email],
      birthDate: ['', Validators.required],
      basicSalary: ['', Validators.required],
      status: ['', Validators.required],
      group: ['', Validators.required],
      description: ['', Validators.required]
    })
  }

  get f(){
    return this.addEmpForm.controls;
  }

  private requireMatch(control: FormControl): ValidationErrors | null{
    const selection: any = control.value;
    if(this.options && this.options.indexOf(selection)<0){
      return {requireMatch:true};
    }
    return null;
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));

  }

  processAdd(){
    // console.log(this.addEmpForm.value);
    // console.log(this.groupname.value);
    Swal.fire({
      title: 'Are you sure?',
      text: "Please Check your Data before saving",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Add this Data!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'New Employee Data has been added!',
          'success'
        )
        this.employeeService.create(this.addEmpForm.value).subscribe({
          next: (res) => {
            alert("Employee Added Successfully!")
            this.router.navigate(['/EmployeeList'], { relativeTo: this.route});
          }, error:()=>{
            alert("Error while adding new Employee")
          }
        })
      }
    })

     
  }
}
