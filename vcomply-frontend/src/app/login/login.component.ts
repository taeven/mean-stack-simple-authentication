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
  constructor(private userService: UserService, private router: Router) {}

  public login(f: NgForm) {
    console.log(f.value);
    this.userService.login(f.value).subscribe(data => {
      console.log(data);
      if (data.message.user) {
        console.log('here');
        this.router.navigateByUrl('/dashboard');
      }
    });
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
