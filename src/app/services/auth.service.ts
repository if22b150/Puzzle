import { Injectable } from '@angular/core';
import {BehaviorSubject, finalize, Observable, take} from "rxjs";
import {User} from "../models/user.model";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }

  private _user: BehaviorSubject<User>;

  public set user(user: User) {
    this._user.next(user);
  }

  public get user(): User {
    return this._user.value;
  }

  constructor(private http: HttpClient,
              private router: Router) {
    this._user = new BehaviorSubject<User>(null);
  }

  login(username: string, password: string): Observable<User> {
    return this.http.post<User>(environment.apiUrl + '/login', {username, password}, this.httpOptions);
  }

  signUp(username: string, password: string): Observable<User> {
    return this.http.post<User>(environment.apiUrl + '/users', {username, password}, this.httpOptions);
  }

  logout() {
    let httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': '' + this.user?.token})
    }
    this.http.delete<any>(environment.apiUrl + '/sessions', httpOptions)
      .pipe(
        take(1),
        finalize(() => {
          this._user.next(null);
          this.router.navigate(['']);
        })
      ).subscribe();
  }
}
