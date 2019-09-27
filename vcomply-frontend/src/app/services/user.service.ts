import { Injectable } from '@angular/core';
import {
  SignInResponse,
  SignInParameters,
  LogoutResponse,
} from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private httpOption = {
    withCredentials: true,
  };
  public url = 'http://localhost:4040/api/auth';
  constructor(private httpClient: HttpClient) {}
  public login(param: SignInParameters): Observable<SignInResponse> {
    return this.httpClient.post<SignInResponse>(
      this.url + '/login',
      param,
      this.httpOption,
    );
  }

  public checkLogin(): Observable<SignInResponse> {
    return this.httpClient.get<SignInResponse>(
      this.url + '/me',
      this.httpOption,
    );
  }
  public logout(): Observable<LogoutResponse> {
    return this.httpClient.get<LogoutResponse>(
      this.url + '/logout',
      this.httpOption,
    );
  }
}
