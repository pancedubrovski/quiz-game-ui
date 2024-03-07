import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CURRENT_USER } from '../models/constants';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const sessionExists = sessionStorage.getItem(CURRENT_USER);

    if (!sessionExists) {
      // Redirect to login page
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}