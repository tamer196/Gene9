import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth-service.service';
import { Register } from '../model/register';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {

  fullName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errors: any = {};


  constructor(private router : Router,private authService : AuthService){}

  validateFullName() {
    const regex = /^[a-zA-Z\s]+$/;
    if (!this.fullName) {
      this.errors.fullName = "Full Name shouldn't be empty";
    } else if (!regex.test(this.fullName)) {
      this.errors.fullName = "Full Name shouldn't have special characters";
    } else {
      this.errors.fullName = '';
    }
  }

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

  validateConfirmPassword() {
    if (!this.confirmPassword) {
      this.errors.confirmPassword = "Confirm Password shouldn't be empty";
    } else if (this.confirmPassword.length < 6) {
      this.errors.confirmPassword = "Confirm Password shouldn't be less than 6 characters";
    } else if (this.confirmPassword !== this.password) {
      this.errors.confirmPassword = 'Confirm Password should be equal to Password';
    } else {
      this.errors.confirmPassword = '';
    }
  }

  clearError(field: string) {
    this.errors[field] = '';
  }

  validateForm() {
    this.validateFullName();
    this.validateEmail();
    this.validatePassword();
    this.validateConfirmPassword();
    return !this.errors.fullName && !this.errors.email && !this.errors.password && !this.errors.confirmPassword;
  }

  activateNow() {
    if (this.validateForm()) {
      this.signUp();
    }
  }

  signUp() {
    var user : Register = {
      fullName : this.fullName,
      email : this.email,
      password : this.password
    } ;
    this.authService.registerUser(user).subscribe(
      (response) => {
        setTimeout(() => {
          Swal.fire({
            title: "Success!",
            text: "User has been Registered",
            icon: "success"
          });
          this.router.navigate(['welcome']);
        }, 2000);
      },
      (error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "User Could Not be Registered : " + error.error.message,
        });
      }
    );
  }

  signin(){
    this.router.navigate(['login']);
  }

}
