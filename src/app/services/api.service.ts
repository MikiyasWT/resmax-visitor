import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpResponse ,HttpHeaders} from '@angular/common/http';
import { Login, User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})


export class ApiService {
  private token:any = localStorage.getItem('token');
  constructor(private http : HttpClient) { }
  
  getToken(){
    const header = new HttpHeaders({
      'Authorization': this.token
    });
    const requestOptions = { headers: header };

    return requestOptions;
  }

  login(data: FormData){
    const url = `${environment.apiUrl}/login.php`;
    return this.http.post<Login>(url,data);
  }

  getUsers(){
    
    const url = `${environment.apiUrl}/get_users.php`;
    return this.http.get<User>(url,this.getToken());    
  }

  deleteUser(id:number){
    const url = `${environment.apiUrl}/del_user.php/?`+id; 
    return this.http.delete<User>(url,this.getToken());
  }
  
  addUser(data : FormData){
    const url = `${environment.apiUrl}/reg_user.php`;   
    return this.http.post<User>(url,data,this.getToken());
    
  }

  putUser(data: any, id:number){
    const url = `${environment.apiUrl}/edit_user.php`+id;  
    return this.http.put<User>(url,data,this.getToken());
  }

   //Client Module

  addCustomer(data: FormData){
    const url = `${environment.apiUrl}/reg_customer.php`;
    return this.http.post<User>(url,data,this.getToken());  
  }

   getCustomers(){
    const url = `${environment.apiUrl}/get_customers.php`;
    return this.http.get<any>(url,this.getToken());      
   }

   editCustomer(data:FormData){
    const url = `${environment.apiUrl}/edit_customer.php`;
    return this.http.put<User>(url,data,this.getToken());
   }

 
   deleteCustomer(id:number){
    const url = `${environment.apiUrl}/del_customer.php/?`+id; 
    return this.http.delete<User>(url,this.getToken());
  }



  addSecurity(data:FormData){
    const url = `${environment.apiUrl}/reg_security.php`;
    return this.http.post<User>(url,this.getToken()); 
  }

  getSecurities(){
    const url = `${environment.apiUrl}/get_security.php`;
    return this.http.get<User>(url,this.getToken());      
   }

 editSecurity(data: FormData){
  const url = `${environment.apiUrl}/edit_customer.php`;
  return this.http.put<User>(url,data,this.getToken());
}

// deleteSecurity(id:number){
//     const url = `${environment.apiUrl}/del_security.php/?`+id; 
//     return this.http.delete<User>(url,this.getToken());
//   }

}
