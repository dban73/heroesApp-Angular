import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'pages-login-page',
  templateUrl: './login-page.component.html',
  styles: ``,
})
export class LoginPageComponent {
  constructor(private authService: AuthService, private router: Router) {}
  onLogin(): void {
    this.authService.login('a@a.com', '123456').subscribe((user) => {
      console.log('user', user);
      this.router.navigate(['/']);
    });
  }
}
