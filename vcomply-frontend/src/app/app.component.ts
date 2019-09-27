import { Component } from '@angular/core';
import { UserService } from './services/user.service';
import { Router } from '@angular/router';
import { SignInResponse } from './models/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'vcomply-frontend';

  constructor(private userService: UserService, private router: Router) {}
  ngOnInit() {
    this.userService.checkLogin().subscribe(data => {
      console.log(data);
      if (data.message.status === 'already logged in') {
        this.router.navigateByUrl('/dashboard');
      } else {
        this.router.navigateByUrl('/login');
      }
    });
  }
}
