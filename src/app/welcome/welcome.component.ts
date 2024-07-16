import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  name : any ;
  constructor(private authService : AuthService,private router : Router){}
  ngOnInit(): void {
    this.name = this.authService.getFullName();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }

}
