import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeServices } from '../APIServices/employee.services';
import { first, map, Observable, ReplaySubject, Subject } from 'rxjs';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-detail-data',
  templateUrl: './detail-data.component.html',
  styleUrls: ['./detail-data.component.scss']
})
export class DetailDataComponent implements OnInit {
  currentEmployee: any;
  constructor(private route: ActivatedRoute, private router: Router, private employeeService: EmployeeServices) { }

  ngOnInit(): void {
    this.getEmpById(this.route.snapshot.paramMap.get('id'));
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

}
