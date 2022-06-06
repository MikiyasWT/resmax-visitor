import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-tool-bar',
  templateUrl: './header-tool-bar.component.html',
  styleUrls: ['./header-tool-bar.component.css']
})
export class HeaderToolBarComponent implements OnInit {

  constructor(private router : Router) { }

  ngOnInit(): void {
  }

  
  logOut(){
    localStorage.clear()
    this.router.navigate(["login"])

  
  }
}
