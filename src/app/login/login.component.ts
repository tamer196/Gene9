import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth-service.service';
import { Login } from '../model/login';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  errors: any = {};

  constructor(private router : Router,private authService : AuthService){}

  validateEmail() {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.email) {
      this.errors.email = "Email shouldn't be empty";
    } else if (!regex.test(this.email)) {
      this.errors.email = 'Email should be a valid email';
    } else {
      this.errors.email = '';
    }
  }

  validatePassword() {
    if (!this.password) {
      this.errors.password = "Password shouldn't be empty";
    } else if (this.password.length < 6) {
      this.errors.password = "Password shouldn't be less than 6 characters";
    } else {
      this.errors.password = '';
    }
  }

  clearError(field: string) {
    this.errors[field] = '';
  }

  validateForm() {
    this.validateEmail();
    this.validatePassword();
    return !this.errors.fullName && !this.errors.email && !this.errors.password && !this.errors.confirmPassword;
  }

  activateNow() {
    if (this.validateForm()) {
      this.signIn();
    }
  }

  signIn() {
    var user : Login = {
      email : this.email,
      password : this.password
    } ;
    this.authService.login(user).subscribe(
      (response) => {
        setTimeout(() => {
          Swal.fire({
            title: "Success!",
            text: "User has been Logged In Successfuly",
            icon: "success"
          });
          this.router.navigate(['welcome']);
        }, 2000);
      },
      (error) => {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "User Could Not be Logged In, Please Check your Email and Password",
        });
      }
    );
  }

  signup(){
    this.router.navigate(['']);
  }

}
