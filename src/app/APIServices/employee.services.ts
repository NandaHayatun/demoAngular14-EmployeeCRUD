import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, map, Observable, Subject, tap } from "rxjs";
import { catchError, throwError } from "rxjs";
// import { employeeStructure } from "../employee-list-page/employee-list.interfaces";

@Injectable({
    providedIn: 'root'
})

export class EmployeeServices{
    MyAPIurl = 'http://localhost:3000/employee/'; //for crud and show data
    // MyLoginAPIurl = 'http://localhost:3000/loginAccount'; //for login auth
    // private userSubject: BehaviorSubject<User>;
    // private user: Observable<User>;
    headers = new HttpHeaders().set('Content-Type','application/json');
    constructor(private httpClient: HttpClient, private router: Router){
    }

    list(): Observable<any>{
        return this.httpClient.get(this.MyAPIurl).pipe(
            catchError(this.handleError)
        );
    }

    getItem(id: any): Observable<any>{
        return this.httpClient.get(`${this.MyAPIurl}/${id}`).pipe(
            catchError(this.handleError)
        );
    }

    create(data:any){
        return this.httpClient.post<any>(this.MyAPIurl,data);
    }

    update(id: any, data:any): Observable <any>{
        return this.httpClient.put(`${this.MyAPIurl}/${id}`,data).pipe(
            catchError(this.handleError)
        );
    }

    delete(id:any): Observable<any>{
        return this.httpClient.delete(`${this.MyAPIurl}/${id}`).pipe(
            catchError(this.handleError)
        );
    }

    handleError(error: HttpErrorResponse){
        if(error.error instanceof ErrorEvent){
            console.error('An error occured:', error.error.message);
        }else{
            console.error(
                `Backend returned code ${error.status},`+ `body was: ${error.error}`
            );
        }
        return throwError(
            'Something bad happened; please try again later'
        );
    }

}