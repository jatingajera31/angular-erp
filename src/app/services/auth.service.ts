import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor() {}

  public isAuthenticated() {
    let userInfo = localStorage.getItem('access_token')
    if(userInfo) {
    	return true;
    } else {
    	return false;
    }
  }

  getAuthorizationToken() {
    return localStorage.getItem('access_token');
  }

  public logout() {
    localStorage.removeItem('access_token');
  }
}