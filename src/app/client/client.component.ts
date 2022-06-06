import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { DialogComponent } from '../dialog/dialog.component';
import {ClientDialogComponent} from '../dialogs/client-dialog/client-dialog.component';
import { ApiService } from '../services/api.service';
import {NgToastService} from 'ng-angular-popup';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  
  //for table inside customer tab
  customerColumns : string[] =  ['id','name','contact_number','email','address','role','status','created','client_id','client_name','action'];
  customerdataSource !: MatTableDataSource<object>;  
  
  //for table inside security tab
  securityColumns : string[] =  ['id','name','contact_number','email','address','role','status','created','client_id','client_name','action'];
  securitydataSource !: MatTableDataSource<object>;
  
  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort ! : MatSort;

  constructor(private jwtHelper: JwtHelperService,
              private router : Router,
              private dialog: MatDialog,
              private api: ApiService,
              private toast: NgToastService
    ) { }

  ngOnInit(): void {
    const token = localStorage.getItem("token");
    const decodedToken = (this.jwtHelper.decodeToken(token || ''));
    const role = decodedToken.data.role;
    if(!(role ==='Super Admin' || role ==='Client')){
        this.router.navigate(['login'])
    } 

    this.getListOfCustomers();
    this.getListOfSecurity();
  }

  openDialog(role?:string) {
       
      this.dialog.open(ClientDialogComponent,{
      
          }).afterClosed().subscribe(
            value => {
              if(value === 'save'){
                   this.getListOfCustomers();
              }
            }
          );
        
   
  }


  getListOfCustomers(){
    this.api.getCustomers()
    .subscribe({
      next: (res:any)=>{
        this.customerdataSource = new MatTableDataSource(res.data);
        this.customerdataSource.paginator = this.paginator;
        this.customerdataSource.sort = this.sort;     
      },
      error: (err)=>{
        this.toast.error({detail:"Error occured",summary:"error while fetching users list",duration:5000});
      }
    });
  }

  getListOfSecurity(){
    this.api.getSecurities()
    .subscribe({
      next: (res:any)=>{
        this.securitydataSource = new MatTableDataSource(res.data);
        this.securitydataSource.paginator = this.paginator;
        this.securitydataSource.sort = this.sort;     
      },
      error: (err)=>{
        this.toast.error({detail:"Error occured",summary:"error while fetching securities list",duration:5000});
      }
    });
  }


  editCustomer(row : any){
    this.dialog.open(ClientDialogComponent, {
    data: row,
    
    }
    ).afterClosed()
    .subscribe(value => {
        if(value === 'update'){
          this.getListOfCustomers();
        }
    });
   }
   editSecurity(row : any){
    this.dialog.open(ClientDialogComponent, {
    data: row,
    
    }
    ).afterClosed()
    .subscribe(value => {
        if(value === 'update'){
          this.getListOfCustomers();
        }
    });
   }

  deleteCustomer(id:number){
    
   this.api.deleteCustomer(id)
   .subscribe({
      next:(res) => {
        this.toast.success({detail:"customer deleted successfully",summary:"Deleted",duration:5000});
        this.getListOfCustomers();
        console.log("deleted");
      },
      error:()=>{
        this.toast.error({detail:"unable to delete customer",summary:"failed to delete",duration:5000});
      }
   });
  }

  // deleteSecurity(id:number){
    
  //   this.api.deleteSecurity(id)
  //   .subscribe({
  //      next:(res) => {
  //        this.toast.success({detail:"security deleted successfully",summary:"Deleted",duration:5000});
  //        this.getListOfCustomers();
  //        console.log("deleted");
  //      },
  //      error:()=>{
  //        this.toast.error({detail:"unable to delete security",summary:"failed to delete",duration:5000});
  //      }
  //   });
  //  }

  applyFilter(event: Event, dataSource: MatTableDataSource<Object>){
    const filterValue = (event.target as HTMLInputElement).value;
    dataSource.filter = filterValue.trim().toLowerCase();
  
    if(dataSource.paginator){
      dataSource.paginator.firstPage();
    }
    }
}

