import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  login() {
    if (this.auth.login(this.email, this.password)) {
      this.snackBar.open('Inicio de sesión exitoso', 'Cerrar', { duration: 2000 });
      this.router.navigateByUrl('/tasks', { replaceUrl: true });
    } else {
      this.error = 'Credenciales inválidas';
      this.snackBar.open(this.error, 'Cerrar', { duration: 3000 });
    }
  }
}
