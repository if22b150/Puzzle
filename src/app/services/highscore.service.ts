import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {AuthService} from "./auth.service";
import {BehaviorSubject, Observable} from "rxjs";
import {Highscore} from "../models/highscore.model";
import {User} from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class HighscoreService {
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  }

  private _highscores: BehaviorSubject<Highscore[]>;

  public set highscores(highscores: Highscore[]) {
    this._highscores.next(highscores);
  }

  public get highscores$(): Observable<Highscore[]> {
    return this._highscores.asObservable();
  }

  constructor(private http: HttpClient,
              private authService: AuthService) {
    this._highscores = new BehaviorSubject<Highscore[]>(null);
  }

  create(score:number): Observable<Highscore> {
    let httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': '' + this.authService.user?.token})
    }
    return this.http.post<Highscore>(environment.apiUrl + '/highscores', {score}, httpOptions);
  }
  get(): Observable<Highscore[]> {
    let httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'Authorization': '' + this.authService.user?.token})
    }
    return this.http.get<Highscore[]>(environment.apiUrl + '/highscores', httpOptions);
  }
}
