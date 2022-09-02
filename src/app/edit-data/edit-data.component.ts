import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupName, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first, map, Observable, ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { EmployeeServices } from '../APIServices/employee.services';
import Swal from 'sweetalert2';
import { GROUPS,Group } from '../APIServices/grouplist';
import { MatSelect } from '@angular/material/select';

interface GroupName{
  id: string,
  username: string,
  firstName: string,
  lastName: string,
  email: string,
  birthDate: string,
  basicSalary: number,
  status: string,
  group: string,
  description: string
}

@Component({
  selector: 'app-edit-data',
  templateUrl: './edit-data.component.html',
  styleUrls: ['./edit-data.component.scss']
})

export class EditDataComponent implements OnInit {
  currentEmployee: any;
  editEmpForm: FormGroup;
  id:string;
  submitted = false;
  isEditEmp:boolean;
  selected: any;
  filtered: any;
  selectedGroup: string;
  // options: any[] = [{value:'FrontEnd'},{value:'Backend'},{value:'IT Infrastructure'},{value:'DB Admin'},{value:'System Implementor'},
  // {value:'QA Engineer'},{value:'Project Manager'},{value:'Flutter Developer'},{value:'Graphic Designer'},{value:'IT Auditor'}];
  
  // protected groupNames: GroupName[] = [{value:'FrontEnd'},{value:'Backend'},{value:'IT Infrastructure'},{value:'DB Admin'},{value:'System Implementor'},
  // {value:'QA Engineer'},{value:'Project Manager'},{value:'Flutter Developer'},{value:'Graphic Designer'},{value:'IT Auditor'}];
  
  // onChange(){
  //   this.filtered = this.options.filter(t=> t.value == this.selected);
  // }
  
  protected groups: Group[] = GROUPS;
  group: FormControl = new FormControl();
  public groupFilterControl: FormControl = new FormControl();
  public options: ReplaySubject<Group[]> = new ReplaySubject(1);
  @ViewChild('grouplist') grouplist: MatSelect;
  protected _onDestroy = new Subject<void>();

  // options={
  //   "groupName" : ['FrontEnd','Backend','IT Infrastructure','DB Admin','System Implementor','QA Engineer','Project Manager','Flutter Developer','Graphic Designer','IT Auditor']
  // }
  // public options: ['FrontEnd','Backend','IT Infrastructure','DB Admin','System Implementor','QA Engineer','Project Manager','Flutter Developer','Graphic Designer','IT Auditor'];
  // public selectedGroup = this.options[1];
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, 
    private router: Router, private employeeService: EmployeeServices) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.getEmpById(this.route.snapshot.paramMap.get('id'));
    this.editEmpForm = this.formBuilder.group({
      username: ['', Validators.required, Validators.minLength(5), Validators.maxLength(15)],
      firstName: ['', Validators.required],
      lastName: ['',Validators.required],
      email: ['', Validators.required, Validators.email],
      birthDate: ['', Validators.required],
      basicSalary: ['', Validators.required],
      status: ['', Validators.required],
      group: ['', Validators.required],
      description: ['', Validators.required]
    });

    if(this.isEditEmp){
      this.employeeService.getItem(this.id).pipe(first()).subscribe(x => this.editEmpForm.patchValue(x));
    }
    
    this.group.setValue(this.groups[10]);
    this.options.next(this.groups.slice());
    this.groupFilterControl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(()=>{
      this.filterGroup();
    })
  }

  ngAfterViewInit() {
    this.setInitialValue();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  protected setInitialValue(){
    this.options.pipe(take(1), takeUntil(this._onDestroy)).subscribe(()=>{
      this.grouplist.compareWith = (a:Group, b:Group)=> a && b && a.id === b.id;
    })
  }

  protected filterGroup() {
    if (!this.groups) {
      return;
    }
    // get the search keyword
    let search = this.groupFilterControl.value;
    if (!search) {
      this.options.next(this.groups.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.options.next(
      this.groups.filter(group => group.name.toLowerCase().indexOf(search) > -1)
    );
  }

  getEmpById(id: string | null): void {
    this.employeeService.getItem(id)
      .subscribe(
        (employee: null) => {
          this.currentEmployee = employee;
          console.log(employee);
        },
        (error: any) => {
          console.log(error);
        });
  }

  processEdit(){
    this.submitted = true;
    if(this.editEmpForm.invalid){
      return;
    }

    if(this.editEmpForm){
      this.updateDataEmp();
    }
  }

  private updateDataEmp(){
    this.employeeService.update(this.id, this.editEmpForm.value).pipe(first()).subscribe({
      next: () => {
        Swal.fire('Congratulation','Your Employee Data changed successfully!', 'success')
        this.router.navigate(['/EmployeeList'], { relativeTo: this.route});
      },error: error => {
        Swal.fire({
          icon: 'error',
          title: 'Oops..',
          text: 'Something went wrong!'
        })
      }
    })
  }

}
