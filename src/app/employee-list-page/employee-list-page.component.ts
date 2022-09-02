import { ChangeDetectorRef, Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { employeeStructure } from './employee-list.interfaces';
import { EmployeeServices } from '../APIServices/employee.services';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { response } from 'express';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { registerLocaleData } from '@angular/common';

@Component({
  selector: 'app-employee-list-page',
  templateUrl: './employee-list-page.component.html',
  styleUrls: ['./employee-list-page.component.scss']
})

export class EmployeeListPageComponent implements OnInit {

  displayedColumns: string[] = ['username','firstName','lastName','email','birthDate','basicSalary','status','group','description','LookDetail','EditThis','DeleteThis'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private empServices: EmployeeServices, private router: Router) {}

  ngOnInit(): void {
    this.getAllEmployee();
  }

  getAllEmployee(){
    this.empServices.list().subscribe({
      next: (res)=> {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) =>{
        alert("Error while fetching data Employee")
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  GotoEditData(row:any){
    this.router.navigateByUrl(`/EditData/${row.id}`)
  }
  
  DeleteData(id:number){
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
        this.empServices.delete(id).subscribe(response=>{
          this.getAllEmployee();
        },
        error=>{
          console.log(error);
        })
      }
    })

    
  }

}
