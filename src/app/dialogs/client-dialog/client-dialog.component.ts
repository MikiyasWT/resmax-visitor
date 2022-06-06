import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup,FormBuilder,Validator, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MatDialogRef ,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { inject } from '@angular/core/testing';
import {NgToastService} from 'ng-angular-popup'


@Component({
  selector: 'app-client-dialog',
  templateUrl: './client-dialog.component.html',
  styleUrls: ['../dialogGlobalStyle.css']
})
export class ClientDialogComponent implements OnInit {
  status = ["Active","Inactive"];

  registerForm !: FormGroup;
  actionButton: string = "save";
  actionType: string = "Add"
  isSecurity:boolean = false;
  constructor(private formBuilder: FormBuilder, 
              private api : ApiService, 
              private dialogRef : MatDialogRef<ClientDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public editdata: any,
              private toast: NgToastService)
  {

  }

  ngOnInit(): void {
            
          this.registerForm = this.formBuilder.group({
              username:['',Validators.required],
              id:['',Validators.required],
              name:['',Validators.required],
              contact_number:['',Validators.required],
              email:['',Validators.required],
              address:['',Validators.required],
              created:['',Validators.required],
              role:['',Validators.required],
              status:['',Validators.required],
              
            });

      if(this.editdata){
        this.actionType = "Edit customer information"
        this.actionButton = "Update";
        this.registerForm.controls['username'].setValue(this.editdata.username);
        this.registerForm.controls['id'].setValue(this.editdata.id);
        this.registerForm.controls['name'].setValue(this.editdata.name);
        this.registerForm.controls['contact_number'].setValue(this.editdata.contact_number);
        this.registerForm.controls['email'].setValue(this.editdata.email);
        this.registerForm.controls['address'].setValue(this.editdata.address);
        this.registerForm.controls['created'].setValue(this.editdata.created);
        this.registerForm.controls['role'].setValue(this.editdata.role);
        this.registerForm.controls['status'].setValue(this.editdata.status);
        
      }
  }

  addCustomer(){
    
      if(this.registerForm.valid){
        console.log("added form inputs");
        console.log(this.registerForm.value);
        this.api.addCustomer(this.registerForm.value)
          .subscribe({
            next:(res) => {  
              console.log("successfull");                              
              this.toast.success({detail:"success",summary:"customer added succesfully",duration:5000});
              this.registerForm.reset();
              this.dialogRef.close("save");
  
            },
            error: ()=>{
              console.log("error adding a user");
              this.toast.error({detail:"Error",summary:"error whie adding customer",duration:5000});
              
            } 
            
          });
        
      }
    
    else{
      this.editCustomer();
    }  
    }
    

  editCustomer(){
    this.api.editCustomer(this.registerForm.value)
    .subscribe({
      next:(res) => {
        this.toast.success({detail:"Success",summary:"customer updated succesfully",duration:5000});
        this.registerForm.reset();
        this.dialogRef.close("update");
      },
      error:() => {
        this.toast.error({detail:"Error occured",summary:"error while updating customer",duration:5000});

      }
    })
  }

}


 

