import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public error = '';

  constructor(private userService: UserService, private router: Router) {}

  public login(f: NgForm) {
    if (f.valid)
      this.userService.login(f.value).subscribe(
        data => {
          console.log(data);
          if (data.message.user) {
            this.router.navigateByUrl('/dashboard');
          } else {
            this.error = 'Invalid credentials!!';
          }
        },
        err => {
          if (err.status == 403) {
            this.error = 'Account is locked for 2 hrs';
          } else if (err.status == 401) {
            this.error = 'Email is not verified';
          } else this.error = 'Bad Request';

          console.log(err);
        },
      );
  }

  public signup() {
    this.router.navigateByUrl('/signup');
  }

  ngOnInit() {
    // this.userService
    //   .login({
    //     email: 'vaibhav.iitp@gmail.com',
    //     password: 'somerandompassword',
    //   })
    //   .subscribe(data => {
    //     console.log(data);
    //   });
  }
}
