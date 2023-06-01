import {Component, OnInit} from '@angular/core';
import {HighscoreService} from "../../services/highscore.service";

@Component({
  selector: 'app-highscores',
  templateUrl: './highscores.component.html',
  styleUrls: ['./highscores.component.scss']
})
export class HighscoresComponent implements OnInit{
  displayedColumns: string[] = ['username', 'score'];

  constructor(public highscoreService: HighscoreService) {
  }

  ngOnInit(): void {
    this.highscoreService.highscores$.subscribe({
      next: (h) => {

      }
    })
  }

}
