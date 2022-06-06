import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup,FormBuilder,Validator, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef ,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { inject } from '@angular/core/testing';
import {NgToastService} from 'ng-angular-popup'


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  status = ["Active","Inactive"];

  registerForm !: FormGroup;
  actionButton: string = "Save";
  actionType: string = "Add a user"

  constructor(private formBuilder: FormBuilder, 
              private api : ApiService, 
              private dialogRef : MatDialogRef<DialogComponent>,
              @Inject(MAT_DIALOG_DATA) public editdata: any,
              private toast: NgToastService){ 

  }

  ngOnInit(): void {
            
          this.registerForm = this.formBuilder.group({
              username:['',Validators.required],
              password:['',Validators.required],
              name:['',Validators.required],
              contact_number:['',Validators.required],
              email:['',Validators.required],
              address:['',Validators.required],
              created:['',Validators.required],
              role:['',Validators.required],
              status:['',Validators.required],
            });

      if(this.editdata){
        this.actionType = "Edit User information"
        this.actionButton = "Update";
        this.registerForm.controls['username'].setValue(this.editdata.username);
        this.registerForm.controls['password'].setValue(this.editdata.password);
        this.registerForm.controls['name'].setValue(this.editdata.name);
        this.registerForm.controls['contact_number'].setValue(this.editdata.contact_number);
        this.registerForm.controls['email'].setValue(this.editdata.email);
        this.registerForm.controls['address'].setValue(this.editdata.address);
        this.registerForm.controls['created'].setValue(this.editdata.created);
        this.registerForm.controls['role'].setValue(this.editdata.role);
        this.registerForm.controls['status'].setValue(this.editdata.status);
        
      }
  }

  addUser(){
    if(!this.editdata){
      if(this.registerForm.valid){
        console.log("added form inputs");
        console.log(this.registerForm.value);
        this.api.addUser(this.registerForm.value)
          .subscribe({
            next:() => {  
              console.log("successfull");                              
              this.toast.success({detail:"success",summary:"product added succesfully",duration:5000});
              this.registerForm.reset();
              this.dialogRef.close("save");
  
            },
            error: ()=>{
              console.log("error adding a user");
              this.toast.error({detail:"Error",summary:"error whie adding product",duration:5000});
              
            } 
            
          });
        
      }
    }
    else{
      this.updateUser();
    }  
    }
    

  updateUser(){
    this.api.putUser(this.registerForm.value, this.editdata.id)
    .subscribe({
      next:(res) => {
        this.toast.success({detail:"Success",summary:"product updated succesfully",duration:5000});
        this.registerForm.reset();
        this.dialogRef.close("update");
      },
      error:() => {
        this.toast.error({detail:"Error occured",summary:"error while updating product",duration:5000});

      }
    })
  }

}


 
