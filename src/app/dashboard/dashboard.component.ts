import { Component, OnInit, ViewChild } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { MatToolbar } from '@angular/material/toolbar';
//import { DialogComponent} from '../dialog/dialog.component';
import { ApiService } from '../services/api.service';
import {MatTableDataSource, MatTableModule} from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { ThisReceiver } from '@angular/compiler';
import { HttpResponse } from '@angular/common/http';
import {NgToastService} from 'ng-angular-popup';
import { Router } from '@angular/router';
import { DialogComponent } from '../dialog/dialog.component';
import { JwtHelperService } from '@auth0/angular-jwt';

//import { ClientRequest } from 'http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  title = 'Resmax_VMS';
  
  privilegeList!: string[];
  //AdminRole: string[]=['Admin','Client','Customer','Visitor','Security'];
  //ClientRole: string[]=['Customer','Visitor','Security'];
  //CustomerRole: string[]=['Visitor','Security'];
  //VisitorRole: string[]=['Super Admin','Admin','Client','Customer','Visitor','Security'];
  //SecurityRole: string[]=['Visitor'];
  

  displayedColumns : string[] =  ['id','username','name','contact_number','email','address','role','status','action'];
  dataSource !: MatTableDataSource<object>;

  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort ! : MatSort;

  constructor(private dialog : MatDialog, 
              private api: ApiService, 
              public toast:NgToastService,
              private router: Router,
              private jwtHelper: JwtHelperService
              ){

  }
  ngOnInit(): void {
    console.log();
    if(this.jwtHelper.isTokenExpired()){
        this.router.navigate(["login"])
    }
    this.getListOfUsers();

    // const token = localStorage.getItem('token');
    //      const decodedToken = (this.jwtHelper.decodeToken(token || ''));
    //      const role = decodedToken.data.role;

    // switch(role){
    //   case 'Super Admin': localStorage.setItem("role","Super Admin");
    //                       this.privilegeList=['Super Admin','Admin','Client','Customer','Visitor','Security'];
    //                       this.getListOfUsers();
    //                       break;
    //   case 'Admin': localStorage.setItem("role","Admin");
    //                   this.privilegeList=['Admin','Client','Customer','Visitor','Security'];
    //                   this.getListOfUsers();               
    //                   break;                
    //   case 'Client': localStorage.setItem("role","Client");
    //                   this.privilegeList=['Customer','Visitor','Security'];
    //                   this.router.navigate(['login'])
    //                   break; 
    //   case 'Customer': localStorage.setItem("role","Customer");
    //                  this.privilegeList=['Visitor','Security'];
    //                   this.router.navigate(['login'])
    //                   break;                              
    //   case 'Security': localStorage.setItem("role","Security");
    //                   this.privilegeList=['Visitor'];
    //                   this.router.navigate(['login'])
    //                   break;
    //   case 'Visitor': localStorage.setItem("role","Visitor");
    //                   this.router.navigate(['login'])
    //                   break;
                      
    // }
    
    
  }

  
  openDialog() {
    this.dialog.open(DialogComponent,{
      
    }).afterClosed().subscribe(
      value => {
        if(value === 'save'){
             this.getListOfUsers();
        }
      }
    );
  }

  getListOfUsers(){
    this.api.getUsers()
    .subscribe({
      next: (res:any)=>{
        this.dataSource = new MatTableDataSource(res.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
         
         

            
         
      },
      error: (err)=>{
        this.toast.error({detail:"Error occured",summary:"error while fetching users list",duration:5000});
      }
    });
  }

  editUser(row : any){
    this.dialog.open(DialogComponent, {
    data: row,
    
    }
    ).afterClosed()
    .subscribe(value => {
        if(value === 'update'){
          this.getListOfUsers();
        }
    });
   }

  deleteUser(id:number){
    
   this.api.deleteUser(id)
   .subscribe({
      next:(res) => {
        this.toast.success({detail:"item deleted successfully",summary:"Deleted",duration:5000});
        this.getListOfUsers();
        console.log("deleted");
      },
      error:()=>{
        this.toast.error({detail:"unable to delete product",summary:"failed to delete",duration:5000});
      }
   });
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  
    if(this.dataSource.paginator){
      this.dataSource.paginator.firstPage();
    }
    }

  logOut(){
    localStorage.clear()
    this.router.navigate(["login"])

  
  }

}

