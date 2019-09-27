import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { countryCode } from '../../assets/country.json';
import { timezones } from '../../assets/timezones.json';
import { NgForm } from '@angular/forms';
import { UserService } from '../services/user.service.js';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  public countries = [];
  public timezone = [];
  public selectedCountry = 'Choose..';
  public selectedTimezone = 'Choose..';
  public error = '';
  constructor(private router: Router, private userService: UserService) {
    this.fetchCountries();
  }

  public login() {
    this.router.navigateByUrl('/login');
  }

  public getTimezone(country) {
    this.timezone = timezones[country];
  }
  private fetchCountries() {
    for (let cc in countryCode) {
      this.countries.push({ country: countryCode[cc], code: cc });
    }
  }
  public signup(f: NgForm) {
    if (f.valid)
      this.userService.signup(f.value).subscribe(
        data => {
          if (data.message.includes('successfull')) {
            this.router.navigateByUrl('/login');
          }
        },
        err => {
          this.error = 'email already exists';
        },
      );
  }
  ngOnInit() {}
}
