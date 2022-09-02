import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeListPageComponent } from './employee-list-page/employee-list-page.component';
import { LoginComponent } from './login/login.component';
import { AddnewComponent } from './addnew/addnew.component';
import { EditDataComponent } from './edit-data/edit-data.component';
import { DetailDataComponent } from './detail-data/detail-data.component';

const empModule = () => import('./app.module').then(x => x.AppModule);
const routes: Routes = [{
  path:'',
  component:LoginComponent
},{
  path: 'EmployeeList',
  component:EmployeeListPageComponent
},{
  path: 'AddNew',
  component:AddnewComponent
},{
  path: 'EditData/:id',
  component:EditDataComponent
},{
  path: 'DetailData/:id',
  component:DetailDataComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
