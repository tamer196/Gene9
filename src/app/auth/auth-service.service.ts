import { Injectable } from '@angular/core';
import { UserData } from '../model/user-data';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';
import { Register } from '../model/register';
import { Login } from '../model/login';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private jwtHelper = new JwtHelperService();
  private apiUrl = 'https://localhost:44369/api/Users/';
  private userDataSubject = new BehaviorSubject<UserData | null>(null);
  private tokenExpirationTimer: any;


  constructor(private http: HttpClient, private router: Router) { }

  registerUser(userData: Register) {
    return this.http.post<any>(`${this.apiUrl}Register`, userData).pipe(
      tap(response => this.handleAuthentication(response))
    );
  }

  login(userData: Login) {
    return this.http.post<any>(`${this.apiUrl}Login`, userData).pipe(
      tap(response => this.handleAuthentication(response))
    );
  }


  autoLogin() {
    const userDataString = sessionStorage.getItem('userData');
    if (userDataString) {
      const userData: UserData = JSON.parse(userDataString);
      this.userDataSubject.next(userData);
      const expirationDuration =
        new Date(userData.tokenExpiration).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
      if(!this.isTokenExpired){
        this.userDataSubject.next(null);
      }
      return true;
    }
    return false;
  }

  autoLogout(expirationDuration: number) {
    console.log('expirationDuration : ' + expirationDuration);
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }


  logout() {
    sessionStorage.removeItem('userData');
    this.userDataSubject.next(null);
    this.router.navigate(['/auth']);
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  isTokenExpired(): boolean {
    const userData = this.userDataSubject.value;
    return !userData || userData.tokenExpiration < new Date();
  }
  get userData() {
    return this.userDataSubject.asObservable();
  }

  getFullName(): any {
    const userData = this.userDataSubject.value;
    return userData ? userData.name : null;
  }

  private handleAuthentication(response: any) {
    if (response && response.token) {
      const decodedToken = this.jwtHelper.decodeToken(response.token);
      console.log(response.token);
      console.log(decodedToken);
      const expirationDate = new Date(decodedToken.exp * 1000);
      const formattedExpirationDate = expirationDate.toLocaleString();
      console.log(formattedExpirationDate);
      const userData: UserData = {
        name: decodedToken['Full Name'],
        email: decodedToken['Email'],
        tokenExpiration: new Date(decodedToken.exp * 1000),
        token: response.token
      };
      sessionStorage.setItem('userData', JSON.stringify(userData));
      this.userDataSubject.next(userData);
      const expirationDuration =
        new Date(userData.tokenExpiration).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }}
