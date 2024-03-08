import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CURRENT_USER, ROOM_NAME } from '../../models/constants';
import { UserService } from '../../services/user.service';
import { LogoutModel } from '../../models/logoutModel';
import { GameComponent } from '../game/game.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  public username!: string;
  public bestScore = 0;

  @ViewChild(GameComponent) gameComponent!: GameComponent;

  constructor(protected userService: UserService, private router: Router,private activeRoute: ActivatedRoute) {

  }
  ngOnInit(): void {
    this.username = sessionStorage.getItem(CURRENT_USER)!;

    this.activeRoute.queryParams.subscribe(params => {
      this.bestScore = params['bestScore']
    });
  }
  public logout() {
    const roomName = sessionStorage.getItem(ROOM_NAME)!;
    const body: LogoutModel = {
      username: this.username,
      roomName: roomName,
      score: this.gameComponent.score
    };
    this.userService.logout(body).subscribe(() => {
      sessionStorage.removeItem(this.username);
      sessionStorage.removeItem(roomName);
      this.router.navigate(['/login']);
    });
  }
}
