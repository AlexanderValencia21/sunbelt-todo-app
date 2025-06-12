import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USER_KEY = 'auth_user';

  constructor(private router: Router) {}

  login(email: string, password: string): boolean {
    // Simulación de usuario estático
    if (email === 'admin@sunbelt.com' && password === '123456') {
      localStorage.setItem(this.USER_KEY, JSON.stringify({ email }));
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(this.USER_KEY);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.USER_KEY);
  }
}
