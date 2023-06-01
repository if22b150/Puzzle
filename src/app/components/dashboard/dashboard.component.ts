import { Component } from '@angular/core';
import {HighscoreService} from "../../services/highscore.service";
import {AuthService} from "../../services/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  constructor(private highscoreService: HighscoreService,
              private authService: AuthService,
              private snackBar: MatSnackBar,
              private router: Router) {
  }

  createHighscore() {
    let score: number = Math.floor(Math.random() * 100);
    this.highscoreService.create(score)
      .subscribe({
        next: (h) => {
          this.snackBar.open(`Highscore created! Score: ${score}`, null, {panelClass: ['bg-success', 'text-white'], duration: 1000} );
        },
        error: (e) => {
          this.snackBar.open(`${e.error.message}` , null, {panelClass: ['bg-danger', 'text-white'], duration: 1000} );
        }
      });
  }

  getHighscores() {
    this.highscoreService.get()
      .subscribe({
        next: (h) => {
          this.highscoreService.highscores = h;
          this.router.navigate(['highscores']);
        },
        error: (e) => {
          this.snackBar.open(`${e.error.message}` , null, {panelClass: ['bg-danger', 'text-white'], duration: 1000} );
        }
      })
  }

  logout() {
    this.authService.logout();
  }
}
