import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {User} from "../models/user.model";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<User> {
    return new Observable((observer) => {
      if(username == "test@test.at" && password == "12345678")
        observer.next({username: "test@test.at", password: "12345678"});
      else
        observer.error();
    })
  }

  loginHttp(username: string, password: string) {
    this.http.post<{message: string}>('http://localhost:3000/login', {username, password}, this.httpOptions)
      .subscribe((responseData) => {
        console.log(responseData.message);
      })
  }
}
